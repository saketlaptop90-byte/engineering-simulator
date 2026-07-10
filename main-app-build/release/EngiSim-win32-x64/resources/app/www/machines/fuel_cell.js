import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createFuelCell(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Anode Flow Field Plate
    const anodePlateGroup = new THREE.Group();
    const anodePlateBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 10, 10), titanium);
    anodePlateGroup.add(anodePlateBase);
    
    for (let i = -4; i <= 4; i+=2) {
        const channel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 10), darkSteel);
        channel.position.set(0.75, i, 0); // attached to the +x face
        anodePlateGroup.add(channel);
    }
    anodePlateGroup.position.set(-1.95, 0, 0);
    
    const wireGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 7, 0),
        new THREE.Vector3(1.95, 7, 0)
    ]), 20, 0.15, 8, false);
    const wire = new THREE.Mesh(wireGeom, copper);
    anodePlateGroup.add(wire);

    // 2. Cathode Flow Field Plate
    const cathodePlateGroup = new THREE.Group();
    const cathodePlateBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 10, 10), titanium);
    cathodePlateGroup.add(cathodePlateBase);
    
    for (let i = -4; i <= 4; i+=2) {
        const channel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 10), darkSteel);
        channel.position.set(-0.75, i, 0); // attached to the -x face
        cathodePlateGroup.add(channel);
    }
    cathodePlateGroup.position.set(1.95, 0, 0);
    
    const wireGeom2 = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.95, 7, 0),
        new THREE.Vector3(0, 7, 0),
        new THREE.Vector3(0, 5, 0)
    ]), 20, 0.15, 8, false);
    const wire2 = new THREE.Mesh(wireGeom2, copper);
    cathodePlateGroup.add(wire2);

    // 3. Anode Catalyst Layer
    const anodeCatalystGroup = new THREE.Group();
    const anodeCatalyst = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.8, 9.8), tinted(carbonFiber, 0x333333));
    anodeCatalystGroup.add(anodeCatalyst);
    anodeCatalystGroup.position.set(-0.5, 0, 0);

    // 4. Cathode Catalyst Layer
    const cathodeCatalystGroup = new THREE.Group();
    const cathodeCatalyst = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.8, 9.8), tinted(carbonFiber, 0x333333));
    cathodeCatalystGroup.add(cathodeCatalyst);
    cathodeCatalystGroup.position.set(0.5, 0, 0);

    // 5. PEM (Proton Exchange Membrane)
    const pemGroup = new THREE.Group();
    const pemMaterial = tinted(plastic, 0x88ccff);
    pemMaterial.transparent = true;
    pemMaterial.opacity = 0.8;
    const pem = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10.2, 10.2), pemMaterial);
    pemGroup.add(pem);
    pemGroup.position.set(0, 0, 0);

    // 6. Hydrogen Gas (H2) Molecules
    const h2Group = new THREE.Group();
    const h2Mat = tinted(plastic, 0xffffff);
    for (let i = 0; i < 20; i++) {
        const molecule = new THREE.Group();
        const atom1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), h2Mat);
        atom1.position.set(-0.1, 0, 0);
        const atom2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), h2Mat);
        atom2.position.set(0.1, 0, 0);
        molecule.add(atom1, atom2);
        molecule.position.set(-4 + Math.random()*2, -4 + Math.random() * 8, -4 + Math.random() * 8);
        molecule.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.5 };
        h2Group.add(molecule);
    }

    // 7. Oxygen Gas (O2) Molecules
    const o2Group = new THREE.Group();
    const o2Mat = tinted(plastic, 0xff4444);
    for (let i = 0; i < 20; i++) {
        const molecule = new THREE.Group();
        const atom1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), o2Mat);
        atom1.position.set(-0.15, 0, 0);
        const atom2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), o2Mat);
        atom2.position.set(0.15, 0, 0);
        molecule.add(atom1, atom2);
        molecule.position.set(2 + Math.random()*2, -4 + Math.random() * 8, -4 + Math.random() * 8);
        molecule.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.5 };
        o2Group.add(molecule);
    }

    // 8. Protons (H+)
    const protonGroup = new THREE.Group();
    const protonMat = tinted(plastic, 0x4444ff);
    for (let i = 0; i < 30; i++) {
        const proton = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), protonMat);
        proton.position.set(-0.5 + Math.random(), -4 + Math.random() * 8, -4 + Math.random() * 8);
        proton.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.5 };
        protonGroup.add(proton);
    }

    // 9. Electrons (e-)
    const electronGroup = new THREE.Group();
    const electronMat = tinted(plastic, 0xffff00);
    for (let i = 0; i < 40; i++) {
        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), electronMat);
        electron.userData = { progress: Math.random(), speed: 0.2 + Math.random() * 0.2, isElectron: true };
        electronGroup.add(electron);
    }
    const bulbGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const bulbMat = tinted(glass, 0xffffaa);
    bulbMat.transparent = true;
    bulbMat.opacity = 0.8;
    const bulb = new THREE.Mesh(bulbGeom, bulbMat);
    bulb.position.set(0, 7, 0);
    bulb.userData = { isBulb: true };
    electronGroup.add(bulb);

    // 10. Water (H2O) Molecules
    const h2oGroup = new THREE.Group();
    const h2oRedMat = tinted(plastic, 0xff4444);
    const h2oWhiteMat = tinted(plastic, 0xffffff);
    for (let i = 0; i < 20; i++) {
        const molecule = new THREE.Group();
        const oAtom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), h2oRedMat);
        const hAtom1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), h2oWhiteMat);
        hAtom1.position.set(0.18, 0.15, 0);
        const hAtom2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), h2oWhiteMat);
        hAtom2.position.set(-0.18, 0.15, 0);
        molecule.add(oAtom, hAtom1, hAtom2);
        molecule.position.set(0.5 + Math.random() * 2, -4 + Math.random() * 8, -4 + Math.random() * 8);
        molecule.userData = { offset: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.5 };
        h2oGroup.add(molecule);
    }

    parts.push({
        name: "Anode Flow Field Plate",
        description: "Channel plate distributing Hydrogen gas across the anode catalyst layer and conducting electrons away.",
        material: "Titanium / Graphite",
        function: "Distributes reactant gas evenly and conducts electrons away from the anode.",
        assemblyOrder: 1,
        connections: ["Anode Catalyst Layer", "Hydrogen Inlet", "External Circuit"],
        failureEffect: "Uneven gas distribution and poor electron conduction, reducing efficiency.",
        cascadeFailures: ["Catalyst degradation", "Fuel starvation in localized areas"],
        originalPosition: { x: -1.95, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 },
        group: anodePlateGroup
    });

    parts.push({
        name: "Cathode Flow Field Plate",
        description: "Channel plate distributing Oxygen/Air across the cathode catalyst layer.",
        material: "Titanium / Graphite",
        function: "Distributes oxygen, conducts electrons back from the circuit, and provides a path for water removal.",
        assemblyOrder: 10,
        connections: ["Cathode Catalyst Layer", "Oxygen Inlet", "External Circuit"],
        failureEffect: "Water flooding blocking oxygen flow, causing performance drop.",
        cascadeFailures: ["Complete cell stalling due to reactant blockage"],
        originalPosition: { x: 1.95, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 },
        group: cathodePlateGroup
    });

    parts.push({
        name: "Anode Catalyst Layer",
        description: "Platinum-based layer where Hydrogen gas is split into protons and electrons.",
        material: "Platinum on Carbon Support",
        function: "Catalyzes the oxidation of hydrogen molecules (H2 -> 2H+ + 2e-).",
        assemblyOrder: 2,
        connections: ["Anode Flow Plate", "PEM"],
        failureEffect: "Reduced reaction rate, lower power output.",
        cascadeFailures: ["Carbon monoxide poisoning completely deactivating cell"],
        originalPosition: { x: -0.5, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        group: anodeCatalystGroup
    });

    parts.push({
        name: "Cathode Catalyst Layer",
        description: "Platinum-based layer where protons, electrons, and oxygen combine.",
        material: "Platinum on Carbon Support",
        function: "Catalyzes the reduction of oxygen and formation of water (O2 + 4H+ + 4e- -> 2H2O).",
        assemblyOrder: 9,
        connections: ["Cathode Flow Plate", "PEM"],
        failureEffect: "Slow oxygen reduction reaction (ORR), drastically limiting current.",
        cascadeFailures: ["Catalyst dissolution and loss of active surface area"],
        originalPosition: { x: 0.5, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 },
        group: cathodeCatalystGroup
    });

    parts.push({
        name: "Proton Exchange Membrane (PEM)",
        description: "Semi-permeable membrane that only allows protons (H+) to pass through.",
        material: "Nafion (Fluoropolymer)",
        function: "Conducts protons from anode to cathode while strictly blocking electrons and gases.",
        assemblyOrder: 5,
        connections: ["Anode Catalyst", "Cathode Catalyst"],
        failureEffect: "Gas crossover or electron short-circuiting.",
        cascadeFailures: ["Combustion of H2/O2 mixture inside cell", "Catastrophic cell destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -2 },
        group: pemGroup
    });

    parts.push({
        name: "Hydrogen Gas (H2) Molecules",
        description: "Fuel entering the anode side of the cell.",
        material: "Gas",
        function: "Provides the chemical energy that will be converted into electrical energy.",
        assemblyOrder: 3,
        connections: ["Anode Flow Plate"],
        failureEffect: "Fuel starvation leads to no power.",
        cascadeFailures: ["Cell voltage reversal and severe catalyst damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: -4, z: 0 },
        group: h2Group
    });

    parts.push({
        name: "Oxygen Gas (O2) Molecules",
        description: "Oxidizer entering the cathode side, typically from ambient air.",
        material: "Gas",
        function: "Combines with protons and electrons to complete the electrochemical reaction.",
        assemblyOrder: 8,
        connections: ["Cathode Flow Plate"],
        failureEffect: "Oxidant starvation drastically lowers voltage.",
        cascadeFailures: ["Inability to clear water, leading to flooding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -4, z: 0 },
        group: o2Group
    });

    parts.push({
        name: "Protons (H+)",
        description: "Positively charged hydrogen ions.",
        material: "Ion",
        function: "Migrate through the PEM to maintain charge balance and form water at the cathode.",
        assemblyOrder: 4,
        connections: ["PEM"],
        failureEffect: "Membrane dehydration stops proton flow, halting the cell.",
        cascadeFailures: ["Increased internal resistance, overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        group: protonGroup
    });

    parts.push({
        name: "Electrons (e-)",
        description: "Negatively charged particles forced through the external circuit.",
        material: "Particle",
        function: "Provide the actual electrical current to power external devices.",
        assemblyOrder: 6,
        connections: ["External Circuit"],
        failureEffect: "High contact resistance lowers useful power output.",
        cascadeFailures: ["Excessive heat generation at poor connections"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        group: electronGroup
    });

    parts.push({
        name: "Water (H2O) Molecules",
        description: "The only byproduct of a hydrogen fuel cell.",
        material: "Liquid/Vapor",
        function: "Must be removed efficiently to prevent cathode flooding.",
        assemblyOrder: 7,
        connections: ["Cathode Flow Plate Exhaust"],
        failureEffect: "Accumulation blocks oxygen from reaching the catalyst.",
        cascadeFailures: ["Performance plummeting to zero due to flooding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -6, z: 0 },
        group: h2oGroup
    });

    parts.forEach(part => group.add(part.group));

    const quizQuestions = [
        {
            question: "What is the only physical byproduct emitted by a hydrogen fuel cell?",
            options: ["Carbon Dioxide (CO2)", "Carbon Monoxide (CO)", "Water (H2O)", "Ozone (O3)"],
            correct: 2,
            explanation: "Hydrogen and oxygen combine at the cathode to form pure water (H2O), making fuel cells zero-emission energy sources.",
            difficulty: "Easy"
        },
        {
            question: "What material is most commonly used as the catalyst in a PEM fuel cell?",
            options: ["Copper", "Platinum", "Aluminum", "Silver"],
            correct: 1,
            explanation: "Platinum is used because it is highly effective at splitting the hydrogen molecule into protons and electrons, and combining them with oxygen.",
            difficulty: "Medium"
        },
        {
            question: "What is the specific function of the Proton Exchange Membrane (PEM)?",
            options: ["To block protons and allow electrons through", "To allow only protons to pass through", "To cool the fuel cell", "To filter impurities from the hydrogen"],
            correct: 1,
            explanation: "The PEM strictly allows positively charged protons to pass through, forcing electrons to travel through the external circuit to create electrical current.",
            difficulty: "Medium"
        },
        {
            question: "How does a fuel cell relate to electrolysis?",
            options: ["They are exactly the same process", "A fuel cell is the reverse of electrolysis", "Electrolysis only happens in batteries", "Fuel cells use electrolysis to generate hydrogen internally"],
            correct: 1,
            explanation: "Electrolysis uses electricity to split water into hydrogen and oxygen. A fuel cell reverses this, combining hydrogen and oxygen to produce electricity and water.",
            difficulty: "Hard"
        },
        {
            question: "Why are hydrogen fuel cells often preferred over batteries for heavy-duty or long-range transport?",
            options: ["They are much cheaper to manufacture", "They have a higher energy density by weight and can be refueled quickly", "They don't require any rare metals", "They operate without generating any heat"],
            correct: 1,
            explanation: "Hydrogen has a very high energy density by mass compared to lithium-ion batteries, and refilling a hydrogen tank takes minutes compared to hours for charging a massive battery.",
            difficulty: "Medium"
        },
        {
            question: "Why must water be continuously removed from the cathode side?",
            options: ["It will dissolve the platinum catalyst", "It will short-circuit the external wire", "To prevent 'flooding' which blocks oxygen from reaching the catalyst", "Because the water is highly acidic and corrosive"],
            correct: 2,
            explanation: "If water accumulates in the cathode flow channels, it blocks oxygen gas from reaching the active catalyst sites, stopping the electrochemical reaction.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // 5: H2
        const h2Group = meshes[5].group;
        h2Group.children.forEach(mol => {
            let x = mol.position.x + speed * mol.userData.speed * 0.05;
            if (x > -0.5) { // reached anode catalyst
                x = -4 - Math.random(); // reset
            }
            mol.position.x = x;
            mol.rotation.x = time * 2 * mol.userData.speed;
            mol.rotation.y = time * 3 * mol.userData.speed;
        });

        // 6: O2
        const o2Group = meshes[6].group;
        o2Group.children.forEach(mol => {
            let x = mol.position.x - speed * mol.userData.speed * 0.05;
            if (x < 0.5) { // reached cathode catalyst
                x = 4 + Math.random();
            }
            mol.position.x = x;
            mol.rotation.x = time * 2 * mol.userData.speed;
            mol.rotation.y = time * 3 * mol.userData.speed;
        });

        // 7: Protons
        const protonGroup = meshes[7].group;
        protonGroup.children.forEach(proton => {
            let x = proton.position.x + speed * proton.userData.speed * 0.03;
            if (x > 0.5) { // reached cathode catalyst
                x = -0.5;
            }
            proton.position.x = x;
            proton.position.y += Math.sin(time * 5 + proton.userData.offset) * 0.005;
        });

        // 8: Electrons
        const electronGroup = meshes[8].group;
        electronGroup.children.forEach(electron => {
            if (electron.userData.isBulb) {
                electron.material.opacity = 0.5 + Math.sin(time * 10) * 0.3;
                return;
            }
            electron.userData.progress += speed * electron.userData.speed * 0.01;
            if (electron.userData.progress > 1) electron.userData.progress -= 1;
            
            let p = electron.userData.progress;
            let x, y;
            if (p < 0.25) {
                x = -1.95;
                y = 0 + (p / 0.25) * 7;
            } else if (p < 0.5) {
                x = -1.95 + ((p - 0.25) / 0.25) * 1.95;
                y = 7;
            } else if (p < 0.75) {
                x = 0 + ((p - 0.5) / 0.25) * 1.95;
                y = 7;
            } else {
                x = 1.95;
                y = 7 - ((p - 0.75) / 0.25) * 7;
            }
            electron.position.set(x, y, 0);
        });

        // 9: H2O
        const h2oGroup = meshes[9].group;
        h2oGroup.children.forEach(mol => {
            mol.position.x += speed * mol.userData.speed * 0.03;
            mol.position.y -= speed * mol.userData.speed * 0.03;
            if (mol.position.y < -5 || mol.position.x > 5) {
                mol.position.set(0.5, -4 + Math.random() * 8, -4 + Math.random() * 8);
            }
            mol.rotation.z = time * 2 * mol.userData.speed;
        });
    }

    return {
        group,
        parts,
        description: "A Proton Exchange Membrane (PEM) Fuel Cell that generates electricity by reacting hydrogen fuel with oxygen, producing only water and heat.",
        quizQuestions,
        animate
    };
}
