import * as THREE from 'three';
export function createLithiumShieldingEffect() {
  const group = new THREE.Group();
  
  // The Shielding Effect (Remastered)
  
  // Nucleus (+3)
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  group.add(nucleus);
  
  // The "Shield" - a spherical barrier created by the two 1s core electrons
  const shield = new THREE.Mesh(
      new THREE.SphereGeometry(2, 64, 64),
      new THREE.MeshPhysicalMaterial({
          color: 0x00ffff, 
          transparent: true, 
          opacity: 0.3, 
          transmission: 0.8,
          side: THREE.DoubleSide
      })
  );
  group.add(shield);
  
  // The 2 core electrons whizzing around inside the shield
  const coreGroup = new THREE.Group();
  const eMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x004444});
  const ce1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
  const ce2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
  coreGroup.add(ce1, ce2);
  group.add(coreGroup);
  
  // The 1 valence electron wandering far outside the shield
  const ve = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff00ff, emissive: 0x440044}));
  ve.position.set(6, 0, 0);
  group.add(ve);
  
  // Rays of positive force trying to reach the valence electron
  const rays = new THREE.Group();
  const rayGeo = new THREE.CylinderGeometry(0.02, 0.02, 6);
  rayGeo.rotateX(Math.PI/2);
  const rayMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
  
  for(let i=0; i<30; i++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      // Random direction
      const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
      ray.position.copy(dir).multiplyScalar(3);
      ray.lookAt(new THREE.Vector3(0,0,0));
      rays.add(ray);
  }
  group.add(rays);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      // Fast core electrons
      ce1.position.set(Math.cos(time*speed*5)*1.8, Math.sin(time*speed*7)*1.8, Math.sin(time*speed*5)*1.8);
      ce2.position.set(Math.sin(time*speed*4)*1.8, Math.cos(time*speed*6)*1.8, Math.cos(time*speed*4)*1.8);
      
      // Slow valence electron
      ve.position.set(Math.cos(time*speed*0.5)*6, 0, Math.sin(time*speed*0.5)*6);
      
      // Pulse the shield to show it blocking the red rays
      shield.scale.setScalar(1 + Math.sin(time*speed*2)*0.02);
      
      // Make the red rays flash and get cut off at the shield boundary
      rays.children.forEach(ray => {
          ray.scale.z = 0.5 + Math.random()*0.1; // cut off at radius ~3
          ray.material.opacity = 0.2 + Math.random()*0.5;
      });
  };

  return {
    group: group,
    description: "The Shielding Effect (Remastered). The Lithium nucleus has 3 protons, so it emits a strong +3 attractive pull (the red rays). So why is Lithium's single valence electron (magenta) held so loosely? Because it is being physically 'shielded' by the two core electrons (cyan)! Those two core electrons zip around the nucleus so incredibly fast that they create a solid spherical barrier of negative charge (the glass shield). As the positive red rays try to reach the outer valence electron, they smash into this negative shield and are canceled out! This phenomenon is called 'Electron Shielding'.",
    parts: [
      { name: "Cyan Glass Sphere", material: "Electron Shield", function: "The physical barrier created by the inner 1s electrons." },
      { name: "Red Rays", material: "Nuclear Pull", function: "The positive charge attempting to reach the outer electron." },
      { name: "Magenta Dot", material: "Valence Electron", function: "Loosely held because the core electrons block the nuclear pull." }
    ],
    quizQuestions: [
      { question: "What causes the 'Shielding Effect' in atoms?", options: ["The neutrons block the protons", "Inner core electrons repel outer valence electrons, canceling out part of the positive pull from the nucleus.", "The nucleus gets tired", "Protons repel each other"], correct: 1, explanation: "Core electrons act like an umbrella, blocking the 'rain' of positive charge from reaching the electrons standing on the outside!" }
    ]
  };
}