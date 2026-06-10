export class Sintoma {
    id: number;
    nome: string;
    peso_M : number;
    peso_F : number;
    possui: boolean = false;
    


    constructor(id: number, nome: string, peso_M: number, peso_F: number) {
        this.id = id;
        this.nome = nome;
        this.peso_M = peso_M;
        this.peso_F = peso_F;
    }
}

