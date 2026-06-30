// Background service worker for Footy-Trivia Live Score extension
// Handles opening a detached live scores popup window

let popupWindowId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openLivePopup') {
    openDetachedPopup();
    sendResponse({ success: true });
  }
});

async function openDetachedPopup() {
  // Check if popup window already exists
  if (popupWindowId !== null) {
    try {
      const win = await chrome.windows.get(popupWindowId);
      if (win) {
        // Focus the existing window
        await chrome.windows.update(popupWindowId, { focused: true });
        return;
      }
    } catch (e) {
      // Window was closed, create a new one
      popupWindowId = null;
    }
  }

  // Create a new popup window
  const popup = await chrome.windows.create({
    url: chrome.runtime.getURL('live-window.html'),
    type: 'popup',
    width: 380,
    height: 520,
    top: 80,
    left: Math.max(0, screen.availWidth - 420),
    focused: true
  });

  popupWindowId = popup.id;

  // Track when the popup window is closed
  chrome.windows.onRemoved.addListener(function onClosed(windowId) {
    if (windowId === popupWindowId) {
      popupWindowId = null;
      chrome.windows.onRemoved.removeListener(onClosed);
    }
  });
}
