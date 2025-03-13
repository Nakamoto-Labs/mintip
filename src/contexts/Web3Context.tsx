import React, { createContext, useContext, ReactNode } from 'react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { sepolia, baseSepolia, polygonMumbai } from 'wagmi/chains';
import { createStorage, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Story Protocol Aeneid network
const aeneid = {
  id: 1261,
  name: 'Aeneid',
  network: 'aeneid',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-testnet.story.xyz'],
    },
    public: {
      http: ['https://sepolia-testnet.story.xyz'],
    },
  },
};

// Create wagmi config
const config = createConfig({
  chains: [sepolia, baseSepolia, polygonMumbai, aeneid],
  connectors: [
    injected(),
    metaMask(),
    safe(),
    walletConnect({
      projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [aeneid.id]: http('https://sepolia-testnet.story.xyz'),
  },
});

// Create client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
    },
  },
  storage: createStorage({ storage: window.localStorage }),
});

// Create context
type Web3ContextType = {
  isConnected: boolean;
  address: string | undefined;
  connect: () => void;
  disconnect: () => void;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextInner>{children}</Web3ContextInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Web3ContextInner({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    connect({ connector: metaMask() });
  };

  const value = {
    isConnected,
    address,
    connect: connectWallet,
    disconnect,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}