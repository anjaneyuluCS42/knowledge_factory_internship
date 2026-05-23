import requests
from country import Country


def format_population(number):

    return f"{number:,}"


def get_country_data(country_name):

    url = f"https://restcountries.com/v3.1/name/{country_name}"

    try:

        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return None

        data = response.json()[0]

        name = data["name"]["common"]

        capital = data.get("capital", ["Unknown"])[0]

        population = format_population(
            data.get("population", 0)
        )

        flag = data.get("flag", "🏳️")

        region = data.get("region", "Unknown")

        subregion = data.get("subregion", "Unknown")

        timezone = data.get("timezones", ["Unknown"])[0]

        maps = data.get("maps", {}).get("googleMaps", "#")

        currencies = data.get("currencies", {})

        currency_names = []

        for currency in currencies.values():

            currency_names.append(
                currency["name"]
            )

        currency = ", ".join(currency_names)

        languages_data = data.get("languages", {})

        languages = sorted(
            list(languages_data.values())
        )

        return Country(
            name=name,
            capital=capital,
            currency=currency,
            population=population,
            flag=flag,
            languages=languages,
            region=region,
            subregion=subregion,
            timezone=timezone,
            maps=maps
        )

    except requests.exceptions.Timeout:

        print("Request timeout")
        return None

    except Exception as e:

        print("Error:", e)
        return None