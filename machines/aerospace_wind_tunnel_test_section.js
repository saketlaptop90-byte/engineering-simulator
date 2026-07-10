import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });
    
    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });

    const smokeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xcccccc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.4
    });

    // 1. Chamber Floor
    const floorGeometry = new THREE.BoxGeometry(20, 0.5, 10);
    const floorMesh = new THREE.Mesh(floorGeometry, darkSteel);
    floorMesh.position.set(0, -5, 0);
    group.add(floorMesh);
    parts.push({
        name: "Test Chamber Floor",
        description: "The sturdy base of the wind tunnel test section where models are mounted.",
        material: "Dark Steel",
        function: "Supports the structural integrity of the test section and houses mounting sensors.",
        assemblyOrder: 1,
        connections: ["Chamber Walls", "Model Sting Support"],
        failureEffect: "Structural collapse under aerodynamic load.",
        cascadeFailures: ["Model Sting Support", "Test Model"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Chamber Walls (Glass)
    const wallGeometry = new THREE.BoxGeometry(20, 10, 0.5);
    const backWall = new THREE.Mesh(wallGeometry, glass);
    backWall.position.set(0, 0, -5);
    group.add(backWall);

    const frontWall = new THREE.Mesh(wallGeometry, glass);
    frontWall.position.set(0, 0, 5);
    frontWall.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });
    group.add(frontWall);
    
    const ceilingGeometry = new THREE.BoxGeometry(20, 0.5, 10);
    const ceiling = new THREE.Mesh(ceilingGeometry, darkSteel);
    ceiling.position.set(0, 5, 0);
    group.add(ceiling);

    parts.push({
        name: "Observation Windows & Ceiling",
        description: "Reinforced glass windows and steel ceiling enclosing the test section.",
        material: "Reinforced Glass & Steel",
        function: "Contains the high-speed airflow while allowing optical measurement techniques like PIV or Schlieren imaging.",
        assemblyOrder: 2,
        connections: ["Chamber Floor"],
        failureEffect: "Loss of pressure containment, explosive decompression.",
        cascadeFailures: ["Airflow stability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 3. Model Sting Support
    const stingGeometry = new THREE.CylinderGeometry(0.3, 0.6, 6, 16);
    const stingMesh = new THREE.Mesh(stingGeometry, chrome);
    stingMesh.rotation.z = Math.PI / 2;
    stingMesh.position.set(-4, 0, 0);
    group.add(stingMesh);
    parts.push({
        name: "Sting Support Mount",
        description: "A cantilevered beam holding the scale model in the center of the airstream.",
        material: "Chrome / Aerospace Alloy",
        function: "Holds the model securely while housing internal strain-gauge balances to measure aerodynamic forces.",
        assemblyOrder: 3,
        connections: ["Chamber Floor", "Scale Model"],
        failureEffect: "Model detachment at high speeds.",
        cascadeFailures: ["Scale Model", "Chamber Walls"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    // 4. Scale Model (Fighter Jet abstraction)
    const modelGroup = new THREE.Group();
    
    // Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    fuselageGeo.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, aluminum);
    modelGroup.add(fuselage);
    
    // Nose
    const noseGeo = new THREE.ConeGeometry(0.5, 2, 32);
    noseGeo.rotateZ(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, aluminum);
    nose.position.set(3, 0, 0);
    modelGroup.add(nose);
    
    // Wings
    const wingGeo = new THREE.BoxGeometry(2, 0.1, 4);
    const wings = new THREE.Mesh(wingGeo, aluminum);
    wings.position.set(0, 0, 0);
    modelGroup.add(wings);
    
    // Tail
    const tailGeo = new THREE.BoxGeometry(1, 1.5, 0.1);
    const tail = new THREE.Mesh(tailGeo, aluminum);
    tail.position.set(-1.5, 0.75, 0);
    modelGroup.add(tail);

    modelGroup.position.set(0, 0, 0);
    group.add(modelGroup);

    parts.push({
        name: "Aerospace Scale Model",
        description: "A precision-machined scale model of an aerospace vehicle.",
        material: "Aircraft Aluminum",
        function: "The subject of the test, scaled down to fit the tunnel while maintaining geometric similarity for flow analysis.",
        assemblyOrder: 4,
        connections: ["Sting Support Mount"],
        failureEffect: "Incorrect data collection or structural failure of the model.",
        cascadeFailures: ["Force Balance Sensors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 5. Smoke Wand / Injector
    const wandGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
    const wandMesh = new THREE.Mesh(wandGeo, steel);
    wandMesh.position.set(8, 2, 0);
    group.add(wandMesh);
    parts.push({
        name: "Smoke Injector Wand",
        description: "A traversing mechanism that injects smoke or dye into the airflow.",
        material: "Steel & Neon Emitters",
        function: "Visualizes the streamlines and turbulent wakes around the model.",
        assemblyOrder: 5,
        connections: ["Chamber Roof", "Flow Streamlines"],
        failureEffect: "Loss of flow visualization capabilities.",
        cascadeFailures: [],
        originalPosition: { x: 8, y: 2, z: 0 },
        explodedPosition: { x: 8, y: 12, z: 0 }
    });

    // 6. Flow Streamlines (Animated smoke lines)
    const streamlineGroup = new THREE.Group();
    const numLines = 7;
    for(let i=0; i<numLines; i++) {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(8, 0, (i - 3) * 0.8),
            new THREE.Vector3(2, (i%2 === 0 ? 1 : -1), (i - 3) * 0.8),
            new THREE.Vector3(-8, 0, (i - 3) * 1.5)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, smokeMaterial);
        
        // Emissive flair on streamlines
        if (i === 3) {
            tubeMesh.material = neonBlue;
        } else if (i === 1 || i === 5) {
            tubeMesh.material = neonPink;
        }

        // Save base curve points for animation
        tubeMesh.userData.baseCurve = curve;
        tubeMesh.userData.phaseOffset = i * Math.PI / 3;
        streamlineGroup.add(tubeMesh);
    }
    group.add(streamlineGroup);

    parts.push({
        name: "Flow Streamlines",
        description: "Visible paths of particles suspended in the high-speed airflow.",
        material: "Vapor/Smoke & Neon Tracers",
        function: "Reveals boundary layer separation, vortices, and aerodynamic behavior over the model's surfaces.",
        assemblyOrder: 6,
        connections: ["Smoke Injector Wand"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 }
    });

    // Meshes for animation
    const meshes = {
        modelGroup,
        streamlines: streamlineGroup.children,
        wand: wandMesh
    };

    const description = "The Aerospace Wind Tunnel Test Section is a specialized chamber where precision scale models are subjected to high-speed airflow. It is equipped with advanced sensors and visualization tools to study aerodynamic forces like lift, drag, and turbulent flow separation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the 'Sting Support' in a wind tunnel?",
            options: [
                "To generate high-speed wind",
                "To hold the model and house force-measuring instruments",
                "To inject smoke into the airflow",
                "To control the temperature of the test section"
            ],
            correct: 1,
            explanation: "The sting support cantilevers the model into the airstream and typically houses the internal strain-gauge balance used to measure aerodynamic forces.",
            difficulty: "Medium"
        },
        {
            question: "Why are scale models used instead of full-sized aircraft in most wind tunnels?",
            options: [
                "They are cheaper to paint",
                "To perfectly match the Reynolds number of a full-size plane",
                "Full-sized aircraft cannot fit in typical closed-circuit wind tunnels",
                "Scale models do not require metal parts"
            ],
            correct: 2,
            explanation: "Full-scale wind tunnels exist but are extremely rare and expensive to run. Most testing uses scale models designed to fit the test section while maintaining geometric similarity.",
            difficulty: "Easy"
        },
        {
            question: "What aerodynamic phenomenon is smoke visualization most commonly used to observe?",
            options: [
                "Supersonic shock waves",
                "Flow separation and vortices",
                "Internal engine combustion",
                "The weight of the aircraft"
            ],
            correct: 1,
            explanation: "Smoke or vapor is injected into the airstream to visualize streamlines, helping engineers spot areas of flow separation, turbulent wakes, and wingtip vortices.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Vibrate the model slightly due to "aerodynamic buffeting"
        const vibrationFreq = time * 20 * speed;
        meshes.modelGroup.rotation.z = Math.sin(vibrationFreq) * 0.02 * speed;
        meshes.modelGroup.position.y = Math.cos(vibrationFreq * 1.5) * 0.01 * speed;

        // Animate the streamlines flowing
        meshes.streamlines.forEach((tube, index) => {
            const phase = time * 5 * speed + tube.userData.phaseOffset;
            
            // Rebuild the tube geometry slightly varying the control point to simulate turbulence
            const turbulenceY = Math.sin(phase) * 0.5 * speed;
            const turbulenceZ = Math.cos(phase * 0.8) * 0.2 * speed;
            
            const p0 = tube.userData.baseCurve.v0;
            const p1 = tube.userData.baseCurve.v1.clone().add(new THREE.Vector3(0, turbulenceY, turbulenceZ));
            const p2 = tube.userData.baseCurve.v2;
            
            const newCurve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
            tube.geometry.dispose();
            tube.geometry = new THREE.TubeGeometry(newCurve, 64, 0.08, 8, false);
            
            // Pulse the smoke opacity
            if (tube.material.transparent) {
                tube.material.opacity = 0.4 + (Math.sin(phase * 2) * 0.2);
            }
        });

        // Slowly move the wand up and down
        meshes.wand.position.y = 2 + Math.sin(time * speed) * 1.5;
    }

    return { group, parts, description, quizQuestions, animate };
}
// Auto-generated missing stub
export function createWindTunnelTestSection() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
