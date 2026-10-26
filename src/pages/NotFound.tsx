import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
     <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600">
        404 Error
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-base text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Go to catalog
      </Link>
    </div>
  )
}

export default NotFound