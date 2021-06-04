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

// rysuje lub usuwa obramowanie pola, z ktorego zostala zabrana bierka
function zaznacz_pole_z_zabrana()
{
    let pole = document.getElementById("pole" + wzieta.y + wzieta.x);

    if(wzieta.czy)
        pole.src = folder_szachownica + (((wzieta.x + wzieta.y) % 2 == 0) ? "black_taken.png" : "white_taken.png");
    else
        pole.src = folder_szachownica + (((wzieta.x + wzieta.y) % 2 == 0) ? "black.png" : "white.png");
}

// zwraca kod HTML jednego diva pola szachownicy na podstawie jego wspolrzednych i szerokosci pola w pikselach
function dodaj_jedno_pole(szerokosc_zdj, i, j)
{
    let html_pola = "<div class=\"pole\" id=\"pole_div" + i + j + "\" width=\"" + szerokosc_zdj + "px\"><img class=\"pole_zdj\" id=\"pole" + i + j + "\" width=\"" + szerokosc_zdj + "px\" src=\"" + folder_szachownica;
    if((i + j) % 2 === 0)
        html_pola += "black.png";
    else
        html_pola += "white.png";
    html_pola += "\"/></div>"

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

    zaznacz_pole_z_zabrana();
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

    zaznacz_pole_z_zabrana();
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