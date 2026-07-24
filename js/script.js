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
            category.name.toLowerCase().includes(text);

        const studyMatch =
            category.studies.some(study => {

                const titleMatch =
                    study.title.toLowerCase().includes(text);

                const referenceMatch =
                    study.references.some(ref =>
                        ref.toLowerCase().includes(text)
                    );

                if (titleMatch || referenceMatch) {

                    console.log(
                        category.name,
                        "matched by:",
                        study.title
                    );

                }

                return titleMatch || referenceMatch;

            });

        console.log(
            category.name,
            "| Category:",
            categoryMatch,
            "| Study:",
            studyMatch
        );

        return categoryMatch || studyMatch;

    });

    console.log("Matches:", filtered.length);
    console.log(filtered.map(c => c.name));

    filtered.forEach(category => {

        categoryContainer.innerHTML += `
            <div class="category-card"
                 onclick="openCategory('${category.id}')">

                <div class="category-icon">
                    ${category.icon}
                </div>

                <div class="category-name">
                    ${category.name}
                </div>

                <div class="category-count">
                    ${category.studies.length} Studies
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

    categoryTitle.textContent = category.name;

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
                    ${study.title}
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

    studyTitle.textContent = study.title;

    verseSection.classList.remove("hidden");

    verseContainer.innerHTML = "<p>Loading verses...</p>";

    verseContainer.innerHTML = "";

    for (const reference of study.references) {

        try {

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

// ========================================
// BACK BUTTONS
// ========================================

backButton.onclick = () => {

    studySection.classList.add("hidden");

};

backToStudies.onclick = () => {

    verseSection.classList.add("hidden");

};