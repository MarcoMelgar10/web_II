import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites } from "../../api/favorites";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFavorites();
        setFavorites(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar favoritos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <h1>Mis Favoritos</h1>
      <Alert type="error" message={error} />
      {favorites.length === 0 ? (
        <div className="info-box">
          <p>No tenes creadores favoritos aun.</p>
          <Link to="/follower/creators" className="btn btn-primary">Explorar Creadores</Link>
        </div>
      ) : (
        <div className="creators-grid">
          {favorites.map((f) => (
            <Link key={f.id} to={`/follower/creators/${f.creatorId}`} className="creator-card">
              <img
                src={f.creator?.creatorProfile?.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="creator-card-avatar"
              />
              <span>{f.creator?.creatorProfile?.displayName || "Creador"}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
