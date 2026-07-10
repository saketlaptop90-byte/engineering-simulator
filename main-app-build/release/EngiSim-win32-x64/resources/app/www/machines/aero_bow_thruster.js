import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.9,
        metalness: 0.5,
        roughness: 0.3
    });

    // 1. Thruster Tunnel
    const tunnelGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32, 1, true);
    const tunnel = new THREE.Mesh(tunnelGeo, darkSteel);
    tunnel.rotation.z = Math.PI / 2;
    group.add(tunnel);
    meshes.tunnel = tunnel;
    
    parts.push({
        name: "Thruster Tunnel",
        description: "Reinforced transverse tube integrated directly into the vessel's bow.",
        material: "Dark Steel / Composite",
        function: "Channels water flow laterally through the hull.",
        assemblyOrder: 1,
        connections: ["Hull", "Gearbox Pod"],
        failureEffect: "Structural weakness and potential water ingress.",
        cascadeFailures: ["Vessel Flooding", "Hydrodynamic Drag"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Main Drive Motor
    const motorGroup = new THREE.Group();
    const motorHousingGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 32);
    const motorHousing = new THREE.Mesh(motorHousingGeo, chrome);
    motorHousing.position.y = 3.5;
    motorGroup.add(motorHousing);

    // Neon rings on motor
    const ringGeo = new THREE.TorusGeometry(1.55, 0.05, 16, 64);
    const ring1 = new THREE.Mesh(ringGeo, neonCyan);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 4;
    motorGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, neonCyan);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 3;
    motorGroup.add(ring2);

    group.add(motorGroup);
    meshes.motor = motorGroup;

    parts.push({
        name: "Main Drive Motor",
        description: "High-torque electric or hydraulic motor providing massive rotational force.",
        material: "Chrome / Superconducting Coils",
        function: "Generates rotational kinetic energy.",
        assemblyOrder: 2,
        connections: ["Drive Shaft", "Power Grid"],
        failureEffect: "Complete loss of thrust capability.",
        cascadeFailures: ["Loss of maneuverability", "Docking hazards"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 3. Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.y = 1.5;
    group.add(shaft);
    meshes.shaft = shaft;

    parts.push({
        name: "Vertical Drive Shaft",
        description: "High-tensile steel rod transmitting power downwards.",
        material: "High-tensile Steel",
        function: "Transfers torque from the motor to the lower gearbox.",
        assemblyOrder: 3,
        connections: ["Main Drive Motor", "Gearbox Pod"],
        failureEffect: "Motor spins freely with no thrust produced.",
        cascadeFailures: ["Gearbox damage", "Motor overspeed"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 4. Gearbox Pod
    const podGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const pod = new THREE.Mesh(podGeo, aluminum);
    pod.scale.set(1, 0.8, 1);
    group.add(pod);
    meshes.pod = pod;

    parts.push({
        name: "Gearbox Pod",
        description: "Hydrodynamic lower housing for bevel gears.",
        material: "Aluminum Alloy",
        function: "Translates vertical rotation to horizontal rotation.",
        assemblyOrder: 4,
        connections: ["Vertical Drive Shaft", "Port Impeller", "Starboard Impeller"],
        failureEffect: "Grinding noise, loss of transmission.",
        cascadeFailures: ["Bearing seizure", "Shaft shearing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    // 5. Impellers
    const createImpeller = (colorMaterial, isPort) => {
        const impellerGroup = new THREE.Group();
        const hubGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.z = Math.PI / 2;
        impellerGroup.add(hub);

        for(let i=0; i<5; i++) {
            const bladeGeo = new THREE.BoxGeometry(0.1, 1.8, 0.5);
            const blade = new THREE.Mesh(bladeGeo, colorMaterial);
            blade.position.y = 1;
            
            const pivot = new THREE.Group();
            pivot.rotation.x = (i * Math.PI * 2) / 5; // 5 blades
            
            // Blade pitch
            blade.rotation.y = isPort ? 0.4 : -0.4;
            
            pivot.add(blade);
            impellerGroup.add(pivot);
        }
        return impellerGroup;
    };

    const portImpeller = createImpeller(neonOrange, true);
    portImpeller.position.x = -1.2;
    group.add(portImpeller);
    meshes.portImpeller = portImpeller;

    parts.push({
        name: "Port Impeller",
        description: "Five-blade precision engineered propeller.",
        material: "Bronze / Neon Coating",
        function: "Accelerates water mass to create lateral thrust.",
        assemblyOrder: 5,
        connections: ["Gearbox Pod"],
        failureEffect: "Reduced thrust and cavitation.",
        cascadeFailures: ["Vibration damage", "Tunnel erosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 }
    });

    const stbdImpeller = createImpeller(neonOrange, false);
    stbdImpeller.position.x = 1.2;
    group.add(stbdImpeller);
    meshes.stbdImpeller = stbdImpeller;

    parts.push({
        name: "Starboard Impeller",
        description: "Counter-rotating five-blade propeller.",
        material: "Bronze / Neon Coating",
        function: "Cancels out rotational torque while maximizing lateral force.",
        assemblyOrder: 6,
        connections: ["Gearbox Pod"],
        failureEffect: "Thrust asymmetry.",
        cascadeFailures: ["Gearbox wear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 }
    });

    // Description
    const description = "The Aero/Marine Bow Thruster is an ultra high-tech lateral propulsion unit. Situated in the bow of heavy vessels, it allows for extreme precision docking and low-speed maneuvers. It features dual counter-rotating impellers coated in glowing, cavitation-resistant neon alloys, and a chrome-housed superconducting drive motor.";

    // Quizzes
    const quizQuestions = [
        {
            question: "What is the main purpose of counter-rotating impellers in a bow thruster?",
            options: [
                "To decrease the motor's power consumption",
                "To cancel rotational torque and maximize linear thrust",
                "To allow the ship to move faster forwards",
                "To cool the gearbox pod more effectively"
            ],
            correct: 1,
            explanation: "Counter-rotating impellers eliminate the 'swirl' effect in the water jet, directing more energy into pure lateral thrust.",
            difficulty: "medium"
        },
        {
            question: "Which component bridges the power gap between the Drive Motor and the Gearbox Pod?",
            options: [
                "The Thruster Tunnel",
                "The Port Impeller",
                "The Vertical Drive Shaft",
                "The Neon Rings"
            ],
            correct: 2,
            explanation: "The Vertical Drive Shaft transmits rotational energy (torque) downwards from the motor to the gears.",
            difficulty: "easy"
        },
        {
            question: "What happens if the Impellers suffer cavitation damage?",
            options: [
                "The thruster produces more power",
                "The motor completely stops",
                "Reduced thrust and potentially severe vibrations",
                "The thruster tunnel shrinks"
            ],
            correct: 2,
            explanation: "Cavitation pits the blades, reducing hydrodynamic efficiency (thrust) and causing imbalances that lead to vibrations.",
            difficulty: "hard"
        }
    ];

    // Animation
    function animate(time, speed, passedMeshes) {
        const m = passedMeshes || meshes;
        if (!m.shaft) return;
        
        const rotationSpeed = time * speed * 15;
        
        m.shaft.rotation.y = rotationSpeed;
        m.portImpeller.rotation.x = rotationSpeed;
        m.stbdImpeller.rotation.x = -rotationSpeed; // Counter-rotating
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createShipBowThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
