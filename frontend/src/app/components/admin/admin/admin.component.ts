import { Component } from '@angular/core';
import {Vprasanja} from "../../../models/uporabnik.model";
import {Seja} from "../../../models/admin.model";
import {AdminService} from "../../../services/admin.service";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  selectedFile: File;
  vprasanjaSeje: Vprasanja;

  constructor(private adminService: AdminService) {}
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

  kreirajSejo() {
    let sejaId = Math.floor(1000000 * Math.random());

    let seja: Seja = {
      id: sejaId,
      vprasanja: this.vprasanjaSeje.vprasanja,
      rezultati: []
    }
    // TODO Send session id and questions to backend

    console.log("about to make a call")
    this.adminService.kreirajSejo(seja).subscribe({
      next: (value) => {
        console.log("made a call.")
        //do smth
      },
      complete: () => alert("Seja z id-jem " + sejaId + " je bila kreirana")
    })
  }
}
