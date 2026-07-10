import * as THREE from 'three';
export function createLithiumTritiumBreeding() {
  const group = new THREE.Group();
  
  // Tritium Breeding in a Fusion Reactor (Remastered)
  
  // The Target: Lithium-6 Nucleus
  const target = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.3, roughness: 0.2});
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.3, roughness: 0.2});
  
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat); p1.position.set(0.3,0,0.3);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat); p2.position.set(-0.3,0.3,0);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat); p3.position.set(0,-0.3,-0.3);
  
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat); n1.position.set(-0.3,-0.3,0.3);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat); n2.position.set(0.3,0.3,0);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat); n3.position.set(0,0,-0.3);
  
  target.add(p1, p2, p3, n1, n2, n3);
  group.add(target);
  
  // Incoming Neutron
  const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat);
  group.add(bullet);
  
  // Flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, opacity: 0}));
  group.add(flash);
  
  // Products: Tritium (1P, 2N) and Helium-4 (2P, 2N)
  const tritium = new THREE.Group();
  tritium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat).position.set(0,0,0));
  tritium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat).position.set(0.5,0,0));
  tritium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat).position.set(-0.5,0,0));
  tritium.visible = false;
  group.add(tritium);
  
  const helium = new THREE.Group();
  helium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat).position.set(0.3,0,0.3));
  helium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat).position.set(-0.3,0,-0.3));
  helium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat).position.set(-0.3,0,0.3));
  helium.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat).position.set(0.3,0,-0.3));
  helium.visible = false;
  group.add(helium);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 1) {
          // Neutron approaches
          target.visible = true;
          tritium.visible = false;
          helium.visible = false;
          flash.material.opacity = 0;
          
          bullet.visible = true;
          bullet.position.set(-8 + cycle * 8, 0, 0);
      } else if (cycle < 1.2) {
          // IMPACT!
          target.visible = false;
          bullet.visible = false;
          flash.material.opacity = 1.0 - (cycle - 1)*5;
          flash.scale.setScalar(1 + (cycle - 1)*10);
      } else {
          // SPLIT!
          tritium.visible = true;
          helium.visible = true;
          flash.material.opacity = 0;
          
          const t = cycle - 1.2;
          tritium.position.set(t*5, t*3, 0);
          tritium.rotation.z = t * 5;
          
          helium.position.set(t*4, -t*4, 0);
          helium.rotation.z = -t * 5;
      }
  };

  return {
    group: group,
    description: "Tritium Breeding (Remastered). Nuclear fusion reactors run on a super-heavy isotope of Hydrogen called Tritium. The problem? Tritium doesn't exist in nature—it is radioactive and decays very quickly. The solution? We make it on demand inside the reactor! The reactor walls are lined with "blankets" of solid Lithium-6. When the fusion reaction shoots out high-speed neutrons, they smash into the Lithium-6 atoms. The impact shatters the Lithium nucleus, perfectly splitting it into a Helium atom and a fresh Tritium atom, which is immediately swept back into the reactor as fuel!",
    parts: [
      { name: "Left Cluster", material: "Lithium-6", function: "The breeding target blanket." },
      { name: "Incoming Blue Sphere", material: "Neutron", function: "Fired from the core fusion reaction." },
      { name: "Right Clusters", material: "Helium & Tritium", function: "The fractured products of the collision." }
    ],
    quizQuestions: [
      { question: "Why do scientists surround fusion reactors with blankets of Lithium?", options: ["To keep the reactor warm", "To catch stray neutrons and breed fresh Tritium fuel on demand.", "To block radiation", "To make batteries"], correct: 1, explanation: "This brilliant closed-loop system means the reactor literally manufactures its own fuel as it runs!" }
    ]
  };
}