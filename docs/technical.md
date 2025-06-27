# Technical Overview

## Technology Stack

### Core Technologies
- **[WXT](https://wxt.dev/)** - Modern Chrome extension framework
- **[React 18](https://react.dev/)** - UI library with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript with full IDE support
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager

### Styling & UI
- **[Panda CSS](https://panda-css.com/)** - Build-time CSS-in-JS with design tokens
- **Shadow DOM** - Isolated styling for content script overlay

### Development Tools
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter (replaces ESLint + Prettier)
- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)** - Debugging extension contexts
- **Hot Reload** - Instant updates during development via WXT

### Browser APIs
- **[Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)** - Persistent local data storage
- **[Chrome webRequest API](https://developer.chrome.com/docs/extensions/reference/webRequest/)** - HTTP request interception
- **[Chrome Runtime API](https://developer.chrome.com/docs/extensions/reference/runtime/)** - Extension lifecycle and messaging

### Architecture Patterns
- **Modular Providers** - Plugin-like system for AI services
- **Reactive Storage** - Event-driven data synchronization
- **Adaptive Calculations** - Dynamic impact based on request duration

## WXT Framework

This extension is built using **WXT**, a modern framework for Chrome extension development.

### What is WXT?
- **Modern tooling**: TypeScript, React, and modern build tools out of the box
- **Multi-browser support**: Generates manifests for Chrome (MV3) and Firefox (MV2)
- **Developer experience**: Hot reload, TypeScript checking, and optimized builds
- **Entry points**: Structured approach to background scripts, content scripts, and popups

### How We Use WXT

**Project Structure**:
```
src/entrypoints/
├── background/index.ts    # Service worker (auto-configured by WXT)
├── content/index.tsx      # Content script with React + Shadow DOM
└── popup/index.tsx        # Popup interface
```

**Automatic Configuration**:
- WXT generates Chrome manifest permissions from provider configurations
- Content scripts are automatically injected on provider hostnames
- Build outputs to `.output/chrome-mv3/` for Chrome and `.output/firefox-mv2/` for Firefox

**Development Workflow**:
```bash
bun dev      # Hot reload development mode
bun build    # Production build
```

## Request Interception

The extension uses Chrome's `webRequest` API to monitor HTTP requests to AI services.

### How it Works

1. **Startup**: Extension generates URLs to monitor from all providers
2. **Detection**: Background script listens for requests to AI endpoints  
3. **Filtering**: Only intercepts actual AI requests (excludes auth, static files)
4. **Tracking**: Records start time and request details

### Triple Interception

```typescript
// 1. Request starts
browser.webRequest.onBeforeRequest.addListener(handleStart);

// 2. Request completes  
browser.webRequest.onCompleted.addListener(handleComplete);

// 3. Request fails
browser.webRequest.onErrorOccurred.addListener(handleError); 
```

## Impact Calculations

### Fixed Impact
Simple: same impact for every request
```typescript
carbon: 3.2  // Always 3.2 gCO₂e per request
```

### Adaptive Impact  
Varies based on request duration
```typescript
carbon: { min: 2.5, max: 8.0 }  // 2.5-8.0 gCO₂e based on duration
```

### Calculation Process
1. **Duration**: `endTime - startTime`
2. **Thresholds**: Simple (< 2s) vs Complex (> 15s) requests
3. **Interpolation**: Linear between min/max values
4. **Result**: Calculated carbon and water impact

### Example
```
ChatGPT request:
- 1.5s duration → 2.5 gCO₂e (minimum)  
- 8.5s duration → 5.25 gCO₂e (interpolated)
- 20s duration → 8.0 gCO₂e (maximum)
```

## Data Storage

**Schema**
```typescript
// Daily data by date
carbonData_2024-12-19: {
    totalCarbon: 45.2,
    totalWater: 1200,
    requests: 12
}

// Global statistics  
globalStats: {
    requests: 156,
    carbon: 234.5,
    water: 6800
}
```

**Synchronization**
- Chrome Storage API for persistence
- Real-time sync across all browser tabs
- Automatic cleanup of old data

## Performance

**Optimizations**
- Lazy loading of provider configurations
- Efficient hostname-to-provider mapping cache
- Minimal impact on browser performance
- Smart request filtering to avoid false positives

**Memory Management**
- Automatic cleanup of expired request tracking
- Tab close/navigation cleanup
- Periodic maintenance to prevent memory leaks 