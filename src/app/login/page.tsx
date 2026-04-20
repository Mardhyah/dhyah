"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Harap masukkan email dan kata sandi.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      // Pengecekan sukses, navigasi ke dasbor admin
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#00141d] p-6">
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{ backgroundImage: 'linear-gradient(var(--color-bright-blue) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--color-bright-blue) 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#002a3a] p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10 z-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bright-blue to-deep-blue" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-bright-blue/10 rounded-2xl flex items-center justify-center text-bright-blue mb-6 border border-bright-blue/20">
            <KeyRound size={32} />
          </div>
          <h1 className="text-3xl font-black text-deep-blue dark:text-white mb-2 text-center">
            Admin <span className="text-bright-blue">Locker</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium text-center">
            Pusat kendali eksklusif portofolio
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 mb-6 bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-bold rounded-2xl border border-red-100 dark:border-red-500/20 text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-bright-blue transition-colors" size={20} />
              <input
                type="email"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium text-deep-blue dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-bright-blue transition-colors" size={20} />
              <input
                type="password"
                placeholder="Kata Sandi Rahasia"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-bright-blue/50 outline-none transition-all font-medium text-deep-blue dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-deep-blue hover:bg-bright-blue text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:shadow-bright-blue/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Membuka Enkripsi...
              </>
            ) : (
              <>
                <LogIn size={20} /> Otorisasi Akses
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
