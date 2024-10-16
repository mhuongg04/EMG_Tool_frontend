import { api } from "../../../lib/api-client";

export default async function deleteRecord(id: string) {
    return await api.delete(`/record/${id}`)
}
