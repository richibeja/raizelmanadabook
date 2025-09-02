'use client';
import React from 'react';
import { Heart } from 'lucide-react';

export default function FavoriteButton() { 
  return (
    <button className="flex items-center text-red-500 hover:text-red-600">
      <Heart className="w-4 h-4 mr-1" />
      Favorito
    </button>
  );
}