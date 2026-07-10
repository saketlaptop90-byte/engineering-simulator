import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for the Star Layers
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffcc00,
        emissiveIntensity: 2.0,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const radiativeZoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 1.0,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.5,
        transmission: 0.8,
        ior: 1.4
    });

    const convectiveZoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4400,
        emissive: 0xcc2200,
        emissiveIntensity: 0.5,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });

    const axisMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    // 1. Stellar Core
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);
    parts.push({
        name: "Stellar Core",
        description: "The dense, intensely hot central region of the star where nuclear fusion occurs.",
        material: "Core Material (Emissive)",
        function: "Generates the star's energy and serves as the inner boundary for gravity modes (g-modes).",
        assemblyOrder: 1,
        connections: ["Radiative Zone"],
        failureEffect: "Core collapse, supernova.",
        cascadeFailures: ["Complete Stellar Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: coreMesh
    });

    // 2. Radiative Zone
    const radiativeGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const radiativeMesh = new THREE.Mesh(radiativeGeometry, radiativeZoneMaterial);
    radiativeMesh.position.set(0, 0, 0);
    group.add(radiativeMesh);
    parts.push({
        name: "Radiative Zone",
        description: "The intermediate layer where energy is transported via radiation. Highly sensitive to internal sound waves.",
        material: "Radiative Plasma Material",
        function: "Propagates acoustic waves (p-modes) from the core to the outer layers.",
        assemblyOrder: 2,
        connections: ["Stellar Core", "Convective Zone"],
        failureEffect: "Disruption of energy transport.",
        cascadeFailures: ["Temperature Fluctuation", "Surface Instability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: radiativeMesh
    });

    // 3. Convective Zone
    const convectiveGeometry = new THREE.SphereGeometry(4, 64, 64);
    const convectiveMesh = new THREE.Mesh(convectiveGeometry, convectiveZoneMaterial);
    convectiveMesh.position.set(0, 0, 0);
    group.add(convectiveMesh);
    parts.push({
        name: "Convective Zone",
        description: "The outermost layer of the stellar interior where energy is transported by convection currents.",
        material: "Convective Plasma Material",
        function: "Exhibits observable surface oscillations caused by internal pulsations.",
        assemblyOrder: 3,
        connections: ["Radiative Zone", "Surface Sensors"],
        failureEffect: "Loss of surface magnetic field generation.",
        cascadeFailures: ["Coronal Mass Ejection", "Stellar Flare"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: convectiveMesh
    });

    // 4. Harmonic Axis / Sensor Array
    const axisGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
    const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
    axisMesh.position.set(0, 0, 0);
    group.add(axisMesh);
    parts.push({
        name: "Harmonic Axis",
        description: "A theoretical construct representing the axis of symmetry for spherical harmonics.",
        material: "Holographic Axis Material",
        function: "Defines the polar axis for calculating l (degree) and m (azimuthal order) pulsation modes.",
        assemblyOrder: 4,
        connections: ["Stellar Core"],
        failureEffect: "Loss of spatial orientation for modes.",
        cascadeFailures: ["Inaccurate Mode Identification"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 },
        mesh: axisMesh
    });

    // 5. Orbital Mode Visualizer Rings
    const ringGeometry = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeometry, glass);
    ringMesh1.rotation.x = Math.PI / 2;
    group.add(ringMesh1);
    parts.push({
        name: "Equatorial Node Ring",
        description: "Visualizes the nodal lines on the stellar surface where pulsation amplitude is zero.",
        material: "Glass",
        function: "Maps the geometry of non-radial pulsation modes.",
        assemblyOrder: 5,
        connections: ["Harmonic Axis"],
        failureEffect: "Invisible surface modes.",
        cascadeFailures: ["Observation Error"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -6 },
        mesh: ringMesh1
    });

    const description = "The Astroseismology Pulsation Modes Simulator visualizes the internal acoustic (p-modes) and gravity (g-modes) waves that cause a star to pulsate. By studying these oscillations, astronomers can deduce the internal structure, density, and rotation profile of the star, analogous to how seismologists study earthquakes on Earth. The model highlights the interaction between spherical harmonics across the Core, Radiative Zone, and Convective Zone.";

    const quizQuestions = [
        {
            question: "What type of wave primarily propagates through the star's interior, causing pressure variations?",
            options: ["Gravity Waves (g-modes)", "Acoustic Waves (p-modes)", "Electromagnetic Waves", "Rossby Waves (r-modes)"],
            correct: 1,
            explanation: "Pressure modes, or p-modes, are acoustic waves driven by pressure fluctuations. They are the primary pulsations observed in sun-like stars.",
            difficulty: "Medium"
        },
        {
            question: "Which quantum numbers describe the non-radial pulsation modes of a star?",
            options: ["Principal (n), Angular (l), Magnetic (m)", "Degree (l), Azimuthal order (m), Radial order (n)", "Spin (s), Parity (p)", "Alpha, Beta, Gamma"],
            correct: 1,
            explanation: "Stellar pulsations are described by spherical harmonics using the degree (l), the azimuthal order (m), and the radial order (n).",
            difficulty: "Hard"
        },
        {
            question: "In astroseismology, what do gravity modes (g-modes) primarily help scientists probe?",
            options: ["The outer convective envelope", "The star's magnetic field", "The deep stellar core", "The solar wind"],
            correct: 2,
            explanation: "Gravity modes (g-modes) are highly sensitive to the conditions in the deep stellar core, as buoyancy is their restoring force.",
            difficulty: "Hard"
        },
        {
            question: "What is the restoring force for p-modes?",
            options: ["Buoyancy", "Magnetic fields", "Pressure", "Coriolis force"],
            correct: 2,
            explanation: "The restoring force for p-modes is the internal gas pressure of the star.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const [core, radiative, convective, axis, ring] = meshes;
        const t = time * speed;

        // Core pulsation (radial mode l=0)
        const coreScale = 1 + 0.05 * Math.sin(t * 3);
        core.scale.set(coreScale, coreScale, coreScale);

        // Radiative Zone complex pulsation (non-radial mode approximation)
        // Distorting the sphere by scaling axes differently
        const radScaleX = 1 + 0.1 * Math.sin(t * 2);
        const radScaleY = 1 + 0.1 * Math.sin(t * 2 + Math.PI);
        const radScaleZ = 1 + 0.1 * Math.sin(t * 2);
        radiative.scale.set(radScaleX, radScaleY, radScaleZ);
        radiative.rotation.y = t * 0.2;

        // Convective Zone rapid surface oscillation (high order mode)
        const convScaleX = 1 + 0.03 * Math.sin(t * 5);
        const convScaleY = 1 + 0.03 * Math.cos(t * 5.1);
        const convScaleZ = 1 + 0.03 * Math.sin(t * 4.9);
        convective.scale.set(convScaleX, convScaleY, convScaleZ);
        convective.rotation.x = t * 0.1;
        convective.rotation.z = t * 0.15;

        // Axis pulsing
        axis.material.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 4);

        // Ring nodal line rotation
        ring.rotation.z = t * 0.5;
        ring.scale.set(1 + 0.02*Math.sin(t*2), 1 + 0.02*Math.sin(t*2), 1);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPulsationModes() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
