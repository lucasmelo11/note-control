import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Save, 
  User as UserIcon, 
  Mail, 
  Shield, 
  Eye, 
  EyeOff,
  Info
} from "lucide-react";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // full_name is now read-only, remove from state management for editing
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        // full_name and email are not editable
        email: userData.email || "",
        telefone: userData.telefone || "",
        cargo: userData.cargo || "",
        departamento: userData.departamento || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Usar User.update com o ID do usuário atual, sem o full_name
      await User.update(user.id, {
        telefone: formData.telefone,
        cargo: formData.cargo,
        departamento: formData.departamento,
      });
      alert("Perfil atualizado com sucesso!");
      loadUserData();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Meu Perfil</h1>
          <p className="text-slate-600">Gerencie suas informações pessoais e configurações</p>
        </div>

        {/* Informações básicas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nome Completo</p>
                <p className="font-medium">{user?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Perfil</p>
                <Badge className={user?.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role === 'admin' ? 'Administrador' : 'Técnico'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="perfil">Editar Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <p className="text-sm text-slate-600">Atualize suas informações de contato e cargo</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={user?.full_name || ''}
                        disabled
                        className="bg-slate-50"
                      />
                       <p className="text-xs text-slate-500">O nome é sincronizado com sua conta Google.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-slate-50"
                      />
                      <p className="text-xs text-slate-500">O email não pode ser alterado.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo}
                        onChange={(e) => setFormData(prev => ({...prev, cargo: e.target.value}))}
                        placeholder="Ex: Técnico em TI"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento/Secretaria</Label>
                    <Input
                      id="departamento"
                      value={formData.departamento}
                      onChange={(e) => setFormData(prev => ({...prev, departamento: e.target.value}))}
                      placeholder="Ex: Secretaria de Administração"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}