import AuthCheck from '@components/AuthCheck';
import { firestore, auth, serverTimestamp, storage, listAll, deleteObject } from '@lib/firebase';
import ImageUploader from '@components/ImageUploader';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import Back from '@components/Back';
import PageLayout from '@components/PageLayout';
import Navbar from '@components/Navbar';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <Navbar />
      <PageLayout />
      <div className='edit-post'>
        <div className='container'>
          <Back href="/admin" where='späť' />
          <GalleryManager />
        </div>
      </div>
    </AuthCheck>
  );
}

function SelectCategory(){

  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(new Set([]))
  const [isOpen, setIsOpen] = useState(false)
  
  const router = useRouter();
  const { slug } = router.query;
  const galleryRef = firestore.collection('gallery').doc(slug);


  /* GET CATEGORY */
  useEffect(() => {

    /* categories */
    firestore.collection('categories').get().then((querySnapshot) => {
      setCategories( querySnapshot?.docs.map((doc) => doc.data()) )
    });

    /* selected */
    firestore.collection('gallery').doc(slug).get().then((doc) => {
      const setupCategories = doc.data()?.categories
      setSelectedCategories(new Set(setupCategories))
    });

  }, [])


  /* ADD GALLERY CATEGORY */
  const addGalleryCategory = (event, slug) => {
    
    event.preventDefault()
    let selected = new Set([...selectedCategories]);

    if(selected.has(slug)){
      selected.delete(slug) 
      toast('Priradenie ku kategórii zrušené', { icon: '🗑️' });
    }else{
      selected.add(slug)
      toast.success('Kategória pridaná!')
    }

    const writeSelectedToDb = async () => {
      await galleryRef.update({
        categories: [...selected],
      });
    }

    writeSelectedToDb()
      .catch((error) => `error write selected to Db => ${error}`)

    setSelectedCategories(selected)

  }

  return(
    <div className={`select-category ${isOpen ? 'open' : ''}`}>

      <div onClick={() => setIsOpen(prev => !prev)} className='select-category__select'>

        <svg className='select-category__select__icon' viewBox="0 0 20 20">
          <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
        </svg>

      </div>

      { 
          selectedCategories.size === 0 ?

            <p className='select-category__text'>Vyber kategóriu</p>

          :
        
            <div className='select-category__selected'>

              { categories &&
                
                categories.map(category => {
                  return( selectedCategories.has(category.slug) &&
                    <div key={`select-category__selected__item-${category.slug}`} className='select-category__selected__item'>
                      <svg onClick={(e) => addGalleryCategory(e, category.slug)} className='select-category__selected__item__icon' viewBox="0 0 20 20">
                        <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                      </svg>
                      <p className='select-category__selected__item__text'>{category.title}</p>
                    </div>
                  )
                })
              
              }
              
            </div>

        }


        <ul className='select-category__dropdown'>
          { categories &&
          
            categories.map(category => {
              return(
                <li key={category.slug} onClick={(e) => addGalleryCategory(e, category.slug)} className={`select-category__dropdown__item ${ selectedCategories.has(category.slug) ? 'selected' : '' } `}>{category.title}</li>
              )
            })
          
          }
          
        </ul>

    </div>
  )
}

function GalleryManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const galleryRef = firestore.collection('gallery').doc(slug);
  const [gallery] = useDocumentDataOnce(galleryRef);

  return (
    <div>
      {gallery && (
        <div className='edit-post__main'>

          <div className='edit-post__main__info'>
            <h1 className='edit-post__main__info__title'>{gallery.title}</h1>
            <p className='edit-post__main__info__slug'><strong>slug:</strong> {gallery.slug}</p>
          </div>

          <section className='edit-post__main__content'>
            <h3 className='edit-post__main__content__title'>Upraviť projekt</h3>
            <GalleryForm galleryRef={galleryRef} defaultValues={gallery} preview={preview} />
          </section>

          <aside className='edit-post__main__aside'>
            
            <div className='edit-post__main__aside__block'>
              <h3 className='edit-post__main__aside__block__title'>Akcie</h3>
              <button className='edit-post__main__aside__block__action' onClick={() => setPreview(!preview)}>
                <svg className='edit-post__main__aside__block__action__icon' viewBox="0 0 20 20">
                  <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
                </svg>
                {preview ? 'Editovať' : 'Náhľad'}
              </button>
              <DeleteGalleryButton gallerySlug={slug} galleryRef={galleryRef} />
            </div>

            <div className='edit-post__main__aside__block edit-post__main__aside__block--categories'>
              <h3 className='edit-post__main__aside__block__title'>Kategórie</h3>
              <SelectCategory />
            </div>

            <div className='edit-post__main__aside__block'>
              <h3 className='edit-post__main__aside__block__title'>Náhľadový obrázok</h3>
              <ImageUploader featured={true} galleryTitle={gallery.slug} />
            </div>

          </aside>
        </div>
      )}
    </div>
  );
}

