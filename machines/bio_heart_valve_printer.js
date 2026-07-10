import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = {
        title: "Heart Valve 3D Bioprinter",
        overview: "A highly advanced multi-extruder bioprinter designed to construct viable heart valves using living tissue cells and collagen matrices.",
        mechanics: "Utilizes pneumatic and mechanical micro-extruders to deposit bio-ink with micrometer precision inside a sterile, temperature-controlled environmental chamber."
    };

    const quizQuestions = [
        {
            question: "Why is a sterile environmental chamber critical in a 3D bioprinter?",
            options: [
                "To prevent the bio-ink from drying out",
                "To prevent contamination and maintain optimal conditions for cell survival",
                "To increase the printing speed",
                "To protect the user from laser radiation"
            ],
            correct: 1,
            explanation: "Living cells are highly susceptible to contamination. A sterile chamber with controlled temperature and humidity is essential for cell viability.",
            difficulty: "Medium"
        },
        {
            question: "What is the role of the collagen matrix in bio-printing a heart valve?",
            options: [
                "It acts as a permanent artificial valve",
                "It provides a structural scaffold for the living cells to grow and organize",
                "It speeds up the curing process of the plastic parts",
                "It acts as an electrical conductor for the valve's sensors"
            ],
            correct: 1,
            explanation: "The collagen matrix provides the necessary structural support (scaffold) that mimics the natural extracellular matrix, allowing cells to attach, grow, and form functioning tissue.",
            difficulty: "Hard"
        },
        {
            question: "Which component is responsible for depositing the bio-ink with high precision?",
            options: [
                "The Sterile Chamber",
                "The UV Curing Lamp",
                "The Micro-Extruder Printhead",
                "The Build Plate"
            ],
            correct: 2,
            explanation: "The Micro-Extruder Printhead acts like the nozzle in a standard 3D printer but is specialized for dispensing biological materials (bio-inks) with micrometer accuracy.",
            difficulty: "Easy"
        }
    ];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const bioInkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaabb,
        emissive: 0xff3366,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.0
    });

    const collagenMaterial = new THREE.MeshStandardMaterial({
        color: 0xddeeff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.5
    });

    // 1. Base Framework
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 8);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Main Base Chassis",
        description: "Heavy vibration-dampening chassis providing absolute stability for micrometer-scale printing.",
        material: "Dark Steel / Heavy Alloy",
        function: "Provides a stable foundation, isolating the print area from external vibrations.",
        assemblyOrder: 1,
        connections: ["Gantry System", "Build Plate", "Sterile Chamber"],
        failureEffect: "Vibration transfer causes print layer misalignment.",
        cascadeFailures: ["Printhead crashes", "Valve structural integrity compromised"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Build Plate
    const plateGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const plateMesh = new THREE.Mesh(plateGeo, chrome);
    plateMesh.position.set(0, 0.1, 0);
    group.add(plateMesh);
    meshes.plate = plateMesh;
    parts.push({
        name: "Heated Biocompatible Build Plate",
        description: "Titanium-coated rotating build plate that maintains 37°C for optimal cell survival.",
        material: "Chrome / Titanium",
        function: "Supports the printed structure and provides a physiological temperature environment.",
        assemblyOrder: 2,
        connections: ["Main Base Chassis", "Bio-Printed Valve"],
        failureEffect: "Temperature drop causes cell necrosis.",
        cascadeFailures: ["Complete print failure"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 4 }
    });

    // 3. Gantry Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const pillar1 = new THREE.Mesh(pillarGeo, aluminum);
    pillar1.position.set(-4, 4, -3);
    const pillar2 = new THREE.Mesh(pillarGeo, aluminum);
    pillar2.position.set(4, 4, -3);
    group.add(pillar1, pillar2);
    meshes.gantryPillars = new THREE.Group();
    meshes.gantryPillars.add(pillar1.clone());
    meshes.gantryPillars.add(pillar2.clone());
    parts.push({
        name: "Z-Axis Gantry Pillars",
        description: "Precision linear rails supporting the primary X-axis carriage.",
        material: "Aluminum",
        function: "Enables vertical movement of the printhead assembly.",
        assemblyOrder: 3,
        connections: ["Main Base Chassis", "X-Axis Rail"],
        failureEffect: "Z-axis binding or skipping.",
        cascadeFailures: ["Uneven layer height", "Printhead collisions"],
        originalPosition: { x: 0, y: 4, z: -3 },
        explodedPosition: { x: 0, y: 4, z: -8 }
    });

    // 4. X-Axis Rail
    const railGeo = new THREE.BoxGeometry(9, 0.4, 0.4);
    const railMesh = new THREE.Mesh(railGeo, steel);
    railMesh.position.set(0, 6, -3);
    group.add(railMesh);
    meshes.xRail = railMesh;
    parts.push({
        name: "X-Axis Linear Rail",
        description: "Magnetic levitation track for frictionless horizontal movement.",
        material: "Steel",
        function: "Guides the carriage horizontally across the build volume.",
        assemblyOrder: 4,
        connections: ["Z-Axis Gantry Pillars", "Print Carriage"],
        failureEffect: "Horizontal layer shifting.",
        cascadeFailures: ["Structural defects in the valve wall"],
        originalPosition: { x: 0, y: 6, z: -3 },
        explodedPosition: { x: 0, y: 9, z: -8 }
    });

    // 5. Y-Axis Arm & Print Carriage
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(0, 6, -3);
    
    const carriageBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1), darkSteel);
    const yArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 4), aluminum);
    yArm.position.set(0, 0, 1.5);
    carriageGroup.add(carriageBase, yArm);
    
    group.add(carriageGroup);
    meshes.carriage = carriageGroup;
    parts.push({
        name: "Magnetic Carriage & Y-Arm",
        description: "Rapid positioning system holding the delicate extruder heads.",
        material: "Dark Steel / Aluminum",
        function: "Provides X and Y movement for precise material deposition.",
        assemblyOrder: 5,
        connections: ["X-Axis Rail", "Micro-Extruder Printheads"],
        failureEffect: "Loss of positioning accuracy.",
        cascadeFailures: ["Extruder collision", "Misaligned tissue layers"],
        originalPosition: { x: 0, y: 6, z: -3 },
        explodedPosition: { x: 0, y: 8, z: -5 }
    });

    // 6. Micro-Extruder Printheads
    const extruderGroup = new THREE.Group();
    extruderGroup.position.set(0, 0, 3.5); // End of Y arm

    const head1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.05, 1, 16), chrome);
    head1.position.set(-0.3, -0.5, 0);
    const head1Ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 16, 32), glowBlue);
    head1Ring.position.set(-0.3, -0.2, 0);
    head1Ring.rotation.x = Math.PI / 2;

    const head2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.05, 1, 16), chrome);
    head2.position.set(0.3, -0.5, 0);
    const head2Ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 16, 32), glowPink);
    head2Ring.position.set(0.3, -0.2, 0);
    head2Ring.rotation.x = Math.PI / 2;

    extruderGroup.add(head1, head1Ring, head2, head2Ring);
    carriageGroup.add(extruderGroup);
    meshes.extruder = extruderGroup;

    parts.push({
        name: "Dual Micro-Extruder Array",
        description: "Twin pneumatic nozzles. One dispenses collagen scaffolding, the other dispenses stem cell bio-ink.",
        material: "Chrome / Glowing Indicators",
        function: "Deposits microscopic droplets of bio-materials to construct tissue.",
        assemblyOrder: 6,
        connections: ["Magnetic Carriage & Y-Arm", "Bio-Ink Reservoirs"],
        failureEffect: "Clogged nozzle prevents material flow.",
        cascadeFailures: ["Missing tissue segments", "Complete valve failure"],
        originalPosition: { x: 0, y: 6, z: 0.5 },
        explodedPosition: { x: 0, y: 6, z: 4 }
    });

    // 7. Bio-Ink Reservoirs
    const reservoir1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16), glass);
    reservoir1.position.set(-0.8, 0.5, 0);
    const res1Fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16), collagenMaterial);
    res1Fluid.position.set(-0.8, 0.5, 0);

    const reservoir2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16), glass);
    reservoir2.position.set(0.8, 0.5, 0);
    const res2Fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16), bioInkMaterial);
    res2Fluid.position.set(0.8, 0.5, 0);

    extruderGroup.add(reservoir1, res1Fluid, reservoir2, res2Fluid);

    parts.push({
        name: "Bio-Material Syringe Reservoirs",
        description: "Temperature-controlled glass syringes holding the biological materials.",
        material: "Glass / Bio-Fluid",
        function: "Stores and supplies bio-ink and collagen to the extruders under controlled pressure.",
        assemblyOrder: 7,
        connections: ["Dual Micro-Extruder Array"],
        failureEffect: "Loss of pressure or temperature control.",
        cascadeFailures: ["Cell death before printing", "Inconsistent extrusion"],
        originalPosition: { x: 0, y: 6.5, z: 0.5 },
        explodedPosition: { x: 0, y: 9, z: 4 }
    });

    // 8. The Heart Valve (Printing in progress)
    const valveGroup = new THREE.Group();
    valveGroup.position.set(0, 0.2, 0);
    
    // Base ring of the valve
    const valveRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 16, 64), collagenMaterial);
    valveRing.rotation.x = Math.PI / 2;
    valveRing.position.y = 0.2;
    valveGroup.add(valveRing);

    // Leaflets (simplified as curved planes or thin spheres)
    const leafletGeo = new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI, 0, Math.PI / 3);
    
    const leaflet1 = new THREE.Mesh(leafletGeo, bioInkMaterial);
    leaflet1.rotation.x = -Math.PI / 2;
    leaflet1.position.set(0, 0.3, -0.2);
    
    const leaflet2 = new THREE.Mesh(leafletGeo, bioInkMaterial);
    leaflet2.rotation.x = -Math.PI / 2;
    leaflet2.rotation.z = Math.PI * 2 / 3;
    leaflet2.position.set(0.17, 0.3, 0.1);

    const leaflet3 = new THREE.Mesh(leafletGeo, bioInkMaterial);
    leaflet3.rotation.x = -Math.PI / 2;
    leaflet3.rotation.z = -Math.PI * 2 / 3;
    leaflet3.position.set(-0.17, 0.3, 0.1);

    valveGroup.add(leaflet1, leaflet2, leaflet3);
    
    // Glowing active print layer
    const activeLayer = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 32), glowPink);
    activeLayer.rotation.x = Math.PI / 2;
    activeLayer.position.y = 0.5;
    valveGroup.add(activeLayer);
    meshes.activeLayer = activeLayer;

    group.add(valveGroup);
    meshes.valve = valveGroup;

    parts.push({
        name: "Trileaflet Heart Valve Construct",
        description: "The partially printed biological tissue structure.",
        material: "Collagen Matrix / Living Cells",
        function: "The final product: a replacement heart valve ready for incubation and implantation.",
        assemblyOrder: 8,
        connections: ["Heated Biocompatible Build Plate"],
        failureEffect: "Valve regurgitation or stenosis.",
        cascadeFailures: ["Implant failure", "Patient risk"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 9. Sterile Environmental Chamber Cover
    const coverGeo = new THREE.CylinderGeometry(5, 5, 8, 32, 1, true);
    const coverMesh = new THREE.Mesh(coverGeo, tinted);
    coverMesh.position.set(0, 3.8, 0);
    group.add(coverMesh);
    meshes.cover = coverMesh;

    parts.push({
        name: "Sterile Incubation Chamber",
        description: "UV-filtered acrylic dome maintaining ISO Class 5 cleanroom conditions.",
        material: "Tinted Acrylic / Glass",
        function: "Protects the delicate printing process from airborne contaminants and regulates humidity.",
        assemblyOrder: 9,
        connections: ["Main Base Chassis"],
        failureEffect: "Breach in sterility.",
        cascadeFailures: ["Bacterial contamination of the bio-ink", "Complete batch rejection"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 10. UV Curing Lasers
    const laserGroup = new THREE.Group();
    const laserBeamGeo = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0x8800ff, transparent: true, opacity: 0.6 });
    
    const laser1 = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laser1.position.set(-2, 2, 0);
    laser1.rotation.z = -Math.PI / 4;
    
    const laser2 = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laser2.position.set(2, 2, 0);
    laser2.rotation.z = Math.PI / 4;

    laserGroup.add(laser1, laser2);
    group.add(laserGroup);
    meshes.lasers = laserGroup;

    parts.push({
        name: "UV Crosslinking Lasers",
        description: "Low-intensity ultraviolet lasers used to instantly cure and solidify the collagen matrix.",
        material: "Light/Energy",
        function: "Triggers photoinitiators in the bio-ink to solidify the structure without harming cells.",
        assemblyOrder: 10,
        connections: ["Main Base Chassis", "Z-Axis Gantry Pillars"],
        failureEffect: "Insufficient curing.",
        cascadeFailures: ["Structural collapse of the valve during printing"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -5 }
    });

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // Rotate build plate slowly
        if(activeMeshes.plate) {
            activeMeshes.plate.rotation.y = t * 0.5;
        }
        if(activeMeshes.valve) {
            activeMeshes.valve.rotation.y = t * 0.5;
        }

        // Move carriage along X axis (simulating printing path)
        if(activeMeshes.carriage) {
            activeMeshes.carriage.position.x = Math.sin(t * 2) * 1.5;
            
            // Move extruder along Y arm (Z axis in world space)
            if(activeMeshes.extruder) {
                activeMeshes.extruder.position.z = 2.5 + Math.cos(t * 3) * 0.5;
            }
        }

        // Pulse the active layer glow
        if(activeMeshes.activeLayer) {
            activeMeshes.activeLayer.scale.set(
                1 + Math.sin(t * 5) * 0.02, 
                1 + Math.sin(t * 5) * 0.02, 
                1 + Math.sin(t * 5) * 0.02
            );
            activeMeshes.activeLayer.material.emissiveIntensity = 0.5 + Math.sin(t * 8) * 0.4;
        }

        // Flicker lasers slightly
        if(activeMeshes.lasers) {
            activeMeshes.lasers.children.forEach(laser => {
                laser.material.opacity = 0.4 + Math.random() * 0.4;
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createHeartValvePrinter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
