import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const aerospaceWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.1 }); // The chassis panels
    const goldFoil = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.3, clearcoat: 0.5 }); // Thermal protection
    const blackTitanium = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.6 }); // Suspension tubes
    const machinedAl = new THREE.MeshPhysicalMaterial({ color: 0xa0a0a0, metalness: 0.9, roughness: 0.4 }); // Wheels
    const rtgFins = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.8 }); // Radiator fins on the power source
    
    // VFX Materials
    const laserVFX = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // SuperCam laser
    const rtgHeat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Plutonium decay heat

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.wheels = [];
    group.userData.animatedMeshes.bogieJoints = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Chassis (WEB) & RTG
    // ==========================================
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 1.2, 0); // Ride height
    group.userData.animatedMeshes['body'] = bodyGroup;
    
    // The Warm Electronics Box (WEB)
    const webGeo = new THREE.BoxGeometry(1.5, 0.6, 2.2);
    const web = new THREE.Mesh(webGeo, aerospaceWhite);
    bodyGroup.add(web);
    
    // Thermal blanket draped over the top
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 2.25), goldFoil);
    blanket.position.set(0, 0.32, 0);
    bodyGroup.add(blanket);
    
    // The Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)
    // Sits on the back, powers the rover with Plutonium-238 decay
    const rtgGroup = new THREE.Group();
    rtgGroup.position.set(0, 0.2, -1.3);
    
    const rtgCore = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16).rotateX(Math.PI/2), blackTitanium);
    rtgGroup.add(rtgCore);
    
    // Heat radiator fins
    for(let i=0; i<16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.8), rtgFins);
        fin.rotation.z = angle;
        rtgGroup.add(fin);
    }
    
    // RTG Heat glow (VFX representing the 2000W of thermal power inside)
    const heatGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 16).rotateX(Math.PI/2), rtgHeat);
    rtgGroup.add(heatGlow);
    group.userData.animatedMeshes['heatGlow'] = heatGlow;
    
    bodyGroup.add(rtgGroup);
    
    parts.push({ mesh: rtgCore, name: "MMRTG Power System", description: "Radioisotope Thermoelectric Generator.", function: "Converts the heat from decaying Plutonium-238 directly into electricity, powering the rover day and night."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Mast & SuperCam
    // ==========================================
    const mastGroup = new THREE.Group();
    mastGroup.position.set(0.6, 0.3, 0.8); // Mounted on the front right corner
    
    // The mast pole
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), aerospaceWhite);
    mast.position.set(0, 0.6, 0);
    mastGroup.add(mast);
    
    // The "Head" (NavCams, Mastcam-Z, SuperCam)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.3, 0);
    
    const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), aerospaceWhite);
    headGroup.add(headBox);
    
    // SuperCam Lens (Large center lens)
    const superCam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05).rotateX(Math.PI/2), glass);
    superCam.position.set(0, 0, 0.16);
    headGroup.add(superCam);
    
    // SuperCam Laser VFX
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 4.0).rotateX(Math.PI/2), laserVFX);
    laser.position.set(0, 0, 2.16);
    headGroup.add(laser);
    group.userData.animatedMeshes['laser'] = laser;
    
    mastGroup.add(headGroup);
    group.userData.animatedMeshes['mastHead'] = headGroup;
    bodyGroup.add(mastGroup);
    
    parts.push({ mesh: headBox, name: "SuperCam & Mastcam-Z", description: "Advanced sensor head.", function: "Fires a pulsed laser to vaporize rock targets up to 7 meters away and analyzes the resulting plasma to determine chemical composition."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Rocker-Bogie Suspension
    // ==========================================
    const suspensionGroup = new THREE.Group();
    
    for(let side of [-1, 1]) {
        // The "Rocker" connects to the main body via a differential
        const rockerGroup = new THREE.Group();
        rockerGroup.position.set(side * 1.0, 1.2, 0);
        
        // Rocker Tube (runs from the main joint back to the rear wheel)
        const rockerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5).rotateX(Math.PI/2), blackTitanium);
        rockerTube.position.set(0, -0.2, -0.7);
        rockerTube.rotation.x = -Math.PI/8; // Angles down towards the rear
        rockerGroup.add(rockerTube);
        
        // Rear Wheel (Attached to end of Rocker)
        const rearWheelGroup = new THREE.Group();
        rearWheelGroup.position.set(0, -0.7, -1.4);
        createWheel(rearWheelGroup, machinedAl, blackTitanium);
        rockerGroup.add(rearWheelGroup);
        
        // Front tube going to the Bogie joint
        const frontTube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8).rotateX(Math.PI/2), blackTitanium);
        frontTube.position.set(0, -0.2, 0.4);
        frontTube.rotation.x = Math.PI/4; // Angles down towards the front
        rockerGroup.add(frontTube);
        
        // The "Bogie" connects the front and middle wheels
        const bogieGroup = new THREE.Group();
        bogieGroup.position.set(0, -0.4, 0.7); // Bogie joint location
        
        const bogieTube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6).rotateX(Math.PI/2), blackTitanium);
        bogieGroup.add(bogieTube);
        
        // Middle Wheel
        const midWheelGroup = new THREE.Group();
        midWheelGroup.position.set(0, -0.3, -0.8);
        createWheel(midWheelGroup, machinedAl, blackTitanium);
        bogieGroup.add(midWheelGroup);
        
        // Front Wheel
        const frontWheelGroup = new THREE.Group();
        frontWheelGroup.position.set(0, -0.3, 0.8);
        createWheel(frontWheelGroup, machinedAl, blackTitanium);
        bogieGroup.add(frontWheelGroup);
        
        rockerGroup.add(bogieGroup);
        suspensionGroup.add(rockerGroup);
        
        // Store for animation
        group.userData.animatedMeshes.bogieJoints.push({ rocker: rockerGroup, bogie: bogieGroup, side: side });
    }

    // Connect the two rockers via a differential bar across the top
    const diffBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0).rotateZ(Math.PI/2), blackTitanium);
    diffBar.position.set(0, 1.6, 0);
    suspensionGroup.add(diffBar);
    group.userData.animatedMeshes['diffBar'] = diffBar;

    group.add(suspensionGroup);
    
    parts.push({ mesh: suspensionGroup.children[0], name: "Rocker-Bogie Suspension", description: "Passive suspension system utilizing no springs or stub axles.", function: "Maintains almost equal weight on all six wheels while climbing over rocks twice the wheel diameter."});

    function createWheel(parentGroup, wheelMat, spokeMat) {
        // Machined Aluminum Wheel (very thin, ridged)
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32).rotateZ(Math.PI/2), wheelMat);
        
        // Spokes (Curved titanium for shock absorption)
        const spokes = new THREE.Group();
        for(let i=0; i<6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.02), spokeMat);
            spoke.position.set(0, 0.15 * Math.sin(angle), 0.15 * Math.cos(angle));
            spoke.rotation.x = -angle;
            
            // Add a slight curve to the spoke
            // (We fake it here with a straight box, but it represents the curved cleats)
            spokes.add(spoke);
        }
        
        parentGroup.add(wheel, spokes);
        group.userData.animatedMeshes.wheels.push(parentGroup);
    }

    // ==========================================
    // 4. PROCEDURAL CAD: The Robotic Arm (Sample Caching)
    // ==========================================
    const roboticArm = new THREE.Group();
    roboticArm.position.set(0, 1.2, 1.1); // Front center of the body
    
    const armJ1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), blackTitanium);
    roboticArm.add(armJ1);
    
    const armLink1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0).rotateX(Math.PI/2), aerospaceWhite);
    armLink1.position.set(0, 0.2, 0.5);
    roboticArm.add(armLink1);
    
    // ... we won't fully rig the arm, just have it in a folded state
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), darkSteel);
    turret.position.set(0, 0.3, 1.0);
    turret.rotation.x = Math.PI/2;
    roboticArm.add(turret);
    
    group.add(roboticArm);

    // ==========================================
    // 5. Factual Fasteners (7,800 parts)
    // ==========================================
    const boltCount = 7800;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        if (i < 3000) {
            // Wheel cleats/spoke fasteners (500 per wheel * 6 wheels)
            const wheelIndex = Math.floor(i / 500);
            const side = wheelIndex < 3 ? -1 : 1;
            // Map wheelIndex 0,1,2 to Rear, Mid, Front
            const wPosIndex = wheelIndex % 3;
            let wz = 0;
            let wy = 0;
            if (wPosIndex === 0) { wz = -1.4; wy = -0.7; }
            else if (wPosIndex === 1) { wz = -0.1; wy = -0.7; }
            else { wz = 1.5; wy = -0.7; }
            
            const angle = Math.random() * Math.PI * 2;
            const r = 0.28;
            dummy.position.set(side * 1.0 + (Math.random()-0.5)*0.2, 1.2 + wy + r*Math.cos(angle), wz + r*Math.sin(angle));
            dummy.rotation.set(angle, 0, 0); 
        } else {
            // Chassis / WEB bolts
            dummy.position.set((Math.random() - 0.5) * 1.5, 1.2 + (Math.random() * 0.6), (Math.random() - 0.5) * 2.2);
            dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "7,800 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the rover components, engineered to withstand the violent Entry, Descent, and Landing (Skycrane) maneuver." });
    
    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    group.position.y = 0.6; 
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // RTG Heat always pulses slightly (decaying plutonium never stops)
        group.userData.animatedMeshes['heatGlow'].material.opacity = 0.3 + Math.sin(timeAcc * 2.0) * 0.1;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Driving forward slowly (Mars rovers top speed is ~150 meters per hour)
            const wheelSpeed = 1.5 * speed;
            group.userData.animatedMeshes.wheels.forEach(wheel => {
                wheel.rotation.x += 0.02 * wheelSpeed;
            });
            
            // Simulating driving over extremely rocky Martian terrain
            // We animate the rocker-bogie joints to show how it absorbs the terrain
            const terrainX1 = Math.sin(timeAcc * 1.0 * speed) * 0.2;
            const terrainX2 = Math.cos(timeAcc * 0.8 * speed) * 0.15;
            
            group.userData.animatedMeshes.bogieJoints.forEach(joint => {
                // Rocker pivots
                joint.rocker.rotation.x = joint.side === 1 ? terrainX1 : terrainX2;
                
                // Bogie pivots independently to accommodate the front two wheels
                joint.bogie.rotation.x = Math.sin(timeAcc * 2.0 * speed + (joint.side*Math.PI)) * 0.3;
            });
            
            // The differential bar tilts opposite to the average rocker angle to keep the body flat
            group.userData.animatedMeshes['diffBar'].rotation.z = (terrainX1 - terrainX2) * 0.5;
            // The main body pitches based on the differential
            group.userData.animatedMeshes['body'].rotation.x = (terrainX1 + terrainX2) * 0.2;
            
            // SuperCam Laser Firing
            // The mast head looks around, then fires a laser pulse
            const headYaw = Math.sin(timeAcc * 0.5 * speed) * 0.5;
            const headPitch = Math.cos(timeAcc * 0.3 * speed) * 0.2;
            group.userData.animatedMeshes['mastHead'].rotation.y = headYaw;
            group.userData.animatedMeshes['mastHead'].rotation.x = headPitch;
            
            // Pulse the laser rapidly
            if (Math.sin(timeAcc * 10 * speed) > 0.8) {
                group.userData.animatedMeshes['laser'].material.opacity = 0.8;
            } else {
                group.userData.animatedMeshes['laser'].material.opacity = 0.0;
            }
            
        } else {
            // Idle
            group.userData.animatedMeshes['laser'].material.opacity = 0;
            
            // Smoothly return suspension to flat
            group.userData.animatedMeshes.bogieJoints.forEach(joint => {
                joint.rocker.rotation.x *= 0.95;
                joint.bogie.rotation.x *= 0.95;
            });
            group.userData.animatedMeshes['diffBar'].rotation.z *= 0.95;
            group.userData.animatedMeshes['body'].rotation.x *= 0.95;
            group.userData.animatedMeshes['mastHead'].rotation.y *= 0.95;
            group.userData.animatedMeshes['mastHead'].rotation.x *= 0.95;
        }
    };

    group.userData.parts = parts;
    return group;
}
