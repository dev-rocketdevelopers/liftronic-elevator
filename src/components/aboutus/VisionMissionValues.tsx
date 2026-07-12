import { getIcon } from "~/sanity/utils/iconMapper";
import type { VisionMissionValues as VMVType } from "~/sanity/lib/aboutTypes";

const FALLBACK_CREATED_AT = "1970-01-01T00:00:00.000Z";

// Fallback data
const fallbackVMV: VMVType = {
  _id: "fallback-vmv",
  _createdAt: FALLBACK_CREATED_AT,
  visionTitle: "Our Vision",
  visionDescription:
    "To be the global leader in vertical transportation solutions, setting new standards for safety, innovation, and customer satisfaction. We envision a world where every building is equipped with intelligent, sustainable, and reliable elevator systems that enhance the quality of life for all users.",
  visionIcon: "trending",
  missionTitle: "Our Mission",
  missionDescription:
    "To provide exceptional elevator solutions through cutting-edge technology, unparalleled service, and unwavering commitment to safety. We strive to exceed customer expectations by delivering reliable, efficient, and sustainable vertical transportation systems that connect people and communities.",
  missionIcon: "heart",
  commitmentTitle: "Our Commitment",
  commitmentDescription:
    "Integrity, Excellence, Innovation, Safety, and Customer-Centricity form the foundation of everything we do. These values guide our decisions, shape our culture, and drive our commitment to delivering superior elevator solutions that our customers can trust and rely on.",
  commitmentIcon: "shield",
  values: [
    {
      title: "Safety First",
      description:
        "Safety is our top priority in every project, ensuring the wellbeing of passengers and technicians alike.",
      icon: "shield",
    },
    {
      title: "Pursuit of Excellence",
      description:
        "We continuously strive for perfection in every aspect of our service delivery and product quality.",
      icon: "star",
    },
    {
      title: "Innovation",
      description:
        "We embrace cutting-edge technology and creative solutions to stay ahead of industry trends.",
      icon: "trending",
    },
    {
      title: "Integrity",
      description:
        "Honesty, transparency, and ethical business practices form the foundation of all our relationships.",
      icon: "heart",
    },
    {
      title: "Sustainability",
      description:
        "We're committed to environmentally responsible practices and energy-efficient solutions.",
      icon: "globe",
    },
    {
      title: "Customer Focus",
      description:
        "Our customers' success and satisfaction drive every decision we make and service we provide.",
      icon: "user",
    },
  ],
};

type VisionMissionValuesProps = {
  data?: VMVType;
};

export default function VisionMissionValues({
  data,
}: VisionMissionValuesProps) {
  const vmvInfo = data || fallbackVMV;

  // Transform backend data to component format
  const vmvData = [
    {
      id: "vision",
      title: vmvInfo.visionTitle || "Our Vision",
      content: vmvInfo.visionDescription,
      iconName: vmvInfo.visionIcon || "trending",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "mission",
      title: vmvInfo.missionTitle || "Our Mission",
      content: vmvInfo.missionDescription,
      iconName: vmvInfo.missionIcon || "heart",
      color: "from-accent to-green-500",
    },
    {
      id: "commitment",
      title: vmvInfo.commitmentTitle || "Our Commitment",
      content: vmvInfo.commitmentDescription,
      iconName: vmvInfo.commitmentIcon || "shield",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const coreValues = (vmvInfo.values || []).map((value, index) => ({
    id: `value-${index}`,
    title: value.title,
    description: value.description,
    iconName: value.icon || "star",
    color: [
      "bg-red-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-accent",
      "bg-green-500",
      "bg-purple-500",
    ][index % 6],
  }));

  return (
    <section
      id="vmv-section"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Our Foundation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built on strong principles and guided by a clear vision, we&apos;re
            committed to transforming the vertical transportation industry
            through innovation and excellence.
          </p>
        </div>

        {/* Vision, Mission, Values Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {vmvData.map((item) => (
            <article key={item.id} className="group cursor-pointer">
              <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full hover:ring-2 hover:ring-accent">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                    aria-hidden="true"
                  >
                    {(() => {
                      const Icon = getIcon(item.iconName);
                      return Icon ? <Icon className="text-3xl" /> : null;
                    })()}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-charcoal mb-4 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {item.content}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Core Values Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-charcoal text-center mb-12">
            Our Core Values in Action
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <article
                key={value.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-2"
              >
                <div
                  className={`w-12 h-12 ${value.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  {(() => {
                    const Icon = getIcon(value.iconName);
                    return Icon ? <Icon className="text-2xl" /> : null;
                  })()}
                </div>

                <h4 className="text-lg font-bold text-charcoal mb-3 group-hover:text-accent transition-colors">
                  {value.title}
                </h4>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
