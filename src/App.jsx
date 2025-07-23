import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Heart,
  List,
  Loader,
  Star,
  TicketPlus,
  X,
  Search,
  Film,
  Clock,
  User,
  Clapperboard,
} from "lucide-react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = "87829791";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) ?? [];
  });

  function handleSelectMovie(id) {
    setSelectedId((s) => (id === s ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong fetching the data");

        const data = await res.json();
        if (data.Response === "False") throw new Error("No movies found");

        setMovies(data.Search);
        setError("");
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">UsePopcorn</h1>
          </div>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="pl-10 w-full bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movies List Section */}
          <section className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Film className="h-5 w-5 text-indigo-600" />
                  Movies & TV
                </h2>
                {!isLoading && !error && movies.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {movies.length} results
                  </span>
                )}
              </div>

              {isLoading && (
                <div className="flex justify-center py-12">
                  <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-gray-500">⚠️ {error}</p>
                </div>
              )}

              {!isLoading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movies?.map((movie) => (
                    <div
                      key={movie.imdbID}
                      onClick={() => handleSelectMovie(movie.imdbID)}
                      className="group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-gray-100">
                        <img
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          src={
                            movie.Poster !== "N/A"
                              ? movie.Poster
                              : "https://via.placeholder.com/300x450?text=No+Poster"
                          }
                          alt={`${movie.Title} poster`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div>
                            <h3 className="text-white font-medium text-sm">
                              {movie.Title}
                            </h3>
                            <p className="text-gray-300 text-xs">
                              {movie.Year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Watchlist Section */}
          <section className="flex-1">
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <WatchedSummary
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Year: year,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `${title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="aspect-video w-full bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={
                  poster !== "N/A"
                    ? poster
                    : "https://via.placeholder.com/800x450?text=No+Poster"
                }
                alt={`Poster of ${title}`}
              />
            </div>
            <button
              onClick={onCloseMovie}
              className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-sm hover:bg-white transition-colors"
              aria-label="Close movie details"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {title} <span className="text-gray-500">({year})</span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{released}</span>
                <span>•</span>
                <span>{runtime}</span>
                <span>•</span>
                <span>{genre}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="font-medium">{imdbRating}</span>
                  <span className="text-xs">/10</span>
                </div>
                <span className="text-sm text-gray-500">IMDb Rating</span>
              </div>

              <p className="text-gray-700 mb-6">{plot}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    Director
                  </h3>
                  <p className="text-gray-600">{director}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    Cast
                  </h3>
                  <p className="text-gray-600">{actors}</p>
                </div>
              </div>
            </div>

            {!isWatched ? (
              <div className="border-t pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Rate this movie
                  </h3>
                  <StarRating
                    maxRating={10}
                    size={28}
                    onSetRating={setUserRating}
                  />
                </div>
                {userRating > 0 && (
                  <Button className="w-full" onClick={handleAdd} size="lg">
                    <TicketPlus className="h-4 w-4 mr-2" />
                    Add to Watchlist
                  </Button>
                )}
              </div>
            ) : (
              <div className="border-t pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <p className="text-gray-700">
                    You rated this movie{" "}
                    <span className="font-semibold">{watchedUserRating}</span>{" "}
                    stars
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched, handleDeleteWatched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const totalRuntime = watched.reduce((acc, movie) => acc + movie.runtime, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-indigo-600" />
          Your Watchlist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <List className="h-4 w-4" />
              <span className="text-sm font-medium">Movies & TV</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{watched.length}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Avg. IMDB Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgImdbRating || "0.0"}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Total Runtime</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalRuntime} min
            </p>
          </div>
        </div>

        {watched.length === 0 ? (
          <div className="text-center py-12 border-t border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Film className="h-full w-full" />
            </div>
            <h3 className="text-gray-900 font-medium">
              Your watchlist is empty
            </h3>
            <p className="text-gray-500 mt-1">
              Search for movies and add them to your watchlist
            </p>
          </div>
        ) : (
          <ul className="space-y-2 border-t border-gray-200 pt-6">
            {watched.map((movie) => (
              <li
                key={movie.imdbID}
                className="flex gap-4 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      movie.poster !== "N/A"
                        ? movie.poster
                        : "https://via.placeholder.com/100x150?text=No+Poster"
                    }
                    alt={`${movie.title} poster`}
                    className="h-30 object-cover rounded-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs text-gray-600">
                        {movie.imdbRating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      {movie.runtime} min
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3 w-3 text-indigo-500 fill-indigo-500" />
                    <span className="text-xs font-medium text-indigo-600">
                      Your rating: {movie.userRating}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteWatched(movie.imdbID)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Remove from watchlist"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
