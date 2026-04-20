"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const skills = ["React", "Javascript", "Node.js", "Tailwind", "PHP"];

  /* =========================
     Typing Loop Animation
  ========================= */

  const roles = [
    "Informatics Graduate from Universitas Negeri Padang",
    "Tech Enthusiast",
  ];

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    const speed = isDeleting ? 35 : 60;

    const timer = setTimeout(() => {
      setText(currentRole.substring(0, charIndex));

      if (!isDeleting) {
        setCharIndex((prev) => prev + 1);

        // pause sebelum delete
        if (charIndex === currentRole.length + 5) {
          setIsDeleting(true);
        }
      } else {
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-10 overflow-hidden bg-background">

      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-bright-blue) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--color-bright-blue) 0.5px, transparent 0.5px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 flex flex-col items-start max-w-3xl">

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-black tracking-tight text-deep-blue dark:text-white mb-4 leading-[1.05]"
            >
              Fullstack <br />
              <span className="text-gradient">Developer.</span>
            </motion.h1>

            {/* Typing Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-xl md:text-2xl text-bright-blue font-bold mb-6"
            >
              <span>{text}</span>

              {/* Cursor */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-[3px] h-8 bg-bright-blue"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-deep-blue/70 dark:text-gray-300/90 mb-10 max-w-xl leading-relaxed font-medium"
            >
              Membangun solusi digital end-to-end dengan menggabungkan{" "}
              <span className="text-deep-blue dark:text-bright-blue font-bold">
                frontend interaktif dan backend yang scalable
              </span>{" "}
              untuk menciptakan pengalaman digital yang inovatif,
              fungsional, dan user-friendly.
            </motion.p>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-muted-foreground dark:text-gray-300 hover:border-bright-blue/50 transition-all shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <Link
                href="#showcase"
                className="px-10 py-4 bg-bright-blue text-white rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                Projects <ArrowUpRight size={18} />
              </Link>

              <Link
                href="#contact"
                className="px-10 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-deep-blue dark:text-white rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                Contact
              </Link>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="relative aspect-[4/5] bg-white dark:bg-white/5 p-3 rounded-[3rem] border shadow-2xl overflow-hidden">
              <img
                src="/hero-profile.jpeg"
                alt="Profile"
                className="w-full h-full object-cover rounded-[2.5rem]"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Ornaments */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-bright-blue/5 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-deep-blue/5 blur-3xl rounded-full" />
    </section>
  );
}