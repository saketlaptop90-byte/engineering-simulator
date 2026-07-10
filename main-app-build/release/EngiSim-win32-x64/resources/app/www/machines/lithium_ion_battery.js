import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createLithiumIonBattery(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Helper to create cutaway cylindrical layers
    function createCutawayCylinder(innerRadius, outerRadius, height, startAngle, endAngle, mat) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
        if (innerRadius > 0) {
            shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
        } else {
            shape.lineTo(0, 0);
        }
        
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: height,
            curveSegments: 32,
            bevelEnabled: false
        });
        
        // Extrude creates depth along Z axis. Rotate to align with Y axis.
        geo.rotateX(Math.PI / 2);
        geo.translate(0, height / 2, 0); // Center the geometry around Y=0
        
        return new THREE.Mesh(geo, mat);
    }

    // Common cutaway angles: missing the front-right quadrant (0 to 90 degrees)
    const startA = Math.PI * 0.5;
    const endA = Math.PI * 2.0;
    const layerHeight = 18.0;

    // Custom Materials
    const lcoMaterial = tinted(ceramic, 0x2b2b36); // Dark grayish-blue
    const cuMaterial = copper;
    const alMaterial = aluminum;
    const sepMaterial = tinted(whitePlastic, 0xffffff);
    sepMaterial.transparent = true;
    sepMaterial.opacity = 0.85;
    const elecMat = tinted(glass, 0xaaffaa);
    elecMat.transparent = true;
    elecMat.opacity = 0.4;
    const wireMat = tinted(rubber, 0x111111);

    // 1. Outer Steel Casing
    const casingGroup = new THREE.Group();
    casingGroup.add(createCutawayCylinder(4.9, 5.1, 20.0, startA, endA, steel)); // Main tube
    casingGroup.add(createCutawayCylinder(4.5, 4.9, 0.5, startA, endA, steel).translateY(9.75)); // Top rim
    casingGroup.add(createCutawayCylinder(0, 4.9, 0.5, startA, endA, steel).translateY(-9.75)); // Bottom plate
    group.add(casingGroup);
    parts.push({
        name: "Outer Steel Casing",
        description: "A durable cylindrical shell that protects the internal components and maintains structural integrity under pressure.",
        material: "Steel",
        function: "Protection and Structural Support",
        assemblyOrder: 1,
        connections: ["Negative Terminal"],
        failureEffect: "Physical damage or internal pressure build-up can cause casing rupture.",
        cascadeFailures: ["Thermal Runaway", "Electrolyte Leakage"],
        originalPosition: casingGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 0, 20),
        group: casingGroup
    });

    // 2. Positive Terminal
    const posTerminalGroup = new THREE.Group();
    posTerminalGroup.add(createCutawayCylinder(0, 4.5, 0.2, startA, endA, chrome).translateY(10.1));
    posTerminalGroup.add(createCutawayCylinder(0, 2.0, 0.5, startA, endA, chrome).translateY(10.35));
    group.add(posTerminalGroup);
    parts.push({
        name: "Positive Terminal",
        description: "The top cap of the battery, connected to the aluminum current collector of the cathode.",
        material: "Chrome / Aluminum",
        function: "Electrical Connection (Positive)",
        assemblyOrder: 10,
        connections: ["External Circuit", "Aluminum Current Collector"],
        failureEffect: "Corrosion or disconnection breaks the circuit.",
        cascadeFailures: [],
        originalPosition: posTerminalGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 15, 0),
        group: posTerminalGroup
    });

    // 3. Negative Terminal
    const negTerminalGroup = new THREE.Group();
    negTerminalGroup.add(createCutawayCylinder(0, 4.5, 0.2, startA, endA, darkSteel).translateY(-10.1));
    group.add(negTerminalGroup);
    parts.push({
        name: "Negative Terminal",
        description: "The flat bottom of the battery, electrically connected to the outer casing and the copper current collector.",
        material: "Dark Steel / Copper",
        function: "Electrical Connection (Negative)",
        assemblyOrder: 2,
        connections: ["External Circuit", "Copper Current Collector", "Outer Steel Casing"],
        failureEffect: "Poor contact increases internal resistance.",
        cascadeFailures: ["Heating", "Efficiency Loss"],
        originalPosition: negTerminalGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -15, 0),
        group: negTerminalGroup
    });

    // Jelly Roll Layers: Cathode, Anode, Separator, Current Collectors
    const cathodeGroup = new THREE.Group();
    const anodeGroup = new THREE.Group();
    const separatorGroup = new THREE.Group();
    const collectorsGroup = new THREE.Group();

    // Generate concentric jelly-roll layers
    for (let i = 0; i < 3; i++) {
        const offset = 0.4 + i * 1.5;
        // Copper Collector
        collectorsGroup.add(createCutawayCylinder(offset, offset + 0.05, layerHeight, startA, endA, cuMaterial));
        // Anode (Graphite)
        anodeGroup.add(createCutawayCylinder(offset + 0.05, offset + 0.6, layerHeight, startA, endA, carbonFiber));
        // Separator 1
        separatorGroup.add(createCutawayCylinder(offset + 0.6, offset + 0.75, layerHeight + 0.4, startA, endA, sepMaterial));
        // Cathode (LCO)
        cathodeGroup.add(createCutawayCylinder(offset + 0.75, offset + 1.3, layerHeight, startA, endA, lcoMaterial));
        // Aluminum Collector
        collectorsGroup.add(createCutawayCylinder(offset + 1.3, offset + 1.35, layerHeight, startA, endA, alMaterial));
        // Separator 2
        separatorGroup.add(createCutawayCylinder(offset + 1.35, offset + 1.5, layerHeight + 0.4, startA, endA, sepMaterial));
    }

    // 4. Cathode
    group.add(cathodeGroup);
    parts.push({
        name: "Cathode (Lithium Cobalt Oxide)",
        description: "The positive electrode material. During discharge, lithium ions intercalate into the LCO lattice.",
        material: "Lithium Cobalt Oxide (Ceramic/Metal)",
        function: "Stores Lithium ions during the discharged state.",
        assemblyOrder: 7,
        connections: ["Aluminum Current Collector", "Separator"],
        failureEffect: "Structural degradation reduces capacity.",
        cascadeFailures: ["Capacity Fade", "Thermal Runaway"],
        originalPosition: cathodeGroup.position.clone(),
        explodedPosition: new THREE.Vector3(12, 5, -12),
        group: cathodeGroup
    });

    // 5. Anode
    group.add(anodeGroup);
    parts.push({
        name: "Anode (Graphite)",
        description: "The negative electrode. Highly ordered graphite allows lithium ions to intercalate between its layers during charging.",
        material: "Graphite (Carbon Fiber)",
        function: "Stores Lithium ions during the charged state.",
        assemblyOrder: 6,
        connections: ["Copper Current Collector", "Separator"],
        failureEffect: "Lithium plating can occur if overcharged.",
        cascadeFailures: ["Dendrite Formation", "Internal Short Circuit"],
        originalPosition: anodeGroup.position.clone(),
        explodedPosition: new THREE.Vector3(-12, 5, 12),
        group: anodeGroup
    });

    // 6. Separator
    group.add(separatorGroup);
    parts.push({
        name: "Separator",
        description: "A micro-porous polymer membrane that prevents physical contact between electrodes while allowing ion transport.",
        material: "Polyethylene / Polypropylene",
        function: "Electrical insulation and Ion Permeability",
        assemblyOrder: 5,
        connections: ["Anode", "Cathode", "Electrolyte"],
        failureEffect: "Tearing or melting causes an internal short.",
        cascadeFailures: ["Massive Thermal Runaway", "Fire/Explosion"],
        originalPosition: separatorGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 5, -18),
        group: separatorGroup
    });

    // 7. Electrolyte
    const electrolyteGroup = new THREE.Group();
    electrolyteGroup.add(createCutawayCylinder(0.3, 4.9, 18.8, startA, endA, elecMat));
    group.add(electrolyteGroup);
    parts.push({
        name: "Electrolyte",
        description: "A liquid or gel containing lithium salts dissolved in organic solvents, filling the pores of the separator and electrodes.",
        material: "Liquid/Gel Organic Solvents with LiPF6",
        function: "Facilitates Lithium Ion Transport",
        assemblyOrder: 8,
        connections: ["Anode", "Cathode", "Separator"],
        failureEffect: "Decomposition produces gases, leading to swelling.",
        cascadeFailures: ["Venting", "Loss of Capacity", "Thermal Runaway"],
        originalPosition: electrolyteGroup.position.clone(),
        explodedPosition: new THREE.Vector3(15, -5, 5),
        group: electrolyteGroup
    });

    // 8. Lithium Ions (Li+)
    const ionsGroup = new THREE.Group();
    const ionGeo = new THREE.SphereGeometry(0.15, 6, 6);
    const ionsData = [];
    
    // Spawn ions in the drawn quadrants
    for (let i = 0; i < 3; i++) {
        const offset = 0.4 + i * 1.5;
        const anodeR = offset + 0.325; // center of anode radius
        const cathodeR = offset + 1.025; // center of cathode radius
        
        for (let j = 0; j < 60; j++) {
            const angle = startA + Math.random() * (endA - startA); // random within visible wedge
            const y = (Math.random() - 0.5) * layerHeight * 0.9;
            const phase = Math.random(); // 0 to 1
            
            const mesh = new THREE.Mesh(ionGeo, blueAccent);
            const currentR = THREE.MathUtils.lerp(anodeR, cathodeR, phase);
            mesh.position.set(Math.cos(angle) * currentR, y, Math.sin(angle) * currentR); // Note: Extrude shape maps Y -> Z after rotation
            ionsGroup.add(mesh);
            ionsData.push({ mesh, angle, y, anodeR, cathodeR, phase });
        }
    }
    group.add(ionsGroup);
    ionsGroup.userData.ionsData = ionsData;
    parts.push({
        name: "Lithium Ions (Li+)",
        description: "Charge carriers that physically move back and forth between the electrodes during charge and discharge cycles.",
        material: "Lithium",
        function: "Ion Transport (Charge Carriage)",
        assemblyOrder: 9,
        connections: ["Electrolyte", "Anode", "Cathode"],
        failureEffect: "Depletion or trapping (SEI growth) reduces cell capacity.",
        cascadeFailures: ["Capacity Fade"],
        originalPosition: ionsGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 0, -25),
        group: ionsGroup
    });

    // 9. External Circuit & Electrons
    const electronGroup = new THREE.Group();
    const curvePoints = [
        new THREE.Vector3(0, 10.6, 0),
        new THREE.Vector3(6, 12, 0),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(6, -12, 0),
        new THREE.Vector3(0, -10.3, 0)
    ];
    const wireCurve = new THREE.CatmullRomCurve3(curvePoints);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 64, 0.3, 8, false);
    electronGroup.add(new THREE.Mesh(wireGeo, wireMat));

    const electronGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const electronData = [];
    for(let i=0; i<30; i++) {
        const mesh = new THREE.Mesh(electronGeo, yellowAccent);
        const t = Math.random();
        mesh.position.copy(wireCurve.getPoint(t));
        electronGroup.add(mesh);
        electronData.push({ mesh, t });
    }
    group.add(electronGroup);
    electronGroup.userData.electronData = electronData;
    electronGroup.userData.wireCurve = wireCurve;
    parts.push({
        name: "External Circuit & Electrons (e-)",
        description: "The path outside the battery through which electrons flow to power a device. Electrons cannot pass through the separator.",
        material: "Copper Wire / Electrons",
        function: "Work output (Electrical Power)",
        assemblyOrder: 11,
        connections: ["Positive Terminal", "Negative Terminal"],
        failureEffect: "Short circuit causes rapid uncontrolled discharge.",
        cascadeFailures: ["Thermal Runaway", "Fire"],
        originalPosition: electronGroup.position.clone(),
        explodedPosition: new THREE.Vector3(20, 0, 0),
        group: electronGroup
    });

    // 10. Current Collectors
    group.add(collectorsGroup);
    parts.push({
        name: "Current Collectors",
        description: "Copper foils for the anode and Aluminum foils for the cathode. They conduct electrons to and from the active materials.",
        material: "Copper and Aluminum",
        function: "Electron Conduction",
        assemblyOrder: 4,
        connections: ["Terminals", "Anode", "Cathode"],
        failureEffect: "Corrosion increases internal resistance.",
        cascadeFailures: ["Heating", "Efficiency Loss"],
        originalPosition: collectorsGroup.position.clone(),
        explodedPosition: new THREE.Vector3(-15, 0, -15),
        group: collectorsGroup
    });

    // Animation loop: Discharge phase
    function animate(time, speed, meshes) {
        // Animate Lithium Ions moving from Anode to Cathode
        const ionsObj = meshes.find(m => m.group === ionsGroup);
        if (ionsObj) {
            const dataArr = ionsGroup.userData.ionsData;
            dataArr.forEach(data => {
                data.phase += speed * 0.15;
                if (data.phase > 1) data.phase = 0; // Reset back to Anode
                const currentR = THREE.MathUtils.lerp(data.anodeR, data.cathodeR, data.phase);
                data.mesh.position.set(
                    Math.cos(data.angle) * currentR, 
                    data.y, 
                    Math.sin(data.angle) * currentR
                );
            });
        }

        // Animate Electrons moving from Negative (t=1) to Positive (t=0)
        const elecsObj = meshes.find(m => m.group === electronGroup);
        if (elecsObj) {
            const eDataArr = electronGroup.userData.electronData;
            const curve = electronGroup.userData.wireCurve;
            eDataArr.forEach(data => {
                data.t -= speed * 0.4;
                if (data.t < 0) data.t = 1.0;
                data.mesh.position.copy(curve.getPoint(data.t));
            });
        }
    }

    const quizQuestions = [
        {
            question: "What is the primary function of the separator in a lithium-ion battery?",
            options: [
                "To conduct electrons between electrodes",
                "To provide structural support to the casing",
                "To prevent physical contact between electrodes while allowing ion flow",
                "To store lithium ions during discharge"
            ],
            correct: 2,
            explanation: "The separator is an electrically insulating, micro-porous membrane that prevents short circuits while allowing lithium ions to pass through via the electrolyte.",
            difficulty: "Medium"
        },
        {
            question: "What term describes the process of lithium ions inserting themselves into the crystal structure of the electrode materials?",
            options: [
                "Electroplating",
                "Intercalation",
                "Osmosis",
                "Sublimation"
            ],
            correct: 1,
            explanation: "Intercalation is the reversible inclusion or insertion of an ion into materials with layered structures, such as graphite or lithium cobalt oxide.",
            difficulty: "Hard"
        },
        {
            question: "During the discharging phase of a lithium-ion battery, what is the direction of flow for electrons and lithium ions?",
            options: [
                "Both flow through the external circuit",
                "Both flow through the separator",
                "Electrons flow through the external circuit; Ions flow through the separator",
                "Ions flow through the external circuit; Electrons flow through the separator"
            ],
            correct: 2,
            explanation: "During discharge, electrons travel from the anode to the cathode through the external wire to do work, while lithium ions travel internally through the separator to balance the charge.",
            difficulty: "Easy"
        },
        {
            question: "What dangerous condition can occur if a battery undergoes a massive internal short circuit or extreme overheating?",
            options: [
                "Thermal Runaway",
                "Capacity Fade",
                "SEI Thickening",
                "Intercalation Delay"
            ],
            correct: 0,
            explanation: "Thermal runaway is an unstoppable chain reaction where excess heat triggers exothermic chemical reactions inside the battery, leading to fire or explosion.",
            difficulty: "Medium"
        },
        {
            question: "What is the SEI (Solid Electrolyte Interphase) layer?",
            options: [
                "The plastic casing protecting the battery",
                "A protective passivation layer formed on the anode during early charge cycles",
                "The membrane separating the two electrodes",
                "A thermal blanket used for battery cooling"
            ],
            correct: 1,
            explanation: "The SEI layer forms on the graphite anode as electrolyte decomposes slightly during the first few charge cycles. It protects the anode and prevents further electrolyte decomposition.",
            difficulty: "Hard"
        },
        {
            question: "Why is copper used as the current collector for the anode and aluminum for the cathode?",
            options: [
                "Copper is cheaper than aluminum",
                "Aluminum is magnetically attracted to the cathode",
                "Copper resists dissolution at the anode's low potential, while aluminum passivates to resist corrosion at the cathode's high potential",
                "Aluminum cannot conduct electricity as well as copper"
            ],
            correct: 2,
            explanation: "Copper is electrochemically stable at the low potentials of the anode. Aluminum is used at the cathode because it forms a passivation layer that prevents corrosion at high potentials.",
            difficulty: "Hard"
        }
    ];

    return {
        group,
        parts,
        description: "A detailed 3D cutaway model of a cylindrical Lithium-Ion Battery (18650), showing the internal jelly-roll structure and demonstrating the discharge process through lithium intercalation.",
        quizQuestions,
        animate
    };
}
