import { api } from "../../../lib/api-client";

export type SuccessGetAllFileData = {
    files: {
        "id": string,
        "file_name": string,
        "created_at": string,
        "updated_at": string,
        "hash_value": string,
        "patient_name": string,
        "patient_age": number,
        "patient_sex": string,
        "date": string,
        "time": string,
        "muscle_name": string,
        "muscle_side": string,
        "amplitude": number,
        "sampling_frequency": number,
        "userId": string,
        "status": 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW',
    }[]
}

export default async function getAllFile() {
    return api.get("/file/all")
        .then(res => res.data as SuccessGetAllFileData)
}