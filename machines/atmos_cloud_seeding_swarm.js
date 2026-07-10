import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    
    const glowingWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.0
    });

    const glowingPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2
    });

    // Create the command ship (Mother Drone)
    const commandGeo = new THREE.OctahedronGeometry(5, 1);
    const commandMesh = new THREE.Mesh(commandGeo, darkSteel);
    commandMesh.position.set(0, 10, 0);
    group.add(commandMesh);
    meshes.commandDrone = commandMesh;
    
    const commandCoreGeo = new THREE.SphereGeometry(2, 16, 16);
    const commandCore = new THREE.Mesh(commandCoreGeo, glowingPink);
    commandCore.position.set(0, 10, 0);
    group.add(commandCore);
    meshes.commandCore = commandCore;

    parts.push({
        name: "Command Drone Alpha",
        description: "The primary orchestration node that coordinates the swarm via quantum-encrypted links.",
        material: "Dark Steel / Plasma Core",
        function: "Coordinates flight paths, calculates meteorological dispersal vectors, and issues swarm commands.",
        assemblyOrder: 1,
        connections: ["Swarm Links", "Sensor Array"],
        failureEffect: "Swarm enters autonomous dispersal mode, losing cohesive pattern generation.",
        cascadeFailures: ["Drone Synchronization", "Targeted Seeding"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // Create the swarm drones
    const numDrones = 24;
    const radius = 15;
    const droneGeo = new THREE.TetrahedronGeometry(1.5, 0);
    
    meshes.drones = [];
    meshes.thrusters = [];

    for (let i = 0; i < numDrones; i++) {
        const angle = (i / numDrones) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 10 + Math.sin(i * 0.5) * 5;

        const drone = new THREE.Mesh(droneGeo, chrome);
        drone.position.set(x, y, z);
        drone.rotation.set(Math.random(), Math.random(), Math.random());
        group.add(drone);
        meshes.drones.push({ mesh: drone, baseX: x, baseY: y, baseZ: z, offset: i });

        const thrusterGeo = new THREE.CylinderGeometry(0.5, 0.2, 1);
        const thruster = new THREE.Mesh(thrusterGeo, glowingBlue);
        thruster.position.set(x, y - 1, z);
        group.add(thruster);
        meshes.thrusters.push({ mesh: thruster, parent: drone });

        parts.push({
            name: `Seeding Drone X-${i+1}`,
            description: "Agile payload delivery system equipped with silver iodide micro-dispensers.",
            material: "Chrome / Neon Thrusters",
            function: "Flies into precise atmospheric layers to disperse seeding payloads.",
            assemblyOrder: i + 2,
            connections: ["Command Drone Alpha"],
            failureEffect: `Drone ${i+1} falls out of formation.`,
            cascadeFailures: [],
            originalPosition: { x: x, y: y, z: z },
            explodedPosition: { x: x * 1.5, y: y * 1.5, z: z * 1.5 }
        });
    }

    // Swarm connectivity lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    const linksGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(numDrones * 6); // from command to each drone
    linksGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linksGeo, lineMaterial);
    group.add(lines);
    meshes.links = lines;

    const description = "The Atmos Cloud Seeding Swarm is a state-of-the-art decentralized network of drones designed to manipulate local weather patterns. Directed by the Command Drone Alpha, dozens of agile delivery drones release proprietary condensation nuclei into optimal atmospheric strata to induce precipitation. The swarm operates with military precision, maintaining dynamic geometric formations optimized for atmospheric fluid dynamics.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Command Drone Alpha?",
            options: [
                "To carry the majority of the seeding payload.",
                "To provide physical power to the smaller drones.",
                "To coordinate flight paths and calculate meteorological dispersal vectors.",
                "To capture lightning energy to power the swarm."
            ],
            correct: 2,
            explanation: "The Command Drone Alpha acts as the orchestration node, managing the complex flight paths and dispersal calculations for the entire swarm.",
            difficulty: "easy"
        },
        {
            question: "Why do the seeding drones maintain specific dynamic geometric formations?",
            options: [
                "To intimidate hostile aircraft.",
                "To optimize operations within atmospheric fluid dynamics and ensure even payload dispersal.",
                "To prevent them from colliding with birds.",
                "To reduce the amount of power consumed by their quantum links."
            ],
            correct: 1,
            explanation: "Dynamic geometric formations allow the swarm to adapt to wind currents and atmospheric fluid dynamics, maximizing the efficiency of the seeding process.",
            difficulty: "medium"
        },
        {
            question: "What is the consequence of a failure in the Command Drone Alpha?",
            options: [
                "The entire swarm detonates.",
                "The swarm enters an autonomous, uncoordinated dispersal mode.",
                "The drones immediately return to base.",
                "The seeding payloads are immediately dropped all at once."
            ],
            correct: 1,
            explanation: "Without the Command Drone Alpha, the swarm loses its cohesive pattern generation and reverts to an autonomous, uncoordinated dispersal mode, reducing efficiency.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Use meshes if passed, else fallback to closure meshes
        const m = meshesObj || meshes;
        const t = time * speed;

        if (m.commandDrone) {
            m.commandDrone.rotation.y = t * 0.5;
            m.commandDrone.rotation.x = t * 0.2;
            m.commandDrone.position.y = 10 + Math.sin(t * 2) * 1;
        }

        if (m.commandCore) {
            m.commandCore.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
            m.commandCore.position.copy(m.commandDrone.position);
        }

        const positions = m.links ? m.links.geometry.attributes.position.array : null;

        if (m.drones) {
            for (let i = 0; i < m.drones.length; i++) {
                const droneInfo = m.drones[i];
                const mesh = droneInfo.mesh;
                const offset = droneInfo.offset;
                
                // Orbit around the command drone
                const angle = (offset / m.drones.length) * Math.PI * 2 + t * 0.5;
                const currentRadius = 15 + Math.sin(t * 3 + offset) * 2;
                
                mesh.position.x = Math.cos(angle) * currentRadius;
                mesh.position.z = Math.sin(angle) * currentRadius;
                mesh.position.y = droneInfo.baseY + Math.cos(t * 2 + offset) * 3 + Math.sin(t * 2) * 1;
                
                mesh.rotation.x += 0.05 * speed;
                mesh.rotation.y += 0.07 * speed;

                if (m.thrusters && m.thrusters[i]) {
                    const thruster = m.thrusters[i].mesh;
                    thruster.position.copy(mesh.position);
                    thruster.position.y -= 1;
                    thruster.scale.y = 1 + Math.sin(t * 10 + offset) * 0.5;
                }

                if (positions) {
                    const idx = i * 6;
                    // Start at command drone
                    positions[idx] = m.commandDrone.position.x;
                    positions[idx+1] = m.commandDrone.position.y;
                    positions[idx+2] = m.commandDrone.position.z;
                    // End at drone
                    positions[idx+3] = mesh.position.x;
                    positions[idx+4] = mesh.position.y;
                    positions[idx+5] = mesh.position.z;
                }
            }
        }
        
        if (m.links) {
            m.links.geometry.attributes.position.needsUpdate = true;
            m.links.material.opacity = 0.1 + Math.sin(t * 5) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCloudSeedingSwarm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
