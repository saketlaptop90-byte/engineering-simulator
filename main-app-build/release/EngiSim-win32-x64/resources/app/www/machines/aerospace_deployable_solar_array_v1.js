import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonGold = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.1
    });

    const solarPanelMat = new THREE.MeshStandardMaterial({
        color: 0x0a1128,
        emissive: 0x001133,
        emissiveIntensity: 0.2,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false
    });

    // 1. Central Hub (Base)
    const hubGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    group.add(hub);
    meshes.hub = hub;
    parts.push({
        name: "Central Core",
        description: "The main body of the satellite housing control electronics and power distribution.",
        material: "Aluminum",
        function: "Structural support and power management.",
        assemblyOrder: 1,
        connections: ["Deployment Boom"],
        failureEffect: "Complete loss of power routing.",
        cascadeFailures: ["Sensors", "Communication"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. Deployment Boom (Left & Right)
    const boomGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    boomGeo.translate(0, 1, 0); // Pivot at base

    const leftBoom = new THREE.Group();
    const leftBoomMesh = new THREE.Mesh(boomGeo, darkSteel);
    leftBoom.add(leftBoomMesh);
    leftBoom.position.set(-1, 0, 0);
    leftBoom.rotation.z = Math.PI / 2;
    group.add(leftBoom);
    meshes.leftBoom = leftBoom;

    const rightBoom = new THREE.Group();
    const rightBoomMesh = new THREE.Mesh(boomGeo, darkSteel);
    rightBoom.add(rightBoomMesh);
    rightBoom.position.set(1, 0, 0);
    rightBoom.rotation.z = -Math.PI / 2;
    group.add(rightBoom);
    meshes.rightBoom = rightBoom;

    parts.push({
        name: "Deployment Booms",
        description: "Telescopic or hinged booms that distance the solar panels from the main body.",
        material: "Dark Steel / Titanium",
        function: "Provides structural offset to prevent shadowing from the main body.",
        assemblyOrder: 2,
        connections: ["Central Core", "Inner Solar Panel"],
        failureEffect: "Panels may fail to clear the shadow cone.",
        cascadeFailures: ["Power Generation Drop"],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // Solar Panel Geometry
    const panelGeo = new THREE.BoxGeometry(2, 0.1, 4);
    
    // Left Panels
    const leftPanelGroup1 = new THREE.Group();
    leftPanelGroup1.position.set(0, 2, 0); // end of boom
    leftBoom.add(leftPanelGroup1);
    
    const leftPanel1 = new THREE.Mesh(panelGeo, solarPanelMat);
    leftPanel1.position.set(0, 1, 0); // Center of panel
    leftPanelGroup1.add(leftPanel1);
    
    const leftPanelGroup2 = new THREE.Group();
    leftPanelGroup2.position.set(0, 2, 0);
    leftPanelGroup1.add(leftPanelGroup2);
    
    const leftPanel2 = new THREE.Mesh(panelGeo, solarPanelMat);
    leftPanel2.position.set(0, 1, 0);
    leftPanelGroup2.add(leftPanel2);

    // Right Panels
    const rightPanelGroup1 = new THREE.Group();
    rightPanelGroup1.position.set(0, 2, 0);
    rightBoom.add(rightPanelGroup1);

    const rightPanel1 = new THREE.Mesh(panelGeo, solarPanelMat);
    rightPanel1.position.set(0, 1, 0);
    rightPanelGroup1.add(rightPanel1);

    const rightPanelGroup2 = new THREE.Group();
    rightPanelGroup2.position.set(0, 2, 0);
    rightPanelGroup1.add(rightPanelGroup2);

    const rightPanel2 = new THREE.Mesh(panelGeo, solarPanelMat);
    rightPanel2.position.set(0, 1, 0);
    rightPanelGroup2.add(rightPanel2);

    meshes.leftPanelGroup1 = leftPanelGroup1;
    meshes.leftPanelGroup2 = leftPanelGroup2;
    meshes.rightPanelGroup1 = rightPanelGroup1;
    meshes.rightPanelGroup2 = rightPanelGroup2;

    parts.push({
        name: "Inner Solar Panels",
        description: "Primary photovoltaic arrays attached to the booms.",
        material: "Photovoltaic Cells on Honeycomb Substrate",
        function: "Converts solar radiation into electrical power.",
        assemblyOrder: 3,
        connections: ["Deployment Booms", "Hinge Mechanisms"],
        failureEffect: "50% loss of power generation capacity.",
        cascadeFailures: ["Battery Depletion"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    parts.push({
        name: "Outer Foldable Panels",
        description: "Secondary photovoltaic arrays that fold out to extend surface area.",
        material: "Photovoltaic Cells",
        function: "Maximizes surface area for power generation while fitting in launch fairing.",
        assemblyOrder: 4,
        connections: ["Inner Solar Panels"],
        failureEffect: "Incomplete deployment leading to reduced power.",
        cascadeFailures: ["Mission lifespan shortened"],
        originalPosition: { x: 6, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    // Decorative Glowing Nodes
    const nodeGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const node1 = new THREE.Mesh(nodeGeo, neonBlue);
    node1.position.set(0, 1.5, 0);
    hub.add(node1);
    
    const node2 = new THREE.Mesh(nodeGeo, neonGold);
    node2.position.set(0, 2, 0);
    leftBoom.add(node2);
    
    const node3 = new THREE.Mesh(nodeGeo, neonGold);
    node3.position.set(0, 2, 0);
    rightBoom.add(node3);

    const description = "An ultra high-tech Deployable Solar Array used in modern aerospace engineering. It features a central core with telescopic booms and multi-stage folding photovoltaic panels to maximize power generation while maintaining a compact launch profile.";

    const quizQuestions = [
        {
            question: "Why do aerospace solar arrays fold?",
            options: ["To look cool", "To fit within the aerodynamic launch fairing of a rocket", "To avoid space debris", "To reduce weight"],
            correct: 1,
            explanation: "Launch vehicles have strict volume constraints (fairings). Solar arrays must fold up compactly for launch and deploy once in orbit to maximize surface area.",
            difficulty: "Easy"
        },
        {
            question: "What is a common failure mode for deployable structures in space?",
            options: ["Cold welding of hinges", "Rusting", "Melting from solar radiation", "Acoustic damage"],
            correct: 0,
            explanation: "In the vacuum of space, metals in direct contact can fuse together through cold welding, causing hinges and deployment mechanisms to jam.",
            difficulty: "Medium"
        },
        {
            question: "What substrate is commonly used for space-grade solar panels to save weight while maintaining rigidity?",
            options: ["Solid steel", "Aluminum honeycomb", "Plywood", "Solid titanium"],
            correct: 1,
            explanation: "Aluminum honeycomb structures provide an exceptionally high strength-to-weight ratio, which is critical for spacecraft mass constraints.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, explodedState = 0) {
        // time is in seconds, speed is a multiplier
        const t = time * speed;
        
        // Deployment animation sequence (oscillating for demonstration)
        // Fold state: 0 to 1 (0 = folded, 1 = deployed)
        const deployPhase = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1
        
        // 0 = fully folded against boom, Math.PI/2 = fully flat
        const innerPanelAngle = deployPhase * Math.PI/2; 
        meshes.leftPanelGroup1.rotation.z = -Math.PI/2 + innerPanelAngle;
        meshes.rightPanelGroup1.rotation.z = Math.PI/2 - innerPanelAngle;

        // Outer panel folds relative to inner panel
        const outerPanelAngle = deployPhase * Math.PI; 
        meshes.leftPanelGroup2.rotation.z = Math.PI - outerPanelAngle;
        meshes.rightPanelGroup2.rotation.z = -Math.PI + outerPanelAngle;

        // Exploded view logic (pushes parts apart)
        if (meshes.hub) {
            meshes.leftBoom.position.x = -1 - (explodedState * 2);
            meshes.rightBoom.position.x = 1 + (explodedState * 2);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDeployableSolarArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
