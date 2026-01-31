import { type IUitvoering, Uitvoering } from "./Uitvoering";
import { type IPrijs, Prijs } from "./Prijs";

export interface IVoorstelling {
  id?: number;
  title?: string;
  description?: string;
  active?: boolean;
  url?: string;
  locatie?: string;
  opmerkingen?: string;
  poster?: string;
  thumbnail?: string;
  uitvoeringen?: IUitvoering[];
  prijzen?: IPrijs[];
};

export class Voorstelling {
  id: number | null;
  title: string;
  description: string;
  active: boolean;
  url?: string;
  locatie?: string;
  opmerkingen?: string;
  poster?: string;
  thumbnail?: string;
  uitvoeringen: Uitvoering[];
  prijzen: Prijs[];

  constructor({
    id,
    title,
    description,
    active,
    url,
    locatie,
    opmerkingen,
    poster,
    thumbnail,
    uitvoeringen,
    prijzen,
  }: IVoorstelling = {}) {
    this.id = id || null;
    this.title = title || "";
    this.description = description || "";
    this.active = !!active;
    this.url = url;
    this.locatie = locatie;
    this.opmerkingen = opmerkingen;
    this.poster = poster;
    this.thumbnail = thumbnail;
    this.uitvoeringen = uitvoeringen?.map((u) => new Uitvoering(u) as Uitvoering) || [];
    this.prijzen = prijzen?.map((p) => new Prijs(p)) || [];
  }

  serialize() {
    return {
      ...(this.id ? { id: this.id } : {}),
      title: this.title,
      description: this.description,
      active: this.active,
      url: this.url,
      locatie: this.locatie,
      opmerkingen: this.opmerkingen,
      poster: this.poster,
      thumbnail: this.thumbnail,
      uitvoeringen: (this.uitvoeringen || []).map((u) => u.serialize()),
      prijzen: this.prijzen,
    };
  }
}
