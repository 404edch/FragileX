/**
 * Constantes globais do projeto
 */

export const ALTURA_NAVBAR = 96;

export const LARGURA_CARD = 220;
export const ESPACAMENTO_CARD = 24;
const PADDING_MINIMO_CARD = 48; // padding horizontal da seção × 2

interface IDadosCard {
  id: number;
  nome: string;
  etiquetaImg: string;
  imagemUrl?: string;
  linkHref?: string;
}

