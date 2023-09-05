const http = require('http');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const hostname = 'localhost';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost'
}));


app.get("/api/categories", (request, response) => {
  axios.get('https://api.chucknorris.io/jokes/categories')
  .then(res => {
    const categories = res.data;

    response.send(JSON.stringify(categories));
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
});

app.get("/api/getjoke/:category?", (request, response) => {

  let params = request.params;
  let url = "https://api.chucknorris.io/jokes/random"

  if(params.category) {
    url = 'https://api.chucknorris.io/jokes/random?category='+params.category;
  }

  axios.get(url)
  .then(res => {
    const joke = res.data;

    response.send(JSON.stringify(joke));
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
});

app.get("/api/getjoke/freetext/:q", (request, response) => {

  let params = request.params;
  if(params.q) {
    axios.get("https://api.chucknorris.io/jokes/search?query="+params.q)
    .then(res => {
      const joke = res.data;
  
      response.send(JSON.stringify(joke));
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
  } else {
    response.send(JSON.stringify({ value: 'Text is empty. Please input text.' }))
  }
  
});


app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});