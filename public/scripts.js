function omdbSearch(query, favoritedIDs){
	var resultsDiv = document.querySelector("#results");
	resultsDiv.innerHTML = '';

	// hit OMDB's API and add the results to our page.
	getJSON("https://www.omdbapi.com/?s=" + query, function(response){
		response.Search.forEach(function(searchResult){
			document.querySelector("#results").appendChild(rowFor(searchResult, favoritedIDs));
		});
	});
}	

function getJSON(url, callback){
	// sends a GET request to the specified URL.
	var xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function(){
	  if (xhr.readyState === XMLHttpRequest.DONE) {
	  	if(xhr.status === 200){
	  		// invoke the function that was passed if the request was successful.
	  		callback(JSON.parse(xhr.responseText));
	    } else {
	      alert('Error retrieving data.');
	    }
	  }
	}
	xhr.open("GET", url, true);
	xhr.send();
}

function rowFor(searchResult, favoritedIDs){
	// create a new row for this search result.
	var searchResultRow = document.createElement('div');
	searchResultRow.className = 'result';

	// create a button with the movie's title that displays details when clicked.
	var detailButton = document.createElement('button');
	detailButton.className = 'link-styled';
	detailButton.innerHTML = searchResult.Title;
	detailButton.onclick = function(){
		displayDetail(searchResultRow, searchResult.imdbID);
	};

	// create a button that will favorite the movie when clicked.
	var favoriteButton = document.createElement('input');
	favoriteButton.type = 'image';

	// load the right image depending on whether the movie's already been favorited or not.
	if(favoritedIDs.indexOf(searchResult.imdbID) >= 0){
		favoriteButton.src = 'favorited.png';
	} else {
		favoriteButton.src = 'unfavorited.png';	
	}

	favoriteButton.onclick = function(){
		// add the movie as a favorite and change the button's image if the request succeeds.
		addFavorite(searchResult.Title, searchResult.imdbID, function(){
			favoriteButton.src = 'favorited.png';		
		});
	};
	favoriteButton.height = '20';
	favoriteButton.width = '20';

	searchResultRow.appendChild(detailButton);
	searchResultRow.appendChild(favoriteButton);

	return searchResultRow;
}

function displayDetail(parentDiv, imdbID){
	// hit OMBD's API to get details for this movie.
	getJSON("https://www.omdbapi.com/?i=" + imdbID + "&plot=full&r=json", function(response){
		var detailsDiv = parentDiv.getElementsByClassName("details")[0] || document.createElement('div');
		detailsDiv.className = "details";
		detailsDiv.innerHTML = '';
		// choose some details to display on our page.
		[
			"• Year: " + response.Year,
			"• Runtime: " + response.Runtime,
			"• Director: " + response.Director,
			"• Writer: " + response.Writer,
			"• Actors: " + response.Actors,
			"• Plot: " + response.Plot
		].forEach(function(detail){
			var detailDiv = document.createElement('div');
			detailDiv.className = 'detail';
			detailDiv.innerHTML = detail;
			detailsDiv.appendChild(detailDiv);
		});
		parentDiv.appendChild(detailsDiv);
	});
}

function addFavorite(title, imdbID, callback){
	// hit our backend to add this movie to the list of favorites.
	var xhr = new XMLHttpRequest();
	var params = 'title=' + title + '&imdbID=' + imdbID;
	xhr.open('POST', '/favorites', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 	xhr.onreadystatechange = function(){
	  if (xhr.readyState === XMLHttpRequest.DONE) {
	  	if(xhr.status === 200){
	  		callback();
	    } else {
				alert('Error retrieving data.');	    	
	    }
	  }
	}
	xhr.send(params);
}
