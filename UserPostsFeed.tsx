'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import PostCard from './PostCard';
import './Feed.css';

interface Post {
    id: string;
    ownerId: string;
    ownerName: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: Timestamp;
}

interface UserPostsFeedProps {
    userId: string;
}

export default function UserPostsFeed({ userId }: UserPostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
        setLoading(false);
        return;
    }

    const postsCollection = collection(db, 'posts');
    const q = query(
        postsCollection, 
        where('ownerId', '==', userId), 
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
        setPosts(userPosts);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching user posts: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="feed-container" style={{marginTop: '40px'}}>
      <h3>Publicaciones</h3>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <p>Cargando publicaciones...</p>}
      {!loading && posts.length === 0 && (
        <p>Este usuario aún no ha realizado ninguna publicación.</p>
      )}
    </div>
  );
}
