
'use client';

import { DocumentData } from 'firebase/firestore';
import Reacciones from './Reacciones'; // Ajusta la ruta
import CommentSection from './CommentSection'; // Ajusta la ruta
import ShareButton from './ShareButton'; // Ajusta la ruta
import './Post.css'; // Importar el archivo CSS

interface PostType {
    id: string;
    [key: string]: any;
}

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  return (
    <div className="post-card">
      <div className="post-header">
        {/* Aquí iría el avatar del usuario */}
        <span className="owner-name">{post.ownerName}</span>
      </div>
      {post.imageUrl && (
        <div className="post-image-container">
          <img src={post.imageUrl} alt="Post" className="post-image" />
        </div>
      )}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <Reacciones postId={post.id} postOwnerId={post.ownerId} initialLikesCount={post.likesCount || 0} />
        <ShareButton contentId={post.id} contentType="post" />
      </div>
      <div className="post-comments-section">
        <CommentSection postId={post.id} postOwnerId={post.ownerId} />
      </div>
    </div>
  );
}
