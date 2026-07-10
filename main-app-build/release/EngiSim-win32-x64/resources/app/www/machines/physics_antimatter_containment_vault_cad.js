import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const vacuumChamberMat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }); // Electropolished stainless steel
    const penningTrapElectrodeMat = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 }); // Gold-plated electrodes
    const superconCoilMat = new THREE.MeshPhysicalMaterial({ color: 0x334466, metalness: 0.8, roughness: 0.4 }); // Niobium-titanium magnets
    const blastShieldMat = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.5, roughness: 0.9 }); // Tungsten-carbide armor
    
    // VFX Materials
    const antimatterPlasmaVFX = new THREE.MeshBasicMaterial({ color: 0xcc00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Anti-hydrogen glow
    const magneticFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Visualization of the confinement field
    const annihilationFlashVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Stray atom annihilation

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.antimatter = null;
    group.userData.animatedMeshes.magneticLines = [];
    group.userData.animatedMeshes.flashes = [];
    group.userData.animatedMeshes.coils = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Vault & Vacuum Chamber
    // ==========================================
    const vaultGroup = new THREE.Group();
    
    // Heavy blast shielding (outer casing)
    // Modeled as an octagonal bunker
    const bunker = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 3.0, 8), blastShieldMat);
    // Cutaway view: remove the front face so we can see inside. (We'll just leave it open or use a semi-transparent material, but since this is CAD, let's just make it a ring/frame)
    // Actually, let's model it as heavy top and bottom plates with thick pillars.
    const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.4, 8), blastShieldMat);
    topPlate.position.y = 1.5;
    const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.4, 8), blastShieldMat);
    bottomPlate.position.y = -1.5;
    vaultGroup.add(topPlate, bottomPlate);
    
    for(let i=0; i<8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.0, 0.4), blastShieldMat);
        pillar.position.set(1.8 * Math.cos(angle), 0, 1.8 * Math.sin(angle));
        pillar.rotation.y = -angle;
        vaultGroup.add(pillar);
    }
    
    // Central Ultra-High Vacuum (UHV) Chamber (Spherical)
    const chamber = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), vacuumChamberMat);
    // Make it wireframe or transparent so we can see the trap inside
    chamber.material = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1, transmission: 0.9, thickness: 0.1 });
    vaultGroup.add(chamber);
    
    group.add(vaultGroup);
    parts.push({ mesh: bottomPlate, name: "Tungsten-Carbide Blast Vault", description: "Meter-thick armored bunker.", function: "Provides absolute physical security and emergency containment in the event of a catastrophic loss of the magnetic field."});

    // ==========================================
    // 2. PROCEDURAL CAD: Penning Trap & Superconducting Coils
    // ==========================================
    const trapGroup = new THREE.Group();
    
    // Superconducting Magnetic Coils (Helmholtz configuration)
    // These create the strong axial magnetic field
    const topCoil = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 64), superconCoilMat);
    topCoil.rotation.x = Math.PI/2;
    topCoil.position.y = 0.6;
    const bottomCoil = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.2, 16, 64), superconCoilMat);
    bottomCoil.rotation.x = Math.PI/2;
    bottomCoil.position.y = -0.6;
    trapGroup.add(topCoil, bottomCoil);
    group.userData.animatedMeshes.coils.push(topCoil, bottomCoil);
    
    // Gold-plated Electrodes (Hyperboloid shapes for the Penning Trap)
    // Top and bottom endcaps
    const endcapGeo = new THREE.CylinderGeometry(0.1, 0.4, 0.3, 32);
    const topEndcap = new THREE.Mesh(endcapGeo, penningTrapElectrodeMat);
    topEndcap.position.y = 0.35;
    const bottomEndcap = new THREE.Mesh(endcapGeo, penningTrapElectrodeMat);
    bottomEndcap.position.y = -0.35;
    bottomEndcap.rotation.x = Math.PI; // flip it
    trapGroup.add(topEndcap, bottomEndcap);
    
    // Central ring electrode
    const ringElectrode = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 64), penningTrapElectrodeMat);
    ringElectrode.rotation.x = Math.PI/2;
    trapGroup.add(ringElectrode);
    
    group.add(trapGroup);
    parts.push({ mesh: ringElectrode, name: "Gold-Plated Penning Trap", description: "Hyperboloid electrodes and NbTi superconducting magnets.", function: "Generates precisely tuned electromagnetic fields to suspend the antimatter in a perfect vacuum, preventing it from touching the walls and annihilating."});

    // ==========================================
    // 3. PROCEDURAL CAD: Antimatter & Magnetic VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // The Antimatter (Levitating in the center)
    const antimatter = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), antimatterPlasmaVFX);
    vfxGroup.add(antimatter);
    group.userData.animatedMeshes.antimatter = antimatter;
    
    // Magnetic Field Lines (Wireframe spheres/tubes connecting the coils)
    for(let i=0; i<4; i++) {
        const magLine = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 4, 32), magneticFieldVFX);
        // Rotate them to form a cage-like field visual
        magLine.rotation.y = (i * Math.PI) / 4;
        vfxGroup.add(magLine);
        group.userData.animatedMeshes.magneticLines.push(magLine);
    }
    
    // Occasional Annihilation Flashes (When stray normal matter atoms hit the antimatter)
    for(let i=0; i<3; i++) {
        const flash = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), annihilationFlashVFX);
        flash.userData = { active: false, life: 0 };
        vfxGroup.add(flash);
        group.userData.animatedMeshes.flashes.push(flash);
    }
    
    group.add(vfxGroup);

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Superconducting coils thrum with power (slight vibration/glow)
            group.userData.animatedMeshes.coils.forEach(coil => {
                coil.scale.set(1.0 + Math.sin(timeAcc * 30)*0.005*speed, 1.0, 1.0 + Math.sin(timeAcc * 30)*0.005*speed);
            });
            
            // 2. Magnetic Field Lines become visible and rotate
            group.userData.animatedMeshes.magneticLines.forEach(line => {
                line.material.opacity = 0.3 * speed;
                line.rotation.y += 0.5 * speed * 0.016; // Slowly revolve
                line.scale.y = 1.0 + (Math.sin(timeAcc * 5 * speed) * 0.05); // Breathe with the field
            });
            
            // 3. Antimatter Plasma glows and writhes in the trap
            const amScale = 1.0 + (Math.sin(timeAcc * 20 * speed) * 0.1);
            group.userData.animatedMeshes.antimatter.scale.set(amScale, amScale, amScale);
            group.userData.animatedMeshes.antimatter.material.opacity = 0.7 + (Math.random() * 0.3);
            
            // 4. Random Annihilation Flashes (Stray atoms)
            group.userData.animatedMeshes.flashes.forEach(flash => {
                if (!flash.userData.active && Math.random() < 0.02 * speed) {
                    flash.userData.active = true;
                    flash.userData.life = 1.0;
                    // Position randomly on the surface of the antimatter
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    const r = 0.15 * amScale;
                    flash.position.set(
                        r * Math.sin(phi) * Math.cos(theta),
                        r * Math.cos(phi),
                        r * Math.sin(phi) * Math.sin(theta)
                    );
                }
                
                if (flash.userData.active) {
                    flash.userData.life -= 0.1 * speed; // Fast flash
                    flash.material.opacity = flash.userData.life;
                    const fScale = 1.0 + (1.0 - flash.userData.life)*2.0; // Expand as it fades
                    flash.scale.set(fScale, fScale, fScale);
                    if (flash.userData.life <= 0) flash.userData.active = false;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.coils.forEach(c => c.scale.set(1,1,1));
            group.userData.animatedMeshes.magneticLines.forEach(l => l.material.opacity = 0);
            group.userData.animatedMeshes.antimatter.material.opacity = 0.2;
            group.userData.animatedMeshes.antimatter.scale.set(1,1,1);
            group.userData.animatedMeshes.flashes.forEach(f => f.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
