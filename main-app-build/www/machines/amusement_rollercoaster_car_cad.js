import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const fiberglassBlue = new THREE.MeshPhysicalMaterial({ color: 0x0044cc, metalness: 0.1, roughness: 0.1, clearcoat: 1.0 });
    const polyUrethaneWheel = new THREE.MeshPhysicalMaterial({ color: 0xaa2222, metalness: 0.0, roughness: 0.4 }); // Red polyurethane wheels
    const trackSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const safetyFoam = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.0, roughness: 0.9 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Track Section
    // ==========================================
    // Creating a tubular steel coaster track
    const trackGroup = new THREE.Group();
    
    // Left and Right main rails
    const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 8.0, 16).rotateX(Math.PI/2);
    const leftRail = new THREE.Mesh(railGeo, trackSteel);
    leftRail.position.set(-0.6, 0, 0);
    const rightRail = new THREE.Mesh(railGeo, trackSteel);
    rightRail.position.set(0.6, 0, 0);
    
    // Backbone (Spine)
    const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, 8.0, 16).rotateX(Math.PI/2);
    const spine = new THREE.Mesh(spineGeo, trackSteel);
    spine.position.set(0, -0.6, 0);
    
    // Cross-ties
    const tieGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8).rotateZ(Math.PI/2);
    for (let z = -3.5; z <= 3.5; z += 1.0) {
        // Horizontal tie connecting left and right
        const tieH = new THREE.Mesh(tieGeo, trackSteel);
        tieH.position.set(0, 0, z);
        // Diagonal ties to the spine
        const tieDL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.85, 8).rotateZ(Math.PI/4), trackSteel);
        tieDL.position.set(-0.3, -0.3, z);
        const tieDR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.85, 8).rotateZ(-Math.PI/4), trackSteel);
        tieDR.position.set(0.3, -0.3, z);
        trackGroup.add(tieH, tieDL, tieDR);
    }
    
    trackGroup.add(leftRail, rightRail, spine);
    group.add(trackGroup);
    group.userData.animatedMeshes['track'] = trackGroup;
    parts.push({ mesh: trackGroup, name: "Tubular Steel Track", description: "Procedural rail spine with cross-ties.", function: "Provides the frictionless pathway for the train."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Coaster Car & Bogies
    // ==========================================
    const carGroup = new THREE.Group();
    
    // Fiberglass aerodynamic shell
    const shellShape = new THREE.Shape();
    shellShape.moveTo(-1.0, 0);
    shellShape.lineTo(1.0, 0);
    shellShape.lineTo(1.0, 0.8);
    shellShape.quadraticCurveTo(0, 1.2, -1.0, 0.8);
    shellShape.lineTo(-1.0, 0);
    
    // Hollow interior for passengers
    const seatHole = new THREE.Path();
    seatHole.moveTo(-0.8, 0.2);
    seatHole.lineTo(0.8, 0.2);
    seatHole.lineTo(0.8, 0.9);
    seatHole.quadraticCurveTo(0, 1.0, -0.8, 0.9);
    seatHole.lineTo(-0.8, 0.2);
    shellShape.holes.push(seatHole);

    const shellGeo = new THREE.ExtrudeGeometry(shellShape, { depth: 1.5, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    const carShell = new THREE.Mesh(shellGeo, fiberglassBlue);
    carShell.position.set(0, 0.4, -0.75); // Center extrusion depth over track
    carGroup.add(carShell);
    
    // Seats
    const seatGeo = new THREE.BoxGeometry(0.7, 0.6, 0.5);
    const leftSeat = new THREE.Mesh(seatGeo, safetyFoam);
    leftSeat.position.set(-0.4, 0.6, 0);
    const rightSeat = new THREE.Mesh(seatGeo, safetyFoam);
    rightSeat.position.set(0.4, 0.6, 0);
    carGroup.add(leftSeat, rightSeat);
    
    // Overhead Lap Bars (Hydraulic restraint)
    const barPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.5, -0.5),
        new THREE.Vector3(0, 1.2, -0.5),
        new THREE.Vector3(0, 1.2, 0.2),
        new THREE.Vector3(0, 0.6, 0.4)
    ]);
    const barGeo = new THREE.TubeGeometry(barPath, 16, 0.05, 8, false);
    
    const lapBarL = new THREE.Mesh(barGeo, safetyFoam);
    lapBarL.position.set(-0.4, 0, 0);
    const lapBarR = new THREE.Mesh(barGeo, safetyFoam);
    lapBarR.position.set(0.4, 0, 0);
    carGroup.add(lapBarL, lapBarR);
    
    group.userData.animatedMeshes['lapBars'] = [lapBarL, lapBarR];

    // ==========================================
    // 3. PROCEDURAL CAD: The Wheel Bogie System
    // ==========================================
    // Roller coasters use 3 wheels per rail: Road wheel (top), Guide wheel (side), Up-stop wheel (bottom)
    group.userData.animatedMeshes.wheels = [];
    
    const buildBogie = (xOffset, zOffset) => {
        const bogie = new THREE.Group();
        
        // Road wheel (Polyurethane)
        const roadW = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16).rotateZ(Math.PI/2), polyUrethaneWheel);
        roadW.position.set(0, 0.12, 0);
        
        // Guide wheel (side)
        const guideW = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), polyUrethaneWheel);
        guideW.position.set(xOffset > 0 ? -0.1 : 0.1, 0, 0);
        
        // Up-stop wheel (bottom)
        const upstopW = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16).rotateZ(Math.PI/2), polyUrethaneWheel);
        upstopW.position.set(0, -0.1, 0);
        
        bogie.add(roadW, guideW, upstopW);
        bogie.position.set(xOffset, 0, zOffset);
        
        group.userData.animatedMeshes.wheels.push(roadW, guideW, upstopW);
        return bogie;
    };
    
    carGroup.add(buildBogie(-0.6, 0.5));
    carGroup.add(buildBogie(0.6, 0.5));
    carGroup.add(buildBogie(-0.6, -0.5));
    carGroup.add(buildBogie(0.6, -0.5));

    group.add(carGroup);
    group.userData.animatedMeshes['car'] = carGroup;
    
    parts.push({ mesh: carShell, name: "Fiberglass Passenger Shell", description: "Aerodynamic chassis.", function: "Seats the riders and connects to the chassis bogies."});
    parts.push({ mesh: leftSeat, name: "Track Bogie (Road, Guide, Up-stop)", description: "Polyurethane wheels locking onto the tubular rail.", function: "Prevents the coaster from derailing in any orientation."});

    // ==========================================
    // 4. Factual Fasteners (4,200 parts)
    // ==========================================
    const boltCount = 4200;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, chrome, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the track and car
        dummy.position.set((Math.random() - 0.5) * 2, Math.random() * 1.5, (Math.random() - 0.5) * 3);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "4,200 Steel Fasteners", description: "Factual quantity of instanced bolts.", function: "Secures the track ties and bogie assemblies." });
    
    // Scale adjustment
    group.scale.set(1.0, 1.0, 1.0);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating the coaster zooming along the track!
        // We move the track backwards instead of the car to keep the car centered
        if (state.throttle > 0.0) {
            const speed = state.throttle * 0.2;
            group.userData.animatedMeshes['track'].position.z += speed;
            if (group.userData.animatedMeshes['track'].position.z > 1.0) {
                // Loop the track seamlessly
                group.userData.animatedMeshes['track'].position.z -= 1.0; 
            }
            
            // Spin the wheels!
            group.userData.animatedMeshes.wheels.forEach((w, idx) => {
                // Road/Up-stop wheels spin on X, Guide wheels spin on Y
                if (idx % 3 === 1) { // Guide wheel
                    w.rotation.y += speed * 2;
                } else {
                    w.rotation.x += speed * 2;
                }
            });
            
            // Hydraulic lap bars lock down
            group.userData.animatedMeshes['lapBars'].forEach(b => {
                b.rotation.x = -Math.PI / 8; // Locked position
            });
            
            // Add some rumble/vibration to the car
            group.userData.animatedMeshes['car'].position.y = (Math.random() - 0.5) * 0.02;
            group.userData.animatedMeshes['car'].position.x = (Math.random() - 0.5) * 0.01;
        } else {
            // Lap bars release
            group.userData.animatedMeshes['lapBars'].forEach(b => {
                b.rotation.x = 0; // Open position
            });
             group.userData.animatedMeshes['car'].position.y = 0;
             group.userData.animatedMeshes['car'].position.x = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
