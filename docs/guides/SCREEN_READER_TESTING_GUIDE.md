# Screen Reader Testing Guide

## Overview

This guide provides instructions for testing the Kost Management Frontend with screen readers to ensure WCAG 2.1 AA compliance.

## Screen Readers to Test

### Windows

1. **NVDA (NonVisual Desktop Access)** - Free, open-source
   - Download: https://www.nvaccess.org/download/
   - Most popular free screen reader
   - Good for testing web applications

2. **JAWS (Job Access With Speech)** - Commercial
   - Download: https://www.freedomscientific.com/products/software/jaws/
   - Industry standard
   - 40-minute demo mode available

### macOS/iOS

3. **VoiceOver** - Built-in
   - macOS: System Preferences > Accessibility > VoiceOver
   - iOS: Settings > Accessibility > VoiceOver
   - Keyboard shortcut: Cmd + F5

### Testing Priority

1. **NVDA** (Primary) - Most accessible for testing
2. **VoiceOver** (Secondary) - Built-in on Mac/iOS
3. **JAWS** (Optional) - If available

## Basic Screen Reader Commands

### NVDA (Windows)

| Action                 | Command             |
| ---------------------- | ------------------- |
| Start/Stop NVDA        | Ctrl + Alt + N      |
| Read next item         | Down Arrow          |
| Read previous item     | Up Arrow            |
| Read current line      | NVDA + Up Arrow     |
| Read all from cursor   | NVDA + Down Arrow   |
| Navigate by heading    | H                   |
| Navigate by link       | K                   |
| Navigate by button     | B                   |
| Navigate by form field | F                   |
| Navigate by landmark   | D                   |
| List all headings      | NVDA + F7           |
| List all links         | NVDA + F7, then Tab |
| Stop reading           | Ctrl                |

### VoiceOver (macOS)

| Action                 | Command          |
| ---------------------- | ---------------- |
| Start/Stop VoiceOver   | Cmd + F5         |
| Read next item         | VO + Right Arrow |
| Read previous item     | VO + Left Arrow  |
| Read all from cursor   | VO + A           |
| Navigate by heading    | VO + Cmd + H     |
| Navigate by link       | VO + Cmd + L     |
| Navigate by button     | VO + Cmd + B     |
| Navigate by form field | VO + Cmd + J     |
| Open rotor             | VO + U           |
| Stop reading           | Ctrl             |

_VO = Ctrl + Option_

### JAWS (Windows)

| Action                 | Command             |
| ---------------------- | ------------------- |
| Read next item         | Down Arrow          |
| Read previous item     | Up Arrow            |
| Read current line      | Insert + Up Arrow   |
| Read all from cursor   | Insert + Down Arrow |
| Navigate by heading    | H                   |
| Navigate by link       | Tab                 |
| Navigate by button     | B                   |
| Navigate by form field | F                   |
| List all headings      | Insert + F6         |
| List all links         | Insert + F7         |
| Stop reading           | Ctrl                |

## Testing Checklist

### 1. Page Structure

- [ ] Page title is announced correctly
- [ ] Main landmark is identified
- [ ] Navigation landmark is identified
- [ ] Headings are in logical order (H1 → H2 → H3)
- [ ] Skip to main content link works
- [ ] Breadcrumbs are announced correctly

### 2. Navigation

- [ ] Sidebar navigation is accessible
- [ ] Current page is indicated (aria-current)
- [ ] Navigation items have clear labels
- [ ] Keyboard navigation works (Tab, Arrow keys)
- [ ] Mobile menu is accessible
- [ ] User menu is accessible

### 3. Forms

- [ ] Form labels are associated with inputs
- [ ] Required fields are announced
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] Field descriptions are read
- [ ] Validation errors are clear
- [ ] Submit buttons are labeled

### 4. Interactive Elements

- [ ] Buttons have clear labels
- [ ] Links have descriptive text
- [ ] Icons have aria-labels or sr-only text
- [ ] Dialogs/modals are announced
- [ ] Dialog close buttons are labeled
- [ ] Dropdown menus are accessible
- [ ] Tooltips are accessible

### 5. Data Tables

- [ ] Table headers are announced
- [ ] Table caption is present
- [ ] Row/column relationships are clear
- [ ] Sortable columns are indicated
- [ ] Pagination is accessible

### 6. Status Messages

- [ ] Success toasts are announced
- [ ] Error toasts are announced
- [ ] Loading states are announced
- [ ] Empty states are announced
- [ ] Status badges are announced

### 7. Search

- [ ] Search input is labeled
- [ ] Search results are announced
- [ ] Result count is announced
- [ ] Keyboard navigation works
- [ ] Selected result is indicated

### 8. Dynamic Content

- [ ] Live regions announce updates
- [ ] Loading spinners are announced
- [ ] Content changes are announced
- [ ] Optimistic updates are handled

## Test Scenarios

### Scenario 1: Login Flow

1. Navigate to login page
2. Verify page title is announced
3. Tab to username field
4. Verify field label is announced
5. Enter username
6. Tab to password field
7. Verify field label is announced
8. Enter password
9. Tab to submit button
10. Verify button label is announced
11. Press Enter to submit
12. Verify success/error message is announced

