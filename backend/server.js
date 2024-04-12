const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({message: "Dobrodosli v Plohl app."});
});

app.get("/admin.html", (req, res) => {
    res.send("Dobrodosli admin!")
});

app.post("/seja", (req, res) => {
    const vprasanja = req.body.vprasanja.map(vprasanje => {
        const podaniOdgovori = vprasanje.podaniOdgovori ?
            vprasanje.podaniOdgovori.map(odgovor =>
                new PodanOdgovor(odgovor.id, odgovor.idOdgovor, odgovor.odgovor, odgovor.tocke)
            ) : [];
        return new Vprasanje(vprasanje.id, vprasanje.idVprasanje, vprasanje.navodilo, vprasanje.tip, vprasanje.dovoljenjeNapredovanja, podaniOdgovori);
    });

    const seja = new Seja(req.body.id, "test", "1.1.2024", vprasanja, {});
    console.log(seja);

    res.send(req.body);
});

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

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
