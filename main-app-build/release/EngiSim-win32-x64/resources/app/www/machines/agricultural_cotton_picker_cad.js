import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const jdGreen = new THREE.MeshPhysicalMaterial({ color: 0x367C2B, metalness: 0.5, roughness: 0.3, clearcoat: 0.8 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const ductPlastic = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.9 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.spindles = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Spindle Drum Array
    // ==========================================
    // Cotton pickers use vertically rotating drums covered in hundreds of barbed spindles
    const pickerHead = new THREE.Group();
    
    // Extrude a barbed spindle
    const spindleShape = new THREE.Shape();
    spindleShape.moveTo(0, 0);
    spindleShape.lineTo(0.02, 0);
    spindleShape.lineTo(0.01, 0.2); // tapered
    spindleShape.lineTo(0, 0.2);
    const spindleGeo = new THREE.ExtrudeGeometry(spindleShape, { depth: 0.01, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002 });
    
    // Create 4 main drums (2 rows per side of the plant)
    for (let d = 0; d < 4; d++) {
        const drumGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 32);
        const drum = new THREE.Mesh(drumGeo, machinedSteel);
        
        // Add 100 spindles mathematically wrapped around the drum
        for (let i = 0; i < 100; i++) {
            const angle = (i % 10) * (Math.PI * 2 / 10);
            const yPos = (Math.floor(i / 10) / 10) * 1.8 - 0.9;
            
            const spindle = new THREE.Mesh(spindleGeo, machinedSteel);
            spindle.position.set(Math.cos(angle) * 0.3, yPos, Math.sin(angle) * 0.3);
            spindle.rotation.x = Math.PI / 2; 
            spindle.rotation.y = angle;
            drum.add(spindle);
        }
        
        // Position drums to interlock around the crop row
        const xOffset = (d % 2 === 0) ? -0.4 : 0.4;
        const zOffset = (d < 2) ? 0 : -0.8;
        drum.position.set(xOffset, 1.0, zOffset);
        
        pickerHead.add(drum);
        group.userData.animatedMeshes.spindles.push({ drum: drum, direction: (d % 2 === 0) ? 1 : -1 });
    }
    
    pickerHead.position.set(0, 0.5, 3.0); // Mounted on front
    group.add(pickerHead);
    parts.push({ mesh: pickerHead, name: "CAD Spindle Picking Drums", description: "Lathed vertical drums with 400 mathematically arrayed extruded barbed spindles.", function: "Extracts cotton from the boll."});

    // ==========================================
    // 2. PROCEDURAL CAD: Pneumatic Air Ducts
    // ==========================================
    // Uses TubeGeometry to route the picked cotton from the head to the basket via math curves
    const ductPathL = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.0, 2.5, 2.5),
        new THREE.Vector3(-1.5, 4.0, 0),
        new THREE.Vector3(-0.5, 4.5, -2.0)
    );
    const ductPathR = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(1.0, 2.5, 2.5),
        new THREE.Vector3(1.5, 4.0, 0),
        new THREE.Vector3(0.5, 4.5, -2.0)
    );
    
    const ductGeoL = new THREE.TubeGeometry(ductPathL, 64, 0.25, 16, false);
    const ductGeoR = new THREE.TubeGeometry(ductPathR, 64, 0.25, 16, false);
    
    const leftDuct = new THREE.Mesh(ductGeoL, ductPlastic);
    const rightDuct = new THREE.Mesh(ductGeoR, ductPlastic);
    group.add(leftDuct, rightDuct);
    parts.push({ mesh: leftDuct, name: "Pneumatic Delivery Ducts", description: "Quadratic Bezier curved tubes.", function: "Blows cotton into the rear basket."});

    // ==========================================
    // 3. Factual Fasteners (10,500 parts)
    // ==========================================
    const boltCount = 10500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 4, Math.random() * 5, (Math.random() - 0.5) * 6);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "10,500 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Structural rigidity." });

    // Chassis body (Cotton basket and cab base)
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 5.0), jdGreen);
    body.position.set(0, 2.5, -1.0);
    group.add(body);
    
    // Scale adjustment for visibility
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // High speed rotation of the spindle drums
        const speed = state.throttle * 0.4;
        group.userData.animatedMeshes.spindles.forEach(s => {
            s.drum.rotation.y += speed * s.direction;
        });
    };

    group.userData.parts = parts;
    return group;
}
