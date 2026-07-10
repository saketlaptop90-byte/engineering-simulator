import * as THREE from 'three';

export function createBerylliumOrbitalFillingSequence() {
  const group = new THREE.Group();
  
  // Visualize a timeline/sequence of filling
  // We'll have a container for 1s, and a container for 2s
  
  const createSubshell = (x, color, label) => {
      const g = new THREE.Group();
      const shell = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhysicalMaterial({color: color, transparent: true, opacity: 0.3, transmission: 0.8, side: THREE.DoubleSide}));
      g.add(shell);
      g.position.x = x;
      return g;
  };
  
  const s1 = createSubshell(-2.5, 0xffaa00, "1s");
  const s2 = createSubshell(2.5, 0x00aaff, "2s");
  
  group.add(s1);
  group.add(s2);

  // 4 electrons that fly into their places
  const electrons = [];
  const eMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  
  for(let i=0; i<4; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
      // Start high up
      e.position.set(0, 5, 0);
      group.add(e);
      
      let targetX = i < 2 ? -2.5 : 2.5; // First two to 1s, next two to 2s
      let targetRot = i % 2 === 0 ? 0 : Math.PI;
      
      electrons.push({
          mesh: e,
          targetX: targetX,
          delay: i * 2, // 2 second delay between each
          state: 0, // 0=waiting, 1=falling, 2=orbiting
          angle: targetRot
      });
  }

  // Connecting arrow
  const arrowGeo = new THREE.CylinderGeometry(0.1, 0.3, 2, 16);
  arrowGeo.rotateZ(-Math.PI/2);
  const arrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({color: 0x555555}));
  arrow.position.set(0, 0, 0);
  group.add(arrow);

  group.userData.animate = function(delta, time) {
      // Loop sequence every 10 seconds
      const localTime = time % 10;
      
      electrons.forEach(el => {
          if(localTime < el.delay) {
              el.mesh.position.set(0, 5, 0);
          } else if(localTime >= el.delay && localTime < el.delay + 1) {
              // Falling interpolation (1 second duration)
              const t = localTime - el.delay;
              el.mesh.position.x = THREE.MathUtils.lerp(0, el.targetX, t);
              el.mesh.position.y = THREE.MathUtils.lerp(5, 0, t);
          } else {
              // Orbiting
              el.angle += delta * 2;
              el.mesh.position.x = el.targetX + Math.cos(el.angle) * 1.0;
              el.mesh.position.y = 0;
              el.mesh.position.z = Math.sin(el.angle) * 1.0;
          }
      });
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Orbital Filling Sequence": "Follows the Aufbau principle: 1s -> 2s. The 1s subshell fills completely with 2 electrons before the 2s subshell begins filling.",
    "Valence Electrons": "2 electrons in the outermost 2s shell. These participate in chemical bonding.",
    "Core Electrons": "2 electrons tightly bound in the 1s shell. They do not participate in bonding and strongly shield the nucleus.",
    "Atomic Radius": "105 pm (Empirical). The distance from the center of the nucleus to the boundary of the surrounding electron cloud.",
    "Ionic Radius": "45 pm (for Be2+). When Beryllium loses its 2 valence electrons, the remaining 1s shell is pulled much closer by the +4 nuclear charge, shrinking the radius dramatically."
  };

  return group;
}
