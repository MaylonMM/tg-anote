import { Variavel } from "./variavel.model";

export interface Formula {
  tipo: string;
  expressao: string;
  variaveis: Variavel[];
}
