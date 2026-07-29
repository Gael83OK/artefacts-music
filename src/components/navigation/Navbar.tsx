import Link from "next/link";
import { BrandLogo } from "@/components/brand";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-[#E8DED0] bg-[#F8F2E8] px-8 py-4">
      <Link href="/">
        <BrandLogo size="md" priority />
      </Link>

      <div className="flex gap-6 text-sm font-medium text-[#243B53]">
        <Link href="/">
          Accueil
        </Link>

        <Link href="/equipe">
          Équipe
        </Link>

        <Link href="/evenements">
          Événements
        </Link>

        <Link href="/materiel">
          Matériel
        </Link>
      </div>
    </nav>
  );
}