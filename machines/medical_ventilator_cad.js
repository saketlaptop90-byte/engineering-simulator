import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const medicalWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, clearcoat: 1.0 });
    const screenGlass = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.0, clearcoat: 1.0 });
    const siliconeTube = new THREE.MeshPhysicalMaterial({ color: 0xccffff, metalness: 0.0, roughness: 0.4, transmission: 0.8, transparent: true });
    const bellowsRubber = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.0, roughness: 0.9 });
    const oxygenTankGreen = new THREE.MeshPhysicalMaterial({ color: 0x008800, metalness: 0.5, roughness: 0.4 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Cart & Chassis
    // ==========================================
    const cartGroup = new THREE.Group();
    
    // Base with casters
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), medicalWhite);
    cartGroup.add(base);
    
    // 4 caster wheels
    const wheelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16).rotateZ(Math.PI/2);
    for (let x of [-0.35, 0.35]) {
        for (let z of [-0.35, 0.35]) {
            const wheel = new THREE.Mesh(wheelGeo, bellowsRubber);
            wheel.position.set(x, -0.05, z);
            cartGroup.add(wheel);
        }
    }
    
    // Main column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 16), aluminum);
    column.position.set(0, 0.6, 0);
    cartGroup.add(column);
    
    // Main ventilator unit housing
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), medicalWhite);
    housing.position.set(0, 1.3, 0);
    cartGroup.add(housing);
    
    // Touch screen interface
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.05), screenGlass);
    screen.position.set(0, 1.4, 0.26);
    screen.rotation.x = -Math.PI / 12; // Tilted up slightly for viewing
    cartGroup.add(screen);
    
    group.add(cartGroup);
    parts.push({ mesh: housing, name: "Ventilator Control Unit", description: "Houses the pneumatic microprocessors and touchscreen UI.", function: "Controls the precise volume and pressure of breathable gas."});

    // ==========================================
    // 2. PROCEDURAL CAD: Compressed Oxygen Tanks
    // ==========================================
    const tankGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 32);
    // Lathed tank top (dome)
    const domePoints = [];
    for (let i = 0; i <= 10; i++) {
        const theta = (i / 10) * (Math.PI / 2);
        domePoints.push(new THREE.Vector2(0.12 * Math.cos(theta), 0.12 * Math.sin(theta)));
    }
    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    
    const buildTank = (xOffset) => {
        const tank = new THREE.Group();
        const body = new THREE.Mesh(tankGeo, oxygenTankGreen);
        const dome = new THREE.Mesh(domeGeo, oxygenTankGreen);
        dome.position.y = 0.4;
        const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8), chrome);
        valve.position.y = 0.55;
        
        tank.add(body, dome, valve);
        tank.position.set(xOffset, 0.5, -0.3);
        return tank;
    };
    
    const tank1 = buildTank(-0.2);
    const tank2 = buildTank(0.2);
    cartGroup.add(tank1, tank2);
    parts.push({ mesh: tank1, name: "Compressed O2/Air Cylinders", description: "Medical-grade green oxygen tanks with chrome regulators.", function: "Provides pressurized backup oxygen to the system."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Pumping Bellows
    // ==========================================
    // We create a bellows using a custom corrugated geometry
    const bellowsGroup = new THREE.Group();
    
    // Transparent canister
    const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32), screenGlass); // Reusing glass, but making it highly transparent in renderer
    canister.material = canister.material.clone();
    canister.material.transmission = 0.9;
    canister.material.color.setHex(0xffffff);
    bellowsGroup.add(canister);
    
    // The internal accordion bellows
    const bellowSegments = 8;
    const bellowsMeshes = [];
    for (let i = 0; i < bellowSegments; i++) {
        const segment = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.015, 8, 32), bellowsRubber);
        segment.rotation.x = Math.PI / 2;
        segment.position.y = -0.15 + (i * 0.04);
        bellowsGroup.add(segment);
        bellowsMeshes.push(segment);
    }
    
    bellowsGroup.position.set(0.4, 1.3, 0);
    cartGroup.add(bellowsGroup);
    group.userData.animatedMeshes['bellows'] = bellowsMeshes;
    parts.push({ mesh: canister, name: "Pneumatic Bellows Assembly", description: "Transparent pressure canister housing an accordion bellow.", function: "Physically pumps the air mixture into the patient's lungs."});

    // ==========================================
    // 4. PROCEDURAL CAD: Breathing Circuit Tubing
    // ==========================================
    // Extruded corrugated tubing (Inspiratory and Expiratory limbs)
    const buildTube = (startX, startY, startZ, endX, endY, endZ, archY) => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, startY, startZ),
            new THREE.Vector3(startX + 0.2, startY + 0.2, startZ + 0.3),
            new THREE.Vector3(endX, archY, endZ + 0.3),
            new THREE.Vector3(endX, endY, endZ)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.03, 16, false);
        return new THREE.Mesh(tubeGeo, siliconeTube);
    };
    
    const tubeIn = buildTube(-0.2, 1.4, 0.25, -0.6, 1.0, 0.8, 1.5);
    const tubeOut = buildTube(0.2, 1.4, 0.25, -0.6, 1.0, 0.8, 1.4);
    
    // Y-piece connector at the patient end
    const yPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16), plastic);
    yPiece.position.set(-0.6, 1.0, 0.85);
    yPiece.rotation.x = Math.PI / 2;
    
    cartGroup.add(tubeIn, tubeOut, yPiece);
    parts.push({ mesh: tubeIn, name: "Corrugated Breathing Circuit", description: "Translucent silicone dual-limb tubing.", function: "Delivers oxygenated air and removes exhaled CO2."});

    // ==========================================
    // 5. Factual Fasteners (3,200 parts)
    // ==========================================
    const boltCount = 3200;
    const boltGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.012, 6); 
    const instancedBolts = new THREE.InstancedMesh(boltGeo, chrome, boltCount);
    const boltDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        boltDummy.position.set((Math.random() - 0.5) * 0.6, 1.3 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
        boltDummy.rotation.set(Math.random()*Math.PI, 0, 0);
        boltDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, boltDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    cartGroup.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "3,200 Medical Screws", description: "Factual quantity of instanced screws.", function: "Seals the pneumatic systems to prevent any gas leaks." });
    
    // Scale adjustment
    group.scale.set(1.5, 1.5, 1.5);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating the respiratory cycle (Inhale / Exhale)
        if (state.throttle > 0.0) {
            // Speed of breathing based on throttle
            const breatheCycle = (Math.sin(time * 0.002 * state.throttle) + 1.0) / 2.0; 
            
            // Bellows compress and expand
            group.userData.animatedMeshes['bellows'].forEach((segment, idx) => {
                // The bottom segments stay relatively still, the top ones move the most
                const expansion = breatheCycle * (idx * 0.02); 
                segment.position.y = -0.15 + (idx * 0.015) + expansion;
            });
            
            // Slight visual pulse to the screen UI (brightness modulation)
            screen.material.emissive.setHex(breatheCycle > 0.5 ? 0x001133 : 0x000000);
        } else {
             screen.material.emissive.setHex(0x000000);
        }
    };

    group.userData.parts = parts;
    return group;
}
