/***
 * ░▒█▀▀▀█░▒█░▒█░▀█▀░▒█░░░░▒█░░░░▀█▀░▒█▄░▒█
 * ░░▀▀▀▄▄░▒█▀▀█░▒█░░▒█░░░░▒█░░░░▒█░░▒█▒█▒█
 * ░▒█▄▄▄█░▒█░▒█░▄█▄░▒█▄▄█░▒█▄▄█░▄█▄░▒█░░▀█
 * Written by Nawab Khairuzzaman Mohammad Kibria
 * Github Url : https://github.com/nawab69
 */

// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC2981.sol";

contract SHILLIN is ERC721URIStorage, ERC2981,  ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private totalMinted;
    address admin;
    address marketplaceContract;

    constructor() ERC721("SHILLIN", "SHILL") ERC2981() {
        admin = msg.sender;
    }

    function mint(string memory _tokenURI, uint _royalityPercentage) external nonReentrant
    {
        require( bytes(_tokenURI).length > 0 ,'needs token uri');
        totalMinted.increment();
        uint256 newItemId = totalMinted.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        _setReceiver(newItemId,msg.sender);
        _setRoyaltyPercentage(newItemId,_royalityPercentage);
        if(marketplaceContract != address(0)){
            setApprovalForAll(marketplaceContract, true);
        }
    }
    
    function burn(uint tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "caller is not owner nor approved");
        _burn(tokenId);
    }
    
    function setMarketPlace(address _marketplaceContract) public onlyAdmin() {
        marketplaceContract = _marketplaceContract;
    }
    
    function changeAdmin(address _adminAddress) public onlyAdmin() {
        admin = _adminAddress;
    }
    
    
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    
    function totalSupply() external  view  returns (uint256) {
        return totalMinted.current();
    }

    
}