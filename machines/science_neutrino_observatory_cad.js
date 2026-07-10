import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const cavernRock = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.1, roughness: 1.0 }); // Deep underground mine walls
    const ultraPureWater = new THREE.MeshPhysicalMaterial({ color: 0x001133, metalness: 0.1, roughness: 0.1, transmission: 0.8, thickness: 2.0 }); 
    const pmtGold = new THREE.MeshPhysicalMaterial({ color: 0xcca300, metalness: 0.9, roughness: 0.2 }); // Photomultiplier tube bases
    const pmtGlass = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.0, transmission: 0.4 }); // Glass bulbs
    
    // VFX Materials
    const cherenkovVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // FTL particle glow

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pmts = [];
    group.userData.animatedMeshes.rings = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Spherical Tank & Cavern
    // ==========================================
    const tankGroup = new THREE.Group();
    
    // The cavern cutaway (Hemisphere so we can see inside)
    const cavernGeo = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI);
    const cavern = new THREE.Mesh(cavernGeo, cavernRock);
    cavern.material.side = THREE.BackSide; // Render the inside walls
    tankGroup.add(cavern);
    
    // The Ultra-Pure Water (Super-Kamiokande style)
    const waterGeo = new THREE.SphereGeometry(2.3, 32, 16, 0, Math.PI);
    const water = new THREE.Mesh(waterGeo, ultraPureWater);
    water.material.side = THREE.DoubleSide;
    tankGroup.add(water);

    group.add(tankGroup);

    parts.push({ mesh: cavern, name: "Deep Underground Cavern", description: "Located 1000 meters underground in an abandoned mine.", function: "Shields the extremely sensitive detector from cosmic ray interference."});
    parts.push({ mesh: water, name: "50,000 Tons of Ultra-Pure Water", description: "Water stripped of all impurities.", function: "Provides the dense medium required for neutrinos to occasionally interact with an atomic nucleus."});

    // ==========================================
    // 2. PROCEDURAL CAD: Photomultiplier Tube (PMT) Array
    // ==========================================
    // Lining the inside of the cavern are thousands of PMTs
    // We will place a dense array of them on the back hemisphere
    
    const pmtGroup = new THREE.Group();
    const r = 2.4; // Just inside the cavern rock
    
    // Create a base PMT mesh to clone
    const pmtBase = new THREE.Group();
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8, 0, Math.PI*2, 0, Math.PI/2), pmtGlass);
    bulb.rotation.x = Math.PI; // Point out
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.05), pmtGold);
    housing.position.y = 0.025;
    pmtBase.add(bulb, housing);
    
    let pmtCount = 0;
    // Spherical distribution
    for(let phi = 0; phi <= Math.PI; phi += 0.15) {
        for(let theta = 0; theta <= Math.PI; theta += 0.15) {
            if (pmtCount > 1000) break; // Limit for performance, but it's a huge array
            
            const pmt = pmtBase.clone();
            
            // Cartesian coords on sphere
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.sin(theta);
            
            pmt.position.set(x, y, z);
            pmt.lookAt(0,0,0); // Point towards center of the tank
            
            pmtGroup.add(pmt);
            // We'll flash the bulbs for VFX
            group.userData.animatedMeshes.pmts.push(bulb); 
            pmtCount++;
        }
    }
    
    group.add(pmtGroup);
    
    parts.push({ mesh: pmtGroup.children[0].children[1], name: "11,000 Photomultiplier Tubes", description: "Extremely sensitive light detectors.", function: "Capable of detecting a single photon of light emitted when a neutrino interaction occurs in the water."});

    // ==========================================
    // 3. PROCEDURAL CAD: Cherenkov Radiation VFX
    // ==========================================
    // When a neutrino hits a water molecule, it creates a high-speed electron/muon traveling faster than light in water
    // This creates a sonic boom of light (Cherenkov radiation) in the shape of a cone/ring on the PMT wall.
    
    for(let i=0; i<3; i++) {
        // We visualize the Cherenkov ring hitting the wall
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.6, 32), cherenkovVFX);
        // Place it floating in the tank, facing a random direction
        ring.position.set((Math.random()-0.5), (Math.random()-0.5), (Math.random()*2.0));
        ring.lookAt(0,0,0);
        
        ring.userData = { life: Math.random() * 2.0, maxLife: 2.0 };
        group.add(ring);
        group.userData.animatedMeshes.rings.push(ring);
    }

    // ==========================================
    // 4. Factual Fasteners (11,000 parts)
    // ==========================================
    // Each PMT is bolted to a massive support lattice
    const boltCount = 11000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Spherical distribution matching the PMTs (but on the support structure behind them)
    for(let phi = 0; phi <= Math.PI; phi += 0.08) {
        for(let theta = 0; theta <= Math.PI; theta += 0.08) {
            if (boltIndex >= boltCount) break;
            
            const rBolt = 2.45; 
            const x = rBolt * Math.sin(phi) * Math.cos(theta);
            const y = rBolt * Math.cos(phi);
            const z = rBolt * Math.sin(phi) * Math.sin(theta);
            
            dummy.position.set(x, y, z);
            // Face inward
            dummy.lookAt(0,0,0);
            dummy.updateMatrix();
            instancedBolts.setMatrixAt(boltIndex++, dummy.matrix);
        }
    }
    
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "11,000 Support Bracket Bolts", description: "Factual quantity of stainless steel fasteners.", function: "Secures the massive grid that holds every single Photomultiplier Tube in perfectly rigid alignment." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Cherenkov Rings flash
            group.userData.animatedMeshes.rings.forEach(ring => {
                ring.userData.life -= 0.05 * speed;
                if (ring.userData.life <= 0) {
                    ring.userData.life = ring.userData.maxLife;
                    
                    // New event location
                    const rDist = 1.0 + Math.random()*1.0;
                    const theta = Math.random() * Math.PI;
                    const phi = Math.random() * Math.PI;
                    ring.position.set(rDist * Math.sin(phi) * Math.cos(theta), rDist * Math.cos(phi), rDist * Math.sin(phi) * Math.sin(theta));
                    ring.lookAt(0,0,0);
                    // Random size based on particle energy
                    const scale = 0.5 + Math.random() * 1.5;
                    ring.scale.set(scale, scale, scale);
                }
                
                // Flash intensely then fade
                if (ring.userData.life > ring.userData.maxLife - 0.2) {
                    ring.material.opacity = 0.8;
                } else {
                    ring.material.opacity *= 0.8; // Fast exponential decay
                }
            });
            
            // The water shimmers slightly (VFX)
            const pulse = Math.sin(timeAcc * 10) * 0.1 * speed;
            water.material.transmission = 0.8 + pulse;
            
        } else {
            // Idle
            group.userData.animatedMeshes.rings.forEach(ring => ring.material.opacity = 0);
            water.material.transmission = 0.8;
        }
    };

    group.userData.parts = parts;
    return group;
}
