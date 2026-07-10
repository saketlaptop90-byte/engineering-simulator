import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createVolcano(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // 1. Magma Chamber
  const magmaChamberGroup = new THREE.Group();
  const magmaChamberGeo = new THREE.SphereGeometry(3.5, 32, 16);
  const magmaChamberMesh = new THREE.Mesh(magmaChamberGeo, fire);
  magmaChamberMesh.position.set(0, -2, 0);
  magmaChamberGroup.add(magmaChamberMesh);

  parts.push({
    name: "Magma Chamber",
    description: "A large underground pool of liquid rock found beneath the surface of the Earth.",
    material: "fire",
    function: "Stores magma that feeds the volcano's eruptions.",
    assemblyOrder: 1,
    connections: ["Main Vent / Conduit"],
    failureEffect: "Magma cools and solidifies, forming an intrusive igneous rock body (pluton).",
    cascadeFailures: ["Eruption ceases", "Vent blockage"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: -10, z: 0 },
    group: magmaChamberGroup
  });

  // 2. Main Vent / Conduit
  const ventGroup = new THREE.Group();
  const ventGeo = new THREE.CylinderGeometry(0.4, 0.4, 14, 16);
  const ventMesh = new THREE.Mesh(ventGeo, fire);
  ventMesh.position.set(0, 5, 0);
  ventGroup.add(ventMesh);
  
  // Shell of the vent
  const ventShellGeo = new THREE.CylinderGeometry(0.6, 0.6, 14, 16, 1, false, Math.PI / 2, Math.PI);
  const ventShellMesh = new THREE.Mesh(ventShellGeo, darkSteel);
  ventShellMesh.position.set(0, 5, 0);
  ventGroup.add(ventShellMesh);

  parts.push({
    name: "Main Vent / Conduit",
    description: "The primary pipe or channel carrying magma from the magma chamber to the surface.",
    material: "fire, darkSteel",
    function: "Transport magma vertically to the crater.",
    assemblyOrder: 2,
    connections: ["Magma Chamber", "Crater", "Dike", "Sill"],
    failureEffect: "Blockage causes pressure buildup, leading to an explosive eruption or flank collapse.",
    cascadeFailures: ["Parasitic cone activation", "Dike formation"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 5, z: 10 },
    group: ventGroup
  });

  // 3. Strato Layers (Base Volcano cutaway)
  const layersGroup = new THREE.Group();
  const layerHeight = 2;
  const totalHeight = 12;
  const baseRad = 10;
  const topRad = 1.0;
  for (let i = 0; i < 6; i++) {
    const yBottom = i * layerHeight;
    const yTop = (i + 1) * layerHeight;
    const rBottom = baseRad - (baseRad - topRad) * (yBottom / totalHeight);
    const rTop = baseRad - (baseRad - topRad) * (yTop / totalHeight);
    
    // Half-cones facing -Z
    const geo = new THREE.CylinderGeometry(rTop, rBottom, layerHeight, 32, 1, false, Math.PI / 2, Math.PI);
    const mat = (i % 2 === 0) ? castIron : darkSteel; 
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, yBottom + layerHeight / 2, 0);
    layersGroup.add(mesh);
  }

  // Underground base for the volcano
  const baseGeo = new THREE.CylinderGeometry(10, 10, 5, 32, 1, false, Math.PI / 2, Math.PI);
  const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
  baseMesh.position.set(0, -2.5, 0);
  layersGroup.add(baseMesh);

  // Solid cross-section plane to hide the hollow interior of the cutaway cones
  const crossSectionGeo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // Volcano cone cross-section (Trapezoid)
    -1.0, 12, 0,
    -10.0, 0, 0,
     1.0, 12, 0,
     
     1.0, 12, 0,
    -10.0, 0, 0,
     10.0, 0, 0,
     
     // Underground base cross-section (Rectangle)
    -10.0, 0, 0,
    -10.0, -5, 0,
     10.0, 0, 0,
     
     10.0, 0, 0,
    -10.0, -5, 0,
     10.0, -5, 0
  ]);
  crossSectionGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  crossSectionGeo.computeVertexNormals();
  const crossSectionMesh = new THREE.Mesh(crossSectionGeo, lead);
  crossSectionMesh.position.z = -0.01; // slightly back to avoid z-fighting with the vents
  layersGroup.add(crossSectionMesh);

  parts.push({
    name: "Strato Layers",
    description: "Alternating layers of hardened lava, tephra, pumice, and volcanic ash.",
    material: "castIron, darkSteel",
    function: "Forms the steep, conical structure of the composite volcano.",
    assemblyOrder: 3,
    connections: ["Main Vent / Conduit", "Crater"],
    failureEffect: "Flank collapse or landslide due to structural instability.",
    cascadeFailures: ["Directed blast", "Debris avalanche"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: -15 },
    group: layersGroup
  });

  // 4. Parasitic Cone
  const pConeGroup = new THREE.Group();
  const pConeGeo = new THREE.ConeGeometry(2, 3, 16);
  const pConeMesh = new THREE.Mesh(pConeGeo, castIron);
  pConeMesh.position.set(-5, 3, -5.9);
  pConeGroup.add(pConeMesh);

  const pVentGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.1, 8);
  const pVentMesh = new THREE.Mesh(pVentGeo, fire);
  pVentMesh.position.set(-5, 3, -5.9);
  pConeGroup.add(pVentMesh);

  const pAshGeo = new THREE.SphereGeometry(0.8, 8, 8);
  const pAshMesh = new THREE.Mesh(pAshGeo, lead);
  pAshMesh.position.set(-5, 5, -5.9);
  pConeGroup.add(pAshMesh);

  parts.push({
    name: "Parasitic Cone",
    description: "A secondary cone on the flank of the volcano built up by eruptions from a side vent.",
    material: "castIron, fire",
    function: "Relieves pressure when the main vent is blocked.",
    assemblyOrder: 4,
    connections: ["Dike", "Strato Layers"],
    failureEffect: "Becomes dormant when magma finds an easier path or main vent clears.",
    cascadeFailures: ["Magma cooling in side vents"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -10, y: 5, z: 0 },
    group: pConeGroup
  });

  // 5. Dike
  const dikeGroup = new THREE.Group();
  const dikeGeo = new THREE.CylinderGeometry(0.15, 0.15, 7.8, 8);
  const dikeMesh = new THREE.Mesh(dikeGeo, fire);
  // Extends from main vent (0,2,0) to parasitic cone (-5,3,-5.9)
  dikeMesh.position.set(-2.5, 2.5, -2.95);
  const dikeDir = new THREE.Vector3(-5, 1, -5.9).normalize();
  dikeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dikeDir);
  dikeGroup.add(dikeMesh);

  parts.push({
    name: "Dike",
    description: "A vertical or steeply dipping sheet of magma that cuts across existing rock layers.",
    material: "fire",
    function: "Feeds magma to parasitic cones or fissure eruptions.",
    assemblyOrder: 5,
    connections: ["Main Vent / Conduit", "Parasitic Cone"],
    failureEffect: "Solidifies into a wall-like intrusion when volcanic activity stops.",
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: -5, y: 10, z: -5 },
    group: dikeGroup
  });

  // 6. Sill
  const sillGroup = new THREE.Group();
  const sillGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 8);
  const sillMesh = new THREE.Mesh(sillGeo, fire);
  // Extends horizontally from main vent into the rock
  sillMesh.position.set(2, 6, -1.5);
  const sillDir = new THREE.Vector3(4, 0, -3).normalize();
  sillMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sillDir);
  sillGroup.add(sillMesh);

  parts.push({
    name: "Sill",
    description: "A horizontal sheet of magma intruded between older rock layers.",
    material: "fire",
    function: "Spreads magma laterally underground, occasionally causing ground uplift.",
    assemblyOrder: 6,
    connections: ["Main Vent / Conduit"],
    failureEffect: "Solidifies to form a strong, flat layer of igneous rock.",
    cascadeFailures: [],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 10, y: 6, z: 5 },
    group: sillGroup
  });

  // 7. Crater
  const craterGroup = new THREE.Group();
  // Back half of the crater bowl
  const craterGeo = new THREE.CylinderGeometry(1.2, 0.5, 1, 16, 1, false, Math.PI / 2, Math.PI);
  const craterMesh = new THREE.Mesh(craterGeo, darkSteel);
  craterMesh.position.set(0, 12, 0);
  craterGroup.add(craterMesh);

  // Magma pool inside the crater
  const craterMagmaGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
  const craterMagmaMesh = new THREE.Mesh(craterMagmaGeo, fire);
  craterMagmaMesh.position.set(0, 11.9, 0);
  craterGroup.add(craterMagmaMesh);

  parts.push({
    name: "Crater",
    description: "The bowl-shaped depression at the summit of the volcano.",
    material: "darkSteel, fire",
    function: "The main vent's surface opening where lava, ash, and gases escape.",
    assemblyOrder: 7,
    connections: ["Main Vent / Conduit", "Lava Flow"],
    failureEffect: "Can collapse into a massive caldera during extremely explosive eruptions.",
    cascadeFailures: ["Caldera formation", "Catastrophic depressurization"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 15, z: 0 },
    group: craterGroup
  });

  // 8. Lava Flow
  const lavaFlowGroup = new THREE.Group();
  
  const lavaGeo1 = new THREE.CylinderGeometry(0.3, 0.3, 15, 8);
  const lavaMesh1 = new THREE.Mesh(lavaGeo1, fire);
  lavaMesh1.position.set(0, 6, -5.5);
  lavaMesh1.rotation.x = -Math.atan2(9, 12);
  lavaFlowGroup.add(lavaMesh1);

  const lavaGeo2 = new THREE.CylinderGeometry(0.2, 0.2, 12, 8);
  const lavaMesh2 = new THREE.Mesh(lavaGeo2, fire);
  lavaMesh2.position.set(0.4, 7.5, -4.5);
  lavaMesh2.rotation.x = -Math.atan2(9, 12);
  lavaMesh2.rotation.z = 0.05; 
  lavaFlowGroup.add(lavaMesh2);

  const lavaGeo3 = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
  const lavaMesh3 = new THREE.Mesh(lavaGeo3, fire);
  lavaMesh3.position.set(-0.3, 8, -4);
  lavaMesh3.rotation.x = -Math.atan2(9, 12);
  lavaMesh3.rotation.z = -0.05;
  lavaFlowGroup.add(lavaMesh3);

  parts.push({
    name: "Lava Flow",
    description: "Molten rock that spills over the crater rim and flows down the volcano's slopes.",
    material: "fire",
    function: "Reshapes the landscape and adds new material to the volcano's exterior.",
    assemblyOrder: 8,
    connections: ["Crater"],
    failureEffect: "Cools into hardened rock layers (aa or pahoehoe).",
    cascadeFailures: ["Fires", "Road/infrastructure destruction"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 6, z: -15 },
    group: lavaFlowGroup
  });

  // 9. Ash Cloud
  const ashGroup = new THREE.Group();
  const positions = [
    [0, 14, 0], [1.5, 15, 1], [-1.5, 14.5, -1], [0, 16, -1.5],
    [2, 16, 0], [-2, 16.5, 1], [0, 17.5, 0], [3, 15, -2],
    [-3, 15.5, 2], [1, 18, 1], [-1, 18, -1],
    [0, 19, 0], [2, 18.5, -1], [-2, 19, 1]
  ];
  const sizes = [2, 1.8, 1.9, 2.2, 1.7, 2.1, 2.5, 1.5, 1.6, 2.0, 1.8, 2.3, 1.9, 2.0];
  for (let i = 0; i < positions.length; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(sizes[i], 16, 16), lead);
    mesh.position.set(...positions[i]);
    ashGroup.add(mesh);
  }

  parts.push({
    name: "Ash Cloud",
    description: "A massive plume of pulverized rock, minerals, and volcanic gases.",
    material: "lead",
    function: "Disperses tephra over wide areas and releases massive amounts of gas into the atmosphere.",
    assemblyOrder: 9,
    connections: ["Crater"],
    failureEffect: "Causes aviation hazards, global cooling, and ashfall.",
    cascadeFailures: ["Pyroclastic flows if the column collapses"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 25, z: 0 },
    group: ashGroup
  });

  // 10. Volcanic Bombs / Tephra
  const bombGroup = new THREE.Group();
  const bombGeo = new THREE.SphereGeometry(0.3, 8, 8);
  for (let i = 0; i < 6; i++) {
    const bomb = new THREE.Mesh(bombGeo, fire);
    bomb.userData = {
      angle: (i / 6) * Math.PI * 2,
      dist: 10 + Math.random() * 8, 
      arcHeight: 5 + Math.random() * 5,
      phase: Math.random()
    };
    bombGroup.add(bomb);
  }

  parts.push({
    name: "Volcanic Bombs / Tephra",
    description: "Large fragments of molten rock ejected into the air that cool and solidify before hitting the ground.",
    material: "fire",
    function: "Represents the explosive nature of stratovolcano eruptions.",
    assemblyOrder: 10,
    connections: ["Crater"],
    failureEffect: "Impact damage and widespread fires upon landing.",
    cascadeFailures: ["Ignites vegetation"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 20, z: 10 },
    group: bombGroup
  });

  // Add all parts to the main group
  parts.forEach(part => group.add(part.group));

  const description = "A detailed cutaway model of a Stratovolcano (composite volcano), illustrating its internal magma plumbing system, steep layered structure, and eruptive features like ash clouds and lava flows.";

  const quizQuestions = [
    {
      question: "What is the primary difference between a stratovolcano and a shield volcano?",
      options: [
        "Stratovolcanoes have steep, layered profiles, while shield volcanoes are broad and flat.",
        "Shield volcanoes only erupt ash, while stratovolcanoes only erupt lava.",
        "Stratovolcanoes are found exclusively underwater.",
        "Shield volcanoes are much colder than stratovolcanoes."
      ],
      correct: 0,
      explanation: "Stratovolcanoes (composite volcanoes) are built from alternating layers of ash and thick lava, giving them a steep profile. Shield volcanoes are formed by highly fluid lava that flows far, creating a broad, shield-like shape.",
      difficulty: "easy"
    },
    {
      question: "What geographical area contains the highest concentration of stratovolcanoes?",
      options: [
        "The Mid-Atlantic Ridge",
        "The Pacific Ring of Fire",
        "The Himalayan Mountain Range",
        "The East African Rift"
      ],
      correct: 1,
      explanation: "The Pacific Ring of Fire is a horseshoe-shaped belt around the Pacific Ocean characterized by frequent earthquakes and active stratovolcanoes, caused by subduction zones.",
      difficulty: "medium"
    },
    {
      question: "What is a pyroclastic flow?",
      options: [
        "A slow-moving river of molten rock.",
        "A fast-moving current of hot gas and volcanic matter that flows along the ground.",
        "A vertical column of ash rising into the stratosphere.",
        "A type of volcanic earthquake."
      ],
      correct: 1,
      explanation: "A pyroclastic flow is a terrifyingly fast and extremely hot avalanche of gas, ash, and rocks that hugs the ground and destroys almost everything in its path. It is often caused by the collapse of an ash column.",
      difficulty: "medium"
    },
    {
      question: "What is the difference between magma and lava?",
      options: [
        "Magma is hotter than lava.",
        "Lava contains more dissolved gases than magma.",
        "Magma is molten rock underground, while lava is molten rock on the surface.",
        "Magma is found in shield volcanoes, lava is found in stratovolcanoes."
      ],
      correct: 2,
      explanation: "The distinction is purely locational. Molten rock is called magma while it is stored underground, and it is called lava once it erupts onto the Earth's surface.",
      difficulty: "easy"
    },
    {
      question: "How does silica content affect volcanic eruptions?",
      options: [
        "Higher silica makes the magma more viscous (thicker), leading to more explosive eruptions.",
        "Higher silica makes the magma runnier, leading to gentle lava flows.",
        "Silica content changes the color of the ash but has no effect on eruptions.",
        "Higher silica causes the volcano to go dormant permanently."
      ],
      correct: 0,
      explanation: "Silica acts like a thickener in magma. High-silica magma is very viscous, trapping gases until pressure builds up and causes a violently explosive eruption, typical of stratovolcanoes.",
      difficulty: "hard"
    },
    {
      question: "What is a parasitic cone?",
      options: [
        "A type of plant that grows exclusively on volcanic soil.",
        "A secondary volcanic vent formed on the flank of a larger volcano.",
        "The main crater left behind after a massive eruption.",
        "A crystallized rock formation inside the magma chamber."
      ],
      correct: 1,
      explanation: "A parasitic cone (or adventive cone) is a smaller, secondary volcano built on the side of a main volcano. They form when magma finds a path to the surface through fractures (dikes) rather than the central vent.",
      difficulty: "medium"
    }
  ];

  const animate = (time, speed, meshes) => {
    // 0: Magma Chamber - pulsating
    meshes[0].group.scale.setScalar(1 + Math.sin(time * 2 * speed) * 0.02);
    
    // 1: Main Vent - bubbling magma inside
    meshes[1].group.children[0].scale.x = 1 + Math.sin(time * 5 * speed) * 0.05;
    meshes[1].group.children[0].scale.z = 1 + Math.sin(time * 5 * speed) * 0.05;

    // 7: Lava Flow - pulsing
    meshes[7].group.children.forEach(child => {
      child.scale.x = 1 + Math.sin(time * 3 * speed + child.position.y) * 0.05;
      child.scale.z = 1 + Math.sin(time * 3 * speed + child.position.y) * 0.05;
    });

    // 8: Ash Cloud - billowing
    meshes[8].group.children.forEach((child, i) => {
      child.scale.setScalar(1 + Math.sin(time * speed + i) * 0.1);
    });
    meshes[8].group.position.y = Math.sin(time * 0.5 * speed) * 0.5;

    // 9: Volcanic Bombs - launching in parabolic arcs
    const bombGroup = meshes[9].group;
    bombGroup.children.forEach((bomb) => {
      const t = (time * speed * 0.5 + bomb.userData.phase) % 1; 
      const h = bomb.userData.arcHeight;
      const dist = bomb.userData.dist; 
      
      // Fast fake physics for an arc mapping t[0->1] to y[12 -> 0]
      const y = 12 + 4 * h * t - (4 * h + 12) * t * t;
      const r = t * dist;
      
      bomb.position.x = Math.cos(bomb.userData.angle) * r;
      bomb.position.z = Math.sin(bomb.userData.angle) * r;
      bomb.position.y = y;

      bomb.rotation.x += 0.1 * speed;
      bomb.rotation.y += 0.1 * speed;
    });
  };

  return { group, parts, description, quizQuestions, animate };
}

export const create = createVolcano;
