import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProjectForm, { ProjectFormData } from '@/components/ProjectForm';

const AddProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createProject = useMutation(api.projects.create);

  const handleSubmit = async (data: ProjectFormData, imageFile: File | null) => {
    if (!imageFile) {
      toast({ title: 'Error', description: 'Image is required for new projects.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload image
      const postUrl = await generateUploadUrl();
      const storageId = await uploadImage(imageFile, postUrl);

      // 3. Create project
      await createProject({
        title: data.title.trim(),
        description: data.description.trim(),
        image_url: storageId,
        components: data.components.trim(),
        source_code: data.sourceCode.trim(),
        video_link: data.video.trim() || undefined,
        created_at: new Date().toISOString(),
        created_by: user?.id,
      });

      toast({
        title: 'Project Submitted',
        description: 'Your project has been submitted for approval.',
      });
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      toast({ title: 'Upload Failed', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold gradient-text glow-text mb-8 text-center">
            Add New Project
          </h1>

          <div className="glass rounded-2xl p-8 glow-box">
            <ProjectForm onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;
