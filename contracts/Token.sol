pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract HonestToken is ERC20 {
 
	string public name = "HonestToken";
	string public symbol = "HT";
	uint8 public decimals = 8;
	uint public INITIAL_SUPPLY = 200000;

	constructor() public {
  		_mint(msg.sender, INITIAL_SUPPLY);
	}
}