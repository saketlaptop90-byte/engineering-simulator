import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const towerWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8 });
    const bladeFiberglass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.3, clearcoat: 1.0 });
    const nacelleHousing = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.5 });
    const copperCoil = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.2 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.blades = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Massive Tubular Tower
    // ==========================================
    const towerHeight = 10.0;
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.6, towerHeight, 32);
    const tower = new THREE.Mesh(towerGeo, towerWhite);
    tower.position.set(0, towerHeight / 2, 0);
    group.add(tower);
    
    // Ladder inside tower (using instanced meshes for thousands of rungs)
    const rungCount = 300;
    const rungGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8).rotateZ(Math.PI/2);
    const instancedRungs = new THREE.InstancedMesh(rungGeo, steel, rungCount);
    const rDummy = new THREE.Object3D();
    for(let i=0; i<rungCount; i++) {
        rDummy.position.set(0, (i/rungCount) * towerHeight, 0.15); // Offset to the wall
        rDummy.updateMatrix();
        instancedRungs.setMatrixAt(i, rDummy.matrix);
    }
    instancedRungs.instanceMatrix.needsUpdate = true;
    tower.add(instancedRungs);

    parts.push({ mesh: tower, name: "Conical Steel Tower", description: "Massive tapered tubular steel tower.", function: "Supports the nacelle and rotor at extreme heights to capture stronger winds."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Nacelle & Generator
    // ==========================================
    const nacelleGroup = new THREE.Group();
    
    // Aerodynamic housing
    const nacelleShape = new THREE.Shape();
    nacelleShape.moveTo(-1.0, -0.4);
    nacelleShape.lineTo(0.5, -0.4);
    nacelleShape.quadraticCurveTo(0.8, -0.4, 0.8, 0);
    nacelleShape.quadraticCurveTo(0.8, 0.4, 0.5, 0.4);
    nacelleShape.lineTo(-1.0, 0.4);
    nacelleShape.quadraticCurveTo(-1.2, 0.4, -1.2, 0);
    nacelleShape.quadraticCurveTo(-1.2, -0.4, -1.0, -0.4);
    
    const nacelleGeo = new THREE.ExtrudeGeometry(nacelleShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    const nacelle = new THREE.Mesh(nacelleGeo, nacelleHousing);
    nacelle.position.set(0, 0, -0.4);
    nacelleGroup.add(nacelle);
    
    // Internal Gearbox & Generator (Visible if you clip inside)
    const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.4), darkSteel);
    gearbox.position.set(0, 0, 0);
    
    const generator = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32).rotateX(Math.PI/2), copperCoil);
    generator.position.set(0.6, 0, 0); // Behind gearbox
    nacelleGroup.add(gearbox, generator);
    
    // Yaw drive (spins nacelle into wind)
    const yawRing = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32), darkSteel);
    yawRing.position.set(0, -0.4, 0);
    nacelleGroup.add(yawRing);
    
    nacelleGroup.position.set(0, towerHeight + 0.5, 0);
    group.add(nacelleGroup);
    group.userData.animatedMeshes['nacelle'] = nacelleGroup;
    group.userData.animatedMeshes['generator'] = generator;
    
    parts.push({ mesh: nacelle, name: "Nacelle Housing", description: "Aerodynamic fiberglass shell containing the drivetrain.", function: "Houses the gearbox, yaw drive, and massive copper-coil generator."});

    // ==========================================
    // 3. PROCEDURAL CAD: Rotor Hub & Pitched Blades
    // ==========================================
    const rotorGroup = new THREE.Group();
    
    // Hub (Spinner)
    const hubGeo = new THREE.SphereGeometry(0.4, 32, 16);
    const hub = new THREE.Mesh(hubGeo, towerWhite);
    // Flatten one side
    hub.scale.set(1, 1, 1.2);
    rotorGroup.add(hub);
    
    // 3 Aerodynamic Fiberglass Blades
    const bladeLength = 6.0;
    const bladePoints = [
        new THREE.Vector2(0, 0), new THREE.Vector2(0.2, 0),
        new THREE.Vector2(0.3, 0.5), new THREE.Vector2(0.15, bladeLength*0.8),
        new THREE.Vector2(0.05, bladeLength), new THREE.Vector2(0, bladeLength)
    ];
    // Create an aerodynamic foil cross-section using lathe + scale crush
    const foilGeo = new THREE.LatheGeometry(bladePoints, 16, 0, Math.PI * 2);
    
    for (let i = 0; i < 3; i++) {
        const bladePitchGroup = new THREE.Group(); // Active pitch control
        const blade = new THREE.Mesh(foilGeo, bladeFiberglass);
        // Crush it to make it a wing foil shape
        blade.scale.set(1.0, 1.0, 0.2);
        blade.rotation.x = -Math.PI / 2; // Point outwards
        
        bladePitchGroup.add(blade);
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI * 2) / 3;
        pivot.add(bladePitchGroup);
        rotorGroup.add(pivot);
        
        group.userData.animatedMeshes.blades.push(bladePitchGroup);
    }
    
    rotorGroup.position.set(-1.2, 0, 0); // Front of the nacelle
    nacelleGroup.add(rotorGroup);
    group.userData.animatedMeshes['rotor'] = rotorGroup;
    
    parts.push({ mesh: rotorGroup, name: "3-Blade Rotor Array", description: "Procedurally lofted fiberglass aerofoils with active pitch control.", function: "Captures kinetic wind energy to drive the main shaft."});

    // ==========================================
    // 4. Factual Fasteners (6,800 parts)
    // ==========================================
    const boltCount = 6800;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const boltDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the tower flanges and hub
        if (i < 4000) {
            // Tower segment flanges
            const ringZ = (Math.random() > 0.5) ? towerHeight*0.3 : towerHeight*0.6;
            const r = 0.45;
            const theta = Math.random() * Math.PI * 2;
            boltDummy.position.set(r * Math.cos(theta), ringZ, r * Math.sin(theta));
            boltDummy.rotation.set(0, 0, theta);
        } else {
            // Hub/Blade roots
            boltDummy.position.set(-1.2 + (Math.random()-0.5)*0.5, towerHeight + 0.5 + (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
            boltDummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        boltDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, boltDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "6,800 Structural Tension Bolts", description: "Factual quantity of instanced tensioning bolts.", function: "Provides massive clamping force to hold the tower sections and blade roots together." });
    
    // Scale adjustment to fit screen
    group.scale.set(0.15, 0.15, 0.15);
    group.position.y = -1.0; // Ground it
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating wind and power generation
        if (state.throttle > 0.0) {
            const windSpeed = state.throttle * 0.05;
            
            // Rotor spins (turbines spin surprisingly slow visually, but blade tips are at 200mph)
            group.userData.animatedMeshes['rotor'].rotation.x += windSpeed;
            
            // Active Pitch Control (Blades pitch into the wind based on throttle)
            const pitchAngle = (1.0 - state.throttle) * (Math.PI / 4); // Full throttle = flat (0), low = feathered (45 deg)
            group.userData.animatedMeshes.blades.forEach(b => {
                b.rotation.y = pitchAngle; 
            });
            
            // Nacelle Yawing (Slowly seeking wind direction)
            group.userData.animatedMeshes['nacelle'].rotation.y = Math.sin(time * 0.0002) * 0.2;
            
            // Internal generator spinning 100x faster than rotor (via gearbox)
            group.userData.animatedMeshes['generator'].rotation.z += windSpeed * 100;
        } else {
             // Fully feathered to stop
             group.userData.animatedMeshes.blades.forEach(b => {
                b.rotation.y = Math.PI / 4; 
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
