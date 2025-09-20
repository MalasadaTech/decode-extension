// filepath: d:\SoftwareDevelopment\GitHubRepoClones\decode-extension\manifest_version_3\background.js
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
  
  chrome.contextMenus.create({
    id: "decodeUnicode",
    title: "Decode as Unicode Escape",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "decodeHtmlEntity",
    title: "Decode as HTML Entity",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "analysis",
    title: "Analysis",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "nslookup",
    title: "NsLookup.io",
    parentId: "analysis",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "whois",
    title: "WHOIS",
    parentId: "analysis",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "mxtoolbox",
    title: "MXTOOLBOX",
    parentId: "analysis",
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
    });  } else if (info.menuItemId === "decodeHex") {
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
    });  } else if (info.menuItemId === "decodeUnicode") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["unicode"]
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error decoding: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        console.log("Script injection succeeded:", injectionResults);
        showNotification(injectionResults[0].result);
      }
    });
  } else if (info.menuItemId === "decodeHtmlEntity") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: decodeSelectedText,
      args: ["htmlEntity"]
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error decoding: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        console.log("Script injection succeeded:", injectionResults);
        showNotification(injectionResults[0].result);
      }
    });
  } else if (info.menuItemId === "nslookup") {
    // Get the selected text and open nslookup.io in a new tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error getting selected text: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        const selectedText = injectionResults[0].result.trim();
        if (selectedText) {
          const url = `https://www.nslookup.io/domains/${encodeURIComponent(selectedText)}/dns-records/`;
          
          // Create the new tab
          chrome.tabs.create({ url: url }, (newTab) => {
            // Check if the originating tab is in a tab group
            if (tab.groupId && tab.groupId !== -1) {
              // Move the new tab to the same group as the originating tab
              chrome.tabs.group({ tabIds: [newTab.id], groupId: tab.groupId }, () => {
                if (chrome.runtime.lastError) {
                  console.log("Could not move tab to group:", chrome.runtime.lastError.message);
                  // Tab was created successfully but couldn't be grouped - this is not a critical error
                } else {
                  console.log("Successfully moved new tab to the same group");
                }
              });
            }
          });
        } else {
          showNotification("No text selected for domain lookup");
        }
      }
    });
  } else if (info.menuItemId === "whois") {
    // Get the selected text and open whois.com in a new tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error getting selected text: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        const selectedText = injectionResults[0].result.trim();
        if (selectedText) {
          const url = `https://www.whois.com/whois/${encodeURIComponent(selectedText)}`;
          
          // Create the new tab
          chrome.tabs.create({ url: url }, (newTab) => {
            // Check if the originating tab is in a tab group
            if (tab.groupId && tab.groupId !== -1) {
              // Move the new tab to the same group as the originating tab
              chrome.tabs.group({ tabIds: [newTab.id], groupId: tab.groupId }, () => {
                if (chrome.runtime.lastError) {
                  console.log("Could not move tab to group:", chrome.runtime.lastError.message);
                  // Tab was created successfully but couldn't be grouped - this is not a critical error
                } else {
                  console.log("Successfully moved new tab to the same group");
                }
              });
            }
          });
        } else {
          showNotification("No text selected for WHOIS lookup");
        }
      }
    });
  } else if (info.menuItemId === "mxtoolbox") {
    // Get the selected text and open mxtoolbox.com in a new tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        showNotification("Error getting selected text: " + chrome.runtime.lastError.message);
      } else if (injectionResults && injectionResults[0]) {
        const selectedText = injectionResults[0].result.trim();
        if (selectedText) {
          const url = `https://mxtoolbox.com/SuperTool.aspx?action=mx%3a${encodeURIComponent(selectedText)}&run=toolpage`;
          
          // Create the new tab
          chrome.tabs.create({ url: url }, (newTab) => {
            // Check if the originating tab is in a tab group
            if (tab.groupId && tab.groupId !== -1) {
              // Move the new tab to the same group as the originating tab
              chrome.tabs.group({ tabIds: [newTab.id], groupId: tab.groupId }, () => {
                if (chrome.runtime.lastError) {
                  console.log("Could not move tab to group:", chrome.runtime.lastError.message);
                  // Tab was created successfully but couldn't be grouped - this is not a critical error
                } else {
                  console.log("Successfully moved new tab to the same group");
                }
              });
            }
          });
        } else {
          showNotification("No text selected for MXTOOLBOX lookup");
        }
      }
    });
  }
});

