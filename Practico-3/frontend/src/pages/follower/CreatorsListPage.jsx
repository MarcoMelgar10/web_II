import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCreators, searchCreators } from "../../api/creators";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const CreatorsListPage = () => {
  const [creators, setCreators] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllCreators();
        setCreators(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar creadores");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchCreators(query);
      setCreators(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error en la busqueda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Creadores</h1>
      <Alert type="error" message={error} />
      <form onSubmit={handleSearch} className="search-form">
        <input
          id="creators-search"
          type="text"
          className="input"
          placeholder="Buscar creador por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button id="creators-search-btn" type="submit" className="btn btn-primary">Buscar</button>
      </form>
      {loading ? (
        <Spinner />
      ) : (
        <div className="creators-grid">
          {creators.length === 0 ? (
            <p>No se encontraron creadores.</p>
          ) : (
            creators.map((c) => (
              <Link key={c.id} to={`/follower/creators/${c.id}`} className="creator-card">
                <img
                  src={c.creatorProfile?.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="creator-card-avatar"
                />
                <span>{c.creatorProfile?.displayName || c.email}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CreatorsListPage;
