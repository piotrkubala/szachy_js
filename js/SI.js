/*
    Elementy tej tablicy sa postaci:
    {
        glebia - na podstawie jakiej glebokosci byla zrobiona ocena
        ocena - ocena pozycji
        ruchy - tablica ruchow dostepnych w pozycji
    }
*/
let tablica_transp; // mapa transpozycji


// wykonuje ruch
function wykonaj_ruch_SI()
{
    let ruchy = generuj_ruchy(), ruch_t;

    // sprawdzanie czy jest mat/pat
    if(ruchy.ruchy.length + ruchy.zbicia.length === 0)
    {
        if(czy_szach(szachownica.biale_ruch))
        {
            // mat, SI przegralo
            napisz_wynik(szachownica.biale_ruch ? 2 : 1);
        }
        else
        {
            // pat, remis
            napisz_wynik(3);
        }

        zablokowane = true;

        return;
    }

    // sprawdzanie pozostalych remisow
    if(szachownica.liczba_polowek_od_r > 100 || poprzednie_pozycje[szachownica.hash] >= 3 || !czy_wystarczajacy_material())
    {
        napisz_wynik(3);

        szachownica.biale_ruch = !szachownica.biale_ruch;
        zablokowane = true;

        return;
    }

    tablica_transp = new Map();

    let nr = Math.floor(Math.random() * (ruchy.ruchy.length + ruchy.zbicia.length));

    if(nr < ruchy.ruchy.length)
        ruch_t = ruchy.ruchy[nr];
    else
        ruch_t = ruchy.zbicia[nr - ruchy.ruchy.length];

    wykonaj_ruch(ruch_t);
    if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 6 && ruch_t.wiersz_k === 7)
    {
        // promocja biale
        promuj_piona(ruch_t.wiersz_k, ruch_t.kolumna_k, Math.floor(Math.random() * 4) + 2);
    }
    else if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 12 && ruch_t.wiersz_k === 0)
    {
        // promocja czarne
        promuj_piona(ruch_t.wiersz_k, ruch_t.kolumna_k, Math.floor(Math.random() * 4) + 8);
    }

    narysuj();
}

