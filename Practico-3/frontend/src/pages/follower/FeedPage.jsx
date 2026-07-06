import { useEffect, useState } from "react";
import { getFeed } from "../../api/feed";
import PostCard from "../../components/PostCard";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFeed();
        setPosts(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el feed");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <h1>Mi Feed</h1>
      <Alert type="error" message={error} />
      {posts.length === 0 ? (
        <div className="info-box">
          <p>Tu feed esta vacio. Dona flanes a un creador para ver sus publicaciones aqui.</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} showComments={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
