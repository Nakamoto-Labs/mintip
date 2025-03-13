// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../TestNFT.sol";
import "../NFTLicenseManager.sol";
import "../DerivativeMarketplace.sol";

contract DeployMintip is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy test NFT contract
        TestNFT testNFT = new TestNFT();
        
        // Deploy license manager
        NFTLicenseManager licenseManager = new NFTLicenseManager();
        
        // Deploy marketplace
        DerivativeMarketplace marketplace = new DerivativeMarketplace(
            licenseManager,
            address(testNFT)
        );

        vm.stopBroadcast();

        console.log("TestNFT deployed at:", address(testNFT));
        console.log("NFTLicenseManager deployed at:", address(licenseManager));
        console.log("DerivativeMarketplace deployed at:", address(marketplace));
    }
}