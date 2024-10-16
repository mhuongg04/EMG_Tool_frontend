import React from 'react'
import * as XLSX from "xlsx";
import { Record } from './Main';
import getAllRecord from '../api/getAllRecords.api';

interface IProps {
  fileId: string
  numberWaves: number
  waveNo: number
  fs: number
  records: Record[]
  setWaveNo: (value: React.SetStateAction<number>) => void
}

export default function File({
  numberWaves,
  waveNo,
  fs,
  records,
  fileId,
  setWaveNo,
}: IProps) {

  const handleExportCSV = async () => {
    const respone = await getAllRecord(fileId)
    const data = respone.records
    const workbook = XLSX.utils.book_new();

    const uniqueWaveNo = Array.from(new Set(data.map(item => item.wave_no)))

    uniqueWaveNo.forEach(waveNo => {
      const filteredRecords = data.filter(item => item.wave_no === waveNo)

      // const recordData = [
      //   ["STT", "Start", "Stop", "Label", "Note"],
      //   ...filteredRecords.map((item, index) => [
      //     index + 1,
      //     item.start / fs,
      //     item.end / fs,
      //     item.labelName,
      //     item.note,
      //   ]),
      // ]

      const worksheet = XLSX.utils.aoa_to_sheet([
        ["STT", "Start", "Stop", "Label", "Note"],
        ...filteredRecords.map((item, index) => [
          index + 1,
          item.start / fs,
          item.end / fs,
          item.label_name,
          item.note,
        ]),
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Wave ${waveNo + 1}`)
    })

    XLSX.writeFile(workbook, 'Report.xlsx')
    // const csv = XLSX.utils.sheet_to_csv(workbook);
    // const utf8BOM = '\uFEFF' + csv;
    // const blob = new Blob([utf8BOM], { type: 'text/csv;charset=utf-8;' });
    // const link = document.createElement("a");
    // const url = URL.createObjectURL(blob);
    // link.href = url;
    // link.setAttribute("download", "Report.csv");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="flex justify-between px-10 space-x-2 w-full">
      <div className="flex justify-center items-center gap-2">
        <label htmlFor="section">Đoạn: </label>
        <select
          className="select select-bordered select-sm min-w-32 max-w-xs"
          name="section"
          id=""
          onChange={(e) => setWaveNo(parseInt(e.target.value))}
        >
          {Array.from({ length: numberWaves }, (_, i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-sm min-w-32" onClick={handleExportCSV}>
        Export CSV
      </button>
    </div>
  )
}