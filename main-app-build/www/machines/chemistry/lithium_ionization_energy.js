import * as THREE from 'three';
export function createLithiumIonizationEnergy() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Core shell
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5}));
  group.add(core);
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  core.add(c1);

  // Valence shell
  const val = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.3}));
  group.add(val);
  const v1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  val.add(v1);

  // Hammers (Energy)
  const hammerSmall = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.5), new THREE.MeshBasicMaterial({color: 0xaaaaaa}));
  group.add(hammerSmall);
  
  const hammerBig = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 2), new THREE.MeshBasicMaterial({color: 0xffaaaa}));
  group.add(hammerBig);

  group.userData.animate = function(delta, time, speed) {
      core.rotation.y = time * speed * 0.2;
      val.rotation.z = time * speed * 0.2;
      
      c1.position.set(1.5, 0, 0);
      v1.position.set(-3.0, 0, 0);

      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 1) {
          // Small hammer knocking out valence
          hammerBig.visible = false;
          hammerSmall.visible = true;
          hammerSmall.position.set(-5 + cycle*2, 0, 0);
          v1.visible = true;
      } else if (cycle < 2) {
          // Knocked out
          hammerSmall.visible = false;
          v1.visible = false;
      } else if (cycle < 3) {
          // Big hammer trying to break core
          hammerSmall.visible = false;
          hammerBig.visible = true;
          hammerBig.position.set(5 - (cycle-2)*3, 0, 0);
          c1.visible = true;
      } else {
          // Bounce off core!
          hammerBig.position.x = 2 + (cycle-3)*3;
          c1.visible = true; // Still there
      }
  };

  return {
    group: group,
    description: "Ionization Energy (1st vs 2nd). Ionization energy is the effort required to rip an electron off an atom. Lithium's 1st Ionization Energy (removing the 2s valence electron) is very LOW (520 kJ/mol). It takes just a tiny tap. But Lithium's 2nd Ionization Energy (trying to rip a core electron out of the stable 1s shell) is MASSIVE (7298 kJ/mol) — a 14x increase! A small hammer works for the first, but a sledgehammer bounces off the second.",
    parts: [
      { name: "Small Hammer", material: "1st Ionization Energy", function: "Easily removes the outer valence electron." },
      { name: "Giant Hammer", material: "2nd Ionization Energy", function: "Requires 14 times more energy to crack open the core shell." }
    ],
    quizQuestions: [
      { question: "Why is Lithium's 2nd Ionization Energy massively higher than its 1st?", options: ["Because the first electron makes the atom radioactive", "Because the 2nd electron is in a full, highly stable core shell closer to the nucleus", "Because it gets heavier", "Because the 2nd electron is glued on"], correct: 1, explanation: "Removing the valence electron is easy because it is far away and shielded. Once it's gone, the remaining electrons are right next to the nucleus in a perfectly stable noble-gas configuration. It takes incredible energy to break that stability." }
    ]
  };
}