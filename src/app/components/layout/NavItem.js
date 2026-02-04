import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem({ item, onClick }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className="text-2xl">{item.icon}</span>
      <span className="font-semibold">{item.name}</span>
    </Link>
  );
}