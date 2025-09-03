import React from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Building2, LogIn } from 'lucide-react';

export default function LoginPrompt() {
    const handleLogin = async () => {
        // Redireciona o usuário para a página de login do Google
        // Após o sucesso, ele será retornado à página atual, e o layout irá recarregar
        await User.loginWithRedirect(window.top.location.href);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full border border-slate-200">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md mb-6">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Sistema de Notebooks</h1>
                <p className="text-slate-600 mb-8">Bem-vindo! Faça login para gerenciar os equipamentos.</p>
                <Button onClick={handleLogin} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar com Google
                </Button>
            </div>
        </div>
    );
}