import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="mx-auto my-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Go to catalog
      </Link>
    </div>
  );
};

export default NotFoundPage;