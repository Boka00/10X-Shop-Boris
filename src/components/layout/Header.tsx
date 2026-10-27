import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container } from './Container';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // დროებითი კალათის რაოდენობა (მე-5 დღეს მივაბამთ CartContext-ს)
  const cartCount = 0;

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1"
          >
            10X <span className="text-indigo-600">Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:items-center sm:gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Catalog
            </NavLink>

            <NavLink to="/cart" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                Cart
                {cartCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </NavLink>

            {/* 👇 აი აქ წყდება, Log out გამოჩნდეს თუ Log in 👇 */}
            {user.isLoggedIn ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Hi, {user.username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Log in
              </NavLink>
            )}
          </nav>

          {/* Mobile Burger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className="text-xl font-bold">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-1 border-t border-slate-100 py-3 sm:hidden">
            <NavLink
              to="/"
              end
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Catalog
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <span className="inline-flex items-center gap-2">
                Cart
                {cartCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </NavLink>

            {user.isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Log out ({user.username})
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700"
              >
                Log in
              </NavLink>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
}