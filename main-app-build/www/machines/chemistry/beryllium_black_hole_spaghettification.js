import * as THREE from 'three';
export function createBerylliumSpaghettification() {
  const group = new THREE.Group();
  
  // A black hole
  const bh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000}));
  const accretion = new THREE.Mesh(new THREE.RingGeometry(1.2, 2.5, 64), new THREE.MeshBasicMaterial({color: 0xff8800, side: THREE.DoubleSide, transparent: true, opacity: 0.8}));
  accretion.rotation.x = Math.PI/2 - 0.2;
  bh.position.set(0, -3, 0);
  accretion.position.copy(bh.position);
  group.add(bh, accretion);

  // A Beryllium atom falling in and getting stretched
  const beGrp = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); beGrp.add(nuc);
  const cloud = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 2, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5})); beGrp.add(cloud);
  group.add(beGrp);

  group.userData.animate = function(delta, time, speed) {
      accretion.rotation.z = time * speed * 2;
      
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Falling in
          beGrp.position.set(0, 4 - cycle*6, 0);
          
          // Stretching
          const stretch = 1 + cycle*3;
          nuc.scale.set(1/stretch, stretch, 1/stretch);
          cloud.scale.set(1/stretch, stretch, 1/stretch);
          
          beGrp.material ? beGrp.material.opacity = 1 : null;
      } else {
          // Gone
          beGrp.position.set(0, 10, 0); // Hide
      }
  };

  return {
    group: group,
    description: "Black Hole Spaghettification. If a Beryllium atom falls into a black hole, it experiences 'Tidal Forces'. Because the bottom of the atom is slightly closer to the black hole than the top of the atom, gravity pulls harder on the bottom. The immense difference in gravity literally stretches the Beryllium atom out like a noodle before ripping the nucleus and electrons completely apart.",
    parts: [
      { name: "Black Sphere", material: "Singularity", function: "Infinite density, inescapable gravity." },
      { name: "Orange Disk", material: "Accretion Disk", function: "Superheated plasma swirling the drain." },
      { name: "Stretching Atom", material: "Spaghettification", function: "The Beryllium atom being physically deformed by tidal gravity." }
    ],
    quizQuestions: [
      { question: "Why does the Beryllium atom stretch into a noodle shape?", options: ["Because the black hole is hot", "Because gravity is pulling the bottom of the atom significantly harder than the top of the atom, stretching it out", "Because it wants to be spaghetti", "Because the electrons are escaping"], correct: 1, explanation: "This is called a 'Tidal Force'. The gravity gradient near a black hole is so extreme that even over the microscopic distance of a single atom, the difference in pull is enough to tear it apart." }
    ]
  };
}