# Resume Filler

A browser extension that helps job seekers save their resume information once and reuse it to automatically fill common application forms across job portals and hiring websites.

## Overview

Resume Filler is a chromium-based extension designed to reduce the repetitive work of applying for jobs. Instead of manually re-entering the same details every time, users can store their personal and professional profile in the extension and quickly autofill matching form fields on supported websites.

This project includes a popup and side panel interface for managing saved data, making it easy to update contact details, work experience, education, skills, and other resume sections.

## Features

- Save resume profile data locally in the browser
- Edit personal information, experience, education, and skills
- Autofill common job application form fields
- Use a clean side panel for managing stored data
- Quick access from the browser toolbar and side panel

## Use Cases

- Apply to multiple jobs with the same core profile
- Reduce time spent filling repeated application forms
- Update resume data in one place without changing every application manually
- Maintain consistent information across employer portals

## Data Stored

Typical data stored by the extension may include:

- LinkedIn profile URL
- Portfolio or personal website
- Work experience
- Education history
- Skills and certifications

The data is intended to be stored locally in the browser so the user can reuse it for future applications.

## How It Works

1. Open the extension popup.
2. Autofill the current page or open side panel to directly get or update data.
3. The extension saves the profile to browser storage.

## Installation

For now, the extension is in development and is not published.

## Development

### Prerequisites

- Node.js
- TypeScript
- A Chromium-based browser such as Chrome or Edge

### Scripts

Install dependencies:

```bash
npm install
```

Compile TypeScript:

```bash
npx tsc
```

## Future Improvements

This extension can be extended with features such as:

- HTML-based text for forms that support it.
- Import resume data.