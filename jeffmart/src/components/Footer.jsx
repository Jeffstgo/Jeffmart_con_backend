export default function Footer() {
  return (
    <footer className="bg-dark border-t border-border text-text text-sm">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-center gap-6 mb-3">
          <a href="#" className="hover:text-primary transition">
            Acerca de
          </a>
          <a href="#" className="hover:text-primary transition">
            Contacto
          </a>
          <a href="#" className="hover:text-primary transition">
            Ayuda
          </a>
          <a href="#" className="hover:text-primary transition">
            Términos y Condiciones
          </a>
          <a href="#" className="hover:text-primary transition">
            Política de Privacidad
          </a>
        </div>
        <p className="text-center text-muted text-xs">
          © 2025 Jeffmart. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
