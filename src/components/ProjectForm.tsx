import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export interface ProjectFormData {
    title: string;
    description: string;
    video: string;
    components: string;
    sourceCode: string;
}

interface ProjectFormProps {
    initialData?: ProjectFormData & { imagePreview?: string };
    onSubmit: (data: ProjectFormData, imageFile: File | null) => Promise<void>;
    isSubmitting: boolean;
    submitLabel?: string;
}

const ProjectForm = ({ initialData, onSubmit, isSubmitting, submitLabel = 'Submit Project' }: ProjectFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePreview || null);
    const [imageError, setImageError] = useState<string | null>(null);

    const [form, setForm] = useState<ProjectFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        video: initialData?.video || '',
        components: initialData?.components || '',
        sourceCode: initialData?.sourceCode || '',
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                video: initialData.video || '',
                components: initialData.components || '',
                sourceCode: initialData.sourceCode || '',
            });
            if (initialData.imagePreview) {
                setImagePreview(initialData.imagePreview);
            }
        }
    }, [initialData]);

    const handleChange = (field: keyof ProjectFormData, value: string) => {
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
            setImageError('Image must be smaller than 2MB.');
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
            return; // Basic validation, parent handles more
        }
        await onSubmit(form, imageFile);
    };

    // Determine if submit should be enabled
    // If editing (initialData exists), image is optional (can keep existing).
    // If creating (no initialData), image is required.
    const isImageValid = !!imagePreview || !!imageFile;
    const isDisabled = isSubmitting || !form.title || !form.description || !form.sourceCode || !isImageValid;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                />
            </div>

            {/* Video URL (optional) */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    {'Video URL (optional)'}
                </label>
                <input
                    type="text"
                    value={form.video}
                    onChange={(e) => handleChange('video', e.target.value)}
                    placeholder="YouTube or Drive link"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
            </div>

            {/* Components */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Components <span className="text-xs text-muted-foreground/60 normal-case tracking-normal ml-2">(Use new lines for list items)</span>
                </label>
                <textarea
                    value={form.components}
                    onChange={(e) => handleChange('components', e.target.value)}
                    rows={5}
                    placeholder="List each component on a new line..."
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none font-body"
                />
            </div>

            {/* Source Code */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Source Code / Repository Link
                </label>
                <textarea
                    value={form.sourceCode}
                    onChange={(e) => handleChange('sourceCode', e.target.value)}
                    rows={3}
                    placeholder="GitHub link, Drive link, or paste raw code"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                    required
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">
                    Project Image
                </label>

                {!imagePreview ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 transition-all"
                    >
                        <Upload size={28} />
                        <span className="text-sm font-display tracking-wider">Click to upload image</span>
                        <span className="text-xs text-muted-foreground/60">Max 2MB, images only</span>
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

export default ProjectForm;
