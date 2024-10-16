import type * as PlotlyType from "plotly.js";
import { useEffect, useState } from "react";
import { IFileData, IFileInfo } from "../utils/reader";
import EMGPlot from "./EMGPlot";
import File from "./Export";
import Information from "./Infomation";
import Record from "./Record";
import { Switch } from '@headlessui/react';
import updateFileStatus from "../api/updateRecordStatus.api";
import getRecordByWaveNo from "../api/getRecordByWaveNo";

interface ToggleSwitchProps {
  label: string;
  fileId?: string
}

export type Mark = PlotlyType.Data & {
  key: string;
};

export type Record = {
  id: string;
  fileId: string;
  start: number;
  end: number;
  labelName: string;
  waveNo: number;
  note: string;
  _markKey: string;
  _action: "create" | "update" | "delete" | null;
  _isPlotDataChanged: boolean;
  _isBeingEdited?: boolean;
}

export type DataRange = {
  x: number[];
  y: number[];
  fs: number;
};

type IProps = {
  fileId?: string;
  fileInfo: IFileInfo;
  fileData: IFileData;
  className?: string;
};

export default function Main({ fileData, fileInfo, fileId }: IProps) {
  const [waveNo, setWaveNo] = useState(0);
  const [dataRange, setDataRange] = useState<DataRange>({
    x: [],
    y: [],
    fs: 0,
  });
  const [marks, setMarks] = useState<Mark[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [waveData, setWaveData] = useState<PlotlyType.Data | null>(null);

  useEffect(() => {
    if (fileData.waves.length === 0) {
      // reset all
      setWaveNo(0);
      setDataRange({ x: [], y: [], fs: 0 });
      setMarks([]);
    } else {
      setDataRange({
        x:
          fileData.waves[waveNo].x ||
          Array.from(Array(fileData.waves[waveNo].y.length).keys()),
        y: fileData.waves[waveNo].y,
        fs: fileData.waves[waveNo].fs,
      });
      setMarks([]);
    }
  }, [waveNo]);

  useEffect(() => {
    if (fileData.waves.length === 0) return;
    setWaveData({
      x: dataRange.x.map((v) => v / dataRange.fs),
      y: dataRange.y,
      type: "scatter",
      mode: "lines",
      hoverinfo: "none",
      line: {
        width: 1,
      },
    });
  }, [dataRange]);

  useEffect(() => {
    if (records.some((item) => item._isPlotDataChanged) || records.length === 0) {
      const newMarks: Mark[] = []

      records.forEach((record) => {

        if (!record._isPlotDataChanged) {
          const unchanged = marks.find((mark) => mark.key === record._markKey)
          if (unchanged) {
            newMarks.push(unchanged)
          }
        }

        if (record._isPlotDataChanged && record._action !== "delete") {
          newMarks.push({
            x: dataRange.x.slice(record.start, record.end).map((v) => v / dataRange.fs),
            y: dataRange.y.slice(record.start, record.end),
            type: "scatter",
            mode: "lines",
            hoverinfo: "skip",
            line: {
              width: 1,
              color: record._isBeingEdited ? "orange" : "red",
            },
            key: record._markKey,
          })
        }
      })

      setMarks(newMarks)
    }


  }, [records]);

  useEffect(() => {
    if (!fileId) {
      return;
    }

    const fetchRecords = async () => {
      try {
        const data = await getRecordByWaveNo(fileId, waveNo); // Gọi hàm với fileId và waveNo
        setRecords(data.records.map((record) => ({
          id: record.id,
          fileId: record.fileId,
          start: record.start,
          end: record.end,
          labelName: record.label_name,
          waveNo: record.wave_no,
          note: record.note,
          _markKey: record.id,
          _action: null,
          _isPlotDataChanged: true,
        })));
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords(); // Gọi hàm lấy dữ liệu
  }, [fileId, waveNo]); // Theo dõi cả fileId và waveNo


  const onPlotSelected = (eventData: PlotlyType.PlotSelectionEvent) => {
    if (eventData && eventData.range) {
      console.log(eventData);

      const x1 = Math.floor(eventData.range.x[0] * dataRange.fs);
      const x2 = Math.floor(eventData.range.x[1] * dataRange.fs);


      // Kiểm tra xem có record nào đang được chỉnh sửa không
      if (records.some(item => item._isBeingEdited)) {
        const i = records.findIndex(item => item._isBeingEdited);
        setRecords((prev) => {
          const curr = [...prev];
          curr[i].start = x1;
          curr[i].end = x2;
          curr[i]._isPlotDataChanged = true;

          curr[i]._isBeingEdited = false;


          if (curr[i].id) {
            curr[i]._action = "update";
          } else {

            curr[i]._action = "create";
          }
          return curr;
        });
      } else {

        setRecords((prev) => [
          ...prev,
          {
            id: "",
            fileId: "",
            start: x1,
            end: x2,
            labelName: "",
            waveNo: waveNo,
            note: "",
            _markKey: Math.random().toString(),
            _action: "create",
            _isPlotDataChanged: true,
          },
        ]);
      }
    }
  };

  const ToggleSwitch1: React.FC<ToggleSwitchProps> = ({ label, fileId }) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(() => {
      const savedState = localStorage.getItem(`toggleSwitch1-${fileId}`);
      return savedState === 'true';
    });

    const toggleSwitch1 = async () => {
      const newStatus = !isEnabled ? 'NEED_REVIEW' : 'TO_DO';
      setIsEnabled(!isEnabled);

      try {
        const updatedFiles = await updateFileStatus(fileId!, newStatus);
        console.log('Status updated successfully', updatedFiles);
        // Lưu trạng thái mới vào localStorage
        localStorage.setItem(`toggleSwitch1-${fileId}`, String(!isEnabled));
      } catch (error) {
        console.error('Error updating status:', error);
        setIsEnabled(isEnabled);
      }
    };


    useEffect(() => {
      return () => {
        localStorage.setItem(`toggleSwitch1-${fileId}`, String(isEnabled));
      };
    }, [isEnabled, fileId]);

    return (
      <div className="flex items-center space-x-3">
        <Switch
          checked={isEnabled}
          onChange={toggleSwitch1}
          className={`${isEnabled ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span
            className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition`}
          />
        </Switch>
        <span>{label}</span>
      </div>
    );
  };

  const ToggleSwitch2: React.FC<ToggleSwitchProps> = ({ label, fileId }) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(() => {
      const savedState = localStorage.getItem(`toggleSwitch2-${fileId}`);
      return savedState === 'true';
    });

    const toggleSwitch = async () => {
      const newStatus = !isEnabled ? 'COMPLETED' : 'NEED_REVIEW';
      setIsEnabled(!isEnabled);

      try {
        const updatedFiles = await updateFileStatus(fileId!, newStatus);
        console.log('Status updated successfully', updatedFiles);
        // Lưu trạng thái mới vào localStorage
        localStorage.setItem(`toggleSwitch2-${fileId}`, String(!isEnabled));
      } catch (error) {
        console.error('Error updating status:', error);
        setIsEnabled(isEnabled);
      }
    };

    useEffect(() => {
      return () => {
        localStorage.setItem(`toggleSwitch2-${fileId}`, String(isEnabled));
      };
    }, [isEnabled, fileId]);

    return (
      <div className="flex items-center space-x-3">
        <Switch
          checked={isEnabled}
          onChange={toggleSwitch}
          className={`${isEnabled ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span
            className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition`}
          />
        </Switch>
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex mb-4">
        <div className="w-1/2 p-4 border border-gray-300 rounded-md mx-4">
          <Information
            name={fileInfo.patientName}
            time={fileInfo.time}
            date={fileInfo.date}
            sex={fileInfo.patientSex}
            age={fileInfo.patientAge}
          />
        </div>
        <div className="w-1/2 p-4 rounded-md">
          <h1 className="font-semibold text-xl my-4">Dashboard</h1>
          <div className="flex w-1/2 p-4 rounded-md">
            <div className="p-4">
              <ToggleSwitch1 label="First check" fileId={fileId!} />
            </div>
            <div className="p-4">
              <ToggleSwitch2 label="Double check" fileId={fileId!} />
            </div>
          </div>
        </div>

      </div>

      <div className="grid gap-10 grid-cols-2 h-[70vh]">

        <div className="w-full h-full mx-4">
          <EMGPlot
            data={waveData ? [waveData, ...marks] : [...marks]}
            onSelected={onPlotSelected}
          />
          <File
            numberWaves={fileData.waves.length}
            records={records}
            fileId={fileId}
            fs={dataRange.fs}
            setWaveNo={setWaveNo}
            waveNo={waveNo}
          />
        </div>
        <div className="grid flex-grow py-10 w-full">
          <div className="w-full h-full">
            <Record
              fileId={fileId}
              waveNo={waveNo}
              records={records}
              fs={dataRange.fs}
              setRecords={setRecords}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
