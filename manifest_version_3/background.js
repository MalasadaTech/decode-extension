// Initialize the extension
chrome.runtime.onInstalled.addListener(function() {
  // Create context menu items
  chrome.contextMenus.create({
    id: "decodeUrl",
    title: "Decode as URL-encoded",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "decodeBase64",
    title: "Decode as Base64-encoded",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "decodeHex",
    title: "Decode as Hex",
    contexts: ["selection"]
  });

  console.log("Decode Extension initialized successfully");
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu item clicked:", info.menuItemId);
  
  // Make sure we can inject into this tab
  if (!tab.url.startsWith('http')) {
    console.error("Cannot execute script on this page. URL must start with http(s)");
    showNotification("Cannot decode text on this page. Please try on a regular web page.");
    return;
  }

  if (info.menuItemId === "decodeUrl") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["url"]
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error decoding: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        console.log("Script injection succeeded:", injectionResults);
        showNotification(injectionResults[0].result);
      }
    });
  } else if (info.menuItemId === "decodeBase64") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["base64"]
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error decoding: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        console.log("Script injection succeeded:", injectionResults);
        showNotification(injectionResults[0].result);
      }
    });
  } else if (info.menuItemId === "decodeHex") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["hex"]
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error decoding: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        console.log("Script injection succeeded:", injectionResults);
        showNotification(injectionResults[0].result);
      }
    });
  }
});

// Function to decode the selected text and return the result
function decodeSelectedText(type) {
  console.log("Decoding type:", type, "for selected text");
  const selectedText = window.getSelection().toString();
  let decodedText;
  try {
    if (type === "url") {
      decodedText = decodeURIComponent(selectedText);
    } else if (type === "base64") {
      decodedText = atob(selectedText);
    } else if (type === "hex") {
      console.log("Decoding type: hex");
      console.log("Selected text:", selectedText);
      // Remove any spaces, 0x prefixes, or other non-hex characters
      const hex = selectedText.replace(/[^0-9A-Fa-f]/g, '');
      decodedText = '';
      for (let i = 0; i < hex.length; i += 2) {
        decodedText += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      console.log("Decoded hex:", decodedText);
    }
  } catch (e) {
    throw new Error(e.message); // Throw error to be caught by the caller
  }
  return decodedText; // Return result to background script
}

// Function to show in-browser toast notification
function showNotification(text) {
  console.log("Creating toast notification with text:", text);
  
  // Get the active tab to show the toast in
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length > 0) {
      console.log("Found active tab:", tabs[0].id);
      
      // Send message to the content script
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showToast",
        title: "Decode Extension",
        message: text
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error showing toast notification:", chrome.runtime.lastError);
        } else {
          console.log("Toast notification shown successfully:", response);
        }
      });
    } else {
      console.error("No active tab found");
    }
  });
}