pragma solidity >=0.4.21 <0.6.0;
import "./accessControl/ContributorRole.sol";
import "./accessControl/ReaderRole.sol";
import "./accessControl/ValidatorRole.sol";

contract Honestmedia is ContributorRole, ReaderRole, ValidatorRole  {

	address owner;

	//check if contract operational
    bool private operational = true; 

	constructor() public {
        owner = msg.sender;
    }

     modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier requireContractOwner() {
        require((msg.sender == owner), "Caller is not admin");
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
    function setContributorRating(address _address, uint rank) external {
    	ContributorRole.setRating(_address, rank);
    }

    function setReaderRating(address _address, uint rank) external {
    	ReaderRole.setRating(_address, rank);
    }

    function setValidatorRating(address _address, uint rank) external {
    	ValidatorRole.setRating(_address, rank);
    }

    //TODO: based on article role
    //function challengeArticle(address _address) {}

    //TODO: store the article etc




}