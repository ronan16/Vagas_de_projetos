import { Search, Filter, X } from "lucide-react";
import { cn } from "../lib/utils";

interface FiltersProps {
  search: string;
  setSearch: (search: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  areas: string[];
  hasVacanciesOnly: boolean;
  setHasVacanciesOnly: (only: boolean) => void;
}

export function Filters({
  search,
  setSearch,
  selectedArea,
  setSelectedArea,
  areas,
  hasVacanciesOnly,
  setHasVacanciesOnly,
}: FiltersProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200 p-6 shadow-xl mb-12 sticky top-6 z-40">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Search Input */}
        <div className="relative group">
          <label htmlFor="search" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
            Buscar Projeto
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="search"
              type="text"
              placeholder="Nome, professor ou palavra-chave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            )}
          </div>
        </div>

        {/* Area Filter */}
        <div className="relative">
          <label htmlFor="area" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
            Área de Atuação
          </label>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            <select
              id="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Todas as Áreas</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox Filter */}
        <div className="flex items-center h-[54px] px-4 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer group">
          <label className="flex items-center gap-3 cursor-pointer w-full">
            <input
              type="checkbox"
              checked={hasVacanciesOnly}
              onChange={(e) => setHasVacanciesOnly(e.target.checked)}
              className="w-5 h-5 rounded-lg border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-zinc-700 select-none">Apenas com vagas abertas</span>
          </label>
        </div>
      </div>
    </div>
  );
}
