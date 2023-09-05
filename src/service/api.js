import axios from 'axios';

let config = {
  headers: {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
  }
}

const host = 'localhost';
const PORT = process.env.PORT || 3000;

const hostname = 'http://'+host+":"+PORT

function getCategories (_callback) {
  axios.get(hostname+"/api/categories", config).then(function(response) {
    if(response.status == 200) {
      _callback({'isSuccess': 1, 'categories': response.data });
    } else {
      _callback({'isSuccess': 0, 'categories': [] });
    }
  });
}

function getJoke(data, isFreetext, _callback) {
  if(!isFreetext) {
    axios.get(hostname+"/api/getjoke/"+data, config).then(function(response) {
      if(response.status == 200) {
        _callback({'isSuccess': 1, 'joke': response.data, 'isFreetext': isFreetext });
      } else {
        _callback({'isSuccess': 0, 'joke': {}, 'isFreetext': isFreetext });
      }
    });
  } else {
    axios.get(hostname+"/api/getjoke/freetext/"+data, config).then(function(response) {
      if(response.status == 200) {
        _callback({'isSuccess': 1, 'jokes': response.data, 'isFreetext': isFreetext });
      } else {
        _callback({'isSuccess': 0, 'jokes': {}, 'isFreetext': isFreetext });
      }
    });
  }
} 


export {
  getCategories,
  getJoke
}