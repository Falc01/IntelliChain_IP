"use client";

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../config/idl.json';

export const IPForm = () => {
    const wallet = useWallet();
    const { connected, publicKey, signTransaction } = wallet;
    const { connection } = useConnection();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'approved' | 'pending' | 'error' | 'registering' | 'success'>('idle');
    const [similarity, setSimilarity] = useState<number | null>(null);
    const [contentHash, setContentHash] = useState<string>('');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setStatus('analyzing');
        const generatedHash = "hash_" + Date.now().toString();
        setContentHash(generatedHash);

        try {
            const response = await fetch('http://localhost:8000/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    metadata: { 
                        author: publicKey?.toBase58(), 
                        title: title,
                        content_hash: generatedHash
                    }
                })
            });

            const data = await response.json();
            setAnalysisData(data); // Guarda tudo para o momento do clique no botão Pagar

            if (data.status === 'APPROVED') {
                setStatus('approved');
                setSimilarity(data.similarity_score);
            } else if (data.status === 'PENDING') {
                setStatus('pending');
                setSimilarity(data.similarity_score);
            } else if (data.status === 'REJECTED') {
                setStatus('error');
                setSimilarity(data.similarity_score);
            }
        } catch (error) {
            console.error("Erro ao verificar IP:", error);
            setStatus('error');
        }
    };

    const registerOnChain = async () => {
        if (!publicKey || !signTransaction || !analysisData) return;
        
        try {
            setStatus('registering');

            // 1. Seguir com a transação na Solana PRIMEIRO
            const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "processed" });
            const program = new Program(idl as any, provider);
            const copyrightAccount = web3.Keypair.generate();

            const tx = await program.methods
                .registerCopyright(contentHash, title || "Sem Título", status === 'pending')
                .accounts({
                    copyrightAccount: copyrightAccount.publicKey,
                    user: publicKey,
                    systemProgram: web3.SystemProgram.programId,
                } as any)
                .signers([copyrightAccount])
                .rpc();

            console.log("Transação confirmada na Solana:", tx);
            setTxHash(tx);

            // 2. AGORA SIM, criar o registro no MongoDB com o hash real
            await fetch('http://localhost:8000/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...analysisData.metadata,
                    content: analysisData.content,
                    embedding: analysisData.embedding,
                    similarity_score: analysisData.similarity_score,
                    tx_hash: tx // O hash real da blockchain
                })
            });

            setStatus('success');
        } catch (error) {
            console.error("Erro na transação:", error);
            alert("Erro ao registrar na Solana. Verifique seu saldo ou o Phantom.");
            setStatus('approved'); // Volta para o estado de aprovação para tentar de novo
        }
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
                        <label className="text-sm font-medium text-gray-300">Título do IP</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            placeholder="Ex: Novo Algoritmo de Compressão"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={status !== 'idle' && status !== 'error'}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Conteúdo do IP</label>
                        <textarea
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Descreva sua patente, música, código ou obra de arte detalhadamente..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={status !== 'idle' && status !== 'error'}
                            required
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
                    {status === 'error' && similarity && similarity > 0.99 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-6 h-6 text-rose-500" />
                                <h3 className="text-lg font-bold text-white">REJEIÇÃO CRÍTICA</h3>
                            </div>
                            <p className="text-sm text-gray-300">
                                Nossa IA detectou que este conteúdo é **{(similarity! * 100).toFixed(2)}% idêntico** a uma obra anteriormente rejeitada por plágio. 
                                O registro foi bloqueado permanentemente por violação das diretrizes.
                            </p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="mt-4 text-xs text-rose-400 hover:underline"
                            >
                                Tentar outro conteúdo
                            </button>
                        </motion.div>
                    )}

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
                            <button 
                                onClick={registerOnChain}
                                disabled={status === 'registering'}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                            >
                                {status === 'registering' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {status === 'registering' ? 'Aprovando Transação...' : 'Registrar na Solana (0.002 SOL)'}
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
                            <p className="text-sm text-gray-300 mb-6">
                                Detectamos uma similaridade de **{(similarity! * 100).toFixed(2)}%** com registros existentes.
                                Seu IP precisa de **Validação Humana** para ser certificado.
                            </p>
                            <button 
                                onClick={registerOnChain}
                                disabled={status === 'registering'}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                            >
                                {status === 'registering' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {status === 'registering' ? 'Gerando registro pendente...' : 'Pagar taxa e enviar para Auditoria (0.002 SOL)'}
                            </button>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                                <h3 className="text-lg font-bold text-white">Registro Concluído!</h3>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">
                                Seu IP foi gravado eternamente na blockchain da Solana.
                            </p>
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
                                <p className="text-xs text-gray-400 mb-1">Hash da Transação:</p>
                                <a 
                                    href={`https://explorer.solana.com/tx/${txHash}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-400 hover:text-indigo-300 break-all transition-colors underline"
                                >
                                    {txHash}
                                </a>
                            </div>
                            <button 
                                onClick={() => {
                                    setStatus('idle');
                                    setContent('');
                                    setTitle('');
                                    setTxHash(null);
                                }}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
                            >
                                Registrar Novo IP
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
