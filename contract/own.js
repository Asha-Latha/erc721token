const CURRENCY = 'IXO';


module.exports = {

    // balanceOf: async function(tokenOwner){
    //     let row = app.balances.get(tokenOwner, CURRENCY);
    //     if(!row) return "Address not found";
    //     return row.balance;
    // },
    
    transferFrom: async function(fromaddr, toaddr, amount){
        function require(condition, error) {
            if (!condition) throw Error(error)
          }
        var CURRENCY = 'IXO';
        let frombal = app.balances.get(fromaddr, 'IXO');
        require(frombal !== undefined, 'Sender address not found')
        let tobal = app.balances.get(toaddr, 'IXO');
        require(tobal !== undefined, 'Receiver address not found')
        if(frombal < amount) return "Insufficient balance in sender's address";
        //app.sdb.update("Balances", {balance:frombal}, {address: fromaddr});
        //app.sdb.update("Balances", {balance:tobal}, {address: toaddr});
        app.balances.transfer(CURRENCY, amount, fromaddr, toaddr);
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
        let row = await app.model.Balances.findOne({address: spender});
        if(!row) return "Spender address not found";
        row = this.allowance1(this.trs.senderID, spender);
        if(row === "The approval record is not found"){
            app.sdb.create("Approve", {
                owner: this.trs.senderID,
                spender: spender,
                amount: amount
            });
        }else{
            app.sdb.update("Approve",{owner: this.trs.senderID, spender: spender}, {amount: amount});
        }
        
        function allowance1(owner, spender){
            let row = app.model.Approve.findOne({
                owner: owner,
                spender: spender
            });
            //if(!row) return 0;
            //return row.amount;
    
    
        }
        //return true;
    },
    
    allowance: async function(owner, spender){
        let row = await app.model.Approve.findOne({
            owner: owner,
            spender: spender
        });
        //if(!row) return 0;
        //return row.amount;


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


    generateOneTimeDappAddress: function(){
        //var AschJS = require('asch-js');
        //this function is designed in such a way where it can be executed absolutely once.

        var executed = false;              // ---> The closure variable
        return async function() {          // ---> The function that will actually be stored in generateOneTimeDappAddress
            if (!executed) {
                executed = true;

                var secret = Math.random().toString(36).substring(7);
                //var keys = AschJS.crypto.getKeys(secret);
                app.sdb.create("Token",{
                    totalSupply: balanceOf(this.trs.senderID),
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
                //return secret;
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

    withdrawFromDAppAddress: async function(currency,amount){
        //can include this so only owner of the DApp can withdraw funds in the DApp wallet.

        let row = await app.model.Token.findOne({});
        if(row.dappOwner !==  this.trs.senderID) return "Only the owner can withdraw from DApp";
        
        //app.balances.increase(row, currency, 'amount')       
        //app.balances.decrease(dappAddress, 'BEL', '100000')       
        //app.balances.increase('818391397252437407IN', 'BEL', '300000')       
        //app.balances.get('A9fDpCe9FGQ14VwJdc1FpycxsJ9jN3TtwfIN', 'BEL')       
        //app.balances.transfer('BEL', '10000', 'A9fDpCe9FGQ14VwJdc1FpycxsJ9jN3Ttwf', '818391397252437407IN') 

        if(row.balance < amount) return "Insufficient balance in DApp wallet";

        app.sdb.update("Token", {}, {balance: row.balance-amount});
        app.balances.increase(row.dappOwner, CURRENCY, amount);
        
        //return true;
    },

    mint: async function(toaddr, amount){

        let row = await app.model.Token.findOne({});

        if(row.dappOwner !== this.trs.senderID) return "Only the DApp owner can mint tokens";

        let x = await app.balance.get(toaddr, CURRENCY);
        if(!x) return "To address does not exist";

        app.sdb.update("Token", {}, {totalSupply: row.totalSupply + amount});
        app.balances.increase(toaddr, CURRENCY, amount);
    },

    burn: async function(amount){
        let balance = await app.balance.get(this.trs.senderID, CURRENCY);
        if(balance < amount) return "Insufficient balance to burn";

        let row = await app.model.Token.findOne({});

        app.sdb.update("Token", {}, {totalSupply: row.totalSupply-amount});
        app.balances.decrease(this.trs.senderID, CURRENCY, amount);

       // return true;
    },

    burnFrom: async function(fromaddr, amount){
        let balance = await app.balance.get(fromaddr, CURRENCY);
        if(balance < amount) return "Insufficient balance to burn";

        if(this.allowance(fromaddr, this.trs.senderID) < amount) return "Insufficient allowance";

        let row = await app.model.Token.findOne({});

        app.sdb.update("Token", {}, {totalSupply: row.totalSupply-amount});
        app.balances.decrease(fromaddr, CURRENCY, amount);

       // return true;

    }

   // event Transfer: 

   // event Approval:
}