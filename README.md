# MinTip

MinTip is a decentralized platform for managing intellectual property assets related to NFTs. It provides a framework for registering derivative works, establishing royalty frameworks, and ensuring creators get compensated when derivatives of their work are sold.

## Features

- **Web3 Integration**: Connect to Ethereum-based networks with MetaMask and other wallet providers
- **NFT Licensing**: Set royalty terms for derivative works based on your original NFTs
- **Derivative Registration**: Register derivative NFTs properly to respect IP rights
- **Marketplace**: Buy and sell derivative NFTs with automatic royalty distribution
- **Story Protocol Integration**: Manage IP assets using Story Protocol's advanced framework

## Technologies

- **Frontend**: React, TypeScript, Wagmi, Viem
- **Smart Contracts**: Solidity, Foundry
- **IP Management**: Story Protocol SDK
- **Development**: Foundry for contract testing and deployment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Foundry (for smart contract development)
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Nakamoto-Labs/mintip.git
   cd mintip
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_TEST_NFT_ADDRESS=<your_deployed_test_nft_address>
   REACT_APP_LICENSE_MANAGER_ADDRESS=<your_deployed_license_manager_address>
   REACT_APP_MARKETPLACE_ADDRESS=<your_deployed_marketplace_address>
   REACT_APP_WALLETCONNECT_PROJECT_ID=<your_walletconnect_project_id>
   ```

4. Start the development server:
   ```
   yarn start
   ```

### Smart Contract Deployment

1. Deploy contracts to a testnet:
   ```
   yarn compile-contracts
   yarn deploy-contracts
   ```

## Architecture

MinTip consists of three main components:

1. **Smart Contracts**: Solidity contracts that handle royalty enforcement, NFT licensing, and marketplace functionality
2. **Frontend Application**: React/TypeScript app that provides a user interface for interacting with the contracts
3. **Story Protocol Integration**: Connection to Story Protocol for enhanced IP management

## License

[MIT License](LICENSE)