// skonczyc ta funkcje!!!
/*
    ocenia pozycje algorytmem alfa-beta:

    glebia_ob - obecna glebia: od 0 w polruchach
    glebia_maks - maksymalna glebia, do ktorej analizujemy rowniez ruchy bez bicia
    glebia_maks_zapisz_ruch - maksymalna glebia, do ktorej do tablicy transpozycji zapisujemy rowniez ruchy
*/
function alfa_beta(glebia_ob, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta)
{
    let ruchy_teraz, element, bierka_zbita;

    if(tablica_transp[szachownica.hash])
    {
        if(tablica_transp.glebia > glebia_ob - glebia_maks)
            return tablica_transp[szachownica.hash].ocena;
        else if(tablica_transp.ruchy)
            ruchy_teraz = tablica_transp.ruchy;
    }

    if(!ruchy_teraz)
        ruchy_teraz = generuj_ruchy();

    // tu zrobic sortowanie ruchow

    if(glebia_ob <= glebia_maks_zapisz_ruch)
        element.ruchy = ruchy_teraz;
    
    if(szachownica.biale_ruch)
    {
        // wykonywanie zbic dla bialych
        for(let i = 0; i < ruchy_teraz.zbicia.length; i++)
        {
            let wiersz_p = ruchy_teraz.zbicia.wiersz_p, kolumna_p = ruchy_teraz.zbicia.kolumna_p;
            let wiersz_k = ruchy_teraz.zbicia.wiersz_k, kolumna_k = ruchy_teraz.zbicia.kolumna_k;
            let nr_kolumny_en_passant = szachownica.nr_kolumny_en_passant, bylo_w_przelocie = false, liczba_pol_ruch = szachownica.liczba_polowek_od_r;
            let nr_zbijanej = szachownica[wiersz_k][kolumna_k];
            let kopia_OOW = szachownica.mozna_roszada_biale_OO, kopia_OOOW = szachownica.mozna_roszada_biale_OOO;
            let kopia_OOB = szachownica.mozna_roszada_czarne_OO, kopia_OOOB = szachownica.mozna_roszada_czarne_OOO;
            let hash_kopia = szachownica.hash, ocena_kopia = szachownica.ocena;
            let poz_krol_biale = szachownica.poz_krol_biale, poz_krol_czarne = szachownica.poz_krol_czarne;

            if(szachownica.pola[wiersz_p][kolumna_p] === 6 && wiersz_p === 4 && kolumna_p !== kolumna_k && szachownica.pola[wiersz_k][kolumna_k] === 0) // bicie w przelocie
            {
                nr_kolumny_en_passant = szachownica.nr_kolumny_en_passant;
                bylo_w_przelocie = true;
            }

            wykonaj_ruch(ruchy_teraz.zbicia[i]);

            beta = Math.min(beta, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));

            // cofnij ruch!!!
            if(bylo_w_przelocie)
            {
                szachownica.pola[wiersz_k][kolumna_k] = 0;
                szachownica.pola[wiersz_p][kolumna_p] = 6;
                szachownica.pola[wiersz_p][kolumna_k] = 12;
            }
            else
            {
                szachownica.pola[wiersz_p][kolumna_p] = szachownica.pola[wiersz_k][kolumna_k];
                szachownica.pola[wiersz_k][kolumna_k] = nr_zbijanej;
            }

            szachownica.hash = hash_kopia;
            szachownica.ocena = ocena_kopia;

            szachownica.biale_ruch = !szachownica.biale_ruch;
            szachownica.nr_kolumny_en_passant = nr_kolumny_en_passant;
            szachownica.liczba_polowek_od_r = liczba_pol_ruch;

            szachownica.mozna_roszada_biale_OO = kopia_OOW;
            szachownica.mozna_roszada_biale_OOO = kopia_OOOW;
            szachownica.mozna_roszada_czarne_OO = kopia_OOB;
            szachownica.mozna_roszada_czarne_OOO = kopia_OOOB;

            szachownica.poz_krol_biale = poz_krol_biale;
            szachownica.poz_krol_czarne = poz_krol_czarne;

            if(alfa >= beta)
                break;
        }

        // wykonywanie ruchow dla bialych
        if(glebia_ob <= glebia_maks && alfa < beta)
        {
            for(let i = 0; i < ruchy_teraz.ruchy.length; i++)
            {
                wykonaj_ruch(ruchy_teraz.ruchy[i]);

                if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 6 && ruch_t.wiersz_k === 7)
                {
                    // promocja biale
                    for(let j = 2; j < 6; j++)
                    {
                        promuj_piona(ruch_t.wiersz_k, ruch_t.kolumna_k, j);

                        beta = Math.min(beta, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));

                        // odpromuj piona!!!

                        if(alfa >= beta)
                            break;
                    }
                }
                else
                {
                    // normalny ruch biale
                    beta = Math.min(beta, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));
                }

                // cofnij ruch!!!

                if(alfa >= beta)
                    break;
            }
        }

        element.glebia = glebia_maks - glebia_ob;
        element.ocena = beta;

        return beta;
    }
    else
    {
        // wykonywanie zbic dla czarnych
        for(let i = 0; i < ruchy_teraz.zbicia.length; i++)
        {
            wykonaj_ruch(ruchy_teraz.zbicia[i]);

            alfa = Math.max(alfa, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));

            // cofnij ruch!!!

            if(alfa >= beta)
                break;
        }

        // wykonywanie ruchow dla czarnych
        if(glebia_ob <= glebia_maks && alfa < beta)
        {
            for(let i = 0; i < ruchy_teraz.ruchy.length; i++)
            {
                wykonaj_ruch(ruchy_teraz.ruchy[i]);

                if(szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] === 6 && ruch_t.wiersz_k === 7)
                {
                    // promocja biale
                    for(let j = 2; j < 6; j++)
                    {
                        promuj_piona(ruch_t.wiersz_k, ruch_t.kolumna_k, j);

                        beta = Math.max(beta, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));

                        // odpromuj piona!!!

                        if(alfa >= beta)
                            break;
                    }
                }
                else
                {
                    // normalny ruch biale
                    alfa = Math.max(alfa, alfa_beta(glebia_ob + 1, glebia_maks, glebia_maks_zapisz_ruch, alfa, beta));
                }

                // cofnij ruch!!!

                if(alfa >= beta)
                    break;
            }
        }

        element.glebia = glebia_maks - glebia_ob;
        element.ocena = alfa;

        return alfa;
    }
}