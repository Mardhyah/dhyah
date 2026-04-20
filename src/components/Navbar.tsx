"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#showcase" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "max-w-7xl mx-auto transition-all duration-500 rounded-[2rem] py-3 px-4",
          scrolled
            ? "bg-white/80 dark:bg-[#001824]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/5"
            : "bg-background/60 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 shadow-sm"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-bright-blue to-deep-blue rounded-2xl flex items-center justify-center text-white text-base font-black shadow-lg shadow-bright-blue/30"
            >
              M
            </motion.div>
            <span className="hidden sm:inline font-black text-deep-blue dark:text-white text-lg tracking-tight">
              Mardhyah<span className="text-bright-blue">.</span>
            </span>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center bg-gray-100/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 p-1.5 rounded-2xl gap-1">
            {navLinks.map((link) => {
              const isActive = activeLink === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveLink(link.name)}
                  className="relative px-5 py-2 text-sm font-bold rounded-xl transition-colors duration-200 text-deep-blue/70 dark:text-white/60 hover:text-deep-blue dark:hover:text-white"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className={cn("relative z-10", isActive && "text-deep-blue dark:text-white")}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="#contact"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-deep-blue dark:bg-bright-blue text-white rounded-2xl text-sm font-bold hover:opacity-90 hover:scale-105 transition-all shadow-md shadow-deep-blue/20 dark:shadow-bright-blue/20"
            >
              <Mail size={16} />
              <span className="hidden lg:inline">Contact Me</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-deep-blue dark:text-white rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-white/10"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 pt-4 pb-2 border-t border-gray-100 dark:border-white/5 mt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => { setIsOpen(false); setActiveLink(link.name); }}
                      className="flex items-center justify-between p-4 rounded-2xl font-bold text-deep-blue dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                    >
                      <span>{link.name}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-bright-blue transition-opacity text-sm">→</span>
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-gray-100 dark:border-white/5 mt-1">
                  <Link
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-4 bg-bright-blue text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                  >
                    <Mail size={16} /> Contact Me
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
