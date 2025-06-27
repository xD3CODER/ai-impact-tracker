# Equivalences System

## Overview

The extension shows users relatable comparisons for their AI usage impact through **equivalences** - converting abstract carbon/water numbers into everyday activities.

## How Equivalences Work

### Automatic Selection
The system automatically selects appropriate equivalences based on impact levels:

### Random Display (Hourly)
To keep the interface fresh, equivalences are randomly selected but **remain consistent within each hour**:

```typescript
// Same user sees the same equivalence for the whole hour
const randomIndex = getHourlyRandomIndex(equivalenceCount);
```

**Example**: 
- At 14:30 → "stream one song" 
- At 14:45 → still "stream one song"
- At 15:05 → changes to "charge your phone 1%"

## File Structure

### Locale Files
```
src/locales/
├── en.json    # English equivalences
└── fr.json    # French equivalences
```

### Equivalence Format
```json
{
  "equivalencesCarbon": {
    "2": [
      "send a plain email",
      "stream one song", 
      "use a standard bulb for 2 minutes",
      "charge your phone 1%",
      "run a desk fan for 1 minute"
    ]
  },
  "equivalencesWater": {
    "2": [
      "rinse a knife",
      "wash an apple",
      "water a potted plant", 
      "clean your hands briefly",
      "wet a washcloth corner"
    ]
  }
}
```

## Adding New Equivalences

### 1. Choose the Right Threshold
Determine which impact level your equivalence represents:
- **0-1 gCO₂e**: Very light activities (LED bulb, SMS)
- **2-8 gCO₂e**: Light activities (email, streaming)  
- **15-100 gCO₂e**: Medium activities (video calls, charging devices)
- **500+ gCO₂e**: Heavy activities (driving, appliances)

### 2. Add to Both Languages
Always add equivalences to **both** `en.json` and `fr.json`:

**English** (`src/locales/en.json`):
```json
"equivalencesCarbon": {
  "4": [ // treshold
    "send an email with a photo",
    "watch a 30-second video",
    "use the microwave for 15 seconds",
    "charge your phone 2%",
    "run a laptop for 1 minute",
    "NEW: your new equivalence here"
  ]
}
```

**French** (`src/locales/fr.json`):
```json
"equivalencesCarbon": {
  "4": [
    "envoyer un email avec une photo",
    "regarder une vidéo de 30 secondes", 
    "utiliser le micro-ondes pendant 15 secondes",
    "charger votre téléphone de 2%",
    "faire fonctionner un ordinateur portable pendant 1 minute",
    "NOUVEAU: votre nouvelle équivalence ici"
  ]
}
```

### 3. Guidelines for Good Equivalences

**✅ Good Equivalences**:
- Relatable everyday activities
- Specific and concrete
- Culturally neutral
- Accurate impact estimation

**❌ Avoid**:
- Vague descriptions ("use some energy")
- Cultural references ("watch a Premier League match")  
- Overly technical terms
- Inaccurate comparisons

## Validation System

### Automatic Validation Script
The project includes a validation script to ensure consistency:

```bash
bun run scripts/validate-i18n.ts
```

### What It Checks

**Structure Validation**:
- Both `equivalencesCarbon` and `equivalencesWater` exist
- Same thresholds exist in both EN and FR
- Arrays have the same length in both languages

**Content Validation**:
- No empty equivalences
- No missing translations
- Proper array structure

**Example Output**:
```
✅ Validation passed!

Statistics:
- Total keys: 58
- Carbon equivalences: 18 thresholds, 90 total equivalences  
- Water equivalences: 18 thresholds, 90 total equivalences

Thresholds found:
Carbon: 0, 0.1, 0.5, 1, 2, 4, 8, 15, 30, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000
Water: 0, 0.1, 0.5, 1, 2, 4, 8, 15, 30, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000
```

### Common Validation Errors

**Mismatched Arrays**:
```
❌ Different number of equivalences for Carbon threshold 4: EN=5, FR=4
```
**Solution**: Add missing equivalence to French array

**Empty Content**:
```
❌ Empty content in French for: Carbon 2[3]
```
**Solution**: Replace empty string with actual equivalence

**Missing Threshold**:
```
❌ Threshold Water missing in English: 25
```
**Solution**: Add threshold to English file or remove from French

## Development Workflow

### 1. Add New Equivalences
Edit `src/locales/en.json` and `src/locales/fr.json`

### 2. Validate Changes
```bash
bun run scripts/validate-i18n.ts
```

### 3. Fix Any Errors
The script will show exactly what needs to be fixed

### 4. Test in Extension
```bash
bun dev
```
Load extension and verify equivalences display correctly

### 5. Commit Changes
Only commit when validation passes ✅

This system ensures users get meaningful, relatable context for their AI usage while maintaining consistency and supporting multiple languages. 