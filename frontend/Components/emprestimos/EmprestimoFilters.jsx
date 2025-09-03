import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export default function EmprestimoFilters({ filters, onFiltersChange, secretarias }) {
  const handleSecretariaChange = (value) => {
    onFiltersChange({
      ...filters,
      secretaria: value
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-4 h-4 text-slate-500" />
      <Select value={filters.secretaria} onValueChange={handleSecretariaChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por secretaria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas Secretarias</SelectItem>
          {secretarias.map((secretaria) => (
            <SelectItem key={secretaria} value={secretaria}>
              {secretaria}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}