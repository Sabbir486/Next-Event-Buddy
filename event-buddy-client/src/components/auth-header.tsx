import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="bg-secondary">
      <Link href={'/'} className="flex gap-3 items-center justify-start p-4 container mx-auto ">
        <img src="/icons/ticket-2.png" alt="Event buddy" className="w-8" />
        <h1 className="text-textPrimary font-bold text-3xl ">Event buddy</h1>
      </Link>
    </header>
  );
}
