"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Code2, 
  Layers, 
  ExternalLink,
  Star
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  tags: string[];
  features: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching project detail:", error);
      }
      if (data) {
        setProject(data);
      }
      setLoading(false);
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-bright-blue animate-spin mb-4" />
          <p className="text-deep-blue dark:text-white font-medium tracking-widest text-sm uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-deep-blue dark:text-white">
        <h1 className="text-4xl font-black mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Proyek tidak ditemukan.</p>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all text-sm font-bold">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-deep-blue dark:text-white selection:bg-bright-blue/30 overflow-x-hidden pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation & Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 text-sm font-medium mb-12 sm:mb-16"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent shadow-sm hover:shadow-md hover:border-bright-blue/30 transition-all text-deep-blue dark:text-white"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="flex items-center gap-2 text-muted-foreground hidden sm:flex">
            <span>Projects</span>
            <span className="text-gray-300 dark:text-white/30 text-xs">/</span>
            <span className="text-deep-blue dark:text-white font-bold">{project.title}</span>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
          
          {/* Left Column (Content) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-4 text-deep-blue dark:text-white">
              {project.title}
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-bright-blue to-purple-500 rounded-full mb-8 shadow-sm" />
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-12">
              {project.description}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-10 max-w-xl">
               <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 group-hover:bg-bright-blue/10 rounded-full text-bright-blue transition-colors">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-none text-deep-blue dark:text-white">{project.tags?.length || 0}</h3>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">Total Teknologi</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 group-hover:bg-purple-500/10 rounded-full text-purple-500 dark:text-purple-400 transition-colors">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-none text-deep-blue dark:text-white">{project.features?.length || 0}</h3>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">Fitur Utama</p>
                  </div>
               </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              {project.link && (
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 hover:border-bright-blue/50 hover:bg-bright-blue/5 rounded-xl font-bold transition-all shadow-sm text-deep-blue dark:text-white"
                >
                  <ExternalLink size={18} className="text-bright-blue" /> 
                  <span>Live Demo</span>
                </a>
              )}
              {project.github && (
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl font-bold transition-all shadow-sm text-deep-blue dark:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-deep-blue dark:text-white opacity-80"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.04c3.7-.4 8-1.8 8-8.96a7.2 7.2 0 0 0-2-5.06 7.2 7.2 0 0 0-.2-5.06s-1.5-.4-5 2a14.4 14.4 0 0 0-4 0 14.4 14.4 0 0 0-5-2 7.2 7.2 0 0 0-.2 5.06 7.2 7.2 0 0 0-2 5.06c0 7.16 4.3 8.56 8 8.96a4.8 4.8 0 0 0-1 3.04v4"/><path d="M9 18c-3.14 1-3.9-1.4-6-2"/></svg>
                  <span>Github</span>
                </a>
              )}
            </div>

            {/* Technologies Used */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-deep-blue dark:text-white">
                <Code2 size={20} className="text-bright-blue" /> Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags && project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm rounded-lg text-sm font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-bright-blue" /> {tag}
                  </span>
                ))}
              </div>
            </div>
            
          </motion.div>

          {/* Right Column (Visual) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Main Project Image */}
            <div className="w-full aspect-[16/10] bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 p-2 overflow-hidden shadow-xl relative group">
               {project.image ? (
                 <img 
                   src={project.image} 
                   alt={project.title} 
                   className="w-full h-full object-cover rounded-[2rem] filter brightness-[0.95] dark:brightness-90 group-hover:brightness-100 transition-all duration-700" 
                 />
               ) : (
                 <div className="w-full h-full rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-muted-foreground font-medium">
                   Belum Ada Gambar
                 </div>
               )}
            </div>

            {/* Key Features Panel */}
            <div className="w-full bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 md:p-8 shadow-md">
              <h3 className="flex items-center gap-2 text-xl font-black mb-6 text-deep-blue dark:text-white">
                <Star size={24} className="text-yellow-500 fill-yellow-500 font-bold" /> Key Features
              </h3>
              
              <ul className="space-y-4">
                {(project.features || []).length > 0 ? (
                  project.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="mt-2 min-w-[8px] h-[8px] rounded-full bg-bright-blue" />
                      <p className="text-muted-foreground leading-relaxed font-medium">{feature}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic py-4">Belum ada rincian poin fitur yang terdaftar.</p>
                )}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
