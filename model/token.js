module.exports = {
    name: "tokens",
    fields: [
        {  
            name: 'tokenName',
            type: 'String', 
            length: 255,
        },
        {
            name: 'tokenId',
            type: 'String',
            length: 255,
            // not_null: true,
            // primary_key:true
        },
        {
            name: 'mintBy',
            type: 'String',
            length: 255,
        },
        {
            name: 'mintAt',
            type: 'String',
            length: 255,
        }
    ]
}
