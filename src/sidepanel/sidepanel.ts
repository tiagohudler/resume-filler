const addUrlButtons = document.getElementsByClassName('add-url-button');

const overlay = document.getElementById("form-overlay") as HTMLElement;

for (const button of addUrlButtons) {
    button.addEventListener('click', async () => {

        var inputType = button.getAttribute('name');

        if (inputType == null) {
            console.log('Could not get input type');
            return
        }

        // TODO: select form in runtime using input type
        const url = chrome.runtime.getURL("src/forms/urlForm.html");
        const response = await fetch(url);
        const html = await response.text();

        overlay.innerHTML = html;

        overlay.style.display = "flex";

        addFormEventListeners(inputType);
    });
}

function addFormEventListeners(inputKey: string) {
    const form = document.getElementById('input-form') as HTMLFormElement;

    form.addEventListener('submit', async (event: SubmitEvent) => {
        event.preventDefault();

        const formData = new FormData(form);

        const formValues = Object.fromEntries(formData.entries());

        await chrome.storage.sync.set({ inputKey: formValues });

        console.log(`Value\n
            ${JSON.stringify(formValues, null, 2)}\n\n
            is set in key ${inputKey}`);

        overlay.style.display = "none";
    });
}
