import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RezultatDTO} from "../models/uporabnik.model";

@Injectable({
  providedIn: 'root'
})
export class UporabnikService {

  readonly BACKEND_URL = "http://localhost:8080/";

  constructor(private httpClient: HttpClient) {}

  public getNavodila(): Observable<any> {
    return this.httpClient.get("../../assets/vprasanja.json");
  }

  public dobiSejo(sejaId: number): Observable<any> {
    return this.httpClient.get(this.BACKEND_URL + "seja/" + sejaId);
  }

  public aktivnoVprasanje(request: any): Observable<any> {
    return this.httpClient.post(
      this.BACKEND_URL + "aktivna-vprasanja",
      request
    );
  }

  public zakljuci(rezultati: RezultatDTO, sejaId: number): Observable<any> {
    return this.httpClient.post(
      this.BACKEND_URL + "seja/" + sejaId,
      rezultati
    );
  }

}
