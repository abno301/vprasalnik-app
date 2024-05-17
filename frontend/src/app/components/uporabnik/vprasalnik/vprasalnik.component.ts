import {Component, OnInit} from '@angular/core';
import {UporabnikService} from "../../../services/uporabnik.service";
import {Odgovor, PodanOdgovor, Rezultat, TipVprasanja, Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {CommonModule} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Seja} from "../../../models/admin.model";

@Component({
  selector: 'app-vprasalnik',
  standalone: true,
  providers: [],
  templateUrl: './vprasalnik.component.html',
  imports: [
    CommonModule
  ],
  styleUrl: './vprasalnik.component.css'
})
export class VprasalnikComponent implements OnInit {

  loading: boolean = false;
  dovoljenjeNapredovanja: boolean = true;
  trenutnaSeja: Seja;
  jeAktivnaSeja: boolean = false;
  jeZadnjeVprasanje: boolean = false;
  jeKonec: boolean = false;

  vprasanja: Vprasanje[];
  trenutnoVprasanje: Vprasanje;
  podaniOdgovori: PodanOdgovor[] = [];
  odgovori: Odgovor[] = [];
  steviloTock: number = 0;
  sifraUporabnika: string;

  radioButtonOdgovor: PodanOdgovor = new PodanOdgovor();

  constructor(private uporabnikService: UporabnikService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.route.paramMap.subscribe((source) => {
      this.uporabnikService.dobiSejo(Number(source.get('sejaId'))).subscribe({
        next: (result) => {
          let dobljenaSeja = result[0];
          if (dobljenaSeja.aktivnaSeja == dobljenaSeja.id) {
            this.jeAktivnaSeja = true;
          }
          this.trenutnaSeja = dobljenaSeja;
          this.vprasanja = dobljenaSeja.vprasanja;
          this.trenutnoVprasanje = this.vprasanja[0];
        },
        complete: () => this.loading = false
      });
    });
  }

  public naslednjeVprasanje(odgovor: string) {
    let odgovorDTO: Odgovor = {
      idVprasanja: this.trenutnoVprasanje.idVprasanje,
      odgovor: odgovor
    };

    // Preveri ce je radio button vprasanje
    if (Object.keys(this.radioButtonOdgovor).length) {
      this.steviloTock += this.radioButtonOdgovor.tocke;
      odgovorDTO.odgovor = this.radioButtonOdgovor.odgovor;
      this.radioButtonOdgovor = new PodanOdgovor();
    }

    // Preveri ce je checkbox vprasanje
    if (this.podaniOdgovori.length > 0) {
      let tocke = 0;
      let podaniOdgovoriString = "";
      this.podaniOdgovori.forEach(function (podanOdgovor) {
        tocke += podanOdgovor.tocke;
        podaniOdgovoriString += podanOdgovor.odgovor + ", "
      });
      odgovorDTO.odgovor = podaniOdgovoriString;
      this.podaniOdgovori = [];
      this.steviloTock += tocke;
    }

    // Dodaj odgovor/e
    if (this.trenutnoVprasanje.idVprasanje != null) {
      this.odgovori.push(odgovorDTO);
    }

    // Idi na naslednje vprasanje
    let trenutniIndex = this.vprasanja.findIndex(vprasanje => this.trenutnoVprasanje == vprasanje);
    let naslednjeVprasanje = this.vprasanja[trenutniIndex + 1];

    //TODO je hardcoded na vprasanje id v1
    if (this.trenutnoVprasanje.idVprasanje == "v1") {
      this.sifraUporabnika = odgovor;
    }

    if (naslednjeVprasanje) {
      this.trenutnoVprasanje = naslednjeVprasanje;

      let aktivnoVprasanjeDTO = {
        idUporabnika: this.sifraUporabnika,
        idVprasanje: this.trenutnoVprasanje.id
      }
      this.uporabnikService.aktivnoVprasanje(aktivnoVprasanjeDTO).subscribe({
        next: (_) => {
          console.log("Shranil kje je uporabnik v vprasalniku.")
        }
      });
      //TODO CONFIGURE SO IT WAITS WHEN ADMIN TURNS IT ON
      // if (naslednjeVprasanje.dovoljenjeNapredovanja != undefined) {
      //   console.log("Napredovanje se lahko spremeni!");
      //   this.dovoljenjeNapredovanja = naslednjeVprasanje.dovoljenjeNapredovanja;
      // }
    } else {
      this.jeZadnjeVprasanje = true;
    }
  }

  public checkBoxTicked(odgovor: PodanOdgovor) {
    let najdenOdgovorIndex = this.podaniOdgovori?.indexOf(odgovor);
    if (najdenOdgovorIndex && najdenOdgovorIndex > -1) {
      this.podaniOdgovori.splice(najdenOdgovorIndex, 1);
      return;
    }
    this.podaniOdgovori.push(odgovor);
  }

  public radioButtonSelected(odgovor: PodanOdgovor) {
    this.radioButtonOdgovor = odgovor;
  }

  public zakljuci() {
    let rezultat: Rezultat = {
      idUporabnika: this.sifraUporabnika,
      sejaId: this.trenutnaSeja.id,
      odgovori: this.odgovori
    }

    console.log(rezultat);
    this.uporabnikService.zakljuci(rezultat, this.trenutnaSeja.id).subscribe({
      next: (_) => {
        this.jeKonec = true;
      }
    });
  }

  protected readonly TipVprasanja = TipVprasanja;
}
