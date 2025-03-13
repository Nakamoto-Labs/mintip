import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

function Home() {
  const { isConnected, connect } = useWeb3();

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to MinTip</h1>
        <p className="text-xl mb-8">
          Create, license, and trade derivative NFTs with automatic royalty enforcement
        </p>
        
        {!isConnected ? (
          <button 
            onClick={connect}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-md font-medium text-lg"
          >
            Connect Wallet to Start
          </button>
        ) : (
          <div className="flex justify-center space-x-6">
            <Link 
              to="/register-derivative" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md font-medium"
            >
              Register Derivative
            </Link>
            <Link 
              to="/marketplace" 
              className="bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-md font-medium"
            >
              Browse Marketplace
            </Link>
          </div>
        )}
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Create NFTs</h3>
          <p>Mint original NFTs and set royalty terms for derivatives</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Register Derivatives</h3>
          <p>Create derivative works and register them properly to respect IP rights</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Trade With Confidence</h3>
          <p>Buy and sell derivative NFTs with automatic royalty distribution</p>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Powered By</h2>
        <div className="flex justify-center items-center space-x-8">
          <div>
            <h3 className="text-lg font-medium">Story Protocol</h3>
            <p className="text-sm opacity-70">IP Management</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">NFT Licensing</h3>
            <p className="text-sm opacity-70">Smart Contracts</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;