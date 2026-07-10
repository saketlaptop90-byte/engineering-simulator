import * as THREE from 'three';
export function createLithiumGrease() {
  const group = new THREE.Group();
  
  // Lithium Grease (Lithium Stearate) (Remastered)
  
  // We will visualize the microscopic structure of Grease!
  // Grease is just oil trapped inside a spongy "soap" matrix.
  // Lithium Stearate is a metallic soap.
  
  const meshGroup = new THREE.Group();
  
  const soapMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.8, opacity: 1, roughness: 0.2});
  const oilMat = new THREE.MeshPhysicalMaterial({color: 0xcccc00, transparent: true, opacity: 0.6, clearcoat: 1.0});
  
  // The Soap Matrix (a tangled fibrous web)
  for(let i=0; i<40; i++) {
      const p1 = new THREE.Vector3((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
      const p2 = new THREE.Vector3((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
      const dist = p1.distanceTo(p2);
      
      const fiber = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 8), soapMat);
      fiber.position.copy(p1).add(p2).multiplyScalar(0.5);
      fiber.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
      meshGroup.add(fiber);
  }
  
  // The Oil (trapped inside the web)
  for(let i=0; i<20; i++) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.5 + 0.5, 16, 16), oilMat);
      drop.position.set((Math.random()-0.5)*6, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
      meshGroup.add(drop);
  }
  
  group.add(meshGroup);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
      
      // Flexing the grease (shear stress)
      const shear = Math.sin(time * speed * 2) * 0.5;
      meshGroup.position.x = shear;
      meshGroup.rotation.z = shear * 0.2;
  };

  return {
    group: group,
    description: "Lithium Grease Structure (Remastered). Did you know that grease is actually a sponge? Liquid lubricating oil drips away, so engineers mix oil with a 'soap' to create a thick, sticky paste. Lithium Stearate is the most common soap used! At a microscopic level, the Lithium soap forms a tangled, fibrous 3D web (the white lines). This web physically traps droplets of liquid oil (the yellow spheres) inside it. When you rub the grease, the web breaks slightly, releasing the oil exactly where it is needed to lubricate your car's wheel bearings!",
    parts: [
      { name: "White Web", material: "Lithium Stearate (Soap)", function: "The structural matrix that makes the grease thick and sticky." },
      { name: "Yellow Droplets", material: "Lubricating Oil", function: "Trapped inside the web until pressure is applied." }
    ],
    quizQuestions: [
      { question: "What is the primary function of the Lithium compound (Lithium Stearate) in mechanical grease?", options: ["To make the grease flammable", "It acts as a 'soap' thickener that forms a microscopic web to trap the liquid lubricating oil.", "To provide electrical power", "To dissolve rust"], correct: 1, explanation: "Without the Lithium soap thickener, the oil would just be a runny liquid and would quickly drip out of the machine gears!" }
    ]
  };
}