var sidePanelButton = document.getElementById('open-sidepanel');

if (sidePanelButton == null) {
    console.log('Open side panel button was not found');
} else {
    sidePanelButton.addEventListener('click', async () => {
        // Get the current active tab to find the window ID
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        chrome.sidePanel.open({ windowId: tab.windowId });

        window.close();
    });
}
