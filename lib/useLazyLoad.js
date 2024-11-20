import { useState, useEffect, useRef } from 'react';
import { storage } from '@lib/firebase';

export default function useLazyLoad(gallerySlug) {
  const [src, setSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const ref = storage.ref(`uploads/${gallerySlug}/featured.jpg`);
        const url = await ref.getDownloadURL();
        setSrc(url);
      } catch (error) {
        console.error('Error getting featured image URL:', error);
      }
    };

    const observer = new IntersectionObserver(
      ([entry], observerInstance) => {
        if (entry.isIntersecting) {
          fetchImageUrl();
          observerInstance.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Adjust as needed
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [gallerySlug]);

  return [src, imgRef];
}
