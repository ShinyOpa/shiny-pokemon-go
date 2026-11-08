# Costume image audit — 2026-11-07

Test branch only. Static source-code audit; this is **not** a browser visual test or a complete HTTP check of all URLs.

- Costume variants parsed from `costumeVariants` and its literal additions: 182
- Direct mapping entries in `automaticCostumeArt` and subsequent `Object.assign` calls: 220 (includes overwritten keys)
- Variants without an exact normalized image mapping: 6
- Earlier mappings for overwritten keys retained in `originalCostumeArt` as fallback.
- Verified via GitHub file fetch: Halloween 2026 Pikachu, Zubat, Golbat, Crobat; Varsity Jacket Pikachu; Flower Crown Togetic; Pikachu Ph.D.

## Unmapped costumes

- Winter Scarf Swinub (#220) — `costume-220-winter-scarf-swinub`
- Holiday Hat Mudkip (#258) — `costume-258-holiday-hat-mudkip`
- Halloween Drifloon (#425) — `costume-425-halloween-drifloon`
- Flower Crown Shaymin (#492) — `costume-492-flower-crown-shaymin`
- Halloween Litwick (#607) — `costume-607-halloween-litwick`
- Antique Sinistea (Halloween bow) (#854) — `costume-854-antique-sinistea-halloween-bow` (catalog number corrected; legacy saved-count ID is migrated by `addSpecialVariants`)

## Caution

Do not map a standard shiny sprite to a costume merely to fill a gap. Check that any proposed source file is actually the correct costume and shiny variant. Do not merge to main until browser and saved-count regression tests pass.

## Follow-up audit — 2026-11-08

The 16 remaining entries are **not yet backed by a verified matching shiny costume asset**. They must not be replaced with the ordinary Pokémon artwork. The Sinistea entry now uses the correct National Pokédex number (#854), with the old #1001 storage ID retained as a migration lookup. The regional-filter artwork changes are separate from these costume mappings.

## Follow-up — 2026-11-08: 10 new mined-asset mappings

Ten costume entries now have direct candidate URLs built from the PokeMiners mined shiny-asset catalog (`Hailey-Ross/hailsDotGO`, `internal/costumes/catalog.json`), pinned to asset commit `d4432a333e123bfe8f44153f51bf58aa8d34d5b1`: Halloween Frogadier, Greninja, Dartrix, Decidueye, Noivern; Fashionable Cinccino; Flower Crown Whimsicott; Holiday Attire Dubwool, Vikavolt; Holiday Ribbon Beartic. These match species and shiny costume code in the mined catalog. **HTTP image delivery and visual appearance on Samsung remain to be tested.** Six entries remain unmapped.

## Catalog cross-check — 2026-11-08

Cross-checked the remaining six species (Swinub #220, Mudkip #258, Drifloon #425, Shaymin #492, Litwick #607, Sinistea #854) against the mined `Hailey-Ross/hailsDotGO/internal/costumes/catalog.json` costume-code-to-species table. **No matching costume-code entries were found for these six dex numbers in that catalog snapshot.** This does not prove the costumes do not exist, only that this particular source cannot establish a matching shiny costume asset. No speculative mappings added. The ten recent candidate mappings have not yet been visually verified in a browser; their count should not be treated as ten confirmed images.
