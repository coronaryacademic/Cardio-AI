# Cardio Guide local copy

Run START.cmd and open http://127.0.0.1:4176/#/.

Four green topic buttons keep clinical sources separate:
- Cardiac Arrest: adult uses the original Cardio Guide graph and original renderer. Pediatric uses a labeled MedOS pathway because the downloaded Cardio Guide app has no separate pediatric arrest graph.
- Tachycardia: original SVT and WCT apps; no MedOS replacement.
- Bradycardia and Post-Arrest: MedOS content with Photo, Map, and Walk.

Original Cardio Guide clinical text, branches, dosing, warnings, medications, and UI components remain in the deployed bundles. An added registry entry exposes the arrest graph already present in the WCT app. wct/entry.js preserves the topic through original role selection.

emergency/addon.js and addon.css implement the four-topic menu and separate MedOS views. algorithms.json and photos/ contain MedOS material. Cardio arrest JSON exports are retained for inspection and are not rendered by the MedOS view engine.

The original Angular development source was not supplied. Earlier download.ps1 and prepare.cjs import utilities overwrite integration changes if rerun.

Phone layouts use phone.css and the responsive rules in emergency/addon.css. Tested at 320×568, 390×844, 430×932, and 844×390. Phone maps stack by chart row, preserve exact branch links, and reroute arrows around intervening cards. Photos fit the screen with optional zoom. Original apps have a dedicated top Home bar on phones, and the WCT/arrest viewport reserves space for its original header and bottom navigation.
