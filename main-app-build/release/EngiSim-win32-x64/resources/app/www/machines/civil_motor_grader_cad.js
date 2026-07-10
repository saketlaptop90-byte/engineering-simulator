import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const graderYellow = new THREE.MeshPhysicalMaterial({ color: 0xFDB813, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Articulated Moldboard (Blade)
    // ==========================================
    // Extruded curved steel blade (Moldboard)
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.5);
    bladeShape.quadraticCurveTo(0.2, 0, 0, 0.5);
    bladeShape.lineTo(0.05, 0.5);
    bladeShape.quadraticCurveTo(0.25, 0, 0.05, -0.5);
    bladeShape.lineTo(0, -0.5);

    const bladeSettings = { depth: 3.0, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeSettings);
    
    const moldboard = new THREE.Mesh(bladeGeo, machinedSteel);
    moldboard.position.set(0, 0, -1.5); // Center extrusion
    
    // The slewing circle that rotates the blade
    const circlePoints = [
        new THREE.Vector2(0, 0.05), new THREE.Vector2(0.8, 0.05),
        new THREE.Vector2(0.8, -0.05), new THREE.Vector2(0, -0.05)
    ];
    const circleGeo = new THREE.LatheGeometry(circlePoints, 64);
    const slewingCircle = new THREE.Mesh(circleGeo, machinedSteel);
    slewingCircle.position.set(0, 0.5, 0);
    
    const bladeAssembly = new THREE.Group();
    bladeAssembly.add(moldboard, slewingCircle);
    bladeAssembly.position.set(0, 0.5, 0); // Middle of machine
    group.add(bladeAssembly);
    
    group.userData.animatedMeshes['blade_assembly'] = bladeAssembly;
    parts.push({ mesh: bladeAssembly, name: "CAD Moldboard & Slewing Circle", description: "Mathematically extruded curved steel blade mounted on a lathed slewing ring.", function: "Precision grading of soil."});

    // ==========================================
    // 2. PROCEDURAL CAD: Articulated Frame
    // ==========================================
    // The frame of a motor grader is a long arched neck
    const frameShape = new THREE.Shape();
    frameShape.moveTo(0, 0);
    frameShape.lineTo(0, 0.5);
    frameShape.lineTo(4.0, 1.5);
    frameShape.lineTo(5.0, 1.5);
    frameShape.lineTo(5.0, 1.0);
    frameShape.lineTo(4.0, 1.0);
    frameShape.lineTo(0.5, 0);
    
    const frameSettings = { depth: 0.4, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, frameSettings);
    const mainFrame = new THREE.Mesh(frameGeo, graderYellow);
    
    mainFrame.position.set(-2.0, 1.0, -0.2);
    group.add(mainFrame);
    parts.push({ mesh: mainFrame, name: "Arched Main Frame", description: "Extruded steel neck.", function: "Provides clearance for the moldboard."});

    // ==========================================
    // 3. Factual Fasteners (9,500 parts)
    // ==========================================
    const boltCount = 9500;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 6, Math.random() * 3, (Math.random() - 0.5) * 2);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "9,500 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Structural rigidity." });
    
    // Scale adjustment for visibility
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Slew the blade circle based on throttle
        const slewAngle = state.throttle * (Math.PI / 4); // 45 degrees max
        group.userData.animatedMeshes['blade_assembly'].rotation.y = slewAngle;
    };

    group.userData.parts = parts;
    return group;
}
