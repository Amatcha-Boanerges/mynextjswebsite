import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          565 Company
        </Link>
        <ul className="flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
} 