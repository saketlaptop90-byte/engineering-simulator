import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const aerospaceAl = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 }); // CNC machined aluminum body
    const boronNitride = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.0, roughness: 0.9 }); // White ceramic discharge channel
    const magneticIron = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 }); // Magnetic circuit poles
    const copperCoil = new THREE.MeshPhysicalMaterial({ color: 0xcb6d51, metalness: 1.0, roughness: 0.3 }); // Electromagnet coils
    
    // VFX Materials (Xenon Plasma)
    const xenonGlowOuter = new THREE.MeshBasicMaterial({ color: 0x0044ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const xenonGlowInner = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const cathodeGlow = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Main Body & Magnetic Circuit
    // ==========================================
    const engineGroup = new THREE.Group();
    
    // Base Plate (Mounts to spacecraft)
    const baseGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.2, 32).rotateX(Math.PI/2);
    const base = new THREE.Mesh(baseGeo, aerospaceAl);
    base.position.set(0, 0, -1.5);
    engineGroup.add(base);
    
    // Outer Magnetic Pole (Iron ring)
    const outerPole = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.15, 16, 64), magneticIron);
    outerPole.position.set(0, 0, 0);
    engineGroup.add(outerPole);
    
    // Inner Magnetic Pole (Center iron cylinder)
    const innerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32).rotateX(Math.PI/2), magneticIron);
    innerPole.position.set(0, 0, -0.75);
    engineGroup.add(innerPole);
    
    // Electromagnet Coils (Outer ring of coils to generate the radial magnetic field)
    for(let i=0; i<8; i++) {
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16).rotateX(Math.PI/2), copperCoil);
        const angle = (i * Math.PI * 2) / 8;
        coil.position.set(1.6 * Math.cos(angle), 1.6 * Math.sin(angle), -0.7);
        // Align coils towards center
        coil.rotation.z = angle;
        engineGroup.add(coil);
    }
    
    // Central Electromagnet Coil
    const centerCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 32).rotateX(Math.PI/2), copperCoil);
    centerCoil.position.set(0, 0, -0.7);
    engineGroup.add(centerCoil);
    
    group.add(engineGroup);
    parts.push({ mesh: base, name: "Hall Effect Magnetic Circuit", description: "Iron poles and electromagnets generating a strong radial magnetic field.", function: "Traps electrons in a circular 'Hall current' to efficiently ionize the Xenon propellant."});

    // ==========================================
    // 2. PROCEDURAL CAD: Discharge Channel (Boron Nitride)
    // ==========================================
    // The ceramic channel where the plasma is formed
    const channelGeo = new THREE.CylinderGeometry(1.4, 1.4, 1.5, 64, 1, true).rotateX(Math.PI/2);
    const channelOuter = new THREE.Mesh(channelGeo, boronNitride);
    channelOuter.position.set(0, 0, -0.75);
    channelOuter.material.side = THREE.DoubleSide;
    
    const channelGeoInner = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 64, 1, true).rotateX(Math.PI/2);
    const channelInner = new THREE.Mesh(channelGeoInner, boronNitride);
    channelInner.position.set(0, 0, -0.75);
    channelInner.material.side = THREE.DoubleSide;
    
    // Gas Distributor (Anode) at the back of the channel
    const anode = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.3, 16, 64), chrome);
    anode.position.set(0, 0, -1.3);
    engineGroup.add(channelOuter, channelInner, anode);
    
    parts.push({ mesh: channelOuter, name: "Boron Nitride Discharge Channel", description: "High-temperature ceramic insulating walls.", function: "Contains the plasma where neutral Xenon atoms are bombarded by electrons, creating positively charged ions."});

    // ==========================================
    // 3. PROCEDURAL CAD: Hollow Cathode Neutralizer
    // ==========================================
    // Sits on the outside of the engine, injects electrons to neutralize the exhaust
    const cathodeGroup = new THREE.Group();
    cathodeGroup.position.set(0, 2.2, 0); // Mounted top center
    
    const catBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16).rotateX(Math.PI/2), aerospaceAl);
    const catTip = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.2, 16).rotateX(Math.PI/2), chrome);
    catTip.position.set(0, 0, 0.4);
    
    // Cathode electron glow
    const catGlow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), cathodeGlow);
    catGlow.position.set(0, 0, 0.55);
    group.userData.animatedMeshes['cathodeGlow'] = catGlow;
    
    cathodeGroup.add(catBody, catTip, catGlow);
    engineGroup.add(cathodeGroup);
    
    parts.push({ mesh: catBody, name: "Hollow Cathode Neutralizer", description: "Thermionic electron emitter.", function: "Injects electrons into the ion plume to neutralize it, preventing the spacecraft from building up a massive negative charge."});

    // ==========================================
    // 4. PROCEDURAL CAD: Xenon Plasma Plume VFX
    // ==========================================
    // The beautiful blue ion beam
    const plumeGroup = new THREE.Group();
    
    // Outer diffuse glow (Hall current ring)
    const ringGeo = new THREE.TorusGeometry(1.1, 0.25, 32, 64);
    const plasmaRing = new THREE.Mesh(ringGeo, xenonGlowOuter);
    plasmaRing.position.set(0, 0, 0.1);
    plumeGroup.add(plasmaRing);
    group.userData.animatedMeshes['plasmaRing'] = plasmaRing;
    
    // The exhaust beam stretching out into space
    const beamGeo = new THREE.CylinderGeometry(1.1, 3.0, 10.0, 64, 1, true).rotateX(Math.PI/2);
    const exhaustBeam = new THREE.Mesh(beamGeo, xenonGlowInner);
    exhaustBeam.position.set(0, 0, 5.0);
    exhaustBeam.material.side = THREE.DoubleSide;
    plumeGroup.add(exhaustBeam);
    group.userData.animatedMeshes['exhaustBeam'] = exhaustBeam;
    
    engineGroup.add(plumeGroup);

    // ==========================================
    // 5. Factual Fasteners (1,200 parts)
    // ==========================================
    const boltCount = 1200;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6).rotateX(Math.PI/2);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Bolts around the base plate
        const angle = Math.random() * Math.PI * 2;
        const r = 1.9;
        bDummy.position.set(r * Math.cos(angle), r * Math.sin(angle), -1.48);
        bDummy.rotation.set(0, 0, angle); 
        
        // Sometimes place them on the magnet coils
        if (i > 600) {
            const coilIndex = Math.floor(Math.random() * 8);
            const ca = (coilIndex * Math.PI * 2) / 8;
            const cr = 1.6;
            // Place on the outer pole ring
            bDummy.position.set((cr+(Math.random()-0.5)*0.2) * Math.cos(ca), (cr+(Math.random()-0.5)*0.2) * Math.sin(ca), -0.05);
            bDummy.rotation.set(0, 0, 0);
        }
        
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    engineGroup.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "1,200 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the magnetic poles and baseplate, built to withstand extreme launch vibrations." });
    
    // Scale adjustment (Ion thrusters are quite small)
    group.scale.set(1.5, 1.5, 1.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Xenon Plasma Glow (Intensely bright blue)
            group.userData.animatedMeshes['plasmaRing'].material.opacity = 0.6 + Math.random() * 0.4 * speed;
            group.userData.animatedMeshes['exhaustBeam'].material.opacity = 0.3 + Math.random() * 0.2 * speed;
            
            // Pulse the exhaust slightly to simulate plasma oscillation modes (common in Hall thrusters)
            const oscillation = 1.0 + Math.sin(timeAcc * 60) * 0.05;
            group.userData.animatedMeshes['exhaustBeam'].scale.set(oscillation, oscillation, 1.0 + speed*3);
            
            // Cathode neutralizing electron glow
            group.userData.animatedMeshes['cathodeGlow'].material.opacity = 0.8 + Math.random() * 0.2;
            
        } else {
            // Idle (Engine off)
            group.userData.animatedMeshes['plasmaRing'].material.opacity = 0;
            group.userData.animatedMeshes['exhaustBeam'].material.opacity = 0;
            group.userData.animatedMeshes['cathodeGlow'].material.opacity = 0;
            group.userData.animatedMeshes['exhaustBeam'].scale.set(1, 1, 1);
        }
    };

    group.userData.parts = parts;
    return group;
}
