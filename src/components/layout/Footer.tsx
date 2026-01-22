import { Github, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:contact@example.com"
              className="hover:text-blue-400 transition"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Author:Liu-Han,Yu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
