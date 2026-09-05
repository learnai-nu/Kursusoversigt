---
title: "Hvordan vi verificerer kurser (og hvorfor priser kan være Ukendt)"
description: "Transparens om metode: kilde-URL, last_verified og ærlig håndtering af manglende data."
pubDate: 2026-06-30
author: "Kursusoversigt-redaktionen"
tags: ["metode", "transparens", "data"]
sources:
  - title: "Schema.org Course"
    url: https://schema.org/Course
---

Kursusoversigt er et **SEO- og overblikslag**, ikke et betalt katalog. Vi linker til offentlige kilder og opdaterer feltet `last_verified`, når en side er tjekket manuelt.

## Principper

- Vi opfinder ikke eksakte priser. Mangler pris → **Ukendt**.
- Mangler startdato → **Ukendt** (`null` i data).
- Hver kursusside har `source_url`.
- Demo-mode kører på lokal JSON uden Supabase.

Det betyder, at I altid bør bekræfte detaljer hos udbyderen — fx [Teknologisk Institut](/udbydere/teknologisk-institut) eller [Københavns Universitet](/udbydere/ku).

## Hvad I kan stole på

Titler, korte beskrivelser, udbyder og tags er redaktionelt kurateret til overblik. Se hele listen på [AI-kurser](/ai-kurser) og læs mere om valg i [Sådan vælger du AI-kursus](/artikler/vaelg-ai-kursus-danmark).

Hvis I vil have hjælp til at gå fra overblik til handling, er [LearnAI](https://learnai.nu/?utm_source=kursusoversigt&utm_medium=referral&utm_campaign=site) det bløde næste skridt.
