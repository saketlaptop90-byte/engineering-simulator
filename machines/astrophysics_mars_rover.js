import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing/Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const solarPanelMat = new THREE.MeshStandardMaterial({
        color: 0x0a1128,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: true // stylized tech look
    });

    // 1. Main Chassis (WEB)
    const chassisGeo = new THREE.BoxGeometry(4, 1.5, 6);
    const chassisMesh = new THREE.Mesh(chassisGeo, aluminum);
    chassisMesh.position.set(0, 2, 0);
    group.add(chassisMesh);
    parts.push({
        name: 'Main Chassis',
        description: 'Houses the central computer and sensitive instruments in a temperature-controlled environment.',
        material: 'Aluminum Space-grade Alloy',
        function: 'Protects critical electronics from Martian extreme temperatures and radiation.',
        assemblyOrder: 1,
        connections: ['Rocker-Bogie Suspension', 'Mast Assembly', 'RTG Power Source'],
        failureEffect: 'Loss of thermal control, total system failure.',
        cascadeFailures: ['Computer malfunction', 'Battery degradation'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: chassisMesh
    });

    // 2. RTG (Radioisotope Thermoelectric Generator) Power Source
    const rtgGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const rtgMesh = new THREE.Mesh(rtgGeo, darkSteel);
    rtgMesh.rotation.z = Math.PI / 2;
    rtgMesh.position.set(0, 2.5, -2.5);
    
    // RTG Glow fins
    const rtgFinsGeo = new THREE.CylinderGeometry(1, 1, 1.5, 8, 1, false);
    const rtgFinsMesh = new THREE.Mesh(rtgFinsGeo, neonOrange);
    rtgFinsMesh.rotation.z = Math.PI / 2;
    rtgMesh.add(rtgFinsMesh);
    
    group.add(rtgMesh);
    parts.push({
        name: 'RTG Power Source',
        description: 'Radioisotope Thermoelectric Generator using Plutonium-238 decay to generate electricity and heat.',
        material: 'Dark Steel & Ceramic',
        function: 'Provides steady electrical power and thermal management independently of sunlight.',
        assemblyOrder: 2,
        connections: ['Main Chassis'],
        failureEffect: 'Loss of power and heat.',
        cascadeFailures: ['Freezing of chassis electronics', 'Communication blackout'],
        originalPosition: { x: 0, y: 2.5, z: -2.5 },
        explodedPosition: { x: 0, y: 4, z: -6 },
        mesh: rtgMesh
    });

    // 3. Mast Assembly (Head)
    const mastGeo = new THREE.CylinderGeometry(0.15, 0.2, 3, 16);
    const mastMesh = new THREE.Mesh(mastGeo, chrome);
    mastMesh.position.set(1.5, 4, 2);
    
    const headGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    const headMesh = new THREE.Mesh(headGeo, steel);
    headMesh.position.set(0, 1.5, 0);
    
    const eyeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    const eye1 = new THREE.Mesh(eyeGeo, glass);
    eye1.rotation.x = Math.PI / 2;
    eye1.position.set(0.3, 0, 0.4);
    const eye2 = new THREE.Mesh(eyeGeo, glass);
    eye2.rotation.x = Math.PI / 2;
    eye2.position.set(-0.3, 0, 0.4);
    
    headMesh.add(eye1);
    headMesh.add(eye2);
    mastMesh.add(headMesh);
    
    group.add(mastMesh);
    parts.push({
        name: 'Mast Assembly & SuperCam',
        description: 'The "head" and "neck" of the rover, housing the main cameras and laser spectrometer.',
        material: 'Chrome & Glass',
        function: 'Provides stereoscopic vision and chemical analysis of rocks at a distance.',
        assemblyOrder: 3,
        connections: ['Main Chassis'],
        failureEffect: 'Loss of navigation vision and remote science capabilities.',
        cascadeFailures: ['Inability to drive autonomously', 'Target selection failure'],
        originalPosition: { x: 1.5, y: 4, z: 2 },
        explodedPosition: { x: 3, y: 8, z: 4 },
        mesh: mastMesh
    });

    // SUSPENSION & WHEELS (Rocker-Bogie System)
    const wheels = [];
    const suspensionLinks = [];

    const createWheel = (x, y, z, name) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);
        
        // Wheel hub
        const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);
        
        // Wheel tire
        const tireGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);
        const tire = new THREE.Mesh(tireGeo, aluminum);
        tire.rotation.z = Math.PI / 2;
        
        // Cleats/treads
        const treadGeo = new THREE.TorusGeometry(0.81, 0.05, 8, 32);
        const tread1 = new THREE.Mesh(treadGeo, neonBlue);
        tread1.rotation.y = Math.PI / 2;
        const tread2 = new THREE.Mesh(treadGeo, neonBlue);
        tread2.rotation.y = Math.PI / 2;
        tread2.rotation.x = Math.PI / 8;
        tire.add(tread1);
        tire.add(tread2);
        
        wheelGroup.add(tire);
        group.add(wheelGroup);
        
        parts.push({
            name: `Wheel (${name})`,
            description: 'Machined aluminum wheel with titanium cleats for traction on sandy Martian terrain.',
            material: 'Aluminum & Neon Composite',
            function: 'Locomotion and weight distribution over soft soil.',
            assemblyOrder: 4,
            connections: ['Suspension Link'],
            failureEffect: 'Reduced mobility, potential getting stuck in sand.',
            cascadeFailures: ['Increased strain on other wheels'],
            originalPosition: { x, y, z },
            explodedPosition: { x: x * 2.5, y: y, z: z * 2.5 },
            mesh: wheelGroup
        });
        
        wheels.push(wheelGroup);
        return wheelGroup;
    };

    // Left Side Wheels
    const flWheel = createWheel(-2.5, 0.8, 3, 'Front Left');
    const mlWheel = createWheel(-2.5, 0.8, 0, 'Middle Left');
    const blWheel = createWheel(-2.5, 0.8, -3, 'Back Left');

    // Right Side Wheels
    const frWheel = createWheel(2.5, 0.8, 3, 'Front Right');
    const mrWheel = createWheel(2.5, 0.8, 0, 'Middle Right');
    const brWheel = createWheel(2.5, 0.8, -3, 'Back Right');

    // Suspension Linkages (Simplified visually but glowing)
    const createSuspension = (x, rotY, isLeft) => {
        const suspGroup = new THREE.Group();
        suspGroup.position.set(x, 2, 0);
        
        // Main Rocker
        const rockerGeo = new THREE.BoxGeometry(0.3, 0.3, 4);
        const rocker = new THREE.Mesh(rockerGeo, neonBlue);
        rocker.rotation.x = -Math.PI / 8;
        rocker.position.set(0, 0, 1);
        suspGroup.add(rocker);
        
        // Bogie Pivot
        const bogieGeo = new THREE.BoxGeometry(0.3, 0.3, 3.5);
        const bogie = new THREE.Mesh(bogieGeo, neonOrange);
        bogie.position.set(0, -1, -1.5);
        bogie.rotation.x = Math.PI / 16;
        suspGroup.add(bogie);
        
        // Vertical struts to wheels
        const strutGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const strut1 = new THREE.Mesh(strutGeo, steel);
        strut1.position.set(0, -0.8, 3); // Front
        rocker.add(strut1);
        
        const strut2 = new THREE.Mesh(strutGeo, steel);
        strut2.position.set(0, -0.5, 1.5); // Mid
        bogie.add(strut2);
        
        const strut3 = new THREE.Mesh(strutGeo, steel);
        strut3.position.set(0, -0.5, -1.5); // Back
        bogie.add(strut3);
        
        suspGroup.rotation.y = rotY;
        group.add(suspGroup);
        suspensionLinks.push(suspGroup);
        
        parts.push({
            name: `Rocker-Bogie Suspension (${isLeft ? 'Left' : 'Right'})`,
            description: 'Patented kinematic suspension system allowing wheels to climb over obstacles while keeping chassis level.',
            material: 'Neon Infused Titanium',
            function: 'Maintains stability, preventing flipping while crossing uneven terrain.',
            assemblyOrder: 5,
            connections: ['Wheels', 'Main Chassis'],
            failureEffect: 'Loss of terrain adaptation.',
            cascadeFailures: ['Rollover event', 'Chassis impact damage'],
            originalPosition: { x, y: 2, z: 0 },
            explodedPosition: { x: isLeft ? -5 : 5, y: 3, z: 0 },
            mesh: suspGroup
        });
    };

    createSuspension(-2.2, 0, true);
    createSuspension(2.2, Math.PI, false);

    // 4. Robotic Arm
    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const arm = new THREE.Mesh(armGeo, steel);
    arm.position.set(0, 2.5, 3.5);
    arm.rotation.x = Math.PI / 4;
    
    // Turret at end
    const turretGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const turret = new THREE.Mesh(turretGeo, copper);
    turret.rotation.x = Math.PI / 2;
    turret.position.set(0, 1.5, 0);
    arm.add(turret);

    group.add(arm);
    parts.push({
        name: 'Robotic Arm & Science Turret',
        description: 'Multi-jointed arm carrying the PIXL and SHERLOC instruments, and a rock drill.',
        material: 'Steel & Copper',
        function: 'Drills rock samples and performs close-up geochemical analysis.',
        assemblyOrder: 6,
        connections: ['Main Chassis'],
        failureEffect: 'Inability to collect core samples.',
        cascadeFailures: ['Mission objective failure (sample return)'],
        originalPosition: { x: 0, y: 2.5, z: 3.5 },
        explodedPosition: { x: 0, y: 5, z: 8 },
        mesh: arm
    });


    const description = "The Astrophysics Mars Rover features a state-of-the-art Rocker-Bogie suspension system, allowing it to traverse obstacles twice the diameter of its wheels without losing stability. Powered by an RTG, this autonomous laboratory searches for signs of ancient microbial life and caches rock samples for future return missions.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of the Rocker-Bogie suspension system?",
            options: [
                "It allows the rover to move at high speeds.",
                "It reduces the weight of the vehicle.",
                "It minimizes the tilt of the chassis when traversing large obstacles.",
                "It acts as a primary braking mechanism."
            ],
            correct: 2,
            explanation: "The rocker-bogie mechanism distributes weight evenly across all six wheels, cutting the chassis tilt in half compared to the movement of a wheel over an obstacle.",
            difficulty: "Medium"
        },
        {
            question: "Why does the rover use an RTG (Radioisotope Thermoelectric Generator) instead of solar panels?",
            options: [
                "RTGs are much lighter than solar panels.",
                "Solar panels don't work on Mars at all.",
                "RTGs provide continuous power regardless of dust storms or nighttime, and generate waste heat to keep electronics warm.",
                "RTGs are cheaper to manufacture."
            ],
            correct: 2,
            explanation: "Mars is prone to massive dust storms that can block sunlight for weeks. An RTG ensures constant electrical power and crucial thermal regulation.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Mast Assembly?",
            options: [
                "To drill into rocks.",
                "To act as an antenna for direct Earth communication.",
                "To provide high-vantage stereoscopic vision and remote spectrometry.",
                "To deploy the parachute during landing."
            ],
            correct: 2,
            explanation: "The mast acts as the rover's 'head', carrying cameras (like Mastcam-Z) and lasers (like SuperCam) to analyze terrain and targets from a distance.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Find specific components in meshes
        const armMesh = meshes.find(m => m.name === 'Robotic Arm & Science Turret')?.mesh;
        const mastMesh = meshes.find(m => m.name === 'Mast Assembly & SuperCam')?.mesh;
        
        // Find wheels
        const allWheels = meshes.filter(m => m.name.includes('Wheel'));
        
        // Find suspension
        const susp = meshes.filter(m => m.name.includes('Suspension'));

        // Animation: Driving forward
        allWheels.forEach(w => {
            if (w.mesh) {
                // Wheels roll
                w.mesh.children.forEach(child => {
                    child.rotation.x += 0.05 * speed;
                });
                
                // Add tiny vertical bounce to simulate terrain
                const baseHeight = w.originalPosition.y;
                w.mesh.position.y = baseHeight + Math.sin(time * 0.005 * speed + w.originalPosition.z) * 0.1;
            }
        });

        // Suspension flexing based on wheel bounce
        susp.forEach((s, idx) => {
            if (s.mesh) {
                // Phase shifted by side
                const phase = idx === 0 ? 0 : Math.PI;
                s.mesh.rotation.x = Math.sin(time * 0.002 * speed + phase) * 0.05;
            }
        });

        // Mast scanning (looking around)
        if (mastMesh) {
            mastMesh.rotation.y = Math.sin(time * 0.001 * speed) * 0.5;
            mastMesh.children[0].rotation.x = Math.sin(time * 0.0015 * speed) * 0.2; // Head tilt
        }

        // Arm deploying
        if (armMesh) {
            armMesh.rotation.z = Math.sin(time * 0.0008 * speed) * 0.3;
        }
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createMarsRover() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
