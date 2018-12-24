module.exports = async function () {
  console.log('enter dapp init')

app.registerContract(1,'balanceOf')
app.registerContract(2,'mint')
app.registerContract(3,'transferFrom')
app.registerContract(4,'transfer')
app.registerContract(5,'approve')
app.registerContract(6,'allowance')
app.registerContract(7,'burn')

app.registerFee(1,'0','BEL')
app.registerFee(2,'0','BEL')
app.registerFee(3,'0','BEL')
app.registerFee(4,'0','BEL')
app.registerFee(5,'0','BEL')
app.registerFee(6,'0','BEL')
app.registerFee(7,'0','BEL')



  app.events.on('newBlock', (block) => {
    console.log('new block received', block.height)
  })
}