import React, { useState, useEffect } from "react";
import { Notebook } from "@/entities/Notebook";
import { Emprestimo } from "@/entities/Emprestimo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, BarChart3, Laptop, FileText, AlertTriangle, History } from "lucide-react";
import { format } from "date-fns";
import { isPast } from "date-fns";

import RelatorioDisponiveis from "../components/relatorios/RelatorioDisponiveis";
import RelatorioEmprestados from "../components/relatorios/RelatorioEmprestados";
import RelatorioVencidos from "../components/relatorios/RelatorioVencidos";
import RelatorioHistorico from "../components/relatorios/RelatorioHistorico";

export default function Relatorios() {
  const [notebooks, setNotebooks] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notebooksData, emprestimosData] = await Promise.all([
        Notebook.list(),
        Emprestimo.list("-created_date"),
      ]);
      setNotebooks(notebooksData);
      setEmprestimos(emprestimosData);
    } catch (error) {
      console.error("Erro ao carregar dados dos relatórios:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = (data, filename) => {
    if (!data || data.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(';'),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(';'))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const notebooksDisponiveis = notebooks.filter(n => n.situacao === 'disponivel');
  const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo');
  const emprestimosVencidos = emprestimos.filter(e => e.status === 'ativo' && isPast(new Date(e.prazo_devolucao)));

  const reports = {
    disponiveis: {
      title: "Notebooks Disponíveis",
      component: <RelatorioDisponiveis notebooks={notebooksDisponiveis} isLoading={isLoading} />,
      data: notebooksDisponiveis.map(({ id, created_date, updated_date, created_by, ...rest }) => rest),
      icon: Laptop
    },
    emprestados: {
      title: "Notebooks Emprestados",
      component: <RelatorioEmprestados emprestimos={emprestimosAtivos} isLoading={isLoading} />,
      data: emprestimosAtivos.map(e => ({
        patrimonio: e.numero_patrimonio,
        modelo: e.marca_modelo,
        solicitante: e.nome_solicitante,
        secretaria: e.secretaria,
        data_retirada: format(new Date(e.data_retirada), "dd/MM/yyyy"),
        prazo_devolucao: format(new Date(e.prazo_devolucao), "dd/MM/yyyy"),
      })),
      icon: FileText
    },
    vencidos: {
      title: "Empréstimos Vencidos",
      component: <RelatorioVencidos emprestimos={emprestimosVencidos} isLoading={isLoading} />,
      data: emprestimosVencidos.map(e => ({
        patrimonio: e.numero_patrimonio,
        solicitante: e.nome_solicitante,
        secretaria: e.secretaria,
        prazo_devolucao: format(new Date(e.prazo_devolucao), "dd/MM/yyyy"),
      })),
      icon: AlertTriangle
    },
    historico: {
      title: "Histórico por Notebook",
      component: <RelatorioHistorico notebooks={notebooks} emprestimos={emprestimos} isLoading={isLoading} />,
      isDynamic: true, // No generic export for this one
      icon: History
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatórios</h1>
          <p className="text-slate-600">Analise e exporte dados do sistema</p>
        </div>

        <Tabs defaultValue="disponiveis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-6">
            {Object.entries(reports).map(([key, report]) => (
              <TabsTrigger key={key} value={key} className="py-3 flex items-center gap-2">
                <report.icon className="w-4 h-4" />
                {report.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(reports).map(([key, report]) => (
            <TabsContent key={key} value={key}>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
                  {!report.isDynamic && (
                    <Button variant="outline" onClick={() => handleExport(report.data, key)}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar para CSV
                    </Button>
                  )}
                </div>
                {report.component}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}