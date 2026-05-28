import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { uploadImage } from '@/lib/uploadImage';
import { useToast } from '@/hooks/use-toast';
import { Id } from "../../convex/_generated/dataModel";

interface AddAchievementMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    achievementId: Id<"achievements">;
}

const CATEGORIES = [
    "Building",
    "Participation",
    "Behind the Scenes",
    "Fun Moments",
    "Teamwork",
    "Challenges",
    "Failures",
    "Recovery",
    "Achievements",
    "Enjoyment"
];

const AddAchievementMemoryModal = ({ isOpen, onClose, achievementId }: AddAchievementMemoryModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createMemory = useMutation(api.achievement_memories.create);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!title || !imageFile || !category) {
            toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const postUrl = await generateUploadUrl();
            const storageId = await uploadImage(imageFile, postUrl);

            await createMemory({
                achievement_id: achievementId,
                title,
                description,
                image_url: storageId,
                category,
                date: new Date().toISOString(),
                type: "image",
            });

            toast({ title: "Success", description: "Memory added successfully!" });
            onClose();
            // Reset form
            setTitle("");
            setDescription("");
            setCategory("");
            setImageFile(null);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to add memory.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-strong border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Memory</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Memory Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border-white/10"
                    />
                    <Textarea
                        placeholder="Description (What happened? Why was it memorable?)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/5 border-white/10"
                    />
                    <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="bg-white/5 border-white/10 cursor-pointer"
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="glow" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Memory"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAchievementMemoryModal;
