import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing material for shockwaves and high temperature zones
    const shockwaveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        side: THREE.DoubleSide
    });

    const highTempMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.5,
        roughness: 0.4,
        metalness: 0.8
    });

    const airflowMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });

    // 1. Forebody/Compression Ramp
    const rampGeometry = new THREE.BoxGeometry(10, 2, 4);
    // Bevel the ramp
    const positionAttribute = rampGeometry.attributes.position;
    for ( let i = 0; i < positionAttribute.count; i ++ ) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        if (x > 0 && y > 0) {
            positionAttribute.setY(i, y - (x / 5)); // Slope downwards towards the front
        }
    }
    rampGeometry.computeVertexNormals();

    const rampMesh = new THREE.Mesh(rampGeometry, darkSteel);
    rampMesh.position.set(-5, 0, 0);
    group.add(rampMesh);
    meshes.ramp = rampMesh;

    parts.push({
        name: "Compression Ramp",
        description: "The external forebody ramp that provides initial compression of the supersonic airflow via oblique shock waves.",
        material: "Dark Steel",
        function: "Compresses incoming hypersonic air before it enters the isolator, slowing it down slightly while increasing pressure and temperature.",
        assemblyOrder: 1,
        connections: ["Isolator", "Cowl Lip"],
        failureEffect: "Inadequate compression leading to engine unstart or severe performance loss.",
        cascadeFailures: ["Isolator Boundary Layer Separation", "Combustion Blowout"],
        originalPosition: {x: -5, y: 0, z: 0},
        explodedPosition: {x: -10, y: 5, z: 0}
    });

    // 2. Cowl Lip
    const cowlGeometry = new THREE.BoxGeometry(0.5, 0.5, 4);
    const cowlMesh = new THREE.Mesh(cowlGeometry, chrome);
    cowlMesh.position.set(0, 1.5, 0);
    group.add(cowlMesh);
    meshes.cowl = cowlMesh;

    parts.push({
        name: "Cowl Lip",
        description: "The leading edge of the engine inlet designed to capture the compressed air.",
        material: "Chrome / Thermal Alloy",
        function: "Captures the shock-compressed airflow and directs it into the isolator. Must withstand extreme aerodynamic heating.",
        assemblyOrder: 2,
        connections: ["Compression Ramp", "Isolator"],
        failureEffect: "Thermal melting or shock wave detachment causing flow spillage.",
        cascadeFailures: ["Structural Failure", "Engine Unstart"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0}
    });

    // 3. Isolator (Duct)
    const isolatorGeometry = new THREE.BoxGeometry(6, 1.5, 3.8);
    const isolatorMesh = new THREE.Mesh(isolatorGeometry, steel);
    isolatorMesh.position.set(3, 0.5, 0);
    group.add(isolatorMesh);
    meshes.isolator = isolatorMesh;

    parts.push({
        name: "Isolator Section",
        description: "A constant-area duct between the inlet and combustor.",
        material: "Steel / High-Temp Alloy",
        function: "Accommodates the shock train to prevent combustor pressure rise from causing inlet unstart.",
        assemblyOrder: 3,
        connections: ["Cowl Lip", "Combustor"],
        failureEffect: "Shock train expelled out the front (Unstart).",
        cascadeFailures: ["Loss of Thrust", "Vehicle Destabilization"],
        originalPosition: {x: 3, y: 0.5, z: 0},
        explodedPosition: {x: 3, y: -5, z: 0}
    });

    // 4. Oblique Shock Waves (Visual Representation)
    const shock1Geo = new THREE.PlaneGeometry(8, 4);
    const shock1Mesh = new THREE.Mesh(shock1Geo, shockwaveMaterial);
    shock1Mesh.rotation.x = Math.PI / 2;
    shock1Mesh.rotation.y = -Math.PI / 8;
    shock1Mesh.position.set(-3, 0.8, 0);
    group.add(shock1Mesh);
    meshes.shock1 = shock1Mesh;

    const shock2Geo = new THREE.PlaneGeometry(5, 4);
    const shock2Mesh = new THREE.Mesh(shock2Geo, shockwaveMaterial);
    shock2Mesh.rotation.x = Math.PI / 2;
    shock2Mesh.rotation.y = Math.PI / 6;
    shock2Mesh.position.set(1, 1.2, 0);
    group.add(shock2Mesh);
    meshes.shock2 = shock2Mesh;

    parts.push({
        name: "Oblique Shock Waves",
        description: "Visual representation of the pressure waves created by supersonic flow deflection.",
        material: "Plasma/Energy (Visual)",
        function: "Increases static pressure and temperature while decreasing Mach number (though flow remains supersonic).",
        assemblyOrder: 4,
        connections: [],
        failureEffect: "Normal shock formation leading to subsonic flow (scramjet failure).",
        cascadeFailures: ["Thermal Choking"],
        originalPosition: {x: -3, y: 0.8, z: 0},
        explodedPosition: {x: -3, y: 0.8, z: 5}
    });

    // 5. High Temperature Combustion Zone Entrance
    const combustorGeo = new THREE.BoxGeometry(2, 1.5, 3.8);
    const combustorMesh = new THREE.Mesh(combustorGeo, highTempMaterial);
    combustorMesh.position.set(7, 0.5, 0);
    group.add(combustorMesh);
    meshes.combustor = combustorMesh;

    parts.push({
        name: "Combustor Entry",
        description: "The zone where fuel is injected into the supersonic airflow.",
        material: "Advanced Ceramics",
        function: "Maintains supersonic combustion, converting chemical energy to kinetic energy.",
        assemblyOrder: 5,
        connections: ["Isolator", "Nozzle"],
        failureEffect: "Flameout or Thermal Choking.",
        cascadeFailures: ["Engine Failure"],
        originalPosition: {x: 7, y: 0.5, z: 0},
        explodedPosition: {x: 12, y: 0.5, z: 0}
    });

    // 6. Airflow Particles
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i < particleCount * 3; i+=3) {
        posArray[i] = -10 + Math.random() * 20; // x
        posArray[i+1] = Math.random() * 3;     // y
        posArray[i+2] = -2 + Math.random() * 4; // z
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    group.add(particleSystem);
    meshes.particles = particleSystem;

    const description = "The scramjet (supersonic-combusting ramjet) intake is a critical system designed to capture and compress hypersonic air using a series of oblique shock waves. Unlike turbojets, it has no moving parts in the compression phase, relying entirely on the vehicle's forward velocity and geometric shaping. The intake slows the air from hypersonic speeds (e.g., Mach 6+) to lower supersonic speeds, raising its pressure and temperature enough to sustain combustion in the isolator/combustor section without slowing the air to subsonic speeds.";

    const quizQuestions = [
        {
            question: "What is the primary function of the compression ramp in a scramjet intake?",
            options: [
                "To cool the incoming air",
                "To generate oblique shock waves that compress incoming supersonic air",
                "To slow the air down to subsonic speeds",
                "To inject fuel into the airflow"
            ],
            correct: 1,
            explanation: "The compression ramp deflects the hypersonic airflow, creating oblique shock waves. These shock waves progressively compress the air, increasing its pressure and temperature while maintaining supersonic velocity.",
            difficulty: "Medium"
        },
        {
            question: "Why does a scramjet need an 'Isolator' section between the inlet and combustor?",
            options: [
                "To isolate the fuel from the heat",
                "To provide structural support to the wings",
                "To contain the pre-combustion shock train and prevent inlet unstart",
                "To completely stop the airflow before combustion"
            ],
            correct: 2,
            explanation: "The isolator is a constant-area duct that contains the shock train caused by the high pressure of combustion. It prevents this back-pressure from travelling upstream and unstarting the inlet.",
            difficulty: "Hard"
        },
        {
            question: "Unlike a conventional ramjet, what happens to the airflow velocity inside a scramjet's combustion chamber?",
            options: [
                "It remains supersonic",
                "It becomes subsonic",
                "It reverses direction",
                "It comes to a complete halt"
            ],
            correct: 0,
            explanation: "Scramjet stands for Supersonic Combusting Ramjet. The key difference from a standard ramjet is that the air flowing through the combustion chamber remains at supersonic speeds.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Animate particles flowing through the engine
        if (meshesObj.particles) {
            const positions = meshesObj.particles.geometry.attributes.position.array;
            for(let i=0; i < positions.length; i+=3) {
                positions[i] += 0.5 * speed; // move +x direction
                
                // Reset particle to front if it passes the back
                if (positions[i] > 10) {
                    positions[i] = -10;
                    positions[i+1] = Math.random() * 3;
                    positions[i+2] = -2 + Math.random() * 4;
                }

                // Compress airflow visually (move closer to y=1) when passing ramp/shock
                if (positions[i] > -5 && positions[i] < 0) {
                    positions[i+1] += (1.0 - positions[i+1]) * 0.1 * speed;
                }
            }
            meshesObj.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Pulse the shockwaves
        if (meshesObj.shock1) {
            meshesObj.shock1.material.opacity = 0.3 + Math.sin(time * 5 * speed) * 0.1;
        }
        if (meshesObj.shock2) {
            meshesObj.shock2.material.opacity = 0.3 + Math.cos(time * 5 * speed) * 0.1;
        }
        
        // Heat glow on the combustor
        if (meshesObj.combustor) {
            meshesObj.combustor.material.emissiveIntensity = 1.5 + Math.sin(time * 10 * speed) * 0.5;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createScramjetIntake() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
