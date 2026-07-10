import * as THREE from 'three';
export function createBoronDalton() {
  const group = new THREE.Group();
  
  // Dalton Model (1803) - Upgraded to Hyper-Realistic Billiard Ball
  
  // Base sphere
  const ball = new THREE.Mesh(
      new THREE.SphereGeometry(3, 128, 128),
      new THREE.MeshPhysicalMaterial({
          color: 0x883333,
          metalness: 0.6,
          roughness: 0.4,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2
      })
  );
  group.add(ball);

  // Add some procedural dents/scratches via displacement map (simulated with noise in animate if needed, or just normal map if we had one. We'll use a procedural bump approach or just rely on lighting)
  
  const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
  light1.position.set(5, 5, 5);
  
  const light2 = new THREE.DirectionalLight(0xaaffaa, 1);
  light2.position.set(-5, -5, -5);
  
  const ambient = new THREE.AmbientLight(0x404040, 2);
  group.add(light1, light2, ambient);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
  };

  return {
    group: group,
    description: "Dalton 'Billiard Ball' Model (1803) - Upgraded. John Dalton proposed the very first modern atomic theory. He believed that atoms were the absolute smallest things in the universe—solid, indestructible, indivisible spheres, exactly like perfectly hard billiard balls. He was right that atoms exist, but he was completely wrong about them being solid! This upgraded visualization uses high-end physically based rendering (PBR) to show exactly what Dalton imagined: a heavy, perfectly solid, indestructible chunk of matter.",
    parts: [
      { name: "Solid Sphere", material: "Indestructible Matter", function: "The smallest possible division of reality (according to Dalton)." }
    ],
    quizQuestions: [
      { question: "Why was Dalton's 'Billiard Ball' model eventually proven wrong?", options: ["Because atoms are actually square", "Because atoms are mostly empty space, and are made of even smaller pieces (protons, neutrons, electrons)!", "Because atoms don't exist", "Because billiard balls hadn't been invented yet"], correct: 1, explanation: "Dalton thought the atom was the end of the line. We now know that atoms can be smashed apart into subatomic particles!" }
    ]
  };
}