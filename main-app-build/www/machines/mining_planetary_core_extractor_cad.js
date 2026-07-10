import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const tungstenCasingMat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.6 }); // Heat-resistant bore walls
    const thermalSiphonMat = new THREE.MeshPhysicalMaterial({ color: 0xaa5533, metalness: 0.8, roughness: 0.3 }); // Copper-alloy heat exchangers
    const heavyPumpMat = new THREE.MeshPhysicalMaterial({ color: 0x223344, metalness: 0.7, roughness: 0.8 }); // Cast iron / steel pump housings
    
    // VFX Materials
    const coreMagmaVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Superheated liquid iron/nickel
    const heatDistortionVFX = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.0, transmission: 1.0, ior: 1.1, thickness: 2.0 }); // Convection waves
    const energyFlareVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Thermal energy being tapped

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.pumps = [];
    group.userData.animatedMeshes.magmaColumns = [];
    group.userData.animatedMeshes.siphons = [];
    group.userData.animatedMeshes.flares = [];
    group.userData.animatedMeshes.distortion = null;

    // ==========================================
    // 1. PROCEDURAL CAD: Tungsten Bore Casing & Base
    // ==========================================
    const facilityGroup = new THREE.Group();
    
    // Main shaft casing (Tungsten alloy to survive core temps)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4.0, 32), tungstenCasingMat);
    shaft.position.y = -2.0;
    facilityGroup.add(shaft);
    
    // Surface mounting flange / base station
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.5, 32), darkSteel);
    basePlate.position.y = 0.25;
    facilityGroup.add(basePlate);
    
    group.add(facilityGroup);
    parts.push({ mesh: shaft, name: "Tungsten Alloy Bore Casing", description: "Ultra-high-temp shaft lining extending into the outer core.", function: "Maintains structural integrity against millions of atmospheres of pressure and 5000°C ambient heat."});

    // ==========================================
    // 2. PROCEDURAL CAD: Magma Pumps & Thermal Siphons
    // ==========================================
    const extractionGroup = new THREE.Group();
    
    // 4 Massive multi-stage rotary pumps arrayed around the base
    for(let i=0; i<4; i++) {
        const pumpUnit = new THREE.Group();
        const angle = (i * Math.PI * 2) / 4;
        pumpUnit.position.set(2.0 * Math.cos(angle), 0.5, 2.0 * Math.sin(angle));
        pumpUnit.rotation.y = -angle; // Face outward
        
        // Pump housing
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2).rotateX(Math.PI/2), heavyPumpMat);
        housing.position.y = 0.6;
        pumpUnit.add(housing);
        
        // Rotary impeller casing (The part that spins inside)
        const impeller = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.25).rotateX(Math.PI/2), chrome);
        impeller.position.y = 0.6;
        pumpUnit.add(impeller);
        group.userData.animatedMeshes.pumps.push(impeller);
        
        // Connecting pipes (Thermal Siphons) leading down into the shaft
        class SiphonCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Arc from pump down into the center of the shaft
                const x = -2.0 * t; // move towards center
                const y = 0.6 - (3.0 * t); // move down
                const z = 0;
                return optionalTarget.set(x, y, z);
            }
        }
        const siphonGeo = new THREE.TubeGeometry(new SiphonCurve(), 16, 0.2, 8, false);
        const siphon = new THREE.Mesh(siphonGeo, thermalSiphonMat);
        pumpUnit.add(siphon);
        
        // Glowing magma flowing inside the siphon (VFX)
        // We'll duplicate the siphon geometry slightly smaller and glowing
        const magmaFlowGeo = new THREE.TubeGeometry(new SiphonCurve(), 16, 0.18, 8, false);
        const magmaFlow = new THREE.Mesh(magmaFlowGeo, coreMagmaVFX);
        pumpUnit.add(magmaFlow);
        group.userData.animatedMeshes.magmaColumns.push(magmaFlow);
        
        // Thermal flares emitting from the top of the pump housing (exhaust/heat exchange)
        const flare = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 1.0), energyFlareVFX);
        flare.position.set(0, 1.5, 0);
        pumpUnit.add(flare);
        group.userData.animatedMeshes.flares.push(flare);
        
        extractionGroup.add(pumpUnit);
    }
    
    group.add(extractionGroup);
    parts.push({ mesh: extractionGroup.children[0].children[0], name: "Multi-Stage Magma Pumps", description: "Heavy cast-iron/steel electromagnetic rotary pumps.", function: "Draws superheated liquid iron/nickel up through the thermal siphons to extract geothermal energy on a planetary scale."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Core Pool & VFX
    // ==========================================
    // The pool of magma visible at the bottom of the shaft
    const corePool = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.5, 32), coreMagmaVFX);
    corePool.position.y = -3.8;
    group.add(corePool);
    group.userData.animatedMeshes.corePool = corePool;
    
    // Intense heat distortion (Convection waves rising from the shaft)
    const heatDistortion = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 5.0, 16), heatDistortionVFX);
    heatDistortion.position.y = -1.5;
    group.add(heatDistortion);
    group.userData.animatedMeshes.distortion = heatDistortion;

    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Magma pumps spool up
            group.userData.animatedMeshes.pumps.forEach(pump => {
                pump.rotation.z -= 1.5 * speed; // Spin the impellers
            });
            
            // 2. Magma glows bright inside the siphons
            // We can simulate flow by modulating opacity in a wave
            group.userData.animatedMeshes.magmaColumns.forEach((col, index) => {
                col.material.opacity = 0.6 + (Math.sin(timeAcc * 10 * speed - index) * 0.3);
            });
            
            // 3. Core pool surges
            group.userData.animatedMeshes.corePool.material.opacity = 0.8 + (Math.sin(timeAcc * 5 * speed) * 0.2);
            group.userData.animatedMeshes.corePool.position.y = -3.8 + (Math.sin(timeAcc * 2 * speed) * 0.1);
            
            // 4. Heat flares vent from the pumps
            group.userData.animatedMeshes.flares.forEach(flare => {
                flare.material.opacity = 0.5 + (Math.random() * 0.5 * speed);
                flare.scale.y = 1.0 + (Math.random() * 1.5 * speed);
            });
            
            // 5. Intense heat distortion (convection waves)
            // Wobble the scale to create a refraction ripple effect
            const wobbleX = 1.0 + (Math.sin(timeAcc * 15 * speed) * 0.02 * speed);
            const wobbleZ = 1.0 + (Math.cos(timeAcc * 12 * speed) * 0.02 * speed);
            group.userData.animatedMeshes.distortion.scale.set(wobbleX, 1.0, wobbleZ);
            
        } else {
            // Idle
            group.userData.animatedMeshes.magmaColumns.forEach(col => col.material.opacity = 0.1);
            group.userData.animatedMeshes.corePool.material.opacity = 0.3;
            group.userData.animatedMeshes.corePool.position.y = -3.8;
            group.userData.animatedMeshes.flares.forEach(f => f.material.opacity = 0);
            group.userData.animatedMeshes.distortion.scale.set(1,1,1);
        }
    };

    group.userData.parts = parts;
    return group;
}
