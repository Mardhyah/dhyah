"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Search,
  Image as ImageIcon,
  X,
  Upload,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  tags: string[];
  features: string[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    tags: [],
    features: []
  });
  const [tagsRaw, setTagsRaw] = useState("");
  const [featuresRaw, setFeaturesRaw] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image: ', uploadError);
      alert(`Gagal unggah: ${uploadError.message || JSON.stringify(uploadError)}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);
        
      setCurrentProject({ ...currentProject, image: publicUrl });
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!currentProject.title || !currentProject.description) return;

    // Parse raw strings into arrays on save
    const parsedTags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    const parsedFeatures = featuresRaw.split(";").map(f => f.trim()).filter(Boolean);
    const payload = { ...currentProject, tags: parsedTags, features: parsedFeatures };

    if (currentProject.id) {
      await supabase.from("projects").update(payload).eq("id", currentProject.id);
    } else {
      await supabase.from("projects").insert([payload]);
    }

    setIsModalOpen(false);
    setCurrentProject({ tags: [], features: [] });
    setTagsRaw("");
    setFeaturesRaw("");
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      await supabase.from("projects").delete().eq("id", id);
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#002a3a] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all"
          />
        </div>
        <button
          onClick={() => {
            setCurrentProject({ tags: [], features: [] });
            setTagsRaw("");
            setFeaturesRaw("");
            setIsModalOpen(true);
          }}
          className="bg-deep-blue text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-bright-blue transition-all"
        >
          <Plus size={20} /> Tambah Proyek
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-[#002a3a] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-video relative overflow-hidden">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                        setCurrentProject(project);
                        setTagsRaw(project.tags?.join(", ") ?? "");
                        setFeaturesRaw(project.features?.join("; ") ?? "");
                        setIsModalOpen(true);
                    }}
                    className="p-2 bg-white text-deep-blue rounded-lg hover:bg-bright-blue hover:text-white transition-all">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-deep-blue dark:text-white mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-[10px] rounded-md text-muted-foreground uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              className="bg-white dark:bg-[#002a3a] relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">{currentProject.id ? "Edit Proyek" : "Proyek Baru"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Judul Proyek</label>
                  <input
                    type="text"
                    value={currentProject.title || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Deskripsi</label>
                  <textarea
                    value={currentProject.description || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all min-h-[100px] dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Gambar Proyek</label>
                    <div className="relative group w-full h-[120px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                      />
                      <div className={cn(
                        "w-full h-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden",
                        currentProject.image ? "border-bright-blue bg-bright-blue/5" : "group-hover:border-bright-blue/50 group-hover:bg-bright-blue/5"
                      )}>
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2 text-bright-blue">
                             <Loader2 size={24} className="animate-spin" />
                             <span className="text-xs font-bold">Mengunggah...</span>
                          </div>
                        ) : currentProject.image ? (
                          <div className="relative w-full h-full p-1 border-2 border-transparent">
                             <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Live Link</label>
                    <input
                      type="text"
                      value={currentProject.link || ""}
                      onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                      className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white mb-4"
                    />
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Github Repository</label>
                    <input
                      type="text"
                      value={currentProject.github || ""}
                      onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
                      className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Tags (pisahkan koma)</label>
                     <input
                       type="text"
                       placeholder="Ex: React, Tailwind, Supabase"
                       value={tagsRaw}
                       onChange={(e) => setTagsRaw(e.target.value)}
                       className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white text-sm"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Key Features (pisahkan titik koma ";")</label>
                     <input
                       type="text"
                       placeholder="Login sistem; Realtime Database; Animasi"
                       value={featuresRaw}
                       onChange={(e) => setFeaturesRaw(e.target.value)}
                       className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-bright-blue outline-none transition-all dark:text-white text-sm"
                     />
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
