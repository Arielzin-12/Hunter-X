import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

const links = [
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
];

export function Logo({ className = "" }: { className?: string }) {
  return <img src="/hunterx-wordmark.svg" alt="HunterX" className={`h-9 w-auto object-contain ${className}`} />;
}
