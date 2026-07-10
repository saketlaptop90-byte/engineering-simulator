import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const megastructureMat = new THREE.MeshPhysicalMaterial({ color: 0x444455, metalness: 0.8, roughness: 0.3 }); // Star-straddling chassis
    const magneticNozzleMat = new THREE.MeshPhysicalMaterial({ color: 0x223366, metalness: 0.9, roughness: 0.2 }); // Massive superconducting rings
    const thermalShieldMat = new THREE.MeshPhysicalMaterial({ color: 0x99aa88, metalness: 0.6, roughness: 0.9 }); // Ablative carbon-carbon shielding
    const refineryMat = new THREE.MeshPhysicalMaterial({ color: 0x665544, metalness: 0.7, roughness: 0.5 }); // Isotope separation centrifuges
    
    // VFX Materials
    const stellarSurfaceVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 }); // The surface of the star
    const plasmaPlumeVFX = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Extracted stellar material
    const magneticFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Magnetic flux lines

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.plasma = [];
    group.userData.animatedMeshes.fluxLines = [];
    group.userData.animatedMeshes.centrifuges = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Star & Thermal Shields
    // ==========================================
    // A massive sphere representing the surface of the star (we only see the top arc)
    const starGeo = new THREE.SphereGeometry(15.0, 64, 32, 0, Math.PI*2, 0, Math.PI/4);
    const star = new THREE.Mesh(starGeo, stellarSurfaceVFX);
    star.position.y = -14.0; // Pushed down so we only see the top bulge at y=-0.5 to y=1.0
    group.add(star);
    
    const shieldGroup = new THREE.Group();
    shieldGroup.position.y = 1.2;
    
    // The main thermal shield array protecting the structure
    // A massive ring that blocks the star's radiation
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 4.0, 0.2, 64), thermalShieldMat);
    shieldGroup.add(shield);
    group.add(shieldGroup);
    
    parts.push({ mesh: shield, name: "Ablative Thermal Shielding", description: "Megameter-scale carbon-carbon umbrella.", function: "Protects the delicate superconducting systems from the intense heat and radiation of the star."});

    // ==========================================
    // 2. PROCEDURAL CAD: Magnetic Extraction Nozzles
    // ==========================================
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = 1.2;
    
    // Central magnetic extraction column
    for(let i=0; i<5; i++) {
        // Rings get smaller as they go up
        const radius = 2.0 - (i * 0.3);
        const yPos = i * 0.8;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.15, 16, 64), magneticNozzleMat);
        ring.rotation.x = Math.PI/2;
        ring.position.y = yPos;
        nozzleGroup.add(ring);
        
        // Vertical struts connecting the rings
        if (i < 4) {
            for(let s=0; s<6; s++) {
                const angle = (s * Math.PI*2) / 6;
                const nextRadius = 2.0 - ((i+1) * 0.3);
                // Slanted strut
                const strutGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.85);
                const strut = new THREE.Mesh(strutGeo, megastructureMat);
                
                // Approximate positioning and rotation
                const avgRad = (radius + nextRadius)/2;
                strut.position.set(avgRad * Math.cos(angle), yPos + 0.4, avgRad * Math.sin(angle));
                
                // Tilt inwards
                const tilt = Math.atan2(radius - nextRadius, 0.8);
                strut.rotation.z = Math.cos(angle) * tilt;
                strut.rotation.x = -Math.sin(angle) * tilt;
                
                nozzleGroup.add(strut);
            }
        }
    }
    
    group.add(nozzleGroup);
    parts.push({ mesh: nozzleGroup.children[0], name: "Magnetic Extraction Nozzle", description: "Colossal superconducting solenoid.", function: "Generates massive magnetic fields that squeeze the star's equator, forcing stellar plasma to erupt upwards along the polar axis."});

    // ==========================================
    // 3. PROCEDURAL CAD: Plasma Refining Torus
    // ==========================================
    const refineryGroup = new THREE.Group();
    refineryGroup.position.y = 5.0; // Top of the extraction column
    
    // Main processing torus
    const torus = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.4, 32, 64), refineryMat);
    torus.rotation.x = Math.PI/2;
    refineryGroup.add(torus);
    
    // Isotope separation centrifuges attached to the torus
    for(let i=0; i<8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const centrifuge = new THREE.Group();
        centrifuge.position.set(3.0 * Math.cos(angle), 0, 3.0 * Math.sin(angle));
        centrifuge.rotation.y = -angle;
        
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), refineryMat);
        drum.rotation.x = Math.PI/2;
        centrifuge.add(drum);
        
        const feedLine = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6).rotateZ(Math.PI/2), megastructureMat);
        feedLine.position.set(-0.3, 0, 0); // Connect back to torus
        centrifuge.add(feedLine);
        
        refineryGroup.add(centrifuge);
        group.userData.animatedMeshes.centrifuges.push(drum);
    }
    
    group.add(refineryGroup);
    parts.push({ mesh: torus, name: "Stellar Plasma Refinery", description: "Massive orbital processing station.", function: "Cools the extracted plasma and centrifugally separates it into useful elements like Hydrogen, Helium-3, and trace metals to feed the dyson swarm."});

    // ==========================================
    // 4. PROCEDURAL CAD: Stellar Extraction VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Central plasma plume erupting from the star
    // Multiple overlapping cylinders
    for(let i=0; i<3; i++) {
        const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.2 + i*0.2, 1.5 + i*0.5, 7.0, 32, 1, true), plasmaPlumeVFX);
        plume.position.y = 2.0;
        vfxGroup.add(plume);
        group.userData.animatedMeshes.plasma.push(plume);
    }
    
    // Magnetic flux lines wrapping around the plume
    for(let i=0; i<12; i++) {
        const line = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.02, 8, 32, Math.PI), magneticFieldVFX);
        line.position.y = 2.0;
        // We will animate these to spiral upwards
        line.userData = { offset: i * (Math.PI*2/12) };
        vfxGroup.add(line);
        group.userData.animatedMeshes.fluxLines.push(line);
    }
    
    group.add(vfxGroup);

    // Scale adjustment to fit simulator view
    group.scale.set(0.15, 0.15, 0.15);
    group.position.y = -0.5; // Shift down
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Plasma plume roars upwards
            group.userData.animatedMeshes.plasma.forEach((p, idx) => {
                p.material.opacity = (0.6 - (idx * 0.15)) * speed + (Math.sin(timeAcc * 20 * speed + idx) * 0.1);
                // Wiggle slightly
                p.scale.x = 1.0 + Math.sin(timeAcc * 30 * speed) * 0.05;
                p.scale.z = 1.0 + Math.cos(timeAcc * 30 * speed) * 0.05;
            });
            
            // 2. Magnetic flux lines spiral and constrict
            group.userData.animatedMeshes.fluxLines.forEach((line) => {
                line.material.opacity = 0.4 * speed;
                // Move up
                line.position.y += 2.0 * speed * 0.016;
                // Spin
                line.rotation.y += 0.05 * speed;
                
                if (line.position.y > 5.0) {
                    line.position.y = -1.0; // Reset at the star surface
                }
                
                // Scale based on height (tighter near the top)
                const heightFactor = (line.position.y + 1.0) / 6.0; // 0 to 1
                const targetScale = 1.5 - (heightFactor * 1.2);
                line.scale.set(targetScale, targetScale, targetScale);
            });
            
            // 3. Centrifuges spin rapidly
            group.userData.animatedMeshes.centrifuges.forEach(c => {
                c.rotation.y += 0.2 * speed;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.plasma.forEach(p => p.material.opacity = 0.0);
            group.userData.animatedMeshes.fluxLines.forEach(l => l.material.opacity = 0.0);
            group.userData.animatedMeshes.centrifuges.forEach(c => c.rotation.y = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
