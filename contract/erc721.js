const CURRENCY = 'IXO';
var AschJS = require('asch-js');

function require(condition, error) {
    if (!condition) throw Error(error)
  }

let array=[];
var c=0;
module.exports={

    balanceOf:async function(owner){
        console.log("This senderId: " + this.trs.senderID);
    var c=0;
    let row = app.balances.get(owner);
    if(!row) return "Owner not found";
    for(var i=0;i<array.length;i++)
    {
      if(array[i]==owner){
        c++;
   }
 }
    return c;
},

mint:async function(owner){
    var c=0;
    let x = await app.balances.get(owner);
    if(!x) return "To address does not exist";
    //app.sdb.update("Token", {}, {tokenName=owner},{tokenId=this.tokenId+tId});
    //tId=tokens[0];
   // app.sdb.create("Token", {tokenName:owner,tokenId:app.autoId.increment(Tokens_max_tokenId),mintBy:owner,mintAt:this.mintAt.now()});
   app.sdb.create("Token", {tokenName:owner,tokenId:c++,mintBy:owner,mintAt:new Date().getTime()});
    //array.push(owner);
    return true;
 },

 transferFrom:async function(fromaddr, toaddr, tokenId){
    require(tokenId !== undefined, 'Token does not exist')
    app.balances.transfer(tokenName, tokenId, fromaddr, toaddr);
    return true;
  },

  transfer:async function(address, tId){
  return this.transferFrom(this.trs.senderID, address, tId);  
},

approve:async function(spender, tID){
  let row = await app.model.Balances.findOne({address: spender});
  if(!row) return "Spender address not found";
  row = this.allowance(this.trs.senderID, spender);
  if(row === "The approval record is not found"){
      app.sdb.create("Approve", {
          owner: this.trs.senderID,
          spender: spender,
          tId:tId
      });
  }else{
      app.sdb.update("Approve",{owner: this.trs.senderID, spender: spender}, {tId: tId});
  }
  return true;
},


allowance:async function(owner, spender){
  let row = await app.model.Approve.findOne({
      owner: owner,
      spender: spender
  });
  if(!row) return 0;
  return row.tId;
},

burn:async function(tId,owner){
    require(tId !== undefined, 'Token does not exist')
    let row = await app.model.Token.findOne({
        tokenId: tId,
        mintBy: owner
    });
    if(!row) "Cant burn tokens";
    app.sdb.del('Token', { id: this.tId });
    return true;
}

}






            
 