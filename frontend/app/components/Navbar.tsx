"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Shield } from 'lucide-react';

// Import dinâmico para evitar erros de Hydration com a carteira
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const Navbar = () => {
    return (
        <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-indigo-500" />
                        <Link href="/" className="text-xl font-bold tracking-tight text-white">
                            IntelliChain <span className="text-indigo-500">IP</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                        <Link href="#" className="hover:text-white transition-colors">Documentação</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <WalletMultiButtonDynamic className="!bg-indigo-600 hover:!bg-indigo-700 !transition-all !rounded-lg !h-10 !text-sm" />
                    </div>
                </div>
            </div>
        </nav>
    );
};
