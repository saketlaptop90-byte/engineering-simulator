import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const spacecraftGold = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.3, clearcoat: 0.5 }); // MLI Blanket
    const graphite = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.2, roughness: 0.8 }); // Thruster channel walls
    const titaniumTank = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }); // Xenon propellant tanks
    const magneticCoil = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 }); // Electromagnets
    
    // VFX Materials
    const xenonPlasma = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Distinctive blue Hall-effect plasma

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.plumes = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Spacecraft Bus & Tanks
    // ==========================================
    const busGroup = new THREE.Group();
    
    // The main bus structure (Hexagonal)
    const busGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.0, 6);
    const bus = new THREE.Mesh(busGeo, spacecraftGold);
    busGroup.add(bus);
    
    // Xenon Propellant Tanks (Spherical titanium pressure vessels)
    const tankGeo = new THREE.SphereGeometry(0.5, 32, 32);
    for(let i=0; i<3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const tank = new THREE.Mesh(tankGeo, titaniumTank);
        // Place them protruding slightly from the bus
        tank.position.set(1.2 * Math.cos(angle), 0, 1.2 * Math.sin(angle));
        busGroup.add(tank);
        
        // Feed lines
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0).rotateX(Math.PI/2), darkSteel);
        pipe.position.copy(tank.position);
        pipe.lookAt(0, 0, 0); // Point inward
        busGroup.add(pipe);
    }
    
    group.add(busGroup);
    
    parts.push({ mesh: busGroup.children[1], name: "Xenon Propellant Tanks", description: "Supercritical Xenon gas stored at extremely high pressure.", function: "Provides the heavy inert gas that is ionized and accelerated by the thrusters."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Hall-Effect Thruster Array
    // ==========================================
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, -1.5, 0); // Mounted on the bottom
    
    // Mounting plate
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 6), darkSteel);
    thrusterGroup.add(plate);
    
    // An array of 4 massive Hall-effect thrusters
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const thruster = new THREE.Group();
        thruster.position.set(0.6 * Math.cos(angle), -0.2, 0.6 * Math.sin(angle));
        
        // Outer magnetic coil housing
        const outerHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32), magneticCoil);
        thruster.add(outerHousing);
        
        // The annular discharge channel (where the plasma forms)
        const channel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.31, 32, 1, true), graphite);
        channel.material.side = THREE.DoubleSide;
        thruster.add(channel);
        
        // Inner magnetic pole
        const innerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32), magneticCoil);
        thruster.add(innerPole);
        
        // The Hollow Cathode (Neutralizer) - sits on the outside of the thruster
        const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), aluminum);
        cathode.position.set(0.3, -0.1, 0);
        thruster.add(cathode);
        
        // Xenon Plasma Plume VFX
        // Hall effect thrusters have a very distinctive diverging cone of glowing blue plasma
        const plume = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.0, 32, 1, true), xenonPlasma);
        plume.position.set(0, -1.5, 0);
        plume.rotation.x = Math.PI; // point down
        thruster.add(plume);
        group.userData.animatedMeshes.plumes.push(plume);
        
        thrusterGroup.add(thruster);
    }
    
    group.add(thrusterGroup);
    
    parts.push({ mesh: thrusterGroup.children[1].children[1], name: "Hall-Effect Thrusters", description: "Array of four 50kW electrostatic thrusters.", function: "Uses a radial magnetic field to trap electrons, ionizing the Xenon gas and accelerating it to 30,000 m/s to provide highly efficient thrust."});

    // ==========================================
    // 3. Factual Fasteners (6,500 parts)
    // ==========================================
    const boltCount = 6500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Fasten the thrusters to the mounting plate
    for(let i=0; i<4; i++) {
        const tAngle = (i * Math.PI * 2) / 4;
        const tx = 0.6 * Math.cos(tAngle);
        const tz = 0.6 * Math.sin(tAngle);
        
        for(let j=0; j<500; j++) { // 2000 bolts
            if (boltIndex >= boltCount) break;
            const angle = Math.random() * Math.PI * 2;
            const r = 0.28;
            dummy.position.set(tx + r*Math.cos(angle), -1.55, tz + r*Math.sin(angle));
            dummy.rotation.set(0, 0, 0); 
            dummy.updateMatrix();
            instancedBolts.setMatrixAt(boltIndex, dummy.matrix);
            boltIndex++;
        }
    }
    
    // Tank mounts and bus structural bolts
    for (let i = boltIndex; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 2.8, (Math.random() - 0.5) * 3.0, (Math.random() - 0.5) * 2.8);
        dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "6,500 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the thruster array and pressure vessels against launch vibrations." });
    
    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Plume VFX
            group.userData.animatedMeshes.plumes.forEach(plume => {
                // Throttle controls length and opacity
                plume.material.opacity = 0.6 + (Math.random() * 0.2); // Flickering
                const plumeLength = 1.0 + (2.0 * speed);
                plume.scale.set(1.0, plumeLength, 1.0);
                plume.position.y = - (plumeLength * 3.0 / 2.0); // Keep it attached to the thruster base
            });
            
            // The entire spacecraft slowly accelerates/moves slightly to simulate thrust
            const vibe = Math.sin(timeAcc * 50) * 0.005 * speed;
            group.position.y = vibe;
            
        } else {
            // Idle
            group.position.y = 0;
            group.userData.animatedMeshes.plumes.forEach(plume => {
                plume.material.opacity = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
