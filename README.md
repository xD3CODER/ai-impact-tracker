<p align="center">
  <img src="https://github.com/user-attachments/assets/e8d5d808-1e39-404a-b7f8-dea672189a84" height="80">
</p>

# AI Impact Tracker
A web extension that tracks the environmental impact of AI services using a modular provider system.

[![Chrome Web Store](https://github.com/user-attachments/assets/059b818c-ee49-4aff-9e8d-c1f8368dc649)](https://chromewebstore.google.com/detail/ia-impact-tracker/oflmfafohnjcohcalmfjkimpnbkdkpnf)
[![Firefox Addon](https://github.com/user-attachments/assets/7f9ae106-bb81-4dcc-befd-158e84d71107)](https://addons.mozilla.org/fr/firefox/addon/ai-impact-tracker/)

## Overview

This extension monitors AI service usage and calculates carbon and water impact in real-time using adaptive calculations based on request duration.

<img src="https://github.com/user-attachments/assets/9b9bf4ab-0787-4fbb-9372-e5766124e7dc" height="150">

## Currently supported AI providers
- Claude https://claude.ai/
- ChatGPT https://chatgpt.com/

## Key Concepts

- **[Providers](./docs/providers.md)** - Modular configurations for different AI services
- **[Architecture](./docs/architecture.md)** - Extension structure and entry points  
- **[Technical Overview](./docs/technical.md)** - Request interception and calculations
- **[Equivalences](./docs/equivalences.md)** - User-friendly impact comparisons system

## Quick Start (Development)

1. **Install dependencies**: `bun install`
2. **Start development mode**: `bun dev`
3. **Automatic browser launch**: A browser will open automatically with the extension installed
4. **Hot reload**: Code changes are automatically reloaded in the extension

## Adding a New AI Service

Create a provider configuration in `src/config/providers/yourservice.ts` and the extension will automatically detect and support it.

See [Providers](./docs/providers.md) for details.

## Roadmap & Future Enhancements

- **Monthly reports**: Automated monthly carbon/water impact summaries
- **Goal setting**: Personal carbon reduction targets with progress tracking
- **More providers**: Support for emerging AI services and APIs
- **Model-specific tracking**: Different impact calculations per AI model
