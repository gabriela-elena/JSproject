// set up dom elements for all functions
drinkName = document.getElementById("cocktailName");
drinkImageElement = document.createElement("img");
drinkImage = document.querySelector("#avatar");
drinkIngredient = document.querySelector("#ingredients");
drinkHowTo = document.getElementById("cocktailSteps");

function randomDrink() {
  randomAPI = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
  button = document.querySelectorAll("#randomName");
  for (i = 0; i < button.length; i++) {
    button[i].addEventListener("click", () => {
      // drinkName.innerHTML = "<div class='spinner-grow text-primary' role='status'><span class='sr-only'></span></div>"
      drinkIngredient.innerHTML = "";
      if (document.querySelector("#removeAfterClick")) {
        document.querySelector("#removeAfterClick").remove();
      }
      let data = fetch(randomAPI)
        // how to wait till all data are ready and then show them?
        .then((data) => data.json())
        .then((response) => {
          buildModalInfo(
            drinkName,
            drinkImageElement,
            drinkImage,
            drinkIngredient,
            drinkHowTo,
            response,
            0
          );
        });
    });
  }
}

// set up cocktail info in modal
function buildModalInfo(a1, a2, a3, a4, a5, response, i) {
    // clear data before each build
  a4.innerHTML = "";
  createdP = document.createElement("p");
  if (a5.children.length > 0) {
    a5.removeChild(a5.lastChild);
  }

  a1.textContent = response["drinks"][i]["strDrink"];
  a2.style.width = "180px";
  a2.src = response["drinks"][i]["strDrinkThumb"];
  a3.append(a2);

  // create the ingredient list, 15 is the length of the ingredients 
  // and measurements in the API array
  for (k = 1; k <= 15; k++) {
    let ingredientEl = response["drinks"][i][`strIngredient${k}`];
    let measurementEl = response["drinks"][i][`strMeasure${k}`];
    if (
      ingredientEl !== null &&
      ingredientEl !== "" &&
      measurementEl !== null
    ) {
      a4.innerHTML += `<li>${ingredientEl} : ${measurementEl}</li>`;
    }
  }
  // show how to make the cocktail
  createdP.id = "removeAfterClick";
  createdP.textContent = response["drinks"][i]["strInstructions"];
  a5.append(createdP);
}

function drinkSearch() {
  const searchForm = document.getElementById("search-bar");
  const searchFormIngredient = document.getElementById("search-bar-2");
  const searchBar = document.getElementById("search-input");
  const searchBarIngredient = document.getElementById("search-input-2");
  const searchDiv = document.getElementById("search-result");
  const searchTitle = document.getElementById("search-title");
  const searchResult = document.getElementById("search-result-list");

  [searchForm, searchFormIngredient].forEach(element => {
    element.addEventListener("submit", (event) => {
    event.preventDefault();
    searchDiv.style.display = "block";
    // clear data before each search
    searchResult.innerHTML = "";
    searchTitle.textContent = "Search Result for";
    // distinguish Search Drink Name and Search Ingredient
    if (searchBar.value !== "" && event.target.innerText === 'Search Drink Name') {
      searchTitle.textContent += ` '${searchBar.value}':`;
      searchAPI = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchBar.value}`;
    }
    if (searchBarIngredient.value !== "" && event.target.innerText === 'Search Ingredient') {
      searchTitle.textContent += ` '${searchBarIngredient.value}':`;
      searchAPI_2 = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchBarIngredient.value}`
    }

    // need to call Search Drink Name API again for Search Ingredient
    if (searchBar.value !== "" && event.target.innerText === 'Search Drink Name') {
      let data = fetch(searchAPI).then((response) => response.json());
      data.then((result) => {
        for (i = 0; i < result["drinks"].length; i++) {
          // generate search results, each item is shown as a link
          searchResult.innerHTML += `<a style="text-decoration:underline; cursor:pointer;" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><li id="list_${i}" >${result["drinks"][i]["strDrink"]}</li></a>`;
        }
      searchResult.addEventListener("click", (event) => {
        for (i = 0; i < result["drinks"].length; i++) {
          if (event.target && event.target.id === `list_${i}`) {
            buildModalInfo(
              drinkName,
              drinkImageElement,
              drinkImage,
              drinkIngredient,
              drinkHowTo,
              result,
              i
            );
          }
        }
      });
    });
  }
  // the first condition distinguishing Search Drink Name and Search Ingredients ends here
  else if (searchBarIngredient.value !== "" && event.target.innerText === 'Search Ingredient') {
    let data = fetch(searchAPI_2).then((response) => response.json());
    let list_array = []
    data.then((result) => {
      for (i = 0; i < result["drinks"].length; i++) {
        // generate search results, each item is shown as a link
        searchResult.innerHTML += `<a style="text-decoration:underline; cursor:pointer;" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><li id="list_${i}" >${result["drinks"][i]["strDrink"]}</li></a>`;
        list_array.push(result["drinks"][i]["idDrink"])
      }
    // calling Search Drink Name API
    searchResult.addEventListener("click", (event) => {
      result_data = fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${event.target.textContent}`).then((response) => response.json())
      // console.log(list_array)
      result_data.then((result_2) => {
        for (i = 0; i < list_array.length; i++) {
          if (event.target && event.target.id === `list_${i}`) {
            buildModalInfo(
              drinkName,
              drinkImageElement,
              drinkImage,
              drinkIngredient,
              drinkHowTo,
              result_2,
              0
            );
          }
        }
      })
      
    });
  });
}


  });
})
};


randomDrink();
drinkSearch();
