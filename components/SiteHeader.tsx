import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const logoImages = {
  light: "/dictionary-logo-light.png",
  dark: "/dictionary-logo-dark.png",
};

export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label="Dictionary home">
          <Image
            className="site-logo__image site-logo__image--light"
            src={logoImages.light}
            alt="Dictionary"
            width={700}
            height={700}
            priority
          />
          <Image
            className="site-logo__image site-logo__image--dark"
            src={logoImages.dark}
            alt="Dictionary"
            width={700}
            height={700}
            priority
          />
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/">Dictionary</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
