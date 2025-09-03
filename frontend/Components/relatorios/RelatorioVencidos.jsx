import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReportWrapper = ({ children, isLoading, data, emptyTitle, emptyDescription, icon: Icon }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{emptyTitle}</h3>
        <p className="text-slate-600">{emptyDescription}</p>
      </div>
    );
  }

  return children;
};

export default function RelatorioVencidos({ emprestimos, isLoading }) {
  return (
    <ReportWrapper
      isLoading={isLoading}
      data={emprestimos}
      emptyTitle="Nenhum empréstimo vencido"
      emptyDescription="Todos os empréstimos ativos estão dentro do prazo."
      icon={AlertTriangle}
    >
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-50">
              <TableHead>Solicitante</TableHead>
              <TableHead>Notebook (Patrimônio)</TableHead>
              <TableHead>Prazo Devolução</TableHead>
              <TableHead>Dias Vencido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimos.map((emprestimo) => {
              const diasVencidos = differenceInDays(new Date(), new Date(emprestimo.prazo_devolucao));
              return (
                <TableRow key={emprestimo.id}>
                  <TableCell>
                    <div className="font-medium">{emprestimo.nome_solicitante}</div>
                    <div className="text-sm text-slate-500">{emprestimo.secretaria}</div>
                  </TableCell>
                  <TableCell>
                    <div>{emprestimo.marca_modelo}</div>
                    <div className="text-sm font-mono text-slate-500">{emprestimo.numero_patrimonio}</div>
                  </TableCell>
                  <TableCell>{format(new Date(emprestimo.prazo_devolucao), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell className="font-bold text-red-600">{diasVencidos} dia(s)</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ReportWrapper>
  );
}