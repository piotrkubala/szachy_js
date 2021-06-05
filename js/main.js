let strona_rysowanie = 0;// wybor strony, z ktorej rysyjemy szachownice, 0 - biale, 1 - czarne
let rysowac_oznaczenia_wspolrzednych = true;// okresla czy nalezy rysowac oznaczenia wspolrzednych pol

//glowna funkcja
function przygotuj()
{
    przygotuj_szachownice();
    wypelnij_z_FEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
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
    przygotuj_szachownice();
    wzieta = 
    {
        x: 0,
        y: 0,
        czy: false
    };
    wypelnij_z_FEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    narysuj();
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

        narysuj();
    }
    else
    {
        // notacja FEN byla bledna
        div_blad.innerHTML = "Wprowadzony FEN pozycji jest nieprawidlowy!";
    }
}