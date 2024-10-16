import { api } from "../../../lib/api-client";
import { IFileInfo } from "../utils/reader";

export type SuccessGetSignedUrlData = {
    file: {id: string} & {[key: string]: string};
    signedUrl: string;
}

export type FailedGetSignedUrlData = {
    file: {id: string} & {[key: string]: string};
    signedUrl: undefined;
}

export default async function getSignedUrl(payload: IFileInfo & {fileName: string}) {
    return await api.post('/file/upload', {
        "hash_value": payload.hashValue,
        "file_name": payload.fileName,
        "patient_name": payload.patientName,
        "patient_age": payload.patientAge,
        "patient_sex": payload.patientSex,
        "date": payload.date,
        "time": payload.time,
        "muscle_name": payload.muscleName,
        "muscle_side": payload.muscleSide,
        "amplitude": 0,
        "sampling_frequency": 0,
    }).then((res) => {
        return res.data as SuccessGetSignedUrlData | FailedGetSignedUrlData
    })
}
