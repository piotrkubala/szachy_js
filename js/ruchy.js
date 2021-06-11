let szachownica =
{
    pola: new Array(), // przechowuje polozenie bierek na szachownicy, najpierw nr wiersza, pozniej nr kolumny
    nr_kolumny_en_passant: -1, // -1 jezeli en passant nie jest mozliwy, w przeciwnym wypadku numer kolumny
    mozna_roszada_biale_OO: true, // okresla czy biale moga zrobic roszade krotka
    mozna_roszada_biale_OOO: true, // okresla czy biale moga zrobic roszade dluga
    mozna_roszada_czarne_OO: true, // okresla czy czarne moga zrobic roszade krotka
    mozna_roszada_czarne_OOO: true, // okresla czy czarne moga zrobic roszade dluga
    biale_ruch: true, // okresla kto wykonuje ruch, true - biale, false - czarne
    liczba_polowek_od_r: 0, // okresla liczbe polruchow od ostatniego zbicia/ruchu pionem
    poz_krol_biale: // pozycja bialego krola
    {
        wiersz: 0,
        kolumna: 0
    },
    poz_krol_czarne: // pozycja czarnego krola
    {
        wiersz: 0,
        kolumna: 0
    },
    zostalo: new Array(13), // przechowuje informacje o ilosci pozostalych na szachownicy bierek
    ocena: // przechowuje statyczna ocene pozycji
    {
        faza_gry: 0, // przechowuje liczbe, ktora okresla faze gry z przedzialu <0; 70>, im blizej 0, tym bardziej jest koncowka
        material: 0, // przechowuje ocene na podstawie materialu (dodatnie dla bialych)
        tablice: 0, // przechowuje ocene na podstawie tablic (otwarcie, gra srodkowa)
        tablice_koncowka: 0, // przechowuje ocene na podstawie tablic w koncowce
        piony: 0 // przechowuje ocene na podstawie struktury pionow
    },
    hash: [0, 0] // przechowuje hash obecnej pozycji
}

let gracz_jako_bialy = true; // okresla czy czlowiek gra jako bialy
let zablokowane = true; // okresla czy mozna obecnie wykonac ruch lub czy gra zostala zakonczona

let dostepne; // tablica 2D, przechowuje wartosc bool okreslajaca czy trzymana bierka moze przemiescic sie na dane pole

// tablica dostepnych ruchow teraz
let ruchy_dostepne =
{
    ruchy: Array(),
    zbicia: Array()
};

// przygotowuje pusta szachownice jako szachownica.pola i tablice dostepne
function przygotuj_szachownice()
{
    szachownica.zostalo = new Array(13);

    szachownica.pola = new Array();
    szachownica.hash =  [0, 0];
    dostepne = new Array();

    for(let i = 0; i < 13; i++)
        szachownica.zostalo[i] = 0;

    for(let i = 0; i < 8; i++)
    {
        szachownica.pola.push(new Array(8));
        dostepne.push(new Array(8));
        for(let j = 0; j < 8; j++)
        {
            szachownica.pola[i][j] = 0;
            dostepne[i][j] = false;
        }
    }
}

// dla danej pozycji zwraca numer bierki, jezeli pozycja nalezy do szachownicy,
// w przeciwnym wypadku zwraca -1
function nr_bierki_na_poz(wiersz, kolumna)
{
    if(wiersz > 7 || kolumna > 7 || wiersz < 0 || kolumna < 0)
        return -1;
    return szachownica.pola[wiersz][kolumna];
}

