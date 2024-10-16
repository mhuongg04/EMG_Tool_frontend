import { api } from "../../../lib/api-client";

export default async function checkLogin() {
    return api.get("/file/all")
}