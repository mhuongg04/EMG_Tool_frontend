import { api } from "../../../lib/api-client";

export type LoginCredentials = {
    username: string;
    password: string;
}

export type LoginSuccessData = {
    message: string;
    accessToken: string;
}

export default async function login(credentials: LoginCredentials) {
    return await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
    }).then((res) => {
        return res.data as LoginSuccessData
    })
}
