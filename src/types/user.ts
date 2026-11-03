export interface AuthUser {
    username: string;
    isLoggedIn: boolean;
}

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface CheckoutFormValues {
    fullname: string;
    email: string;
    address: string;
    city: string;
    zipCode: number;
}