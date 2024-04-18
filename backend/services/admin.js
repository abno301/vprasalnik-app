const db = require('./db');

async function ustvariSejo(novaSeja) {
    console.log(novaSeja.naziv);
    const result = await db.query(
        `INSERT INTO seja
            (datum, naziv)
            VALUES
            (?, ?)`,
        [novaSeja.datum, novaSeja.naziv]
    );

    let message = "Error med kreiranjem nove seje.";

    if (result.affectedRows) {
        message = result.insertId;
    }

    for (const vprasanje of novaSeja.vprasanja) {
       await ustvariVprasanje(result.insertId, vprasanje);
    }

    await posodobiAktivnoSejo(result.insertId);

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

async function dobiAktivnoSejo() {
    const result = await db.query(
        `SELECT * FROM aktivnaseja`
    );

    let rezultat;
    if (result.length <= 0) {
        return null;
    } else {
        rezultat = await db.query(
            `SELECT * FROM seja WHERE id=${result[0].sejaId}`
        );

        return {
            id: rezultat[0].id,
            datum: rezultat[0].datum,
            naziv: rezultat[0].naziv,
        }
    }
}

async function posodobiAktivnoSejo(sejaId) {
    const result = await db.query(
        `SELECT * FROM aktivnaseja`
    );

    let rezultat;
    if (result.length <= 0) {
        rezultat = await db.query(
          `INSERT INTO aktivnaseja (sejaId) VALUES (${sejaId})`
        );
    } else {
        rezultat = await db.query(
            `UPDATE aktivnaseja SET sejaId=${sejaId} WHERE sejaId=${result[0].sejaId}`
        )
    }
    console.log("Aktivna seja je seja z id-jem: " + sejaId);

}

async function zbrisiAktivnoSejo() {

    const result = await db.query(
        `DELETE FROM aktivnaseja`
    );

    let message = "Error med zakljucevanjem aktivne seje.";

    if (result.affectedRows) {
        message = "Aktivna seja zakljucena.";
    }

    return message;

}


module.exports = {
    ustvariSejo,
    dobiAktivnoSejo,
    zbrisiAktivnoSejo
}
