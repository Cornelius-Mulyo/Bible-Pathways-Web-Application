let language = "en";

const uiText = {

    en: {

        heroTitle: "📖 Bible Pathways",
        heroSubtitle: "Discover God's Word One Topic at a Time",
        heroDescription:
            "Explore God's Word through carefully organized topical studies, making it easy to find Scripture for teaching, devotion, and personal growth.",

        search: "🔍 Search topics, studies, or Bible references...",

        browse: "Browse Topics",

        studies: "Studies",

        back: "← Back",

        backStudies: "← Studies",

        topicalStudies: "Topical Studies",

        studyTopics: "Study Topics",

        bibleVersion: "Bible Version",

        references: "Scripture References",

        version: "KJV"

    },

    es: {

        heroTitle: "📖 Rutas Bíblicas",
        heroSubtitle: "Descubre la Palabra de Dios, un tema a la vez",
        heroDescription:
            "Explora la Palabra de Dios mediante estudios bíblicos organizados por temas para facilitar el estudio, la enseñanza y el crecimiento espiritual.",

        search: "🔍 Buscar temas, estudios o referencias bíblicas...",

        browse: "Buscar temas",

        studies: "Estudios",

        back: "← Volver",

        backStudies: "← Estudios",

        topicalStudies: "Estudios Temáticos",

        studyTopics: "Temas",

        bibleVersion: "Versión",

        references: "Referencias Bíblicas",

        version: "Reina-Valera 1909"

    }

};

let spanishBible = {};
fetch("data/spanish_bible.json")
    .then(r => r.json())
    .then(data => {
        spanishBible = data;
        console.log("Spanish Bible loaded.");
    });

const languageSelector = document.getElementById("language");

languageSelector.addEventListener("change", function () {

    language = this.value;

    updateLanguageUI();

    loadCategories(searchBox.value);

});

console.log("===== NEW SCRIPT LOADED =====");

const categoryContainer = document.getElementById("categoryContainer");
const studyContainer = document.getElementById("studyContainer");
const verseContainer = document.getElementById("verseContainer");

const studySection = document.getElementById("studySection");
const verseSection = document.getElementById("verseSection");

const categoryTitle = document.getElementById("categoryTitle");
const studyTitle = document.getElementById("studyTitle");

const backButton = document.getElementById("backButton");
const backToStudies = document.getElementById("backToStudies");

const searchBox = document.getElementById("searchBox");

let bibleData = [];

console.log("Bible Pathways started...");

// ========================================
// LOAD JSON
// ========================================

fetch("data/studies.json")
    .then(response => response.json())
    .then(data => {

        bibleData = data.categories;

        console.log("JSON Loaded");
        console.log(bibleData);

        loadCategories();

        updateLanguageUI();

    })
    .catch(error => {

        console.error("Unable to load JSON:", error);

    });

// ========================================
// LOAD CATEGORIES
// ========================================

function loadCategories(search = "") {

    const text = search.trim().toLowerCase();

    categoryContainer.innerHTML = "";

    const filtered = bibleData.filter(category => {

        const categoryMatch =
            category.name[language].toLowerCase().includes(text);

        const studyMatch =
            category.studies.some(study => {

                const titleMatch =
                    study.title[language].toLowerCase().includes(text);

                const referenceMatch =
                    study.references.some(ref =>
                        ref.toLowerCase().includes(text)
                    );

                return titleMatch || referenceMatch;

            });

        return categoryMatch || studyMatch;

    });

    console.log("Matches:", filtered.length);
    console.log(filtered.map(c => c.name[language]));

    filtered.forEach(category => {

        categoryContainer.innerHTML += `
            <div class="category-card"
                 onclick="openCategory('${category.id}')">

                <div class="category-icon">
                    ${category.icon}
                </div>

                <div class="category-name">
                    ${category.name[language]}
                </div>

                <div class="category-count">
                    ${category.studies.length} ${language === "en" ? "Studies" : "Estudios"}
                </div>

            </div>
        `;

    });

}

// ========================================
// SEARCH
// ========================================

searchBox.addEventListener("input", function () {

    console.log("Typing:", this.value);

    loadCategories(this.value);

});

// ========================================
// OPEN CATEGORY
// ========================================

function openCategory(id) {

    const category = bibleData.find(c => c.id === id);

    if (!category) return;

    categoryTitle.textContent = category.name[language];

    studyContainer.innerHTML = "";

    studySection.classList.remove("hidden");
    verseSection.classList.add("hidden");

    category.studies.forEach(study => {

        studyContainer.innerHTML += `
            <div class="study-card"
                 onclick="openStudy('${id}','${study.position}')">

                <div class="study-position">
                    ${study.position}
                </div>

                <div class="study-title">
                    ${study.title[language]}
                </div>

            </div>
        `;

    });

}

// ========================================
// OPEN STUDY
// ========================================

async function openStudy(categoryId, position) {

    const category = bibleData.find(c => c.id === categoryId);

    if (!category) return;

    const study = category.studies.find(s => s.position === position);

    if (!study) return;

    studyTitle.textContent = study.title[language];

    verseSection.classList.remove("hidden");

    verseContainer.innerHTML = "<p>Loading verses...</p>";

    verseContainer.innerHTML = "";

    for (const reference of study.references) {

        try {

            if (language === "es") {

                const verseText = spanishBible[reference];

                verseContainer.innerHTML += `
                    <div class="verse-card">

                        <div class="reference">
                            ${reference}
                        </div>

                        <div class="verse">
                            ${verseText || "Verse not found"}
                        </div>

                    </div>
                `;

            } else {

                const url =
                    `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;

                console.log("Loading:", url);

                const response = await fetch(url);

                const verse = await response.json();

                if (!response.ok || verse.error) {

                    throw new Error(verse.error || "Verse not found");

                }

                verseContainer.innerHTML += `
                    <div class="verse-card">

                        <div class="reference">
                            ${verse.reference}
                        </div>

                        <div class="verse">
                            ${verse.text}
                        </div>

                    </div>
                `;

            }

        }

        catch (error) {

            console.error(reference, error);

            verseContainer.innerHTML += `
                <div class="verse-card">

                    <div class="reference">
                        ${reference}
                    </div>

                    <div class="verse">
                        ${error.message}
                    </div>

                </div>
            `;

        }

    }

}

function updateLanguageUI() {

    const t = uiText[language];

    document.getElementById("heroTitle").textContent =
        t.heroTitle;

    document.getElementById("heroSubtitle").textContent =
        t.heroSubtitle;

    document.getElementById("heroDescription").textContent =
        t.heroDescription;

    document.getElementById("searchBox").placeholder =
        t.search;

    document.getElementById("browseTitle").textContent =
        t.browse;

    document.getElementById("statStudies").textContent =
        t.topicalStudies;

    document.getElementById("statTopics").textContent =
        t.studyTopics;

    document.getElementById("statVersion").textContent =
        t.bibleVersion;

    document.getElementById("statReferences").textContent =
        t.references;

    document.getElementById("versionName").textContent =
        t.version;

    backButton.textContent =
        t.back;

    backToStudies.textContent =
        t.backStudies;

}
// ========================================
// BACK BUTTONS
// ========================================

backButton.onclick = () => {

    studySection.classList.add("hidden");

};

backToStudies.onclick = () => {

    verseSection.classList.add("hidden");

};