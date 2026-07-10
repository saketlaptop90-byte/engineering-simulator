import * as THREE from 'three';
export function createLithiumIonicRadius() {
  const group = new THREE.Group();
  
  // Ionic Radius (Remastered)
  // Lithium Ion (Li+) is tiny! It loses its n=2 shell, meaning its radius shrinks drastically from 152pm to 76pm.
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  
  // The remaining 1s shell (Core)
  const core = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5, wireframe: true})
  );
  group.add(core);
  
  // The ghost of the lost 2s shell
  const ghostValence = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.1, wireframe: true})
  );
  group.add(ghostValence);
  
  // Ruler measuring the new tiny radius (76 pm)
  const ruler = new THREE.Group();
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  line.rotation.z = Math.PI/2;
  line.position.x = 1; 
  ruler.add(line);
  
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  arrow.rotation.z = -Math.PI/2;
  arrow.position.x = 2;
  ruler.add(arrow);
  
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('76 pm', 128, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true}));
  sprite.position.set(1, 0.8, 0);
  sprite.scale.set(3, 1.5, 1);
  ruler.add(sprite);
  group.add(ruler);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 2) {
          // Shrink from neutral to ion
          const t = cycle / 2; // 0 to 1
          ghostValence.material.opacity = 0.1 * (1 - t);
          ghostValence.scale.setScalar(1 + t*0.5);
      } else {
          ghostValence.material.opacity = 0;
      }
      
      core.scale.setScalar(1 + Math.sin(time*speed*3)*0.02);
  };

  return {
    group: group,
    description: "Ionic Radius (Remastered). When neutral Lithium (152 pm) gives away its valence electron to form a chemical bond, it becomes a positive Lithium Ion (Li+). What happens to its size? It shrinks massively! Because it completely loses its outermost n=2 energy shell, the boundary of the atom drops all the way down to the tiny n=1 core shell. The new 'Ionic Radius' is exactly exactly half the size of the neutral atom: a tiny 76 picometers!",
    parts: [
      { name: "Cyan Sphere", material: "Li+ Ion Boundary", function: "The remaining n=1 core shell." },
      { name: "Fading Magenta Sphere", material: "Lost Valence Shell", function: "Disappears completely once the electron is given away." },
      { name: "Green Ruler", material: "Ionic Radius", function: "Measures exactly 76 picometers." }
    ],
    quizQuestions: [
      { question: "Why is the Lithium cation (Li+) so much smaller than the neutral Lithium atom?", options: ["It loses protons", "It completely loses its outermost n=2 electron shell, dropping its physical boundary down to the n=1 shell.", "Gravity crushes it", "It gets cold"], correct: 1, explanation: "Cations (positive ions) are always much smaller than their parent atoms because they lose their entire outer electron shell!" }
    ]
  };
}