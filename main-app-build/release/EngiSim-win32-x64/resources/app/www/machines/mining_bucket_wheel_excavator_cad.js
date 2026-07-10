import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.6 });
    const dirtMaterial = new THREE.MeshPhysicalMaterial({ color: 0x5c4033, metalness: 0.0, roughness: 1.0 }); // Dirt/Lignite
    const yellowPaint = new THREE.MeshPhysicalMaterial({ color: 0xd4a017, metalness: 0.1, roughness: 0.7, clearcoat: 0.1 });
    const beltRubber = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.0, roughness: 0.9 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.crawlerTracks = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Crawler Base & Slewing Ring
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Massive tracked undercarriage (6 sets of twin crawlers)
    const trackGeo = new THREE.BoxGeometry(0.8, 0.4, 2.5);
    const trackLayout = [
        [-1.5, 2.0], [1.5, 2.0],
        [-2.0, 0],   [2.0, 0],
        [-1.5, -2.0], [1.5, -2.0]
    ];
    
    trackLayout.forEach(pos => {
        const trackAssy = new THREE.Group();
        const mainTrack = new THREE.Mesh(trackGeo, darkSteel);
        trackAssy.add(mainTrack);
        
        // Track texture/tread simulation via displacement or we can just animate the UVs later
        // Let's store the material so we can scroll it
        const treadMat = beltRubber.clone();
        mainTrack.material = treadMat;
        group.userData.animatedMeshes.crawlerTracks.push(treadMat);
        
        trackAssy.position.set(pos[0], 0.2, pos[1]);
        baseGroup.add(trackAssy);
    });

    // Central Platform
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, 0.5, 16), heavySteel);
    platform.position.set(0, 0.65, 0);
    baseGroup.add(platform);
    
    // Slewing Ring (allows 360 degree rotation of superstructure)
    const slewRing = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32), chrome);
    slewRing.position.set(0, 1.0, 0);
    baseGroup.add(slewRing);
    
    group.add(baseGroup);
    parts.push({ mesh: baseGroup, name: "Crawler Undercarriage", description: "6-bogie tracked base and slew ring.", function: "Distributes the 14,200-ton weight across the ground to prevent sinking."});

    // ==========================================
    // 2. PROCEDURAL CAD: Superstructure & Lattice Mast
    // ==========================================
    const superstructure = new THREE.Group();
    superstructure.position.set(0, 1.15, 0);
    
    // Main Body House
    const house = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 3.5), yellowPaint);
    house.position.set(0, 0.75, 0);
    superstructure.add(house);
    
    // Counterweight Boom
    const cwBoom = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 5.0), yellowPaint);
    cwBoom.position.set(0, 0.25, 3.0);
    const counterWeight = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.5), darkSteel);
    counterWeight.position.set(0, -0.5, 5.0);
    superstructure.add(cwBoom, counterWeight);

    // Lattice Pylon (Mast)
    const mast = new THREE.Group();
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(Math.PI/12), yellowPaint);
    leg1.position.set(-0.8, 2.0, -0.5);
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(Math.PI/12), yellowPaint);
    leg2.position.set(0.8, 2.0, -0.5);
    const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(-Math.PI/12), yellowPaint);
    leg3.position.set(-0.8, 2.0, 1.5);
    const leg4 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(-Math.PI/12), yellowPaint);
    leg4.position.set(0.8, 2.0, 1.5);
    mast.add(leg1, leg2, leg3, leg4);
    
    // Cross bracing
    for(let i=0; i<4; i++) {
        const brace = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.05), yellowPaint);
        brace.position.set(0, 0.8 + i*0.8, 0.5);
        mast.add(brace);
    }
    superstructure.add(mast);

    group.add(superstructure);
    group.userData.animatedMeshes['superstructure'] = superstructure;
    
    parts.push({ mesh: house, name: "Slewing Superstructure", description: "Main equipment house and counterweight boom.", function: "Balances the massive bucket wheel arm and houses the drive motors."});

    // ==========================================
    // 3. PROCEDURAL CAD: Bucket Wheel Boom & Conveyor
    // ==========================================
    // Luffing Boom (pivots up and down)
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 1.0, -1.0); // Pivot point
    
    // Lattice boom structure
    const boomFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 8.0), yellowPaint);
    boomFrame.position.set(0, 0, -4.0);
    boomGroup.add(boomFrame);
    
    // Suspension Cables (Tension rods) from mast to boom
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const cable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7.0).rotateX(-Math.PI/4), cableMat);
    cable1.position.set(-0.4, 2.5, -2.5);
    const cable2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7.0).rotateX(-Math.PI/4), cableMat);
    cable2.position.set(0.4, 2.5, -2.5);
    superstructure.add(cable1, cable2);

    // Boom Conveyor Belt
    const boomConveyor = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 7.8).rotateX(-Math.PI/2), beltRubber.clone());
    boomConveyor.position.set(0, 0.55, -4.0);
    boomGroup.add(boomConveyor);
    group.userData.animatedMeshes['boomConveyor'] = boomConveyor.material;

    // Dirt flow VFX on the conveyor
    const dirtFlow = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 7.5).rotateX(-Math.PI/2), dirtMaterial.clone());
    dirtFlow.position.set(0, 0.58, -4.0);
    dirtFlow.material.transparent = true;
    dirtFlow.material.opacity = 0;
    boomGroup.add(dirtFlow);
    group.userData.animatedMeshes['dirtFlow'] = dirtFlow;

    // ==========================================
    // 4. PROCEDURAL CAD: The Bucket Wheel
    // ==========================================
    const wheelGroup = new THREE.Group();
    
    // Massive wheel core
    const wheelCore = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32).rotateZ(Math.PI/2), darkSteel);
    wheelGroup.add(wheelCore);
    
    // 12 Excavator Buckets
    const bucketCount = 12;
    for (let i = 0; i < bucketCount; i++) {
        const bucketAssy = new THREE.Group();
        
        // Scoop
        const scoopGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16, 1, true, 0, Math.PI);
        const scoop = new THREE.Mesh(scoopGeo, yellowPaint);
        scoop.material.side = THREE.DoubleSide;
        
        // Bucket teeth
        for(let t=0; t<4; t++) {
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 4).rotateX(Math.PI/2), steel);
            tooth.position.set(-0.2 + (t*0.13), 0.3, 0.25);
            scoop.add(tooth);
        }
        
        bucketAssy.add(scoop);
        
        // Position on wheel
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI * 2) / bucketCount;
        bucketAssy.position.set(0, 1.65, 0); // Out from center
        bucketAssy.rotation.x = -Math.PI / 4; // Angled to dig
        
        pivot.add(bucketAssy);
        wheelGroup.add(pivot);
    }
    
    wheelGroup.position.set(0, 0, -8.0); // End of the boom
    boomGroup.add(wheelGroup);
    group.userData.animatedMeshes['bucketWheel'] = wheelGroup;

    superstructure.add(boomGroup);
    
    parts.push({ mesh: boomFrame, name: "Luffing Boom & Conveyor", description: "Lattice girder boom housing the primary rubber belt.", function: "Carries excavated dirt from the wheel back to the main transfer station."});
    parts.push({ mesh: wheelGroup, name: "Rotary Bucket Wheel", description: "21-meter diameter wheel with 12 reinforced digging buckets.", function: "Tears into the earth, capable of moving 240,000 tons of coal per day."});

    // ==========================================
    // 5. Factual Fasteners (14,500 parts)
    // ==========================================
    const boltCount = 14500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 5000) {
            // Lattice Mast joints
            dummy.position.set((Math.random()-0.5)*2, Math.random()*4 + 1.5, (Math.random()-0.5)*2);
        } else if (i < 10000) {
            // Boom trusses
            dummy.position.set((Math.random()-0.5)*1.0, Math.random()*1.0 + 1.0, -Math.random()*8.0);
        } else {
            // Undercarriage track frames
            dummy.position.set((Math.random()-0.5)*4.5, 0.2 + (Math.random()-0.5)*0.3, (Math.random()-0.5)*4.5);
        }
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "14,500 Structural Rivets", description: "Factual quantity of instanced heavy-duty rivets.", function: "Holds the immense steel lattice structures together under extreme cantilever loads." });
    
    // Scale adjustment (This thing is massive)
    group.scale.set(0.12, 0.12, 0.12);
    group.position.y = -0.5;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle * 0.5;
            
            // Bucket Wheel slowly tears into earth
            group.userData.animatedMeshes['bucketWheel'].rotation.x -= speed;
            
            // Conveyor belt rolls
            group.userData.animatedMeshes['boomConveyor'].map && (group.userData.animatedMeshes['boomConveyor'].map.offset.y -= speed * 2);
            
            // Dirt flows down the belt
            group.userData.animatedMeshes['dirtFlow'].opacity = 1.0;
            
            // Superstructure slowly slews left and right to sweep the mining face
            group.userData.animatedMeshes['superstructure'].rotation.y = Math.sin(timeAcc * 0.1) * 0.3;
            
            // Tracks slowly creep forward
            group.userData.animatedMeshes.crawlerTracks.forEach(mat => {
                if(mat.map) mat.map.offset.y += speed * 0.1;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes['dirtFlow'].opacity = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
