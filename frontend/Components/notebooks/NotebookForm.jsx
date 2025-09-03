import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function NotebookForm({ notebook, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    numero_patrimonio: notebook?.numero_patrimonio || "",
    marca_modelo: notebook?.marca_modelo || "",
    numero_serie: notebook?.numero_serie || "",
    responsavel: notebook?.responsavel || "",
    situacao: notebook?.situacao || "disponivel",
    observacoes: notebook?.observacoes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero_patrimonio">Número de Patrimônio *</Label>
          <Input
            id="numero_patrimonio"
            value={formData.numero_patrimonio}
            onChange={(e) => handleChange('numero_patrimonio', e.target.value)}
            placeholder="Ex: NB001"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="situacao">Situação</Label>
          <Select
            value={formData.situacao}
            onValueChange={(value) => handleChange('situacao', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="emprestado">Emprestado</SelectItem>
              <SelectItem value="manutencao">Em Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca_modelo">Marca/Modelo *</Label>
          <Input
            id="marca_modelo"
            value={formData.marca_modelo}
            onChange={(e) => handleChange('marca_modelo', e.target.value)}
            placeholder="Ex: Dell Latitude 3520"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável</Label>
          <Input
            id="responsavel"
            value={formData.responsavel}
            onChange={(e) => handleChange('responsavel', e.target.value)}
            placeholder="Nome do responsável ou setor"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numero_serie">Número de Série *</Label>
        <Input
          id="numero_serie"
          value={formData.numero_serie}
          onChange={(e) => handleChange('numero_serie', e.target.value)}
          placeholder="Ex: ABC123DEF456"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações adicionais sobre o notebook..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {notebook ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}