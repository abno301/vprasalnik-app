import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AktivnoVprasanje, Seja, SejaDTO} from "../models/admin.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  readonly SERVER_URL: string = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) {}

  dobiSeje(): Observable<Seja[]> {
    return this.httpClient.get<Seja[]>(this.SERVER_URL + "/seja");
  }

  kreirajSejo(seja: SejaDTO): Observable<String> {
    return this.httpClient.post<String>(this.SERVER_URL + "/seja", seja);
  }

  dobiAktivnoSejo(): Observable<Seja> {
    return this.httpClient.get<Seja>(this.SERVER_URL + "/aktivna-seja");
  }

  koncajSejo():Observable<any> {
    return this.httpClient.delete<any>(this.SERVER_URL + "/aktivna-seja")
  }
  dobiAktivnaVprasanja(): Observable<AktivnoVprasanje[]> {
    return this.httpClient.get<AktivnoVprasanje[]>(this.SERVER_URL + "/aktivna-seja/aktivna-vprasanja");
  }

  spremeniDovoljenjeVprasanja(vprasanjeId: any): Observable<any> {
    return this.httpClient.post<any>(this.SERVER_URL + "/aktivna-seja/dovoli-vprasanje", vprasanjeId);
  }

}
