'use client';

import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import PostReactions from './PostReactions';
import TaggedContentRenderer from './TaggedContentRenderer';
import CommentSection from './CommentSection';
import './PostCard.css';

interface Post {
    id: string;
    ownerId: string;
    ownerName: string;
    ownerAvatarUrl?: string;
    taggedUsers?: { userId: string; displayName: string; }[];
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: Timestamp;
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const postDate = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Hace un momento';

    return (
        <div className="post-card">
            <div className="post-header">
                <img src={post.ownerAvatarUrl || 'https://via.placeholder.com/40'} alt={post.ownerName} className="post-owner-avatar" />
                <div className="post-header-info">
                    <Link href={`/profile/${post.ownerId}`}><strong>{post.ownerName}</strong></Link>
                    <small>{postDate}</small>
                </div>
            </div>
            <TaggedContentRenderer content={post.content} taggedUsers={post.taggedUsers || []} />
            {post.imageUrl && <img src={post.imageUrl} alt="Contenido de la publicación" className="post-image" />}
            <div className="post-actions">
                <PostReactions postId={post.id} postOwnerId={post.ownerId} initialReactionsCount={post.likesCount} />
            </div>
            <CommentSection postId={post.id} postOwnerId={post.ownerId} />
        </div>
    );
}
