import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <div className="flex-shrink-0">
      <Link href="/">
        <Image src="/one.png" alt="logo" width={100} height={100} />
      </Link>
    </div>
  );
}
