import json
import re
from pathlib import Path

BIBLE_DIR = Path("bibles/spaRV1909_readaloud")
OUTPUT_FILE = Path("data/spanish_bible.json")

BOOKS = {
    "GEN": "Genesis",
    "EXO": "Exodus",
    "LEV": "Leviticus",
    "NUM": "Numbers",
    "DEU": "Deuteronomy",
    "JOS": "Joshua",
    "JDG": "Judges",
    "RUT": "Ruth",
    "1SA": "1 Samuel",
    "2SA": "2 Samuel",
    "1KI": "1 Kings",
    "2KI": "2 Kings",
    "1CH": "1 Chronicles",
    "2CH": "2 Chronicles",
    "EZR": "Ezra",
    "NEH": "Nehemiah",
    "EST": "Esther",
    "JOB": "Job",
    "PSA": "Psalms",
    "PRO": "Proverbs",
    "ECC": "Ecclesiastes",
    "SNG": "Song of Solomon",
    "ISA": "Isaiah",
    "JER": "Jeremiah",
    "LAM": "Lamentations",
    "EZK": "Ezekiel",
    "DAN": "Daniel",
    "HOS": "Hosea",
    "JOL": "Joel",
    "AMO": "Amos",
    "OBA": "Obadiah",
    "JON": "Jonah",
    "MIC": "Micah",
    "NAM": "Nahum",
    "HAB": "Habakkuk",
    "ZEP": "Zephaniah",
    "HAG": "Haggai",
    "ZEC": "Zechariah",
    "MAL": "Malachi",

    "MAT": "Matthew",
    "MRK": "Mark",
    "LUK": "Luke",
    "JHN": "John",
    "ACT": "Acts",
    "ROM": "Romans",
    "1CO": "1 Corinthians",
    "2CO": "2 Corinthians",
    "GAL": "Galatians",
    "EPH": "Ephesians",
    "PHP": "Philippians",
    "COL": "Colossians",
    "1TH": "1 Thessalonians",
    "2TH": "2 Thessalonians",
    "1TI": "1 Timothy",
    "2TI": "2 Timothy",
    "TIT": "Titus",
    "PHM": "Philemon",
    "HEB": "Hebrews",
    "JAS": "James",
    "1PE": "1 Peter",
    "2PE": "2 Peter",
    "1JN": "1 John",
    "2JN": "2 John",
    "3JN": "3 John",
    "JUD": "Jude",
    "REV": "Revelation"
}

spanish_bible = {}


files = sorted(BIBLE_DIR.glob("*.txt"))

for file in files:

    match = re.match(
        r"spaRV1909_\d+_([A-Z0-9]+)_(\d+)_read\.txt",
        file.name
    )

    if not match:
        continue

    abbreviation = match.group(1)
    chapter = int(match.group(2))

    if abbreviation not in BOOKS:
        print("Skipping", abbreviation)
        continue

    book = BOOKS[abbreviation]

    with open(file, encoding="utf-8-sig") as f:
        lines = [line.strip() for line in f if line.strip()]

    if len(lines) < 3:
        continue

    verses = lines[2:]

    for verse_number, verse in enumerate(verses, start=1):

        key = f"{book} {chapter}:{verse_number}"

        spanish_bible[key] = verse

OUTPUT_FILE.parent.mkdir(exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(
        spanish_bible,
        f,
        ensure_ascii=False,
        indent=2
    )

print("--------------------------------")
print("Finished!")
print(len(spanish_bible), "verses written.")
print("Saved to:")
print(OUTPUT_FILE)