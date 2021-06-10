// wartosci na podstawie https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function

// wartosci bierek
let wartosci =
[
    0,
    100000,
    900,
    500,
    300,
    300,
    100,
    -100000,
    -900,
    -500,
    -300,
    -300,
    -100
];

// okresla jak bardzo obecnosc danej bierki wplywa na faze gry
let wartosci_faza_gry =
[
    0,
    0, // biale
    7,
    3,
    4,
    3,
    1,
    0, // czarne
    7,
    3,
    4,
    3,
    1
];

// tabele dla otwarc i gry srodkowej, przechowywane w tablicach jednowymiarowych
let tabele =
[
    // krol
    [-65,  23,  16, -15, -56, -34,   2,  13,
     29,  -1, -20,  -7,  -8,  -4, -38, -29,
     -9,  24,   2, -16, -20,   6,  22, -22,
    -17, -20, -12, -27, -30, -25, -14, -36,
    -49,  -1, -27, -39, -46, -44, -33, -51,
    -14, -14, -22, -46, -44, -30, -15, -27,
      1,   7,  -8, -64, -43, -16,   9,   8,
    -15,  36,  12, -54,   8, -28,  24,  14],

    // hetman
    [-28,   0,  29,  12,  59,  44,  43,  45,
    -24, -39,  -5,   1, -16,  57,  28,  54,
    -13, -17,   7,   8,  29,  56,  47,  57,
    -27, -27, -16, -16,  -1,  17,  -2,   1,
     -9, -26,  -9, -10,  -2,  -4,   3,  -3,
    -14,   2, -11,  -2,  -5,   2,  14,   5,
    -35,  -8,  11,   2,   8,  15,  -3,   1,
     -1, -18,  -9,  10, -15, -25, -31, -50],

    // wieza
    [32,  42,  32,  51, 63,  9,  31,  43,
    27,  32,  58,  62, 80, 67,  26,  44,
    -5,  19,  26,  36, 17, 45,  61,  16,
    -24, -11,   7,  26, 24, 35,  -8, -20,
    -36, -26, -12,  -1,  9, -7,   6, -23,
    -45, -25, -16, -17,  3,  0,  -5, -33,
    -44, -16, -20,  -9, -1, 11,  -6, -71,
    -19, -13,   1,  17, 16,  7, -37, -26],

    // goniec
    [-29,   4, -82, -37, -25, -42,   7,  -8,
    -26,  16, -18, -13,  30,  59,  18, -47,
    -16,  37,  43,  40,  35,  50,  37,  -2,
    -4,   5,  19,  50,  37,  37,   7,  -2,
    -6,  13,  13,  26,  34,  12,  10,   4,
    0,  15,  15,  15,  14,  27,  18,  10,
    4,  15,  16,   0,   7,  21,  33,   1,
    -33,  -3, -14, -21, -13, -12, -39, -21],

    // skoczek
    [-167, -89, -34, -49,  61, -97, -15, -107,
    -73, -41,  72,  36,  23,  62,   7,  -17,
    -47,  60,  37,  65,  84, 129,  73,   44,
    -9,  17,  19,  53,  37,  69,  18,   22,
    -13,   4,  16,  13,  28,  19,  21,   -8,
    -23,  -9,  12,  10,  19,  17,  25,  -16,
    -29, -53, -12,  -3,  -1,  18, -14,  -19,
    -105, -21, -58, -33, -17, -28, -19,  -23],

    // pion
    [0,   0,   0,   0,   0,   0,  0,   0,
     98, 134,  61,  95,  68, 126, 34, -11,
     -6,   7,  26,  31,  65,  56, 25, -20,
    -14,  13,   6,  21,  23,  12, 17, -23,
    -27,  -2,  -5,  12,  17,   6, 10, -25,
    -26,  -4,  -4, -10,   3,   3, 33, -12,
    -35,  -1, -20, -23, -15,  24, 38, -22,
      0,   0,   0,   0,   0,   0,  0,   0]
];

