// zrobic obsluge reszty bledow!!! (szach)
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

            // nastepuje tu sprawdzanie czy krol i wieza sa na odpowiednich pozycjach
            if(znak === "K")
            {
                if(pozycja[0][4] !== 1 || pozycja[0][7] !== 3)
                    return false;

                w_OO = true;
            }
            else if(znak === "Q")
            {
                if(pozycja[0][4] !== 1 || pozycja[0][0] !== 3)
                    return false;

                w_OOO = true;
            }
            else if(znak === "k")
            {
                if(pozycja[7][4] !== 7 || pozycja[7][7] !== 9)
                    return false;

                b_OO = true;
            }
            else if(znak === "q")
            {
                if(pozycja[7][4] !== 7 || pozycja[7][7] !== 9)
                    return false;

                b_OOO = true;
            }
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

    // sprawdzanie czy jest pion, ktory moze byc zbity w przelocie
    if(nr_kolumny !== -1)
    {
        if(w_move && pozycja[4][nr_kolumny] !== 12)
            return false;
        if(!w_move && pozycja[3][nr_kolumny] !== 6)
            return false;
    }

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
    gracz_jako_bialy = w_move;

    strona_rysowanie = w_move ? 0 : 1;

    return true;
}