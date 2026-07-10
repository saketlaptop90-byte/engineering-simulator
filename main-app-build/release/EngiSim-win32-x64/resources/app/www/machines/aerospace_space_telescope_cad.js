import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const goldBeryllium = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.05, clearcoat: 1.0 }); // Flawless gold-coated beryllium mirrors
    const sunshieldKapton = new THREE.MeshPhysicalMaterial({ color: 0xaa77aa, metalness: 0.3, roughness: 0.6, iridescence: 0.5 }); // Multi-layer reflective kapton
    const spacecraftBus = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.4 }); // Aluminum bus
    const blackCarbon = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.8 }); // Carbon fiber backplane
    const starTrackerLens = new THREE.MeshPhysicalMaterial({ color: 0x000022, metalness: 0.9, roughness: 0.1, transmission: 0.5 });
    
    // VFX Materials
    const irPhoton = new THREE.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.photons = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Spacecraft Bus & Sunshield
    // ==========================================
    const busGroup = new THREE.Group();
    
    // The main bus (Houses reaction wheels, computers, comms)
    const busGeo = new THREE.BoxGeometry(2.0, 0.8, 2.0);
    const bus = new THREE.Mesh(busGeo, spacecraftBus);
    bus.position.set(0, -1.0, 0);
    busGroup.add(bus);
    
    // Solar array (Deployed on the bottom)
    const solarGeo = new THREE.BoxGeometry(1.8, 0.05, 4.0);
    const solarArray = new THREE.Mesh(solarGeo, tinted); // Dark blueish
    solarArray.position.set(0, -1.45, 1.0);
    busGroup.add(solarArray);
    
    // The Sunshield (5 layers of ultra-thin Kapton, deployed to block the sun)
    // We will model this as a layered, diamond-like shape
    const sunshieldGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        // Hexagonal / Diamond shape approximated by a Cylinder with 6 segments
        const shieldLayer = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.02, 6), sunshieldKapton);
        // Stagger them slightly
        shieldLayer.position.set(0, -0.4 + (i * 0.1), 0);
        // Scale to make it diamond-ish (longer on Z axis)
        shieldLayer.scale.set(1.0, 1.0, 1.5);
        sunshieldGroup.add(shieldLayer);
    }
    busGroup.add(sunshieldGroup);
    
    group.add(busGroup);
    
    parts.push({ mesh: sunshieldGroup.children[0], name: "5-Layer Kapton Sunshield", description: "Tennis-court-sized deployable thermal shield.", function: "Passively cools the telescope to 40 Kelvin by permanently blocking light and heat from the Sun, Earth, and Moon."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Primary Mirror (OTE)
    // ==========================================
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(0, 0.8, -1.5); // Mounted on top of the sunshield, angled
    
    // The backplane (Carbon fiber structure holding the mirrors)
    const backplane = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.2, 6).rotateX(Math.PI/2), blackCarbon);
    backplane.position.set(0, 0, -0.1);
    mirrorGroup.add(backplane);
    
    // 18 Hexagonal Gold-Coated Beryllium Mirror Segments
    const segmentRadius = 0.45;
    const segments = new THREE.Group();
    const hexHeight = Math.sqrt(3) * segmentRadius;
    
    const positions = [
        [0, 0], // Center
        // Inner ring (6)
        [0, hexHeight], [0, -hexHeight],
        [1.5 * segmentRadius, hexHeight/2], [1.5 * segmentRadius, -hexHeight/2],
        [-1.5 * segmentRadius, hexHeight/2], [-1.5 * segmentRadius, -hexHeight/2],
        // Outer ring (11 - one missing for the central instrument module)
        [0, 2*hexHeight], [0, -2*hexHeight],
        [1.5 * segmentRadius, 1.5*hexHeight], [1.5 * segmentRadius, -1.5*hexHeight],
        [-1.5 * segmentRadius, 1.5*hexHeight], [-1.5 * segmentRadius, -1.5*hexHeight],
        [3.0 * segmentRadius, hexHeight], [3.0 * segmentRadius, -hexHeight],
        [-3.0 * segmentRadius, hexHeight], [-3.0 * segmentRadius, -hexHeight],
        [3.0 * segmentRadius, 0], [-3.0 * segmentRadius, 0]
    ];
    
    // We only use 18 (skip the center one which is the hole for the ISIM)
    const actualPositions = positions.slice(1);
    
    actualPositions.forEach(pos => {
        const hex = new THREE.Mesh(new THREE.CylinderGeometry(segmentRadius, segmentRadius, 0.05, 6).rotateX(Math.PI/2), goldBeryllium);
        hex.position.set(pos[0], pos[1], 0);
        // Add a slight curvature to the entire primary mirror by angling the segments very slightly inward
        hex.rotation.x = -pos[1] * 0.02;
        hex.rotation.y = pos[0] * 0.02;
        segments.add(hex);
    });
    
    mirrorGroup.add(segments);
    
    parts.push({ mesh: segments.children[0], name: "Primary Mirror (18 Beryllium Segments)", description: "6.5-meter unfolding gold-coated mirror.", function: "Captures incredibly faint infrared light from the earliest galaxies in the universe."});

    // ==========================================
    // 3. PROCEDURAL CAD: Secondary Mirror & ISIM
    // ==========================================
    // Secondary mirror supported by 3 struts
    const secondaryGroup = new THREE.Group();
    
    // The struts (Deployable tripod)
    const strutMat = blackCarbon;
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), strutMat); s1.position.set(0, 2.0, 1.6); s1.rotation.x = Math.PI/4;
    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.8), strutMat); s2.position.set(2.0, -1.0, 1.6); s2.lookAt(0, 0, 3.2);
    const s3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.8), strutMat); s3.position.set(-2.0, -1.0, 1.6); s3.lookAt(0, 0, 3.2);
    
    secondaryGroup.add(s1, s2, s3);
    
    // The secondary mirror itself
    const secMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32).rotateX(Math.PI/2), goldBeryllium);
    secMirror.position.set(0, 0, 3.2);
    secMirror.rotation.y = Math.PI; // Face the primary
    secondaryGroup.add(secMirror);
    
    mirrorGroup.add(secondaryGroup);
    
    // The Integrated Science Instrument Module (ISIM) - sits behind the primary mirror
    const isim = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.5), blackCarbon);
    isim.position.set(0, 0, -1.0);
    mirrorGroup.add(isim);
    
    group.add(mirrorGroup);
    group.userData.animatedMeshes['mirror'] = mirrorGroup;

    // ==========================================
    // 4. PROCEDURAL CAD: Deep Space Photon VFX
    // ==========================================
    const photonCount = 20;
    for(let i=0; i<photonCount; i++) {
        const photon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), irPhoton);
        // Start them far away
        const startX = (Math.random() - 0.5) * 4.0;
        const startY = (Math.random() - 0.5) * 4.0;
        const startZ = 10.0 + Math.random() * 5.0;
        
        photon.position.set(startX, startY, startZ);
        // Store trajectory info
        photon.userData = { sx: startX, sy: startY, sz: startZ, phase: Math.random() * Math.PI * 2 };
        
        // Photons hit the primary, then bounce to the secondary (at 0,0,3.2), then into the ISIM (0,0,0)
        group.add(photon);
        group.userData.animatedMeshes.photons.push(photon);
    }

    // ==========================================
    // 5. Factual Fasteners (11,000 parts)
    // ==========================================
    const boltCount = 11000;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < boltCount; i++) {
        if (i < 6000) {
            // Sunshield deployment mechanism bolts (Thousands of tiny pulleys and cables)
            dummy.position.set((Math.random() - 0.5) * 4.0, -0.4 + (Math.random() * 0.4), (Math.random() - 0.5) * 6.0);
            dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        } else {
            // Backplane structural fasteners (Holding the 18 mirror segments securely through launch)
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 2.2;
            // Align with backplane position (0, 0.8, -1.6)
            dummy.position.set(r * Math.cos(angle), 0.8 + r * Math.sin(angle), -1.55 + (Math.random()-0.5)*0.1);
            dummy.rotation.set(Math.PI/2, 0, angle);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "11,000 Aerospace Fasteners", description: "Factual quantity of instanced aerospace-grade titanium bolts.", function: "Secures the 300+ single-point-of-failure deployment mechanisms required to unfold the telescope in deep space." });
    
    // Scale adjustment
    group.scale.set(0.5, 0.5, 0.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The telescope slowly tracking a deep space target
            // It rotates incredibly smoothly using reaction wheels
            const trackAngle = Math.sin(timeAcc * 0.1 * speed) * 0.1;
            group.rotation.x = trackAngle;
            group.rotation.y = trackAngle * 0.5;
            
            // Photon VFX (Simulating light gathering)
            group.userData.animatedMeshes.photons.forEach((photon) => {
                photon.material.opacity = 0.5 + Math.random() * 0.5 * speed;
                
                // Photons fly in from Z=15, hit the primary mirror (Z=-1.5), bounce to secondary (Z=3.2), then to ISIM (Z=-1.5)
                photon.position.z -= 0.5 * speed;
                
                // If it hits the primary mirror
                if (photon.position.z < -1.4 && photon.position.z > -2.0 && Math.abs(photon.position.x) > 0.2) {
                    // Instantly bounce it to the secondary mirror (just a visual trick)
                    photon.position.set(0, 0.8, 3.2); // position of secondary
                } 
                // If it's at the secondary, bounce it into the ISIM
                else if (photon.position.z > 3.0 && photon.position.z < 3.5 && Math.abs(photon.position.x) < 0.2) {
                    photon.position.set(0, 0.8, -1.5); // Straight down the hole
                }
                // If it enters the ISIM, reset it
                else if (photon.position.z < -1.5 && Math.abs(photon.position.x) < 0.2) {
                    photon.position.set(photon.userData.sx, photon.userData.sy, photon.userData.sz);
                }
                
                // If it just misses everything (rare but possible in this simple sim)
                if (photon.position.z < -5.0) {
                     photon.position.set(photon.userData.sx, photon.userData.sy, photon.userData.sz);
                }
            });
            
        } else {
            // Idle
            group.rotation.x = 0;
            group.rotation.y = 0;
            group.userData.animatedMeshes.photons.forEach(photon => {
                photon.material.opacity = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
