export function createSeedGerminationProcess(THREE) {
  const group = new THREE.Group();

  // We will show 4 stages of germination side-by-side
  // Stage 1: Dry Seed (Imbibition)
  // Stage 2: Radicle emergence (Root)
  // Stage 3: Hypocotyl elongation (Hook)
  // Stage 4: Cotyledon expansion (Leaves)

  const positions = [-4, -1, 2, 5];
  
  // 1. Soil cross-section (Background)
  const soilGeo = new THREE.BoxGeometry(12, 4, 2);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 1 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.set(0.5, -2, -1);
  group.add(soil);
  soil.userData = { id: 'soil', name: 'Loam Soil', description: 'Provides darkness, moisture, and warmth to trigger germination. No nutrients are needed yet.' };

  const surfaceGeo = new THREE.BoxGeometry(12, 0.1, 2);
  const surfaceMat = new THREE.MeshStandardMaterial({ color: 0x4a3219, roughness: 1 });
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  surface.position.set(0.5, 0, -1);
  group.add(surface);

  // Common Materials
  const seedCoatMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
  const endospermMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
  const rootMat = new THREE.MeshStandardMaterial({ color: 0xffffee });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x90ee90 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x32cd32, side: THREE.DoubleSide });

  // === Stage 1: Imbibition (Water absorption) ===
  const s1Group = new THREE.Group();
  s1Group.position.set(positions[0], -1, 0);
  group.add(s1Group);
  
  const seed1Geo = new THREE.SphereGeometry(0.5, 16, 16);
  seed1Geo.scale(1, 1.5, 0.8);
  const seed1 = new THREE.Mesh(seed1Geo, seedCoatMat);
  s1Group.add(seed1);
  seed1.userData = { id: 'stage1', name: 'Stage 1: Imbibition', description: 'The dormant seed rapidly absorbs water, swelling up and activating enzymes that begin breaking down stored food.' };

  // Water droplets animating
  const dropGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6 });
  const drops = [];
  for(let i=0; i<3; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    s1Group.add(drop);
    drops.push({ mesh: drop, angle: i * (Math.PI*2/3) });
  }

  // === Stage 2: Radicle Emergence ===
  const s2Group = new THREE.Group();
  s2Group.position.set(positions[1], -1, 0);
  group.add(s2Group);
  
  const seed2 = new THREE.Mesh(seed1Geo, seedCoatMat);
  // Split coat
  const seed2Core = new THREE.Mesh(seed1Geo, endospermMat);
  seed2Core.scale.set(0.98, 0.98, 0.98);
  s2Group.add(seed2, seed2Core);
  
  // Radicle (Primary Root)
  const rootCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.6, 0),
    new THREE.Vector3(0, -1.2, 0),
    new THREE.Vector3(0.1, -1.8, 0)
  ]);
  const radicle1 = new THREE.Mesh(new THREE.TubeGeometry(rootCurve1, 8, 0.08, 8, false), rootMat);
  s2Group.add(radicle1);
  s2Group.children[0].userData = { id: 'stage2', name: 'Stage 2: Radicle Emergence', description: 'The seed coat ruptures and the radicle (embryonic root) emerges, anchoring the plant and seeking water.' };

  // === Stage 3: Hypocotyl Elongation ===
  const s3Group = new THREE.Group();
  s3Group.position.set(positions[2], -0.5, 0); // Seed raised up
  group.add(s3Group);

  const seed3 = new THREE.Mesh(seed1Geo, seedCoatMat);
  seed3.rotation.z = Math.PI / 4; // Falling off
  seed3.position.set(0.4, 0.2, 0);
  
  const cotyledon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), stemMat);
  cotyledon.scale.set(1, 1.4, 0.7);
  s3Group.add(seed3, cotyledon);
  
  // Root system (longer)
  const rootCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-0.1, -2, 0),
    new THREE.Vector3(0.2, -3, 0)
  ]);
  const root2 = new THREE.Mesh(new THREE.TubeGeometry(rootCurve2, 16, 0.1, 8, false), rootMat);
  s3Group.add(root2);

  // Lateral roots
  const latRoot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), rootMat);
  latRoot.position.set(-0.2, -2, 0);
  latRoot.rotation.z = Math.PI / 4;
  s3Group.add(latRoot);

  // Hypocotyl (Stem hook)
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.3, 0.5, 0),
    new THREE.Vector3(0, 0, 0) // Hook pulling cotyledon out
  ]);
  const hypocotyl = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 16, 0.1, 8, false), stemMat);
  s3Group.add(hypocotyl);
  
  s3Group.children[0].userData = { id: 'stage3', name: 'Stage 3: Hypocotyl Hook', description: 'The stem grows upwards, forming a protective hook to drag the delicate seed leaves (cotyledons) through the abrasive soil.' };

  // === Stage 4: Cotyledon Expansion (Above Ground) ===
  const s4Group = new THREE.Group();
  s4Group.position.set(positions[3], 1.5, 0);
  group.add(s4Group);

  // Root deep down
  const rootCurve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.5, 0),
    new THREE.Vector3(-0.2, -3.5, 0),
    new THREE.Vector3(0.1, -5.5, 0)
  ]);
  const root3 = new THREE.Mesh(new THREE.TubeGeometry(rootCurve3, 16, 0.12, 8, false), rootMat);
  s4Group.add(root3);

  // Straight stem
  const stemGeoStraight = new THREE.CylinderGeometry(0.1, 0.12, 2);
  const stemStraight = new THREE.Mesh(stemGeoStraight, stemMat);
  stemStraight.position.y = -0.5;
  s4Group.add(stemStraight);

  // Two open Cotyledons (Leaves)
  const openLeafGeo = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI);
  openLeafGeo.scale(1, 1.5, 0.1);
  
  const leaf1 = new THREE.Mesh(openLeafGeo, leafMat);
  leaf1.position.set(-0.5, 0.5, 0);
  leaf1.rotation.z = Math.PI / 4;
  
  const leaf2 = new THREE.Mesh(openLeafGeo, leafMat);
  leaf2.position.set(0.5, 0.5, 0);
  leaf2.rotation.z = -Math.PI / 4;
  leaf2.rotation.y = Math.PI; // Face the other way
  
  s4Group.add(leaf1, leaf2);
  
  // True leaves forming
  const trueLeafGeo = new THREE.ConeGeometry(0.2, 0.5, 8);
  const trueLeaf = new THREE.Mesh(trueLeafGeo, leafMat);
  trueLeaf.position.set(0, 0.8, 0);
  s4Group.add(trueLeaf);

  s4Group.children[0].userData = { id: 'stage4', name: 'Stage 4: Photosynthesis Begins', description: 'The cotyledons open to the sun and turn green. The plant stops relying on stored seed energy and begins making its own food via photosynthesis.' };

  // Sun
  const sunGeo = new THREE.SphereGeometry(1, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(4, 4, -4);
  group.add(sun);
  
  const sunLight = new THREE.PointLight(0xffdd00, 2, 20);
  sunLight.position.copy(sun.position);
  group.add(sunLight);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    // Stage 1 water drops
    drops.forEach(d => {
      d.mesh.position.x = Math.cos(d.angle + t*0.5) * 0.8;
      d.mesh.position.y = Math.sin(d.angle + t*0.5) * 0.8;
      // move toward seed
      d.mesh.position.lerp(new THREE.Vector3(0,0,0), 0.05);
      if(d.mesh.position.length() < 0.6) {
        d.angle += 1; // reset
        d.mesh.position.set(Math.cos(d.angle)*1.5, Math.sin(d.angle)*1.5, 0);
      }
    });

    // Stage 4 true leaf growing slightly
    trueLeaf.scale.setScalar(1 + Math.sin(t*0.5)*0.1);
  };

  group.userData.quiz = [
    { question: "What is the first structure to emerge from a germinating seed?", options: ["The stem", "The leaves", "The radicle (embryonic root)"], answer: 2 },
    { question: "Does a seed need sunlight to germinate?", options: ["Yes, always", "No, most seeds require darkness and germinate underground", "Only if it is a fruit seed"], answer: 1 }
  ];

  return group;
}
