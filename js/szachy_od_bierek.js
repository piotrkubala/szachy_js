// funkcje te przyjmuja jako pierwszy argument zmienna typu bool okreslajaca czy sprawdzamy dla bialych
// kolejne 2 argumenty to pozycja krola, ktorego szachowanie sprawdzamy

// sprawdza "szach od krola" i hetmana w odleglosci 1 od krola
function czy_szach_od_krol_lub_hetman1(dla_bialych, k_wiersz, k_kolumna)
{
    let spr_numer1 = dla_bialych ? 7 : 1, spr_numer2 = dla_bialych ? 8 : 2;

    for(let i = -1; i <= 1; i++)
    {
        for(let j = -1; j <= 1; j++)
        {
            let nr_bierki = nr_bierki_na_poz(k_wiersz + i, k_kolumna + j);

            if(nr_bierki === spr_numer1 || nr_bierki === spr_numer2)
                return true;
        }
    }

    return false;
}

// sprawdza szach od piona
function czy_szach_od_pion(dla_bialych, k_wiersz, k_kolumna)
{
    if(dla_bialych)
    {
        if(nr_bierki_na_poz(k_wiersz + 1, k_kolumna - 1) === 12 || nr_bierki_na_poz(k_wiersz + 1, k_kolumna + 1) === 12)
            return true;
    }
    else
    {
        if(nr_bierki_na_poz(k_wiersz - 1, k_kolumna - 1) === 6 || nr_bierki_na_poz(k_wiersz - 1, k_kolumna + 1) === 6)
            return true;
    }

    return false;
}

// sprawdza szach od gonca i hetmana po przekatnej
function czy_szach_od_goniec_lub_hetman(dla_bialych, k_wiersz, k_kolumna)
{
    let nr_spr1 = dla_bialych ? 8 : 2, nr_spr2 = dla_bialych ? 10 : 4;

    let d_wiersz = 1, d_kol = 1;
    
    for(let i = 0; i < 4; i++)
    {
        let wiersz = k_wiersz + d_wiersz, kolumna = k_kolumna + d_kol, nr_bierki, kopia;

        while(nr_bierki_na_poz(wiersz, kolumna) === 0)
        {
            wiersz += d_wiersz;
            kolumna += d_kol;
        }

        nr_bierki = nr_bierki_na_poz(wiersz, kolumna);

        if(nr_bierki === nr_spr1 || nr_bierki === nr_spr2)
            return true;

        kopia = -d_kol;
        d_kol = d_wiersz;
        d_wiersz = kopia;
    }

    return false;
}

// sprawdza szach od wiezy i hetmana wzdluz wiersza/kolumny
function czy_szach_od_wieza_lub_hetman(dla_bialych, k_wiersz, k_kolumna)
{
    let nr_spr1 = dla_bialych ? 8 : 2, nr_spr2 = dla_bialych ? 9 : 3;

    let d_wiersz = 1, d_kol = 0;
    
    for(let i = 0; i < 4; i++)
    {
        let wiersz = k_wiersz + d_wiersz, kolumna = k_kolumna + d_kol, nr_bierki, kopia;

        while(nr_bierki_na_poz(wiersz, kolumna) === 0)
        {
            wiersz += d_wiersz;
            kolumna += d_kol;
        }

        nr_bierki = nr_bierki_na_poz(wiersz, kolumna);

        if(nr_bierki === nr_spr1 || nr_bierki === nr_spr2)
            return true;

        kopia = -d_kol;
        d_kol = d_wiersz;
        d_wiersz = kopia;
    }

    return false;
}

// sprawdza szach od skoczka
function czy_szach_od_skoczek(dla_bialych, k_wiersz, k_kolumna)
{
    let nr_spr = dla_bialych ? 11 : 5;

    let d_wiersz = 1, d_kol = 2, kopia;

    for(let i = 0; i < 2; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            if(nr_bierki_na_poz(k_wiersz + d_wiersz, k_kolumna + d_kol) === nr_spr)
                return true;

            kopia = -d_kol;
            d_kol = d_wiersz;
            d_wiersz = kopia;
        }

        d_wiersz = -1;
        d_kol = 2;
    }

    return false;
}