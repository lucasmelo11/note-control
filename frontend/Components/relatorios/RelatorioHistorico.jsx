import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const situacaoConfig = {
  bom: { label: "Bom", color: "bg-green-100 text-green-800" },
  avariado: { label: "Avariado", color: "bg-yellow-100 text-yellow-800" },
  manutencao: { label: "Manutenção", color: "bg-red-100 text-red-800" },
};

export default function RelatorioHistorico({ notebooks, emprestimos, isLoading }) {
  const [selectedNotebookId, setSelectedNotebookId] = useState("");
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (selectedNotebookId) {
      const notebook = notebooks.find(n => n.id === selectedNotebookId);
      if (notebook) {
        const historicoFiltrado = emprestimos
          .filter(e => e.numero_patrimonio === notebook.numero_patrimonio)
          .sort((a, b) => new Date(b.data_retirada) - new Date(a.data_retirada));
        setHistorico(historicoFiltrado);
      }
    } else {
      setHistorico([]);
    }
  }, [selectedNotebookId, notebooks, emprestimos]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Select onValueChange={setSelectedNotebookId} value={selectedNotebookId}>
          <SelectTrigger className="w-full md:w-1/2">
            <SelectValue placeholder="Selecione um notebook para ver o histórico" />
          </SelectTrigger>
          <SelectContent>
            {notebooks.map(notebook => (
              <SelectItem key={notebook.id} value={notebook.id}>
                {notebook.marca_modelo} (Patrimônio: {notebook.numero_patrimonio})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedNotebookId ? (
        historico.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Retirada</TableHead>
                  <TableHead>Devolução</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historico.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.nome_solicitante}</div>
                      <div className="text-sm text-slate-500">{item.secretaria}</div>
                    </TableCell>
                    <TableCell>{format(new Date(item.data_retirada), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>
                      {item.data_devolucao ? format(new Date(item.data_devolucao), 'dd/MM/yyyy', { locale: ptBR }) : (
                        <Badge variant="outline">Emprestado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.situacao_devolucao ? (
                        <Badge className={situacaoConfig[item.situacao_devolucao]?.color}>
                          {situacaoConfig[item.situacao_devolucao]?.label}
                        </Badge>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-slate-600">Nenhum histórico de empréstimo para este notebook.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <History className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600">Selecione um notebook acima para começar.</p>
        </div>
      )}
    </div>
  );
}