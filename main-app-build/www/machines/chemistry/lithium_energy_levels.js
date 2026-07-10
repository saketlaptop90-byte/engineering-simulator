import * as THREE from 'three';
export function createLithiumEnergyLevels() {
  const group = new THREE.Group();
  
  // 3D Potential Energy Wells (Remastered)
  
  // We'll create 3D rings at different heights representing Energy Levels (n=1, n=2, n=3)
  
  const createLevel = (radius, yHeight, color, label) => {
      const g = new THREE.Group();
      
      // The energy "floor"
      const floor = new THREE.Mesh(
          new THREE.RingGeometry(radius-0.5, radius+0.5, 32),
          new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.3, side: THREE.DoubleSide})
      );
      floor.rotation.x = -Math.PI/2;
      g.add(floor);
      
      // Glowing edge
      const edge = new THREE.Mesh(
          new THREE.TorusGeometry(radius+0.5, 0.05, 16, 32),
          new THREE.MeshBasicMaterial({color: color})
      );
      edge.rotation.x = -Math.PI/2;
      g.add(edge);
      
      g.position.y = yHeight;
      return g;
  };
  
  // Energy levels get closer together as you go up
  const level1 = createLevel(2, -4, 0x00ffff, "n=1");
  const level2 = createLevel(4, 0, 0xff00ff, "n=2");
  const level3 = createLevel(6, 2, 0x00ff00, "n=3 (Empty)");
  group.add(level1, level2, level3);
  
  // The Nucleus at the bottom of the gravity/energy well
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  nucleus.position.y = -6;
  group.add(nucleus);
  
  // The 'Energy Well' funnel grid
  const wellGeo = new THREE.CylinderGeometry(8, 0.1, 10, 32, 10, true);
  const wellMat = new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true, transparent: true, opacity: 0.2});
  const well = new THREE.Mesh(wellGeo, wellMat);
  well.position.y = -1;
  group.add(well);
  
  // Electrons sitting on their energy shelves
  const eMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0xffffff});
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), eMat); e1.position.set(0, 0, 2); level1.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), eMat); e2.position.set(0, 0, -2); level1.add(e2);
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), eMat); e3.position.set(4, 0, 0); level2.add(e3);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Orbit electrons on their shelves
      e1.position.set(Math.cos(time*speed)*2, 0, Math.sin(time*speed)*2);
      e2.position.set(Math.cos(time*speed + Math.PI)*2, 0, Math.sin(time*speed + Math.PI)*2);
      e3.position.set(Math.cos(time*speed*0.5)*4, 0, Math.sin(time*speed*0.5)*4);
  };

  return {
    group: group,
    description: "3D Potential Energy Wells (Remastered). Why don't electrons just fall into the nucleus? Because of quantum mechanics! Electrons can only exist at specific, quantized 'Energy Levels', visualized here as shelves in a deep funnel. The nucleus is at the very bottom of the well, pulling everything downward. The two 1s electrons are trapped on the lowest shelf (n=1). The single valence electron is resting on the higher shelf (n=2). If the atom absorbs a photon, the electron can instantly jump up to the n=3 shelf. If it falls back down, it emits a photon! They can never exist in the empty air *between* the shelves.",
    parts: [
      { name: "Wireframe Funnel", material: "Electrostatic Potential Well", function: "The pull of the nucleus creates a 'gravity well' of energy." },
      { name: "Cyan Shelf", material: "n=1 Energy Level", function: "The lowest possible energy state." },
      { name: "Magenta Shelf", material: "n=2 Energy Level", function: "Higher energy state for the valence electron." }
    ],
    quizQuestions: [
      { question: "What happens when an electron jumps from the n=2 shelf to the n=3 shelf?", options: ["It turns into a proton", "It must absorb an exact quantum packet of energy (a photon) to make the jump.", "It falls down", "It becomes a neutron"], correct: 1, explanation: "Energy levels are strictly quantized. An electron cannot make the jump unless it receives the *exact* right amount of energy!" }
    ]
  };
}