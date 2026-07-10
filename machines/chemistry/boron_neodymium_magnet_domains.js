import * as THREE from 'three';
export function createMagneticDomains() {
  const group = new THREE.Group();
  
  // Neodymium Magnet Domains (Nd2Fe14B)
  
  // Create a 2D grid of magnetic domains (represented as 3D arrows)
  const domains = [];
  const spacing = 1.2;
  const gridSize = 5;
  
  const arrowGeo = new THREE.ConeGeometry(0.3, 1, 16);
  const arrowMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.8, roughness: 0.2, clearcoat: 1.0}); // North pole red
  const tailGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const tailMat = new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 0.8, roughness: 0.2}); // South pole silver
  
  // The 'Pins' (Boron atoms holding them in place)
  const pinGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const pinMat = new THREE.MeshBasicMaterial({color: 0x00ffff}); // Cyan Boron
  
  const gridGroup = new THREE.Group();
  
  for(let x=-gridSize/2; x<=gridSize/2; x++) {
      for(let z=-gridSize/2; z<=gridSize/2; z++) {
          const domainGroup = new THREE.Group();
          
          const head = new THREE.Mesh(arrowGeo, arrowMat);
          head.position.y = 0.5;
          const tail = new THREE.Mesh(tailGeo, tailMat);
          tail.position.y = -0.5;
          
          domainGroup.add(head, tail);
          
          // Random initial orientation (unmagnetized)
          domainGroup.rotation.x = Math.random() * Math.PI * 2;
          domainGroup.rotation.y = Math.random() * Math.PI * 2;
          domainGroup.rotation.z = Math.random() * Math.PI * 2;
          
          domainGroup.position.set(x*spacing, 0, z*spacing);
          gridGroup.add(domainGroup);
          
          const pin = new THREE.Mesh(pinGeo, pinMat);
          pin.position.set(x*spacing, 0, z*spacing);
          gridGroup.add(pin);
          
          domains.push({
              mesh: domainGroup,
              targetRot: new THREE.Euler(-Math.PI/2, 0, 0), // Pointing straight up
              isLocked: false
          });
      }
  }
  group.add(gridGroup);
  
  // The Magnetizing Field (A massive glowing electromagnet coil passing over)
  const coil = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.5, 16, 100),
      new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.8})
  );
  coil.rotation.x = Math.PI/2;
  coil.position.x = -15; // starts off screen
  group.add(coil);
  
  // Field lines
  const fieldMat = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending});
  const field1 = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 10, 32, 1, true), fieldMat);
  coil.add(field1);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      group.rotation.x = Math.cos(time*speed*0.1)*0.2 + 0.3; // look slightly down
      
      const cycle = (time * speed * 0.5) % 10;
      
      if (cycle < 2) {
          // Unmagnetized - jiggling slightly due to thermal energy
          coil.position.x = -15;
          domains.forEach(d => {
              d.isLocked = false;
              d.mesh.rotation.x += (Math.random()-0.5)*0.05;
              d.mesh.rotation.y += (Math.random()-0.5)*0.05;
          });
      } else if (cycle < 6) {
          // Magnetizing - coil passes over
          const t = (cycle - 2) / 4; // 0 to 1
          const coilX = -10 + t * 20; // -10 to 10
          coil.position.x = coilX;
          
          // If coil is near a domain, it snaps to attention
          domains.forEach(d => {
              const dist = Math.abs(d.mesh.position.x - coilX);
              if (dist < 4) {
                  // Snap to straight up (Magnetized!)
                  d.mesh.quaternion.slerp(new THREE.Quaternion().setFromEuler(d.targetRot), 0.2);
                  d.isLocked = true; // Boron pins it!
              } else if (!d.isLocked) {
                   d.mesh.rotation.x += (Math.random()-0.5)*0.05;
              }
          });
      } else {
          // Fully magnetized, holding strong!
          coil.position.x = 15;
          domains.forEach(d => {
              // They don't jiggle anymore, the Boron pins have locked the domains in place
              d.mesh.quaternion.slerp(new THREE.Quaternion().setFromEuler(d.targetRot), 1.0);
          });
      }
  };

  return {
    group: group,
    description: "Macroscopic Magnetic Domains (Nd2Fe14B). Why are Neodymium magnets so ridiculously strong? Iron is magnetic, but its microscopic magnetic 'domains' (the arrows) constantly flip around and cancel each other out due to heat. By alloying Iron and Neodymium with Boron, the Boron atoms (cyan dots) act as microscopic 'pins'. When a massive magnetic field (the magenta ring) passes over the metal, all the domains snap into alignment. The Boron pins lock them in place so they can NEVER flip back! This creates the strongest permanent magnets on Earth, used in electric vehicles and wind turbines.",
    parts: [
      { name: "Red/Silver Arrows", material: "Magnetic Domains", function: "Regions of iron atoms with their magnetic fields aligned." },
      { name: "Magenta Ring", material: "External Electromagnet", function: "The factory machine used to magnetize the raw metal." },
      { name: "Cyan Dots", material: "Boron 'Pins'", function: "Locking the domains in place permanently so the magnet never loses its strength." }
    ],
    quizQuestions: [
      { question: "What is Boron's vital role in a Neodymium magnet (Nd2Fe14B)?", options: ["It provides the magnetic field", "It acts as a microscopic 'pin' that locks the iron's magnetic domains in perfect alignment, preventing them from flipping back and losing their magnetism.", "It makes the magnet shiny", "It cools the magnet down"], correct: 1, explanation: "Without Boron, the domains would easily jiggle out of alignment at room temperature. Boron dramatically increases the 'coercivity' (resistance to demagnetization) of the alloy!" }
    ]
  };
}