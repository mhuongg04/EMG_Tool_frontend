import React, { useEffect } from 'react'
import type { Record } from './Main'
import createRecord from '../api/createRecord.api'
import updateRecord from '../api/updateRecord.api'
import deleteRecord from '../api/deleteRecord.api'
import RecordLabel from '../../../constants/RecordLabel'
import Button from 'antd-button-color'
import 'antd-button-color/dist/css/style.css';
import { notification } from 'antd';
import '../../../style/Table.scss';
import { api } from "../../../lib/api-client";
import getAllFile from '../../home/api/getAllFile.api'
import getAllRecord from '../api/getRecordByWaveNo'
import getRecordByWaveNo from '../api/getRecordByWaveNo'
//import getAllRecord from '../api/getAllRecord'

interface IProps {
  fileId?: string
  waveNo: number
  records: Record[]
  fs: number
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>

}

export default function Record({
  fileId,
  waveNo,
  records,
  fs,
  setRecords,
}: IProps) {
  const tableRef = React.createRef<HTMLTableElement>();
  const [isSaveLoading, setIsSaveLoading] = React.useState(false);
  const [saveStatusColor, setSaveStatusColor] = React.useState<string>('lightdark');
  const [saveStatusMessage, setSaveStatusMessage] = React.useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();


  const [isSaving, setIsSaving] = React.useState(false); // Thêm state kiểm soát quá trình lưu

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const fetchRecordsByWaveNo = async (waveNo: number) => {
    if (!fileId) return;

    try {
      const response = await fetch(`${API_BASE_URL}record/${fileId}/wave/${waveNo}`, {
        method: 'POST',
      });

      // Kiểm tra xem phản hồi có thành công không
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecords(data.records); // Cập nhật records từ phản hồi
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };


  useEffect(() => {
    getRecordByWaveNo(fileId, waveNo); // Gọi API khi waveNo thay đổi
  }, [fileId, waveNo]);

  const handleSaveClick = () => {
    if (!fileId) return;

    const promises: Promise<any>[] = []


    records.forEach((record) => {
      if (record._action === "create") {
        const result = createRecord(fileId, {
          start: record.start,
          end: record.end,
          label_name: record.labelName,
          wave_no: waveNo,
          note: record.note
        })
          .then((data) => {
            setRecords((prev) => {
              return prev.map((item) => {
                if (item._markKey === record._markKey) {
                  return {
                    ...item,
                    id: data.record.id,
                    _action: null,
                    _isPlotDataChanged: false,
                  }
                }
                else {
                  return item
                }
              })
            })
          })
        promises.push(result)
      }
      else if (record._action === "update") {
        const result = updateRecord(record.id, {
          start: record.start,
          end: record.end,
          label_name: record.labelName,
          wave_no: waveNo,
          note: record.note
        })
          .then(() => {
            setRecords((prev) => {
              return prev.map((item) => {
                if (item._markKey === record._markKey) {
                  return {
                    ...item,
                    _action: null,
                    _isPlotDataChanged: false,
                  }
                }
                else {
                  return item
                }
              })
            })
          })
        promises.push(result)
      }
      else if (record._action === "delete") {
        const result = deleteRecord(record.id)
          .then(() => {
            setRecords((prev) => {
              return prev.filter((item) => item._markKey !== record._markKey)
            })
          })
        promises.push(result)
      }
    })

    if (promises.length > 0) {
      setIsSaveLoading(true)
      Promise.allSettled(promises).then((results) => {
        const failNumber = results.filter((result) => result.status === "rejected").length
        if (failNumber === 0) {
          api.success({

            message: "Lưu thành công",
          })
          setSaveStatusMessage('')
        }
        else {
          setSaveStatusColor('warning')
          setSaveStatusMessage(`Lưu thất bại: ${failNumber} bản ghi`)
        }
        setIsSaveLoading(false)
      })
    }
  }
  // const handleSaveClick = () => {
  //   if (!fileId || isSaving) return;

  //   setIsSaving(true);

  //   const promises: Promise<any>[] = [];
  //   const sortedRecords = records.sort((a, b) => a.start - b.start);

  //   sortedRecords.forEach((record, index) => {
  //     const waveNoValue = index + 1;

  //     //Xử lý bản ghi tạo mới
  //     if (!record.id && record._action === "create") {
  //       const result = createRecord(fileId, {
  //         start: record.start,
  //         end: record.end,
  //         label_name: record.labelName,
  //         wave_no: waveNoValue,
  //         note: record.note
  //       }).then((data) => {
  //         setRecords((prev) => prev.map((item) => {
  //           if (item._markKey === record._markKey) {
  //             return { ...item, id: data.record.id, _action: null, _isPlotDataChanged: false, wave_no: waveNoValue };
  //           }
  //           return item;
  //         }));
  //       });
  //       promises.push(result);
  //     }
  //     // Xử lý bản ghi cập nhật
  //     else if (record.id && record._action === "update") {
  //       const result = updateRecord(record.id, {
  //         start: record.start,
  //         end: record.end,
  //         label_name: record.labelName,
  //         wave_no: waveNoValue,
  //         note: record.note
  //       }).then(() => {
  //         setRecords((prev) => prev.map((item) => {
  //           if (item._markKey === record._markKey) {
  //             return { ...item, _action: null, _isPlotDataChanged: false, wave_no: waveNoValue };
  //           }
  //           return item;
  //         }));
  //       });
  //       promises.push(result);
  //     }
  //     // Xử lý bản ghi xóa
  //     else if (record._action === "delete") {
  //       const result = deleteRecord(record.id).then(() => {
  //         setRecords((prev) => prev.filter((item) => item._markKey !== record._markKey));
  //       });
  //       promises.push(result);
  //     }
  //   });

  //   if (promises.length > 0) {
  //     setIsSaveLoading(true);
  //     Promise.allSettled(promises).then((results) => {
  //       const failNumber = results.filter((result) => result.status === "rejected").length;

  //       if (failNumber === 0) {
  //         api.success({ message: "Lưu thành công" });
  //         setSaveStatusMessage('');
  //       } else {
  //         setSaveStatusColor('warning');
  //         setSaveStatusMessage(`warning`);
  //       }

  //       window.location.reload();
  //       const updatedRecords = records.filter((item) => item._action !== "delete").sort((a, b) => a.start - b.start)
  //         .map((record, index) => ({ ...record, wave_no: index + 1 }));

  //       setRecords(updatedRecords);
  //       setIsSaveLoading(false);
  //       setIsSaving(false);


  //     });
  //   } else {
  //     setIsSaving(false);
  //   }
  // }




  useEffect(() => {
    if (records.some(item => item._action !== null)) {
      setSaveStatusColor("primary")
    }
    else {
      setSaveStatusColor("lightdark")
    }
  }, [records]);

  const handleEditRecordClick = (markKey: string) => {
    setRecords((prev) => {
      return prev.map((record) => {
        if (record._markKey === markKey) {
          return {
            ...record,
            _isBeingEdited: true,
            _isPlotDataChanged: true
          }
        }
        else if (record._isBeingEdited == true) {
          return {
            ...record,
            _isBeingEdited: false,
            _isPlotDataChanged: true
          }
        }
        else {
          return record
        }
      })
    })
  }

  const handleCancelEditRecordClick = () => {
    setRecords((prev) => {
      return prev.map((record) => {
        if (record._isBeingEdited == true) {
          return {
            ...record,
            _isBeingEdited: false,
            _isPlotDataChanged: true
          }
        }
        else {
          return record
        }
      })
    })
  }

  const handleDeleteRecordClick = (markKey: string) => {
    const i = records.findIndex(item => item._markKey === markKey)

    //const recordToDelete = records[i]
    setRecords((prev) => {
      const curr = [...prev]
      if (curr[i]._action === "create") {
        curr[i]._isPlotDataChanged = false,
          curr.splice(i, 1)

        return curr
      }
      else {
        curr[i]._isPlotDataChanged = true
        curr[i]._action = "delete"
        return curr
      }
    })
  }


  const handleUnDeleteRecordClick = (markKey: string) => {
    const i = records.findIndex(item => item._markKey === markKey);

    setRecords((prev) => {
      const curr = [...prev];
      // Chuyển từ trạng thái "delete" về lại trạng thái "update"
      curr[i]._isPlotDataChanged = true;
      curr[i]._action = "update";
      return curr;
    });
  }


  const handleStartValueChange = (markKey: string, value: number) => {
    const i = records.findIndex(item => item._markKey === markKey)
    setRecords((prev) => {
      const curr = [...prev]
      curr[i].start = value * fs
      curr[i]._isPlotDataChanged = true
      curr[i]._action = "update"
      return curr
    })
  }

  const handleEndValueChange = (markKey: string, value: number) => {
    const i = records.findIndex(item => item._markKey === markKey)
    setRecords((prev) => {
      const curr = [...prev]
      curr[i].end = value * fs
      curr[i]._isPlotDataChanged = true
      curr[i]._action = "update"
      return curr
    })
  }

  const handleLabelNameChange = (markKey: string, value: string) => {
    const i = records.findIndex(item => item._markKey === markKey)
    setRecords((prev) => {
      const curr = [...prev]
      curr[i].labelName = value
      curr[i]._isPlotDataChanged = false
      if (curr[i].id) { curr[i]._action = "update" }
      else { curr[i]._action = "create" }

      return curr
    })
  }

  const handleNoteChange = (markKey: string, value: string) => {
    const i = records.findIndex(item => item._markKey === markKey)
    setRecords((prev) => {
      const curr = [...prev]
      curr[i].note = value
      curr[i]._isPlotDataChanged = false
      if (curr[i].id) { curr[i]._action = "update" }
      else { curr[i]._action = "create" }
      return curr
    })
  }

  return (
    <div>
      {contextHolder}
      <div className="overflow-y-auto">
        <div className='wb-8'>
          <Button
            onClick={() => handleSaveClick()}
            loading={isSaveLoading}
            type={saveStatusColor}
            size='large'
            className='wb-4'
          >Save</Button>
          {saveStatusMessage && <div>{saveStatusMessage}</div>}
        </div>
        <table className="table w-full table-pin-rows wt-4" ref={tableRef}>
          {/* head */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Start</th>
              <th>Stop</th>
              <th>Label</th>
              <th>Note</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className="">
            {/* row 1 */}
            {records.map((record, index) => (
              <tr key={index} className={record._action === "delete" ? " bg-red-100" : ""}>
                <td className={record._action === "delete" ? "line-through" : ""}>{index + 1}</td>
                <td>
                  <input
                    type="number" value={(record.start / fs)}
                    onChange={(e) => handleStartValueChange(record._markKey, parseFloat(e.target.value))}
                    className="input input-bordered input-sm max-w-24 pr-0"
                  />
                </td>
                <td>
                  <input type="number" value={(record.end / fs)}
                    onChange={(e) => handleEndValueChange(record._markKey, parseFloat(e.target.value))}
                    className="input input-bordered input-sm max-w-24 pr-0"
                  />
                </td>
                <td>
                  <select
                    className="select select-bordered select-sm min-w-16 max-w-64 w-full"
                    name="label"
                    onChange={(e) => handleLabelNameChange(record._markKey, e.target.value)}
                    value={record.labelName}
                  >
                    <option title='select an option' />
                    {RecordLabel.Labels.map((label, index) => (<option key={index} value={label}>{label}</option>))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={record.note}
                    onChange={(e) => handleNoteChange(record._markKey, e.target.value)}
                    className="input input-bordered input-sm w-full min-w-16 max-w-xs"
                  />
                </td>
                <td className="flex space-x-2 w-40 justify-between">
                  {(record._isBeingEdited) ?
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={() => handleCancelEditRecordClick()}
                    >
                      Cancel
                    </button>
                    :
                    <button
                      className="btn btn-sm"
                      onClick={() => handleEditRecordClick(record._markKey)}
                    >
                      Edit
                    </button>
                  }
                  {
                    record._action === "delete" ?
                      <button
                        className="btn btn-sm bg-blue-300 opacity-100 hover:bg-blue-400"
                        onClick={() => handleUnDeleteRecordClick(record._markKey)}
                      >Decline</button>
                      :
                      <button
                        className="btn btn-sm bg-red-300 hover:bg-red-400"
                        onClick={() => handleDeleteRecordClick(record._markKey)}
                        disabled={record._isBeingEdited}
                      >
                        Delete
                      </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
  )
}
