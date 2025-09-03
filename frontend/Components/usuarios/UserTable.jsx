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
import { Edit, Users, Shield, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const roleConfig = {
  admin: { label: "Administrador", color: "bg-red-100 text-red-800 border-red-200", icon: Shield },
  user: { label: "Técnico", color: "bg-blue-100 text-blue-800 border-blue-200", icon: UserCheck }
};

export default function UserTable({ users, isLoading, currentUser }) {
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-slate-600">Ajuste os filtros de pesquisa.</p>
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
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Data de Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const role = roleConfig[user.role] || roleConfig.user;
              const RoleIcon = role.icon;
              
              return (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.full_name}
                          {user.id === currentUser?.id && (
                            <span className="text-xs text-blue-600">(Você)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${role.color} flex items-center gap-1 w-fit`}>
                      <RoleIcon className="w-3 h-3" />
                      {role.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.created_date && format(new Date(user.created_date), 'dd/MM/yyyy', { locale: ptBR })}
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