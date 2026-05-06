"use client";

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Importar o CSS padrão do componente de modal da carteira
// Configurações de rede e carteira Solana

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Definimos a rede (Devnet para testes)
    const network = WalletAdapterNetwork.Devnet;

    // Você pode fornecer um endpoint RPC personalizado aqui
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // Carteiras suportadas
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
