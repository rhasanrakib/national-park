const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
function btnClose() {
    document.getElementById("hide-show").style.display="none";
    document.getElementById("wrapper").style.display="block"; 
}
// get meal list 
let queryParams={
    api_key:'j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw',
}
let baseUrl='https://developer.nps.gov/api/v1/'
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if(searchInputTxt!=""){
        queryParams={
            ...queryParams,
            ...{q:searchInputTxt}
        }
    }
    console.log(queryParams)
    fetch(`${baseUrl}activities?${new URLSearchParams(
        queryParams
    )}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.data) {
                
                data.data.forEach(elem => {
                    html += `
                <div class="meal-item" id = "${elem.id}">
                        
                        <div class="meal-name">
                            <h3>${elem.name}</h3>
                            <a class="recipe-btn" src="#">Enter</a>
                        </div>
                    </div>
                `
                });
                mealList.classList.remove('notFound');
            }
            else {
                html = "Sorry, we didn't find any meal!!";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        })
}

// get meal recipe
function getMealRecipe(e) {
    //console.log(e)
    document.getElementById("hide-show").style.display="block";
    document.getElementById("wrapper").style.display="none";
    //console.log("here");
    e.preventDefault();
    
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        //console.log(`${baseUrl}activities/parks?${new URLSearchParams({...queryParams,...{id:mealItem.id}})}`)
        fetch(`${baseUrl}activities/parks?${new URLSearchParams({...queryParams,...{id:mealItem.id}})}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data.data)
                mealRecipeModal(data.data)
            });
    }
}

// create meals 
function mealRecipeModal(park) {

 if(park){
     park = park[0].parks;
 }
 let html='';

    for(let i of park){
        html += `
        
        <a herf="#">
        
            <h2 class="recipe-title">${i.fullName}</h2>
            <p class="recipe-category">${i.designation}
            </p>
        
        </a>
        
        
        `;
        
    }
    document.getElementById("showRecipes").innerHTML = html;
}
