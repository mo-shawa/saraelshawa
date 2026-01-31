# Hero Wave Animation - Shader Implementation Plan

## Overview

Replace the current CSS/Framer Motion wave animation with a WebGL shader-based solution for smoother, more elegant visual effects. The shader will render subtle, slow-moving waves that emanate from the right side of the hero section, with smooth color transitions from cyan to violet.

---

## Current Implementation Issues

1. **Jarring opacity transitions** - CSS keyframe animations don't interpolate smoothly
2. **Discrete color steps** - Background gradient changes happen in visible steps
3. **Limited control** - Can't easily create organic, curved wave shapes
4. **Performance** - Multiple animated DOM elements

---

## Proposed Shader Solution

### Technology Stack

- **React Three Fiber** (`@react-three/fiber`) - Already installed in the project
- **Custom GLSL shaders** - Fragment shader for wave rendering
- **Three.js** - For WebGL context management

### Architecture

```
Hero.tsx
├── HeroBackground (new component)
│   ├── Canvas (R3F)
│   │   └── WaveMesh
│   │       ├── PlaneGeometry (fullscreen quad)
│   │       └── ShaderMaterial (custom GLSL)
│   └── uniforms: { uTime, uResolution }
└── Hero content (existing)
```

---

## Shader Design

### Fragment Shader Concept

```glsl
uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Wave origin on the right side (x = 0.85)
    float originX = 0.85;
    
    // Distance from origin
    float dist = originX - uv.x;
    
    // Multiple wave layers with different speeds
    float wave1 = createWave(dist, uTime * 0.05, 0.0);
    float wave2 = createWave(dist, uTime * 0.05, 2.0);
    float wave3 = createWave(dist, uTime * 0.05, 4.0);
    
    // Combine waves
    float waves = wave1 + wave2 + wave3;
    
    // Color gradient based on distance (cyan → blue → indigo → violet)
    vec3 color = getColorGradient(dist);
    
    // Apply wave intensity with smooth falloff
    float alpha = waves * smoothFalloff(dist);
    
    gl_FragColor = vec4(color, alpha);
}
```

### Key Shader Functions

#### 1. Wave Generation
```glsl
float createWave(float dist, float time, float offset) {
    // Sinusoidal wave that travels from right to left
    float wave = sin((dist * 3.0) - time + offset);
    
    // Smooth the wave shape
    wave = smoothstep(0.0, 1.0, wave);
    
    // Attenuate based on distance from origin
    wave *= exp(-dist * 2.0);
    
    return wave * 0.04; // Very subtle opacity
}
```

#### 2. Color Gradient
```glsl
vec3 getColorGradient(float dist) {
    // Cyan (at origin)
    vec3 cyan = vec3(0.133, 0.827, 0.933);    // #22d3ee
    // Sky blue
    vec3 sky = vec3(0.220, 0.741, 0.973);     // #38bdf8
    // Indigo
    vec3 indigo = vec3(0.388, 0.400, 0.945);  // #6366f1
    // Violet
    vec3 violet = vec3(0.545, 0.361, 0.965);  // #8b5cf6
    
    // Interpolate based on distance
    float t = clamp(dist / 0.7, 0.0, 1.0);
    
    vec3 color;
    if (t < 0.33) {
        color = mix(cyan, sky, t * 3.0);
    } else if (t < 0.66) {
        color = mix(sky, indigo, (t - 0.33) * 3.0);
    } else {
        color = mix(indigo, violet, (t - 0.66) * 3.0);
    }
    
    return color;
}
```

#### 3. Smooth Falloff
```glsl
float smoothFalloff(float dist) {
    // Fade out as waves travel left
    // Also fade near the origin for smooth spawn
    float leftFade = 1.0 - smoothstep(0.5, 0.8, dist);
    float rightFade = smoothstep(0.0, 0.15, dist);
    return leftFade * rightFade;
}
```

---

## Implementation Steps

### Phase 1: Setup (30 mins)

1. Create `src/components/HeroBackground.tsx`
2. Set up React Three Fiber Canvas with proper sizing
3. Create fullscreen plane geometry
4. Verify WebGL context works in hero section

### Phase 2: Basic Shader (1 hour)

