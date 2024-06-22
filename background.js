let is_active = false;

chrome.action.onClicked.addListener((tab) => {
    is_active = !is_active; // Toggle the activation state
    chrome.tabs.sendMessage(tab.id, { is_active: is_active });
});
