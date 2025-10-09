import { TestimonialCard } from "./testimonial-card";

const testimonials = [
  {
    title: "Transparent Financial Management",
    quote:
      "Sharix made our co-op's finances transparent and incredibly easy to manage. The automated tracking saved us countless hours of manual work.",
    name: "Alex Johnson",
    role: "Co-op Manager",
    avatarUrl: "/professional-person.jpg",
  },
  {
    title: "Seamless Collaboration",
    quote:
      "The role-based dashboards give everyone exactly what they need to see. No more confusion about who owes what or when payments are due.",
    name: "Sarah Chen",
    role: "Team Lead",
    avatarUrl: "/professional-woman.png",
  },
  {
    title: "Solid Foundation",
    quote:
      "This is a very complex and beautiful set of elements. Under the hood it comes with the best things from 2 different worlds: Figma and Tailwind.",
    name: "Bonnie Green",
    role: "CTO ",
    avatarUrl: "/professional-executive.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            What Our Users Say
          </h2>
          <p className="text-gray-500">
            Trusted by teams and cooperatives worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
