import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const locoYellow = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.1, roughness: 0.4, clearcoat: 0.2 }); // Iconic safety yellow paint
    const locoBlack = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8 }); // Undercarriage/frame
    const castSteelBogies = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.7 }); // Heavy cast steel trucks
    const wheelSteel = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.4 });
    const exhaustSoot = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.1, roughness: 1.0 }); // Inside the exhaust stack
    const cabGlass = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1, transmission: 0.8, transparent: true, opacity: 1 });
    
    // VFX Materials
    const exhaustSmokeMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.0 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Massive Underframe & Fuel Tank
    // ==========================================
    const frameGroup = new THREE.Group();
    
    // The main I-beam structural frame
    const frameGeo = new THREE.BoxGeometry(3.0, 0.4, 22.0);
    const frame = new THREE.Mesh(frameGeo, locoBlack);
    frame.position.set(0, 2.0, 0);
    frameGroup.add(frame);
    
    // Massive 5,000 Gallon Diesel Fuel Tank slung underneath
    const tankGeo = new THREE.BoxGeometry(2.8, 1.2, 8.0);
    const fuelTank = new THREE.Mesh(tankGeo, locoBlack);
    fuelTank.position.set(0, 1.2, 0);
    frameGroup.add(fuelTank);
    
    // Couplers (Front and Rear)
    const couplerGeo = new THREE.BoxGeometry(0.5, 0.4, 1.0);
    const couplerFront = new THREE.Mesh(couplerGeo, castSteelBogies); couplerFront.position.set(0, 2.0, 11.5);
    const couplerRear = new THREE.Mesh(couplerGeo, castSteelBogies); couplerRear.position.set(0, 2.0, -11.5);
    frameGroup.add(couplerFront, couplerRear);

    group.add(frameGroup);
    parts.push({ mesh: frame, name: "Main Structural Frame & Fuel Tank", description: "Massive steel I-beam backbone holding a 5,000-gallon diesel tank.", function: "Provides the immense rigid structural integrity needed to pull 10,000 tons of freight."});

    // ==========================================
    // 2. PROCEDURAL CAD: C-C Bogies (Trucks) & Traction Motors
    // ==========================================
    const bogieGroup = new THREE.Group();
    group.userData.animatedMeshes.wheels = [];
    
    // A standard heavy-haul locomotive uses two 3-axle bogies (C-C arrangement)
    const createBogie = (zPos) => {
        const bogie = new THREE.Group();
        bogie.position.set(0, 0.6, zPos);
        
        // Heavy Cast Steel Bogie Frame
        const sideFrameGeo = new THREE.BoxGeometry(0.3, 0.6, 5.0);
        const sfL = new THREE.Mesh(sideFrameGeo, castSteelBogies); sfL.position.set(-1.6, 0, 0);
        const sfR = new THREE.Mesh(sideFrameGeo, castSteelBogies); sfR.position.set(1.6, 0, 0);
        bogie.add(sfL, sfR);
        
        // 3 Axles per bogie
        for (let i = -1; i <= 1; i++) {
            const axleGroup = new THREE.Group();
            axleGroup.position.set(0, 0, i * 1.8);
            
            // Solid Steel Wheels
            const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.2, 32).rotateZ(Math.PI/2);
            const wheelL = new THREE.Mesh(wheelGeo, wheelSteel); wheelL.position.set(-1.43, 0, 0);
            const wheelR = new THREE.Mesh(wheelGeo, wheelSteel); wheelR.position.set(1.43, 0, 0);
            
            // Axle shaft
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.8, 16).rotateZ(Math.PI/2), wheelSteel);
            
            // AC Traction Motor (geared to the axle)
            const tmGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.0, 32).rotateZ(Math.PI/2);
            const tm = new THREE.Mesh(tmGeo, locoBlack);
            tm.position.set(-0.5, 0.2, 0.3); // Offset slightly
            
            axleGroup.add(wheelL, wheelR, shaft, tm);
            bogie.add(axleGroup);
            group.userData.animatedMeshes.wheels.push(axleGroup);
        }
        return bogie;
    };
    
    const bogieFront = createBogie(6.5);
    const bogieRear = createBogie(-6.5);
    bogieGroup.add(bogieFront, bogieRear);
    
    group.add(bogieGroup);
    parts.push({ mesh: bogieFront, name: "6-Axle C-C Trucks & AC Traction Motors", description: "Heavy cast steel bogies housing 6 individual AC electric traction motors.", function: "Applies massive starting tractive effort directly to the steel rails without slipping."});

    // ==========================================
    // 3. PROCEDURAL CAD: Superstructure (Cab & Engine Hood)
    // ==========================================
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 2.2, 0); // Sits on the frame
    
    // Operator Cab (Wide nose style)
    const cabGeo = new THREE.BoxGeometry(3.0, 2.5, 3.5);
    const cab = new THREE.Mesh(cabGeo, locoYellow);
    cab.position.set(0, 1.25, 7.5);
    
    // Cab Windows
    const winGeoF = new THREE.PlaneGeometry(2.8, 1.0);
    const winF = new THREE.Mesh(winGeoF, cabGlass); winF.position.set(0, 0.5, 1.76);
    cab.add(winF);
    
    bodyGroup.add(cab);
    
    // Long Hood (Houses the Prime Mover, Alternator, and Radiators)
    const hoodGeo = new THREE.BoxGeometry(2.4, 2.5, 14.5);
    const hood = new THREE.Mesh(hoodGeo, locoYellow);
    hood.position.set(0, 1.25, -1.5);
    bodyGroup.add(hood);
    
    // Radiator section (Flared out at the rear)
    const radGeo = new THREE.BoxGeometry(3.0, 1.0, 4.0);
    const radiator = new THREE.Mesh(radGeo, locoYellow);
    radiator.position.set(0, 2.0, -6.75);
    bodyGroup.add(radiator);
    
    // Exhaust Stack (Turbocharger outlet)
    const exhaustGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const exhaust = new THREE.Mesh(exhaustGeo, exhaustSoot);
    exhaust.position.set(0, 2.7, -1.5); // Right above the engine
    bodyGroup.add(exhaust);
    
    // Dynamic Exhaust Smoke VFX
    const smokeGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const smoke = new THREE.Mesh(smokeGeo, exhaustSmokeMat);
    smoke.position.set(0, 3.5, -1.5);
    bodyGroup.add(smoke);
    group.userData.animatedMeshes['smoke'] = smoke;
    
    // Headlights (Twin sealed beam)
    const hLGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16).rotateX(Math.PI/2);
    const hL1 = new THREE.Mesh(hLGeo, headlightMat); hL1.position.set(-0.2, 1.5, 9.25);
    const hL2 = new THREE.Mesh(hLGeo, headlightMat); hL2.position.set(0.2, 1.5, 9.25);
    bodyGroup.add(hL1, hL2);
    group.userData.animatedMeshes['headlights'] = [hL1, hL2];

    group.add(bodyGroup);
    parts.push({ mesh: hood, name: "Long Hood (16-Cylinder Prime Mover)", description: "Aerodynamically blunt housing for the 4,400 HP turbo-diesel V16 and massive main alternator.", function: "Generates massive electrical power to feed the traction motors; it's an electric train carrying its own power plant."});

    // ==========================================
    // 4. Factual Fasteners (6,500 parts)
    // ==========================================
    const boltCount = 6500;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 3000) {
            // Bogie side frame bolts (Heavy duty structural)
            const isFront = Math.random() > 0.5;
            const zBogie = isFront ? 6.5 : -6.5;
            const isLeft = Math.random() > 0.5;
            const xOffset = isLeft ? -1.75 : 1.75;
            
            bDummy.position.set(xOffset, 0.6 + (Math.random()-0.5)*0.6, zBogie + (Math.random()-0.5)*5.0);
            bDummy.rotation.set(0, 0, Math.PI/2);
        } else if (i < 5000) {
            // Engine hood access panel latches/bolts
            const isLeft = Math.random() > 0.5;
            const xOffset = isLeft ? -1.21 : 1.21;
            bDummy.position.set(xOffset, 2.8 + (Math.random()-0.5)*1.5, -1.5 + (Math.random()-0.5)*14.0);
            bDummy.rotation.set(0, 0, Math.PI/2);
        } else {
            // Fuel tank straps
            bDummy.position.set((Math.random()-0.5)*2.8, 1.2, (Math.random()-0.5)*8.0);
            bDummy.rotation.set(0, 0, 0);
        }
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "6,500 High-Grade Structural Fasteners", description: "Factual quantity of instanced heavy-duty hex bolts.", function: "Secures the immense vibrating mass of the prime mover and fastens the cast steel trucks together under extreme dynamic loading." });
    
    // Scale adjustment (Locomotives are huge)
    group.scale.set(0.2, 0.2, 0.2);
    group.position.y = 0.0;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Wheels and Traction Motors spin
            group.userData.animatedMeshes.wheels.forEach(axle => {
                axle.rotation.x -= 0.1 * speed; // Negative because moving forward (-Z) means wheels roll back on top
            });
            
            // Exhaust smoke chugs heavily
            // Opacity and scale based on throttle load (diesels dump black smoke when throttling up hard)
            group.userData.animatedMeshes['smoke'].material.opacity = 0.4 + (speed * 0.4);
            group.userData.animatedMeshes['smoke'].scale.set(1.0 + speed*2, 1.0 + speed*4, 1.0 + speed*2);
            // Move smoke up to simulate blowing out
            group.userData.animatedMeshes['smoke'].position.y = 3.5 + (timeAcc * 5 * speed) % 2.0;
            
            // Headlights glaring bright
            group.userData.animatedMeshes['headlights'].forEach(hl => hl.material.opacity = 1.0);
            
            // Engine vibration (massive V16 running at Notch 8)
            const vibration = Math.sin(timeAcc * 50) * 0.02 * speed;
            bodyGroup.position.y = 2.2 + vibration;
            
        } else {
            // Idle (Notch 1)
            group.userData.animatedMeshes.wheels.forEach(axle => axle.rotation.x -= 0.01); // Slowly rolling or stopped
            
            group.userData.animatedMeshes['smoke'].material.opacity = 0.2;
            group.userData.animatedMeshes['smoke'].scale.set(1.0, 1.5, 1.0);
            group.userData.animatedMeshes['smoke'].position.y = 3.5 + (timeAcc) % 1.0;
            
            group.userData.animatedMeshes['headlights'].forEach(hl => hl.material.opacity = 0.3); // Dim
            bodyGroup.position.y = 2.2; // No vibration
        }
    };

    group.userData.parts = parts;
    return group;
}
