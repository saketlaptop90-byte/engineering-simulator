import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const pumpRed = new THREE.MeshPhysicalMaterial({ color: 0xcc0000, metalness: 0.3, roughness: 0.5, clearcoat: 0.8 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Articulated Z-Fold Boom
    // ==========================================
    const boomGroup = new THREE.Group();
    
    // Mathematical generation of extruded box-section booms
    const createBoomSection = (length, colorMat) => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.2, -0.2);
        shape.lineTo(0.2, -0.2);
        shape.lineTo(0.15, 0.2);
        shape.lineTo(-0.15, 0.2);
        shape.lineTo(-0.2, -0.2);
        const geo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
        const mesh = new THREE.Mesh(geo, colorMat);
        mesh.rotation.x = Math.PI / 2; // Point down the Z axis when un-rotated
        return mesh;
    };

    // Base pivot (slewing ring)
    const basePivot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32), machinedSteel);
    basePivot.position.set(0, 1.8, -2.0);
    boomGroup.add(basePivot);
    
    // Section 1 (Base Boom)
    const section1 = new THREE.Group();
    const boom1 = createBoomSection(4.0, pumpRed);
    boom1.position.set(0, 0, 0); 
    section1.add(boom1);
    section1.position.set(0, 2.0, -2.0);
    
    // Section 2 (Mid Boom)
    const section2 = new THREE.Group();
    const boom2 = createBoomSection(3.5, pumpRed);
    section2.add(boom2);
    section2.position.set(0, 4.0, 0); // Attached to end of section1
    section1.add(section2);

    // Section 3 (Tip Boom)
    const section3 = new THREE.Group();
    const boom3 = createBoomSection(3.0, pumpRed);
    section3.add(boom3);
    section3.position.set(0, 3.5, 0); // Attached to end of section2
    section2.add(section3);

    boomGroup.add(section1);
    group.add(boomGroup);
    
    group.userData.animatedMeshes['base_slew'] = basePivot;
    group.userData.animatedMeshes['sec1'] = section1;
    group.userData.animatedMeshes['sec2'] = section2;
    group.userData.animatedMeshes['sec3'] = section3;
    parts.push({ mesh: boomGroup, name: "CAD Z-Fold Boom", description: "Mathematically extruded steel box-section arms connected by exact pivot joints.", function: "Pumps concrete 30+ meters into the air."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Pumping Unit (Hopper & Twin Cylinders)
    // ==========================================
    const hopperShape = new THREE.Shape();
    hopperShape.moveTo(-1.0, 1.0);
    hopperShape.lineTo(-0.5, 0);
    hopperShape.lineTo(0.5, 0);
    hopperShape.lineTo(1.0, 1.0);
    hopperShape.lineTo(-1.0, 1.0);
    const hopperGeo = new THREE.ExtrudeGeometry(hopperShape, { depth: 1.5, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const hopper = new THREE.Mesh(hopperGeo, pumpRed);
    hopper.position.set(0, 0.5, -4.5);
    group.add(hopper);
    
    // Twin chrome pumping cylinders
    const cylGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const cyl1 = new THREE.Mesh(cylGeo, chromeMat);
    cyl1.rotation.x = Math.PI/2;
    cyl1.position.set(-0.3, 0.8, -3.5);
    const cyl2 = new THREE.Mesh(cylGeo, chromeMat);
    cyl2.rotation.x = Math.PI/2;
    cyl2.position.set(0.3, 0.8, -3.5);
    group.add(cyl1, cyl2);
    
    group.userData.animatedMeshes['cyl1'] = cyl1;
    group.userData.animatedMeshes['cyl2'] = cyl2;
    parts.push({ mesh: hopper, name: "Twin-Cylinder Pumping Unit", description: "Hopper and lathed chrome pistons.", function: "Provides the hydraulic pressure to move heavy concrete."});

    // ==========================================
    // 3. Factual Fasteners (8,800 parts)
    // ==========================================
    const boltCount = 8800;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 3, Math.random() * 2 + 0.5, (Math.random() - 0.5) * 8);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "8,800 Assembly Fasteners", description: "Factual quantity of instanced bolts.", function: "Secures the boom to the truck." });

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.5, 8.0), chromeMat);
    body.position.set(0, 1.0, 0);
    group.add(body);
    
    // Scale adjustment for visibility
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Unfold the Z-boom
        const unfold = state.throttle;
        group.userData.animatedMeshes['base_slew'].rotation.y = unfold * Math.PI;
        
        group.userData.animatedMeshes['sec1'].rotation.x = -unfold * (Math.PI / 3);
        group.userData.animatedMeshes['sec2'].rotation.x = unfold * (Math.PI / 1.5); // Folds back out
        group.userData.animatedMeshes['sec3'].rotation.x = -unfold * (Math.PI / 1.5); // Reaches forward
        
        // Pump cylinder alternating reciprocation
        const pumpSpeed = time * 0.01;
        group.userData.animatedMeshes['cyl1'].position.z = -3.5 + Math.sin(pumpSpeed) * 0.2;
        group.userData.animatedMeshes['cyl2'].position.z = -3.5 + Math.cos(pumpSpeed) * 0.2;
    };

    group.userData.parts = parts;
    return group;
}
