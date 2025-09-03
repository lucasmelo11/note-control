import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function NotebookFilters({ filters, onFiltersChange }) {
  const handleSituacaoChange = (value) => {
    onFiltersChange({
      ...filters,
      situacao: value
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-slate-500" />
      <Select value={filters.situacao} onValueChange={handleSituacaoChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas Situações</SelectItem>
          <SelectItem value="disponivel">Disponível</SelectItem>
          <SelectItem value="emprestado">Emprestado</SelectItem>
          <SelectItem value="manutencao">Manutenção</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}