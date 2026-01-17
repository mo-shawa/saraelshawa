import { useRef, useEffect } from 'react'
import type { RefObject } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  #define PI 3.14159265359

  // Smooth blob function
  float blob(vec2 uv, vec2 center, float radius, float softness) {
    float d = length(uv - center);
    return smoothstep(radius + softness, radius - softness, d);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.15;
    
    // Deep, rich colors
    vec3 bg = vec3(0.01, 0.015, 0.04);
    vec3 blue1 = vec3(0.08, 0.12, 0.28);   // Deep royal
    vec3 blue2 = vec3(0.15, 0.22, 0.42);   // Royal blue
    vec3 blue3 = vec3(0.06, 0.10, 0.22);   // Navy
    vec3 accent = vec3(0.28, 0.38, 0.58);  // Silver-blue highlight
    
    vec3 color = bg;
    
    // Large flowing blobs
    vec2 blob1Pos = vec2(
      0.3 + sin(t * 0.5) * 0.2,
      0.4 + cos(t * 0.4) * 0.15
    );
    float b1 = blob(uv, blob1Pos, 0.35, 0.25);
    color = mix(color, blue1, b1 * 0.8);
    
    vec2 blob2Pos = vec2(
      0.7 + sin(t * 0.3 + 1.5) * 0.15,
      0.6 + cos(t * 0.35 + 0.8) * 0.2
    );
    float b2 = blob(uv, blob2Pos, 0.4, 0.3);
    color = mix(color, blue2, b2 * 0.7);
    
    vec2 blob3Pos = vec2(
      0.5 + sin(t * 0.25 + 3.0) * 0.25,
      0.3 + cos(t * 0.3 + 2.0) * 0.15
    );
    float b3 = blob(uv, blob3Pos, 0.3, 0.2);
    color = mix(color, blue3, b3 * 0.6);
    
    // Mouse-responsive blob
    float mouseBlob = blob(uv, uMouse, 0.25, 0.2);
    color = mix(color, accent, mouseBlob * 0.4);
    
    // Subtle overall glow
    float centerGlow = 1.0 - length(uv - vec2(0.5)) * 0.6;
    color *= 0.85 + centerGlow * 0.15;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

type GradientMeshProps = {
    containerRef: RefObject<HTMLElement>
}

function GradientMesh({ containerRef }: GradientMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const mouseRef = useRef({ x: 0.5, y: 0.5 })
    const { viewport, gl } = useThree()

    const uniforms = useRef({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }).current

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            const target = containerRef.current ?? gl.domElement
            const rect = target.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width
            const y = 1.0 - (e.clientY - rect.top) / rect.height
            mouseRef.current.x = Math.min(1, Math.max(0, x))
            mouseRef.current.y = Math.min(1, Math.max(0, y))
        }

        const handlePointerLeave = () => {
            mouseRef.current.x = 0.5
            mouseRef.current.y = 0.5
        }

        const target = containerRef.current ?? gl.domElement
        window.addEventListener('pointermove', handlePointerMove)
        target.addEventListener('pointerleave', handlePointerLeave)
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            target.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [gl, containerRef])

    useFrame((state, delta) => {
        uniforms.uTime.value = state.clock.elapsedTime
        uniforms.uMouse.value.x = THREE.MathUtils.damp(uniforms.uMouse.value.x, mouseRef.current.x, 8, delta)
        uniforms.uMouse.value.y = THREE.MathUtils.damp(uniforms.uMouse.value.y, mouseRef.current.y, 8, delta)
    })

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </mesh>
    )
}

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null)

    return (
        <section ref={sectionRef} className="relative min-h-dvh w-full bg-[#020510] text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                    <GradientMesh containerRef={sectionRef} />
                </Canvas>
            </div>

            <div className="relative z-10 container h-full min-h-dvh flex flex-col justify-center py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-slate-400 mb-12"
                >
                    <span className="w-8 h-px bg-slate-600" />
                    <span>Computer Science & Biology</span>
                </motion.div>

                <div className="space-y-4 mb-16 max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em]"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Sara El-Shawa
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(1.125rem,2vw,1.5rem)] text-slate-300 font-light max-w-xl leading-relaxed"
                    >
                        Researcher at the <span className="text-cyan-400">Vector Institute</span>, applying machine learning to decode biological systems.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-wrap items-center gap-8"
                >
                    <Link to="/posts" className="group inline-flex items-center gap-3 text-sm font-medium tracking-widest uppercase hover:text-cyan-400 transition-colors">
                        <span className="w-12 h-px bg-white group-hover:w-16 group-hover:bg-cyan-400 transition-all duration-300" />
                        Research
                    </Link>

                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors">
                        <span className="w-8 h-px bg-slate-600" />
                        CV
                    </a>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
            </motion.div>
        </section>
    )
}
