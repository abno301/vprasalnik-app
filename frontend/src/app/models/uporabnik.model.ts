export interface Vprasanja {
  vprasanja: Vprasanje[]
}

export interface Vprasanje {
  id: number,
  idVprasanje: string,
  navodilo: string,
  tip: TipVprasanja,
  dovoljenjeNapredovanja?: boolean,
  podaniOdgovori?: PodanOdgovor[],
  uporabniki?: String[]
}

export enum TipVprasanja {
  textbox,
  textarea,
  radiobutton,
  tocke,
  checkbox,
  navodila
}

export class PodanOdgovor {
  id: number;
  odgovor: string;
  tocke: number;
}

export interface Odgovor {
  idOdgovor?: number,
  idVprasanja: string,
  odgovor: string
}

export interface Rezultat {
  rezultatId: number,
  uporabnikId: string,
  odgovori: Odgovor[]
}

export interface RezultatDTO {
  idUporabnika: string,
  sejaId: number,
  odgovori: Odgovor[]
}
