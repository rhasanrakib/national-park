let baseUrl = "https://developer.nps.gov/api/v1/";

const searchSongs = () => {
  const searchText = document.getElementById("search-field").value.trim();

  queryParams = {
    api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
    ...(searchText != "" && { q: searchText }),
  };
  console.log(queryParams);
  // load data
  const url = `${baseUrl}activities?${new URLSearchParams(queryParams)}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displaySongs(data.data))
    .catch((error) =>
      displayError("Something Went Wrong!! Please try again later!")
    );
};

const displaySongs = (songs) => {
  const songContainer = document.getElementById("song-container");
  songContainer.innerHTML = "";

  songs.forEach((song) => {
    const songDiv = document.createElement("div");
    songDiv.className = "single-result row align-items-center my-3 p-3";

    songDiv.innerHTML = `
        <div class="col-md-9">
            <h3 class="lyrics-name">${song.name}</h3>
            
           
        </div>
        <div class="col-md-3 text-md-right text-center">
            <button onclick="getLyric('${song.id}')" class="btn btn-success">Get Lyrics</button>
        </div>
        `;

    songContainer.appendChild(songDiv);
  });
};

const getLyric = async (artist) => {
  const url = `${baseUrl}activities/parks?${new URLSearchParams({
    api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
    id: artist,
  })}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayLyrics(data.data);
  } catch (error) {
    displayError("Sorry! I failed to load lyrics, Please try again later!!!");
  }
};



const displayLyrics = async(lyrics) => {
    park = lyrics[0].parks
    //console.log(park)
    let html='';
    for (let i of park) {
        html += `
        <a herf="#" onclick="getParkDetails('${i.parkCode}')">
            <h2>${i.fullName}</h2>
        </a>
        `;

    }

  const lyricsDiv = document.getElementById("song-lyrics");
  lyricsDiv.innerHTML = html;
};

const displayError = (error) => {
  const errorTag = document.getElementById("error-message");
  errorTag.innerText = error;
};

const getParkDetails=async (parkCode)=>{
    const url = `${baseUrl}parks?${new URLSearchParams({
        api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
        parkCode: parkCode,
      })}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        displayParksDetails(data.data[0]);
      } catch (error) {
        displayError("Sorry! I failed to load lyrics, Please try again later!!!");
      }
}

const displayParksDetails = async(parks) => {
    
    //console.log(parks)
    let html='';
    
        html += `
        
            <h2>${parks.fullName}</h2>
            <br>
            <p>${parks.description}</p>
        
        `;

    const phone=parks.contacts.phoneNumbers;
    const emailAddresses = parks.contacts.emailAddresses;
    const entranceFees = parks.entranceFees;

    html+="directionsInfo: "+parks.directionsInfo;
    html+='addresses: '+parks.addresses[0];

  const lyricsDiv = document.getElementById("song-lyrics");
  lyricsDiv.innerHTML = html;
};
