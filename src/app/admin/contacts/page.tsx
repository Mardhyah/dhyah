"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setContacts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    await supabase.from("portfolio_contacts").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-deep-blue dark:text-white">Pesan Masuk</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {contacts.length} pesan dari pengunjung portofolio
          </p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-bright-blue/10 text-bright-blue rounded-2xl">
          <Mail size={24} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-bright-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-deep-blue dark:text-white mb-2">Belum Ada Pesan</h3>
          <p className="text-muted-foreground text-sm">Pesan dari pengunjung akan muncul di sini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {contacts.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-[#002a3a] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bright-blue/10 flex items-center justify-center text-bright-blue flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-black text-deep-blue dark:text-white">{contact.name}</p>
                      <a
                        href={`mailto:${contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-bright-blue hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                      <Clock size={12} /> {formatDate(contact.created_at)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="text-muted-foreground">
                      {expanded === contact.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Message */}
                <AnimatePresence>
                  {expanded === contact.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Pesan</p>
                          <p className="text-deep-blue dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {contact.message}
                          </p>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <a
                            href={`mailto:${contact.email}?subject=Re: Pesan dari Portofolio`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-bright-blue text-white rounded-xl text-sm font-bold hover:bg-deep-blue transition-all"
                          >
                            <Mail size={16} /> Balas Email
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
