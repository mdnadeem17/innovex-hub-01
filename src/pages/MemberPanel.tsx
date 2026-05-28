import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

const MemberPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const myProjects = useQuery(api.projects.myProjects, user ? { userId: user.id } : "skip") || [];

    // if (loading) return <div className="min-h-screen pt-24 flex justify-center text-white">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-display text-primary mb-4">Access Denied</h1>
                <p className="text-muted-foreground mb-8">You must be logged in to view your member panel.</p>
                <Button variant="glow" onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1 text-green-400 text-xs font-bold border border-green-400/30 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle size={12} /> Live</span>;
            case 'rejected':
                return <span className="flex items-center gap-1 text-red-400 text-xs font-bold border border-red-400/30 bg-red-400/10 px-2 py-1 rounded-full"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold border border-yellow-400/30 bg-yellow-400/10 px-2 py-1 rounded-full"><Clock size={12} /> Pending Approval</span>;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Member Panel</h1>
                        <p className="text-muted-foreground">Manage and track your project submissions.</p>
                    </div>
                    <Button variant="glow" onClick={() => navigate("/add-project")} className="gap-2">
                        <Plus size={18} /> New Project
                    </Button>
                </div>

                <div className="grid gap-6">
                    {myProjects.length === 0 ? (
                        <div className="glass p-12 text-center rounded-xl">
                            <p className="text-xl text-muted-foreground mb-4">You haven't submitted any projects yet.</p>
                            <Button variant="outline" onClick={() => navigate("/add-project")}>Submit Your First Project</Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myProjects.map((project) => (
                                <div key={project._id} className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className="aspect-video w-full overflow-hidden bg-black/50 relative">
                                        {project.image_url ? (
                                            <ImageWithFallback
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            {getStatusBadge(project.status)}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-display text-xl font-bold text-white mb-2 truncate">{project.title}</h3>
                                        <div className="text-sm text-muted-foreground line-clamp-2 mb-4" dangerouslySetInnerHTML={{ __html: project.description }} />
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default MemberPanel;
