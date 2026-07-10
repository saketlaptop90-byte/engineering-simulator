import * as THREE from 'three';
export function createLithiumTreatment() {
  const group = new THREE.Group();
  
  // Lithium Psychiatric Treatment (Remastered)
  
  // The GSK-3 Enzyme (Glycogen synthase kinase 3)
  const enzyme = new THREE.Group();
  const eMat = new THREE.MeshPhysicalMaterial({color: 0xaa00ff, metalness: 0.1, roughness: 0.8, clearcoat: 0.2});
  
  // Build a complex folded protein shape
  for(let i=0; i<30; i++) {
      const blob = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.8 + 0.5, 16, 16), eMat);
      blob.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3);
      enzyme.add(blob);
  }
  group.add(enzyme);
  
  // Magnesium Ion (Normal cofactor that activates the enzyme)
  const mg = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ff00, metalness: 0.5, roughness: 0.2})
  );
  mg.position.set(-4, 2, 0);
  group.add(mg);
  
  // Lithium Ion (Li+) (The medication)
  const li = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.5, roughness: 0.2, emissive: 0x004444})
  );
  li.position.set(4, 2, 0);
  group.add(li);
  
  // Active site on the enzyme
  const site = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.2, 16, 32),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3})
  );
  site.position.set(0, 1.5, 1);
  site.rotation.x = Math.PI/2;
  enzyme.add(site);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      enzyme.rotation.x = Math.sin(time*speed*0.5)*0.1;
      
      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 2) {
          // Magnesium normally binds
          mg.position.lerp(new THREE.Vector3(0, 1.5, 1), 0.1);
          li.position.set(4, 2 + Math.sin(time*speed*2)*0.5, 0);
          site.material.color.setHex(0x00ff00); // Activated!
      } else {
          // Lithium displaces Magnesium!
          mg.position.lerp(new THREE.Vector3(-4, 2, 0), 0.1);
          li.position.lerp(new THREE.Vector3(0, 1.5, 1), 0.1);
          site.material.color.setHex(0xff0000); // Inhibited!
      }
  };

  return {
    group: group,
    description: "Lithium Psychiatric Treatment (Remastered). Lithium isn't just for batteries—it is a life-saving medication used to treat bipolar disorder! In the brain, there is an enzyme called GSK-3, which normally requires a Magnesium ion (green) to activate. However, because Lithium ions (cyan) have similar chemical properties to Magnesium, they can physically wedge themselves into the enzyme's active site! By doing this, Lithium blocks the Magnesium and chemically 'inhibits' the enzyme. This slows down overactive neural pathways, helping to stabilize a patient's mood!",
    parts: [
      { name: "Purple Blob", material: "GSK-3 Enzyme", function: "A protein in the brain linked to mood regulation." },
      { name: "Green Sphere", material: "Magnesium Ion (Mg+2)", function: "Normally activates the enzyme." },
      { name: "Cyan Sphere", material: "Lithium Cation (Li+)", function: "Inhibits the enzyme by taking Magnesium's place." }
    ],
    quizQuestions: [
      { question: "How does Lithium act as a mood stabilizer in the human brain?", options: ["It provides electricity to neurons", "It physically blocks enzymes like GSK-3 by displacing Magnesium ions.", "It melts the brain", "It creates dopamine"], correct: 1, explanation: "Lithium's chemical similarity to Magnesium allows it to act as a competitive inhibitor, slowing down overactive enzyme pathways!" }
    ]
  };
}