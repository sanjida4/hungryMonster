const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealElement = document.getElementById('meals');
const resultHeading = document.getElementsByClassName('result-heading');
const single_mealElement = document.getElementById('single-meal');


//search meals
function searchMeal(e){
    e.preventDefault();

    //get search meal
    const userInput = search.value;

    //check for empty
    if(userInput.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `
            <h2>Search Result For ${userInput}
            `;
            if(data.meals === null){
                resultHeading.innerHTML = `
                <h2>There are no result for ${userInput}
                `;
            }
            else{
                mealElement.innerHTML = data.meals.map(
                    (meal) => `
                        <div class = "meal">
                        <img src= "${meal.strMealThumb}" alt= "${meal.strMeal}">
                        <div class= "meal-info" data-mealID = "${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                        </div>
                        `
                ).join("");
            }
        });
    }
    else{
        alert('Please insert a value in search bar');
    }
}

//fetch meal by id
function getMealById(idMeal){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

//add meal to dom
function addMealToDOM(meal){
    const ingredients = [];
    for(let i =0; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`
            ${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}
            `);
        }
        else{
            break;
        }
    }
    
    single_mealElement.innerHTML = `
    <div class = "single-meal">
    <h1>${meal.strMeal}</h1>
    <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}"/>
    <div class = "single-meal-info">
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    </div>
    </div>
    `
}

//event listeners
submit.addEventListener('submit', searchMeal);
mealElement.addEventListener("click", e =>{
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains("meal-info");
        }
        else{
            return false;
        }
    });
    if(mealInfo){
        const idMeal = mealInfo.getAttribute("data-mealid");
        getMealById(idMeal);
    }
})
