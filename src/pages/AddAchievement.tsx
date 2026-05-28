import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import AchievementForm, { AchievementFormData } from '@/components/AchievementForm';

const AddAchievement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const createAchievement = useMutation(api.achievements.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleSubmit = async (data: AchievementFormData, imageFile: File | null) => {
    if (!imageFile) {
      toast({ title: 'Error', description: 'Image is required for new achievements.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const postUrl = await generateUploadUrl();
      const storageId = await uploadImage(imageFile, postUrl);

      await createAchievement({
        title: data.title.trim(),
        description: data.description.trim(),
        event_name: data.event_name.trim(),
        date: data.date.trim(),
        image_url: storageId,
        certificate_link: data.certificate_link.trim() || undefined,
        created_at: new Date().toISOString(),
        created_by: user?.id,
      });

      toast({
        title: 'Achievement Submitted',
        description: 'Your achievement has been submitted for approval.',
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
            Add New Achievement
          </h1>

          <div className="glass rounded-2xl p-8 glow-box">
            <AchievementForm onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddAchievement;