// zwraca true, jezeli krol sprawdzanej strony jest w szachu
// argument: true, jezeli sprawdzamy dla bialych, false, jezeli dla czarnych
function czy_szach(dla_bialych)
{
    let k_wiersz, k_kolumna;

    if(dla_bialych)
    {
        k_wiersz = szachownica.poz_krol_biale.wiersz;
        k_kolumna = szachownica.poz_krol_biale.kolumna;

        if(czy_szach_od_krol_lub_hetman1(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if(szachownica.zostalo[12] && czy_szach_od_pion(dla_bialych, k_wiersz, k_kolumna))
            return true;

        if((szachownica.zostalo[8] || szachownica.zostalo[10]) && czy_szach_od_goniec_lub_hetman(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if((szachownica.zostalo[8] || szachownica.zostalo[9]) && czy_szach_od_wieza_lub_hetman(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if(szachownica.zostalo[11] && czy_szach_od_skoczek(dla_bialych, k_wiersz, k_kolumna))
            return true;
    }
    else
    {
        k_wiersz = szachownica.poz_krol_czarne.wiersz;
        k_kolumna = szachownica.poz_krol_czarne.kolumna;

        if(czy_szach_od_krol_lub_hetman1(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if(szachownica.zostalo[6] && czy_szach_od_pion(dla_bialych, k_wiersz, k_kolumna))
            return true;

        if((szachownica.zostalo[2] || szachownica.zostalo[4]) && czy_szach_od_goniec_lub_hetman(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if((szachownica.zostalo[2] || szachownica.zostalo[3]) && czy_szach_od_wieza_lub_hetman(dla_bialych, k_wiersz, k_kolumna))
            return true;
        
        if(szachownica.zostalo[5] && czy_szach_od_skoczek(dla_bialych, k_wiersz, k_kolumna))
            return true;
    }

    return false;
}

// generuje mozliwe ruchy
// zwraca obiekt zawierajacy 2 tablice: {zbicia: Array(), ruchy: Array()}
// elementy tablic sa obiektami {wiersz_p, kolumna_p, wiersz_k, kolumna_k}
// opisujacymi wspolrzedne poczatkowe i koncowe ruchu
function generuj_ruchy()
{
    let ruchy =
    {
        zbicia: Array(),
        ruchy: Array()
    };

    let czy_biale = szachownica.biale_ruch;

    for(let wiersz = 0; wiersz < 8; wiersz++)
    {
        for(let kolumna = 0; kolumna < 8; kolumna++)
        {
            let nr_bierki = szachownica.pola[wiersz][kolumna];

            if((czy_biale && nr_bierki <= 6 && nr_bierki >= 1) || (!czy_biale && nr_bierki <= 12 && nr_bierki >= 7))
            {
                // generuj ruch

                if(!czy_biale)
                    nr_bierki -= 6;

                switch(nr_bierki)
                {
                    case 1: // krol
                        generuj_ruch_krol(czy_biale, ruchy, wiersz, kolumna);
                        break;
                    case 2: // hetman
                        generuj_ruch_hetman(czy_biale, ruchy, wiersz, kolumna);
                        break;
                    case 3: // wieza
                        generuj_ruch_wieza(czy_biale, ruchy, wiersz, kolumna);
                        break;
                    case 4: // goniec
                        generuj_ruch_goniec(czy_biale, ruchy, wiersz, kolumna);
                        break;
                    case 5: // skoczek
                        generuj_ruch_skoczek(czy_biale, ruchy, wiersz, kolumna);
                        break;
                    case 6: // pion
                        generuj_ruch_pion(czy_biale, ruchy, wiersz, kolumna);
                        break;
                }
            }
        }
    }

    return ruchy;
}

// zaznacza dostepne ruchy dla wzietej bierki
function zaznacz_dostepne()
{
    for(let i = 0; i < 8; i++)
        for(let j = 0; j < 8; j++)
            dostepne[i][j] = false;

    for(let i = 0; i < ruchy_dostepne.ruchy.length; i++)
    {
        if(wzieta.wiersz === ruchy_dostepne.ruchy[i].wiersz_p && wzieta.kolumna === ruchy_dostepne.ruchy[i].kolumna_p)
            dostepne[ruchy_dostepne.ruchy[i].wiersz_k][ruchy_dostepne.ruchy[i].kolumna_k] = true;
    }

    for(let i = 0; i < ruchy_dostepne.zbicia.length; i++)
    {
        if(wzieta.wiersz === ruchy_dostepne.zbicia[i].wiersz_p && wzieta.kolumna === ruchy_dostepne.zbicia[i].kolumna_p)
            dostepne[ruchy_dostepne.zbicia[i].wiersz_k][ruchy_dostepne.zbicia[i].kolumna_k] = true;
    }
}

// promuje piona na pozycji (wiersz, kolumna) na figure
function promuj_piona(wiersz, kolumna, figura)
{
    zmien_ocene_usun(wiersz, kolumna);
    zmien_ocene_dodaj(wiersz, kolumna, figura);

    hash_bierka(wiersz, kolumna, szachownica.pola[wiersz][kolumna]);
    hash_bierka(wiersz, kolumna, figura);

    szachownica.zostalo[figura]++;
    szachownica.zostalo[szachownica.pola[wiersz][kolumna]]--;
    szachownica.pola[wiersz][kolumna] = figura;
}

// promuje obecnie wybranego piona na figure
function promowanie_gracz(nr_bierki, wiersz, kolumna)
{
    promuj_piona(wiersz, kolumna, nr_bierki);
    przygotoj_wybor_promocji(true, true);

    narysuj();
    
    zablokowane = false;

    przejdz_nastepny_ruch();
    narysuj();
}

// wykonuje na szachownicy podany ruch, zmienia szachownica.ocena
function wykonaj_ruch(ruch_t)
{
    // ruch krolem
    if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 1)
    {
        szachownica.poz_krol_biale.wiersz = ruch_t.wiersz_k;
        szachownica.poz_krol_biale.kolumna = ruch_t.kolumna_k;

        if(szachownica.mozna_roszada_biale_OO)
            hash_roszada(0);
        
        if(szachownica.mozna_roszada_biale_OOO)
            hash_roszada(1);

        szachownica.mozna_roszada_biale_OO = szachownica.mozna_roszada_biale_OOO = false; // nie mozna roszady po ruchu krolem
    }
    else if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 7)
    {
        szachownica.poz_krol_czarne.wiersz = ruch_t.wiersz_k;
        szachownica.poz_krol_czarne.kolumna = ruch_t.kolumna_k;

        if(szachownica.mozna_roszada_czarne_OO)
            hash_roszada(2);
        
        if(szachownica.mozna_roszada_czarne_OOO)
            hash_roszada(3);

        szachownica.mozna_roszada_czarne_OO = szachownica.mozna_roszada_czarne_OOO = false; // nie mozna roszady po ruchu krolem
    }

    // nie mozna danej roszady po ruchu odpowiednia wieza
    if(ruch_t.wiersz_p === 0 && ruch_t.kolumna_p === 0)
    {
        if(szachownica.mozna_roszada_biale_OOO)
            hash_roszada(1);

        szachownica.mozna_roszada_biale_OOO = false;
    }
    else if(ruch_t.wiersz_p === 0 && ruch_t.kolumna_p === 7)
    {
        if(szachownica.mozna_roszada_biale_OO)
            hash_roszada(0);

        szachownica.mozna_roszada_biale_OO = false;
    }
    else if(ruch_t.wiersz_p === 7 && ruch_t.kolumna_p === 0)
    {
        if(szachownica.mozna_roszada_czarne_OOO)
            hash_roszada(3);

        szachownica.mozna_roszada_czarne_OOO = false;
    }
    else if(ruch_t.wiersz_p === 7 && ruch_t.kolumna_p === 7)
    {
        if(szachownica.mozna_roszada_czarne_OO)
            hash_roszada(2);

        szachownica.mozna_roszada_czarne_OO = false;
    }

    if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] !== 0)
        szachownica.zostalo[szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k]]--;

    // usuwanie hashu od poprzedniej mozliwosci zbicia w przelocie
    if(szachownica.nr_kolumny_en_passant !== -1)
        hash_en_passant(!szachownica.biale_ruch, szachownica.nr_kolumny_en_passant);

    if(szachownica.biale_ruch)
    {
        // en passant - zaznaczanie kolumny dla bialych
        if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 6 && ruch_t.wiersz_p === 1 && ruch_t.wiersz_k === 3)
        {          
            szachownica.nr_kolumny_en_passant = ruch_t.kolumna_k;

            hash_en_passant(szachownica.biale_ruch, szachownica.nr_kolumny_en_passant)
        }
        else
            szachownica.nr_kolumny_en_passant = -1;
    }
    else
    {
        // en passant - zaznaczanie kolumny dla czarnych
        if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 12 && ruch_t.wiersz_p === 6 && ruch_t.wiersz_k === 4)
        {
            szachownica.nr_kolumny_en_passant = ruch_t.kolumna_k;

            hash_en_passant(szachownica.biale_ruch, szachownica.nr_kolumny_en_passant)
        }
        else
            szachownica.nr_kolumny_en_passant = -1;
    }

    // en passant biale
    if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 6 && szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 0 && ruch_t.kolumna_p != ruch_t.kolumna_k)
    {
        zmien_ocene_usun(ruch_t.wiersz_p, ruch_t.kolumna_k);
        hash_bierka(ruch_t.wiersz_p, ruch_t.kolumna_k, 12);

        szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_k] = 0;
        szachownica.zostalo[12]--;
    }
    else if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 12 && szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 0 && ruch_t.kolumna_p != ruch_t.kolumna_k) // en passant czarne
    {
        zmien_ocene_usun(ruch_t.wiersz_p, ruch_t.kolumna_k);
        hash_bierka(ruch_t.wiersz_p, ruch_t.kolumna_k, 6);

        szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_k] = 0;
        szachownica.zostalo[6]--;
    }

    // wykonywanie roszady
    if(szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 1 || szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] === 7)
    {
        if(ruch_t.kolumna_k - ruch_t.kolumna_p === 2) // roszada krotka
        {
            zmien_ocene({wiersz_p: ruch_t.wiersz_p, kolumna_p: 7, wiersz_k: ruch_t.wiersz_k, kolumna_k: ruch_t.kolumna_k - 1});

            hash_bierka(ruch_t.wiersz_p, 7, szachownica.pola[ruch_t.wiersz_p][7]);
            hash_bierka(ruch_t.wiersz_k, ruch_t.kolumna_k - 1, szachownica.pola[ruch_t.wiersz_p][7]);

            szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k - 1] = szachownica.pola[ruch_t.wiersz_p][7];
            szachownica.pola[ruch_t.wiersz_p][7] = 0;
        }
        else if(ruch_t.kolumna_k - ruch_t.kolumna_p === -2) // roszada dluga
        {
            zmien_ocene({wiersz_p: ruch_t.wiersz_p, kolumna_p: 0, wiersz_k: ruch_t.wiersz_k, kolumna_k: ruch_t.kolumna_k + 1});

            hash_bierka(ruch_t.wiersz_p, 0, szachownica.pola[ruch_t.wiersz_p][0]);
            hash_bierka(ruch_t.wiersz_k, ruch_t.kolumna_k + 1, szachownica.pola[ruch_t.wiersz_p][0]);

            szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k + 1] = szachownica.pola[ruch_t.wiersz_p][0];
            szachownica.pola[ruch_t.wiersz_p][0] = 0;
        }
    }

    zmien_ocene(ruch_t);

    if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] !== 0)
        hash_bierka(ruch_t.wiersz_k, ruch_t.kolumna_k, szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k]);

    hash_bierka(ruch_t.wiersz_p, ruch_t.kolumna_p, szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p]);
    hash_bierka(ruch_t.wiersz_k, ruch_t.kolumna_k, szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p]);

    szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] = szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p];
    szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] = 0;
    szachownica.biale_ruch = !szachownica.biale_ruch;
}

