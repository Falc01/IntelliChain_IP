"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ShieldAlert, Check, X, UserCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

// LISTA DE ADMINISTRADORES AUTORIZADOS
// Adicione aqui a sua chave pública (Wallet Address)
const ADMIN_WHITELIST = [
    'BJBc6WdVA5sokqMqPWTxu8hk9UnU3LDMk1ovFD89iw4T',
    '9akx1Qvi4RQ2cXNz1eig8gSGPBB1ko6u1pmukzdqX5eX',
];

const MOCK_PENDING_IPS = [
    // ... (mesmo conteúdo)
];

export default function AdminPage() {
    const { connected, publicKey } = useWallet();
    const [isAdmin, setIsAdmin] = useState(false);
    const [requests, setRequests] = useState([
        {
            id: '1',
            author: '0x71C...4a2',
            content: 'Projeto de arquitetura para casa sustentável usando materiais reciclados...',
            similarity: 0.89,
            date: '2026-05-05 18:30'
        },
        {
            id: '2',
            author: '0x92B...1e5',
            content: 'Algoritmo de consenso baseado em prova de reputação para redes...',
            similarity: 0.94,
            date: '2026-05-05 19:12'
        }
    ]);

    useEffect(() => {
        if (connected && publicKey) {
            const pubKeyString = publicKey.toBase58();
            setIsAdmin(ADMIN_WHITELIST.includes(pubKeyString));
        } else {
            setIsAdmin(false);
        }
    }, [connected, publicKey]);

    // Tela de Acesso Negado
    if (!connected || !isAdmin) {
        return (
            <main className="min-h-screen bg-[#0a0a0b]">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
                    <div className="p-6 bg-rose-500/10 rounded-full mb-6">
                        <Lock className="w-12 h-12 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
                    <p className="text-gray-400 max-w-md">
                        Esta área é exclusiva para administradores autorizados.
                        Por favor, conecte uma carteira com permissões administrativas.
                    </p>
                    {connected && (
                        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-gray-500">
                            Sua carteira: {publicKey?.toBase58()}
                        </div>
                    )}
                </div>
            </main>
        );
    }

    const resolveRequest = (id: string, decision: 'approved' | 'rejected') => {
        setRequests(requests.filter(r => r.id !== id));
        alert(`Solicitação ${id} foi ${decision === 'approved' ? 'Aprovada' : 'Rejeitada'}`);
    };

    return (
        <main className="min-h-screen bg-[#0a0a0b]">
            <Navbar />

            <header className="pt-16 pb-8 px-4 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <UserCheck className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Painel de Curadoria</h1>
                            <p className="text-gray-400">Validação humana para registros com alta similaridade.</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium text-gray-300">
                        {requests.length} Pendências
                    </div>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-4 py-12">
                {requests.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Tudo limpo! Não há solicitações pendentes no momento.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((request) => (
                            <motion.div
                                key={request.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-mono text-indigo-400">
                                            <span>Autor: {request.author}</span>
                                            <span className="text-gray-600">•</span>
                                            <span>{request.date}</span>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed italic">
                                            "{request.content}"
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500"
                                                    style={{ width: `${request.similarity * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-amber-500">
                                                {(request.similarity * 100).toFixed(0)}% Similaridade
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-3 justify-end">
                                        <button
                                            onClick={() => resolveRequest(request.id, 'approved')}
                                            className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white px-6 py-3 rounded-xl transition-all font-bold border border-emerald-500/20"
                                        >
                                            <Check className="w-5 h-5" />
                                            Aprovar
                                        </button>
                                        <button
                                            onClick={() => resolveRequest(request.id, 'rejected')}
                                            className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white px-6 py-3 rounded-xl transition-all font-bold border border-rose-500/20"
                                        >
                                            <X className="w-5 h-5" />
                                            Rejeitar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
