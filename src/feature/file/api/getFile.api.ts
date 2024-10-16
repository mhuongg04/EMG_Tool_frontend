import { api } from "../../../lib/api-client";

export type SuccessGetFileData = {
    file: { id: string } & { [key: string]: string };
    signedUrl: string;
}

export default async function getFile(id: string) {
    return await api.get(`/file/${id}`)
        .then((res) => {
            return res.data as SuccessGetFileData
        })
}
