// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    mapping(address => uint256) public balances;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 10000*10**decimals()); //发行10000积分给调用者
        balances[msg.sender] = 10000;
    }
    //获取当前账户余额
    function getBalance(address account) external view returns(uint256){
        return balances[account];
    }
    function transfer(address from, address to, uint256 price) external returns (bool) {
        require(price <= balances[from], "No enough balance!");
        balances[from] -= price;
        balances[to] += price;
        return true;
    }
}
