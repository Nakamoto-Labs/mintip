import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useStory } from '../contexts/StoryContext';

interface IpAsset {
  ipAssetId: string;
  name: string;
  description: string;
  owner: string;
  contentHash: string;
  registrationDate: string;
}

function IpAssets() {
  const { isConnected } = useWeb3();
  const { getIpAssets } = useStory();
  const [assets, setAssets] = useState<IpAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      loadAssets();
    }
  }, [isConnected]);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getIpAssets();
      setAssets(response as unknown as IpAsset[]);
    } catch (err) {
      console.error('Error loading IP assets:', err);
      setError('Failed to load IP assets');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p>Please connect your wallet to view your IP assets</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My IP Assets</h2>
        <button 
          onClick={loadAssets}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p>Loading your IP assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No IP Assets Found</h3>
          <p className="text-gray-600">You haven't registered any IP assets yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assets.map((asset) => (
            <div key={asset.ipAssetId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">{asset.name}</h3>
                  <p className="text-gray-600 mb-4">{asset.description || 'No description'}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Registered: {formatDate(asset.registrationDate)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">IP Asset ID</h4>
                  <p className="font-mono text-sm break-all">{asset.ipAssetId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Owner</h4>
                  <p className="font-mono text-sm">{shortenAddress(asset.owner)}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500">Content Hash</h4>
                  <p className="font-mono text-sm break-all">{asset.contentHash}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IpAssets;