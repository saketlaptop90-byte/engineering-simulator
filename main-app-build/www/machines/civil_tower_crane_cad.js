import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const craneYellow = new THREE.MeshPhysicalMaterial({ color: 0xFFCC00, metalness: 0.6, roughness: 0.4, clearcoat: 0.5 });
    const machinedSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const wireRopeMat = new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 1.0, roughness: 0.5 });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Lattice Truss (Tower Mast)
    // ==========================================
    // Rather than boxes, we mathematically generate the tubular frame and cross-bracing using ExtrudeGeometry on curves.
    const tubeRadius = 0.05;
    const mastHeight = 10.0;
    const mastWidth = 1.2;

    const mastGroup = new THREE.Group();
    
    // Create the 4 main vertical chords
    for (let i = 0; i < 4; i++) {
        const x = (i % 2 === 0) ? -mastWidth/2 : mastWidth/2;
        const z = (i < 2) ? -mastWidth/2 : mastWidth/2;
        
        const chordGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, mastHeight, 16);
        const chord = new THREE.Mesh(chordGeo, craneYellow);
        chord.position.set(x, mastHeight/2, z);
        mastGroup.add(chord);
    }

    // Procedurally generate the diagonal cross-bracing
    const numSections = 10;
    const sectionHeight = mastHeight / numSections;
    
    for (let s = 0; s < numSections; s++) {
        const yStart = s * sectionHeight;
        const yEnd = (s + 1) * sectionHeight;
        
        // Front and Back diagonals
        for (let side = -1; side <= 1; side += 2) {
            const path1 = new THREE.LineCurve3(
                new THREE.Vector3(-mastWidth/2, yStart, side * mastWidth/2),
                new THREE.Vector3(mastWidth/2, yEnd, side * mastWidth/2)
            );
            const tubeGeo1 = new THREE.TubeGeometry(path1, 4, tubeRadius * 0.7, 8, false);
            mastGroup.add(new THREE.Mesh(tubeGeo1, craneYellow));

            const path2 = new THREE.LineCurve3(
                new THREE.Vector3(mastWidth/2, yStart, side * mastWidth/2),
                new THREE.Vector3(-mastWidth/2, yEnd, side * mastWidth/2)
            );
            const tubeGeo2 = new THREE.TubeGeometry(path2, 4, tubeRadius * 0.7, 8, false);
            mastGroup.add(new THREE.Mesh(tubeGeo2, craneYellow));
        }
        
        // Left and Right diagonals
        for (let side = -1; side <= 1; side += 2) {
            const path3 = new THREE.LineCurve3(
                new THREE.Vector3(side * mastWidth/2, yStart, -mastWidth/2),
                new THREE.Vector3(side * mastWidth/2, yEnd, mastWidth/2)
            );
            const tubeGeo3 = new THREE.TubeGeometry(path3, 4, tubeRadius * 0.7, 8, false);
            mastGroup.add(new THREE.Mesh(tubeGeo3, craneYellow));

            const path4 = new THREE.LineCurve3(
                new THREE.Vector3(side * mastWidth/2, yStart, mastWidth/2),
                new THREE.Vector3(side * mastWidth/2, yEnd, -mastWidth/2)
            );
            const tubeGeo4 = new THREE.TubeGeometry(path4, 4, tubeRadius * 0.7, 8, false);
            mastGroup.add(new THREE.Mesh(tubeGeo4, craneYellow));
        }
    }
    group.add(mastGroup);
    parts.push({ mesh: mastGroup, name: "CAD Lattice Mast", description: "Procedurally generated tubular cross-bracing.", function: "Provides immense vertical stability."});

    // ==========================================
    // 2. PROCEDURAL CAD: Lathed Winch Drum & Cable
    // ==========================================
    // Lathe a precise winch drum with flanges
    const winchPoints = [
        new THREE.Vector2(0, 0.4), new THREE.Vector2(0.3, 0.4),
        new THREE.Vector2(0.3, 0.35), new THREE.Vector2(0.15, 0.35),
        new THREE.Vector2(0.15, -0.35), new THREE.Vector2(0.3, -0.35),
        new THREE.Vector2(0.3, -0.4), new THREE.Vector2(0, -0.4)
    ];
    const winchGeo = new THREE.LatheGeometry(winchPoints, 32);
    const winchDrum = new THREE.Mesh(winchGeo, machinedSteel);
    winchDrum.rotation.z = Math.PI/2;
    
    // Procedural coiled wire rope on the drum
    const ropeGroup = new THREE.Group();
    const ropeTurns = 20;
    const ropePath = new THREE.Curve();
    // Custom helix curve for the rope
    ropePath.getPoint = function(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * Math.PI * 2 * ropeTurns;
        const x = Math.cos(angle) * 0.16;
        const y = Math.sin(angle) * 0.16;
        const z = (t - 0.5) * 0.68; // Spread across the drum width
        return optionalTarget.set(x, y, z);
    };
    const ropeGeo = new THREE.TubeGeometry(ropePath, 200, 0.02, 8, false);
    const coiledRope = new THREE.Mesh(ropeGeo, wireRopeMat);
    winchDrum.add(coiledRope);

    winchDrum.position.set(0, mastHeight + 0.5, -2.0); // Counter-jib area
    group.add(winchDrum);
    group.userData.animatedMeshes['winch'] = winchDrum;
    parts.push({ mesh: winchDrum, name: "Hoist Winch Drum", description: "Lathed grooved drum with mathematically coiled wire rope.", function: "Lifts and lowers the hook block."});

    // ==========================================
    // 3. 10900 Instanced Fasteners
    // ==========================================
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, machinedSteel, 10900);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 10900; i++) {
        dummy.position.set((Math.random() - 0.5) * 2, Math.random() * mastHeight, (Math.random() - 0.5) * 2);
        dummy.rotation.set(Math.random()*Math.PI, 0, 0);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "10900 Hex Fasteners", description: "Instanced procedural array of structural bolts connecting the truss elements.", function: "Ensures mast rigidity against sheer forces." });

    // Simplified Jib & Hook for visual context
    const jib = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 15.0), craneYellow);
    jib.position.set(0, mastHeight + 1.0, 5.5);
    group.add(jib);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        // Fast rotation of the winch drum
        group.userData.animatedMeshes['winch'].rotation.x += state.throttle * 0.1;
    };

    group.userData.parts = parts;
    return group;
}

