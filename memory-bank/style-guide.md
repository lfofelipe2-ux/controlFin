# STYLE GUIDE - ControlFin Project

## Design System Overview

**Base Design**: BlockAI Admin Crypto Trading Dashboard  
**Theme**: Dark Mode (Primary)  
**Target**: Financial Management Dashboard  
**Platform**: Web Application (PWA)

## Color Palette

### Primary Colors
- **Background Primary**: `#2d3561` - Main background color
- **Background Sidebar**: `#1f2347` - Sidebar and navigation
- **Background Card**: `#363d65` - Cards, containers, inputs
- **Background Hover**: `#3d4570` - Hover states

### Text Colors
- **Text Primary**: `#ffffff` - Main text, headings
- **Text Secondary**: `#a0a4b8` - Secondary text, descriptions
- **Text Disabled**: `#6b7280` - Disabled states

### Accent Colors
- **Accent Primary**: `#00d9ff` - Primary actions, links, highlights
- **Accent Secondary**: `#2196f3` - Secondary actions, accents
- **Accent Gradient**: `linear-gradient(135deg, #00d9ff 0%, #2196f3 100%)`

### Semantic Colors
- **Success**: `#00ff88` - Success states, positive values
- **Warning**: `#ffaa00` - Warning states, alerts
- **Error**: `#ff3366` - Error states, negative values
- **Info**: `#2196f3` - Information states

### Border & Shadow Colors
- **Border**: `rgba(255, 255, 255, 0.08)` - Subtle borders
- **Border Hover**: `rgba(0, 217, 255, 0.3)` - Interactive borders
- **Shadow**: `rgba(0, 0, 0, 0.2)` - Card shadows

## Typography

### Font Family
- **Primary**: Inter, Poppins, or Roboto (sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Weights
- **Light (300)**: Secondary text, descriptions
- **Regular (400)**: Body text, labels
- **Semibold (600)**: Headings, important labels

### Font Sizes
- **H1**: 32px (2rem) - Page titles
- **H2**: 24px (1.5rem) - Section titles
- **H3**: 20px (1.25rem) - Subsection titles
- **Body**: 16px (1rem) - Main content
- **Small**: 14px (0.875rem) - Secondary content
- **Caption**: 12px (0.75rem) - Helper text

## Spacing System

**Base Unit**: 8px
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

## Component Styles

### Buttons
- **Primary**: Background `#00d9ff`, text white, rounded corners
- **Secondary**: Background `#363d65`, text white, border `#00d9ff`
- **Danger**: Background `#ff3366`, text white
- **Ghost**: Transparent background, text `#00d9ff`, border `#00d9ff`

### Inputs
- **Background**: `#363d65`
- **Border**: `rgba(255, 255, 255, 0.08)`
- **Focus Border**: `#00d9ff`
- **Placeholder**: `#a0a4b8`

### Cards
- **Background**: `#363d65`
- **Border**: `rgba(255, 255, 255, 0.08)`
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.2)`
- **Border Radius**: 8px

### Tables
- **Header Background**: `#1f2347`
- **Row Background**: `#363d65`
- **Hover Background**: `#3d4570`
- **Border**: `rgba(255, 255, 255, 0.08)`

## Layout Principles

### Grid System
- **Container**: Max-width 1200px, centered
- **Sidebar**: 240px width, fixed
- **Content**: Flexible width, responsive

### Glassmorphism
- **Backdrop Blur**: 10px
- **Background**: `rgba(54, 61, 101, 0.8)`
- **Border**: `rgba(255, 255, 255, 0.1)`

## Iconography

### Icon Library
- **Primary**: Ant Design Icons (outline style)
- **Style**: Monochromatic, adaptive colors
- **Size**: 16px, 20px, 24px

### Financial Icons
- **Income**: TrendingUp, DollarCircle
- **Expense**: TrendingDown, ShoppingCart
- **Transfer**: SwapOutlined, ArrowRightLeft
- **Categories**: Custom category icons

## Animation & Transitions

### Duration
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms

### Easing
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)`

### Hover Effects
- **Scale**: `transform: scale(1.02)`
- **Glow**: `box-shadow: 0 0 20px rgba(0, 217, 255, 0.3)`

## Accessibility

### Contrast Ratios
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **UI Components**: 3:1 minimum

### Focus States
- **Outline**: 2px solid `#00d9ff`
- **Offset**: 2px from element

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Usage Guidelines

### Do's
- Use the defined color palette consistently
- Maintain 8px spacing grid
- Apply glassmorphism sparingly for overlays
- Use semantic colors for status indicators
- Follow the typography hierarchy

### Don'ts
- Don't use colors outside the defined palette
- Don't break the spacing grid
- Don't overuse glassmorphism effects
- Don't use low contrast color combinations
- Don't mix different font families

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --bg-primary: #2d3561;
  --bg-sidebar: #1f2347;
  --bg-card: #363d65;
  --text-primary: #ffffff;
  --text-secondary: #a0a4b8;
  --accent-primary: #00d9ff;
  --accent-secondary: #2196f3;
  --success: #00ff88;
  --warning: #ffaa00;
  --error: #ff3366;
}
```

### Tailwind CSS Classes
- Use custom color classes: `bg-primary`, `text-secondary`, `border-accent`
- Apply spacing classes: `p-4`, `m-2`, `space-y-4`
- Use responsive prefixes: `md:grid-cols-2`, `lg:flex`

This style guide serves as the single source of truth for all UI/UX design decisions in the ControlFin project.
