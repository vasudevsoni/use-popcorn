<h1>🎬 Use-Popcorn</h1>

<p><strong>Use-Popcorn</strong> is a React.js web application that allows users to search for movies and view detailed information about each movie using the OMDb API. Users can also add movies to a personalized watchlist, making it easy to keep track of films they want to watch.</p>

<h2>🌐 Live Demo</h2>

<p>A live version of Use-Popcorn can be found <a href="https://vasudevsoni.github.io/use-popcorn/">here</a>.</p>

<h2>📚 Table of Contents</h2>
<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api-reference">API Reference</a></li>
  <li><a href="#contributing">Contributing</a></li>
</ul>

<h2 id="features">✨ Features</h2>

<ul>
  <li><strong>Movie Search:</strong> Search for any movie by title and view a list of results.</li>
  <li><strong>Movie Details:</strong> Click on a movie to see details such as the title, year, genre, rating, director, cast, and plot summary.</li>
  <li><strong>Add to Watchlist:</strong> Save movies to a watchlist to keep track of what you want to watch later.</li>
  <li><strong>Responsive Design:</strong> Optimized for both desktop and mobile devices.</li>
</ul>

<h2 id="installation">⚙️ Installation</h2>

<ol>
  <li><strong>Clone the repository:</strong>
    <pre><code>git clone https://github.com/vasudevsoni/use-popcorn.git
cd use-popcorn
    </code></pre>
  </li>
  <li><strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Get an API key:</strong>
    <ul>
      <li>Sign up at <a href="https://www.omdbapi.com/apikey.aspx">OMDb API</a> to obtain an API key.</li>
      <li>Add this key to an <code>.env</code> file in the root of your project:
        <pre><code>REACT_APP_OMDB_API_KEY=your_api_key_here</code></pre>
      </li>
    </ul>
  </li>
  <li><strong>Start the development server:</strong>
    <pre><code>npm start</code></pre>
  </li>
  <li><strong>Build for production:</strong>
    <pre><code>npm run build</code></pre>
  </li>
</ol>

<h2 id="usage">🚀 Usage</h2>

<ol>
  <li><strong>Search for a Movie:</strong>
    <ul>
      <li>Use the search bar to look up movies by title.</li>
    </ul>
  </li>
  <li><strong>View Movie Details:</strong>
    <ul>
      <li>Click on a movie from the search results to see detailed information.</li>
    </ul>
  </li>
  <li><strong>Add to Watchlist:</strong>
    <ul>
      <li>Click the "Add to Watchlist" button on a movie's details page to save it to your watchlist.</li>
    </ul>
  </li>
  <li><strong>View and Manage Watchlist:</strong>
    <ul>
      <li>Access your watchlist from the navigation bar, where you can view or remove movies.</li>
    </ul>
  </li>
</ol>

<h2 id="api-reference">📡 API Reference</h2>

<p>This project utilizes the <a href="http://www.omdbapi.com/">OMDb API</a> for fetching movie data.</p>

<ul>
  <li><strong>Base URL:</strong> <code>https://www.omdbapi.com/</code></li>
  <li><strong>Parameters:</strong>
    <ul>
      <li><code>apikey</code> (required): Your API key</li>
      <li><code>s</code> (optional): Movie title to search</li>
      <li><code>i</code> (optional): IMDb ID to get detailed movie data</li>
    </ul>
  </li>
</ul>

<p>Example request:</p>
<pre><code>GET https://www.omdbapi.com/?apikey=your_api_key&s=inception</code></pre>

<h2 id="contributing">🤝 Contributing</h2>

<p>Contributions are welcome! To contribute:</p>
<ol>
  <li>Fork the project.</li>
  <li>Create a new branch (<code>git checkout -b feature/your-feature</code>).</li>
  <li>Make your changes.</li>
  <li>Commit and push your changes (<code>git commit -m 'Add some feature'</code>).</li>
  <li>Open a pull request.</li>
</ol>
