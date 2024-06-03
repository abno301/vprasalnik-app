import {Component, OnInit} from '@angular/core';
import {Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {Seja, SejaDTO} from "../../../models/admin.model";
import {AdminService} from "../../../services/admin.service";
import {NgForOf, NgIf} from "@angular/common";
import {switchMap} from "rxjs";
import fileSaver from "file-saver";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

  downloadJsonHref: SafeUrl;

  constructor(private adminService: AdminService, private sanitizer: DomSanitizer) {}

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
        // console.log(this.vprasanjaAktivneSeje);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });

    this.adminService.dobiSeje().subscribe({
      next: (seje) => {
        this.vseSeje = seje;
        console.log(seje);
        this.generateDownloadJsonUri();
      }
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

  dovoliNapredovanje(idVprasanja: number): void {

    let req = { vprasanjeId: idVprasanja}
    this.adminService.spremeniDovoljenjeVprasanja(req).subscribe({
      next: (_) => {
        console.log("Spremenil vprasanje!");
      }
    });

    // Da se silent refresha strani
    for(const vprasanje of this.vprasanjaAktivneSeje) {
      if (vprasanje.id == idVprasanja) {
        vprasanje.dovoljenjeNapredovanja = true;
      }
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

  izvoziExcel(json: Seja, excelFileName: string): void {
    console.log(json);
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.shraniExcel(excelBuffer, excelFileName);
  }

  private shraniExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    fileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  generateDownloadJsonUri() {
    const theJSON = JSON.stringify(this.vseSeje);
    this.downloadJsonHref = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
  }
}
