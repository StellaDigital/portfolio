import dynamic from 'next/dynamic';
import { firestore, fromMillis, postToJSON, storage } from '@lib/firebase';

import { useEffect, useState, useRef, useCallback } from 'react';
import PageTransition from '@components/PageTransition';

// Dynamically import components to reduce initial load
const GalleryFeed = dynamic(() => import('@components/GalleryFeed'));
const PageLayout = dynamic(() => import('@components/PageLayout'));
const Loader = dynamic(() => import('@components/Loader'));
const Categories = dynamic(() => import('@components/Categories'));
const Footer = dynamic(() => import('@components/Footer'));
const AnimatedHeader = dynamic(() => import('@components/AnimatedHeader'));
const Navbar = dynamic(() => import('@components/Navbar'));

import { useMediaQuery } from 'react-responsive'


export async function getServerSideProps() {

  const galleriesQuery = firestore
    .collectionGroup('gallery')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc');

  const galleries = (await galleriesQuery.get()).docs.map(postToJSON);

  const galleriesWithImageUrls = await Promise.all(
    galleries.map(async (gallery) => {
      try {
        const ref = storage.ref(`uploads/${gallery.slug}/featured.jpg`);
        const url = await ref.getDownloadURL();
        return { ...gallery, imageUrl: url };
      } catch (error) {
        console.error(`Error getting image URL for gallery ${gallery.slug}:`, error);
        return gallery;
      }
    })
  );

  const categoriesSnapshot = await firestore.collection('categories').get();
  const categories = categoriesSnapshot.docs.map(postToJSON);

  return {
    props: { 
      galleries: galleriesWithImageUrls,
      categories,
    }
  };

}

export default function Home(props) {
  const [galleries, setGalleries] = useState(props.galleries);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const resultsRef = useRef(null);
  
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const enableAnimations = !isMobile;

  const handleSelect = (selected) => {
    setSelectedCategories(selected);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    
    <div className='homepage'>

      {/*<PageTransition pageIsLoaded={true} />*/}
      <Navbar categories={props.categories} />
      <PageLayout />

      { enableAnimations ? <AnimatedHeader />
      :
        <div className='container'>
          <div className='page-header'> 
            <div className='page-header__line'>
              <h1 className='page-header__line__title'>Foto a video</h1>
            </div>
            <div className='page-header__line'>
              <p className='page-header__line__text'> Poskytujeme profesionálne fotografické a video služby, ako napríklad štúdiové fotografie, fotenia pre firmy, dronové zábery a postprodukciu na mieru. </p>
              <h1 className='page-header__line__title'><strong>produkcia</strong></h1>
            </div>
            <div className='page-header__line' >
              <h1 className='page-header__line__title'> Stella Digit </h1>
            </div>
          </div>
        </div>
      }

      <div className='container'>
        <Categories onSelect={handleSelect} title='Vybrať kategóriu portfólia' resultsRef={resultsRef} categories={props.categories} />
      </div>
      
      <div ref={resultsRef} className='scroll-anchor'></div>
      <GalleryFeed categoryFilter={selectedCategories} galleries={galleries} />

      <Loader show={loading} />

      <Footer />

    </div>
  );
}