import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile } from "../../api/creators";
import { getPostsByCreator } from "../../api/posts";
import { getGoalsByCreator } from "../../api/goals";
import { useAuth } from "../../context/useAuth";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, postsRes, goalsRes] = await Promise.all([
          getMyProfile(),
          getPostsByCreator(user.id),
          getGoalsByCreator(user.id),
        ]);
        setProfile(profileRes.data.data);
        setPosts(postsRes.data.data);
        setGoals(goalsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mi Dashboard</h1>
        <div className="page-actions">
          <Link to="/creator/profile" className="btn btn-outline">Editar Perfil</Link>
          <Link to="/creator/posts/new" className="btn btn-primary">Nueva Publicacion</Link>
          <Link to="/creator/income" className="btn btn-outline">Ver Ingresos</Link>
        </div>
      </div>
      <Alert type="error" message={error} />
      {!profile && (
        <div className="info-box">
          <p>Todavia no creaste tu perfil publico.</p>
          <Link to="/creator/profile" className="btn btn-primary">Crear Perfil</Link>
        </div>
      )}
      {profile && (
        <div className="profile-summary">
          <img src={profile.avatarUrl || "/default-avatar.png"} alt="avatar" className="profile-avatar-sm" />
          <div>
            <h2>{profile.displayName}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>
      )}
      <section>
        <h2>Metas ({goals.length})</h2>
        {goals.length === 0 ? (
          <p>No hay metas definidas. <Link to="/creator/profile">Agregar meta</Link></p>
        ) : (
          <div className="goals-list">
            {goals.map((g) => (
              <div key={g.id} className="goal-card">
                <strong>{g.title}</strong>
                <p>{g.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2>Publicaciones ({posts.length})</h2>
        {posts.length === 0 ? (
          <p>Todavia no publicaste nada.</p>
        ) : (
          <div className="posts-list">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} showComments={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreatorDashboard;
