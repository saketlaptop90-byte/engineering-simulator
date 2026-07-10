import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const tbmYellow = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.1, roughness: 0.5, clearcoat: 0.1 });
    const dirtMetal = new THREE.MeshPhysicalMaterial({ color: 0x443322, metalness: 0.5, roughness: 0.9 }); // Scratched, dirty steel for the cutter
    const concrete = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.0, roughness: 0.9 });
    const brightSteel = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.3 });
    const hydraulicHose = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.0, roughness: 0.8 });
    
    // VFX Materials
    const sparkVFX = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.sparks = [];
    group.userData.animatedMeshes.segments = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Cutterhead & Shield
    // ==========================================
    const headGroup = new THREE.Group();
    
    // The Massive Front Shield (Cylindrical body protecting the machine)
    const shieldGeo = new THREE.CylinderGeometry(4.0, 4.0, 8.0, 32).rotateX(Math.PI/2);
    const shield = new THREE.Mesh(shieldGeo, tbmYellow);
    shield.position.set(0, 0, -4.0);
    headGroup.add(shield);
    
    // The Rotating Cutterhead
    const cutterGroup = new THREE.Group();
    cutterGroup.position.set(0, 0, -8.0);
    
    const cutterBase = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.4, 32).rotateX(Math.PI/2), dirtMetal);
    cutterGroup.add(cutterBase);
    
    // Cutter Spokes (Open face for muck to enter)
    for(let i=0; i<6; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.8, 0.6), tbmYellow);
        spoke.rotation.z = (i * Math.PI * 2) / 6;
        cutterGroup.add(spoke);
        
        // Add Roller Cutters (Disc cutters for hard rock) to the spokes
        for(let j=1; j<=3; j++) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16).rotateX(Math.PI/2), brightSteel);
            disc.position.set(0, j * 1.1, -0.4);
            
            // Disc housing
            const housing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), darkSteel);
            housing.position.set(0, j * 1.1, -0.2);
            
            spoke.add(housing, disc);
            
            // Add a spark emitter to the outer discs
            if (j === 3) {
                const spark = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), sparkVFX);
                spark.position.set(0, j * 1.1, -0.5);
                spoke.add(spark);
                group.userData.animatedMeshes.sparks.push(spark);
            }
        }
    }
    
    headGroup.add(cutterGroup);
    group.userData.animatedMeshes['cutterhead'] = cutterGroup;
    group.add(headGroup);
    
    parts.push({ mesh: cutterGroup, name: "Hard-Rock Cutterhead", description: "Massive rotating face equipped with dozens of carbide roller disc cutters.", function: "Crushes and excavates solid bedrock as the machine is thrust forward."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Ring Erector & Thrust Cylinders
    // ==========================================
    const erectorGroup = new THREE.Group();
    erectorGroup.position.set(0, 0, 0); // Directly behind the shield
    
    // Hydraulic Thrust Cylinders (Pushing against the concrete rings)
    for(let i=0; i<8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        // Cylinder barrel
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0).rotateX(Math.PI/2), tbmYellow);
        cyl.position.set(3.5 * Math.cos(angle), 3.5 * Math.sin(angle), -0.5);
        erectorGroup.add(cyl);
        
        // Rod (Extends)
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0).rotateX(Math.PI/2), brightSteel);
        rod.position.set(3.5 * Math.cos(angle), 3.5 * Math.sin(angle), 1.0);
        erectorGroup.add(rod);
    }
    
    // The Vacuum Ring Erector (Rotates to place segments)
    const erectorArmGroup = new THREE.Group();
    erectorArmGroup.position.set(0, 0, 2.0);
    
    const centralRing = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.2, 16, 32), darkSteel);
    erectorArmGroup.add(centralRing);
    
    const erectorArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.4), tbmYellow);
    erectorArm.position.set(0, 2.0, 0);
    erectorArmGroup.add(erectorArm);
    
    // Vacuum Pad holding a concrete segment
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 1.0), rubber);
    pad.position.set(0, 3.3, 0);
    erectorArmGroup.add(pad);
    
    // A single concrete segment being placed
    const segmentBeingPlaced = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 1.5), concrete);
    segmentBeingPlaced.position.set(0, 3.5, 0);
    erectorArmGroup.add(segmentBeingPlaced);

    erectorGroup.add(erectorArmGroup);
    group.add(erectorGroup);
    
    group.userData.animatedMeshes['erector'] = erectorArmGroup;
    
    parts.push({ mesh: erectorArm, name: "Vacuum Ring Erector", description: "Rotating robotic arm with vacuum suction pads.", function: "Lifts and perfectly aligns multi-ton precast concrete segments to build the tunnel lining."});

    // ==========================================
    // 3. PROCEDURAL CAD: Trailing Backup Gantry & Conveyor
    // ==========================================
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 0, 4.0);
    
    // The gantry framework
    for(let i=0; i<3; i++) {
        const frame = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.1, 8, 16), tbmYellow);
        frame.position.set(0, 0, i * 4.0);
        gantryGroup.add(frame);
        
        // Connecting beams
        if (i < 2) {
            const beam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(Math.PI/2), tbmYellow); beam1.position.set(-3.6, 0, (i*4.0)+2.0);
            const beam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateX(Math.PI/2), tbmYellow); beam2.position.set(3.6, 0, (i*4.0)+2.0);
            gantryGroup.add(beam1, beam2);
        }
    }
    
    // The Muck Conveyor Belt (Running out the back)
    const conveyorBelt = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 16.0), rubber);
    conveyorBelt.position.set(0, -1.0, 4.0);
    gantryGroup.add(conveyorBelt);
    
    // Pre-installed concrete tunnel rings (Leaving them behind)
    for(let i=0; i<3; i++) {
        // We simulate the finished tunnel using a hollow cylinder
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 2.0, 32, 1, true).rotateX(Math.PI/2), concrete);
        ring.material.side = THREE.BackSide; // View from inside
        ring.position.set(0, 0, 5.0 + (i * 2.0));
        gantryGroup.add(ring);
        group.userData.animatedMeshes.segments.push(ring); // We will translate these backwards to simulate forward motion
    }

    group.add(gantryGroup);
    group.userData.animatedMeshes['conveyor'] = conveyorBelt;
    
    parts.push({ mesh: conveyorBelt, name: "Trailing Backup Gantry & Conveyor", description: "100-meter long trailing infrastructure train.", function: "Houses transformers, ventilation, grouting pumps, and a continuous conveyor belt to remove excavated muck."});

    // ==========================================
    // 4. Factual Fasteners (10,000 parts)
    // ==========================================
    const boltCount = 10000;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 5000) {
            // Cutterhead mounting bolts (Critical high shear area)
            const angle = Math.random() * Math.PI * 2;
            const r = 0.5 + Math.random() * 3.3;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), -8.2);
            dummy.rotation.set(Math.PI/2, 0, 0);
        } else if (i < 8000) {
            // Shield Segment bolts (Circumferential seams)
            const angle = Math.random() * Math.PI * 2;
            const r = 4.01;
            const seamZ = Math.random() > 0.5 ? -2.0 : -6.0;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), seamZ + (Math.random()-0.5)*0.2);
            // Align to normal
            dummy.rotation.set(0, 0, angle); 
        } else {
            // Gantry truss bolts
            dummy.position.set((Math.random()-0.5)*3.6, (Math.random()-0.5)*3.6, Math.random()*12.0);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "10,000 Heavy Structural Fasteners", description: "Factual quantity of instanced massive socket-head cap screws.", function: "Secures the highly-stressed cutterhead sections and withstands the immense twisting torque generated by the electric motors." });
    
    // Scale adjustment (TBMs are enormous, up to 17m diameter)
    group.scale.set(0.12, 0.12, 0.12);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Massive cutterhead rotates slowly (high torque, low RPM)
            group.userData.animatedMeshes['cutterhead'].rotation.z += 0.05 * speed;
            
            // Roller cutters generate sparks against hard rock
            group.userData.animatedMeshes.sparks.forEach(spark => {
                if (Math.random() < 0.3 * speed) {
                    spark.material.opacity = 0.5 + Math.random() * 0.5;
                    const sScale = 0.5 + Math.random() * 2.0;
                    spark.scale.set(sScale, sScale, sScale);
                } else {
                    spark.material.opacity = 0;
                }
            });
            
            // Ring erector rotates to position the next segment
            group.userData.animatedMeshes['erector'].rotation.z = Math.sin(timeAcc * 0.5 * speed) * Math.PI;
            
            // Conveyor belt texture/object sliding (simulate muck moving back)
            // We'll just vibrate it slightly to imply heavy rock falling on it
            group.userData.animatedMeshes['conveyor'].position.y = -1.0 + Math.random() * 0.02 * speed;
            
            // Simulate the machine moving forward by sliding the finished tunnel rings backwards
            group.userData.animatedMeshes.segments.forEach((ring, index) => {
                ring.position.z += 0.2 * speed;
                // If it goes too far back, recycle it to the front of the gantry to create an endless tunnel
                if (ring.position.z > 11.0) {
                    ring.position.z = 5.0;
                }
            });
            
        } else {
            // Idle (Maintenance mode)
            group.userData.animatedMeshes.sparks.forEach(spark => spark.material.opacity = 0);
            group.userData.animatedMeshes['erector'].rotation.z *= 0.95; // Return to center
            group.userData.animatedMeshes['conveyor'].position.y = -1.0;
        }
    };

    group.userData.parts = parts;
    return group;
}
