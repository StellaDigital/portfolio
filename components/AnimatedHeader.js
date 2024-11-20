import { useRef, useEffect } from 'react';
import { useViewportScroll, motion, transform, useTransform, useMotionTemplate, useScroll, delay, useSpring } from 'framer-motion';


const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] };
const headingTransition = { duration: 1.2, ease: [0.12, 0.23, 0.5, 1] };
const transitionTextX = { delay: .5, duration: .6, ease: [.12, .23, .5, 1], type: 'spring' };
const line = { animate: { transition: { delayChildren: 0.6, staggerChildren: 0.1, staggerDirection: 1 } } }
const word = { initial: { y: 300, rotate: 12, opacity: 0 }, animate: { y: 0, rotate: 0, opacity: 1, transition: { duration: 1, ...headingTransition } } };

export default function AnimatedHeader() {

  const viewportHeight = useRef(0);
  const { scrollY } = useViewportScroll();
  const scrollYProgress = useTransform(scrollY, [0, viewportHeight.current], [0, 1]);
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 600]), {
    stiffness: 250,
    damping: 50,
    restDelta: 0.1,
  });

  useEffect(() => {
    viewportHeight.current = window.innerHeight;
    const handleResize = () => (viewportHeight.current = window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return(
    <div className='container'>
      <motion.div variants={line} className='page-header'> 
        <motion.div
          className='page-header__line'
          style={{transform: useMotionTemplate`translateX(${translateX}px)`}}
          initial={{ transform: `translateX(0)` }}
          transition={transitionTextX}
        >
          <motion.h1 variants={word} className='page-header__line__title'>Foto a video</motion.h1>
        </motion.div>
        <div className='page-header__line'>
          <motion.p initial={{ y: 100, opacity: 0, }} animate={{ y: 0, opacity: 1, transition: {duration: 1, delay: .6,  ...headingTransition} }} className='page-header__line__text'>
          Poskytujeme profesionálne fotografické a video služby, ako napríklad štúdiové fotografie, fotenia pre firmy, dronové zábery a postprodukciu na mieru.
          </motion.p>
          <motion.h1 variants={word} className='page-header__line__title'><strong>produkcia</strong></motion.h1>
        </div>
        <motion.div
          className='page-header__line'
          style={{transform: useMotionTemplate`translateX(-${translateX}px)`}}
          initial={{ transform: `translateX(0)` }}
          transition={{ duration: 2, type: "inertia" }}
        >
          <motion.h1 variants={word} className='page-header__line__title'>
              Stella Digit
          </motion.h1>
        </motion.div>
      </motion.div>
    </div>
  )
}