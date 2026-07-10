import * as THREE from 'three';
export function createLithiumElectronElectronRepulsion() {
  const group = new THREE.Group();
  
  // Electron-Electron Repulsion (Remastered)
  
  // The Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000})));
  
  // The 1s Orbital boundary (wireframe sphere)
  const shell = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true, transparent: true, opacity: 0.2})
  );
  group.add(shell);
  
  // Two electrons trapped in the same 1s orbital
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x004444}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x004444}));
  group.add(e1, e2);
  
  // The repulsive force field between them (a cylinder that stretches between them)
  const repelForce = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1),
      new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.8})
  );
  // Re-orient cylinder to point along Z so lookAt works
  repelForce.geometry.rotateX(Math.PI/2);
  group.add(repelForce);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // They orbit, but their paths are constantly altered to avoid each other!
      const t1 = time * speed * 1.5;
      const t2 = time * speed * 1.7; // slightly different speed
      
      // Base positions
      let p1 = new THREE.Vector3(Math.cos(t1)*3, Math.sin(t1)*2, Math.sin(t1)*3);
      let p2 = new THREE.Vector3(Math.cos(t2)*3, Math.sin(t2)*3, Math.cos(t2*1.5)*3);
      
      // Repulsion vector
      const dist = p1.distanceTo(p2);
      if (dist < 4) {
          // If they get too close, push them apart!
          const push = new THREE.Vector3().subVectors(p1, p2).normalize().multiplyScalar((4 - dist)*0.5);
          p1.add(push);
          p2.sub(push);
      }
      
      e1.position.copy(p1);
      e2.position.copy(p2);
      
      // Update the repulsive visual cylinder
      const actualDist = e1.position.distanceTo(e2.position);
      repelForce.position.copy(e1.position).lerp(e2.position, 0.5);
      repelForce.lookAt(e2.position);
      repelForce.scale.z = actualDist;
      
      // Color intensity based on closeness
      const forceStr = Math.max(0, 5 - actualDist);
      repelForce.scale.x = repelForce.scale.y = 1 + forceStr*0.5;
      repelForce.material.opacity = forceStr * 0.3;
  };

  return {
    group: group,
    description: "Electron-Electron Repulsion (Remastered). Because all electrons have a negative (-1) charge, they fiercely repel each other! Lithium has two core electrons crammed together inside the tiny 1s orbital. Notice how they move? They are both being pulled inward by the nucleus, but they are simultaneously pushing each other away! The magenta cylinder represents this electrostatic repulsive force. If their orbits accidentally bring them too close, the repulsion violently pushes them to opposite sides of the atom. This constant balancing act between nuclear attraction and electron repulsion dictates the final size and shape of every atom in the universe!",
    parts: [
      { name: "Cyan Spheres", material: "Core Electrons", function: "Negatively charged, so they repel each other." },
      { name: "Magenta Cylinder", material: "Repulsive Force", function: "Grows thicker and brighter when the electrons are forced too close together." }
    ],
    quizQuestions: [
      { question: "Why don't the two 1s electrons crash into each other?", options: ["Because they are polite", "Because their identical negative charges create a massive repulsive force that pushes them apart.", "Because the nucleus stops them", "Because they are positive"], correct: 1, explanation: "Like charges repel! The closer they get, the stronger the repulsion becomes, preventing them from ever touching." }
    ]
  };
}