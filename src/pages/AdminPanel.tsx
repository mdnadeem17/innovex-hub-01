import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import { Upload, X, Trash2, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '@/contexts/AuthContext';
import ProjectForm, { ProjectFormData } from '@/components/ProjectForm';
import AchievementForm, { AchievementFormData } from '@/components/AchievementForm';
import ParticipationForm, { ParticipationFormData } from '@/components/ParticipationForm';
import { Doc, Id } from "../../convex/_generated/dataModel";

const tabs = ['Create User', 'Goals', 'Projects', 'Approvals', 'Achievements', 'Ach. Approvals', 'Participations', 'Part. Approvals'] as const;
type Tab = (typeof tabs)[number];

const inputClass =
  'w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { role, user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Create User');
  const { toast } = useToast();

  const hasUsers = useQuery(api.users.hasUsers);

  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);


  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  // User mutations
  const createUser = useMutation(api.users.create);
  // Goal mutations
  const createGoal = useMutation(api.goals.create);
  const deleteGoalMutation = useMutation(api.goals.deleteGoal);
  // Project mutations
  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  const createProjectMutation = useMutation(api.projects.create);
  const updateProjectMutation = useMutation(api.projects.update);
  // Seed mutation
  const seedMutation = useMutation(api.seed.seed);

  // Approval mutations
  const approveMutation = useMutation(api.projects.approve);
  const rejectMutation = useMutation(api.projects.reject);
  const pendingProjects = useQuery(api.projects.listPending) || [];

  const goals = useQuery(api.goals.list) || [];
  const projects = useQuery(api.projects.list) || [];

  // Achievement mutations
  const deleteAchievementMutation = useMutation(api.achievements.deleteAchievement);
  const createAchievementMutation = useMutation(api.achievements.create);
  const updateAchievementMutation = useMutation(api.achievements.update);
  const approveAchievementMutation = useMutation(api.achievements.approve);
  const rejectAchievementMutation = useMutation(api.achievements.reject);
  const pendingAchievements = useQuery(api.achievements.listPending) || [];
  const achievements = useQuery(api.achievements.list) || [];

  // Participation mutations
  const deleteParticipationMutation = useMutation(api.participations.deleteparticipation);
  const createParticipationMutation = useMutation(api.participations.create);
  const updateParticipationMutation = useMutation(api.participations.update);
  const approveParticipationMutation = useMutation(api.participations.approve);
  const rejectParticipationMutation = useMutation(api.participations.reject);
  const pendingParticipations = useQuery(api.participations.listPending) || [];
  const participations = useQuery(api.participations.list) || [];

  // Create User state
  const [newUserId, setNewUserId] = useState('');
  const [newUserPwd, setNewUserPwd] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserCollege, setNewUserCollege] = useState('');
  const [newUserRole, setNewUserRole] = useState<'member' | 'admin'>('member');
  const [creatingUser, setCreatingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Goals state
  const [goalText, setGoalText] = useState('');
  const [goalImageFile, setGoalImageFile] = useState<File | null>(null);
  const [goalImagePreview, setGoalImagePreview] = useState<string | null>(null);

  const goalFileRef = useRef<HTMLInputElement>(null);
  const goalFormRef = useRef<HTMLFormElement>(null);
  const [addingGoal, setAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{ id: Id<"goals">, image: string } | null>(null);

  // Project state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectData, setEditingProjectData] = useState<(ProjectFormData & { imagePreview?: string, id?: Id<"projects"> }) | undefined>(undefined);

  // Achievement state
  const [isEditingAchievement, setIsEditingAchievement] = useState(false);
  const [editingAchievementData, setEditingAchievementData] = useState<(AchievementFormData & { imagePreview?: string, id?: Id<"achievements"> }) | undefined>(undefined);

  // Participation state
  const [isEditingParticipation, setIsEditingParticipation] = useState(false);
  const [editingParticipationData, setEditingParticipationData] = useState<(ParticipationFormData & { imagePreview?: string, id?: Id<"participations"> }) | undefined>(undefined);

  // --- Handlers ---
  const updateGoalMutation = useMutation(api.goals.update);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      // If initial setup, force admin role
      const finalRole = hasUsers === false ? 'admin' : newUserRole;

      await createUser({
        user_id: newUserId,
        password: newUserPwd,
        name: newUserName,
        college: newUserCollege,
        role: finalRole,
      });

      if (hasUsers === false) {
        toast({ title: 'System initialized', description: 'Admin account created. Logging you in...' });
        // Auto login after creation
        await login(newUserId, newUserPwd);
        window.location.reload();
      } else {
        toast({ title: 'User Created', description: 'New engineer added to the system.' });
        setNewUserId('');
        setNewUserPwd('');
        setNewUserName('');
        setNewUserCollege('');
        setNewUserRole('member');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const success = await login(loginId, loginPwd);
      if (success) {
        toast({ title: "Welcome back", description: "Authenticated as Admin." });
      } else {
        toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Login error", variant: "destructive" });
    } finally {
      setLoggingIn(false);
    }
  }


  const handleGoalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      toast({ title: 'Invalid file', description: 'Image only, max 2MB.', variant: 'destructive' });
      return;
    }
    setGoalImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setGoalImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalText.trim()) {
      toast({ title: 'Missing Text', description: 'Goal text is required.', variant: 'destructive' });
      return;
    }

    if (!editingGoal && !goalImageFile) {
      toast({ title: 'Missing Image', description: 'Goal image is required for new goals.', variant: 'destructive' });
      return;
    }

    setAddingGoal(true);
    try {
      let imageUrl = editingGoal?.image;

      if (goalImageFile) {
        const postUrl = await generateUploadUrl();
        imageUrl = await uploadImage(goalImageFile, postUrl);
      }

      if (editingGoal) {
        await updateGoalMutation({
          id: editingGoal.id,
          text: goalText.trim(),
          image_url: imageUrl,
        });
        toast({ title: 'Goal Updated', description: 'Future goal modified successfully.' });
      } else {
        if (!imageUrl) throw new Error("Image URL missing"); // Should be caught by check above but for TS
        await createGoal({
          text: goalText.trim(),
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        });
        toast({ title: 'Goal Added', description: 'New future goal published.' });
      }

      setGoalText('');
      setGoalImageFile(null);
      setGoalImagePreview(null);
      setEditingGoal(null);
      if (goalFileRef.current) goalFileRef.current.value = '';
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setAddingGoal(false);
    }
  };

  const startEditGoal = (goal: any) => {
    setEditingGoal({ id: goal._id, image: goal.image_url });
    setGoalText(goal.text);
    setGoalImagePreview(goal.image_url);

    // Scroll to form with visual cue
    if (goalFormRef.current) {
      goalFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optional: flash focus?
    }
  };

  const cancelEditGoal = () => {
    setEditingGoal(null);
    setGoalText('');
    setGoalImageFile(null);
    setGoalImagePreview(null);
    if (goalFileRef.current) goalFileRef.current.value = '';
  };

  const handleDeleteGoal = async (id: any) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await deleteGoalMutation({ id });
      toast({ title: 'Goal Deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: any) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectMutation({ id });
      toast({ title: 'Project Deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleProjectSubmit = async (data: ProjectFormData, imageFile: File | null) => {
    try {
      let storageId: string | undefined = undefined;

      // Handle image upload if new file is selected
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        storageId = await uploadImage(imageFile, postUrl);
      }

      if (editingProjectData?.id) {
        // Update existing project
        await updateProjectMutation({
          id: editingProjectData.id,
          title: data.title,
          description: data.description,
          components: data.components,
          source_code: data.sourceCode,
          video_link: data.video,
          image_url: storageId, // will be undefined if no new image, but backend handles optional
        });
        toast({ title: 'Project Updated' });
      } else {
        // Create new project
        if (!storageId) throw new Error("Image required for new project");

        await createProjectMutation({
          title: data.title,
          description: data.description,
          components: data.components,
          source_code: data.sourceCode,
          video_link: data.video || undefined,
          image_url: storageId,
          created_at: new Date().toISOString(),
        });
        toast({ title: 'Project Created' });
      }

      setIsEditingProject(false);
      setEditingProjectData(undefined);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Operation failed', variant: 'destructive' });
      console.error(err);
    }
  };

  const startEditProject = (project: Doc<"projects">) => {
    setEditingProjectData({
      id: project._id,
      title: project.title,
      description: project.description,
      components: project.components,
      sourceCode: project.source_code,
      video: project.video_link || '',
      imagePreview: project.image_url, // For existing image, preview using URL/ID approach component handles
    });
    setIsEditingProject(true);
  };

  const startNewProject = () => {
    setEditingProjectData(undefined);
    setIsEditingProject(true);
  };

  const handleDeleteAchievement = async (id: any) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await deleteAchievementMutation({ id });
      toast({ title: 'Achievement Deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAchievementSubmit = async (data: AchievementFormData, imageFile: File | null) => {
    try {
      let storageId: string | undefined = undefined;
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        storageId = await uploadImage(imageFile, postUrl);
      }

      if (editingAchievementData?.id) {
        await updateAchievementMutation({
          id: editingAchievementData.id,
          title: data.title,
          description: data.description,
          event_name: data.event_name,
          date: data.date,
          certificate_link: data.certificate_link,
          image_url: storageId,
        });
        toast({ title: 'Achievement Updated' });
      } else {
        if (!storageId) throw new Error("Image required for new achievement");
        await createAchievementMutation({
          title: data.title,
          description: data.description,
          event_name: data.event_name,
          date: data.date,
          certificate_link: data.certificate_link || undefined,
          image_url: storageId,
          created_at: new Date().toISOString(),
        });
        toast({ title: 'Achievement Created' });
      }

      setIsEditingAchievement(false);
      setEditingAchievementData(undefined);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const startEditAchievement = (achievement: Doc<"achievements">) => {
    setEditingAchievementData({
      id: achievement._id,
      title: achievement.title,
      description: achievement.description,
      event_name: achievement.event_name,
      date: achievement.date,
      certificate_link: achievement.certificate_link || '',
      imagePreview: achievement.image_url,
    });
    setIsEditingAchievement(true);
  };

  const startNewAchievement = () => {
    setEditingAchievementData(undefined);
    setIsEditingAchievement(true);
  };

  const handleDeleteParticipation = async (id: any) => {
    if (!confirm('Are you sure you want to delete this participation?')) return;
    try {
      await deleteParticipationMutation({ id });
      toast({ title: 'Participation Deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleParticipationSubmit = async (data: ParticipationFormData, imageFile: File | null) => {
    try {
      let storageId: string | undefined = undefined;
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        storageId = await uploadImage(imageFile, postUrl);
      }

      if (editingParticipationData?.id) {
        await updateParticipationMutation({
          id: editingParticipationData.id,
          title: data.title,
          description: data.description,
          event_name: data.event_name,
          date: data.date,
          certificate_link: data.certificate_link,
          image_url: storageId,
        });
        toast({ title: 'Participation Updated' });
      } else {
        if (!storageId) throw new Error("Image required for new participation");
        await createParticipationMutation({
          title: data.title,
          description: data.description,
          event_name: data.event_name,
          date: data.date,
          certificate_link: data.certificate_link || undefined,
          image_url: storageId,
          created_at: new Date().toISOString(),
        });
        toast({ title: 'Participation Created' });
      }

      setIsEditingParticipation(false);
      setEditingParticipationData(undefined);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const startEditParticipation = (participation: Doc<"participations">) => {
    setEditingParticipationData({
      id: participation._id,
      title: participation.title,
      description: participation.description,
      event_name: participation.event_name,
      date: participation.date,
      certificate_link: participation.certificate_link || '',
      imagePreview: participation.image_url,
    });
    setIsEditingParticipation(true);
  };

  const startNewParticipation = () => {
    setEditingParticipationData(undefined);
    setIsEditingParticipation(true);
  };

  // --- Render Logic ---

  // 1. Loading
  if (hasUsers === undefined) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><p className="text-muted-foreground">Loading system status...</p></div>;
  }

  const isInitialSetup = hasUsers === false;

  // 2. Initial Setup or Access Granted
  if (isInitialSetup) {
    // Show setup wizard (reusing Create User UI below essentially, but customized header)
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 glow-box">
            <h1 className="text-2xl font-bold text-center gradient-text mb-6">Welcome to InnoveX</h1>
            <p className="text-center text-muted-foreground mb-8">System initialization required. Please create the Administrator account.</p>

            <form onSubmit={handleCreateUser} className="space-y-5">
              {/* Reusing existing form logic but simplified for setup */}
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Admin ID</label>
                <input className={inputClass} value={newUserId} onChange={(e) => setNewUserId(e.target.value)} required placeholder="admin" />
              </div>
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${inputClass} pr-12`}
                    value={newUserPwd}
                    onChange={(e) => setNewUserPwd(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Name</label>
                <input className={inputClass} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">College</label>
                <input className={inputClass} value={newUserCollege} onChange={(e) => setNewUserCollege(e.target.value)} />
              </div>

              <Button type="submit" variant="hero" className="w-full mt-4" size="lg" disabled={creatingUser}>
                {creatingUser ? 'Initializing...' : 'Create Admin Account'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // 3. Not Logged In
  if (!user) {
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 glow-box">
            <h1 className="text-2xl font-bold text-center gradient-text mb-2">Admin Login</h1>
            <p className="text-center text-muted-foreground mb-8">Restricted access area.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                <input className={inputClass} value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPwd ? 'text' : 'password'}
                    className={`${inputClass} pr-12`}
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showLoginPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full mt-4" size="lg" disabled={loggingIn}>
                {loggingIn ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // 4. Logged in but not Admin
  if (role !== 'admin' && role !== 'demon') {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need admin privileges to view this page.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
          {/* Need to enable logout here if they want to switch accounts */}
          {/* For now, just return home */}
        </div>
      </div>
    );
  }

  // 5. Admin Panel (Authenticated & Authorized)
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8 relative">
            <div className="w-10" /> {/* Spacer for centering */}
            <h1 className="text-3xl font-display font-bold gradient-text glow-text text-center absolute left-1/2 -translate-x-1/2">
              Admin Panel
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await seedMutation();
                  toast({ title: "Success", description: "Database seeded with initial data." });
                } catch (e: any) {
                  toast({ title: "Error", description: e.message, variant: "destructive" });
                }
              }}
              className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
            >
              Seed Data
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 glass rounded-xl p-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsEditingProject(false);
                  setIsEditingAchievement(false);
                  setIsEditingParticipation(false);
                  setEditingGoal(null);
                }}
                className={`px-4 md:px-6 py-2.5 rounded-lg font-display text-xs tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab
                  ? 'bg-primary/15 text-primary glow-box'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="glass rounded-2xl p-4 md:p-8 glow-box">
            {activeTab === 'Create User' && (
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">User ID</label>
                  <input className={inputClass} value={newUserId} onChange={(e) => setNewUserId(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass} pr-12`}
                      value={newUserPwd}
                      onChange={(e) => setNewUserPwd(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Name</label>
                  <input className={inputClass} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">College</label>
                  <input className={inputClass} value={newUserCollege} onChange={(e) => setNewUserCollege(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Role</label>
                  <select className={inputClass} value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'member' | 'admin')}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={creatingUser}>
                  {creatingUser ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            )}

            {activeTab === 'Goals' && (
              <div className="space-y-8">
                <form ref={goalFormRef} onSubmit={handleAddGoal} className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-sm tracking-wider text-primary">
                      {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                    </h3>
                    {editingGoal && (
                      <Button type="button" variant="ghost" size="sm" onClick={cancelEditGoal}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Text</label>
                    <textarea rows={3} className={`${inputClass} resize-none`} value={goalText} onChange={(e) => setGoalText(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-display tracking-wider text-muted-foreground mb-2">Goal Image</label>
                    {!goalImagePreview ? (
                      <button
                        type="button"
                        onClick={() => goalFileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary/80 transition-all"
                      >
                        <Upload size={24} />
                        <span className="text-sm font-display tracking-wider">Upload image {editingGoal ? '(Optional)' : ''}</span>
                      </button>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <img src={goalImagePreview} alt="Preview" className="w-full h-36 object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setGoalImageFile(null);
                            setGoalImagePreview(null);
                            if (goalFileRef.current) goalFileRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <input ref={goalFileRef} type="file" accept="image/*" onChange={handleGoalImage} className="hidden" />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={addingGoal}>
                    {addingGoal ? (editingGoal ? 'Updating...' : 'Adding...') : (editingGoal ? 'Update Goal' : 'Add Goal')}
                  </Button>
                </form>

                {goals.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm tracking-wider text-primary mb-4">Existing Goals</h3>
                    <div className="space-y-3">
                      {goals.map((g) => (
                        <div key={g._id} className="flex items-center gap-3 glass rounded-lg p-3">
                          {g.image_url && (
                            <ImageWithFallback src={g.image_url} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          )}
                          <p className="text-sm text-foreground/80 flex-1 line-clamp-2">{g.text}</p>
                          <div className="flex gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => startEditGoal(g)}
                              className={`flex items-center gap-1 px-2 py-1.5 rounded transition-all duration-200 ${editingGoal?.id === g._id
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                                }`}
                              title="Edit Goal"
                            >
                              <Pencil size={14} />
                              <span className="text-xs font-display tracking-wider">Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteGoal(g._id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                              title="Delete Goal"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Projects' && (
              <div>
                {!isEditingProject ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display text-sm tracking-wider text-primary">Manage Projects</h3>
                      <Button size="sm" onClick={startNewProject} className="gap-2">
                        <Plus size={16} /> Add Project
                      </Button>
                    </div>

                    {projects.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No projects yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((p) => (
                          <div key={p._id} className="flex items-center gap-3 glass rounded-lg p-3">
                            {p.image_url && (
                              <ImageWithFallback src={p.image_url} alt={p.title ?? ''} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-display text-primary truncate">{p.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => startEditProject(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDeleteProject(p._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display text-sm tracking-wider text-primary">
                        {editingProjectData ? 'Edit Project' : 'New Project'}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingProject(false)}>Cancel</Button>
                    </div>
                    <ProjectForm
                      initialData={editingProjectData}
                      onSubmit={handleProjectSubmit}
                      isSubmitting={false} // You can add local submitting state if desired
                      submitLabel={editingProjectData ? 'Update Project' : 'Create Project'}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Approvals' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-6">Pending Approvals</h3>
                {pendingProjects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending projects.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingProjects.map((p) => (
                      <div key={p._id} className="glass rounded-lg p-4 border border-border">
                        <div className="flex gap-4">
                          {p.image_url && (
                            <ImageWithFallback src={p.image_url} alt={p.title ?? ''} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="hero" onClick={async () => {
                                await approveMutation({ id: p._id });
                                toast({ title: "Project Approved", description: "It is now visible on the website." });
                              }}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={async () => {
                                if (confirm("Reject and delete this submission?")) {
                                  await rejectMutation({ id: p._id });
                                  toast({ title: "Project Rejected" });
                                }
                              }}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Achievements' && (
              <div>
                {!isEditingAchievement ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display text-sm tracking-wider text-primary">Manage Achievements</h3>
                      <Button size="sm" onClick={startNewAchievement} className="gap-2">
                        <Plus size={16} /> Add Achievement
                      </Button>
                    </div>

                    {achievements.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No achievements yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {achievements.map((a) => (
                          <div key={a._id} className="flex items-center gap-3 glass rounded-lg p-3">
                            {a.image_url && (
                              <ImageWithFallback src={a.image_url} alt={a.title ?? ''} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-display text-primary truncate">{a.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{a.event_name} • {a.date}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => startEditAchievement(a)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDeleteAchievement(a._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display text-sm tracking-wider text-primary">
                        {editingAchievementData ? 'Edit Achievement' : 'New Achievement'}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingAchievement(false)}>Cancel</Button>
                    </div>
                    <AchievementForm
                      initialData={editingAchievementData}
                      onSubmit={handleAchievementSubmit}
                      isSubmitting={false}
                      submitLabel={editingAchievementData ? 'Update Achievement' : 'Create Achievement'}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Ach. Approvals' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-6">Pending Achievement Approvals</h3>
                {pendingAchievements.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending achievements.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingAchievements.map((a) => (
                      <div key={a._id} className="glass rounded-lg p-4 border border-border">
                        <div className="flex gap-4">
                          {a.image_url && (
                            <ImageWithFallback src={a.image_url} alt={a.title ?? ''} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{a.title}</h4>
                            <p className="text-sm text-accent mb-2">{a.event_name} • {a.date}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{a.description}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="hero" onClick={async () => {
                                await approveAchievementMutation({ id: a._id });
                                toast({ title: "Achievement Approved", description: "It is now visible on the website." });
                              }}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={async () => {
                                if (confirm("Reject and delete this submission?")) {
                                  await rejectAchievementMutation({ id: a._id });
                                  toast({ title: "Achievement Rejected" });
                                }
                              }}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Participations' && (
              <div>
                {!isEditingParticipation ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display text-sm tracking-wider text-primary">Manage Participations</h3>
                      <Button size="sm" onClick={startNewParticipation} className="gap-2">
                        <Plus size={16} /> Add Participation
                      </Button>
                    </div>

                    {participations.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No participations yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {participations.map((p) => (
                          <div key={p._id} className="flex items-center gap-3 glass rounded-lg p-3">
                            {p.image_url && (
                              <ImageWithFallback src={p.image_url} alt={p.title ?? ''} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-display text-primary truncate">{p.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{p.event_name} • {p.date}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => startEditParticipation(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDeleteParticipation(p._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display text-sm tracking-wider text-primary">
                        {editingParticipationData ? 'Edit Participation' : 'New Participation'}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingParticipation(false)}>Cancel</Button>
                    </div>
                    <ParticipationForm
                      initialData={editingParticipationData}
                      onSubmit={handleParticipationSubmit}
                      isSubmitting={false}
                      submitLabel={editingParticipationData ? 'Update Participation' : 'Create Participation'}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Part. Approvals' && (
              <div>
                <h3 className="font-display text-sm tracking-wider text-primary mb-6">Pending Participation Approvals</h3>
                {pendingParticipations.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No pending participations.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingParticipations.map((p) => (
                      <div key={p._id} className="glass rounded-lg p-4 border border-border">
                        <div className="flex gap-4">
                          {p.image_url && (
                            <ImageWithFallback src={p.image_url} alt={p.title ?? ''} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                            <p className="text-sm text-accent mb-2">{p.event_name} • {p.date}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="hero" onClick={async () => {
                                await approveParticipationMutation({ id: p._id });
                                toast({ title: "Participation Approved", description: "It is now visible on the website." });
                              }}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={async () => {
                                if (confirm("Reject and delete this submission?")) {
                                  await rejectParticipationMutation({ id: p._id });
                                  toast({ title: "Participation Rejected" });
                                }
                              }}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
