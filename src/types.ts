export interface Project {
  name: string;
  professor: string;
  area: string;
  voluntaryVacancies: number;
  scholarshipVacancies: number;
  observation: string;
}

export interface RawProject {
  "Nome do projeto": string;
  "Professor Responsável": string;
  "Área de atuação": string;
  "Vagas Voluntárias": string;
  "Vagas bolsistas": string;
  "Observação": string;
}
