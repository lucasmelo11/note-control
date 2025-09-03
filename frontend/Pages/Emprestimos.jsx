
import React, { useState, useEffect, useCallback } from "react";
import { Emprestimo } from "@/entities/Emprestimo";
import { Notebook } from "@/entities/Notebook";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  FileText, 
  Download,
  Filter
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import EmprestimoForm from "../components/emprestimos/EmprestimoForm";
import EmprestimoTable from "../components/emprestimos/EmprestimoTable";
import DevolucaoForm from "../components/emprestimos/DevolucaoForm";
import EmprestimoFilters from "../components/emprestimos/EmprestimoFilters";

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [filteredEmprestimos, setFilteredEmprestimos] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmprestimo, setSelectedEmprestimo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDevolucao, setShowDevolucao] = useState(false);
  const [activeTab, setActiveTab] = useState("ativos");
  const [filters, setFilters] = useState({ status: "todos", secretaria: "todas" });
  const [currentUser, setCurrentUser] = useState(null);

  const filterEmprestimos = useCallback(() => {
    let filtered = emprestimos;

    // Filtrar por aba ativa
    if (activeTab === "ativos") {
      filtered = filtered.filter(e => e.status === "ativo");
    } else if (activeTab === "devolvidos") {
      filtered = filtered.filter(e => e.status === "devolvido");
    }

    // Filtrar por status (se aplicável)
    if (filters.status !== "todos") {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    // Filtrar por secretaria
    if (filters.secretaria !== "todas") {
      filtered = filtered.filter(e => e.secretaria === filters.secretaria);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.nome_solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Check if notebooks array exists before trying to access its properties
        (e.notebooks && e.notebooks.some(n => n.numero_patrimonio.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        e.secretaria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmprestimos(filtered);
  }, [emprestimos, searchTerm, filters.status, filters.secretaria, activeTab]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmprestimos();
  }, [filterEmprestimos]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [emprestimosData, notebooksData, userData] = await Promise.all([
        Emprestimo.list("-created_date"),
        Notebook.list(),
        User.me()
      ]);
      
      setEmprestimos(emprestimosData);
      setNotebooks(notebooksData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (emprestimoData) => {
    try {
      // Adicionar o técnico responsável
      const dataWithTecnico = {
        ...emprestimoData,
        tecnico_responsavel: currentUser.full_name
      };

      if (selectedEmprestimo) {
        // When editing an existing loan, the form should handle which notebooks are associated.
        // The Emprestimo object is updated here.
        await Emprestimo.update(selectedEmprestimo.id, dataWithTecnico);

        // NOTE: Managing changes to notebook status (e.g., if a notebook was removed
        // from an edited loan, or added) is complex and beyond the scope of this
        // specific update for handleSave, which only focuses on the Emprestimo entity update.
        // A more robust solution would compare selectedEmprestimo.notebooks
        // with emprestimoData.notebooks and update individual notebook statuses accordingly.
      } else {
        await Emprestimo.create(dataWithTecnico);
        // Atualizar status dos notebooks para emprestado e definir responsável
        for (const notebook of emprestimoData.notebooks) {
          const notebookToUpdate = notebooks.find(n => n.id === notebook.id);
          if (notebookToUpdate) {
            await Notebook.update(notebookToUpdate.id, { 
              situacao: "emprestado", 
              responsavel: emprestimoData.nome_solicitante 
            });
          }
        }
      }
      
      setShowForm(false);
      setSelectedEmprestimo(null);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar empréstimo:", error);
    }
  };

  const handleDevolucao = async (devolucaoData) => {
    try {
      await Emprestimo.update(selectedEmprestimo.id, {
        ...devolucaoData,
        status: "devolvido"
      });

      // Atualizar status dos notebooks associados a este empréstimo
      // Use selectedEmprestimo.notebooks (array of notebooks) or fallback to single notebook_id for older data
      const notebooksToUpdate = selectedEmprestimo.notebooks || (selectedEmprestimo.notebook_id ? [{ id: selectedEmprestimo.notebook_id }] : []);

      for (const notebook of notebooksToUpdate) {
        const notebookToUpdate = notebooks.find(n => n.id === notebook.id);
        if (notebookToUpdate) {
          let novaSituacao = "disponivel";
          if (devolucaoData.situacao_devolucao === "manutencao") {
            novaSituacao = "manutencao";
          }
          await Notebook.update(notebookToUpdate.id, { 
            situacao: novaSituacao,
            responsavel: "" // Clear responsavel on return
          });
        }
      }

      setShowDevolucao(false);
      setSelectedEmprestimo(null);
      loadData();
    } catch (error) {
      console.error("Erro ao registrar devolução:", error);
    }
  };

  const handleEdit = (emprestimo) => {
    setSelectedEmprestimo(emprestimo);
    setShowForm(true);
  };
  
  const handleDelete = async (emprestimo) => {
    try {
      await Emprestimo.delete(emprestimo.id);
      
      // Liberar os notebooks se o empréstimo estava ativo
      if (emprestimo.status === "ativo") {
        // Use emprestimo.notebooks (array of notebooks) or fallback to single notebook_id for older data
        const notebooksToUpdate = emprestimo.notebooks || (emprestimo.notebook_id ? [{ id: emprestimo.notebook_id }] : []);
        for (const notebook of notebooksToUpdate) {
          const notebookToUpdate = notebooks.find(n => n.id === notebook.id);
          if (notebookToUpdate) {
            await Notebook.update(notebookToUpdate.id, { 
              situacao: "disponivel", 
              responsavel: "" 
            });
          }
        }
      }
      
      loadData();
    } catch (error) {
      console.error("Erro ao excluir empréstimo:", error);
    }
  };

  const handleDevolucaoClick = (emprestimo) => {
    setSelectedEmprestimo(emprestimo);
    setShowDevolucao(true);
  };

  const getSecretarias = () => {
    const secretarias = [...new Set(emprestimos.map(e => e.secretaria))].sort();
    return secretarias;
  };

  const getStats = () => {
    return {
      total: emprestimos.length,
      ativos: emprestimos.filter(e => e.status === "ativo").length,
      devolvidos: emprestimos.filter(e => e.status === "devolvido").length,
    };
  };

  const stats = getStats();
  const secretarias = getSecretarias();

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Empréstimos</h1>
            <p className="text-slate-600">Gerencie os empréstimos de notebooks</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedEmprestimo(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Empréstimo
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.ativos}</p>
            <p className="text-sm text-slate-600">Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.devolvidos}</p>
            <p className="text-sm text-slate-600">Devolvidos</p>
          </div>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            <EmprestimoFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              secretarias={secretarias}
            />
          </div>
        </div>

        {/* Tabs e Tabela */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="ativos" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Empréstimos Ativos ({stats.ativos})
            </TabsTrigger>
            <TabsTrigger value="devolvidos" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Devolvidos ({stats.devolvidos})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ativos">
            <EmprestimoTable
              emprestimos={filteredEmprestimos}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDevolucao={handleDevolucaoClick}
              onDelete={handleDelete}
              showDevolucaoButton={true}
            />
          </TabsContent>

          <TabsContent value="devolvidos">
            <EmprestimoTable
              emprestimos={filteredEmprestimos}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDevolucao={handleDevolucaoClick}
              onDelete={handleDelete}
              showDevolucaoButton={false}
            />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEmprestimo ? 'Editar Empréstimo' : 'Novo Empréstimo'}
              </DialogTitle>
            </DialogHeader>
            <EmprestimoForm
              emprestimo={selectedEmprestimo}
              // Filter notebooks to show available ones OR notebooks already part of the selected loan (if editing)
              notebooks={
                notebooks.filter(n => 
                  n.situacao === 'disponivel' || 
                  (selectedEmprestimo && selectedEmprestimo.notebooks && selectedEmprestimo.notebooks.some(sn => sn.id === n.id))
                )
              }
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedEmprestimo(null);
              }}
            />
          </DialogContent>
        </Dialog>

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
