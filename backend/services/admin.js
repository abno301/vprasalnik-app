const db = require('./db');

async function ustvariSejo(novaSeja) {
    const vprasanja = novaSeja.vprasanja.map(vprasanje => {
        const podaniOdgovori = vprasanje.podaniOdgovori ?
            vprasanje.podaniOdgovori.map(odgovor =>
                new PodanOdgovor(odgovor.id, odgovor.idOdgovor, odgovor.odgovor, odgovor.tocke)
            ) : [];
        return new Vprasanje(vprasanje.id, vprasanje.idVprasanje, vprasanje.navodilo, vprasanje.tip, vprasanje.dovoljenjeNapredovanja, podaniOdgovori);
    });

    // const constSeja = new Seja(novaSeja.id, "test", "1.1.2024", vprasanja, {});

    const result = await db.query(
        `INSERT INTO seja
            (id, datum, naziv)
            VALUES
            (${novaSeja.id}, 'test', 'testNaziv')`
    );

    let message = "Error med kreiranjem nove seje.";

    if (result.affectedRows) {
        message = "Nova seja uspesno kreirana!";
    }

    return message;
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
