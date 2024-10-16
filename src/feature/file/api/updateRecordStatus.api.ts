import { api } from "../../../lib/api-client"

export type SuccessUpdateFileStatus = {
    files: {
        "id": string,
        "file_name": string,
        "created_at": string,
        "updated_at": string,
        "userId": string,
        "status": 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW',
    }[]

}

export default async function updateFileStatus(id: string, newStatus: 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW'): Promise<SuccessUpdateFileStatus> {
    try {
        const response = await api.put(`/file/update/${id}`, { status: newStatus });

        return response.data;
    } catch (error) {
        console.error("Error updating file status:", error);
        throw error;
    }
}