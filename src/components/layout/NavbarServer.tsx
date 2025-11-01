import { getNavbarData } from "~/sanity/utils/getNavbarData";
import NavbarClient from "./NavbarClient";

/**
 * Server Component wrapper for Navbar
 * Fetches navbar data and passes it to client component
 */
export default async function Navbar() {
  const megaMenuData = await getNavbarData();

  return <NavbarClient megaMenuData={megaMenuData} />;
}
