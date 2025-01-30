import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { firestore } from '@lib/firebase';
import Link from 'next/link';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Drag-and-Drop library

const transition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96],
};

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function GalleryFeed({ galleries, admin, categoryFilter, slider, categories }) {

  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    if (galleries && Array.isArray(galleries)) {
      // Sort galleries by order when they are received
      const sortedGalleries = galleries.sort((a, b) => a.order - b.order);
      setGalleryList(sortedGalleries);
    }
  }, [galleries]);


  const SliderSettings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
    responsive: [
      { breakpoint: 2000, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  }), []);

  const filter = useCallback((gallery) => {
    if (!gallery.categories || gallery.categories.length === 0) return false;
    return gallery.categories.some(category => categoryFilter.has(category));
  }, [categoryFilter]);

  const filteredGalleries = useMemo(() => {
    return categoryFilter && categoryFilter.size > 0
      ? galleryList.filter(filter)
      : galleryList;
  }, [galleryList, categoryFilter, filter]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedGalleries = Array.from(galleryList);
    const [movedItem] = reorderedGalleries.splice(result.source.index, 1);
    reorderedGalleries.splice(result.destination.index, 0, movedItem);

    setGalleryList(reorderedGalleries);

    saveOrderToFirestore(reorderedGalleries);
  };

  const saveOrderToFirestore = async (reorderedGalleries) => {
    try {
      await Promise.all(reorderedGalleries.map((gallery, index) => {
        const docRef = firestore.collection('gallery').doc(gallery.slug);
        console.log(`Updating gallery: ${gallery.slug} at path: ${docRef.path}`);
        return docRef.update({ order: index });
      }));

      console.log("Gallery order updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating gallery order:", error);
    }
  };

  return galleryList ? (
    <div className="container">

      <div className="gallery-feed">
        {admin ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="galleryFeed">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredGalleries.map((gallery, index) => (
                    <Draggable key={gallery.slug} draggableId={gallery.slug} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <GalleryItem
                            gallery={gallery}
                            admin={admin}
                            categories={categories}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          slider ? (
            <Slider {...SliderSettings}>
              {filteredGalleries.map((gallery) => (
                <GalleryItem
                  key={gallery.slug}
                  gallery={gallery}
                  admin={admin}
                  categories={categories}
                />
              ))}
            </Slider>
          ) : (
            filteredGalleries.map((gallery) => (
              <GalleryItem
                key={gallery.slug}
                gallery={gallery}
                admin={admin}
                categories={categories}
              />
            ))
          )
        )}
      </div>
    </div>
  ) : null;
}

const GalleryItem = React.memo(function GalleryItem({ gallery, admin, categories = [] }) {
  const getCategoryName = useCallback((categorySlug) => {
    if (!categories || categories.length === 0) return categorySlug;
    const category = categories.find(cat => cat.slug === categorySlug);
    return category ? category.title : categorySlug;
  }, [categories]);

  return (
    <motion.div
      className="gallery-feed__item"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      { !admin ?
      <div className="gallery-feed__item__frame">
        <Link href={`/${gallery.slug}`} scroll={false}>
          <div>
            {gallery.imageUrl ? (
              <motion.div
                className="gallery-feed__item__frame__img"
                initial={{ scale: 1.08 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  alt={gallery.title}
                  width={1500}
                  height={1000}
                  src={gallery.imageUrl}
                  priority={gallery.slug === 'home-featured'}
                  loading="lazy"
                  sizes="(max-width: 768px) 65vw, (max-width: 1200px) 85vw, (max-width: 1800px) 90vw, 90vw" 
                />
              </motion.div>
            ) : (
              <div className="gallery-feed__item__frame__img gallery-feed__item__frame__img--placeholder"></div>
            )}
            {gallery.categories && !admin && (
              <div className="gallery-feed__item__frame__categories">
                {gallery.categories.map(category => (
                  <div key={`${gallery.title}-${category}`} className="gallery-feed__item__frame__categories__item">
                    {getCategoryName(category)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>

      : <></> }
       
      <motion.div
        className="gallery-feed__item__info"
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Link className="gallery-feed__item__info__title" href={`/${gallery.slug}`} scroll={false} prefetch>
          {gallery.title}
        </Link>
        <span className="gallery-feed__item__info__desc">
          <ReactMarkdown>{gallery.desc}</ReactMarkdown>
        </span>

        {admin && (
          <>
            <p className={`gallery-feed__item__info__published ${gallery.published ? 'gallery-feed__item__info__published--live' : ''}`}>
              {gallery.published ? 'Publikované' : 'Koncept'}
            </p>
            <Link href={`/admin/${gallery.slug}`} prefetch>
              <p className="gallery-feed__item__info__edit">Editovať</p>
            </Link>
          </>
        )}
      </motion.div>
    </motion.div>
  );
});

// Fetch categories at build time
export async function getStaticProps() {
  const categoriesSnapshot = await firestore.collection('categories').get();
  const categories = categoriesSnapshot.docs.map((doc) => doc.data());

  return {
    props: {
      categories,
    },
    revalidate: 60,
  };
}
