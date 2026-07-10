export function createGlacialIceCoreDriller(THREE) {
  const group = new THREE.Group();

  // Materials
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.8 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.9 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x225588, roughness: 0.3, metalness: 0.4 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xddaa00, roughness: 0.4, metalness: 0.3 });
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8, metalness: 0.5 });
  
  // 1. Support frame
  const frameGroup = new THREE.Group();
  const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
  const leg1 = new THREE.Mesh(legGeo, darkMetalMat);
  leg1.position.set(-3, 5, -3);
  const leg2 = new THREE.Mesh(legGeo, darkMetalMat);
  leg2.position.set(3, 5, -3);
  const leg3 = new THREE.Mesh(legGeo, darkMetalMat);
  leg3.position.set(0, 5, 4);
  const topFrameGeo = new THREE.BoxGeometry(7, 0.5, 8);
  const topFrame = new THREE.Mesh(topFrameGeo, darkMetalMat);
  topFrame.position.set(0, 10, 0);
  frameGroup.add(leg1, leg2, leg3, topFrame);
  group.add(frameGroup);

  // 2. Control cabin
  const cabinGeo = new THREE.BoxGeometry(4, 3, 3);
  const cabin = new THREE.Mesh(cabinGeo, blueMat);
  cabin.position.set(-5, 1.5, 0);
  group.add(cabin);

  // 3. Generator
  const genGeo = new THREE.BoxGeometry(3, 2, 2);
  const generator = new THREE.Mesh(genGeo, yellowMat);
  generator.position.set(5, 1, -1);
  group.add(generator);

  // 4. Fluid pump
  const pumpGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
  const pump = new THREE.Mesh(pumpGeo, blueMat);
  pump.rotation.z = Math.PI / 2;
  pump.position.set(5, 0.75, 2);
  group.add(pump);

  // 5. Winch motor
  const winchGroup = new THREE.Group();
  winchGroup.position.set(0, 10.5, 0);
  const winchDrumGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
  const winchDrum = new THREE.Mesh(winchDrumGeo, darkMetalMat);
  winchDrum.rotation.z = Math.PI / 2;
  winchGroup.add(winchDrum);
  group.add(winchGroup);

  // Drill Assembly (moves up and down)
  const drillAssembly = new THREE.Group();
  drillAssembly.position.set(0, 5, 0);

  // 6. Suspension cable
  const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.position.set(0, 2.5, 0);
  drillAssembly.add(cable);

  // 7. Anti-torque skates
  const skateGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
  const skate = new THREE.Mesh(skateGeo, yellowMat);
  skate.position.set(0, 0, 0);
  drillAssembly.add(skate);

  // 8. Drill barrel
  const barrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
  const barrel = new THREE.Mesh(barrelGeo, metalMat);
  barrel.position.set(0, -4, 0);
  drillAssembly.add(barrel);

  // 9. Core catcher
  const catcherGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.5, 16);
  const catcher = new THREE.Mesh(catcherGeo, blueMat);
  catcher.position.set(0, -7.75, 0);
  drillAssembly.add(catcher);

  // 10. Cutting head
  const headGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.5, 16);
  const head = new THREE.Mesh(headGeo, darkMetalMat);
  head.position.set(0, -8.25, 0);
  drillAssembly.add(head);

  group.add(drillAssembly);

  const parts = [
    { name: "Support Frame", description: "Provides structural stability for the drilling operation on the ice surface." },
    { name: "Control Cabin", description: "Houses the operators and computerized control systems for monitoring the drill." },
    { name: "Generator", description: "Supplies electrical power to the entire drilling site, including winch and pumps." },
    { name: "Fluid Pump", description: "Circulates drilling fluid to maintain hydrostatic pressure and remove ice chips." },
    { name: "Winch Motor", description: "Powers the rotation of the drum to raise and lower the drill assembly." },
    { name: "Suspension Cable", description: "A high-tensile electromechanical cable that supports the drill and transmits data/power." },
    { name: "Anti-torque Skates", description: "Engage with the ice borehole wall to prevent the entire drill from spinning during cutting." },
    { name: "Drill Barrel", description: "The main tube that houses the motor section and collects the continuous cylindrical ice core." },
    { name: "Core Catcher", description: "A specialized mechanism near the bottom that breaks the core and holds it during retrieval." },
    { name: "Cutting Head", description: "The rotating bit equipped with sharp cutters that shaves away ice to create the core." }
  ];

  let time = 0;
  const animate = function(delta) {
    time += delta;
    
    // Winch rotation
    winchDrum.rotation.x = time * 2;
    
    // Drill assembly vertical movement (lowering and raising)
    const drillPos = Math.sin(time * 0.5) * 4;
    drillAssembly.position.y = 5 + drillPos;
    
    // Cable stretching to match the drill movement
    const newCableLength = 5.5 - drillPos; // Base length is around 5.5 from winch (y=10.5) to drill skate (y=5+drillPos)
    cable.scale.y = newCableLength / 5;
    cable.position.y = newCableLength / 2;

    // Cutting head rotation
    head.rotation.y = time * 5;
    barrel.rotation.y = time * 5;
  };

  const questions = [
    {
      question: "What is the primary purpose of an ice core driller?",
      options: [
        "To extract liquid water from subglacial lakes",
        "To retrieve continuous cylindrical samples of ice for climate research",
        "To dig foundations for polar research stations",
        "To find oil and gas deposits beneath the ice sheet"
      ],
      correctAnswer: 1
    },
    {
      question: "Why is drilling fluid often used in deep ice core drilling?",
      options: [
        "To keep the ice core warm",
        "To lubricate the winch cable",
        "To prevent the borehole from closing up due to ice pressure",
        "To melt the ice faster"
      ],
      correctAnswer: 2
    },
    {
      question: "What function do the anti-torque skates serve on an electromechanical drill?",
      options: [
        "They help the drill glide over the ice surface",
        "They prevent the drill from freezing to the borehole wall",
        "They stop the upper part of the drill from rotating while the cutting head spins",
        "They cut the ice core into manageable sections"
      ],
      correctAnswer: 2
    },
    {
      question: "What information can scientists NOT typically obtain directly from ice cores?",
      options: [
        "Past atmospheric gas concentrations (e.g., CO2)",
        "Historical temperatures based on isotopic ratios",
        "Records of past volcanic eruptions",
        "The exact population of ancient civilizations"
      ],
      correctAnswer: 3
    },
    {
      question: "What is the role of the core catcher?",
      options: [
        "To analyze the ice core in real-time",
        "To break the core from the bedrock and hold it inside the barrel during retrieval",
        "To catch ice chips before they pollute the sample",
        "To measure the length of the core being drilled"
      ],
      correctAnswer: 1
    },
    {
      question: "Which component is responsible for raising and lowering the entire drill assembly in the borehole?",
      options: [
        "The fluid pump",
        "The core catcher",
        "The winch motor and drum",
        "The generator"
      ],
      correctAnswer: 2
    }
  ];

  return {
    group,
    parts,
    animate,
    questions
  };
}
