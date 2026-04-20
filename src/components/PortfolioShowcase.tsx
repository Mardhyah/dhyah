"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Award,
  Layers,
  ExternalLink,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  X,
  ZoomIn
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

interface Certificate {
  id: string;
  title: string;
  provider: string;
  image: string;
}

const tabs = [
  { id: "projects", label: "Projects", icon: <Code size={20} /> },
  { id: "certificates", label: "Certificates", icon: <Award size={20} /> },
  { id: "techstack", label: "Tech Stack", icon: <Layers size={20} /> },
];

const techStack = [
  // 🌐 Frontend
  {
    name: "HTML",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "JavaScript",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "Tailwind CSS",
    iconPath:
      "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
  },
  {
    name: "ReactJS",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    iconPath:
      "https://cdn.worldvectorlogo.com/logos/next-js.svg",
  },

  // ⚙️ Backend
  {
    name: "Node.js",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "PHP",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },

  // 🗄️ Database
  {
    name: "MongoDB",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "MySQL",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },

  // 📱 Mobile Development
  {
    name: "Dart",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  },
  {
    name: "Flutter",
    iconPath:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  },
];


export default function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);


  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "certificates" || tab === "projects" || tab === "techstack") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
    fetchCertificates();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoadingProjects(false);
  };

  const fetchCertificates = async () => {
    setLoadingCerts(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCertificates(data);
    }
    setLoadingCerts(false);
  };

  return (
    <section id="showcase" className={cn("pt-24 relative overflow-hidden bg-background transition-all duration-500", activeTab === 'techstack' ? 'pb-0' : 'pb-24')}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 text-deep-blue dark:text-white">
            Portfolio <span className="text-gradient">Showcase</span>
          </h2>
          <p className="text-deep-blue/70 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Explore my journey through projects, certifications, and technical expertise.
            Each section represents a milestone in my continuous learning path.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-gray-100/80 dark:bg-white/5 backdrop-blur-md rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-8 py-3.5 rounded-[1.5rem] text-sm font-black transition-all duration-500",
                  activeTab === tab.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-deep-blue dark:hover:text-white"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-bright-blue shadow-lg"
                    style={{ borderRadius: "1.5rem" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={cn("transition-all duration-500", activeTab === 'techstack' ? 'min-h-[200px]' : 'min-h-[500px]')}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "projects" && (
                <div className="w-full">
                  {loadingProjects ? (
                    <div className="flex justify-center items-center py-20 min-h-[300px]">
                      <Loader2 className="w-10 h-10 text-bright-blue animate-spin" />
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-20 min-h-[300px] flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-muted-foreground mb-4">
                        <Code size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-deep-blue dark:text-white mb-2">Belum Ada Proyek</h3>
                      <p className="text-muted-foreground">Menunggu proyek luar biasa ditambahkan.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects.map((project, i) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="group bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                          >
                            <div className="aspect-video relative overflow-hidden">
                              {project.image ? (
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground">
                                  <ImageIcon size={40} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                              <h3 className="text-xl sm:text-2xl font-black text-deep-blue dark:text-white mb-3 group-hover:text-bright-blue transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-sm sm:text-base text-deep-blue/70 dark:text-gray-300 leading-relaxed font-medium line-clamp-2 mb-8">
                                {project.description}
                              </p>

                              {/* Card Footer */}
                              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                {project.link ? (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(project.link, "_blank");
                                    }}
                                    className="flex items-center gap-2 text-sm font-bold text-bright-blue hover:text-purple-500 transition-colors cursor-pointer"
                                  >
                                    Live Demo <ExternalLink size={16} />
                                  </div>
                                ) : (
                                  <div />
                                )}

                                <div className="flex items-center gap-2 text-sm font-bold bg-gray-100 dark:bg-white/10 text-deep-blue dark:text-white px-5 py-2.5 rounded-[0.8rem] shadow-sm group-hover:bg-bright-blue group-hover:text-white transition-all duration-300">
                                  Details <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>


                    </>
                  )}
                </div>
              )}

              {activeTab === "certificates" && (
                <div className="w-full">
                  {loadingCerts ? (
                    <div className="flex justify-center items-center py-20 min-h-[300px]">
                      <Loader2 className="w-10 h-10 text-bright-blue animate-spin" />
                    </div>
                  ) : certificates.length === 0 ? (
                    <div className="text-center py-20 min-h-[300px] flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-muted-foreground mb-4">
                        <Award size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-deep-blue dark:text-white mb-2">Belum Ada Sertifikat</h3>
                      <p className="text-muted-foreground">Prestasi dan sertifikasi akan ditampilkan di sini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {certificates.map((cert, i) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="group bg-white dark:bg-white/5 p-3 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => cert.image ? setSelectedCert(cert) : null}
                        >
                          <div className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
                            {cert.image ? (
                              <>
                                <img
                                  src={cert.image}
                                  alt={cert.title}
                                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-deep-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="bg-white text-deep-blue w-12 h-12 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                                    <ZoomIn size={24} />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Award size={40} className="text-gray-300" />
                            )}
                          </div>
                          <div className="px-4 pb-4">
                            <h4 className="font-black text-deep-blue dark:text-white group-hover:text-bright-blue transition-colors truncate">
                              {cert.title}
                            </h4>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                              {cert.provider}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "techstack" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {techStack.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-bright-blue/30 transition-all flex flex-col items-center gap-4 group"
                    >
                      <div className="w-16 h-16 flex items-center justify-center p-2">
                        <img
                          src={tech.iconPath}
                          alt={tech.name}
                          className="w-full h-full object-contain brightness-90 group-hover:brightness-100 transition-all"
                        />
                      </div>
                      <span className="text-xs font-black text-deep-blue/80 dark:text-gray-200 uppercase tracking-widest text-center">
                        {tech.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal untuk Sertifikat */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center rounded-full text-white transition-all shadow-lg border border-white/20 z-[110]"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-auto sm:aspect-video rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center group"
            >
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="w-full max-h-[85vh] object-contain rounded-3xl"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="text-2xl font-black text-white">{selectedCert.title}</h3>
                <p className="text-sm font-bold tracking-widest uppercase text-bright-blue mt-1">{selectedCert.provider}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

