# Integrated Science 6–10: photographs and NOAA's measured carbon dioxide · 2026-11-16

The repository owner asked for public-domain photographs in the science lessons. This note records which photographs were added, how each licence was checked, which candidates were rejected and why, and how NOAA's measured carbon dioxide record was added to lesson 14. The rules applied are in [the illustrations note](integrated-science-illustrations-20261115.md).

## What was added

| Lesson and step | Image | Credit as shown on the source page | Licence |
| --- | --- | --- | --- |
| 8 Recovering a population, step 2 | An island fox on Santa Cruz Island | "NPS / Jessica Weinberg McClosky" | U.S. Government work (public domain) |
| 10 Moon phases, step 2 | Waxing crescent, first quarter, waxing gibbous and full Moon, side by side | Creator "NASA Goddard", Copyright "None" | U.S. Government work (public domain) |
| 18 Moving uphill, step 1 | An American pika at Crater Lake National Park | "NPS / Devin Stucki" | U.S. Government work (public domain) |

**Display.**
- Each image appears under the step text with a caption, a credit line, the licence and a link to the page where the licence was checked.
- The Moon images are renderings made from Lunar Reconnaissance Orbiter data, not photographs. Their credit line says "Image" rather than "Photo", and the caption says what they are.

**Storage.**
- Images are stored in `assets/photos/` as WebP, 1,120–1,200 pixels wide, 27–158 KB each.
- The site's Content Security Policy allows only its own images, so linking to the source would not have worked.
- `THIRD_PARTY_NOTICES.md` lists each image with its credit and the statement "No claim to original U.S. Government works". The NPS disclaimer asks for that statement when its works are republished commercially.

## How each licence was checked

Each source page was read on 2026-11-16, and the credit was checked next to the specific image, not in a search result.

