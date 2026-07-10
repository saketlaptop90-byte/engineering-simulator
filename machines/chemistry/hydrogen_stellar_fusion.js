import * as THREE from 'three';
export function createHydrogenStellarFusion() {
  const group = new THREE.Group();
  
  const pMat = new THREE.MeshStandardMaterial({color: 0xff0000});
  const nMat = new THREE.MeshStandardMaterial({color: 0xcccccc});
  const positronMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const neutrinoMat = new THREE.MeshBasicMaterial({color: 0xffff00});

  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32,32), pMat);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32,32), pMat);
  group.add(p1); group.add(p2);

  const deut = new THREE.Group();
  const dp = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32,32), pMat); dp.position.x = -0.3;
  const dn = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32,32), nMat); dn.position.x = 0.3;
  deut.add(dp); deut.add(dn);
  group.add(deut);

  const positron = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), positronMat); group.add(positron);
  const neutrino = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), neutrinoMat); group.add(neutrino);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      if(cycle < 2) {
          p1.visible = true; p2.visible = true; deut.visible = false; positron.visible = false; neutrino.visible = false;
          p1.position.set(-2 + cycle, 1 - cycle*0.5, 0);
          p2.position.set(-2 + cycle, -1 + cycle*0.5, 0);
      } else {
          p1.visible = false; p2.visible = false; deut.visible = true; positron.visible = true; neutrino.visible = true;
          deut.position.set(0, 0, 0);
          positron.position.set((cycle-2)*2, (cycle-2)*2, 0);
          neutrino.position.set((cycle-2)*2, -(cycle-2)*2, 0);
      }
  };

  return {
    group: group,
    description: "Proton-Proton Chain Reaction. In stellar cores (like our Sun), two hydrogen nuclei fuse to form a Deuterium nucleus, releasing a positron and a neutrino.",
    parts: [
      { name: "Protons (1H)", material: "Plasma", function: "Overcome Coulomb barrier via quantum tunneling." },
      { name: "Deuterium (2H)", material: "Nucleus", function: "Formed via weak nuclear force converting a proton to a neutron." },
      { name: "Positron & Neutrino", material: "Particles", function: "Carry away positive charge and energy." }
    ]
  };
}
