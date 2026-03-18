import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBgColor;
uniform vec3 uRipples[10]; // x, y, time

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  
  // Aspect ratio correction
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;
  
  // Mouse interaction
  vec2 mouse = uMouse;
  mouse.x *= uResolution.x / uResolution.y;
  float mouseDist = length(p - mouse);
  float mouseEffect = smoothstep(0.8, 0.0, mouseDist);
  
  // Base gradient movement
  float t = uTime * 0.05;
  
  // Noise layers for organic movement
  float n1 = snoise(p * 1.2 + vec2(t, t * 0.5));
  float n2 = snoise(p * 2.5 - vec2(t * 0.8, t * 0.3));
  float n3 = snoise(p * 4.0 + vec2(t * 0.4, -t * 0.6));
  
  // Combine noise
  float noise = n1 * 0.5 + n2 * 0.25 + n3 * 0.125;
  noise = noise * 0.5 + 0.5; // Normalize to 0-1
  
  // Add mouse perturbation
  noise += mouseEffect * 0.2;
  
  // Color mixing based on noise
  // Create a full spectrum rainbow effect based on noise and time
  // Multiply uv.x and uv.y to spread the hue across the screen initially
  float hue = fract(uv.x * 0.8 + uv.y * 0.4 + noise * 0.5 + t * 0.2);
  
  // HSL to RGB conversion
  vec3 color;
  float h = hue * 6.0;
  float c = 1.0; // Saturation
  float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
  
  if (h < 1.0) color = vec3(c, x, 0.0);
  else if (h < 2.0) color = vec3(x, c, 0.0);
  else if (h < 3.0) color = vec3(0.0, c, x);
  else if (h < 4.0) color = vec3(0.0, x, c);
  else if (h < 5.0) color = vec3(x, 0.0, c);
  else color = vec3(c, 0.0, x);
  
  // Calculate ripples
  float rippleEffect = 0.0;
  for(int i = 0; i < 10; i++) {
      vec2 rPos = uRipples[i].xy;
      rPos.x *= uResolution.x / uResolution.y;
      float rTime = uTime - uRipples[i].z;
      
      if (rTime > 0.0) {
          float rDist = length(p - rPos);
          // Slower expanding ring
          float radius = rTime * 0.08;
          // Thicker ring that diffuses
          float ring = smoothstep(0.15, 0.0, abs(rDist - radius));
          
          // Intensity decreases as it gets larger, reaching 0 at radius 1.0 (faster decay)
          float distanceFade = 1.0 - smoothstep(0.0, 1.0, radius);
          
          // Smoothly fade IN the ripple over the first 1.5 seconds so it doesn't pop
          float fadeIn = smoothstep(0.0, 1.5, rTime);
          
          // Only add to effect if it hasn't fully faded out
          if (distanceFade > 0.0) {
              // Decrease overall intensity of ripples and apply fade in
              ring *= distanceFade * fadeIn * 0.6;
              rippleEffect += ring;
          }
      }
  }
  
  // Dot matrix effect
  float dotSpacing = 8.0;
  vec2 dotPos = mod(gl_FragCoord.xy, dotSpacing) - dotSpacing * 0.5;
  float dotDist = length(dotPos);
  
  // Make dots vary in size based on noise, mouse, and ripples
  float baseDotSize = 1.0;
  // Increase ripple influence slightly since it fades out more smoothly now
  float currentDotSize = baseDotSize + noise * 1.5 + mouseEffect * 2.0 + rippleEffect * 4.0;
  
  // Anti-aliased dots
  float dotAlpha = smoothstep(currentDotSize, currentDotSize - 1.0, dotDist);
  
  // Final composition
  // Faint wash of the gradient over the background - reduced intensity for readability
  vec3 finalColor = mix(uBgColor, color, 0.02 + noise * 0.04);
  
  // Add the dots - reduced intensity for readability
  finalColor = mix(finalColor, color, dotAlpha * (0.15 + noise * 0.3 + mouseEffect * 0.3 + rippleEffect * 0.5));
  
  // Add a subtle vignette
  float vignette = length(uv - 0.5);
  finalColor = mix(finalColor, uBgColor, smoothstep(0.3, 1.2, vignette) * 0.5);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()
  
  // Target mouse position for smooth interpolation
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5))
  
  // Ripples state - increased pool size to allow many concurrent ripples
  const ripples = useRef<THREE.Vector3[]>(
    Array(10).fill(0).map(() => new THREE.Vector3(-1, -1, -1000))
  )
  const rippleIndex = useRef(0)
  const lastAutoRippleTime = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      // Vibrant palette: Neon Pink, Bright Orange, Electric Cyan
      uColor1: { value: new THREE.Color('#ff007f') }, // Neon Pink
      uColor2: { value: new THREE.Color('#ffaa00') }, // Bright Orange
      uColor3: { value: new THREE.Color('#00ffcc') }, // Electric Cyan
      uBgColor: { value: new THREE.Color('#141414') }, // Match the surface tone below the hero
      uRipples: { value: ripples.current },
    }),
    []
  )

  // Global mouse tracking to avoid jank when hovering over other elements
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      targetMouse.current.x = e.clientX / window.innerWidth
      targetMouse.current.y = 1.0 - (e.clientY / window.innerHeight)
    }
    
    const handlePointerDown = (e: PointerEvent) => {
      // Spawn a ripple on click
      const x = e.clientX / window.innerWidth
      const y = 1.0 - (e.clientY / window.innerHeight)
      
      // Find the oldest ripple to replace
      let oldestIndex = 0
      let oldestTime = ripples.current[0].z
      
      for (let i = 1; i < 10; i++) {
        if (ripples.current[i].z < oldestTime) {
          oldestTime = ripples.current[i].z
          oldestIndex = i
        }
      }
      
      // Always replace the oldest ripple on click
      ripples.current[oldestIndex].set(x, y, materialRef.current?.uniforms.uTime.value || 0)
      rippleIndex.current = (oldestIndex + 1) % 10
      
      if (materialRef.current) {
        materialRef.current.uniforms.uRipples.value = ripples.current
      }
    }
    
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  // Update resolution on resize
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      
      // Smooth mouse interpolation
      currentMouse.current.lerp(targetMouse.current, 0.1) // Increased lerp factor for snappier but smooth response
      materialRef.current.uniforms.uMouse.value.copy(currentMouse.current)
      
      // Auto spawn ripples exactly every 7 seconds
      if (state.clock.elapsedTime - lastAutoRippleTime.current > 7.0) {
        lastAutoRippleTime.current = state.clock.elapsedTime
        
        // Find oldest ripple to replace
        let oldestIndex = 0
        let oldestTime = ripples.current[0].z
        for (let i = 1; i < 10; i++) {
          if (ripples.current[i].z < oldestTime) {
            oldestTime = ripples.current[i].z
            oldestIndex = i
          }
        }
        
        ripples.current[oldestIndex].set(
          Math.random(),
          Math.random(),
          state.clock.elapsedTime
        )
        rippleIndex.current = (oldestIndex + 1) % 10
        materialRef.current.uniforms.uRipples.value = ripples.current
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}

export default function HeroBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Delay intro to allow user to read hero content first
    const timer = setTimeout(() => setIsMounted(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 3.0, ease: "easeInOut" }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: true }}
      >
        <ShaderPlane />
      </Canvas>
    </motion.div>
  )
}
