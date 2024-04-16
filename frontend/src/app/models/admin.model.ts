import {Rezultat, Vprasanja, Vprasanje} from "./uporabnik.model";

export interface Seja {
  id: number,
  naziv: String,
  datum: String,
  vprasanja: Vprasanje[],
  rezultati: Rezultat[]
}

export interface SejaDTO {
  naziv: String,
  datum: String,
  vprasanja: Vprasanje[],
  rezultati: Rezultat[]
}
