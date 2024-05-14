const myModal = new bootstrap.Modal(document.querySelector("#modal"), {
  backdrop: "static",
  keyboard: false,
});
myModal.show();

let alert = document.querySelector(".alert");
alert.style.display = "none";

let correctAnswers = 0;
let amountOfPlayedRounds = 0;
let numberOfRounds = 0;
let correctCountryIdsArray = [numberOfRounds];
let currentCorrectCountry = {};

const handleButtonClick = (e) => {
  e.preventDefault();
  const clickedButton = e.target;
  const clickedName = clickedButton.textContent;

  const result = document.querySelector("#result");
  result.className = "";
  if (clickedName === currentCorrectCountry.name) {
    result.textContent = "Rätt svar!";
    result.classList.add("text-success");
    correctAnswers++;
  } else {
    result.textContent = "Fel svar!";
    result.classList.add("text-danger");
  }

  const buttons = document.querySelectorAll(".btn-group-vertical .btn");
  buttons.forEach((button) => {
    button.disabled = true;
  });
};

const getCorrectCountry = (countries) => {
  const filteredCountries = countries.filter(
    (country) => !correctCountryIdsArray.includes(country.id)
  );
  currentCorrectCountry = filteredCountries[0];
  correctCountryIdsArray.push(currentCorrectCountry.id);
};

const startRound = () => {
  const shuffledCountries = shuffle(countries);
  getCorrectCountry(shuffledCountries);

  const img = document.createElement("img");
  img.src = currentCorrectCountry.image;
  img.alt = currentCorrectCountry.name;
  img.classList.add("img-fluid");
  img.classList.add("mx-auto");
  img.style.display = "block";
  const imgDiv = document.querySelector("#img-div");
  imgDiv.innerHTML = "";
  imgDiv.appendChild(img);

  const chosenCountries = [currentCorrectCountry];
  getWrongCountries(chosenCountries, shuffledCountries);
  const shuffledChosenCountries = shuffle(chosenCountries);

  const buttons = document.querySelectorAll(".btn-group-vertical .btn");
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.textContent = shuffledChosenCountries[index].name;
    button.addEventListener("click", handleButtonClick);
  });
};

const getWrongCountries = (chosenCountries, countries) => {
  let randomWrongCountryArray = [];

  for (let i = 0; i < 3; i++) {
    let foundWrongCountry = false;
    let randomWrongCountry;

    while (!foundWrongCountry) {
      const randomWrongCountryIndex = Math.floor(
        Math.random() * countries.length
      );
      randomWrongCountry = countries[randomWrongCountryIndex];

      if (
        currentCorrectCountry.id !== randomWrongCountry.id &&
        !randomWrongCountryArray.find(
          (wrongCountry) => wrongCountry.id === randomWrongCountry.id
        )
      ) {
        randomWrongCountryArray.push(randomWrongCountry);
        foundWrongCountry = true;
      }
    }

    chosenCountries.push(randomWrongCountry);
  }
};

const dropdownEl = document.querySelectorAll(".dropdown-item");
dropdownEl.forEach((li) => {
  li.addEventListener("click", (e) => {
    if (e.target.textContent === "Alla") {
      numberOfRounds = countries.length;
    } else {
      numberOfRounds = Number(e.target.textContent);
    }
    const dropDownBtn = document.querySelector("#dropdownMenuButton");
    dropDownBtn.textContent = e.target.textContent;
    const playBtn = document.querySelector(".play");
    playBtn.disabled = false;
    startRound();
  });
});

const nextBtn = document.querySelector("#nextBtn");
nextBtn.addEventListener("click", (e) => {
  e.preventDefault();

  amountOfPlayedRounds++;
  if (numberOfRounds === amountOfPlayedRounds) {
    const buttons = document.querySelectorAll(".btn-group-vertical .btn");
    buttons.forEach((button) => {
      button.disabled = true;
    });
    nextBtn.disabled = true;
    alert.style.display = "block";
    alert.textContent = `Dina poäng är ${correctAnswers}/${numberOfRounds}.
        Ladda om sidan för att spela igen`;
  } else {
    startRound();
    document.querySelector("#result").textContent = "";
  }
});

const shuffle = (array) => {
  let oldElement;
  for (let i = array.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    oldElement = array[i];
    array[i] = array[rand];
    array[rand] = oldElement;
  }

  return array;
};