function GalleryForm({ defaultValues, galleryRef, preview }) {
  const { register, handleSubmit, formState: { errors, isValid, isDirty }, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

  const updateGallery = async ({ desc, content, youtubeUrl, published }) => {
    await galleryRef.update({
      desc,
      content,
      youtubeUrl, // Save the YouTube URL in Firestore
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ desc, content, youtubeUrl, published });

    toast.success('Projekt úspešne aktualizovaný!');
  };

  const getYoutubeEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return ( 
    <form className='edit-post__main__content__form' onSubmit={handleSubmit(updateGallery)}>
      {preview && (
        <div className="card">
          <div className='card__item card__item--desc'>
            <p className='card__item__title'>Popis</p>
            <ReactMarkdown>{watch('desc')}</ReactMarkdown>
          </div>
          <div className='card__item card__item--content'>
            <p className='card__item__title'>Kontent</p>
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
          {watch('youtubeUrl') && (
            <div className='card__item card__item--youtube'>
              <p className='card__item__title'>YouTube Video</p>
              <iframe
                width="560"
                height="315"
                src={getYoutubeEmbedUrl(watch('youtubeUrl'))}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      <div className='edit-post__main__content__form__fields' style={{display: preview ? 'none' : null }}>

        <ImageUploader galleryTitle={defaultValues.slug} />

        <div className='edit-post__main__content__form__fields__item'>
          <label className='edit-post__main__content__form__fields__item__label label'>
            Popis projektu
            <span className='edit-post__main__content__form__fields__item__label__desc label__desc'>
              Popis používa markdown - <a target='_blank' href="https://www.markdownguide.org/cheat-sheet/">návod</a>
            </span>
          </label>
          <textarea
            className='edit-post__main__content__form__fields__item__textarea edit-post__main__content__form__fields__item__textarea--desc'
            {...register('desc', { 
              maxLength: { value: 100, message: 'popis projektu je príliš dlhý' },
              required: 'popis projektu je povinný',
            })}
          ></textarea>
        </div>

        <div className='edit-post__main__content__form__fields__item'>
          <label className='edit-post__main__content__form__fields__item__label label'>
            Článok
            <span className='edit-post__main__content__form__fields__item__label__desc label__desc'>
            Popis používa markdown - <a target='_blank' href="https://www.markdownguide.org/cheat-sheet/">návod</a>
            </span>
          </label>
          <textarea
            className='edit-post__main__content__form__fields__item__textarea edit-post__main__content__form__fields__item__textarea--content'
            {...register('content', { 
              maxLength: { value: 20000, message: 'kontent projektu je príliš dlhý' },
              required: false,
            })}
          ></textarea>
        </div>

        <div className='edit-post__main__content__form__fields__item'>
          <label className='edit-post__main__content__form__fields__item__label label'>
            YouTube URL
            <span className='edit-post__main__content__form__fields__item__label__desc label__desc'>
              Vložte URL YouTube videa
            </span>
          </label>
          <input
            className='edit-post__main__content__form__fields__item__input'
            {...register('youtubeUrl')}
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {errors.content ? toast(`${errors.content.message}`, {icon: '⚠️'}) : null}
        {errors.desc ? toast(`${errors.desc.message}`, {icon: '⚠️'}) : null }

        <fieldset className='edit-post__main__content__form__fields__checkbox checkbox' >
          <input {...register('published')} type="checkbox" id='edit-post-published' className='edit-post__main__content__form__fields__checkbox__input checkbox__input' />
          <label htmlFor='edit-post-published' className='edit-post__main__content__form__fields__checkbox__label checkbox__label'>Publikované</label>
        </fieldset>

        <button type="submit" className='edit-post__main__content__form__fields__submit' disabled={!isDirty || !isValid}>
          Uložiť zmeny
        </button>
      </div>
    </form>
  );
}


function DeleteGalleryButton({ galleryRef, gallerySlug }) {
  const router = useRouter();

  const deleteGallery = async () => {
    const doIt = confirm('Naozaj chcete vymazať tento projekt?');
    if (doIt) {

      let storageRef = storage.ref(`uploads/${gallerySlug}`);

      const deleteStorageFiles = async () => {
        storageRef.listAll()
          .then((res) => {
            res.items.forEach((itemRef) => {
              itemRef.delete()
            });
          }).catch((error) => {
            return false;
          });
      }

      await galleryRef.delete();
      await deleteStorageFiles();

      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className='edit-post__main__aside__block__action edit-post__main__aside__block__action--delete' onClick={deleteGallery}>
      <svg className='edit-post__main__aside__block__action__icon' viewBox="0 0 20 20">
        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
      </svg>
      Vymazať projekt
    </button>
  );
}
