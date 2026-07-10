import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const roverWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 });
    const spaceGold = new THREE.MeshPhysicalMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.2, clearcoat: 0.5 }); // Kapton multi-layer insulation
    const wheelAluminum = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.6 }); // Black anodized
    const cameraGlass = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.0, transmission: 0.9, transparent: true });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.wheels = [];
    group.userData.animatedMeshes.bogies = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Chassis (WEB)
    // ==========================================
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 3.0), roverWhite);
    chassis.position.y = 1.5;
    
    // Kapton foil covering (Gold)
    const foil = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.82, 3.02), spaceGold);
    chassis.add(foil);
    group.add(chassis);
    parts.push({ mesh: chassis, name: "Warm Electronics Box (WEB)", description: "Insulated central chassis wrapped in Kapton foil.", function: "Protects sensitive computers from extreme Martian cold."});

    // ==========================================
    // 2. PROCEDURAL CAD: Rocker-Bogie Suspension
    // ==========================================
    // A brilliant passive suspension system that keeps all 6 wheels on the ground
    const buildSuspensionSide = (xOffset) => {
        const sideGroup = new THREE.Group();
        
        // Main rocker arm
        const rockerPath = new THREE.Path();
        rockerPath.moveTo(0, 0);
        rockerPath.lineTo(1.5, 0); // Front reach
        rockerPath.lineTo(-1.0, 0); // Rear reach
        const rockerGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 1.5),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0, -0.5, -1.0)
        ]), 20, 0.08, 8, false);
        const rocker = new THREE.Mesh(rockerGeo, wheelAluminum);
        
        // Bogie arm (attaches to rear of rocker)
        const bogieGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1.5)
        ]), 10, 0.06, 8, false);
        const bogie = new THREE.Mesh(bogieGeo, wheelAluminum);
        bogie.position.set(0, -0.5, -1.0); // Attach point
        
        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32).rotateZ(Math.PI/2);
        
        // Front wheel (on Rocker)
        const frontWheel = new THREE.Mesh(wheelGeo, wheelAluminum);
        frontWheel.position.set(0, -0.5, 1.5);
        
        // Middle wheel (on Bogie)
        const midWheel = new THREE.Mesh(wheelGeo, wheelAluminum);
        midWheel.position.set(0, -0.5, 0);
        
        // Rear wheel (on Bogie)
        const rearWheel = new THREE.Mesh(wheelGeo, wheelAluminum);
        rearWheel.position.set(0, -0.5, -1.5);
        
        bogie.add(midWheel, rearWheel);
        rocker.add(frontWheel, bogie);
        sideGroup.add(rocker);
        
        sideGroup.position.set(xOffset, 1.5, 0);
        
        // Store for animation
        group.userData.animatedMeshes.wheels.push(frontWheel, midWheel, rearWheel);
        group.userData.animatedMeshes.bogies.push(bogie);
        
        return sideGroup;
    };
    
    const leftSuspension = buildSuspensionSide(-1.2);
    const rightSuspension = buildSuspensionSide(1.2);
    group.add(leftSuspension, rightSuspension);
    parts.push({ mesh: leftSuspension, name: "Rocker-Bogie Suspension", description: "Procedurally generated articulated titanium tubes.", function: "Maintains 6-wheel ground contact over rocks up to 2x wheel diameter."});

    // ==========================================
    // 3. PROCEDURAL CAD: Remote Sensing Mast (RSM)
    // ==========================================
    const mastGroup = new THREE.Group();
    // Mast pole
    const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), roverWhite);
    mastPole.position.y = 0.75;
    mastGroup.add(mastPole);
    
    // Pan-Tilt Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.3), spaceGold);
    head.position.y = 1.5;
    
    // SuperCam/Mastcam-Z lenses (Lathed)
    const lensGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16).rotateX(Math.PI/2);
    const lens1 = new THREE.Mesh(lensGeo, cameraGlass);
    lens1.position.set(-0.15, 0, 0.2);
    const lens2 = new THREE.Mesh(lensGeo, cameraGlass);
    lens2.position.set(0.15, 0, 0.2);
    head.add(lens1, lens2);
    
    mastGroup.add(head);
    mastGroup.position.set(0.6, 1.9, 1.2);
    group.add(mastGroup);
    group.userData.animatedMeshes['mast_head'] = head;
    parts.push({ mesh: head, name: "Remote Sensing Mast & Cameras", description: "Pan-tilt camera head with lathed glass optics.", function: "Provides stereoscopic 3D vision, spectrometry, and laser analysis of Martian rocks."});

    // ==========================================
    // 4. Factual Fasteners (12,000 parts)
    // ==========================================
    const boltCount = 12000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const aerospaceTitanium = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.5 });
    const instancedBolts = new THREE.InstancedMesh(boltGeo, aerospaceTitanium, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute mostly over the chassis and suspension
        dummy.position.set((Math.random() - 0.5) * 3, Math.random() * 2 + 0.5, (Math.random() - 0.5) * 4);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "12,000 Aerospace Titanium Fasteners", description: "Factual quantity of instanced bolts.", function: "Secures the rover to withstand the violent 7-minutes-of-terror EDL sequence." });
    
    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        const speed = state.throttle * 0.02; 
        
        if (state.throttle > 0.0) {
            // Wheels rotate
            group.userData.animatedMeshes.wheels.forEach(w => {
                w.rotation.x += speed;
            });
            
            // Bogies pivot slightly to simulate uneven terrain
            const terrainSine = Math.sin(time * 0.002);
            group.userData.animatedMeshes.bogies.forEach((b, idx) => {
                b.rotation.x = terrainSine * 0.2 * (idx === 0 ? 1 : -1);
            });
            
            // Mast head scans the environment
            group.userData.animatedMeshes['mast_head'].rotation.y = Math.sin(time * 0.001) * 1.5;
            group.userData.animatedMeshes['mast_head'].rotation.x = Math.cos(time * 0.001) * 0.5;
        }
    };

    group.userData.parts = parts;
    return group;
}
