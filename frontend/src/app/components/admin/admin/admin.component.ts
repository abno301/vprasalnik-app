import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  selectedFile: File;

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        console.log(JSON.parse(fileReader.result));
      }
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  kreirajSejo() {
    // upload code goes here
  }
}
