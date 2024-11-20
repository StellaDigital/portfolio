import Link from 'next/link';
import PageLayout from '@components/PageLayout';
import PageTransition from '@components/PageTransition';
import { motion } from 'framer-motion';

import Navbar from '@components/Navbar';

const headingTransition = {
  duration: 1.2,
  ease: [.12, .23, .5, 1],
};

const lineVariant = {
  animate: {
    transition: {
      delayChildren: .6,
      staggerChildren: .1,
      staggerDirection: 1,
    }
  }
}
  
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
    transition: {duration: 1, ...headingTransition}
  }
}

export default function Custom404() {
  return (
    <div className='page-404'>
      <Navbar />
      <PageLayout />
      <PageTransition pageIsLoaded={true} />
      <div className='container'>
        <motion.div variants={lineVariant} className='page-404__title'>
          <motion.h1 variants={wordVariant} className='page-404__title__text'>Tu nie je nič</motion.h1>
        </motion.div>
        <p className='page-404__desc'><span>🤨</span> Vyzerá, že si zablúdil ...  Ak chceš pokračovať v prehliadaní stránky, vráť sa prosím na domovskú stránku</p>
        <Link href="/">
          <button className="page-404__button">Go home</button>
        </Link>
      </div>
    </div>
  );
}
