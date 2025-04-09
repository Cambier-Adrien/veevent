import Link from "next/link";
import Image from "next/image";
import niceImage from "../assets/images/nice.jpg";
import { ArrowUpRightCircleSolid } from "iconoir-react";

export default function CityCard() {
  return (
    <Link href="/" className="city-card">
      <Image src={niceImage} alt="Nice" fill className="object-cover" />

      <div className="p-6 h-full w-full flex flex-col gap-12 z-10">
        <div className="flex justify-between items-center">
          <p>8 événéments</p>
          <p className="!font-extrabold">Paris</p>
        </div>

        <div className="flex items-end gap-8">
          <p className="!text-xl flex-1">Découvrez les événements de Paris</p>
          <ArrowUpRightCircleSolid />
        </div>
      </div>

      <div className="absolute bg-gradient-to-tr from-transparent to-[var(--secondary-blue)] opacity-50 h-full w-full"></div>
      <div className="absolute bg-gradient-to-bl from-transparent to-black opacity-50 h-full w-full"></div>
    </Link>
  );
}
