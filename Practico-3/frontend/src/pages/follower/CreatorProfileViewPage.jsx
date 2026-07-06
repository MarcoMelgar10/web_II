import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCreatorPublicProfile } from "../../api/creators";
import { getPostsByCreator } from "../../api/posts";
import { sendDonation } from "../../api/donations";
import { toggleFavorite, getFavorites } from "../../api/favorites";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const CreatorProfileViewPage = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [flanes, setFlanes] = useState(1);
  const [donating, setDonating] = useState(false);
  const [donationMsg, setDonationMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setPostsError("");
    try {
      const res = await getPostsByCreator(id);
      setPosts(res.data.data);
    } catch (err) {
      setPostsError(err.response?.data?.message || "Dona para ver las publicaciones");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, favRes] = await Promise.all([
          getCreatorPublicProfile(id),
          getFavorites(),
        ]);
        setCreator(profileRes.data.data);
        const favIds = favRes.data.data.map((f) => f.creatorId);
        setIsFavorite(favIds.includes(id));
        await loadPosts();
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonating(true);
    setDonationMsg({ type: "", text: "" });
    try {
      await sendDonation({ creatorId: id, flanes: Number(flanes) });
      setDonationMsg({ type: "success", text: `Donaste ${flanes} flan(es) exitosamente` });
      await loadPosts();
    } catch (err) {
      setDonationMsg({ type: "error", text: err.response?.data?.message || "Error al donar" });
    } finally {
      setDonating(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await toggleFavorite(id);
      setIsFavorite(res.data.data.favorited);
    } catch {
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!creator) return <p>Creador no encontrado.</p>;

  return (
    <div className="page">
      {creator.creatorProfile?.bannerUrl && (
        <img src={creator.creatorProfile.bannerUrl} alt="banner" className="profile-banner" />
      )}
      <div className="profile-header">
        <img
          src={creator.creatorProfile?.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="profile-avatar"
        />
        <div className="profile-header-info">
          <h1>{creator.creatorProfile?.displayName}</h1>
          <p>{creator.creatorProfile?.bio}</p>
          <button
            id="favorite-toggle"
            onClick={handleToggleFavorite}
            className={`btn ${isFavorite ? "btn-primary" : "btn-outline"}`}
          >
            {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
          </button>
        </div>
      </div>

      {creator.goals?.length > 0 && (
        <section className="card">
          <h2>Metas del creador</h2>
          {creator.goals.map((g) => (
            <div key={g.id} className="goal-card">
              <strong>{g.title}</strong>
              <p>{g.description}</p>
            </div>
          ))}
        </section>
      )}

      <section className="card">
        <h2>Apoyar con Flanes</h2>
        <Alert type={donationMsg.type} message={donationMsg.text} />
        <form onSubmit={handleDonate} className="donate-form">
          <label htmlFor="donate-flanes">Cantidad de flanes</label>
          <input
            id="donate-flanes"
            type="number"
            min={1}
            className="input input-sm"
            value={flanes}
            onChange={(e) => setFlanes(e.target.value)}
          />
          <button id="donate-submit" type="submit" className="btn btn-primary" disabled={donating}>
            {donating ? "Enviando..." : `Donar ${flanes} flan(es)`}
          </button>
        </form>
      </section>

      <section>
        <h2>Publicaciones</h2>
        {postsError ? (
          <div className="info-box">{postsError}</div>
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

export default CreatorProfileViewPage;
