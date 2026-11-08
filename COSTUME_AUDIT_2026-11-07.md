# Costume image audit — 2026-11-07

Test branch only. Static source-code audit; this is **not** a browser visual test or a complete HTTP check of all URLs.

- Costume variants parsed from `costumeVariants` and its literal additions: 182
- Direct mapping entries in `automaticCostumeArt` and subsequent `Object.assign` calls: 220 (includes overwritten keys)
- Variants without an exact normalized image mapping: 16
- Earlier mappings for overwritten keys retained in `originalCostumeArt` as fallback.
- Verified via GitHub file fetch: Halloween 2026 Pikachu, Zubat, Golbat, Crobat; Varsity Jacket Pikachu; Flower Crown Togetic; Pikachu Ph.D.

## Unmapped costumes

- Winter Scarf Swinub (#220) — `costume-220-winter-scarf-swinub`
- Holiday Hat Mudkip (#258) — `costume-258-holiday-hat-mudkip`
- Halloween Drifloon (#425) — `costume-425-halloween-drifloon`
- Flower Crown Shaymin (#492) — `costume-492-flower-crown-shaymin`
- Halloween Litwick (#607) — `costume-607-halloween-litwick`
- Antique Sinistea (Halloween bow) (#854) — `costume-854-antique-sinistea-halloween-bow` (catalog number corrected; legacy saved-count ID is migrated by `addSpecialVariants`)
- Flower Crown Whimsicott (#547) — `costume-547-flower-crown-whimsicott`
- Fashionable Cinccino (#573) — `costume-573-fashionable-cinccino`
- Holiday Ribbon Beartic (#614) — `costume-614-holiday-ribbon-beartic`
- Halloween Frogadier (#657) — `costume-657-halloween-frogadier`
- Halloween Greninja (#658) — `costume-658-halloween-greninja`
- Halloween Dartrix (#723) — `costume-723-halloween-dartrix`
- Halloween Decidueye (#724) — `costume-724-halloween-decidueye`
- Halloween Headband Noivern (#715) — `costume-715-halloween-headband-noivern`
- Holiday Attire Dubwool (#832) — `costume-832-holiday-attire-dubwool`
- Holiday Attire Vikavolt (#738) — `costume-738-holiday-attire-vikavolt`

## Caution

Do not map a standard shiny sprite to a costume merely to fill a gap. Check that any proposed source file is actually the correct costume and shiny variant. Do not merge to main until browser and saved-count regression tests pass.

## Follow-up audit — 2026-11-08

The 16 remaining entries are **not yet backed by a verified matching shiny costume asset**. They must not be replaced with the ordinary Pokémon artwork. The Sinistea entry now uses the correct National Pokédex number (#854), with the old #1001 storage ID retained as a migration lookup. The regional-filter artwork changes are separate from these costume mappings.
