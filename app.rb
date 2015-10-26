require 'sinatra'
require 'json'

get '/' do
  # render the search page.
  # we need to send the IDs of movies that have been favorited,
  # because we render different button images for favorited and unfavorited movies.
  @favorited_movie_ids = JSON.parse(File.read('favorites.json'))['favorites'].map { |movie| movie['imdbID'] }
  erb :search
end

get '/favorites' do
  # render the favorited movies page.
  @favorited_movie_titles = JSON.parse(File.read('favorites.json'))['favorites'].map { |movie| movie['title'] }
  erb :favorites
end

post '/favorites' do
  # we need to save both the title and ID of favorited movies.
  unless params[:title] && params[:imdbID]
    return 'Invalid request - missing title or IMDB ID.'
  end
  # let's also prevent already favorited movies from being refavorited.
  favorites = JSON.parse(File.read('favorites.json'))
  favorited_movie_ids = favorites['favorites'].map { |movie| movie['imdbID'] }
  if favorited_movie_ids.include? params[:imdbID]
    return 'This movie has already been favorited.'
  else # add the favorited movie to the list of favorites.
    movie = { title: params[:title], imdbID: params[:imdbID] }
    favorites['favorites'] << movie
    File.write('favorites.json', JSON.pretty_generate(favorites))
    movie.to_json  
  end
end
