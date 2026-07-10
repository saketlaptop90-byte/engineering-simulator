import * as THREE from 'three';
export function createHeliumFusionTripleAlpha() {
  const group = new THREE.Group();
  
  const createAlpha = (color) => {
      const g = new THREE.Group();
      const pMat = new THREE.MeshStandardMaterial({color: 0xff0000});
      const nMat = new THREE.MeshStandardMaterial({color: 0xcccccc});
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16), pMat)).position.set(0.15,0.15,0);
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16), pMat)).position.set(-0.15,-0.15,0);
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16), nMat)).position.set(-0.15,0.15,0.15);
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16), nMat)).position.set(0.15,-0.15,-0.15);
      return g;
  };

  const a1 = createAlpha();
  const a2 = createAlpha();
  const a3 = createAlpha();
  group.add(a1); group.add(a2); group.add(a3);

  const carbon = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshStandardMaterial({color: 0x444444, metalness: 0.8}));
  carbon.visible = false;
  group.add(carbon);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 6;
      if(cycle < 3) {
          carbon.visible = false;
          a1.visible = true; a2.visible = true; a3.visible = true;
          a1.position.set(-3 + cycle, 2 - cycle*0.6, 0);
          a2.position.set(3 - cycle, 2 - cycle*0.6, 0);
          a3.position.set(0, -3 + cycle, 0);
      } else {
          carbon.visible = true;
          a1.visible = false; a2.visible = false; a3.visible = false;
          carbon.rotation.y += delta;
      }
  };

  return {
    group: group,
    description: "Triple-Alpha Process. In the core of older red giant stars, temperatures exceed 100 million Kelvin, allowing three Helium-4 nuclei (alpha particles) to fuse into a single Carbon-12 nucleus.",
    parts: [
      { name: "3x Alpha Particles (He-4)", material: "Plasma", function: "Collide rapidly to overcome instability of Beryllium-8 bottleneck." },
      { name: "Carbon-12", material: "Nucleus", function: "The resulting stable element, fundamental to life." }
    ],
    quizQuestions: [
      { question: "What element is ultimately formed by the fusion of three Helium nuclei (the Triple-Alpha process) in stars?", options: ["Oxygen", "Carbon", "Iron", "Neon"], correct: 1, explanation: "Three Helium-4 nuclei (3 x 4 = 12) fuse through an unstable Beryllium-8 intermediate to form Carbon-12, the basis of all known life." }
    ]
  };
}
