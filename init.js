module.exports = async function () {
  console.log('enter dapp init')
 
// app.registerContract(2000,'erc721.balanceOf')
// app.registerContract(2001,'erc721.mint')
// app.registerContract(2002,'erc721.transferFrom')
// app.registerContract(2003,'erc721.transfer')
// app.registerContract(2004,'erc721.approve')
// app.registerContract(2005,'erc721.allowance')
// app.registerContract(2006,'erc721.burn')
// app.registerContract(2007,'erc721.fields')


// app.registerFee(2000,'0','BEL')
// app.registerFee(2001,'0','BEL')
// app.registerFee(2002,'0','BEL')
// app.registerFee(2003,'0','BEL')
// app.registerFee(2004,'0','BEL')
// app.registerFee(2005,'0','BEL')
// app.registerFee(2006,'0','BEL')
// app.registerFee(2007,'0','BEL')


app.registerContract(3000,'own.transferFrom')
app.registerContract(3001,'own.approve')
app.registerContract(3002,'own.withdrawFromDAppAddress')
app.registerContract(3003,'own.mint')
app.registerContract(3004,'own.burn')
app.registerContract(3005,'own.burnFrom')

app.registerFee(3000,'0','BEL')
app.registerFee(3001,'0','BEL')
app.registerFee(3002,'0','BEL')
app.registerFee(3003,'0','BEL')
app.registerFee(3004,'0','BEL')
app.registerFee(3005,'0','BEL')



  app.events.on('newBlock', (block) => {
    console.log('new block received', block.height)
  })
}