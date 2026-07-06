import { useEffect, useState } from "react";
import { getMyProfile, createProfile, updateProfile, uploadAvatar, uploadBanner } from "../../api/creators";
import { createGoal, getGoalsByCreator, deleteGoal } from "../../api/goals";
import { useAuth } from "../../context/useAuth";
import FormField from "../../components/FormField";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

const CreatorProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ displayName: "", bio: "" });
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, goalsRes] = await Promise.all([
          getMyProfile(),
          getGoalsByCreator(user.id),
        ]);
        const p = profileRes.data.data;
        if (p) {
          setProfile(p);
          setForm({ displayName: p.displayName, bio: p.bio || "" });
        }
        setGoals(goalsRes.data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const fn = profile ? updateProfile : createProfile;
      const res = await fn(form);
      setProfile(res.data.data);
      setMessage({ type: "success", text: "Perfil guardado correctamente" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al guardar" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const fd = new FormData();
    fd.append("avatar", e.target.files[0]);
    try {
      const res = await uploadAvatar(fd);
      setProfile(res.data.data);
      setMessage({ type: "success", text: "Avatar actualizado" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al subir avatar" });
    }
  };

  const handleBannerChange = async (e) => {
    const fd = new FormData();
    fd.append("banner", e.target.files[0]);
    try {
      const res = await uploadBanner(fd);
      setProfile(res.data.data);
      setMessage({ type: "success", text: "Banner actualizado" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al subir banner" });
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await createGoal(goalForm);
      setGoals((prev) => [res.data.data, ...prev]);
      setGoalForm({ title: "", description: "" });
      setMessage({ type: "success", text: "Meta creada" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al crear meta" });
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al eliminar" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <h1>Mi Perfil</h1>
      <Alert type={message.type} message={message.text} />

      {profile?.bannerUrl && (
        <img src={profile.bannerUrl} alt="banner" className="profile-banner" />
      )}
      {profile?.avatarUrl && (
        <img src={profile.avatarUrl} alt="avatar" className="profile-avatar" />
      )}

      <section className="card">
        <h2>Datos del perfil</h2>
        <form onSubmit={handleSaveProfile}>
          <FormField label="Nombre publico" id="profile-displayName">
            <input
              id="profile-displayName"
              className="input"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Bio" id="profile-bio">
            <textarea
              id="profile-bio"
              className="input"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </FormField>
          <button id="profile-save" type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Perfil"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Foto de perfil</h2>
        <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} />
      </section>

      <section className="card">
        <h2>Banner</h2>
        <input id="banner-upload" type="file" accept="image/*" onChange={handleBannerChange} />
      </section>

      <section className="card">
        <h2>Metas de apoyo</h2>
        <form onSubmit={handleAddGoal} className="goal-form">
          <FormField label="Titulo" id="goal-title">
            <input
              id="goal-title"
              className="input"
              value={goalForm.title}
              onChange={(e) => setGoalForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Descripcion" id="goal-description">
            <textarea
              id="goal-description"
              className="input"
              rows={2}
              value={goalForm.description}
              onChange={(e) => setGoalForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <button id="goal-add" type="submit" className="btn btn-primary">Agregar Meta</button>
        </form>
        <div className="goals-list">
          {goals.map((g) => (
            <div key={g.id} className="goal-card">
              <div>
                <strong>{g.title}</strong>
                <p>{g.description}</p>
              </div>
              <button
                id={`goal-delete-${g.id}`}
                onClick={() => handleDeleteGoal(g.id)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreatorProfilePage;
