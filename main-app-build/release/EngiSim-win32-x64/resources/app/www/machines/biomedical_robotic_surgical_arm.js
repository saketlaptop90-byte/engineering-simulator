import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x33ff33,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.3
    });

    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base Stand
    const baseGeo = new THREE.CylinderGeometry(1.5, 2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, 0.25, 0);
    group.add(base);
    meshes.base = base;
    parts.push({
        name: "Mounting Base",
        description: "Heavy duty stabilizing base attaching the robotic arm to the operating table or ceiling.",
        material: "Dark Steel",
        function: "Provides absolute stability to prevent micro-tremors during delicate procedures.",
        assemblyOrder: 1,
        connections: ["Main Pillar"],
        failureEffect: "Whole system vibrates out of alignment.",
        cascadeFailures: ["Main Pillar", "Precision Articulation"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Main Pillar (Vertical axis)
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const pillar = new THREE.Mesh(pillarGeo, aluminum);
    pillar.position.set(0, 2.0, 0);
    group.add(pillar);
    meshes.pillar = pillar;
    parts.push({
        name: "Main Pillar",
        description: "Vertical structural support containing primary routing for power and data cables.",
        material: "Aluminum",
        function: "Allows rotational (pan) movement and houses the Z-axis lift mechanism.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Shoulder Joint"],
        failureEffect: "Loss of gross vertical positioning.",
        cascadeFailures: ["Shoulder Joint"],
        originalPosition: { x: 0, y: 2.0, z: 0 },
        explodedPosition: { x: 0, y: 2.0, z: -3 }
    });

    // 3. Shoulder Joint
    const shoulderGeo = new THREE.SphereGeometry(1, 32, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, steel);
    shoulder.position.set(0, 3.5, 0);
    group.add(shoulder);
    meshes.shoulder = shoulder;
    parts.push({
        name: "Shoulder Joint",
        description: "Multi-axis spherical joint providing macro-positioning for the arm.",
        material: "Steel",
        function: "Acts as the primary pivot point for the upper arm assembly.",
        assemblyOrder: 3,
        connections: ["Main Pillar", "Upper Arm"],
        failureEffect: "Arm drops or locks in place.",
        cascadeFailures: ["Upper Arm"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 2, y: 3.5, z: -3 }
    });

    // Glowing shoulder ring
    const shoulderRingGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 64);
    const shoulderRing = new THREE.Mesh(shoulderRingGeo, neonBlue);
    shoulderRing.rotation.x = Math.PI / 2;
    shoulder.add(shoulderRing);

    // 4. Upper Arm
    const upperArmGeo = new THREE.CylinderGeometry(0.5, 0.6, 4, 32);
    const upperArm = new THREE.Mesh(upperArmGeo, chrome);
    upperArm.position.set(0, 5.5, 0);
    group.add(upperArm);
    meshes.upperArm = upperArm;
    parts.push({
        name: "Upper Arm Segment",
        description: "Carbon-fiber reinforced chrome casing holding the secondary drive motors.",
        material: "Chrome",
        function: "Extends reach and transfers mechanical power to the elbow joint.",
        assemblyOrder: 4,
        connections: ["Shoulder Joint", "Elbow Joint"],
        failureEffect: "Restricted range of motion.",
        cascadeFailures: ["Elbow Joint", "Tension Cables"],
        originalPosition: { x: 0, y: 5.5, z: 0 },
        explodedPosition: { x: 4, y: 5.5, z: 0 }
    });

    // 5. Elbow Joint
    const elbowGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, steel);
    elbow.position.set(0, 7.5, 0);
    group.add(elbow);
    meshes.elbow = elbow;
    parts.push({
        name: "Elbow Joint",
        description: "High-torque precision hinge joint.",
        material: "Steel",
        function: "Enables bending and primary approach vector alignment.",
        assemblyOrder: 5,
        connections: ["Upper Arm", "Forearm"],
        failureEffect: "Inability to flex arm.",
        cascadeFailures: ["Forearm"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 5, y: 7.5, z: 2 }
    });

    // 6. Forearm
    const forearmGeo = new THREE.CylinderGeometry(0.4, 0.5, 3.5, 32);
    const forearm = new THREE.Mesh(forearmGeo, chrome);
    forearm.position.set(0, 9.25, 0);
    group.add(forearm);
    meshes.forearm = forearm;
    parts.push({
        name: "Forearm Segment",
        description: "Contains advanced telemetry sensors and micro-tension cable routers.",
        material: "Chrome",
        function: "Bridges macro movements to micro articulation at the wrist.",
        assemblyOrder: 6,
        connections: ["Elbow Joint", "Wrist Articulator"],
        failureEffect: "Loss of positional feedback.",
        cascadeFailures: ["Wrist Articulator"],
        originalPosition: { x: 0, y: 9.25, z: 0 },
        explodedPosition: { x: -4, y: 9.25, z: 2 }
    });

    // 7. Wrist Articulator (Highly articulated)
    const wristGroup = new THREE.Group();
    wristGroup.position.set(0, 11, 0);
    group.add(wristGroup);
    meshes.wrist = wristGroup;
    
    const wristBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
    const wristBase = new THREE.Mesh(wristBaseGeo, steel);
    wristGroup.add(wristBase);
    
    // Tension Cables (Glowing)
    for (let i = 0; i < 4; i++) {
        const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const cable = new THREE.Mesh(cableGeo, neonGreen);
        cable.position.set(Math.cos(i * Math.PI / 2) * 0.3, 0.5, Math.sin(i * Math.PI / 2) * 0.3);
        wristGroup.add(cable);
    }

    const wristBallGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const wristBall = new THREE.Mesh(wristBallGeo, darkSteel);
    wristBall.position.set(0, 1, 0);
    wristGroup.add(wristBall);

    parts.push({
        name: "Wrist Articulator",
        description: "Complex multi-link assembly driven by glowing tension cables for human-like dexterity.",
        material: "Steel / Neon Cables",
        function: "Provides 7 degrees of freedom for intricate surgical maneuvers.",
        assemblyOrder: 7,
        connections: ["Forearm", "End Effector Toolhead"],
        failureEffect: "Loss of fine motor control, freezing instrument in place.",
        cascadeFailures: ["End Effector Toolhead"],
        originalPosition: { x: 0, y: 11, z: 0 },
        explodedPosition: { x: 0, y: 11, z: -4 }
    });

    // 8. Plasma Scalpel (End Effector)
    const scalpelGroup = new THREE.Group();
    scalpelGroup.position.set(0, 1.5, 0);
    wristGroup.add(scalpelGroup);
    meshes.scalpel = scalpelGroup;

    const scalpelBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const scalpelBase = new THREE.Mesh(scalpelBaseGeo, plastic);
    scalpelGroup.add(scalpelBase);

    // Plasma blade
    const bladeGeo = new THREE.CylinderGeometry(0.01, 0.05, 1.5, 16);
    const blade = new THREE.Mesh(bladeGeo, neonRed);
    blade.position.set(0, 1.15, 0);
    scalpelGroup.add(blade);

    // Laser core inside blade
    const coreGeo = new THREE.CylinderGeometry(0.005, 0.02, 1.5, 8);
    const core = new THREE.Mesh(coreGeo, laserMaterial);
    core.position.set(0, 1.15, 0);
    scalpelGroup.add(core);

    parts.push({
        name: "Plasma Scalpel End Effector",
        description: "Advanced surgical instrument projecting a focused plasma beam for cauterizing cuts.",
        material: "Plastic / Neon Red Plasma",
        function: "Performs precise incisions while simultaneously sealing blood vessels.",
        assemblyOrder: 8,
        connections: ["Wrist Articulator"],
        failureEffect: "Beam extinguishes or loses focus, preventing surgery.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12.5, z: 0 },
        explodedPosition: { x: 0, y: 14, z: 0 }
    });

    // 9. Sensory Array (Camera/Lights)
    const sensorGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const sensor = new THREE.Mesh(sensorGeo, aluminum);
    sensor.position.set(0.3, 0.2, 0);
    scalpelGroup.add(sensor);
    
    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 0.35);
    sensor.add(lens);
    
    parts.push({
        name: "Stereoscopic Sensory Array",
        description: "Dual-lens high-definition camera with integrated fiber-optic illumination.",
        material: "Aluminum / Glass",
        function: "Provides 3D visual feedback to the surgeon's console with 10x optical zoom.",
        assemblyOrder: 9,
        connections: ["End Effector Toolhead"],
        failureEffect: "Loss of surgical vision.",
        cascadeFailures: [],
        originalPosition: { x: 0.3, y: 12.7, z: 0 },
        explodedPosition: { x: 3, y: 12.7, z: 0 }
    });

    const description = "The Biomedical Robotic Surgical Arm is a state-of-the-art telemanipulator designed for minimally invasive procedures. It features a glowing tension-cable wrist and a plasma scalpel for sub-millimeter precision.";

    const quizQuestions = [
        {
            question: "What is the primary function of the glowing tension cables in the Wrist Articulator?",
            options: ["To provide lighting for the camera", "To provide 7 degrees of freedom and human-like dexterity", "To cool down the plasma scalpel", "To secure the patient to the table"],
            correct: 1,
            explanation: "The micro-tension cables simulate tendons, allowing the wrist to bend and rotate with greater dexterity than a human hand.",
            difficulty: "Medium"
        },
        {
            question: "Why does the Plasma Scalpel also cauterize while it cuts?",
            options: ["To save electricity", "To make a wider incision", "To seal blood vessels and minimize bleeding instantly", "To sterilize the surrounding air"],
            correct: 2,
            explanation: "Plasma scalpels use high thermal energy to simultaneously sever tissue and coagulate blood, virtually eliminating bleeding during the cut.",
            difficulty: "Easy"
        },
        {
            question: "If the Shoulder Joint fails, what cascade failure is most likely to occur?",
            options: ["The Plasma Scalpel will explode", "The Stereoscopic Sensory Array goes blind", "The Upper Arm drops or loses macro-positioning", "The Base detaches from the floor"],
            correct: 2,
            explanation: "The Shoulder Joint holds up the Upper Arm; its failure results in the subsequent sections dropping or losing their approach vector.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Base panning back and forth
        meshes.base.rotation.y = Math.sin(time * speed * 0.5) * 0.5;
        
        // Shoulder swaying slightly
        meshes.shoulder.rotation.z = Math.sin(time * speed * 0.8) * 0.2;
        
        // Elbow bending
        meshes.elbow.rotation.x = Math.abs(Math.sin(time * speed)) * 0.4;
        
        // Wrist rotating rapidly to show dexterity
        meshes.wrist.rotation.y = time * speed * 2;
        meshes.wrist.rotation.z = Math.sin(time * speed * 3) * 0.3;
        
        // Plasma blade pulsing
        const pulse = (Math.sin(time * speed * 10) + 1) / 2;
        meshes.scalpel.children[1].material.emissiveIntensity = 0.5 + pulse * 1.5;
        meshes.scalpel.children[1].scale.y = 1 + pulse * 0.05;
        meshes.scalpel.children[1].scale.x = 1 + pulse * 0.2;
        meshes.scalpel.children[1].scale.z = 1 + pulse * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRoboticSurgicalArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
