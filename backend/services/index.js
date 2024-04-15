const db = require('./db');

async function dobiSejo(sejaId) {
    try {
        const result = await db.query(
            `SELECT 
                seja.id AS seja_id, 
                seja.datum AS seja_datum, 
                seja.naziv AS seja_naziv, 
                CONCAT('[', GROUP_CONCAT(
                    JSON_OBJECT('idVprasanje', vprasanje.idVprasanje, 'navodilo', vprasanje.navodilo, 'tip', vprasanje.tip, 'dovoljenjeNapredovanja', vprasanje.dovoljenjeNapredovanja)
                ), ']') AS vprasanja
                FROM 
                    seja 
                LEFT JOIN 
                    vprasanje ON seja.id = vprasanje.Seja_idSeja
                WHERE 
                    seja.id = ${sejaId}
                GROUP BY 
                    seja.id`
        );

        const jeAktivna = await db.query(
            `SELECT sejaId FROM aktivnaseja`
        )

        console.log(jeAktivna);
        return {
            id: result[0].seja_id,
            datum: result[0].seja_datum,
            naziv: result[0].seja_naziv,
            vprasanja: JSON.parse(result[0].vprasanja),
            aktivnaSeja: jeAktivna[0].sejaId
        };
    } catch (err) {
        console.error(`Error med dobivanjem seje`, err.message);
    }
}

module.exports = {dobiSejo}
