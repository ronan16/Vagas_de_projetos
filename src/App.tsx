import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Loader2, AlertCircle, RefreshCcw, Search } from "lucide-react";
import { Project, RawProject } from "./types";
import { ProjectCard } from "./components/ProjectCard";
import { Filters } from "./components/Filters";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1MfMUtpzDa9FXbQeCGq7A0f0prVJzFfbQKjxAFFoNuS0/export?format=csv";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [hasVacanciesOnly, setHasVacanciesOnly] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SHEET_URL);
      if (!response.ok) throw new Error("Falha ao carregar os dados da planilha.");
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedProjects: Project[] = (results.data as RawProject[]).map((row) => ({
            name: row["Nome do projeto"] || "",
            professor: row["Professor Responsável"] || "",
            area: row["Área de atuação"] || "",
            voluntaryVacancies: parseInt(row["Vagas Voluntárias"]) || 0,
            scholarshipVacancies: parseInt(row["Vagas bolsistas"]) || 0,
            observation: row["Observação"] || "",
          }));
          setProjects(parsedProjects);
          setLoading(false);
        },
        error: (err: Error) => {
          setError("Erro ao processar os dados: " + err.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const areas = useMemo(() => {
    const allAreas = projects.map(p => p.area.split(",").map(a => a.trim())).flat();
    return Array.from(new Set(allAreas)).filter(Boolean).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.professor.toLowerCase().includes(search.toLowerCase()) ||
        project.area.toLowerCase().includes(search.toLowerCase()) ||
        project.observation.toLowerCase().includes(search.toLowerCase());
      
      const matchesArea = !selectedArea || project.area.includes(selectedArea);
      
      const matchesVacancies = !hasVacanciesOnly || (project.voluntaryVacancies > 0 || project.scholarshipVacancies > 0);

      return matchesSearch && matchesArea && matchesVacancies;
    });
  }, [projects, search, selectedArea, hasVacanciesOnly]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase italic">
                Portal de Projetos
              </h1>
              <p className="text-zinc-500 font-medium">IFPR Campus Ivaiporã</p>
            </div>
          </div>
          <p className="max-w-2xl text-zinc-600 leading-relaxed">
            Explore oportunidades de pesquisa, extensão e ensino. Encontre o projeto ideal para complementar sua formação acadêmica.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters Section */}
        <Filters 
          search={search}
          setSearch={setSearch}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          areas={areas}
          hasVacanciesOnly={hasVacanciesOnly}
          setHasVacanciesOnly={setHasVacanciesOnly}
        />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-zinc-500 font-medium animate-pulse">Carregando projetos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Ops! Algo deu errado</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={fetchData}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Resultados ({filteredProjects.length})
              </h2>
              {filteredProjects.length === 0 && (
                <button 
                  onClick={() => {
                    setSearch("");
                    setSelectedArea("");
                    setHasVacanciesOnly(false);
                  }}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: Project, index: number) => (
                  <ProjectCard key={`${project.name}-${index}`} project={project} />
                ))}
              </AnimatePresence>
            </div>

            {filteredProjects.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="bg-zinc-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Nenhum projeto encontrado</h3>
                <p className="text-zinc-500">Tente ajustar seus filtros ou termos de busca.</p>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase italic">IFPR Ivaiporã</span>
          </div>
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Instituto Federal do Paraná - Campus Ivaiporã. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
