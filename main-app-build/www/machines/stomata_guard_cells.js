export function createStomataGuardCells(THREE) {
    const group = new THREE.Group();

    // 1. Left Guard Cell
    const guardGeo = new THREE.SphereGeometry(1, 32, 16);
    const leftGuardMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leftGuardCell = new THREE.Mesh(guardGeo, leftGuardMat);
    leftGuardCell.scale.set(0.6, 2, 0.6);
    leftGuardCell.position.set(-0.7, 0, 0);
    group.add(leftGuardCell);

    // 2. Right Guard Cell
    const rightGuardMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const rightGuardCell = new THREE.Mesh(guardGeo, rightGuardMat);
    rightGuardCell.scale.set(0.6, 2, 0.6);
    rightGuardCell.position.set(0.7, 0, 0);
    group.add(rightGuardCell);

    // 3. Epidermal Cell
    const epiGeo = new THREE.BoxGeometry(6, 6, 0.2);
    const epiMat = new THREE.MeshStandardMaterial({ color: 0x8FBC8F, transparent: true, opacity: 0.3 });
    const epidermalCell = new THREE.Mesh(epiGeo, epiMat);
    epidermalCell.position.set(0, 0, -0.5);
    group.add(epidermalCell);

    // 4. Stomatal Pore
    const poreGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    const poreMat = new THREE.MeshBasicMaterial({ color: 0x051F05 });
    const stomatalPore = new THREE.Mesh(poreGeo, poreMat);
    stomatalPore.rotation.x = Math.PI / 2;
    stomatalPore.scale.set(1, 1, 2);
    stomatalPore.position.set(0, 0, -0.4);
    group.add(stomatalPore);

    // 5. Vacuole
    const vacGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const vacMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.8 });
    const vacuole = new THREE.Mesh(vacGeo, vacMat);
    vacuole.scale.set(0.8, 2.5, 0.8);
    vacuole.position.set(-0.7, 0, 0.1);
    group.add(vacuole);

    // 6. Chloroplast
    const chloroGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const chloroMat = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const chloroplast = new THREE.Mesh(chloroGeo, chloroMat);
    chloroplast.position.set(0.7, 1, 0.4);
    group.add(chloroplast);

    // 7. Potassium Ion
    const potGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0x800080 }); // Purple
    const potassiumIon = new THREE.Mesh(potGeo, potMat);
    potassiumIon.position.set(-2, 0, 0);
    group.add(potassiumIon);

    // 8. Water Molecule
    const waterGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Blue
    const waterMolecule = new THREE.Mesh(waterGeo, waterMat);
    waterMolecule.position.set(2, -1, 0);
    group.add(waterMolecule);

    // 9. Cellulose Microfibrils
    const fibrilGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 32);
    const fibrilMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const celluloseMicrofibril = new THREE.Mesh(fibrilGeo, fibrilMat);
    celluloseMicrofibril.rotation.x = Math.PI / 2;
    celluloseMicrofibril.position.set(-0.7, 0, 0);
    group.add(celluloseMicrofibril);

    // 10. Carbon Dioxide
    const co2Geo = new THREE.SphereGeometry(0.08, 16, 16);
    const co2Mat = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray
    const carbonDioxide = new THREE.Mesh(co2Geo, co2Mat);
    carbonDioxide.position.set(0, 0, 2);
    group.add(carbonDioxide);

    let time = 0;
    const animate = (delta) => {
        time += delta;
        const cycle = Math.sin(time * 0.5);
        const openFactor = (cycle + 1) / 2; // 0 to 1

        leftGuardCell.position.x = -0.4 - (openFactor * 0.4);
        rightGuardCell.position.x = 0.4 + (openFactor * 0.4);

        const vacScale = 1 + openFactor * 0.5;
        vacuole.scale.set(0.8 * vacScale, 2.5 * vacScale, 0.8 * vacScale);
        vacuole.position.x = leftGuardCell.position.x;

        celluloseMicrofibril.position.x = leftGuardCell.position.x;
        chloroplast.position.x = rightGuardCell.position.x;

        stomatalPore.scale.x = 0.1 + (openFactor * 1.5);
        stomatalPore.visible = openFactor > 0.05;

        if (openFactor > 0.5) {
            potassiumIon.position.x = leftGuardCell.position.x + Math.sin(time*5)*0.2;
            potassiumIon.position.y = Math.cos(time*5)*0.5;
            waterMolecule.position.x = rightGuardCell.position.x + Math.cos(time*4)*0.2;
            waterMolecule.position.y = Math.sin(time*4)*0.5;
        } else {
            potassiumIon.position.x = -2 + Math.sin(time*2)*0.2;
            potassiumIon.position.y = Math.cos(time*2)*0.2;
            waterMolecule.position.x = 2 + Math.cos(time*2)*0.2;
            waterMolecule.position.y = Math.sin(time*2)*0.2;
        }

        if (openFactor > 0.1) {
            carbonDioxide.position.z = Math.cos(time*3) * 1.5;
            carbonDioxide.position.x = Math.sin(time*2) * 0.2;
        } else {
            carbonDioxide.position.z = 2;
        }
    };

    return { group, animate };
}

export const quiz = [
  {
    question: "What is the primary function of guard cells?",
    options: [
      "To regulate the size of the stomatal pore",
      "To absorb water from the soil",
      "To perform cellular respiration",
      "To produce epidermal tissue"
    ],
    answer: "To regulate the size of the stomatal pore"
  },
  {
    question: "Which ion plays a crucial role in the opening and closing of stomata?",
    options: [
      "Potassium (K+)",
      "Calcium (Ca2+)",
      "Sodium (Na+)",
      "Iron (Fe2+)"
    ],
    answer: "Potassium (K+)"
  },
  {
    question: "What causes guard cells to become turgid and open the stomatal pore?",
    options: [
      "Water entering the guard cells by osmosis",
      "Water leaving the guard cells by osmosis",
      "Loss of potassium ions",
      "Decrease in vacuole size"
    ],
    answer: "Water entering the guard cells by osmosis"
  },
  {
    question: "What structural feature of guard cells allows them to bow outward when turgid?",
    options: [
      "Radially oriented cellulose microfibrils",
      "A uniform cell wall thickness",
      "Lack of a cell membrane",
      "Absence of chloroplasts"
    ],
    answer: "Radially oriented cellulose microfibrils"
  },
  {
    question: "Which gas enters the leaf through open stomata for photosynthesis?",
    options: [
      "Carbon Dioxide (CO2)",
      "Oxygen (O2)",
      "Nitrogen (N2)",
      "Hydrogen (H2)"
    ],
    answer: "Carbon Dioxide (CO2)"
  },
  {
    question: "What happens to the stomata when the plant loses too much water (wilts)?",
    options: [
      "The guard cells become flaccid and the pore closes",
      "The guard cells become turgid and the pore opens",
      "The guard cells multiply rapidly",
      "The stomata permanently widen"
    ],
    answer: "The guard cells become flaccid and the pore closes"
  }
];
