pragma solidity >=0.4.21 <0.6.0;

// Import the library 'Roles' and SafeMath
//import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

// Define a contract 'ContributorRole' to manage this role - add, remove, check
contract Article {
  using SafeMath for uint;

  // Define events
  event ArticleAdded(uint aticleNum);
  event ArticleRemoved(uint aticleNum);
  event ArticleApproved(uint aticleNum);
  event ArticleChallenged(uint aticleNum);
  //Not sure if we need these below
  event ArticleUpVoted(uint aticleNum);
  event ArticleDownVoted(uint aticleNum);

  //Define a struct to store contributor information
  struct articleInfo {
      bytes32 ipfsArticleHash;
      bytes32 ipfsReferenceHash;
      bool approved;
      bool challenged;
      bool removed;
      uint upVotes;
      uint downVotes;
      uint stake;
    }

  //Define a variable to count number of articles.
    uint totalArticles;

  //Define a mapping to map contributor address and contributor info
  mapping(uint => articleInfo) allArticles;

  // In the constructor make the address that deploys this contract the 1st Contributor
  //   constructor() public {
 //   }

  // Define a function 'addArticle' that adds the article
  function addArticle(bytes32 _ipfsArticleHash, bytes32 _ipfsReferenceHash, uint _stake) public returns(uint){
    totalArticles = totalArticles.add(1);
    allArticles[totalArticles] = articleInfo({ipfsArticleHash: _ipfsArticleHash, ipfsReferenceHash: _ipfsReferenceHash,
                                            approved: false, challenged:false, removed: false, upVotes: 0, downVotes: 0, stake: _stake});
    emit ArticleAdded(totalArticles);
    return totalArticles;
  }

  // Define a function 'approved' that updates the approved flag
  function approved(uint articleNumber) public {
    allArticles[articleNumber].approved = true;
    emit ArticleApproved(totalArticles);
  }

  // Define a function 'challenged' that updates the challenged flag
  function challenged(uint articleNumber) public {
    allArticles[articleNumber].challenged = true;
    emit ArticleChallenged(totalArticles);
  }

  // Define a function 'removed' that updates the removed flag
  function removed(uint articleNumber) public {
    allArticles[articleNumber].removed = true;
    emit ArticleRemoved(totalArticles);
  }

  // Define a function 'upVoted' that updates the upVote count
  function upVoted(uint articleNumber) public {
    allArticles[articleNumber].upVotes = allArticles[articleNumber].upVotes.add(1);
    emit ArticleUpVoted(totalArticles);
  }

  // Define a function 'downVoted' that updates the upVote count
  function downVoted(uint articleNumber) public {
    allArticles[articleNumber].downVotes = allArticles[articleNumber].downVotes.add(1);
    emit ArticleDownVoted(totalArticles);
  }
}