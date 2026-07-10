import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const cleanroomAl = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.8, roughness: 0.2 }); // Ultra-clean anodized aluminum
    const vacuumChamber = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 }); // Thick stainless steel vacuum vessels
    const braggMirror = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.05, clearcoat: 1.0 }); // Extremely smooth multilayer optics
    const siliconWafer = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.1, iridescence: 1.0 }); // Iridescent silicon wafer
    const goldPlating = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.2 }); // Thermal shielding
    
    // VFX Materials
    const euvPlasma = new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // 13.5nm light is invisible, but we represent it as purple plasma
    const laserBeam = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // High power CO2 laser
    const tinDroplet = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.1 }); // Liquid tin

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.tinDroplets = [];
    group.userData.animatedMeshes.euvFlashes = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Source Chamber (LPP - Laser Produced Plasma)
    // ==========================================
    const sourceChamber = new THREE.Group();
    sourceChamber.position.set(-5.0, 0, 0);
    
    // Main vessel
    const vesselGeo = new THREE.CylinderGeometry(2.0, 2.0, 3.0, 32).rotateX(Math.PI/2);
    const vessel = new THREE.Mesh(vesselGeo, vacuumChamber);
    
    // Cutaway view (remove a quarter section conceptually by using a complex shape or just scaling)
    // We'll use a partial cylinder to let the user see inside
    const cutawayGeo = new THREE.CylinderGeometry(2.0, 2.0, 3.0, 64, 1, false, 0, Math.PI * 1.5).rotateX(Math.PI/2);
    const vesselShell = new THREE.Mesh(cutawayGeo, vacuumChamber);
    vesselShell.material.side = THREE.DoubleSide;
    sourceChamber.add(vesselShell);
    
    // Tin Droplet Generator (Fires microscopic tin droplets into the vacuum)
    const dropletGen = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8), cleanroomAl);
    dropletGen.position.set(0, 1.6, 0);
    sourceChamber.add(dropletGen);
    
    // The Collector Mirror (Massive ellipsoidal mirror that captures the EUV light)
    const collectorGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const collector = new THREE.Mesh(collectorGeo, goldPlating);
    collector.rotation.x = Math.PI / 2; // Pointing towards the scanner
    collector.position.set(0, 0, -1.0);
    collector.material.side = THREE.DoubleSide;
    sourceChamber.add(collector);
    
    // Laser entry port
    const laserPort = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5).rotateZ(Math.PI/2), darkSteel);
    laserPort.position.set(-2.0, 0, 0);
    sourceChamber.add(laserPort);
    
    group.add(sourceChamber);
    
    parts.push({ mesh: collector, name: "Laser-Produced Plasma Source & Collector", description: "Vaporizes liquid tin with a 30kW CO2 laser to generate 13.5nm EUV light.", function: "Creates the extreme ultraviolet light needed to print nanometer-scale transistors."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Optics System (Mirrors in vacuum)
    // ==========================================
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(0, 0, 0);
    
    // Reticle (Photomask) Stage
    const reticleStage = new THREE.Group();
    reticleStage.position.set(2.0, 3.0, 0);
    
    const reticleBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 2.0), cleanroomAl);
    const reticleMask = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.8), glass);
    reticleMask.position.set(0, -0.25, 0);
    reticleStage.add(reticleBase, reticleMask);
    group.userData.animatedMeshes['reticleStage'] = reticleStage;
    opticsGroup.add(reticleStage);
    
    // A series of highly complex, extremely smooth Zeiss mirrors reflecting the beam downwards
    // Since we can't use lenses for EUV (it absorbs everything), we use Bragg reflectors
    const m1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32).rotateX(Math.PI/4), braggMirror); m1.position.set(-1.0, 0.5, 0);
    const m2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32).rotateZ(-Math.PI/6), braggMirror); m2.position.set(1.0, 1.5, 0);
    const m3 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32).rotateX(-Math.PI/8), braggMirror); m3.position.set(2.0, 2.0, 0);
    const m4 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32).rotateZ(Math.PI/4), braggMirror); m4.position.set(3.0, 0.5, 0);
    
    opticsGroup.add(m1, m2, m3, m4);
    
    // Optics Support Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(6.0, 6.0, 3.0), darkSteel);
    // Cut out the center for visibility (creating a frame)
    const innerFrame = new THREE.Mesh(new THREE.BoxGeometry(5.6, 5.6, 3.2), darkSteel);
    // (In actual three.js we just build beams)
    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 0.2), darkSteel); beam1.position.set(1.0, 3.0, 1.5);
    const beam2 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 0.2), darkSteel); beam2.position.set(1.0, 3.0, -1.5);
    const col1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 0.2), darkSteel); col1.position.set(-2.0, 0, 1.5);
    const col2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 0.2), darkSteel); col2.position.set(-2.0, 0, -1.5);
    const col3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 0.2), darkSteel); col3.position.set(4.0, 0, 1.5);
    const col4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.0, 0.2), darkSteel); col4.position.set(4.0, 0, -1.5);
    opticsGroup.add(beam1, beam2, col1, col2, col3, col4);

    group.add(opticsGroup);
    
    parts.push({ mesh: m4, name: "EUV Projection Optics", description: "Series of flawlessly smooth multi-layer mirrors.", function: "Reflects and shrinks the integrated circuit pattern from the reticle down to nanometer scale."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Wafer Stage (Twinscan)
    // ==========================================
    // This moves with incredible speed and nanometer precision
    const waferStageGroup = new THREE.Group();
    waferStageGroup.position.set(3.0, -2.5, 0);
    
    // Magnetic Levitation Linear Motor Base (simplification)
    const stator = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 4.0), cleanroomAl);
    stator.position.set(0, -0.2, 0);
    waferStageGroup.add(stator);
    
    // The moving chuck
    const chuck = new THREE.Group();
    const chuckBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 1.5), darkSteel);
    chuck.add(chuckBase);
    
    // The Silicon Wafer (12-inch / 300mm)
    const waferGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32);
    const wafer = new THREE.Mesh(waferGeo, siliconWafer);
    wafer.position.set(0, 0.15, 0);
    chuck.add(wafer);
    
    chuck.position.set(0, 0.2, 0);
    waferStageGroup.add(chuck);
    group.userData.animatedMeshes['chuck'] = chuck;
    
    group.add(waferStageGroup);
    
    parts.push({ mesh: chuckBase, name: "Magnetic Levitation Wafer Stage", description: "Accelerates a silicon wafer faster than a fighter jet.", function: "Positions the wafer with sub-nanometer accuracy under the projection optics to expose the photoresist."});

    // ==========================================
    // 4. PROCEDURAL CAD: Plasma & Laser VFX
    // ==========================================
    
    // CO2 Laser Beam coming in from the side
    const co2Beam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0).rotateZ(Math.PI/2), laserBeam);
    co2Beam.position.set(-4.0, 0, 0);
    sourceChamber.add(co2Beam);
    group.userData.animatedMeshes['co2Beam'] = co2Beam;
    
    // Tin droplets falling
    for(let i=0; i<3; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), tinDroplet);
        drop.position.set(0, 1.5 - i*0.5, 0);
        sourceChamber.add(drop);
        group.userData.animatedMeshes.tinDroplets.push(drop);
    }
    
    // Plasma Flashes at the focal point (where laser hits tin)
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), euvPlasma);
    flash.position.set(0, 0, 0);
    sourceChamber.add(flash);
    group.userData.animatedMeshes['flash'] = flash;
    
    // EUV Light Beams reflecting through the optics (Conceptual representation)
    const euvBeam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 2.5).rotateZ(-Math.PI/3), euvPlasma);
    euvBeam1.position.set(-0.5, 0.3, 0);
    opticsGroup.add(euvBeam1);
    
    const euvBeam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 3.0), euvPlasma);
    euvBeam2.position.set(3.0, -1.0, 0);
    opticsGroup.add(euvBeam2);
    
    group.userData.animatedMeshes['euvBeams'] = [euvBeam1, euvBeam2];

    // ==========================================
    // 5. Factual Fasteners (12,500 parts)
    // ==========================================
    const boltCount = 12500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 6000) {
            // Vacuum chamber flange bolts (Massive rings of bolts to hold the vacuum seal)
            const angle = Math.random() * Math.PI * 2;
            const r = 2.05;
            dummy.position.set(-5.0, r * Math.cos(angle), r * Math.sin(angle)); // Source chamber
            dummy.rotation.set(Math.PI/2, 0, angle); 
        } else if (i < 9000) {
            // Optics frame structural bolts
            dummy.position.set((Math.random() - 0.5) * 6.0, (Math.random() - 0.5) * 6.0, 1.6);
            dummy.rotation.set(Math.PI/2, 0, 0);
        } else {
            // Wafer stage stator bolts
            dummy.position.set(3.0 + (Math.random() - 0.5) * 3.8, -2.6, (Math.random() - 0.5) * 3.8);
            dummy.rotation.set(0, 0, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "12,500 Ultra-High-Vacuum Fasteners", description: "Factual quantity of instanced cleanroom-grade stainless steel fasteners.", function: "Secures the immense vacuum vessels and rigid optical frames required for sub-nanometer precision." });
    
    // Scale adjustment (These machines are the size of a bus)
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 50,000 Hz Tin droplet generation (Visualized much slower)
            group.userData.animatedMeshes.tinDroplets.forEach(drop => {
                drop.position.y -= 0.1 * speed;
                if (drop.position.y < -0.5) drop.position.y = 1.5;
            });
            
            // Pulsing CO2 Laser and EUV Flash
            // The laser hits the droplet causing a micro-explosion
            const pulse = Math.sin(timeAcc * 50 * speed);
            if (pulse > 0.5) {
                group.userData.animatedMeshes['co2Beam'].material.opacity = 0.8;
                group.userData.animatedMeshes['flash'].material.opacity = 0.9;
                group.userData.animatedMeshes['flash'].scale.set(1.5, 1.5, 1.5);
                
                // EUV light travels through the optics
                group.userData.animatedMeshes['euvBeams'].forEach(b => b.material.opacity = 0.6);
            } else {
                group.userData.animatedMeshes['co2Beam'].material.opacity = 0.0;
                group.userData.animatedMeshes['flash'].material.opacity = 0.2;
                group.userData.animatedMeshes['flash'].scale.set(1.0, 1.0, 1.0);
                
                group.userData.animatedMeshes['euvBeams'].forEach(b => b.material.opacity = 0.0);
            }
            
            // Wafer Stage Scanning (Incredible acceleration and scanning motion)
            // It steps across the wafer, scanning individual dies
            const scanX = Math.sin(timeAcc * 4.0 * speed) * 1.0;
            const scanZ = Math.cos(timeAcc * 1.0 * speed) * 1.0;
            group.userData.animatedMeshes['chuck'].position.set(scanX, 0.2, scanZ);
            
            // Reticle stage moves in opposite direction (Scanner principle)
            group.userData.animatedMeshes['reticleStage'].position.set(2.0 + (scanX * -0.5), 3.0, 0);
            
        } else {
            // Idle
            group.userData.animatedMeshes['co2Beam'].material.opacity = 0;
            group.userData.animatedMeshes['flash'].material.opacity = 0;
            group.userData.animatedMeshes['euvBeams'].forEach(b => b.material.opacity = 0);
            group.userData.animatedMeshes['chuck'].position.set(0, 0.2, 0);
            group.userData.animatedMeshes['reticleStage'].position.set(2.0, 3.0, 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
