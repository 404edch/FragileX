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
  imagemUrl?: string;
  linkHref?: string;
}

