// Content script to inject and show toast notifications
console.log("Toast.js content script loaded and initialized");

function showToast(title, message) {

  // Remove any existing toast
  const existingToast = document.querySelector('.decode-toast');
  if (existingToast) {
    existingToast.remove();
  }
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'decode-toast';
  
  // Adjust width based on content length (longer content gets more width)
  if (message && message.length > 100) {
    toast.style.maxWidth = '500px';
  }
  
  // Create header with title and close button
  const headerElem = document.createElement('div');
  headerElem.className = 'decode-toast-header';
  
  // Create title element
  const titleElem = document.createElement('div');
  titleElem.className = 'decode-toast-title';
  titleElem.textContent = title;
  headerElem.appendChild(titleElem);
  
  // Create close button
  const closeElem = document.createElement('span');
  closeElem.className = 'decode-toast-close';
  closeElem.textContent = '✕';
  closeElem.title = 'Close';
  closeElem.addEventListener('click', () => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  });
  headerElem.appendChild(closeElem);
  
  toast.appendChild(headerElem);
    // Add message with selectable text
  const messageElem = document.createElement('pre'); // Using pre for better handling of newlines and spaces
  messageElem.className = 'decode-toast-message';
  
  // Ensure we never set undefined content
  if (message === undefined || message === null) {
    message = "No content to display";
  }
  
  messageElem.textContent = message; // Using textContent preserves whitespace
  toast.appendChild(messageElem);
  
  // Add to document
  document.body.appendChild(toast);
  console.log("Toast element added to document:", toast);
  
  // Auto-remove after 30 seconds (if not manually closed)
  const autoCloseTimer = setTimeout(() => {
    if (document.body.contains(toast)) {
      // Fade out before removing
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }, 30000); // 30 seconds
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  console.log("Message action:", message.action);
  
  if (!message || !message.action) {
    console.error("Invalid message received:", message);
    sendResponse({success: false, error: "Invalid message format"});
    return true;
  }
  
  if (message.action === "showToast") {
    try {
      console.log("Showing toast with message:", message.message);
      // Ensure title and message are not undefined
      const title = message.title || "Decode Extension";
      const msg = message.message || "No content to display";
      
      // Make sure we're not in a detached document
      if (document && document.body) {
        showToast(title, msg);
        console.log("Toast displayed successfully");
        sendResponse({success: true});
      } else {
        console.error("Cannot show toast: document or body is not available");
        sendResponse({success: false, error: "Document not available"});
      }
    } catch (error) {
      console.error("Error showing toast:", error);
      sendResponse({success: false, error: error.message});
    }
    return true; // Indicates we'll send a response asynchronously
  }
  
  // Always return true for async response
  return true;
});
