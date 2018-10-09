import { Escola } from './escola.model';

export interface Curso {
  nome: string;
  sigla: string;
  dataInicio: string;
  dataFinalizacao: string;
  escola: Escola;
}
