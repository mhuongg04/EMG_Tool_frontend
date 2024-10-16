import { api } from "../../../lib/api-client";

export default async function deleteFile(fileId: string) {
    try {
        const response = await api.delete(`/file/${fileId}`);
        // Kiểm tra mã trạng thái và ném lỗi nếu không phải 204
        if (response.status !== 204) {
            throw new Error('Failed to delete file');
        }
    } catch (error) {
        console.error('Delete file error:', error);
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    }
}