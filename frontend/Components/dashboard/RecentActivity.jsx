import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, User, Laptop } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivity({ emprestimosRecentes, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Activity className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
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
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emprestimosRecentes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {emprestimosRecentes.map((emprestimo) => (
              <div key={emprestimo.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <p className="font-medium text-slate-900">{emprestimo.nome_solicitante}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <p className="text-sm text-slate-600">
                      {emprestimo.secretaria} • Patrimônio: {emprestimo.numero_patrimonio}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(emprestimo.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <Badge variant={emprestimo.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                  {emprestimo.status === 'ativo' ? 'Ativo' : 'Devolvido'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}