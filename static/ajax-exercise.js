"use strict";

// PART 1: SHOW A FORTUNE

function showFortune(evt) {
  fetch('/fortune')
  .then(response => response.text())
  .then(status => {
    document.querySelector('#fortune-text').innerHTML = status;
  });
}

document
  .querySelector("#get-fortune-button")
  .addEventListener("click", showFortune);




// PART 1a: KANYE QUOTE

function kanyeQuote(evt) {
  fetch('/kanye')
  .then(response => response.text())
  .then(status => {
    document.querySelector('#kanye-text').innerHTML = status;
  });
}

document
  .querySelector("#get-kanye")
  .addEventListener("click", kanyeQuote);




// PART 2: SHOW WEATHER

function showWeather(evt) {
  evt.preventDefault();

  const zipcode = document.querySelector("#zipcode-field").value;
  //This worked: http://0.0.0.0:5000/weather.json?zipcode=90210
  const url = `/weather.json?zipcode=${zipcode}`;

  fetch(url)
  .then(response => response.json())  // We had to do response.json()
  .then(responseJson => {
    document.querySelector('#weather-info').innerHTML = responseJson.forecast; // We had to unpack the response: responseJson.forecast
  });
}

document
  .querySelector("#weather-form")
  .addEventListener("submit", showWeather);




document.querySelector('#order-form').addEventListener('submit', orderMelons);

function orderMelons(evt) {
  evt.preventDefault();

  const formInputs = {
    qty: document.querySelector('#qty-field').value,
    melon_type: document.querySelector('#melon-type-field').value,
  };

  fetch('/order-melons.json', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(response => {
    if (response.code === 'ERROR') {
      document.querySelector("#order-status").classList.add("order-error");
      document.querySelector("#order-status").innerHTML = `<p><b>${response.msg}</b></p>`;
    } else {
      document.querySelector("#order-status").classList.remove("order-error");
      document.querySelector("#order-status").innerHTML = `<p>${response.msg}</p>`;
    }});
};




// 4: RANDOM DOG PIC

function dogPic(evt) {
  fetch('/doggies')
  .then(response => response.text())
  .then(status => {
    document.querySelector('#dog-pic-div').src = status;
  });
}

document
  .querySelector("#get-dog-image")
  .addEventListener("click", dogPic);

// Seed the page with the first dog picture:
dogPic()