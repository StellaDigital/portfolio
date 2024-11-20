
export const stopScroll = (stop) => {
  stop ? document.querySelector('html').classList.add('stop-scroll') 
  : document.querySelector('html').classList.remove('stop-scroll')
}

export const getBlob = async (imageUrl) => {

  const data = await fetch(imageUrl);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      const base64data = reader.result;   
      resolve(base64data);
    }
  });
  
}
