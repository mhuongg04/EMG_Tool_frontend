import { SuccessGetAllFileData } from "./getAllFile.api";
import { api } from "../../../lib/api-client";

export default async function getFileByName(name?: string) {
    const body: any = {};

    if (name && name.trim() !== "") {
        body.name = name;
    }

    return api
        .post("/file/searchbyname", body)
        .then(res => res.data as SuccessGetAllFileData);
}