- **Island fox.**
  - Page: [nps.gov/im/medn/island-fox.htm](https://www.nps.gov/im/medn/island-fox.htm). Credit: "NPS / Jessica Weinberg McClosky", with no ©.
  - Original file: `https://www.nps.gov/im/medn/images/JES_2803E1.jpg`, 5,671 × 3,786, SHA-256 `2ca45c19…468770ec`.
  - The file's embedded copyright field holds the photographer's name, a camera setting; the page's credit names NPS.
- **American pika.**
  - Page: [nps.gov/articles/pikas-in-peril.htm](https://www.nps.gov/articles/pikas-in-peril.htm). Credit: "NPS / Devin Stucki", caption "American pika standing on rock at Crater Lake National Park, Oregon."
  - Another photograph on the same page is credited "© Michael Durham" and was not used.
  - Original file: `https://www.nps.gov/articles/images/CRLA_Pika-on-rock2_DStucki_2010.JPG`, 3,264 × 2,448, SHA-256 `d9e0c646…9b8973f0`.
- **Moon phases.**
  - The metadata of images.nasa.gov items `GSFC_20171208_Archive_e000865` to `e000868` gives Creator "NASA Goddard" and Copyright "None".
  - They come from the Scientific Visualization Studio's "Moon Phases 2015" renderings (visualization 4236), made with Lunar Reconnaissance Orbiter data.
  - **Caveat:** the visualization appears to have been made by a NASA contractor (USRA), according to search results; svs.gsfc.nasa.gov itself could not be reached. So "public domain" rests on NASA's own metadata ("Copyright: None", with no use restrictions) rather than on authorship by a federal employee. The credit line uses NASA's exact text, "NASA Goddard".
  - Originals: 3,240² and 1,024² pixels; SHA-256 `085af078…`, `51229e7e…`, `d7f19d20…`, `07b0c21e…`.
  - NASA asks to be acknowledged and forbids implied endorsement; no NASA logo is used.

**Processing.** Each image was resized with Lanczos filtering and saved as WebP at quality 70–82, with its embedded metadata removed. The four Moon images were scaled to 300 pixels and placed side by side on black. Nothing else was changed.

## Rejected candidates

- **Island fox, other photographs.**
  - The Channel Islands park's fox page and NPGallery item 38cc4ed8 are credited "© Tim Hauf".
  - A Wikimedia Commons file tagged public domain names the same photographer in its description.
  - NPGallery items credited only "H. Kajitani" do not name NPS.
- **Island fox, the USFWS photograph by Lara Drizd.** It is acceptable under CC BY 2.0 and shows the whole animal. The NPS photograph was chosen because public domain carries no licence conditions.
- **Pika, NPS/Patrick Myers.** This photograph, taken at 3,699 m at Great Sand Dunes, is public domain and suits the lesson. Flickr and Wikimedia blocked the download from this environment ("Rate limited"), so the Crater Lake photograph was used. The Myers photograph can replace it later.
- **Pika, others.** Photographs credited "Wayne Steffes", "sally king" and "© Michael Durham", and one NPGallery item with no credit.
- **Rock pocket mice, lesson 11.** No acceptable photograph of a dark mouse on dark lava was found.
  - On iNaturalist, every photograph but one is NC or ND licensed or unlicensed.
  - NPS and USGS have none.
  - The one acceptable photograph shows a light mouse on light rock, at 640 × 480 and under CC BY-SA 4.0.

  The lesson's point is the contrast between dark and light mice, so half the contrast would mislead. Share-alike terms would also follow any adapted version. The lesson keeps its drawing and has no photograph.

## NOAA's measured carbon dioxide in lesson 14

Lesson 14's lab drew a smooth model built from typical values. For Mauna Loa it now also draws NOAA's measured monthly means for January 2016 to December 2025, as a thin orange line.

**Data.**
- File: [co2_mm_mlo.csv](https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv), file creation date 2026-10-09, retrieved 2026-11-16, SHA-256 `d895fb5b…1c07f675`.
- The lab's note shows the credit NOAA's data page asks for: Dr. Xin Lan, NOAA/GML, and Dr. Ralph Keeling, Scripps Institution of Oceanography.
- The file's terms say the data "are made freely available to the public", and ask users to credit the providers. NOAA's trends page credits Dr. Xin Lan of NOAA GML and Dr. Ralph Keeling of Scripps.
- The 120 values are stored in `assets/science-models.js`. No month in that range was interpolated.
- From December 2022 to early July 2023, after Mauna Loa erupted, NOAA measured at Maunakea, about 34 km north. The lab's note says so.

**A correction the data showed.** The model's trend began at 414.2 ppm at the start of 2020. That is 2020's annual mean, which belongs to mid-year, so the whole curve sat about 1.3 ppm high. A least-squares line through the 120 measured months gives 412.9 ppm at the start of 2020, rising 2.47 ppm a year, and the model now uses those values (2.47 rounds to the 2.5 ppm a year that the lesson states).

**Agreement.**
- With the trend removed, the measured yearly cycle swings 6.6 ppm, highest in May and lowest in September and October. The model uses 6.5 ppm with the same timing.
- The model's monthly values differ from the measurements by 0.68 ppm root mean square, and by at most 2.2 ppm.

`tests/integrated-science.test.cjs` recomputes the fit, the cycle and the root-mean-square difference from the stored values. It also checks that only the Mauna Loa view draws the measurements.

The other two stations, Utqiaġvik and the South Pole, are still modelled only. Their measured records are in separate NOAA files and were not added.

## Independent check

A second reader checked the credits on the source pages, compared the image files with the originals, and compared all 120 values with NOAA's file. It also recomputed the fit. Everything matched:
- The old 414.2 ppm is 2020's annual mean (NOAA's annual-mean file gives 414.21).
- The fit gives 412.900 ppm and 2.4721 ppm a year.

Its other findings, all addressed:
- The data credit was only in code, so learners never saw it. It is now in the lab's note.
- "to July 2023" is now "to early July 2023", as NOAA says.
- The readout names the year's peak with its unit and month: 430.5 ppm in May.
- The Moon credit now matches NASA's exact text, with the contractor caveat above.
- The notice explains why it credits Scripps.
- The source link says that it opens in a new tab.

## Gaps

- **Lesson 11 has no photograph** of rock pocket mice; see above. A photograph could be added later with written permission from a researcher, or if an acceptable licence appears.
- **The Moon images are renderings.** A real photographic sequence of phases under an acceptable licence was not found in the time available.
- **Laws outside the United States** may not treat U.S. Government works as public domain. This note is not legal advice, and `IP_REVIEW_2026-10-07.md` already recommends a lawyer's review before a paid or school release.
