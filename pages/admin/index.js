import AuthCheck from '@components/AuthCheck';
import { firestore, auth, serverTimestamp } from '@lib/firebase';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import debounce from 'lodash.debounce';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import GalleryFeed from '@components/GalleryFeed';
import PageLayout from '@components/PageLayout';
import Categories from '@components/Categories';
import Navbar from '@components/Navbar';

export default function AdminPostsPage(props) {
  return (
    <AuthCheck>

      <Navbar />
      <PageLayout />
      <div className='admin-archive'>

        <div className='container admin-archive--container'>
          <h1  className='admin-archive__title' >Manažér projektov</h1>
          <CreateNewGallery />
        </div>

        <div className='container'>
          <Categories title='Kategórie' admin />
        </div>

        <PostList />  
        
      </div>
    </AuthCheck>
  );
}

function PostList() {
  const ref = firestore.collection('gallery')
  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);

  const galleries = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <div className='container'>
        <h2 className='admin-archive__subtitle'>Projekty</h2>
      </div>
      <GalleryFeed galleries={galleries} admin />
    </>
  );
}

function CreateNewGallery() {

  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [openForm, setOpenForm] = useState(false)

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValidCheck = title.length > 3;

  // Hit the database for title match after each debounced change
  // useCallback is required for debounce to work

  useEffect(() => {
    checkGalleryTitle(slug);
  }, [title]);
  
  const checkGalleryTitle = useCallback(
    debounce(async (gallerySlug) => {
      if (gallerySlug.length > 3) {
        const ref = firestore.doc(`gallery/${gallerySlug}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        exists ? toast('Title alredy exists', {icon: '⚠️',}) : null
      }else(
        gallerySlug.length >= 1 ? toast('Choose longer Tile', {icon: '⌨️',}) : null
      )
    }, 500),
    []
  );

  // Create a new post in firestore
  const createGallery = async (e) => {
    e.preventDefault();
    const ref = firestore.collection('gallery').doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      published: false,
      content: '# hello world!',
      featureImage: [],
      images: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await ref.set(data);

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <div className='new-gallery'>

      <div className='new-gallery__create' onClick={() => setOpenForm(prev => !prev)}>
        <svg className='new-gallery__create__icon' viewBox="0 0 20 20">
          <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
        </svg>
        <p className='new-gallery__create__text'>Vytvoriť nový projekt</p>
      </div>

      <div className={`new-gallery__modal ${openForm ? 'new-gallery__modal--active' : ''} `}>

        <form className='new-gallery__modal__form' onSubmit={createGallery}>

          <h2 className='new-gallery__modal__form__title'>Pridať nový projekt</h2>

          <input
            className='new-gallery__modal__form__input input'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Názov projektu"
          />
          <p className={`new-gallery__modal__form__slug ${isValidCheck && isValid ? 'new-gallery__modal__form__slug--valid' : '' }`}>
            <strong>Slug:</strong> {slug}
          </p>
          <button  className='button new-gallery__modal__form__create' type="submit" disabled={isValidCheck && isValid ? false : true }>
            Vytvoriť nový projekt
          </button>
        </form>

        <div className='new-gallery__modal__close' onClick={() => setOpenForm(false)} >
          <svg className='new-gallery__modal__close__icon' viewBox="0 0 20 20">
            <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
          </svg>
        </div>

      </div>

    </div>
  );
}
