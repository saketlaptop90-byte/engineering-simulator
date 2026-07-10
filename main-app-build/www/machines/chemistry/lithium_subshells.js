import * as THREE from 'three';
export function createLithiumSubshells() {
  const group = new THREE.Group();
  
  // Azimuthal Quantum Number (l) - Subshells (Remastered)
  
  // We'll visually "break apart" the n=2 shell into its subshells
  // n=2 has l=0 (s-orbital) and l=1 (p-orbital)
  
  // 2s subshell (Sphere)
  const subS = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.5, wireframe: true})
  );
  subS.position.x = -4;
  group.add(subS);
  
  // 2p subshell (Three Dumbbells merged)
  const subP = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.5, wireframe: true});
  
  const createDumbbell = (rotX, rotY, rotZ) => {
      const g = new THREE.Group();
      const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), pMat); lobe1.position.y = 1.2; lobe1.scale.y = 1.5;
      const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), pMat); lobe2.position.y = -1.2; lobe2.scale.y = 1.5;
      g.add(lobe1, lobe2);
      g.rotation.set(rotX, rotY, rotZ);
      return g;
  };
  
  subP.add(createDumbbell(0, 0, 0)); // py
  subP.add(createDumbbell(Math.PI/2, 0, 0)); // pz
  subP.add(createDumbbell(0, 0, Math.PI/2)); // px
  
  subP.position.x = 4;
  group.add(subP);
  
  // Connecting beam showing they both belong to n=2
  const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 8),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2})
  );
  beam.rotation.z = Math.PI/2;
  group.add(beam);
  
  // Text labels (using simple sprites/planes for now)
  const createLabel = (text, color, x) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.font = '40px Arial';
      ctx.fillText(text, 10, 40);
      const tex = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: tex}));
      sprite.position.set(x, -3, 0);
      sprite.scale.set(4, 1, 1);
      group.add(sprite);
  };
  // createLabel("l = 0 (s-orbital)", "#ff00ff", -4);
  // createLabel("l = 1 (p-orbital)", "#00ff00", 4);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      subS.rotation.y = time * speed * 0.5;
      subP.rotation.y = time * speed * 0.5;
      subP.rotation.x = time * speed * 0.2;
  };

  return {
    group: group,
    description: "Azimuthal Quantum Number (l) - Subshells (Remastered). The second quantum number, 'l', breaks the main energy shells down into 'Subshells'. The value of 'l' strictly determines the physical 3D SHAPE of the orbital! 

If l=0, it is an 's-orbital' (Magenta). The math forces s-orbitals to be perfectly spherical. 
If l=1, it is a 'p-orbital' (Green). The math forces p-orbitals to look like pinched dumbbells pointing in 3 perpendicular directions! 

Both of these subshells exist inside Lithium's n=2 shell, even though the green p-orbitals are currently completely empty!",
    parts: [
      { name: "Magenta Sphere", material: "l = 0 (s-orbital)", function: "A spherical subshell. Contains Lithium's 1 valence electron." },
      { name: "Green Dumbbells", material: "l = 1 (p-orbital)", function: "A directional subshell. Currently completely empty in Lithium!" }
    ],
    quizQuestions: [
      { question: "What does the Azimuthal Quantum Number (l) determine?", options: ["The size of the atom", "The 3D geometric shape of the subshell (sphere, dumbbell, clover, etc).", "The number of neutrons", "The color of the atom"], correct: 1, explanation: "While 'n' dictates the size and energy, 'l' dictates the physical geometry of the probability cloud!" }
    ]
  };
}