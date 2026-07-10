import * as THREE from 'three';
export function createHeliumEnvironmentalEscape() {
  const group = new THREE.Group();
  
  // Earth surface
  const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshStandardMaterial({color: 0x228833, roughness: 0.8}));
  earth.position.y = -12;
  group.add(earth);
  
  // Atmosphere gradient
  const atmos = new THREE.Mesh(new THREE.SphereGeometry(12, 64, 64), new THREE.MeshBasicMaterial({color: 0x4488ff, transparent: true, opacity: 0.2}));
  atmos.position.y = -12;
  group.add(atmos);

  // Helium balloons/atoms floating up
  const heGroup = new THREE.Group();
  for(let i=0; i<15; i++) {
      const he = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      he.userData = { x: (Math.random()-0.5)*6, z: (Math.random()-0.5)*6, offset: Math.random()*5, speed: 1+Math.random() };
      heGroup.add(he);
  }
  group.add(heGroup);

  group.userData.animate = function(delta, time, speed) {
      heGroup.children.forEach(he => {
          let y = -1 + ((time*speed*he.userData.speed + he.userData.offset) % 6);
          he.position.set(he.userData.x + Math.sin(y*2)*0.5, y, he.userData.z);
          
          // Fade out as it reaches space
          if(y > 3) {
              he.material.transparent = true;
              he.material.opacity = 1 - (y-3)/2;
          } else {
              he.material.opacity = 1;
          }
      });
      earth.rotation.z = time * speed * 0.05;
  };

  return {
    group: group,
    description: "Environmental Escape (Atmospheric Bleed). Helium is an endangered resource! Because it is so light and chemically inert, it refuses to bond with heavier molecules (like rock or water) to stay anchored to the Earth. Once released into the air, it floats to the very top of the atmosphere and is stripped away into outer space by solar wind.",
    parts: [
      { name: "Earth's Atmosphere", material: "Blue Shell", function: "Gravity holds heavy gases like O2 and N2 here." },
      { name: "Helium (Cyan Dots)", material: "Lighter-than-air", function: "Escapes gravity and leaves the planet forever." }
    ],
    quizQuestions: [
      { question: "Why is Earth running out of Helium?", options: ["Because we are turning it into Hydrogen", "Because it is so light and unreactive that once released, it floats to the edge of the atmosphere and is blown away into outer space forever", "Because we burn it all for fuel", "Because the oceans absorb it"], correct: 1, explanation: "Most elements are heavy enough for Earth's gravity to hold onto, or they chemically bond to heavy rocks/water (like Oxygen and Carbon do). Helium does neither. It floats up and escapes into space, making it a non-renewable resource." }
    ]
  };
}