// content.js

// Check if the popup should be shown (e.g., when the user visits a specific page)
if (!localStorage.getItem('popupShown')) {
    // Show the popup
    chrome.runtime.sendMessage({ action: "show_popup" });
}

// Mark the popup as shown so it doesn't show again
localStorage.setItem('popupShown', 'true');