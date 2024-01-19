const mealsEl=document.getElementById("meals");
const favMeal=document.getElementById("fav-meal");

const searchBtn=document.getElementById("search-btn");
const searchTerm=document.getElementById("search-term");

const popup=document.getElementById("meal-popup");
const closePopupBtn=document.getElementById("close-popup");
const showInfo=document.getElementById("show-info");

async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    respData = await resp.json();
    randomMeal = respData.meals[0];
    console.log(randomMeal);
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
    respData = await resp.json();
    Meal = respData.meals[0];
    return Meal;
}
async function getMealByTerm(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
    respData = await resp.json();
    Meal = await respData.meals;
    return Meal;
}

function addMeal(mealData, random = false) {
    const meal = document.createElement("div");
    meal.classList.add("meal");
    meal.innerHTML = `
    <div class="meal-header">
    ${random?`<span class="random">Random Racipe</span>`:''}
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button id="fav-btn"><i class="fa-solid fa-heart fa-lg"></i></button>
    </div>`

    const btn=meal.querySelector("#fav-btn");
    btn.addEventListener("click",()=>{
        if(btn.classList.contains("active")){
            btn.classList.remove("active");
            removeMealLS(mealData.idMeal);
        }
        else{
            btn.classList.add("active");
            addMealLS(mealData.idMeal);
        }
        fetchFavMeal();
    })
    meal.addEventListener("click",()=>{
        showRecipe(mealData);
    })
    meals.appendChild(meal);
}


function addMealLS(mealId){
    const mealIds=getMealLS();
    localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId]));
}

function removeMealLS(mealId){
    const mealIds=getMealLS();
    localStorage.setItem("mealIds",JSON.stringify(mealIds.filter((id)=>id!==mealId))
    );
}

function getMealLS(){
    const mealIds=JSON.parse(localStorage.getItem("mealIds"));
    return mealIds===null?[]:mealIds;
}

function addFavMeal(mealData){
    const favmeal=document.createElement("li");
    favmeal.innerHTML=` <img src="${mealData.strMealThumb}" alt=""><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fa-solid fa-xmark"></i></button>
`
    const clear=favmeal.querySelector(".clear");
    clear.addEventListener("click",()=>{
        removeMealLS(mealData.idMeal);
        fetchFavMeal();
    })
    favmeal.addEventListener("click",()=>{
        showRecipe(mealData);
    })
    favMeal.appendChild(favmeal);

}

searchBtn.addEventListener("click",async()=>{
    mealsEl.innerHTML="";
    const search=searchTerm.value;
    const meals=await getMealByTerm(search);
    if(meals){
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
})

function showRecipe(mealData){
    showInfo.innerHTML="";

    const ingredients=[];
    for(let i=1;i<=20;i++){
        if(mealData['strIngredient'+i]){
            ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`)
        }
        else{
            break; 
        }
    }

    const recipeEl=document.createElement("div");
    recipeEl.innerHTML=`
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            <p>${mealData.strInstructions}</p>
            <h3>Ingredients</h3>
            <ul>
                ${ingredients
                    .map(
                        (ing)=>`<li>${ing}</li>`
                ).join("")}
            </ul>
    `;
    showInfo.appendChild(recipeEl);
    popup.classList.remove("hidden");
}

fetchFavMeal();
async function fetchFavMeal(){
    favMeal.innerHTML="";
    const mealIds=getMealLS();
    for(let i=0;i<mealIds.length;i++){
        const mealId=mealIds[i];
        meal=await getMealById(mealId);
        addFavMeal(meal);
    }
}

closePopupBtn.addEventListener("click",()=>{
    popup.classList.add("hidden");
})

getRandomMeal();
