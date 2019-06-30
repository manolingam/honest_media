var ContributorRole = artifacts.require("./ContributorRole.sol");
var ReaderRole = artifacts.require("./ReaderRole.sol");
var ValidatorRole = artifacts.require("./ValidatorRole.sol");

module.exports = function(deployer) {
    deployer.deploy(ContributorRole);
    deployer.deploy(ReaderRole);
    deployer.deploy(ValidatorRole);
};