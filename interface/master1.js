//var AschJS = require('asch-js');

app.route.post('/user/bal', async function (req, cb) {
    var params = {
        owner: req.query.owner,
    };
    var response = await app.balances.get(params.owner);
    return response;
});

app.route.post('/user/bal1', async function (req, cb) {
    var params = {
        owner: req.query.owner,
    };
    let cond={
           mintAt: owner
    }
    var response = await app.model.Token.count(cond);
    return response;
});



