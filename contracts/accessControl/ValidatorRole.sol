pragma solidity >=0.4.21 <0.6.0;

// Import the library 'Roles' and SafeMath
import "../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";
import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

// Define a contract 'ValidatorRole' to manage this role - add, remove, check
contract ValidatorRole {
  using Roles for Roles.Role;
  using SafeMath for uint;

  // Define 2 events, one for Adding, and other for Removing
  event ValidatorAdded(address indexed account);
  event ValidatorRemoved(address indexed account);

  // Define a struct 'Validators' by inheriting from 'Roles' library, struct Role
  Roles.Role private validators;

  //Define a struct to store Validator information
  struct validatorInfo {
      uint rating;
      uint balance;
      uint numOfApprovals;
      uint numOfChallenges;
  }
  //Define a mapping to map validator address and validator info
  mapping(address => validatorInfo) allValidators;

  // In the constructor make the address that deploys this contract the 1st Validator
  constructor() public {
    _addValidator(msg.sender, 0);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyValidator() {
    require(isValidator(msg.sender), "Caller is not a Validator");
    _;
  }

  // Define a function 'isValidator' to check this role
  function isValidator(address account) public view returns (bool) {
    return validators.has(account);
  }

  // Define a function 'addValidator' that adds this role
  function addValidator(address account, uint funds) public onlyValidator {
    _addValidator(account, funds);
  }

  // Define a function 'renounceValidator' to renounce this role
  function renounceValidator() public {
    _removeValidator(msg.sender);
  }

  //Define a function to increase number of approvals
  function approve() external onlyValidator{
    allValidators[msg.sender].numOfApprovals = allValidators[msg.sender].numOfApprovals.add(1);
  }

  //Define a function to increase number of challenges
  function ruleOnChallenge() external onlyValidator{
    allValidators[msg.sender].numOfChallenges = allValidators[msg.sender].numOfChallenges.add(1);
  }

  // Define an internal function '_addValidator' to add this role, called by 'addValidator'
  function _addValidator(address account, uint funds) internal {
    validators.add(account);
    allValidators[account].balance = funds;
    emit ValidatorAdded(account);
  }

  // Define an internal function '_removeValidator' to remove this role, called by 'removeValidator'
  function _removeValidator(address account) internal {
    validators.remove(account);
    emit ValidatorRemoved(account);
  }
}