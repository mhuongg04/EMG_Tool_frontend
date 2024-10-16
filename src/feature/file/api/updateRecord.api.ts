import { api } from "../../../lib/api-client"

export type SuccessUpdateRecordData = {
    record: {
        id: string,
        create_at: string,
        update_at: string,
        "start": number,
        "end": number,
        "label_name": string,
        "wave_no": number,
        "fileId": string,
        "note": string
    }
}

export type UpdateRecordPayload = {
    "start": number,
    "end": number,
    "label_name": string,
    "wave_no": number,
    "note": string
}


export default async function updateRecord(recordId: string, payload: UpdateRecordPayload) {
    return await api.put(`/record/update/${recordId}`, payload)
        .then((res) => {
            return res.data as SuccessUpdateRecordData
        })
}