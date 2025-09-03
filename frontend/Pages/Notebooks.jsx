import React, { useState, useEffect, useCallback } from "react";
import { Notebook } from "@/entities/Notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Laptop, 
  Edit, 
  Trash2,
  Filter
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import NotebookForm from "../components/notebooks/NotebookForm";
import NotebookTable from "../components/notebooks/NotebookTable";
import NotebookFilters from "../components/notebooks/NotebookFilters";

export default function Notebooks() {
  const [notebooks, setNotebooks] = useState([]);
  const [filteredNotebooks, setFilteredNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ situacao: "todos" });

  const loadNotebooks = async () => {
    setIsLoading(true);
    try {
      const data = await Notebook.list("-created_date");
      setNotebooks(data);
    } catch (error) {
      console.error("Erro ao carregar notebooks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotebooks = useCallback(() => {
    let filtered = notebooks;

    // Filtrar por situação
    if (filters.situacao !== "todos") {
      filtered = filtered.filter(notebook => notebook.situacao === filters.situacao);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(notebook =>
        notebook.numero_patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notebook.marca_modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notebook.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notebook.responsavel && notebook.responsavel.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotebooks(filtered);
  }, [notebooks, searchTerm, filters.situacao]);

  useEffect(() => {
    loadNotebooks();
  }, []);

  useEffect(() => {
    filterNotebooks();
  }, [filterNotebooks]);

  const handleSave = async (notebookData) => {
    try {
      if (selectedNotebook) {
        await Notebook.update(selectedNotebook.id, notebookData);
      } else {
        await Notebook.create(notebookData);
      }
      setShowForm(false);
      setSelectedNotebook(null);
      loadNotebooks();
    } catch (error) {
      console.error("Erro ao salvar notebook:", error);
    }
  };

  const handleEdit = (notebook) => {
    setSelectedNotebook(notebook);
    setShowForm(true);
  };

  const handleDelete = async (notebook) => {
    if (confirm(`Deseja excluir o notebook ${notebook.numero_patrimonio}?`)) {
      try {
        await Notebook.delete(notebook.id);
        loadNotebooks();
      } catch (error) {
        console.error("Erro ao excluir notebook:", error);
      }
    }
  };

  const getSituacaoStats = () => {
    const stats = {
      total: notebooks.length,
      disponivel: notebooks.filter(n => n.situacao === 'disponivel').length,
      emprestado: notebooks.filter(n => n.situacao === 'emprestado').length,
      manutencao: notebooks.filter(n => n.situacao === 'manutencao').length,
    };
    return stats;
  };

  const stats = getSituacaoStats();

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Notebooks</h1>
            <p className="text-slate-600">Gerencie o cadastro de notebooks da prefeitura</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setSelectedNotebook(null)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Notebook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedNotebook ? 'Editar Notebook' : 'Novo Notebook'}
                </DialogTitle>
              </DialogHeader>
              <NotebookForm
                notebook={selectedNotebook}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedNotebook(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.disponivel}</p>
            <p className="text-sm text-slate-600">Disponíveis</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.emprestado}</p>
            <p className="text-sm text-slate-600">Emprestados</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.manutencao}</p>
            <p className="text-sm text-slate-600">Manutenção</p>
          </div>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Pesquisar por patrimônio, marca, responsável, etc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <NotebookFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>

        {/* Tabela de Notebooks */}
        <NotebookTable
          notebooks={filteredNotebooks}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}