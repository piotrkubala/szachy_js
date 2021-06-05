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
    zostalo: new Array(13) // przechowuje informacje o ilosci pozostalych na szachownicy bierek
}

let gracz_jako_bialy = true; // okresla czy czlowiek gra jako bialy

let dostepne; // tablica 2D, przechowuje wartosc bool okreslajaca czy trzymana bierka moze przemiescic sie na dane pole

// przygotowuje pusta szachownice jako szachownica.pola i tablice dostepne
function przygotuj_szachownice()
{
    szachownica.zostalo = new Array(13);

    szachownica.pola = new Array();
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

// oblicza dostepne ruchy dla wzietej bierki
function oblicz_dostepne()
{

}

// uzupelnic te funkcje!!!
// sprawdza czy mozliwe jest zabranie bierki z pola o podanych wspolrzednych,
// jezeli tak, to zaznacza ta bierke jako wzieta i wylicza dostepne pola,
// na ktore moze sie ruszyc, pozniej rysuje szachownice
function wez_lub_przesun_bierke(wiersz, kolumna)
{
    let czy_moze_ruszyc = (gracz_jako_bialy && szachownica.pola[wiersz][kolumna] <= 6 && szachownica.pola[wiersz][kolumna] >= 1);
    czy_moze_ruszyc ||= (!gracz_jako_bialy && szachownica.pola[wiersz][kolumna] >= 7 && szachownica.pola[wiersz][kolumna] <= 12);

    if(wzieta.czy && dostepne[wiersz][kolumna])
    {
        // wykonuje ruch
        if(szachownica.pola[wzieta.wiersz][wzieta.kolumna] === 1)
        {
            szachownica.poz_krol_biale.wiersz = wiersz;
            szachownica.poz_krol_biale.kolumna = kolumna;
        }
        else if(szachownica.pola[wzieta.wiersz][wzieta.kolumna] === 7)
        {
            szachownica.poz_krol_czarne.wiersz = wiersz;
            szachownica.poz_krol_czarne.kolumna = kolumna;
        }

        szachownica.zostalo[szachownica.pola[wiersz][kolumna]]--;

        szachownica.pola[wiersz][kolumna] = szachownica.pola[wzieta.wiersz][wzieta.kolumna];
        szachownica.pola[wzieta.wiersz][wzieta.kolumna] = 0;
        wzieta.czy = false;
        biale_ruch = !biale_ruch;

        // sprawdzic en passant tu!!!
    }
    else if((wzieta.czy && wzieta.wiersz === wiersz && wzieta.kolumna === kolumna) || !czy_moze_ruszyc)
        wzieta.czy = false;
    else
    {
        wzieta.czy = true;
        wzieta.wiersz = wiersz;
        wzieta.kolumna = kolumna;
        
        oblicz_dostepne();
    }

    narysuj();
}

// zrobic obsluge reszty bledow
// na podstawie FEN podanego jako argument, zmienia pozycje ustawiona na szachownica.pola
// zmienia pozycje w obiekcie szachownica, zwraca false, jezeli bledny FEN
function wypelnij_z_FEN(pozycja_FEN)
{
    let nr_kolumny = -1, w_OO = false, w_OOO = false, b_OO = false, b_OOO = false, w_move = false;
    let liczba_polr = 0, liczba_ruch = 0;

    let byl_krol_w = false, byl_krol_b = false;

    let pozycja = new Array();

    for(let i = 0; i < 8; i++)
        pozycja.push(new Array(8));

    let wiersz = 7, kolumna = 0;
    let nr_ostatni_znak;

    // ustawianie pozycji
    for(let i = 0; i < pozycja_FEN.length; i++)
    {
        let nr_bierki = kod_FEN_na_nr_bierki(pozycja_FEN[i]);

        if(nr_bierki === 0)
        {
            // nie jest to kod bierki
            if(pozycja_FEN[i] !== "/")
            {
                if(!isNaN(pozycja_FEN[i]))
                {
                    if(kolumna + parseInt(pozycja_FEN[i]) > 8)
                        return false;

                    for(let j = 0; j < pozycja_FEN[i]; j++)
                    {
                        pozycja[wiersz][kolumna] = 0;
                        kolumna++;
                    }
                }
                else
                    return false;
            }
            else
            {
                wiersz--;
                kolumna = 0;
            }
        }
        else
        {
            if((nr_bierki === 6 || nr_bierki === 12) && (wiersz === 0 || wiersz === 7))
                return false;

            if(byl_krol_w && nr_bierki === 1)
                return false;

            if(byl_krol_b && nr_bierki === 7)
                return false;

            if(nr_bierki === 1)
            {
                byl_krol_w = true;

                szachownica.poz_krol_biale.wiersz = wiersz;
                szachownica.poz_krol_biale.kolumna = kolumna;
            }

            if(nr_bierki === 7)
            {
                byl_krol_b = true;

                szachownica.poz_krol_czarne.wiersz = wiersz;
                szachownica.poz_krol_czarne.kolumna = kolumna;
            }

            szachownica.zostalo[nr_bierki]++;

            pozycja[wiersz][kolumna] = nr_bierki;
            kolumna++;
        }

        if(wiersz === 0 && kolumna === 8)
        {
            nr_ostatni_znak = i + 1;
            break;
        }
    }

    if(!byl_krol_w || !byl_krol_b)
        return false;

    // spacje przed znakiem okreslajacym kto wykonuje ruch
    while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] === " ")
        nr_ostatni_znak++;

    if(pozycja_FEN.length === nr_ostatni_znak || (pozycja_FEN[nr_ostatni_znak] != "w" && pozycja_FEN[nr_ostatni_znak] != "b"))
        return false;

    w_move = pozycja_FEN[nr_ostatni_znak] === "w";
    nr_ostatni_znak++;

    // spacje przed znakami okreslajacymi mozliwosc wykonania roszady
    while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] === " ")
        nr_ostatni_znak++;

    if(pozycja_FEN.length === nr_ostatni_znak)
        return false;

    if(pozycja_FEN[nr_ostatni_znak] !== "-")
    {
        while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] != " ")
        {
            let znak = pozycja_FEN[nr_ostatni_znak]

            if(znak === "K")
                w_OO = true;
            else if(znak === "Q")
                w_OOO = true;
            else if(znak === "k")
                b_OO = true;
            else if(znak === "q")
                b_OOO = true;
            else
                return false;
            
            nr_ostatni_znak++;
        }
    }
    else
        nr_ostatni_znak++;

    // spacje przed znakami okreslajacymi mozliwosci bicia w przelocie
    while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] === " ")
        nr_ostatni_znak++;

    if(pozycja_FEN.length === nr_ostatni_znak)
        return false;
    
    if(pozycja_FEN[nr_ostatni_znak] !== "-")
    {
        let znak = pozycja_FEN[nr_ostatni_znak]

        if(nr_ostatni_znak + 1 >= pozycja_FEN.length || isNaN(pozycja_FEN[nr_ostatni_znak + 1]) || znak.charCodeAt(0) > "h".charCodeAt(0) || znak.charCodeAt(0) < "a".charCodeAt(0))
            return false;
        
        nr_kolumny = znak.charCodeAt(0) - "a".charCodeAt(0);
        nr_ostatni_znak += 2;
    }
    else
        nr_ostatni_znak++;

    // spacje przed iloscia polruchow od ostatniego zerowania zasady 50
    while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] === " ")
        nr_ostatni_znak++;

    if(pozycja_FEN.length <= nr_ostatni_znak + 1)
        return false;

    if(!isNaN(pozycja_FEN[nr_ostatni_znak]))
    {
        liczba_polr = pozycja_FEN.charCodeAt(nr_ostatni_znak) - "0".charCodeAt(0);
    }
    else
        return false;
    
    nr_ostatni_znak++;
    if(pozycja_FEN[nr_ostatni_znak] !== " ")
    {
        if(!isNaN(pozycja_FEN[nr_ostatni_znak]))
        {
            liczba_polr = 10 * liczba_polr + pozycja_FEN.charCodeAt(nr_ostatni_znak) - "0".charCodeAt(0);
        }
        else
            return false;
    }
    nr_ostatni_znak++;

    // spacje przed iloscia ruchow
    while(nr_ostatni_znak < pozycja_FEN.length && pozycja_FEN[nr_ostatni_znak] === " ")
        nr_ostatni_znak++;

    if(pozycja_FEN.length === nr_ostatni_znak)
        return false;

    while(nr_ostatni_znak < pozycja_FEN.length && !isNaN(pozycja_FEN[nr_ostatni_znak]))
    {
        liczba_ruch = liczba_ruch * 10 + pozycja_FEN.charCodeAt(nr_ostatni_znak) - "0".charCodeAt(0);
        nr_ostatni_znak++;
    }

    // zapis FEN byl poprawny
    szachownica.pola = pozycja;
    szachownica.nr_kolumny_en_passant = nr_kolumny;
    szachownica.mozna_roszada_biale_OO = w_OO;
    szachownica.mozna_roszada_biale_OOO = w_OOO;
    szachownica.mozna_roszada_czarne_OO = b_OO;
    szachownica.mozna_roszada_czarne_OOO = b_OOO;
    szachownica.biale_ruch = w_move;
    szachownica.liczba_polowek_od_r = liczba_polr;

    return true;
}