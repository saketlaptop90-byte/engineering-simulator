import * as THREE from 'three';
export function createBerylliumFusion() {
  const group = new THREE.Group();
  
  // Two Helium-4 nuclei fusing into Beryllium-8
  // (Which then violently splits apart again)
  
  const he1 = new THREE.Group();
  he1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0xff0000}))).position.set(0.2,0,0);
  he1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0xff0000}))).position.set(-0.2,0,0);
  he1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0x0000ff}))).position.set(0,0.2,0);
  he1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0x0000ff}))).position.set(0,-0.2,0);
  group.add(he1);

  const he2 = new THREE.Group();
  he2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0xff0000}))).position.set(0.2,0,0);
  he2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0xff0000}))).position.set(-0.2,0,0);
  he2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0x0000ff}))).position.set(0,0.2,0);
  he2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({color: 0x0000ff}))).position.set(0,-0.2,0);
  group.add(he2);

  // Flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed * 0.8) % 4;
      
      he1.rotation.z = time * speed * 2;
      he2.rotation.z = -time * speed * 2;
      
      if (cycle < 1) {
          // Approach
          he1.position.set(-3 + cycle*3, 0, 0);
          he2.position.set(3 - cycle*3, 0, 0);
          flash.material.opacity = 0;
      } else if (cycle < 2) {
          // Fused into Be-8 (Extremely brief)
          he1.position.set(0, 0, 0);
          he2.position.set(0, 0, 0);
          flash.material.opacity = 1 - (cycle-1);
      } else {
          // Rips apart back into Helium!
          const t = cycle - 2;
          he1.position.set(-t*5, 0, 0);
          he2.position.set(t*5, 0, 0);
          flash.material.opacity = 0;
      }
  };

  return {
    group: group,
    description: "Nuclear Fusion (The Beryllium Bottleneck). How is Beryllium made in the universe? It's incredibly difficult. Inside a star, two Helium atoms smash together to create Beryllium-8. However, Be-8 is so insanely unstable that it rips itself back apart into Helium in 10^-16 seconds! This is called the 'Beryllium Bottleneck'. To create heavier elements like Carbon, a third Helium atom has to hit the Be-8 in that exact fraction of a millisecond. Because this is so rare, Beryllium is actually one of the rarest elements in the universe.",
    parts: [
      { name: "Two Clusters", material: "Helium Nuclei (Alpha Particles)", function: "Smashing together at millions of degrees." },
      { name: "White Flash", material: "Fusion into Be-8", function: "The creation of a highly unstable isotope." },
      { name: "Splitting Apart", material: "Instant Fission", function: "The nucleus rejecting itself and tearing apart instantly." }
    ],
    quizQuestions: [
      { question: "Why is Beryllium so incredibly rare in the universe compared to lighter and heavier elements?", options: ["Because aliens mined it all", "Because the Beryllium-8 created in stars instantly destroys itself in a fraction of a second, causing a 'bottleneck' in stellar nucleosynthesis", "Because it is too heavy", "Because stars aren't hot enough"], correct: 1, explanation: "Stars struggle to get past atomic number 4. Be-8's near-instantaneous destruction means very little Beryllium survives the star-forging process. Carbon and Oxygen are much more common because they are perfectly stable." }
    ]
  };
}