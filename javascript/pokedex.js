'use strict';

const URL = 'https://pokeapi.co/api/v2/';
const amountOfPokemon = 30;
const gridContainer = document.querySelector('.poke-container');

FetchAllPokemon();
CreateTypesContainer();
AddEventListeners();

async function FetchAllPokemon() {
  try {
    for (let i = 1; i <= amountOfPokemon; i++) {
      const res = await fetch(`${URL}pokemon/${i}`);
      const pokemon = await res.json();
      CreateCard(pokemon);
    }
  } catch (err) {
    console.log(`Unable to retrieve data: ${err}`);
  }
}

function FilterBytype(type) {
  gridContainer.innerHTML = '';
  fetch(`${URL}type/${type.id}`)
    .then((res) => res.json())
    .then((data) => {
      return Promise.all(data.pokemon.map((item) => fetch(`${item.pokemon.url}`)));
    })
    .then((res) => {
      return Promise.all(res.map((x) => x.json()));
    })
    .then((pokemons) => {
      pokemons.forEach((pokemon) => CreateCard(pokemon));
    });
}

function AddEventListeners() {
  const types = document.querySelectorAll('#types-container p');
  const dropdownTypes = document.querySelectorAll('#dropdown-flexbox li');

  types.forEach((type) => {
    type.addEventListener('click', () => FilterBytype(type));
  });

  dropdownTypes.forEach((type) => {
    type.addEventListener('click', () => {
      FilterBytype(type);
      UpdateDropdownText(type);
    });
  });
}

function CreateCard(pokemon) {
  const pokemonId = `#${pokemon.id.toString().padStart(3, 0)}`;
  const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const availableTypes = pokemon.types.map((pokemon) => pokemon.type.name[0].toUpperCase() + pokemon.type.name.slice(1));
  const pokemonImageUrl = `../images/${pokemon.id}.png`;
  const bgColorPokemon = GetPokemonTypeColor(availableTypes[0], true);

  const typesDiv = document.createElement('div');
  const cardDiv = document.createElement('div');

  cardDiv.className = 'pokemon-card';
  cardDiv.innerHTML = `<p>${pokemonId}</p>
                       <div class='image-container'>
                          <img src=${pokemonImageUrl} onerror='ImgError(this)' >
                        </div>
                        <div class='pokemon-info'> 
                          <h2>${pokemonName}</h2>                               
                        </div>`;

  typesDiv.classList.add('pokemon-types');

  availableTypes.forEach((type) => typesDiv.append(CreatePokemonTypeButton(type)));

  //set card bg color
  cardDiv.style.backgroundColor = bgColorPokemon;
  cardDiv.style.borderColor = bgColorPokemon;

  gridContainer.append(cardDiv);
  cardDiv.append(typesDiv);
}

function CreateDropdownElements(type, index) {
  const flexContainer = document.querySelector('#dropdown-flexbox');
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.classList.add('dropdown-item');
  a.innerText = type;
  li.id = index + 1;
  li.append(a);
  flexContainer.append(li);
}

function CreatePokemonTypeButton(type, index = null, isContainer = false) {
  const p = document.createElement('p');
  if (isContainer) {
    p.classList.add(type, 'poke-type');
    p.id = index + 1;
  } else {
    p.classList.add('poke-type');
  }
  p.style.backgroundColor = GetPokemonTypeColor(type);
  p.innerHTML = type;
  return p;
}

function GetPokemonTypeColor(type, isBackgroundColor = false) {
  let arr = isBackgroundColor == true ? bgColors : pokemonTypes;

  for (let i = 0; i <= arr.length; i++) {
    for (let key in arr[i]) {
      if (key === type) return arr[i][key];
    }
  }
}
function CreateTypesContainer() {
  const typesDiv = document.querySelector('#types-container');

  pokemonTypes.forEach((type, index) => {
    for (let key in type) {
      // create 'buttons' in pokemon container
      typesDiv.append(CreatePokemonTypeButton(key, index, true));
      // create 'buttons' for dropdown
      CreateDropdownElements(key, index);
    }
  });
}

function ImgError(image) {
  image.onerror = '';
  image.src = '../images/0.png';
  return true;
}

function UpdateDropdownText(type) {
  const btnText = document.querySelector('.dropdown > button');
  btnText.innerHTML = type.innerText;
}
