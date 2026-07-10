import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const driveHullMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.5 }); // Heavy tungsten shielding
    const radiatorMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 }); // Carbon-carbon composites
    const magNozzleMat = new THREE.MeshPhysicalMaterial({ color: 0x778899, metalness: 0.9, roughness: 0.2 }); // Niobium-Titanium superconductors
    const injectorMat = new THREE.MeshPhysicalMaterial({ color: 0xaa8833, metalness: 0.8, roughness: 0.4 }); // Beryllium-copper injection valves
    
    // VFX Materials
    const annihilationCoreVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Pure energy flash
    const exhaustPlumeVFX = new THREE.MeshBasicMaterial({ color: 0xcc00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // High-velocity pion exhaust
    const radiatorHeatVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Infrared glow

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.plume = null;
    group.userData.animatedMeshes.nozzleCoils = [];
    group.userData.animatedMeshes.radiators = [];
    group.userData.animatedMeshes.injectors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Drive Core & Injectors
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // Main heavy shielding block (forward section)
    const shieldBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.0, 16).rotateX(Math.PI/2), driveHullMat);
    shieldBlock.position.set(0, 0, 1.5);
    coreGroup.add(shieldBlock);
    
    // Reactant Injection Toroids (feeding Hydrogen and Antihydrogen)
    for(let side of [1, -1]) {
        const injector = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), injectorMat);
        injector.rotation.x = Math.PI/2;
        injector.position.set(0, 0, 0.8 + (side * 0.2));
        coreGroup.add(injector);
        group.userData.animatedMeshes.injectors.push(injector);
        
        // Feed lines
        const feed1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0).rotateZ(Math.PI/2), injectorMat);
        feed1.position.set(0.6, 0, 0.8 + (side * 0.2));
        coreGroup.add(feed1);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: shieldBlock, name: "Tungsten Shadow Shield", description: "Massive forward radiation baffle.", function: "Protects the crew compartment and forward ship systems from the lethal gamma radiation produced by matter-antimatter annihilation."});

    // ==========================================
    // 2. PROCEDURAL CAD: Magnetic Nozzle & Radiators
    // ==========================================
    const nozzleGroup = new THREE.Group();
    
    // Superconducting Magnetic Nozzle Coils
    // Instead of a physical bell, antimatter drives use magnetic fields to direct the charged pion exhaust
    for(let i=0; i<6; i++) {
        // Coils get larger towards the rear to form a "bell" shape
        const radius = 0.5 + (i * 0.15);
        const zPos = 0.5 - (i * 0.4);
        
        const coil = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.1, 16, 32), magNozzleMat);
        // Slightly squashed/angled for structural realism
        coil.rotation.x = Math.PI/2;
        coil.position.set(0, 0, zPos);
        nozzleGroup.add(coil);
        group.userData.animatedMeshes.nozzleCoils.push(coil);
        
        // Structural struts holding the coils together
        if (i > 0) {
            for(let a=0; a<4; a++) {
                const angle = (a * Math.PI) / 2;
                const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45).rotateX(Math.PI/2), driveHullMat);
                // Position between this coil and the previous
                const prevR = 0.5 + ((i-1) * 0.15);
                const avgR = (radius + prevR) / 2;
                strut.position.set(avgR * Math.cos(angle), avgR * Math.sin(angle), zPos + 0.2);
                nozzleGroup.add(strut);
            }
        }
    }
    
    // Massive Thermal Radiator Fins (Arrayed around the forward section)
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const finGroup = new THREE.Group();
        finGroup.position.set(0.8 * Math.cos(angle), 0.8 * Math.sin(angle), 1.0);
        finGroup.rotation.z = angle;
        
        // The fin itself
        const fin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 1.5), radiatorMat);
        fin.position.set(1.0, 0, 0);
        finGroup.add(fin);
        
        // VFX heat glow overlay
        const glow = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.06, 1.55), radiatorHeatVFX);
        glow.position.set(1.0, 0, 0);
        finGroup.add(glow);
        group.userData.animatedMeshes.radiators.push(glow);
        
        nozzleGroup.add(finGroup);
    }
    
    group.add(nozzleGroup);
    parts.push({ mesh: nozzleGroup.children[0], name: "Superconducting Magnetic Nozzle", description: "Array of Niobium-Titanium electromagnets.", function: "Generates a massive magnetic bottle to contain the annihilation event, then shapes the resulting charged pions into a directed high-velocity exhaust plume."});

    // ==========================================
    // 3. PROCEDURAL CAD: Annihilation & Plume VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // The central annihilation core (Where matter meets antimatter)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), annihilationCoreVFX);
    core.position.set(0, 0, 0.5); // inside the first coil
    vfxGroup.add(core);
    group.userData.animatedMeshes.core = core;
    
    // The highly relativistic exhaust plume
    const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.5, 4.0, 32, 1, true).rotateX(Math.PI/2), exhaustPlumeVFX);
    plume.position.set(0, 0, -1.0); // Extending backwards
    vfxGroup.add(plume);
    group.userData.animatedMeshes.plume = plume;
    
    group.add(vfxGroup);

    // Scale and rotate for isometric viewing
    group.scale.set(0.4, 0.4, 0.4);
    group.rotation.y = Math.PI/4; // Angle it slightly so we can see the nozzle and plume
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Annihilation Core burns fiercely (blinding white/purple)
            group.userData.animatedMeshes.core.material.opacity = 0.8 + (Math.sin(timeAcc * 30 * speed) * 0.2); // Rapid flickering
            group.userData.animatedMeshes.core.scale.setScalar(1.0 + (Math.sin(timeAcc * 15 * speed) * 0.1));
            
            // 2. Exhaust Plume extends and pulses
            group.userData.animatedMeshes.plume.material.opacity = 0.7 * speed;
            // Lengthen the plume based on throttle
            const targetLength = 1.0 + (speed * 2.0) + (Math.random() * 0.2); // Jitter
            group.userData.animatedMeshes.plume.scale.z = targetLength;
            group.userData.animatedMeshes.plume.position.z = 0.5 - (targetLength * 2.0); // Adjust position as it scales
            
            // 3. Injectors vibrate from immense pressure
            group.userData.animatedMeshes.injectors.forEach((inj, index) => {
                inj.position.z = 0.8 + (index===0 ? 0.2 : -0.2) + (Math.sin(timeAcc * 50 * speed) * 0.01);
            });
            
            // 4. Radiators glow infrared to dump waste heat
            group.userData.animatedMeshes.radiators.forEach(rad => {
                rad.material.opacity = 0.4 * speed + (Math.sin(timeAcc * 5 * speed) * 0.1); // Slow breathing heat
            });
            
            // 5. Magnetic Nozzle Coils thrum (scale slightly)
            group.userData.animatedMeshes.nozzleCoils.forEach((coil, i) => {
                const scale = 1.0 + (Math.sin(timeAcc * 20 * speed + i) * 0.02 * speed);
                coil.scale.set(scale, scale, 1.0);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.core.material.opacity = 0.0;
            group.userData.animatedMeshes.plume.material.opacity = 0.0;
            group.userData.animatedMeshes.radiators.forEach(rad => rad.material.opacity = 0.0);
            group.userData.animatedMeshes.nozzleCoils.forEach(coil => coil.scale.setScalar(1.0));
        }
    };

    group.userData.parts = parts;
    return group;
}
