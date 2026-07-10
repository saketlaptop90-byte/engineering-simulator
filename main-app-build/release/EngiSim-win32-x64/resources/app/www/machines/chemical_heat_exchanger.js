import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingHot = new THREE.MeshPhysicalMaterial({
        color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 2,
        transparent: true, opacity: 0.8
    });
    const glowingCold = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff, emissive: 0x0022ff, emissiveIntensity: 2,
        transparent: true, opacity: 0.8
    });

    const shellGeo = new THREE.CylinderGeometry(2, 2, 12, 32);
    const shellMesh = new THREE.Mesh(shellGeo, glass);
    shellMesh.rotation.z = Math.PI / 2;
    shellMesh.position.set(0, 2, 0);
    group.add(shellMesh);
    parts.push({
        name: "Outer Shell",
        description: "Heavy steel cylindrical casing (rendered as glass for visibility).",
        material: "Steel (Glass)",
        function: "Contains the shell-side fluid at pressure.",
        assemblyOrder: 1,
        connections: ["Baffles", "Tube Bundle"],
        failureEffect: "External leak.",
        cascadeFailures: ["Environmental hazard", "Pressure loss"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const tubeGrp = new THREE.Group();
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
    for(let i=0; i<15; i++) {
        const t = new THREE.Mesh(tubeGeo, copper);
        t.rotation.z = Math.PI / 2;
        // place randomly inside the radius
        const r = Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        t.position.set(0, Math.sin(theta)*r, Math.cos(theta)*r);
        tubeGrp.add(t);
    }
    tubeGrp.position.set(0, 2, 0);
    group.add(tubeGrp);
    parts.push({
        name: "Copper Tube Bundle",
        description: "Hundreds of small, highly conductive tubes.",
        material: "Copper",
        function: "Carries the tube-side fluid, transferring heat through the thin metal walls.",
        assemblyOrder: 2,
        connections: ["Shell", "Tube Sheets"],
        failureEffect: "Tube rupture.",
        cascadeFailures: ["Cross-contamination of hot and cold fluids"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:2, z:5}
    });

    const baffleGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32, 1, false, 0, Math.PI * 1.5); // cut off part of the circle
    const baffle1 = new THREE.Mesh(baffleGeo, chrome);
    baffle1.rotation.z = Math.PI / 2;
    baffle1.position.set(-3, 2, 0);
    group.add(baffle1);
    
    const baffle2 = new THREE.Mesh(baffleGeo, chrome);
    baffle2.rotation.z = Math.PI / 2;
    baffle2.rotation.y = Math.PI; // flip it
    baffle2.position.set(3, 2, 0);
    group.add(baffle2);
    
    parts.push({
        name: "Shell Baffles",
        description: "Segmented steel plates.",
        material: "Chrome",
        function: "Forces the shell-side fluid to zigzag back and forth across the tubes, increasing turbulence and heat transfer.",
        assemblyOrder: 3,
        connections: ["Shell", "Tube Bundle"],
        failureEffect: "Fluid bypasses the tubes.",
        cascadeFailures: ["Poor thermal efficiency"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:-3, z:0}
    });

    const hotFluidGeo = new THREE.CylinderGeometry(1.8, 1.8, 11, 32);
    const hotFluidMesh = new THREE.Mesh(hotFluidGeo, glowingHot);
    hotFluidMesh.rotation.z = Math.PI / 2;
    hotFluidMesh.position.set(0, 2, 0);
    group.add(hotFluidMesh);
    parts.push({
        name: "Hot Shell-Side Fluid",
        description: "Glowing red hot industrial fluid.",
        material: "Glowing Hot Liquid",
        function: "Zigzags around the outside of the tubes, giving up its heat.",
        assemblyOrder: 4,
        connections: ["Shell", "Baffles"],
        failureEffect: "Fouling.",
        cascadeFailures: ["Insulating layer blocks heat transfer"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:-8, y:2, z:0}
    });

    const coldFluidGeo = new THREE.CylinderGeometry(0.8, 0.8, 13, 32);
    const coldFluidMesh = new THREE.Mesh(coldFluidGeo, glowingCold);
    coldFluidMesh.rotation.z = Math.PI / 2;
    coldFluidMesh.position.set(0, 2, 0);
    group.add(coldFluidMesh);
    parts.push({
        name: "Cold Tube-Side Fluid",
        description: "Glowing blue cold fluid.",
        material: "Glowing Cold Liquid",
        function: "Flows straight through the inside of the copper tubes, absorbing the heat.",
        assemblyOrder: 5,
        connections: ["Tubes"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:8, y:2, z:0}
    });

    const description = "Shell and Tube Heat Exchanger: The most common industrial heat exchanger. One fluid flows through a bundle of conductive tubes, while a second fluid at a different temperature flows over the outside of the tubes inside a large shell, transferring massive amounts of heat without the fluids ever mixing.";

    const quizQuestions = [
        {
            question: "What is the purpose of the baffles inside the shell?",
            options: ["To force the shell-side fluid to zigzag, creating turbulence and maximizing contact with the tubes", "To keep the tubes perfectly straight", "To filter out solid dirt", "To separate the hot fluid from the cold fluid"],
            correct: 0,
            explanation: "Baffles force the fluid to flow perpendicular to the tubes in a zigzag pattern, breaking up stagnant boundary layers and drastically improving the rate of heat transfer.",
            difficulty: "Medium"
        },
        {
            question: "Why do the two fluids never mix in a heat exchanger?",
            options: ["They are separated by the solid metal walls of the tubes", "They are inherently repelled by each other", "They mix momentarily but are separated by a centrifuge", "A magnetic field keeps them apart"],
            correct: 0,
            explanation: "The magic of a heat exchanger is that heat conducts directly through the thin metal walls of the tubes, transferring thermal energy while keeping the two chemical streams completely isolated.",
            difficulty: "Easy"
        },
        {
            question: "Which flow arrangement provides the highest thermal efficiency?",
            options: ["Counter-current flow (fluids flow in opposite directions)", "Co-current flow (fluids flow in the same direction)", "Cross flow (fluids flow at exactly 90 degrees)", "Random flow"],
            correct: 0,
            explanation: "Counter-current flow maintains the highest temperature difference (driving force) between the two fluids across the entire length of the exchanger.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate hot and cold to show flow
        if (meshes[3]) meshes[3].material.emissiveIntensity = 2 + Math.sin(time * speed * 4);
        if (meshes[4]) meshes[4].material.emissiveIntensity = 2 + Math.cos(time * speed * 4);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPlateHeatExchanger() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
