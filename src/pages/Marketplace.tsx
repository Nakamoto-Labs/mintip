import React, { useEffect, useState } from 'react';
import { useContracts } from '../contexts/ContractsContext';
import { useWeb3 } from '../contexts/Web3Context';

interface NFTListing {
  id: number;
  price: bigint;
}

function Marketplace() {
  const { isConnected } = useWeb3();
  const { getListings, buyDerivative } = useContracts();
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  // Load listings when component mounts
  useEffect(() => {
    if (!isConnected) return;
    loadListings();
  }, [isConnected]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const { tokenIds, prices } = await getListings();
      const formattedListings = tokenIds.map((id, index) => ({
        id,
        price: prices[index],
      }));
      setListings(formattedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing: NFTListing) => {
    if (!isConnected) return;
    
    setBuyingId(listing.id);
    try {
      await buyDerivative(listing.id, listing.price);
      await loadListings(); // Refresh listings after purchase
    } catch (error) {
      console.error('Error buying NFT:', error);
    } finally {
      setBuyingId(null);
    }
  };

  // Format price from wei to ETH
  const formatPrice = (priceInWei: bigint) => {
    return (Number(priceInWei) / 1e18).toFixed(4);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p>Please connect your wallet to browse the marketplace</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Derivative NFT Marketplace</h2>
        <button 
          onClick={loadListings}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Listings'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading marketplace listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No Listings Available</h3>
          <p className="text-gray-600">There are currently no NFTs listed for sale</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">NFT #{listing.id}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2">Derivative NFT #{listing.id}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-bold text-lg">{formatPrice(listing.price)} ETH</span>
                </div>
                
                <button
                  onClick={() => handleBuy(listing)}
                  disabled={buyingId === listing.id}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md font-medium"
                >
                  {buyingId === listing.id ? 'Buying...' : 'Buy Now'}
                </button>
                
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Royalties automatically paid to original creator
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;