"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  MessageSquare, 
  User, 
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
  is_approved: boolean; // Option for moderation
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("portfolio_comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setComments(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus komentar ini?")) {
      await supabase.from("portfolio_comments").delete().eq("id", id);
      fetchComments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#002a3a] border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-deep-blue dark:text-gray-300 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-8 py-5">Pengirim</th>
                <th className="px-8 py-5">Komentar</th>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bright-blue/10 flex items-center justify-center text-bright-blue">
                        <User size={14} />
                      </div>
                      <span className="font-bold text-sm text-deep-blue dark:text-white">{comment.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-muted-foreground max-w-md line-clamp-2">{comment.comment}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-muted-foreground" suppressHydrationWarning>
                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-8 py-12 text-center text-muted-foreground">
                      Tidak ada komentar untuk ditampilkan.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
