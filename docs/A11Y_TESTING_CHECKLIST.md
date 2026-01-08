# Accessibility Testing Checklist

## Quick Reference for Manual A11Y Testing

### 1. Keyboard Navigation Testing

#### Tab Order
- [ ] Press `Tab` to move forward through interactive elements
- [ ] Press `Shift+Tab` to move backward
- [ ] Verify focus order is logical (left-to-right, top-to-bottom)
- [ ] Check that all interactive elements receive focus

#### Activation
- [ ] Press `Enter` on buttons and links
- [ ] Press `Space` on buttons
- [ ] Verify both keys activate the element

#### Escape Key
- [ ] Press `Escape` to close modals/dialogs
- [ ] Press `Escape` to cancel operations
- [ ] Verify it returns focus to triggering element

#### Arrow Keys
- [ ] Use arrow keys in skill grids
- [ ] Use arrow keys in build lists
- [ ] Verify navigation wraps (optional) or stops at edges

---

### 2. Screen Reader Testing

#### NVDA (Windows)
1. Open NVDA (Ctrl+Alt+N)
2. Navigate using:
   - `H` - Headings
   - `B` - Buttons
   - `L` - Lists
   - `F` - Form fields
   - `I` - Images
3. Verify all elements are announced correctly

#### VoiceOver (Mac)
1. Open VoiceOver (Cmd+F5)
2. Navigate using:
   - `VO+Left/Right` - Navigate elements
   - `VO+H` - Headings
   - `VO+Cmd+H` - Headings nav
3. Check rotor for landmarks and headings

#### Common Checks
- [ ] All images have alt text
- [ ] Buttons are labeled correctly
- [ ] Form fields have associated labels
- [ ] Dynamic content changes are announced
- [ ] Error messages are announced

---

### 3. Visual Accessibility

#### Color Contrast
- [ ] Check text contrast ratio (minimum 4.5:1 for normal text)
- [ ] Check large text contrast (minimum 3:1 for 18pt+)
- [ ] Verify interactive elements have sufficient contrast
- [ ] Test focus indicators are visible

#### Focus Indicators
- [ ] Tab through page and verify focus is visible
- [ ] Check focus indicator has 2px+ contrast
- [ ] Verify focus indicator is visible on all backgrounds

#### Text Sizing
- [ ] Zoom to 200% and verify layout works
- [ ] Check no horizontal scrolling at 320px width
- [ ] Verify text is still readable at maximum zoom

---

### 4. Component-Specific Tests

#### Skill Cards
- [ ] Can select with keyboard (Enter/Space)
- [ ] Selection state is announced
- [ ] Level changes are announced
- [ ] Locked state is announced
- [ ] Can navigate with arrow keys

#### Buttons
- [ ] All icon-only buttons have aria-label
- [ ] Navigation buttons show current page (aria-current)
- [ ] Toggle buttons show state (aria-pressed)
- [ ] Disabled buttons are announced as disabled

#### Forms
- [ ] All inputs have labels
- [ ] Required fields are indicated
- [ ] Error messages are associated with inputs
- [ ] Success/error states are announced

#### Loading States
- [ ] Loading spinner is announced
- [ ] Loading message is clear
- [ ] Completion is announced
- [ ] aria-busy is used correctly

---

### 5. Automated Testing

#### Lighthouse
```bash
npm run lighthouse -- --view
```
- [ ] Accessibility score > 90
- [ ] No manual testing required items

#### axe DevTools
- [ ] Install axe DevTools extension
- [ ] Run full page scan
- [ ] Fix all critical and serious issues
- [ ] Review moderate issues

---

### 6. Mobile Accessibility

#### Touch Targets
- [ ] All buttons are at least 44x44px
- [ ] Touch targets are spaced appropriately
- [ ] No accidental activations

#### Orientation
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Verify content is accessible in both

#### Zoom
- [ ] Test with 200% zoom
- [ ] Verify no horizontal scrolling
- [ ] Check all functionality works

---

### 7. Browser Compatibility

#### Screen Readers × Browsers
| Screen Reader | Browser | Status |
|---------------|---------|--------|
| NVDA | Chrome | [ ] |
| NVDA | Firefox | [ ] |
| NVDA | Edge | [ ] |
| VoiceOver | Safari | [ ] |

---

## Quick Test Commands

### Run Accessibility Audit
```bash
# Lighthouse
npx lighthouse http://localhost:3000 --view

# Pa11y (if installed)
npx pa11y http://localhost:3000

# axe-core (if integrated)
npm run test:a11y
```

### Manual Test Sequence
1. Open page
2. Turn on screen reader
3. Put mouse away
4. Navigate using only keyboard
5. Complete key user flows
6. Document any issues

---

## Common Issues Found

### High Priority
1. Missing alt text on images
2. Keyboard trap (can't exit with Esc)
3. Missing form labels
4. No focus management in modals

### Medium Priority
1. Poor color contrast
2. No skip links
3. Heading hierarchy issues
4. Missing ARIA labels on icon buttons

### Low Priority
1. Live region timing issues
2. Redundant alt text
3. Over-descriptive link text

---

## Reporting Issues

When documenting accessibility issues, include:
1. **Component name**
2. **Issue description**
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screen reader + browser** (if applicable)
7. **WCAG success criterion** violated

Example:
```
## Issue: Like Button Not Announced

**Component:** LikeButton
**Impact:** Screen reader users can't hear like count

**Steps:**
1. Navigate to build page
2. Find like button
3. Activate with Enter

**Expected:** "Like build. 5 likes" or "Unlike build. 5 likes"
**Actual:** Only "Button" announced

**WCAG:** 2.4.6 Headings and Labels (Level AA)
```
