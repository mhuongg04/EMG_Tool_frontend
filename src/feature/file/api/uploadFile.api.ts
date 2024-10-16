import { api } from "../../../lib/api-client";

export type SuccessCreateFileData = {
    file: {
        userId: string;
        file_name?: string;
        hash_value: string;
        patient_name?: string;
        patient_age?: number;
        patient_sex?: string;
        date?: string;
        time?: string;
        muscle_name?: string;
        muscle_side?: string;
        amplitude?: number;
        sampling_frequency?: number;
        status: 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW'
    }
}

export type CreateFilePayload = {
    file_name?: string;
    patient_name?: string;
    patient_age?: number;
    patient_sex?: string;
    date?: string;
    time?: string;
    muscle_name?: string;
    muscle_side?: string;
    amplitude?: number;
    sampling_frequency?: number;
}

export default async function uploadFile(formData: FormData) {
    try {
        const response = await api.post(`/file/upload/`, formData);
        return response.data as SuccessCreateFileData;
    } catch (error) {
        console.error("Error creating record:", error);
        throw error;
    }
}