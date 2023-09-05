<template>
  <div class="app">
    <div class="app-header">
        <h1>Chuck Norris Jokes</h1>
        <nav>
          <ul>
            <li><a @click="setCategory()">Category</a></li>
            <li><a @click="setFreetext()">Free Text</a></li>
          </ul>
        </nav>
        
    </div>
    <div class="app-body">
      <div class="app-input">
        <div class="input-category" v-if="!isFreetext">
          <form @submit.prevent="handleSearch()">
            <label>Category: </label>
            <span v-if="categories.length == 0">Fetching categories...</span>
            <select id="category" name="category" v-model="search" v-if="categories.length > 0">
              <option value="">Random</option>
              <option v-for="item in categories" :value="item">{{ item }}</option>
            </select>
            <button type="submit" class="btn-submit" :disabled="loading">Search</button>
          </form>
        </div>
        <div class="input-text" v-if="isFreetext">
          <form @submit.prevent="handleSearch()">
            <label>Free text: </label>
            <input id="text" name="text" v-model="search"/>
            <button type="submit" class="btn-submit" :disabled="loading">Search</button>
          </form>
        </div>
      </div>
      <div class="app-display">
        <div class="display-joke" v-if="hasResult && !isFreetext">
          <div class="date">{{ joke.created_at | formatTime }}</div>
          <div class="joke-body">
            <div>
              {{ joke.value }}
            </div>
          </div>
        </div>
        <div class="display-joke" v-if="hasResult && isFreetext" v-for="(joke, index) in displayedJokes">
          <div class="date">{{ joke.created_at | formatTime }}</div>
          <div class="joke-body">
            <div>
              {{ joke.value }}
            </div>
          </div>
        </div>
        <div v-if="!hasResult">
          Click search to be happy!
        </div>
        <div v-if="loading">
          Getting the joke...
        </div>
      </div>
      <ul v-if="hasResult && isFreetext">
        <li>
          <a href="#" v-if="page != 1" @click="page--" aria-label="Previous">
            <span aria-hidden="true">&lsaquo;</span>
          </a>
        </li>
        <!-- <li v-for="pageNumber in pages.slice(page-1, page+4)" :class="{'active': page === pageNumber}"><a href="#" @click="page = pageNumber">{{pageNumber}}</a></li> -->
        <li>{{ page }} of {{ jokes.total }}</li>
        <li>
          <a href="#" @click="page++" v-if="page < pages.length" aria-label="Next">
            <span aria-hidden="true">&rsaquo;</span>
          </a>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { getCategories, getJoke } from './service/api';
import moment from 'moment';

export default {
  name: 'app',
  data () {
    return {
      isFreetext: false,
      search: '',
      categories: [],
      joke: {},
      jokes: {},
      hasResult: false,
      page: 1,
      perPage: 1,
      pages: [],
      loading: false,
    }
  },
  created() {
    const x = this;
    getCategories(function(response) {
      if(response.isSuccess) {
        x.categories = response.categories;
      }
    });
  },
  methods:  {
    setCategory() {
      this.isFreetext = false;
      this.search = '';
      this.hasResult = false;
    },
    setFreetext() {
      this.isFreetext = true;
      this.search = '';
      this.hasResult = false;
    },
    handleSearch() {
      const x = this;
      this.loading = true;
      getJoke(this.search, this.isFreetext, function(response) {
        console.log(response)
        if(response.isSuccess && !response.isFreetext) {
          x.joke = response.joke;
          x.hasResult = true;
          x.loading = false;
        } else if(response.isSuccess && response.isFreetext) {
          x.jokes = response.jokes;
          x.hasResult = true;
          x.loading = false;
        }
      });
    },
    setPages() {
      var numberOfPages = Math.ceil(this.jokes.result.length / this.perPage);
      for (var index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(jokes) {
      var page = this.page;
      var perPage = this.perPage;
      var from = (page * perPage) - perPage;
      var to = (page * perPage);
      return jokes.slice(from, to);
    },
  },
  watch: {
      jokes: function() {
          this.setPages();
      }
  },
  computed: {
    displayedJokes: function() {
      if(this.jokes.result) {
        return this.paginate(this.jokes.result);
      } else {
        return [];
      }
        
    }
  },
  filters: {
    formatTime: function (time) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    }
  }
}
</script>

<style>
.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.app-header, .app-body {
  width: 70%;
  margin-bottom: 30px;
}

.app-input {
  margin-bottom: 30px;
}

.app-display {
  height: 300px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: #f3f3f3;
  box-shadow: 0px 1px 16px 3px rgba(150,150,150,0.82);
  -webkit-box-shadow: 0px 1px 16px 3px rgba(150,150,150,0.82);
  -moz-box-shadow: 0px 1px 16px 3px rgba(150,150,150,0.82);
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  /* color: #42b983; */
  cursor: pointer;
}

.btn-submit {
	box-shadow: 0px 10px 14px -7px #3e7327;
	background:linear-gradient(to bottom, #77b55a 5%, #72b352 100%);
	background-color:#77b55a;
	border-radius:4px;
	border:1px solid #4b8f29;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:13px;
	font-weight:bold;
	padding:6px 12px;
	text-decoration:none;
	text-shadow:0px 1px 0px #5b8a3c;
}
.btn-submit:hover {
	background:linear-gradient(to bottom, #72b352 5%, #77b55a 100%);
	background-color:#72b352;
}
.btn-submit:active {
	position:relative;
	top:1px;
}
input {
  padding: 5px;
}
</style>
