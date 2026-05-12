import Link from 'next/link';
import { Zap, Github, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Drops', href: '/products?tag=new' },
    { label: 'Limited Edition', href: '/products?tag=limited' },
    { label: 'Sale', href: '/products?tag=sale' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'FAQ', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Size Guide', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-obsidian-50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Aitherios home">
              <div className="w-8 h-8 bg-crimson-500 rounded-lg flex items-center justify-center shadow-glow-sm">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-lg tracking-widest uppercase">
                Aitherios
              </span>
            </Link>
            <p className="text-sm text-steel-300 leading-relaxed max-w-xs mb-6">
              Engineered for those who operate above the noise. Premium gear for a world
              that demands more.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Twitter size={16} />, label: 'Twitter', href: '#' },
                { icon: <Instagram size={16} />, label: 'Instagram', href: '#' },
                { icon: <Github size={16} />, label: 'GitHub', href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:border-crimson-500/50 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-display font-bold text-xs tracking-widest uppercase text-steel-200 mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-steel-300 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display font-bold text-white mb-1">
                Join the Antigravity Network
              </p>
              <p className="text-sm text-steel-300">
                Early access. Zero noise. 100% fire.
              </p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-400 border border-white/10 focus:outline-none focus:border-crimson-500 w-full md:w-64 transition-all"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-crimson-500 rounded-lg text-white text-sm font-display font-bold tracking-wider uppercase hover:bg-crimson-600 hover:shadow-glow transition-all duration-200 whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-steel-400">
            © {new Date().getFullYear()} Aitherios. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-steel-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
