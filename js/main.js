let strona_rysowanie = 0;// wybor strony, z ktorej rysyjemy szachownice, 0 - biale, 1 - czarne
let rysowac_oznaczenia_wspolrzednych = true;// okresla czy nalezy rysowac oznaczenia wspolrzednych pol

//glowna funkcja
function przygotuj()
{
    napisz_wynik(0);
    generuj_ps_losowe();
    przygotuj_szachownice();
    wypelnij_z_FEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    ustaw_ocen_statycznie();
    ustaw_hash_pozycji();
    ruchy_dostepne = generuj_ruchy();
    zablokowane = false;
    narysuj();
    window.onresize = narysuj;
}

// glowna funkcja rysujaca
function narysuj()
{
    rysuj_szachownica(strona_rysowanie, rysowac_oznaczenia_wspolrzednych);
}

// przygotowuje wszystko do nowej gry
function nowa_partia()
{
    napisz_wynik(0);
    przygotuj_szachownice();
    wzieta = 
    {
        x: 0,
        y: 0,
        czy: false
    };
    wypelnij_z_FEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    ustaw_ocen_statycznie();
    ustaw_hash_pozycji();
    ruchy_dostepne = generuj_ruchy();
    zablokowane = false;

    narysuj();
}

// obraca i rysuje szachownice
function obroc_szachownice()
{
    strona_rysowanie = 1 - strona_rysowanie;

    narysuj();
}

// dokonczyc, gdy bedzie juz dzialac SI!!!
// zmienia strone gracza ludzkiego
function zmien_kolor_gracza()
{
    if(zablokowane)
        return;

    gracz_jako_bialy = !gracz_jako_bialy;

    wykonaj_ruch_SI();

    ruchy_dostepne = generuj_ruchy();

    narysuj();
}

// przelacza wyswietlanie wspolrzednych pol
function przelacz_wyswietlanie_wspolrzednych_pol()
{
    rysowac_oznaczenia_wspolrzednych = !rysowac_oznaczenia_wspolrzednych;

    narysuj();
}

// probuje odczytac pozycje z notacji FEN wprowadzonej przez uzytkownika
function wczytaj_z_FEN()
{
    let notacja_FEN = document.getElementById("wprowadzanie_FEN").value;
    let div_blad = document.getElementById("bledny_FEN");

    if(wypelnij_z_FEN(notacja_FEN))
    {
        // wprowadzona poprawna notacja FEN
        document.getElementById("wprowadzanie_FEN").value = "";
        div_blad.innerHTML = "";

        napisz_wynik(0);
        ustaw_ocen_statycznie();
        ustaw_hash_pozycji();

        ruchy_dostepne = generuj_ruchy();

        zablokowane = false;

        narysuj();
    }
    else
    {
        // notacja FEN byla bledna
        div_blad.innerHTML = "Wprowadzony FEN pozycji jest nieprawidlowy!";
    }
}