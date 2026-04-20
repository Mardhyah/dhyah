"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form states (Left side)
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel("portfolio_comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "portfolio_comments" },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("portfolio_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("portfolio_comments")
      .insert([{ name, comment: text }]);

    if (!error) {
      setName("");
      setText("");
    }
    setIsSubmitting(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsContactSubmitting(true);
    setContactError("");

    const { error } = await supabase
      .from("portfolio_contacts")
      .insert([{ name: contactName, email: contactEmail, message: contactMessage }]);

    if (error) {
      setContactError("Gagal mengirim pesan. Coba lagi sebentar.");
    } else {
      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }
    setIsContactSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-deep-blue dark:text-white mb-6">
            Hubungi <span className="text-gradient">Saya</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Punya pertanyaan? kirim saya pesan, dan saya akan segera membalasnya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-deep-blue dark:text-white mb-2">Hubungi</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.
                </p>
              </div>
              <div className="p-3 bg-bright-blue/10 text-bright-blue rounded-2xl">
                <Send size={24} />
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-bright-blue transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-bright-blue transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="Email Anda"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-5 text-muted-foreground group-focus-within:text-bright-blue transition-colors" size={18} />
                  <textarea
                    placeholder="Pesan Anda"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium min-h-[160px] resize-none"
                  />
                </div>
              </div>

              {contactError && (
                <p className="text-sm text-red-500 font-semibold">{contactError}</p>
              )}

              {contactSent ? (
                <div className="w-full py-4 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-2xl font-black flex items-center justify-center gap-3">
                  ✓ Pesan berhasil terkirim! Saya akan segera membalas.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="w-full py-4 bg-bright-blue text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-bright-blue/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isContactSubmitting ? "Mengirim..." : <><Send size={20} /> Kirim Pesan</>}
                </button>
              )}
            </form>
          </motion.div>

          {/* Right Column: Comments System */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Comment Post Card */}
            <div className="p-8 md:p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-bright-blue/10 text-bright-blue rounded-xl">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-2xl font-black text-deep-blue dark:text-white">
                  Comments <span className="text-bright-blue">({comments.length})</span>
                </h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message <span className="text-red-500">*</span></label>
                  <textarea
                    placeholder="Write your message here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium min-h-[140px] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-bright-blue text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-bright-blue/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : <><Send size={18} /> Post Comment</>}
                </button>
              </form>
            </div>

            {/* Comments List Card */}
            <div className="p-4 md:p-6 rounded-[3rem] bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
              <div className="max-h-[380px] overflow-y-auto px-2 space-y-4 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {comments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground font-medium">
                      Belum ada komentar. Jadilah yang pertama!
                    </div>
                  ) : (
                    comments.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-[1.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-bright-blue/10 flex items-center justify-center text-bright-blue">
                              <User size={18} />
                            </div>
                            <h4 className="font-black text-deep-blue dark:text-white">
                              {item.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md" suppressHydrationWarning>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                          </span>
                        </div>
                        <p className="text-sm text-deep-blue/80 dark:text-gray-300 leading-relaxed font-medium pl-12">
                          {item.comment}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(1, 121, 197, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(1, 121, 197, 0.4);
        }
      `}</style>
    </section>
  );
}
