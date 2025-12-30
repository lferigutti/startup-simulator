import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              className="text-zinc-500 hover:text-white transition-colors"
              href="https://github.com/lferigutti"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
            <a
              className="text-zinc-500 hover:text-white transition-colors"
              href="https://www.linkedin.com/in/leonardo-ferigutti-859913122/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={24} />
            </a>
            <a
              className="text-zinc-500 hover:text-white transition-colors"
              href="mailto:contact@ferigutti.com"
              aria-label="Email"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-zinc-600">
            © 2025 Leonardo Ferigutti
          </p>
        </div>
      </div>
    </footer>
  );
}