// wykonuje ruch SI i generuje ruchy dla gracza
function przejdz_nastepny_ruch()
{
    if(zablokowane)
        return;

    wykonaj_ruch_SI();

    ruchy_dostepne = generuj_ruchy();

    // sprawdzanie czy jest mat/pat
    if(ruchy_dostepne.ruchy.length + ruchy_dostepne.zbicia.length === 0)
    {
        if(czy_szach(szachownica.biale_ruch))
        {
            // mat, SI wygralo
            napisz_wynik(szachownica.biale_ruch ? 2 : 1);
        }
        else
        {
            // pat, remis
            napisz_wynik(3);
        }

        szachownica.biale_ruch = !szachownica.biale_ruch;
        zablokowane = true;
    }
}

// uzupelnic te funkcje o promocje piona
// sprawdza czy mozliwe jest zabranie bierki z pola o podanych wspolrzednych,
// jezeli tak, to zaznacza ta bierke jako wzieta i wylicza dostepne pola,
// na ktore moze sie ruszyc, pozniej rysuje szachownice
function wez_lub_przesun_bierke(wiersz, kolumna)
{
    if(zablokowane)
        return;

    let czy_moze_ruszyc = (szachownica.biale_ruch && gracz_jako_bialy && szachownica.pola[wiersz][kolumna] <= 6 && szachownica.pola[wiersz][kolumna] >= 1);
    czy_moze_ruszyc ||= (!szachownica.biale_ruch && !gracz_jako_bialy && szachownica.pola[wiersz][kolumna] >= 7 && szachownica.pola[wiersz][kolumna] <= 12);

    if(wzieta.czy && dostepne[wiersz][kolumna])
    {
        // wykonuje ruch
        let ruch_t =
        {
            wiersz_p: wzieta.wiersz,
            kolumna_p: wzieta.kolumna,
            wiersz_k: wiersz,
            kolumna_k: kolumna
        };

        wykonaj_ruch(ruch_t);

        wzieta.czy = false;

        // obsluga promocji piona
        
        if(!szachownica.biale_ruch && ruch_t.wiersz_k === 7 && szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 6) // negacja, bo funkcja wykonaj_ruch() zmienila wartosc szachownica.biale_ruch
        {
            // promocja biale
            przygotoj_wybor_promocji(false, true, wiersz, kolumna);
            zablokowane = true;
        }
        else if(szachownica.biale_ruch && ruch_t.wiersz_k === 0 && szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 12)
        {
            // promocja czarne
            przygotoj_wybor_promocji(false, false, wiersz, kolumna);
            zablokowane = true;
        }
        else
        {
            narysuj();
            przejdz_nastepny_ruch();
        }
    }
    else if((wzieta.czy && wzieta.wiersz === wiersz && wzieta.kolumna === kolumna) || !czy_moze_ruszyc)
        wzieta.czy = false;
    else
    {
        wzieta.czy = true;
        wzieta.wiersz = wiersz;
        wzieta.kolumna = kolumna;
        
        zaznacz_dostepne();
    }

    narysuj();
}