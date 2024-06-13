import {Rezultat, RezultatDTO, Vprasanje} from "./uporabnik.model";

export class Seja {
  id: number;
  naziv: string;
  datum: string;
  vprasanja: Vprasanje[];
  rezultati: Rezultat[];
}

export interface SejaDTO {
  naziv: String,
  datum: String,
  vprasanja: Vprasanje[],
  rezultati: RezultatDTO[]
}

export interface AktivnoVprasanje {
  idUporabnik: String,
  idVprasanje: number
}

export interface RezultatExcel {
  idUporabnika: String
}
