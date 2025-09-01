'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, MessageCircle, Share, MoreHorizontal, User, MapPin, Calendar } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    user: {
      name: 'María García',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      location: 'Madrid'
    },
    content: '¡Hoy adopté a Luna! Es una gatita increíble y ya se ha adaptado perfectamente a nuestro hogar. Gracias Raizel por hacer esto posible. 🐱❤️',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
    likes: 124,
    comments: 18,
    shares: 5,
    timestamp: '2024-01-15T10:30:00Z',
    isLiked: false
  },
  {
    id: '2',
    user: {
      name: 'Carlos Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      location: 'Barcelona'
    },
    content: 'Max está disfrutando de su primer paseo en el parque. Es increíble ver lo feliz que está explorando su nuevo mundo. ¡La adopción fue la mejor decisión! 🐕',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop',
    likes: 89,
    comments: 12,
    shares: 3,
    timestamp: '2024-01-14T15:45:00Z',
    isLiked: true
  },
  {
    id: '3',
    user: {
      name: 'Ana López',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      location: 'Valencia'
    },
    content: 'Milo aprendió a sentarse en solo una semana. Es tan inteligente y obediente. ¡Estoy orgullosa de mi pequeño! 🐾',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    likes: 156,
    comments: 24,
    shares: 8,
    timestamp: '2024-01-13T09:20:00Z',
    isLiked: false
  }
];

// Skeleton component for loading states
const PostSkeleton = () => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
      <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      <div className="flex justify-between">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>
    </CardContent>
  </Card>
);

// Post component
const Post = ({ post, onLike, onComment, onShare }: {
  post: any;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* User header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold text-[#0B1220]">{post.user.name}</h3>
                <div className="flex items-center text-[#6B7280] text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {post.user.location}
                  <span className="mx-2">•</span>
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatRelativeTime(post.timestamp)}
                </div>
              </div>
            </div>
            <button className="p-2 text-[#6B7280] hover:text-[#0F6FF6] transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-[#374151] mb-4 leading-relaxed">
            {post.content}
          </p>

          {/* Image */}
          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E6EEF7]">
            <motion.button
              onClick={handleLike}
              className="flex items-center text-[#6B7280] hover:text-[#FF7A59] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'text-[#FF7A59] fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>

            <motion.button
              onClick={() => onComment(post.id)}
              className="flex items-center text-[#6B7280] hover:text-[#0F6FF6] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{post.comments}</span>
            </motion.button>

            <motion.button
              onClick={() => onShare(post.id)}
              className="flex items-center text-[#6B7280] hover:text-[#00C2A8] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Share className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{post.shares}</span>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate loading posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    setLoading(true);
    // Simulate loading more posts
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPosts(prev => [...prev, ...mockPosts]);
    setHasMore(false); // For demo purposes
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en el feed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E6EEF7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F6FF6] focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </AnimatePresence>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Load more button */}
          {!loading && hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Button
                variant="outline"
                onClick={loadMorePosts}
                loading={loading}
              >
                Cargar más publicaciones
              </Button>
            </motion.div>
          )}

          {/* No more posts */}
          {!loading && !hasMore && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-[#6B7280]">No hay más publicaciones para mostrar</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
