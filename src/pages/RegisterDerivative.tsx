import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useContracts } from '../contexts/ContractsContext';
import { useStory } from '../contexts/StoryContext';

interface FormData {
  originalTokenId: string;
  derivativeTokenId: string;
  mintDerivative: boolean;
  price: string;
  listOnMarketplace: boolean;
  name: string;
  description: string;
  contentHash: string;
  useStoryProtocol: boolean;
}

function RegisterDerivative() {
  const { isConnected } = useWeb3();
  const { mintNft, registerDerivative, listDerivative } = useContracts();
  const { registerIpAsset } = useStory();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    originalTokenId: '',
    derivativeTokenId: '',
    mintDerivative: true,
    price: '0.01',
    listOnMarketplace: false,
    name: '',
    description: '',
    contentHash: '',
    useStoryProtocol: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const originalTokenId = parseInt(formData.originalTokenId);
      const derivativeTokenId = parseInt(formData.derivativeTokenId);
      
      // Validate inputs
      if (isNaN(originalTokenId) || isNaN(derivativeTokenId)) {
        throw new Error('Invalid token IDs');
      }
      
      // 1. Mint derivative NFT if requested
      if (formData.mintDerivative) {
        const mintSuccess = await mintNft(derivativeTokenId);
        if (!mintSuccess) {
          throw new Error('Failed to mint derivative NFT');
        }
      }
      
      // 2. Register the derivative
      if (formData.useStoryProtocol) {
        // Register via Story Protocol
        if (!formData.name || !formData.contentHash) {
          throw new Error('Name and content hash are required for Story Protocol registration');
        }
        
        const ipAssetId = await registerIpAsset(
          formData.name,
          formData.description,
          formData.contentHash
        );
        
        if (!ipAssetId) {
          throw new Error('Failed to register IP asset with Story Protocol');
        }
      } else {
        // Register via custom contract
        const registrationSuccess = await registerDerivative(originalTokenId, derivativeTokenId);
        if (!registrationSuccess) {
          throw new Error('Failed to register derivative');
        }
      }
      
      // 3. List on marketplace if requested
      if (formData.listOnMarketplace) {
        const priceInEth = parseFloat(formData.price);
        if (isNaN(priceInEth)) {
          throw new Error('Invalid price');
        }
        
        const priceInWei = BigInt(priceInEth * 1e18);
        const listSuccess = await listDerivative(derivativeTokenId, priceInWei);
        
        if (!listSuccess) {
          throw new Error('Failed to list derivative on marketplace');
        }
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p>Please connect your wallet to register derivative NFTs</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register a Derivative NFT</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>Derivative successfully registered!</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Registration Method</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useStoryProtocol"
              name="useStoryProtocol"
              checked={formData.useStoryProtocol}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="useStoryProtocol">Use Story Protocol</label>
          </div>
        </div>

        {formData.useStoryProtocol ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Story Protocol Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content Hash</label>
              <input
                type="text"
                name="contentHash"
                value={formData.contentHash}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="0x..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Content hash of the derivative work (IPFS CID or other hash)
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Derivative Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Original NFT Token ID</label>
              <input
                type="number"
                name="originalTokenId"
                value={formData.originalTokenId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Derivative NFT Token ID</label>
              <input
                type="number"
                name="derivativeTokenId"
                value={formData.derivativeTokenId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Options</h3>
          
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="mintDerivative"
              name="mintDerivative"
              checked={formData.mintDerivative}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="mintDerivative">Mint New Derivative NFT</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="listOnMarketplace"
              name="listOnMarketplace"
              checked={formData.listOnMarketplace}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="listOnMarketplace">List on Marketplace</label>
          </div>
          
          {formData.listOnMarketplace && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Price (ETH)</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-md font-medium"
        >
          {loading ? 'Processing...' : 'Register Derivative'}
        </button>
      </form>
    </div>
  );
}

export default RegisterDerivative;