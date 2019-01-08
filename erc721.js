const CURRENCY = 'IXO';
var AschJS = require('asch-js');

module.exports={

Register:async function(addr){
    var c=0;
    app.sdb.create("reg", {owner:addr,ownerId:c++,token:"0"});
},

mint:async function(owner1){
    var c=0;
    let opt = {
        condition: {
            owner: owner1
         },
         fields: ['ownerID']
       }
    var id= await app.model.Reg.findOne(option);
    require(Number(id.ownerId) !== undefined, 'Address does not exist')
    //app.sdb.update("Token", {}, {tokenName=owner},{tokenId=this.tokenId+tId});
   // app.sdb.create("Token", {tokenName:owner,tokenId:app.autoId.increment(Tokens_max_tokenId),mintBy:owner,mintAt:this.mintAt.now()});
   app.sdb.create("Token", {tokenName:owner,tokenId:c++,mintBy:owner1,mintAt:new Date().getTime()});
   let option = {
    condition: {
        mintBy: owner1
     },
     fields: ['tokenId']
   }
   var tid= await app.model.Token.findOne(option);
   app.sdb.update("Reg", {token: tid.tokenId},{owner: owner1});
 },

fields:async function(dict){
    for (var i in dict) {
            if (dict.hasOwnProperty(i)) {   
            //console.log(i, dict[i]);
            app.sdb.load('Token', ['i', 'dict[i]'], ['i']);     
        }
    }
},
 
transferFrom:async function(tName,tId,fromaddr, toaddr){
    function require(condition, error) {
        if (!condition) throw Error(error)
      }
    require(tokenId !== undefined, 'Token does not exist')
    //app.balances.transfer(tokenName, tokenId, fromaddr, toaddr);
    app.sdb.create("Token", {tokenName:toaddr,tokenId:tId,mintBy:toaddr,mintAt:new Date().getTime()});
    app.sdb.del('Token', {tokenId:tId,mintBy:fromaddr });
  },

  transfer:async function(address, tId){
  return this.transferFrom(this.trs.senderId, address, tId);  
},

approve:async function(spender, tID){
    
  let row = await app.model.Balances.findOne({address: spender});
  if(!row) return "Spender address not found";
  row = this.allowance1(this.trs.senderID, spender);
  if(row){
      app.sdb.create("Approve", {
          owner: this.trs.senderId,
          spender: spender,
          tId:tId
      });
  }else{
      app.sdb.update("Approve", {amount: tId},{owner: this.trs.senderId, spender: spender});
  }

  function require(condition, error) {
    if (!condition) throw Error(error)
  }

  function allowance1(owner1, spender1){
    let option = {
        condition: {
          owner:owner1,
          spender:spender1
         },
         fields: ['amount']
       }
     var row = app.model.Approve.findOne(option);
     require(row.amount !== undefined, 'Token does not exist')
     return row.amount;
  }
},


allowance:async function(owner, spender){
    let option = {
        condition: {
          owner:owner,
          spender:spender
         },
         fields: ['amount']
       }
     var row = app.model.Approve.findOne(option);
     if(!row.amount) return 0;
     return row.amount;
},

burn:async function(tId,owner){
    function require(condition, error) {
        if (!condition) throw Error(error)
      }
    require(tId !== undefined, 'Token does not exist')
    let option = {
        condition: {
            mintBy: owner
         },
         fields: ['tokenId']
       }
        var id= await app.model.Token.findOne(option);
   
        require(Number(id.tokenId) !== undefined, 'Token does not exist')
        app.sdb.del('Token', { tokenId:tId });
        app.sdb.del('reg', { token:tId });
    
   }
}


