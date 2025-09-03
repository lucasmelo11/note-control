import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    role: user?.role || "user",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertDescription>
          O email não pode ser alterado. Para alterar o email, o usuário deve ser removido e convidado novamente.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user?.email || ""}
          disabled
          className="bg-slate-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          placeholder="Nome completo do usuário"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Perfil *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="user">Técnico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
        <p><strong>Administrador:</strong> Acesso completo ao sistema, incluindo gerenciamento de usuários e exclusão de empréstimos.</p>
        <p><strong>Técnico:</strong> Pode gerenciar notebooks e empréstimos, mas não pode gerenciar usuários ou excluir empréstimos.</p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}