// Function to decode the selected text and return the result
function decodeSelectedText(type) {
  // Define parseEscapedChars inside the function so it's available when injected
  function parseEscapedChars(text) {
    console.log("parseEscapedChars received:", text);
    if (!text) {
      console.log("Text was null or empty, returning as is");
      return text || ""; // Return empty string instead of undefined/null
    }

    // Make sure we're working with a string
    text = String(text);
    
    console.log("Text length before parsing:", text.length);
    console.log("Text char codes before parsing:", Array.from(text).map(c => c.charCodeAt(0)));
    
    // Check if text has any escape sequences that need processing
    if (!text.includes('\\')) {
      console.log("No escape sequences found, returning original");
      return text;
    }
    
    // Process one character at a time to handle all escapes correctly
    try {
      let result = '';
      let i = 0;
      while (i < text.length) {
        // Check if current character is a backslash and we have at least one more character
        if (text[i] === '\\' && i + 1 < text.length) {
          // Handle the escape sequence
          switch (text[i + 1]) {
            case 'n': result += '\n'; break;
            case 'r': result += '\r'; break;
            case 't': result += '\t'; break;
            case 'b': result += '\b'; break;
            case 'f': result += '\f'; break;
            case '\\': result += '\\'; break;
            case '\'': result += '\''; break;
            case '"': result += '"'; break;
            case '0': result += '\0'; break;
            case 'v': result += '\v'; break;
            default: 
              // If not a known escape, keep the original backslash and character
              result += '\\' + text[i + 1];
          }
          i += 2; // Skip both the backslash and the escaped character
        } else {
          // Not an escape sequence, add character as is
          result += text[i];
          i += 1;
        }
      }
      console.log("Text after character-by-character parsing:", result);
      console.log("Text length after parsing:", result.length);
      console.log("Text char codes after parsing:", Array.from(result).map(c => c.charCodeAt(0)));
      return result;
    } catch (e) {
      console.error("Error in parseEscapedChars:", e);
      return text; // Return the original text as last resort
    }
  }

  console.log("Decoding type:", type, "for selected text");
  const selectedText = window.getSelection().toString();
  let decodedText;
  try {    if (type === "url") {
      decodedText = decodeURIComponent(selectedText);    } else if (type === "base64") {
      // First, normalize the input - trim whitespace and remove common artifacts
      const normalizedInput = selectedText.trim().replace(/^["']+|["']+$/g, '');
      console.log("Normalized base64 input:", normalizedInput);
      
      // Check multiple conditions for hex-like input:
      // 1. Space-separated hex values
      // 2. Comma-separated hex values
      // 3. "0x" prefixed hex values
      const isHexLike = 
        (/^[0-9A-Fa-f\s,x]+$/.test(normalizedInput) && 
        (normalizedInput.includes(" ") || normalizedInput.includes(",") || normalizedInput.includes("0x")));
      
      // Additional check for obviously invalid base64 (characters outside base64 alphabet)
      const hasInvalidBase64Chars = /[^A-Za-z0-9+/=]/.test(normalizedInput.replace(/\s/g, ''));
      
      if (isHexLike) {
        console.log("Input appears to be hex values, handling as hex instead of base64");
        // Remove any spaces, commas, 0x prefixes, or other non-hex characters
        const hex = normalizedInput.replace(/0x|[^0-9A-Fa-f]/g, '');
        
        // Ensure we have an even number of hex digits
        const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
        
        // Convert hex to string
        decodedText = '';
        for (let i = 0; i < paddedHex.length; i += 2) {
          decodedText += String.fromCharCode(parseInt(paddedHex.substr(i, 2), 16));
        }
        console.log("Decoded as hex:", decodedText);
      } else {
        // Regular base64 decoding
        try {
          // Remove whitespace before decoding
          const cleanInput = normalizedInput.replace(/\s/g, '');
          
          // Check if input length is valid for base64 (multiple of 4 when padded)
          if (cleanInput.length % 4 !== 0 && cleanInput.indexOf('=') === -1) {
            console.warn("Base64 input length not multiple of 4, might be invalid");
          }
          
          // Check for obvious non-base64 input
          if (hasInvalidBase64Chars) {
            console.warn("Input contains characters outside base64 alphabet");
            throw new Error("Input contains invalid base64 characters");
          }
          
          decodedText = atob(cleanInput);
          console.log("Decoded as base64:", decodedText);
        } catch (e) {
          console.error("Base64 decoding failed:", e.message);
          
          // Fallback: try interpreting as hex if base64 fails
          try {
            console.log("Trying hex decoding as fallback");
            // Remove any non-hex characters
            const hex = normalizedInput.replace(/[^0-9A-Fa-f]/g, '');
            
            // Only proceed if we have a reasonable amount of hex characters
            if (hex.length > 0) {
              const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
              
              decodedText = '';
              for (let i = 0; i < paddedHex.length; i += 2) {
                decodedText += String.fromCharCode(parseInt(paddedHex.substr(i, 2), 16));
              }
              console.log("Fallback hex decoding result:", decodedText);
            } else {
              throw new Error("Not a valid hex string either");
            }
          } catch (hexError) {
            throw new Error("Failed to decode as base64 or hex: " + e.message);
          }
        }
      }    } else if (type === "hex") {
      console.log("Decoding type: hex");
      console.log("Selected text:", selectedText);
      
      // Function to decode hex with better error handling
      function decodeHexString(input) {
        // Remove any spaces, 0x prefixes, commas, or other non-hex characters
        const cleanHex = input.replace(/0x|[^0-9A-Fa-f]/g, '');
        
        // Validate we have a proper hex string
        if (cleanHex.length === 0) {
          throw new Error("No valid hex characters found in input");
        }
        
        // Handle odd number of characters (pad with leading zero)
        const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
        
        let result = '';
        // Process two characters at a time
        for (let i = 0; i < paddedHex.length; i += 2) {
          const hexByte = paddedHex.substr(i, 2);
          const charCode = parseInt(hexByte, 16);
          result += String.fromCharCode(charCode);
        }
        return result;
      }
      
      decodedText = decodeHexString(selectedText);
      console.log("Decoded hex:", decodedText);    } else if (type === "unicode") {
      console.log("Decoding type: unicode");
      console.log("Selected text:", selectedText);
      
      // Function to properly handle Unicode escape sequences of various formats
      function decodeUnicodeEscapes(input) {
        if (!input) return "";
        
        let result = input;
        
        // Handle \uXXXX format
        result = result.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          try {
            return String.fromCodePoint(parseInt(hex, 16));
          } catch (e) {
            console.error("Invalid Unicode escape sequence:", match, e);
            return match; // Keep original if invalid
          }
        });
        
        // Handle \u{XXXXX} format (ES6)
        result = result.replace(/\\u\{([0-9a-fA-F]+)\}/g, (match, hex) => {
          try {
            return String.fromCodePoint(parseInt(hex, 16));
          } catch (e) {
            console.error("Invalid Unicode escape sequence:", match, e);
            return match; // Keep original if invalid
          }
        });
        
        // Handle &#XXXXX; HTML entity format (decimal)
        result = result.replace(/&#(\d+);/g, (match, dec) => {
          try {
            const codePoint = parseInt(dec, 10);
            if (isNaN(codePoint) || codePoint < 0 || codePoint > 0x10FFFF) {
              return match; // Keep original if invalid
            }
            return String.fromCodePoint(codePoint);
          } catch (e) {
            console.error("Invalid HTML decimal entity:", match, e);
            return match; // Keep original if invalid
          }
        });
        
        // Handle &#xXXXX; HTML entity format (hex)
        result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
          try {
            const codePoint = parseInt(hex, 16);
            if (isNaN(codePoint) || codePoint < 0 || codePoint > 0x10FFFF) {
              return match; // Keep original if invalid
            }
            return String.fromCodePoint(codePoint);
          } catch (e) {
            console.error("Invalid HTML hex entity:", match, e);
            return match; // Keep original if invalid
          }
        });
        
        // Handle named HTML entities if needed
        // Common ones like &lt; &gt; &amp; etc.
        result = result
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&nbsp;/g, '\xa0');
        
        return result;
      }
        decodedText = decodeUnicodeEscapes(selectedText);
      console.log("Decoded unicode:", decodedText);
    } else if (type === "htmlEntity") {
      console.log("Decoding type: HTML entity");
      console.log("Selected text:", selectedText);
      
      // Create a temporary DOM element to decode HTML entities
      // This handles both numeric (&#65;) and named entities (&amp;)
      const tempElement = document.createElement('textarea');
      tempElement.innerHTML = selectedText;
      decodedText = tempElement.value;
      
      console.log("Decoded HTML entity:", decodedText);
    }
    
    // Ensure we have a valid string before continuing
    if (decodedText === undefined || decodedText === null) {
      console.log("Decoded text is undefined or null, using original selection");
      decodedText = selectedText;
    }
    
  // Parse escaped characters in the decoded text regardless of decoding type
    console.log("Before parsing escaped chars:", decodedText);
    
    // Check if the text looks binary (has many control characters/non-printables)
    // If so, don't try to parse escape sequences as it might corrupt binary data
    const nonPrintableCount = Array.from(decodedText).filter(c => c.charCodeAt(0) < 32 && ![9, 10, 13].includes(c.charCodeAt(0))).length;
    const isBinaryLike = nonPrintableCount > decodedText.length * 0.1; // More than 10% non-printable
    
    if (isBinaryLike) {
      console.log("Text appears to be binary data, skipping escape sequence parsing");
    } else {
      decodedText = parseEscapedChars(decodedText);
    }
    console.log("After parsing escaped chars:", decodedText);
    
    // Final safeguard to never return undefined
    if (decodedText === undefined || decodedText === null) {
      console.log("Final decoded text is still undefined or null, using original selection");
      decodedText = selectedText || "No text could be decoded";
    }  } catch (e) {
    console.error("Error in decodeSelectedText:", e);
      // Provide more informative error messages based on the error type
    if (type === "base64" && e.message.includes("base64")) {
      decodedText = "Error decoding base64: The input doesn't appear to be valid base64-encoded data. If this is hex data, try using 'Decode as Hex' instead.";
    } else if (type === "url" && e.message.includes("URI")) {
      decodedText = "Error decoding URL: The input contains invalid URL-encoded characters.";
    } else if (type === "hex" && selectedText.length % 2 !== 0) {
      decodedText = "Error decoding hex: Input length should be even (each byte is 2 hex digits).";
    } else if (type === "htmlEntity") {
      decodedText = "Error decoding HTML entity: " + e.message + ". Make sure the input contains valid HTML entities (e.g., &amp;, &#65;, &#x41;).";
    } else {
      decodedText = "Error decoding: " + e.message;
    }
  }
  
  // One last check to ensure we never return undefined
  if (decodedText === undefined || decodedText === null) {
    console.log("CRITICAL: About to return undefined/null, using fallback text");
    return "Unable to decode the selected text";
  }
  
  return decodedText; // Return result to background script
}

