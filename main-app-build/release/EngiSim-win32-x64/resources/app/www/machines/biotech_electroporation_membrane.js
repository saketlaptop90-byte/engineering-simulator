import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/Neon Materials for Visual Flair
    const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0044aa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        side: THREE.DoubleSide
    });

    const poreMat = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const arcMat = new THREE.MeshBasicMaterial({
        color: 0x88ffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const dnaMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Chamber Housing
    const housingGeom = new THREE.CylinderGeometry(8, 8, 10, 32, 1, true);
    const housing = new THREE.Mesh(housingGeom, glass);
    group.add(housing);
    meshes.housing = housing;
    parts.push({
        name: "Cuvette Chamber Housing",
        description: "A sterile, optically clear chamber containing the cell suspension and macromolecules.",
        material: "Glass / Polycarbonate",
        function: "Maintains a sterile environment and holds the conductive buffer solution.",
        assemblyOrder: 1,
        connections: ["Electrodes", "Base"],
        failureEffect: "Contamination of the sample or buffer leakage.",
        cascadeFailures: ["Loss of conductivity", "Sample loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 15 }
    });

    // 2. Electrodes
    const electrodeGeom = new THREE.BoxGeometry(10, 0.5, 10);
    const topElectrode = new THREE.Mesh(electrodeGeom, chrome);
    topElectrode.position.y = 4;
    group.add(topElectrode);
    meshes.topElectrode = topElectrode;

    const bottomElectrode = new THREE.Mesh(electrodeGeom, copper);
    bottomElectrode.position.y = -4;
    group.add(bottomElectrode);
    meshes.bottomElectrode = bottomElectrode;

    parts.push({
        name: "High-Voltage Electrode (Anode)",
        description: "Upper parallel metal plate that delivers the high-voltage electrical pulse.",
        material: "Chrome / Steel",
        function: "Creates a uniform electric field across the cell suspension.",
        assemblyOrder: 2,
        connections: ["Chamber Housing", "Pulse Generator"],
        failureEffect: "Uneven electric field leading to cell death or failed transfection.",
        cascadeFailures: ["Arcing", "Sample boiling"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });
    
    parts.push({
        name: "Ground Electrode (Cathode)",
        description: "Lower parallel plate serving as the ground for the electric pulse.",
        material: "Copper",
        function: "Completes the circuit for the uniform electric field.",
        assemblyOrder: 3,
        connections: ["Chamber Housing"],
        failureEffect: "Incomplete circuit, no electroporation.",
        cascadeFailures: ["Electrical hazard"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 3. Lipid Bilayer Membrane (Stylized undulating plane)
    const membraneGroup = new THREE.Group();
    const membranePlaneGeom = new THREE.PlaneGeometry(12, 12, 32, 32);
    const membranePlane = new THREE.Mesh(membranePlaneGeom, membraneMat);
    membranePlane.rotation.x = -Math.PI / 2;
    membraneGroup.add(membranePlane);
    group.add(membraneGroup);
    meshes.membraneGroup = membraneGroup;
    meshes.membranePlane = membranePlane;

    parts.push({
        name: "Lipid Bilayer Membrane",
        description: "A dynamic section of the cell membrane composed of phospholipids.",
        material: "Organic Lipid Bilayer",
        function: "Acts as a selectively permeable barrier protecting the cell interior.",
        assemblyOrder: 4,
        connections: ["Transfection Pores"],
        failureEffect: "Irreversible dielectric breakdown causing cell lysis.",
        cascadeFailures: ["Cell death", "Loss of viability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // 4. Transfection Pores & Electric Arcs
    const poreGroup = new THREE.Group();
    meshes.pores = [];
    meshes.arcs = [];
    const numPores = 6;
    for (let i = 0; i < numPores; i++) {
        // Pores (Glowing rings on the membrane)
        const pGeom = new THREE.TorusGeometry(0.8, 0.15, 16, 32);
        const pore = new THREE.Mesh(pGeom, poreMat);
        pore.rotation.x = Math.PI / 2;
        
        // Distribute them around the center
        const angle = (i / numPores) * Math.PI * 2;
        const radius = 2.5 + Math.random();
        const px = Math.cos(angle) * radius;
        const pz = Math.sin(angle) * radius;
        
        pore.position.set(px, 0, pz);
        pore.scale.set(0.01, 0.01, 0.01); // starts closed
        poreGroup.add(pore);
        meshes.pores.push(pore);

        // Arcs (Lightning strikes between electrodes passing through pores)
        const arcGeom = new THREE.CylinderGeometry(0.05, 0.05, 8, 8);
        const arc = new THREE.Mesh(arcGeom, arcMat);
        arc.position.set(px, 0, pz);
        arc.scale.y = 0.01; // hidden initially
        poreGroup.add(arc);
        meshes.arcs.push(arc);
    }
    group.add(poreGroup);
    meshes.poreGroup = poreGroup;

    parts.push({
        name: "Electropores & Electric Arcs",
        description: "Temporary aqueous pathways created by the high-voltage dielectric breakdown.",
        material: "Plasma / Aqueous Buffer",
        function: "Allows polar macromolecules like DNA to bypass the hydrophobic lipid core.",
        assemblyOrder: 5,
        connections: ["Lipid Bilayer Membrane", "Plasmids", "Electrodes"],
        failureEffect: "Pores fail to reseal (irreversible electroporation).",
        cascadeFailures: ["Cytoplasm leakage", "Apoptosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // 5. Plasmids / DNA (Neon Green)
    const dnaGroup = new THREE.Group();
    meshes.plasmids = [];
    for (let i = 0; i < numPores; i++) {
        const plasmidGeom = new THREE.TorusKnotGeometry(0.3, 0.08, 64, 8);
        const plasmid = new THREE.Mesh(plasmidGeom, dnaMat);
        plasmid.position.set(meshes.pores[i].position.x, 3, meshes.pores[i].position.z);
        dnaGroup.add(plasmid);
        meshes.plasmids.push({
            mesh: plasmid,
            targetX: meshes.pores[i].position.x,
            targetZ: meshes.pores[i].position.z,
            phase: Math.random() * Math.PI * 2
        });
    }
    group.add(dnaGroup);

    parts.push({
        name: "DNA Plasmids",
        description: "Circular double-stranded DNA constructs containing the target gene and promoters.",
        material: "Nucleic Acid",
        function: "Genetic cargo to be introduced into the host cell via electropores.",
        assemblyOrder: 6,
        connections: ["Electropores"],
        failureEffect: "Degradation by nucleases or failure to enter the nucleus.",
        cascadeFailures: ["No gene expression", "Failed transfection"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 15 }
    });

    const description = "Electroporation Membrane Simulator. Demonstrates the temporary permeabilization of the cell membrane using an electric field to introduce macromolecules (e.g., DNA) into cells.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of applying a brief, high-voltage electric pulse in electroporation?",
            options: [
                "To permanently destroy the cell membrane",
                "To create temporary hydrophilic pores in the lipid bilayer",
                "To synthesize DNA inside the cell",
                "To fuse multiple cells together"
            ],
            correct: 1,
            explanation: "Electroporation applies a high-voltage pulse to induce dielectric breakdown, temporarily disrupting the lipid bilayer and creating pores for macromolecules to enter.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following describes 'irreversible electroporation'?",
            options: [
                "A successful transfection of DNA that permanently alters the genome",
                "The process where cells successfully reseal their membranes after the pulse",
                "Application of a field so strong that the pores never close, leading to cell death",
                "A technique used only on plant cells with rigid cell walls"
            ],
            correct: 2,
            explanation: "If the electric field is too strong or applied for too long, the pores cannot reseal (irreversible electroporation), causing homeostasis loss and cell death. This is actually used in tumor ablation, but is a failure mode for transfection.",
            difficulty: "Hard"
        },
        {
            question: "Why must the electroporation buffer have specific conductivity properties?",
            options: [
                "To provide nutrients for the cells to divide rapidly",
                "To dissolve the DNA plasmids more effectively",
                "To ensure the electric field is uniform and prevent excessive current (arcing)",
                "To increase the temperature of the suspension"
            ],
            correct: 2,
            explanation: "The buffer must balance conductivity. If it's too conductive, it draws too much current, causing arcing and thermal damage (boiling). If it's too resistive, the field won't establish properly.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Fallback to local meshes if activeMeshes isn't provided
        const m = activeMeshes || meshes;
        if (!m || !m.membranePlane) return;

        // Animate the membrane plane undulating slightly
        const positions = m.membranePlane.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            // Dynamic wave equation
            const z = Math.sin(x * 1.5 + time * 2 * speed) * 0.15 + Math.cos(y * 1.5 + time * 2 * speed) * 0.15;
            positions.setZ(i, z);
        }
        m.membranePlane.geometry.attributes.position.needsUpdate = true;
        m.membranePlane.geometry.computeVertexNormals();

        // Electroporation cycle: Pulse (arcs on, pores open), Transport (plasmids enter), Reseal
        const cycleLength = 6.0; // seconds
        const cycleTime = (time * speed) % cycleLength;

        // Pulse Phase (1.0 to 2.0)
        const isPulse = cycleTime > 1.0 && cycleTime < 2.0;
        // Open Phase (2.0 to 4.0)
        const isOpen = cycleTime >= 2.0 && cycleTime < 4.0;
        // Reseal Phase (4.0 to 5.0)
        const isReseal = cycleTime >= 4.0 && cycleTime < 5.0;

        let poreScale = 0.01;
        if (isPulse) {
            poreScale = THREE.MathUtils.lerp(0.01, 1.0, (cycleTime - 1.0));
        } else if (isOpen) {
            poreScale = 1.0;
        } else if (isReseal) {
            poreScale = THREE.MathUtils.lerp(1.0, 0.01, (cycleTime - 4.0));
        }

        m.pores.forEach((pore, index) => {
            pore.scale.set(poreScale, poreScale, poreScale);
            // Spin pore slightly
            pore.rotation.z += 0.05 * speed;

            const arc = m.arcs[index];
            if (isPulse) {
                arc.scale.y = 1.0;
                arc.visible = Math.random() > 0.2; // flickering electrical arcs
                arcMat.opacity = Math.random() * 0.5 + 0.5;
            } else {
                arc.scale.y = 0.01;
                arc.visible = false;
            }
        });

        // Plasmid Transport Animation
        m.plasmids.forEach((plasmidObj) => {
            const mesh = plasmidObj.mesh;
            mesh.rotation.x += 0.02 * speed;
            mesh.rotation.y += 0.03 * speed;

            if (cycleTime < 1.0) {
                // Hovering above the membrane in buffer
                mesh.position.y = 3 + Math.sin(time * 3 + plasmidObj.phase) * 0.5;
            } else if (isOpen || isReseal) {
                // Move down through the open pore into the cell
                const progress = (cycleTime - 2.0) / 2.0; // 0 to 1 over 2 seconds
                if (progress > 0 && progress < 1) {
                    mesh.position.y = THREE.MathUtils.lerp(3, -3, progress);
                } else if (progress >= 1) {
                    mesh.position.y = -3; // inside cell
                }
            } else if (cycleTime >= 5.0) {
                // Settled inside cell
                mesh.position.y = -3;
                // At the very end of cycle, jump back up for continuous looping simulation
                if (cycleTime > 5.9) {
                    mesh.position.y = 3;
                }
            }
        });
        
        // Arc glowing effect on materials during pulse
        if (isPulse) {
            membraneMat.emissiveIntensity = 1.5 + Math.random() * 1.5; // Flash brightly
            membraneMat.color.setHex(0xffffff); // Turn white-hot
        } else {
            // Restore to standard neon blue membrane
            membraneMat.emissiveIntensity = 0.5;
            membraneMat.color.setHex(0x00ffff);
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createElectroporationMembrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
