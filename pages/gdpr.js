import Footer from "@components/Footer"
import Link from "next/link"
import Navbar from '@components/Navbar';


export default function Gdpr(props) {
  return(
    <>
      <Navbar />
      <div className="container legal-document">
        
        <h1 className="privacy-policy-h1">Zásady ochrany osobných údajov</h1>

        <p className="privacy-policy-p">
            Tieto zásady ochrany osobných údajov opisujú zásady spoločnosti Stella Digit s.r.o., Terasová
            627/15, Prešovský kraj 05921, Slovensko, e-mail: cookies@stelladigit.sk, tel:
            0948051503 o zhromažďovaní, používaní a zverejňovaní vašich informácií, ktoré
            zhromažďujete pri používaní našej webovej stránky ( snimaj.to ). (ďalej len "služba"). Prístupom k
            alebo používaním Služby vyjadrujete súhlas so zhromažďovaním, používaním a zverejňovaním
            vašich informácií v súlade s týmito zásadami ochrany osobných údajov. Ak nesúhlasíte
            s tým súhlasíte, nepristupujte k Službe ani ju nepoužívajte.
        </p>

        <p className="privacy-policy-p">
            Tieto zásady ochrany osobných údajov môžeme kedykoľvek zmeniť bez predchádzajúceho upozornenia.
            a revidované Zásady ochrany osobných údajov zverejníme v Službe. Revidované Zásady
            budú účinné 180 dní odo dňa, keď budú revidované Zásady zverejnené v
            Službe a váš ďalší prístup k Službe alebo jej používanie po uplynutí tejto doby bude
            predstavuje váš súhlas s revidovanými Zásadami ochrany osobných údajov. Preto
            odporúčame, aby ste túto stránku pravidelne kontrolovali.
        </p>

        <ol className="privacy-policy-ol">
          <li>
            <h2 className="privacy-policy-h2">Ako používame vaše informácie:</h2>
            <p className="privacy-policy-p">
                Informácie, ktoré o vás zhromažďujeme, použijeme na tieto účely
                účely:
            </p>
            <ol className="privacy-policy-ol">
              <li>Marketing/propagácia</li>

              <li>Podpora</li>

              <li>Informácie o administratíve</li>

              <li>Cielená reklama</li>
            </ol>
            <p className="privacy-policy-p">
                Ak chceme vaše údaje použiť na akýkoľvek iný účel, požiadame vás o to.
                o súhlas a vaše údaje použijeme až po získaní vášho súhlasu
                a potom len na účel(-y), na ktorý(-é) udelíte súhlas, pokiaľ nebudeme
                zákon nevyžaduje inak.
            </p>
          </li>

          <li>
            <h2 className="privacy-policy-h2">Ako zdieľame vaše informácie:</h2>

            <p className="privacy-policy-p">
                Vaše osobné údaje neprenesieme žiadnej tretej strane bez toho, aby sme
                vášho súhlasu, s výnimkou obmedzených okolností opísaných nižšie:
            </p>
            <ol className="privacy-policy-ol">
              <li>Reklamná služba</li>

              <li>Marketingové agentúry</li>

              <li>Analytika</li>

              <li>Zber a spracovanie údajov</li>
            </ol>

            <p className="privacy-policy-p">
                Od takýchto tretích strán požadujeme, aby používali osobné údaje, ktoré prenášame.
                len na účel, na ktorý im boli odovzdané, a nie na
                ich uchovávali dlhšie, ako je potrebné na splnenie uvedeného účelu.
            </p>
            <p className="privacy-policy-p">
                Vaše osobné údaje môžeme zverejniť aj na tieto účely: (1) na
                dodržiavanie platných zákonov, nariadení, súdnych príkazov alebo iných právnych
                (2) na vymáhanie vašich zmlúv s nami, vrátane tejto
                alebo (3) reagovať na tvrdenia, že vaše používanie služby porušuje tieto zásady ochrany osobných údajov.
                akékoľvek práva tretích strán. Ak dôjde k zlúčeniu Služby alebo našej spoločnosti alebo
                s inou spoločnosťou, vaše informácie budú jedným z aktív
                ktoré sa prevedú na nového vlastníka.
            </p>
          </li>

          <li>
            <h2 className="privacy-policy-h2">Your Rights:</h2>
            <p className="privacy-policy-p">
                V závislosti od platného zákona môžete mať právo na prístup a
                opraviť alebo vymazať svoje osobné údaje alebo získať kópiu svojich osobných údajov.
                údajov, obmedziť alebo namietať proti aktívnemu spracovaniu vašich údajov, požiadať nás o
                zdieľať (preniesť) vaše osobné údaje inému subjektu, odvolať akékoľvek
                súhlas, ktorý ste nám poskytli na spracovanie vašich údajov, právo podať sťažnosť na spracovanie vašich údajov.
                sťažnosť na zákonný orgán a ďalšie práva, ktoré môžu byť
                relevantné podľa platných zákonov. Ak chcete uplatniť tieto práva, môžete napísať na adresu
                nám na adresu cookies@stelladigit.sk. Na vašu žiadosť odpovieme v
                v súlade s platnými zákonmi.
            </p>

            <p className="privacy-policy-p">
              Upozorňujeme, že ak nám neumožníte zhromažďovať alebo spracovávať požadované
              osobné údaje alebo odvoláte súhlas so spracovaním týchto údajov pre
              požadované účely, je možné, že nebudete môcť získať prístup k službám alebo ich používať na
              o ktoré boli vaše údaje požiadané.
            </p>
          </li>
          <li>
            <h2 className="privacy-policy-h2">Cookies Etc.</h2>
            <p className="privacy-policy-p">
              Ak sa chcete dozvedieť viac o tom, ako ich používame, a o vašich možnostiach v súvislosti s nimi.
              sledovacích technológií, pozrite si naše.
              <br/>
              <Link href="/cookies">Zásady používania súborov cookie.</Link>
            </p>
          </li>

          <li>
            <h2 className="privacy-policy-h2">Zabezpečenie:</h2>
            <p className="privacy-policy-p">
              Bezpečnosť vašich informácií je pre nás dôležitá a budeme používať
              primerané bezpečnostné opatrenia, aby sme zabránili strate, zneužitiu alebo neoprávnenému
              zmene vašich informácií, ktoré sú pod našou kontrolou. Avšak vzhľadom na
              rizík, nemôžeme zaručiť absolútnu bezpečnosť, a preto
              nemôžeme zabezpečiť ani zaručiť bezpečnosť akýchkoľvek informácií, ktoré nám posielate.
              a robíte tak na vlastné riziko.
            </p>
          </li>

          <li>
            <h2 className="privacy-policy-h2">
              Odkazy tretích strán a používanie vašich informácií:
            </h2>
            <p className="privacy-policy-p">
              Naša služba môže obsahovať odkazy na iné webové stránky, ktoré nie sú prevádzkované
              my. Tieto zásady ochrany osobných údajov sa nezaoberajú zásadami ochrany osobných údajov a inými
              postupy tretích strán vrátane tretích strán, ktoré prevádzkujú akékoľvek
              webové stránky alebo služby, ktoré môžu byť prístupné prostredníctvom odkazu v Službe. My
              dôrazne odporúčame, aby ste si prečítali zásady ochrany osobných údajov každej navštívenej stránky.
              Nemáme kontrolu nad ich obsahom a nenesieme zaň žiadnu zodpovednosť,
              zásady ochrany osobných údajov alebo postupy akýchkoľvek webových stránok alebo služieb tretích strán.
            </p>
          </li>

          <li>
            <h2 className="privacy-policy-h2">Úradník pre sťažnosti / ochranu údajov:</h2>
            <p className="privacy-policy-p">
              Ak máte akékoľvek otázky alebo obavy týkajúce sa spracovania vašich
              informácií, ktoré sú u nás k dispozícii, môžete napísať e-mail nášmu pracovníkovi pre sťažnosti
              na adrese Stella Digit s.r.o., Terasová 627/15, e-mail: cookies@stelladigit.sk. Sme .
              sa budeme vašimi obavami zaoberať v súlade s platnými právnymi predpismi.
            </p>
          </li>
        </ol>

      </div>

      <Footer />

    </>
  )
}