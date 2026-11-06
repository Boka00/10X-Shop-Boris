import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const checkoutSchema = Yup.object({
  fullname: Yup.string()
    .trim()
    .required("Full name must be at least 3 characters")
    .min(3, "Full name must be at least 3 characters"),
  email: Yup.string()
    .trim()
    .required("Please enter a valid email address")
    .email("Please enter a valid email address"),
  address: Yup.string()
    .trim()
    .required("Address must be at least 5 characters")
    .min(5, "Address must be at least 5 characters"),
  city: Yup.string()
    .trim()
    .required("City is required"),
  zipCode: Yup.string()
    .trim()
    .required("Postal code must be 4-10 digits")
    .matches(/^\d{4,10}$/, "Postal code must be 4-10 digits"),
});