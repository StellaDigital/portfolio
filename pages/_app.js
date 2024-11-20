import '@styles/main.css';
import { UserContext, pageLayoutZIndex } from '@lib/context';
import { useUserData } from '@lib/hooks';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, transform } from "framer-motion"
import Layout from '@components/Layout';
import Head from 'next/head'
import { clarity } from 'react-microsoft-clarity';
import React, {useEffect} from 'react';

function MyApp({ Component, pageProps, router}) {

  const userData = useUserData();

  {/*
  useEffect(() => {
    if (typeof window !== 'undefined') {
      clarity.init('n12gtin0vj'); // Initialize with your Clarity Project ID
      
      // Identify user if needed
      if (clarity.hasStarted && userData?.userName) {
        clarity.identify('USER_ID', { userName: userData.userName });
      }
    }
  }, [userData]); // Run when userData changes (for clarity.identify)
  */}

  return (
    <UserContext.Provider value={userData}>
      <AnimatePresence mode="wait">
        <Head>

          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//cdn-cookieyes.com" />
          <link rel="dns-prefetch" href="//log.cookieyes.com" />
          <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
          
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-TLPH6FWN');
              `,
            }}
          />

          <title>StellaDigit foto</title>
          <meta property="og:title" content="StellaDigit foto a video produkcia" />
          <meta property="og:description" content="Ako digitálna agentúra poskytujeme profesionálne fotografické a video služby - štúdiové foto, dronové zábery, lifestyle a produktová fotografia." />
          <meta property="og:image" content="/og-fotostella.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <link
            rel="preload"
            href="/fonts/SpaceGrotesk-Regular.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />

          <link
            rel="preload"
            href="/fonts/SpaceGrotesk-Bold.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />

        </Head>
          <Layout key={router.pathname} keyVal={router.pathname} >
            <Component {...pageProps} />
          </Layout>
        <Toaster/>
      </AnimatePresence>
    </UserContext.Provider>
  );
}

export default MyApp;
