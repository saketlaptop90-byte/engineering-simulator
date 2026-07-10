export function createRovTrencher(THREE) {
  const group = new THREE.Group();

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
  const foamMat = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.9 });
  const trackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x0055ff });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xccffff, transparent: true, opacity: 0.6 });

  // 1. Titanium Main Chassis
  const chassisGeo = new THREE.BoxGeometry(4, 2, 6);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(0, 1.5, 0);
  chassis.name = "Titanium Main Chassis";
  chassis.userData.description = "The core structural frame built from high-strength titanium to withstand immense deep-sea pressures.";
  group.add(chassis);

  // 2. Syntactic Foam Buoyancy Block
  const foamGeo = new THREE.BoxGeometry(4.2, 1.5, 6.2);
  const foam = new THREE.Mesh(foamGeo, foamMat);
  foam.position.set(0, 3.25, 0);
  foam.name = "Syntactic Foam Buoyancy Block";
  foam.userData.description = "Provides crucial positive buoyancy to offset the weight of the ROV's heavy equipment.";
  group.add(foam);

  // 3. Tracked Undercarriage
  const tracksGroup = new THREE.Group();
  const trackGeo = new THREE.BoxGeometry(1, 1, 7);
  const leftTrack = new THREE.Mesh(trackGeo, trackMat);
  leftTrack.position.set(-2.5, 0.5, 0);
  const rightTrack = new THREE.Mesh(trackGeo, trackMat);
  rightTrack.position.set(2.5, 0.5, 0);
  tracksGroup.add(leftTrack);
  tracksGroup.add(rightTrack);
  tracksGroup.name = "Tracked Undercarriage";
  tracksGroup.userData.description = "Heavy-duty tracks for traversing the uneven and soft seabed while laying cables.";
  group.add(tracksGroup);

  // 4. High-Pressure Jetting Swords
  const swordGroup = new THREE.Group();
  const swordGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
  const leftSword = new THREE.Mesh(swordGeo, metalMat);
  leftSword.position.set(-1, -1.5, 3);
  const rightSword = new THREE.Mesh(swordGeo, metalMat);
  rightSword.position.set(1, -1.5, 3);
  swordGroup.add(leftSword);
  swordGroup.add(rightSword);
  swordGroup.position.set(0, 1.5, 0);
  swordGroup.name = "High-Pressure Jetting Swords";
  swordGroup.userData.description = "Uses ultra-high-pressure water jets to fluidize the seabed soil, allowing cables to sink into the trench.";
  group.add(swordGroup);

  // 5. Suction Dredge Pipe
  const dredgeGeo = new THREE.CylinderGeometry(0.3, 0.3, 5);
  const dredge = new THREE.Mesh(dredgeGeo, metalMat);
  dredge.rotation.x = Math.PI / 4;
  dredge.position.set(0, 1.5, -3);
  dredge.name = "Suction Dredge Pipe";
  dredge.userData.description = "Removes fluidized spoil and debris from the trench to ensure a clean cable laying path.";
  group.add(dredge);

  // 6. Armored Umbilical Tether
  const tetherGeo = new THREE.CylinderGeometry(0.15, 0.15, 4);
  const tether = new THREE.Mesh(tetherGeo, blackMat);
  tether.position.set(0, 5, 0);
  tether.name = "Armored Umbilical Tether";
  tether.userData.description = "Delivers immense electrical power and optical data telemetry between the surface vessel and the ROV.";
  group.add(tether);

  // 7. HD Camera Array
  const cameraGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const camera = new THREE.Mesh(cameraGeo, glassMat);
  camera.position.set(0, 2, 3.2);
  camera.name = "HD Camera Array";
  camera.userData.description = "High-definition, low-light cameras providing the pilot with clear visuals in murky deep-sea environments.";
  group.add(camera);

  // 8. Hydraulic Power Unit
  const hpuGeo = new THREE.BoxGeometry(1.5, 1, 2);
  const hpu = new THREE.Mesh(hpuGeo, blueMat);
  hpu.position.set(0, 1.5, -1);
  hpu.name = "Hydraulic Power Unit";
  hpu.userData.description = "Converts electrical power into hydraulic pressure to drive the tracks, jetting swords, and manipulator arms.";
  group.add(hpu);

  // 9. LED Lighting Array
  const ledGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1);
  const led = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  led.rotation.x = Math.PI / 2;
  led.position.set(0, 2.5, 3.1);
  led.name = "LED Lighting Array";
  led.userData.description = "High-intensity LED arrays to illuminate the pitch-black ocean floor during operations.";
  group.add(led);

  // 10. Pan-Tilt Sensor Mechanism
  const sensorGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const sensor = new THREE.Mesh(sensorGeo, metalMat);
  sensor.position.set(1.5, 4.2, 2.5);
  sensor.name = "Pan-Tilt Sensor Mechanism";
  sensor.userData.description = "A dynamically articulating mount housing sonars and scanning lasers for precise seabed mapping.";
  group.add(sensor);

  // Animation
  const animator = (time) => {
    // Move the tracks back and forth slightly to simulate driving
    tracksGroup.children[0].position.z = (Math.sin(time * 5) * 0.1);
    tracksGroup.children[1].position.z = (Math.sin(time * 5) * 0.1);

    // Deploy/Retract jetting swords
    swordGroup.rotation.x = Math.sin(time) * 0.2;

    // Sway the tether
    tether.rotation.z = Math.sin(time * 1.5) * 0.05;
  };

  // Quiz Questions
  const quiz = [
    {
      question: "What is the primary function of an ROV Trencher's jetting swords?",
      options: [
        "To cut through solid rock",
        "To fluidize the seabed soil with high-pressure water",
        "To weld underwater pipelines",
        "To cut abandoned underwater cables"
      ],
      correctAnswer: 1
    },
    {
      question: "Why is syntactic foam used extensively on deep-sea ROVs?",
      options: [
        "It provides thermal insulation for the electronics",
        "It absorbs acoustic signals to remain undetected",
        "It provides structural rigidity to the chassis",
        "It provides positive buoyancy to offset heavy equipment"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the umbilical tether supply to the ROV?",
      options: [
        "Hydraulic fluid and air",
        "Buoyancy control gas",
        "Electrical power and fiber-optic data telemetry",
        "Pressurized water for the jetting swords"
      ],
      correctAnswer: 2
    },
    {
      question: "What component is typically responsible for converting electrical energy into mechanical movement for tracks and manipulators on a heavy work-class ROV?",
      options: [
        "Pneumatic air compressor",
        "Hydraulic Power Unit (HPU)",
        "Direct drive electric motors",
        "Combustion engine"
      ],
      correctAnswer: 1
    },
    {
      question: "In subsea trenching, what is the purpose of a suction dredge pipe?",
      options: [
        "To vacuum up marine life before trenching",
        "To suck away fluidized soil and debris from the trench",
        "To anchor the ROV to the seabed",
        "To sample the water for chemical analysis"
      ],
      correctAnswer: 1
    },
    {
      question: "Why are titanium alloys frequently chosen for deep-sea ROV main chassis components?",
      options: [
        "They are the cheapest metal available",
        "They have excellent strength-to-weight ratios and corrosion resistance",
        "They are naturally buoyant in seawater",
        "They block harmful radiation from the seabed"
      ],
      correctAnswer: 1
    }
  ];

  return {
    model: group,
    animator: animator,
    quiz: quiz
  };
}
