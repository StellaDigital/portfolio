// useScrollLock.js
import { useEffect } from 'react';

const useScrollLock = (lock) => {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [lock]);
};

export default useScrollLock;
