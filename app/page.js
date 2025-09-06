import { authOptions } from "../lib/auth"; // adjust path if needed
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import FeedPageClient from "./feed/FeedClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }
  return <FeedPageClient />; 
}
