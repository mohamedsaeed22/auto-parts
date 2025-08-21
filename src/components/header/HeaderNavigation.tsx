import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderNavigationProps {
  navLinks: NavLink[];
  isActiveLink: (href: string) => boolean;
  isRTL: boolean;
}

export default function HeaderNavigation({
  navLinks,
  isActiveLink,
  isRTL,
}: HeaderNavigationProps) {
  return (
    <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <nav className="flex items-center justify-center gap-8 h-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative py-2 text-sm font-medium transition-all duration-300 ${
                isActiveLink(link.href)
                  ? "text-logo-gold"
                  : "text-gray-700 hover:text-logo-gold"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-2 ${
                  isRTL ? "right-0" : "left-0"
                } w-full h-0.5 bg-logo-gold transform ${
                  isRTL ? "origin-right" : "origin-left"
                } transition-transform duration-300 ${
                  isActiveLink(link.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
