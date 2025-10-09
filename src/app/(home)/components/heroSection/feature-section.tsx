import { FeatureCard } from "./feature-card";
import { LayoutGrid, MailCheck, CreditCard, FileText } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: LayoutGrid,
      title: "Role-Based Dashboards",
      description:
        "Custom views for managers and members to see what matters most to them.",
    },
    {
      icon: MailCheck,
      title: "Seamless Email Invitations",
      description:
        "Onboard your team effortlessly with our simple email invitation system.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Options",
      description:
        "Support for various payment methods to accommodate all your members.",
    },
    {
      icon: FileText,
      title: "Automated Tracking & Reporting",
      description:
        "Generate reports and get a clear overview of all contributions automatically.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need for successful group contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
