export function createSkeletalMuscle(THREE) {
  const group = new THREE.Group();

  // Sliding Filament Theory (Sarcomere model)
  
  // 1. Muscle belly (Macro view)
  const macroGroup = new THREE.Group();
  macroGroup.position.set(-5, 0, 0);
  group.add(macroGroup);

  const muscleMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.8 });
  const tendonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), muscleMat);
  belly.scale.set(1, 2, 1);
  macroGroup.add(belly);
  belly.userData = { id: 'muscle_belly', name: 'Skeletal Muscle Belly', description: 'A voluntary muscle attached to bone, made up of thousands of individual muscle fibers (cells) bundled together.' };

  const topTendon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 1), tendonMat);
  topTendon.position.y = 3.5;
  macroGroup.add(topTendon);
  
  const bottomTendon = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.5, 1), tendonMat);
  bottomTendon.position.y = -3.5;
  macroGroup.add(bottomTendon);
  topTendon.userData = { id: 'tendon', name: 'Tendon', description: 'Tough connective tissue that attaches muscle to bone.' };

  // Draw lines to indicate muscle fibers
  const lineMat = new THREE.LineBasicMaterial({ color: 0xaa1111 });
  for(let i=0; i<10; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3((Math.random()-0.5)*2, 3, (Math.random()-0.5)*2),
      new THREE.Vector3((Math.random()-0.5)*2, -3, (Math.random()-0.5)*2)
    ]);
    macroGroup.add(new THREE.Line(geo, lineMat));
  }

  // Link to micro view
  const link = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, 0, 0), new THREE.Vector3(0, 3, 0)]),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  group.add(link);

  // 2. Microscopic View: The Sarcomere (The functional unit of contraction)
  const microGroup = new THREE.Group();
  microGroup.position.set(3, 0, 0);
  group.add(microGroup);

  // Z-Discs (The boundaries of the sarcomere)
  const zDiscGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
  const zDiscMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const zDiscL = new THREE.Mesh(zDiscGeo, zDiscMat);
  zDiscL.position.x = -3;
  const zDiscR = new THREE.Mesh(zDiscGeo, zDiscMat);
  zDiscR.position.x = 3;
  microGroup.add(zDiscL, zDiscR);
  zDiscL.userData = { id: 'zdisc', name: 'Z-Disc', description: 'The boundary of a single sarcomere. During contraction, these discs are pulled closer together.' };

  // Actin filaments (Thin filaments attached to Z-Discs)
  const actinGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
  const actinMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const actinsL = [];
  const actinsR = [];

  for(let y=-1.5; y<=1.5; y+=0.5) {
    const aL = new THREE.Mesh(actinGeo, actinMat);
    aL.rotation.z = Math.PI/2;
    aL.position.set(-2, y, 0);
    microGroup.add(aL);
    actinsL.push(aL);
    
    const aR = new THREE.Mesh(actinGeo, actinMat);
    aR.rotation.z = Math.PI/2;
    aR.position.set(2, y, 0);
    microGroup.add(aR);
    actinsR.push(aR);
  }
  actinsL[0].userData = { id: 'actin', name: 'Actin (Thin Filament)', description: 'Thin protein strands that are pulled by the myosin heads.' };

  // Myosin filaments (Thick filaments in the center)
  const myosinGeo = new THREE.CylinderGeometry(0.15, 0.15, 3);
  const myosinMat = new THREE.MeshStandardMaterial({ color: 0xff4400 });
  const myosins = [];

  for(let y=-1.25; y<=1.25; y+=0.5) {
    const m = new THREE.Group();
    m.position.set(0, y, 0);
    
    const shaft = new THREE.Mesh(myosinGeo, myosinMat);
    shaft.rotation.z = Math.PI/2;
    m.add(shaft);

    // Myosin heads (the hooks)
    for(let x=-1.2; x<=1.2; x+=0.4) {
      const headL = new THREE.Mesh(new THREE.SphereGeometry(0.1), myosinMat);
      headL.position.set(x, 0.2, 0);
      m.add(headL);
      
      const headR = new THREE.Mesh(new THREE.SphereGeometry(0.1), myosinMat);
      headR.position.set(x, -0.2, 0);
      m.add(headR);
    }
    
    microGroup.add(m);
    myosins.push(m);
  }
  myosins[0].userData = { id: 'myosin', name: 'Myosin (Thick Filament)', description: 'Thick protein strands with club-like heads that grab actin and pull, powered by ATP.' };

  // Calcium ions & ATP (Particles floating in)
  const calciumGeo = new THREE.SphereGeometry(0.1);
  const calciumMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const caParticles = new THREE.Group();
  microGroup.add(caParticles);

  for(let i=0; i<10; i++) {
    const ca = new THREE.Mesh(calciumGeo, calciumMat);
    ca.position.set((Math.random()-0.5)*6, 2.5, (Math.random()-0.5)*2);
    caParticles.add(ca);
  }

  // Animation logic
  let contractionPhase = 0; // 0 to 1
  let direction = 1;

  group.userData.animate = function(delta) {
    const speed = 0.01;
    contractionPhase += speed * direction;
    
    if (contractionPhase > 1) {
      contractionPhase = 1;
      direction = -1; // Relax
    } else if (contractionPhase < 0) {
      contractionPhase = 0;
      direction = 1; // Contract
    }

    // Macro muscle bulges when contracting
    belly.scale.y = 2 - (contractionPhase * 0.5); // gets shorter
    belly.scale.x = 1 + (contractionPhase * 0.3); // gets wider
    belly.scale.z = 1 + (contractionPhase * 0.3);

    // Micro sarcomere contracts (Z-discs move in)
    const zPos = 3 - contractionPhase * 1.2; // Move from 3 to 1.8
    zDiscR.position.x = zPos;
    zDiscL.position.x = -zPos;
    
    // Actin filaments attached to Z-discs move in
    actinsR.forEach(a => {
      a.position.x = zPos - 1.25;
    });
    actinsL.forEach(a => {
      a.position.x = -zPos + 1.25;
    });

    // Calcium rains down during contraction
    if (direction === 1) {
      caParticles.children.forEach(ca => {
        ca.position.y -= 0.1;
        if(ca.position.y < -2) ca.position.y = 2.5;
        ca.material.opacity = 1;
      });
    } else {
      // Calcium pumped away during relaxation
      caParticles.children.forEach(ca => {
        ca.position.y += 0.1;
        ca.material.transparent = true;
        ca.material.opacity -= 0.05;
      });
    }
  };

  group.userData.quiz = [
    { question: "What is the Sliding Filament Theory?", options: ["Muscles stretch like rubber bands", "Myosin filaments physically grab and pull Actin filaments past them, shortening the sarcomere", "Bones pull the muscles"], answer: 1 },
    { question: "What mineral is strictly required to unlock the actin binding sites so contraction can occur?", options: ["Iron", "Calcium", "Sodium"], answer: 1 }
  ];

  return group;
}
