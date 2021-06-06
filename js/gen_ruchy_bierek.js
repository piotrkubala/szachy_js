// dla danego numeru zbijanej bierki, okresla czy moze byc zbita przez gracza okreslonego przez czy_biale
function czy_moze_zbic(czy_biale, nr_bierki)
{
    if(szachownica.biale_ruch)
        return nr_bierki <= 12 && nr_bierki >= 7;
    
    return nr_bierki <= 6 && nr_bierki >= 1;
}

// jako argument przyjmuje obiekt ruchu i czy_biale
// sprawdza czy ruch nie jest mozliwy ze wzgledu na szacha
function czy_mozna_obecny_ruch(ruch_t, czy_biale)
{
    let nr_bierki = szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k];

    szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] = szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p];
    szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] = 0;

    let mozna = !czy_szach(czy_biale);

    szachownica.pola[ruch_t.wiersz_p][ruch_t.kolumna_p] = szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k];
    szachownica.pola[ruch_t.wiersz_k][ruch_t.kolumna_k] = nr_bierki;

    return mozna;
}

/*
    funkcje generujace ruchy bierek przyjmuja argumenty:
    czy_biale - okresla, kto ma ruch, true - biale
    ruchy - obiekt przechowujacy ruchy, ma 2 pola: zbicia i ruchy typu Array, dopisywane do niego sa dostepne ruchy
    wiersz, kolumna - wspolrzedne bierki, ktorej ruchy generujemy
*/

// zrobic jeszcze roszade!!!
// generuje ruchy dla krola
function generuj_ruch_krol(czy_biale, ruchy, wiersz, kolumna)
{
    let nr_bierki;

    for(let i = -1; i <= 1; i++)
    {
        for(let j = -1; j <= 1; j++)
        {
            if(i === 0 && j === 0)
                continue;

            nr_bierki = nr_bierki_na_poz(wiersz + i, kolumna + j);

            if(nr_bierki === 0 || czy_moze_zbic(czy_biale, nr_bierki))
            {
                // jezeli nie bedzie szacha, to moze zbic te bierke

                // sprawdzanie czy nie bedzie mozna "zbic krola"
                szachownica.pola[wiersz + i][kolumna + j] = szachownica.pola[wiersz][kolumna];
                szachownica.pola[wiersz][kolumna] = 0;
                
                if(czy_biale)
                {
                    szachownica.poz_krol_biale.wiersz = wiersz + i;
                    szachownica.poz_krol_biale.kolumna = kolumna + j;
                }
                else
                {
                    szachownica.poz_krol_czarne.wiersz = wiersz + i;
                    szachownica.poz_krol_czarne.kolumna = kolumna + j;
                }

                if(!czy_szach(czy_biale))
                {
                    if(nr_bierki === 0)
                        ruchy.ruchy.push({wiersz_p: wiersz, kolumna_p: kolumna, wiersz_k: wiersz + i, kolumna_k: kolumna + j});
                    else
                        ruchy.zbicia.push({wiersz_p: wiersz, kolumna_p: kolumna, wiersz_k: wiersz + i, kolumna_k: kolumna + j});
                }

                szachownica.pola[wiersz][kolumna] = szachownica.pola[wiersz + i][kolumna + j];
                szachownica.pola[wiersz + i][kolumna + j] = nr_bierki;

                if(czy_biale)
                {
                    szachownica.poz_krol_biale.wiersz = wiersz;
                    szachownica.poz_krol_biale.kolumna = kolumna;
                }
                else
                {
                    szachownica.poz_krol_czarne.wiersz = wiersz;
                    szachownica.poz_krol_czarne.kolumna = kolumna;
                }
            }
        }
    }
}

function generuj_ruch_hetman(czy_biale, ruchy, wiersz, kolumna)
{
    generuj_ruch_wieza(czy_biale, ruchy, wiersz, kolumna);
    generuj_ruch_goniec(czy_biale, ruchy, wiersz, kolumna);
}

function generuj_ruch_wieza(czy_biale, ruchy, wiersz, kolumna)
{
    let nr_bierki;

    let d_wiersz = 0, d_kol = 1;
    let w, k;

    for(let i = 0; i < 4; i++)
    {
        w = wiersz + d_wiersz;
        k = kolumna + d_kol;

        while(nr_bierki_na_poz(w, k) === 0)
        {
            let ruch_t =
            {
                wiersz_p: wiersz,
                kolumna_p: kolumna,
                wiersz_k: w,
                kolumna_k: k
            };

            if(czy_mozna_obecny_ruch(ruch_t, czy_biale))
                ruchy.ruchy.push(ruch_t);

            w += d_wiersz;
            k += d_kol;
        }

        nr_bierki = nr_bierki_na_poz(w, k);

        if(czy_moze_zbic(czy_biale, nr_bierki))
        {
            let ruch_t = {wiersz_p: wiersz, kolumna_p: kolumna, wiersz_k: w, kolumna_k: k};
            
            if(czy_mozna_obecny_ruch(ruch_t, czy_biale))
                ruchy.zbicia.push(ruch_t);
        }

        // obrot wektora o 90st
        let kopia = -d_wiersz;
        d_wiersz = d_kol;
        d_kol = kopia;
    }
}

function generuj_ruch_goniec(czy_biale, ruchy, wiersz, kolumna)
{
    let nr_bierki;

    let d_wiersz = 1, d_kol = 1;
    let w, k;

    for(let i = 0; i < 4; i++)
    {
        w = wiersz + d_wiersz;
        k = kolumna + d_kol;

        while(nr_bierki_na_poz(w, k) === 0)
        {
            let ruch_t =
            {
                wiersz_p: wiersz,
                kolumna_p: kolumna,
                wiersz_k: w,
                kolumna_k: k
            };

            if(czy_mozna_obecny_ruch(ruch_t, czy_biale))
                ruchy.ruchy.push(ruch_t);

            w += d_wiersz;
            k += d_kol;
        }

        nr_bierki = nr_bierki_na_poz(w, k);

        if(czy_moze_zbic(czy_biale, nr_bierki))
        {
            let ruch_t = {wiersz_p: wiersz, kolumna_p: kolumna, wiersz_k: w, kolumna_k: k};
            
            if(czy_mozna_obecny_ruch(ruch_t, czy_biale))
                ruchy.zbicia.push(ruch_t);
        }

        // obrot wektora o 90st
        let kopia = -d_wiersz;
        d_wiersz = d_kol;
        d_kol = kopia;
    }
}

function generuj_ruch_skoczek(czy_biale, ruchy, wiersz, kolumna)
{
}

function generuj_ruch_pion(czy_biale, ruchy, wiersz, kolumna)
{
}