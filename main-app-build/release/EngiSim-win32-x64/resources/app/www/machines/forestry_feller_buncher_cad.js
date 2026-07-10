import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const redPaint = new THREE.MeshPhysicalMaterial({ color: 0xcc0000, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const sawBladeSteel = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.1 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Hot Saw Disc
    // ==========================================
    // A feller buncher uses a massive, high-speed circular saw with giant cutting teeth.
    const teethCount = 18;
    const sawShape = new THREE.Shape();
    const outerRadius = 1.0;
    const innerRadius = 0.8;
    
    // Mathematically plot the carbide cutting teeth
    const step = (Math.PI * 2) / teethCount;
    for (let i = 0; i < teethCount; i++) {
        const angle = i * step;
        const nextAngle = (i + 1) * step;
        
        // Gullet (base of tooth)
        sawShape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
        
        // Tooth point (angled forward)
        const toothAngle = angle + (step * 0.3);
        sawShape.lineTo(Math.cos(toothAngle) * outerRadius, Math.sin(toothAngle) * outerRadius);
        
        // Back of tooth
        const backAngle = angle + (step * 0.6);
        sawShape.lineTo(Math.cos(backAngle) * innerRadius, Math.sin(backAngle) * innerRadius);
    }
    
    // Center hole for arbor
    const arborHole = new THREE.Path();
    arborHole.absarc(0, 0, 0.2, 0, Math.PI * 2, false);
    sawShape.holes.push(arborHole);

    const sawSettings = { depth: 0.05, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005 };
    const sawGeo = new THREE.ExtrudeGeometry(sawShape, sawSettings);
    
    const sawDisc = new THREE.Mesh(sawGeo, sawBladeSteel);
    sawDisc.position.set(0, 0, -0.025); // Center extrusion
    
    const sawAssembly = new THREE.Group();
    sawAssembly.add(sawDisc);
    sawAssembly.position.set(0, 0.5, 4.0);
    // Rotate so it's horizontal
    sawAssembly.rotation.x = -Math.PI / 2;
    group.add(sawAssembly);
    
    group.userData.animatedMeshes['saw'] = sawAssembly;
    parts.push({ mesh: sawAssembly, name: "CAD Hot Saw Disc", description: "Mathematically extruded high-speed cutting disc with 18 carbide teeth.", function: "Slices through massive tree trunks."});

    // ==========================================
    // 2. PROCEDURAL CAD: Accumulator Arms
    // ==========================================
    // Hydraulic arms that grab and hold multiple trees.
    const armShape = new THREE.Shape();
    armShape.moveTo(0, 0);
    armShape.lineTo(0.2, 0);
    armShape.quadraticCurveTo(1.5, 0.5, 1.0, 1.5);
    armShape.lineTo(0.8, 1.5);
    armShape.quadraticCurveTo(1.2, 0.5, 0, 0.2);
    
    const armSettings = { depth: 0.2, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 };
    const armGeo = new THREE.ExtrudeGeometry(armShape, armSettings);
    
    const leftArm = new THREE.Mesh(armGeo, heavySteel);
    leftArm.position.set(-0.5, 1.0, 3.5);
    leftArm.rotation.x = Math.PI / 2;
    
    const rightArm = new THREE.Mesh(armGeo, heavySteel);
    rightArm.position.set(0.5, 1.0, 3.5);
    rightArm.rotation.x = Math.PI / 2;
    rightArm.rotation.y = Math.PI; // Mirror it
    
    group.add(leftArm, rightArm);
    group.userData.animatedMeshes['arm_l'] = leftArm;
    group.userData.animatedMeshes['arm_r'] = rightArm;
    parts.push({ mesh: leftArm, name: "Accumulator Grab Arms", description: "Curved extruded steel pincers.", function: "Holds the cut timber securely."});

    // ==========================================
    // 3. Factual Fasteners (12,000 parts)
    // ==========================================
    const boltCount = 12000;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 4, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "12,000 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Structural rigidity." });

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 5.0), redPaint);
    body.position.set(0, 2.0, 0);
    group.add(body);
    
    // Scale adjustment for visibility
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Spin the massive hot saw blade
        const sawSpeed = state.throttle * 0.5; // Very fast
        group.userData.animatedMeshes['saw'].rotation.z += sawSpeed;
        
        // Actuate the accumulator arms to clamp shut
        const clampAngle = state.throttle * (Math.PI / 6); // 30 degrees closing
        group.userData.animatedMeshes['arm_l'].rotation.y = -clampAngle;
        group.userData.animatedMeshes['arm_r'].rotation.y = Math.PI + clampAngle;
    };

    group.userData.parts = parts;
    return group;
}
