var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Words",
    KeySchema: [       
        { AttributeName: "team_and_channel_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "timestamp", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "team_and_channel_id", AttributeType: "S"},
        { AttributeName: "timestamp", AttributeType: "N" },
        // { AttributeName: "user_id", AttributeType: "S" },
        // { AttributeName: "user_name", AttributeType: "S" },
        // { AttributeName: "word", AttributeType: "S" },
        // { AttributeName: "text", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
