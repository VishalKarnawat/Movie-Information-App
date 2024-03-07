import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {

	@api movie;
	@api selectedMovieId;

	clickHandler(event) {
		const evt = new CustomEvent("selectedmovie", {
			detail: this.movie.imdbID
		});
		this.dispatchEvent(evt);
	}

	get tileSelected() {
		return this.selectedMovieId === this.movie.imdbID ? 'tile selected ' : 'tile ';
	}
}