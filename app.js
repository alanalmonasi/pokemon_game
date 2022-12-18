const CARDS = 8;

playAgain();

function playAgain() {
   for (let i = 0; i < CARDS; i++) {
      let id = getRandomId(251);
      searchPokemonById(id);
   }
}

function getRandomId(max) {
   return Math.floor(Math.random() * max) + 1;
}

let draggableElements = document.querySelector(".draggable-elements");
let droppableElements = document.querySelector(".droppable-elements");
let tries = document.querySelector(".tries");
let lifes = 3;
tries.innerText = lifes;

let pokemon = [];
let pokemonNames = [];

async function searchPokemonById(id) {
   const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
   const data = await res.json();
   pokemon.push(data);
   pokemonNames.push(data.name);

   pokemonNames = pokemonNames.sort(() => Math.random() - 0.5);

   draggableElements.innerHTML = "";
   pokemon.forEach((pkm) => {
      draggableElements.innerHTML += `
         <div class="pokemon">
            <img id="${pkm.name}" draggable="true" class="image" src="${pkm.sprites.other["official-artwork"].front_default}" alt="pokemon" />
         </div>
      `;
   });

   droppableElements.innerHTML = "";
   pokemonNames.forEach((name) => {
      droppableElements.innerHTML += `
         <div class="name">
            <p>${name}</p>
         </div>
      `;
   });

   let pokemonImg = document.querySelectorAll(".image");
   pokemonImg = [...pokemonImg];
   pokemonImg.forEach((pokemon) => {
      pokemon.addEventListener("dragstart", (e) => {
         e.dataTransfer.setData("text", e.target.id);
      });
   });

   let names = document.querySelectorAll(".name");
   let wrong = document.querySelector(".wrong");
   let points = 0;
   let wrongTry = 0;

   names = [...names];

   names.forEach((name) => {
      name.addEventListener("dragover", (e) => {
         e.preventDefault();
      });

      name.addEventListener("drop", (e) => {
         const draggableData = e.dataTransfer.getData("text");
         let pokemonElement = document.querySelector(`#${draggableData}`);
         if (e.target.innerText === draggableData) {
            wrong.innerText = "Well done!";
            setTimeout(() => {
               wrong.innerText = "";
            }, 800);
            points++;
            e.target.innerHTML = "";
            e.target.appendChild(pokemonElement);
            if (points === CARDS) {
               draggableElements.innerHTML = `
                  <p class="win">YOU WON!</p>
               `;
            }
         } else {
            wrongTry++;
            tries.innerHTML = tries.innerHTML - 1;
            wrong.innerText = "Ups! Wrong pokemon!";
            setTimeout(() => {
               wrong.innerText = "";
            }, 800);
            if (wrongTry === 3) {
               draggableElements.innerHTML = `
                  <p class="win">YOU LOSE!</p>
               `;
            }
         }
      });
   });
}

const btn = document.querySelector("button");
btn.addEventListener("click", () => {
   location.reload();
});
