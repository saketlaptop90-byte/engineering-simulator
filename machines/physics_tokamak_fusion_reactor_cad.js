import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const superSteel = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.8, roughness: 0.4 }); // Cryostat and vacuum vessel
    const copperCoil = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 }); // Poloidal field coils
    const nbtiCoil = new THREE.MeshPhysicalMaterial({ color: 0x556677, metalness: 0.7, roughness: 0.6 }); // Toroidal field coils (Niobium-Titanium)
    const tungstenTiles = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 }); // Divertor and first wall
    
    // VFX Materials
    const fusionPlasma = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // 150 million degree plasma
    const magneticFlux = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Invisible magnetic cage

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.fluxLines = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Vacuum Vessel & Divertor
    // ==========================================
    const reactorGroup = new THREE.Group();
    
    // The main vacuum vessel (D-shaped torus, cutaway to see inside)
    // We will construct this from a series of lathe geometries to get the D-shape
    const vesselPts = [];
    // Creating a D-shape profile
    for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI;
        // Parametric D-shape
        const x = 2.0 + 1.0 * Math.cos(t) + (0.2 * Math.sin(t)**2); // R = 2.0, a = 1.0, triangularity
        const y = 1.5 * Math.sin(t); // Elongation
        vesselPts.push(new THREE.Vector2(x, y));
    }
    for (let i = 0; i <= 20; i++) {
        const t = Math.PI + (i / 20) * Math.PI;
        const x = 2.0 + 1.0 * Math.cos(t) + (0.2 * Math.sin(t)**2);
        const y = 1.5 * Math.sin(t);
        vesselPts.push(new THREE.Vector2(x, y));
    }
    
    // Extrude/Lathe the D-shape into a torus, but cut out a 90 degree wedge
    const vesselGeo = new THREE.LatheGeometry(vesselPts, 48, 0, Math.PI * 1.5);
    const vessel = new THREE.Mesh(vesselGeo, superSteel);
    vessel.material.side = THREE.DoubleSide;
    reactorGroup.add(vessel);
    
    // The Divertor (At the bottom of the D-shape, made of Tungsten tiles)
    // The divertor extracts heat and ash produced by the fusion reaction
    const divertorPts = [
        new THREE.Vector2(1.6, -1.3),
        new THREE.Vector2(1.8, -1.5),
        new THREE.Vector2(2.2, -1.5),
        new THREE.Vector2(2.4, -1.3),
        new THREE.Vector2(2.0, -1.2) // Peak
    ];
    const divertorGeo = new THREE.LatheGeometry(divertorPts, 48, 0, Math.PI * 1.5);
    const divertor = new THREE.Mesh(divertorGeo, tungstenTiles);
    divertor.material.side = THREE.DoubleSide;
    reactorGroup.add(divertor);
    
    parts.push({ mesh: vessel, name: "Ultra-High Vacuum Vessel & Divertor", description: "D-shaped stainless steel torus lined with Tungsten tiles.", function: "Provides the incredibly clean vacuum environment for the plasma and exhausts the extreme heat of the fusion reaction."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Magnet System
    // ==========================================
    // 18 Toroidal Field (TF) Coils - These wrap around the D-shape
    const tfCoils = new THREE.Group();
    const tfCount = 18;
    for(let i=0; i<tfCount; i++) {
        const angle = (i * Math.PI * 2) / tfCount;
        
        // Build a single D-shaped coil using ExtrudeGeometry on a shape
        const coilShape = new THREE.Shape();
        coilShape.moveTo(1.2, 0);
        // Outer curve
        for(let j=0; j<=10; j++) {
            const t = (j/10) * Math.PI;
            coilShape.lineTo(2.0 + 1.6 * Math.cos(t), 2.0 * Math.sin(t));
        }
        // Inner straight-ish section
        coilShape.lineTo(0.8, 0);
        // Bottom curve
        for(let j=0; j<=10; j++) {
            const t = Math.PI + (j/10) * Math.PI;
            coilShape.lineTo(2.0 + 1.6 * Math.cos(t), 2.0 * Math.sin(t));
        }
        
        const extrudeSettings = { depth: 0.3, bevelEnabled: false, curveSegments: 8 };
        const tfGeo = new THREE.ExtrudeGeometry(coilShape, extrudeSettings);
        
        // We need to rotate the extruded shape so the depth goes along the tangent of the torus
        const tfMesh = new THREE.Mesh(tfGeo, nbtiCoil);
        
        // Center the extrusion
        tfMesh.position.z = -0.15; 
        
        // Create a pivot group to place it around the torus
        const pivot = new THREE.Group();
        pivot.add(tfMesh);
        pivot.rotation.y = angle;
        
        tfCoils.add(pivot);
    }
    reactorGroup.add(tfCoils);
    
    parts.push({ mesh: tfCoils.children[0], name: "18 Toroidal Field Coils", description: "Massive D-shaped superconducting electromagnets.", function: "Generates the primary magnetic cage that confines the 150 million degree plasma, preventing it from touching the walls."});

    // Central Solenoid (CS) - The massive pillar in the center
    const csGeo = new THREE.CylinderGeometry(0.7, 0.7, 4.0, 32);
    const cs = new THREE.Mesh(csGeo, nbtiCoil);
    reactorGroup.add(cs);
    
    parts.push({ mesh: cs, name: "Central Solenoid", description: "The beating heart of the Tokamak (1000-ton electromagnet).", function: "Pulses a massive magnetic field to induce the enormous electrical current required to heat the plasma."});

    // Poloidal Field (PF) Coils - The rings around the outside
    const pfRadii = [
        {r: 1.5, y: 2.2, size: 0.2},
        {r: 3.5, y: 1.5, size: 0.3},
        {r: 4.2, y: 0.0, size: 0.4},
        {r: 3.5, y: -1.5, size: 0.3},
        {r: 1.5, y: -2.2, size: 0.2},
    ];
    const pfCoils = new THREE.Group();
    pfRadii.forEach(pf => {
        const pfGeo = new THREE.TorusGeometry(pf.r, pf.size, 16, 64);
        const pfMesh = new THREE.Mesh(pfGeo, copperCoil);
        pfMesh.position.set(0, pf.y, 0);
        pfMesh.rotation.x = Math.PI / 2;
        pfCoils.add(pfMesh);
    });
    reactorGroup.add(pfCoils);

    // ==========================================
    // 3. PROCEDURAL CAD: Fusion Plasma & Flux VFX
    // ==========================================
    // The burning plasma (D-T fusion)
    const plasmaGeo = new THREE.LatheGeometry(vesselPts, 48, 0, Math.PI * 1.5);
    const plasma = new THREE.Mesh(plasmaGeo, fusionPlasma);
    // Scale it down so it sits inside the vessel, held by the magnetic field
    plasma.scale.set(0.9, 0.8, 0.9);
    reactorGroup.add(plasma);
    group.userData.animatedMeshes['plasma'] = plasma;
    
    // Magnetic Flux Lines (Helical lines wrapping around the plasma)
    const fluxGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        // Create a helical tube wrapping around the D-shape
        // We approximate this with a torus knot
        const fluxGeo = new THREE.TorusKnotGeometry(2.0, 0.5, 128, 16, 1, 8); // p=1, q=8 means it wraps 8 times around
        const flux = new THREE.Mesh(fluxGeo, magneticFlux);
        flux.rotation.x = Math.PI / 2;
        // Stagger them
        flux.rotation.z = (i * Math.PI * 2) / 12;
        fluxGroup.add(flux);
        group.userData.animatedMeshes.fluxLines.push(flux);
    }
    reactorGroup.add(fluxGroup);

    group.add(reactorGroup);

    // ==========================================
    // 4. Factual Fasteners (18,000 parts)
    // ==========================================
    // Massive forces from the magnets trying to expand requires huge structural supports and bolts
    const boltCount = 18000;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6); // Large heavy-duty bolts
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Bolt the TF coils to the central support structure
    for(let i=0; i<tfCount; i++) {
        const angle = (i * Math.PI * 2) / tfCount;
        for(let j=0; j<1000; j++) {
            if (boltIndex >= boltCount) break;
            
            // Distribute along the inner straight edge of the TF coil
            const y = (Math.random() - 0.5) * 4.0;
            const r = 0.8 + (Math.random() * 0.4);
            
            dummy.position.set(r * Math.cos(angle), y, r * Math.sin(angle));
            dummy.rotation.set(0, angle, 0); 
            dummy.updateMatrix();
            instancedBolts.setMatrixAt(boltIndex, dummy.matrix);
            boltIndex++;
        }
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "18,000 Structural Bolts", description: "Factual quantity of massive high-tensile fasteners.", function: "Resists the hundreds of thousands of tons of electromagnetic force trying to rip the coils apart." });
    
    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3); // Tokamaks are HUGE (30 meters tall)
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Plasma Ignition & Burning
            // The plasma pulsates and shifts color (pink/purple to blinding white/blue)
            const burnIntensity = Math.abs(Math.sin(timeAcc * 10 * speed));
            group.userData.animatedMeshes['plasma'].material.opacity = 0.5 + (burnIntensity * 0.4);
            // Color shifts from magenta to bright cyan/white as it gets hotter
            group.userData.animatedMeshes['plasma'].material.color.setHSL(0.8 - (0.3 * speed), 1.0, 0.5 + (0.5 * speed));
            
            // The plasma physically expands slightly (but is held by the magnetic field)
            const plasmaScale = 0.88 + (Math.sin(timeAcc * 20 * speed) * 0.02);
            group.userData.animatedMeshes['plasma'].scale.set(plasmaScale, plasmaScale * 0.8, plasmaScale);
            
            // Magnetic Flux Lines
            // The helical lines flow around the torus
            group.userData.animatedMeshes.fluxLines.forEach((flux, index) => {
                flux.material.opacity = 0.2 + (Math.sin(timeAcc * 5 + index) * 0.1) * speed;
                // Rotate the flux lines to simulate the current flowing
                flux.rotation.z += 0.05 * speed;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes['plasma'].material.opacity = 0;
            group.userData.animatedMeshes.fluxLines.forEach(flux => {
                flux.material.opacity = 0;
            });
            group.userData.animatedMeshes['plasma'].scale.set(0.9, 0.8, 0.9);
        }
    };

    group.userData.parts = parts;
    return group;
}
