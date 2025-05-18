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
    }
  } catch (e) {
    decodedText = "Error decoding: " + e.message;
  }
  alert("Decoded text:\n" + decodedText);
}