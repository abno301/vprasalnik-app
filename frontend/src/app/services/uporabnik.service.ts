import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UporabnikService {

  constructor(private httpClient: HttpClient) {}

  public getNavodila(): Observable<any> {
    return this.httpClient.get("../../assets/vprasanja.json");
  }

}
