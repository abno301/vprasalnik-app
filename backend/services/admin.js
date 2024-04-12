const db = require('./db');

async function ustvariSejo(novaSeja) {
    //TODO check if id exists
    const result = await db.query(
        `INSERT INTO seja
            (datum, naziv)
            VALUES
            ('test', 'testNaziv')`
    );

    let message = "Error med kreiranjem nove seje.";

    if (result.affectedRows) {
        message = "Nova seja uspesno kreirana!";
    }

    for (const vprasanje of novaSeja.vprasanja) {
       await ustvariVprasanje(result.insertId, vprasanje);
    }

    return message;
}

async function ustvariVprasanje(sejaId, vprasanje) {
    const dovoljenjeNapredovanja = vprasanje.dovoljenjeNapredovanja === undefined;

    const result = await db.query(
        `INSERT INTO vprasanje
            (idVprasanje, navodilo, tip, dovoljenjeNapredovanja, seja_idSeja)
            VALUES (?, ?, ?, ?, ?)`,
        [vprasanje.id || null, vprasanje.navodilo, vprasanje.tip, dovoljenjeNapredovanja, sejaId]
    );
    let message = "Error med dodajanjem vprasanja seje.";

    if (result.affectedRows) {
        message = "Vprasanje seje dodano!";
    }

    if (vprasanje.odgovori) {
        for (const odgovor of vprasanje.odgovori) {
            await ustvariPodanOdgovor(result.insertId, odgovor);
        }
    }

    // console.log(message);
}

async function ustvariPodanOdgovor(vprasanjeId, odgovor) {
    const result = await db.query(
        `INSERT INTO podanodgovor
            (idOdgovor, odgovor, tocke, Vprasanje_idVprasanje)
            VALUES (?, ?, ?, ?)`,
        [odgovor.id, odgovor.zapis, odgovor.tocke || null, vprasanjeId]
    );
    let message = "Error med dodajanjem moznega odgovora vprasanja.";

    if (result.affectedRows) {
        message = "Mozen odgovor vprasanja dodan!";
    }

    // console.log(message);
}

function Seja(id, naziv, datum, vprasanja, rezultati) {
    this.id = id;
    this.naziv = naziv;
    this.datum = datum;
    this.vprasanja = vprasanja;
    this.rezultati = rezultati;
}

function Rezultat(id, uporabnikId, odgovori) {
    this.id = id;
    this.uporabnikId = uporabnikId;
    this.odgovori = odgovori;
}

function PodanOdgovor(id, idOdgovor, odgovor, tocke) {
    this.id = id;
    this.idOdgovor = idOdgovor;
    this.odgovor = odgovor;
    this.tocke = tocke || 0;
}

function Vprasanje(id, idVprasanje, navodilo, tip, dovoljenjeNapredovanja, podaniOdgovori) {
    this.id = id;
    this.idVprasanje = idVprasanje || "";
    this.navodilo = navodilo;
    this.tip = tip;
    this.dovoljenjeNapredovanja = dovoljenjeNapredovanja || true;
    this.podaniOdgovori = podaniOdgovori || [];
}


module.exports = {
    ustvariSejo
}
