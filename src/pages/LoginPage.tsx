import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../schemas/auth.schema";
import { Link } from "react-router-dom";
import type { LoginFormValues } from "../types/user";

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmitFunc =  async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      login(values.username.trim());
      // console.log('created', values);
      actions.resetForm();


      navigate(from, {replace: true});
    }

  const { values, errors, touched, isValid, dirty, handleChange, isSubmitting, handleBlur, handleSubmit} = useFormik<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: onSubmitFunc
  })
  

  // ვკითხულობთ, საიდან გადმოვიდა მომხმარებელი (თუ /checkout-დან მოვიდა, იქ დავაბრუნებთ, თუ არა -> '/')
  const from = (location.state as { from?: string } | null)?.from || '/';

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Log In
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter any username and password (min 6 chars) to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            {/* Username Field */}
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username" 
              type="text"
              placeholder="e.g. John"
              value={values.username} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1
                ${errors.username && touched.username ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'}
              `}
              />
              {errors.username && touched.username ? <p className="text-red-500">{errors.username}</p> : ""}
          </div>

            {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password" 
              type="password"
              placeholder="e.g. Pass123"
              value={values.password} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1
                ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'}
              `}
              />
             {errors.password && touched.password ? <p className="text-red-500">{errors.password}</p> : ""}
          </div>

          <button
            type="submit"
            disabled={!isValid || !dirty || isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Log In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to catalog
          </Link>
        </div>
      </div> 
    </div>
  )
}

export default LoginPage