import { UserPlus, Mail, TrendingUp } from "lucide-react";
import { StepCard } from "./step-card";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Group",
    description:
      "Start by creating a dedicated space for your team's contributions.",
  },
  {
    icon: Mail,
    title: "Invite Members",
    description:
      "Easily send email invitations to bring all your members on board.",
  },
  {
    icon: TrendingUp,
    title: "Track Contributions",
    description:
      "Monitor payments and see who with our automated tracking system.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
