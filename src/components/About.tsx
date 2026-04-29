"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  Download,
  Sparkles,
  Code as CodeIcon,
  Award,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function About() {
  const [projectCount, setProjectCount] = useState<number | string>("-");
  const [certCount, setCertCount] = useState<number | string>("-");

  useEffect(() => {
    async function fetchCounts() {
      const [{ count: pCount }, { count: cCount }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ]);
      setProjectCount(pCount ?? 0);
      setCertCount(cCount ?? 0);
    }
    fetchCounts();
  }, []);

  const stats = [
    {
      icon: <CodeIcon size={24} />,
      number: projectCount,
      title: "TOTAL PROJECTS",
      description: "Innovative web solutions crafted",
      delay: 0.1,
      href: "/#showcase",
    },
    {
      icon: <Award size={24} />,
      number: certCount,
      title: "CERTIFICATES",
      description: "Professional skills validated",
      delay: 0.2,
      href: "/?tab=certificates#showcase",
    },
  ];

  return (
    <section id="about" className="pt-32 pb-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-deep-blue dark:text-white mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-bright-blue font-bold">
            <Sparkles size={16} />
            <span>Transforming ideas into digital experiences</span>
            <Sparkles size={16} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-8 lg:sticky lg:top-32 max-w-3xl"
          >
            <div>
              <h3 className="text-4xl font-black text-bright-blue mb-2">Hello, I'm</h3>
              <h4 className="text-3xl font-black text-deep-blue dark:text-white mb-6">Mardhyah Fathania Izzati</h4>
              <p className="text-lg text-deep-blue/70 dark:text-gray-300 leading-relaxed font-medium">
                Fullstack Developer yang berfokus membangun pengalaman digital yang modern, fungsional, dan user-friendly serta menghadirkan solusi terbaik dalam setiap proyek pengembangan aplikasi.              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-bright-blue" />
              <Quote className="text-bright-blue/20 absolute top-4 right-4" size={40} />
              <p className="text-lg italic text-deep-blue/80 dark:text-gray-300 relative z-10 font-medium">
                "Leveraging AI as a professional tool, not a replacement."
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Download CV */}
              <a
                href="/Mardhyah Fathania Izzati-CV.pdf"
                download
                className="px-8 py-4 bg-bright-blue text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-bright-blue/20 hover:scale-105 transition-all"
              >
                <Download size={18} />
                Download CV
              </a>

              {/* View Projects */}
              <Link
                href="#showcase"
                className="px-8 py-4 bg-transparent border border-gray-200 dark:border-white/10 text-deep-blue dark:text-white rounded-2xl font-black flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <CodeIcon size={18} />
                View Projects
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Dynamic stats cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {stats.map((stat) => (
              <motion.a
                href={stat.href}
                key={stat.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: stat.delay }}
                className="relative group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer block"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-bright-blue/10 flex items-center justify-center text-bright-blue transition-colors group-hover:bg-bright-blue group-hover:text-white">
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black text-deep-blue dark:text-white group-hover:text-bright-blue transition-colors">
                    {stat.number}
                  </div>
                </div>

                <div className="relative">
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {stat.title}
                  </h5>
                  <p className="text-sm text-deep-blue/60 dark:text-gray-400 font-bold leading-none">
                    {stat.description}
                  </p>

                  <div className="absolute bottom-0 right-0 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-bright-blue transition-all">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-bright-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
