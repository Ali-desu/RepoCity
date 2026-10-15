import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function Box() {
  const ref = useRef<Mesh>(null)

  // runs every frame: spin the cube so you know the render loop works
  useFrame((_,delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <Box />
    </Canvas>
  )
}