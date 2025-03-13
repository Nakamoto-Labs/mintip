import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

function Header() {
  const { isConnected, address, connect, disconnect } = useWeb3();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-8">MinTip</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-200">Home</Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-blue-200">Marketplace</Link>
              </li>
              <li>
                <Link to="/register-derivative" className="hover:text-blue-200">Register Derivative</Link>
              </li>
              <li>
                <Link to="/ip-assets" className="hover:text-blue-200">My IP Assets</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div>
          {isConnected ? (
            <div className="flex items-center">
              <span className="mr-4 text-sm opacity-80">
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
              </span>
              <button 
                onClick={disconnect} 
                className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connect} 
              className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;