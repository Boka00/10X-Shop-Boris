import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginFormValues } from "../types/user";

function getRedirectPath(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state) {
    const fromVal = (state as { from?: unknown }).from;
    if (typeof fromVal === "string" && fromVal.startsWith("/")) {
      return fromVal;
    }
    if (
      typeof fromVal === "object" &&
      fromVal !== null &&
      "pathname" in fromVal &&
      typeof (fromVal as { pathname?: unknown }).pathname === "string"
    ) {
      return (fromVal as { pathname: string }).pathname;
    }
  }
  return "/";
}

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = getRedirectPath(location.state);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values.username.trim());
      navigate(redirectPath, { replace: true });
    },
  });

  return (
    <div className="mx-auto my-10 max-w-md space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your 10X Shop account
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="emilys"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            ← Back to catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;