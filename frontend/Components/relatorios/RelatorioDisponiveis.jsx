import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Laptop } from "lucide-react";

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

export default function RelatorioDisponiveis({ notebooks, isLoading }) {
  return (
    <ReportWrapper
      isLoading={isLoading}
      data={notebooks}
      emptyTitle="Nenhum notebook disponível"
      emptyDescription="Todos os notebooks estão emprestados ou em manutenção."
      icon={Laptop}
    >
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Patrimônio</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notebooks.map((notebook) => (
              <TableRow key={notebook.id}>
                <TableCell className="font-medium">{notebook.numero_patrimonio}</TableCell>
                <TableCell>{notebook.marca_modelo}</TableCell>
                <TableCell className="font-mono text-sm">{notebook.numero_serie}</TableCell>
                <TableCell>{notebook.observacoes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportWrapper>
  );
}