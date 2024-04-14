import {Component, OnInit} from '@angular/core';
import {UporabnikService} from "../../../services/uporabnik.service";
import {PodanOdgovor, TipVprasanja, Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {concatMap, of, switchMap} from "rxjs";
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
  // @ts-ignore
  trenutnaSeja: Seja;

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
      this.uporabnikService.dobiSejo(Number(source.get('sejaId'))).subscribe(value => {
        this.trenutnaSeja = value;
        // console.log(this.trenutnaSeja);
      })
    });

    this.uporabnikService.getNavodila().subscribe({
      next: (vprasanjaObject: Vprasanja) => {
        this.vprasanja = vprasanjaObject.vprasanja;

        this.trenutnoVprasanje = vprasanjaObject.vprasanja[0];
      },
      complete: () => this.loading = false
    });
  }

  public naslednjeVprasanje(odgovor: string) {
    // console.log(this.trenutniOdgovori);

    let tocke = 0;
    if (this.trenutnoVprasanje.odgovori) {
      this.trenutniOdgovori.forEach(function (podanOdgovor) {
        tocke += podanOdgovor.tocke;
      });
    }
    this.steviloTock += tocke;

    let trenutniIndex = this.vprasanja.findIndex(vprasanje => this.trenutnoVprasanje == vprasanje);
    let naslednjeVprasanje = this.vprasanja[trenutniIndex + 1];

    //TODO je hardcoded na vprasanje id v1
    if (this.trenutnoVprasanje.id == "v1") {
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
