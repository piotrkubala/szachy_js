let strona_rysowanie = 0;// wybor strony, z ktorej rysyjemy szachownice, 0 - biale, 1 - czarne
let rysowac_oznaczenia_wspolrzednych = true;// okresla czy nalezy rysowac oznaczenia wspolrzednych pol

//glowna funkcja
function przygotuj()
{
    narysuj();
    window.onresize = narysuj;
}

// glowna funkcja rysujaca
function narysuj()
{
    rysuj_szachownica(strona_rysowanie, rysowac_oznaczenia_wspolrzednych);
}

// obraca i rysuje szachownice
function obroc_szachownice()
{
    strona_rysowanie = 1 - strona_rysowanie;

    narysuj();
}

// przelacza wyswietlanie wspolrzednych pol
function przelacz_wyswietlanie_wspolrzednych_pol()
{
    rysowac_oznaczenia_wspolrzednych = !rysowac_oznaczenia_wspolrzednych;

    narysuj();
}