import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const marineSteel = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.7, roughness: 0.6 }); // Anti-fouling coated steel
    const bioFouledBase = new THREE.MeshPhysicalMaterial({ color: 0x223322, metalness: 0.1, roughness: 1.0 }); // Algae/Barnacle covered concrete
    const rotorComposite = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.4, clearcoat: 0.1 }); // Carbon fiber/epoxy
    
    // VFX Materials
    const cavitationGlow = new THREE.MeshBasicMaterial({ color: 0xaaeeff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Gravity Base Foundation
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Massive concrete tripod/gravity base
    const baseGeo = new THREE.CylinderGeometry(8.0, 10.0, 3.0, 3);
    const baseConcrete = new THREE.Mesh(baseGeo, bioFouledBase);
    baseConcrete.position.set(0, 1.5, 0);
    baseGroup.add(baseConcrete);
    
    // Monopile tower supporting the nacelle
    const towerGeo = new THREE.CylinderGeometry(1.5, 2.0, 12.0, 32);
    const tower = new THREE.Mesh(towerGeo, marineSteel);
    tower.position.set(0, 9.0, 0);
    baseGroup.add(tower);
    
    // Scour protection (rocks around base)
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.5, 1), bioFouledBase, 200);
    const dummy = new THREE.Object3D();
    for(let i=0; i<200; i++) {
        const radius = 9.0 + Math.random() * 4.0;
        const angle = Math.random() * Math.PI * 2;
        dummy.position.set(Math.cos(angle)*radius, Math.random()*1.0, Math.sin(angle)*radius);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        const scale = 0.5 + Math.random()*1.5;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        rocks.setMatrixAt(i, dummy.matrix);
    }
    rocks.instanceMatrix.needsUpdate = true;
    baseGroup.add(rocks);

    group.add(baseGroup);
    parts.push({ mesh: baseConcrete, name: "Gravity Base Foundation", description: "1,500-ton reinforced concrete tripod.", function: "Keeps the massive turbine firmly anchored to the seabed against extreme tidal currents without drilling."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Nacelle (Housing)
    // ==========================================
    const nacelleGroup = new THREE.Group();
    nacelleGroup.position.set(0, 15.0, 0); // Top of the tower
    
    // Main bullet-shaped nacelle body
    const nacelleBodyGeo = new THREE.CapsuleGeometry(2.0, 8.0, 32, 32);
    const nacelle = new THREE.Mesh(nacelleBodyGeo, marineSteel);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(0, 0, 0);
    nacelleGroup.add(nacelle);
    
    // Cooling fins (sea water cools the generator directly)
    for(let i=0; i<10; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 4.2, 5.0);
        const fin = new THREE.Mesh(finGeo, marineSteel);
        fin.position.set(0, 0, -1.0);
        fin.rotation.z = (i * Math.PI * 2) / 10;
        nacelleGroup.add(fin);
    }
    
    // Yaw mechanism (allows nacelle to face the tide)
    group.userData.animatedMeshes['nacelle'] = nacelleGroup; // Rotates around Y axis
    group.add(nacelleGroup);
    
    parts.push({ mesh: nacelle, name: "Subsea Nacelle & Generator", description: "Hermetically sealed bullet casing containing a 2MW direct-drive permanent magnet generator.", function: "Converts the immense torque of the tidal rotor into electrical power while being passively cooled by the ocean."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Rotor Assembly
    // ==========================================
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0, 5.0); // Front of the nacelle
    
    // Massive nose cone (Spinner)
    const spinnerGeo = new THREE.ConeGeometry(2.0, 3.0, 32);
    const spinner = new THREE.Mesh(spinnerGeo, marineSteel);
    spinner.rotation.x = Math.PI / 2;
    spinner.position.set(0, 0, 1.5);
    rotorGroup.add(spinner);
    
    // Twin Bi-directional Blades (unlike wind, tidal blades often have symmetrical airfoils to work in both tide directions)
    const bladeGeo = new THREE.BoxGeometry(1.0, 0.2, 12.0); // We stretch a box and taper it for the blade shape
    
    const blade1 = new THREE.Group();
    const b1Mesh = new THREE.Mesh(bladeGeo, rotorComposite);
    b1Mesh.position.set(0, 0, 6.0); // Offset from hub
    // Pitch slightly
    b1Mesh.rotation.x = Math.PI / 8;
    blade1.add(b1Mesh);
    blade1.rotation.z = 0;
    
    const blade2 = new THREE.Group();
    const b2Mesh = new THREE.Mesh(bladeGeo, rotorComposite);
    b2Mesh.position.set(0, 0, 6.0);
    b2Mesh.rotation.x = Math.PI / 8;
    blade2.add(b2Mesh);
    blade2.rotation.z = Math.PI; // 180 degrees
    
    rotorGroup.add(blade1, blade2);
    
    // Tip Vortex Cavitation VFX
    // When pushing hard, blade tips in water create spiral cavitation trails
    const createVortex = () => {
        const trailGeo = new THREE.TorusGeometry(12.0, 0.2, 8, 64);
        const trail = new THREE.Mesh(trailGeo, cavitationGlow.clone());
        trail.position.set(0, 0, -2.0); // trails behind the blades
        return trail;
    };
    
    const vortex = createVortex();
    rotorGroup.add(vortex);
    group.userData.animatedMeshes['vortex'] = vortex;

    nacelleGroup.add(rotorGroup);
    group.userData.animatedMeshes['rotor'] = rotorGroup; // Spins around Z axis

    parts.push({ mesh: b1Mesh, name: "Bi-Directional Composite Blades", description: "24-meter diameter symmetrical airfoil blades.", function: "Captures the kinetic energy of the tidal stream. Symmetrical design allows operation in both ebb and flood tides without yawing 180 degrees."});

    // ==========================================
    // 4. Factual Fasteners (8,200 parts)
    // ==========================================
    const boltCount = 8200;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6); // Large marine bolts
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 4000) {
            // Blade root flange bolts (critical high-stress area)
            const theta = Math.random() * Math.PI * 2;
            const r = 1.8 + Math.random()*0.1;
            bDummy.position.set(r * Math.cos(theta), r * Math.sin(theta), 0.2 + (Math.random() - 0.5) * 0.4);
            bDummy.rotation.set(0, 0, theta);
        } else if (i < 6000) {
            // Nacelle casing flange (middle of the bullet)
            const theta = Math.random() * Math.PI * 2;
            const r = 2.0;
            bDummy.position.set(r * Math.cos(theta), r * Math.sin(theta), -2.0);
            bDummy.rotation.set(0, 0, theta);
        } else {
            // Tower base flange
            const theta = Math.random() * Math.PI * 2;
            const r = 2.2 + Math.random()*0.2;
            bDummy.position.set(r * Math.cos(theta), -6.0, r * Math.sin(theta)); // Relative to nacelle
            bDummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    nacelleGroup.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "8,200 High-Tensile Marine Bolts", description: "Factual quantity of instanced Inconel fasteners.", function: "Secures the massive blade roots to the hub, withstanding millions of cyclic fatigue loads in corrosive saltwater." });
    
    // Scale adjustment (It's a large underwater structure)
    group.scale.set(0.15, 0.15, 0.15);
    group.position.y = -1.0;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Simulating tidal flow
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Rotor spins (water is dense, so RPM is low but torque is massive)
            group.userData.animatedMeshes['rotor'].rotation.z += 0.03 * speed;
            
            // Nacelle gently yaws to track the current
            group.userData.animatedMeshes['nacelle'].rotation.y = Math.sin(timeAcc * 0.1) * 0.1;
            
            // Cavitation VFX intensity increases at high throttle
            // We scale the torus on Z to stretch the trail behind the blades
            group.userData.animatedMeshes['vortex'].scale.z = 1.0 + (speed * 4.0);
            group.userData.animatedMeshes['vortex'].material.opacity = speed * 0.4;
            
            // Rotate the vortex ring slightly slower than the blades to simulate slip
            group.userData.animatedMeshes['vortex'].rotation.z += 0.02 * speed;
            
        } else {
            // Idle (Slack water)
            group.userData.animatedMeshes['vortex'].material.opacity = 0;
            group.userData.animatedMeshes['vortex'].scale.z = 1.0;
        }
    };

    group.userData.parts = parts;
    return group;
}
