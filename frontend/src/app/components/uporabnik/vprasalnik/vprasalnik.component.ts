import {Component, OnInit} from '@angular/core';
import {UporabnikService} from "../../../services/uporabnik.service";
import {PodanOdgovor, TipVprasanja, Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
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

  vprasanja: Vprasanje[];
  trenutnoVprasanje: Vprasanje;
  trenutniOdgovori: PodanOdgovor[] = [];
  steviloTock: number = 0;
  sifraUporabnika: string;

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
    console.log(this.trenutniOdgovori);
    // 1. Konfiguriraj tocke za prejsnjo vprasanje
    let tocke = 0;
    if (this.trenutnoVprasanje.podaniOdgovori) {
      this.trenutniOdgovori.forEach(function (podanOdgovor) {
        tocke += podanOdgovor.tocke;
      });
    }
    this.steviloTock += tocke;

    let trenutniIndex = this.vprasanja.findIndex(vprasanje => this.trenutnoVprasanje == vprasanje);
    let naslednjeVprasanje = this.vprasanja[trenutniIndex + 1];

    //TODO je hardcoded na vprasanje id v1
    if (this.trenutnoVprasanje.idVprasanje == "v1") {
      this.sifraUporabnika = odgovor;
    }
    if (naslednjeVprasanje) {
      this.trenutnoVprasanje = naslednjeVprasanje;

      //TODO CONFIGURE SO IT WAITS WHEN ADMIN TURNS IT ON
      // if (naslednjeVprasanje.dovoljenjeNapredovanja != undefined) {
      //   console.log("Napredovanje se lahko spremeni!");
      //   this.dovoljenjeNapredovanja = naslednjeVprasanje.dovoljenjeNapredovanja;
      // }
    }

  }

  public checkBoxTicked(odgovor: PodanOdgovor) {
    let najdenOdgovorIndex = this.trenutniOdgovori?.indexOf(odgovor);
    if (najdenOdgovorIndex && najdenOdgovorIndex > -1) {
      this.trenutniOdgovori.splice(najdenOdgovorIndex, 1);
      return;
    }
    this.trenutniOdgovori.push(odgovor);
  }

  protected readonly TipVprasanja = TipVprasanja;
}
