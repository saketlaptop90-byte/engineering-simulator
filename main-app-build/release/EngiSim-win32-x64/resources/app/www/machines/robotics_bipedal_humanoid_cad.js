import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const chassisAl = new THREE.MeshPhysicalMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.3 }); // Lightweight aerospace aluminum
    const actuatorBlack = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.6 }); // Hydraulic/Electric actuators
    const hydraulicChrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05 }); // Piston rods
    const batteryPack = new THREE.MeshPhysicalMaterial({ color: 0x3344aa, metalness: 0.3, roughness: 0.7 }); // Lithium-ion enclosure
    const sensorGlass = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.0, clearcoat: 1.0 }); // LiDAR / Vision sensors
    
    // VFX Materials
    const lidarBeam = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.legs = [];
    group.userData.animatedMeshes.arms = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Torso & Head
    // ==========================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.8, 0); // Hips at Y=1.8
    group.userData.animatedMeshes['torso'] = torsoGroup;
    
    // Core Chassis (Spine/Pelvis)
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), chassisAl);
    torsoGroup.add(pelvis);
    
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8), actuatorBlack);
    spine.position.set(0, 0.6, 0);
    torsoGroup.add(spine);
    
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.6), chassisAl);
    chest.position.set(0, 1.1, 0.05);
    torsoGroup.add(chest);
    
    // Battery Backpack (Huge power draw for hydraulics)
    const battery = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), batteryPack);
    battery.position.set(0, 1.0, -0.4);
    torsoGroup.add(battery);
    
    // Head / Sensor Suite
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.6, 0.1);
    
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2), actuatorBlack);
    neck.position.set(0, -0.15, 0);
    headGroup.add(neck);
    
    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), chassisAl);
    headGroup.add(skull);
    
    // Stereo Vision & LiDAR
    const eye1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1).rotateX(Math.PI/2), sensorGlass); eye1.position.set(-0.1, 0.05, 0.2);
    const eye2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1).rotateX(Math.PI/2), sensorGlass); eye2.position.set(0.1, 0.05, 0.2);
    const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1).rotateX(Math.PI/2), sensorGlass); lidar.position.set(0, -0.1, 0.2);
    headGroup.add(eye1, eye2, lidar);
    
    // LiDAR VFX cone
    const lidarVFX = new THREE.Mesh(new THREE.ConeGeometry(3.0, 5.0, 32, 1, true).rotateX(-Math.PI/2), lidarBeam);
    lidarVFX.position.set(0, -0.1, 2.7); // project forward
    headGroup.add(lidarVFX);
    group.userData.animatedMeshes['lidarVFX'] = lidarVFX;
    group.userData.animatedMeshes['head'] = headGroup;
    
    torsoGroup.add(headGroup);
    group.add(torsoGroup);
    
    parts.push({ mesh: headGroup, name: "Perception & Compute Suite", description: "Houses real-time kinematic solvers and LiDAR.", function: "Processes environmental data in milliseconds to maintain dynamic balance while walking."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Arms (Manipulators)
    // ==========================================
    for(let side of [-1, 1]) {
        const armGroup = new THREE.Group();
        armGroup.position.set(side * 0.55, 1.2, 0); // Attach to shoulders
        
        // Shoulder Yaw/Pitch
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), actuatorBlack);
        armGroup.add(shoulder);
        
        // Upper Arm
        const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chassisAl);
        bicep.position.set(side * 0.1, -0.3, 0);
        armGroup.add(bicep);
        
        // Elbow
        const elbowGroup = new THREE.Group();
        elbowGroup.position.set(side * 0.1, -0.6, 0);
        
        const elbowJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18).rotateZ(Math.PI/2), actuatorBlack);
        elbowGroup.add(elbowJoint);
        
        // Lower Arm
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6), chassisAl);
        forearm.position.set(0, -0.35, 0);
        elbowGroup.add(forearm);
        
        // Gripper (Wrist)
        const wrist = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.1), darkSteel);
        wrist.position.set(0, -0.7, 0);
        elbowGroup.add(wrist);
        
        armGroup.add(elbowGroup);
        torsoGroup.add(armGroup);
        
        group.userData.animatedMeshes.arms.push({ shoulder: armGroup, elbow: elbowGroup, side: side });
    }

    // ==========================================
    // 3. PROCEDURAL CAD: The Legs (Kinematic Locomotion)
    // ==========================================
    for(let side of [-1, 1]) {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 0.3, 0, 0); // Attach to pelvis (0,0,0 relative to torsoGroup)
        
        // Hip Joint (3 DoF)
        const hipYaw = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2).rotateX(Math.PI/2), actuatorBlack);
        legGroup.add(hipYaw);
        
        // Upper Leg (Femur)
        const femur = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.25), chassisAl);
        femur.position.set(0, -0.4, 0.05);
        legGroup.add(femur);
        
        // Hydraulic actuator for the knee
        const hipPistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), darkSteel);
        hipPistonOuter.position.set(0, -0.5, 0.2);
        hipPistonOuter.rotation.x = -Math.PI/8;
        legGroup.add(hipPistonOuter);
        
        // Knee Joint
        const kneeGroup = new THREE.Group();
        kneeGroup.position.set(0, -0.85, 0.1);
        
        const knee = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25).rotateZ(Math.PI/2), actuatorBlack);
        kneeGroup.add(knee);
        
        // Lower Leg (Tibia)
        const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.8), chassisAl);
        tibia.position.set(0, -0.4, 0);
        kneeGroup.add(tibia);
        
        // Ankle & Foot
        const ankleGroup = new THREE.Group();
        ankleGroup.position.set(0, -0.85, 0);
        
        const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), actuatorBlack);
        ankleGroup.add(ankle);
        
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.45), rubber);
        foot.position.set(0, -0.1, 0.1); // Stick out front
        ankleGroup.add(foot);
        
        kneeGroup.add(ankleGroup);
        legGroup.add(kneeGroup);
        torsoGroup.add(legGroup);
        
        group.userData.animatedMeshes.legs.push({ hip: legGroup, knee: kneeGroup, ankle: ankleGroup, side: side });
    }
    
    parts.push({ mesh: torsoGroup.children[0], name: "Hydraulic Kinematic Legs", description: "Bipedal legs with custom high-performance hydraulic actuators.", function: "Provides the immense torque required to jump, run, and catch itself when falling."});

    // ==========================================
    // 4. Factual Fasteners (4,500 parts)
    // ==========================================
    const boltCount = 4500;
    const boltGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.016, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        // Distribute heavily around the pelvis and joints
        if (i < 1500) {
            // Pelvis structural bolts
            dummy.position.set((Math.random()-0.5)*0.8, 1.8 + (Math.random()-0.5)*0.4, (Math.random()-0.5)*0.5);
            dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        } else if (i < 3000) {
            // Knee/Elbow joint bolts
            const isKnee = Math.random() > 0.5;
            const side = Math.random() > 0.5 ? 1 : -1;
            if (isKnee) {
                dummy.position.set(side * 0.3 + (Math.random()-0.5)*0.15, 0.95 + (Math.random()-0.5)*0.15, 0.1 + (Math.random()-0.5)*0.15); // Knee height
            } else {
                dummy.position.set(side * 0.55 + (Math.random()-0.5)*0.1, 1.2 - 0.6 + (Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1); // Elbow height
            }
            dummy.rotation.set(0, 0, Math.random()*Math.PI);
        } else {
            // Torso/Backpack mounting bolts
            dummy.position.set((Math.random()-0.5)*0.9, 2.9 + (Math.random()-0.5)*0.6, 0.05 + (Math.random()-0.5)*0.6);
            dummy.rotation.set(Math.PI/2, 0, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "4,500 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Must withstand the massive impulse forces generated when the 80kg robot lands a jump or catches its balance." });
    
    // Scale adjustment
    group.scale.set(1.2, 1.2, 1.2);
    group.position.y = 1.0; // Raise slightly above ground
    
    // Dynamic Animation Loop - Bipedal Walk Cycle
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            const cycle = timeAcc * 3.0 * speed; // Walking speed
            
            // LiDAR spins rapidly and shoots a beam
            group.userData.animatedMeshes['head'].children[2].rotation.z = timeAcc * 20 * speed;
            group.userData.animatedMeshes['lidarVFX'].material.opacity = 0.2 + (Math.sin(timeAcc * 50) * 0.1);
            
            // Head looks around to "balance"
            group.userData.animatedMeshes['head'].rotation.y = Math.sin(timeAcc * 1.5 * speed) * 0.3;
            
            // Torso bobbing (Inverse Kinematics approximation)
            // As legs step, torso goes up and down
            const bob = Math.abs(Math.cos(cycle)) * 0.15;
            group.userData.animatedMeshes['torso'].position.y = 1.8 - bob;
            
            // Torso swaying (shift weight over the planted foot)
            const sway = Math.cos(cycle) * 0.05;
            group.userData.animatedMeshes['torso'].position.x = sway;
            
            // Leg Animation (Walk Cycle)
            group.userData.animatedMeshes.legs.forEach(leg => {
                // Offset the left leg by half a cycle (PI)
                const offset = leg.side === 1 ? 0 : Math.PI;
                const phase = cycle + offset;
                
                // Hip swings forward and back
                const hipAngle = Math.sin(phase) * 0.6;
                leg.hip.rotation.x = hipAngle;
                
                // Knee bends (Only bends backwards, max when lifting foot)
                // When phase is between 0 and PI, leg is swinging forward (bend knee)
                // When phase is between PI and 2PI, leg is planted (knee relatively straight, bearing weight)
                let kneeAngle = 0;
                const normPhase = phase % (Math.PI * 2);
                if (normPhase >= 0 && normPhase < Math.PI) {
                    // Swing phase
                    kneeAngle = Math.sin(normPhase) * 1.2;
                } else {
                    // Stance phase (slight bend to absorb shock)
                    kneeAngle = 0.2 - Math.sin(normPhase) * 0.1;
                }
                leg.knee.rotation.x = kneeAngle;
                
                // Ankle tries to keep the foot flat on the ground
                leg.ankle.rotation.x = -hipAngle - kneeAngle;
            });
            
            // Arm Animation (Counter-swing)
            group.userData.animatedMeshes.arms.forEach(arm => {
                // Arms swing opposite to the legs
                const offset = arm.side === 1 ? Math.PI : 0;
                const phase = cycle + offset;
                
                arm.shoulder.rotation.x = Math.sin(phase) * 0.5;
                // Keep elbows slightly bent
                arm.elbow.rotation.x = -0.3 + Math.sin(phase) * 0.2;
            });
            
        } else {
            // Idle (Squat slightly in a stable stance)
            group.userData.animatedMeshes['lidarVFX'].material.opacity = 0;
            
            // Smoothly return to idle pose
            group.userData.animatedMeshes['torso'].position.y = 1.6; // Squat down
            group.userData.animatedMeshes['torso'].position.x = 0;
            group.userData.animatedMeshes['head'].rotation.y = 0;
            
            group.userData.animatedMeshes.legs.forEach(leg => {
                leg.hip.rotation.x = 0.3; // Lean forward
                leg.knee.rotation.x = 0.6; // Bend knees
                leg.ankle.rotation.x = -0.9; // Feet flat
            });
            
            group.userData.animatedMeshes.arms.forEach(arm => {
                arm.shoulder.rotation.x = -0.2;
                arm.elbow.rotation.x = -0.4;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
