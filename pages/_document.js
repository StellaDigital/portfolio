import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class OverriddenDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="sk">
        <Head />
        <body>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TLPH6FWN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>


          {/* Clarity 
          <script 
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "n12gtin0vj");
              `,
            }}
          />
          */}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default OverriddenDocument;
