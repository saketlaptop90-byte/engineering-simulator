import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const megastructureMat = new THREE.MeshPhysicalMaterial({ color: 0x222233, metalness: 0.9, roughness: 0.2 }); // Dark alloy frame
    const energyMirrorMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeff, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 }); // Perfect reflectors
    const emitterMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.4 }); // Projectile emitters
    
    // VFX Materials
    const blackHoleVFX = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Event Horizon
    const accretionDiskVFX = new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }); // Glowing gas
    const ergosphereVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.2, wireframe: true }); // Frame-dragging region
    const lightBeamVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Superradiant scattering

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.disk = null;
    group.userData.animatedMeshes.ergosphere = null;
    group.userData.animatedMeshes.beams = [];
    group.userData.animatedMeshes.mirrors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Black Hole (Kerr Metric)
    // ==========================================
    const bhGroup = new THREE.Group();
    
    // The Event Horizon (pure black sphere)
    const eventHorizon = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), blackHoleVFX);
    bhGroup.add(eventHorizon);
    
    // The Ergosphere (pumpkin-shaped region where spacetime is dragged at >c)
    // Modeled as a slightly flattened sphere
    const ergosphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), ergosphereVFX);
    ergosphere.scale.y = 0.7; // Flattened at poles
    bhGroup.add(ergosphere);
    group.userData.animatedMeshes.ergosphere = ergosphere;
    
    // Accretion Disk
    const diskGeo = new THREE.TorusGeometry(2.5, 0.4, 16, 64);
    // Flatten the disk
    diskGeo.scale(1.0, 1.0, 0.1);
    const disk = new THREE.Mesh(diskGeo, accretionDiskVFX);
    disk.rotation.x = Math.PI/2;
    bhGroup.add(disk);
    group.userData.animatedMeshes.disk = disk;
    
    group.add(bhGroup);
    parts.push({ mesh: eventHorizon, name: "Kerr Black Hole", description: "Rotating singularity.", function: "Provides an extreme gravitational well and a frame-dragging ergosphere capable of imparting rotational energy to matter."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Megastructure Shell (Penrose Sphere)
    // ==========================================
    const shellGroup = new THREE.Group();
    
    // Outer framework (icosahedron skeleton)
    const frameGeo = new THREE.IcosahedronGeometry(4.0, 1);
    // Convert to wireframe-like structure by adding tubes along edges
    const wireMaterial = megastructureMat;
    const edges = new THREE.EdgesGeometry(frameGeo);
    const frameLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x222233 })); // Fallback
    // But we want thick tubes for CAD
    // Since TubeGeometry from Edges is hard without custom code, we'll build a few massive structural rings instead
    
    const rings = 3;
    for(let i=0; i<rings; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.1, 16, 64), wireMaterial);
        if(i===0) ring.rotation.x = Math.PI/2;
        if(i===1) ring.rotation.y = Math.PI/2;
        if(i===2) ring.rotation.z = Math.PI/2;
        shellGroup.add(ring);
    }
    
    // Massive perfect mirrors mounted on the inner face of the shell
    // These reflect superradiant light back into the ergosphere
    for(let i=0; i<20; i++) {
        // Distribute points roughly on a sphere
        const phi = Math.acos(1 - 2 * (i + 0.5) / 20);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const mirrorGroup = new THREE.Group();
        const r = 3.9;
        mirrorGroup.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi));
        mirrorGroup.lookAt(0,0,0);
        
        const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 0.1, 32).rotateX(Math.PI/2), energyMirrorMat);
        mirror.position.set(0, 0, 0);
        mirrorGroup.add(mirror);
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.2, 32).rotateX(Math.PI/2), megastructureMat);
        housing.position.set(0, 0, -0.05);
        mirrorGroup.add(housing);
        
        shellGroup.add(mirrorGroup);
        group.userData.animatedMeshes.mirrors.push(mirrorGroup);
        
        // Add a VFX beam coming from SOME of the mirrors (pointing inward)
        if (i % 2 === 0) {
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.0).rotateX(Math.PI/2), lightBeamVFX);
            beam.position.set(0, 0, 2.0); // Extending into the center
            mirrorGroup.add(beam);
            group.userData.animatedMeshes.beams.push(beam);
        }
    }
    
    group.add(shellGroup);
    parts.push({ mesh: shellGroup.children[3].children[0], name: "Perfect Energy Mirrors", description: "Superradiant reflection nodes.", function: "Bounces electromagnetic waves back and forth through the ergosphere, amplifying their energy exponentially via black hole rotational energy."});
    parts.push({ mesh: shellGroup.children[0], name: "Containment Grid", description: "Titanium-alloy orbital frame.", function: "Houses the mirrors and energy taps, maintaining a rigid orbital structure despite intense tidal forces."});

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Black hole always spins
        group.userData.animatedMeshes.disk.rotation.z -= 0.02;
        group.userData.animatedMeshes.ergosphere.rotation.y -= 0.05;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Accretion disk flares
            group.userData.animatedMeshes.disk.material.opacity = 0.8 + (Math.sin(timeAcc * 20 * speed) * 0.2);
            group.userData.animatedMeshes.disk.rotation.z -= 0.1 * speed;
            
            // 2. Ergosphere stretches
            group.userData.animatedMeshes.ergosphere.scale.x = 1.0 + (Math.sin(timeAcc * 5 * speed) * 0.05);
            group.userData.animatedMeshes.ergosphere.scale.z = 1.0 + (Math.cos(timeAcc * 5 * speed) * 0.05);
            group.userData.animatedMeshes.ergosphere.material.opacity = 0.2 + (0.3 * speed);
            
            // 3. Superradiant Scattering Beams
            group.userData.animatedMeshes.beams.forEach((beam, idx) => {
                // Flash intensely
                const intensity = Math.sin(timeAcc * 30 * speed + idx);
                if (intensity > 0.5) {
                    beam.material.opacity = 0.8 * speed;
                    // Jitter scale to simulate erratic amplification
                    beam.scale.x = 1.0 + Math.random();
                    beam.scale.y = 1.0 + Math.random();
                } else {
                    beam.material.opacity = 0.0;
                }
            });
            
            // 4. Mirrors vibrate from immense energy pressure
            group.userData.animatedMeshes.mirrors.forEach((m, idx) => {
                m.position.addScalar(Math.sin(timeAcc * 50 * speed + idx) * 0.01 * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.disk.material.opacity = 0.8;
            group.userData.animatedMeshes.ergosphere.scale.set(1.0, 0.7, 1.0);
            group.userData.animatedMeshes.ergosphere.material.opacity = 0.2;
            group.userData.animatedMeshes.beams.forEach(b => b.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
