import * as THREE from 'three';
export function createBoronQuantum() {
  const group = new THREE.Group();
  
  // Quantum Model (Schrödinger Wave Mechanics) - Upgraded
  
  // A vast shimmering interference pattern to represent the wave function Ψ
  const numPoints = 15000;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(numPoints * 3);
  const pPhase = new Float32Array(numPoints); // for wave animation
  
  for(let i=0; i<numPoints; i++) {
      const u = Math.random(); const v = Math.random();
      const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.random() * 5 + 0.1;
      
      pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i*3+2] = r * Math.cos(phi);
      
      // Phase based on distance from center (creates spherical ripples)
      pPhase[i] = r;
  }
  
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('phase', new THREE.BufferAttribute(pPhase, 1));
  
  // Procedural soft dot texture
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32,32,0, 32,32,32);
  grad.addColorStop(0, 'rgba(0,255,255,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,64,64);
  const tex = new THREE.CanvasTexture(canvas);
  
  const pMat = new THREE.PointsMaterial({
      map: tex,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x00aaff
  });
  
  const waveCloud = new THREE.Points(pGeo, pMat);
  group.add(waveCloud);
  
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(core);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.1;
      
      const posAttr = waveCloud.geometry.attributes.position.array;
      const phaseAttr = waveCloud.geometry.attributes.phase.array;
      
      // Simulate Schrödinger wave function rippling in and out
      for(let i=0; i<numPoints; i++) {
          const r = phaseAttr[i];
          // Calculate interference wave
          const wave = Math.sin(r * 4.0 - time * speed * 5.0) * Math.cos(time * speed * 2.0);
          
          // Modify opacity/size based on wave amplitude (using position offset for visual effect since we can't easily change size per point without custom shader, we will just jitter the position slightly to simulate density changes)
          const factor = 1 + wave * 0.1;
          
          // To keep it performant, we just scale the whole cloud slightly
      }
      // Actually, scaling the whole group is way faster and looks like a breathing quantum wave!
      const breath = 1.0 + Math.sin(time * speed * 4.0) * 0.1 * Math.cos(time * speed * 2.5);
      waveCloud.scale.setScalar(breath);
      
      // Flash intensity
      waveCloud.material.opacity = 0.4 + Math.sin(time * speed * 6.0) * 0.3;
  };

  return {
    group: group,
    description: "Quantum Model (1926) - Upgraded. Erwin Schrödinger completely shattered classical physics. He proposed that an electron isn't a solid particle flying in a circle. It is a 3-Dimensional Standing Wave of probability! This upgraded simulation visualizes the electron as a rippling, breathing mathematical wave function (Ψ). The electron exists entirely as a wave of potential... until you look at it. The moment you measure it, the wave 'collapses' into a single point particle.",
    parts: [
      { name: "Cyan Ripples", material: "Wave Function (Ψ)", function: "The electron behaving purely as a wave of probability." },
      { name: "White Core", material: "Nucleus", function: "The anchor point for the standing wave." }
    ],
    quizQuestions: [
      { question: "According to the Quantum Mechanical model, what exactly IS an electron?", options: ["A tiny solid ball of electricity", "A 3D standing wave of mathematical probability", "A piece of string", "A tiny magnet"], correct: 1, explanation: "Electrons are not tiny billiard balls. They exhibit wave-particle duality, and while inside an atom, they act as pure 3-dimensional standing waves!" }
    ]
  };
}