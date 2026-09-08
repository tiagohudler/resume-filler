import { formMappings } from "../mappings/formMapping.js";
import { Experience } from "../models/experience.js"
import { PersonalProject } from "../models/personalProject.js"
import { UrlData } from "../models/url.js"

const addUrlButtons = document.getElementsByClassName("add-url-button");

const overlay = document.getElementById(
    "form-overlay"
) as HTMLElement;

const addExperienceButton = document.getElementById(
    "add-experience-button"
) as HTMLButtonElement;

const addPersonalProjectButton = document.getElementById(
    "add-personal-project-button"
) as HTMLButtonElement;


// =========================
// URLs
// =========================

for (const button of addUrlButtons) {
    button.addEventListener("click", async () => {

        const inputType = button.getAttribute("name");

        if (inputType === null) {
            console.log("Could not get input type");
            return;
        }

        await openForm(inputType);
    });
}


// =========================
// EXPERIENCE
// =========================

addExperienceButton.addEventListener("click", async () => {
    await openForm("experience");
});


// =========================
// PERSONAL PROJECTS
// =========================

addPersonalProjectButton.addEventListener("click", async () => {
    await openForm("personal-project");
});


// =========================
// OPEN FORM
// =========================

async function openForm(inputType: string) {

    const sourcePath = formMappings.get(inputType);

    if (sourcePath === undefined) {
        console.log(`Could not find form for ${inputType}`);
        return;
    }

    const url = chrome.runtime.getURL(sourcePath);

    const response = await fetch(url);
    const html = await response.text();

    overlay.innerHTML = html;

    overlay.style.display = "flex";

    addFormEventListeners(inputType);
}


// =========================
// FORM EVENTS
// =========================

function addFormEventListeners(inputKey: string) {

    const form = document.getElementById(
        "input-form"
    ) as HTMLFormElement;

    const cancelButton = document.getElementById(
        "form-cancel-button"
    ) as HTMLButtonElement;


    if (inputKey === "experience") {

        const currentJobCheckbox = document.getElementById(
            "current-job"
        ) as HTMLInputElement;

        const endDateInput = document.getElementById(
            "end-date"
        ) as HTMLInputElement;

        currentJobCheckbox.addEventListener("change", () => {

            if (currentJobCheckbox.checked) {

                endDateInput.disabled = true;
                endDateInput.required = false;
                endDateInput.value = "";

            } else {

                endDateInput.disabled = false;
                endDateInput.required = true;
            }
        });
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = new FormData(form);

        const formValues = Object.fromEntries(
            formData.entries()
        );

        await saveFormData(inputKey, formValues);

        overlay.style.display = "none";

        await loadStoredData();
    });

    cancelButton.addEventListener("click", (event) => {

        event.preventDefault();

        overlay.style.display = "none";
    });
}


// =========================
// SAVE DATA
// =========================

async function saveFormData(
    inputKey: string,
    formValues: Record<string, FormDataEntryValue>
) {

    // URLs
    if (
        inputKey === "linkedin" ||
        inputKey === "github" ||
        inputKey === "website"
    ) {

        await chrome.storage.sync.set({
            [inputKey]: formValues
        });

        return;
    }


    if (inputKey === "experience") {

        const result = await chrome.storage.sync.get(
            "experiences"
        );

        const experiences: Experience[] =
            (result.experiences as Experience[] | undefined) ?? [];

        const currentJob =
            formValues["current-job"] === "on";

        const experience: Experience = {
            company: String(formValues.company),
            startDate: String(formValues["start-date"]),
            endDate: currentJob
                ? null
                : String(formValues["end-date"]),
            currentJob: currentJob,
            description: String(formValues.description)
        };

        experiences.push(experience);

        await chrome.storage.sync.set({
            experiences: experiences
        });

        return;
    }


    if (inputKey === "personal-project") {

        const result = await chrome.storage.sync.get(
            "personalProjects"
        );

        const personalProjects: PersonalProject[] =
            (result.personalProjects as PersonalProject[] | undefined) ?? [];

        const project: PersonalProject = {
            name: String(formValues.name),
            description: String(formValues.description)
        };

        personalProjects.push(project);

        await chrome.storage.sync.set({
            personalProjects: personalProjects
        });

        return;
    }
}


// =========================
// LOAD DATA
// =========================

async function loadStoredData() {

    const data = await chrome.storage.sync.get([
        "linkedin",
        "github",
        "website",
        "experiences",
        "personalProjects"
    ]);

    loadUrls(data);

    loadExperiences(
        (data.experiences as Experience[] | undefined) ?? []
    );

    loadPersonalProjects(
        (data.personalProjects as PersonalProject[] | undefined) ?? []
    );
}


// =========================
// LOAD URLS
// =========================

function loadUrls(data: Record<string, any>) {

    const urlItems = document.querySelectorAll(
        "#urls li"
    );

    urlItems.forEach((item) => {

        const button = item.querySelector(
            ".add-url-button"
        ) as HTMLButtonElement;

        const inputType = button.name;

        const existingValue = item.querySelector(
            ".stored-url"
        );

        if (existingValue) {
            existingValue.remove();
        }

        if (data[inputType]?.url) {

            const urlElement =
                document.createElement("div");

            urlElement.className = "stored-url";

            urlElement.textContent =
                data[inputType].url;

            item.insertBefore(
                urlElement,
                button
            );
        }
    });
}


// =========================
// LOAD EXPERIENCES
// =========================

function loadExperiences(experiences: Experience[]) {

    const experienceSection =
        document.getElementById("experience") as HTMLElement;

    const existingItems =
        experienceSection.querySelectorAll(
            ".experience-item"
        );

    existingItems.forEach(
        item => item.remove()
    );


    experiences.forEach((experience) => {

        const item =
            document.createElement("div");

        item.className = "experience-item";

        const dates = experience.currentJob
            ? `${experience.startDate} - Atual`
            : `${experience.startDate} - ${experience.endDate}`;

        item.innerHTML = `
            <h3>${experience.company}</h3>
            <p>${dates}</p>
            <p>${experience.description}</p>
        `;

        experienceSection.appendChild(item);
    });
}


// =========================
// LOAD PERSONAL PROJECTS
// =========================

function loadPersonalProjects(projects: PersonalProject[]) {

    const projectSection =
        document.getElementById(
            "personal-projects"
        ) as HTMLElement;


    const existingItems =
        projectSection.querySelectorAll(
            ".personal-project-item"
        );

    existingItems.forEach(
        item => item.remove()
    );


    projects.forEach((project) => {

        const item =
            document.createElement("div");

        item.className =
            "personal-project-item";

        item.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
        `;

        projectSection.appendChild(item);
    });
}


// =========================
// INITIAL LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    loadStoredData
);