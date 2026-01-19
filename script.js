document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  // Search when button clicked
  searchBtn.addEventListener("click", searchMusic);

  // Also allow pressing Enter
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchMusic();
    }
  });

  // Search Music Function
  async function searchMusic() {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a song or artist name!");
      return;
    }

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=none`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      displayResults(data.results);
    } catch (error) {
      console.error("Error fetching music data:", error);
      resultsDiv.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
  }

  // Display songs in UI
  function displayResults(songs) {
    resultsDiv.innerHTML = "";

    if (!songs || songs.length === 0) {
      resultsDiv.innerHTML = "<p>No songs found.</p>";
      return;
    }

    songs.forEach((song) => {
      const card = document.createElement("div");
      card.classList.add("song-card");

      // Duration calculate
      let duration = "N/A";
      if (song.trackTimeMillis) {
        const minutes = Math.floor(song.trackTimeMillis / 60000);
        const seconds = Math.floor((song.trackTimeMillis % 60000) / 1000);
        duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }

      // Create song card
      card.innerHTML = `
        <img src="${song.artworkUrl100.replace("100x100", "300x300")}" 
             alt="${song.trackName}" class="album-art" />
        <h3>${song.trackName}</h3>
        <p>${song.artistName}</p>
        <p>Duration: ${duration}</p>
        <audio controls src="${song.previewUrl}"></audio>
      `;

      const img = card.querySelector(".album-art");
      const audio = card.querySelector("audio");

      // Fix: Only one audio plays at a time
      img.addEventListener("click", () => {
        document.querySelectorAll("audio").forEach((a) => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0; // reset to beginning
          }
        });
        audio.play();
      });

      //  If user plays manually, pause others too
      audio.addEventListener("play", () => {
        document.querySelectorAll("audio").forEach((a) => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
          }
        });
      });

      resultsDiv.appendChild(card);
    });
  }
});