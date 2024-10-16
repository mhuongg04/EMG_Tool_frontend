import { api } from "../../../lib/api-client"
import { SuccessGetAllFileData } from "./getAllFile.api";


export type SuccessGetFileByCondition = {
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

// export default async function getFile(status?: 'TO_DO' | 'NEED_REVIEW' | 'COMPLETED', name?: string) {
//     const params: any = {};

//     if (status) {
//         params.status = status;
//     }

//     if (name && name.trim() !== "") {
//         params.name = name;
//     }

//     return api
//         .get("/file/search", { params })
//         .then(res => res.data as SuccessGetFileByCondition);
// }

export default async function getFile(status: 'TO_DO' | 'NEED_REVIEW' | 'COMPLETED') {
    try {
        const res = await api.post("/file/searchbystatus", { status });
        return res.data as SuccessGetAllFileData;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
}
