import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing material for RF/Acoustic waves
    const waveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.8
    });

    const foamMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1,
        bumpScale: 0.05
    });

    const meshSteel = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.5,
        metalness: 0.8,
        wireframe: true
    });

    // 1. Exterior Enclosure (Faraday Cage & Concrete Shell)
    const enclosureGeo = new THREE.BoxGeometry(10, 8, 10);
    const enclosureMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.6,
        transparent: true,
        opacity: 0.4 // Semi-transparent to see inside
    });
    const enclosure = new THREE.Mesh(enclosureGeo, enclosureMaterial);
    group.add(enclosure);
    meshes.enclosure = enclosure;
    parts.push({
        name: "Faraday Cage Enclosure",
        description: "Heavy-duty shielded steel and concrete shell designed to block all external electromagnetic and acoustic interference.",
        material: "steel/concrete",
        function: "Provides structural integrity and external signal isolation.",
        assemblyOrder: 1,
        connections: ["RF Absorbers", "Floor Grating"],
        failureEffect: "External interference bleeds into test environment.",
        cascadeFailures: ["Invalidates all test data", "Sensor overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. RF/Acoustic Absorber Wedges (Foam Pyramids)
    // We'll create a few representative pyramids to keep geometry manageable but cool looking
    const pyramidGeo = new THREE.ConeGeometry(0.5, 2, 4);
    pyramidGeo.translate(0, 1, 0); // Origin at base
    pyramidGeo.rotateX(Math.PI / 2); // Point outwards
    const absorbersGroup = new THREE.Group();
    
    // Add pyramids on the back wall
    for(let i = -4; i <= 4; i += 1.5) {
        for(let j = -3; j <= 3; j += 1.5) {
            const pyramid = new THREE.Mesh(pyramidGeo, foamMaterial);
            pyramid.position.set(i, j, -4.5);
            absorbersGroup.add(pyramid);
        }
    }
    // Add pyramids on floor
    for(let i = -4; i <= 4; i += 1.5) {
        for(let j = -4; j <= 4; j += 1.5) {
            const pyramid = new THREE.Mesh(pyramidGeo, foamMaterial);
            pyramid.position.set(i, -3.5, j);
            pyramid.rotation.x = -Math.PI / 2;
            absorbersGroup.add(pyramid);
        }
    }
    
    group.add(absorbersGroup);
    meshes.absorbers = absorbersGroup;
    parts.push({
        name: "Radiation Absorbent Material (RAM) Wedges",
        description: "Carbon-loaded polyurethane foam pyramids that gradually absorb incident RF and acoustic energy.",
        material: "Carbon-loaded Foam",
        function: "Prevents signal reflections, simulating a free-space environment.",
        assemblyOrder: 2,
        connections: ["Faraday Cage Enclosure"],
        failureEffect: "Standing waves and multipath interference develop.",
        cascadeFailures: ["Phantom signal readings", "Calibration failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -8 }
    });

    // 3. Walkway Grating (Suspended mesh floor)
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floor = new THREE.Mesh(floorGeo, meshSteel);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    group.add(floor);
    meshes.floor = floor;
    parts.push({
        name: "Suspended Walkway Grating",
        description: "RF-transparent or acoustically invisible metallic grating that allows personnel and equipment to be positioned in the center of the chamber.",
        material: "Steel/Kevlar mesh",
        function: "Supports equipment under test without reflecting signals.",
        assemblyOrder: 3,
        connections: ["Faraday Cage Enclosure", "Test Pedestal"],
        failureEffect: "Equipment collapse or signal reflection.",
        cascadeFailures: ["Test equipment damage"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 4. Test Pedestal / Turntable
    const pedestalGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.set(0, -1.75, 0);
    group.add(pedestal);
    meshes.pedestal = pedestal;
    parts.push({
        name: "360-Degree Turntable Pedestal",
        description: "High-precision motorized pedestal used to rotate the Device Under Test (DUT) in the azimuth plane.",
        material: "darkSteel",
        function: "Allows measurement of antenna radiation patterns in all directions.",
        assemblyOrder: 4,
        connections: ["Suspended Walkway Grating", "Device Under Test (DUT)"],
        failureEffect: "Inability to capture full 3D radiation pattern.",
        cascadeFailures: ["Incomplete certification data"],
        originalPosition: { x: 0, y: -1.75, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 5. Device Under Test (DUT) - E.g., a satellite antenna or router
    const dutGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const dut = new THREE.Mesh(dutGeo, chrome);
    dut.position.set(0, -1, 0);
    group.add(dut);
    meshes.dut = dut;
    parts.push({
        name: "Device Under Test (DUT)",
        description: "The prototype electronics or antenna system being evaluated for emissions or susceptibility.",
        material: "chrome/electronics",
        function: "Emits or receives the test signals.",
        assemblyOrder: 5,
        connections: ["360-Degree Turntable Pedestal", "Signal Generator"],
        failureEffect: "No signal output.",
        cascadeFailures: ["Test aborted"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 6. Test Antenna (Horn Antenna)
    const hornGeo = new THREE.CylinderGeometry(0.2, 0.8, 2, 4);
    hornGeo.rotateX(Math.PI / 2);
    const horn = new THREE.Mesh(hornGeo, copper);
    horn.position.set(0, 0, 3);
    group.add(horn);
    meshes.horn = horn;
    parts.push({
        name: "Calibrated Horn Antenna",
        description: "High-gain, broadband antenna used to receive emissions from the DUT or transmit interference to it.",
        material: "copper",
        function: "Transducer for RF signals between the chamber and the network analyzer.",
        assemblyOrder: 6,
        connections: ["Network Analyzer", "Test Mast"],
        failureEffect: "Inaccurate signal measurement.",
        cascadeFailures: ["False pass/fail of DUT"],
        originalPosition: { x: 0, y: 0, z: 3 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    // 7. Electromagnetic/Acoustic Waves (Visual Flare)
    const waveGeo = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
    const waves = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const wave = new THREE.Mesh(waveGeo, waveMaterial);
        wave.scale.set(1 + i*0.5, 1 + i*0.5, 1 + i*0.5);
        waves.add(wave);
    }
    waves.position.set(0, -1, 0);
    group.add(waves);
    meshes.waves = waves;
    parts.push({
        name: "Propagation Field (Visualizer)",
        description: "A visual representation of the electromagnetic or acoustic waves radiating from the DUT.",
        material: "Neon Plasma",
        function: "Illustrates the continuous wave (CW) or pulsed signal propagation.",
        assemblyOrder: 7,
        connections: ["Device Under Test (DUT)"],
        failureEffect: "Visual field collapses.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 5, y: -1, z: 0 }
    });


    const description = "An Anechoic Chamber is a highly specialized room designed to completely absorb reflections of either sound or electromagnetic waves. They are also heavily insulated from exterior sources of noise. The combination of these aspects means they simulate a quiet open-space of infinite dimension, which is useful when external influences would otherwise give false results. They are used extensively for testing antennas, radars, and electromagnetic interference (EMI).";

    const quizQuestions = [
        {
            question: "What is the primary function of the wedge-shaped foam or ferrite tiles covering the walls?",
            options: [
                "To cool the equipment during high-power tests",
                "To gradually match the impedance of free space and absorb incident waves",
                "To amplify the signal from the Device Under Test",
                "To provide structural support for the Faraday cage"
            ],
            correct: 1,
            explanation: "The geometric shape of the wedges causes waves to bounce multiple times within the 'valleys', absorbing energy with each bounce and preventing reflections.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Faraday Cage used as the outer shell of an RF Anechoic Chamber?",
            options: [
                "To prevent external RF signals (like cell towers) from interfering with the highly sensitive tests",
                "To keep the chamber at a constant temperature",
                "To stop acoustic noise from leaking out",
                "To protect operators from acoustic shock"
            ],
            correct: 0,
            explanation: "A Faraday Cage blocks external electromagnetic fields, isolating the interior environment so that only the controlled emissions of the DUT are measured.",
            difficulty: "Easy"
        },
        {
            question: "What consequence does a highly reflective floor have in a fully anechoic chamber?",
            options: [
                "It improves the signal-to-noise ratio",
                "It causes multipath interference, corrupting the 3D radiation pattern measurement",
                "It prevents the turntable from rotating",
                "It acts as a secondary antenna"
            ],
            correct: 1,
            explanation: "In a fully anechoic chamber, all surfaces must be absorbent. A reflective floor creates multipath signals (the wave bounces off the floor into the receiving antenna), which destructively or constructively interferes with the direct signal, invalidating the test.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate turntable and DUT
        meshes.pedestal.rotation.y = time * speed * 0.5;
        meshes.dut.rotation.y = time * speed * 0.5;

        // Pulse the waves to simulate emission
        meshes.waves.children.forEach((wave, index) => {
            const scale = 1 + ((time * speed * 2 + index) % 3);
            wave.scale.set(scale, scale, scale);
            wave.material.opacity = 1 - (scale - 1) / 3;
            
            // Aim waves towards the horn antenna
            wave.rotation.x = Math.PI / 2;
        });

        // Slight hovering or adjustment of horn antenna
        meshes.horn.position.y = Math.sin(time * speed) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAnechoicChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
