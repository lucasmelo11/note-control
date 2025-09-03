import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, X, Calendar as CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EmprestimoForm({ emprestimo, notebooks, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    notebooks: [],
    tipo_emprestimo: "individual",
    nome_solicitante: "",
    secretaria: "",
    evento_descricao: "",
    data_retirada: new Date(),
    prazo_devolucao: null,
  });

  useEffect(() => {
    if (emprestimo) {
      setFormData({
        notebooks: emprestimo.notebooks || [],
        tipo_emprestimo: emprestimo.tipo_emprestimo || "individual",
        nome_solicitante: emprestimo.nome_solicitante || "",
        secretaria: emprestimo.secretaria || "",
        evento_descricao: emprestimo.evento_descricao || "",
        data_retirada: new Date(emprestimo.data_retirada),
        prazo_devolucao: new Date(emprestimo.prazo_devolucao),
      });
    }
  }, [emprestimo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.notebooks.length === 0) {
      alert("Selecione pelo menos um notebook");
      return;
    }
    const dataToSave = {
      ...formData,
      data_retirada: format(formData.data_retirada, 'yyyy-MM-dd'),
      prazo_devolucao: format(formData.prazo_devolucao, 'yyyy-MM-dd'),
    };
    onSave(dataToSave);
  };

  const handleNotebookToggle = (notebook, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        notebooks: [...prev.notebooks, {
          id: notebook.id,
          numero_patrimonio: notebook.numero_patrimonio,
          marca_modelo: notebook.marca_modelo
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        notebooks: prev.notebooks.filter(n => n.id !== notebook.id)
      }));
    }
  };

  const isNotebookSelected = (notebookId) => {
    return formData.notebooks.some(n => n.id === notebookId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-2">
        <Label>Tipo de Empréstimo</Label>
        <Select
          value={formData.tipo_emprestimo}
          onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_emprestimo: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="evento">Para Evento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.tipo_emprestimo === "evento" && (
        <div className="space-y-2">
          <Label htmlFor="evento_descricao">Descrição do Evento</Label>
          <Input
            id="evento_descricao"
            value={formData.evento_descricao}
            onChange={(e) => setFormData(prev => ({...prev, evento_descricao: e.target.value}))}
            placeholder="Nome ou descrição do evento"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Notebooks Disponíveis *</Label>
        <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-3">
          {notebooks.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhum notebook disponível</p>
          ) : (
            notebooks.map(notebook => (
              <div key={notebook.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                <Checkbox
                  id={notebook.id}
                  checked={isNotebookSelected(notebook.id)}
                  onCheckedChange={(checked) => handleNotebookToggle(notebook, checked)}
                />
                <label htmlFor={notebook.id} className="flex-1 cursor-pointer">
                  <div className="font-medium">{notebook.marca_modelo}</div>
                  <div className="text-sm text-slate-500">Patrimônio: {notebook.numero_patrimonio}</div>
                </label>
              </div>
            ))
          )}
        </div>
        <p className="text-sm text-slate-500">
          Notebooks selecionados: {formData.notebooks.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome_solicitante">Nome do Solicitante *</Label>
          <Input
            id="nome_solicitante"
            value={formData.nome_solicitante}
            onChange={(e) => setFormData(prev => ({...prev, nome_solicitante: e.target.value}))}
            placeholder="Nome completo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secretaria">Secretaria *</Label>
          <Input
            id="secretaria"
            value={formData.secretaria}
            onChange={(e) => setFormData(prev => ({...prev, secretaria: e.target.value}))}
            placeholder="Ex: Secretaria de Educação"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Retirada</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.data_retirada ? format(formData.data_retirada, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.data_retirada}
                onSelect={(date) => setFormData(prev => ({ ...prev, data_retirada: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Prazo de Devolução *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.prazo_devolucao ? format(formData.prazo_devolucao, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.prazo_devolucao}
                onSelect={(date) => setFormData(prev => ({ ...prev, prazo_devolucao: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {emprestimo ? 'Atualizar Empréstimo' : 'Salvar Empréstimo'}
        </Button>
      </div>
    </form>
  );
}