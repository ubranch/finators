import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="flex justify-between items-center bg-background/80 backdrop-blur-sm py-4 px-2">
      <Link href="/" className="font-bold text-xl flex items-center">
        <Image
          src="/favicon.png"
          alt="Finators Logo"
          width={36}
          height={36}
          className="mr-2 rounded-lg"
        />
        Finators
      </Link>
      <ThemeToggle />
    </header>
  );
}
