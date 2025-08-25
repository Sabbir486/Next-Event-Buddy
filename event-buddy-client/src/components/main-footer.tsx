"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MainFooter() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return null;

  return (
    <footer className="bg-secondary w-full h-[15rem] md:h-[13rem] ">
      <div className="container mx-auto border-b-2 border-[#2C257521] pl-4 pt-8 pb-8 pr-4">
        <div className="md:grid grid-cols-2 justify-between w-full md:mt-2 ">
          <div className="flex gap-3 items-center justify-center md:justify-start container mx-auto bock  mb-5 md:mb-0 ">
            <img src="/icons/ticket-2.png" alt="Event buddy" className="w-8" />
            <h1 className="text-textPrimary font-bold text-3xl ">
              Event buddy
            </h1>
          </div>

          <div>
            <ul className="text-textPrimary flex items-center justify-center md:justify-end gap-4 ">
              <li className="hover:underline">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:underline">
                <Link href="/signin">Sign in</Link>
              </li>
              <li className="hover:underline">
                <Link href="/signup">Sign up</Link>
              </li>
              <li className="hover:underline">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[#6A6A6A] text-center font-light mt-8 md:mt-10">
          &copy; {new Date().getFullYear()} Event buddy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
