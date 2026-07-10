import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom materials for glowing effects
    const glowingHeaterMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff4400,
        emissiveIntensity: 5.0,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingElectronMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    const customGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.1,
        transparent: true,
        side: THREE.DoubleSide
    });

    const micaMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6
    });

    // 1. Base (Bakelite)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, plastic);
    baseMesh.position.set(0, 0.75, 0);
    group.add(baseMesh);
    parts.push({
        name: "Bakelite Base",
        description: "The sturdy base of the vacuum tube, typically made of Bakelite or plastic, holding the connection pins.",
        material: "Plastic/Bakelite",
        function: "Provides structural support and houses the pin connections.",
        assemblyOrder: 1,
        connections: ["Pins", "Glass Envelope"],
        failureEffect: "Structural instability, potential for shorts if cracked.",
        cascadeFailures: ["Vacuum leak", "Pin disconnection"],
        originalPosition: {x: 0, y: 0.75, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: baseMesh
    });

    // 2. Pins
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.8;
        const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 16);
        const pinMesh = new THREE.Mesh(pinGeo, chrome);
        pinMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        group.add(pinMesh);
        parts.push({
            name: `Connection Pin ${i+1}`,
            description: "Metal pins that interface with the tube socket to provide electrical connections.",
            material: "Chrome/Brass",
            function: "Transmits electrical signals and power to the internal elements.",
            assemblyOrder: 2,
            connections: ["Base", "Internal Elements"],
            failureEffect: "Loss of signal or power.",
            cascadeFailures: ["Complete tube failure"],
            originalPosition: {x: pinMesh.position.x, y: 0, z: pinMesh.position.z},
            explodedPosition: {x: pinMesh.position.x * 2, y: -4, z: pinMesh.position.z * 2},
            mesh: pinMesh
        });
    }

    // 3. Glass Envelope
    const glassGeo = new THREE.CylinderGeometry(1.3, 1.3, 6, 32, 1, false);
    // Add top dome
    const domeGeo = new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, customGlass);
    domeMesh.position.y = 3;
    const cylinderMesh = new THREE.Mesh(glassGeo, customGlass);
    const glassGroup = new THREE.Group();
    glassGroup.add(cylinderMesh);
    glassGroup.add(domeMesh);
    glassGroup.position.set(0, 4.5, 0);
    group.add(glassGroup);
    parts.push({
        name: "Glass Envelope",
        description: "The sealed glass tube that maintains a hard vacuum inside.",
        material: "Glass",
        function: "Prevents internal elements from burning up and allows free electron flow.",
        assemblyOrder: 10,
        connections: ["Base"],
        failureEffect: "Loss of vacuum (air enters).",
        cascadeFailures: ["Heater burnout", "Oxidation of elements"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0},
        mesh: glassGroup
    });

    // 4. Heater / Filament
    const heaterGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const heaterMesh = new THREE.Mesh(heaterGeo, glowingHeaterMaterial);
    heaterMesh.position.set(0, 4.5, 0);
    group.add(heaterMesh);
    // Add a point light to simulate the glowing heater
    const heaterLight = new THREE.PointLight(0xff5500, 2, 10);
    heaterLight.position.set(0, 4.5, 0);
    group.add(heaterLight);
    parts.push({
        name: "Heater Filament",
        description: "A high-resistance wire that heats up when current is applied.",
        material: "Tungsten",
        function: "Heats the cathode to induce thermionic emission.",
        assemblyOrder: 3,
        connections: ["Pins"],
        failureEffect: "No electron emission.",
        cascadeFailures: ["Tube non-functional"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: 4.5, z: -5},
        mesh: heaterMesh
    });

    // 5. Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.8, 32);
    const cathodeMesh = new THREE.Mesh(cathodeGeo, steel);
    cathodeMesh.position.set(0, 4.5, 0);
    group.add(cathodeMesh);
    parts.push({
        name: "Cathode",
        description: "A metal tube coated with barium/strontium oxide, surrounding the heater.",
        material: "Coated Nickel/Steel",
        function: "Emits electrons when heated (thermionic emission).",
        assemblyOrder: 4,
        connections: ["Heater", "Pins"],
        failureEffect: "Reduced or zero electron emission.",
        cascadeFailures: ["Loss of amplification"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: -2, y: 4.5, z: -3},
        mesh: cathodeMesh
    });

    // 6. Control Grid
    const gridGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5, 32, 20, true);
    const gridMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        wireframe: true,
        metalness: 0.8,
        roughness: 0.2
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMaterial);
    gridMesh.position.set(0, 4.5, 0);
    group.add(gridMesh);
    parts.push({
        name: "Control Grid",
        description: "A fine wire mesh wound closely around the cathode.",
        material: "Molybdenum",
        function: "Controls the flow of electrons from cathode to anode via voltage variations.",
        assemblyOrder: 5,
        connections: ["Pins", "Mica Spacers"],
        failureEffect: "Uncontrolled electron flow.",
        cascadeFailures: ["Distortion", "Thermal runaway"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: -4, y: 4.5, z: 0},
        mesh: gridMesh
    });

    // 7. Anode / Plate
    const anodeGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 32, 1, true);
    const anodeMesh = new THREE.Mesh(anodeGeo, darkSteel);
    anodeMesh.position.set(0, 4.5, 0);
    group.add(anodeMesh);
    parts.push({
        name: "Anode (Plate)",
        description: "The outermost metal cylinder inside the tube.",
        material: "Dark Steel/Nickel",
        function: "Attracts and collects the electrons emitted by the cathode.",
        assemblyOrder: 6,
        connections: ["Pins", "Mica Spacers"],
        failureEffect: "Overheating, red plating.",
        cascadeFailures: ["Tube destruction", "Internal short"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 4, y: 4.5, z: 0},
        mesh: anodeMesh
    });

    // 8. Mica Spacers (Top & Bottom)
    const micaGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 32);
    const micaTop = new THREE.Mesh(micaGeo, micaMaterial);
    micaTop.position.set(0, 6.2, 0);
    const micaBot = new THREE.Mesh(micaGeo, micaMaterial);
    micaBot.position.set(0, 2.8, 0);
    const micaGroup = new THREE.Group();
    micaGroup.add(micaTop);
    micaGroup.add(micaBot);
    group.add(micaGroup);
    parts.push({
        name: "Mica Spacers",
        description: "Thin discs of mica placed at the top and bottom of the internal assembly.",
        material: "Mica",
        function: "Holds all internal elements in precise alignment and insulates them from each other.",
        assemblyOrder: 7,
        connections: ["Anode", "Grid", "Cathode"],
        failureEffect: "Microphonics (vibration sensitivity).",
        cascadeFailures: ["Internal shorts"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 5},
        mesh: micaGroup
    });

    // 9. Getter Flashing
    const getterGeo = new THREE.SphereGeometry(1.28, 32, 16, 0, Math.PI*2, 0, Math.PI/4);
    const getterMesh = new THREE.Mesh(getterGeo, chrome);
    getterMesh.position.set(0, 7.5, 0);
    group.add(getterMesh);
    parts.push({
        name: "Getter Flashing",
        description: "A silver, mirror-like deposit at the top of the glass envelope.",
        material: "Barium",
        function: "Absorbs trace gasses to maintain a high vacuum over the tube's lifetime.",
        assemblyOrder: 8,
        connections: ["Glass Envelope"],
        failureEffect: "Turns white when vacuum is lost.",
        cascadeFailures: ["Loss of vacuum"],
        originalPosition: {x: 0, y: 7.5, z: 0},
        explodedPosition: {x: 0, y: 14, z: 0},
        mesh: getterMesh
    });

    // Electron Particles (Visual Flair)
    const electronCount = 200;
    const electronsGeo = new THREE.BufferGeometry();
    const electronsPos = new Float32Array(electronCount * 3);
    const electronsPhase = new Float32Array(electronCount);
    for(let i=0; i<electronCount; i++) {
        electronsPhase[i] = Math.random() * Math.PI * 2;
        electronsPos[i*3] = 0;
        electronsPos[i*3+1] = 0;
        electronsPos[i*3+2] = 0;
    }
    electronsGeo.setAttribute('position', new THREE.BufferAttribute(electronsPos, 3));
    electronsGeo.setAttribute('phase', new THREE.BufferAttribute(electronsPhase, 1));
    const electronPoints = new THREE.Points(electronsGeo, new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    }));
    electronPoints.position.set(0, 4.5, 0);
    group.add(electronPoints);

    const description = "The Vacuum Tube (Thermionic Valve) is a foundational electronic component that controls electric current flow in a high vacuum between electrodes. Used historically in early computers, radios, and televisions, they are still highly prized in audiophile amplifiers for their warm, rich harmonic distortion profiles.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Heater Filament in a vacuum tube?",
            options: [
                "To emit light for visual aesthetics",
                "To heat the cathode to induce thermionic emission",
                "To control the flow of electrons",
                "To absorb residual gasses"
            ],
            correct: 1,
            explanation: "The heater filament acts as a heating element for the cathode. When heated, the cathode emits electrons into the vacuum through a process called thermionic emission.",
            difficulty: "Easy"
        },
        {
            question: "Which component is responsible for regulating the flow of electrons from the cathode to the anode?",
            options: [
                "Getter",
                "Mica Spacers",
                "Control Grid",
                "Bakelite Base"
            ],
            correct: 2,
            explanation: "The Control Grid is a fine wire mesh between the cathode and anode. By varying the voltage applied to it, it regulates the electron flow, allowing the tube to amplify signals.",
            difficulty: "Medium"
        },
        {
            question: "What does it mean if the Getter Flashing turns chalky white?",
            options: [
                "The tube is operating at maximum efficiency",
                "The heater filament has burned out",
                "The tube has lost its vacuum and air has entered",
                "The grid has shorted to the anode"
            ],
            correct: 2,
            explanation: "The Getter is a reactive metal (like Barium) fired after sealing to absorb trace gasses. If air enters the tube (a vacuum leak), the getter reacts with oxygen and turns white.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate heater emissive intensity slightly
        glowingHeaterMaterial.emissiveIntensity = 4.0 + Math.sin(time * 5) * 1.0;
        heaterLight.intensity = 2.0 + Math.sin(time * 5) * 0.5;

        // Animate electrons flying from cathode to anode
        const posAttribute = electronsGeo.attributes.position;
        const phaseAttribute = electronsGeo.attributes.phase;
        
        for(let i=0; i<electronCount; i++) {
            let phase = phaseAttribute.getX(i);
            phase += speed * 2.0; // Electron speed
            if (phase > Math.PI * 2) phase -= Math.PI * 2;
            phaseAttribute.setX(i, phase);

            // Calculate position
            // r varies from cathode radius (0.15) to anode radius (0.75)
            const normalizedPhase = phase / (Math.PI * 2);
            const r = 0.15 + (normalizedPhase * 0.6);
            
            // Give them random angular positions based on their index
            const angle = i * 137.5; // Golden angle spread
            const y = (Math.sin(i * 123.4) * 1.5); // Spread along the height

            posAttribute.setXYZ(
                i,
                Math.cos(angle) * r,
                y,
                Math.sin(angle) * r
            );
        }
        posAttribute.needsUpdate = true;
        phaseAttribute.needsUpdate = true;

        // Optionally, slowly rotate the grid to show off the 3D structure if exploded/inspected
        if (meshes) {
            meshes.forEach(m => {
                if (m.name === "Control Grid") {
                    // Slight rotation for visual flair
                    m.mesh.rotation.y = time * 0.2;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVacuumTube() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
