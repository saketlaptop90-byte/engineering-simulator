export function createOrbitalResonanceSystem(THREE) {
  const group = new THREE.Group();

  // 1. Central gas giant planet
  const planetGeom = new THREE.SphereGeometry(4, 32, 32);
  const planetMat = new THREE.MeshStandardMaterial({ 
    color: 0xd2a878, 
    roughness: 0.5 
  });
  const planet = new THREE.Mesh(planetGeom, planetMat);
  group.add(planet);

  // 2. Planet ring system
  const ringsGeom = new THREE.RingGeometry(5, 8, 64);
  const ringsMat = new THREE.MeshBasicMaterial({ 
    color: 0xaaaaaa, 
    transparent: true, 
    opacity: 0.5, 
    side: THREE.DoubleSide 
  });
  const rings = new THREE.Mesh(ringsGeom, ringsMat);
  rings.rotation.x = Math.PI / 2;
  group.add(rings);

  // Distances based roughly on Kepler's 3rd Law for 1:2:4 resonance
  const dIo = 12;
  const dEu = 19.04;
  const dGa = 30.24;

  // 3. Io orbital path
  const ioPathGeom = new THREE.TorusGeometry(dIo, 0.05, 8, 64);
  const pathMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
  const ioPath = new THREE.Mesh(ioPathGeom, pathMat);
  ioPath.rotation.x = Math.PI / 2;
  group.add(ioPath);

  // 4. Europa orbital path
  const euPathGeom = new THREE.TorusGeometry(dEu, 0.05, 8, 64);
  const euPath = new THREE.Mesh(euPathGeom, pathMat);
  euPath.rotation.x = Math.PI / 2;
  group.add(euPath);

  // 5. Ganymede orbital path
  const gaPathGeom = new THREE.TorusGeometry(dGa, 0.05, 8, 64);
  const gaPath = new THREE.Mesh(gaPathGeom, pathMat);
  gaPath.rotation.x = Math.PI / 2;
  group.add(gaPath);

  // 6. Moon Io
  const ioGeom = new THREE.SphereGeometry(0.6, 16, 16);
  const ioMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const io = new THREE.Mesh(ioGeom, ioMat);
  group.add(io);

  // 7. Tidal heating glow on Io
  const ioGlowGeom = new THREE.SphereGeometry(0.8, 16, 16);
  const ioGlowMat = new THREE.MeshBasicMaterial({ 
    color: 0xff4400, 
    transparent: true, 
    opacity: 0.6,
    blending: THREE.AdditiveBlending 
  });
  const ioGlow = new THREE.Mesh(ioGlowGeom, ioGlowMat);
  group.add(ioGlow);

  // 8. Moon Europa
  const euGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const euMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const europa = new THREE.Mesh(euGeom, euMat);
  group.add(europa);

  // 9. Sub-surface ocean glow on Europa
  const euGlowGeom = new THREE.SphereGeometry(0.65, 16, 16);
  const euGlowMat = new THREE.MeshBasicMaterial({ 
    color: 0x0088ff, 
    transparent: true, 
    opacity: 0.4,
    blending: THREE.AdditiveBlending 
  });
  const europaGlow = new THREE.Mesh(euGlowGeom, euGlowMat);
  group.add(europaGlow);

  // 10. Moon Ganymede
  const gaGeom = new THREE.SphereGeometry(0.8, 16, 16);
  const gaMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const ganymede = new THREE.Mesh(gaGeom, gaMat);
  group.add(ganymede);

  let time = 0;

  group.userData.update = (dt) => {
    time += dt;

    // Resonant speeds: Ganymede=1x, Europa=2x, Io=4x
    const speedGa = 0.5;
    const speedEu = speedGa * 2;
    const speedIo = speedGa * 4;

    // Io position and glow
    const aIo = time * speedIo;
    io.position.set(Math.cos(aIo) * dIo, 0, Math.sin(aIo) * dIo);
    ioGlow.position.copy(io.position);

    // Europa position and glow
    const aEu = time * speedEu;
    europa.position.set(Math.cos(aEu) * dEu, 0, Math.sin(aEu) * dEu);
    europaGlow.position.copy(europa.position);

    // Ganymede position
    const aGa = time * speedGa;
    ganymede.position.set(Math.cos(aGa) * dGa, 0, Math.sin(aGa) * dGa);

    // Celestial body rotations
    planet.rotation.y += dt * 0.2;
    rings.rotation.z -= dt * 0.1; // Rotated along Z because of Math.PI / 2 on X
    io.rotation.y += dt * 1.5;
    europa.rotation.y += dt * 1.0;
    ganymede.rotation.y += dt * 0.5;

    // Pulsing opacities to simulate tidal forces
    ioGlow.material.opacity = 0.3 + 0.5 * Math.abs(Math.sin(time * speedIo * 2));
    europaGlow.material.opacity = 0.2 + 0.4 * Math.abs(Math.sin(time * speedEu * 2));
  };

  group.userData.quiz = [
    {
      question: "What is the orbital resonance ratio of Jupiter's moons Io, Europa, and Ganymede?",
      options: ["1:1:1", "1:2:4", "4:2:1", "2:3:4"],
      correctAnswer: 2
    },
    {
      question: "Which moon experiences the most intense tidal heating due to its close orbit and resonance?",
      options: ["Europa", "Ganymede", "Callisto", "Io"],
      correctAnswer: 3
    },
    {
      question: "According to Kepler's Third Law, how does a moon's orbital period (T) relate to its orbital radius (R)?",
      options: ["T is proportional to R", "T squared is proportional to R cubed", "T cubed is proportional to R squared", "T is inversely proportional to R"],
      correctAnswer: 1
    },
    {
      question: "What physical phenomenon is primarily responsible for maintaining a liquid subsurface ocean on Europa?",
      options: ["Solar radiation", "Core radioactivity", "Tidal heating", "Atmospheric greenhouse effect"],
      correctAnswer: 2
    },
    {
      question: "Why are these specific orbital resonances (Laplace resonances) stable over long periods?",
      options: ["The moons don't have enough mass to affect each other", "The periodic gravitational tugs are self-correcting", "Jupiter's magnetic field holds them in place", "They orbit at the exact same speed"],
      correctAnswer: 1
    },
    {
      question: "What would happen to Io's volcanic activity if it were moved into a perfectly circular, non-resonant orbit?",
      options: ["It would increase significantly", "It would remain the same", "It would slowly cease as tidal heating stopped", "The moon would break apart"],
      correctAnswer: 2
    }
  ];

  return group;
}
