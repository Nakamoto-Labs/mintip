import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';
import { createPublicClient, http, parseAbi, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

// ABI definitions
const testNftAbi = parseAbi([
  'function mint(uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function transferFrom(address from, address to, uint256 tokenId)',
]);

const licenseManagerAbi = parseAbi([
  'function setLicense(address _nftContract, uint256 _tokenId, uint256 _royaltyPercentage)',
  'function registerDerivative(address _originalContract, uint256 _originalTokenId, address _derivativeContract, uint256 _derivativeTokenId)',
  'function getLicense(address _nftContract, uint256 _tokenId) view returns (address owner, uint256 royaltyPercentage, bool isActive)',
  'function getDerivative(address _derivativeContract, uint256 _derivativeTokenId) view returns (address originalContract, uint256 originalTokenId)',
]);

const marketplaceAbi = parseAbi([
  'function listDerivative(uint256 _derivativeTokenId, uint256 _price)',
  'function buyDerivative(uint256 _derivativeTokenId) payable',
  'function getListings() view returns (uint256[] memory, uint256[] memory)',
]);

// Contract addresses - these would come from environment variables or config
interface ContractAddresses {
  testNft: `0x${string}` | null;
  licenseManager: `0x${string}` | null;
  marketplace: `0x${string}` | null;
}

const defaultAddresses: ContractAddresses = {
  testNft: process.env.REACT_APP_TEST_NFT_ADDRESS as `0x${string}` || null,
  licenseManager: process.env.REACT_APP_LICENSE_MANAGER_ADDRESS as `0x${string}` || null,
  marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS as `0x${string}` || null,
};

// Context type
interface ContractsContextType {
  addresses: ContractAddresses;
  setAddresses: React.Dispatch<React.SetStateAction<ContractAddresses>>;
  mintNft: (tokenId: number) => Promise<boolean>;
  setLicense: (tokenId: number, royaltyPercentage: number) => Promise<boolean>;
  registerDerivative: (originalTokenId: number, derivativeTokenId: number) => Promise<boolean>;
  listDerivative: (tokenId: number, price: bigint) => Promise<boolean>;
  buyDerivative: (tokenId: number, price: bigint) => Promise<boolean>;
  getListings: () => Promise<{ tokenIds: number[], prices: bigint[] }>;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
}

export function ContractsProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useWeb3();
  const [addresses, setAddresses] = useState<ContractAddresses>(defaultAddresses);

  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  // Create wallet client to interact with browser wallet
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const setupWalletClient = async () => {
      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
      setWalletClient(client);
    };

    setupWalletClient();
  }, [isConnected]);

  // Mint an NFT
  const mintNft = async (tokenId: number): Promise<boolean> => {
    if (!isConnected || !address || !walletClient || !addresses.testNft) return false;

    try {
      const hash = await walletClient.writeContract({
        address: addresses.testNft,
        abi: testNftAbi,
        functionName: 'mint',
        args: [BigInt(tokenId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Error minting NFT:', error);
      return false;
    }
  };

  // Set a license for an NFT
  const setLicense = async (tokenId: number, royaltyPercentage: number): Promise<boolean> => {
    if (!isConnected || !address || !walletClient || !addresses.licenseManager || !addresses.testNft) return false;

    try {
      const hash = await walletClient.writeContract({
        address: addresses.licenseManager,
        abi: licenseManagerAbi,
        functionName: 'setLicense',
        args: [addresses.testNft, BigInt(tokenId), BigInt(royaltyPercentage)],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Error setting license:', error);
      return false;
    }
  };

  // Register a derivative NFT
  const registerDerivative = async (originalTokenId: number, derivativeTokenId: number): Promise<boolean> => {
    if (!isConnected || !address || !walletClient || !addresses.licenseManager || !addresses.testNft) return false;

    try {
      const hash = await walletClient.writeContract({
        address: addresses.licenseManager,
        abi: licenseManagerAbi,
        functionName: 'registerDerivative',
        args: [addresses.testNft, BigInt(originalTokenId), addresses.testNft, BigInt(derivativeTokenId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Error registering derivative:', error);
      return false;
    }
  };

  // List a derivative NFT on the marketplace
  const listDerivative = async (tokenId: number, price: bigint): Promise<boolean> => {
    if (!isConnected || !address || !walletClient || !addresses.marketplace) return false;

    try {
      const hash = await walletClient.writeContract({
        address: addresses.marketplace,
        abi: marketplaceAbi,
        functionName: 'listDerivative',
        args: [BigInt(tokenId), price],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Error listing derivative:', error);
      return false;
    }
  };

  // Buy a derivative NFT from the marketplace
  const buyDerivative = async (tokenId: number, price: bigint): Promise<boolean> => {
    if (!isConnected || !address || !walletClient || !addresses.marketplace) return false;

    try {
      const hash = await walletClient.writeContract({
        address: addresses.marketplace,
        abi: marketplaceAbi,
        functionName: 'buyDerivative',
        args: [BigInt(tokenId)],
        value: price,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (error) {
      console.error('Error buying derivative:', error);
      return false;
    }
  };

  // Get all listings from the marketplace
  const getListings = async (): Promise<{ tokenIds: number[], prices: bigint[] }> => {
    if (!addresses.marketplace) return { tokenIds: [], prices: [] };

    try {
      const result = await publicClient.readContract({
        address: addresses.marketplace,
        abi: marketplaceAbi,
        functionName: 'getListings',
      }) as [bigint[], bigint[]];

      return {
        tokenIds: result[0].map(id => Number(id)),
        prices: result[1],
      };
    } catch (error) {
      console.error('Error getting listings:', error);
      return { tokenIds: [], prices: [] };
    }
  };

  const value = {
    addresses,
    setAddresses,
    mintNft,
    setLicense,
    registerDerivative,
    listDerivative,
    buyDerivative,
    getListings,
  };

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
}