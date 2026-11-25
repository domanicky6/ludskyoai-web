/* Ľudsky o AI – content for the quiz game (Kvíz o AI) in classroom.html.
   Themed rounds reference question ids from questions.js (CLASSROOM_QUESTIONS) or from ADULT below.
   Estimate questions use well-documented years, so the answers do not go stale. */
window.QUIZ_DATA = {
  audiences: {
    young: {
      label: '1. stupeň',
      rounds: [
        { title: 'Ako AI funguje', emoji: '🤖', ids: ['y01', 'y05', 'y09', 'y13', 'y14', 'y22', 'y23'] },
        { title: 'Súkromie', emoji: '🔒', ids: ['y02', 'y06', 'y07', 'y20', 'y16', 'y04'] },
        { title: 'Over si to', emoji: '🔍', ids: ['y03', 'y08', 'y15', 'y17', 'y10'] },
        { title: 'AI a ja', emoji: '🧒', ids: ['y11', 'y12', 'y18', 'y19', 'y21', 'y24'] }
      ],
      estimates: false
    },
    middle: {
      label: '2. stupeň',
      rounds: [
        { title: 'Ako AI funguje', emoji: '🤖', ids: ['m02', 'm08', 'm13', 'm15', 'm23', 'm14'] },
        { title: 'Over si to', emoji: '🔍', ids: ['m01', 'm04', 'm17', 'm20', 'm21', 'm18'] },
        { title: 'Deepfaky a podvody', emoji: '🎭', ids: ['m03', 'm05', 'm10', 'm11', 'm19'] },
        { title: 'Férovo a bezpečne', emoji: '⚖️', ids: ['m09', 'm22', 'm07', 'm12', 'm06', 'm16', 'm24'] }
      ],
      estimates: true
    },
    high: {
      label: 'Stredná škola',
      rounds: [
        { title: 'Ako AI funguje', emoji: '🤖', ids: ['h01', 'h02', 'h13', 'h20', 'h22', 'h24', 'h14'] },
        { title: 'Over si to', emoji: '🔍', ids: ['h15', 'h23', 'h17', 'h21', 'h12'] },
        { title: 'Podvody a deepfaky', emoji: '🎭', ids: ['h07', 'h08', 'h09', 'h10', 'h19'] },
        { title: 'Pravidlá a etika', emoji: '⚖️', ids: ['h03', 'h04', 'h05', 'h06', 'h11', 'h18', 'h16'] }
      ],
      estimates: true
    },
    adults: {
      label: 'Dospelí',
      rounds: [
        { title: 'AI v práci', emoji: '💼', ids: ['a01', 'a02', 'a03', 'a04', 'a05'] },
        { title: 'Podvody', emoji: '🎭', ids: ['a06', 'a07', 'a08', 'a09', 'a10', 'h07', 'h08'] },
        { title: 'Súkromie', emoji: '🔒', ids: ['a11', 'a12', 'a13', 'a14', 'a15'] },
        { title: 'Ako AI funguje', emoji: '🤖', ids: ['h01', 'h02', 'h13', 'h22', 'h23', 'h15'] },
        { title: 'Pravidlá a etika', emoji: '⚖️', ids: ['h03', 'h05', 'h06', 'h18', 'h19'] }
      ],
      estimates: true
    }
  },

  // Questions for adults (format as in questions.js: the first answer is correct).
  adult: [
    { id: 'a01', q: 'Čo môžeš bez obáv vložiť do bezplatného chatbota v práci?', a: ['Všeobecný text bez mien a firemných tajomstiev', 'Zmluvu klienta s osobnými údajmi', 'Heslá k firemným systémom'], w: 'Citlivé firemné a osobné údaje patria len do nástrojov, ktoré firma schválila.' },
    { id: 'a02', q: 'AI napísala e-mail pre klienta. Čo urobíš pred odoslaním?', a: ['Skontrolujem fakty, čísla a tón', 'Pošlem ho hneď, AI sa nemýli', 'Pridám len podpis'], w: 'Za e-mail zodpovedáš ty. AI rada pridá istú vetu, ktorá nesedí.' },
    { id: 'a03', q: 'Čo zvyčajne najviac zlepší výsledok od AI pri pracovnej úlohe?', a: ['Kontext, cieľ, publikum a príklad', 'Trikrát napísať „prosím“', 'Čo najkratšie zadanie'], w: 'AI nevie, čo máš v hlave. Povedz jej, pre koho to je a ako má výsledok vyzerať.' },
    { id: 'a04', q: 'Kolega tvrdí, že AI „vie“ aktuálne ceny konkurencie. Čo platí?', a: ['Ak nehľadá na webe, môže mať staré alebo vymyslené údaje', 'AI vždy pozná aktuálne ceny', 'AI má prístup do databáz všetkých firiem'], w: 'Bez vyhľadávania AI odpovedá z tréningových dát. Čísla si preto over.' },
    { id: 'a05', q: 'Na čo je AI v práci najužitočnejšia?', a: ['Prvý návrh, zhrnutie a nápady', 'Konečné rozhodnutie o ľuďoch bez kontroly', 'Podpisovanie zmlúv'], w: 'AI urýchli rozbeh. Rozhodnutie a kontrola ostávajú na človeku.' },
    { id: 'a06', q: 'Volá „banka“, hlas znie úplne ľudsky a pýta si kód z SMS. Čo urobíš?', a: ['Zložím a zavolám na číslo z webu banky', 'Kód nadiktujem, hlas znel dôveryhodne', 'Kód pošlem SMS-kou'], w: 'Kód z SMS si banka nepýta. Prirodzený hlas dnes nie je dôkaz.' },
    { id: 'a07', q: 'Reklama s videom známej osobnosti ponúka zaručený zisk z investície. Čo urobíš?', a: ['Nekliknem a reklamu nahlásim', 'Investujem malú sumu na skúšku', 'Pošlem ju známym'], w: 'Video môže byť deepfake. Zaručený zisk je typický znak podvodu.' },
    { id: 'a08', q: 'Čo je „vishing“?', a: ['Podvodný telefonát, často aj s napodobneným hlasom', 'Vírus v tlačiarni', 'Druh šifrovania'], w: 'Vishing je phishing cez hlas. Podvodníci tlačia na čas a strach.' },
    { id: 'a09', q: 'Šéf ti píše z nového čísla a súrne chce, aby si kúpil darčekové poukážky. Čo to je?', a: ['Typický podvod, overím si to inou cestou', 'Bežná firemná prax', 'Odmena pre zamestnancov'], w: 'Nové číslo, súrnosť a nezvyčajná platba sú tri varovné znaky naraz.' },
    { id: 'a10', q: 'Čo pomôže rodine proti podvodom s napodobneným hlasom?', a: ['Dohodnuté bezpečné slovo', 'Vypnúť si internet', 'Odpovedať čo najrýchlejšie'], w: 'Slovo, ktoré pozná len rodina, AI neuhádne.' },
    { id: 'a11', q: 'Kde v ChatGPT obmedzíš, či sa tvoje rozhovory použijú na zlepšovanie modelov?', a: ['V nastaveniach v časti o ovládaní údajov', 'Nedá sa to nikde', 'Treba to napísať do každého chatu'], w: 'Nastavenie sa dá vypnúť. Oplatí sa pozrieť, čo máš zapnuté.' },
    { id: 'a12', q: 'Čo znamená, že chatbot má „pamäť“?', a: ['Môže si medzi rozhovormi pamätať informácie o tebe', 'Má viac operačnej pamäte', 'Pamätá si len posledné slovo'], w: 'Čo si pamätá, sa dá pozrieť aj vymazať v nastaveniach.' },
    { id: 'a13', q: 'Verejné fotky detí na sociálnej sieti a AI. Čo platí?', a: ['Dajú sa zneužiť aj na úpravy pomocou AI', 'AI s verejnými fotkami nepracuje', 'Pri malom počte sledovateľov je to bezpečné'], w: 'Čo je verejné, môže si ktokoľvek stiahnuť a upraviť. Zvážte súkromný profil.' },
    { id: 'a14', q: 'Chceš sa AI opýtať na zdravie alebo peniaze. Ako na to?', a: ['Vynechám mená a údaje, podľa ktorých ma spoznať', 'Napíšem aj rodné číslo pre presnosť', 'Priložím sken dokladu'], w: 'Otázka funguje rovnako dobre aj bez osobných údajov.' },
    { id: 'a15', q: 'Na čo slúži dočasný chat v niektorých chatbotoch?', a: ['Rozhovor sa neuloží do histórie ani do pamäte', 'AI odpovedá rýchlejšie', 'Je to platená funkcia'], w: 'Hodí sa na otázky, ktoré nechceš mať v histórii.' }
  ],

  // Estimate round: the closest team gets 2 points, an exact answer 3 points.
  estimates: [
    { id: 'e1', q: 'V ktorom roku bola konferencia v Dartmouthe, kde sa zrodil pojem „umelá inteligencia“?', answer: 1956, w: 'V lete 1956 sa v Dartmouthe (USA) stretli vedci a umelá inteligencia dostala meno.' },
    { id: 'e2', q: 'V ktorom roku porazil počítač Deep Blue majstra sveta v šachu Garriho Kasparova?', answer: 1997, w: 'Deep Blue od IBM vyhral zápas v roku 1997.' },
    { id: 'e3', q: 'V ktorom roku bol spustený ChatGPT?', answer: 2022, w: 'ChatGPT spustili 30. novembra 2022.' },
    { id: 'e4', q: 'V ktorom roku vznikol ELIZA, jeden z prvých chatbotov?', answer: 1966, w: 'Program ELIZA opísal Joseph Weizenbaum v roku 1966.' },
    { id: 'e5', q: 'V ktorom roku porazil program AlphaGo majstra Lee Sedola v hre go?', answer: 2016, w: 'AlphaGo od DeepMind vyhral v marci 2016 zápas 4 : 1.' },
    { id: 'e6', q: 'V ktorom roku navrhol Alan Turing svoj test, či stroj dokáže napodobniť človeka?', answer: 1950, w: 'Turing ho opísal v článku z roku 1950.' },
    { id: 'e7', q: 'V ktorom roku predstavili hlasovú asistentku Siri v iPhone?', answer: 2011, w: 'Siri prišla s iPhonom 4S v roku 2011.' }
  ]
};
