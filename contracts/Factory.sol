// SPDX-License-Identifier: UNLICENSED

import "./Product.sol";

pragma solidity ^0.8.24;

contract Factory {
    function produce() public returns (Product) {
        Product product = new Product(1);
        
        return product;
    }
}