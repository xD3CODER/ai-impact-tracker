# Providers

## What is a Provider?

A provider defines how the extension detects and calculates environmental impact for a specific AI service.

## Provider Structure

```typescript
interface Provider {
    id: string;                        // Unique identifier
    name: string;                      // Display name
    hostnames: string[];               // Websites to monitor
    endpoints: string[];               // API endpoints to intercept
    metrics: {
        carbon: ImpactValue;           // Carbon impact per request
        water: ImpactValue;            // Water impact per request  
        durationThresholds?: {         // Thresholds for adaptive calculations
            simple: number;            // Threshold for simple requests (seconds)
            complex: number;           // Threshold for complex requests (seconds)
        };
        sources: string[];             // Data sources for metrics
    };
    config?: {                         // Optional configuration
        timeout?: number;              // Request timeout in milliseconds
        filtering?: {                  // Request filtering options
            methods?: string[];        // Allowed HTTP methods
            excludeEndpoints?: string[]; // Endpoints to exclude
            includeOnly?: string[];    // Only include these endpoints
            useRegex?: boolean;        // Enable regex support
        };
    };
}
```

## Core Properties

### `id` (required)
**Purpose**: Unique identifier for the provider  
**Type**: `string`  
**Example**: `"chatgpt"`, `"claude"`  
**Usage**: Used for storage keys and internal references

### `name` (required)  
**Purpose**: Human-readable display name  
**Type**: `string`  
**Example**: `"ChatGPT"`, `"Claude AI"`  
**Usage**: Shown in popup interface and logs

### `hostnames` (required)
**Purpose**: List of websites where this provider is active  
**Type**: `string[]`  
**Example**: `["chatgpt.com", "chat.openai.com"]`  
**Usage**: Extension auto-injects content scripts and monitors these domains

### `endpoints` (required)
**Purpose**: API endpoints to intercept for this service  
**Type**: `string[]`  
**Example**: `["/conversation", "/backend-api/conversation"]`  
**Usage**: Only requests matching these patterns are tracked

## Metrics Configuration

### `metrics.carbon` (required)
**Purpose**: Carbon footprint per request  
**Type**: `number | AdaptiveImpact`  
**Units**: gCO₂e (grams of CO₂ equivalent)

**Fixed Impact**:
```typescript
carbon: 3.2  // Always 3.2 gCO₂e per request
```

**Adaptive Impact**:
```typescript
carbon: { min: 2.5, max: 8.0 }  // 2.5-8.0 gCO₂e based on duration
```

### `metrics.water` (required)
**Purpose**: Water consumption per request  
**Type**: `number | AdaptiveImpact`  
**Units**: ml (milliliters)

**Fixed Impact**:
```typescript
water: 85  // Always 85ml per request
```

**Adaptive Impact**:
```typescript
water: { min: 60, max: 180 }  // 60-180ml based on duration
```

### `metrics.durationThresholds` (optional)
**Purpose**: Define thresholds for adaptive impact calculations  
**Type**: `DurationThresholds`  
**Required when**: Using adaptive impact values

```typescript
durationThresholds: {
    simple: 2,    // Requests < 2s use minimum impact
    complex: 15   // Requests > 15s use maximum impact
}
// Requests between 2-15s are interpolated linearly
```

### `metrics.sources` (required)
**Purpose**: References for impact data  
**Type**: `string[]`  
**Example**: `["OpenAI Documentation 2024", "UC Berkeley Study"]`  
**Usage**: Provides transparency on data sources

## Optional Configuration

### `config.timeout`
**Purpose**: Cleanup timeout for stuck requests  
**Type**: `number`  
**Units**: milliseconds  
**Default**: 30000 (30 seconds)  
**Example**: `timeout: 60000` // 1 minute

### `config.filtering.methods`
**Purpose**: Only intercept specific HTTP methods  
**Type**: `string[]`  
**Default**: All methods allowed  
**Example**: `methods: ["POST", "PUT"]`  
**Common values**: `["POST"]` for API calls, `["GET", "POST"]` for broader capture

### `config.filtering.excludeEndpoints`
**Purpose**: Skip certain endpoints even if they match  
**Type**: `string[]`  
**Example**:
```typescript
excludeEndpoints: [
    "/api/auth",           // Skip authentication
    "/health",             // Skip health checks  
    "\\.(js|css|png)$"     // Skip static files (regex)
]
```

### `config.filtering.includeOnly`
**Purpose**: Only intercept these specific endpoints  
**Type**: `string[]`  
**Behavior**: If specified, overrides the main `endpoints` list  
**Example**: `includeOnly: ["/api/chat/completions"]`

### `config.filtering.useRegex`
**Purpose**: Enable regular expression support in endpoint patterns  
**Type**: `boolean`  
**Default**: `false`  
**Example**: `useRegex: true` allows patterns like `/conversation$` (end of string)

## Complete Example

```typescript
import { registerProvider } from "@/utils/providers/registry";

registerProvider({
    // Core identification
    id: "example-ai",
    name: "Example AI Service",
    hostnames: ["example.ai", "api.example.com"],
    
    // Request detection
    endpoints: ["/api/v1/chat", "/generate$"],
    
    // Environmental impact
    metrics: {
        carbon: { min: 1.8, max: 6.5 },    // Adaptive carbon impact
        water: { min: 45, max: 150 },      // Adaptive water impact
        durationThresholds: {
            simple: 3,    // < 3s = simple request
            complex: 20   // > 20s = complex request  
        },
        sources: [
            "Example AI Documentation 2024",
            "Energy Efficiency Study - MIT"
        ]
    },
    
    // Optional fine-tuning
    config: {
        timeout: 45000,  // 45 second timeout
        filtering: {
            methods: ["POST"],                    // Only POST requests
            useRegex: true,                       // Enable regex in endpoints
            excludeEndpoints: [
                "/api/auth",                      // Skip auth endpoints
                "/api/health",                    // Skip health checks
                "/api/analytics",                 // Skip analytics
                "\\.(js|css|png|jpg|svg)$"       // Skip static resources
            ]
        }
    }
});
```

## Current Providers

**ChatGPT**
- Sites: `chatgpt.com`, `chat.openai.com`
- Impact: 2.5-8.0 gCO₂e, 60-180ml water (adaptive)
- Thresholds: Simple < 2s, Complex > 15s

**Claude**  
- Sites: `claude.ai`
- Impact: 1.8-6.5 gCO₂e, 45-150ml water (adaptive)
- Thresholds: Simple < 3s, Complex > 20s

## Adding a New Provider

1. Create `src/config/providers/yourservice.ts`
2. Export in `src/config/providers/index.ts`
3. Rebuild extension

The extension automatically generates Chrome permissions and content script matches from all configured providers. 