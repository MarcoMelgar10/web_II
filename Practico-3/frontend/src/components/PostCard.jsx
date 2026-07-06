import { useAuth } from "../context/useAuth";
import CommentSection from "./CommentSection";

const PostCard = ({ post, showComments = false }) => {
  const { user } = useAuth();

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.creator?.creatorProfile?.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="post-avatar"
        />
        <div>
          <span className="post-creator-name">
            {post.creator?.creatorProfile?.displayName || "Creador"}
          </span>
          <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <p className="post-text">{post.text}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" className="post-image" />
      )}
      {showComments && user?.role === "FOLLOWER" && (
        <CommentSection postId={post.id} comments={post.comments || []} />
      )}
      {showComments && user?.role === "CREATOR" && (
        <div className="comment-list">
          {(post.comments || []).map((c) => (
            <div key={c.id} className="comment-item">
              <span className="comment-author">{c.follower?.email}</span>
              <span className="comment-text">{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
