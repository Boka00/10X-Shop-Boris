import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getOrderStatus, getSavedOrders } from "../../models/Order";
import { Container } from "./Container";

export const Header = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const activeOrdersCount = user.isLoggedIn
    ? getSavedOrders(user.username).filter(
        (o) => getOrderStatus(o) !== "Delivered"
      ).length
    : 0;

  const handleLogout = (): void => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    }`;

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              10X
            </span>
            <span>10X Shop</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 md:flex"
          >
            <NavLink to="/" end className={navLinkClass}>
              Catalog
            </NavLink>

            <NavLink to="/cart" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <span>Cart</span>
                {totalItems > 0 && (
                  <span
                    aria-label={`${totalItems} items in cart`}
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white"
                  >
                    {totalItems}
                  </span>
                )}
              </span>
            </NavLink>

            {user.isLoggedIn && (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <span>Orders</span>
                    {activeOrdersCount > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-bold text-white">
                        {activeOrdersCount}
                      </span>
                    )}
                  </span>
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile ({displayName})
                </NavLink>
              </>
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "light" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {user.isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Burger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-3 border-t border-slate-100 py-4 md:hidden dark:border-slate-800"
          >
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Catalog
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Cart {totalItems > 0 ? `(${totalItems})` : ""}
            </NavLink>
            {user.isLoggedIn ? (
              <>
                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  Orders {activeOrdersCount > 0 ? `(${activeOrdersCount})` : ""}
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  Profile ({displayName})
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 self-start rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Log in
              </Link>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
};

export default Header;