1. Write vertex shader (simple passthrough)
2. Write fragment shader with:
   - Time uniform for animation
   - Resolution uniform for proper UV calculation
   - Single wave implementation
3. Test animation loop with `useFrame`

### Phase 3: Wave Refinement (1 hour)

1. Implement multiple wave layers
2. Add color gradient interpolation
3. Tune wave speed (target: 16+ second cycle)
4. Add smooth spawn/despawn falloff
5. Adjust opacity levels (very subtle: 2-4%)

### Phase 4: Organic Shape (30 mins)

1. Add vertical variation to waves (bow/curve shape)
2. Use noise or sine functions for organic movement
3. Make waves slightly curved rather than straight lines

### Phase 5: Integration (30 mins)

1. Replace current wave animation in Hero.tsx
2. Ensure proper z-indexing with content
3. Test on different screen sizes
4. Verify performance

### Phase 6: Polish (30 mins)

1. Fine-tune all parameters
2. Add reduced-motion media query support
3. Fallback for WebGL-unsupported browsers
4. Clean up and optimize

---

## File Structure

```
src/components/
├── Hero.tsx              # Updated to use HeroBackground
├── HeroBackground.tsx    # New: Canvas + shader setup
└── shaders/
    └── waveShader.ts     # GLSL shader strings
```

---

## Component API

### HeroBackground.tsx

```tsx
interface HeroBackgroundProps {
  className?: string;
}

export function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div className={className}>
      <Canvas>
        <WaveMesh />
      </Canvas>
    </div>
  );
}
```

### Usage in Hero.tsx

```tsx
export default function Hero() {
  return (
    <section className="relative ...">
      {/* Shader-based background */}
      <HeroBackground className="absolute inset-0 pointer-events-none" />
      
      {/* Vertical accent line */}
      <div className="absolute right-[15%] ..." />
      
      {/* Content */}
      <div className="container relative z-10">
        ...
      </div>
    </section>
  );
}
```

---

## Shader Parameters (Tunable)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `waveSpeed` | 0.05 | Speed multiplier for wave movement |
| `waveCount` | 3 | Number of overlapping wave layers |
| `waveSpacing` | 2.0 | Time offset between waves |
| `maxOpacity` | 0.04 | Maximum wave opacity (very subtle) |
| `originX` | 0.85 | X position of wave origin (0-1) |
| `falloffStart` | 0.5 | Where fade-out begins |
| `falloffEnd` | 0.8 | Where waves fully disappear |
| `spawnFade` | 0.15 | Distance over which waves fade in |

---

## Benefits Over CSS Animation

1. **Buttery smooth** - GPU-accelerated, no keyframe stepping
2. **Infinite control** - Organic curves, noise, any shape possible
3. **Single draw call** - Better performance than multiple DOM elements
4. **True gradients** - Colors blend mathematically, not via CSS interpolation
5. **No "popping"** - Continuous mathematical functions, no discrete states

---

## Fallback Strategy

```tsx
function HeroBackground() {
  const [webglSupported, setWebglSupported] = useState(true);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebglSupported(!!gl);
  }, []);
  
  if (!webglSupported) {
    // Return simple CSS gradient as fallback
    return <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/5 to-transparent" />;
  }
  
  return (
    <Canvas>
      <WaveMesh />
    </Canvas>
  );
}
```

---

## Accessibility

1. **Reduced Motion**: Check `prefers-reduced-motion` and disable animation
2. **Performance**: Use lower resolution on mobile/low-power devices
3. **Content First**: Waves are purely decorative, content remains fully accessible

```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// In shader: if reduced motion, set time to constant (static state)
uniforms.uTime.value = prefersReducedMotion ? 0 : clock.elapsedTime;
```

---

## Estimated Time

| Phase | Time |
|-------|------|
| Setup | 30 mins |
| Basic Shader | 1 hour |
| Wave Refinement | 1 hour |
| Organic Shape | 30 mins |
| Integration | 30 mins |
| Polish | 30 mins |
| **Total** | **4 hours** |

---

## References

- [The Book of Shaders](https://thebookofshaders.com/) - GLSL fundamentals
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber) - R3F integration
- [Shadertoy](https://www.shadertoy.com/) - Shader inspiration and examples
