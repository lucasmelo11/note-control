import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Emprestimo } from "@/entities/Emprestimo";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function TermoPage() {
  const [emprestimo, setEmprestimo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (id) {
      loadEmprestimo(id);
    }
  }, [location.search]);

  const loadEmprestimo = async (id) => {
    try {
      const data = await Emprestimo.get(id);
      setEmprestimo(data);
    } catch (error) {
      console.error("Erro ao carregar empréstimo:", error);
    }
  };

  if (!emprestimo) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-slate-600">Carregando termo...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setTimeout(() => {
      alert("Para salvar como PDF:\n1. Clique em 'Imprimir'\n2. Escolha 'Salvar como PDF'\n3. Clique em 'Salvar'");
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @media screen {
          body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
          }
          
          .no-print {
            display: block;
          }
        }
        
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt;
            line-height: 1.4;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box;
            background: white;
            overflow: visible !important;
          }
          
          .logo-container img {
            max-width: 280px !important;
            height: auto !important;
            display: block;
            margin: 0 auto !important;
          }
          
          .break-page { 
            page-break-before: always; 
          }
          
          .signature-section {
            margin-top: 60px !important;
            page-break-inside: avoid;
          }
          
          .signature-line {
            border-top: 1.5px solid #000 !important;
            margin-top: 50px !important;
            padding-top: 8px !important;
          }
          
          .section-title {
            border-bottom: 1px solid #000 !important;
          }
          
          * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }
        }
      `}</style>
      
      {/* Botões de ação - apenas na tela */}
      <div className="no-print fixed top-4 right-4 z-50 space-x-2">
        <Button onClick={handleDownloadPDF} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Baixar PDF
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
      </div>
      
      {/* Documento do termo */}
      <div className="print-container max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-lg print:shadow-none print:max-w-none print:mx-0 print:my-0">
        
        {/* Cabeçalho com Logo */}
        <header className="text-center border-b-2 border-black pb-6 mb-8">
          <div className="logo-container mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8c1972e77_PREFEITURAMUNICIPAL.png"
              alt="Prefeitura Municipal de Ribeirão das Neves"
              className="mx-auto max-w-xs"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-black mb-2">TERMO DE EMPRÉSTIMO</h1>
            <p className="text-gray-700 font-medium">Controle de Equipamentos de Informática</p>
            <p className="text-sm text-gray-600 mt-2">Nº: {emprestimo.numero_patrimonio}-{format(new Date(emprestimo.created_date), 'yyyy')}</p>
          </div>
        </header>

        {/* Dados do Equipamento */}
        <section className="mb-8">
          <h2 className="section-title text-lg font-bold uppercase border-b border-black pb-2 mb-4">DADOS DO EQUIPAMENTO</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nº de Patrimônio</p>
              <p className="font-bold text-black">{emprestimo.numero_patrimonio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Marca/Modelo</p>
              <p className="font-bold text-black">{emprestimo.marca_modelo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipo de Equipamento</p>
              <p className="font-bold text-black">NOTEBOOK</p>
            </div>
          </div>
        </section>

        {/* Dados do Solicitante */}
        <section className="mb-8">
          <h2 className="section-title text-lg font-bold uppercase border-b border-black pb-2 mb-4">DADOS DO SOLICITANTE</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nome Completo</p>
              <p className="font-bold text-black">{emprestimo.nome_solicitante}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Secretaria/Órgão</p>
              <p className="font-bold text-black">{emprestimo.secretaria}</p>
            </div>
          </div>
        </section>

        {/* Condições do Empréstimo */}
        <section className="mb-8">
          <h2 className="section-title text-lg font-bold uppercase border-b border-black pb-2 mb-4">CONDIÇÕES DO EMPRÉSTIMO</h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Data de Retirada</p>
              <p className="font-bold text-black">{format(new Date(emprestimo.data_retirada), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Prazo de Devolução</p>
              <p className="font-bold text-black">{format(new Date(emprestimo.prazo_devolucao), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Técnico Responsável</p>
            <p className="font-bold text-black">{emprestimo.tecnico_responsavel}</p>
          </div>
        </section>

        {/* Termos de Responsabilidade */}
        <section className="mb-10">
          <h2 className="section-title text-lg font-bold uppercase border-b border-black pb-2 mb-4">TERMOS DE RESPONSABILIDADE</h2>
          <div className="text-sm text-black space-y-2 leading-relaxed">
            <p>• O solicitante se responsabiliza pelo cuidado e uso adequado do equipamento;</p>
            <p>• O equipamento deve ser devolvido na data estipulada e em perfeitas condições;</p>
            <p>• Qualquer dano ou perda será de responsabilidade do solicitante;</p>
            <p>• O uso do equipamento deve ser exclusivamente para atividades relacionadas ao trabalho;</p>
            <p>• É vedado o empréstimo do equipamento para terceiros;</p>
            <p>• Em caso de problemas técnicos, o solicitante deve contatar imediatamente o setor de TI.</p>
          </div>
        </section>

        {/* Seção de Devolução */}
        <section className="mb-10 break-page">
          <h2 className="section-title text-lg font-bold uppercase border-b border-black pb-2 mb-6">REGISTRO DE DEVOLUÇÃO</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Data de Devolução</p>
              <div className="border-b border-black pb-1 mb-4 min-h-6">
                {emprestimo.data_devolucao ? format(new Date(emprestimo.data_devolucao), 'dd/MM/yyyy', { locale: ptBR }) : '____/____/________'}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Situação do Equipamento</p>
              <div className="border-b border-black pb-1 mb-4 min-h-6">
                {emprestimo.situacao_devolucao ? 
                  (emprestimo.situacao_devolucao === 'bom' ? 'Bom Estado' : 
                   emprestimo.situacao_devolucao === 'avariado' ? 'Avariado' : 'Necessita Manutenção') 
                  : '____________________________'}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Observações sobre a Devolução</p>
            <div className="border border-black p-4 min-h-20 bg-white">
              <p className="text-sm text-black">{emprestimo.observacoes_devolucao || ''}</p>
            </div>
          </div>

          {emprestimo.termo_url && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Termo de Devolução</p>
              <p className="text-sm text-black">✓ Termo de devolução assinado em anexo</p>
            </div>
          )}
        </section>

        {/* Assinaturas */}
        <section className="signature-section">
          <div className="grid grid-cols-2 gap-16">
            <div className="text-center">
              <div className="signature-line">
                <p className="font-bold text-black">Solicitante</p>
                <p className="text-sm text-gray-700 mt-1">{emprestimo.nome_solicitante}</p>
                <p className="text-xs text-gray-600 mt-1">{emprestimo.secretaria}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="signature-line">
                <p className="font-bold text-black">Técnico Responsável</p>
                <p className="text-sm text-gray-700 mt-1">{emprestimo.tecnico_responsavel}</p>
                <p className="text-xs text-gray-600 mt-1">Setor de Tecnologia da Informação</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-xs text-gray-600">
            PREFEITURA MUNICIPAL DE RIBEIRÃO DAS NEVES - Setor de Tecnologia da Informação
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </footer>
      </div>
    </div>
  );
}