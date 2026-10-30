import * as yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

export const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string()
        .min(6, "must be at least 6 characters")
        .matches(passwordRegex, "must be symbols(1 uppercase) and numbers")
        .required('Password is required')
})