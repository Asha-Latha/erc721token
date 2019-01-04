var AschJS = require('asch-js');

app.route.post('/user/bal', async function (req, cb) {
    var params = {
        owner: req.query.owner,
    };
    var response = await app.balances.get(owner);
    return response;
});

app.route.post('/user/bal1', async function (req, cb) {
    var params = {
        owner: req.query.owner,
    };
    let cond={
        Token: {
           mintAt: owner
        } 
    }
    var response = await app.model.Block.count(cond);
    return response;
});