# Gigantamax artwork audit

PokéAPI's pokemon_forms.csv identifies the following distinct form pokemon IDs:

| National Dex | Form | PokéAPI form Pokémon ID |
|---|---|---|
| 3 | venusaur-gmax | 10195 |
| 6 | charizard-gmax | 10196 |
| 9 | blastoise-gmax | 10197 |
| 12 | butterfree-gmax | 10198 |
| 25 | pikachu-gmax | 10199 |

Source: https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_forms.csv

These IDs are **form identifiers, not verified image URLs**. The app currently uses base-species artwork for Gigantamax and marks it as 'basisafbeelding'. Do not replace that with unverified sprite URLs. Before mapping a form sprite, verify that the normal and shiny files actually exist, render the correct form, and are suitable for use. Do not conflate Pokémon HOME forms with Pokémon GO artwork.

Phone preview: https://shinyopa.github.io/shiny-pokemon-go/telefoon-test/index.html
