// app/[locale]/[...not-found]/page.tsx

import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default function CatchAll() {
  notFound();
}
