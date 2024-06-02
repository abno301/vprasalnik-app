const db = require('./db');

async function dobiSeje() {

    const resultSeja = await db.query(
        `SELECT * from seja`
    );

    let seje = [];

    for (const seja of resultSeja) {

        let resultRezultat = await db.query(
            `SELECT id, uporabnikId from rezultat WHERE rezultat.Seja_idSeja = ${seja.id}`
        );

        let rezultatiSeje = []
        for (const rezultat of resultRezultat) {

            let resultOdgovori = await db.query(
                `SELECT id, odgovor, idVprasanje FROM odgovor
                    WHERE odgovor.Rezultat_idRezultat = ${rezultat.id}`
            );

            let odgovori = []
            for (const odgovor of resultOdgovori) {
                odgovori.push({
                    idOdgovor: odgovor.id,
                    odgovor: odgovor.odgovor,
                    idVprasanja: odgovor.idVprasanje
                });
            }

            rezultatiSeje.push({
                rezultatId: rezultat.id,
                uporabnikId: rezultat.uporabnikId,
                odgovori: odgovori
            });

        }

        seje.push({
            id: seja.id,
            datum: seja.datum,
            naziv: seja.naziv,
            rezultati: rezultatiSeje
        });
    }

    return seje;
}

async function ustvariSejo(novaSeja) {
    console.log("Nova seja: " + novaSeja.naziv);
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

        let rezultatVprasanje = await db.query(
            `SELECT * from vprasanje
                WHERE vprasanje.Seja_idSeja = ${result[0].sejaId}`
        );

        let vprasanja = JSON.parse(JSON.stringify(rezultatVprasanje));

        return {
            id: rezultat[0].id,
            datum: rezultat[0].datum,
            naziv: rezultat[0].naziv,
            vprasanja: vprasanja
        }
    }
}

async function posodobiAktivnoSejo(sejaId) {
    const result = await db.query(
        `SELECT * FROM aktivnaseja`
    );

    if (result.length <= 0) {
        await db.query(
            `INSERT INTO aktivnaseja (sejaId) VALUES (${sejaId})`
        );
    } else {
        await db.query(
            `UPDATE aktivnaseja SET sejaId=${sejaId} WHERE sejaId=${result[0].sejaId}`
        );
        await db.query(
            `DELETE FROM aktivnavprasanja`
        );
    }
    console.log("Aktivna seja je seja z id-jem: " + sejaId);
}

async function zbrisiAktivnoSejo() {

    const resultSeja = await db.query(
        `DELETE FROM aktivnaseja`
    );

    const resultVprasanja = await db.query(
        `DELETE FROM aktivnavprasanja`
    );

    let message = "Error med zakljucevanjem aktivne seje.";

    if (resultSeja.affectedRows) {
        message = "Aktivna seja zakljucena.";
    }

    return message;
}

async function dobiAktivnaVprasanja() {

    return await db.query(
        `SELECT * FROM aktivnavprasanja`
    );
}



module.exports = {
    ustvariSejo,
    dobiAktivnoSejo,
    zbrisiAktivnoSejo,
    dobiSeje,
    dobiAktivnaVprasanja
}
