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

// PART 2: SHOW WEATHER

function showWeather(evt) {
  evt.preventDefault();

  //const url = "/weather.json";  // Moved the url construction after getting zipcode.
  const zipcode = document.querySelector("#zipcode-field").value;
  //This worked: http://0.0.0.0:5000/weather.json?zipcode=99507
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

// PART 3: ORDER MELONS

function orderMelons(evt) {
  evt.preventDefault();

  const formInputs = {
    code: document.querySelector('#qty-field').value,
    msg: document.querySelector('#melon-type-field').value,
  };
   // order_melons() gives {'code': result_code, 'msg': result_text}

  fetch('/order-melons.json', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })

    .then(response => response.json())
    .then(responseJson => {
      alert(responseJson.code);  // send response code to .order-error to be colored red.
    });

    if (responseJson.code === 'ERROR') {
      // send response code to .order-error to be colored red. <div id="order-status"></div>
    }

};

  // TODO: show the result message after your form

document.querySelector("#order-form").addEventListener("submit", orderMelons);
