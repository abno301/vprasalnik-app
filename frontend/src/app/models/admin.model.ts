import {Rezultat, Vprasanja, Vprasanje} from "./uporabnik.model";

export class Seja {
  id: number;
  naziv: String;
  datum: String;
  vprasanja: Vprasanje[];
  rezultati: Rezultat[];
}

export interface SejaDTO {
  naziv: String,
  datum: String,
  vprasanja: Vprasanje[],
  rezultati: Rezultat[]
}
