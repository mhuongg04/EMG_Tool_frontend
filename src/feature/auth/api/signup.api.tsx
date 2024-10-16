import { api } from "../../../lib/api-client";

export type SignupCredentials = {
    username: string;
    password: string;
}

export type SignUpSuccessData = {
    message: string;
    accessToken: string;
}

export default async function signup(credentials: SignupCredentials) {
    return await api.post('/auth/signup', {
        username: credentials.username,
        password: credentials.password
    }).then((res) => {
        return res.data as SignUpSuccessData
    })
}