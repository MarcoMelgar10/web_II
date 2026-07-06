import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/posts";
import FormField from "../../components/FormField";
import Alert from "../../components/Alert";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("El texto es obligatorio");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("text", text);
      if (image) fd.append("image", image);
      await createPost(fd);
      navigate("/creator/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Nueva Publicacion</h1>
      <Alert type="error" message={error} />
      <div className="card">
        <form onSubmit={handleSubmit}>
          <FormField label="Texto" id="post-text">
            <textarea
              id="post-text"
              className="input"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu publicacion..."
              required
            />
          </FormField>
          <FormField label="Imagen (opcional)" id="post-image">
            <input
              id="post-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </FormField>
          <div className="form-actions">
            <button id="post-submit" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Publicando..." : "Publicar"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/creator/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
