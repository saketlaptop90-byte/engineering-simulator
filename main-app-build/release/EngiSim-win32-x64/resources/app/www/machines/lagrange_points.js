export function createLagrangePointsSystem(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // System parameters
  const distance = 20;
  const massRatio = 0.1; // M2 / (M1 + M2) - simplified for visual clarity
  const r1 = distance * massRatio; // distance from barycenter to M1
  const r2 = distance * (1 - massRatio); // distance from barycenter to M2

  // Container for rotating system
  const systemObjects = new THREE.Group();
  group.add(systemObjects);

  // 1. PrimaryBody
  const primaryGeometry = new THREE.SphereGeometry(3, 32, 32);
  const primaryMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x442200 });
  const primaryBody = new THREE.Mesh(primaryGeometry, primaryMaterial);
  primaryBody.position.set(-r1, 0, 0);
  systemObjects.add(primaryBody);
  parts.push({ name: "PrimaryBody", mesh: primaryBody });

  // 2. SecondaryBody
  const secondaryGeometry = new THREE.SphereGeometry(1, 32, 32);
  const secondaryMaterial = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x001144 });
  const secondaryBody = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
  secondaryBody.position.set(r2, 0, 0);
  systemObjects.add(secondaryBody);
  parts.push({ name: "SecondaryBody", mesh: secondaryBody });

  // 3. SystemBarycenter
  const barycenterGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const barycenterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const barycenter = new THREE.Mesh(barycenterGeometry, barycenterMaterial);
  barycenter.position.set(0, 0, 0);
  systemObjects.add(barycenter);
  parts.push({ name: "SystemBarycenter", mesh: barycenter });

  // L-points approximate positions for visualization
  const lGeometry = new THREE.OctahedronGeometry(0.4);
  const unstableMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const stableMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

  // 4. L1 Point
  const l1Dist = r2 - distance * Math.cbrt(massRatio / 3);
  const l1Point = new THREE.Mesh(lGeometry, unstableMat);
  l1Point.position.set(l1Dist, 0, 0);
  systemObjects.add(l1Point);
  parts.push({ name: "L1Point", mesh: l1Point });

  // 5. L2 Point
  const l2Dist = r2 + distance * Math.cbrt(massRatio / 3);
  const l2Point = new THREE.Mesh(lGeometry, unstableMat);
  l2Point.position.set(l2Dist, 0, 0);
  systemObjects.add(l2Point);
  parts.push({ name: "L2Point", mesh: l2Point });

  // 6. L3 Point
  const l3Dist = -(r1 + distance);
  const l3Point = new THREE.Mesh(lGeometry, unstableMat);
  l3Point.position.set(l3Dist, 0, 0);
  systemObjects.add(l3Point);
  parts.push({ name: "L3Point", mesh: l3Point });

  // 7. L4 Point
  const l4Point = new THREE.Mesh(lGeometry, stableMat);
  l4Point.position.set(r2 - distance / 2, 0, distance * Math.sqrt(3) / 2);
  systemObjects.add(l4Point);
  parts.push({ name: "L4Point", mesh: l4Point });

  // 8. L5 Point
  const l5Point = new THREE.Mesh(lGeometry, stableMat);
  l5Point.position.set(r2 - distance / 2, 0, -distance * Math.sqrt(3) / 2);
  systemObjects.add(l5Point);
  parts.push({ name: "L5Point", mesh: l5Point });

  // 9. GravityWellMesh (Reference Grid)
  const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
  gridHelper.position.set(0, -2, 0);
  group.add(gridHelper);
  parts.push({ name: "GravityWellMesh", mesh: gridHelper });

  // 10. OrbitingSatellite
  const satGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const satMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const satellite = new THREE.Mesh(satGeometry, satMaterial);
  satellite.position.copy(l4Point.position);
  systemObjects.add(satellite);
  parts.push({ name: "OrbitingSatellite", mesh: satellite });

  // Animation logic
  const update = (delta, time) => {
    // The entire system rotates around the barycenter
    systemObjects.rotation.y = time * 0.5;

    // Show stable "tadpole" orbit around L4
    const tadpoleX = Math.cos(time * 1.5) * 2;
    const tadpoleZ = Math.sin(time * 1.5) * 1;
    
    satellite.position.x = l4Point.position.x + tadpoleX;
    satellite.position.z = l4Point.position.z + tadpoleZ;
    satellite.rotation.x += delta * 2;
    satellite.rotation.y += delta * 2;
  };

  const quizzes = [
    {
      question: "Which Lagrange points are generally considered stable?",
      options: ["L1 and L2", "L3 and L4", "L4 and L5", "L1, L2, and L3"],
      answer: "L4 and L5"
    },
    {
      question: "Where is the L1 point located in a two-body system?",
      options: ["Between the primary and secondary bodies", "Behind the secondary body", "Behind the primary body", "At a 60-degree angle from the secondary body"],
      answer: "Between the primary and secondary bodies"
    },
    {
      question: "What type of celestial objects commonly occupy the L4 and L5 points of the Sun-Jupiter system?",
      options: ["Comets", "Trojan asteroids", "Dwarf planets", "Exoplanets"],
      answer: "Trojan asteroids"
    },
    {
      question: "The James Webb Space Telescope operates in a halo orbit near which Lagrange point of the Sun-Earth system?",
      options: ["L1", "L2", "L3", "L5"],
      answer: "L2"
    },
    {
      question: "Why are L1, L2, and L3 considered unstable equilibria?",
      options: ["They experience no gravitational forces", "They move faster than the speed of light", "A small perturbation causes objects to exponentially drift away", "They are too close to the primary body to maintain an orbit"],
      answer: "A small perturbation causes objects to exponentially drift away"
    },
    {
      question: "Which physical forces balance perfectly at a Lagrange point in a rotating frame of reference?",
      options: ["Electromagnetism and gravity", "Gravitational pull of two large bodies and the centrifugal force", "Strong and weak nuclear forces", "Friction and tension"],
      answer: "Gravitational pull of two large bodies and the centrifugal force"
    }
  ];

  return {
    group,
    parts,
    update,
    quizzes
  };
}
