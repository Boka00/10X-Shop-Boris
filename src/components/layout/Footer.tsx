import { Container } from './Container';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <Container className="flex flex-col items-center justify-between gap-2 text-center text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} 10X Shop. All rights reserved.</p>
        <p>Built with React, TypeScript & Tailwind CSS v4</p>
      </Container>
    </footer>
  );
}