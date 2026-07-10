import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0055,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const atomCloudMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.4,
        metalness: 0.8
    });

    // 1. Ultra-High Vacuum (UHV) Chamber Base
    const chamberGeometry = new THREE.IcosahedronGeometry(2, 1);
    const chamber = new THREE.Mesh(chamberGeometry, chrome);
    chamber.position.set(0, 0, 0);
    group.add(chamber);
    parts.push({
        name: "UHV Chamber",
        description: "Ultra-High Vacuum Chamber where the atoms are isolated from background gas at pressures below 10^-10 Torr.",
        material: "Chrome/Steel",
        function: "Provides the necessary extreme vacuum environment to prevent collisions with background gas particles.",
        assemblyOrder: 1,
        connections: ["Vacuum Pumps", "Viewports"],
        failureEffect: "Loss of vacuum leads to immediate heating and destruction of the condensate due to collisions.",
        cascadeFailures: ["Atom Cloud", "Cooling Process"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Anti-Helmholtz Coils (Magnetic Field Gradient)
    const coilGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    
    const topCoil = new THREE.Mesh(coilGeometry, coilMaterial);
    topCoil.position.set(0, 1.8, 0);
    topCoil.rotation.x = Math.PI / 2;
    group.add(topCoil);

    const bottomCoil = new THREE.Mesh(coilGeometry, coilMaterial);
    bottomCoil.position.set(0, -1.8, 0);
    bottomCoil.rotation.x = Math.PI / 2;
    group.add(bottomCoil);

    parts.push({
        name: "Anti-Helmholtz Coils",
        description: "Two parallel electromagnets with current flowing in opposite directions, creating a quadrupole magnetic field.",
        material: "Copper",
        function: "Creates a magnetic field zero at the center, providing a restoring force to trap atoms via the Zeeman effect.",
        assemblyOrder: 2,
        connections: ["UHV Chamber", "Power Supply"],
        failureEffect: "Atoms expand freely and escape the trapping region.",
        cascadeFailures: ["Atom Cloud"],
        originalPosition: {x: 0, y: 0, z: 0}, // abstract representation for the pair
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 3. Cooling Lasers (6 beams)
    const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
    const laserMeshes = [];

    const laserPositions = [
        { rotX: 0, rotY: 0, rotZ: Math.PI / 2 }, // X axis
        { rotX: 0, rotY: 0, rotZ: 0 },           // Y axis
        { rotX: Math.PI / 2, rotY: 0, rotZ: 0 }  // Z axis
    ];

    laserPositions.forEach((rot, index) => {
        const beam = new THREE.Mesh(laserGeometry, laserMaterial);
        beam.rotation.set(rot.rotX, rot.rotY, rot.rotZ);
        group.add(beam);
        laserMeshes.push(beam);
    });

    parts.push({
        name: "Cooling Lasers (MOT)",
        description: "Six red-detuned intersecting laser beams.",
        material: "Photons",
        function: "Provides optical molasses via Doppler cooling to slow down atoms to microkelvin temperatures.",
        assemblyOrder: 3,
        connections: ["Optics Table"],
        failureEffect: "Atoms cannot be cooled or trapped, remaining a hot thermal gas.",
        cascadeFailures: ["Atom Cloud"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: 0, z: 5}
    });

    // 4. Atom Cloud (The BEC)
    const cloudGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const atomCloud = new THREE.Mesh(cloudGeometry, atomCloudMaterial);
    group.add(atomCloud);

    parts.push({
        name: "Rubidium-87 Atom Cloud",
        description: "The collection of atoms being cooled. Initially a thermal cloud, then forming a macroscopic quantum state.",
        material: "Rubidium Gas",
        function: "The subject of the experiment, condensing into a single quantum state at nanokelvin temperatures.",
        assemblyOrder: 4,
        connections: ["UHV Chamber"],
        failureEffect: "Experiment fails.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -4, y: 0, z: -4}
    });

    // 5. Optics and Mirrors
    const mirrorGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    for(let i=0; i<6; i++) {
        const mirror = new THREE.Mesh(mirrorGeometry, glass);
        const dist = 5;
        if(i === 0) { mirror.position.set(dist, 0, 0); mirror.rotation.z = Math.PI/2; }
        if(i === 1) { mirror.position.set(-dist, 0, 0); mirror.rotation.z = Math.PI/2; }
        if(i === 2) { mirror.position.set(0, dist, 0); }
        if(i === 3) { mirror.position.set(0, -dist, 0); }
        if(i === 4) { mirror.position.set(0, 0, dist); mirror.rotation.x = Math.PI/2; }
        if(i === 5) { mirror.position.set(0, 0, -dist); mirror.rotation.x = Math.PI/2; }
        group.add(mirror);
    }

    parts.push({
        name: "Optical Components",
        description: "Mirrors, waveplates, and lenses precisely directing and polarizing the laser beams.",
        material: "Glass/Aluminum",
        function: "Steers and conditions the laser light to form the 3D optical molasses.",
        assemblyOrder: 5,
        connections: ["Cooling Lasers"],
        failureEffect: "Misalignment causes unbalanced radiation pressure, pushing atoms out of the trap.",
        cascadeFailures: ["Atom Cloud", "Cooling Lasers"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 6}
    });

    // Description
    const description = "The Bose-Einstein Condensate Chamber features a Magneto-Optical Trap (MOT) to laser-cool atoms to near absolute zero. Using six intersecting laser beams and a magnetic field gradient, atoms are slowed and trapped before evaporative cooling pushes them into a macroscopic quantum state (the BEC).";

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What is the primary function of the six intersecting laser beams in the Magneto-Optical Trap?",
            options: [
                "To heat the atoms to plasma state",
                "To provide optical molasses through Doppler cooling",
                "To create a strong magnetic field",
                "To levitate the entire vacuum chamber"
            ],
            correct: 1,
            explanation: "The six lasers are slightly red-detuned, meaning atoms moving towards a laser will preferentially absorb its photons due to the Doppler effect, slowing them down in all three dimensions.",
            difficulty: "Medium"
        },
        {
            question: "Why are the Anti-Helmholtz coils necessary?",
            options: [
                "They generate electricity to power the lasers",
                "They heat the chamber to prevent condensation of water",
                "They create a spatially dependent magnetic field zero to provide a restoring force",
                "They shield the experiment from Earth's magnetic field"
            ],
            correct: 2,
            explanation: "While lasers provide the cooling (friction), a position-dependent restoring force is needed to trap the atoms at the center. The magnetic field gradient from the coils achieves this via the Zeeman effect.",
            difficulty: "Hard"
        },
        {
            question: "What extreme condition must the UHV Chamber maintain?",
            options: [
                "Absolute zero temperature on the chamber walls",
                "Pressures below 10^-10 Torr",
                "Complete darkness",
                "A perfect vacuum with zero particles"
            ],
            correct: 1,
            explanation: "Ultra-High Vacuum (below 10^-10 Torr) is required to ensure the trapped, ultra-cold atoms do not collide with high-energy room-temperature background gas molecules, which would knock them out of the trap.",
            difficulty: "Medium"
        }
    ];

    // Animation Function
    function animate(time, speed, meshes) {
        // Pulsate the atom cloud size and opacity to simulate cooling/density increase
        const pulse = Math.sin(time * 2 * speed) * 0.1 + 1;
        atomCloud.scale.set(pulse, pulse, pulse);
        
        // As atoms cool, they get denser and brighter
        atomCloudMaterial.opacity = 0.6 + Math.sin(time * speed) * 0.3;

        // Modulate laser opacity slightly to simulate active feedback/locking
        laserMaterial.opacity = 0.5 + Math.sin(time * 10 * speed) * 0.1;
        
        // Slowly rotate the chamber slightly to show 3D nature
        chamber.rotation.y = time * 0.1 * speed;
        chamber.rotation.z = time * 0.05 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBoseEinsteinCondensateChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
