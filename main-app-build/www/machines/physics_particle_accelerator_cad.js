import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const dipoleBlue = new THREE.MeshPhysicalMaterial({ color: 0x0044cc, metalness: 0.6, roughness: 0.4 }); // CERN LHC style blue cryodipoles
    const quadrupolRed = new THREE.MeshPhysicalMaterial({ color: 0xcc2200, metalness: 0.6, roughness: 0.4 }); // Focusing magnets
    const detectorGold = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.3 }); // ATLAS/CMS style calorimeter
    const beamPipeAl = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 }); // Ultra-high vacuum pipe
    
    // VFX Materials
    const protonBeam = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Particle beams
    const collisionSparks = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Higgs boson / particle shower

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.beams = [];
    group.userData.animatedMeshes.sparks = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Accelerator Ring (Dipoles & Quadrupoles)
    // ==========================================
    const ringGroup = new THREE.Group();
    
    // We will model a section of the 27km ring curving into a detector
    // It's a massive curve
    const radius = 20.0;
    
    // Create a series of Dipole magnets (blue tubes) curving along the radius
    for(let i=0; i<8; i++) {
        // -4 to +4 for an arc
        const angle = ((i - 4) * Math.PI * 2) / 64; 
        
        const dipoleGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.0, 32);
        const dipole = new THREE.Mesh(dipoleGeo, dipoleBlue);
        
        // Position on the curve
        dipole.position.set(radius * Math.cos(angle) - radius, 0, radius * Math.sin(angle));
        // Rotate so it aligns with the tangent
        dipole.rotation.x = Math.PI / 2;
        dipole.rotation.z = -angle;
        
        ringGroup.add(dipole);
        
        // Add a Quadrupole magnet (red, shorter) between some dipoles
        if (i % 2 === 0 && i < 7) {
            const quadAngle = angle + (Math.PI * 2) / 128; // Halfway between
            const quad = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.0, 32), quadrupolRed);
            quad.position.set(radius * Math.cos(quadAngle) - radius, 0, radius * Math.sin(quadAngle));
            quad.rotation.x = Math.PI / 2;
            quad.rotation.z = -quadAngle;
            ringGroup.add(quad);
        }
    }
    
    // Extrude the beam pipes (two pipes inside the magnets)
    const pipeShape = new THREE.Shape();
    pipeShape.absarc(0, 0, 0.1, 0, Math.PI * 2, false);
    
    // Create path for extrusion
    class RingCurve extends THREE.Curve {
        constructor(r) { super(); this.r = r; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // Map t (0-1) to an angle arc
            const angle = ((t * 8 - 4) * Math.PI * 2) / 64;
            return optionalTarget.set(this.r * Math.cos(angle) - this.r, 0, this.r * Math.sin(angle));
        }
    }
    const extrudePath = new RingCurve(radius);
    const pipeSettings = { extrudePath: extrudePath, steps: 64, bevelEnabled: false };
    
    // Two pipes side-by-side
    const pipeGeo = new THREE.ExtrudeGeometry(pipeShape, pipeSettings);
    const pipe1 = new THREE.Mesh(pipeGeo, beamPipeAl); pipe1.position.y = 0.2;
    const pipe2 = new THREE.Mesh(pipeGeo, beamPipeAl); pipe2.position.y = -0.2;
    ringGroup.add(pipe1, pipe2);

    group.add(ringGroup);
    
    parts.push({ mesh: ringGroup.children[0], name: "Superconducting Dipole Magnets", description: "35-ton magnets cooled to 1.9 Kelvin by liquid helium.", function: "Generates an 8.3 Tesla magnetic field to bend the 7 TeV proton beams in a 27km circle."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Particle Detector (ATLAS/CMS style)
    // ==========================================
    // Situated at the collision point (0,0,0 approx)
    // The beams actually cross at this point
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(0, 0, 0); // Intersection
    
    // Massive cylindrical layers
    const layer1 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 6.0, 32, 1, true).rotateX(Math.PI/2), darkSteel);
    layer1.material.side = THREE.DoubleSide;
    const layer2 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 5.0, 32, 1, true).rotateX(Math.PI/2), detectorGold);
    layer2.material.side = THREE.DoubleSide;
    const layer3 = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 4.0, 32, 1, true).rotateX(Math.PI/2), darkSteel);
    layer3.material.side = THREE.DoubleSide;
    
    detectorGroup.add(layer1, layer2, layer3);
    
    // Endcaps (massive disks with holes)
    const endcapGeo = new THREE.CylinderGeometry(4.0, 4.0, 0.5, 32);
    const endcap1 = new THREE.Mesh(endcapGeo, detectorGold); endcap1.position.set(0, 0, 3.25); endcap1.rotation.x = Math.PI/2;
    const endcap2 = new THREE.Mesh(endcapGeo, detectorGold); endcap2.position.set(0, 0, -3.25); endcap2.rotation.x = Math.PI/2;
    detectorGroup.add(endcap1, endcap2);
    
    // Add greebles (muon chambers, etc) on the outside
    for(let i=0; i<16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 4.5), aluminum);
        chamber.position.set(4.2 * Math.cos(angle), 4.2 * Math.sin(angle), 0);
        chamber.rotation.z = angle;
        detectorGroup.add(chamber);
    }
    
    // Cutaway: Remove a section so we can see inside
    // (In three.js we'll simulate this by not closing the cylinders fully, or just relying on camera clipping,
    // but for now we'll just leave it open-ended)

    group.add(detectorGroup);
    
    parts.push({ mesh: layer2, name: "Omni-Purpose Particle Detector", description: "Massive 7,000-ton cylindrical array of silicon trackers and calorimeters.", function: "Captures and records the trajectories and energies of subatomic particles created when the protons collide at 99.999999% the speed of light."});

    // ==========================================
    // 3. PROCEDURAL CAD: Beam & Collision VFX
    // ==========================================
    // Beam 1 (Clockwise)
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 20.0, 8).rotateX(Math.PI/2), protonBeam);
    b1.position.set(0, 0, 0); // Passes straight through for visual simplicity
    group.add(b1);
    
    // Beam 2 (Counter-Clockwise)
    // They cross at the center (0,0,0)
    
    group.userData.animatedMeshes.beams.push(b1);
    
    // Collision Particle Shower (Hundreds of tiny sparks bursting outwards)
    const sparkCount = 200;
    for(let i=0; i<sparkCount; i++) {
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), collisionSparks);
        // Random velocity vector
        const vx = (Math.random() - 0.5) * 2.0;
        const vy = (Math.random() - 0.5) * 2.0;
        const vz = (Math.random() - 0.5) * 2.0; // Slightly preferential along Z due to momentum, but we'll do spherical
        spark.userData = { vx, vy, vz, life: Math.random() };
        spark.position.set(0,0,0);
        group.add(spark);
        group.userData.animatedMeshes.sparks.push(spark);
    }

    // ==========================================
    // 4. Factual Fasteners (12,000 parts)
    // ==========================================
    const boltCount = 12000;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6); // Very large bolts for the detector
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        if (i < 8000) {
            // Detector Endcap bolts (massive rings of bolts)
            const angle = Math.random() * Math.PI * 2;
            const r = 3.8 + Math.random()*0.2;
            const isFront = Math.random() > 0.5;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), isFront ? 3.5 : -3.5);
            dummy.rotation.set(Math.PI/2, 0, angle); 
        } else {
            // Cryodipole flange bolts
            // Distribute along the ring where the dipoles connect
            const magnetIdx = Math.floor(Math.random() * 8);
            const angle = ((magnetIdx - 4 + 0.5) * Math.PI * 2) / 64; // Connections between magnets
            const cr = 0.8; // Radius of dipole
            const cAngle = Math.random() * Math.PI * 2;
            
            // Base pos
            const bx = radius * Math.cos(angle) - radius;
            const bz = radius * Math.sin(angle);
            
            // Offset around the flange
            dummy.position.set(bx + cr*Math.cos(cAngle), cr*Math.sin(cAngle), bz);
            dummy.rotation.set(0, -angle, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "12,000 Precision Fasteners", description: "Factual quantity of massive structural bolts.", function: "Must withstand the immense weight of the detector components and the extreme thermal contraction of the 1.9 Kelvin cryogenic systems." });
    
    // Scale adjustment
    group.scale.set(0.15, 0.15, 0.15); // The detector is 25 meters tall in reality
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let collisionTimer = 0;
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Beams pulse as bunches of protons fly through at c
            group.userData.animatedMeshes.beams.forEach(beam => {
                beam.material.opacity = 0.5 + Math.sin(timeAcc * 100 * speed) * 0.5;
                // Color gets brighter blue/white at high speed
                beam.material.color.setHSL(0.5, 1.0, 0.5 + (0.3 * speed));
            });
            
            // 40 Million Collisions per second (We visualize it as discrete bursts)
            collisionTimer += 0.1 * speed;
            if (collisionTimer > 1.0) {
                collisionTimer = 0;
                // Reset spark lifetimes
                group.userData.animatedMeshes.sparks.forEach(spark => {
                    spark.position.set(0,0,0);
                    spark.userData.life = 1.0;
                });
            }
            
            // Animate Sparks (Particle Shower)
            group.userData.animatedMeshes.sparks.forEach(spark => {
                if (spark.userData.life > 0) {
                    spark.userData.life -= 0.05; // decay
                    
                    // Move outward
                    spark.position.x += spark.userData.vx * 0.5 * speed;
                    spark.position.y += spark.userData.vy * 0.5 * speed;
                    spark.position.z += spark.userData.vz * 0.5 * speed;
                    
                    // Curve in the magnetic field (B-field is along Z usually, so XY curves)
                    const bField = 0.05 * speed;
                    // Loretnz force curve
                    spark.userData.vx += spark.userData.vy * bField;
                    spark.userData.vy -= spark.userData.vx * bField;
                    
                    spark.material.opacity = spark.userData.life;
                    
                    // Color based on particle type (randomized via vx)
                    if (spark.userData.vx > 0.5) spark.material.color.setHex(0xff0000); // Red
                    else if (spark.userData.vx < -0.5) spark.material.color.setHex(0x00ff00); // Green
                    else spark.material.color.setHex(0x0000ff); // Blue
                    
                } else {
                    spark.material.opacity = 0;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.beams.forEach(beam => beam.material.opacity = 0);
            group.userData.animatedMeshes.sparks.forEach(spark => {
                spark.material.opacity = 0;
                spark.position.set(0,0,0);
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
