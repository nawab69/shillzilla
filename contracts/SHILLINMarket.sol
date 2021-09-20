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
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SHILLINMarket is ReentrancyGuard {
    using SafeMath for uint;
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice;
    
    constructor() {
        owner = payable(msg.sender);
    }
    
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }
    
    mapping(uint256 => MarketItem) private idToMarketItem;
    
    event MarketItemListed (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );
    
    function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
        return idToMarketItem[marketItemId];
    }
    
    function listOnMarket(address nftContract, uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        payable(owner).transfer(listingPrice);
        idToMarketItem[itemId] =  MarketItem(
          itemId,
          nftContract,
          tokenId,
          payable(msg.sender),
          payable(address(0)),
          price
        );
    
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
        emit MarketItemListed(
          itemId,
          nftContract,
          tokenId,
          msg.sender,
          address(0),
          price
        );
    }

    function buy( address nftContract, uint256 itemId) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(idToMarketItem[itemId].owner == address(0), "Already Sold");
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
    }
  
  

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
          if (idToMarketItem[i + 1].owner == address(0)) {
            uint currentId = idToMarketItem[i + 1].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
          }
        }
        return items;
    }
  
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
    
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToMarketItem[i + 1].owner == msg.sender) {
            itemCount += 1;
          }
        }
    
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToMarketItem[i + 1].owner == msg.sender) {
            uint currentId = idToMarketItem[i + 1].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
          }
        }
        return items;
    }
    
    function fetchMyListedNFT() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
    
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToMarketItem[i + 1].seller == msg.sender) {
            itemCount += 1;
          }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToMarketItem[i + 1].seller == msg.sender) {
            uint currentId = idToMarketItem[i + 1].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
          }
        }
        return items;
        
    }
  
  

}