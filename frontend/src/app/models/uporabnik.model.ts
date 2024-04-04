export interface Vprasanja {
  vprasanja: Vprasanje[]
}

export interface Vprasanje {
  id?: string,
  navodilo: string,
  tip: TipVprasanja,
  dovoljenjeNapredovanja?: boolean,
  odgovori?: Odgovor[]
}

export enum TipVprasanja {
  textbox,
  textarea,
  radiobutton,
  tocke,
  checkbox,
  navodila
}

export interface Odgovor {
  id: number,
  zapis: string,
  tocke: number
}
