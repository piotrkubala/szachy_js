
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
            napisz_wynik(szachownica.biale_ruch ? 1 : 2);
        }
        else
        {
            // pat, remis
            napisz_wynik(3);
        }

        return;
    }

    let nr = Math.floor(Math.random() * (ruchy.ruchy.length + ruchy.zbicia.length));

    if(nr < ruchy.ruchy.length)
        ruch_t = ruchy.ruchy[nr];
    else
        ruch_t = ruchy.zbicia[nr - ruchy.ruchy.length];

    wykonaj_ruch(ruch_t);

    narysuj();
}