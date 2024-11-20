import { firestore, auth, serverTimestamp } from '@lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

import React, {useState, useEffect, useCallback, useRef } from "react";
import kebabCase from 'lodash.kebabcase';
import debounce from 'lodash.debounce';
import toast from 'react-hot-toast';
import { motion, useScroll } from 'framer-motion';

export default function Categories(props){

  const [categoryName, setCategoryName] = useState('')
  const [isValid, setIsValid] = useState(false);
  const categorySlug = encodeURI(kebabCase(categoryName))
  const isValidCheck = categoryName.length > 3;
  const [selected, setSelected] = useState(new Set([]))

  const [categories, setCategories] = useState([])
  const categoriesListing = useRef()
  const { categoriesScroll } = useScroll({ container: categoriesListing })

  const getCategories = async () => {
    try {
      const snapshot = await firestore.collection('categories').get();
      setCategories(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  useEffect(() => {

    const setupSelected = new Set([]);
    const params = new URLSearchParams(window.location.search);
    const categories = params.get('categories');
    categories?.split('_').forEach((param => {
      setupSelected.add(param)
    }));
    setSelected(setupSelected);

    props.categories ? setCategories(props.categories) : getCategories()

    console.log('CATGEORIESS')

  }, []);


  if(props.onSelect){
    useEffect(() => {
      props.onSelect(selected)
    })
  }

  /* NEW CATEGORY */
  const createCategory = async (e) => {
    
    e.preventDefault();
    const ref = firestore.collection('categories').doc(categorySlug)
    const data = {
      title: categoryName,
      slug: categorySlug,
      createdAt: serverTimestamp(),
    };

    await ref.set(data);
    setCategoryName('')
    setCategories([...categories, data])
    toast.success('Kategória bola vytvorená');

  };

  /* CHECK CATEGORY TITLE */
  useEffect(() => {
    checkCategoryTitle(categorySlug);
  }, [categoryName]);
  
  const checkCategoryTitle = useCallback(
    debounce(async (categorySlug) => {
      if (categorySlug.length > 3) {
        const ref = firestore.doc(`categories/${categorySlug}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        exists ? toast('Kategória už existuje', {icon: '⚠️',}) : null
      }else(
        categorySlug.length >= 1 ? toast('Zvoľte dlhší názov', {icon: '⌨️',}) : null
      )
    }, 500),
    []
  );

  /* REMOVE CATEGORY */
  const removeCategory = async (event, slug, title) => {

    /* [ TODO - after removing category, remove category from every project that was signed to it ] */

    let withoutDeleted = [...categories]
    const doIt = confirm('Naozaj chcete natrvalo vymazať tieto kategórie?')
    const ref = firestore.collection('categories').doc(slug)

    if(doIt){
      await ref.delete()
      toast(`kategória: ${title} vymazaná`, { icon: '🗑️' });
      setCategories(withoutDeleted.filter((category) => category.slug !== slug))
    }

  }

  function updateURLParameter(param, values) {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const newUrl = `${url.origin}/?${param}=${values}`
    window.history.replaceState({}, '', newUrl.toString());
  }

  const selectCategory = (event, slug) => {

    event.preventDefault()
    let selectedSet = new Set([...selected])
    selectedSet.has(slug) ? selectedSet.delete(slug) : selectedSet.add(slug)
    setSelected(selectedSet)

    const menuCategories = () => {
      selectedSet.clear();
      selectedSet.add(slug);
    }

    props.menu ? menuCategories() : null
    updateURLParameter('categories', Array.from(selectedSet).join('_'))
    scrollToResults();
    if(props.menu){
      scrollToResults();
      window.location.reload();
    }

  }

  const scrollToResults = () => {
    const targetComponent = props.resultsRef.current;
    if (targetComponent) {
      const offsetTop = targetComponent.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  const handleCategoriesSelectedRemove = () => {
    setSelected(new Set([]));
    window.history.replaceState({}, '', window.location.origin);
  }

  function CategoriesListing({ categories }) {

    return(
      <>
      <div ref={categoriesListing} className='categories__listing'>
        {
          categories.map((category) => {
            return (
              <div key={category.slug} onClick={(e) => !props.admin ? selectCategory(e, category.slug) : null } className={`categories__listing__item ${props.admin ? 'categories__listing__item--remove' : '' } ${selected.has(category.slug) ? 'selected' : 'null' }`}>

                { props.admin && 
                <svg onClick={(e) => props.admin ? removeCategory(e, category.slug, category.title) : null } className='categories__listing__item__icon' viewBox="0 0 20 20">
                  <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                </svg>
                }

                { !props.admin && 
                <svg className='categories__listing__item__icon' viewBox="0 0 20 20">
                    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                </svg>
                }

                <p className='categories__listing__item__text' key={category.slug} >{category.title}</p>
              </div>
            )
          })
        } 
      </div>

      { !props.admin && selected.size > 0 &&

        <div onClick={() => handleCategoriesSelectedRemove()}  className='categories__remove'>
          <svg className='categories__remove__icon' viewBox="0 0 20 20">
            <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
          </svg>
          <p className='categories__remove__text'>Vymazať</p>
        </div>
        
      }

      </>
    )

  }

  return(

    <div className='categories'>

      { props.title && <h2 className='categories__title'>{props.title}</h2> }


      <CategoriesListing categories={categories} />

      { props.admin &&
      <div className='new-category'>
        <form  className='new-category__form' onSubmit={createCategory}>
          <input
            className={`new-category__form__input input ${isValidCheck && isValid ? 'success' : 'error'}`}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nová ketegória"
          />
          <button className='new-category__form__button' type='submit' disabled={isValidCheck && isValid ? false : true }>
            <svg  className='new-category__form__button__icon' viewBox="0 0 20 20">
              <path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path>
            </svg>
          </button>
        </form>
      </div>
      } 

    </div>
  )
}
