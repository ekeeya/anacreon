import React from "react";
import { MdDashboard, MdSettings, MdInventory, MdCategory, MdAttachMoney, MdShoppingCart } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export type SidebarLinkItem = {
  type: "link";
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type SidebarGroupItem = {
  type: "group";
  label: string;
  href?: string;
  icon: React.ReactNode;
  children: Array<{ label: string; href: string; icon: React.ReactNode }>;
};

export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

export type SidebarSection = {
  heading?: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    heading: "Overview",
    items: [
      { type: "link", label: "Dashboard", href: "/", icon: <MdDashboard className="text-blue-500 dark:text-blue-300" /> },
    ],
  },
  {
    heading: "Inventory",
    items: [
      {
        type: "group",
        label: "Inventory",
        href: "#inventory",
        icon: <MdInventory className="text-blue-500 dark:text-blue-300" />,
        children: [
          { label: "Stock & Catalog", href: "/stock", icon: <MdInventory className="text-blue-500 dark:text-blue-300" /> },
    
        ],
      },
    ],
  },
  {
    heading: "Operations",
    items: [
      { type: "link", label: "Orders", href: "/orders", icon: <MdShoppingCart className="text-blue-500 dark:text-blue-300" /> },
      { type: "link", label: "Expenditures", href: "/expenditures", icon: <MdAttachMoney className="text-blue-500 dark:text-blue-300" /> },
    ],
  },
  {
    heading: "Administration",
    items: [
      { type: "link", label: "Users", href: "/users", icon: <FaUsers className="text-blue-500 dark:text-blue-300" /> },
      { type: "link", label: "Settings", href: "/settings", icon: <MdSettings className="text-blue-500 dark:text-blue-300" /> },
    ],
  },
];


