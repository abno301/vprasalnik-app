import {Rezultat, Vprasanja, Vprasanje} from "./uporabnik.model";

export interface Seja {
  id: number,
  vprasanja: Vprasanje[],
  rezultati: Rezultat[]
}
