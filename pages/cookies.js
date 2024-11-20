import Footer from "@components/Footer"
import Link from "next/link"
import Navbar from '@components/Navbar';


export default function Cookies(props) {
  return(
    <>
      <Navbar />
      <div className="container legal-document">
        
        <h1 className="cookie-policy-h1">Zásady používania súborov cookie</h1>

        <h2>Čo sú to súbory cookie?</h2>
        <div className="cookie-policy-p">
          <p>
            Tieto zásady používania súborov cookie vysvetľujú, čo sú súbory cookie a ako
            ich používame, aké typy súborov cookie používame, t.j. aké informácie
            zhromažďujeme pomocou súborov cookie a ako sa tieto informácie používajú, a
            ako spravovať nastavenia súborov cookie.
          </p>
          <p>
            Súbory cookie sú malé textové súbory, ktoré sa používajú na ukladanie malých
            informácií. Ukladajú sa do vášho zariadenia pri načítaní webovej stránky v
            prehliadači. Tieto súbory cookie nám pomáhajú zabezpečiť správne fungovanie
            webovej lokality, zvýšiť jej bezpečnosť, poskytnúť používateľom lepší
            zážitok a pochopiť, ako webová lokalita funguje, a analyzovať, čo funguje a
            kde je potrebné zlepšenie.
          </p>
        </div>

        <h2>Ako používame súbory cookie?</h2>
        <div className="cookie-policy-p">
          <p>
            Ako väčšina online služieb, aj naša webová stránka používa súbory cookie
            prvej strany a tretích strán na viaceré účely. Súbory cookie prvej strany sú
            väčšinou potrebné na to, aby webová lokalita fungovala správnym spôsobom, a
            nezhromažďujú žiadne vaše osobné údaje.
          </p>
          <p>
            Súbory cookie tretích strán používané na našej webovej lokalite slúžia najmä
            na pochopenie toho, ako webová lokalita funguje, ako s ňou komunikujete, na
            udržiavanie bezpečnosti našich služieb, na poskytovanie štatistík a reklám, ktoré sú pre
            vás relevantné, a celkovo vám poskytujú lepší a lepší používateľský zážitok
            a pomáhajú urýchliť vaše budúce interakcie s našou webovou lokalitou.
          </p>
        </div>

        <h2>Typy súborov cookie, ktoré používame</h2>

        <div className="cky-audit-table-element"></div>


        <h2>Spravovanie nastavení súborov cookie</h2>

        <Link href="" className="cky-banner-element">Nastavenia súborov cookie</Link> <br />

        <div>
          <p>
            Svoje nastavenia súborov cookie môžete kedykoľvek zmeniť kliknutím na vyššie uvedené
            na tlačidlo. To vám umožní opätovne navštíviť banner so súhlasom so súbormi cookie a zmeniť svoje
            preferencie alebo svoj súhlas hneď odvolať.
          </p>
          <p>
            Okrem toho rôzne prehliadače poskytujú rôzne metódy blokovania
            a vymazanie súborov cookie používaných webovými stránkami. Môžete zmeniť nastavenia svojho
            prehliadača na blokovanie/vymazanie súborov cookie. Nižšie sú uvedené odkazy na
            na dokumenty podpory o tom, ako spravovať a odstraňovať súbory cookie z hlavných webových
            prehliadačov.
          </p>
          <p>
            Chrome:<br/>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.google.com/Linkccounts/Linknswer/32050"
              >https://support.google.com/Linkccounts/Linknswer/32050
            </Link>
          </p>
          <p>
            Safari:<br/>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.apple.com/en-in/guide/safari/sfri11471/mac"
              >https://support.apple.com/en-in/guide/safari/sfri11471/mac
            </Link>
          </p>
          <p>
            Firefox:<br/>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US"
              >https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US
            </Link>
          </p>
          <p>
            Ak používate iný webový prehliadač, navštívte oficiálne stránky svojho prehliadača
            dokumenty podpory.
          </p>
        </div>

      </div>

      <Footer />

    </>
  )
}