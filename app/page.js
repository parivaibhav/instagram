import { authOptions } from "../lib/auth"; // adjust path if needed
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/feed");
  } else {
    redirect("/auth/login");
  }
}
