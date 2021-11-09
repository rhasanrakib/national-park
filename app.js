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

    html+='<br>Entrance Fees<br>'
    for(const i of entranceFees){
        html+=`Cost: ${i.cost}<br> Description: ${i.description}<br> Title: ${i.title}<br>`;
    }

    html+="<br> Contacts: <br>";
    for(const i of phone){
        html+=`Phone: ${i.phoneNumber} type: ${i.type}<br>`;
    }
    for(const i of emailAddresses){
        html+=`email: ${i.emailAddress}<br>`;
    }
    html+="<br>Directions Info: "+parks.directionsInfo;
    html+='<br>addresses: '+parks.addresses[0];
    html+=`<br>Web: <a href='${parks.url}'>${parks.fullName}</a>`
    html+='<br> Wecams:<br>'

    let res;
    const url = `${baseUrl}webcams?${new URLSearchParams({
        api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
        parkCode: parks.parkCode,
      })}`;
      try {
          
        res = await fetch(url);
        
        data = await res.json();
        
        res=data.data;
        
        
      } catch (error) {
          console.log(error)
        displayError("Sorry! I failed to load lyrics, Please try again later!!!");
      }
    if(res){
        for(const j of res){
            console.log(j.images)
            if(j.images){
               
        
                if(j.images.length>0){
                    for(const i of j.images){
                        console.log(i)
                        html+=`<img src='${i.url}' alt='${i.altText}'> <br>`
                     }
                }
            }
        }
    }

  const lyricsDiv = document.getElementById("song-lyrics");
  lyricsDiv.innerHTML = html;
};
