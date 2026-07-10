import * as THREE from 'three';
export function createLithium6() {
  const group = new THREE.Group();
  
  // Lithium-6 Isotope (Upgraded to Ultra High Quality)
  // 3 Protons, 3 Neutrons. Used for nuclear fusion and Tritium production.
  
  const nucleus = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.1, roughness: 0.3, clearcoat: 1.0, emissive: 0x440000});
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.1, roughness: 0.3, clearcoat: 1.0, emissive: 0x000044});
  
  // 3 Protons
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p1.position.set(0.2, 0.2, 0); nucleus.add(p1);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p2.position.set(-0.2, -0.2, 0.2); nucleus.add(p2);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), pMat); p3.position.set(-0.2, 0.2, -0.2); nucleus.add(p3);
  
  // 3 Neutrons (Lithium-6 is the rare, highly prized isotope for nuclear physics)
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n1.position.set(0, -0.2, -0.2); nucleus.add(n1);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n2.position.set(-0.2, 0, 0.2); nucleus.add(n2);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,32), nMat); n3.position.set(0.2, -0.2, 0.2); nucleus.add(n3);
  
  group.add(nucleus);
  
  // Radioactive / Nuclear potential glow
  const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending})
  );
  nucleus.add(glow);
  
  // Electron Cloud System (same as normal lithium, but let's make it look more energetic)
  const createOrbitalCloud = (count, radius, colorHex) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for(let i=0; i<count; i++) {
          const u = Math.random(); const v = Math.random();
          const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
          const r = radius * (0.9 + Math.random()*0.2);
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      
      const mat = new THREE.PointsMaterial({
          size: 0.1,
          color: colorHex,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false
      });
      return new THREE.Points(geo, mat);
  };
  
  const innerCloud = createOrbitalCloud(1500, 1.5, 0x00ffaa);
  group.add(innerCloud);
  const outerCloud = createOrbitalCloud(800, 4.0, 0xffaa00);
  group.add(outerCloud);

  const light = new THREE.PointLight(0xffffff, 2, 20);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      nucleus.rotation.x = time * speed * 1.5; // Spins faster to show nuclear potential
      nucleus.rotation.z = time * speed * 1.2;
      
      innerCloud.rotation.y = -time * speed * 0.8;
      outerCloud.rotation.x = time * speed * 0.5;
      
      glow.scale.setScalar(1 + Math.sin(time*speed*5)*0.2);
  };

  return {
    group: group,
    description: "Lithium-6 Isotope (Upgraded). Unlike the standard Lithium-7 (which has 4 neutrons), this rare isotope has exactly 3 protons and 3 neutrons. Chemically, it acts exactly the same as normal Lithium (it still has the same 3 electrons). But in the realm of Nuclear Physics, Lithium-6 is incredibly precious! When Lithium-6 is struck by a neutron in a nuclear reactor, it splits perfectly into Helium and Tritium (a super-heavy, radioactive version of Hydrogen). Tritium is the fuel required for thermonuclear fusion! Lithium-6 is literally the key to unlocking the power of the stars on Earth.",
    parts: [
      { name: "3 Red & 3 Blue Spheres", material: "Nucleus", function: "Perfectly balanced, but primed to split into Tritium when hit by a neutron." },
      { name: "Yellow Aura", material: "Nuclear Potential", function: "The massive energy locked inside this specific isotope." }
    ],
    quizQuestions: [
      { question: "Why is the Lithium-6 isotope so important in nuclear physics?", options: ["It is used to make batteries heavier", "When hit by a neutron, it converts into Tritium, which is the necessary fuel for thermonuclear fusion (hydrogen bombs and future fusion reactors).", "It cures cancer", "It stops radiation"], correct: 1, explanation: "Tritium has a half-life of only 12 years, so it doesn't exist naturally on Earth. We MUST breed it using Lithium-6 to fuel fusion reactors!" }
    ]
  };
}