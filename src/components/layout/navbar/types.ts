import type { ProductRange } from "~/sanity/lib/productRangeTypes";
import type { ServiceOffered } from "~/sanity/lib/serviceTypes";
import type { ContactInfo } from "~/../typings";

/**
 * Navigation item configuration
 */
export type NavItem = {
  href: string;
  label: string;
  hasMegaMenu?: boolean;
  megaMenuType?: "products" | "services";
  highlight?: boolean;
};

/**
 * Mega menu data passed to components
 */
export type MegaMenuData = {
  productRanges: ProductRange[];
  services: ServiceOffered[];
  contactInfo: ContactInfo | null;
};

/**
 * Mega menu state and control
 */
export type MegaMenuState = {
  isOpen: boolean;
  activeMenu: "products" | "services" | null;
  activeRangeId: string | null;
};

/**
 * Mega menu actions
 */
export type MegaMenuActions = {
  openMenu: (menuType: "products" | "services") => void;
  closeMenu: () => void;
  setActiveRange: (rangeId: string | null) => void;
};
