const Currency = 'IXO';

module.exports = {

    balanceOf: async function(tokenOwner){
        var Currency='IXO';
        function require(condition, error) {
            if (!condition) throw Error(error)
          }
        let option = {
            condition: {
              Address: tokenOwner,
              currency: Currency
             },
             fields: ['Balance']
           }
            var bal= await app.model.Bal.findOne(option);
            require(bal !== undefined, 'address not found')

        
            return bal;
    },

    createBalTable:  function(superAdmin){
        app.sdb.create('Bal' ,{Address:superAdmin, Balance:'1000' ,currency:'IXO'});
    },
    
    transferFrom: async function(fromaddr, toaddr, amount){
        function require(condition, error) {
            if (!condition) throw Error(error)
          }

        var Currency = 'IXO';

        let option = {
        condition: {
          Address: fromaddr,
          currency: Currency
         },
         fields: ['Balance']
       }
        var frombal= await app.model.Bal.findOne(option);
        require(frombal !== undefined, 'Sender address not found')
        let option1 = {
            condition: {
              Address: toaddr,
              currency: Currency
             },
             fields: ['Balance']
           }
        var tobal =  await app.model.Bal.findOne(option1);
        require(tobal !== undefined, 'Receiver address not found')
        require(frombal < amount, 'Insufficient balance in senders address')
        //app.sdb.update("Balances", {balance:frombal}, {address: fromaddr});
        //app.sdb.update("Balances", {balance:tobal}, {address: toaddr});
        app.balances.transfer(Currency, amount, fromaddr, toaddr);
        //return true;
    },
    
    // transfer: async function(address, amount){
    //     return this.transferFrom(this.trs.senderID, address, amount);  // Called the transferFrom function for code reusability 
    // },                                                                 // assuming that transaction fees won't incur when a contract is 
                                                                        // called from another function.
                                                                        // I think that transaction fees incur only when a contract is called
                                                                        // with /transactions/unsigned type: 1000 
                                                                        // Will change it if that's not how it works.
    approve: async function(spender, amount){
        function require(condition, error) {
            if (!condition) throw Error(error)
          }
        var row = await app.model.Bal.findOne({Address: spender});
        require(row !== undefined, 'Spender address not found')
        row = allowance1(this.trs.senderID, spender);
        if(!row){
            app.sdb.create("Approve", {
                owner: this.trs.senderID,
                spender: spender,
                amount: amount
            });
        }else{
            app.sdb.update("Approve",{owner: this.trs.senderID, spender: spender}, {amount: amount});
        }
        
        function allowance1(owner, spender){
            let option2 = {
                condition: {
                  owner:owner,
                  spender:spender
                 },
                 fields: ['amount']
               }
            var  row = app.model.Approve.findOne(option2);
            require(row !== undefined, 'does not exist')
        }
    },
    
    allowance: async function(owner, spender){
        let opt = {
        conditionn:{
            owner: owner,
            spender: spender
        },
        fields: ['amount']
    }
        var row = app.model.Approve.findOne(opt);
        return row;
    },

    spendAllowance: async function(owner, amount){
        let balance = this.allowance(owner, this.trs.senderID);
        if(balance === 0) return "Zero allowance";
        if(amount > balance) return "Amount is greater than allowance";
        let transferResult = this.transferFrom(owner, this.trs.senderID, amount);
        if(transferResult !== true){
            return transferResult;
        }
        app.sdb.update("Approve",{owner: owner, spender: this.trs.senderID}, {amount: balance-amount});
        //return true;
    },

    // getTotalSupply: async function(){
    //     return app.model.Token.findOne({currency: CURRENCY}).totalSupply;
    // },
    

    generateOneTimeDappAddress: function(superAdmin){
       // var AschJS = require('asch-js');
        //this function is designed in such a way where it can be executed absolutely once.

        var executed = false;              // ---> The closure variable
        return async function() {          // ---> The function that will actually be stored in generateOneTimeDappAddress
            if (!executed) {
                executed = true;

                var secret = Math.random().toString(36).substring(7);
                //var keys = AschJS.crypto.getKeys(secret);
                app.sdb.create("Token",{
                    totalSupply: app.balances.get(this.trs.senderID),
                    currency: "IXO",
                    tokenExchangeRate: "0.1",
                    dappAddress: "0xajsfjasfa2346",
                    //dappAddress: AschJS.crypto.getAddress(keys.publicKey),
                    //dappPubKey: keys.publicKey(),
                    dappPubKey: "123",
                    shortName: "ixo",
                    precision: 8,
                    dappOwner:this.trs.senderID
                });
                
               // return secret;
            }else{
                return "Address already issued";
            }
   
        };
    }(),  //---> Called this function and it returns the return function which will be stored in generateOneTimeDappAddress
    // If using closures to achieve a singleton function doesn't work in blockchain sense, 
    // then the alternate idea is to write this function in init.js
    // assuming that init.js runs only one time when the Dapp is launched.

    // dAppAddress: async function(){
    //     return await app.model.Token.findOne({}).dappAddress;
    // },

    withdrawFromDAppAddress: async function(Currency,amount){
        //can include this so only owner of the DApp can withdraw funds in the DApp wallet.
        var Currency='IXO';
        function require(condition, error) {
            if (!condition) throw Error(error)
          }

        let row = await app.model.Token.findOne({fields:['dappOwner']});
        require(row !== this.trs.senderID, 'Only the owner can withdraw from DApp')                

         let option5= {
            condition: {
              Address: row,
              currency: Currency
             },
             fields: ['Balance']
           }
            var x= await app.model.Bal.findOne(option5);
            require(x<amount,'Insufficient balance in DApp wallet')
            app.sdb.update("Bal",{Address:row}, {Balance: x-amount});
       
    },

    mint: async function(toaddr, amount){
        var Currency='IXO';
        function require(condition, error) {
            if (!condition) throw Error(error)
          }

        var row = await app.model.Token.findOne({fields:['dappOwner']});
        require(row !== this.trs.senderID, 'Only the DApp owner can mint tokens')

       let option = {
        condition: {
          Address: toaddr,
          currency: Currency
         },
         fields: ['Balance']
       }
        var x= await app.model.Bal.findOne(option);
        require(x!== undefined, 'To address does not exist')
                
        app.sdb.update("Token", {}, {totalSupply:x + amount});
       app.sdb.update("Bal", {Address:toaddr}, {Balance:x+amount});
    },

    burn: async function(amount){
        var Currency='IXO';
        function require(condition, error) {
            if (!condition) throw Error(error)
          }
          let option = {
            condition: {
              Address: this.trs.senderID,
              currency: Currency
             },
             fields: ['Balance']
           }
        var x= await app.model.Bal.findOne(option); 
        require(x < amount, 'Insufficient balance to burn')

        app.sdb.update("Token", {Address:this.trs.senderID}, {totalSupply: x-amount});
        app.sdb.update("Bal", {Address:this.trs.senderID}, {Balance:x-amount});
        
    },

    burnFrom: async function(fromaddr, amount){
            var Currency='IXO';
            var addr=this.trs.senderID;
            function require(condition, error) {
                if (!condition) throw Error(error)
              }
              let option = {
                condition: {
                  Address: fromaddr,
                  currency: Currency
                 },
                 fields: ['Balance']
               }
            var x= await app.model.Bal.findOne(option); 
            require(x < amount, 'Insufficient balance to burn')
            allow(fromaddr, addr);
            function allow(owner1, spender1){
                let option2 = {
                    condition: {
                      owner:owner1,
                      spender:spender1
                     },
                     fields: ['amount']
                   }
                var  row = app.model.Approve.findOne(option2);
                require(row < amount, 'Insufficient allowance')
                }
            
         let option1 = {
            condition: {
              Address: fromaddr,
              currency: Currency
             },
             fields: ['Balance']
           }
        var x= await app.model.Bal.findOne(option1); 

        //app.sdb.update("Token", {dappOwner:fromaddr}, {totalSupply: row.totalSupply-amount});
        app.sdb.update("Bal", {Address:fromaddr,currency:Currency}, {Balance:x-amount});

    }

}