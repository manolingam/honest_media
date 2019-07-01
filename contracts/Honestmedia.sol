pragma solidity >=0.4.21 <0.6.0;
import "./accessControl/ContributorRole.sol";
import "./accessControl/ReaderRole.sol";
import "./accessControl/ValidatorRole.sol";
import "./Article.sol";
// Import the library 'Roles' and SafeMath
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Honestmedia is ContributorRole, ReaderRole, ValidatorRole, Article  {
    using SafeMath for uint;

	address owner;

	//check if contract operational
    bool private operational = true;

    //variables to define minimum funding amounts for validators and contributors.
    //These should be checked when adding new actors.
    uint constant MIN_FUNDING_VALIDATOR = 1 ether; //we can decide a different amount
    uint constant MIN_FUNDING_CONTRIBUTOR = 2 ether; //we can decide a different amount

    //mapping to store available withdrawals
    mapping(address => uint) availableWithdrawls;

    //Struct to store ruling
    struct ruling {
        address[3] validators;
        bool[3] votes;
        uint voted;
    }

    //Mapping to save ruling for challenges
    mapping(uint => ruling) allRulings;

    //Variable to save totalRulings
    uint public totalRulings;

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
    function setContributorRating(address _address, uint rank) public {
    	ContributorRole.setRating(_address, rank);
    }

    function setReaderRating(address _address, uint rank) external {
    	ReaderRole.setRating(_address, rank);
    }

    function setValidatorRating(address _address, uint rank) external {
    	ValidatorRole.setRating(_address, rank);
    }

    //Function to store the article etc
    function addArticle(bytes32 _ipfsArticleHash, bytes32 _ipfsReferenceHash, string memory _title,
                        uint _datePublished, uint _stake, address _contributor) public onlyContributor
    {
        //Check if Amount staked is greater than balance of contributor
        require(_stake <= ContributorRole.allContributors[msg.sender].balance,
                         "Insufficient funds to publish article. Amount staked should be less than account balance.");
        uint articleNum = Article.addArticle(_ipfsArticleHash, _ipfsReferenceHash, _title, _datePublished, _stake);
        ContributorRole.allContributors[_contributor].articles.push(articleNum);
        //Assign validator to approve article
    }

    //Function to update rating for Contributors
    function updateContributorRating(bool vote, bool challengeLost, address _contributor, uint articleId) public {
        if(challengeLost == true){
            if(ContributorRole.allContributors[_contributor].rating > 0){
                ContributorRole.allContributors[_contributor].rating = ContributorRole.allContributors[_contributor].rating.sub(1);
            }
            ContributorRole.allContributors[_contributor].challengesLost = ContributorRole.allContributors[_contributor].challengesLost.add(1);
        }else {
            if(vote == true){
                Article.allArticles[articleId].upVotes = Article.allArticles[articleId].upVotes.add(1);
            }else {
                Article.allArticles[articleId].downVotes = Article.allArticles[articleId].downVotes.add(1);
            }
            uint newRating = contributorRatingCalculator(ContributorRole.allContributors[_contributor].rating, Article.allArticles[articleId].upVotes,
                                                        Article.allArticles[articleId].downVotes, ContributorRole.allContributors[_contributor].articlesPublished);
            setContributorRating(_contributor, newRating);
        }
    }

    //Function to calculate rating for Contributors
    function contributorRatingCalculator(uint currentRating, uint upVotes, uint downVotes, uint articles) internal pure returns(uint){
        uint totalRatings = upVotes.add(downVotes);
        uint recentRating = upVotes.div(totalRatings).mul(5);
        uint newRating = articles.sub(1);
        newRating = newRating.mul(currentRating);
        newRating = newRating.add(recentRating);
        newRating = newRating.div(articles);
        return newRating;
    }

    //Function to challenge an article
    function challengeArticle(bytes32 proofHash, uint stake) external onlyReader {
        ReaderRole.challenge(proofHash, stake, msg.sender);
        assignValidators();
    }

    //function to find random validators to vote on challenge
    function assignValidators() internal {
        totalRulings = totalRulings.add(1);
        address[3] memory validators;
        for(uint i = 1; i < 4; i++)
        {
            validators[i-1] = ValidatorRole.validatorIds[random(i)];
        }
        allRulings[totalRulings].validators = validators;
    }

    //Random number generator
    function random(uint nonce) internal view returns (uint) {
        uint MAX = ValidatorRole.totalValidators;
        uint seed = uint(keccak256(abi.encodePacked(now, msg.sender, nonce)));
        uint scaled = seed.div(MAX);
        uint adjusted = scaled;
        return adjusted;
    }

    //function to register validator votes on challenge. Will also check if 2 of 3 consensus is reached
    function voteOnChallenge(uint rulingId, bool vote, uint challengeId) external {
        uint numOfYesVotes;
        for(uint i = 0; i < 3; i++){
            if (allRulings[rulingId].validators[i] == msg.sender) {
                allRulings[rulingId].votes[i] = vote;
                allRulings[rulingId].voted++;
            }
            if(allRulings[rulingId].votes[i] == true)
                numOfYesVotes++;
        }
        if(numOfYesVotes >= 2){
            ReaderRole.allChallenges[challengeId].success = true;
            // update contributor's challenges lost
            // Distribute Amount staked by contributor to reader and validators
        }else
        {
            if(allRulings[rulingId].voted == 3) {
                ReaderRole.allChallenges[challengeId].success = false;
                // Distribute Amount staked by reader to contributor and validators
            }
        }
    }

    //TODO: function that allows to withdraw funds. For Validators and Contributors their balance should not be less than the minimum funding amount.

    



}