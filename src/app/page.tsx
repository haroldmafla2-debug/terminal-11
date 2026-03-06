import { redirect } from "next/navigation";

import { getAuthContext } from "@/lib/auth/session";
import { getDefaultRolePath } from "@/lib/constants/navigation";

export default async function HomePage() {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect("/login");
  }

  redirect(getDefaultRolePath(authContext.role));
}
