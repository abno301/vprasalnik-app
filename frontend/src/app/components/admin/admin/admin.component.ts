import {Component, OnInit} from '@angular/core';
import {Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {Seja, SejaDTO} from "../../../models/admin.model";
import {AdminService} from "../../../services/admin.service";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ExcelService} from "../../../services/excel.service";


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  selectedFile: File;
  vprasanjaSeje: Vprasanja;
  vprasanjaAktivneSeje: Vprasanje[];

  aktivnaSeja: Seja;
  vseSeje: Seja[];

  constructor(private adminService: AdminService,
              private excelService: ExcelService) {
  }

  /**
   * Nastavim aktivno sejo ter njena vprasanja, ce obstaja. Prav tako dobim vse seje za prikaz zgodovine sej.
   */
  ngOnInit(): void {
    this.adminService.dobiAktivnoSejo().pipe(
      switchMap(seja => {
        this.aktivnaSeja = seja;
        this.vprasanjaAktivneSeje = seja.vprasanja;

        for (const vprasanje of seja.vprasanja) {
          if (!vprasanje.uporabniki) {
            vprasanje.uporabniki = [];
          }
        }

        return this.adminService.dobiAktivnaVprasanja();
      })
    ).subscribe({
      next: (aktivnaVprasanja) => {
        for (const vprasanje of this.vprasanjaAktivneSeje) {
          for (const aktivnoVprasanje of aktivnaVprasanja) {
            if (vprasanje.id == aktivnoVprasanje.idVprasanje) {
              vprasanje.uporabniki?.push(aktivnoVprasanje.idUporabnik);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });

    this.adminService.dobiSeje().subscribe({
      next: (seje) => {
        this.vseSeje = seje;
      }
    });
  }

  /**
   * Funkcija, ki se sproži ob spremembi datoteke.
   * @param event - Dogodek, ki se sproži ob izbiri datoteke.
   */
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

  /**
   * Funkcija za dovoljenje napredovanja vprašanja z določenim ID-jem.
   * @param idVprasanja - ID vprašanja, kateremu želimo dovoliti napredovanje.
   */
  dovoliNapredovanje(idVprasanja: number): void {

    const req = {vprasanjeId: idVprasanja};

    for (const vprasanje of this.vprasanjaAktivneSeje) {
      if (vprasanje.id == idVprasanja) {
        vprasanje.dovoljenjeNapredovanja = true;
      }
    }

    this.adminService.spremeniDovoljenjeVprasanja(req).subscribe({
      next: (_) => {
        console.log("Vprasanje je zdaj na voljo!");
      }
    });

  }

  kreirajSejo(naziv: String) {
    const trenutniDatum = new Date();
    const datum = trenutniDatum.getDate() + '/' + (trenutniDatum.getMonth() + 1) + '/' + trenutniDatum.getFullYear();

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

  /**
   * Funkcija za izvoz podatkov iz seje v Excel datoteko.
   * @param seja - Objekt tipa Seja, ki vsebuje podatke seje, ki bo izvozena.
   */
  izvoziExcel(seja: Seja): void {
    let data = []

    for (let rezultat of seja.rezultati) {
      let rezultatData = {
        idUporabnika: rezultat.uporabnikId
      }
      let odgovoriObject = [];

      odgovoriObject.push(Object.assign({}, rezultatData));
      for (let odgovor of rezultat.odgovori) {
        let vprasanjeId = odgovor.idVprasanja;
        let object = {}
        // @ts-ignore
        object[vprasanjeId] = odgovor.odgovor;
        odgovoriObject.push(Object.assign({}, object));
      }
      data.push(Object.assign({}, odgovoriObject))
    }

    let transformedData = [];
    for (let item of data) {
      let transformedItem = {}
      for (let key in item) {
        let innerKey = Object.keys(item[key])[0];
        // @ts-ignore
        transformedItem[innerKey] = item[key][innerKey];
      }
      transformedData.push(transformedItem);
    }

    this.excelService.generateExcel(transformedData, seja.naziv + "_" + seja.datum);
  }
}
