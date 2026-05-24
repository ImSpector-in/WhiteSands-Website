import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | White Sands Construction",
  description:
    "Full-service general contracting across the Hawaiian Islands — custom homes, hotel renovation, restaurant fit-out, concrete, and finish carpentry.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
