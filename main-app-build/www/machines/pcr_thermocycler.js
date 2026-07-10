export function createPCRThermocycler(THREE) {
  const group = new THREE.Group();

  // 1. The Thermocycler Machine (External casing)
  const machineMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 4), machineMat);
  base.position.y = -2;
  group.add(base);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ color: 0x002200 }));
  screen.position.set(0, -1.5, 2.01);
  group.add(screen);

  // Simple text approximation on screen
  const textLine = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.01), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  textLine.position.set(0, -1.3, 2.02);
  group.add(textLine);
  
  // Heating block
  const block = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 }));
  block.position.y = -0.75;
  group.add(block);

  const lid = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4), machineMat);
  lid.position.set(0, 0, -2); // hinged at back
  group.add(lid);

  // 2. PCR Tube (Huge zoomed in view above the machine)
  const tubeGroup = new THREE.Group();
  tubeGroup.position.set(0, 3, 0);
  group.add(tubeGroup);

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.5, 4, 32), glassMat);
  tubeGroup.add(tube);
  tube.userData = { id: 'tube', name: 'PCR Tube (Master Mix)', description: 'Contains Target DNA, Taq Polymerase, Primers, and free Nucleotides.' };

  // 3. DNA Inside the tube
  const dnaGroup = new THREE.Group();
  tubeGroup.add(dnaGroup);
  
  // Helper to draw a strand
  const bbMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const rbbMat = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // new strand
  const bondMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });

  const createStrand = (length, color, yOffset, isTop) => {
    const sGroup = new THREE.Group();
    for(let i=0; i<length; i++) {
      const bb = new THREE.Mesh(new THREE.SphereGeometry(0.1), color);
      bb.position.set(i*0.3 - (length*0.3)/2, yOffset, 0);
      sGroup.add(bb);
      
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), bondMat);
      base.position.set(i*0.3 - (length*0.3)/2, yOffset + (isTop ? -0.2 : 0.2), 0);
      sGroup.add(base);
    }
    return sGroup;
  };

  const originalLength = 8;
  const topStrand = createStrand(originalLength, bbMat, 0.5, true);
  const botStrand = createStrand(originalLength, bbMat, -0.5, false);
  dnaGroup.add(topStrand, botStrand);
  dnaGroup.userData = { id: 'dna', name: 'Target DNA', description: 'The specific sequence of DNA that we want to amplify (make millions of copies of).' };

  // Primers
  const primerT = createStrand(2, new THREE.MeshStandardMaterial({ color: 0xffff00 }), 0.5, true);
  const primerB = createStrand(2, new THREE.MeshStandardMaterial({ color: 0xffff00 }), -0.5, false);
  primerT.position.set(-1.5, 1, 0); // floats above
  primerB.position.set(1.5, -1, 0); // floats below
  dnaGroup.add(primerT, primerB);
  primerT.children[0].userData = { id: 'primer', name: 'Primers', description: 'Short pieces of single-stranded DNA that match the start and end of the target sequence. They tell Taq Polymerase where to start copying.' };

  // Taq Polymerase
  const taqT = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x00ffaa }));
  const taqB = taqT.clone();
  taqT.position.set(-2, 1, 0);
  taqB.position.set(2, -1, 0);
  dnaGroup.add(taqT, taqB);
  taqT.userData = { id: 'taq', name: 'Taq Polymerase', description: 'A heat-resistant enzyme taken from hot-spring bacteria. It survives the boiling temperatures needed to unzip the DNA.' };

  // Heat visualization (red glow)
  const heatGlow = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.4, 3.8, 32), new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 }));
  tubeGroup.add(heatGlow);

  let phase = 0; // 0: Denature, 1: Anneal, 2: Extend, 3: Wait/Reset
  let timer = 0;

  group.userData.animate = function(delta) {
    timer += delta;

    if (phase === 0) {
      // Step 1: Denaturation (94°C)
      textLine.material.color.setHex(0xff0000); // Red screen
      textLine.scale.x = 0.5; // "94 C"
      heatGlow.material.opacity = 0.4;
      
      // Strands separate
      topStrand.position.y = Math.min(1.0, topStrand.position.y + 0.02);
      botStrand.position.y = Math.max(-1.0, botStrand.position.y - 0.02);
      
      if (timer > 2) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Step 2: Annealing (55°C)
      textLine.material.color.setHex(0xffff00); // Yellow
      textLine.scale.x = 0.7; // "55 C"
      heatGlow.material.opacity = 0;

      // Primers swoop in and bind
      primerT.position.lerp(new THREE.Vector3(-0.9, 0.2, 0), 0.1); // binds to botStrand (offset)
      primerB.position.lerp(new THREE.Vector3(0.9, -0.2, 0), 0.1);  // binds to topStrand (offset)

      if (timer > 2) {
        phase = 2;
        timer = 0;
      }
    } else if (phase === 2) {
      // Step 3: Extension (72°C)
      textLine.material.color.setHex(0x00ff00); // Green
      textLine.scale.x = 0.9; // "72 C"
      heatGlow.material.opacity = 0.1;

      // Taq jumps on and extends
      if (timer < 0.5) {
        taqT.position.lerp(new THREE.Vector3(-1.2, 0.2, 0), 0.1);
        taqB.position.lerp(new THREE.Vector3(1.2, -0.2, 0), 0.1);
      } else {
        // Slide across
        taqT.position.x += 0.05;
        taqB.position.x -= 0.05;
        
        // Grow primers (faking it by scaling them)
        if (taqT.position.x > -0.9 && taqT.position.x < 1.5) {
          primerT.scale.x = 1 + (taqT.position.x - -0.9)*1.5;
          primerT.position.x = -0.9 + (primerT.scale.x-1)*0.15; // keep left edge anchored
        }
        if (taqB.position.x < 0.9 && taqB.position.x > -1.5) {
          primerB.scale.x = 1 + (0.9 - taqB.position.x)*1.5;
          primerB.position.x = 0.9 - (primerB.scale.x-1)*0.15; // keep right edge anchored
        }
      }

      if (timer > 4) {
        phase = 3;
        timer = 0;
      }
    } else if (phase === 3) {
      // Wait and reset to show exponential growth concept
      if (timer > 2) {
        phase = 0;
        timer = 0;
        
        // Reset positions
        topStrand.position.y = 0.5;
        botStrand.position.y = -0.5;
        primerT.scale.x = 1;
        primerB.scale.x = 1;
        primerT.position.set(-1.5, 1, 0);
        primerB.position.set(1.5, -1, 0);
        taqT.position.set(-2, 1, 0);
        taqB.position.set(2, -1, 0);
      }
    }

    // Gentle floating of the whole tube
    tubeGroup.position.y = 3 + Math.sin(Date.now()*0.001)*0.1;
  };

  group.userData.quiz = [
    { question: "Why is Taq Polymerase used in PCR instead of human DNA Polymerase?", options: ["It is much faster", "It can survive the 94°C Denaturation step which would destroy human enzymes", "It makes fewer mistakes"], answer: 1 },
    { question: "What is the result of 30 cycles of PCR?", options: ["30 copies of the DNA", "300 copies of the DNA", "Over 1 billion copies of the target DNA (Exponential growth: 2^30)"], answer: 2 }
  ];

  return group;
}
