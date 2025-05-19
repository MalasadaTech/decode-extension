# Decode Extension Development Roadmap

This roadmap outlines the planned enhancements for the **Decode Extension**, a browser extension for Firefox and Chrome that decodes URL-encoded and Base64-encoded strings via a context menu. The goal is to enhance its functionality for web developers, security researchers, and general users, with a focus on phishing analysis (e.g., on urlscan.io).

## Overview

The extension currently supports decoding URL-encoded and Base64-encoded strings with a right-click context menu, displaying results in an alert box. The following features will expand its capabilities, improve usability, and streamline workflows for security research.

## Planned Features

### Priority 1: Core Enhancements for Phishing Analysis
These features directly address needs in phishing analysis, such as handling varied obfuscation and integrating with external tools.

1. **Support Additional Encoding/Decoding Types**  
   - **Description**: Add support for Hex, HTML Entity, ROT13, Unicode Escape decoding, and encoding options for URL and Base64.
   - **Why**: Phishing code often uses diverse obfuscation methods beyond URL and Base64.
   - **Dependencies**: None.
   - **Effort**: Medium (update `background.js` with new decoding logic and context menu items).
   - **Timeline**: Week 1 (May 19–25, 2025).
   - **Status**: Partially complete (Hex decoding added; HTML Entity, ROT13, Unicode Escape, and encoding options pending).

2. **Multi-Layered Decoding**  
   - **Description**: Add recursive decoding for nested encodings and a step-by-step decode option.
   - **Why**: Phishing attacks frequently use nested encoding (e.g., Base64 inside URL encoding).
   - **Dependencies**: Feature #1 (additional encoding types).
   - **Effort**: Medium (modify `background.js` to loop through decoding methods).
   - **Timeline**: Week 2 (May 26–June 1, 2025).

3. **Integration with External Tools**  
   - **Description**: Add options to open decoded URLs in urlscan.io, VirusTotal, and sandboxes like Any.Run.
   - **Why**: Streamlines security research workflows by linking to analysis tools.
   - **Dependencies**: None.
   - **Effort**: Medium (add context menu items and use `chrome.tabs.create`).
   - **Timeline**: Week 3 (June 2–8, 2025).

### Priority 2: Usability Improvements
These features improve the user experience and make the extension more practical for frequent use.

4. **Improved Output Display**  
   - **Description**: Replace alerts with browser notifications, clipboard copying, a popup window, and inline display.
   - **Why**: Alerts are disruptive; better output methods enhance usability.
   - **Dependencies**: New permissions (`"notifications"`, `"clipboardWrite"`).
   - **Effort**: High (create `popup.html`, update `manifest.json`, modify `background.js`).
   - **Timeline**: Weeks 4–5 (June 9–22, 2025).

5. **Detect Encoding Type Automatically**  
   - **Description**: Add "Auto Decode" and "Show All Decodings" to detect and display possible encodings.
   - **Why**: Saves time when the encoding type is unknown, common in phishing analysis.
   - **Dependencies**: Feature #1 (additional encoding types).
   - **Effort**: Medium (add detection logic in `background.js`).
   - **Timeline**: Week 6 (June 23–29, 2025).

### Priority 3: Advanced Features
These features add advanced functionality for power users and security researchers.

6. **Highlight Encoded Strings on Page**  
   - **Description**: Automatically highlight encoded strings on the webpage and allow decoding with a click.
   - **Why**: Speeds up identification of encoded strings on pages like urlscan.io.
   - **Dependencies**: Feature #1 (additional encoding types), new content script.
   - **Effort**: High (create `content.js`, update `manifest.json` for content scripts).
   - **Timeline**: Weeks 7–8 (June 30–July 13, 2025).

7. **Batch Decoding**  
   - **Description**: Add a popup for decoding multiple strings at once and exporting results.
   - **Why**: Useful for processing lists of encoded URLs in phishing logs.
   - **Dependencies**: Feature #4 (popup window), new permission (`"downloads"`).
   - **Effort**: Medium (create `batch.html`, update `manifest.json`).
   - **Timeline**: Week 9 (July 14–20, 2025).

8. **Encoding/Decoding History**  
   - **Description**: Keep a history of decoded strings and allow users to view or clear it.
   - **Why**: Helps track previous decodings during analysis.
   - **Dependencies**: New permission (`"storage"`), Feature #4 (popup window).
   - **Effort**: Medium (create `history.html`, store data in `chrome.storage`).
   - **Timeline**: Week 10 (July 21–27, 2025).

### Priority 4: Customization and Advanced Options
These features cater to advanced users and improve the overall experience.

9. **Custom Encoding/Decoding Rules**  
   - **Description**: Allow users to define and save custom decoding rules.
   - **Why**: Enables advanced users to handle non-standard obfuscation.
   - **Dependencies**: New permission (`"storage"`), settings page.
   - **Effort**: High (create `settings.html`, securely handle user-defined code).
   - **Timeline**: Weeks 11–12 (July 28–August 10, 2025).

10. **Theme Support and Customization**  
    - **Description**: Add dark/light mode and custom highlight colors.
    - **Why**: Improves accessibility and user preference.
    - **Dependencies**: Feature #4 (popup window), Feature #6 (highlighting), new permission (`"storage"`).
    - **Effort**: Medium (create `settings.html` for theme options, update styles).
    - **Timeline**: Week 13 (August 11–17, 2025).

## Dependencies and Permissions

- **New Permissions**:
  - `"notifications"`: For browser notifications (Feature #4).
  - `"clipboardWrite"`: For copying to clipboard (Feature #4).
  - `"downloads"`: For exporting batch results (Feature #7).
  - `"storage"`: For saving history, custom rules, and themes (Features #8, #9, #10).
  - `"https://www.virustotal.com/*"`: For VirusTotal integration (Feature #3, if using API).
- **New Files**:
  - `popup.html`: For improved output display (Feature #4).
  - `batch.html`: For batch decoding (Feature #7).
  - `history.html`: For decoding history (Feature #8).
  - `settings.html`: For custom rules and themes (Features #9, #10).
  - `content.js`: For highlighting encoded strings (Feature #6).

## Progress Tracking

Use this checklist to track implementation progress:

1. [ ] Support Additional Encoding/Decoding Types  
   - [x] Hex decoding added  
   - [ ] HTML Entity, ROT13, Unicode Escape, and encoding options pending  
2. [ ] Multi-Layered Decoding  
3. [ ] Integration with External Tools  
4. [ ] Improved Output Display  
5. [ ] Detect Encoding Type Automatically  
6. [ ] Highlight Encoded Strings on Page  
7. [ ] Batch Decoding  
8. [ ] Encoding/Decoding History  
9. [ ] Custom Encoding/Decoding Rules  
10. [ ] Theme Support and Customization  

## Notes

- **Timeline**: The timeline assumes 1–2 weeks per feature, starting from May 19, 2025, with a total duration of 13 weeks (ending August 17, 2025). Adjust based on your availability.
- **Testing**: Test each feature in both Firefox and Chrome, using the `manifest_version_2` and `manifest_version_3` directories as appropriate.
- **Documentation**: Update `README.md` after each feature to reflect new functionality, permissions, and usage instructions.

*Last updated: Sunday, May 18, 2025, 04:29 PM HST*