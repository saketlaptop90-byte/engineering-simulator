import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const statiteHullMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.9, roughness: 0.3 }); // Carbon-tungsten alloy
    const magneticRailMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }); // Superconducting tracks
    const heatRadiatorMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 }); // Graphene radiators
    
    // VFX Materials
    const eventHorizonVFX = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Perfectly black
    const photonSphereVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Bent light
    const accretionDiskVFX = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }); // Superheated plasma
    const penroseEnergyVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Extracted rotational energy

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.disk = null;
    group.userData.animatedMeshes.photonSphere = null;
    group.userData.animatedMeshes.statites = [];
    group.userData.animatedMeshes.energyBeams = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Black Hole (Kerr Metric)
    // ==========================================
    const bhGroup = new THREE.Group();
    
    // The Event Horizon (Perfectly Black Sphere)
    const eventHorizon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), eventHorizonVFX);
    bhGroup.add(eventHorizon);
    
    // The Photon Sphere (Light bent in a perfect circle around the BH)
    const photonSphere = new THREE.Mesh(new THREE.SphereGeometry(0.75, 64, 64), photonSphereVFX);
    bhGroup.add(photonSphere);
    group.userData.animatedMeshes.photonSphere = photonSphere;
    
    // The Accretion Disk (Superheated gas falling in)
    const diskGeo = new THREE.RingGeometry(0.8, 3.0, 64);
    const disk = new THREE.Mesh(diskGeo, accretionDiskVFX);
    disk.rotation.x = -Math.PI/2;
    bhGroup.add(disk);
    group.userData.animatedMeshes.disk = disk;
    
    group.add(bhGroup);
    parts.push({ mesh: eventHorizon, name: "Kerr Black Hole (Singularity)", description: "A rapidly rotating stellar-mass black hole.", function: "Provides an immense reservoir of rotational energy within its ergosphere that can be harvested."});

    // ==========================================
    // 2. PROCEDURAL CAD: Penrose Process Statites
    // ==========================================
    // Satellites that hover just outside the event horizon using light pressure (Statites)
    const harvesterGroup = new THREE.Group();
    
    // Create 4 massive statites orbiting in the ergosphere
    for(let i=0; i<4; i++) {
        const statite = new THREE.Group();
        const angle = (i * Math.PI * 2) / 4;
        
        // They orbit very close, just outside the disk plane
        const r = 1.2;
        const yOff = (i%2===0) ? 0.3 : -0.3; // Staggered above/below disk
        statite.position.set(r * Math.cos(angle), yOff, r * Math.sin(angle));
        statite.rotation.y = -angle; // Face the singularity
        
        // Main Body (Tungsten hull)
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4).rotateX(Math.PI/2), statiteHullMat);
        statite.add(body);
        
        // Magnetic Confinement Rails (Fires mass into the ergosphere)
        const rails = new THREE.Group();
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.6), magneticRailMat);
        rail1.position.set(0.05, 0, 0.1);
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.6), magneticRailMat);
        rail2.position.set(-0.05, 0, 0.1);
        rails.add(rail1, rail2);
        // Angle the rails slightly forward in the direction of rotation (Penrose process)
        rails.rotation.y = -Math.PI/8;
        statite.add(rails);
        
        // Massive Graphene Radiators (Dumping heat)
        for(let j=0; j<2; j++) {
            const rad = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), heatRadiatorMat);
            rad.position.y = (j===0) ? 0.2 : -0.2;
            rad.rotation.x = Math.PI/2;
            statite.add(rad);
        }
        
        // Energy Beam VFX (The harvested energy beaming away)
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 4.0).rotateX(Math.PI/2), penroseEnergyVFX);
        beam.position.set(0, 0, -2.0); // Shoots outward
        statite.add(beam);
        group.userData.animatedMeshes.energyBeams.push(beam);
        
        harvesterGroup.add(statite);
        group.userData.animatedMeshes.statites.push({ mesh: statite, angle: angle, r: r, y: yOff });
    }
    
    group.add(harvesterGroup);
    parts.push({ mesh: harvesterGroup.children[0].children[0], name: "Penrose Process Statite", description: "Stationary-orbit harvester protected by tungsten-carbon hulls.", function: "Drops mass into the black hole's ergosphere. The mass splits; one half falls in, the other escapes with more energy than it started with, harvesting the black hole's rotation."});

    // Scale adjustment
    group.scale.set(0.5, 0.5, 0.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Accretion Disk spins rapidly (inner parts spin faster)
            group.userData.animatedMeshes.disk.material.opacity = 0.7 + (Math.sin(timeAcc * 10 * speed) * 0.1);
            // Simulate differential rotation with texture coordinates (if mapped), but here we just spin it
            group.userData.animatedMeshes.disk.rotation.z -= 0.2 * speed; // Negative because it's rotated -PI/2 on X
            
            // 2. Photon Sphere glows
            group.userData.animatedMeshes.photonSphere.material.opacity = 0.2 + (Math.sin(timeAcc * 5.0) * 0.1 * speed);
            
            // 3. Statites orbit at relativistic speeds (visualized slower)
            group.userData.animatedMeshes.statites.forEach((sData, index) => {
                sData.angle += 1.5 * speed * 0.016; // Orbit speed
                if (sData.angle > Math.PI * 2) sData.angle -= Math.PI * 2;
                
                sData.mesh.position.set(sData.r * Math.cos(sData.angle), sData.y, sData.r * Math.sin(sData.angle));
                sData.mesh.rotation.y = -sData.angle; // Keep facing center
            });
            
            // 4. Penrose Energy Beams fire outward
            group.userData.animatedMeshes.energyBeams.forEach(beam => {
                beam.material.opacity = 0.8 + (Math.random() * 0.2);
                beam.scale.x = 1.0 + (Math.random() * 0.5 * speed);
                beam.scale.z = 1.0 + (Math.random() * 0.5 * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.disk.material.opacity = 0.1;
            group.userData.animatedMeshes.photonSphere.material.opacity = 0;
            group.userData.animatedMeshes.energyBeams.forEach(beam => beam.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
