
export type RegisterApiPayload = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
};

export type RegisterApiResponse = {
    message: string;
    data: RegisterApiPayload;
};

export type RegisterApiResponseError = {
    errors: string[];
};

export type AuthenticationState = {
    registerErrors?: string[];
    registerPayload?: RegisterApiResponse;
    loginErrors?: string[];
    isLogin: boolean;
};