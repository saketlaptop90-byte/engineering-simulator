import * as THREE from 'three';

export function createBoronIonicRadius() {
  const group = new THREE.Group();
  
  const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0088ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1
  });
  const matIon = new THREE.MeshPhysicalMaterial({
      color: 0xff0044, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1
  });

  // Neutral Boron (Radius 85 pm -> 3.0 units)
  const neutralGrp = new THREE.Group();
  neutralGrp.position.x = -2;
  neutralGrp.add(new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 32), mat));
  neutralGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  group.add(neutralGrp);
  
  // B3+ Cation (Radius 27 pm -> ~0.95 units)
  const ionGrp = new THREE.Group();
  ionGrp.position.x = 2;
  const ionSphere = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), matIon);
  ionGrp.add(ionSphere);
  ionGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})));
  group.add(ionGrp);

  // Lost electrons floating away
  const eGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const eMat = new THREE.MeshBasicMaterial({color: 0xffff00});
  const electrons = [];
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      e.position.set(2, 0, 0);
      group.add(e);
      electrons.push(e);
  }

  group.add(new THREE.AmbientLight(0xffffff, 1.0));
  group.add(new THREE.DirectionalLight(0xffffff, 2.0).position.set(5,5,5));

  group.userData.animate = function(delta, time) {
      neutralGrp.rotation.y += delta * 0.2;
      ionGrp.rotation.y += delta * 0.5;
      ionSphere.scale.setScalar(1.0 + Math.sin(time*15)*0.05); // heavy pulse from high charge density
      
      const t = time % 3; // 3s loop
      electrons.forEach((e, i) => {
          const angle = (Math.PI*2/3)*i + time;
          const dist = 1.0 + t * 2; // fly away
          e.position.x = 2 + Math.cos(angle)*dist;
          e.position.y = Math.sin(angle)*dist;
          e.position.z = Math.sin(t*2)*0.5;
          
          e.material.transparent = true;
          e.material.opacity = 1.0 - (t / 3);
      });
  };

${infoBlock}
  return group;
}
