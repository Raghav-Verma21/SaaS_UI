import {
  ArrowRightIcon,
  CloudUploadIcon,
  FileCheck2Icon,
  FolderUpIcon,
  ShieldCheckIcon,
  TableIcon,
} from "lucide-react";

import { howItWorksSteps } from "@/components/dashboard/dashboard-constants";

const stepIcons = [
  CloudUploadIcon,
  TableIcon,
  FolderUpIcon,
  ShieldCheckIcon,
  FileCheck2Icon,
] as const;

export function HowItWorksSection() {
  return (
    <section className="dashboard-how-it-works">
      <h2 className="dashboard-how-it-works__title">How it works</h2>

      <div className="dashboard-how-it-works__steps">
        {howItWorksSteps.map(({ step, title, description }, index) => {
          const Icon = stepIcons[index];
          const isLast = index === howItWorksSteps.length - 1;

          return (
            <div key={title} className="dashboard-how-it-works__step">
              <div className="dashboard-how-it-works__step-content">
                <div className="dashboard-how-it-works__icon-wrap">
                  <Icon className="dashboard-how-it-works__icon" aria-hidden="true" />
                  <span className="dashboard-how-it-works__step-badge">{step}</span>
                </div>
                <h3 className="dashboard-how-it-works__step-title">{title}</h3>
                <p className="dashboard-how-it-works__step-description">{description}</p>
              </div>

              {!isLast && (
                <div className="dashboard-how-it-works__arrow">
                  <ArrowRightIcon
                    className="dashboard-how-it-works__arrow-icon"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
