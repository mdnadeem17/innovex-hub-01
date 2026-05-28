import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Image as ImageIcon, Calendar, Trash2 } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import AddParticipationMemoryModal from "@/components/AddParticipationMemoryModal";
import { useMutation } from "convex/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CATEGORIES = [
    "All",
    "Building",
    "Participation",
    "Behind the Scenes",
    "Fun Moments",
    "Teamwork",
    "Challenges",
    "Failures",
    "Recovery",
    "participations",
    "Enjoyment"
];

const participationMemories = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const participationId = id as Id<"participations">;
    const participation = useQuery(api.participations.get, participationId ? { id: participationId } : "skip");
    const memories = useQuery(api.participation_memories.list, participationId ? { participation_id: participationId } : "skip") || [];

    const [activeCategory, setActiveCategory] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredMemories = activeCategory === "All"
        ? memories
        : memories.filter(m => m.category === activeCategory);

    const canAddMemory = ['admin', 'member', 'demon'].includes(user?.role || '');

    const deleteMemoryMutation = useMutation(api.participation_memories.deleteMemory);

    const handleDelete = async (e: React.MouseEvent, id: Id<"participation_memories">) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this photo?")) {
            await deleteMemoryMutation({ id });
        }
    };

    // Redirect if not logged in
    if (!user) {
        navigate('/');
        return null;
    }

    if (!participation) return <div className="min-h-screen pt-24 text-center text-white">Loading participation...</div>;

    return (
        <div className="min-h-screen bg-background text-white pt-20 pb-12">
            {/* Header */}
            <div className="relative h-[40vh] overflow-hidden">
                <ImageWithFallback src={participation.image_url} alt={participation.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <button
                        onClick={() => navigate(`/participations/${participationId}`)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors font-display text-xs tracking-wider"
                    >
                        <ArrowLeft size={16} /> Back to Detail
                    </button>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-2xl"
                    >
                        {participation.title} <span className="text-primary font-light italic">Journey</span>
                    </motion.h1>
                    <p className="max-w-2xl text-lg text-muted-foreground line-clamp-2">{participation.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-display tracking-wider transition-all ${activeCategory === cat
                                ? 'bg-primary text-background font-bold shadow-lg scale-105'
                                : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence>
                        {filteredMemories.map((memory) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={memory._id}
                                className="break-inside-avoid glass rounded-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                onClick={() => setSelectedImage(memory.image_url)}
                            >
                                <div className="relative">
                                    <ImageWithFallback src={memory.image_url} alt={memory.title} className="w-full h-auto object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
                                            {memory.category}
                                        </div>
                                        {canAddMemory && (
                                            <button
                                                onClick={(e) => handleDelete(e, memory._id)}
                                                className="bg-red-500/80 hover:bg-red-600 backdrop-blur p-1.5 rounded text-white transition-colors"
                                                title="Delete photo"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-display font-bold text-lg leading-tight">{memory.title}</h3>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(memory.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{memory.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredMemories.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xl">No memories found in this category yet.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button for Demons */}
            {canAddMemory && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <Button
                        className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 border-2 border-white/20"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={32} />
                    </Button>
                </motion.div>
            )}

            {/* Add Memory Modal */}
            {participationId && (
                <AddParticipationMemoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    participationId={participationId}
                />
            )}

            {/* Image Preview Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
                    {selectedImage && (
                        <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg shadow-2xl" />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default participationMemories;
