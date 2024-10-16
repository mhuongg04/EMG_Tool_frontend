import { api } from "../../../lib/api-client";

export type SuccessCreateRecordData = {
    record: {
        id: string,
        created_at: string,
        updated_at: string,
        start: number,
        end: number,
        label_name: string,
        wave_no: number,
        note?: string
    }
}

export type CreateRecordPayload = {
    start: number,
    end: number,
    label_name: string,
    wave_no: number,
    note?: string // Thay đổi để ghi chú có thể không có
}

export default async function createRecord(fileId: string, payload: CreateRecordPayload) {
    try {
        const response = await api.post(`/file/${fileId}/records/create`, payload);
        return response.data as SuccessCreateRecordData;
    } catch (error) {
        console.error("Error creating record:", error);
        throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi
    }
}