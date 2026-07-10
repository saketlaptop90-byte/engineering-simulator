import * as THREE from 'three';
export function createLithiumAtomicRadius() {
  const group = new THREE.Group();
  
  // Atomic Radius (Remastered)
  
  // The Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  // The outer valence boundary (90% probability isosurface)
  const boundary = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.1, wireframe: true})
  );
  group.add(boundary);
  
  // A glowing ruler stretching from the center to the edge
  const ruler = new THREE.Group();
  
  // The line
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  line.rotation.z = Math.PI/2;
  line.position.x = 2; // shift center
  ruler.add(line);
  
  // Tick marks
  for(let i=1; i<=4; i++) {
      const tick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), new THREE.MeshBasicMaterial({color: 0x00ff00}));
      tick.position.set(i, 0, 0);
      ruler.add(tick);
  }
  
  // Text label (using basic geometry to simulate text for now, or just an arrow)
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  arrow.rotation.z = -Math.PI/2;
  arrow.position.x = 4;
  ruler.add(arrow);
  
  // Add a 3D sprite label
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('152 pm', 128, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true}));
  sprite.position.set(2, 0.8, 0);
  sprite.scale.set(3, 1.5, 1);
  ruler.add(sprite);

  group.add(ruler);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Ruler scans the perimeter
      ruler.rotation.x = time * speed * 0.5;
      
      // Boundary pulses
      boundary.scale.setScalar(1 + Math.sin(time*speed*3)*0.02);
  };

  return {
    group: group,
    description: "Atomic Radius (Remastered). How big is an atom? Because the electron probability cloud technically stretches to infinity, atoms don't have a hard physical edge! To measure them, chemists look at how close two identical atoms can get to each other before they bounce off. Half that distance is the 'Atomic Radius'. For a neutral Lithium atom, the atomic radius is exactly 152 picometers (pm). A picometer is one-trillionth of a meter! Even though it only has 3 electrons, Lithium's atomic radius is actually quite large because its single valence electron is highly shielded and loosely held, allowing the cloud to puff outward.",
    parts: [
      { name: "Wireframe Sphere", material: "Outer Boundary", function: "The effective physical edge of the atom during collisions." },
      { name: "Green Ruler", material: "Radius Measurement", function: "Measures exactly 152 picometers from the nucleus." }
    ],
    quizQuestions: [
      { question: "Why is it difficult to measure the exact radius of an atom?", options: ["Because they are moving too fast", "Because the electron probability cloud has no hard physical edge; it just fades into infinity.", "Because the nucleus is too small", "Because rulers melt"], correct: 1, explanation: "We have to define the edge based on where other atoms physically bounce off of it during collisions!" }
    ]
  };
}