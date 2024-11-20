import React from "react";
import { motion } from "framer-motion";
import Socials from './Socials'
import Link from "next/link";
import Prideme from "./Prideme";

const marqueeVariants = {
  animate: {
    x: [0, -2035],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 5,
        ease: "linear",
      },
    },
  },
};

function Footer(){

  return(

    <>

      <div className="container">
        <Prideme />
      </div>
     

      <div className="footer">

        <div className="container">

          <div className="footer__title">
            <div className="footer__title__marquee">
              <p className="footer__title__marquee__text">Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne.</p>
              <p className="footer__title__marquee__text">Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne. Poďme do toho spoločne.</p>
            </div>
          </div>

          <div className="footer__content">

            <div className="footer__content__contact">

              <Socials />

              <div className="footer__content__contact__inner">
                <p className="footer__content__contact__inner__text">Ak máte záujem o spoluprácu, alebo nejaké otázky, neváhajte nám zavolať alebo kontaktovať nás na emailovú adresu.</p>
                {/*<a href="mailto:info@stelladigit.com" className="footer__content__contact__inner__link">info@stelladigit.com</a>*/}
              </div>
            </div>

          </div>
          <div className="footer__copyright">
            <p className="footer__copyright__year">{(new Date().getFullYear())}</p>
            <ul className="footer__copyright__links">
              <li>
                <Link href="/cookies">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/gdpr">
                  Zásady ochrany osobných údajov
                </Link>
              </li>
            </ul>
          </div>

        </div>

      </div>
      
    </>
  )

}

export default Footer