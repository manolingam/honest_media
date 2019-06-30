pragma solidity >=0.4.21 <0.6.0;

contract Honestmedia  {

	address owner;

	//check if contract operational
    bool private operational = true; 

	//TODO: updated based on a role name
	mapping(address => Journalist) journalists;

	//TODO: updated based on a role name
	mapping(address => Reader) readers;

	//TODO: updated based on a role name
	mapping(address => Validator) Validator;

	constructor() public {
        owner = msg.sender;
    }

     modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier requireContractOwner() {
        require(isAdmin(msg.sender), "Caller is not admin");
        _;
    }

    function isOperational() 
                            public 
                            view 
                            returns(bool) {
        return operational;
    }

    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner {
        operational = mode;
    }




}