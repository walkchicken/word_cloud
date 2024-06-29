import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text, TrackballControls } from '@react-three/drei'
import { readWords, writeWord } from "./services";


function Word({ children, fontSize, ...props }) {
  const color = new THREE.Color()
  const fontProps = { font: '/Inter-Bold.woff', fontSize, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  useFrame(({camera}) => {
    ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
  })

  return (
    <Billboard {...props}>
      <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => console.log('clicked')} {...fontProps} children={children} />
    </Billboard>
  )
}

function Cloud({ words, radius = 20 }) {
  const count = Math.ceil(Math.sqrt(words.length));

  const positions = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        temp.push(new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)));
      }
    }
    return temp;
  }, [count, radius]);

  // Calculate the frequency of each word
  const wordFrequencies = words.reduce((acc, { word }) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const uniqueWords = Object.keys(wordFrequencies).map((word) => ({
    word,
    frequency: wordFrequencies[word]
  }));

  return uniqueWords.map(({ id, word, frequency }, index) => (
    <Word 
      key={id} 
      position={positions[index % positions.length]} 
      fontSize={2.5 * frequency} // Adjust font size based on frequency
      children={word} 
    />
  ));
}

export default function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    readWords(setWords);
  }, []);

  const [input, setInput] = useState("");

  const addWord = (e) => {
    e.preventDefault();
    writeWord(input);
    setInput("");
  };

  return (
    <>
     <form onSubmit={addWord} className="word-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a word"
          className="word-input"
        />
        <button type="submit" className="word-button">Add Word</button>
      </form>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
        <fog attach="fog" args={['#202025', 0, 80]} />
        <Suspense fallback={null}>
          <group rotation={[10, 10.5, 10]}>
            <Cloud words={words} radius={20} />
          </group>
        </Suspense>
        <TrackballControls />
      </Canvas>
    </>
  )
}
