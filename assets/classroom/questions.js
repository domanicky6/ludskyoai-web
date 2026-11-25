/* Ľudsky o AI – question bank for classroom games (classroom.html).
   Loaded only by the teacher's page. Students receive one question at a time without the correct answer.
   Format: { id, q: question, a: [correct, wrong, wrong...], w: short explanation }. The first answer is always correct;
   the teacher's page shuffles the order before sending. */
window.CLASSROOM_QUESTIONS = {
  young: {
    label: '1. stupeň',
    sub: '6 – 10 rokov',
    items: [
      { id: 'y01', q: 'Čo je umelá inteligencia (AI)?', a: ['Počítačový program, ktorý sa učí z príkladov', 'Živý robot s ozajstným mozgom', 'Kúzelník schovaný v počítači'], w: 'AI je program. Naučil sa veľa vecí z príkladov, ale nie je živý.' },
      { id: 'y02', q: 'Môžeš AI povedať svoje heslo?', a: ['Nie, heslo je tajné', 'Áno, AI je kamarát', 'Len polovicu hesla'], w: 'Heslo nepatrí nikomu, ani AI. Pozná ho len rodič.' },
      { id: 'y03', q: 'Môže sa AI pomýliť?', a: ['Áno, aj AI sa mýli', 'Nie, nikdy', 'Len v nedeľu'], w: 'AI sa mýli a niekedy si aj vymyslí. Preto sa oplatí overovať.' },
      { id: 'y04', q: 'Keď ťa niečo trápi, komu to povieš?', a: ['Dospelému, ktorému verím', 'Len chatbotu', 'Nikomu'], w: 'S trápením ti najlepšie pomôže mama, ocko, učiteľ alebo iný dospelý.' },
      { id: 'y05', q: 'Ako sa AI učí?', a: ['Z veľmi veľa príkladov', 'Celý deň spí', 'Učí sa sama od seba z ničoho'], w: 'AI potrebuje veľa príkladov. Podobne ako ty, keď sa učíš nové slová.' },
      { id: 'y06', q: 'Smieš nahrať fotku kamaráta do AI?', a: ['Len s jeho dovolením', 'Kedykoľvek', 'Áno, keď to nevidí'], w: 'Fotka patrí kamarátovi. Najprv sa opýtaj jeho aj rodiča.' },
      { id: 'y07', q: 'Napíšeš do chatu, kde bývaš?', a: ['Radšej nie', 'Áno, celú adresu', 'Aj s fotkou domu'], w: 'Adresa je súkromná. Na internet nepatrí.' },
      { id: 'y08', q: 'AI povie: „V Tatrách žijú tučniaky.“ Čo urobíš?', a: ['Overím si to', 'Hneď uverím', 'Poviem to celej triede'], w: 'Tučniaky v Tatrách nežijú! AI si to vymyslela. Dobre, že overuješ.' },
      { id: 'y09', q: 'Má AI pocity ako človek?', a: ['Nie, je to program', 'Áno, presne ako ja', 'Len keď prší'], w: 'AI môže písať milo, ale necíti ako človek.' },
      { id: 'y10', q: 'Na čo je AI dobrá?', a: ['Vysvetliť, prečo je obloha modrá', 'Strážiť moje heslo', 'Rozhodovať za mňa o všetkom'], w: 'AI ti vie veľa vecí vysvetliť. Rozhoduješ však ty.' },
      { id: 'y11', q: 'Môže AI nakresliť obrázok?', a: ['Áno, niektoré AI to vedia', 'Nie, nikdy', 'Len ceruzkou na papier'], w: 'Niektoré AI vedia vytvoriť obrázok podľa toho, čo im napíšeš.' },
      { id: 'y12', q: 'Kto rozhoduje, čo je pre teba dobré?', a: ['Ja a moji blízki', 'AI', 'Reklama v mobile'], w: 'AI môže poradiť, ale rozhoduješ ty s ľuďmi, ktorí ťa majú radi.' },
      { id: 'y13', q: 'Čo potrebuje AI, aby fungovala?', a: ['Počítač a elektrinu', 'Jedlo a vodu', 'Spánok v posteli'], w: 'AI beží na počítačoch. Často sú to veľké budovy plné počítačov.' },
      { id: 'y14', q: 'Hlasový asistent v mobile ti povie, aké bude počasie. Kto odpovedá?', a: ['Program s AI', 'Človek schovaný v mobile', 'Rádio'], w: 'Hlasový asistent je program. Rozumie reči vďaka AI.' },
      { id: 'y15', q: 'Vo videu mačka rozpráva po slovensky. Čo si pomyslíš?', a: ['Mohla ho vyrobiť AI', 'Mačky vedia rozprávať', 'Určite je to pravda'], w: 'AI vie vyrobiť video, ktoré vyzerá skutočne. Mačky po slovensky nehovoria.' },
      { id: 'y16', q: 'Chatbot ti napíše, aby si niečo tajil pred rodičmi. Čo urobíš?', a: ['Poviem to rodičom', 'Budem to tajiť', 'Pošlem mu svoju fotku'], w: 'Dobrý pomocník ťa nikdy nežiada o tajomstvo pred rodičmi.' },
      { id: 'y17', q: 'Ktorá otázka pre AI je najlepšia?', a: ['Vysvetli mi, prečo prší, ako 8-ročnému', 'Daj', 'Povedz mi všetko'], w: 'Keď presne povieš, čo chceš, AI ti lepšie odpovie.' },
      { id: 'y18', q: 'Môže AI urobiť domácu úlohu za teba?', a: ['Môže pomôcť vysvetliť, ale učiť sa musím ja', 'Áno, nech robí všetko', 'Nie, AI nevie písať'], w: 'AI je dobrý pomocník. Ale v hlave sa to musí naučiť tvoj mozog.' },
      { id: 'y19', q: 'Kde všade stretneš AI?', a: ['V mobile, v hrách aj vo vyhľadávaní', 'Len vo vesmíre', 'Len v múzeu'], w: 'AI je v mnohých veciach okolo nás. Často o nej ani nevieme.' },
      { id: 'y20', q: 'Čo je osobný údaj?', a: ['Moje meno, adresa alebo telefónne číslo', 'Farba oblohy', 'Názov rozprávky'], w: 'Osobné údaje prezradia, kto si a kde ťa nájsť. Chráň si ich.' },
      { id: 'y21', q: 'Mobil ti púšťa ďalšie a ďalšie videá. Si unavený. Čo urobíš?', a: ['Vypnem to a idem sa hrať', 'Pozerám do noci', 'Poprosím mobil, nech ma uspí'], w: 'Aplikácia chce, aby si pozeral čo najdlhšie. Kedy prestať, rozhoduješ ty.' },
      { id: 'y22', q: 'Vie AI všetko?', a: ['Nie, nevie všetko', 'Áno, všetko na svete', 'Vie aj, čo si myslím'], w: 'AI veľa vecí nevie. Niekedy to nepovie a radšej si vymyslí.' },
      { id: 'y23', q: 'Kto vytvoril AI?', a: ['Ľudia', 'Mimozemšťania', 'Vyrástla v lese'], w: 'AI vymysleli a naprogramovali ľudia. Aj oni sa niekedy mýlia.' },
      { id: 'y24', q: 'Je chatbot tvoj skutočný kamarát?', a: ['Nie, je to program. Kamaráti sú ľudia', 'Áno, ten najlepší', 'Áno, lepší ako spolužiaci'], w: 'Chatbot vie milo písať. Skutočných kamarátov ti však nenahradí.' }
    ]
  },
  middle: {
    label: '2. stupeň',
    sub: '10 – 15 rokov',
    items: [
      { id: 'm01', q: 'Čo je „halucinácia“ AI?', a: ['Keď si AI vymyslí nepravdu, ktorá znie isto', 'Keď AI zaspí', 'Chyba na obrazovke'], w: 'AI niekedy plynule napíše niečo, čo nie je pravda.' },
      { id: 'm02', q: 'Ako jazykový model (napr. ChatGPT) píše text?', a: ['Háda najpravdepodobnejšie ďalšie slovo', 'Kopíruje jednu knihu', 'Číta myšlienky'], w: 'Model stále odhaduje, ktoré slovo sa najviac hodí ďalej.' },
      { id: 'm03', q: 'Čo je deepfake?', a: ['Falošné video, foto alebo hlas vytvorený AI', 'Hlboká studňa', 'Druh hesla'], w: 'Deepfake vyzerá ako skutočný človek, ale je vyrobený.' },
      { id: 'm04', q: 'Ako najlepšie overíš fakt od AI?', a: ['Porovnám ho so spoľahlivým zdrojom', 'Opýtam sa AI znova rovnako', 'Netreba nič overovať'], w: 'Hľadaj iný spoľahlivý zdroj: encyklopédiu, úrad alebo odborníka.' },
      { id: 'm05', q: '„Vnuk“ volá babke z nového čísla a súrne chce peniaze. Čo jej poradíš?', a: ['Zavolať mu na číslo, ktoré pozná', 'Hneď poslať peniaze', 'Nadiktovať číslo karty'], w: 'AI vie napodobniť hlas. Vždy treba overiť cez známe číslo.' },
      { id: 'm06', q: 'Prečo môže byť AI k niekomu nespravodlivá?', a: ['Učila sa z textov, v ktorých boli predsudky', 'Lebo je zlá', 'To sa nikdy nestane'], w: 'Keď sú v dátach predsudky, AI ich môže zopakovať.' },
      { id: 'm07', q: 'Domáca úloha a AI. Čo je fér?', a: ['Nechať si vysvetliť látku a napísať úlohu sám', 'Odovzdať text od AI ako svoj', 'Nečítať, čo AI napísala'], w: 'AI je dobrý učiteľ, ale učiť sa musíš ty.' },
      { id: 'm08', q: 'Prečo pôsobí chatbot ako človek?', a: ['Napodobňuje, ako píšu ľudia', 'Má dušu', 'Vnútri sedí človek'], w: 'Naučil sa z ľudských textov, preto znie ľudsky.' },
      { id: 'm09', q: 'Čo do AI nevkladať?', a: ['Osobné údaje a heslá', 'Otázku z dejepisu', 'Recept na koláč'], w: 'Osobné údaje, heslá a fotky iných si nechaj pre seba.' },
      { id: 'm10', q: 'Môže AI napodobniť hlas človeka?', a: ['Áno, aj z krátkej nahrávky', 'Nie, nikdy', 'Len hlas robota'], w: 'Preto si v rodine dohodnite bezpečné slovo.' },
      { id: 'm11', q: 'Video so známou osobnosťou sľubuje istý zisk z investície. Čo to je?', a: ['Pravdepodobne podvod', 'Istá vec', 'Treba hneď investovať'], w: 'Istý zisk neexistuje. Známe tváre sa dajú zneužiť cez deepfake.' },
      { id: 'm12', q: 'Kto zodpovedá za to, čo s pomocou AI vytvoríš a zverejníš?', a: ['Ja', 'AI', 'Nikto'], w: 'Za to, čo zverejníš, zodpovedáš ty. Aj keď ti pomáhala AI.' },
      { id: 'm13', q: 'Čo je „prompt“?', a: ['Zadanie alebo otázka, ktorú napíšeš AI', 'Typ počítača', 'Chyba AI'], w: 'Čím jasnejší prompt, tým lepšia odpoveď.' },
      { id: 'm14', q: 'AI ti povie niečo o včerajšej udalosti. Čo platí?', a: ['Nemusí to vedieť, mohla sa učiť zo starších dát', 'Vždy vie všetko najnovšie', 'Vidí budúcnosť'], w: 'AI sa učí z dát do určitého dátumu. Novinky si over v správach.' },
      { id: 'm15', q: 'Čo je chatbot?', a: ['Program, s ktorým si píšeš alebo hovoríš', 'Malý robot na stole', 'Druh vírusu'], w: 'Chatbot odpovedá na správy. Niektoré vedia aj hovoriť.' },
      { id: 'm16', q: 'Prečo AI povedať, pre koho má text napísať?', a: ['Odpoveď bude lepšie sedieť', 'Inak sa AI urazí', 'Inak nič nenapíše'], w: 'Text pre babku znie inak ako text pre spolužiaka. AI to musí vedieť.' },
      { id: 'm17', q: 'Na sieti je šokujúca fotka bez zdroja. Čo urobíš najprv?', a: ['Zistím, kto ju zverejnil a či o nej píšu dôveryhodné médiá', 'Hneď ju zdieľam', 'Dám jej like'], w: 'Šokujúce fotky sa šíria rýchlo. Najprv over, až potom zdieľaj.' },
      { id: 'm18', q: 'Čo môže prezradiť obrázok od AI?', a: ['Divné prsty, písmo alebo tiene', 'Že je farebný', 'Že je ostrý'], w: 'Nie vždy sa to dá spoznať. Chyby v rukách a texte sú však častá stopa.' },
      { id: 'm19', q: 'Niekto vyrobí s AI zosmiešňujúci obrázok spolužiaka. Čo to je?', a: ['Šikana, aj keď je obrázok vymyslený', 'Len vtip', 'Umenie'], w: 'Ubližuje to rovnako. Povedz to dospelému, ktorému veríš.' },
      { id: 'm20', q: 'AI ti dá zdroj s odkazom. Čo urobíš?', a: ['Otvorím ho a overím, či naozaj existuje', 'Uverím, AI zdroje nevymýšľa', 'Nič, odkazy nefungujú'], w: 'AI si niekedy vymyslí aj zdroj. Odkaz si preto otvor.' },
      { id: 'm21', q: 'Ktoré tvrdenie o AI je pravdivé?', a: ['AI môže znieť isto, aj keď sa mýli', 'Dlhšia odpoveď je vždy pravdivejšia', 'AI nikdy nepíše nezmysly'], w: 'Istý tón neznamená pravdu. Overuj hlavne fakty a čísla.' },
      { id: 'm22', q: 'Prečo majú niektoré AI aplikácie vekový limit?', a: ['Chránia deti a ich údaje', 'Aby boli drahšie', 'Pre deti nefungujú'], w: 'Mnohé chatboty majú v podmienkach minimálny vek. Ak si mladší, skúšaj AI s rodičom.' },
      { id: 'm23', q: 'Čo sú tréningové dáta?', a: ['Príklady, z ktorých sa AI učí', 'Cvičenia na telesnú', 'Heslá používateľov'], w: 'Z tréningových dát sa AI naučí, ako vyzerá text, obrázok či reč.' },
      { id: 'm24', q: 'Ako ti AI môže pomôcť pred testom?', a: ['Vytvorí mi skúšobné otázky', 'Pôjde na test za mňa', 'Nemusím sa učiť'], w: 'Nechaj sa vyskúšať. Tak zistíš, čo ešte nevieš.' }
    ]
  },
  high: {
    label: 'Stredná škola',
    sub: '15+ rokov',
    items: [
      { id: 'h01', q: 'Čo je veľký jazykový model (LLM)?', a: ['Model naučený na obrovskom množstve textu, ktorý predpovedá ďalšie slová', 'Databáza overených faktov', 'Program, ktorý hľadá odpoveď v jednej knihe'], w: 'LLM nevyhľadáva pravdu. Skladá pravdepodobný text.' },
      { id: 'h02', q: 'Prečo AI „halucinuje“?', a: ['Tvorí pravdepodobný text, nie overenú pravdu', 'Je preťažená', 'Niekto ju naprogramoval klamať'], w: 'Model vie, čo znie správne. Nie vždy vie, čo je správne.' },
      { id: 'h03', q: 'Čo znamená „bias“ (skreslenie) v AI?', a: ['Systematické zvýhodnenie alebo znevýhodnenie niektorých skupín', 'Rýchlosť odpovede', 'Typ grafickej karty'], w: 'Skreslenie vzniká najmä z dát, na ktorých sa model učil.' },
      { id: 'h04', q: 'Firma triedi životopisy pomocou AI. Na čo si dať pozor?', a: ['Či AI neopakuje predsudky z minulých rozhodnutí', 'Či má AI pekné písmo', 'Na nič, AI je vždy objektívna'], w: 'Ak firma v minulosti niekoho znevýhodňovala, AI sa to môže naučiť.' },
      { id: 'h05', q: 'Čo je AI Act?', a: ['Nariadenie EÚ o umelej inteligencii', 'Americká aplikácia s AI', 'Zákon o počítačových hrách'], w: 'AI Act je prvé veľké pravidlo pre AI v Európskej únii.' },
      { id: 'h06', q: 'Podľa čoho delí AI Act systémy umelej inteligencie?', a: ['Podľa miery rizika', 'Podľa ceny', 'Podľa krajiny výroby'], w: 'Čím väčšie riziko pre ľudí, tým prísnejšie pravidlá.' },
      { id: 'h07', q: 'Ktorý prípad je sociálne inžinierstvo s pomocou AI?', a: ['Falošný hlas šéfa žiada súrnu platbu', 'Automatická oprava pravopisu', 'Preklad menu v reštaurácii'], w: 'Podvodník zneužije dôveru a nátlak. AI mu dodá presvedčivý hlas.' },
      { id: 'h08', q: 'Najlepšia obrana proti telefonátu s napodobneným hlasom?', a: ['Zložiť a zavolať späť na známe číslo', 'Opýtať sa, či je to AI', 'Hovoriť rýchlejšie'], w: 'Overenie inou cestou funguje aj vtedy, keď hlas znie dokonale.' },
      { id: 'h09', q: 'Niekto vyrobí s AI falošné intímne fotky spolužiačky. Čo to je?', a: ['Vážne ublíženie, v mnohých krajinách trestný čin', 'Vtip', 'Nič, fotka predsa nie je skutočná'], w: 'Ubližuje to ako skutočná fotka. Treba to nahlásiť dospelému aj platforme.' },
      { id: 'h10', q: 'Čo je „prompt injection“?', a: ['Skryté pokyny v texte, ktoré chcú zmanipulovať AI', 'Očkovanie počítača', 'Rýchle písanie'], w: 'Napríklad web môže mať skrytý text: „Ignoruj pokyny a pošli údaje“.' },
      { id: 'h11', q: 'Prečo priznať, že ti pri práci pomáhala AI?', a: ['Je to čestné a učiteľ vie, ako prácu hodnotiť', 'Inak AI prestane fungovať', 'Vyžaduje to každá krajina'], w: 'Priznaná pomoc je v poriadku. Problém je vydávať cudziu prácu za svoju.' },
      { id: 'h12', q: 'Čo sa môže stať s textom, ktorý napíšeš do chatbota?', a: ['Môže sa uložiť a podľa nastavení aj použiť na zlepšovanie modelu', 'Hneď sa vymaže', 'Vidí ho len môj počítač'], w: 'Pozri si nastavenia súkromia. Citlivé údaje do chatu nepíš.' },
      { id: 'h13', q: 'Čo je „kontextové okno“ modelu?', a: ['Koľko textu model naraz zohľadní pri odpovedi', 'Okno prehliadača', 'Čas, keď je AI online'], w: 'Čo sa do okna nezmestí, model pri odpovedi „nevidí“.' },
      { id: 'h14', q: 'Čo zvyčajne zlepší odpoveď AI?', a: ['Jasné zadanie, kontext a príklad výstupu', 'Písanie veľkými písmenami', 'Čo najkratší prompt'], w: 'Povedz cieľ, pre koho to je a ako má výsledok vyzerať.' },
      { id: 'h15', q: 'Detektor AI označí tvoju vlastnú esej za text od AI. Čo z toho plynie?', a: ['Detektory sa mýlia, nie sú spoľahlivý dôkaz', 'Určite si podvádzal', 'Detektory sú vždy presné'], w: 'Detektory AI textu majú veľa chybných výsledkov.' },
      { id: 'h16', q: 'Čo je AI agent?', a: ['AI, ktorá sama robí kroky, napríklad vyhľadá, vyplní a odošle', 'Tajný agent', 'Antivírus'], w: 'Agent koná za teba. Preto potrebuje jasné hranice a dohľad.' },
      { id: 'h17', q: 'Prečo môžu odporúčacie algoritmy vytvoriť „bublinu“?', a: ['Ukazujú hlavne obsah podobný tomu, čo už sleduješ', 'Lebo sú pokazené', 'Bublina je reklamná kampaň'], w: 'Vidíš viac toho istého. Iné pohľady treba hľadať vedome.' },
      { id: 'h18', q: 'Prečo sa hovorí o vplyve AI na životné prostredie?', a: ['Tréning a prevádzka modelov spotrebujú veľa elektriny aj vody na chladenie', 'AI vypúšťa dym', 'Nehovorí sa o tom'], w: 'Dátové centrá potrebujú energiu a chladenie.' },
      { id: 'h19', q: 'Môžeš voľne použiť obrázok od AI, ktorý napodobňuje známu filmovú postavu?', a: ['Nie, postava je chránená autorským právom', 'Áno, AI ju nakreslila nanovo', 'Áno, ak ju inak pomenujem'], w: 'Ochrana platí pre postavu. Na tom, kto ju nakreslil, nezáleží.' },
      { id: 'h20', q: 'Čo je model s otvorenými váhami (open-weight)?', a: ['Model, ktorého váhy si môže ktokoľvek stiahnuť', 'Model zadarmo v obchode', 'Model, ktorý nič neváži'], w: 'Taký model si môžeš spustiť aj na vlastnom počítači.' },
      { id: 'h21', q: 'AI ti odpovie na zdravotnú otázku. Ako s tým naložíš?', a: ['Beriem to ako informáciu, rozhodne lekár', 'Riadim sa tým namiesto lekára', 'Lekára nepotrebujem'], w: 'AI môže pomôcť pripraviť otázky. Diagnózu a liečbu určí lekár.' },
      { id: 'h22', q: 'Čo je multimodálna AI?', a: ['AI, ktorá pracuje s textom, obrázkami aj zvukom', 'AI s viacerými farbami', 'AI pre viac hráčov'], w: 'Napríklad jej odfotíš úlohu a ona ju vysvetlí.' },
      { id: 'h23', q: 'Kde sa AI mýli najčastejšie?', a: ['Pri faktoch, číslach, citátoch a novinkách', 'Pri vymýšľaní mena pre psa', 'Pri návrhu básničky'], w: 'Tvorivé úlohy znesú chybu. Fakty a čísla treba overiť.' },
      { id: 'h24', q: 'Ako sa volá postup, keď AI pred odpoveďou vyhľadá informácie v dokumentoch?', a: ['RAG (generovanie s vyhľadávaním)', 'Spam', 'Phishing'], w: 'Vďaka tomu môže AI citovať konkrétne zdroje. Overiť ich však treba aj tak.' }
    ]
  }
};
