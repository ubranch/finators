import Link from 'next/link';
import Image from 'next/image';
import {ThemeToggle} from "@/components/ThemeToggle";

export function Header() {
    return (
        <header className="flex justify-between items-center bg-background/80 backdrop-blur-sm px-2 pb-6">
            <Link href="/" className="font-bold text-3xl flex items-center">
                <Image
                    src="/favicon.png"
                    alt="Finators Logo"
                    width={40}
                    height={40}
                    className="mr-2 rounded-lg"
                />
                Finators
            </Link>
            <ThemeToggle/>
        </header>
    );
}
