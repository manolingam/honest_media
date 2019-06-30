const Honestmedia = artifacts.require("Honestmedia");
const ContributorRole = artifacts.require("./ContributorRole.sol");
const ReaderRole = artifacts.require("./ReaderRole.sol");
const ValidatorRole = artifacts.require("./ValidatorRole.sol");

module.exports = function(deployer) {
	deployer.deploy(Honestmedia);
    deployer.deploy(ContributorRole);
    deployer.deploy(ReaderRole);
    deployer.deploy(ValidatorRole);
};
