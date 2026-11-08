# Controle Pikachu-kostuumafbeeldingen — 8 november 2026

Referentie: https://www.serebii.net/pokemongo/pokemon/025.shtml

Aantal Pikachu-kostuumvermeldingen in de broncode: 104.
Aantal automatische Pikachu-afbeeldingskoppelingen: 90 (sommige zijn extra of alternatieve varianten).

## Nog handmatig te verifiëren
- Halloween 2026 Pikachu (hat and capelet)

## Belangrijke controles
- Niet elke automatische URL is daadwerkelijk getest op bereikbaarheid, afbeeldingkwaliteit of correcte shiny-kleur.
- De zeven nieuwe landenkostuums hebben lokale PNG-bestanden; Calem en Serena hebben ook lokale PNG-bestanden.
- Controleer bij de overige kostuums of normale afbeeldingen niet onbedoeld als shiny worden gelabeld.
- Serebii is een naam-/vormreferentie; kopieer afbeeldingen niet zonder passende rechten.
- Verander geen bestaande Pokémon-ID's of lokale verzamelgegevens.
- Publiceer pas na visuele test en goedkeuring.

## Bevestigde dubbele naamgeving: baseball
Serebii vermeldt één kostuum `Baseball Shirt` en geen afzonderlijk `Baseball`-kostuum. In onze app bestaan `Baseball Pikachu` (normaal), `Baseball Pikachu (Shiny)` en `Baseball Shirt Pikachu` (normaal). De twee normale records tonen dezelfde afbeelding. **Nog niet verwijderen of samenvoegen:** bestaande IDs en aantallen moeten veilig gemigreerd worden en eventuele gebruikersgegevens behouden blijven. De testversie laat beide staan totdat de samenvoeging veilig ontworpen en goedgekeurd is.
Bron: https://www.serebii.net/pokemongo/pokemon/025.shtml

## Nieuwe controle na Baseball-correctie (8 november 2026)
- 103 unieke Pikachu-kostuumvermeldingen in de huidige testversie (na het samenvoegen van Baseball).
- 16 vermeldingen gebruiken speciale lokale afbeeldingstoewijzingen (waaronder Calem, Serena, de landenkostuums en Baseball).
- 86 overige vermeldingen hebben een automatische afbeeldings-URL. **Dit bewijst niet dat de URL werkt of de juiste kostuum-/shiny-afbeelding toont.**
- 1 vermelding heeft geen van deze twee koppelingen: `Halloween 2026 Pikachu (hat and capelet)`.
- Baseball Shirt gebruikt `025-baseball.png` (gewoon) en `025-baseball-shiny.png` (shiny), zoals door gebruiker aangeleverd en bevestigd. Oude dubbele Baseball-vermelding is in test verwijderd met migratielogica voor aantallen.
- Volgende controle: URL-bereikbaarheid en visuele juistheid van de 86 automatisch gekoppelde kostuums, te beginnen bij Halloween 2026. Geen wijzigingen aan de officiële versie zonder toestemming.

## Vervolgcontrole: dubbele externe afbeeldings-URL's
In de `automaticCostumeArt`-tabel zijn twee paren Pikachu-vermeldingen gevonden die exact dezelfde externe afbeelding gebruiken:
1. `Detective Hat Pikachu` en `Detective Pikachu`.
2. `Baseball Shirt Pikachu` en `Varsity Jacket Pikachu`.

Het tweede paar verdient extra controle: voor Baseball Shirt gebruiken we inmiddels de twee door de gebruiker goedgekeurde lokale PNG's, terwijl Varsity Jacket nog op de gedeelde externe URL wijst. **Niet automatisch samenvoegen**: een gedeelde afbeelding is op zichzelf geen bewijs dat de kostuums identiek zijn. Eerst de kostuums aan Serebii en het beeld vergelijken. Voor beide paren blijven bestaande IDs en aantallen onaangeroerd.

Halloween 2026 is inmiddels voorzien van twee door de gebruiker geüploade afbeeldingen (`025-halloween2026.png` en `025-halloween2026-shiny.png`) en de gebruiker heeft de weergave bevestigd.
