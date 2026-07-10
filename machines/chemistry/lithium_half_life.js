import * as THREE from 'three';
export function createLithiumHalfLife() {
  const group = new THREE.Group();
  
  // Demonstrating the radioactive decay of Lithium-8 (Half life ~0.84 seconds)
  
  // The unstable Li-8 Nucleus (3p, 5n)
  const li8 = new THREE.Group();
  for(let i=0; i<3; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})); p.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5); li8.add(p);
  }
  for(let i=0; i<5; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa})); n.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5); li8.add(n);
  }
  group.add(li8);

  // Timer Bar
  const timerBg = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.1), new THREE.MeshBasicMaterial({color: 0x444444})); timerBg.position.set(0, -2, 0);
  const timer = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.1), new THREE.MeshBasicMaterial({color: 0x00ff00})); timer.position.set(0, -2, 0.01);
  group.add(timerBg, timer);

  // The ejected Beta particle (electron from the nucleus)
  const beta = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(beta);

  group.userData.animate = function(delta, time, speed) {
      li8.rotation.y = time * speed * 0.5;
      
      const cycleTime = 2.0; // Artificial 2 second loop to represent the 0.84s half life
      const cycle = (time * speed) % cycleTime;
      
      // Timer shrinks
      const ratio = 1 - (cycle / (cycleTime * 0.8)); // Decays at 80% of loop
      
      if (ratio > 0) {
          timer.scale.set(ratio, 1, 1);
          timer.position.x = -2 * (1-ratio); // Keep left aligned
          beta.visible = false;
          li8.scale.set(1 + Math.sin(time*speed*20)*0.05, 1 + Math.sin(time*speed*20)*0.05, 1); // Shivering violently
      } else {
          // BOOM (Beta decay)
          timer.scale.set(0.001, 1, 1);
          beta.visible = true;
          const t = -ratio * 5; // time since explosion
          beta.position.set(t*5, t*2, 0); // Shoots out
          
          li8.scale.setScalar(1); // Stops shivering (now it's Beryllium-8)
      }
  };

  return {
    group: group,
    description: "Radioactive Half-Life (Lithium-8). If you cram too many neutrons into a nucleus, it becomes unstable. Lithium-8 has 3 protons and 5 neutrons. It is highly radioactive with a half-life of just 0.84 seconds! This means if you have a chunk of Li-8, half of it will literally destroy itself and turn into Beryllium every 0.84 seconds via Beta decay (shooting an electron out of the nucleus).",
    parts: [
      { name: "Shivering Nucleus", material: "Lithium-8", function: "Highly unstable due to an imbalance of neutrons." },
      { name: "Green Bar", material: "0.84s Timer", function: "The incredibly short half-life before it decays." },
      { name: "Yellow Dot", material: "Beta Particle", function: "A neutron turns into a proton, spitting out an electron at high speed." }
    ],
    quizQuestions: [
      { question: "If you have 100 atoms of radioactive Lithium-8, approximately how many will be left after 0.84 seconds?", options: ["0", "100", "50", "25"], correct: 2, explanation: "That is the definition of a half-life. After one half-life passes, exactly 50% of the material has undergone radioactive decay." }
    ]
  };
}