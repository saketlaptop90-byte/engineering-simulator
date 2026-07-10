import * as THREE from 'three';
export function createBerylliumPlasmaState() {
  const group = new THREE.Group();
  
  // Plasma: Nuclei and electrons completely stripped apart
  
  const nuclei = new THREE.Group();
  const electrons = new THREE.Group();
  
  for(let i=0; i<5; i++) {
      const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); // +4 Nucleus
      nuc.userData = { vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, vz: (Math.random()-0.5)*2 };
      nuclei.add(nuc);
      
      // 4 electrons per nucleus
      for(let j=0; j<4; j++) {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
          e.userData = { vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, vz: (Math.random()-0.5)*10 };
          electrons.add(e);
      }
  }
  group.add(nuclei, electrons);
  
  const lightning = new THREE.PointLight(0x00ffff, 1, 10);
  group.add(lightning);

  const box = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.1}));
  group.add(box);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const move = (grp, limit, isElectron) => {
          grp.children.forEach(item => {
              item.position.x += item.userData.vx * delta * speed;
              item.position.y += item.userData.vy * delta * speed;
              item.position.z += item.userData.vz * delta * speed;
              
              if (Math.abs(item.position.x) > limit) item.userData.vx *= -1;
              if (Math.abs(item.position.y) > limit) item.userData.vy *= -1;
              if (Math.abs(item.position.z) > limit) item.userData.vz *= -1;
              
              // Jitter for electrons
              if (isElectron) {
                  item.position.x += (Math.random()-0.5)*0.2;
                  item.position.y += (Math.random()-0.5)*0.2;
              }
          });
      };
      
      move(nuclei, 2.5, false);
      move(electrons, 2.8, true);
      
      lightning.intensity = 1 + Math.sin(time*speed*20)*0.5;
  };

  return {
    group: group,
    description: "Plasma State. If you heat Beryllium gas to tens of thousands of degrees, you create Plasma (the 4th state of matter). The thermal energy is so incredibly violent that atoms literally smash themselves apart. The collisions rip the electrons clean off the nuclei. You are left with a blindingly hot, chaotic soup of bare +4 Beryllium nuclei and free-flying electrons. This is the state of matter found inside stars.",
    parts: [
      { name: "Red Spheres", material: "Bare +4 Nuclei", function: "Stripped of all 4 electrons." },
      { name: "Cyan Sparks", material: "Free Electrons", function: "Moving at extreme speeds, highly conductive." },
      { name: "Flashing Light", material: "Photon Emission", function: "The plasma glowing fiercely as electrons collide and release energy." }
    ],
    quizQuestions: [
      { question: "What is the physical difference between a Gas and a Plasma?", options: ["Plasma is colder", "In a gas, electrons are still attached to their atoms. In a plasma, the heat rips the electrons completely off, creating a soup of ions and free electrons.", "Plasma is a liquid", "Plasma has no protons"], correct: 1, explanation: "Plasma is essentially ionized gas. It conducts electricity extremely well (unlike normal gas) because the electrons are free to flow." }
    ]
  };
}