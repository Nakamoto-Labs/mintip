// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTLicenseManager {
    struct License {
        address owner;
        uint256 royaltyPercentage;
        bool isActive;
    }

    struct Derivative {
        address originalContract;
        uint256 originalTokenId;
    }

    mapping(address => mapping(uint256 => License)) public licenses;
    mapping(address => mapping(uint256 => Derivative)) public derivatives;
    address public platformAddress;

    constructor() {
        platformAddress = msg.sender;
    }

    function setLicense(
        address _nftContract,
        uint256 _tokenId,
        uint256 _royaltyPercentage
    ) public {
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Only NFT owner can set license"
        );
        require(_royaltyPercentage <= 100, "Royalty percentage must be <= 100");
        licenses[_nftContract][_tokenId] = License(
            msg.sender,
            _royaltyPercentage,
            true
        );
    }

    function registerDerivative(
        address _originalContract,
        uint256 _originalTokenId,
        address _derivativeContract,
        uint256 _derivativeTokenId
    ) public {
        require(
            IERC721(_derivativeContract).ownerOf(_derivativeTokenId) ==
                msg.sender,
            "Only derivative owner can register"
        );
        require(
            licenses[_originalContract][_originalTokenId].isActive,
            "License not active"
        );
        derivatives[_derivativeContract][_derivativeTokenId] = Derivative(
            _originalContract,
            _originalTokenId
        );
    }

    function getLicense(
        address _nftContract,
        uint256 _tokenId
    ) public view returns (License memory) {
        return licenses[_nftContract][_tokenId];
    }

    function getDerivative(
        address _derivativeContract,
        uint256 _derivativeTokenId
    ) public view returns (Derivative memory) {
        return derivatives[_derivativeContract][_derivativeTokenId];
    }
}
