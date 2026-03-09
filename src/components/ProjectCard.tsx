import React from "react";
import { motion } from "motion/react";
import { User, BookOpen, Users, Info } from "lucide-react";
import { Project } from "../types";
import { cn } from "../lib/utils";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const hasVacancies = project.voluntaryVacancies > 0 || project.scholarshipVacancies > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            hasVacancies ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
          )}>
            {hasVacancies ? "Vagas Abertas" : "Sem Vagas"}
          </span>
          <div className="flex gap-2">
            {project.scholarshipVacancies > 0 && (
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                Bolsista
              </span>
            )}
            {project.voluntaryVacancies > 0 && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                Voluntário
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
          {project.name}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-zinc-600 text-sm">
            <User className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
            <span className="font-medium">{project.professor}</span>
          </div>
          <div className="flex items-center text-zinc-600 text-sm">
            <BookOpen className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
            <span>{project.area}</span>
          </div>
          <div className="flex items-center text-zinc-600 text-sm">
            <Users className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
            <span>
              {project.voluntaryVacancies} Voluntária(s) • {project.scholarshipVacancies} Bolsista(s)
            </span>
          </div>
        </div>
      </div>

      {project.observation && (
        <div className="mt-auto pt-4 border-t border-zinc-100">
          <div className="flex items-start gap-2 text-zinc-500 text-xs italic leading-relaxed">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <p>{project.observation}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
