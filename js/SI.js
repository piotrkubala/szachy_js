
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