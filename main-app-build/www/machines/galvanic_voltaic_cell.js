export function createGalvanicCell(THREE) {
  const group = new THREE.Group();

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
  
  // 1. Zinc Half-Cell (Anode - Oxidation)
  const zincGroup = new THREE.Group();
  zincGroup.position.set(-3, 0, 0);
  group.add(zincGroup);

  const beakerL = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 32), glassMat);
  zincGroup.add(beakerL);
  
  const liquidL = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 2.5, 32), new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 }));
  liquidL.position.y = -0.25;
  zincGroup.add(liquidL);
  liquidL.userData = { id: 'zinc_sulfate', name: 'Zinc Sulfate Solution (Zn²⁺ & SO₄²⁻)', description: 'Electrolyte solution containing Zinc ions.' };

  const zincElectrode = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 1), new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.4 }));
  zincElectrode.position.y = 0.5;
  zincGroup.add(zincElectrode);
  zincElectrode.userData = { id: 'anode', name: 'Zinc Anode (-)', description: 'Oxidation occurs here. Zinc atoms lose 2 electrons to become Zn2+ ions, which dissolve into the solution. The electrode slowly dissolves.' };

  // 2. Copper Half-Cell (Cathode - Reduction)
  const copperGroup = new THREE.Group();
  copperGroup.position.set(3, 0, 0);
  group.add(copperGroup);

  const beakerR = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 32), glassMat);
  copperGroup.add(beakerR);

  const liquidR = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 2.5, 32), new THREE.MeshBasicMaterial({ color: 0x2244ff, transparent: true, opacity: 0.8 }));
  liquidR.position.y = -0.25;
  copperGroup.add(liquidR);
  liquidR.userData = { id: 'copper_sulfate', name: 'Copper Sulfate Solution (Cu²⁺ & SO₄²⁻)', description: 'Electrolyte solution containing blue Copper ions.' };

  const copperElectrode = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 1), new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 }));
  copperElectrode.position.y = 0.5;
  copperGroup.add(copperElectrode);
  copperElectrode.userData = { id: 'cathode', name: 'Copper Cathode (+)', description: 'Reduction occurs here. Cu2+ ions from the solution gain 2 electrons to become solid Copper atoms, depositing on the electrode.' };

  // 3. Wire & Voltmeter
  const wireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 2.25, 0),
    new THREE.Vector3(-3, 4, 0),
    new THREE.Vector3(0, 4, 0),
    new THREE.Vector3(3, 4, 0),
    new THREE.Vector3(3, 2.25, 0)
  ]);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 32, 0.05, 8, false), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  group.add(wire);

  const meter = new THREE.Group();
  meter.position.set(0, 4, 0);
  group.add(meter);
  const meterBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.5), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
  meter.add(meterBox);
  const meterScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ color: 0x88ff88 }));
  meterScreen.position.z = 0.26;
  meter.add(meterScreen);
  meter.userData = { id: 'voltmeter', name: 'Voltmeter', description: 'Measures the electromotive force (voltage). A standard Zn/Cu cell produces about 1.10 Volts.' };

  // Electrons flowing through wire
  const eGeo = new THREE.SphereGeometry(0.1);
  const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const electrons = new THREE.Group();
  group.add(electrons);
  const eList = [];
  for(let i=0; i<10; i++) {
    const e = new THREE.Mesh(eGeo, eMat);
    electrons.add(e);
    eList.push({ mesh: e, progress: Math.random() });
  }

  // 4. Salt Bridge
  const bridgeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(-2, 2.5, 0),
    new THREE.Vector3(0, 2.5, 0),
    new THREE.Vector3(2, 2.5, 0),
    new THREE.Vector3(2, 0, 0)
  ]);
  const bridge = new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 32, 0.3, 16, false), glassMat);
  group.add(bridge);
  bridge.userData = { id: 'salt_bridge', name: 'Salt Bridge (e.g., KNO₃)', description: 'Contains inert ions. Crucial to complete the circuit and maintain electrical neutrality in the half-cells as electrons flow away.' };

  // Ions flowing in salt bridge (K+ to cathode, NO3- to anode)
  const kMat = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // K+ goes right
  const no3Mat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // NO3- goes left
  const ions = new THREE.Group();
  group.add(ions);
  const ionList = [];
  for(let i=0; i<10; i++) {
    const isK = Math.random() > 0.5;
    const mesh = new THREE.Mesh(eGeo, isK ? kMat : no3Mat);
    ions.add(mesh);
    ionList.push({ mesh: mesh, isK: isK, progress: Math.random() });
  }

  group.userData.animate = function(delta) {
    const speed = 0.005;

    // Electrons flow Zn -> Cu
    eList.forEach(e => {
      e.progress += speed;
      if (e.progress > 1) e.progress = 0;
      wireCurve.getPointAt(e.progress, e.mesh.position);
    });

    // Salt bridge ions flow
    ionList.forEach(i => {
      if (i.isK) {
        // K+ goes to Cu (right)
        i.progress += speed * 0.5;
        if (i.progress > 1) i.progress = 0;
        bridgeCurve.getPointAt(i.progress, i.mesh.position);
      } else {
        // NO3- goes to Zn (left)
        i.progress -= speed * 0.5;
        if (i.progress < 0) i.progress = 1;
        bridgeCurve.getPointAt(i.progress, i.mesh.position);
      }
    });

    // Electrodes degrade/grow slowly (simulated with scale)
    const t = Date.now() * 0.001;
    // Just a tiny wobble to simulate change without ruining the geometry over long periods
    zincElectrode.scale.setScalar(1.0 - Math.sin(t*0.5)*0.1);
    copperElectrode.scale.setScalar(1.0 + Math.sin(t*0.5)*0.1);
  };

  group.userData.quiz = [
    { question: "In a Galvanic Cell, which way do the electrons flow through the wire?", options: ["From the Cathode to the Anode", "From the Anode (where oxidation occurs) to the Cathode", "Through the salt bridge"], answer: 1 },
    { question: "What is the purpose of the Salt Bridge?", options: ["To carry electrons", "To cool down the reaction", "To balance the charge buildup in the solutions, completing the circuit"], answer: 2 }
  ];

  return group;
}
