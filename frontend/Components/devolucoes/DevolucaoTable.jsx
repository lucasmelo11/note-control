
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
import { Download, FileText, AlertTriangle, Calendar, CheckCircle, Upload, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { format, isPast, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DevolucaoTable({ emprestimos, isLoading, onDevolucao }) {
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded" />
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Todas as devoluções em dia!</h3>
          <p className="text-slate-600">Não há empréstimos ativos pendentes de devolução.</p>
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
              <TableHead>Notebook</TableHead>
              <TableHead>Prazo de Devolução</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Termo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimos.map((emprestimo) => {
              const isVencido = isPast(new Date(emprestimo.prazo_devolucao));
              const diasAteVencimento = differenceInDays(new Date(emprestimo.prazo_devolucao), new Date());
              const isVencendoEm7Dias = diasAteVencimento <= 7 && diasAteVencimento > 0;
              
              return (
                <TableRow key={emprestimo.id} className={`hover:bg-slate-50 ${isVencido ? 'bg-red-50' : isVencendoEm7Dias ? 'bg-yellow-50' : ''}`}>
                  <TableCell>
                    <div className="font-medium">{emprestimo.nome_solicitante}</div>
                    <div className="text-sm text-slate-500">{emprestimo.secretaria}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{emprestimo.marca_modelo}</div>
                    <div className="text-sm text-slate-500">Patrimônio: {emprestimo.numero_patrimonio}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${isVencido ? 'text-red-600 font-bold' : isVencendoEm7Dias ? 'text-orange-600' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      {format(new Date(emprestimo.prazo_devolucao), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isVencido ? 
                        `Vencido há ${Math.abs(diasAteVencimento)} dias` : 
                        diasAteVencimento === 0 ? 'Vence hoje' :
                        `${diasAteVencimento} dias restantes`
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {isVencido && (
                        <Badge variant="destructive" className="text-xs w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Vencido
                        </Badge>
                      )}
                      {isVencendoEm7Dias && !isVencido && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs w-fit">
                          <Clock className="w-3 h-3 mr-1" />
                          Vence em breve
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {emprestimo.termo_url ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Anexado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Upload className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => onDevolucao(emprestimo)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Processar Devolução
                    </Button>
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
