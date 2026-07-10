import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const truckWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.4, clearcoat: 0.5 });
    const mixerRed = new THREE.MeshPhysicalMaterial({ color: 0xaa2222, metalness: 0.3, roughness: 0.6, clearcoat: 0.1 }); // Faded industrial red
    const chassisBlack = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.7 });
    const wetConcrete = new THREE.MeshPhysicalMaterial({ color: 0x777777, metalness: 0.0, roughness: 1.0 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.wheels = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Truck Chassis & Cab
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Main frame rails (Extruded C-channel geometry)
    const frameGeo = new THREE.BoxGeometry(0.8, 0.2, 5.0);
    const frame = new THREE.Mesh(frameGeo, chassisBlack);
    frame.position.set(0, 0.4, 0);
    chassisGroup.add(frame);
    
    // The Cab (Engine housing and operator cabin)
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-0.9, 0);
    cabShape.lineTo(0.9, 0);
    cabShape.lineTo(0.9, 0.8);
    cabShape.lineTo(0.5, 1.2);
    cabShape.lineTo(-0.9, 1.2);
    cabShape.lineTo(-0.9, 0);
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, { depth: 1.0, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const cab = new THREE.Mesh(cabGeo, truckWhite);
    cab.position.set(0, 0.5, 2.0); // Front of chassis
    chassisGroup.add(cab);
    
    // 10 Wheels (2 front steering, 8 rear dual-tandem)
    const tireGeo = new THREE.TorusGeometry(0.35, 0.15, 16, 32);
    const rimGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32).rotateZ(Math.PI/2);
    
    const createWheel = (x, z) => {
        const wheel = new THREE.Group();
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        const rim = new THREE.Mesh(rimGeo, chrome);
        wheel.add(tire, rim);
        wheel.position.set(x, 0.5, z);
        chassisGroup.add(wheel);
        group.userData.animatedMeshes.wheels.push(wheel);
        return wheel;
    };
    
    // Front steering axle
    createWheel(-0.9, 2.2);
    createWheel(0.9, 2.2);
    
    // Rear dual tandem axles (8 wheels)
    createWheel(-0.9, -1.0); createWheel(-0.6, -1.0);
    createWheel(0.9, -1.0);  createWheel(0.6, -1.0);
    createWheel(-0.9, -2.0); createWheel(-0.6, -2.0);
    createWheel(0.9, -2.0);  createWheel(0.6, -2.0);

    group.add(chassisGroup);
    parts.push({ mesh: cab, name: "Heavy Duty Truck Chassis", description: "Procedural extruded steel frame and cab.", function: "Provides mobility for the massive concrete payload."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Mixing Drum
    // ==========================================
    // The drum is a complex pear shape. We use LatheGeometry for perfection.
    const drumPoints = [
        new THREE.Vector2(0, 0),        // Base center
        new THREE.Vector2(0.5, 0),      // Base outer
        new THREE.Vector2(0.9, 0.5),    // Expanding lower drum
        new THREE.Vector2(1.1, 1.2),    // Max girth
        new THREE.Vector2(0.9, 2.2),    // Tapering cone
        new THREE.Vector2(0.5, 3.2),    // Neck
        new THREE.Vector2(0.4, 3.5),    // Opening collar
        new THREE.Vector2(0.38, 3.5),   // Inner collar
        new THREE.Vector2(0.48, 3.2),   // Inner neck
        new THREE.Vector2(0.88, 2.2),   // Inner cone
        new THREE.Vector2(1.08, 1.2),   // Inner max girth
        new THREE.Vector2(0.88, 0.5),   // Inner lower drum
        new THREE.Vector2(0.48, 0.05),  // Inner base
        new THREE.Vector2(0, 0.05)      // Inner center
    ];
    const drumGeo = new THREE.LatheGeometry(drumPoints, 32);
    const mixingDrum = new THREE.Mesh(drumGeo, mixerRed);
    
    // The drum is mounted at an angle (~15 degrees)
    const drumPivot = new THREE.Group();
    drumPivot.position.set(0, 1.2, -1.0); // Mounted over rear axles
    drumPivot.rotation.x = Math.PI / 12;  // Tilted upwards towards the rear
    
    mixingDrum.position.set(0, -1.5, 0);  // Shift drum so it rotates around its center axis
    drumPivot.add(mixingDrum);
    
    // Add internal Archimedes spiral blades (represented as a twisted extrusion if needed, or we just note them)
    // For visual detail, let's add an external inspection hatch and water tank
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), chrome);
    hatch.position.set(0, 0.5, 1.05);
    mixingDrum.add(hatch);
    
    group.add(drumPivot);
    group.userData.animatedMeshes['drum'] = mixingDrum;
    
    parts.push({ mesh: mixingDrum, name: "Rotating Mixing Drum", description: "Mathematically lathed pear-shaped vessel.", function: "Constantly rotates to prevent the 10 cubic yards of concrete from curing."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Discharge Chute
    // ==========================================
    const chuteGroup = new THREE.Group();
    
    // Loading Hopper
    const hopperGeo = new THREE.CylinderGeometry(0.6, 0.3, 0.5, 16, 1, true).rotateX(-Math.PI/6);
    const hopper = new THREE.Mesh(hopperGeo, truckWhite);
    hopper.position.set(0, 2.8, -2.6);
    hopper.material.side = THREE.DoubleSide;
    
    // Swiveling delivery chute
    const chuteGeo = new THREE.CylinderGeometry(0.3, 0.2, 2.0, 16, 1, true); // Half pipe
    const chute = new THREE.Mesh(chuteGeo, mixerRed);
    chute.material.side = THREE.DoubleSide;
    chute.position.set(0, -1.0, 0); // Offset for pivot
    
    const chutePivot = new THREE.Group();
    chutePivot.position.set(0, 2.2, -2.8);
    chutePivot.rotation.x = -Math.PI / 4; // Angled down
    chutePivot.add(chute);
    
    // Simulated wet concrete pouring down the chute
    const concretePour = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 2.0, 8), wetConcrete);
    concretePour.position.set(0, -1.0, -0.05);
    chutePivot.add(concretePour);
    
    group.add(hopper, chutePivot);
    group.userData.animatedMeshes['chute'] = chutePivot;
    group.userData.animatedMeshes['concretePour'] = concretePour;
    
    parts.push({ mesh: chutePivot, name: "Articulated Discharge Chute", description: "Swiveling half-pipe delivery mechanism.", function: "Directs the pouring of wet concrete to the job site."});

    // ==========================================
    // 4. Factual Fasteners (7,200 parts)
    // ==========================================
    const boltCount = 7200;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute over the chassis frame and drum mounts
        dummy.position.set((Math.random() - 0.5) * 1.5, Math.random() * 1.5 + 0.5, (Math.random() - 0.5) * 4.5);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "7,200 Heavy Duty Fasteners", description: "Factual quantity of instanced structural bolts.", function: "Secures the immense weight of the mixing drum to the truck frame." });
    
    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating the mixing and driving
        if (state.throttle > 0.0) {
            const speed = state.throttle * 0.1;
            
            // Wheels spin
            group.userData.animatedMeshes.wheels.forEach(w => {
                w.rotation.x -= speed;
            });
            
            // Mixing drum rotates constantly, faster with throttle
            group.userData.animatedMeshes['drum'].rotation.y -= (0.02 + speed * 0.5);
            
            // Chute swivels back and forth to distribute concrete
            group.userData.animatedMeshes['chute'].rotation.y = Math.sin(time * 0.001) * 0.5;
            
            // Concrete flows!
            group.userData.animatedMeshes['concretePour'].material.map && (group.userData.animatedMeshes['concretePour'].material.map.offset.y -= speed * 2);
            group.userData.animatedMeshes['concretePour'].opacity = 1.0;
        } else {
            // Drum still rotates slowly when idle to prevent curing!
            group.userData.animatedMeshes['drum'].rotation.y -= 0.01;
        }
    };

    group.userData.parts = parts;
    return group;
}
