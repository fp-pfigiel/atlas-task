// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract Product {
    uint8 value = 0;

    constructor(uint8 _value) {
        value = _value;
    }
}