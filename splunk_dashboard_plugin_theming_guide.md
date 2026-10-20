# Splunk Automated Dashboard JSON Generation Plugin: Theming Guide & Prompt

This document contains the complete engineering requirements, Copilot integration prompt, and technical specifications for implementing the **Light**, **Dark**, and **High Contrast** theme system in the Splunk Dashboard Generator VS Code Extension Webview.

---

## 1. Copilot Injection Prompt

Copy and paste the text below into your AI assistant or Copilot chat to generate the code.

```text
Role: Senior Frontend UI/UX Engineer

Objective: Implement a comprehensive, dynamic theming system for the Splunk Automated Dashboard JSON generation plugin (VS Code Extension Webview).

Requirements:
Create three distinct themes: Light, Dark, and High Contrast. These themes must be applied globally across all screens (Welcome/Dashboard Hub, Parameter Catalog, Log Analysis, Generate & Preview, Instrumentation Gaps).

Technical Specifications:
1. Theming Strategy: Use CSS Variables (Custom Properties) defined at the :root level to manage all colors, borders, shadows, and font weights. The application must dynamically switch the root variables based on the active theme class.
2. Color Palette (SCSS/CSS Variables): Define the following variable groups for each theme. All colors must meet WCAG 2.0 AA accessibility standards (AAA for High Contrast).
    - `--bg-primary`: Main background.
    - `--bg-secondary`: Card/Panel background.
    - `--bg-tertiary`: Sub-panel/Table header background.
    - `--text-primary`: Main body text.
    - `--text-secondary`: Sub-text/Metadata text.
    - `--accent-primary`: Main interactive elements (Buttons, Links, Checkboxes, Progress steps).
    - `--accent-hover`: Interaction state color.
    - `--border-color`: Separators and card borders.
    - `--error-color`: Error text/icons.
    - `--warning-color`: Warning text/icons.
    - `--success-color`: Success/Active state color.
    - `--code-bg`: Background for JSON editor blocks.
    - `--code-text`: Text color for JSON editor blocks.

3. Theme Specifics:
    - Light Theme: Clean, professional. Use pure white or light gray `--bg-primary`, subtle `--border-color`, and Splunk-inspired deep teal `--accent-primary`.
    - Dark Theme: Sophisticated, low-light "Dark Observability" mode. Use dark charcoal `--bg-primary`, lighter gray `--bg-secondary`, and glowing cyan/mint green `--accent-primary`.
    - High Contrast: Maximum accessibility. Pure black `--bg-primary`, pure white `--text-primary`, bold high-saturation primary blue (`#0033CC`) for `--accent-primary`. Thick, high-contrast borders. Remove all gradients and shadows.

4. Implementation:
    - Create a `ThemeContext` (React) or global state manager.
    - Apply the active theme class (`theme-light`, `theme-dark`, `theme-hc`) to the `<body>` or root `<div>`.
    - Ensure all UI components (Cards, Parameter buttons, Log Tables) use CSS variables exclusively.

Deliverable:
Provide the complete CSS/SCSS variable files for all three themes and the wrapper component (`ThemeManager.tsx`) to handle state and class switching.
```

---

## 2. Technical Explanation: How the Themes Work

Instead of hardcoding colors inside React components (e.g., `style={{ color: "#ffffff" }}`), we use **CSS Variables (Custom Properties)**.

### CSS Variables Architecture (`styles.css`)
```css
/* Light Theme (Default) */
body.theme-light {
    --bg-primary: #F8F9FA;
    --bg-secondary: #FFFFFF;
    --bg-tertiary: #E9ECEF;
    --text-primary: #212529;
    --text-secondary: #6C757D;
    --accent-primary: #007A69;
    --accent-hover: #005F53;
    --border-color: #CED4DA;
    --error-color: #D93838;
    --success-color: #198754;
}

/* Dark Observability Theme */
body.theme-dark {
    --bg-primary: #121619;
    --bg-secondary: #1E242B;
    --bg-tertiary: #2A323D;
    --text-primary: #F1F3F5;
    --text-secondary: #ADB5BD;
    --accent-primary: #00E6B8;
    --accent-hover: #00C49F;
    --border-color: #343A40;
    --error-color: #FF6B6B;
    --success-color: #51CF66;
}

/* High Contrast Accessibility Theme */
body.theme-hc {
    --bg-primary: #000000;
    --bg-secondary: #000000;
    --bg-tertiary: #1A1A1A;
    --text-primary: #FFFFFF;
    --text-secondary: #FFFF00;
    --accent-primary: #0055FF;
    --accent-hover: #0033CC;
    --border-color: #FFFFFF;
    --error-color: #FF0000;
    --success-color: #00FF00;
}
```

### Component Usage Example
```tsx
const Card = ({ title, children }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      padding: '16px',
      borderRadius: '8px'
    }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};
```

When a user switches themes, the React state changes the `<body>` className. The browser instantly repaints every element referencing `var(--bg-secondary)` or `var(--border-color)` without reloading the webview.

---

## 3. What is the Use? (Business & Technical Value)

1. **User Productivity & Comfort:** The **Dark Theme** reduces eye strain during late-night development and debugging sessions, which is standard for enterprise developer tools.
2. **Regulatory Compliance (Accessibility):** The **High Contrast Theme** fulfills WCAG AAA requirements and enterprise compliance mandates (Section 508) for developers with low vision or color perception differences.
3. **Professional Polish:** Providing native-feeling theme integration into VS Code makes your Splunk Dashboard plugin look production-grade and cohesive with the user's workspace environment.