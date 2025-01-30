import React, { useState, useEffect, useRef } from 'react';
import { getGalleryByName, postToJSON, storage } from '@lib/firebase';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageTransition from '@components/PageTransition';
import PageLayout from '@components/PageLayout';
import ReactMarkdown from 'react-markdown';
import Footer from '@components/Footer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import useBackButtonListener from '@lib/useBackButtonListener';
import SimilarProjects from '@components/SimilarProjects';
import { firestore } from '@lib/firebase';

import Navbar from '@components/Navbar';

const headingTransition = {
  duration: 1.2,
  ease: [0.12, 0.23, 0.5, 1],
};

const lineVariant = {
  animate: {
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
};

const wordVariant = {
  initial: {
    y: 300,
    rotate: 12,
    opacity: 0,
  },
  animate: {
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 1, ...headingTransition },
  },
};

export async function getServerSideProps({ query }) {


  /* SINGLE GALLERY PROPS */
  const { gallery } = query;
  const galleryDoc = await getGalleryByName(gallery);

  if (!galleryDoc) {
    return {
      notFound: true,
    };
  }

  const galleryPost = postToJSON(galleryDoc);

  const ref = storage.ref(`uploads/${gallery}`);
  const featuredRef = storage.ref(`uploads/${gallery}/featured.jpg`);

  let newImages = [];
  let featuredImageUrl = '';

  try {
    const [res, featuredUrl] = await Promise.all([
      ref.listAll(),
      featuredRef.getDownloadURL(),
    ]);

    featuredImageUrl = featuredUrl;

    const promises = res.items.map(async (imgRef) => {
      const url = await imgRef.getDownloadURL();
      const meta = await imgRef.getMetadata();
      return { url, path: meta.fullPath, name: meta.name };
    });

    newImages = await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching images:', error);
  }

  /* SIMILAR GALLERIES PROPS */
  const galleriesQuery = firestore
    .collectionGroup('gallery')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc');
    //.limit(LIMIT);

  const galleries = (await galleriesQuery.get()).docs.map(postToJSON);

  // Fetch image URLs for each gallery
  const galleriesWithImageUrls = await Promise.all(galleries.map(async (gallery) => {
    try {
      const ref = storage.ref(`uploads/${gallery.slug}/featured.jpg`);
      const url = await ref.getDownloadURL();
      return { ...gallery, imageUrl: url };
    } catch (error) {
      console.error(`Error getting featured image URL for gallery ${gallery.slug}:`, error);
      return gallery; // Return the gallery without imageUrl if there was an error
    }
  }));

  return {
    props: { galleries: galleriesWithImageUrls, galleryPost, gallery, images: newImages, featuredImageUrl },
  };

}

export default function GalleryDetail({ galleryPost, gallery, images, featuredImageUrl, galleries }) {
  const [index, setIndex] = useState(-1);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [lockScroll, setLockScroll] = useState(false);
  const router = useRouter();
  const contentRef = useRef(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  useBackButtonListener(() => {
    setLockScroll(true);
    setTimeout(() => {
      setLockScroll(false);
      window.location.reload(); // Force reload the page
    }, 1000); // Adjust the timeout duration as needed
  });

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setPageIsLoaded(false); // Show the page transition loader
    };

    const handleRouteChangeComplete = (url) => {
      setPageIsLoaded(true); // Hide the page transition loader
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    const targetComponent = contentRef.current;
    if (targetComponent) {
      const offsetTop = targetComponent.offsetTop;
      setTimeout(() => {
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
        setPageIsLoaded(true); // Set the page as loaded after scrolling
      }, 20);
    } else {
      setPageIsLoaded(true); // Set the page as loaded if no scrolling is needed
    }
  }, []);

  const FinalImages = () => {
    const ref = useRef(null);
    
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start start', 'end end'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Filter unique images by url
    const uniqueImages = Array.from(
      new Map(images.map((img) => [img.url, img])).values()
    );

    uniqueImages.map( img => console.log(img.url))

    return (
      <>
        <Lightbox
          index={index}
          slides={uniqueImages.map((img) => ({ src: img.url }))}
          open={index >= 0}
          close={() => setIndex(-1)}
        />

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
          <Masonry gutter={'24px'} className='masonry'>
            {uniqueImages.map((img, idx) => (
              <div ref={ref} className='images-listing__item' key={img.url}>
                <motion.div
                  rel='preload'
                  className='images-listing__item__img'
                  style={{ scale: scale }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIndex(idx)}
                >
                  <Image
                    alt={img.name}
                    width={800}
                    height={800}
                    src={img.url}
                    loading='eager'
                    placeholder='blur' // Blur-up technique
                    blurDataURL='/no-image.jpg' // Placeholder image
                    sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 100vw'
                    className='images-listing__item__img__img'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/no-image.jpg'; // Fallback image
                    }}
                  />
                </motion.div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </>
    );
  };

  return (
    <div className='gallery-single'>
      <PageTransition pageIsLoaded={true} loadingProgress={100} />
      <Navbar />
      <PageLayout />

      <div className='container'>
        <motion.div variants={lineVariant} className='gallery-single__heading'>
          <motion.h1 variants={wordVariant} className='gallery-single__heading__title'>
            {galleryPost.title}
          </motion.h1>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1, delay: 1.2, ...headingTransition } }}
            className='gallery-single__heading__desc'
          >
            <ReactMarkdown>
              {galleryPost.desc}
            </ReactMarkdown>
          </motion.div>
        </motion.div>
      </div>

      <div className='gallery-single__featured'>
        {featuredImageUrl && (
          <motion.div
            rel='preload'
            className='gallery-single__featured__img'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            key={featuredImageUrl}
            priority='true'
          >
            <Image
              className='gallery-feed__item__frame__img__img'
              alt=''
              width={1920}
              height={1080}
              src={featuredImageUrl}
              loading='eager'
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 100vw'
            />
          </motion.div>
        )}
      </div>

      <div className='container'>

        <div ref={contentRef} className='scroll-anchor'></div>
        <motion.div id='obsah' className='gallery-single__content'>
          <ReactMarkdown>
            {galleryPost.content}
          </ReactMarkdown>
        </motion.div>

        <div className='images-listing'>
          <FinalImages />
        </div>


        {/* YouTube Video Section */}
        {galleryPost.youtubeUrl && (
          <div className='youtube-video'>
            <iframe
              className='video'
              src={`https://www.youtube.com/embed/${galleryPost.youtubeUrl.split('v=')[1]}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <Link href='mailto:info@stelladigit.com' className='zaujem'>
          <div>
            Mám záujem o spoluprácu
          </div>
        </Link>

        <div className='similar'>
          <h3>Podobné projekty:</h3>
          <SimilarProjects categories={galleryPost.categories} galleries={galleries} />
        </div>

      </div>

      <Footer />
    </div>
  );
}