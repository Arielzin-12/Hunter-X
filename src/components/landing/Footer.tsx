import { Logo } from "./Navbar";

const footerLinks = [
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Contato", href: "#" },
  { label: "Termos", href: "#" },
  { label: "Privacidade", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Logo />
            <p className="mt-2.5 text-sm text-muted-foreground">
              Inteligência para sua prospecção.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} HunterX. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
