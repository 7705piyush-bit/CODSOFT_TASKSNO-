# Phishing Awareness Program

A responsive, browser-based security awareness learning path. It uses plain HTML, CSS, and JavaScript; there is no server, framework, or dependency installation.

## Run in VS Code

1. Open the `my project 1` folder in VS Code.
2. Open `index.html` in a browser, or use the Live Server extension if it is already installed.
3. Complete the six learning modules, try all four simulation scenarios, and take the 12-question quiz. A score of at least 70% plus all six completed modules unlocks the printable certificate.

The project also works by opening `index.html` directly in a modern browser. Google Fonts are an optional visual enhancement; system font fallbacks are included.

## Features

- Phishing fundamentals, attack types, warning signs, social engineering techniques, case studies, and practical safety steps.
- Four interactive examples using fictional brands and reserved `.invalid` domains. The mock sign-in is non-interactive and never collects information.
- A 12-question, four-option quiz with immediate explanations, score feedback, retakes, and a locally saved high score.
- Module and simulation completion progress saved in browser `localStorage`.
- Certificate unlock logic and a print-specific certificate layout.
- Responsive navigation, keyboard focus styles, accessible labels and feedback, reduced-motion support, and no required third-party scripts.

## Privacy

Progress and quiz scores stay in the current browser's local storage. The project does not send data to a server, and it never requests real credentials. Clear this site's browser storage to reset progress.

## Sources and educational note

The Google/Facebook invoice-fraud and Target summaries distinguish documented incident details from the Microsoft 365 illustrative training scenario. The case-study cards link to a U.S. Department of Justice release and a U.S. Senate hearing record. This material is for awareness training, not incident response guidance; follow your organization’s security policies.
