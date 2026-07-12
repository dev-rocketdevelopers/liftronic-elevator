import { getIcon } from "~/sanity/utils/iconMapper";
import type { WhyChooseUs } from "~/sanity/lib/aboutTypes";

const FALLBACK_CREATED_AT = "1970-01-01T00:00:00.000Z";

// Fallback data
const fallbackReasons: WhyChooseUs[] = [
  {
    _id: "fallback-1",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Proven Expertise",
    description:
      "With over 15 years in the industry, we've mastered every aspect of elevator systems. Our extensive experience ensures reliable, safe, and efficient solutions for all your vertical transportation needs.",
    icon: "star",
    features: [
      "15+ Years Experience",
      "Certified Professionals",
      "Industry Leaders",
      "Proven Track Record",
    ],
    order: 1,
    active: true,
  },
  {
    _id: "fallback-2",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Uncompromising Quality",
    description:
      "We use only premium materials and cutting-edge technology in all our installations and services. Our commitment to quality means your elevators will perform reliably for decades to come.",
    icon: "shield",
    features: [
      "Premium Materials",
      "Advanced Technology",
      "Rigorous Testing",
      "Quality Assurance",
    ],
    order: 2,
    active: true,
  },
  {
    _id: "fallback-3",
    _createdAt: FALLBACK_CREATED_AT,
    title: "24/7 Support",
    description:
      "Our round-the-clock emergency service ensures you're never left stranded. With rapid response times and expert technicians, we keep your elevators running smoothly day and night.",
    icon: "support",
    features: [
      "24/7 Availability",
      "Emergency Response",
      "Expert Technicians",
      "Remote Monitoring",
    ],
    order: 3,
    active: true,
  },
  {
    _id: "fallback-4",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Cutting-Edge Technology",
    description:
      "Stay ahead with our smart elevator solutions featuring IoT integration, predictive maintenance, and energy-efficient systems that reduce costs while improving performance.",
    icon: "cog",
    features: [
      "Smart Controls",
      "IoT Integration",
      "Predictive Analytics",
      "Energy Efficient",
    ],
    order: 4,
    active: true,
  },
  {
    _id: "fallback-5",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Trusted Reliability",
    description:
      "Our maintenance programs and quality installations ensure maximum uptime for your elevators. We build lasting relationships through dependable service and consistent performance.",
    icon: "check",
    features: [
      "Preventive Maintenance",
      "Quality Installations",
      "Reliable Performance",
      "Long-term Support",
    ],
    order: 5,
    active: true,
  },
  {
    _id: "fallback-6",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Comprehensive Coverage",
    description:
      "From residential buildings to commercial complexes, we handle projects of all sizes. Our comprehensive services cover installation, maintenance, modernization, and emergency repairs.",
    icon: "globe",
    features: [
      "Residential & Commercial",
      "All Project Sizes",
      "Complete Solutions",
      "Nationwide Service",
    ],
    order: 6,
    active: true,
  },
];

type WhyUsSectionProps = {
  reasons?: WhyChooseUs[];
};

export default function WhyUsSection({ reasons }: WhyUsSectionProps) {
  const whyUsReasons = reasons || fallbackReasons;

  return (
    <section id="why-us-section" className="py-20 bg-charcoal text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose Liftronic?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover what sets us apart in the elevator industry. Our commitment
            to excellence, innovation, and customer satisfaction makes us the
            preferred choice for vertical transportation solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUsReasons.map((reason) => (
            <div key={reason._id} className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10">
                {/* Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                    {(() => {
                      const Icon = getIcon(reason.icon || "star");
                      return Icon ? <Icon className="text-3xl" /> : null;
                    })()}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {(reason.features || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/20 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
