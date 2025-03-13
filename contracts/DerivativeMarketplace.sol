// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTLicenseManager.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DerivativeMarketplace {
    NFTLicenseManager public licenseManager;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    uint256[] public listedTokenIds;
    address public testNFTContract; // Hardcoded for prototype

    constructor(NFTLicenseManager _licenseManager, address _testNFTContract) {
        licenseManager = _licenseManager;
        testNFTContract = _testNFTContract;
    }

    function listDerivative(uint256 _derivativeTokenId, uint256 _price) public {
        address seller = IERC721(testNFTContract).ownerOf(_derivativeTokenId);
        require(msg.sender == seller, "Only owner can list");
        listings[testNFTContract][_derivativeTokenId] = Listing(seller, _price);
        listedTokenIds.push(_derivativeTokenId);
    }

    function buyDerivative(uint256 _derivativeTokenId) public payable {
        Listing memory listing = listings[testNFTContract][_derivativeTokenId];
        require(listing.price > 0, "Not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        NFTLicenseManager.Derivative memory derivative = licenseManager
            .getDerivative(testNFTContract, _derivativeTokenId);
        require(
            derivative.originalContract != address(0),
            "Derivative not registered"
        );

        NFTLicenseManager.License memory license = licenseManager.getLicense(
            derivative.originalContract,
            derivative.originalTokenId
        );
        uint256 royaltyAmount = (listing.price * license.royaltyPercentage) /
            100;
        uint256 sellerAmount = listing.price - royaltyAmount;

        payable(license.owner).transfer(royaltyAmount);
        payable(listing.seller).transfer(sellerAmount);

        IERC721(testNFTContract).transferFrom(
            listing.seller,
            msg.sender,
            _derivativeTokenId
        );

        delete listings[testNFTContract][_derivativeTokenId];
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listedTokenIds[i] == _derivativeTokenId) {
                listedTokenIds[i] = listedTokenIds[listedTokenIds.length - 1];
                listedTokenIds.pop();
                break;
            }
        }
    }

    function getListings()
        public
        view
        returns (uint256[] memory, uint256[] memory)
    {
        uint256[] memory tokenIds = new uint256[](listedTokenIds.length);
        uint256[] memory prices = new uint256[](listedTokenIds.length);
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            tokenIds[i] = listedTokenIds[i];
            prices[i] = listings[testNFTContract][listedTokenIds[i]].price;
        }
        return (tokenIds, prices);
    }
}
