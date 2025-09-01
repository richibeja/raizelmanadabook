/**
 * Image optimization utilities for Raizel
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Generate optimized image URL with parameters
 */
export function optimizeImage(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;

  // If using a CDN like Cloudinary, Vercel, or similar
  if (originalUrl.includes('unsplash.com')) {
    const url = new URL(originalUrl);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fit', fit);
    url.searchParams.set('fm', format);
    
    return url.toString();
  }

  // For other image URLs, return as is
  return originalUrl;
}

/**
 * Generate responsive image srcSet
 */
export function generateSrcSet(
  originalUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280],
  options: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  return widths
    .map(width => {
      const optimizedUrl = optimizeImage(originalUrl, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: Record<string, string> = {}): string {
  const defaultSizes = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    '(min-width: 1025px)': '25vw'
  };

  const sizes = { ...defaultSizes, ...breakpoints };
  
  return Object.entries(sizes)
    .map(([query, size]) => `${query} ${size}`)
    .join(', ');
}

/**
 * Create optimized image object
 */
export function createOptimizedImage(
  originalUrl: string,
  alt: string,
  options: ImageOptimizationOptions & { sizes?: Record<string, string> } = {}
): OptimizedImage {
  const { sizes: customSizes, ...optimizationOptions } = options;
  
  return {
    src: optimizeImage(originalUrl, optimizationOptions),
    srcSet: generateSrcSet(originalUrl, undefined, optimizationOptions),
    sizes: generateSizes(customSizes),
    alt,
    width: optimizationOptions.width || 800,
    height: optimizationOptions.height || 600
  };
}

/**
 * Lazy load image with intersection observer
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  options: { threshold?: number; rootMargin?: string } = {}
): () => void {
  const { threshold = 0.1, rootMargin = '50px' } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    { threshold, rootMargin }
  );

  observer.observe(imgElement);

  return () => observer.disconnect();
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Generate thumbnail URL
 */
export function generateThumbnail(
  originalUrl: string,
  size: number = 150
): string {
  return optimizeImage(originalUrl, {
    width: size,
    height: size,
    fit: 'cover',
    quality: 70
  });
}

/**
 * Generate placeholder image
 */
export function generatePlaceholder(
  width: number,
  height: number,
  text: string = 'Loading...'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  // Background
  ctx.fillStyle = '#E6EEF7';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#6B7280';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
}

/**
 * Check if image is loaded
 */
export function isImageLoaded(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Convert image to base64
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image file
 */
export function compressImage(
  file: File,
  options: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    const { quality = 0.8, maxWidth = 1920, maxHeight = 1080 } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
