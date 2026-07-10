import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const opticalBreadboard = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 }); // Anodized aluminum table
    const nonLinearCrystal = new THREE.MeshPhysicalMaterial({ color: 0xeeffff, metalness: 0.1, roughness: 0.0, transmission: 0.98, thickness: 0.5, ior: 1.6 }); // BBO Crystal
    const faradayRotatorMat = new THREE.MeshPhysicalMaterial({ color: 0x882222, metalness: 0.7, roughness: 0.4 }); // Magneto-optic material housing
    const detectorHousing = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.5 }); // SPAD cooling shroud
    
    // VFX Materials
    const pumpLaserVFX = new THREE.MeshBasicMaterial({ color: 0x4400ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // UV Pump Laser
    const entangledPhotonAVFX = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Idler
    const entangledPhotonBVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Signal
    const detectorPingVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // SPAD hit

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumpBeam = null;
    group.userData.animatedMeshes.photonsA = [];
    group.userData.animatedMeshes.photonsB = [];
    group.userData.animatedMeshes.pings = [];
    group.userData.animatedMeshes.crystals = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Optical Table & Pump
    // ==========================================
    const tableGroup = new THREE.Group();
    
    // The main vibration-isolated optical breadboard
    const breadboard = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 2.0), opticalBreadboard);
    breadboard.position.y = -0.5;
    tableGroup.add(breadboard);
    
    // UV Pump Laser Source
    const laserSource = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.3), detectorHousing);
    laserSource.position.set(-1.0, -0.3, 0);
    tableGroup.add(laserSource);
    
    // The continuous UV pump beam
    const pumpBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.0).rotateZ(Math.PI/2), pumpLaserVFX);
    pumpBeam.position.set(-0.5, -0.3, 0);
    tableGroup.add(pumpBeam);
    group.userData.animatedMeshes.pumpBeam = pumpBeam;
    
    group.add(tableGroup);
    parts.push({ mesh: laserSource, name: "Ultraviolet Pump Laser", description: "High-power 405nm continuous-wave laser.", function: "Provides the high-energy input photons required for the Spontaneous Parametric Down-Conversion (SPDC) process."});

    // ==========================================
    // 2. PROCEDURAL CAD: BBO Crystals (SPDC)
    // ==========================================
    // Beta-Barium Borate non-linear crystals that split one high energy photon into two lower energy entangled photons
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(0, -0.3, 0);
    
    // Kinematic mount holding the crystals
    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), aluminum);
    mount.position.y = -0.1;
    crystalGroup.add(mount);
    
    // Two thin BBO crystals placed back-to-back (Type-II phase matching)
    for(let i=0; i<2; i++) {
        const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.2), nonLinearCrystal);
        crystal.position.x = (i * 0.06) - 0.03;
        crystal.rotation.y = Math.PI/12 * (i===0 ? 1 : -1); // Slight angle for phase matching
        crystalGroup.add(crystal);
        group.userData.animatedMeshes.crystals.push(crystal);
    }
    
    group.add(crystalGroup);
    parts.push({ mesh: crystalGroup.children[1], name: "Beta-Barium Borate (BBO) Crystals", description: "Non-linear optical crystals in a crossed configuration.", function: "Facilitates SPDC, where a single UV photon occasionally splits into a Signal and Idler photon pair whose quantum states (polarization) are intrinsically entangled."});

    // ==========================================
    // 3. PROCEDURAL CAD: Faraday Rotators & Beamsplitters
    // ==========================================
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(0, -0.3, 0);
    
    for(let side of [-1, 1]) {
        // Paths for the diverging entangled photon beams
        const pathAngle = side * (Math.PI / 8); 
        const dist = 0.8;
        
        // Faraday Rotator (controls polarization)
        const rotator = new THREE.Group();
        rotator.position.set(Math.cos(pathAngle) * dist, 0, Math.sin(pathAngle) * dist);
        rotator.rotation.y = -pathAngle; // Face crystal
        
        const rHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3).rotateZ(Math.PI/2), faradayRotatorMat);
        rotator.add(rHousing);
        
        const rCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2).rotateZ(Math.PI/2), copper);
        rotator.add(rCoil);
        
        opticsGroup.add(rotator);
    }
    
    group.add(opticsGroup);
    parts.push({ mesh: opticsGroup.children[0].children[0], name: "Faraday Rotators", description: "Magneto-optic devices wrapped in copper coils.", function: "Rotates the polarization of the incoming photons via the Faraday effect, allowing for quantum state manipulation before detection or transmission."});

    // ==========================================
    // 4. PROCEDURAL CAD: Single-Photon Avalanche Diodes (SPAD) & VFX
    // ==========================================
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(0, -0.3, 0);
    
    const vfxGroup = new THREE.Group();
    vfxGroup.position.set(0, -0.3, 0);
    
    for(let side of [-1, 1]) {
        const pathAngle = side * (Math.PI / 8); 
        const dist = 1.3;
        
        // SPAD Detector
        const spad = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), detectorHousing);
        spad.position.set(Math.cos(pathAngle) * dist, 0, Math.sin(pathAngle) * dist);
        spad.rotation.y = -pathAngle;
        
        // Cooling fins
        const fins = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.3), aluminum);
        fins.position.x = 0.1;
        spad.add(fins);
        
        detectorGroup.add(spad);
        
        // Detector Ping VFX (Flashes when a photon hits)
        const ping = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), detectorPingVFX);
        ping.position.copy(spad.position);
        ping.position.x -= 0.16; // Face
        ping.rotation.y = -pathAngle - Math.PI/2;
        vfxGroup.add(ping);
        group.userData.animatedMeshes.pings.push(ping);
        
        // Travelling Photon VFX
        for(let j=0; j<5; j++) {
            const photon = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), side === 1 ? entangledPhotonAVFX : entangledPhotonBVFX);
            photon.userData = { t: Math.random(), side: side, angle: pathAngle, dist: dist };
            vfxGroup.add(photon);
            if (side === 1) group.userData.animatedMeshes.photonsA.push(photon);
            else group.userData.animatedMeshes.photonsB.push(photon);
        }
    }
    
    group.add(detectorGroup);
    group.add(vfxGroup);
    parts.push({ mesh: detectorGroup.children[0], name: "Single-Photon Avalanche Diodes (SPAD)", description: "Thermoelectrically cooled silicon semiconductor detectors.", function: "Detects individual photons with picosecond timing resolution. Used to verify the quantum entanglement through coincidence counting."});

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Pump Laser is active
            group.userData.animatedMeshes.pumpBeam.material.opacity = 0.8 + (Math.sin(timeAcc * 50) * 0.2 * speed);
            
            // Crystal glowing slightly from scattering
            group.userData.animatedMeshes.crystals.forEach(c => {
                c.material.emissive = new THREE.Color(0x4400ff);
                c.material.emissiveIntensity = 0.5 * speed;
            });
            
            // 2. Entangled Photon Pairs traveling
            // They must travel together to represent entanglement
            for(let i=0; i<5; i++) {
                const pA = group.userData.animatedMeshes.photonsA[i];
                const pB = group.userData.animatedMeshes.photonsB[i];
                
                // Shared progress
                pA.userData.t += 0.05 * speed;
                if (pA.userData.t > 1.0) pA.userData.t = 0.0;
                pB.userData.t = pA.userData.t; // Entangled timing!
                
                // Move outward along paths
                pA.position.set(
                    (pA.userData.t * pA.userData.dist) * Math.cos(pA.userData.angle),
                    0,
                    (pA.userData.t * pA.userData.dist) * Math.sin(pA.userData.angle)
                );
                
                pB.position.set(
                    (pB.userData.t * pB.userData.dist) * Math.cos(pB.userData.angle),
                    0,
                    (pB.userData.t * pB.userData.dist) * Math.sin(pB.userData.angle)
                );
                
                pA.material.opacity = 1.0;
                pB.material.opacity = 1.0;
                
                // 3. Detector Ping (Coincidence)
                // When they reach t > 0.95, flash the detectors
                if (pA.userData.t > 0.95) {
                    group.userData.animatedMeshes.pings[0].material.opacity = 1.0;
                    group.userData.animatedMeshes.pings[1].material.opacity = 1.0;
                }
            }
            
            // Fade out pings
            group.userData.animatedMeshes.pings.forEach(ping => {
                ping.material.opacity *= 0.8;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.pumpBeam.material.opacity = 0;
            group.userData.animatedMeshes.crystals.forEach(c => c.material.emissiveIntensity = 0);
            group.userData.animatedMeshes.photonsA.forEach(p => p.material.opacity = 0);
            group.userData.animatedMeshes.photonsB.forEach(p => p.material.opacity = 0);
            group.userData.animatedMeshes.pings.forEach(ping => ping.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
