import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Cosmic Ray Scintillator Detector is a high-tech instrument used to detect and measure high-energy particles originating from outer space. It uses a scintillating material that emits light when struck by ionizing radiation, which is then amplified by a photomultiplier tube.";

    // Custom Materials
    const scintillatorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        emissive: 0x0088ff,
        emissiveIntensity: 0.2
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.8
    });

    const neonWireMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.2
    });

    const casingMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.3,
        clearcoat: 0.5
    });

    // Parts Construction
    
    // 1. Base Plate
    const baseGeo = new THREE.BoxGeometry(6, 0.4, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.2, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Plate",
        description: "Heavy steel base providing stability and housing the main power distribution matrix.",
        material: darkSteel,
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Casing", "Power Supply"],
        failureEffect: "Misalignment of optical components",
        cascadeFailures: ["Scintillator Panel", "Photomultiplier Tube"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Main Casing
    const casingGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 32, 1, true);
    const casingMesh = new THREE.Mesh(casingGeo, casingMaterial);
    casingMesh.position.set(0, 2.4, 0);
    group.add(casingMesh);
    parts.push({
        name: "Detector Casing",
        description: "Light-tight cylindrical enclosure shielding the internal components from ambient light and low-energy noise.",
        material: casingMaterial,
        function: "Environmental shielding",
        assemblyOrder: 2,
        connections: ["Base Plate", "Top Cap"],
        failureEffect: "Light leak causing false particle detections",
        cascadeFailures: ["Data Acquisition System"],
        originalPosition: { x: 0, y: 2.4, z: 0 },
        explodedPosition: { x: 0, y: 2.4, z: 5 },
        mesh: casingMesh
    });

    // 3. Scintillator Panel (Core)
    const scintGeo = new THREE.BoxGeometry(3, 1, 3);
    const scintMesh = new THREE.Mesh(scintGeo, scintillatorMaterial);
    scintMesh.position.set(0, 1.5, 0);
    group.add(scintMesh);
    parts.push({
        name: "Scintillator Crystal Panel",
        description: "A specialized crystal matrix that emits flashes of light (photons) when a high-energy cosmic ray passes through it.",
        material: scintillatorMaterial,
        function: "Particle to photon conversion",
        assemblyOrder: 3,
        connections: ["Light Guide"],
        failureEffect: "Zero detection events",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: -4, y: 1.5, z: 0 },
        mesh: scintMesh
    });

    // 4. Light Guide
    const guideGeo = new THREE.CylinderGeometry(1.5, 2.1, 1, 4);
    guideGeo.rotateY(Math.PI / 4);
    const guideMesh = new THREE.Mesh(guideGeo, glass);
    guideMesh.position.set(0, 2.5, 0);
    group.add(guideMesh);
    parts.push({
        name: "Acrylic Light Guide",
        description: "Directs and channels the emitted photons from the scintillator to the photomultiplier tube.",
        material: glass,
        function: "Optical focusing",
        assemblyOrder: 4,
        connections: ["Scintillator Panel", "Photomultiplier Tube"],
        failureEffect: "Reduced photon collection efficiency",
        cascadeFailures: ["Signal Amplifier"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 4, y: 2.5, z: 0 },
        mesh: guideMesh
    });

    // 5. Photomultiplier Tube (PMT)
    const pmtGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const pmtMesh = new THREE.Mesh(pmtGeo, chrome);
    pmtMesh.position.set(0, 3.75, 0);
    group.add(pmtMesh);
    parts.push({
        name: "Photomultiplier Tube (PMT)",
        description: "An extremely sensitive vacuum tube that detects the faint flashes of light and multiplies the electron signal by millions.",
        material: chrome,
        function: "Signal amplification",
        assemblyOrder: 5,
        connections: ["Light Guide", "High Voltage Supply", "Data Acquisition System"],
        failureEffect: "Complete loss of signal output",
        cascadeFailures: ["Data Acquisition System"],
        originalPosition: { x: 0, y: 3.75, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: pmtMesh
    });

    // 6. Neon Power Wiring
    const wirePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.5, 3.75, 0),
        new THREE.Vector3(2.0, 2.5, 1.0),
        new THREE.Vector3(2.0, 1.0, 1.5),
        new THREE.Vector3(1.0, 0.4, 2.0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wirePath, 20, 0.08, 8, false);
    const wireMesh = new THREE.Mesh(wireGeo, neonWireMaterial);
    group.add(wireMesh);
    parts.push({
        name: "High Voltage Transmission Line",
        description: "Delivers the high voltage needed to power the dynodes inside the PMT.",
        material: neonWireMaterial,
        function: "Power delivery",
        assemblyOrder: 6,
        connections: ["Photomultiplier Tube", "Base Plate"],
        failureEffect: "PMT loses amplification capability",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 3 },
        mesh: wireMesh
    });

    // 7. Data Acquisition Module
    const daqGeo = new THREE.BoxGeometry(1.5, 1.5, 1);
    const daqMesh = new THREE.Mesh(daqGeo, aluminum);
    daqMesh.position.set(0, 0.95, 2.6);
    group.add(daqMesh);
    
    // Status light on DAQ
    const statusGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const statusMesh = new THREE.Mesh(statusGeo, glowMaterial);
    statusMesh.position.set(0, 0.4, 0.5);
    daqMesh.add(statusMesh);

    parts.push({
        name: "Data Acquisition Module (DAQ)",
        description: "Processes the analog electrical pulses from the PMT into digital data streams.",
        material: aluminum,
        function: "Data processing",
        assemblyOrder: 7,
        connections: ["Photomultiplier Tube", "Base Plate"],
        failureEffect: "Data corruption or no data logging",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.95, z: 2.6 },
        explodedPosition: { x: 0, y: 0.95, z: 6 },
        mesh: daqMesh
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the scintillator material in a cosmic ray detector?",
            options: [
                "To absorb cosmic rays and safely ground them",
                "To convert the energy of passing high-energy particles into flashes of visible light",
                "To amplify the electrical signal",
                "To provide structural shielding for the internal components"
            ],
            correct: 1,
            explanation: "Scintillators are materials that exhibit luminescence when excited by ionizing radiation, converting the particle's energy into detectable photons.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Photomultiplier Tube (PMT) necessary in this assembly?",
            options: [
                "To increase the speed of the incoming cosmic rays",
                "To filter out background radiation",
                "To detect and massively amplify the very faint light signals produced by the scintillator",
                "To generate high voltage for the system"
            ],
            correct: 2,
            explanation: "The light flashes from the scintillator are often too weak to measure directly. A PMT converts these photons into electrons and multiplies them via a series of dynodes to create a measurable electrical pulse.",
            difficulty: "Hard"
        },
        {
            question: "What would be the effect of a light leak in the main detector casing?",
            options: [
                "The system would overheat",
                "Ambient light photons would enter the PMT, causing massive noise and false particle detections",
                "The scintillator crystal would shatter",
                "The data acquisition module would lose power"
            ],
            correct: 1,
            explanation: "PMTs are extremely sensitive to light. Any ambient light leaking into the casing would flood the PMT, drowning out the actual cosmic ray signals and causing a high rate of false positives.",
            difficulty: "Medium"
        }
    ];

    // Animation Function
    function animate(time, speed, meshes) {
        // Scintillator panel pulses to simulate particle hits
        const scintIndex = parts.findIndex(p => p.name === "Scintillator Crystal Panel");
        if (scintIndex !== -1 && meshes[scintIndex]) {
            // Randomly flash the scintillator based on "hits"
            if (Math.random() > 0.98) {
                scintillatorMaterial.emissiveIntensity = 2.0 + Math.random() * 2;
                meshes[scintIndex].scale.set(1.02, 1.02, 1.02);
            } else {
                scintillatorMaterial.emissiveIntensity = THREE.MathUtils.lerp(scintillatorMaterial.emissiveIntensity, 0.2, 0.1);
                meshes[scintIndex].scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }

        // DAQ status light blinks
        if (statusMesh) {
            statusMesh.material.opacity = 0.5 + Math.sin(time * speed * 5) * 0.5;
            if (scintillatorMaterial.emissiveIntensity > 2.0) {
                 statusMesh.material.color.setHex(0xff0000); // flash red on hit
            } else {
                 statusMesh.material.color.setHex(0x00ffcc); // normal cyan
            }
        }

        // Wire glowing pulse
        neonWireMaterial.emissiveIntensity = 1.0 + Math.sin(time * speed * 2) * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCosmicRayScintillator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
