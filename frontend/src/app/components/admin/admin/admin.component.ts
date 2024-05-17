import {Component, OnInit} from '@angular/core';
import {Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {AktivnoVprasanje, Seja, SejaDTO} from "../../../models/admin.model";
import {AdminService} from "../../../services/admin.service";
import {NgForOf, NgIf} from "@angular/common";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  selectedFile: File;
  vprasanjaSeje: Vprasanja;
  vprasanjaAktivneSeje: Vprasanje[];

  aktivnaSeja: Seja;
  vseSeje: Seja[];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.dobiAktivnoSejo().pipe(
      switchMap(seja => {
        this.aktivnaSeja = seja;
        this.vprasanjaAktivneSeje = seja.vprasanja;

        for(const vprasanje of seja.vprasanja) {
          if (vprasanje.dovoljenjeNapredovanja) {
            console.log(vprasanje.dovoljenjeNapredovanja);
          }
          if (!vprasanje.uporabniki) {
            vprasanje.uporabniki = [];
          }
        }

        return this.adminService.dobiAktivnaVprasanja();
      })
    ).subscribe({
      next: (aktivnaVprasanja) => {
        for(const vprasanje of this.vprasanjaAktivneSeje) {
          for (const aktivnoVprasanje of aktivnaVprasanja) {
            if (vprasanje.id == aktivnoVprasanje.idVprasanje) {
              vprasanje.uporabniki?.push(aktivnoVprasanje.idUporabnik);
            }
          }
        }
        console.log(this.vprasanjaAktivneSeje);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");

    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        this.vprasanjaSeje = JSON.parse(fileReader.result);
        alert("Vprasanja so bila uvozena uspesno!")
      }
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  kreirajSejo(naziv: String) {
    let trenutniDatum = new Date();
    let datum = trenutniDatum.getDate()+'/'+(trenutniDatum.getMonth()+1)+'/'+trenutniDatum.getFullYear();

    let seja: SejaDTO = {
      naziv: naziv,
      datum: datum,
      vprasanja: this.vprasanjaSeje.vprasanja,
      rezultati: []
    }

    this.adminService.kreirajSejo(seja).subscribe({
      next: (value) => {
        alert("Seja z id-jem " + value + " je bila kreirana");
        this.ngOnInit();
      },
    })
  }

  koncajSejo(): void {
    this.adminService.koncajSejo().subscribe({
      next: (_) => {
        alert("Seja je bila zakljucena");
        this.ngOnInit();
      }
    })
  }
}
