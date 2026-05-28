import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB to match Cloudinary limit

export interface ParticipationFormData {
    title: string;
    description: string;
    event_name: string;
    date: string;
    certificate_link: string;
}

interface ParticipationFormProps {
    initialData?: ParticipationFormData & { imagePreview?: string };
    onSubmit: (data: ParticipationFormData, imageFile: File | null) => Promise<void>;
    isSubmitting: boolean;
    submitLabel?: string;
}

const ParticipationForm = ({ initialData, onSubmit, isSubmitting, submitLabel = 'Submit Participation' }: ParticipationFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePreview || null);
    const [imageError, setImageError] = useState<string | null>(null);

    const [form, setForm] = useState<ParticipationFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        event_name: initialData?.event_name || '',
        date: initialData?.date || '',
        certificate_link: initialData?.certificate_link || '',
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                event_name: initialData.event_name || '',
                date: initialData.date || '',
                certificate_link: initialData.certificate_link || '',
            });
            if (initialData.imagePreview) {
                setImagePreview(initialData.imagePreview);
            }
        }
    }, [initialData]);

    const handleChange = (field: keyof ParticipationFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError(null);

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setImageError('Please select a valid image file.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setImageError('Image must be smaller than 10MB.');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            return;
        }
        await onSubmit(form, imageFile);
    };

    const isImageValid = !!imagePreview || !!imageFile;
    const isDisabled = isSubmitting || !form.title || !form.description || !form.event_name || !form.date || !isImageValid;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. 1st Place Smart India Hackathon"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Event Name
                </label>
                <input
                    type="text"
                    value={form.event_name}
                    onChange={(e) => handleChange('event_name', e.target.value)}
                    placeholder="e.g. Smart India Hackathon 2026"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Date
                </label>
                <input
                    type="text"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    placeholder="e.g. April 2026"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Certificate / Proof Link (optional)
                </label>
                <input
                    type="text"
                    value={form.certificate_link}
                    onChange={(e) => handleChange('certificate_link', e.target.value)}
                    placeholder="Link to certificate, news article, or post"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    placeholder="Details about the participation, what was built, or why it matters..."
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Participation Image
                </label>

                {!imagePreview ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 transition-all"
                    >
                        <Upload size={28} />
                        <span className="text-sm font-display tracking-wider">Click to upload image</span>
                        <span className="text-xs text-muted-foreground/60">Max 10MB, images only</span>
                    </button>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-border">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {imageError && (
                    <p className="mt-2 text-sm text-destructive font-display tracking-wider">{imageError}</p>
                )}
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isDisabled}>
                {isSubmitting ? 'Processing...' : submitLabel}
            </Button>
        </form>
    );
};

export default ParticipationForm;
