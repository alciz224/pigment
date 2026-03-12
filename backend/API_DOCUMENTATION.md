# Pigment Mixer API Documentation

## Base URL

```
http://localhost:8000
```

All endpoints are prefixed with `/api`.

---

## Endpoints

### 1. GET /api/pigments

Get all available pigments with their Kubelka-Munk K and S coefficients.

**Response:** `Array<Pigment>`

```json
[
  {
    "id": 1,
    "name": "Blanc de Titane",
    "code": "PW6",
    "K": [0.005, 0.005, 0.005],
    "S": [3.0, 3.0, 3.0]
  },
  ...
]
```

**Pigment Schema:**
- `id` (integer): Unique pigment identifier
- `name` (string): Display name
- `code` (string): Pigment code (e.g., PW6, PR108)
- `K` (array[3]): Absorption coefficients [K_R, K_G, K_B]
- `S` (array[3]): Scattering coefficients [S_R, S_G, S_B]

---

### 2. POST /api/compute

Calculate the resulting color from mixing pigments with given proportions.

**Request Body:** `MixRequest`

```json
{
  "pigments": [
    { "pigment_id": 3, "weight": 0.6 },
    { "pigment_id": 5, "weight": 0.4 }
  ]
}
```

**Rules:**
- Minimum 2 pigments required
- Weights must sum to 1.0 (tolerance: 0.01)
- Each weight must be between 0.0 and 1.0
- `pigment_id` must be > 0

**Response:** `MixResult`

```json
{
  "rgb": [241, 98, 51],
  "reflectance": [0.856, 0.091, 0.038],
  "ks_ratio": [0.014, 5.02, 11.12]
}
```

**MixResult Schema:**
- `rgb` (array[3]): Final color as RGB bytes [R, G, B] (0-255)
- `reflectance` (array[3]): Reflectance values per channel (0.0-1.0)
- `ks_ratio` (array[3]): K/S ratio per channel

**Error Responses:**
- `400 Bad Request`: Invalid weights or minimum pigments not met

---

### 3. POST /api/mixes

Save a named mix to storage.

**Request Body:** `SaveMixRequest`

```json
{
  "name": "My Orange Mix",
  "pigments": [
    { "pigment_id": 3, "weight": 0.6 },
    { "pigment_id": 5, "weight": 0.4 }
  ]
}
```

**Response:** `SavedMix`

```json
{
  "id": 1,
  "name": "My Orange Mix",
  "pigments": [
    { "pigment_id": 3, "weight": 0.6 },
    { "pigment_id": 5, "weight": 0.4 }
  ],
  "rgb": [241, 98, 51]
}
```

**Note:** The RGB value is automatically computed when saving.

---

### 4. GET /api/mixes

Retrieve all saved mixes.

**Response:** `Array<SavedMix>`

```json
[
  {
    "id": 1,
    "name": "My Orange Mix",
    "pigments": [...],
    "rgb": [241, 98, 51]
  }
]
```

---

### 5. GET /api/mixes/{mix_id}

Retrieve a specific saved mix by ID.

**Path Parameters:**
- `mix_id` (integer): The saved mix ID

**Response:** `SavedMix`

---

### 6. DELETE /api/mixes/{mix_id}

Delete a saved mix.

**Path Parameters:**
- `mix_id` (integer): The saved mix ID

**Response:** `{ "deleted": true, "id": 1 }` or `404` if not found

---

## Frontend Integration

### JavaScript fetch() Example

```javascript
const API_BASE = 'http://localhost:8000/api';

// Get all pigments
async function fetchPigments() {
  const res = await fetch(`${API_BASE}/pigments`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Compute a mix (local calculation recommended for realtime)
async function computeMix(pigments) {
  const res = await fetch(`${API_BASE}/compute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pigments })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { rgb, reflectance, ks_ratio }
}

// Save a mix
async function saveMix(name, pigments) {
  const res = await fetch(`${API_BASE}/mixes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, pigments })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // SavedMix
}

// Get all saved mixes
async function getSavedMixes() {
  const res = await fetch(`${API_BASE}/mixes`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Delete a mix
async function deleteMix(mixId) {
  const res = await fetch(`${API_BASE}/mixes/${mixId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { deleted: true, id: mixId }
}
```

---

## Notes

- All weights are **fractions** (0.0-1.0), not percentages (0-100)
- The **frontend should perform local calculations** for realtime slider updates using the same Kubelka-Munk algorithm. Use the backend `compute` endpoint only for validation or persistence.
- The `reflectance` and `ks_ratio` fields are optional for display purposes (debug/view technical data).
- CORS is enabled for `http://localhost:3000`.
- Data is stored in-memory and will be lost on server restart.

---

## Expected Pigment Colors (for verification)

| Pigment Name | Approximate RGB |
|--------------|-----------------|
| Blanc de Titane | (248, 248, 248) |
| Noir d'Ivoire | (20, 20, 20) |
| Rouge de Cadmium | (240, 55, 44) |
| Bleu Outremer | (56, 90, 229) |
| Jaune de Cadmium | (241, 223, 63) |
| Vert Émeraude | (67, 214, 124) |
| Terre de Sienne Brûlée | (142, 83, 54) |