// tabele dla koncowek
let tabele_konc =
[
    // krol
    [-74, -35, -18, -18, -11,  15,   4, -17,
    -12,  17,  14,  17,  17,  38,  23,  11,
    10,  17,  23,  15,  20,  45,  44,  13,
    -8,  22,  24,  27,  26,  33,  26,   3,
    -18,  -4,  21,  24,  27,  23,   9, -11,
    -19,  -3,  11,  21,  23,  16,   7,  -9,
    -27, -11,   4,  13,  14,   4,  -5, -17,
    -53, -34, -21, -11, -28, -14, -24, -43],

    // hetman
    [-9,  22,  22,  27,  27,  19,  10,  20,
    -17,  20,  32,  41,  58,  25,  30,   0,
    -20,   6,   9,  49,  47,  35,  19,   9,
    3,  22,  24,  45,  57,  40,  57,  36,
    -18,  28,  19,  47,  31,  34,  39,  23,
    -16, -27,  15,   6,   9,  17,  10,   5,
    -22, -23, -30, -16, -16, -23, -36, -32,
    -33, -28, -22, -43,  -5, -32, -20, -41],

    // wieza
    [13, 10, 18, 15, 12,  12,   8,   5,
    11, 13, 13, 11, -3,   3,   8,   3,
    7,  7,  7,  5,  4,  -3,  -5,  -3,
    4,  3, 13,  1,  2,   1,  -1,   2,
    3,  5,  8,  4, -5,  -6,  -8, -11,
    -4,  0, -5, -1, -7, -12,  -8, -16,
    -6, -6,  0,  2, -9,  -9, -11,  -3,
    -9,  2,  3, -1, -5, -13,   4, -20],

    // goniec
    [-14, -21, -11,  -8, -7,  -9, -17, -24,
    -8,  -4,   7, -12, -3, -13,  -4, -14,
    2,  -8,   0,  -1, -2,   6,   0,   4,
    -3,   9,  12,   9, 14,  10,   3,   2,
    -6,   3,  13,  19,  7,  10,  -3,  -9,
    -12,  -3,   8,  10, 13,   3,  -7, -15,
    -14, -18,  -7,  -1,  4,  -9, -15, -27,
    -23,  -9, -23,  -5, -9, -16,  -5, -17],

    // skoczek
    [-58, -38, -13, -28, -31, -27, -63, -99,
    -25,  -8, -25,  -2,  -9, -25, -24, -52,
    -24, -20,  10,   9,  -1,  -9, -19, -41,
    -17,   3,  22,  22,  22,  11,   8, -18,
    -18,  -6,  16,  25,  16,  17,   4, -18,
    -23,  -3,  -1,  15,  10,  -3, -20, -22,
    -42, -20, -10,  -5,  -2, -20, -23, -44,
    -29, -51, -23, -15, -22, -18, -50, -64],

    // pion
    [0,   0,   0,   0,   0,   0,   0,   0,
    178, 173, 158, 134, 147, 132, 165, 187,
    94, 100,  85,  67,  56,  53,  82,  84,
    32,  24,  13,   5,  -2,   4,  17,  17,
    13,   9,  -3,  -7,  -7,  -8,   3,  -1,
    4,   7,  -6,   1,   0,  -5,  -1,  -8,
    13,   8,   8,  10,  13,   0,   2,  -7,
    0,   0,   0,   0,   0,   0,   0,   0]
];

// zwraca wartosc z tabeli otwarcie/gra srodkowa
function wartosc_tabela(wiersz, kolumna, nr_bierki)
{
    let czy_biale = nr_bierki < 7;
    let nr = nr_bierki - (czy_biale ? 1 : 7);
    let poz_w_tablicy = kolumna + 8 * (!czy_biale ? wiersz: 7 - wiersz);

    return tabele[nr][poz_w_tablicy];
}

// zwraca wartosc z tabeli koncowek
function wartosc_tabela_konc(wiersz, kolumna, nr_bierki)
{
    let czy_biale = nr_bierki < 7;
    let nr = nr_bierki - (czy_biale ? 1 : 7);
    let poz_w_tablicy = kolumna + 8 * (!czy_biale ? wiersz: 7 - wiersz);

    return tabele_konc[nr][poz_w_tablicy];
}

