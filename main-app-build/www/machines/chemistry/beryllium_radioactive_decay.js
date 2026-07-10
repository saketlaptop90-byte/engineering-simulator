import * as THREE from 'three';
export function createBerylliumDecay() {
  const group = new THREE.Group();
  
  // Be-10 decaying into Boron-10 via Beta Decay
  
  const nucleus = new THREE.Group();
  
  // 4 Protons
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); p1.position.set(0.2, 0.2, 0.2);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); p2.position.set(-0.2, -0.2, 0.2);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); p3.position.set(0.2, -0.2, -0.2);
  const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); p4.position.set(-0.2, 0.2, -0.2);
  nucleus.add(p1,p2,p3,p4);
  
  // 6 Neutrons
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); n1.position.set(0, 0.4, 0);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); n2.position.set(0.4, 0, 0);
  const n3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); n3.position.set(0, -0.4, 0);
  const n4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); n4.position.set(-0.4, 0, 0);
  const n5 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); n5.position.set(0, 0, 0.4);
  // The magic mutating neutron
  const mutN = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff})); mutN.position.set(0, 0, -0.4);
  nucleus.add(n1,n2,n3,n4,n5,mutN);
  
  group.add(nucleus);

  // Beta particle (electron) shooting out
  const beta = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(beta);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Stable Be-10
          mutN.material.color.setHex(0x0000ff); // It's a blue neutron
          beta.visible = false;
          beta.position.set(0,0,-0.4);
      } else {
          // DECAY! Neutron turns into a Proton (Red), shoots out an electron
          mutN.material.color.setHex(0xff0000); // Now it's a red proton!
          beta.visible = true;
          beta.position.y += 5 * delta * speed;
          beta.position.x += 5 * delta * speed;
      }
  };

  return {
    group: group,
    description: "Radioactive Decay (Beta Decay). How does a radioactive isotope actually decay? Beryllium-10 is unstable because it has 6 neutrons. To fix this, it undergoes 'Beta Minus Decay'. One of its blue neutrons actually magically transforms into a red proton! To balance the electric charge, it shoots out a negative electron (a Beta particle) at near light speed. The atom now has 5 protons and 5 neutrons. It is no longer Beryllium; it has permanently transmuted into Boron-10!",
    parts: [
      { name: "Blue Neutron", material: "Neutron", function: "The unstable particle." },
      { name: "Turns Red", material: "Transmutation", function: "The neutron turns into a proton, changing the element entirely." },
      { name: "Cyan Bullet", material: "Beta Particle (Electron)", function: "Ejected as radiation to balance the charge." }
    ],
    quizQuestions: [
      { question: "When Beryllium-10 undergoes Beta Decay, what happens to the atom?", options: ["It turns into Beryllium-9", "It explodes completely", "One neutron turns into a proton, transforming the atom into a completely new element (Boron)", "It loses all its electrons"], correct: 2, explanation: "This is real-life alchemy. Changing the number of protons changes the identity of the element. A neutron turning into a proton bumps the atomic number from 4 to 5, making it Boron." }
    ]
  };
}