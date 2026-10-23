import { redirect } from "next/navigation";

/** The product starts on the dashboard (works for both server and static builds). */
export default function Home() {
  redirect("/dashboard");
}
