var addUrlButton = document.getElementById('add-url-button');

if (addUrlButton != null) {
    addUrlButton.addEventListener('click', async () => {
        const overlay = document.getElementById("form-overlay");

        if (overlay == null) {
            console.log('Could not find form overlay');
            return
        }

        const url = chrome.runtime.getURL("src/forms/urlForm.html");
        const response = await fetch(url);
        const html = await response.text();

        overlay.innerHTML = html;

        if (overlay != null) {
            overlay.style.display = "flex";
        } else{
            console.log('Could not find form overlay');
        }

        addFormEventListener();
    });
} else {
    console.log('Add URL button was not found');
}


function addFormEventListener(){
    const form = document.getElementById('input-form') as HTMLFormElement;

    if (form == null) {
        console.log("Could not find input form");
        return;
    }

    form.addEventListener('submit', (event: SubmitEvent) => {
        const formData = new FormData(form);

        const formValues = Object.fromEntries(formData.entries());

        console.log(formValues); 
    });
}
