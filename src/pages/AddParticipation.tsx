import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import ParticipationForm, { participationFormData } from '@/components/ParticipationForm';

const AddParticipation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const createParticipation = useMutation(api.participations.create);
  const createMemory = useMutation(api.participation_memories.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleSubmit = async (data: participationFormData, imageFiles: File[]) => {
    if (imageFiles.length === 0) {
      toast({ title: 'Error', description: 'At least one image is required for new participations.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const postUrl = await generateUploadUrl();
      const storageId = await uploadImage(imageFiles[0], postUrl);

      const participationId = await createParticipation({
        title: data.title.trim(),
        description: data.description.trim(),
        event_name: data.event_name.trim(),
        date: data.date.trim(),
        image_url: storageId,
        certificate_link: data.certificate_link.trim() || undefined,
        created_at: new Date().toISOString(),
        created_by: user?.id,
      });

      const remainingFiles = imageFiles.slice(1);
      if (remainingFiles.length > 0) {
        await Promise.all(
          remainingFiles.map(async (file) => {
            const memoryPostUrl = await generateUploadUrl();
            const memoryStorageId = await uploadImage(file, memoryPostUrl);
            await createMemory({
              participation_id: participationId,
              title: data.title.trim(),
              description: 'Additional participation photo',
              image_url: memoryStorageId,
              category: 'Participation',
              date: data.date.trim(),
              type: 'image',
            });
          })
        );
      }

      toast({
        title: 'Participation Submitted',
        description: remainingFiles.length > 0 
          ? `Your participation and ${remainingFiles.length} additional memories have been submitted.` 
          : 'Your participation has been submitted for approval.',
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
            Add New Participation
          </h1>

          <div className="glass rounded-2xl p-8 glow-box">
            <ParticipationForm onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddParticipation;
