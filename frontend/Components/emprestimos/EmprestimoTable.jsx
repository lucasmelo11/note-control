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
import { Download, Edit, Trash2, FileText, AlertTriangle, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { format, isPast, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function EmprestimoTable({ 
  emprestimos, 
  isLoading, 
  onEdit, 
  onDevolucao, 
  onDelete, 
  showDevolucaoButton = true 
}) {
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
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

  if (emprestimos.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum empréstimo encontrado</h3>
          <p className="text-slate-600">Cadastre o primeiro empréstimo ou ajuste os filtros de pesquisa.</p>
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
              <TableHead>Solicitante</TableHead>
              <TableHead>Notebooks</TableHead>
              <TableHead>Secretaria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Retirada</TableHead>
              <TableHead>Prazo Devolução</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimos.map((emprestimo) => {
              const prazoVencido = isPast(new Date(emprestimo.prazo_devolucao));
              const diasRestantes = differenceInDays(new Date(emprestimo.prazo_devolucao), new Date());
              
              return (
                <TableRow key={emprestimo.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-medium">{emprestimo.nome_solicitante}</div>
                    {emprestimo.evento_descricao && (
                      <div className="text-sm text-slate-500">Evento: {emprestimo.evento_descricao}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {emprestimo.notebooks?.map((notebook, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-mono">{notebook.numero_patrimonio}</span>
                          <div className="text-xs text-slate-500">{notebook.marca_modelo}</div>
                        </div>
                      )) || (
                        <div className="text-sm">
                          <span className="font-mono">{emprestimo.numero_patrimonio}</span>
                          <div className="text-xs text-slate-500">{emprestimo.marca_modelo}</div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{emprestimo.secretaria}</TableCell>
                  <TableCell>
                    <Badge variant={emprestimo.tipo_emprestimo === 'evento' ? 'default' : 'secondary'}>
                      {emprestimo.tipo_emprestimo === 'evento' ? 'Evento' : 'Individual'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(emprestimo.data_retirada), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{format(new Date(emprestimo.prazo_devolucao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      {emprestimo.status === 'ativo' && (
                        <>
                          {prazoVencido ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Vencido
                            </Badge>
                          ) : diasRestantes <= 3 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {diasRestantes} dias
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{emprestimo.tecnico_responsavel}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Link to={`${createPageUrl("Termo")}?id=${emprestimo.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(emprestimo)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {showDevolucaoButton && emprestimo.status === 'ativo' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDevolucao(emprestimo)}
                          className="hover:bg-green-50 hover:text-green-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(emprestimo)}
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