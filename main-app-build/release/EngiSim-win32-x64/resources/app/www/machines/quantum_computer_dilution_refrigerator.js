export function createQuantumComputer(THREE) {
  const group = new THREE.Group();

  // 1. Dilution Refrigerator Layers (The "Chandelier")
  const plates = [
    { radius: 2.5, y: 5, temp: "300 K (Room Temp)", color: 0x888888 },
    { radius: 2.3, y: 3.5, temp: "50 K", color: 0xaaaaaa },
    { radius: 2.1, y: 2, temp: "4 K", color: 0xcccccc },
    { radius: 1.9, y: 0.5, temp: "800 mK", color: 0xdddddd },
    { radius: 1.7, y: -1, temp: "100 mK", color: 0xeeeeee },
    { radius: 1.5, y: -2.5, temp: "15 mK (Base Temp)", color: 0xffffff }
  ];

  const plateGeo = new THREE.CylinderGeometry(1, 1, 0.2, 32);
  plates.forEach((p, index) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1, roughness: 0.2 }); // Gold plated copper
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(p.radius, p.radius, 0.1, 32), mat);
    plate.position.y = p.y;
    group.add(plate);
    plate.userData = { id: `plate_${index}`, name: `Cooling Stage (${p.temp})`, description: `Thermal radiation shield and cooling stage. Successive stages get colder to isolate the quantum chip from thermal noise.` };

    // Support pillars between plates
    if (index < plates.length - 1) {
      const nextY = plates[index+1].y;
      const height = Math.abs(p.y - nextY);
      const pillarGeo = new THREE.CylinderGeometry(0.05, 0.05, height);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });
      for(let i=0; i<3; i++) {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        const angle = (i * Math.PI * 2) / 3;
        pillar.position.set(Math.cos(angle)*1.2, p.y - height/2, Math.sin(angle)*1.2);
        group.add(pillar);
      }
    }
  });

  // 2. Coaxial Microwave Cables
  const cableMat = new THREE.MeshStandardMaterial({ color: 0xcc7722, metalness: 0.8 }); // Niobium-titanium / Copper
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 5, 1.5),
    new THREE.Vector3(0.5, 3, 1.2),
    new THREE.Vector3(-0.5, 1, 1.0),
    new THREE.Vector3(0, -1, 0.8),
    new THREE.Vector3(0, -2.5, 0.5)
  ]);
  
  for(let i=0; i<8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const rotatedCurve = new THREE.CatmullRomCurve3(cableCurve.points.map(pt => {
      const r = Math.sqrt(pt.x*pt.x + pt.z*pt.z);
      const a = Math.atan2(pt.z, pt.x) + angle;
      return new THREE.Vector3(Math.cos(a)*r, pt.y, Math.sin(a)*r);
    }));
    const cableGeo = new THREE.TubeGeometry(rotatedCurve, 20, 0.02, 8, false);
    const cable = new THREE.Mesh(cableGeo, cableMat);
    group.add(cable);
    if(i===0) cable.userData = { id: 'microwave_cables', name: 'Superconducting Coaxial Cables', description: 'Carries microwave pulses to control and read out the state of the qubits.' };
  }

  // 3. Mixing Chamber (Bottom part)
  const mixGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
  const mixMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
  const mixer = new THREE.Mesh(mixGeo, mixMat);
  mixer.position.y = -3.5;
  group.add(mixer);
  mixer.userData = { id: 'mixing_chamber', name: 'He-3 / He-4 Mixing Chamber', description: 'Where helium isotopes mix to absorb heat, reaching temperatures colder than deep space (15 milliKelvin).' };

  // 4. Quantum Processing Unit (QPU) Shield
  const qpuShieldGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32);
  const qpuShieldMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 }); // Mu-metal shield
  const qpuShield = new THREE.Mesh(qpuShieldGeo, qpuShieldMat);
  qpuShield.position.y = -5;
  group.add(qpuShield);
  qpuShield.userData = { id: 'magnetic_shield', name: 'Cryoperm Magnetic Shield', description: 'Blocks Earth\'s magnetic field and stray electromagnetic noise from disrupting the qubits.' };

  // 5. The Quantum Chip (Inside the shield - visualized slightly below for interaction)
  const chipGeo = new THREE.BoxGeometry(0.5, 0.02, 0.5);
  const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.1 });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.y = -6;
  group.add(chip);
  chip.userData = { id: 'qpu_chip', name: 'Superconducting Quantum Chip', description: 'Contains the transmon qubits. The actual computational engine.' };

  // Qubits on the chip
  const qubitGeo = new THREE.BoxGeometry(0.05, 0.03, 0.05);
  const qubitMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0055aa });
  const qubitsGroup = new THREE.Group();
  for(let x=-0.15; x<=0.15; x+=0.1) {
    for(let z=-0.15; z<=0.15; z+=0.1) {
      const qb = new THREE.Mesh(qubitGeo, qubitMat);
      qb.position.set(x, -5.98, z);
      qubitsGroup.add(qb);
    }
  }
  group.add(qubitsGroup);
  qubitsGroup.children[0].userData = { id: 'qubits', name: 'Transmon Qubits', description: 'Superconducting circuits acting as artificial atoms. They can exist in a superposition of 0 and 1.' };

  // 6. Readout Resonators (Meandering lines on the chip)
  const resGeo = new THREE.BoxGeometry(0.4, 0.01, 0.4);
  const resMat = new THREE.MeshBasicMaterial({ color: 0x888800, wireframe: true });
  const resonator = new THREE.Mesh(resGeo, resMat);
  resonator.position.set(0, -5.99, 0);
  group.add(resonator);
  resonator.userData = { id: 'resonators', name: 'Readout Resonators', description: 'Meandering microwave cavities used to measure the state of the qubits via entanglement.' };

  group.userData.animate = function(delta) {
    // Make the qubits pulsate to represent superposition
    const t = Date.now() * 0.003;
    qubitsGroup.children.forEach((qb, i) => {
      qb.material.emissiveIntensity = 0.5 + Math.sin(t + i)*0.5;
    });
  };

  group.userData.quiz = [
    { question: "Why must a superconducting quantum computer be cooled to 15 milliKelvin (near absolute zero)?", options: ["To make the metal harder", "To prevent thermal energy from destroying the delicate quantum states (decoherence)", "To reduce electricity bills"], answer: 1 },
    { question: "What is a 'qubit'?", options: ["A bit that is exactly half of a byte", "A quantum bit that can represent 0, 1, or any quantum superposition of both simultaneously", "A microscopic computer chip"], answer: 1 }
  ];

  return group;
}
