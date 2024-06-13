# Vprasalnik

## Development server
- cd backend -> node server.js
- cd frontend -> ng serve -> Navigiraj do http://localhost:4200/admin oz. http://localhost:4200/sejaId/index

## Opombe
- Vprasanja morajo imeti id v1, v2, v2,... (poglej spodnji json primer vprasanja)
- Dovoljenje napredovanja se zdi bolj smiselno uporabiti pri npr. pregledu tock, navodilu (ko je le navodilo),
saj je potrebno osveziti stran po tem, ko administrator dovoli napredovanje na posameznem vprasanju.


JSON primer:
```json
{
  "vprasanja": [
    {
      "id": "v1",
      "navodilo": "Prosimo, vnesite vašo <b>šifro</b>.",
      "tip": "textbox",
      "dovoljenjeNapredovanja": false
    },
    {
      "navodilo": "Preberite vsako vprašanje pozorno, preden odgovorite.",
      "tip": "navodila"
    },
    {
      "id": "v2",
      "navodilo": "V kratkem eseju opišite, kako internet vpliva na izobraževanje.",
      "tip": "textarea"
    },
    {
      "id": "v3",
      "navodilo": "Kateri izmed spodaj navedenih je glavni vzrok globalnega segrevanja?",
      "tip": "radiobutton",
      "dovoljenjeNapredovanja": false,
      "odgovori": [
        {
          "id": "3a",
          "zapis": "Emisije iz fosilnih goriv",
          "tocke": 5
        },
        {
          "id": "3b",
          "zapis": "Deforestacija",
          "tocke": 3
        },
        {
          "id": "3c",
          "zapis": "Sončna aktivnost",
          "tocke": 0
        }
      ]
    },
    {
      "navodilo": "Trenutno število vaših točk.",
      "tip": "tocke",
      "dovoljenjeNapredovanja": false
    },
    {
      "id": "v4",
      "navodilo": "Izberite dejavnosti, ki pripomorejo k zmanjšanju ogljičnega odtisa.",
      "tip": "checkbox",
      "dovoljenjeNapredovanja": false,
      "odgovori": [
        {
          "id": "4a",
          "zapis": "Uporaba <i>javnega</i> prevoza",
          "tocke": 2
        },
        {
          "id": "4b",
          "zapis": "Zmanjšanje porabe mesa",
          "tocke": 2
        },
        {
          "id": "4c",
          "zapis": "Recikliranje odpadkov",
          "tocke": 1
        },
        {
          "id": "4d",
          "zapis": "Kupovanje lokalno pridelane hrane",
          "tocke": 2
        }
      ]
    }
  ]
}
```
