import { api } from "../../../lib/api-client";

export type SuccessGetAllRecordData = {
    records: {
        id: string,
        create_at: string,
        update_at: string,
        fileId: string,
        "start": number,
        "end": number,
        "label_name": string,
        wave_no: number,
        "note": string
    }[]
}



export default async function getRecordByWaveNo(fileId: string, wave_no: number) {
    return await api.post(`/record/${fileId}/wave/${wave_no}`)
        .then((res) => {
            return res.data as SuccessGetAllRecordData
        })
}