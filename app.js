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
    fetch(`${baseUrl}activities?${new URLSearchParams({
        api_key:'j8lMm6FaFcghlNpqXfi3Fq6rbFX0TZt4YzBKxOZw',
        q:searchInputTxt
    })}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.data.length>0) {
                
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
    document.getElementById("hide-show").style.display="block";
    document.getElementById("wrapper").style.display="none";
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`${baseUrl}/activities/parks?${new URLSearchParams(...queryParams,...{id:mealItem.id})}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data)
                mealRecipeModal(data.meals)
            });
    }
}

// create meals 
function mealRecipeModal(meal) {
    meal = meal[0];
    let ingredient = "";

    for (let i = 1; i <= 20; i++) {
        let mealIngredient = meal["strIngredient" + i.toString()];
        let mealMeasure = meal["strMeasure" + i.toString()];
        if (mealIngredient === "") {
            continue;
        }
        ingredient = ingredient + `


        <p>
        ${mealMeasure} ${mealIngredient}
        </p>
        `;
        document.getElementById("ingredients").innerHTML = ingredient;

    }
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}
    </p>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
    </div>
    
    `;
    document.getElementById("showRecipes").innerHTML = html;

}
