import { useEffect, useState } from 'react';
import { auth, storage, STATE_CHANGED } from '@lib/firebase';
import Loader from './Loader';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

// Uploads images to Firebase Storage
export default function ImageUploader(props) {

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([])

  /* UPLOAD MULTIPLE FILES */
  const uploadFile = (e, featured) => {
    for (let imageFile of e.target.files) uploadImageAsPromise(imageFile, featured);
  }

  /* UPLOAD FILE */
  const uploadImageAsPromise = (imageFile, featured) => {

    return new Promise(async function (resolve, reject) {

      const compressOptions = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920
      }

      const extension = imageFile.type.split('/')[1];

      // Makes reference to the storage bucket location
      const ref = storage.ref(`uploads/${props.galleryTitle}/${featured ? `featured.jpg` : imageFile.name}`);
      setUploading(true);

      const compressedImage = await imageCompression(imageFile, compressOptions);
      
      // Starts the upload
      const task = ref.put(compressedImage);
      
      // Listen to updates to upload task
      task.on(STATE_CHANGED, (snapshot) => {
        const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        setProgress(pct);
      });

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          ref.getMetadata()
            .then((meta) => {
              setUploadedImages(uploadedImages.filter((img) => img.name.split('.')[0] !== 'featured'))
              setUploadedImages((prev) => [...prev, {url: url, path: meta.fullPath, name: meta.name }])
            })
            .catch((error) => console.log(`error while getMetadata => ${error}`))
          setUploading(false);
          toast.success('Nahranie prebehlo úspešne')
        });
    
    });
  }

  /* DISPLAY UPLOADED IMAGES  */
  useEffect( ()=> {

    const ref = storage.ref(`uploads/${props.galleryTitle}`)
    ref.listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {

          itemRef.getDownloadURL()
          .then(function(url) {
            itemRef.getMetadata()
              .then((meta) => setUploadedImages((prev) => [...prev, {url: url, path: meta.fullPath, name: meta.name }]))
              .catch((error) => console.log(`error while getMetadata => ${error}`))
          }).catch((error) => console.log(`error while getDownloadUrl => ${error}`))

        });
      }).catch((error) => console.log(`error while listAll => ${error}`));

  }, [])

  /* REMOVE SELECTED IMAGES */
  const removeSelectedImages = (e) => {

    e.preventDefault()
    const doIt = confirm('Naozaj chcete natrvalo vymazať tieto obrázky?')

    if(doIt){
      uploadedImages.forEach(img => {
        if(img.selcted){
          let ref = storage.ref(img.path)
          ref.delete()
            .then(toast.success('Obrázky boli úspešne odstránené'))
            .then( setUploadedImages(uploadedImages.filter((img) => !img.selcted)) )
            .catch((error) => console.log(`While deleting storage files => ${error}`))
        }
      })
    }

  }

  /* DISPLAY UPLOADED IMAGES */
  const UploadedImages = () => {

    const handleImageClick = (e, img) => {
      e.preventDefault();
      const uploadedImagesSelected = [...uploadedImages]
      uploadedImagesSelected.forEach(image => {
        image.path === img.path ? image.selcted ? image.selcted = false : image.selcted = true : null
      })
      setUploadedImages(uploadedImagesSelected)
    }

    /* DISPLAY FEATURE */
    if(props.featured){
      return(
        <div className='uploaded-images uploaded-images--featured'>
          {
            uploadedImages.filter((img) => img.name.split('.')[0] === 'featured').map( img => <img key={img.url + 'featured'} className={`uploaded-images__item ${ img.selcted ? 'selected' : '' }`} width='50' height='50' src={img.url} />)
          }
        </div>
      )
    }

    /* DISPLAY NORMAL  */
    else{

      return(
          <div className='uploaded-images'>
            {
              uploadedImages.filter((img) => img.name.split('.')[0] !== 'featured').map( img => <img key={img.url} onClick={(e) => handleImageClick(e, img)} className={`uploaded-images__item ${ img.selcted ? 'selected' : '' }`} width='50' height='50' src={img.url} />)
            }
          </div>
      )
    }
    
  }

  /* MAIN COMPONENT */
  return (
    <div className={`image-uploader ${props.featured ? 'image-uploader--featured' : '' }`}>

      <Loader show={uploading} />

      <label className='image-uploader__upload'>
        <div className='image-uploader__upload__text'>{ props.featured ?  '📸 Nahraj náhľadový obrázok'  : '📸 Nahraj svoje fotky' }</div>
        {uploading && <p className='image-uploader__upload__progress' >{progress}%</p>}
        { 
          uploadedImages.filter((img) => img.selcted).length > 0 &&
          <div className='image-uploader__upload__remove' onClick={(e) => removeSelectedImages(e)} >
            <svg className='image-uploader__upload__remove__icon' viewBox="0 0 20 20">
              <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
            </svg>
            <p className='image-uploader__upload__remove__text'>Vymazať</p>
          </div>
        }

        <UploadedImages />

        <input  className='image-uploader__upload__input' type="file" onChange={(e) => uploadFile(e, props.featured)} accept="image/x-png,image/gif,image/jpeg" multiple={props.featured ? false : true} />
      </label>

    </div>
  );
}
