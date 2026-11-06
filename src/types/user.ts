export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  theme?: "light" | "dark";
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
  zipCode: string;
}

export type ProfileFormValues = Required<
  Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">
>;