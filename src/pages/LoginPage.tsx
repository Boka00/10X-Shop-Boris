import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginFormValues } from "../types/user";

function getRedirectPath(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state) {
    const fromValue = (state as Record<string, unknown>).from;
    if (typeof fromValue === "string" && fromValue.length > 0) {
      return fromValue;
    }
    if (
      typeof fromValue === "object" &&
      fromValue !== null &&
      "pathname" in fromValue
    ) {
      const pathname = (fromValue as Record<string, unknown>).pathname;
      if (typeof pathname === "string" && pathname.length > 0) {
        return pathname;
      }
    }
  }
  return "/";
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = getRedirectPath(location.state);

  const onSubmitFunc = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

    login(values.username.trim());
    actions.resetForm();

    navigate(from, { replace: true });
  };

  const {
    values,
    errors,
    touched,
    isValid,
    dirty,
    handleChange,
    isSubmitting,
    handleBlur,
    handleSubmit,
  } = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: onSubmitFunc,
  });

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Log In
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter any username and password (min 6 chars) to continue.
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
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
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 focus:ring-1 focus:outline-none ${
                errors.username && touched.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-indigo-500"
              }`}
            />
            {errors.username && touched.username && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
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
              className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 focus:ring-1 focus:outline-none ${
                errors.password && touched.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-indigo-500"
              }`}
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || !dirty || isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
  );
};

export default LoginPage;