const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./config.js');
// var mysql = require("mysql");

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

///////////////////////////////////////////////////////////////////////
// DB config

// var db_config = {
//   host: 'localhost',
//   user:'root',
//     password: '',
//     database: 'test'    
// };

// var con = mysql.createConnection(db_config);
// con.connect((err)=>{
// 	if (err) console.log(err);
// 	else{
// 		console.log("conneected")
// 	}
// })

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


// server.post('/stud', (req, res) => {
// 	roll = req.body.result.parameters.roll;
// 	console.log(roll);
// 	var stm = `select * from test where roll = ${roll}`;
// 	con.query(stm, (err, data) => {

// 		dataToSend = `my name is ${data[0].name} & My Roll No. is ${data[0].roll}`;
// 		return res.json({
//                 speech: dataToSend,
//                 displayText: dataToSend,
//                 source: 'stud'
//             });

// 	})

// })

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