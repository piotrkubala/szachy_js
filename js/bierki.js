const folder_bierki = "data/img/default_pieces/";

// okresla czy obecnie jedna z bierek jest trzymana przez gracza i z jakiego pola zostala wzieta
let wzieta = 
{
    x: 0,
    y: 0,
    czy: false
};

/*
    Oznaczenia bierek w tablicach okreslajacych pozycje:
    0 - pole puste

    Biale:
    1 - krol
    2 - hetman
    3 - wieza
    4 - goniec
    5 - skoczek
    6 - pion

    Czarne
    7 - krol
    8 - hetman
    9 - wieza
    10 - goniec
    11 - skoczek
    12 - pion
*/

// zwraca sciezke do pliku z obrazkiem bierki
function numer_na_sciezke(nr)
{
    let nazwa = "";

    if(nr === 0)
        return nazwa;

    switch(nr)
    {
        case 1:
            nazwa = "kw";
            break;
        case 2:
            nazwa = "qw";
            break;
        case 3:
            nazwa = "rw";
            break;
        case 4:
            nazwa = "bw";
            break;
        case 5:
            nazwa = "nw";
            break;
        case 6:
            nazwa = "pw";
            break;
        case 7:
            nazwa = "kb";
            break;
        case 8:
            nazwa = "qb";
            break;
        case 9:
            nazwa = "rb";
            break;
        case 10:
            nazwa = "bb";
            break;
        case 11:
            nazwa = "nb";
            break;
        case 12:
            nazwa = "pb";
            break;
    }
    return folder_bierki + nazwa + ".svg";
}

// konwertuje kod FEN bierki na numer od 1 do 12, jezeli jest niepoprawny, to zwraca 0
function kod_FEN_na_nr_bierki(kod)
{
    if(kod === "K")
        return 1;
    if(kod === "Q")
        return 2;
    if(kod === "R")
        return 3;
    if(kod === "B")
        return 4;
    if(kod === "N")
        return 5;
    if(kod === "P")
        return 6;
    if(kod === "k")
        return 7;
    if(kod === "q")
        return 8;
    if(kod === "r")
        return 9;
    if(kod === "b")
        return 10;
    if(kod === "n")
        return 11;
    if(kod === "p")
        return 12;
    return 0;
}