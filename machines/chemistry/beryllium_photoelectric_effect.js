import * as THREE from 'three';
export function createBerylliumPhotoelectricEffect() {
  const group = new THREE.Group();
  
  // A solid block of Beryllium metal
  const metal = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2), new THREE.MeshStandardMaterial({color: 0x88ccff, metalness: 0.9, roughness: 0.2}));
  metal.position.set(0, -1, 0);
  group.add(metal);

  // Incoming UV light wave
  const waveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 3, 0),
      new THREE.Vector3(-2, 2.5, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(0, -0.5, 0)
  ]);
  const waveTube = new THREE.Mesh(new THREE.TubeGeometry(waveCurve, 20, 0.05, 8, false), new THREE.MeshBasicMaterial({color: 0xaa00ff}));
  group.add(waveTube); // Purple/UV light

  // Ejected electron
  const eGrp = new THREE.Group();
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const trail = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,-1,0)]), new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
  eGrp.add(e, trail);
  group.add(eGrp);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 1.5) % 2;
      
      if (cycle < 1) {
          // UV wave incoming
          waveTube.material.opacity = cycle;
          waveTube.material.transparent = true;
          eGrp.visible = false;
      } else {
          // Ejected!
          waveTube.material.opacity = 0;
          eGrp.visible = true;
          
          const t = cycle - 1;
          eGrp.position.set(t*3, -0.5 + t*4, 0);
      }
  };

  return {
    group: group,
    description: "The Photoelectric Effect. This is the phenomenon that won Albert Einstein his Nobel Prize! When you shine high-energy light (like Ultraviolet light) onto a block of Beryllium metal, the light particles (photons) crash into the 'sea of electrons'. If the photon has enough energy (the 'work function'), it hits an electron so hard that it literally knocks the electron completely out of the metal into the air! This is how solar panels and night vision goggles work.",
    parts: [
      { name: "Steel Block", material: "Beryllium Surface", function: "Full of loosely held metallic electrons." },
      { name: "Purple Wave", material: "UV Photon", function: "A packet of high-energy light striking the surface." },
      { name: "White Dot Flying", material: "Photoelectron", function: "Knocked entirely free of the metal's grip." }
    ],
    quizQuestions: [
      { question: "According to the Photoelectric Effect, what happens if you shine a very BRIGHT but LOW-ENERGY red light at the metal?", options: ["It ejects millions of electrons", "It melts the metal", "Absolutely nothing. If a single photon doesn't have the minimum threshold of energy to knock out an electron, turning up the brightness (sending MORE weak photons) still won't do anything.", "It turns the metal red"], correct: 2, explanation: "This proved that light acts as a particle! You can't combine 10 weak photon hits to knock out an electron. A single photon must have enough energy to do it alone in a 1-on-1 collision." }
    ]
  };
}