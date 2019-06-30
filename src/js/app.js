App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Honestmedia.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var HonestmediaArtifact = data;
      App.contracts.Honestmedia = TruffleContract(HonestmediaArtifact);

      // Set the provider for our contract.
      App.contracts.Honestmedia.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.showOperational();
    });
  },

  showOperational: function(){

    console.log('Getting operational ...');

    var honestmediaInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;

        return honestmediaInstance.isOperational();
      }).then(function(result) {
        isOperational = result;

        $('#TTBalance').text(isOperational);
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
