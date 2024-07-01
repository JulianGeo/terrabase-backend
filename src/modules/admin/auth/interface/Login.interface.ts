

export interface Login {
    email: string;
    password: string;
}

export interface ResponseLogin {
    token: string;
    name: string;
    lastName: string;
}