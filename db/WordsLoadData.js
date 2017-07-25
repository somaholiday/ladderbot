var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing words into DynamoDB. Please wait.");

var entries = JSON.parse(fs.readFileSync('../word_ladders.json', 'utf8'));
entries.forEach(function(entry) {
    var params = {
        TableName: "Words",
        Item: {
            "team_and_channel_id":  `${entry.team_id}-${entry.channel_id}`,
            "word": entry.word,
            "user_name":  entry.user_name,
            "text":  entry.text,
            "timestamp":  entry.timestamp,
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add word", entry, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", entry.word);
       }
    });
});
