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

      //return App.showOperational();
      return App.bindEvents();
    });
  },

  bindEvents: function(){
    App.showOperational();
    App.showArticles();
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

  },


  registerAccount: function (event) {
     event.preventDefault();

      //read address
     var addr = $('#txt-registerAddress').val();

      //read amount
     var fund = $('#txt-amountToRegister').val();

      //read account type value
     const accountType = $("#accountType :selected").text();

      var honestmediaInstance;

      if(accountType === 'Contributor') {
       web3.eth.getAccounts(function(error, accounts) {
       if (error) {
         console.log(error);
       }

        App.contracts.Honestmedia.deployed().then(function(instance) {
         honestmediaInstance = instance;

          return honestmediaInstance.registerContributor(addr, fund);
       }).then(function(result) {
         console.log(result);
         console.log("successfully added contributor");
       }).catch(function(err) {
         console.log(err.message);
       });
     });

      }

      if(accountType === 'Reader') {
       web3.eth.getAccounts(function(error, accounts) {
       if (error) {
         console.log(error);
       }

        App.contracts.Honestmedia.deployed().then(function(instance) {
         honestmediaInstance = instance;

          return honestmediaInstance.registerReader(addr, fund);
       }).then(function(result) {
         console.log(result);
         console.log("successfully added reader");
       }).catch(function(err) {
         console.log(err.message);
       });
     });

      }

      if(accountType === 'Validator') {
       web3.eth.getAccounts(function(error, accounts) {
       if (error) {
         console.log(error);
       }

        App.contracts.Honestmedia.deployed().then(function(instance) {
         honestmediaInstance = instance;

          return honestmediaInstance.registerValidator(addr, fund);
       }).then(function(result) {
         console.log(result);
         console.log("successfully added validator");
       }).catch(function(err) {
         console.log(err.message);
       });
     });

      }
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

  },

  showArticles: function(){
    console.log('Listing articles ...');

    var honestmediaInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;

        return honestmediaInstance.getNumberOfArticles();
      }).then(function(result) {
        numberOfArticles = result;
        console.log("showing articles..." + numberOfArticles);
        for (i = 0; i < numberOfArticles; i++) { 
          App.showArticle(i);
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  showArticle: function(index){
    console.log("showing article no: " + index);
    var honestmediaInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;

        return honestmediaInstance.getArticle(index);
      }).then(function(result) {
        article = result;
        console.log(article);
        var ul = document.getElementById('articleList');
        var li = document.createElement('li');
        var titleText = document.createElement('h3');
        titleText.innerHTML = article[0];
        li.appendChild(titleText);

        var dateText = document.createElement('span');
        dateText.innerHTML = "Date: " + article[1];
        li.appendChild(dateText);

        var upvoteButton = document.createElement('button');
        upvoteButton.innerHTML = "Upvotes: " + article[3];
        upvoteButton.onclick = function() {App.upvoteArticle(index);}
        li.appendChild(upvoteButton);

        var downvoteButton = document.createElement('button');
        downvoteButton.innerHTML = "Downvotes: " + article[3];
        downvoteButton.onclick = function() {App.downvoteArticle(index);}
        li.appendChild(downvoteButton);

        ul.appendChild(li);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  upvoteArticle: function(index){
    console.log('Adding upvote ...' + index);

    var honestmediaInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;

        return honestmediaInstance.upVoteArticle(index);
      }).then(function(result) {
        App.showArticles();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  downvoteArticle: function(index){
    console.log("Downvoting.. " + index);

    var honestmediaInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;

        return honestmediaInstance.downVoteArticle(index);
      }).then(function(result) {
        App.showArticles();
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