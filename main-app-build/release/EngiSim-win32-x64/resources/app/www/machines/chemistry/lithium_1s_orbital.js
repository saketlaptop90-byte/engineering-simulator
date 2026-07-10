import * as THREE from 'three';
export function createLithium1sOrbital() {
  const group = new THREE.Group();
  
  // 1s vs 2s Orbital Cross Section (Remastered)
  
  // We will build a volumetric shell representation but cut it in half so the user can see inside.
  
  const createHalfShell = (radius, colorHex, opacityVal) => {
      const geo = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI); // Half sphere
      const mat = new THREE.MeshPhysicalMaterial({
          color: colorHex,
          transparent: true,
          opacity: opacityVal,
          side: THREE.DoubleSide,
          roughness: 0.1,
          metalness: 0.1,
          clearcoat: 1.0,
          depthWrite: false
      });
      return new THREE.Mesh(geo, mat);
  };
  
  const innerShell = createHalfShell(1.5, 0x00ffff, 0.8);
  group.add(innerShell);
  
  const outerShell = createHalfShell(4.0, 0xff00ff, 0.4);
  group.add(outerShell);
  
  // The Nucleus
  const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0xff4444})
  );
  group.add(nucleus);
  
  // A grid plane to give spatial context
  const grid = new THREE.GridHelper(10, 10, 0xffffff, 0x444444);
  grid.position.y = -0.01; // slightly below to avoid Z-fighting
  group.add(grid);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.2) * 1.5; // Sweep back and forth to show the cross section
      group.rotation.x = 0.2;
      
      // Pulse the outer shell
      outerShell.scale.setScalar(1 + Math.sin(time*speed*2)*0.05);
  };

  return {
    group: group,
    description: "Orbital Cross Section (Remastered). This model is sliced in half so you can see the internal structure of the Lithium atom! The tiny glowing dot in the center is the nucleus. The dense cyan shell is the 1s orbital, which is tightly packed with 2 electrons. The massive, faint magenta shell is the 2s orbital, which contains only 1 valence electron. Notice how much larger the 2s orbital is! Because that outer electron is so far away from the positive pull of the nucleus, it is barely held on, which is exactly why Lithium gives it away so easily to form chemical bonds.",
    parts: [
      { name: "Cyan Inner Shell", material: "1s Orbital", function: "High electron density, tightly bound." },
      { name: "Magenta Outer Shell", material: "2s Orbital", function: "Low electron density, weakly bound and massive in size." }
    ],
    quizQuestions: [
      { question: "Why is the 2s orbital so much larger and fainter than the 1s orbital?", options: ["Because it has more electrons", "Because it represents a higher energy level, meaning the electron spends most of its time much further away from the nucleus.", "Because it is melting", "Because it is a noble gas"], correct: 1, explanation: "Higher energy levels (n=2, n=3, etc.) are physically larger. This distance from the nucleus is what makes valence electrons so reactive!" }
    ]
  };
}