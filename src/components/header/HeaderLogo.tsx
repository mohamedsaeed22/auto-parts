import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <div className="flex-shrink-0">
      <Link href="/">
        <Image
          src="/logo-icon.jpeg"
          alt="logo"
          width={40}
          height={50}
          className="lg:w-12 lg:h-15"
        />
      </Link>
    </div>
  );
}
