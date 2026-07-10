import * as THREE from 'three';
export function createBPSGEtching() {
  const group = new THREE.Group();
  
  // BPSG Glass Etching
  
  const chipMat = new THREE.MeshPhysicalMaterial({color: 0x444444, metalness: 0.9, roughness: 0.4});
  const chip = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), chipMat);
  chip.position.y = -1;
  group.add(chip);
  
  // The BPSG Glass block (made of many tiny cubes we will shrink to simulate smooth etching)
  const glassGroup = new THREE.Group();
  const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, 
      transmission: 0.9, 
      transparent: true, 
      opacity: 0.7, 
      roughness: 0.1, 
      ior: 1.5,
      clearcoat: 1.0
  });
  
  const cubes = [];
  const resolution = 16;
  const size = 8 / resolution;
  
  for(let x=0; x<resolution; x++) {
      for(let y=0; y<4; y++) {
          for(let z=0; z<resolution; z++) {
              const cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), glassMat);
              const px = -4 + size/2 + x*size;
              const py = size/2 + y*size;
              const pz = -4 + size/2 + z*size;
              cube.position.set(px, py, pz);
              glassGroup.add(cube);
              cubes.push({mesh: cube, origY: y});
          }
      }
  }
  group.add(glassGroup);
  
  // HF Acid Vapor (Green mist)
  const mistGeo = new THREE.PlaneGeometry(10, 10);
  const mistMat = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, side: THREE.DoubleSide});
  const mist = new THREE.Mesh(mistGeo, mistMat);
  mist.rotation.x = Math.PI/2;
  mist.position.y = 3;
  group.add(mist);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      const cycle = (time * speed * 0.5) % 5;
      
      if (cycle < 1) {
          // Reset
          mist.position.y = 3;
          mist.material.opacity = 0;
          cubes.forEach(c => c.mesh.scale.setScalar(1));
      } else if (cycle < 4) {
          // Etching! Mist descends slowly
          const t = (cycle - 1) / 3; // 0 to 1
          mist.position.y = 3 - t * 4;
          mist.material.opacity = 0.3 + Math.sin(time*speed*10)*0.1;
          
          // Cubes above the mist shrink and disappear
          cubes.forEach(c => {
              const currentY = c.mesh.position.y;
              if (currentY > mist.position.y) {
                  // Rapidly shrink
                  c.mesh.scale.setScalar(Math.max(0, c.mesh.scale.x - 0.1));
              }
          });
      } else {
          mist.material.opacity = 0;
      }
  };

  return {
    group: group,
    description: "BPSG Wet Etching. Borophosphosilicate glass (BPSG) isn't just great for melting over microchips (planarization). Because of the Boron and Phosphorus, the glass has a highly uniform, predictable atomic structure. When semiconductor engineers spray Hydrofluoric Acid (HF, the green mist) over the chip, the BPSG etches away perfectly layer by microscopic layer. Normal glass would etch unevenly, leaving jagged spikes that ruin the transistors. BPSG guarantees a perfectly flat, mirror-smooth etch every time!",
    parts: [
      { name: "Grey Block", material: "Silicon Wafer", function: "The base of the microchip." },
      { name: "Cyan Cubes", material: "BPSG Glass", function: "Etching away perfectly smoothly." },
      { name: "Green Mist", material: "Hydrofluoric Acid (HF)", function: "The highly corrosive chemical used to dissolve the glass layer by layer." }
    ],
    quizQuestions: [
      { question: "Why do engineers use BPSG glass instead of pure Silicon Dioxide when they need to etch layers off a microchip?", options: ["Because it is cheaper", "Because the Boron and Phosphorus doping allows the glass to dissolve (etch) perfectly evenly and predictably when exposed to acid, preventing jagged edges that ruin transistors.", "Because BPSG is bulletproof", "Because it glows in the dark"], correct: 1, explanation: "Predictability is everything in semiconductor manufacturing. BPSG's uniform etching rate allows engineers to remove exact nanometer-thick layers with absolute precision!" }
    ]
  };
}