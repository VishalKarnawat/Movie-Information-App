import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

const Delay = 300;
export default class MovieSearch extends LightningElement {
	selectedType = "";
	selectedSearch = "";
	selectedPageNo = "1";
	delayTimeout;
	loading = false;
	searchResult = [];
	selectedMovie = "";

	@wire(MessageContext) messageContext;

	get options() {
		return [
			{ label: 'None', value: '' },
			{ label: 'Movie', value: 'movie' },
			{ label: 'Series', value: 'series' },
			{ label: 'Episode', value: 'episode' },
		];
	}

	handleChange(event) {
		let { name, value } = event.target;

		this.loading = true;
		if (name === 'type') {
			this.selectedType = value;
		} else if (name === 'search') {
			this.selectedSearch = value;
		} else if (name === "pageno") {
			this.selectedPageNo = value;
		}

		// debouncing
		clearTimeout(this.delayTimeout);
		this.delayTimeout = setTimeout(() => {
			this.searchMovie(this.selectedSearch, this.selectedType, this.selectedPageNo);
		}, Delay);
	}

	async searchMovie(search, type, pno) {
		const url = `https://www.omdbapi.com/?s=${search}&type=${type}&page=${pno}&apikey=5dd64c4d`;
		console.log(url);
		const res = await fetch(url);
		const data = await res.json();
		console.log("Movie search output ", data);
		this.loading = false;
		if (data.Response === 'True') {
			this.searchResult = data.Search;
		}
	}

	get displaySearchResult() {
		return this.searchResult.length > 0 ? true : false;
	}

	movieSelectedHandler(event) {
		this.selectedMovie = event.detail;
		const payload = { movieId: this.selectedMovie };
		publish(this.messageContext, MOVIE_CHANNEL, payload);
	}
}