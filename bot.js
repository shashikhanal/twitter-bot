console.log("The bot started");

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

setInterval(getTweets, 1000*60);

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
			console.log(tweets[i].screen_name);

			if (tweets[i].screen_name !== 'o_lala_o_lala') {
				setInterval(postTweets('@'+ tweets[i].screen_name + ' Thank you for tweeting about #buddha. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.'), 1000*5);
			}
		}
	}; 
}

//getTweets();

function postTweets(tweetText) {

	var tweet = {
		status: tweetText
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Error "+ err + " occured. Do someting dude!!!");
		}
		console.log(data);
	}
}

//postTweets();

// Setting up a user stream
var stream = T.stream('user');

// When someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	postTweets('@'+ screenName + ' Thank you for following me. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.');
}

// When someone tweets me
stream.on('tweet', tweeted);

function tweeted(eventMsg) {
	var fs = require('fs');
	var json = JSON.stringify(eventMsg,null,2);
	fs.writeFile("tweet.json", json);

	var replyTo = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	if(replyTo == 'o_lala_o_lala') {
		var newTweet = '@' + from + ' thank you for tweeting me. And do you know #buddha was born in #Nepal? Please visit his birthplace, Nepal.';
			postTweets(newTweet);
	}

}