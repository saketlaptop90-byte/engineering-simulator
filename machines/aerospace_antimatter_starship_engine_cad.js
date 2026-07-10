import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const tungstenShield = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.5 }); // Radiation shielding
    const superconductingCoil = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }); // Magnetic nozzle coils
    const injectorSteel = new THREE.MeshPhysicalMaterial({ color: 0x667788, metalness: 0.7, roughness: 0.4 }); // Propellant feeds
    const thermalRadiator = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 }); // Heat rejection
    
    // VFX Materials
    const annihilationVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Gamma ray burst core
    const pionExhaustVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Exhaust plume
    const magneticFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Confinement field

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumps = [];
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.exhaust = [];
    group.userData.animatedMeshes.fields = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Tungsten Shadow Shield & Truss
    // ==========================================
    // Protects the crew compartment from the immense gamma radiation
    const shieldGroup = new THREE.Group();
    
    // Massive solid Tungsten cone
    const shield = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.5, 32), tungstenShield);
    shield.position.y = 2.0;
    shieldGroup.add(shield);
    
    // Structural truss connecting shield to engine
    const truss = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0), steel);
        strut.position.set(1.5 * Math.cos(angle), 0.8, 1.5 * Math.sin(angle));
        // Angle inwards slightly
        strut.rotation.z = Math.cos(angle) * 0.2;
        strut.rotation.x = Math.sin(angle) * -0.2;
        truss.add(strut);
    }
    shieldGroup.add(truss);
    
    group.add(shieldGroup);
    parts.push({ mesh: shield, name: "Tungsten Shadow Shield", description: "Massive depleted tungsten cone.", function: "Casts a 'shadow' of radiation protection over the crew compartment, blocking lethal gamma rays produced during annihilation."});

    // ==========================================
    // 2. PROCEDURAL CAD: Matter/Antimatter Injector Pumps
    // ==========================================
    const injectorGroup = new THREE.Group();
    injectorGroup.position.set(0, -0.5, 0);
    
    // Mixing manifold
    const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16), injectorSteel);
    injectorGroup.add(manifold);
    
    // High-speed turbopumps feeding Hydrogen (Matter) and Anti-Hydrogen (Antimatter)
    for(let side of [-1, 1]) {
        const pump = new THREE.Group();
        pump.position.set(side * 1.2, 0, 0);
        pump.rotation.z = Math.PI/2;
        
        // Volute casing
        const casing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.15, 16, 32), injectorSteel);
        pump.add(casing);
        
        // Spinning impeller shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), chrome);
        pump.add(shaft);
        
        // Feed lines into manifold
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), copper);
        line.position.y = -0.4;
        pump.add(line);
        
        injectorGroup.add(pump);
        group.userData.animatedMeshes.pumps.push(shaft);
    }
    
    // Massive thermal radiators radiating out from the manifold
    for(let i=0; i<4; i++) {
        const rad = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.5, 3.0), thermalRadiator);
        const angle = (i * Math.PI) / 2 + Math.PI/4; // Offset 45 deg
        rad.position.set(1.5 * Math.cos(angle), 0, 1.5 * Math.sin(angle));
        rad.rotation.y = -angle;
        injectorGroup.add(rad);
    }
    
    group.add(injectorGroup);
    parts.push({ mesh: manifold, name: "Cryogenic Injection Turbopumps", description: "Magnetic levitation centrifugal pumps.", function: "Feeds precise ratios of hydrogen and anti-hydrogen into the reaction chamber without the antimatter ever touching the walls."});

    // ==========================================
    // 3. PROCEDURAL CAD: Superconducting Magnetic Nozzle
    // ==========================================
    // Instead of a physical bell nozzle (which would melt instantly), uses magnetic fields
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0, -1.5, 0);
    
    // A series of increasingly large superconducting rings
    const numRings = 5;
    for(let i=0; i<numRings; i++) {
        const r = 0.5 + (i * 0.4);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.1, 16, 64), superconductingCoil);
        ring.rotation.x = Math.PI/2;
        ring.position.y = -i * 0.6;
        nozzleGroup.add(ring);
        
        // Magnetic Field Lines VFX curving through the rings
        for(let j=0; j<8; j++) {
            if (i===0) { // Only generate lines once
                class FieldCurve extends THREE.Curve {
                    constructor(theta) { super(); this.t = theta; }
                    getPoint(t, optionalTarget = new THREE.Vector3()) {
                        const radius = 0.5 + (t * 2.0); // Flares outward
                        const y = -t * 3.0; // Moves downward
                        const x = radius * Math.cos(this.t);
                        const z = radius * Math.sin(this.t);
                        return optionalTarget.set(x, y, z);
                    }
                }
                const fieldGeo = new THREE.TubeGeometry(new FieldCurve((j * Math.PI * 2)/8), 32, 0.02, 4, false);
                const fieldLine = new THREE.Mesh(fieldGeo, magneticFieldVFX);
                nozzleGroup.add(fieldLine);
                group.userData.animatedMeshes.fields.push(fieldLine);
            }
        }
    }
    
    group.add(nozzleGroup);
    parts.push({ mesh: nozzleGroup.children[0], name: "Superconducting Magnetic Nozzle", description: "Array of massively powerful electromagnetic rings.", function: "Generates a shaped magnetic bottle that directs the charged pions (annihilation exhaust) out the back of the ship, generating immense thrust."});

    // ==========================================
    // 4. PROCEDURAL CAD: Annihilation Core & Exhaust VFX
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // The core annihilation point (just below the manifold)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), annihilationVFX);
    core.position.set(0, -1.0, 0);
    vfxGroup.add(core);
    group.userData.animatedMeshes.core = core;
    
    // Charged Pion Exhaust Plume (Extremely fast, highly energetic particles)
    for(let i=0; i<20; i++) {
        // Long streaks of light
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 1.0, 8), pionExhaustVFX);
        exhaust.userData = { t: Math.random(), speed: 1.0 + Math.random() };
        vfxGroup.add(exhaust);
        group.userData.animatedMeshes.exhaust.push(exhaust);
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
            
            // Turbopumps spin up
            group.userData.animatedMeshes.pumps.forEach(shaft => {
                shaft.rotation.y += 15.0 * speed;
            });
            
            // Core annihilation burns intensely
            // It flickers slightly due to quantum variations in injection
            group.userData.animatedMeshes.core.material.opacity = 0.7 + (Math.random() * 0.3 * speed);
            const s = 1.0 + (Math.sin(timeAcc * 50) * 0.05 * speed);
            group.userData.animatedMeshes.core.scale.set(s,s,s);
            
            // Magnetic nozzle field lines glow
            group.userData.animatedMeshes.fields.forEach((field, index) => {
                field.material.opacity = 0.3 + (Math.sin(timeAcc * 10 + index) * 0.2 * speed);
            });
            
            // Charged Pion Exhaust blasts out the magnetic nozzle
            group.userData.animatedMeshes.exhaust.forEach((plume, index) => {
                plume.userData.t += 0.1 * speed * plume.userData.speed; // Very fast
                if (plume.userData.t > 1.0) plume.userData.t = 0.0;
                
                // Shoot downwards, flaring out slightly based on the magnetic field
                const radius = plume.userData.t * 2.0; 
                const angle = (index * Math.PI * 2) / 20 + (timeAcc * speed * 2.0); // Swirl
                
                plume.position.x = radius * Math.cos(angle);
                plume.position.z = radius * Math.sin(angle);
                plume.position.y = -1.0 - (plume.userData.t * 8.0);
                
                // Stretch based on speed
                plume.scale.y = 1.0 + (speed * 4.0);
                
                plume.material.opacity = (1.0 - plume.userData.t) * speed;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.pumps.forEach(shaft => shaft.rotation.y *= 0.95);
            group.userData.animatedMeshes.core.material.opacity = 0;
            group.userData.animatedMeshes.fields.forEach(field => field.material.opacity = 0);
            group.userData.animatedMeshes.exhaust.forEach(plume => plume.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
