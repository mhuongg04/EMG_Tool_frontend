import Plot from 'react-plotly.js';
import { Data as PlotData, PlotSelectionEvent, Layout } from 'plotly.js';
import { useEffect, useState } from 'react';
import { parseData, ParsedData } from './parser';
import * as XLSX from 'xlsx';
import React from 'react';
import axios from 'axios';


type Mark = {
  x1: number;
  x2: number;
  label: string;
  note: string;
};

type DataRange = [number[], number[]];

function PlotlyComponent() {
  const [width, setWidth] = useState(600);
  const responsiveChartRef = React.useRef<HTMLDivElement>(null);
  // let resizeListener: any;
  useEffect(() => {
    const resize = () => {
      const elREF = responsiveChartRef.current;
      if (!elREF) return;
      setWidth(elREF.getBoundingClientRect().width);
    };
    window.addEventListener('resize', resize);
    resize();
  }, []);

  const [changeRangeMode, setChangeRangeMode] = useState(false);
  const [changeRangeIndex, setChangeRangeIndex] = useState(-1);

  const [dataRange, setDataRange] = useState<DataRange>([[], []]);
  const [fs, setFs] = useState(20000);
  const [meta, setMeta] = useState({
    age: 0,
    sex: '',
    date: '',
    time: '',
  });

  const [waves, setWaves] = useState<ParsedData['waves']>([]);
  const [waveNo, setWaveNo] = useState(0);
  const [data, setData] = useState<PlotData[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [dragmode, setDragMode] = useState<Layout['dragmode']>('select');
  const tableRef = React.createRef<HTMLTableElement>();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const utf8decoder = new TextDecoder('utf-8');
      const content = utf8decoder.decode(buffer);
      const data = parseData(content);
      setWaves(data.waves);
      setMeta({
        age: data.age,
        sex: data.sex,
        date: data.date,
        time: data.time,
      });
      setFs(data.fs);
    };
  };

  console.log('rerender');

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e === null || e.target.files === null) return;

    const fileTypes = ['text/plain'];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        handleFile(selectedFile);
      }
    }
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['STT', 'Start', 'Stop', 'Label', 'Note'],
      ...marks.map((mark, index) => [
        index + 1,
        mark.x1,
        mark.x2,
        mark.label,
        mark.note,
      ]),
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Đoạn ' + (waveNo + 1));
    console.log(workbook);
    XLSX.writeFile(workbook, 'Report.xlsx');
  };

  useEffect(() => {
    if (waves.length === 0) {
      setWaveNo(0);
      setDataRange([[], []]);
      setMarks([]);
    } else {
      setDataRange(waves[waveNo]);
      setMarks([]);
    }
  }, [waves, waveNo]);

  useEffect(() => {
    if (waves.length === 0) return;
    const xrange = dataRange[0];
    const yrange = dataRange[1];
    setData([
      {
        x: xrange.map(v => v / fs),
        y: yrange,
        type: 'scatter',
        mode: 'lines',
        hoverinfo: 'none',
        line: {
          width: 1,
        },
      },
    ]);
  }, [dataRange]);

  const updateData = (_marks: Mark[] = marks) => {
    setData(prev => {
      const curr: PlotData[] = [prev[0]];
      console.log('update');

      _marks.forEach((mark, index) => {
        curr.push({
          x: dataRange[0].slice(mark.x1, mark.x2).map(v => v / fs),
          y: dataRange[1].slice(mark.x1, mark.x2),
          type: 'scatter',
          mode: 'lines',
          hoverinfo: 'skip',
          line: {
            width: 1,
            color:
              changeRangeMode && changeRangeIndex === index ? 'orange' : 'red',
          },
        });
      });

      return curr;
    });
  };

  const handleSelect = (eventData: PlotSelectionEvent) => {
    if (eventData && eventData.range) {
      console.log(eventData);

      const x1 = Math.floor(eventData.range.x[0] * fs);
      const x2 = Math.floor(eventData.range.x[1] * fs);

      if (changeRangeMode) {
        const _marks = [...marks];
        _marks[changeRangeIndex].x1 = x1;
        _marks[changeRangeIndex].x2 = x2;
        setMarks(_marks);
        setChangeRangeMode(false);
        // updateData() called in useEffect
      } else {
        // TODO Set marks logic: need sort and merge

        const _marks = [
          ...marks,
          {
            x1: x1,
            x2: x2,
            label: 'a',
            note: '',
          },
        ];
        setMarks(_marks);
        updateData(_marks);
      }
    }
  };

  useEffect(() => {
    updateData();
  }, [changeRangeMode, changeRangeIndex]);

  const handleChangeRangeClick = (index: number) => {
    setChangeRangeMode(true);
    setChangeRangeIndex(index);
  };

  const saveMarksToServer = async () => {
    try {
      const response = await axios.post('/api/saveMarks', { marks });
      if (response.status === 200) {
        alert('Lưu thành công!');
      } else {
        alert('Lỗi khi lưu dữ liệu.');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Lỗi kết nối server.');
    }
  };

  // Hàm lấy dữ liệu từ server khi load trang
  const loadMarksFromServer = async () => {
    try {
      const response = await axios.get('/api/getMarks');
      if (response.status === 200 && response.data) {
        setMarks(response.data.marks);
        updateData(response.data.marks); // Cập nhật lại dữ liệu biểu đồ
      }
    } catch (error) {
      console.error('Error loading marks:', error);
    }
  };

  // Gọi hàm loadMarksFromServer trong useEffect để lấy dữ liệu khi tải trang
  useEffect(() => {
    loadMarksFromServer();
  }, []);

  // Khi người dùng ấn nút lưu
  const handleSave = () => {
    saveMarksToServer();
  };

  return (
    <div id='plotly'>
      <div className='grid grid-cols-2 gap-8 w-full'>
        <div>
          <div ref={responsiveChartRef}>
            <Plot
              onSelected={handleSelect}
              onRedraw={() => console.log('redraw')}
              onButtonClicked={e => console.log(e)}
              onPurge={() => console.log('purge')}
              onAutoSize={() => console.log('autosize')}
              onClickAnnotation={e => console.log(e)}
              onUpdate={e => {
                if (
                  dragmode != e.layout.dragmode &&
                  e.layout.dragmode != undefined &&
                  e.layout.dragmode == 'select'
                ) {
                  setDragMode(e.layout.dragmode);
                }
              }}
              divId='plotly-div'
              debug={true}
              data={data}
              layout={{
                width: width,
                height: 600,
                title: 'EMG',
                showlegend: false,
                dragmode: dragmode,
                yaxis: {
                  title: 'Điện thế (mV)',
                  showline: true,
                },
                xaxis: {
                  title: 'Thời gian (s)',
                  zeroline: false,
                  showline: true,
                },
                uirevision: 'true',
              }}
              config={{
                displaylogo: false,
                modeBarButtons: [
                  ['zoom2d', 'pan2d', 'select2d'],
                  ['zoomIn2d', 'zoomOut2d', 'resetScale2d'],
                ],
              }}
            />
          </div>
          <div className='flex justify-between px-10'>
            <div className='flex justify-center items-center gap-2'>
              <label htmlFor='section'>Đoạn: </label>
              <select
                className='select select-bordered select-sm min-w-32 max-w-xs'
                name='section'
                id=''
                onChange={e => setWaveNo(parseInt(e.target.value))}
              >
                {Array.from({ length: waves.length }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button className='btn btn-sm min-w-32' onClick={handleExportExcel}>
              Xuất Excel
            </button>
          </div>
        </div>
        <div className='grid flex-grow py-10 max-w-2xl'>
          <div className='w-full'>
            <h2 className='font-semibold text-lg mb-4'>Patient Information</h2>
            <div className='flex gap-8 text-start'>
              <div className='font-semibold text-end'>
                <h3>Age :</h3>
                <h3>Sex :</h3>
                <h3>Date :</h3>
                <h3>Time :</h3>
              </div>
              <div className=''>
                <h3>{meta.age != 0 && meta.age}</h3>
                <h3>{meta.sex}</h3>
                <h3>{meta.date}</h3>
                <h3>{meta.time}</h3>
              </div>
            </div>
            <h2 className='font-semibold text-lg my-4'>Dashboard</h2>
            <div className='max-w-2xl h-[340px] overflow-y-auto'>
              <table className='table w-full table-pin-rows' ref={tableRef}>
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Start</th>
                    <th>Stop</th>
                    <th>Label</th>
                    <th>Note</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className=''>
                  {/* row 1 */}
                  {marks.map((mark, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{(mark.x1 / fs).toFixed(3)}</td>
                      <td>{(mark.x2 / fs).toFixed(3)}</td>
                      <td>
                        <select
                          className='select select-bordered select-sm max-w-xs'
                          name='label'
                          id=''
                          onChange={e => {
                            const _marks = [...marks];
                            _marks[index].label = e.target.value;
                            setMarks(_marks);
                            updateData(_marks);
                          }}
                          value={mark.label}
                        >
                          <option value='a'>Bệnh a</option>
                          <option value='b'>Bệnh b</option>
                          <option value='c'>Bệnh c</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type='text'
                          placeholder='Type here'
                          value={mark.note}
                          onChange={e => {
                            const _marks = [...marks];
                            _marks[index].note = e.target.value;
                            setMarks(_marks);
                            updateData(_marks);
                          }}
                          className='input input-bordered input-sm w-full min-w-12 max-w-xs'
                        />
                      </td>
                      <td className='flex space-x-2 justify-between'>
                        <button
                          className='btn btn-sm'
                          onClick={() => {
                            const _marks = marks.filter((_, i) => i !== index);
                            setMarks(_marks);
                            updateData(_marks);
                          }}
                          disabled={changeRangeMode}
                        >
                          Remove
                        </button>
                        {changeRangeMode && changeRangeIndex === index ? (
                          <button
                            className='btn btn-sm btn-accent'
                            onClick={() => {
                              setChangeRangeMode(false);
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className='btn btn-sm'
                            onClick={() => {
                              handleChangeRangeClick(index);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='divider mt-0'></div>
            <div className=''>
              <div className='flex justify-center gap-4 px-4 mb-4'>
                <input
                  type='file'
                  className='file-input file-input-bordered file-input-sm w-full max-w-xs'
                  onChange={handleSelectFile}
                />
              </div>
              <div className='flex justify-center gap-4 px-4'>
                <button className='btn btn-sm min-w-32' onClick={handleSave}>Lưu</button>
                <button className='btn btn-sm min-w-32'>Lưu nháp</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlotlyComponent;
