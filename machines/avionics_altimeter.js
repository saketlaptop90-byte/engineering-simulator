import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.1
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });

    // 1. Casing
    const casingGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.5, 32);
    const casing = new THREE.Mesh(casingGeo, darkSteel);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);
    
    parts.push({
        name: "Outer Casing",
        description: "A robust protective enclosure shielding internal components from structural damage and rapid temperature changes.",
        material: "darkSteel",
        function: "Encloses and protects delicate altimeter mechanisms.",
        assemblyOrder: 1,
        connections: ["Dial Face", "Static Port"],
        failureEffect: "Exposure of internals to moisture and dust.",
        cascadeFailures: ["Aneroid Wafer Corrosion", "Gear Binding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // 2. Static Port Tube
    const portGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const staticPort = new THREE.Mesh(portGeo, aluminum);
    staticPort.position.set(0, -2, -0.5);
    group.add(staticPort);

    parts.push({
        name: "Static Pressure Port",
        description: "Connects the interior of the altimeter to the aircraft's static line, feeding ambient atmospheric pressure to the aneroid capsules.",
        material: "aluminum",
        function: "Delivers outside air pressure to the instrument case.",
        assemblyOrder: 2,
        connections: ["Outer Casing"],
        failureEffect: "Blockage leads to frozen altimeter reading.",
        cascadeFailures: ["Pilot Spatial Disorientation"],
        originalPosition: { x: 0, y: -2, z: -0.5 },
        explodedPosition: { x: 0, y: -4, z: -0.5 }
    });

    // 3. Aneroid Wafers (Capsules)
    const waferGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const waferGroup = new THREE.Group();
    
    const wafer1 = new THREE.Mesh(waferGeo, copper);
    wafer1.position.z = -0.3;
    const wafer2 = new THREE.Mesh(waferGeo, copper);
    wafer2.position.z = 0;
    const wafer3 = new THREE.Mesh(waferGeo, copper);
    wafer3.position.z = 0.3;

    waferGroup.add(wafer1);
    waferGroup.add(wafer2);
    waferGroup.add(wafer3);
    group.add(waferGroup);
    
    // meshes for animation
    const meshes = { wafer1, wafer2, wafer3, pointers: [] };

    parts.push({
        name: "Aneroid Wafers (Capsules)",
        description: "A stack of partially evacuated, corrugated copper/beryllium discs. They expand as outside air pressure drops (climbing altitude).",
        material: "copper",
        function: "Acts as the primary pressure-sensing element.",
        assemblyOrder: 3,
        connections: ["Rocking Shaft", "Linkage Assembly"],
        failureEffect: "Loss of altitude sensing.",
        cascadeFailures: ["Total instrument failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -2 }
    });

    // 4. Linkage Assembly and Rocking Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.set(1.4, 0, 0);
    shaft.rotation.x = Math.PI / 2;
    group.add(shaft);

    parts.push({
        name: "Rocking Shaft & Linkage",
        description: "A precision mechanism translating the minute linear expansion of the aneroid wafers into rotational motion.",
        material: "steel",
        function: "Converts linear wafer expansion to rotary gear movement.",
        assemblyOrder: 4,
        connections: ["Aneroid Wafers", "Sector Gear"],
        failureEffect: "Inaccurate or disconnected pointer movement.",
        cascadeFailures: ["Misleading altitude readout"],
        originalPosition: { x: 1.4, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 }
    });

    // 5. Sector Gear & Pinion
    const sectorGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 24, Math.PI / 2);
    const sectorGear = new THREE.Mesh(sectorGeo, chrome);
    sectorGear.position.set(0.8, 0, 0.5);
    group.add(sectorGear);
    meshes.sectorGear = sectorGear;

    parts.push({
        name: "Sector Gear & Pinion",
        description: "Magnifies the small rotation from the linkage into a large rotation for the main indicator needles.",
        material: "chrome",
        function: "Amplifies mechanical motion to drive the pointers.",
        assemblyOrder: 5,
        connections: ["Rocking Shaft", "Pointer Shaft"],
        failureEffect: "Needle skipping or jamming.",
        cascadeFailures: ["Erratic altimeter readings"],
        originalPosition: { x: 0.8, y: 0, z: 0.5 },
        explodedPosition: { x: 2, y: 0, z: 1.5 }
    });

    // 6. Dial Face
    const dialGeo = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const dial = new THREE.Mesh(dialGeo, plastic);
    dial.rotation.x = Math.PI / 2;
    dial.position.z = 0.6;
    group.add(dial);
    
    // Add neon ring to dial face
    const neonRingGeo = new THREE.TorusGeometry(1.9, 0.02, 16, 64);
    const neonRing = new THREE.Mesh(neonRingGeo, neonCyan);
    neonRing.position.z = 0.65;
    group.add(neonRing);

    parts.push({
        name: "Dial Face",
        description: "Calibrated faceplate marked with altitude increments, often illuminated for night flights.",
        material: "plastic + neonCyan",
        function: "Provides a visual reference scale for the pointers.",
        assemblyOrder: 6,
        connections: ["Outer Casing"],
        failureEffect: "Unreadable altitude.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.6 },
        explodedPosition: { x: 0, y: 0, z: 3 }
    });

    // 7. Pointers (Needles)
    const longPointerGeo = new THREE.BoxGeometry(0.08, 1.6, 0.02);
    const longPointer = new THREE.Mesh(longPointerGeo, glowGreen);
    longPointer.position.set(0, 0.6, 0.7);
    
    const longPointerPivot = new THREE.Group();
    longPointerPivot.position.set(0, 0, 0.7);
    longPointerPivot.add(longPointer);
    group.add(longPointerPivot);
    meshes.pointers.push(longPointerPivot);

    const shortPointerGeo = new THREE.BoxGeometry(0.12, 1.0, 0.03);
    const shortPointer = new THREE.Mesh(shortPointerGeo, neonOrange);
    shortPointer.position.set(0, 0.4, 0.75);

    const shortPointerPivot = new THREE.Group();
    shortPointerPivot.position.set(0, 0, 0.75);
    shortPointerPivot.add(shortPointer);
    group.add(shortPointerPivot);
    meshes.pointers.push(shortPointerPivot);

    parts.push({
        name: "Indicator Pointers",
        description: "The 100-foot (long) and 1,000-foot (short) needles indicating the aircraft's current altitude.",
        material: "neonOrange / glowGreen",
        function: "Displays the measured altitude to the pilot.",
        assemblyOrder: 7,
        connections: ["Pointer Shaft"],
        failureEffect: "Loss of visual altitude information.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.7 },
        explodedPosition: { x: 0, y: 0, z: 4.5 }
    });

    // 8. Front Glass Cover
    const glassGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.05, 32);
    const frontGlass = new THREE.Mesh(glassGeo, glass);
    frontGlass.rotation.x = Math.PI / 2;
    frontGlass.position.z = 0.8;
    group.add(frontGlass);

    parts.push({
        name: "Front Glass",
        description: "A transparent, sealed crystal protecting the dial and needles from cabin pressure and dust.",
        material: "glass",
        function: "Protects dial while allowing visibility.",
        assemblyOrder: 8,
        connections: ["Outer Casing"],
        failureEffect: "Dial exposed to elements.",
        cascadeFailures: ["Pointer damage", "Internal contamination"],
        originalPosition: { x: 0, y: 0, z: 0.8 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    const description = "The Aneroid Barometer Altimeter is a high-precision flight instrument. It measures the static air pressure outside the aircraft. As altitude increases, atmospheric pressure drops, causing the partially evacuated copper aneroid wafers to expand. This minute linear expansion is mechanically amplified through a series of linkages, rocking shafts, and a sector gear to rotate the indicator needles, providing the pilot with a vital readout of the aircraft's altitude above sea level.";

    const quizQuestions = [
        {
            question: "What is the primary sensing element inside a traditional mechanical altimeter?",
            options: ["Pitot tube", "Gyroscopic rotor", "Aneroid wafers", "Thermocouple"],
            correct: 2,
            explanation: "Aneroid wafers are partially evacuated capsules that expand and contract with changes in static air pressure, serving as the core altitude sensor.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the aneroid wafers as the aircraft climbs to a higher altitude?",
            options: ["They compress due to cold temperatures", "They expand due to lower atmospheric pressure", "They spin faster to stabilize the needles", "They fill with static air"],
            correct: 1,
            explanation: "As altitude increases, outside air pressure decreases. Since the wafers are sealed and partially evacuated, the reduced external pressure allows them to expand.",
            difficulty: "Medium"
        },
        {
            question: "What would happen if the static port becomes blocked during a flight?",
            options: ["The altimeter reads zero", "The altimeter freezes at its current reading", "The needles spin uncontrollably", "The aneroid wafers rupture"],
            correct: 1,
            explanation: "If the static port is blocked, the pressure inside the altimeter case cannot change to match the outside atmosphere. The altimeter will freeze at the altitude where the blockage occurred.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, m) {
        if (!m || !m.wafer1) return;
        
        // Simulate altitude changes (sine wave)
        const altitudePulse = Math.sin(time * speed * 2) * 0.5 + 0.5; // 0 to 1
        
        // Wafers expanding
        const expansion = 0.1 * altitudePulse;
        m.wafer1.position.z = -0.3 - expansion;
        m.wafer3.position.z = 0.3 + expansion;
        
        // Pointers rotation based on altitude
        const rotationAngle = -altitudePulse * Math.PI * 10; // multiple rotations for 100-foot needle
        m.pointers[0].rotation.z = rotationAngle; // Long needle
        m.pointers[1].rotation.z = rotationAngle / 10; // Short needle (1,000 ft)

        // Sector gear subtle rotation
        if (m.sectorGear) {
            m.sectorGear.rotation.z = altitudePulse * Math.PI / 4;
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createAvionicsAltimeter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
