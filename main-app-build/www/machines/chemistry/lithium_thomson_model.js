import * as THREE from 'three';
export function createLithiumThomsonModel() {
  const group = new THREE.Group();
  
  // Thomson's Plum Pudding Model (Remastered)
  // A historical model before the nucleus was discovered
  
  // The 'Pudding' - A diffuse cloud of positive charge
  const pudding = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffaaaa, transparent: true, opacity: 0.5, transmission: 0.8, roughness: 0.2})
  );
  group.add(pudding);
  
  // The 'Plums' - Negatively charged electrons embedded in the pudding
  const eMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.5, roughness: 0.2});
  const electrons = new THREE.Group();
  
  // Lithium has 3 electrons
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), eMat); e1.position.set(0, 2, 0); electrons.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), eMat); e2.position.set(1.73, -1, 0); electrons.add(e2);
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), eMat); e3.position.set(-1.73, -1, 0); electrons.add(e3);
  
  group.add(electrons);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // The electrons bob around slowly in the viscous positive 'pudding'
      e1.position.y = 2 + Math.sin(time*speed*2)*0.2;
      e2.position.x = 1.73 + Math.sin(time*speed*2 + 2)*0.2;
      e3.position.x = -1.73 + Math.sin(time*speed*2 + 4)*0.2;
      
      pudding.scale.setScalar(1 + Math.sin(time*speed*3)*0.02); // pudding jiggles
  };

  return {
    group: group,
    description: "Lithium Thomson Model (Remastered). Also known as the 'Plum Pudding Model', this was the prevailing theory of the atom from 1904 to 1911. J.J. Thomson had just discovered the electron, which was negatively charged. But atoms are electrically neutral! Thomson reasoned that the electrons must be floating in a giant, diffuse cloud of positive charge—like plums stuck inside a bowl of pudding. In this historical model of Lithium, the 3 electrons are embedded inside a gelatinous sphere of positive energy. Rutherford's gold foil experiment would later prove this model completely wrong!",
    parts: [
      { name: "Pink Sphere", material: "Positive 'Pudding'", function: "A theoretical cloud of diffuse positive charge." },
      { name: "Cyan Spheres", material: "Negative 'Plums'", function: "Electrons embedded inside the atom." }
    ],
    quizQuestions: [
      { question: "Why was the 'Plum Pudding' model eventually proven wrong?", options: ["Because it tasted bad", "Rutherford's experiment proved that positive charge is not spread out like a cloud, but concentrated in a tiny nucleus.", "Because electrons are actually red", "Because atoms are square"], correct: 1, explanation: "Science evolves by constantly challenging old theories! The Plum Pudding model was a great stepping stone, but the nuclear model quickly replaced it." }
    ]
  };
}