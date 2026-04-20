"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MessageSquare, 
  Eye,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    comments: 0,
    visits: 1240, // Mock data for now
  });
  const [recentComments, setRecentComments] = useState<any[]>([]);

  useEffect(() => {
    async function getStats() {
      const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      const { count: commentCount } = await supabase
        .from("portfolio_comments")
        .select("*", { count: "exact", head: true });

      const { data: recentCommentsData } = await supabase
        .from("portfolio_comments")
        .select("id, name, comment, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      setStats(prev => ({
        ...prev,
        projects: projectCount || 0,
        comments: commentCount || 0,
      }));
      
      if (recentCommentsData) {
        setRecentComments(recentCommentsData);
      }
    }
    getStats();
  }, []);

  const cards = [
    { title: "Total Proyek", value: stats.projects, icon: <Briefcase size={24} />, color: "bg-blue-500" },
    { title: "Komentar", value: stats.comments, icon: <MessageSquare size={24} />, color: "bg-emerald-500" },
    { title: "Pengunjung", value: stats.visits, icon: <Eye size={24} />, color: "bg-orange-500" },
    { title: "Konversi", value: "8.2%", icon: <TrendingUp size={24} />, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white dark:bg-[#002a3a] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} bg-opacity-10 p-3 rounded-xl text-white`}>
                <div className={card.color.replace('bg-', 'text-')}>
                    {card.icon}
                </div>
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                +12% <ArrowUpRight size={12} />
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold text-deep-blue dark:text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#002a3a] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          <h3 className="text-lg font-bold text-deep-blue dark:text-white mb-6">Aktivitas Terkini</h3>
          <div className="space-y-6">
            {recentComments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Belum ada aktivitas baru.</p>
            ) : (
              recentComments.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bright-blue/10 flex items-center justify-center text-bright-blue">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm dark:text-white">Komentar baru dari "{item.name}"</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.comment}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0" suppressHydrationWarning>
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#002a3a] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          <h3 className="text-lg font-bold text-deep-blue dark:text-white mb-6">Navigasi Cepat</h3>
          <div className="space-y-4">
            <button className="w-full py-4 px-6 bg-deep-blue text-white rounded-xl font-bold text-sm hover:bg-bright-blue transition-all">
              Tambah Proyek Baru
            </button>
            <button className="w-full py-4 px-6 border border-gray-200 dark:border-white/10 text-deep-blue dark:text-white rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Lihat Statistik Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
