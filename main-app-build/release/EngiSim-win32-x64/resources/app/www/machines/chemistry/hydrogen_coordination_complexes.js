import * as THREE from 'three';
export function createHydrogenCoordinationComplexes() {
  const group = new THREE.Group();
  
  // Diborane (B2H6) - 3-center-2-electron bond
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshPhysicalMaterial({color: 0xffaaaa, roughness: 0.5}));
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32,32), new THREE.MeshPhysicalMaterial({color: 0xffaaaa, roughness: 0.5}));
  b1.position.set(-1.5, 0, 0); b2.position.set(1.5, 0, 0);
  group.add(b1, b2);

  // Terminal Hydrogens
  const createH = (x,y,z) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
      h.position.set(x,y,z);
      return h;
  };
  group.add(createH(-2.5, 1, 0), createH(-2.5, -1, 0), createH(2.5, 1, 0), createH(2.5, -1, 0));

  // Bridging Hydrogens (The unique coordination)
  const bh1 = createH(0, 1.2, 0);
  const bh2 = createH(0, -1.2, 0);
  group.add(bh1, bh2);

  // Banana Bonds (3-center-2-electron)
  const curve1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32, Math.PI), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  curve1.position.y = 0; curve1.rotation.x = Math.PI/2;
  const curve2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32, Math.PI), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
  curve2.position.y = 0; curve2.rotation.x = Math.PI/2; curve2.rotation.z = Math.PI;
  group.add(curve1, curve2);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed)*0.5;
      group.rotation.y = time * speed * 0.5;
  };

  return {
    group: group,
    description: "Coordination & Bridging Bonds (e.g., Diborane B2H6). Hydrogen can act as a 'bridge' between two metal or metalloid atoms. In Diborane, the bridging Hydrogens share just TWO electrons across THREE atoms (Boron-Hydrogen-Boron), creating a curved 'banana bond'.",
    parts: [
      { name: "Boron Atoms", material: "Pink", function: "Electron deficient atoms." },
      { name: "Bridging Hydrogens", material: "Center White Spheres", function: "Coordinating to two Borons simultaneously." },
      { name: "Banana Bond", material: "Green Arc", function: "A 3-center-2-electron (3c-2e) bond defying standard Lewis structures." }
    ],
    quizQuestions: [
      { question: "In Diborane (B2H6), how many total electrons make up the bond bridging the two Borons via a single Hydrogen atom?", options: ["4", "2", "6", "0"], correct: 1, explanation: "This is a classic '3-center-2-electron' bond. Instead of the standard 2 atoms sharing 2 electrons, here 3 atoms (B-H-B) share the same 2 electrons, forming a delocalized 'banana' shaped bond." }
    ]
  };
}