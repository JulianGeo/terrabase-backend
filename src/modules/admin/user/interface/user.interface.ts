export interface UserLoginRepositoryI {
    email: string;
    enabled: boolean;
}

export interface CreateUserI {
    name: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    enabled: boolean;
}

export interface ChangePasswordI {
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
}