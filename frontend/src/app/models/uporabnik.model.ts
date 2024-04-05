export interface Vprasanja {
  vprasanja: Vprasanje[]
}

export interface Vprasanje {
  id?: string,
  navodilo: string,
  tip: TipVprasanja,
  dovoljenjeNapredovanja?: boolean,
  odgovori?: PodanOdgovor[]
}

export enum TipVprasanja {
  textbox,
  textarea,
  radiobutton,
  tocke,
  checkbox,
  navodila
}

export interface PodanOdgovor {
  id: number,
  zapis: string,
  tocke: number
}

export interface Odgovor {
  idVprasanja: number,
  odgovor: string
}

export interface Rezultat {
  idUporabnika: number,
  odgovori: Odgovor[]
}
