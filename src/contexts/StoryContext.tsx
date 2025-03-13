import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';

type StoryContextType = {
  client: StoryClient | null;
  loading: boolean;
  registerIpAsset: (name: string, description: string, contentHash: string) => Promise<string | null>;
  getIpAssets: () => Promise<any[]>;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useWeb3();
  const [client, setClient] = useState<StoryClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setClient(null);
      setLoading(false);
      return;
    }

    const initializeClient = async () => {
      try {
        setLoading(true);
        
        // Setup Story Protocol client
        const config: StoryConfig = {
          // Using Aeneid testnet
          transport: http('https://sepolia-testnet.story.xyz'),
          account: address as `0x${string}`,
        };

        const storyClient = StoryClient.create(config);
        setClient(storyClient);
      } catch (error) {
        console.error('Error initializing Story Protocol client:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, [isConnected, address]);

  // Register an IP asset
  const registerIpAsset = async (name: string, description: string, contentHash: string) => {
    if (!client || !address) return null;
    
    try {
      const response = await client.ipAsset.register({
        name,
        description,
        contentHash,
        registrant: address as `0x${string}`,
      });
      
      return response.ipAssetId;
    } catch (error) {
      console.error('Error registering IP asset:', error);
      return null;
    }
  };

  // Get IP assets
  const getIpAssets = async () => {
    if (!client || !address) return [];
    
    try {
      const response = await client.ipAsset.getByOwner({
        owner: address as `0x${string}`,
      });
      
      return response;
    } catch (error) {
      console.error('Error getting IP assets:', error);
      return [];
    }
  };

  const value = {
    client,
    loading,
    registerIpAsset,
    getIpAssets,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}