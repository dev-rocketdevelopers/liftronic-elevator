"use client";

import { useState } from "react";
import type { TeamMember as TeamMemberType } from "~/sanity/lib/aboutTypes";
import TeamMemberModal from "./TeamMemberModal";

const FALLBACK_CREATED_AT = "1970-01-01T00:00:00.000Z";

// Fallback data
const fallbackMembers: TeamMemberType[] = [
  {
    _id: "1",
    _createdAt: FALLBACK_CREATED_AT,
    name: "Michael Rodriguez",
    position: "Chief Executive Officer",
    bio: "With over 20 years in the elevator industry, Michael leads Liftronic with a vision of innovation and excellence. His expertise spans from technical engineering to strategic business development.",
    image: "/illustrations/lift02.png",
    email: "michael.rodriguez@liftronic.com",
    linkedin: "#",
    featured: true,
    order: 1,
  },
  {
    _id: "2",
    _createdAt: FALLBACK_CREATED_AT,
    name: "Sarah Chen",
    position: "Chief Technology Officer",
    bio: "Sarah spearheads our technology initiatives, ensuring Liftronic stays at the forefront of elevator innovation. She holds multiple patents in elevator safety systems.",
    image: "/illustrations/lift02.png",
    email: "sarah.chen@liftronic.com",
    linkedin: "#",
    featured: true,
    order: 2,
  },
  {
    _id: "3",
    _createdAt: FALLBACK_CREATED_AT,
    name: "David Thompson",
    position: "Head of Operations",
    bio: "David oversees all installation and maintenance operations, ensuring every project meets our high standards of quality and safety. His attention to detail is unmatched.",
    image: "/illustrations/lift02.png",
    email: "david.thompson@liftronic.com",
    phone: "+1 (555) 123-4571",
    featured: true,
    order: 3,
  },
];

type TeamSectionProps = {
  members?: TeamMemberType[];
};

export default function TeamSection({ members }: TeamSectionProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(
    null,
  );
  const teamMembers = members || fallbackMembers;

  return (
    <section
      id="team-section"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Behind every successful project is our dedicated team of
            professionals. Meet the experts who make Liftronic a leader in
            elevator solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Content Section */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-charcoal mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-semibold mb-1">
                    {member.position}
                  </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed member view */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
}
