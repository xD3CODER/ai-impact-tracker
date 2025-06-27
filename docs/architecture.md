# Architecture

## Overview

Chrome extension with 3 main components:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Background  │    │ Content     │    │ Popup       │
│ (Intercept) │    │ (Overlay)   │    │ (Stats)     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌────────▼────────┐
                  │ Chrome Storage  │
                  └─────────────────┘
```

## Entry Points

### Background Script (`src/entrypoints/background/index.ts`)
- **Purpose**: Intercepts HTTP requests to AI services
- **How**: Uses `chrome.webRequest` API
- **Process**: Detects AI requests → Calculates impact → Stores data

### Content Script (`src/entrypoints/content/index.tsx`)  
- **Purpose**: Shows real-time stats overlay on AI websites
- **How**: Shadow DOM React component
- **Triggers**: Automatically injected on AI service pages

### Popup (`src/entrypoints/popup/index.tsx`)
- **Purpose**: Main interface showing overall statistics
- **Access**: Click extension icon
- **Features**: Daily/global stats, equivalents, language toggle

## Data Flow

1. **Detection**: User makes AI request → Background script intercepts
2. **Calculation**: Duration + Provider metrics = Environmental impact
3. **Storage**: Data saved to Chrome Storage (synced across tabs)
4. **Display**: Overlay + Popup show updated statistics

## Key Systems

**Provider Registry**
- Auto-discovers all providers from `src/config/providers/`
- Generates Chrome permissions automatically
- Maps hostnames to providers for request detection

**Reactive Storage**
- Centralized data management with Chrome Storage
- Real-time synchronization between all tabs
- Automatic cleanup of expired data

**Adaptive Calculations**
- Impact varies based on request duration
- Short requests = minimum impact
- Long requests = maximum impact
- Linear interpolation between thresholds 