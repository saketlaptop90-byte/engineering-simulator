import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const greaseMat = new THREE.MeshPhysicalMaterial({ color: 0x888822, roughness: 0.3 });

    const outerRingGeo = new THREE.TorusGeometry(3, 0.4, 16, 64);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, darkSteel);
    outerRingMesh.rotation.x = Math.PI / 2;
    group.add(outerRingMesh);
    parts.push({
        name: "Outer Ring (Fixed to Chassis)",
        description: "Massive forged steel ring with internal gear teeth.",
        material: "High-Carbon Steel",
        function: "Bolts securely to the crawler tracks or truck base, providing the stationary foundation.",
        assemblyOrder: 1,
        connections: ["Roller Bearings", "Pinion Gear"],
        failureEffect: "Bolt shear.",
        cascadeFailures: ["Entire crane upperworks falls off the base"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-4, z:0}
    });

    const innerRingGeo = new THREE.TorusGeometry(2.2, 0.3, 16, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, chrome);
    innerRingMesh.rotation.x = Math.PI / 2;
    group.add(innerRingMesh);
    parts.push({
        name: "Inner Ring (Rotating Upperworks)",
        description: "Smooth steel ring bolted to the crane cab and boom.",
        material: "Machined Steel",
        function: "Supports the entire weight and massive tipping leverage of the crane boom and counterweights.",
        assemblyOrder: 2,
        connections: ["Roller Bearings", "Crane Cab"],
        failureEffect: "Metal fatigue crack.",
        cascadeFailures: ["Ring shatters under heavy load"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:4, z:0}
    });

    const bearingGrp = new THREE.Group();
    const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
    // Create a ring of ball bearings between the inner and outer rings
    for(let i=0; i<30; i++) {
        const theta = (i / 30) * Math.PI * 2;
        const b = new THREE.Mesh(ballGeo, steel);
        b.position.set(Math.cos(theta)*2.6, 0, Math.sin(theta)*2.6);
        bearingGrp.add(b);
    }
    group.add(bearingGrp);
    parts.push({
        name: "Cross-Roller / Ball Bearings",
        description: "Dozens of massive, hardened steel balls or cylindrical rollers.",
        material: "Hardened Steel / Grease",
        function: "Rolls smoothly between the inner and outer rings, transferring immense downward (axial) and tipping (moment) loads with minimal friction.",
        assemblyOrder: 3,
        connections: ["Inner Ring", "Outer Ring"],
        failureEffect: "Bearing spalling (chipping).",
        cascadeFailures: ["Grinding, jamming", "Slew ring seizes"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:8}
    });

    const pinionGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16); // Simple gear representation
    const pinionMesh = new THREE.Mesh(pinionGeo, chrome);
    pinionMesh.position.set(2.4, 0, 0); // Meshes with the inner edge of the outer ring
    // Give it teeth
    pinionMesh.material.wireframe = true;
    group.add(pinionMesh);
    parts.push({
        name: "Slew Drive Pinion Gear",
        description: "Small, incredibly tough gear powered by a hydraulic motor.",
        material: "Hardened Chrome Moly Steel",
        function: "Meshes with the teeth of the outer ring. As the motor turns this tiny gear, it walks the entire massive upper crane in a circle.",
        assemblyOrder: 4,
        connections: ["Hydraulic Motor", "Outer Ring Gear"],
        failureEffect: "Gear tooth strip.",
        cascadeFailures: ["Loss of rotational braking", "Crane swings wildly in the wind"],
        originalPosition: {x:2.4, y:0, z:0},
        explodedPosition: {x:6, y:0, z:0}
    });

    const description = "Civil Crane Slew Ring: The unsung hero of heavy machinery. It is a massive, incredibly strong roller bearing that connects the base of an excavator or crane to the rotating cab. It must simultaneously support the crushing downward weight, the massive tipping leverage of a loaded boom, and allow perfectly smooth 360-degree rotation.";

    const quizQuestions = [
        {
            question: "What are the three massive forces a crane slew ring must handle simultaneously?",
            options: ["Axial load (straight down weight), Radial load (side-to-side sliding), and Moment load (extreme tipping leverage from the long boom)", "Gravity, electromagnetism, and the strong nuclear force", "Heat, cold, and friction", "Lift, drag, and thrust"],
            correct: 0,
            explanation: "A crane picking up a 50-ton load 100 feet away creates a massive 'moment' (leverage) trying to rip the slew ring apart, pulling UP on the back bolts and crushing DOWN on the front bearings.",
            difficulty: "Hard"
        },
        {
            question: "How does the massive upper part of the crane actually spin around?",
            options: ["A hydraulic motor spins a small 'pinion' gear that meshes with a giant ring gear cut directly into the slew ring", "A massive propeller on the back", "Workers push it with ropes", "It drives in a circle"],
            correct: 0,
            explanation: "The inner or outer ring has massive gear teeth machined into it. A small hydraulic pinion gear 'walks' along these teeth, providing massive torque to spin the thousands of tons of steel above.",
            difficulty: "Medium"
        },
        {
            question: "Why is regular, high-pressure grease pumping absolutely critical for a slew ring?",
            options: ["Without grease, the immense pressures will cause the steel bearings to cold-weld to the ring, literally tearing chunks of metal out (galling)", "To keep the crane quiet", "To waterproof it", "To prevent it from spinning too fast"],
            correct: 0,
            explanation: "The contact pressure between the steel balls and the steel race is astronomical. Grease provides a microscopic hydrodynamic film; without it, metal grinds on metal and the bearing is destroyed in hours.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the inner ring and bearings as the crane slews
        if (meshes[1]) meshes[1].rotation.z = time * speed;
        if (meshes[2]) meshes[2].rotation.y = -(time * speed); // Note: bearing group was added with Y up
        
        // Pinion gear spins much faster
        if (meshes[3]) {
            // Position it properly attached to the spinning inner ring
            const angle = time * speed;
            meshes[3].position.set(Math.cos(angle)*2.4, 0, -Math.sin(angle)*2.4);
            meshes[3].rotation.y = time * speed * 10;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTowerCraneSlewRing() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
