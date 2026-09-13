"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Container } from "@/components/landing/container";
import { Logo } from "@/components/landing/logo";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const productLinks = [
  { title: "Overview", href: "#features" },
  { title: "Document Extraction", href: "#features" },
  { title: "LC Validation", href: "#features" },
  { title: "Compliance Reports", href: "#features" },
];

const resourceLinks = [
  { title: "Documentation", href: "#" },
  { title: "Guides", href: "#" },
  { title: "Blog", href: "#" },
];

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#footer" },
];

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link href="/" aria-label={`${BRAND.name} home`} className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop navigation — centered */}
        <NavigationMenu className="hidden justify-self-center lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-1 p-3">
                  {productLinks.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                        >
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <Link
                  href={link.href}
                  className={navigationMenuTriggerStyle()}
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[240px] gap-1 p-3">
                  {resourceLinks.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                        >
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTAs */}
        <div className="hidden shrink-0 items-center gap-3 justify-self-end lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="col-start-3 justify-self-end lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
              <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Product
              </p>
              {productLinks.map((link) => (
                <NavLink key={link.title} href={link.href} className="px-3 py-2">
                  {link.title}
                </NavLink>
              ))}
              {navLinks.map((link) => (
                <NavLink key={link.label} href={link.href} className="px-3 py-2">
                  {link.label}
                </NavLink>
              ))}
              <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Resources
              </p>
              {resourceLinks.map((link) => (
                <NavLink key={link.title} href={link.href} className="px-3 py-2">
                  {link.title}
                </NavLink>
              ))}
              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
