"use client";

import React from 'react';
import { Navbar } from '../components/Navbar';
import { ShieldCheck, Cpu, Database, Wallet, FileSearch, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0b]">
            <Navbar />

            <header className="pt-24 pb-12 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Documentação</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Entenda como o IntelliChain IP combina IA e Blockchain para proteger a sua propriedade intelectual.
                </p>
            </header>

            <section className="max-w-5xl mx-auto px-4 py-12 space-y-16">
                
                {/* Visão Geral */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6" />
                            O que é o IntelliChain IP?
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            É uma plataforma descentralizada para registro de direitos autorais (IP). 
                            Diferente de cartórios tradicionais, usamos a blockchain **Solana** para prova de anterioridade imutável e **Inteligência Artificial** para garantir que o que você está registrando é realmente original.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <h3 className="font-bold text-white mb-4">Principais Benefícios:</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Custo 99% menor que registros tradicionais</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Prova de tempo imutável (Timestamp)</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Verificação automática contra plágio</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Painel de administração descentralizado</li>
                        </ul>
                    </div>
                </div>

                {/* Fluxo Técnico */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white text-center">Como Funciona o Fluxo</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Cpu className="w-6 h-6 text-purple-400" />,
                                title: "1. Análise por IA",
                                desc: "Seu conteúdo é transformado em vetores (embeddings) e comparado com todos os registros existentes no banco de dados."
                            },
                            {
                                icon: <Database className="w-6 h-6 text-blue-400" />,
                                title: "2. Verificação de Status",
                                desc: "A IA decide se o IP é Único (Aprovado), Similar (Pendência Humana) ou uma Burla (Rejeição Crítica)."
                            },
                            {
                                icon: <Wallet className="w-6 h-6 text-emerald-400" />,
                                title: "3. Registro On-chain",
                                desc: "Após o pagamento da taxa em SOL, os dados são gravados na rede Solana com um identificador de status."
                            }
                        ].map((step, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <div className="mb-4">{step.icon}</div>
                                <h4 className="font-bold text-white mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Arquitetura */}
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FileSearch className="w-6 h-6 text-indigo-400" />
                        Arquitetura Técnica
                    </h2>
                    <div className="space-y-4 text-sm text-gray-300">
                        <p><strong>Frontend:</strong> Next.js 15 com Tailwind CSS 4 para uma interface ultra-rápida e premium.</p>
                        <p><strong>Blockchain:</strong> Contrato inteligente (Program) escrito em Rust usando o Anchor Framework na rede Solana.</p>
                        <p><strong>IA Engine:</strong> Ollama rodando localmente o modelo <code>nomic-embed-text</code> para geração de vetores sem vazar dados para nuvens públicas.</p>
                        <p><strong>Backend:</strong> FastAPI em Python, gerenciando a comunicação entre a IA, o banco MongoDB e os metadados da aplicação.</p>
                    </div>
                </div>

            </section>

            <footer className="py-20 text-center text-gray-600 text-xs">
                &copy; 2026 IntelliChain IP - Documentação Técnica v1.0
            </footer>
        </main>
    );
}
