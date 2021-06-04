const folder_bierki = "data/img/default_pieces/";

/*
    Oznaczenia bierek w tablicach okreslajacych pozycje:
    Biale:
    0 - krol
    1 - hetman
    2 - wieza
    3 - goniec
    4 - skoczek
    5 - pion

    Czarne
    6 - krol
    7 - hetman
    8 - wieza
    9 - goniec
    10 - skoczek
    11 - pion
*/

// zwraca sciezke do pliku z obrazkiem bierki
function numer_na_sciezke(nr)
{
    let nazwa = "";

    switch(nr)
    {
        case 0:
            nazwa = "kw";
            break;
        case 1:
            nazwa = "qw";
            break;
        case 2:
            nazwa = "rw";
            break;
        case 3:
            nazwa = "bw";
            break;
        case 4:
            nazwa = "nw";
            break;
        case 5:
            nazwa = "pw";
            break;
        case 6:
            nazwa = "kb";
            break;
        case 7:
            nazwa = "qb";
            break;
        case 8:
            nazwa = "rb";
            break;
        case 9:
            nazwa = "bb";
            break;
        case 10:
            nazwa = "nb";
            break;
        case 11:
            nazwa = "pb";
            break;
    }
    return folder_bierki + nazwa + ".svg";
}