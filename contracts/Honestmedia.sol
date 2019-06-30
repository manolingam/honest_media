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

    //seting ranking
    //TODO: update based on roles
    function setJournalistRanking(address _address, uint rank) external {
    	Journalist journalist = journalists[_address];
    	journalist.setRanking(rank);
    }

    function setReaderRanking(address _address, uint rank) external {
    	Reader reader = readers[_address];
    	reader.setRanking(rank);
    }

    function setValidatorRanking(address _address, uint rank) external {
    	Validator validator = validators[_address];
    	validator.setRanking(rank);
    }

    //TODO: based on article role
    //function challengeArticle(address _address) {}

    //TODO: store the article etc




}