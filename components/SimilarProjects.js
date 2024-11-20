import React, {useState} from "react";
import GalleryFeed from "./GalleryFeed";


const SimilarProjects = (props) => {

  const selectedCategories = new Set(props.categories)

  return(
    <GalleryFeed categoryFilter={selectedCategories} galleries={props.galleries} slider />
  )

}

export default SimilarProjects;