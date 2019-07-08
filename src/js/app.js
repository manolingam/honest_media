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
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
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
    App.showArticlesToBeApproved();
    console.log("In bindEvents");
    $('#button-register').on('click', App.registerAccount);
    $('#button-Add').on('click', App.addArticle);
    $('#button-display').on('click', App.displayRating);
    $(document).on('change', App.handleChangeEvent);
    $('#button-Article').on('click', App.uploadFile);
  },

  handleChangeEvent: async function(event) {
    event.preventDefault();

    App.processId = parseInt($(event.target).data('id'));
    
    if (App.processId == 1 || App.processId == 2 || App.processId == 3) {
        return await App.captureFile(event);
    }

    console.log('processId',App.processId);
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
      console.log("Registering Account..");
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

    displayRating: function(){
      console.log('showing rating ...');

      var honestmediaInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var addr = $('#txt-displayAddress').val();

        App.contracts.Honestmedia.deployed().then(function(instance) {
          honestmediaInstance = instance;

          return honestmediaInstance.getContributorRating(addr);
        }).then(function(result) {
          rank = result;

          $('#SpanRating').text(rank);
        }).catch(function(err) {
          console.log(err.message);
        });
      });

    },

  //Function to add Article
  addArticle: async function(){
    event.preventDefault();
    var current = Date.now();
    var account = $("#txt-address").val();
    
    //For IPFS hash
    //App.articleHash = "Artcile Hash";
    App.referenceHash = "ReferenceHash";
    
    App.contracts.Honestmedia.deployed().then(function(instance) {
      return instance.addArticle(
           App.articleHash,
           App.referenceHash,
           $("#txt-articleName").val(),
           current,
           $("#txt-articleStake").val(),
           {from: account}
      );
      }).then(function(result) {
          console.log('addArticle', result);
          console.log("successfully added article.");
      }).catch(function(err) {
          console.log(err.message);
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
        App.showArticle(0);
        App.showArticle(1);
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
        upvoteButton.innerHTML = "Upvotes: " + article[2];
        upvoteButton.onclick = function() {App.upvoteArticle(index);}
        li.appendChild(upvoteButton);

        var downvoteButton = document.createElement('button');
        downvoteButton.innerHTML = "Downvotes: " + article[3] ;
        downvoteButton.onclick = function() {App.downvoteArticle(index);}
        li.appendChild(downvoteButton);
        
        var div = document.createElement('div');
        div.id = "div-challenge";
        var addresslbl = document.createElement('span');
        addresslbl.innerHTML = "Reader's Address";
        div.appendChild(addresslbl);

        var addressTxt = document.createElement('input');
        addressTxt.id = "txt-readerAddress";
        div.appendChild(addressTxt);

        var prooflbl = document.createElement('span');
        prooflbl.innerHTML = "Proof";
        div.appendChild(prooflbl);

        var proofFile = document.createElement('input');
        proofFile.type = 'file';
        proofFile.id = "file-proof";
        proofFile.setAttribute('data-id', '3');
        //proofFile.data = "3";
        div.appendChild(proofFile);
        var proofButton = document.createElement('button');
        proofButton.id= "btn-proof" + index;
        proofButton.innerHTML = "Upload";
        proofButton.onclick = function() {App.uploadFile};
        div.appendChild(proofButton);

        var stakelbl = document.createElement('span');
        stakelbl.innerHTML = "Stake";
        div.appendChild(stakelbl);
        var stakeAmount = document.createElement('input');
        stakeAmount.size = 4;
        //li.appendChild(stakeAmount);
        div.appendChild(stakeAmount);
        var ethText = document.createElement('span');
        ethText.innerHTML = "eth";
        //li.appendChild(ethText);
        div.appendChild(ethText);

        var challengeButton = document.createElement('button');
        challengeButton.innerHTML = "Challenge";
        challengeButton.onclick = function() {App.challengeArticle(index, stakeAmount.textContent);}
        //li.appendChild(challengeButton);
        div.appendChild(challengeButton);
        li.appendChild(div)
        ul.appendChild(li);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  showArticlesToBeApproved: function(){
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
          if (honestmediaInstance.isArticleChallenged(i)){
            App.showArticleToBeApproved(i);
          }   
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  showArticleToBeApproved: function (index) {
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
        var ul = document.getElementById('articleToApproveList');
        var li = document.createElement('li');
        var titleText = document.createElement('h3');
        titleText.innerHTML = article[0];
        li.appendChild(titleText);

        var approveButton = document.createElement('button');
        approveButton.innerHTML = "Approve";
        approveButton.onclick = function() {App.approveArticle(index);}
        li.appendChild(approveButton);

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
        
        var articleContributor = instance.getArticleContributor(index);
        return honestmediaInstance.updateContributorRating(true, false, articleContributor, index);
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

        var articleContributor = instance.getArticleContributor(index);
        return honestmediaInstance.updateContributorRating(false, false, articleContributor, index, {from: account});
      }).then(function(result) {
        App.showArticles();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  challengeArticle: function(index, stake){
    console.log('Challenge article ..' + index);

    var honestmediaInstance;
    var account = $("#txt-readerAddress").val();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.Honestmedia.deployed().then(function(instance) {
        honestmediaInstance = instance;
        
        return honestmediaInstance.challengeArticle(App.proofHash, stake, index);
      }).then(function(result) {
        console.log("Challenge registered.");
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  //Take file input from user
  captureFile: function (event) {
    event.stopPropagation()
    event.preventDefault()
      
    App.fileName = event.target.files[0];    

    console.log(App.fileName);
  }, 

  //Uploads file to IPFS.
  //TODO: need to figure out how to store metadata with Pinata
   uploadFile: async function(event){
    event.preventDefault();
              
    /* const reader = new FileReader();
    console.log(App.fileName.name);
    
    reader.readAsBinaryString(App.fileName); */
    
    //let testBuffer = new Buffer(App.fileName);
    
    //reader.onloadend = async function() {
    try{
            
      const ipfs = new Ipfs({ repo: String(Math.random() + Date.now()) } );
            
      ipfs.on('ready', () => {
        console.log('Online status: ', ipfs.isOnline() ? 'online' : 'offline')
        const files = [
        {
          path: App.fileName.name,
          //content: ipfs.Buffer.from(btoa(reader.result),"base64")
          content: App.fileName
        }
        ] 
        //const buf = buffer.Buffer(btoa(reader.result));
        ipfs.add(files, function (err, files) {
          //let url = "https://ipfs.io/ipfs/"+files[0].hash;
          console.log("Storing file on IPFS using Javascript. HASH: https://ipfs.io/ipfs/"+files[0].hash);
          if(App.processId == 1){
            App.articleHash = files[0].hash;
            console.log(App.articleHash);
          }else {
            if(App.processId == 2){
              App.referenceHash = files[0].hash;
            }else {
              App.proofHash = files[0].hash;
            }
          }
        });
      });
    } catch(err){
      console.log('ipfs issue : ' + err);
    }
    //}
  } 
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

     