import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for MFC
    const bioGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const protonMembraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x550055,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const anodeMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.8,
        wireframe: true // To represent a porous graphite/carbon mesh
    });

    const cathodeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.5,
        metalness: 0.9,
        wireframe: true // Porous metal mesh
    });

    const electronMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const protonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // 1. Anode Chamber (Left)
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const anodeChamber = new THREE.Mesh(chamberGeo, glass);
    anodeChamber.position.set(-2.5, 0, 0);
    group.add(anodeChamber);
    parts.push({
        name: "Anode Chamber",
        description: "Anaerobic environment where electrogenic bacteria oxidize organic matter, releasing electrons and protons.",
        material: "Glass/Acrylic",
        function: "Containment of substrate and bacteria",
        assemblyOrder: 1,
        connections: ["Proton Exchange Membrane", "Anode Electrode", "Substrate Inlet"],
        failureEffect: "Oxygen leakage kills anaerobic bacteria, halting power generation.",
        cascadeFailures: ["Bacterial Biofilm", "Power Output"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 }
    });

    // 2. Cathode Chamber (Right)
    const cathodeChamberGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const cathodeChamber = new THREE.Mesh(cathodeChamberGeo, glass);
    cathodeChamber.position.set(2.5, 0, 0);
    group.add(cathodeChamber);
    parts.push({
        name: "Cathode Chamber",
        description: "Aerobic environment where oxygen acts as the final electron acceptor, combining with protons and electrons to form water.",
        material: "Glass/Acrylic",
        function: "Containment of oxygen and water",
        assemblyOrder: 2,
        connections: ["Proton Exchange Membrane", "Cathode Electrode", "Air Inlet"],
        failureEffect: "Lack of oxygen prevents electron transfer completion.",
        cascadeFailures: ["Water Formation", "Circuit Flow"],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 }
    });

    // 3. Proton Exchange Membrane (PEM) (Center)
    const pemGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    pemGeo.rotateZ(Math.PI / 2);
    const pem = new THREE.Mesh(pemGeo, protonMembraneMaterial);
    pem.position.set(0, 0, 0);
    group.add(pem);
    parts.push({
        name: "Proton Exchange Membrane",
        description: "Semi-permeable barrier that allows protons to flow from anode to cathode while blocking oxygen and electrons.",
        material: "Nafion/Polymer",
        function: "Proton transfer and gas separation",
        assemblyOrder: 3,
        connections: ["Anode Chamber", "Cathode Chamber"],
        failureEffect: "Membrane rupture allows oxygen into anode, killing bacteria.",
        cascadeFailures: ["Anode Chamber", "Bacterial Biofilm"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 4. Anode Electrode
    const anodeGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    const anode = new THREE.Mesh(anodeGeo, anodeMaterial);
    anode.position.set(-2.5, 0, 0);
    group.add(anode);
    parts.push({
        name: "Anode Electrode",
        description: "Porous conductive material (e.g., carbon felt) where bacteria form a biofilm and deposit extracted electrons.",
        material: "Carbon/Graphite",
        function: "Electron collection",
        assemblyOrder: 4,
        connections: ["Anode Chamber", "External Circuit", "Bacterial Biofilm"],
        failureEffect: "Biofilm detachment prevents electron transfer.",
        cascadeFailures: ["External Circuit"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: -3 }
    });

    // 5. Bacterial Biofilm
    const biofilmGeo = new THREE.CylinderGeometry(1.55, 1.55, 3.8, 32);
    const biofilm = new THREE.Mesh(biofilmGeo, bioGlowMaterial);
    biofilm.position.set(-2.5, 0, 0);
    group.add(biofilm);
    parts.push({
        name: "Electrogenic Biofilm",
        description: "Colony of exoelectrogenic bacteria (e.g., Geobacter, Shewanella) that break down organic waste and transfer electrons to the anode.",
        material: "Biological Matter",
        function: "Biocatalyst for oxidation",
        assemblyOrder: 5,
        connections: ["Anode Electrode", "Substrate"],
        failureEffect: "Substrate depletion starves bacteria, stopping metabolism.",
        cascadeFailures: ["Electron Flow", "Proton Generation"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 3 }
    });

    // 6. Cathode Electrode
    const cathodeGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMaterial);
    cathode.position.set(2.5, 0, 0);
    group.add(cathode);
    parts.push({
        name: "Cathode Electrode",
        description: "Conductive material where oxygen reduction occurs. Often coated with a catalyst like platinum.",
        material: "Platinum-coated Carbon",
        function: "Electron delivery to oxygen",
        assemblyOrder: 6,
        connections: ["Cathode Chamber", "External Circuit"],
        failureEffect: "Catalyst poisoning slows down oxygen reduction.",
        cascadeFailures: ["Current Density"],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 3 }
    });

    // 7. External Circuit Wire
    const wireGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2.5, 3, 0),
            new THREE.Vector3(-2.5, 5, 0),
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(2.5, 5, 0),
            new THREE.Vector3(2.5, 3, 0)
        ]),
        64,
        0.1,
        8,
        false
    );
    const wire = new THREE.Mesh(wireGeo, copper);
    group.add(wire);
    parts.push({
        name: "External Circuit",
        description: "Wire connecting anode and cathode, allowing electrons to flow and do electrical work.",
        material: "Copper",
        function: "Electron transport",
        assemblyOrder: 7,
        connections: ["Anode Electrode", "Cathode Electrode", "Load (Bulb)"],
        failureEffect: "Short circuit prevents power utilization.",
        cascadeFailures: ["Load (Bulb)"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: -2 }
    });

    // 8. Load (Glowing LED/Bulb)
    const bulbGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const bulbMat = new THREE.MeshPhysicalMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 2, transparent: true, opacity: 0.9 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 5, 0);
    group.add(bulb);
    parts.push({
        name: "Electrical Load",
        description: "Component that consumes the generated electricity.",
        material: "Glass/Tungsten/LED",
        function: "Power utilization",
        assemblyOrder: 8,
        connections: ["External Circuit"],
        failureEffect: "Burnt bulb breaks the circuit.",
        cascadeFailures: ["Electron Flow"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // Particle systems for animation
    const electronCount = 20;
    const electrons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 8), electronMaterial, electronCount);
    const electronDummy = new THREE.Object3D();
    group.add(electrons);

    const protonCount = 15;
    const protons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 8), protonMaterial, protonCount);
    const protonDummy = new THREE.Object3D();
    group.add(protons);

    const description = "A Microbial Fuel Cell (MFC) utilizes exoelectrogenic bacteria to metabolize organic matter, directly converting chemical energy into electrical energy. It features an anaerobic anode chamber and an aerobic cathode chamber separated by a proton exchange membrane.";

    const quizQuestions = [
        {
            question: "What is the primary role of the exoelectrogenic bacteria in the anode chamber?",
            options: [
                "To reduce oxygen to water",
                "To synthesize organic matter from light",
                "To oxidize organic matter and transfer electrons to the anode",
                "To pump protons through the membrane"
            ],
            correct: 2,
            explanation: "Electrogenic bacteria break down (oxidize) organic substrates, releasing electrons which they transfer directly or indirectly to the anode electrode.",
            difficulty: "Medium"
        },
        {
            question: "Why must the anode chamber be completely anaerobic (oxygen-free)?",
            options: [
                "Oxygen is toxic to all bacteria",
                "Oxygen would bypass the circuit by acting as the electron acceptor directly at the bacteria",
                "Oxygen destroys the carbon electrode",
                "Oxygen blocks the proton exchange membrane"
            ],
            correct: 1,
            explanation: "If oxygen is present in the anode, bacteria will use it as the final electron acceptor instead of transferring electrons to the anode, stopping electrical generation.",
            difficulty: "Hard"
        },
        {
            question: "What passes through the Proton Exchange Membrane (PEM)?",
            options: [
                "Electrons only",
                "Oxygen and water",
                "Bacteria and substrate",
                "Protons (H+ ions) only"
            ],
            correct: 3,
            explanation: "The PEM selectively allows protons to travel from the anode to the cathode to balance the charge of electrons flowing through the external circuit.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate Biofilm glow
        const glowPhase = (Math.sin(time * 2 * speed) + 1) / 2;
        bioGlowMaterial.emissiveIntensity = 0.5 + glowPhase * 1.5;

        // Animate Load glow based on electron flow
        bulbMat.emissiveIntensity = 1 + glowPhase;

        // Animate Electrons moving through wire
        if (electrons) {
            for (let i = 0; i < electronCount; i++) {
                let t = (time * speed * 0.5 + i / electronCount) % 1;
                
                // Path: Anode(-2.5,0) -> Up(-2.5,5) -> Right(2.5,5) -> Down(2.5,0)
                let x, y;
                if (t < 0.25) { // Up
                    let nt = t / 0.25;
                    x = -2.5;
                    y = 0 + (5 * nt);
                } else if (t < 0.75) { // Right across wire
                    let nt = (t - 0.25) / 0.5;
                    x = -2.5 + (5 * nt);
                    y = 5;
                } else { // Down to cathode
                    let nt = (t - 0.75) / 0.25;
                    x = 2.5;
                    y = 5 - (5 * nt);
                }

                electronDummy.position.set(x, y, (Math.random() - 0.5) * 0.2);
                electronDummy.updateMatrix();
                electrons.setMatrixAt(i, electronDummy.matrix);
            }
            electrons.instanceMatrix.needsUpdate = true;
        }

        // Animate Protons moving through PEM
        if (protons) {
            for (let i = 0; i < protonCount; i++) {
                let t = (time * speed * 0.3 + i / protonCount) % 1;
                
                // Protons move from anode (-2.5) to cathode (2.5) through the center (0)
                let x = -1.5 + (3 * t);
                let y = (Math.random() - 0.5) * 1.5;
                let z = (Math.random() - 0.5) * 1.5;

                protonDummy.position.set(x, y, z);
                protonDummy.updateMatrix();
                protons.setMatrixAt(i, protonDummy.matrix);
            }
            protons.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMicrobialFuelCellArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
