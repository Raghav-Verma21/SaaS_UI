import Link from "next/link";
import { ClockIcon, LinkedinIcon, MailIcon } from "lucide-react";

import { Container } from "@/components/landing/container";
import { Logo } from "@/components/landing/logo";
import { BRAND, brandCopyright, brandSupportMailto } from "@/lib/brand";

const footerLinks = {
  Product: [
    { label: "Overview", href: "#features" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About Us", href: "#footer" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Guides", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socialLinks = [
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: MailIcon, label: "Email", href: brandSupportMailto() },
  { icon: ClockIcon, label: "Support hours", href: "#" },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-background">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {BRAND.footerSlogan}
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-navy">{heading}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-navy">Connect with us</h3>
            <ul className="mt-4 flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {brandCopyright()}
          </p>
        </div>
      </Container>
    </footer>
  );
}
