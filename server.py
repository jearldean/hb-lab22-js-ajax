"""Flask server for AJAX exercise.

IMPORTANT: you don't need to change this file at all to finish
the exercise!
"""


import random
import os
import requests
import json

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

API_KEY = os.environ['API_KEY']

FORTUNES = [
    "Tomorrow your code will <b>work properly</b>.",
    "Your day ahead will be <b>full of while loops</b>.",
    "You will wake up one morning and discover you <i>learned recursion in your sleep</i>.",
    "<i>@facebook</i> will retweet an announcement about your Hackbright project.",
    "You will inherit a house in San Francisco.",
    "In the future, your fortune will be wrong.",
]

WEATHER = {
    '94110': {'forecast': 'Rainy, damp, and rich with hipsters.', 'temp': '60F'},
    '99507': {'forecast': 'Warm, balmy, and good for sunbathing.', 'temp': '100F'},
    '94102': {'forecast': 'Delightful, clever, and full of Python.', 'temp': '55F'},
}

DEFAULT_WEATHER = {'forecast': 'Kind of boring.', 'temp': '68F'}

@app.route('/')
def index():
    """Show our index page."""

    return render_template("index.html")


@app.route('/fortune')
def fortune():
    """Return a single fortune as a text string (*not* the whole HTML page!)"""

    return random.choice(FORTUNES)

@app.route('/kanye')
def kanye():

    url = "https://api.kanye.rest"
    kanye_says = requests.get(url)
    kanye_says_json = kanye_says.text
    kanye_says_dict = json.loads(kanye_says_json)
    # print(kanye_says_dict)
    # print(kanye_says_dict["quote"])
    return kanye_says_dict["quote"]


@app.route('/weather.json')
def weather():
    """Return a weather-info dictionary for this zipcode.
    
    Sometimes this can happen:
    {'Code': 'ServiceUnavailable',
    'Message': 'The allowed number of requests has been exceeded.',
    'Reference': '/locations/v1/postalcodes/search?apikey=xxxxxxxxxxxxxx'}
    """

    zipcode = request.args.get('zipcode')
    url = 'http://dataservice.accuweather.com/locations/v1/postalcodes/search'
    payload = {'apikey': API_KEY, 'q': zipcode}
    
    res = requests.get(url, params=payload)
    data = res.json()
    print(data)
    if data.get('Code') == 'ServiceUnavailable':
        return jsonify({'forecast': data.get('Message')})

    location_code = data[0]["Key"]

    url2 = f'http://dataservice.accuweather.com/forecasts/v1/daily/1day/{location_code}'
    payload2 = {'apikey': API_KEY}

    res2 = requests.get(url2, params=payload2)
    data2 = res2.json()
    print(data2)
    forecast = data2["Headline"]["Text"]
    
    return jsonify({'forecast': forecast})


@app.route('/order-melons.json', methods=['POST'])
def order_melons():
    """Order melons and return a dictionary of result-code and result-msg."""
    melon = request.json.get('melon_type')
    qty = int(request.json.get('qty'))

    if qty > 10:
        result_code = 'ERROR'
        result_text = "You can't buy more than 10 melons"
    elif qty > 0:
        result_code = 'OK'
        result_text = f"You have bought {qty} {melon} melons"
    else:
        result_code = 'ERROR'
        result_text = "You want to buy fewer than 1 melons? Huh?"

    # print(result_code, result_text)

    return jsonify({'code': result_code, 'msg': result_text})






@app.route('/doggies')
def doggie():
    """ url sends back data like this:
    {"message": "https://images.dog.ceo/breeds/appenzeller/n02107908_7443.jpg",
    "status": "success"}
    """
    url = "https://dog.ceo/api/breeds/image/random"
    received_payload = requests.get(url)
    received_payload_json = received_payload.text
    received_payload_dict = json.loads(received_payload_json)
    # print(received_payload_dict["message"])
    return received_payload_dict["message"]


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
