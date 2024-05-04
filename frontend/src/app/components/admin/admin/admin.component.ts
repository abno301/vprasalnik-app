import {Component, OnInit} from '@angular/core';
import {Vprasanja, Vprasanje} from "../../../models/uporabnik.model";
import {Seja, SejaDTO} from "../../../models/admin.model";
import {AdminService} from "../../../services/admin.service";
import {NgForOf, NgIf} from "@angular/common";

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
    this.adminService.dobiAktivnoSejo().subscribe({
      next: (seja) => {
        // console.log(seja);
        this.aktivnaSeja = seja;

        this.vprasanjaAktivneSeje = seja.vprasanja;
        for(const vprasanje of seja.vprasanja) {
          if (vprasanje.dovoljenjeNapredovanja) {
            console.log(vprasanje.dovoljenjeNapredovanja);
          }
        }
      }
    });

    this.adminService.dobiSeje().subscribe({
      next: (seje) => {
        this.vseSeje = seje;
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
