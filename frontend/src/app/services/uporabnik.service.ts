import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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
    return this.httpClient.get(this.BACKEND_URL + "seja/" + sejaId)
  }

}
