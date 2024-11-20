import Link from "next/link";
import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaGlobe, FaPhoneAlt } from "react-icons/fa";

function Socials() {
  return (
    <ul className="socials">
      {/*
      <li className="socials__item socials__item--icon">
        <Link target="_blank" href="https://www.instagram.com/stella.digit/">
            <FaInstagram />
        </Link>
      </li>
      <li className="socials__item socials__item--icon">
        <Link target="_blank" href="https://www.facebook.com/stelladigitagency">
            <FaFacebook />
        </Link>
      </li>
      <li className="socials__item socials__item--icon">
        <Link target="_blank" href="https://www.linkedin.com/company/stella-digit/">
            <FaLinkedin />
        </Link>
      </li>
      */}
      <li className="socials__item">
        <Link href="mailto:info@stelladigit.com">
          info@stelladigit.com
        </Link>
      </li>
      <li className="socials__item socials__item__link--stella">
        <Link href="tel:+421902155533">
          +421 902 155 533
        </Link>
      </li>
      <li className="socials__item">
        <p>
          Mariánske námestie 29/6<br></br>Žilina
        </p>
      </li>
    </ul>
  );
}

export default Socials;
