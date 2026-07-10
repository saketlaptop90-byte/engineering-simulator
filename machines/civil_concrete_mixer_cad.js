import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const drumWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.6, clearcoat: 0.2 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const chassisRed = new THREE.MeshPhysicalMaterial({ color: 0xaa0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.5 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Lathed Mixing Drum
    // ==========================================
    // A concrete mixing drum has a very specific pear shape with a large belly and a narrow opening.
    const drumPoints = [
        new THREE.Vector2(0, 2.5), new THREE.Vector2(0.8, 2.5),    // Narrow opening
        new THREE.Vector2(1.2, 1.5),                               // Taper
        new THREE.Vector2(1.5, 0.0),                               // Belly
        new THREE.Vector2(1.2, -1.5),                              // Rear taper
        new THREE.Vector2(0.5, -2.0), new THREE.Vector2(0, -2.0)   // Flat base
    ];
    const drumGeo = new THREE.LatheGeometry(drumPoints, 64);
    const mixerDrum = new THREE.Mesh(drumGeo, drumWhite);
    
    // Internal Spiral Blades (Archimedes Screw)
    // We use TubeGeometry with a custom mathematical curve to create the mixing spiral inside the drum
    const spiralTurns = 3;
    const spiralPath = new THREE.Curve();
    spiralPath.getPoint = function(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * Math.PI * 2 * spiralTurns;
        const height = t * 4.0 - 1.5; // Map from base to opening
        
        // Match the radius to the drum profile roughly
        let radius = 1.0;
        if (height < 0) radius = 1.2 - Math.abs(height) * 0.2;
        else if (height > 1.5) radius = 1.5 - (height - 1.5) * 0.7;
        else radius = 1.5;

        const x = Math.cos(angle) * (radius - 0.1);
        const y = Math.sin(angle) * (radius - 0.1);
        const z = height;
        return optionalTarget.set(x, y, z); // Note: inside Lathe, Y is height, but Tube uses Z? Let's check Lathe axis. Lathe wraps around Y axis.
    };
    
    // Fix spiral axis to match Lathe Y axis
    spiralPath.getPoint = function(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * Math.PI * 2 * spiralTurns;
        const height = t * 4.0 - 1.5; 
        
        let radius = 1.0;
        if (height < 0) radius = 1.2 - Math.abs(height) * 0.4;
        else if (height > 1.5) radius = 1.5 - (height - 1.5) * 0.7;
        else radius = 1.5;

        const x = Math.cos(angle) * (radius - 0.05);
        const z = Math.sin(angle) * (radius - 0.05);
        const y = height;
        return optionalTarget.set(x, y, z);
    };

    const spiralGeo = new THREE.TubeGeometry(spiralPath, 100, 0.15, 8, false);
    const spiralMesh = new THREE.Mesh(spiralGeo, machinedSteel);
    mixerDrum.add(spiralMesh);

    // Tilt the drum on the chassis
    mixerDrum.rotation.z = Math.PI / 6; // 30 degree tilt
    mixerDrum.position.set(0, 2.5, -1.0);
    group.add(mixerDrum);
    group.userData.animatedMeshes['drum'] = mixerDrum;
    parts.push({ mesh: mixerDrum, name: "CAD Mixing Drum", description: "Lathed pear-shaped drum with internal spiral Archimedes screw blades.", function: "Mixes and dispenses concrete."});


    // ==========================================
    // 2. 11200 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, 11200);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 11200; i++) {
        dummy.position.set((Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 6 - 1);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "11200 Hex Fasteners", description: "Instanced procedural array of structural bolts.", function: "Ensures heavy-duty chassis rigidity." });

    // Basic Truck Chassis for visual context
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.0, 7.0), chassisRed);
    chassis.position.set(0, 1.0, -1.0);
    group.add(chassis);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Fast rotation of the mixing drum around its tilted Y axis
        group.userData.animatedMeshes['drum'].rotation.y += state.throttle * 0.1;
    };

    group.userData.parts = parts;
    return group;
}

