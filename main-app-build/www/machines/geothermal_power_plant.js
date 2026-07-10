export function createGeothermalPowerPlant(THREE) {
  const group = new THREE.Group();

  // 1. Earth's Surface
  const surfaceGeo = new THREE.BoxGeometry(15, 1, 15);
  const surfaceMat = new THREE.MeshStandardMaterial({ color: 0x44aa44, roughness: 1 });
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  group.add(surface);

  // 2. Geological Layers
  const capRockGeo = new THREE.BoxGeometry(15, 2, 15);
  const capRockMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const capRock = new THREE.Mesh(capRockGeo, capRockMat);
  capRock.position.y = -1.5;
  group.add(capRock);
  capRock.userData = { id: 'cap_rock', name: 'Impermeable Cap Rock', description: 'Traps the superheated water underground, allowing pressure to build.' };

  const reservoirGeo = new THREE.BoxGeometry(15, 4, 15);
  const reservoirMat = new THREE.MeshStandardMaterial({ color: 0x334466, transparent: true, opacity: 0.8 });
  const reservoir = new THREE.Mesh(reservoirGeo, reservoirMat);
  reservoir.position.y = -4.5;
  group.add(reservoir);
  reservoir.userData = { id: 'geothermal_reservoir', name: 'Geothermal Brine Reservoir', description: 'Porous rock filled with superheated water (often >200°C) kept liquid by immense pressure.' };

  const heatSourceGeo = new THREE.BoxGeometry(15, 2, 15);
  const heatSourceMat = new THREE.MeshStandardMaterial({ color: 0xaa2200, emissive: 0x551100 });
  const heatSource = new THREE.Mesh(heatSourceGeo, heatSourceMat);
  heatSource.position.y = -7.5;
  group.add(heatSource);
  heatSource.userData = { id: 'magma_heat', name: 'Magma Intrusions', description: 'The ultimate heat source from the Earth\'s mantle.' };

  // 3. Production Well (Hot fluid UP)
  const prodWellGeo = new THREE.CylinderGeometry(0.2, 0.2, 6);
  const prodWellMat = new THREE.MeshStandardMaterial({ color: 0xff4400, metalness: 0.8 });
  const prodWell = new THREE.Mesh(prodWellGeo, prodWellMat);
  prodWell.position.set(-3, -2.5, 0);
  group.add(prodWell);
  prodWell.userData = { id: 'production_well', name: 'Production Well', description: 'Drilled deep to bring high-pressure, superheated fluid to the surface.' };

  // 4. Injection Well (Cold fluid DOWN)
  const injWellGeo = new THREE.CylinderGeometry(0.2, 0.2, 6);
  const injWellMat = new THREE.MeshStandardMaterial({ color: 0x0044ff, metalness: 0.8 });
  const injWell = new THREE.Mesh(injWellGeo, injWellMat);
  injWell.position.set(3, -2.5, 0);
  group.add(injWell);
  injWell.userData = { id: 'injection_well', name: 'Injection Well', description: 'Returns cooled water back to the reservoir to be reheated, ensuring sustainability.' };

  // 5. Flash Tank (Separator)
  const flashGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
  const flashMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 });
  const flashTank = new THREE.Mesh(flashGeo, flashMat);
  flashTank.position.set(-3, 1.5, 0);
  group.add(flashTank);
  flashTank.userData = { id: 'flash_tank', name: 'Flash Separator', description: 'Drops the pressure of the superheated water, causing it to instantly "flash" into high-pressure steam.' };

  // 6. Steam Turbine
  const turbineGeo = new THREE.CylinderGeometry(1.2, 0.8, 2, 16);
  const turbineMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
  const turbine = new THREE.Mesh(turbineGeo, turbineMat);
  turbine.position.set(0, 1.5, 0);
  turbine.rotation.z = Math.PI / 2;
  group.add(turbine);
  turbine.userData = { id: 'steam_turbine', name: 'Steam Turbine', description: 'The expanding steam forces the turbine blades to spin at high speeds.' };

  // 7. Generator
  const genGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const genMat = new THREE.MeshStandardMaterial({ color: 0xcc8822 });
  const generator = new THREE.Mesh(genGeo, genMat);
  generator.position.set(2, 1.5, 0);
  group.add(generator);
  generator.userData = { id: 'generator', name: 'Electrical Generator', description: 'Driven by the turbine to produce continuous baseload electricity.' };

  // 8. Condenser
  const condGeo = new THREE.BoxGeometry(2, 1, 2);
  const condMat = new THREE.MeshStandardMaterial({ color: 0x2288cc });
  const condenser = new THREE.Mesh(condGeo, condMat);
  condenser.position.set(0, 0.5, -2);
  group.add(condenser);
  condenser.userData = { id: 'condenser', name: 'Condenser', description: 'Cools the spent steam back into liquid water so it can be re-injected.' };

  // 9. Cooling Tower
  const towerGeo = new THREE.CylinderGeometry(1.5, 2.5, 3, 16, 1, true);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
  const coolingTower = new THREE.Mesh(towerGeo, towerMat);
  coolingTower.position.set(4, 2, -4);
  group.add(coolingTower);
  coolingTower.userData = { id: 'cooling_tower', name: 'Cooling Tower', description: 'Rejects waste heat to the atmosphere by evaporating a small amount of water.' };

  // Steam coming out of cooling tower
  const steamGeo = new THREE.SphereGeometry(0.5, 8, 8);
  const steamGroup = new THREE.Group();
  coolingTower.add(steamGroup);
  for(let i=0; i<10; i++) {
    const s = new THREE.Mesh(steamGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    s.position.set((Math.random()-0.5), 1.5 + Math.random()*2, (Math.random()-0.5));
    steamGroup.add(s);
  }

  // 10. Piping Network
  const pipeCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 2.5, 0),
    new THREE.Vector3(-2, 2.5, 0),
    new THREE.Vector3(-1.2, 1.5, 0)
  ]);
  const pipe1 = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve1, 8, 0.2, 8, false), prodWellMat);
  group.add(pipe1); // Steam to turbine

  const pipeCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0, 0.5, -1)
  ]);
  const pipe2 = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve2, 8, 0.2, 8, false), injWellMat);
  group.add(pipe2); // Spent steam to condenser

  const pipeCurve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, -3),
    new THREE.Vector3(3, 0.5, -3),
    new THREE.Vector3(3, 0.5, 0)
  ]);
  const pipe3 = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve3, 8, 0.2, 8, false), injWellMat);
  group.add(pipe3); // Condenser to injection well

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    // Turbine spin
    turbine.rotation.x += 0.2;
    
    // Steam animation
    steamGroup.children.forEach(s => {
      s.position.y += 0.02;
      s.scale.setScalar(s.position.y / 2);
      s.material.opacity = 1 - (s.position.y / 4);
      if (s.position.y > 4) {
        s.position.y = 1.5;
        s.material.opacity = 0.5;
        s.scale.setScalar(1);
      }
    });

    // Heat pulse in reservoir
    reservoir.material.opacity = 0.7 + Math.sin(t*0.5)*0.2;
  };

  group.userData.quiz = [
    { question: "Why must geothermal water be injected back into the ground?", options: ["To hide it", "To maintain reservoir pressure and ensure a sustainable, renewable heat cycle", "To cool the Earth's core"], answer: 1 },
    { question: "What causes the superheated liquid water to turn into steam in a 'Flash' plant?", options: ["Heating it with coal", "Dropping its pressure suddenly in the flash tank", "Adding chemicals"], answer: 1 }
  ];

  return group;
}
