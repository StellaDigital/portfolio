
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { stopScroll } from "@lib/functions";

const PageTransition = ({ pageIsLoaded, loadingProgress }) => {
  const transition = {
    duration: .6,
    ease: [0.43, 0.13, 0.23, 0.96]
  };

  useEffect(() => {
    stopScroll(!pageIsLoaded);
  }, [!pageIsLoaded]);

  return (
    <motion.div
      className='page-transition'
      initial={{
        y: '0%'
      }}
      animate={{
        y: pageIsLoaded ? '-100%' : '0%'
      }}
      style={{
        y: '0%'
      }}
      exit={{
        y: '0%'
      }}
      transition={transition}
    >
      <div className="loader">

        <motion.div
          className="loader-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: loadingProgress / 100 }}
          transition={{ duration: 0.5, type: "tween" }}
        />
      </div>
      <div>
        <p>Načítavam... {loadingProgress}%</p>
      </div>
    </motion.div>
  );
}

export default PageTransition;
