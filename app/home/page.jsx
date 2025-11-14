// /app/page.jsx
import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/admin/home");
}
