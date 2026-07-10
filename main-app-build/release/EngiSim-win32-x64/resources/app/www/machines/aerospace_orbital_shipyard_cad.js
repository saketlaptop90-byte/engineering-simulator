import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const scaffoldMat = new THREE.MeshPhysicalMaterial({ color: 0x556677, metalness: 0.8, roughness: 0.6 }); // Titanium truss structures
    const hullPlateMat = new THREE.MeshPhysicalMaterial({ color: 0x99aabb, metalness: 0.7, roughness: 0.3 }); // Carbon-silicate armor plating
    const roboticArmMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.4 }); // Heavy industrial manipulators
    const fusionTugMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.5 }); // Work bees
    
    // VFX Materials
    const weldingPlasmaVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Arc welders
    const tugThrusterVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Ion drive plumes
    const dockingLightVFX = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 }); // Navigation beacons

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.arms = [];
    group.userData.animatedMeshes.welders = [];
    group.userData.animatedMeshes.tugs = [];
    group.userData.animatedMeshes.beacons = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Lattice Scaffolding & Beacons
    // ==========================================
    const scaffoldGroup = new THREE.Group();
    
    // Massive rectangular drydock frame
    const frameLength = 6.0;
    const frameWidth = 2.0;
    const frameHeight = 2.0;
    
    // Edges of the drydock
    const edges = [
        [0, frameHeight/2, frameWidth/2], [0, frameHeight/2, -frameWidth/2],
        [0, -frameHeight/2, frameWidth/2], [0, -frameHeight/2, -frameWidth/2]
    ];
    
    edges.forEach(pos => {
        // Main longitudinal beams
        const beam = new THREE.Mesh(new THREE.BoxGeometry(frameLength, 0.1, 0.1), scaffoldMat);
        beam.position.set(pos[0], pos[1], pos[2]);
        scaffoldGroup.add(beam);
        
        // Navigation beacons at the ends
        const beacon1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dockingLightVFX);
        beacon1.position.set(frameLength/2, pos[1], pos[2]);
        const beacon2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dockingLightVFX);
        beacon2.position.set(-frameLength/2, pos[1], pos[2]);
        scaffoldGroup.add(beacon1, beacon2);
        group.userData.animatedMeshes.beacons.push(beacon1, beacon2);
    });
    
    // Cross bracing (ribs)
    for(let i=0; i<7; i++) {
        const xPos = -frameLength/2 + (i * frameLength/6);
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, frameHeight + 0.1, frameWidth + 0.1), scaffoldMat);
        // Make it hollow (frame only)
        // Actually, just use 4 smaller beams for a rib
        const topRib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, frameWidth), scaffoldMat);
        topRib.position.set(xPos, frameHeight/2, 0);
        const botRib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, frameWidth), scaffoldMat);
        botRib.position.set(xPos, -frameHeight/2, 0);
        const leftRib = new THREE.Mesh(new THREE.BoxGeometry(0.1, frameHeight, 0.1), scaffoldMat);
        leftRib.position.set(xPos, 0, frameWidth/2);
        const rightRib = new THREE.Mesh(new THREE.BoxGeometry(0.1, frameHeight, 0.1), scaffoldMat);
        rightRib.position.set(xPos, 0, -frameWidth/2);
        
        scaffoldGroup.add(topRib, botRib, leftRib, rightRib);
    }
    
    group.add(scaffoldGroup);
    parts.push({ mesh: scaffoldGroup.children[0], name: "Titanium Truss Drydock", description: "Zero-G orbital assembly frame.", function: "Provides a rigid, stationary environment in high orbit for constructing megaton-class interstellar vessels."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Starship Hull & Robotic Arms
    // ==========================================
    const shipGroup = new THREE.Group();
    
    // Partially constructed hull (central spine and some armor plates)
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.0).rotateZ(Math.PI/2), scaffoldMat);
    shipGroup.add(spine);
    
    const engineBell = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.0, 16, 1, true).rotateZ(Math.PI/2), hullPlateMat);
    engineBell.position.set(-2.0, 0, 0);
    shipGroup.add(engineBell);
    
    const hullSection = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.0, 16, 1, true).rotateZ(Math.PI/2), hullPlateMat);
    hullSection.position.set(0.5, 0, 0);
    shipGroup.add(hullSection);
    
    group.add(shipGroup);
    parts.push({ mesh: hullSection, name: "Carbon-Silicate Armor Hull", description: "Partially assembled starship chassis.", function: "The massive backbone and ablative shielding of a deep-space cruiser taking shape in the yard."});

    // Robotic Assembly Arms (mounted on the scaffold ribs)
    for(let i=0; i<4; i++) {
        const armGroup = new THREE.Group();
        // Base mount
        const mount = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), roboticArmMat);
        armGroup.add(mount);
        
        // Arm Segment 1
        const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), roboticArmMat);
        seg1.position.y = 0.4;
        armGroup.add(seg1);
        
        // Joint 1
        const joint1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), steel);
        joint1.position.y = 0.8;
        armGroup.add(joint1);
        
        // Arm Segment 2 (pivots from joint 1)
        const pivotGroup = new THREE.Group();
        pivotGroup.position.y = 0.8;
        const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6), roboticArmMat);
        seg2.position.y = 0.3;
        pivotGroup.add(seg2);
        
        // Welding tip VFX
        const welder = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), weldingPlasmaVFX);
        welder.position.y = 0.6;
        pivotGroup.add(welder);
        group.userData.animatedMeshes.welders.push(welder);
        
        armGroup.add(pivotGroup);
        
        // Position them on different ribs
        const xPos = -1.5 + i;
        // Alternate top/bottom
        if(i%2 === 0) {
            armGroup.position.set(xPos, frameHeight/2, 0);
            armGroup.rotation.x = Math.PI; // pointing down
        } else {
            armGroup.position.set(xPos, -frameHeight/2, 0);
        }
        
        group.add(armGroup);
        group.userData.animatedMeshes.arms.push({ pivot: pivotGroup, phase: i * Math.PI/2 });
    }

    // ==========================================
    // 3. PROCEDURAL CAD: Fusion Tugs (Work Bees)
    // ==========================================
    for(let i=0; i<3; i++) {
        const tugGroup = new THREE.Group();
        
        // Blocky work bee hull
        const tugHull = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), fusionTugMat);
        tugGroup.add(tugHull);
        // Cockpit window
        const window = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), glass);
        window.position.set(0.151, 0.05, 0);
        window.rotation.y = Math.PI/2;
        tugGroup.add(window);
        
        // Ion Thruster VFX
        const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 8).rotateZ(Math.PI/2), tugThrusterVFX);
        thruster.position.set(-0.25, 0, 0);
        tugGroup.add(thruster);
        
        tugGroup.userData = {
            baseX: -2.0 + (i * 2.0),
            baseY: 1.5 - (i * 1.5), // some high, some low
            baseZ: 1.5,
            phase: i * Math.PI,
            thruster: thruster
        };
        
        group.add(tugGroup);
        group.userData.animatedMeshes.tugs.push(tugGroup);
    }
    
    parts.push({ mesh: group.userData.animatedMeshes.tugs[0].children[0], name: "Fusion Tug 'Work Bees'", description: "Manned orbital maneuvering vehicles.", function: "Transports massive armor plates and reactor components from the logistics hub to the scaffolding for final installation."});

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Beacons flash slowly (1Hz)
            const flash = Math.sin(timeAcc * 2) > 0 ? 0.8 : 0.0;
            group.userData.animatedMeshes.beacons.forEach(b => b.material.opacity = flash);
            
            // 2. Robotic Arms sweep back and forth (welding the hull)
            group.userData.animatedMeshes.arms.forEach(arm => {
                arm.pivot.rotation.x = Math.sin(timeAcc * 2 * speed + arm.phase) * 0.5;
                arm.pivot.rotation.z = Math.cos(timeAcc * 1.5 * speed + arm.phase) * 0.5;
            });
            
            // 3. Welding Plasma flares randomly
            group.userData.animatedMeshes.welders.forEach(w => {
                w.material.opacity = Math.random() < 0.2 * speed ? 0.9 + Math.random() : 0.0;
                w.scale.setScalar(1.0 + Math.random() * 0.5);
            });
            
            // 4. Fusion Tugs maneuver around the hull
            group.userData.animatedMeshes.tugs.forEach(tug => {
                const px = tug.userData.baseX + Math.sin(timeAcc * 0.5 * speed + tug.userData.phase) * 1.5;
                const py = tug.userData.baseY + Math.cos(timeAcc * 0.7 * speed + tug.userData.phase) * 0.5;
                // Move them
                tug.position.set(px, py, tug.userData.baseZ);
                // Thruster plume intensity
                tug.userData.thruster.material.opacity = 0.5 + (Math.random() * 0.5 * speed);
                tug.userData.thruster.scale.x = 1.0 + (Math.random() * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.beacons.forEach(b => b.material.opacity = 0.2); // Dim
            group.userData.animatedMeshes.arms.forEach(arm => {
                arm.pivot.rotation.set(0,0,0);
            });
            group.userData.animatedMeshes.welders.forEach(w => w.material.opacity = 0);
            group.userData.animatedMeshes.tugs.forEach(tug => {
                tug.position.set(tug.userData.baseX, tug.userData.baseY, tug.userData.baseZ);
                tug.userData.thruster.material.opacity = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
