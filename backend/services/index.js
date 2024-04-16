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

module.exports = {dobiSejo}
