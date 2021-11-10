
let baseUrl = "https://developer.nps.gov/api/v1/";
function render(list){
  const serachSuggDom = document.getElementById('search-suggestion');
  serachSuggDom.innerHTML=''
  
  if (list){
    html=`<ul>`;
  html+="<br>";
  for(i of list){
    name = i.name;
    html+=`<li onclick="searchActivity('${name}')"> ${name} </li>`
  }
  html+='</ul>';
    serachSuggDom.innerHTML=html;
    
  }
  else{
    //console.log(Paisi)
    serachSuggDom.innerHTML='';
  }
  
}

function showSuggestion(data,searchText){
  searchText=searchText.toLowerCase();
  data = data.filter(function(elem){
    name = elem.name.toLowerCase();
    //console.log("================",name,"=============")
    if(name.indexOf(searchText) > -1){
      //console.log(elem);
      return elem;
    }
  });
  
  if(searchText===""){
    render(null)    
  }
  else{
    render(data)
  }
  //console.log(data)
  
}

function keyPressSuggestion(){
  
  const searchText = document.getElementById("search-field").value.trim();
  queryParams = {
    api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
    //...(searchText != "" && { q: searchText }),
  };
  const hideBg = document.querySelector("body");
      hideBg.style.backgroundImage='none';
      const url = `${baseUrl}activities?${new URLSearchParams(queryParams)}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showSuggestion(data.data,searchText))
    .catch((error) =>
      console.log(error.message)
    );
}

const searchActivity = (searchText="") => {
  searchText = searchText!=""?searchText:document.getElementById("search-field").value.trim();
  document.getElementById("search-field").value=searchText;
  const serachSuggDom = document.getElementById('search-suggestion');
  serachSuggDom.innerHTML=''



  const hideBg = document.querySelector("body");
      hideBg.style.backgroundImage='none';
  queryParams = {
    api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
    ...(searchText != "" && { q: searchText }),
  };
  console.log(queryParams);
  // load data
  const url = `${baseUrl}activities?${new URLSearchParams(queryParams)}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayActivity(data.data))
    .catch((error) =>
      displayError("Something Went Wrong!! Please try again later!")
    );
};

const displayActivity = (songs) => {
  const songContainer = document.getElementById("song-container");
  songContainer.innerHTML = "";

  songs.forEach((song) => {
    const songDiv = document.createElement("div");
    songDiv.className = "single-result row align-items-center my-3 p-3";

    songDiv.innerHTML = `
        <div class="col-md-9">
            <h3 class="lyrics-name">${song.name}</h3>
            
           
        </div>
        <div class="col-md-3 text-md-right text-right">
            <button onclick="getLyric('${song.id}')" class="btn btn-success">more+</button>
        </div>
        `;

    songContainer.appendChild(songDiv);
  });
};

const getLyric = async (artist) => {
  
  const hideBar = document.querySelector("#song-container");
  hideBar.style.display = "none";
  const url = `${baseUrl}activities/parks?${new URLSearchParams({
    api_key: "j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw",
    id: artist,
  })}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayParkDetails(data.data);
  } catch (error) {
    displayError("Sorry! I failed to load , Please try again later!!!");
  }
};



const displayParkDetails = async(lyrics) => {
    park = lyrics[0].parks
    //console.log(park)
    let html='';
    for (let i of park) {
        html += `
        <a class="park-details" herf="#" onclick="getParkDetails('${i.parkCode}')">
            <h2 class="park-item park-header">${i.fullName}</h2>
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
        
            <h2 class="park-item-name">${parks.fullName}</h2>
            <br>
            <div class="text-area-content"><p>${parks.description}</p></div>
        
        `;

    const phone=parks.contacts.phoneNumbers;
    const emailAddresses = parks.contacts.emailAddresses;
    const entranceFees = parks.entranceFees;

    html+='<h3 style="margin-bottom: 30px">Entrance Fees</h3>'
    for(const i of entranceFees){
        html+=`
        <div class="cost-area">
          <p style="margin-bottom:10px; color: blue;">Cost: ${i.cost}</p>
          <p> Description: ${i.description}</p>
          <p> Title: ${i.title}</p>
        </div>
        `;
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
                        html+=`<div class="img__area"><img class="gallery-img" src='${i.url}' alt='${i.altText}'></div>`
                     }
                }
            }
        }
    }

  const lyricsDiv = document.getElementById("song-lyrics");
  lyricsDiv.innerHTML = html;
};
