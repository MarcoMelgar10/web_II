import { useState } from "react";
import { addComment } from "../api/comments";
import Alert from "./Alert";

const CommentSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await addComment({ postId, text });
      setComments((prev) => [...prev, res.data.data]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al comentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <Alert type="error" message={error} />
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          id={`comment-input-${postId}`}
          type="text"
          placeholder="Dejar un comentario al creador..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Enviando..." : "Comentar"}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
