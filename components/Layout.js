import React from "react"
import Navbar from "./Navbar"
import { motion } from "framer-motion"

const Layout = ({ children, keyVal }) => {

  return(
    <>
      <motion.main 
        key={keyVal}
        initial='initial'
        animate='animate'
        exit='exit'
      >
        { children }
      </motion.main>
    </>
  )
}

export default Layout