import * as yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

export const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string()
        .min(6, "must be at least 6 characters")
        .matches(passwordRegex, "must be symbols(1 uppercase) and numbers")
        .required('Password is required')
})

 
export const checkoutSchema = yup.object().shape({
    fullname: yup.string().trim().min(2, 'Name Is Too short').required('Full name is required'),
    email: yup.string().trim().email('Invalid email').required('Email is required'),
    address: yup.string().trim().min(5, 'Enter a valid street address').required('Address is required'),
    city: yup.string().trim().min(2, 'Enter a valid city').required('City is required'),
    zipCode: yup.number().typeError('ZIP code must be a number').required('ZIP code is required'),
})