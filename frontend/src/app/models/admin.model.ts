import {Rezultat, Vprasanja} from "./uporabnik.model";

export interface Seja {
  id: number,
  vprasanja: Vprasanja,
  rezultati: Rezultat[]
}
