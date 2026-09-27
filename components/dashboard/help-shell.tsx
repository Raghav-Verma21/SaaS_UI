"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CircleHelpIcon,
  CopyIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MailIcon,
  ScrollTextIcon,
} from "lucide-react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { helpFaqItems } from "@/components/dashboard/dashboard-constants";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  BRAND,
  feedbackDraftText,
  feedbackGmailUrl,
  feedbackMailto,
  feedbackOutlookUrl,
} from "@/lib/brand";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    href: "/documents",
    icon: FileTextIcon,
    title: "Documents",
    desc: "Upload and validate trade documents",
  },
  {
    href: "/reports",
    icon: ScrollTextIcon,
    title: "Reports",
    desc: "Review compliance findings",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    title: "Dashboard",
    desc: "LC overview and summary",
  },
] as const;

export function HelpShell() {
  const user = useDashboardUserDisplay();
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<string>();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const canSend = message.trim().length > 0;

  async function copyDraft() {
    if (!canSend) return;
    try {
      await navigator.clipboard.writeText(feedbackDraftText(message, user.label));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <DashboardAppShell
      title="Help & Support"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
    >
      <div className="help-page">
        <div className="help-page__center">
          <div className="help-page__grid">
            <article className="help-page__card ui-card">
              <header className="help-page__card-head">
                <div className="help-page__icon-wrap" aria-hidden="true">
                  <LifeBuoyIcon className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="help-page__eyebrow">Contact support</p>
                  <h2 className="help-page__title">Send us a message</h2>
                  <p className="help-page__lead">
                    Write your feedback below, then send via Gmail, Outlook, or your mail app.
                  </p>
                </div>
                <div className="help-page__contact-pill">
                  <MailIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span>{BRAND.feedbackEmail}</span>
                </div>
              </header>

              <div className="help-page__body">
                <div className="help-page__field">
                  <Label htmlFor="feedback-message">Your message</Label>
                  <textarea
                    id="feedback-message"
                    className={cn("help-page__textarea", "ui-textarea")}
                    rows={12}
                    placeholder="Tell us what you need help with, what happened, or what we could improve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="help-page__send-block">
                  <p className="help-page__send-label">Send via</p>
                  <div className="help-page__actions">
                    <Button
                      type="button"
                      size="lg"
                      className="help-page__action-primary"
                      disabled={!canSend}
                      onClick={() =>
                        window.open(feedbackGmailUrl(message, user.label), "_blank", "noopener,noreferrer")
                      }
                    >
                      Send with Gmail
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      disabled={!canSend}
                      onClick={() =>
                        window.open(feedbackOutlookUrl(message, user.label), "_blank", "noopener,noreferrer")
                      }
                    >
                      Send with Outlook
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      disabled={!canSend}
                      onClick={() => {
                        window.location.href = feedbackMailto(message, user.label);
                      }}
                    >
                      <MailIcon aria-hidden="true" />
                      Email app
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="ghost"
                      disabled={!canSend}
                      onClick={() => void copyDraft()}
                    >
                      <CopyIcon aria-hidden="true" />
                      {copied ? "Copied!" : "Copy message"}
                    </Button>
                  </div>
                </div>

                <p className="help-page__footnote">
                  We read every message. Use <strong>Copy message</strong> if no mail app opens.
                </p>
              </div>
            </article>

            <section className="help-page__faq ui-card" aria-labelledby="help-faq-title">
              <header className="help-page__faq-head">
                <div className="help-page__faq-icon-wrap" aria-hidden="true">
                  <CircleHelpIcon className="size-6" />
                </div>
                <div>
                  <h2 id="help-faq-title" className="help-page__faq-title">
                    Frequently asked questions
                  </h2>
                  <p className="help-page__faq-lead">
                    Quick answers for each step of the LC workflow.
                  </p>
                </div>
              </header>
              <Accordion
                type="single"
                collapsible
                value={openFaq}
                onValueChange={setOpenFaq}
                className="help-page__accordion"
              >
                {helpFaqItems.map(({ step, question, answer }) => (
                  <AccordionItem
                    key={step}
                    value={`step-${step}`}
                    className="help-page__accordion-item"
                    onMouseEnter={() => setOpenFaq(`step-${step}`)}
                  >
                    <AccordionTrigger className="help-page__accordion-trigger">
                      <span className="help-page__accordion-trigger-text">
                        <span className="help-page__accordion-step">Step {step}</span>
                        <span className="help-page__accordion-question">{question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="help-page__accordion-content">
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          <section className="help-page__quick-links" aria-label="Quick links">
            {quickLinks.map(({ href, icon: Icon, title, desc }) => (
              <Link key={href} href={href} className="help-page__quick-link">
                <Icon className="help-page__quick-link-icon size-5" aria-hidden="true" />
                <span className="help-page__quick-link-title">{title}</span>
                <span className="help-page__quick-link-desc">{desc}</span>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </DashboardAppShell>
  );
}
