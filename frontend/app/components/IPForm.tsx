"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const IPForm = () => {
    const { connected, publicKey } = useWallet();
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'approved' | 'pending' | 'error'>('idle');
    const [similarity, setSimilarity] = useState<number | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setStatus('analyzing');

        // Simulação de chamada ao backend (Mock)
        setTimeout(() => {
            // Lógica de mock: se o texto tiver mais de 100 caracteres, vamos simular uma pendência
            // apenas para mostrar o fluxo. Caso contrário, aprovado.
            if (content.length > 200) {
                setStatus('pending');
                setSimilarity(0.92);
            } else {
                setStatus('approved');
                setSimilarity(0.04);
            }
        }, 2500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Novo Registro de IP</h2>
                        <p className="text-sm text-gray-400">Preencha os dados da sua criação para análise.</p>
                    </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    {/* Campo de Carteira Pública (Dono) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Endereço da Carteira (Dono do IP)</label>
                        <input
                            type="text"
                            readOnly
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-indigo-400 font-mono text-sm outline-none cursor-not-allowed"
                            value={connected && publicKey ? publicKey.toBase58() : 'Conecte sua carteira...'}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Conteúdo do IP</label>
                        <textarea
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Descreva sua patente, música, código ou obra de arte..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={status !== 'idle' && status !== 'error'}
                        />
                    </div>

                    {!connected ? (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-200/80">
                                Conecte sua carteira Solana para poder realizar o registro definitivo na blockchain.
                            </p>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            disabled={status !== 'idle' && status !== 'error' || !content}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                            {status === 'analyzing' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analisando com IA...
                                </>
                            ) : (
                                <>
                                    <Fingerprint className="w-5 h-5" />
                                    Verificar Unicidade
                                </>
                            )}
                        </button>
                    )}
                </form>

                <AnimatePresence>
                    {status === 'approved' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                <h3 className="text-lg font-bold text-white">Conteúdo Único Aprovado!</h3>
                            </div>
                            <p className="text-sm text-gray-300 mb-6">
                                Nossa IA verificou que este conteúdo é original (Similaridade: {(similarity! * 100).toFixed(2)}%).
                                Você já pode registrá-lo na rede Solana.
                            </p>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all">
                                Registrar na Solana (0.002 SOL)
                            </button>
                        </motion.div>
                    )}

                    {status === 'pending' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                <h3 className="text-lg font-bold text-white">Análise de Similaridade Alta</h3>
                            </div>
                            <p className="text-sm text-gray-300">
                                Detectamos uma similaridade de **{(similarity! * 100).toFixed(2)}%** com registros existentes.
                                Sua solicitação foi enviada para **Validação Humana**. Você será notificado em breve.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Tentar outro conteúdo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
