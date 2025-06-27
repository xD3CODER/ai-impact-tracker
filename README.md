# AI Carbon Tracker
A Chrome extension that tracks the environmental impact of AI services using a modular provider system.

<img src="https://github.com/user-attachments/assets/9b9bf4ab-0787-4fbb-9372-e5766124e7dc" height="150">


## Overview

This extension monitors AI service usage and calculates carbon and water impact in real-time using adaptive calculations based on request duration.

## Key Concepts

- **[Providers](./docs/providers.md)** - Modular configurations for different AI services
- **[Architecture](./docs/architecture.md)** - Extension structure and entry points  
- **[Technical Overview](./docs/technical.md)** - Request interception and calculations
- **[Equivalences](./docs/equivalences.md)** - User-friendly impact comparisons system

## Quick Start

1. **Development**: `bun dev`
2. **Build**: `bun build`
3. **Load**: Chrome Extensions → Load unpacked → `.output/chrome-mv3/` folder

## Adding a New AI Service

Create a provider configuration in `src/config/providers/yourservice.ts` and the extension will automatically detect and support it.

See [Providers](./docs/providers.md) for details.
