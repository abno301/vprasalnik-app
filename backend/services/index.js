const db = require('./db');

async function dobiSejo(sejaId) {
    try {
        const resultSeja = await db.query(
        `SELECT * from seja
            WHERE seja.id = ${sejaId}`
        );
        // Dobim vprasanja seje
        let resultVprasanje = await db.query(
            `SELECT * from vprasanje
                WHERE vprasanje.Seja_idSeja = ${sejaId}`
        );

        let seja = JSON.parse(JSON.stringify(resultSeja));
        let vprasanjaJSON = JSON.parse(JSON.stringify(resultVprasanje));

        let vprasanja = [];
        for (const vprasanjaElement of vprasanjaJSON) {
            const resultOdgovori = await db.query(
                `SELECT * from podanodgovor
                    WHERE podanodgovor.Vprasanje_idVprasanje = ${vprasanjaElement.id}`
            );
            vprasanjaElement.podaniOdgovori = JSON.parse(JSON.stringify(resultOdgovori));
            vprasanja.push(vprasanjaElement);
        }

        seja.vprasanja = vprasanja;

        const jeAktivna = await db.query(
            `SELECT sejaId FROM aktivnaseja`
        );

        return seja.map(seja => {
            return {
                ...seja,
                aktivnaSeja: jeAktivna[0].sejaId,
                vprasanja: vprasanja
            }
        });
    } catch (err) {
        console.error(`Error med dobivanjem seje`, err.message);
    }
}

async function shraniRezultat(rezultat) {
    try {
        await db.query(
            `DELETE FROM aktivnavprasanja WHERE aktivnavprasanja.idUporabnik = ?`,
            [rezultat.idUporabnika]
        );

        const resultRezultat = await db.query(
        `INSERT INTO rezultat
            (uporabnikId, Seja_idSeja)
            VALUES (?, ?)`,
            [rezultat.idUporabnika, rezultat.sejaId]
        );

        let odgovori = rezultat.odgovori;
        for (const odgovor of odgovori) {
            let resultOdgovor = await db.query(`INSERT INTO odgovor
               (odgovor, idVprasanje, Rezultat_idRezultat)
                VALUES (?, ?, ?)`,
                [odgovor.odgovor, odgovor.idVprasanja, resultRezultat.insertId]
            );
        }


    } catch (err) {
        console.error(`Error med shranjevanjem rezultata`, err.message);
    }
}

async function shraniAktivnoVprasanje(req) {
    try {
        if (req.idUporabnika && req.idVprasanje) {
            const getCurrentVprasanje = await db.query(
                `SELECT * FROM aktivnavprasanja WHERE aktivnavprasanja.idUporabnik = ?`,
                [req.idUporabnika]
            );

            if (getCurrentVprasanje.length > 0) {
                await db.query(
                    `DELETE FROM aktivnavprasanja WHERE aktivnavprasanja.idUporabnik = ?`,
                    [req.idUporabnika]
                );
            }

            await db.query(
                `INSERT INTO aktivnavprasanja
                (idUporabnik, idVprasanje)
                VALUES (?, ?)`,
                [req.idUporabnika, req.idVprasanje]
            );
        } else {
            console.log("Neveljavni podatki za shranjevanje aktivnega vprašanja.");
        }

    } catch (err) {
        console.error(`Error med shranjevanjem aktivnega vprasanja`, err.message);
    }
}


module.exports = {dobiSejo, shraniRezultat, shraniAktivnoVprasanje}
