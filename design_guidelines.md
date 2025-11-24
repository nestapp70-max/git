# LabourConnect Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Indian marketplace leaders like Zomato, Swiggy, Ola, and Uber with specific optimization for low-end Indian smartphones and multilingual users.

## Core Design Principles
- **Mobile-First**: Design for 320px screens first, scale up to 1920px desktop
- **Performance-First**: Fast-loading, lightweight for low-end smartphones (2G/3G networks)
- **Accessibility-First**: Keyboard navigation, ARIA labels, large touch targets
- **Voice-First**: Prominent voice command interface for hands-free operation
- **Multilingual-First**: Hindi/English toggle with regional language support

## Color System
- **Primary Background**: Dark matte (#07121a to #061019 gradient)
- **Panel/Card Background**: #0f1724 with glass morphism overlays
- **Primary Accent**: WhatsApp green (#06b39a) for CTAs, success states
- **Secondary Accent**: Bright blue (#03a4f3) for links, info states
- **Text Primary**: #e6eef2 (light gray-blue)
- **Text Muted**: #94a3b8 (medium gray)
- **Glass Effects**: rgba(255,255,255,0.01-0.03) for depth

## Typography
- **Font Family**: Inter, system-ui, -apple-system (web-safe fallback stack)
- **Hierarchy**:
  - H1: 16px, weight 700 (compact header)
  - H2: 20px, weight 700 (section headers)
  - H3/H4: 14-16px, weight 600
  - Body: 14px, line-height 1.4
  - Small/Muted: 13px
- **Readability**: High contrast, large enough for low-resolution screens

## Layout System
- **Container Max-Width**: 1180px
- **Spacing Scale**: Use 6px, 8px, 12px, 14px, 18px, 20px, 28px units
- **Page Padding**: 18px horizontal, 40px bottom
- **Card/Panel Gaps**: 18px between major sections
- **Border Radius**: 10-12px standard, 8px for smaller elements

## Component Library

### Navigation
- **Sticky Header**: Top 8px offset, glass background with border
- **Logo**: 46px gradient square with initials, bold weight
- **Nav Links**: Horizontal on desktop, 13px text, stacked on mobile <560px
- **Actions**: "Quick Login" (outline) + "Post Job" (gradient fill)

### Hero Section
- **Layout**: Two-column on desktop (text left, image right 360px)
- **Image**: Use hero image (800x600) - service workers, technicians in action
- **Collapse**: Single column on mobile, hide image <980px
- **Search Card**: Integrated PIN/city + service dropdown + Find button
- **Stats**: Quick stats row (120+ Towns, 8k+ Jobs, 4.9 Rating)

### Services Slider
- **Position**: Below hero section
- **Items**: Horizontal scrollable, 88-92px min-width cards
- **Style**: Semi-transparent background, 28px icons, centered text
- **Active State**: Border accent color, slight scale up (1.03)
- **Icons**: Use placeholder paths (icons/cleaner.svg format)

### Technician Cards
- **Avatar**: 56px gradient circle with initials, bold
- **Layout**: Horizontal flexbox (avatar + details)
- **Chips**: Skills/experience as small rounded tags
- **Background**: Subtle glass effect with border
- **Spacing**: 12px padding, 12px bottom margin

### Job Cards
- **Price Tag**: Accent background (rgba), prominent placement
- **Bid Button**: Gradient blue-to-cyan, bold text
- **Spacing**: 12px padding, 12px gaps

### Wallet/Recharge Elements
- **Balance Display**: Large, prominent numbers
- **Recharge Options**: ₹100, ₹200, ₹500 as touch-friendly buttons
- **Transaction History**: List view with icons and amounts
- **Chat Unlock Prompt**: Friendly popup with ₹10 deduction info

### Forms & Inputs
- **Touch Targets**: Minimum 44px height for buttons
- **Input Fields**: 10px padding, subtle border, transparent background
- **Buttons**: 
  - Primary: Gradient (green-to-blue), no border, bold text
  - Secondary: Transparent with border, muted text
  - Large: 12px padding, highly contrastive

### Footer
- **Layout**: 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- **Sections**: Company, Services, Support, Connect
- **Links**: Muted color, 6px spacing between items
- **Copyright**: Centered, 13px, muted

## Voice & Multilingual Interface
- **Voice Button**: Microphone icon, prominent in search area
- **Language Toggle**: Hindi/English switcher in header
- **Voice Indicators**: Visual feedback when listening/processing
- **Translation**: Real-time UI text translation for all labels

## Responsive Breakpoints
- **Mobile**: <560px - Stack all columns, expand header
- **Tablet**: 560-980px - Two columns, simplified nav
- **Desktop**: >980px - Full layout with all features

## Images
### Hero Image
- **Location**: Right side of hero section (360px width on desktop)
- **Content**: Indian technicians at work, service vehicles, or technician-customer interaction
- **Treatment**: Rounded corners (10px), full coverage
- **Mobile**: Hidden on screens <980px

### Service Category Icons
- **Format**: SVG icons, 28x28px
- **Style**: Simple line icons or filled
- **Placeholder Paths**: icons/cleaner.svg, icons/handyman.svg, etc.
- **Categories**: 100+ labour categories (construction, industrial, agricultural, household, transportation, etc.)

## Accessibility
- **Focus States**: 3px outline with accent color, 2px offset
- **ARIA Labels**: All interactive elements, live regions for dynamic content
- **Keyboard Nav**: Tab order, Enter/Space activation
- **Screen Reader**: Descriptive labels for icons and buttons

## Interaction Patterns
- **No Page Reloads**: All interactions inline with AJAX
- **Instant Feedback**: Loading states, success/error messages
- **Offline Indicators**: Clear messaging when offline
- **Touch-Friendly**: 44px minimum tap targets, no hover dependencies
- **Animation**: Minimal - only for feedback (button press, card selection)

## Performance Constraints
- **Lightweight JS**: Vanilla JS only, no heavy frameworks
- **Image Optimization**: Compressed, lazy-loaded
- **Font Loading**: System font fallbacks, minimal web fonts
- **Caching**: PWA-ready, cache previous searches
- **Network**: Optimized for 2G/3G Indian mobile networks