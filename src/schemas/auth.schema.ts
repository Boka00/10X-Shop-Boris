import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const checkoutSchema = yup.object().shape({
  fullname: yup
    .string()
    .trim()
    .required("Full name must be at least 3 characters")
    .min(3, "Full name must be at least 3 characters"),
  email: yup
    .string()
    .trim()
    .required("Please enter a valid email address")
    .email("Please enter a valid email address"),
  address: yup
    .string()
    .trim()
    .required("Address must be at least 5 characters")
    .min(5, "Address must be at least 5 characters"),
  city: yup
    .string()
    .trim()
    .required("City is required")
    .min(2, "City is required"),
  zipCode: yup
    .string()
    .trim()
    .required("Postal code must be 4-10 digits")
    .matches(/^\d{4,10}$/, "Postal code must be 4-10 digits"),
});