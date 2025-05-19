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

// Listen for context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decodeUrl") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["url"]
    });
  } else if (info.menuItemId === "decodeBase64") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["base64"]
    });
  } else if (info.menuItemId === "decodeHex") {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["hex"]
    });
  }
});

// Function to decode the selected text and display the result
function decodeSelectedText(type) {
  const selectedText = window.getSelection().toString();
  let decodedText;
  try {
    if (type === "url") {
      decodedText = decodeURIComponent(selectedText);
    } else if (type === "base64") {
      decodedText = atob(selectedText);
    } else if (type === "hex") {
      // Remove any spaces, 0x prefixes, or other non-hex characters
      const hex = selectedText.replace(/[^0-9A-Fa-f]/g, '');
      decodedText = '';
      for (let i = 0; i < hex.length; i += 2) {
        decodedText += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
    }
  } catch (e) {
    decodedText = "Error decoding: " + e.message;
  }
  alert("Decoded text:\n" + decodedText);
}