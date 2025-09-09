import underConstruction from "@/assets/under-construction.png";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <p>hello world</p>
      <Image
        placeholder="blur"
        src={underConstruction}
        alt="under construction"
      />
    </div>
  );
}
