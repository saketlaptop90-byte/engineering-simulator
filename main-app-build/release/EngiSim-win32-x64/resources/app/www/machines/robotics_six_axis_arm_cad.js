import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const robotOrange = new THREE.MeshPhysicalMaterial({ color: 0xff6600, metalness: 0.1, roughness: 0.3, clearcoat: 0.8 });
    const castIronBase = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.6 });
    const servoSilver = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    
    // VFX Materials
    const weldSpark = new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Base & Axis 1 (Waist)
    // ==========================================
    // Base casting
    const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.4, 32);
    const base = new THREE.Mesh(baseGeo, castIronBase);
    base.position.set(0, 0.2, 0);
    group.add(base);
    
    // Axis 1 (Waist) - Rotates around Y
    const axis1Group = new THREE.Group();
    axis1Group.position.set(0, 0.4, 0);
    
    const waistGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.8, 32);
    const waist = new THREE.Mesh(waistGeo, robotOrange);
    waist.position.set(0, 0.4, 0);
    axis1Group.add(waist);
    
    group.add(axis1Group);
    group.userData.animatedMeshes['axis1'] = axis1Group; // Rotates Y
    
    parts.push({ mesh: waist, name: "Axis 1 (Waist)", description: "Heavy-duty cast iron base and waist casting.", function: "Provides 360-degree azimuthal rotation driven by a massive cycloidal gearbox."});

    // ==========================================
    // 2. PROCEDURAL CAD: Axis 2 (Shoulder) & Axis 3 (Elbow)
    // ==========================================
    // Axis 2 (Shoulder) - Rotates around Z
    const axis2Group = new THREE.Group();
    axis2Group.position.set(0, 0.6, 0); // Relative to waist
    
    const shoulderServo = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 32).rotateX(Math.PI/2), servoSilver);
    axis2Group.add(shoulderServo);
    
    // Lower Arm Link
    const lowerArmGeo = new THREE.BoxGeometry(0.8, 2.5, 0.6);
    // Move origin to bottom of arm
    lowerArmGeo.translate(0, 1.25, 0);
    const lowerArm = new THREE.Mesh(lowerArmGeo, robotOrange);
    axis2Group.add(lowerArm);
    
    axis1Group.add(axis2Group);
    group.userData.animatedMeshes['axis2'] = axis2Group; // Rotates Z
    
    // Axis 3 (Elbow) - Rotates around Z
    const axis3Group = new THREE.Group();
    axis3Group.position.set(0, 2.5, 0); // Relative to shoulder
    
    const elbowServo = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 32).rotateX(Math.PI/2), servoSilver);
    axis3Group.add(elbowServo);
    
    // Upper Arm casting (connects elbow to wrist)
    const upperArmGeo = new THREE.BoxGeometry(0.6, 0.6, 2.0);
    // Move origin to back of arm
    upperArmGeo.translate(0, 0, 1.0);
    const upperArm = new THREE.Mesh(upperArmGeo, robotOrange);
    axis3Group.add(upperArm);
    
    axis2Group.add(axis3Group);
    group.userData.animatedMeshes['axis3'] = axis3Group; // Rotates Z
    
    parts.push({ mesh: lowerArm, name: "Axis 2 & 3 (Shoulder & Elbow)", description: "Rigid cast aluminum structural links.", function: "Lifts the primary payload. Contains harmonic drive reducers for zero-backlash precision."});

    // ==========================================
    // 3. PROCEDURAL CAD: Wrist (Axis 4, 5, 6) & End Effector
    // ==========================================
    // Axis 4 (Roll) - Rotates around Z (relative to upper arm length)
    // Actually upper arm points along +Z in local space
    const axis4Group = new THREE.Group();
    axis4Group.position.set(0, 0, 2.0); // End of upper arm
    
    const rollServo = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32).rotateX(Math.PI/2), robotOrange);
    axis4Group.add(rollServo);
    
    axis3Group.add(axis4Group);
    group.userData.animatedMeshes['axis4'] = axis4Group; // Rotates Z
    
    // Axis 5 (Pitch) - Rotates around X
    const axis5Group = new THREE.Group();
    axis5Group.position.set(0, 0, 0.3);
    
    const pitchServo = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32).rotateZ(Math.PI/2), servoSilver);
    axis5Group.add(pitchServo);
    
    axis4Group.add(axis5Group);
    group.userData.animatedMeshes['axis5'] = axis5Group; // Rotates X
    
    // Axis 6 (Yaw/Twist) - Rotates around Z
    const axis6Group = new THREE.Group();
    axis6Group.position.set(0, 0, 0.25);
    
    const toolFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16).rotateX(Math.PI/2), darkSteel);
    axis6Group.add(toolFlange);
    
    // End Effector: Spot Welding Gun
    const welderGroup = new THREE.Group();
    welderGroup.position.set(0, 0, 0.05);
    
    const weldBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), castIronBase);
    weldBody.position.set(0, -0.15, 0.3);
    welderGroup.add(weldBody);
    
    // Copper welding tips
    const tipGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3).rotateX(Math.PI/2);
    const tip1 = new THREE.Mesh(tipGeo, copper); tip1.position.set(0, 0.1, 0.6);
    const tip2 = new THREE.Mesh(tipGeo, copper); tip2.position.set(0, -0.1, 0.6);
    welderGroup.add(tip1, tip2);
    
    // Welding Spark VFX
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), weldSpark);
    spark.position.set(0, 0, 0.7);
    spark.visible = false;
    welderGroup.add(spark);
    group.userData.animatedMeshes['spark'] = spark;
    
    axis6Group.add(welderGroup);
    axis5Group.add(axis6Group);
    group.userData.animatedMeshes['axis6'] = axis6Group; // Rotates Z
    
    parts.push({ mesh: toolFlange, name: "3-Axis Hollow Wrist & Flange", description: "Complex internal gearing allowing 3 degrees of freedom in a compact space.", function: "Orients the spot welding end-effector with sub-millimeter repeatability."});

    // ==========================================
    // 4. Factual Fasteners (1,800 parts)
    // ==========================================
    const boltCount = 1800;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 400) {
            // Base mounting ring
            const theta = Math.random() * Math.PI * 2;
            const r = 0.9;
            dummy.position.set(r * Math.cos(theta), 0.2, r * Math.sin(theta));
            dummy.rotation.set(0, 0, 0);
        } else if (i < 1000) {
            // Axis joint covers
            const theta = Math.random() * Math.PI * 2;
            const r = 0.45;
            // Place on the side of the shoulder servo
            dummy.position.set(r * Math.cos(theta), 1.0 + r * Math.sin(theta), 0.75 * (Math.random()>0.5?1:-1));
            dummy.rotation.set(Math.PI/2, 0, 0);
        } else {
            // Randomly along arm bodies (simulating access panels)
            dummy.position.set((Math.random()-0.5)*0.6, 1.0 + Math.random()*2.0, (Math.random()-0.5)*0.5);
            dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "1,800 High-Tensile Bolts", description: "Factual quantity of instanced M8/M10 hex socket bolts.", function: "Secures the heavy cast linkages and seals the servo motor housings against industrial dust." });
    
    // Default pose
    axis2Group.rotation.z = Math.PI / 6;  // Lean forward
    axis3Group.rotation.z = -Math.PI / 3; // Bend elbow down
    axis5Group.rotation.x = -Math.PI / 4; // Tilt wrist up
    
    // Scale adjustment 
    group.scale.set(1.2, 1.2, 1.2);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Complex Kinematic Dance
            // Axis 1 sweeps back and forth
            group.userData.animatedMeshes['axis1'].rotation.y = Math.sin(timeAcc * 1.5 * speed) * (Math.PI / 3);
            
            // Axis 2 & 3 bend
            group.userData.animatedMeshes['axis2'].rotation.z = (Math.PI / 6) + Math.sin(timeAcc * 2.0 * speed) * 0.2;
            group.userData.animatedMeshes['axis3'].rotation.z = (-Math.PI / 3) + Math.cos(timeAcc * 2.0 * speed) * 0.3;
            
            // Wrist roll and pitch
            group.userData.animatedMeshes['axis4'].rotation.z = Math.sin(timeAcc * 3.0 * speed) * Math.PI;
            group.userData.animatedMeshes['axis5'].rotation.x = (-Math.PI / 4) + Math.sin(timeAcc * 2.5 * speed) * 0.5;
            group.userData.animatedMeshes['axis6'].rotation.z = Math.cos(timeAcc * 4.0 * speed) * Math.PI;
            
            // Welding spark VFX (Flashes randomly when moving fast)
            if (Math.random() < 0.2 * speed) {
                group.userData.animatedMeshes['spark'].visible = true;
                group.userData.animatedMeshes['spark'].material.opacity = 0.5 + Math.random()*0.5;
                const sScale = 0.5 + Math.random();
                group.userData.animatedMeshes['spark'].scale.set(sScale, sScale, sScale);
            } else {
                group.userData.animatedMeshes['spark'].visible = false;
            }
            
        } else {
            // Idle
            group.userData.animatedMeshes['spark'].visible = false;
            
            // Slowly return to home
            group.userData.animatedMeshes['axis1'].rotation.y *= 0.95;
            group.userData.animatedMeshes['axis2'].rotation.z += ((Math.PI / 6) - group.userData.animatedMeshes['axis2'].rotation.z) * 0.05;
            group.userData.animatedMeshes['axis3'].rotation.z += ((-Math.PI / 3) - group.userData.animatedMeshes['axis3'].rotation.z) * 0.05;
            group.userData.animatedMeshes['axis4'].rotation.z *= 0.95;
            group.userData.animatedMeshes['axis5'].rotation.x += ((-Math.PI / 4) - group.userData.animatedMeshes['axis5'].rotation.x) * 0.05;
            group.userData.animatedMeshes['axis6'].rotation.z *= 0.95;
        }
    };

    group.userData.parts = parts;
    return group;
}
