import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Shield,
  UserCheck,
  Mail,
  Info
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import UserTable from "../components/usuarios/UserTable";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [filterRole, setFilterRole] = useState("todos");

  const filterUsers = useCallback(() => {
    let filtered = users;

    // Filtrar por role
    if (filterRole !== "todos") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole]);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar usuário atual:", error);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await User.list("-created_date");
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const getStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      tecnicos: users.filter(u => u.role === 'user').length,
    };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gerenciamento de Usuários</h1>
            <p className="text-slate-600">Visualize os usuários do sistema</p>
          </div>
        </div>

        {/* Alerta sobre limitações */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-700" />
          <AlertTitle className="font-semibold text-blue-800">Informações sobre Usuários</AlertTitle>
          <AlertDescription className="text-blue-700">
            Esta seção permite visualizar todos os usuários do sistema. Para adicionar novos usuários ou alterar permissões, 
            utilize o painel administrativo da base44 (Dashboard → Settings → Invite Users).
          </AlertDescription>
        </Alert>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            <p className="text-sm text-slate-600">Administradores</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.tecnicos}</p>
            <p className="text-sm text-slate-600">Técnicos</p>
          </div>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Pesquisar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Perfis</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="user">Técnicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <UserTable
          users={filteredUsers}
          isLoading={isLoading}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}