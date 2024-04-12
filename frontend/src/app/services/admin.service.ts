import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Seja} from "../models/admin.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  readonly SERVER_URL: string = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) {}

  kreirajSejo(seja: Seja): Observable<Seja> {
    return this.httpClient.post<Seja>(this.SERVER_URL + "/seja", seja);
  }


}
