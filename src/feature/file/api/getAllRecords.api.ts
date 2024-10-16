import { api } from "../../../lib/api-client";
import { SuccessGetAllRecordData } from "./getRecordByWaveNo";

export default async function getAllRecord(fileId: string) {
    return await api.get(`/file/${fileId}/records`)
        .then((res) => {
            return res.data as SuccessGetAllRecordData
        })
}