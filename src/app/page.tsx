import underConstruction from "@/assets/under-construction.png";
import Image from "next/image";
import { AuthStatus } from "./auth-status";

export default function Page() {
  return (
    <div>
      <p>hello world</p>
      <Image
        placeholder="blur"
        src={underConstruction}
        alt="under construction"
      />
      <AuthStatus />
    </div>
  );
}
