const folder_szachownica = "data/img/default_board/";

// rysuje szachownice, jako argument strona: 0 - biale, 1 - czarne, drugi argument okresla czy rysowac wspolrzedne
function rysuj_szachownica(strona, czy_rysowac_wspolrzedne)
{
    if(czy_rysowac_wspolrzedne)
        wlacz_wspolrzedne(strona);
    else
        wylacz_wspolrzedne();

    if(strona === 0)
        przyg_szach_biale();
    else
        przyg_szach_czarne();
}

// w divie wynik_gry zapisuje wynik obecnej gry na podstawie argumentu:
// 0 - pusty, 1 - wygrana bialych, 2 - wygrana czarnych, 3 - remis
function napisz_wynik(wynik)
{
    let div_t = document.getElementById("wynik_gry");

    switch(wynik)
    {
        case 0:
            div_t.innerText = "";
            break;
        case 1:
            div_t.innerText = "Koniec gry - białe wygrały";
            break;
        case 2:
            div_t.innerText = "Koniec gry - czarne wygrały";
            break;
        case 3:
            div_t.innerText = "Koniec gry - remis";
            break;
    }
}

// uzupelnia div promowanie_piona
// pierwszy argument okresla, czy tylko wyczyscic div, drugi okresla strone
// kolejne okreslaja polozenie promowanego piona
function przygotoj_wybor_promocji(wyczysc, czy_biale, wiersz, kolumna)
{
    let nr_bierki, sciezka, div_t = document.getElementById("promowanie_piona");

    div_t.innerHTML = "";
    if(wyczysc)
        return;

    for(let i = 0; i < 4; i++)
    {
        nr_bierki = i + (czy_biale ? 2 : 8);

        sciezka = numer_na_sciezke(nr_bierki);

        div_t.innerHTML += "<img class=\"wybor_promocja_bierka\" src=\"" + sciezka + "\" onclick=\"promowanie_gracz(" + nr_bierki + ", " + wiersz + ", " + kolumna + ")\">";
    }
}

// zwraca kod HTML jednego diva pola szachownicy na podstawie jego wspolrzednych i szerokosci pola w pikselach
function dodaj_jedno_pole(szerokosc_zdj, i, j)
{
    let czy_to_pole_wz = (wzieta.czy && wzieta.wiersz === i && wzieta.kolumna === j);

    let html_pola = "<div class=\"pole\" onclick=\"wez_lub_przesun_bierke(" + i + ", " + j + ")\" ";
    html_pola += "id=\"pole_div" + i + j + "\" width=\"" + szerokosc_zdj + "px\"><img class=\"pole_zdj\" id=\"pole" + i + j + "\" width=\"" + szerokosc_zdj + "px\" src=\"" + folder_szachownica;
    if((i + j) % 2 === 0)
        html_pola += "black";
    else
        html_pola += "white";
    
    if(czy_to_pole_wz)
        html_pola += "_taken";
    else if(wzieta.czy && dostepne[i][j])
    {
        if(szachownica.pola[i][j] === 0)
        {
            // puste pole, na ktore mozna sie przemiescic
            html_pola += "_can_move";
        }
        else
        {
            // mozna zbic bierke na tym polu
            html_pola += "_can_take";
        }
    }

    html_pola += ".png\"/>";

    if(szachownica.pola[i][j] !== 0)
    {
        // rysowanie obrazka bierki
        let sciezka = numer_na_sciezke(szachownica.pola[i][j]);

        html_pola += "<img class=\"bierka_zdj\" width=\"" + szerokosc_zdj + "px\" src=\"" + sciezka + "\"";
        html_pola += "style=\"margin-left: -" + szerokosc_zdj + "px\"/>";
    }

    html_pola += "</div>"

    return html_pola;
}

// przygotowuje szachownice od strony bialych
// opis id pola: najpierw nr wiersza, pozniej nr kolumny
function przyg_szach_biale()
{
    let szach = document.getElementById("szachownica");
    let szer_zdj = Math.floor(szach.offsetWidth / 8);

    let zawartosc = "";

    for(let i = 7; i >= 0; i--)
        for(let j = 0; j < 8; j++)
            zawartosc += dodaj_jedno_pole(szer_zdj, i, j);
    
    szach.innerHTML = zawartosc;
}

// przygotowuje szachownice od strony czarnych
// opis id pola: najpierw nr wiersza, pozniej nr kolumny
function przyg_szach_czarne()
{
    let szach = document.getElementById("szachownica");
    let szer_zdj = Math.floor(szach.offsetWidth / 8);

    let zawartosc = "";

    for(let i = 0; i < 8; i++)
        for(let j = 7; j >= 0; j--)
            zawartosc += dodaj_jedno_pole(szer_zdj, i, j);
    
    szach.innerHTML = zawartosc;
}

// rysuje wspolrzedne, argumentem jest 0, jezeli od bialych i 1 jezeli od czarnych
function wlacz_wspolrzedne(strona)
{
    let szach = document.getElementById("szachownica");
    let wys = Math.floor(szach.offsetWidth / 8);

    let wsp_y_div = document.getElementById("wspolrzedne_y");
    let wsp_x_div = document.getElementById("wspolrzedne_x");

    let zawartosc_y = "", zawartosc_x = "";

    let poczatek_y = "<div class=\"wspolrzedna_y\" style=\"height: " + wys + "px\">";
    let poczatek_x = "<div class=\"wspolrzedna_x\" style=\"width: " + wys + "px\">";

    if(strona == 0)
    {
        for(let i = 8; i > 0; i--)
        {
            zawartosc_x += poczatek_x + String.fromCharCode(73 - i) + "</div>";
            zawartosc_y += poczatek_y + i + "</div>";
        }
    }
    else
    {
        for(let i = 1; i <= 8; i++)
        {
            zawartosc_x += poczatek_x + String.fromCharCode(73 - i) + "</div>";
            zawartosc_y += poczatek_y + i + "</div>";
        }
    }

    wsp_x_div.innerHTML = zawartosc_x;
    wsp_y_div.innerHTML = zawartosc_y;
}

// wylacza wyswietlanie wspolrzednych pol
function wylacz_wspolrzedne()
{
    document.getElementById("wspolrzedne_x").innerHTML = "";
    document.getElementById("wspolrzedne_y").innerHTML = "";
}