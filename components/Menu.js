import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { firestore } from "@lib/firebase";
import { postToJSON } from "@lib/firebase";
import { motion } from "framer-motion";
import Socials from "./Socials";
import PageLayout from "./PageLayout";
import { stopScroll } from "@lib/functions";

import Categories from '@components/Categories';

const transitionMenu = {
  duration: .25,
  ease: [0.43, 0.13, 0.23, 0.96],
  damping: 100,
  delay: .2,
  mass: 1,
  stiffness: 400,
  type: "spring"
};

const headingTransition = {
  duration: .5,
  ease: [0, 0, 0.35, 1],
};

const menuDropdown = {
  open: {
    x: '0%',
    transition: {...transitionMenu}
  },
  closed: {
    x: '100%',
    transition: {...transitionMenu, delay: .5}
  }
}

const menuLinks = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: .5 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menuLink = {
  open: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      ...headingTransition,
      y: { stiffness: 1000, velocity: 100 },
    }
  },
  closed: {
    y: 100,
    opacity: 0,
    rotate: 6,
    transition: {
      ...headingTransition,
      y: { stiffness: 1000 },
    }
  }
};

const Menu = (props) => {

  const router = useRouter();
  const [galleries, setGalleries] = useState(null);
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeMenuAnimation, setActiveMenuAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setActiveMenu(false);
    setActiveMenuAnimation(false);
  }, [props.isActive]);

  useEffect(() => {
    stopScroll(activeMenu);
  }, [activeMenu]);

  const handleMenu = () => {
    if(activeMenu){
        setActiveMenuAnimation(false);
        setTimeout(() => {
          setActiveMenu(false);
        }, 2000); 
    } else {
      setActiveMenu(true);
      setActiveMenuAnimation(true);
    }
  }

  const handleNavigation = useCallback((url) => {
    setLoading(true);
    window.location.href = url;  // Force a full page reload
  }, []);

  /*
  useEffect(() => {
    const getGalleryLinks = async () => {
      const galleriesQuery = firestore
        .collectionGroup('gallery')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc');
      const galleries = (await galleriesQuery.get()).docs.map(postToJSON);
      setGalleries(galleries);
    }
    getGalleryLinks().catch(console.error);
  }, []);
  */

  return (
    <div className={`menu ${activeMenuAnimation ? 'active' : '' }`}>
      <PageLayout />

      {loading && <div className="loader"></div>}  {/* Loader */}

      <div className={`menu__action ${activeMenuAnimation ? 'close' : '' }`} onClick={activeMenuAnimation === activeMenu ? () => handleMenu() : null}>
        {activeMenuAnimation ? 'Zavrieť' : 'Menu' }
      </div>

      { activeMenu &&
      <motion.div
        className='menu__dropdown'
        initial={{x: '100%'}}
        variants={menuDropdown}
        animate={activeMenuAnimation ? 'open' : 'closed'}
      >
        <div className="container">
          {/*
          <motion.ul className="menu__dropdown__nav" variants={menuLinks}>
            <li onClick={() => handleNavigation('/')} className={`menu__dropdown__nav__item ${router.asPath === "/" ? 'active' : ''}`}>
              <motion.p style={{y: 100, opacity: 0, rotate: 6}} variants={menuLink} className='menu__dropdown__nav__item__text'>Domov</motion.p>
            </li>
            {galleries && galleries.map((gallery) => (
              <li key={gallery.slug} onClick={() => handleNavigation(`/${gallery.slug}`)} className={`menu__dropdown__nav__item ${router.asPath === `/${gallery.slug}` ? 'active' : ''}`}>
                <motion.p style={{y: 100, opacity: 0, rotate: 6}} variants={menuLink} className='menu__dropdown__nav__item__text'>{gallery.title}</motion.p>
              </li>
            ))}
          </motion.ul>
          */}
          { activeMenu &&  <Categories categories={props.categories ? props.categories : null } resultsRef={resultsRef} menu /> }
          <Socials />
        </div>
      </motion.div>
      }
    </div>
  );
}

export default Menu;
