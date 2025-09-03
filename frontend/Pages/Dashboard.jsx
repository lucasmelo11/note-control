import React, { useState, useEffect } from "react";
import { Notebook } from "@/entities/Notebook";
import { Emprestimo } from "@/entities/Emprestimo";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Shield,
  Info
} from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCard from "../components/dashboard/StatsCard";
import AlertCard from "../components/dashboard/AlertCard";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalNotebooks: 0,
    disponiveis: 0,
    emprestados: 0,
    manutencao: 0
  });
  const [emprestimosVencidos, setEmprestimosVencidos] = useState([]);
  const [emprestimosRecentes, setEmprestimosRecentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Carregar notebooks
      const notebooks = await Notebook.list();
      const emprestimos = await Emprestimo.list("-created_date");

      // Calcular estatísticas
      const totalNotebooks = notebooks.length;
      const disponiveis = notebooks.filter(n => n.situacao === 'disponivel').length;
      const emprestados = notebooks.filter(n => n.situacao === 'emprestado').length;
      const manutencao = notebooks.filter(n => n.situacao === 'manutencao').length;

      setStats({ totalNotebooks, disponiveis, emprestados, manutencao });

      // Empréstimos ativos
      const emprestimosAtivos = emprestimos.filter(e => e.status === 'ativo');

      // Empréstimos vencidos
      const vencidos = emprestimosAtivos.filter(e => 
        isPast(new Date(e.prazo_devolucao))
      );
      setEmprestimosVencidos(vencidos);

      // Empréstimos recentes
      setEmprestimosRecentes(emprestimos.slice(0, 5));

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Visão geral do sistema de empréstimo de notebooks</p>
        </div>

        {/* Informação sobre administração */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-700" />
          <AlertTitle className="font-semibold text-blue-800">Sistema Administrativo</AlertTitle>
          <AlertDescription className="text-blue-700">
            Todos os usuários do sistema têm acesso total às funcionalidades de gerenciamento de notebooks e empréstimos. 
            Para gerenciar usuários, utilize o dashboard administrativo da base44.
          </AlertDescription>
        </Alert>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Notebooks"
            value={stats.totalNotebooks}
            icon={Laptop}
            color="blue"
            isLoading={isLoading}
          />
          <StatsCard
            title="Disponíveis"
            value={stats.disponiveis}
            icon={CheckCircle2}
            color="green"
            isLoading={isLoading}
          />
          <StatsCard
            title="Emprestados"
            value={stats.emprestados}
            icon={FileText}
            color="orange"
            isLoading={isLoading}
          />
          <StatsCard
            title="Em Manutenção"
            value={stats.manutencao}
            icon={AlertTriangle}
            color="red"
            isLoading={isLoading}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alertas de empréstimos vencidos */}
          <AlertCard
            emprestimosVencidos={emprestimosVencidos}
            isLoading={isLoading}
          />

          {/* Atividade recente */}
          <RecentActivity
            emprestimosRecentes={emprestimosRecentes}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}