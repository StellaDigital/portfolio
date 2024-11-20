import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useBackButtonListener = (callback) => {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = (event) => {
      callback(event);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [callback]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.location.href = url; // Force reload the page
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
};

export default useBackButtonListener;
