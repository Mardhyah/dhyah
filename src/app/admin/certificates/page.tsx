"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  X,
  Upload,
  Loader2,
  FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  title: string;
  provider: string;
  image: string;
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<Certificate>>({});

  const isPdf = (url?: string) => url?.toLowerCase().includes('.pdf') || false;

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCertificates(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('certificate-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image: ', uploadError);
      alert(`Gagal unggah: ${uploadError.message || JSON.stringify(uploadError)}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('certificate-images')
        .getPublicUrl(filePath);
        
      setCurrentCert({ ...currentCert, image: publicUrl });
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!currentCert.title || !currentCert.provider) return;

    if (currentCert.id) {
      await supabase.from("certificates").update(currentCert).eq("id", currentCert.id);
    } else {
      await supabase.from("certificates").insert([currentCert]);
    }

    setIsModalOpen(false);
    setCurrentCert({});
    fetchCertificates();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) {
      await supabase.from("certificates").delete().eq("id", id);
      fetchCertificates();
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Cari sertifikat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#002a3a] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all"
          />
        </div>
        <button
          onClick={() => {
            setCurrentCert({});
            setIsModalOpen(true);
          }}
          className="bg-deep-blue text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-bright-blue transition-all"
        >
          <Plus size={20} /> Tambah Sertifikat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCerts.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-[#002a3a] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group p-4">
            <div className="aspect-[4/3] rounded-xl relative overflow-hidden mb-4">
               {cert.image ? (
                 isPdf(cert.image) ? (
                   <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex flex-col gap-2 items-center justify-center text-muted-foreground">
                     <FileText size={32} />
                     <span className="text-xs font-bold uppercase">PDF Document</span>
                   </div>
                 ) : (
                   <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                 )
               ) : (
                 <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground">
                   Tak Ada Gambar
                 </div>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                        setCurrentCert(cert);
                        setIsModalOpen(true);
                    }}
                    className="p-2 bg-white text-deep-blue rounded-lg hover:bg-bright-blue hover:text-white transition-all">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
            <div>
              <h3 className="font-bold text-deep-blue dark:text-white mb-1 truncate">{cert.title}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{cert.provider}</p>
            </div>
          </div>
        ))}
        {filteredCerts.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
            <Search size={40} className="mb-4 opacity-20" />
            <p className="font-medium">Belum ada sertifikat.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#002a3a] relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">{currentCert.id ? "Edit Sertifikat" : "Sertifikat Baru"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Judul Pencapaian (Pelatihan)</label>
                  <input
                    type="text"
                    value={currentCert.title || ""}
                    onChange={(e) => setCurrentCert({ ...currentCert, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Lembaga Pihak Berwenang (Provider)</label>
                  <input
                    type="text"
                    value={currentCert.provider || ""}
                    onChange={(e) => setCurrentCert({ ...currentCert, provider: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white"
                    placeholder="Contoh: Dicoding, Cisco, Coursera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Foto Sertifikat (Storage)</label>
                  <div className="relative group w-full h-[160px]">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <div className={cn(
                      "w-full h-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden",
                      currentCert.image ? "border-bright-blue bg-bright-blue/5" : "group-hover:border-bright-blue/50 group-hover:bg-bright-blue/5"
                    )}>
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-bright-blue">
                           <Loader2 size={24} className="animate-spin" />
                           <span className="text-xs font-bold">Mengunggah...</span>
                        </div>
                      ) : currentCert.image ? (
                        <div className="relative w-full h-full p-1 border-2 border-transparent">
                           {isPdf(currentCert.image) ? (
                             <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg text-muted-foreground">
                               <FileText size={32} />
                               <span className="text-xs font-bold uppercase">PDF Document</span>
                             </div>
                           ) : (
                             <img src={currentCert.image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                           )}
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                             <p className="text-white text-xs font-bold flex items-center gap-2"><Upload size={14}/> Ganti</p>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-bright-blue transition-colors">
                          <Upload size={24} />
                          <span className="text-xs font-bold text-center px-4">Pilih Gambar (Klik/Tarik)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-muted-foreground font-semibold hover:text-deep-blue">Batal</button>
                <button onClick={handleSave} className="px-8 py-2 bg-bright-blue text-white rounded-xl font-bold hover:bg-deep-blue transition-all">Simpan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
