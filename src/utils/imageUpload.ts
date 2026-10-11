import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Resilient client-side image compression
 * Scales images to maximum width/height while maintaining aspect ratio,
 * outputs optimized JPEG data URL to keep offline/fallback fast and light.
 */
export const compressImageClient = (
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1600, 
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to parse uploaded image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a saree photo directly:
 * 1. Attempts direct upload to Supabase Storage ('products' bucket)
 * 2. If storage bucket is not configured, fails, or is offline, falls back seamlessly
 *    to compressed local Data URL so photo uploads NEVER fail.
 */
export const uploadSareeImage = async (file: File): Promise<string> => {
  // 1. Try Supabase Storage if credentials are valid
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `saree_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(cleanFileName, file, {
          cacheControl: '31536000',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('products')
          .getPublicUrl(cleanFileName);

        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      } else if (error) {
        console.warn('Supabase storage upload notice (using optimized fallback):', error.message);
      }
    } catch (err) {
      console.warn('Storage upload exception (using optimized fallback):', err);
    }
  }

  // 2. Guaranteed fallback to client-side compressed Data URL
  return compressImageClient(file);
};
