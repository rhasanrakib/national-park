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

function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                <div class="meal-item" id = "${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a class="recipe-btn" src="#">Get recipe</a>
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
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
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
