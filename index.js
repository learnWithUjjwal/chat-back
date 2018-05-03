const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./config.js');
var mysql = require("mysql");

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

///////////////////////////////////////////////////////////////////////
// DB config

var db_config = {
  host: 'localhost',
  user:'root',
    password: '',
    database: 'test'    
};

var con = mysql.createConnection(db_config);
con.connect((err)=>{
	if (err) console.log(err);
	else{
		console.log("conneected")
	}
})

/////////////////////////////////////////////////////////////////////////////////////////////////



server.post('/get-movie-details', (req, res) => {

    // const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    const movieToSearch = req.body.result.parameters.movie;
    const reqUrl = encodeURI(`http://www.omdbapi.com/?i=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
    	console.log(responseFromAPI)
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});


server.post('/stud', (req, res) => {
	job = req.body.result.parameters.job;
	console.log(job);
    const reqUrl = encodeURI(`http://appointer-backend-api.herokuapp.com/getUsers/${job}`);
   http.get(reqUrl, (responseFromAPI) => {
        console.log(responseFromAPI)
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);

            dataToSend = `List of ${job}s: 1. ${movie.data[0].name}:${movie.data[0].phone}
            2. ${movie.data[1].name}:${movie.data[1].phone}`
     return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'stud'
            });
            
        });
    });

	// var stm = `select * from job where job = '${job}'`;
	// con.query(stm, (err, data) => {
 //        if (err) console.log(err);

	// 	dataToSend = `List of ${job}s: 1. ${data[0].name}:${data[0].mob}
 //        2. ${data[1].name}:${data[1].mob}`;
	// 	return res.json({
 //                speech: dataToSend,
 //                displayText: dataToSend,
 //                source: 'stud'
 //            });

	// })

})

server.post('/test', (req, res) => {
	job = req.body.result.parameters.job;

	return res.json({
		speech:"nothin to display",
		messages:[{
			title: "Code",
		subtitle:"Node",
		speech:"funn"

		}]
})
})

    server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
})