import * as THREE from 'three';
export function createLithiumSOrbitals() {
  const group = new THREE.Group();
  
  // 1s vs 2s Orbitals Side-by-Side (Remastered)
  
  // 1s orbital (Small, dense, cyan)
  const g1s = new THREE.Group();
  const mat1s = new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5, transmission: 0.9, side: THREE.DoubleSide});
  const mesh1s = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 1.5), mat1s); // 3/4 sphere to look inside
  g1s.add(mesh1s);
  g1s.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}))); // nucleus
  g1s.position.x = -4;
  group.add(g1s);
  
  // 2s orbital (Large, diffuse, magenta, contains a radial node!)
  const g2s = new THREE.Group();
  const mat2s = new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.4, transmission: 0.9, side: THREE.DoubleSide});
  const mesh2s = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32, 0, Math.PI * 1.5), mat2s);
  g2s.add(mesh2s);
  
  // The internal node structure of 2s (it has a tiny inner sphere and an empty gap)
  const inner2s = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 1.5), mat2s);
  g2s.add(inner2s);
  
  g2s.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}))); // nucleus
  g2s.position.x = 4;
  group.add(g2s);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Rotate them to show off the 3/4 cutout
      g1s.rotation.y = time * speed * 0.5;
      g2s.rotation.y = time * speed * 0.5;
      g2s.rotation.x = 0.2;
      g1s.rotation.x = 0.2;
  };

  return {
    group: group,
    description: "1s vs 2s Orbitals Side-by-Side (Remastered). Let's take a deep dive into the 's' (spherical) orbitals. On the left is the 1s orbital. It is small, very close to the nucleus, and physically uniform. On the right is the much larger 2s orbital. Because we cut away a quarter of the sphere, you can look inside! Notice how the 2s orbital actually has a tiny inner sphere, surrounded by an empty gap, surrounded by the massive outer sphere? That empty gap is the Radial Node! Higher energy orbitals don't just get bigger—their internal geometry becomes fractured by probability nodes!",
    parts: [
      { name: "Cyan 3/4 Sphere", material: "1s Orbital", function: "Uniform spherical probability." },
      { name: "Magenta 3/4 Sphere", material: "2s Orbital", function: "Contains an internal radial node (empty gap)." }
    ],
    quizQuestions: [
      { question: "What is the structural difference between the 1s and 2s orbitals shown here?", options: ["The 2s orbital is square", "The 2s orbital is not just larger, it contains an internal 'radial node' where probability drops to zero.", "The 1s orbital is heavier", "The 1s orbital is empty"], correct: 1, explanation: "As you move up in energy (n=1, n=2, n=3), the Schrödinger wave equation naturally creates more mathematical zero-crossings (nodes) inside the orbital!" }
    ]
  };
}