// ustawia szachownica.ocena
function ustaw_ocen_statycznie()
{
    let nr_bierki, czy_biale, poz_w_tablicy;

    szachownica.ocena.material = 0;
    szachownica.ocena.tablice = 0;
    szachownica.ocena.tablice_koncowka = 0;

    szachownica.ocena.faza_gry = 0;

    for(let i = 1; i < 13; i++)
        szachownica.ocena.material += wartosci[i] * szachownica.zostalo[i];

    for(let wiersz = 0; wiersz < 8; wiersz++)
    {
        for(let kolumna = 0; kolumna < 8; kolumna++)
        {
            nr_bierki = szachownica.pola[wiersz][kolumna];

            if(nr_bierki === 0)
                continue;

            szachownica.ocena.faza_gry += wartosci_faza_gry[nr_bierki];

            if(nr_bierki < 7)
                czy_biale = true;
            else
                czy_biale = false;
            
            nr_bierki -= czy_biale ? 1 : 7;
            poz_w_tablicy = kolumna + 8 * (!czy_biale ? wiersz: 7 - wiersz);

            if(czy_biale)
            {
                szachownica.ocena.tablice += tabele[nr_bierki][poz_w_tablicy];
                szachownica.ocena.tablice_koncowka += tabele_konc[nr_bierki][poz_w_tablicy];
            }
            else
            {
                szachownica.ocena.tablice -= tabele[nr_bierki][poz_w_tablicy];
                szachownica.ocena.tablice_koncowka -= tabele_konc[nr_bierki][poz_w_tablicy];
            }
        }
    }

    if(szachownica.ocena.faza_gry > 70)
        szachownica.ocena.faza_gry = 70;
}

// zmienia szachownica.ocena na podstawie obiektu ruch_t
function zmien_ocene(ruch_t)
{
    let nr_bierki_p = szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p];
    let nr_bierki_k = szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k];

    if(nr_bierki_k !== 0)
        zmien_ocene_usun(ruch_t.wiersz_k, ruch_t.kolumna_k);

    szachownica.ocena.tablice += wartosc_tabela(ruch_t.wiersz_k, ruch_t.kolumna_k, nr_bierki_p) - wartosc_tabela(ruch_t.wiersz_p, ruch_t.kolumna_p, nr_bierki_p);
    szachownica.ocena.tablice_koncowka += wartosc_tabela_konc(ruch_t.wiersz_k, ruch_t.kolumna_k, nr_bierki_p) - wartosc_tabela_konc(ruch_t.wiersz_p, ruch_t.kolumna_p, nr_bierki_p);
}

// zmienia ocene odpowiadajaca usunieciu bierki z danego pola
function zmien_ocene_usun(wiersz, kolumna)
{
    let nr_bierki = szachownica.pola[wiersz][kolumna];

    if(nr_bierki === 0)
        return;
    
    szachownica.ocena.material -= wartosci[nr_bierki];
    szachownica.faza_gry -= wartosci_faza_gry[nr_bierki];

    szachownica.ocena.tablice -= wartosc_tabela(wiersz, kolumna, nr_bierki);
    szachownica.ocena.tablice_koncowka -= wartosc_tabela_konc(wiersz, kolumna, nr_bierki);

    if(szachownica.faza_gry < 0)
        szachownica.faza_gry = 0;
}

// zwraca statyczna ocene pozycji na podstawie szachownica.ocena
function ocen_statycznie()
{
    return szachownica.ocena.material +
        (szachownica.ocena.faza_gry * szachownica.ocena.tablice +
            (70 - szachownica.ocena.faza_gry) * (szachownica.ocena.tablice_koncowka +
                30 / Math.max(Math.abs(szachownica.poz_krol_biale.wiersz - szachownica.poz_krol_czarne.wiersz),
                    Math.abs(szachownica.poz_krol_biale.kolumna - szachownica.poz_krol_czarne.kolumna)
                )))
            * 0.03;
}