**Expected Announcements:**

- "Login page"
- "Username, edit text"
- "Password, edit text, password"
- "Login, button"
- "Login successful" or "Invalid credentials"

### Scenario 2: Room Management

1. Navigate to rooms page
2. Verify page heading is announced
3. Navigate through room list
4. Verify room status badges are announced
5. Tab to "Add Room" button
6. Verify button is announced
7. Activate button
8. Verify dialog is announced
9. Fill out form
10. Verify validation errors are announced
11. Submit form
12. Verify success message is announced

**Expected Announcements:**

- "Rooms, heading level 1"
- "Room 101, Available, button"
- "Add Room, button"
- "Create Room, dialog"
- "Room number, required, edit text"
- "Room created successfully"

### Scenario 3: Search Functionality

1. Press Ctrl+K to focus search
2. Verify search input is announced
3. Type search query
4. Verify results are announced
5. Navigate results with arrow keys
6. Verify selected result is announced
7. Press Enter to navigate
8. Verify new page is announced

**Expected Announcements:**

- "Global search, combobox, expanded"
- "Search results, listbox"
- "Room 101, Floor 1, Available, option, selected"
- "Room Details, heading level 1"

### Scenario 4: Form Validation

1. Navigate to create form
2. Tab through fields without filling
3. Verify required field errors are announced
4. Fill fields with invalid data
5. Verify validation errors are announced
6. Correct errors
7. Verify success indicators are announced
8. Submit form
9. Verify success message is announced

**Expected Announcements:**

- "Room number, required, edit text"
- "Room number is required, alert"
- "Rental price must be positive, alert"
- "Room number, valid"
- "Room created successfully"

## Common Issues and Fixes

### Issue 1: Icons Without Labels

**Problem**: Icon-only buttons are not announced.

**Fix**: Add `aria-label` or `sr-only` text.

```tsx
// Bad
<Button><TrashIcon /></Button>

// Good
<Button aria-label="Delete room">
  <TrashIcon aria-hidden="true" />
</Button>
```

### Issue 2: Status Changes Not Announced

**Problem**: Dynamic content changes are not announced.

**Fix**: Use `aria-live` regions.

```tsx
// Add live region
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Issue 3: Form Errors Not Associated

**Problem**: Error messages are not linked to form fields.

**Fix**: Use `aria-describedby`.

```tsx
<input
  id="roomNumber"
  aria-describedby="roomNumber-error"
  aria-invalid={!!error}
/>;
{
  error && (
    <span id="roomNumber-error" role="alert">
      {error.message}
    </span>
  );
}
```

### Issue 4: Modal Focus Not Trapped

**Problem**: Tab key escapes modal dialog.

**Fix**: Implement focus trap.

```tsx
// Use useFocusTrap hook
const dialogRef = useFocusTrap(isOpen);

<Dialog ref={dialogRef}>{/* Dialog content */}</Dialog>;
```

### Issue 5: Loading States Not Announced

**Problem**: Loading spinners are silent.

**Fix**: Add `role="status"` and screen reader text.

```tsx
<div role="status" aria-label="Loading">
  <Loader2 aria-hidden="true" />
  <span className="sr-only">Loading...</span>
</div>
```

## Automated Testing

While manual testing is essential, automated tools can catch many issues:

### Tools

1. **axe DevTools** - Browser extension
   - Chrome: https://chrome.google.com/webstore
   - Firefox: https://addons.mozilla.org/firefox

2. **Lighthouse** - Built into Chrome DevTools
   - Run: DevTools > Lighthouse > Accessibility

3. **WAVE** - Web accessibility evaluation tool
   - https://wave.webaim.org/extension/

### Running Automated Tests

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/react

# Run Lighthouse
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit
```

## Reporting Issues

When reporting accessibility issues, include:

1. **Screen reader used**: NVDA, JAWS, VoiceOver
2. **Browser**: Chrome, Firefox, Safari
3. **Page/component**: Where the issue occurs
4. **Expected behavior**: What should be announced
5. **Actual behavior**: What is actually announced
6. **Steps to reproduce**: How to trigger the issue
7. **Severity**: Critical, High, Medium, Low

### Example Issue Report

```
Title: Room status badge not announced

Screen Reader: NVDA 2023.1
Browser: Chrome 120
Page: /rooms

Expected: "Room 101, Available"
Actual: "Room 101"

Steps:
1. Navigate to rooms page
2. Tab to first room card
3. Listen to announcement

Severity: Medium

Fix: Add aria-label to Badge component
```

## Best Practices

1. **Test early and often**: Don't wait until the end
2. **Test with real users**: If possible, involve users with disabilities
3. **Test on multiple platforms**: Windows, macOS, mobile
4. **Test with keyboard only**: Ensure all functionality is accessible
5. **Test with different screen readers**: Each has quirks
6. **Document findings**: Keep track of issues and fixes
7. **Automate where possible**: Use tools to catch common issues

## Resources

- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [JAWS Documentation](https://www.freedomscientific.com/training/jaws/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Conclusion

Screen reader testing is essential for ensuring the application is accessible to all users. Follow this guide to systematically test all components and interactions. Remember that automated tools can catch many issues, but manual testing with actual screen readers is irreplaceable.
