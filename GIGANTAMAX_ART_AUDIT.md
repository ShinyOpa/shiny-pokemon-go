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

## Samsung Galaxy S24 Ultra visual checks (2026-11-07)

The user supplied screenshots of the isolated phone preview confirming distinct Gigantamax form artwork for Venusaur (normal/shiny), Charizard (normal/shiny), Blastoise (normal/shiny), Butterfree (normal/shiny), and Pikachu (shiny). Normal Pikachu was not shown.

## Expanded form ID mapping

The test branch now has 30 unambiguous Gigantamax form IDs from PokeAPI's `pokemon.csv` (IDs 10195–10225, excluding 10219). This is **not** 30 visually confirmed images, and does **not** establish Pokémon GO release status.

Toxtricity has two form IDs (10219 Amped and 10228 Low Key); Urshifu has two (10226 Single Strike and 10227 Rapid Strike). The generic species-only entries must not be assigned either form without a corresponding form label.

Any newly mapped sprite must be visually checked on mobile in normal and shiny variants. The preview remains separate from the production Pokédex.

## Additional Samsung screenshots (2026-11-07, 22:49 local)

The user visually confirmed Gigantamax form art in the isolated phone preview for Pikachu (normal), Meowth (normal and shiny), Machamp (normal and shiny), Gengar (shiny), Rillaboom (normal and shiny), Cinderace (normal and shiny), and Inteleon (normal and shiny). Gengar normal and Kingler were not visible in these screenshots. Distinct form artwork renders in three-column layout with accessible quantity buttons. These checks confirm rendered artwork, not Pokémon GO availability.

## Further Samsung screenshot (2026-11-07, 22:51 local)

The user screenshot shows Gigantamax Gengar (normal and shiny) and Kingler (normal and shiny) rendered with their distinct Gigantamax forms. Machamp (normal and shiny) is reconfirmed. This completes the visual review of the first four additional Kanto forms (Meowth, Machamp, Gengar, Kingler) in both variants. This is a visual check only, not a confirmation of in-game release status.

## Catalog coverage audit (2026-11-07)

The current Pokédex catalog lists **17 distinct Gigantamax species**. Of those, **16** have an unambiguous form ID in `gigantamaxFormSprites`. **Toxtricity (#849)** is the only listed species without a unique mapping: Amped G-Max = 10219, Low Key G-Max = 10228. The 30-ID mapping also includes 14 species that are not in the app's Gigantamax catalog; mapping presence must not be mistaken for an in-game availability claim or an instruction to add unreleased entries. A regression test now checks this coverage.

## Samsung screenshots (2026-11-07, 22:56 local)

Two additional screenshots show Gigantamax Lapras in both shiny and normal form, and Gigantamax Snorlax in shiny form, all with distinctive Gigantamax artwork. Gengar (normal) and Kingler (both) remain visibly correct. Snorlax normal, Eevee (both), and Garbodor (both) are not fully visible and remain unverified. The three-column layout is readable; this is a visual rendering audit only.

## Remaining visible-artwork checklist

All 18 species in the current Gigantamax catalog are accounted for below. A check means a Samsung screenshot showed the correct Gigantamax silhouette and color variant, not that it is released in Pokémon GO.

| Species | Shiny | Normal |
|---|---|---|
| Venusaur | Verified | Verified |
| Charizard | Verified | Verified |
| Blastoise | Verified | Verified |
| Butterfree | Verified | Verified |
| Pikachu | Verified | Verified |
| Meowth | Verified | Verified |
| Gengar | Verified | Verified |
| Machamp | Verified | Verified |
| Kingler | Verified | Verified |
| Lapras | Verified | Verified |
| Eevee | Verified | Verified |
| Snorlax | Verified | Verified |
| Garbodor | Verified | Verified |
| Rillaboom | Verified | Verified |
| Cinderace | Verified | Verified |
| Inteleon | Verified | Verified |
| Toxtricity | Pending: Amped/Low Key ambiguous | Pending: Amped/Low Key ambiguous |
| Grimmsnarl | Verified | Pending |

**Next screenshots:** Snorlax normal; Garbodor shiny/normal; Grimmsnarl shiny/normal. Toxtricity needs explicit form separation before claiming correct art. Eevee was added to the isolated preview catalog on 2026-11-07 (shiny and normal), using form ID 10205; visual verification remains pending.

## Catalog update: Gigantamax Eevee

Added #133 Gigantamax Eevee to the isolated test branch. `addNormalBattleVariants()` creates the normal entry alongside the shiny entry; it preserves existing quantities via the established storage key. Catalog now contains 18 species; 17 have a unique form ID, and Toxtricity is still ambiguous. Eevee normal and shiny need mobile screenshot verification before production promotion.

## Samsung screenshot (2026-11-07, 23:22 local)

Screenshot of the isolated phone preview confirms distinct Gigantamax shiny artwork for **Eevee (#133)** and **Garbodor (#569)**. Lapras, Snorlax, Rillaboom and Cinderace shiny images remain visible in the same three-column layout. Eevee and Garbodor **normal** variants are not shown in this screenshot and remain pending. No changes to production or collection storage.

## Samsung screenshot (2026-11-07, 23:23 local)

Normal Gigantamax **Eevee (#133), Snorlax (#143), and Garbodor (#569)** are visibly rendered with their distinct Gigantamax silhouettes. Lapras, Rillaboom and Cinderace normal variants are also visible. The earlier screenshots already verified the shiny counterparts. The only current catalog species with no visual verification is **Grimmsnarl**, while **Toxtricity** needs explicit Amped/Low Key handling. This confirms rendering only, not Pokémon GO release status.

## Samsung screenshot (2026-11-07, 23:24 local)

The shiny Gigantamax Grimmsnarl (#861) sprite renders with the correct distinct Gigantamax silhouette in the three-column mobile layout. The Toxtricity (#849) shiny card still displays its ordinary body shape rather than the Gigantamax form; the newly added 'vorm nog te kiezen (Amped/Low Key)' label is correctly visible. Do not count Toxtricity as verified. Grimmsnarl normal remains pending.
