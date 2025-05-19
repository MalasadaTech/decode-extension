// Create context menu items
browser.contextMenus.create({
  id: "decodeUrl",
  title: "Decode as URL-encoded",
  contexts: ["selection"]
});

browser.contextMenus.create({
  id: "decodeBase64",
  title: "Decode as Base64-encoded",
  contexts: ["selection"]
});

browser.contextMenus.create({
  id: "decodeHex",
  title: "Decode as Hex",
  contexts: ["selection"]
});

browser.contextMenus.create({
  id: "decodeUnicode",
  title: "Decode as Unicode Escape",
  contexts: ["selection"]
});

// Listen for context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decodeUrl") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["url"]
    }).then((results) => {
      showNotification(results[0].result);
    }).catch((error) => {
      showNotification("Error decoding: " + error.message);
    });
  } else if (info.menuItemId === "decodeBase64") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["base64"]
    }).then((results) => {
      showNotification(results[0].result);
    }).catch((error) => {
      showNotification("Error decoding: " + error.message);
    });
  } else if (info.menuItemId === "decodeHex") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["hex"]
    }).then((results) => {
      showNotification(results[0].result);
    }).catch((error) => {
      showNotification("Error decoding: " + error.message);
    });
  } else if (info.menuItemId === "decodeUnicode") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["unicode"]
    }).then((results) => {
      showNotification(results[0].result);
    }).catch((error) => {
      showNotification("Error decoding: " + error.message);
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
    } else if (type === "unicode") {
      console.log("Decoding type: unicode");
      console.log("Selected text:", selectedText);
      // Handle various Unicode escape formats
      decodedText = selectedText
        // Handle \uXXXX format
        .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        )
        // Handle \u{XXXXX} format (ES6)
        .replace(/\\u\{([0-9a-fA-F]+)\}/g, (match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        )
        // Handle &#XXXXX; HTML entity format (decimal)
        .replace(/&#(\d+);/g, (match, dec) => 
          String.fromCodePoint(parseInt(dec, 10))
        )
        // Handle &#xXXXX; HTML entity format (hex)
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        );
      console.log("Decoded unicode:", decodedText);
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
  browser.tabs.query({active: true, currentWindow: true})
    .then(function(tabs) {
      if (tabs && tabs.length > 0) {
        // Send message to the content script
        browser.tabs.sendMessage(tabs[0].id, {
          action: "showToast",
          title: "Decode Extension",
          message: text
        }).then(function(response) {
          console.log("Toast notification shown successfully");
        }).catch(function(error) {
          console.error("Error showing toast notification:", error);
        });
      }
    })
    .catch(function(error) {
      console.error("Error finding active tab:", error);
    });
}
