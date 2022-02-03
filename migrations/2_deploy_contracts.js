var NoteList = artifacts.require("./NoteList.sol");

module.exports = function(deployer) {
  deployer.deploy(NoteList);
};
