# Legacy Import Report

- Profiles: 10
- Picks: 635
- Picks with missing profile: 0

## Expected Ranking

| # | Username | Email | Picks | Won | Lost | Pending | Points |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | mbravob | mbravob@gmail.com | 104 | 63 | 39 | 2 | 110.31 |
| 2 | isaac.llovera79 | isaac.llovera79@gmail.com | 101 | 52 | 47 | 2 | 107.16 |
| 3 | rekenas | rekenas@gmail.com | 100 | 55 | 43 | 2 | 100.25 |
| 4 | mlieban3 | mlieban3@gmail.com | 88 | 46 | 40 | 2 | 91.81 |
| 5 | rastak.pinxo | rastak.pinxo@gmail.com | 76 | 43 | 33 | 0 | 83.66 |
| 6 | diekert | diekert@gmail.com | 90 | 35 | 55 | 0 | 77.89 |
| 7 | queesunahipotenusa | queesunahipotenusa@gmail.com | 76 | 46 | 30 | 0 | 73.02 |
| 8 | Mike | mlieban3@xtec.cat | 0 | 0 | 0 | 0 | 0 |
| 9 | shurlorito | shurlorito@gmail.com | 0 | 0 | 0 | 0 | 0 |
| 10 | joan.albornoz | joan.albornoz@gmail.com | 0 | 0 | 0 | 0 | 0 |

## Important

The generated SQL imports `profiles` and `picks`, but it intentionally checks that matching `auth.users.id` rows exist first.
If those Auth users are missing in the new Supabase project, import or recreate Auth users before running `imports/import_legacy_profiles_picks.sql`.
