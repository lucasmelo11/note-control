import React, { useState, useEffect, useCallback } from "react";
import { Emprestimo } from "@/entities/Emprestimo";
import { Notebook } from "@/entities/Notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import DevolucaoTable from "../components/devolucoes/DevolucaoTable";
import DevolucaoForm from "../components/emprestimos/DevolucaoForm";

export default function Devolucoes() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [filteredEmprestimos, setFilteredEmprestimos] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmprestimo, setSelectedEmprestimo] = useState(null);
  const [showDevolucao, setShowDevolucao] = useState(false);

  const filterEmprestimos = useCallback(() => {
    let filtered = emprestimos;

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.nome_solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.numero_patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.secretaria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmprestimos(filtered);
  }, [emprestimos, searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmprestimos();
  }, [filterEmprestimos]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [emprestimosData, notebooksData] = await Promise.all([
        Emprestimo.filter({ status: "ativo" }, "-created_date"),
        Notebook.list(),
      ]);
      
      setEmprestimos(emprestimosData);
      setNotebooks(notebooksData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevolucao = async (devolucaoData) => {
    try {
      await Emprestimo.update(selectedEmprestimo.id, {
        ...devolucaoData,
        status: "devolvido"
      });

      // Atualizar status do notebook
      const notebook = notebooks.find(n => n.id === selectedEmprestimo.notebook_id);
      if (notebook) {
        let novaSituacao = "disponivel";
        if (devolucaoData.situacao_devolucao === "manutencao") {
          novaSituacao = "manutencao";
        }
        await Notebook.update(notebook.id, { situacao: novaSituacao });
      }

      setShowDevolucao(false);
      setSelectedEmprestimo(null);
      loadData();
    } catch (error) {
      console.error("Erro ao registrar devolução:", error);
    }
  };

  const handleDevolucaoClick = (emprestimo) => {
    setSelectedEmprestimo(emprestimo);
    setShowDevolucao(true);
  };

  const getStats = () => {
    const today = new Date();
    const vencidos = emprestimos.filter(e => new Date(e.prazo_devolucao) < today);
    const vencendoEm7Dias = emprestimos.filter(e => {
      const diffDays = Math.ceil((new Date(e.prazo_devolucao) - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    });

    return {
      total: emprestimos.length,
      vencidos: vencidos.length,
      vencendoEm7Dias: vencendoEm7Dias.length,
      pendentes: emprestimos.filter(e => !e.termo_url).length
    };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Controle de Devoluções</h1>
          <p className="text-slate-600">Gerencie as devoluções de notebooks em aberto</p>
        </div>

        {/* Alertas importantes */}
        {stats.vencidos > 0 && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-700" />
            <AlertTitle className="font-semibold text-red-800">Atenção!</AlertTitle>
            <AlertDescription className="text-red-700">
              Existem {stats.vencidos} empréstimo{stats.vencidos > 1 ? 's' : ''} vencido{stats.vencidos > 1 ? 's' : ''} que precisa{stats.vencidos > 1 ? 'm' : ''} de atenção imediata.
            </AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Empréstimos Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
            <p className="text-sm text-slate-600">Vencidos</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.vencendoEm7Dias}</p>
            <p className="text-sm text-slate-600">Vencem em 7 dias</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.pendentes}</p>
            <p className="text-sm text-slate-600">Termos Pendentes</p>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Pesquisar por solicitante, patrimônio ou secretaria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabela de Devoluções */}
        <DevolucaoTable
          emprestimos={filteredEmprestimos}
          isLoading={isLoading}
          onDevolucao={handleDevolucaoClick}
        />

        {/* Dialog de Devolução */}
        <Dialog open={showDevolucao} onOpenChange={setShowDevolucao}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Devolução</DialogTitle>
            </DialogHeader>
            <DevolucaoForm
              emprestimo={selectedEmprestimo}
              onSave={handleDevolucao}
              onCancel={() => {
                setShowDevolucao(false);
                setSelectedEmprestimo(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}