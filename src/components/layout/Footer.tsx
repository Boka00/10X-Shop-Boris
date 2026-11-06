import { Container } from "./Container";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <Container>
        <p>© {new Date().getFullYear()} 10X Shop. Built with React 19, TypeScript & Tailwind CSS v4.</p>
      </Container>
    </footer>
  );
};

export default Footer;