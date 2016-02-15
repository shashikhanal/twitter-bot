console.log("The bot started");

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

// calls getTweets() every minute
setInterval(getTweets, 1000*60);

// get tweets from the twitter which contains text 'buddha'
function getTweets(){

	var params = {
		q: 'buddha',
		count: 10
	}
	T.get('search/tweets', params, gotData);

	function gotData(err, data, response) {
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text);
			console.log(" Screen name: " +tweets[i].screen_name);

			var randomNo = Math.floor(Math.random()*1000);

			if (tweets[i].screen_name !== 'o_lala_o_lala') {
				postTweets('@'+ tweets[i].screen_name +' '+ randomNo + ' Thank you for tweeting about #buddha. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.');
			}
		}
	}; 
}

// posts tweets in the twitter
function postTweets(tweetText) {

	var tweet = {
		status: tweetText // tweet text
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Error "+ err + " occured. Do someting dude!!!");
		}
	}
}

// Setting up a user stream
var stream = T.stream('user');

// When someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;

	var randomNo = Math.floor(Math.random()*1000);

	postTweets('@'+ screenName + ' '+randomNo+ ' Thank you for following me. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.');
}

// When someone tweets me
stream.on('tweet', tweeted);

function tweeted(eventMsg) {
	var fs = require('fs');
	var json = JSON.stringify(eventMsg,null,2);
	fs.writeFile("tweet.json", json); // writes the tweets to the file named 'tweet.jason'

	var replyTo = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	var randomNo = Math.floor(Math.random()*1000);

	// replies to the user who tweeted me with a message
	if(replyTo == 'o_lala_o_lala') {
		var newTweet = '@' + from + ' '+ randomNo + ' thank you for tweeting me. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.';
			postTweets(newTweet);
	}

}