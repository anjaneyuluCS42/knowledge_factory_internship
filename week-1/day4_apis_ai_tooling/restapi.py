import requests

url = "https://restcountries.com/v3.1/all?fields=name,capital,currencies"

response = requests.get(url)

print("REST API Status:", response.status_code)

countries = response.json()

for country in countries[:5]:

    name = country["name"]["common"]

    capital = country.get("capital", ["No Capital"])[0]

    currencies = country.get("currencies", {})

    currency_names = []

    for currency in currencies.values():

        currency_names.append(currency["name"])

    print("Country:", name)

    print("Capital:", capital)

    print("Currencies:", ", ".join(currency_names))

    print("---------------------------")