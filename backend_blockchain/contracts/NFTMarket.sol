//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _items;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.25 ether;

    enum OwnershipType {
        owner,
        seller,
        market
    }

    //Structs
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private marketItems;

    //events
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event MarketItemSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "sell price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "tx value must be equal to listing price"
        );

        _items.increment();
        uint256 itemId = _items.current();

        marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = marketItems[itemId].price;
        uint256 tokenId = marketItems[itemId].tokenId;
        require(
            msg.value == price,
            "please submit the asking price in order to complete the purchase"
        );

        marketItems[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        marketItems[itemId].owner = payable(msg.sender);
        marketItems[itemId].sold = true;
        _itemsSold.increment();

        payable(owner).transfer(listingPrice);

        emit MarketItemSold(itemId, nftContract, tokenId, msg.sender, price);
    }

    function fetchItemsByType(OwnershipType _ownershipType)
        private
        view
        returns (MarketItem[] memory)
    {
        uint256 itemCount = _items.current();
        uint256 soldItemCount = _itemsSold.current();
        uint256 unsoldItemCount = itemCount - soldItemCount;

        uint256 listItemCount = 0;
        uint256 arrItemIdx = 0;

        if (_ownershipType == OwnershipType.market) {
            listItemCount = unsoldItemCount;
        } else {
            for (uint256 i = 1; i <= itemCount; i++) {
                if (
                    (_ownershipType == OwnershipType.owner &&
                        marketItems[i].owner == msg.sender) ||
                    (_ownershipType == OwnershipType.seller &&
                        marketItems[i].seller == msg.sender)
                ) {
                    listItemCount++;
                }
            }
        }

        MarketItem[] memory arrItems = new MarketItem[](listItemCount);
        for (uint256 i = 1; i <= itemCount; i++) {
            if (
                (_ownershipType == OwnershipType.market &&
                    marketItems[i].owner == payable(address(0))) ||
                (_ownershipType == OwnershipType.owner &&
                    marketItems[i].owner == payable(msg.sender)) ||
                (_ownershipType == OwnershipType.seller &&
                    marketItems[i].seller == payable(msg.sender))
            ) {
                arrItems[arrItemIdx] = marketItems[i];
                arrItemIdx++;
            }
        }
        return arrItems;
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        return fetchItemsByType(OwnershipType.market);
    }

    function fetchMySellingItems() public view returns (MarketItem[] memory) {
        return fetchItemsByType(OwnershipType.seller);
    }

    function fetchMyOwnedItems() public view returns (MarketItem[] memory) {
        return fetchItemsByType(OwnershipType.owner);
    }
}
