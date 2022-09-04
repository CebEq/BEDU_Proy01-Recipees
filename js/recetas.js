
const divResultados = document.getElementById('div_resFila');
const btn_buscar = document.getElementById('btn_buscar');
const btn_sugerencia = document.getElementById('btn_sugerencia');
const divRes = document.createElement('div');
const parrResultado = document.createElement('h3');

divRes.style='color:bisque;';

// Binds search and random functions to a click event on their
// respective buttons
btn_buscar.addEventListener('click', consultarReseta);
btn_sugerencia.addEventListener('click', sugerenciaChef);

// Trigger function for random recipe, fires function to fetch
// a random recipe
function sugerenciaChef(){
    document.getElementById("txt_buscar").value='';
    divResultados.innerHTML='';
    parrResultado.innerText="Thank you for choosing the chef's suggestion";
    divRes.appendChild(parrResultado)
    divResultados.appendChild(divRes);
    consultarResetaRandom();
}

// Fetches recipes from the API based on input value
function getRecetas(valor) {
    return fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + valor)
        .then(function (response) {
            return response.json();
        })
        .then(function(data){
            return data.meals || [];
        })
  }

// Fetches a random recipe from the API
function getRecetasRandom() {
    return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(function (response) {
            return response.json();
        })
        .then(function(data){
            return data.meals || [];
        })
}

// Fires the function to show the recipe based on the random recipe
function consultarResetaRandom(){
    getRecetasRandom().then(function(data){
        console.log(data);
        muestraReceta(data[0]);
    })
}

// Gets the value to search for, fires the function to search for it
// on the API and shows the results or a message to indicate if there
// weren't results or the user didn't input anything to search for
function consultarReseta(){ 
    const valor = document.getElementById("txt_buscar").value;
    divResultados.innerHTML='';
    document.getElementById("div_modal").innerHTML='';
    if (valor.length==0){
        parrResultado.innerText = 'Ingresa una reseta para buscar o elije la sugerencia del chef.';
        divRes.appendChild(parrResultado)
        divResultados.appendChild(divRes);
    }
    else{
        getRecetas(valor).then(function(data){
                const i = 0;
                if (data.length>0){
                    data.forEach(element => {
                        const divContendor = document.createElement('div');
                        divContendor.className='col m-3';
                        divContendor.appendChild(creaCard(element));
                        divResultados.appendChild(divContendor);
                    })
                }
                else{
                    parrResultado.innerText = 'Sorry, the recipe you are looking for was not found, try the chef's suggestion';
                    divRes.appendChild(parrResultado)
                    divResultados.appendChild(divRes);
                }
            });
        }
}

// Creates a presentation card for a recipe (search results)
function creaCard(obj){
    const card = document.createElement('div');
    const img = document.createElement('img');
    const subCard = document.createElement('div');
    const titulo = document.createElement('h3');
    const parr = document.createElement('p');
    const parr2 = document.createElement('p');

    img.onclick = function () {
        muestraReceta(obj);
    };
    img.style.cursor='pointer'; 

    card.className = 'card';
    card.style = 'width: 18rem;';

    titulo.className = 'card-title';
    titulo.innerText = obj.strMeal;
    
    subCard.className = 'card-body';

    img.className = 'card-img-top';
    img.src = obj.strMealThumb;

    parr.className = 'card-text';
    parr2.className = 'card-text';

    parr.innerText = obj.strArea;
    parr2.innerText = obj.strCategory;

    subCard.appendChild(titulo);
    subCard.appendChild(parr);
    subCard.appendChild(parr2);
    card.appendChild(img);
    card.appendChild(subCard);

    return card;
}

// Creates the content for a full recipe
function muestraReceta(obj){
    divResultados.innerHTML='';
    parrResultado.innerText = 'Excellent choice!';
    divRes.appendChild(parrResultado);
    divResultados.appendChild(divRes);
    document.getElementById("div_modal").innerHTML = '';
    document.getElementById("div_modal").display = "block";

    const card = document.createElement('div');
    const img = document.createElement('img');
    const subCard = document.createElement('div');
    const titulo = document.createElement('h3');
    const parr = document.createElement('p');
    const parr2 = document.createElement('p');
    const parrInstr = document.createElement('p');
    const parrInstr2 = document.createElement('p');
    const btnCerrar = document.createElement('button');
    btnCerrar.innerText = 'Close';
    btnCerrar.id = 'btn_cerrar';
    btnCerrar.className = 'btn btn-primary btn-lg px-4 gap-3';
    btnCerrar.onclick = function(){
        document.getElementById("div_modal").innerHTML = '';
        parrResultado.innerText = 'Find something new for today!!';
        document.getElementById("txt_buscar").value='';
    }

    parrInstr.style = 'text-align:left;';
    parrInstr.id = 'instr_intro';

    parrInstr2.style = 'text-align:left;';
    parrInstr2.id = 'instr_details';

    card.className = 'card';
    card.id = 'recipe_result';
    card.style = 'width: 90%; text-align:center;'

    titulo.className = 'card-title';
    titulo.id = 'recipe_title'
    titulo.innerText = obj.strMeal;
    
    subCard.className = 'card-body';

    img.className = 'card-img-top';
    img.src = obj.strMealThumb;
    img.style = 'width:40%; height; 40%;';
    img.id = 'recipe_image';

    parr.className = 'card-text';
    parr.id = 'region';
    parr.innerText = 'Region: ' + obj.strArea;
    parr2.className = 'card-text';
    parr2.id = 'category';
    parr2.innerText = 'Category: ' + obj.strCategory;

    const divIngredientesContenedor = document.createElement('div');
    divIngredientesContenedor.id = 'div_ingredients';
    const titIngredientes = document.createElement('div');
    titIngredientes.id = 'div_ingredients_title';
    titIngredientes.innerText = 'INGREDIENTS - QUANTITY';
    divIngredientesContenedor.appendChild(titIngredientes);
    const ulIngredientes = document.createElement('ul');
    ulIngredientes.id = 'ingredients_list';

    const liIngredientes = document.createElement('li');

    for(let ing of Object.keys(obj)){
       let idIngrediente=ing.substring(13,ing.length);
        if(ing.substring(0,7)=='strIngr' && obj['strIngredient'+ idIngrediente]!=null){
            if(obj['strIngredient'+ idIngrediente].length>0){
                const liIngredientes = document.createElement('li');
                liIngredientes.innerText=obj['strIngredient'+ idIngrediente] + ' - ' + obj['strMeasure'+idIngrediente];
                ulIngredientes.appendChild(liIngredientes)
            }
        }
    }
    divIngredientesContenedor.appendChild(ulIngredientes);

    parrInstr.innerText = 'Instructions: ';
    parrInstr2.innerText = obj.strInstructions;
    
    subCard.appendChild(img);

    subCard.appendChild(titulo);
    subCard.appendChild(parr);
    subCard.appendChild(parr2);
    subCard.appendChild(divIngredientesContenedor);
    subCard.appendChild(parrInstr);
    subCard.appendChild(parrInstr2);
    subCard.appendChild(btnCerrar);
    
    card.appendChild(subCard);

    document.getElementById("div_modal").appendChild(card);
}