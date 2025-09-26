"use client";
import { motion } from "framer-motion";
import { FiHeadphones, FiMail, FiPhoneCall } from "react-icons/fi";
import { Social } from "~/../typings";
import { getIcon } from "~/sanity/utils/iconMapper";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { Button } from "./ui/moving-border";
import { SparklesCore } from "./ui/sparkles";

interface HeroProps {
  socials: Social[];
}

export default function Hero({ socials }: HeroProps) {
  const handleScroll = () => {
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full z-10">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
          src="/assets/sample_1.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/sample_1.mp4"
        />
        {/* Enhanced dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Subtle radial glow */}
        <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_20%_30%,rgba(42,227,148,0.12),transparent_60%)]" />
      </div>

      <div className="relative h-full container mx-auto flex items-start sm:items-center justify-start px-4 pt-20 pb-24 sm:pt-0 sm:pb-0">
        {/* Left: Messaging */}
        <div className="w-full max-w-2xl text-left break-words">
          <HeroHighlight containerClassName="justify-start">
            <TextGenerateEffect
              words="Elevate Experience"
              className="mt-4 text-4xl sm:text-6xl md:text-7xl leading-tight font-extrabold text-white tracking-tight drop-shadow-2xl"
            />
          </HeroHighlight>

          <TextGenerateEffect
            words="Design, installation, and maintenance engineered for precision, safety, and seamless passenger experience."
            className="mt-5 text-lg md:text-2xl text-white font-medium max-w-[46ch] drop-shadow-lg"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-3 justify-start"
          >
            <a
              href="#contact"
              className="btn btn-primary shadow-xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 transform hover:scale-105"
            >
              Get a Quote
            </a>
            <a
              href="#services"
              className="btn btn-ghost border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View Services
            </a>
          </motion.div>
          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-6 text-sm text-white/70"
          >
            Trusted by residential, commercial, and industrial projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 h-px w-full max-w-sm bg-gradient-to-r from-white/0 via-white/60 to-white/0"
            aria-hidden
          />

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.32, duration: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <div className="flex items-start gap-4 text-sm text-white/80">
              <span className="text-xs uppercase tracking-[0.28em] text-white/60 pt-1.5">
                Connect
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {socials?.map((social) => {
                  const Icon = getIcon(social.icon);
                  return (
                    <a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/10 px-3 py-1.5 text-white transition hover:text-accent"
                    >
                      {Icon && (
                        <Icon className="text-lg text-accent" aria-hidden />
                      )}
                      <span>{social.title}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.42, duration: 0.6, ease: "easeOut" }}
            className="mt-7 flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-2 text-white/90"
          >
            <a
              href="tel:18008908411"
              className="flex w-full sm:w-auto items-start gap-3 rounded-[10px] border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 select-text"
            >
              <FiHeadphones
                className="mt-0.5 shrink-0 text-2xl text-accent"
                aria-hidden
              />
              <div className="space-y-1 leading-tight">
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                  Liftronic Care
                </p>
                <span className="block text-base font-semibold text-white">
                  1800 890 8411
                </span>
              </div>
            </a>
            <a
              href="mailto:info@liftronicelevator.com"
              className="flex w-full sm:w-auto items-start gap-3 rounded-[10px] border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 select-text"
            >
              <FiMail
                className="mt-0.5 shrink-0 text-2xl text-accent"
                aria-hidden
              />
              <div className="space-y-1 leading-tight">
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                  Send us Email
                </p>
                <span className="block text-base font-semibold text-white">
                  info@liftronicelevator.com
                </span>
              </div>
            </a>
            <div className="flex w-full sm:w-auto items-start gap-3 rounded-[10px] border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 hover:shadow-lg hover:shadow-accent/20 focus-within:outline-none focus-within:ring-2 focus-within:ring-white/60 select-text">
              <FiPhoneCall
                className="mt-0.5 shrink-0 text-2xl text-accent"
                aria-hidden
              />
              <div className="space-y-1 leading-tight">
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                  Sales Enquiry
                </p>
                <a
                  href="tel:+919028226664"
                  className="block text-base font-semibold text-white transition hover:text-accent"
                >
                  +91 9028226664
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue (clickable) */}
        <button
          type="button"
          onClick={handleScroll}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md px-2 py-1 hover:text-white transition"
          aria-label="Scroll to content"
        >
          <div className="flex flex-col items-center">
            <span>Scroll</span>
            <svg
              className="mt-1 animate-bounce"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}
