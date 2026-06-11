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

export const DADOS_CARDS: IDadosCard[] = [
  { id: 1, nome: "Equipe BK",      etiquetaImg: "Foto equipe",     imagemUrl: "/equipe.png",     linkHref: "https://xfragil.org.br/quem-somos/" },
  { id: 2, nome: "Nossa missão",   etiquetaImg: "Foto missão",     imagemUrl: "/missao.png",     linkHref: "https://xfragil.org.br/missao-visao-valores/" },
  { id: 3, nome: "Nosso impacto",  etiquetaImg: "Foto impacto",    imagemUrl: "/impacto.png",    linkHref: "https://xfragil.org.br/projetos/" },
  { id: 4, nome: "Parceiros",      etiquetaImg: "Foto parceiros",  imagemUrl: "/parceiros.png",  linkHref: "https://xfragil.org.br/parceiros/" },
  { id: 5, nome: "Projetos",       etiquetaImg: "Foto projetos",   imagemUrl: "/projetos.png",   linkHref: "https://xfragil.org.br/projetos/" },
  { id: 6, nome: "Voluntários",    etiquetaImg: "Foto voluntários",imagemUrl: "/voluntarios.png",linkHref: "https://xfragil.org.br/como-ajudar/" },
];
