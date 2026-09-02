var addUrlButton = document.getElementById('add-url-button');

if (addUrlButton != null) {
    addUrlButton.addEventListener('click', async () => {
        const overlay = document.getElementById("formOverlay");

        if (overlay == null) {
            console.log('Could not find form overlay');
            return
        }

        const url = chrome.runtime.getURL("src/forms/urlForm.html");
        const response = await fetch(url);
        const html = await response.text();

        overlay.innerHTML = html;

        if (overlay != null) {
            overlay.style.display = "block";
        } else{
            console.log('Could not find form overlay');
        }
    });
} else {
    console.log('Add URL button was not found');
}