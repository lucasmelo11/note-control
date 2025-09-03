import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { UploadFile } from "@/integrations/Core";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, X, Calendar as CalendarIcon, Upload, Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DevolucaoForm({ emprestimo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    data_devolucao: new Date(),
    situacao_devolucao: "bom",
    observacoes_devolucao: "",
    termo_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error'

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar se é um arquivo PDF ou imagem
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor, envie apenas arquivos PDF, JPG ou PNG.");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, termo_url: file_url }));
      setUploadStatus('success');
    } catch (error) {
      console.error("Erro no upload:", error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.data_devolucao) {
      alert("Por favor, selecione a data de devolução.");
      return;
    }
    
    const dataToSave = {
      ...formData,
      data_devolucao: format(formData.data_devolucao, 'yyyy-MM-dd'),
    };
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Empréstimo */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">Informações do Empréstimo</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Solicitante</p>
            <p className="font-medium">{emprestimo?.nome_solicitante}</p>
          </div>
          <div>
            <p className="text-slate-500">Secretaria</p>
            <p className="font-medium">{emprestimo?.secretaria}</p>
          </div>
          <div>
            <p className="text-slate-500">Notebook</p>
            <p className="font-medium">{emprestimo?.marca_modelo}</p>
          </div>
          <div>
            <p className="text-slate-500">Patrimônio</p>
            <p className="font-medium">{emprestimo?.numero_patrimonio}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Devolução *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.data_devolucao ? format(formData.data_devolucao, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.data_devolucao}
                onSelect={(date) => setFormData(prev => ({ ...prev, data_devolucao: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="situacao_devolucao">Situação do Notebook *</Label>
          <Select
            value={formData.situacao_devolucao}
            onValueChange={(value) => setFormData(prev => ({ ...prev, situacao_devolucao: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bom">Bom Estado</SelectItem>
              <SelectItem value="avariado">Avariado</SelectItem>
              <SelectItem value="manutencao">Precisa de Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes_devolucao">Observações sobre a Devolução</Label>
        <Textarea
          id="observacoes_devolucao"
          value={formData.observacoes_devolucao}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes_devolucao: e.target.value }))}
          placeholder="Descreva o estado do notebook, avarias encontradas, etc."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termo_assinado">Upload do Termo de Devolução Assinado</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Input 
              id="termo_assinado" 
              type="file" 
              onChange={handleFileChange} 
              className="flex-1"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isUploading}
            />
            {isUploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
            {uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
          </div>
          
          {formData.termo_url && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Termo enviado com sucesso!</span>
              <a 
                href={formData.termo_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline ml-auto"
              >
                Visualizar arquivo
              </a>
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            Formatos aceitos: PDF, JPG, PNG. Máximo 10MB.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Confirmar Devolução
        </Button>
      </div>
    </form>
  );
}