import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const superAlloyMat = new THREE.MeshPhysicalMaterial({ color: 0x555566, metalness: 0.9, roughness: 0.3 }); // Main structural rings
    const exoticMatterInjectorMat = new THREE.MeshPhysicalMaterial({ color: 0xaa7733, metalness: 0.8, roughness: 0.2 }); // Bronze/gold colored injectors
    const casimirPlateMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.05 }); // Hyper-smooth Casimir plates
    const stasisFieldMat = new THREE.MeshPhysicalMaterial({ color: 0x88bbff, metalness: 0.1, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.5 }); // Glassy containment
    
    // VFX Materials
    const wormholeThroatVFX = new THREE.MeshBasicMaterial({ color: 0x000000 }); // The pitch black throat
    const eventHorizonVFX = new THREE.MeshBasicMaterial({ color: 0x3300ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }); // Distorted spacetime rim
    const negativeEnergyVFX = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Exotic matter field

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.throat = null;
    group.userData.animatedMeshes.horizon = null;
    group.userData.animatedMeshes.negativeEnergy = [];
    group.userData.animatedMeshes.injectors = [];
    group.userData.animatedMeshes.rings = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Wormhole Throat & Horizon
    // ==========================================
    const throatGroup = new THREE.Group();
    
    // The actual wormhole throat (black sphere flattened into a disc/lens)
    const throat = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), wormholeThroatVFX);
    throat.scale.z = 0.1; // Flat lens
    throatGroup.add(throat);
    group.userData.animatedMeshes.throat = throat;
    
    // The glowing distorted rim (lensing effect)
    const horizon = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.3, 16, 64), eventHorizonVFX);
    throatGroup.add(horizon);
    group.userData.animatedMeshes.horizon = horizon;
    
    group.add(throatGroup);
    parts.push({ mesh: throat, name: "Einstein-Rosen Bridge", description: "Topological spacetime shortcut.", function: "Connects two distant points in spacetime, allowing instantaneous travel without violating local relativity."});

    // ==========================================
    // 2. PROCEDURAL CAD: Casimir Energy Rings & Frame
    // ==========================================
    const frameGroup = new THREE.Group();
    
    // Three massive nested gimbal rings that stabilize the throat
    for(let i=0; i<3; i++) {
        const ringRadius = 2.8 + (i * 0.4);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.1, 16, 64), superAlloyMat);
        
        // Inner surfaces of rings lined with Casimir plates
        const plateGeo = new THREE.CylinderGeometry(ringRadius-0.05, ringRadius-0.05, 0.15, 64, 1, true);
        const plate = new THREE.Mesh(plateGeo, casimirPlateMat);
        plate.rotation.x = Math.PI/2;
        ring.add(plate);
        
        frameGroup.add(ring);
        group.userData.animatedMeshes.rings.push(ring);
    }
    
    // Structural support base
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.5, 2.0), superAlloyMat);
    base.position.y = -3.5;
    frameGroup.add(base);
    
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.0, 1.0), superAlloyMat);
    pillarL.position.set(-3.2, -1.5, 0);
    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.0, 1.0), superAlloyMat);
    pillarR.position.set(3.2, -1.5, 0);
    frameGroup.add(pillarL, pillarR);
    
    group.add(frameGroup);
    parts.push({ mesh: frameGroup.children[0].children[0], name: "Casimir Vacuum Plates", description: "Nanoscale separation arrays.", function: "Exploits the Casimir effect to generate microscopic amounts of negative energy density to hold the throat open."});

    // ==========================================
    // 3. PROCEDURAL CAD: Exotic Matter Injectors
    // ==========================================
    const injectorGroup = new THREE.Group();
    
    // Six large injectors pointing inward to feed negative mass into the horizon
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI*2) / 6;
        const inj = new THREE.Group();
        inj.position.set(2.4 * Math.cos(angle), 2.4 * Math.sin(angle), 0);
        inj.lookAt(0,0,0); // Point to center
        
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.8).rotateX(Math.PI/2), exoticMatterInjectorMat);
        barrel.position.set(0, 0, 0.4);
        inj.add(barrel);
        
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), superAlloyMat);
        housing.position.set(0, 0, 0.8);
        inj.add(housing);
        
        // Negative energy beam (VFX)
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1.5).rotateX(Math.PI/2), negativeEnergyVFX);
        beam.position.set(0, 0, -0.4);
        inj.add(beam);
        
        injectorGroup.add(inj);
        group.userData.animatedMeshes.injectors.push({ barrel: barrel, beam: beam });
        group.userData.animatedMeshes.negativeEnergy.push(beam);
    }
    
    group.add(injectorGroup);
    parts.push({ mesh: injectorGroup.children[0].children[0], name: "Exotic Matter Injector", description: "Negative mass-energy accelerators.", function: "Fires streams of exotic matter (particles with negative mass) directly into the throat to prevent it from pinching off and collapsing."});

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Gimbal Rings Spin
            group.userData.animatedMeshes.rings[0].rotation.y = timeAcc * 1.5 * speed;
            group.userData.animatedMeshes.rings[1].rotation.x = timeAcc * 1.0 * speed;
            group.userData.animatedMeshes.rings[2].rotation.z = timeAcc * 0.5 * speed;
            
            // 2. Horizon flares and warps
            group.userData.animatedMeshes.horizon.material.opacity = 0.4 + (Math.sin(timeAcc * 10 * speed) * 0.4);
            group.userData.animatedMeshes.horizon.scale.set(1.0 + Math.sin(timeAcc*5*speed)*0.05, 1.0 + Math.cos(timeAcc*5*speed)*0.05, 1.0);
            
            // 3. Throat dilates open based on throttle
            // Base scale is 0.1, opens up to 1.0 (a sphere) to allow passage
            const targetZ = 0.1 + (speed * 0.9);
            group.userData.animatedMeshes.throat.scale.z += (targetZ - group.userData.animatedMeshes.throat.scale.z) * 0.1;
            
            // 4. Injectors pump back and forth and fire negative energy
            group.userData.animatedMeshes.injectors.forEach((inj, idx) => {
                const pump = Math.sin(timeAcc * 20 * speed + idx);
                inj.barrel.position.z = 0.4 + (pump * 0.05); // Recoil
                
                if (pump > 0) {
                    inj.beam.material.opacity = 0.8 * speed;
                    inj.beam.scale.x = 1.0 + (Math.random()*0.5);
                    inj.beam.scale.y = 1.0 + (Math.random()*0.5);
                } else {
                    inj.beam.material.opacity = 0.0;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.rings.forEach(r => r.rotation.set(0,0,0));
            group.userData.animatedMeshes.horizon.material.opacity = 0.2;
            group.userData.animatedMeshes.horizon.scale.setScalar(1.0);
            group.userData.animatedMeshes.throat.scale.z = 0.1;
            group.userData.animatedMeshes.injectors.forEach(inj => {
                inj.barrel.position.z = 0.4;
                inj.beam.material.opacity = 0.0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
