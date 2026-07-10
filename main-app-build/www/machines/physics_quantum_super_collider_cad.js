import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const beamPipeMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.1 }); // Ultra-high vacuum stainless steel
    const dipoleMagnetMat = new THREE.MeshPhysicalMaterial({ color: 0x2233aa, metalness: 0.8, roughness: 0.3 }); // Niobium-titanium superconducting magnets
    const detectorHullMat = new THREE.MeshPhysicalMaterial({ color: 0xaa2222, metalness: 0.6, roughness: 0.5 }); // Heavy iron yoke for muon tracking
    const cryostatMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.4, roughness: 0.6 }); // Liquid helium thermal shielding
    
    // VFX Materials
    const particleBeamVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Proton bunches
    const collisionEventVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Higgs boson decay flash
    const trackingLinesVFX = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Subatomic particle tracks

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.beams = [];
    group.userData.animatedMeshes.collision = null;
    group.userData.animatedMeshes.tracks = [];
    group.userData.animatedMeshes.magnets = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Collider Ring & Beam Pipes
    // ==========================================
    const ringGroup = new THREE.Group();
    
    // The main cryogenic beam pipe torus (cutaway to see inside)
    const pipeGeo = new THREE.TorusGeometry(3.0, 0.1, 16, 64, Math.PI * 1.5); // 3/4 of a circle
    const pipe = new THREE.Mesh(pipeGeo, beamPipeMat);
    pipe.rotation.x = Math.PI/2;
    ringGroup.add(pipe);
    
    // Superconducting Dipole Magnets arrayed along the pipe
    for(let i=0; i<24; i++) {
        // Skip where the detector is (at angle 0)
        if (i === 0 || i === 1 || i === 23) continue;
        
        const angle = (i * Math.PI * 2) / 24;
        if (angle > Math.PI * 1.5) continue; // Skip the cutaway section
        
        const magnet = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16).rotateZ(Math.PI/2), dipoleMagnetMat);
        magnet.position.set(3.0 * Math.cos(angle), 0, 3.0 * Math.sin(angle));
        magnet.rotation.y = -angle; // Align tangent to the ring
        ringGroup.add(magnet);
        group.userData.animatedMeshes.magnets.push(magnet);
        
        // Cryogenic feed lines on the magnets
        const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), cryostatMat);
        feed.position.set(3.0 * Math.cos(angle), 0.2, 3.0 * Math.sin(angle));
        ringGroup.add(feed);
    }
    
    group.add(ringGroup);
    parts.push({ mesh: pipe, name: "Ultra-High Vacuum Beam Pipe", description: "Stainless steel conduit kept at 1.9 Kelvin.", function: "Provides a frictionless vacuum for counter-rotating proton beams to accelerate to 99.999999% the speed of light."});
    parts.push({ mesh: ringGroup.children[1], name: "NbTi Dipole Magnets", description: "Superconducting bending magnets.", function: "Generates massive 8.3 Tesla magnetic fields to steer the high-energy particles around the 27km ring."});

    // ==========================================
    // 2. PROCEDURAL CAD: CMS-style Particle Detector
    // ==========================================
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(3.0, 0, 0); // At angle 0
    detectorGroup.rotation.y = Math.PI/2; // Align with the pipe
    
    // Massive iron yoke (outer red rings)
    for(let i=-1.5; i<=1.5; i+=0.5) {
        if (Math.abs(i) < 0.1) continue; // Gap for the collision point
        const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32), detectorHullMat);
        yoke.position.set(0, 0, i);
        detectorGroup.add(yoke);
    }
    
    // Electromagnetic Calorimeter (crystal layer)
    const ecal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.0, 32, 1, true).rotateX(Math.PI/2), glass);
    detectorGroup.add(ecal);
    
    // Silicon Tracker (inner core)
    const tracker = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 16, 1, true).rotateX(Math.PI/2), darkSteel);
    detectorGroup.add(tracker);
    
    group.add(detectorGroup);
    parts.push({ mesh: detectorGroup.children[0], name: "Compact Muon Solenoid", description: "14,000-tonne multi-layered particle detector.", function: "Captures and records the trajectories, energies, and momenta of subatomic particles created during high-energy collisions."});

    // ==========================================
    // 3. PROCEDURAL CAD: Quantum Collision VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Two counter-rotating proton beams
    for(let dir of [1, -1]) {
        // Torus that only covers a small arc, simulating a bunch of protons
        const beam = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.05, 8, 32, Math.PI/8), particleBeamVFX);
        beam.rotation.x = Math.PI/2;
        vfxGroup.add(beam);
        group.userData.animatedMeshes.beams.push({ mesh: beam, dir: dir, angle: dir > 0 ? Math.PI : Math.PI*2 });
    }
    
    // The Collision Event at the center of the detector
    const collision = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), collisionEventVFX);
    collision.position.set(3.0, 0, 0);
    vfxGroup.add(collision);
    group.userData.animatedMeshes.collision = collision;
    
    // Subatomic particle tracks flying out radially from the collision
    for(let i=0; i<50; i++) {
        const phi = Math.acos(-1 + (2 * i) / 50);
        const theta = Math.sqrt(50 * Math.PI) * phi;
        
        // A thin line for the track
        const track = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.8).rotateX(Math.PI/2), trackingLinesVFX);
        // Position at collision point
        track.position.set(3.0, 0, 0);
        
        // Point in the spherical direction
        const vec = new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi));
        // We will move it along this vector in the animation
        group.userData.animatedMeshes.tracks.push({ mesh: track, dir: vec, offset: Math.random() });
        vfxGroup.add(track);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3);
    group.rotation.x = 0.2; // Tilt for better view
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Particle Beams race around the ring
            group.userData.animatedMeshes.beams.forEach(b => {
                b.mesh.material.opacity = 0.8 * speed;
                b.angle += b.dir * 4.0 * speed * 0.016;
                // Keep angle in bounds 0-2PI
                if (b.angle > Math.PI*2) b.angle -= Math.PI*2;
                if (b.angle < 0) b.angle += Math.PI*2;
                
                b.mesh.rotation.z = b.angle;
            });
            
            // Check if beams collide (they meet at angle 0)
            // Beams are PI/8 wide. So when angle is close to 0 or 2PI.
            const b1 = group.userData.animatedMeshes.beams[0].angle;
            const b2 = group.userData.animatedMeshes.beams[1].angle;
            
            // Very hacky collision detection for visual effect
            let colliding = false;
            if ( (b1 < 0.2 || b1 > Math.PI*2 - 0.2) && (b2 < 0.2 || b2 > Math.PI*2 - 0.2) ) {
                colliding = true;
            }
            
            // 2. Collision Flash
            if (colliding) {
                group.userData.animatedMeshes.collision.material.opacity = 1.0;
                group.userData.animatedMeshes.collision.scale.setScalar(2.0 + Math.random()*2.0);
            } else {
                group.userData.animatedMeshes.collision.material.opacity *= 0.8; // Fade out rapidly
                group.userData.animatedMeshes.collision.scale.setScalar(1.0);
            }
            
            // 3. Particle Tracks shoot out
            group.userData.animatedMeshes.tracks.forEach(t => {
                t.mesh.material.opacity = (colliding ? 1.0 : t.mesh.material.opacity * 0.9) * speed;
                
                // Move them outwards
                t.offset += 2.0 * speed * 0.016;
                if (t.offset > 1.0) t.offset = 0; // Reset
                
                // Position based on offset
                t.mesh.position.set(
                    3.0 + t.dir.x * t.offset,
                    t.dir.y * t.offset,
                    t.dir.z * t.offset
                );
                // Look at origin of collision
                t.mesh.lookAt(3.0, 0, 0);
            });
            
            // 4. Magnets thrum with power
            group.userData.animatedMeshes.magnets.forEach(m => {
                m.scale.setScalar(1.0 + (Math.sin(timeAcc * 50 * speed + m.position.x) * 0.01 * speed));
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.beams.forEach(b => b.mesh.material.opacity = 0.0);
            group.userData.animatedMeshes.collision.material.opacity = 0.0;
            group.userData.animatedMeshes.tracks.forEach(t => t.mesh.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
