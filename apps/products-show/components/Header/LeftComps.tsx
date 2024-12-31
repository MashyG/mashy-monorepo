import { HeaderLeftData } from "@/utils/types";
import Image from "next/image";

export default function LeftComps({ logo, name }: HeaderLeftData) {
  return (
    <div className="flex items-center">
      <Image src={logo} alt="logo" width={120} height={120} />
      {name ? (
        <h1 className="text-lg ml-4 hidden sm:inline-block">{name}</h1>
      ) : null}
    </div>
  );
}
