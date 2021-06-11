let liczby_ps_losowe; // przechowuje liczby pseudolosowe dla pozycji bierek
let liczby_ps_losowe_en_passant; // przechowuje liczby pseudolosowe dla en passsant
let liczby_ps_losowe_roszada; // przechowuje liczby pseudolosowe dla roszady

function pseudolosowa(x)
{
    x ^= x << 13;
	x ^= x >> 17;
	x ^= x << 5;
    return x;
}

// generuje tablice liczb pseudolosowych potrzebnych do obliczania funkcji skrotu
function generuj_ps_losowe()
{
    let x = Math.floor(Math.random() * 100000), y;

    liczby_ps_losowe = new Array(13);
    liczby_ps_losowe_en_passant = new Array(2);
    liczby_ps_losowe_roszada = new Array(4);

    // zwykle pozycje
    for(let bierka = 1; bierka < 13; bierka++)
    {
        liczby_ps_losowe[bierka] = new Array(8);
        for(let wiersz = 0; wiersz < 8; wiersz++)
        {
            liczby_ps_losowe[bierka][wiersz] = new Array(8);
            for(let kolumna = 0; kolumna < 8; kolumna++)
            {
                x = pseudolosowa(x);
                y = pseudolosowa(x);

                liczby_ps_losowe[bierka][wiersz][kolumna] = [x, y];

                x = y;
            }
        }
    }

    // en passant
    for(let kolor = 0; kolor < 2; kolor++) // 0 - biale, 1 - czarne
    {
        liczby_ps_losowe_en_passant[kolor] = new Array(8);
        for(let kolumna = 0; kolumna < 8; kolumna++)
        {
            x = pseudolosowa(x);
            y = pseudolosowa(x);

            liczby_ps_losowe_en_passant[kolor][kolumna] = [x, y];

            x = y;
        }
    }

    // roszada
    for(let i = 0; i < 4; i++)
    {
        x = pseudolosowa(x);
        y = pseudolosowa(x);

        liczby_ps_losowe_roszada[i] = [x, y];

        x = y;
    }
}

// ustawia szachownica.hash, obliczajac caly hash od nowa
function ustaw_hash_pozycji()
{
    let ps, nr_bierki;

    szachownica.hash = [0, 0];

    // bierki na szachownicy
    for(let wiersz = 0; wiersz < 8; wiersz++)
    {
        for(let kolumna = 0; kolumna < 8; kolumna++)
        {
            nr_bierki = szachownica.pola[wiersz][kolumna];

            if(nr_bierki === 0)
                continue;

            ps = liczby_ps_losowe[nr_bierki][wiersz][kolumna];

            szachownica.hash[0] ^= ps[0];
            szachownica.hash[1] ^= ps[1];
        }
    }

    // en passant
    if(szachownica.nr_kolumny_en_passant !== -1)
    {
        ps = liczby_ps_losowe_en_passant[szachownica.biale_ruch ? 0 : 1][szachownica.nr_kolumny_en_passant];

        szachownica.hash[0] ^= ps[0];
        szachownica.hash[1] ^= ps[1];
    }

    // roszada
    if(szachownica.mozna_roszada_biale_OO)
    {
        ps = liczby_ps_losowe_roszada[0];

        szachownica.hash[0] ^= ps[0];
        szachownica.hash[1] ^= ps[1];
    }
    if(szachownica.mozna_roszada_biale_OOO)
    {
        ps = liczby_ps_losowe_roszada[1];

        szachownica.hash[0] ^= ps[0];
        szachownica.hash[1] ^= ps[1];
    }
    if(szachownica.mozna_roszada_czarne_OO)
    {
        ps = liczby_ps_losowe_roszada[2];

        szachownica.hash[0] ^= ps[0];
        szachownica.hash[1] ^= ps[1];
    }
    if(szachownica.mozna_roszada_czarne_OOO)
    {
        ps = liczby_ps_losowe_roszada[3];

        szachownica.hash[0] ^= ps[0];
        szachownica.hash[1] ^= ps[1];
    }
}

// zmienia szachownica.hash, zmieniajac hash od en passant
// kolor 0 - biale, 1 - czarne
function hash_en_passant(kolor, kolumna)
{
    let ps = liczby_ps_losowe_en_passant[kolor][kolumna];

    szachownica.hash[0] ^= ps[0];
    szachownica.hash[1] ^= ps[1];
}

// zmienia szachownica.hash, zmieniajac hash od roszady
// 0 - biale OO, 1 - biale OOO, 2 - czarne OO, 3 - czarne OOO
function hash_roszada(nr_roszady)
{
    let ps = liczby_ps_losowe_roszada[nr_roszady];

    szachownica.hash[0] ^= ps[0];
    szachownica.hash[1] ^= ps[1];
}

// zmienia szachownica.hash, zmieniajac hash od bierki
// argumenty: wiersz, kolumna, numer bierki, ktory zmieniamy na tej pozycji
function hash_bierka(wiersz, kolumna, nr_bierki)
{
    if(nr_bierki === 0)
        return;

    let ps = liczby_ps_losowe[nr_bierki][wiersz][kolumna];

    szachownica.hash[0] ^= ps[0];
    szachownica.hash[1] ^= ps[1];
}