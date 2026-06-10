/**
 * Constantes globais do projeto
 */

export const ALTURA_NAVBAR = 96;

export const LARGURA_CARD = 220;
export const ESPACAMENTO_CARD = 24;
export const PADDING_MINIMO_CARD = 48; // padding horizontal da seção × 2

export interface IDadosCard {
  id: number;
  nome: string;
  etiquetaImg: string;
}

export const DADOS_CARDS: IDadosCard[] = [
  { id: 1, nome: "Equipe BK",      etiquetaImg: "Foto equipe" },
  { id: 2, nome: "Nossa missão",   etiquetaImg: "Foto missão" },
  { id: 3, nome: "Nosso impacto",  etiquetaImg: "Foto impacto" },
  { id: 4, nome: "Parceiros",      etiquetaImg: "Foto parceiros" },
  { id: 5, nome: "Projetos",       etiquetaImg: "Foto projetos" },
  { id: 6, nome: "Voluntários",    etiquetaImg: "Foto voluntários" },
];
