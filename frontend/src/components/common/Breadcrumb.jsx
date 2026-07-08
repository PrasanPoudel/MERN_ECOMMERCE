import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-zinc-400 mb-6">
      {items?.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <RiArrowRightSLine size={14} className="text-zinc-300" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-zinc-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
