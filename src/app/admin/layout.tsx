import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import AdminNavbar from "./AdminNavBar";


export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Local Jobs", //this template title wont work on first parent page but will work on child page
  },
  description: "Find local jobs nearby",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AdminNavbar />
     {children}
    </ClerkProvider>
  );
}
