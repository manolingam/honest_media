var HonestToken = artifacts.require("HonestToken");

module.exports = function(deployer) {
  deployer.deploy(HonestToken);
};