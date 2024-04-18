export interface Vprasanja {
  vprasanja: Vprasanje[]
}

export interface Vprasanje {
  idVprasanje: string,
  navodilo: string,
  tip: TipVprasanja,
  dovoljenjeNapredovanja?: boolean,
  podaniOdgovori?: PodanOdgovor[]
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
  idVprasanja: string,
  odgovor: string
}

export interface Rezultat {
  idUporabnika: string,
  sejaId: number,
  odgovori: Odgovor[]
}
