import * as THREE from 'three';

export function createBoronEnergyLevels() {
  const group = new THREE.Group();
  
  // Glowing Quantum Ladder
  const mat = new THREE.MeshBasicMaterial({color: 0x4444ff, transparent: true, opacity: 0.3, wireframe: true});
  
  // n=1 Level
  const n1 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 32), mat);
  n1.position.y = -2;
  group.add(n1);
  
  // n=2 Level
  const n2 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.1, 32), mat);
  n2.position.y = 2;
  group.add(n2);
  
  // Core
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff})));

  // Electrons
  const eGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({color: 0xffff00});
  
  const electrons = [];
  // 2 in n=1
  for(let i=0; i<2; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      n1.add(e);
      electrons.push({mesh: e, radius: 1.5, angle: Math.PI*i, speed: 2.0});
  }
  // 3 in n=2
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      n2.add(e);
      electrons.push({mesh: e, radius: 3.5, angle: (Math.PI*2/3)*i, speed: 1.0});
  }
  
  // Photon flash
  const photon = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending})
  );
  group.add(photon);

  group.userData.animate = function(delta, time) {
      electrons.forEach(e => {
          e.angle -= delta * e.speed;
          e.mesh.position.set(Math.cos(e.angle)*e.radius, 0, Math.sin(e.angle)*e.radius);
      });
      
      // Simulate quantum jump
      const t = time % 4; // 4s cycle
      if (t < 0.1) {
          // Flash photon
          photon.material.opacity = 1.0;
          const jumper = electrons[4].mesh;
          const pos = new THREE.Vector3();
          jumper.getWorldPosition(pos);
          photon.position.copy(pos);
      } else {
          photon.material.opacity = Math.max(0, photon.material.opacity - delta * 2);
          photon.position.y += delta * 5; // photon flies away
      }
      
      group.rotation.x = 0.2;
      group.rotation.z = Math.sin(time*0.5)*0.1;
  };

${infoBlock}
  return group;
}