// Function to show in-browser toast notification
function showNotification(text) {
  // Ensure we never send undefined to the content script
  if (text === undefined || text === null) {
    text = "No content to display";
  }
  
  console.log("Creating toast notification with text:", text);
  console.log("Toast text length:", text ? text.length : 0);
  console.log("Toast text type:", typeof text);
  console.log("Toast text char codes:", text ? Array.from(text).map(c => c.charCodeAt(0)) : []);
  
  // Get the active tab to show the toast in
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length > 0) {
      console.log("Found active tab:", tabs[0].id);
      console.log("Active tab URL:", tabs[0].url);
      
      // Check if we can inject into this tab (needs to be http or https)
      if (!tabs[0].url || !tabs[0].url.match(/^https?:\/\//)) {
        console.error("Cannot show toast on this page. URL must be http/https:", tabs[0].url);
        return;
      }
      
      try {
        // Send message to the content script
        console.log("Attempting to send message to content script...");
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "showToast",
          title: "Decode Extension",
          message: text
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.error("Error showing toast notification:", chrome.runtime.lastError);
            // Try injecting the content script if it wasn't loaded
            injectContentScript(tabs[0].id, text);
          } else {
            console.log("Toast notification shown successfully:", response);
          }
        });
      } catch (error) {
        console.error("Exception when trying to send message:", error);
        // Try injecting the content script if sending the message failed
        injectContentScript(tabs[0].id, text);
      }
    } else {      console.error("No active tab found");
    }
  });
}

// Function to manually inject content script and show toast
function injectContentScript(tabId, text) {
  console.log("Attempting to inject content script into tab:", tabId);
  
  // First inject the CSS
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: ["toast.css"]
  }).then(() => {
    console.log("CSS injected successfully");
    
    // Then inject the JS
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["toast.js"]
    }).then(() => {
      console.log("JS injected successfully, waiting for it to initialize");
      
      // Give it a moment to initialize
      setTimeout(() => {
        // Now try to show the toast again
        chrome.tabs.sendMessage(tabId, {
          action: "showToast",
          title: "Decode Extension",
          message: text
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.error("Still failed to show toast after injection:", chrome.runtime.lastError);
          } else {
            console.log("Toast notification shown after injection:", response);
          }
        });
      }, 100);
    }).catch(err => {
      console.error("Failed to inject JS:", err);
    });
  }).catch(err => {
    console.error("Failed to inject CSS:", err);
  });
}
