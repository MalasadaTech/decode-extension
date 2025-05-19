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
  const messageElem = document.createElement('div');
  messageElem.className = 'decode-toast-message';
  messageElem.textContent = message;
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
  if (message.action === "showToast") {
    showToast(message.title, message.message);
    sendResponse({success: true});
    return true; // Indicates we'll send a response asynchronously
  }
});
