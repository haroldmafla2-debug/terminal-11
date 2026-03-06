import { redirect } from "next/navigation";

export default function GuardianHomePage() {
  redirect("/guardian/children");
}
