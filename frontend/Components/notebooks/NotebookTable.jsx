import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, Laptop } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const situacaoConfig = {
  disponivel: { label: "Disponível", color: "bg-green-100 text-green-800 border-green-200" },
  emprestado: { label: "Emprestado", color: "bg-orange-100 text-orange-800 border-orange-200" },
  manutencao: { label: "Manutenção", color: "bg-red-100 text-red-800 border-red-200" }
};

export default function NotebookTable({ notebooks, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notebooks.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Laptop className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum notebook encontrado</h3>
          <p className="text-slate-600">Cadastre o primeiro notebook ou ajuste os filtros de pesquisa.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Patrimônio</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notebooks.map((notebook) => {
              const situacao = situacaoConfig[notebook.situacao];
              
              return (
                <TableRow key={notebook.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {notebook.numero_patrimonio}
                  </TableCell>
                  <TableCell>{notebook.marca_modelo}</TableCell>
                  <TableCell>{notebook.responsavel || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {notebook.numero_serie}
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${situacao.color}`}>
                      {situacao.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {notebook.observacoes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(notebook)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(notebook)}
                        className="hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}