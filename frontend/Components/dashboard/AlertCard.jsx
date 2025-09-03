
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, User, CheckCircle2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertCard({ emprestimosVencidos, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Empréstimos Vencidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Empréstimos Vencidos ({emprestimosVencidos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emprestimosVencidos.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-slate-600">Nenhum empréstimo vencido!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {emprestimosVencidos.map((emprestimo) => {
              const diasVencidos = Math.abs(differenceInDays(new Date(), new Date(emprestimo.prazo_devolucao)));
              
              return (
                <div key={emprestimo.id} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <p className="font-medium text-slate-900">{emprestimo.nome_solicitante}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>Patrimônio: {emprestimo.numero_patrimonio}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Vencido em {format(new Date(emprestimo.prazo_devolucao), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    {diasVencidos} {diasVencidos === 1 ? 'dia' : 'dias'}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
