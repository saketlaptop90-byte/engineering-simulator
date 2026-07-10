import * as THREE from 'three';
export function createBoronThomson() {
  const group = new THREE.Group();
  
  // Thomson "Plum Pudding" Model (1904) - Upgraded (Wobbly Jelly Physics)
  
  // The positive 'jelly' sphere
  const jellyGeo = new THREE.SphereGeometry(3, 64, 64);
  const jellyMat = new THREE.MeshPhysicalMaterial({
      color: 0xff0044, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.2
  });
  const jelly = new THREE.Mesh(jellyGeo, jellyMat);
  group.add(jelly);

  // Original vertices for jelly wobble
  const originalVertices = jellyGeo.attributes.position.array.slice();
  
  // The negative 'plums' (Electrons)
  const plums = new THREE.Group();
  const eMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.8, roughness: 0.2});
  
  for(let i=0; i<5; i++) {
      const plum = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), eMat);
      // Randomly embedded inside the jelly
      const r = Math.random() * 2;
      const u = Math.random(); const v = Math.random();
      const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
      plum.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
      );
      // add a point light so they glow inside the jelly
      const light = new THREE.PointLight(0x00ffff, 1, 3);
      plum.add(light);
      
      plums.add(plum);
  }
  group.add(plums);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  group.add(ambient);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.z = Math.sin(time*speed*0.2)*0.1;
      
      // Procedural Jelly Wobble
      const posAttr = jelly.geometry.attributes.position;
      const v = new THREE.Vector3();
      for(let i=0; i<posAttr.count; i++) {
          v.fromArray(originalVertices, i*3);
          // Complex noise-like wobble based on position and time
          const noise = Math.sin(v.x * 2 + time * speed * 3) * Math.cos(v.y * 2 + time * speed * 2) * Math.sin(v.z * 2 + time * speed * 4);
          v.multiplyScalar(1 + noise * 0.05); // 5% wobble
          
          posAttr.setXYZ(i, v.x, v.y, v.z);
      }
      posAttr.needsUpdate = true;
      jelly.geometry.computeVertexNormals(); // Fix lighting on distorted mesh
      
      // Plums slowly drift through the jelly
      plums.children.forEach((plum, idx) => {
          plum.position.y += Math.sin(time*speed*2 + idx)*0.01;
          plum.position.x += Math.cos(time*speed*3 + idx)*0.01;
      });
  };

  return {
    group: group,
    description: "Thomson 'Plum Pudding' Model (1904) - Upgraded. Before the nucleus was discovered, J.J. Thomson thought the atom was a solid sphere of positively charged 'jelly' with negatively charged electrons embedded inside it like plums in a pudding! This upgraded model uses high-end refraction and real-time vertex displacement to simulate the wobbly, translucent positive jelly, with the glowing electrons slowly drifting inside it.",
    parts: [
      { name: "Red Wobbly Glass", material: "Positive Jelly", function: "A uniform soup of positive charge (debunked)." },
      { name: "Cyan Spheres", material: "Electrons (Plums)", function: "Floating helplessly in the soup." }
    ],
    quizQuestions: [
      { question: "How did Ernest Rutherford prove that this 'Plum Pudding' model was completely wrong?", options: ["He ate it", "He fired radiation at gold foil. Instead of passing through the 'jelly', some of the radiation violently bounced backward, proving there was a dense, hard nucleus hidden inside!", "He weighed it", "He set it on fire"], correct: 1, explanation: "Rutherford's Gold Foil experiment changed history. He proved the atom isn't solid jelly; it is 99.999% empty space, with a tiny, indestructible core in the middle." }
    ]
  };
}