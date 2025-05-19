// Content script to inject and show toast notifications
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
  console.log("Setting message element text content:", message);
  console.log("Message element before setting:", messageElem.outerHTML);
  
  // Ensure we never set undefined content
  if (message === undefined || message === null) {
    message = "No content to display";
  }
  
  messageElem.textContent = message; // Using textContent preserves whitespace
  console.log("Message element after setting:", messageElem.outerHTML);
  toast.appendChild(messageElem);
  
  // Add to document
  document.body.appendChild(toast);
  
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
browser.runtime.onMessage.addListener((message) => {
  if (!message || !message.action) {
    console.error("Invalid message received:", message);
    return Promise.resolve({success: false, error: "Invalid message format"});
  }
  
  if (message.action === "showToast") {
    console.log("Toast.js received message:", message);
    console.log("Message content:", message.message);
    console.log("Message content type:", typeof message.message);
    console.log("Message content length:", message.message ? message.message.length : 0);
    console.log("Message content char codes:", message.message ? Array.from(message.message).map(c => c.charCodeAt(0)) : []);
    
    try {
      // Ensure title and message are not undefined
      const title = message.title || "Decode Extension";
      const msg = message.message || "No content to display";
      
      // Make sure we're not in a detached document
      if (document && document.body) {
        showToast(title, msg);
        console.log("Toast displayed successfully");
        return Promise.resolve({success: true});
      } else {
        console.error("Cannot show toast: document or body is not available");
        return Promise.resolve({success: false, error: "Document not available"});
      }
    } catch (error) {
      console.error("Error showing toast:", error);
      return Promise.resolve({success: false, error: error.message});
    }
  }
  
  return Promise.resolve({success: false, error: "Unknown action"});
});
