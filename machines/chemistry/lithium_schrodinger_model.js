import * as THREE from 'three';
export function createLithiumSchrodingerModel() {
  const group = new THREE.Group();
  
  // Schrodinger Equation Visualization (Remastered)
  
  // A glowing 3D graph representing the radial wave function R(r)
  
  const lineGeo = new THREE.BufferGeometry();
  const pointsCount = 200;
  const linePos = new Float32Array(pointsCount * 3);
  const lineColors = new Float32Array(pointsCount * 3);
  
  const updateGraph = (time) => {
      for(let i=0; i<pointsCount; i++) {
          const r = i * 0.05; // radius from 0 to 10
          
          // 2s radial wave function
          const a0 = 1.0;
          const rho = r/a0;
          
          // Add a time-dependent phase shift to make it "wavy"
          const phase = Math.sin(time*2 - rho);
          const psi = (2 - rho) * Math.exp(-rho / 2) * phase; 
          
          linePos[i*3] = r; // x axis is radius
          linePos[i*3+1] = psi * 3; // y axis is wave amplitude
          linePos[i*3+2] = 0;
          
          // Color based on amplitude
          const c = new THREE.Color();
          if (psi > 0) c.setHex(0xff00ff);
          else c.setHex(0x00ffff);
          
          lineColors[i*3] = c.r; lineColors[i*3+1] = c.g; lineColors[i*3+2] = c.b;
      }
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
      lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  };
  updateGraph(0);
  
  const graph = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({vertexColors: true, linewidth: 2}));
  graph.position.x = -5;
  group.add(graph);
  
  // Grid lines
  const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  grid.position.set(0, 0, 0);
  group.add(grid);
  
  // X-axis and Y-axis
  const axes = new THREE.AxesHelper(5);
  axes.position.x = -5;
  group.add(axes);
  
  // Atom mapping
  // A sphere that expands and contracts with the wave
  const atom = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.3, transmission: 0.9})
  );
  group.add(atom);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      updateGraph(time * speed);
      
      // The atom radius pulses based on the highest probability peak of the wave
      const waveVal = Math.abs(Math.sin(time*speed*2));
      atom.scale.setScalar(1 + waveVal * 2);
      
      if (Math.sin(time*speed*2 - 1) > 0) {
          atom.material.color.setHex(0xff00ff); // positive phase
      } else {
          atom.material.color.setHex(0x00ffff); // negative phase
      }
  };

  return {
    group: group,
    description: "Schrödinger Equation (Remastered). How do we actually calculate the shape of the probability clouds? By solving the Schrödinger Wave Equation! This 3D graph plots the mathematical 'Radial Wave Function' of Lithium's 2s electron. The X-axis is the distance from the nucleus, and the Y-axis is the 'amplitude' (strength) of the wave. Notice how the wave dips below the X-axis? The point where the wave exactly crosses zero is called a 'Radial Node'. At that exact distance, the probability of finding the electron drops to absolute zero. This mathematics perfectly dictates the physical shape of the universe!",
    parts: [
      { name: "Magenta Curve", material: "Positive Wave Phase", function: "Amplitude above zero." },
      { name: "Cyan Curve", material: "Negative Wave Phase", function: "Amplitude below zero." },
      { name: "Zero Crossing", material: "Radial Node", function: "The mathematical zero-probability gap." }
    ],
    quizQuestions: [
      { question: "What does it mean when the wave function crosses the X-axis (amplitude = 0)?", options: ["The electron is created", "It creates a 'node' where the probability of finding the electron is exactly zero.", "The atom explodes", "It turns into a proton"], correct: 1, explanation: "If the amplitude is zero, the square of the amplitude (probability) is also zero!" }
    ]
  };
}