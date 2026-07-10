import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0x331100,
        emissiveIntensity: 0.2
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.95,
        wireframe: false
    });

    const laserBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const armorMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.6,
        wireframe: true // Visual representation of tiled boron-carbide panels
    });

    const neonBlue = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // ==========================================
    // CHAMBER PARAMETERS & CONSTANTS
    // ==========================================
    const chamberRadius = 25;
    const numLasers = 192; // Typical for facilities like NIF

    // ==========================================
    // 1. MAIN VACUUM CHAMBER VESSEL
    // ==========================================
    const chamberGeo = new THREE.SphereGeometry(chamberRadius, 64, 64);
    const chamberMesh = new THREE.Mesh(chamberGeo, darkSteel);
    group.add(chamberMesh);
    meshes.mainChamber = chamberMesh;
    
    parts.push({
        name: 'Target Chamber Vacuum Vessel',
        description: 'A massive spherical aluminum alloy vessel (typically 10+ meters in diameter) that maintains an ultra-high vacuum environment. This vacuum prevents the high-energy laser beams from scattering or ionizing the air (laser breakdown) before they reach the target.',
        material: 'darkSteel',
        function: 'Maintains vacuum and provides a structurally rigid mounting surface for thousands of optical and diagnostic components.',
        assemblyOrder: 1,
        connections: ['Laser Ports', 'Diagnostic Instruments', 'Target Positioner'],
        failureEffect: 'Loss of vacuum, leading to catastrophic laser scattering, atmospheric plasma formation, and immediate abort of the fusion shot.',
        cascadeFailures: ['Laser Optics Damage', 'Diagnostic Sensor Contamination', 'Cryo-system thermal overload'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // ==========================================
    // 2. GEODESIC SUPPORT FRAMEWORK (OUTER TRUSS)
    // ==========================================
    const trussGeo = new THREE.IcosahedronGeometry(chamberRadius + 2, 4);
    const trussMesh = new THREE.Mesh(trussGeo, new THREE.MeshStandardMaterial({
        color: 0x555555, wireframe: true, wireframeLinewidth: 2
    }));
    group.add(trussMesh);
    meshes.truss = trussMesh;

    parts.push({
        name: 'Geodesic Support Framework',
        description: 'An external structural truss surrounding the vacuum vessel. It is designed to distribute the immense weight (hundreds of tons) of the diagnostic equipment and final optics assemblies without warping the main sphere.',
        material: 'steel (wireframe)',
        function: 'Provides absolute structural integrity and vibration damping. Target alignment requires micron-level precision.',
        assemblyOrder: 2,
        connections: ['Target Chamber Vacuum Vessel', 'Facility Foundation'],
        failureEffect: 'Micro-vibrations or structural sagging causing laser beams to miss the sub-millimeter target.',
        cascadeFailures: ['Asymmetric Target Implosion', 'Failed Ignition'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // ==========================================
    // 3. FIRST WALL ARMOR PANELS (INTERNAL)
    // ==========================================
    const armorGeo = new THREE.SphereGeometry(chamberRadius - 0.5, 48, 48);
    const armorMesh = new THREE.Mesh(armorGeo, armorMaterial);
    group.add(armorMesh);

    parts.push({
        name: 'First Wall Louvers / Armor Panels',
        description: 'Thousands of overlapping panels (often boron-carbide, carbon composite, or specialized aluminum) lining the interior of the chamber. They absorb unconverted scattered laser light, X-rays, and physical shrapnel from the target explosion.',
        material: 'darkSteel (carbon composite)',
        function: 'Protects the primary vacuum vessel wall from ablation, X-ray damage, and severe thermal shock during the fusion yield.',
        assemblyOrder: 3,
        connections: ['Vacuum Vessel Interior'],
        failureEffect: 'Chamber wall ablation; target debris embedding into the structural aluminum, weakening the vessel over time.',
        cascadeFailures: ['Vacuum leak', 'Radioactive particulate buildup'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 15, z: -20 }
    });

    // ==========================================
    // 4. LASER BEAMLINES & FINAL OPTICS ASSEMBLIES
    // ==========================================
    const foaGroup = new THREE.Group();
    const beamsGroup = new THREE.Group();
    meshes.beams = [];
    meshes.laserNodes = [];

    // Calculate Fibonacci Sphere Points for even distribution of 192 ports
    const laserPoints = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < numLasers; i++) {
        let y = 1 - (i / (numLasers - 1)) * 2;
        let rAtY = Math.sqrt(1 - y * y);
        let theta = phi * i;
        let x = Math.cos(theta) * rAtY;
        let z = Math.sin(theta) * rAtY;
        
        // Exclude polar regions to leave room for main target stalk and upper diagnostics
        if (Math.abs(y) < 0.85) {
            laserPoints.push(new THREE.Vector3(x * chamberRadius, y * chamberRadius, z * chamberRadius));
        }
    }

    const portGeo = new THREE.CylinderGeometry(1.2, 2.0, 5, 12);
    portGeo.translate(0, 2.5, 0);
    portGeo.rotateX(Math.PI / 2);

    const lensGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.4, 16);
    lensGeo.rotateX(Math.PI / 2);
    lensGeo.translate(0, 0, 4.5);

    const frequencyConverterGeo = new THREE.BoxGeometry(2.5, 2.5, 1.5);
    frequencyConverterGeo.translate(0, 0, 2);

    laserPoints.forEach((point) => {
        const portGroup = new THREE.Group();
        
        const portMesh = new THREE.Mesh(portGeo, aluminum);
        const lensMesh = new THREE.Mesh(lensGeo, glass);
        const freqMesh = new THREE.Mesh(frequencyConverterGeo, steel);
        
        portGroup.add(portMesh);
        portGroup.add(lensMesh);
        portGroup.add(freqMesh);
        
        portGroup.position.set(0, 0, 0);
        portGroup.lookAt(point);
        portGroup.translateZ(chamberRadius - 2);

        foaGroup.add(portGroup);
        meshes.laserNodes.push(portGroup); 

        const beamLength = chamberRadius - 1;
        const beamGeo = new THREE.CylinderGeometry(0.15, 0.6, beamLength, 8);
        beamGeo.translate(0, beamLength / 2, 0);
        beamGeo.rotateX(Math.PI / 2);
        
        const beamMesh = new THREE.Mesh(beamGeo, laserBeamMaterial.clone());
        beamMesh.position.set(0, 0, 0);
        beamMesh.lookAt(point);
        
        beamsGroup.add(beamMesh);
        meshes.beams.push(beamMesh);
    });

    group.add(foaGroup);
    group.add(beamsGroup);
    meshes.foaGroup = foaGroup;

    parts.push({
        name: 'Final Optics Assemblies (FOA)',
        description: 'Over 150 complex optomechanical packages attached to the exterior. They contain KDP (Potassium Dihydrogen Phosphate) crystals to frequency-convert the infrared laser light to ultraviolet, phase plates to smooth the beam profile, and fused silica lenses to focus it.',
        material: 'aluminum / steel / glass',
        function: 'Converts infrared laser light to UV (3-omega) and focuses it perfectly through the millimeter-sized holes of the hohlraum.',
        assemblyOrder: 4,
        connections: ['Laser Ports', 'Beamlines', 'Target Chamber Wall'],
        failureEffect: 'Improper beam focusing or failed frequency conversion, severely reducing the energy delivered to the target and causing an asymmetric implosion.',
        cascadeFailures: ['Lens fracture due to laser damage (pin-holing)', 'Target failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: 0, z: 60 }
    });

    // ==========================================
    // 5. EXPENDABLE DEBRIS SHIELDS
    // ==========================================
    parts.push({
        name: 'Expendable Debris Shields',
        description: 'Very thin sheets of highly purified fused silica placed at the innermost tip of the Final Optics Assemblies, facing the blast.',
        material: 'glass',
        function: 'Sacrificial barrier protecting the expensive multi-million-dollar final focusing lenses from blast shrapnel, X-rays, and vaporized target materials.',
        assemblyOrder: 5,
        connections: ['FOA Interior'],
        failureEffect: 'High-velocity shrapnel pits the main final focusing lens.',
        cascadeFailures: ['Lens failure', 'Costly maintenance delays', 'Catastrophic optical damage threshold exceeded on next shot'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 80, y: 20, z: 80 }
    });

    // ==========================================
    // 6. CRYOGENIC TARGET POSITIONER STALK
    // ==========================================
    const stalkGroup = new THREE.Group();
    
    const stalkGeo = new THREE.CylinderGeometry(0.8, 1.5, chamberRadius * 1.5, 32);
    stalkGeo.translate(0, chamberRadius * 0.75, 0);
    const stalkMesh = new THREE.Mesh(stalkGeo, chrome);
    stalkGroup.add(stalkMesh);

    for (let i = 0; i < 6; i++) {
        const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, chamberRadius * 1.5, 12);
        tubeGeo.translate(1.2, chamberRadius * 0.75, 0);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        tubeMesh.rotation.y = (Math.PI / 3) * i;
        
        const spiralGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 64, Math.PI * 2);
        for(let j=0; j<40; j++) {
            const ring = new THREE.Mesh(spiralGeo, rubber);
            ring.position.y = (chamberRadius * 1.5 / 40) * j;
            ring.rotation.x = Math.PI / 2;
            ring.rotation.y = 0.1;
            stalkGroup.add(ring);
        }
        
        stalkGroup.add(tubeMesh);
    }

    const shroudGeo = new THREE.CylinderGeometry(2.0, 1.2, 4, 32);
    shroudGeo.translate(0, 2, 0);
    const shroudMesh = new THREE.Mesh(shroudGeo, darkSteel);
    stalkGroup.add(shroudMesh);

    stalkGroup.rotation.x = Math.PI;
    stalkGroup.position.set(0, 0, 0);
    
    group.add(stalkGroup);
    meshes.targetStalk = stalkGroup;

    parts.push({
        name: 'Cryogenic Target Positioner (TARPOS)',
        description: 'An ultra-precision, multi-stage robotic boom that inserts the target payload from the bottom of the chamber to the exact mathematical center, accurate to within 5 microns. It maintains the target at extreme cryogenic temperatures (around 18 Kelvin).',
        material: 'chrome / copper / rubber',
        function: 'Positions the target and circulates liquid helium to keep the Deuterium-Tritium fuel frozen in a perfect, uniform crystalline ice layer inside the pellet.',
        assemblyOrder: 6,
        connections: ['Target Chamber Bottom Port', 'Hohlraum Base'],
        failureEffect: 'Fuel pellet warms up; the perfectly smooth DT ice layer melts, sloshes, or sublimates, making symmetrical ignition physically impossible.',
        cascadeFailures: ['Vacuum contamination from outgassing DT gas', 'Shot scrubbed'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -70, z: 0 }
    });

    // ==========================================
    // 7. THE HOHLRAUM (INDIRECT DRIVE OVEN)
    // ==========================================
    const hohlraumGroup = new THREE.Group();
    
    const hohlraumGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32, 1, true); 
    const hohlraumMesh = new THREE.Mesh(hohlraumGeo, goldMaterial);
    hohlraumGroup.add(hohlraumMesh);
    
    for(let i=0; i<3; i++) {
        const hRingGeo = new THREE.TorusGeometry(0.55, 0.05, 16, 32);
        const hRingMesh = new THREE.Mesh(hRingGeo, copper);
        hRingMesh.rotation.x = Math.PI / 2;
        hRingMesh.position.y = -0.5 + (i * 0.5);
        hohlraumGroup.add(hRingMesh);
    }

    group.add(hohlraumGroup);
    meshes.hohlraum = hohlraumGroup;
    meshes.hohlraumMesh = hohlraumMesh;
    
    parts.push({
        name: 'The Hohlraum',
        description: 'A tiny cylinder, typically made of gold or depleted uranium, that houses the fuel pellet. Laser beams enter through holes (Laser Entrance Holes or LEHs) at both ends and strike its inner walls, instantly ionizing the metal into a plasma that radiates a uniform bath of intense X-rays.',
        material: 'gold (simulated)',
        function: 'Acts as an X-ray oven. It converts the uneven ultraviolet laser energy into a perfectly uniform X-ray radiation drive to symmetrically crush the fuel pellet.',
        assemblyOrder: 7,
        connections: ['Target Positioner Tip', 'Fuel Pellet'],
        failureEffect: 'Asymmetric X-ray generation, causing the pellet to compress into a pancake or sausage shape rather than a perfect sphere.',
        cascadeFailures: ['Hydrodynamic instability tearing the pellet apart before fusion conditions are met'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // ==========================================
    // 8. DEUTERIUM-TRITIUM FUEL PELLET
    // ==========================================
    const pelletGeo = new THREE.SphereGeometry(0.2, 64, 64);
    const pelletMesh = new THREE.Mesh(pelletGeo, plasmaMaterial);
    group.add(pelletMesh);
    meshes.pellet = pelletMesh;

    parts.push({
        name: 'Deuterium-Tritium (DT) Fuel Pellet',
        description: 'A perfectly spherical micro-balloon (often made of high-density carbon/diamond, beryllium, or plastic) holding a hollow shell of solid, frozen Deuterium and Tritium isotopes. This is the heart of the machine.',
        material: 'plasma (emissive)',
        function: 'The physical site of the thermonuclear fusion reactions. When crushed by X-rays, its core reaches 100 million degrees Celsius and hundreds of billions of atmospheres of pressure, forcing the hydrogen atoms to fuse into helium.',
        assemblyOrder: 8,
        connections: ['Hohlraum interior cavity (suspended by ultra-thin carbon-nanotube tents)'],
        failureEffect: 'Failure to achieve the Lawson Criterion for ignition (a dud shot).',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 15, z: 0 }
    });

    // ==========================================
    // 9. NEUTRON & X-RAY DIAGNOSTIC SUITES
    // ==========================================
    const diagGroup = new THREE.Group();
    meshes.diags = [];
    
    const points = [];
    for (let i = 0; i < 15; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.3) * 1.5 + 1.2, (i - 7) * 1.2));
    }
    const diagGeo = new THREE.LatheGeometry(points, 32);
    diagGeo.rotateX(Math.PI / 2);
    
    const diagPositions = [
        new THREE.Vector3(chamberRadius, 0, 0),             
        new THREE.Vector3(-chamberRadius, 0, 0),            
        new THREE.Vector3(0, 0, chamberRadius),             
        new THREE.Vector3(0, 0, -chamberRadius),            
        new THREE.Vector3(chamberRadius*0.6, chamberRadius*0.6, chamberRadius*0.4), 
        new THREE.Vector3(-chamberRadius*0.6, chamberRadius*0.6, -chamberRadius*0.4)
    ];

    diagPositions.forEach((pos) => {
        const singleDiagGroup = new THREE.Group();

        const dMesh = new THREE.Mesh(diagGeo, chrome);
        
        const winGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
        winGeo.rotateX(Math.PI / 2);
        winGeo.translate(0, 0, -8);
        const winMesh = new THREE.Mesh(winGeo, tinted);
        
        const cableGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
        cableGeo.rotateX(Math.PI / 2);
        cableGeo.translate(0, 0, 10);
        const cableMesh = new THREE.Mesh(cableGeo, rubber);

        singleDiagGroup.add(dMesh);
        singleDiagGroup.add(winMesh);
        singleDiagGroup.add(cableMesh);

        singleDiagGroup.position.copy(pos);
        singleDiagGroup.lookAt(new THREE.Vector3(0,0,0));
        singleDiagGroup.translateZ(-4);

        diagGroup.add(singleDiagGroup);
        meshes.diags.push(singleDiagGroup);
    });
    group.add(diagGroup);

    parts.push({
        name: 'Advanced Diagnostics Suite (Dante, nTOF, VISAR)',
        description: 'A massive array of highly specialized sensors. Includes Dante X-ray spectrometers to measure Hohlraum radiation, Neutron Time-of-Flight (nTOF) detectors to calculate ion temperature and yield, and VISAR to measure the shockwave velocity inside the pellet.',
        material: 'chrome / tinted glass / rubber',
        function: 'Captures and records data during the incredibly brief (nanoseconds to picoseconds) lifespan of the implosion and fusion reaction.',
        assemblyOrder: 9,
        connections: ['Vacuum Chamber Equatorial and Polar Ports', 'Data Acquisition Datacenter'],
        failureEffect: 'Loss of critical experimental data; scientists cannot verify if the shot was successful or understand why it failed.',
        cascadeFailures: ['Inability to calibrate predictive physical models for future shots'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -60, y: 0, z: -60 }
    });

    // ==========================================
    // 10. DIAGNOSTIC INSERTION MANIPULATORS (DIMs)
    // ==========================================
    const dimGroup = new THREE.Group();
    const hydBaseGeo = new THREE.BoxGeometry(4, 4, 15);
    hydBaseGeo.translate(0, 0, 7.5);
    
    const hydPistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 32);
    hydPistonGeo.rotateX(Math.PI / 2);
    hydPistonGeo.translate(0, 0, -7.5);

    const dim = new THREE.Group();
    const dimBase = new THREE.Mesh(hydBaseGeo, steel);
    const dimPiston = new THREE.Mesh(hydPistonGeo, chrome);
    dim.add(dimBase);
    dim.add(dimPiston);
    
    dim.position.set(chamberRadius + 5, 5, 0);
    dim.lookAt(new THREE.Vector3(0, 5, 0));
    dimGroup.add(dim);
    meshes.dimPiston = dimPiston;

    group.add(dimGroup);

    parts.push({
        name: 'Diagnostic Insertion Manipulators (DIMs)',
        description: 'Telescoping hydraulic and mechanical carts operating through massive vacuum airlocks. They insert sensitive diagnostic packages (like streak cameras) deep into the chamber, mere centimeters from the blast.',
        material: 'steel / chrome',
        function: 'Positions close-in diagnostic sensors without having to break the main chamber vacuum, saving days of pump-down time.',
        assemblyOrder: 10,
        connections: ['Chamber Equatorial Ports', 'Vacuum Air-locks'],
        failureEffect: 'Sensor cannot reach optimal observation distance or gets stuck inside the chamber during a shot.',
        cascadeFailures: ['Poor signal-to-noise ratio in captured data', 'Total destruction of stuck DIM components by the fusion blast'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -80 }
    });

    // ==========================================
    // 11. TARGET ALIGNMENT SENSOR SYSTEM (TASS)
    // ==========================================
    const tassGroup = new THREE.Group();
    
    const tassGeo = new THREE.CylinderGeometry(1.5, 2.5, 10, 32);
    const tassMesh = new THREE.Mesh(tassGeo, plastic);
    tassGroup.add(tassMesh);
    
    for(let i=0; i<4; i++) {
        const tNodeGeo = new THREE.BoxGeometry(1, 2, 1);
        const tNodeMesh = new THREE.Mesh(tNodeGeo, aluminum);
        tNodeMesh.position.set(Math.cos(i*Math.PI/2)*2.5, -3, Math.sin(i*Math.PI/2)*2.5);
        
        const glowLens = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), neonBlue);
        glowLens.position.y = -1;
        tNodeMesh.add(glowLens);
        
        tassGroup.add(tNodeMesh);
    }

    tassGroup.position.set(0, chamberRadius + 5, 0);
    group.add(tassGroup);
    meshes.tassGroup = tassGroup;

    parts.push({
        name: 'Target Alignment Sensor System (TASS)',
        description: 'A sophisticated multi-wavelength optical system located at the very top pole of the chamber. It looks down at the target to ensure it is perfectly centered and oriented.',
        material: 'plastic / aluminum / glowing diodes',
        function: 'Validates target position relative to chamber isocenter. Aligns the intersecting paths of all 192 laser beams.',
        assemblyOrder: 11,
        connections: ['Chamber Top Pole'],
        failureEffect: 'Laser beams strike target off-center.',
        cascadeFailures: ['Inefficient or utterly failed compression', 'Target disintegration without achieving fusion conditions'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    // ==========================================
    // 12. EMP SHIELDING & GROUNDING MESH
    // ==========================================
    const empGeo = new THREE.IcosahedronGeometry(chamberRadius + 4, 5);
    const empMesh = new THREE.Mesh(empGeo, new THREE.MeshStandardMaterial({
        color: 0xb87333,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        wireframeLinewidth: 1
    }));
    group.add(empMesh);

    parts.push({
        name: 'Faraday Cage / EMP Shielding Mesh',
        description: 'An extensive copper grounding envelope surrounding the entire chamber system. The immense burst of radiation from the fusion target generates a powerful electromagnetic pulse (EMP) similar to a nuclear detonation.',
        material: 'copper (wireframe)',
        function: 'Protects external facility electronics, supercomputers, and control systems from the target-generated EMP.',
        assemblyOrder: 12,
        connections: ['Facility Grounding System / Bedrock'],
        failureEffect: 'Massive electrical surges flow through facility networks.',
        cascadeFailures: ['Destruction of sensitive diagnostic computers', 'Total facility power outage', 'Data corruption'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 13. TURBOMOLECULAR VACUUM PUMPS
    // ==========================================
    const pumpGroup = new THREE.Group();
    const pumpBaseGeo = new THREE.CylinderGeometry(2.5, 3.5, 6, 32);
    const pumpFanGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.5, 32);
    
    for(let i=0; i<6; i++) {
        const pGroup = new THREE.Group();
        
        const p = new THREE.Mesh(pumpBaseGeo, steel);
        const f = new THREE.Mesh(pumpFanGeo, aluminum);
        
        for(let b=0; b<12; b++) {
            const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 2.0);
            const bladeMesh = new THREE.Mesh(bladeGeo, darkSteel);
            bladeMesh.rotation.y = (Math.PI / 6) * b;
            bladeMesh.rotation.x = 0.5; 
            f.add(bladeMesh);
        }

        f.position.y = 3;
        pGroup.add(p);
        pGroup.add(f);
        
        pGroup.rotation.x = Math.PI / 2; 
        
        const angle = (Math.PI * 2 / 6) * i;
        const pRadius = chamberRadius - 5;
        pGroup.position.set(
            Math.cos(angle) * pRadius, 
            -chamberRadius + 8, 
            Math.sin(angle) * pRadius
        );
        
        pGroup.lookAt(new THREE.Vector3(0, -chamberRadius + 8, 0));
        pGroup.rotateY(Math.PI);

        pumpGroup.add(pGroup);
    }
    group.add(pumpGroup);
    meshes.pumps = pumpGroup;

    parts.push({
        name: 'Turbomolecular Vacuum Pumps',
        description: 'A massive array of high-speed spinning turbine pumps attached to the lower hemisphere. They spin at tens of thousands of RPM to continuously evacuate the chamber.',
        material: 'steel / aluminum',
        function: 'Removes atmospheric gases to reach 10^-6 Torr vacuum, and rapidly clears out post-shot vaporized debris gases.',
        assemblyOrder: 13,
        connections: ['Vacuum Vessel Lower Hemisphere', 'Roughing Pump Backlines'],
        failureEffect: 'Chamber pressure rises rapidly.',
        cascadeFailures: ['Laser breakdown in chamber gas', 'Shot scrubbed', 'Oxidation of critical interior components'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -60, z: 40 }
    });

    // ==========================================
    // 14. LIQUID HELIUM COOLANT UMBILICAL
    // ==========================================
    const tubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -chamberRadius, 0),
        new THREE.Vector3(10, -chamberRadius - 5, 10),
        new THREE.Vector3(15, -chamberRadius - 15, -5),
        new THREE.Vector3(-5, -chamberRadius - 30, -10),
        new THREE.Vector3(0, -chamberRadius - 40, 0),
    ]);
    const cryoTubeGeo = new THREE.TubeGeometry(tubePath, 128, 1.2, 16, false);
    const cryoTube = new THREE.Mesh(cryoTubeGeo, rubber);
    group.add(cryoTube);

    parts.push({
        name: 'Cryogenic Liquid Helium Umbilical',
        description: 'Thick, heavily insulated vacuum-jacketed hoses that supply extreme cryogenic fluids (Liquid Helium) to the target positioner base.',
        material: 'rubber / composite insulation',
        function: 'Provides the massive cooling power required to freeze hydrogen isotopes solid inside the target pellet.',
        assemblyOrder: 14,
        connections: ['Target Positioner Base', 'Facility Cryoplant Infrastructure'],
        failureEffect: 'Target warms up, fuel layer melts and sloshes.',
        cascadeFailures: ['Implosion asymmetry', 'Complete ignition failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -50, z: 20 }
    });

    // ==========================================
    // 15. FUSION PLASMA FIREBALL (ANIMATED BLAST)
    // ==========================================
    const blastGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const blastMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    const blastMesh = new THREE.Mesh(blastGeo, blastMaterial);
    
    const blastCoreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const blastCoreMesh = new THREE.Mesh(blastCoreGeo, new THREE.MeshBasicMaterial({
        color: 0xffddaa,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    }));
    blastMesh.add(blastCoreMesh);

    group.add(blastMesh);
    meshes.blast = blastMesh;
    meshes.blastCore = blastCoreMesh;

    parts.push({
        name: 'Fusion Plasma Fireball (Ignition Yield)',
        description: 'The ephemeral state of matter created when the DT fuel compresses to 100 times the density of lead and reaches 100 million degrees, undergoing a self-sustaining thermonuclear burn wave.',
        material: 'plasma (effect)',
        function: 'Fuses Deuterium and Tritium nuclei into Helium (Alpha particles), releasing immense amounts of energy in the form of 14 MeV neutrons. This represents the "Yield" of the facility.',
        assemblyOrder: 15,
        connections: [],
        failureEffect: 'Premature quenching due to cold high-Z impurities (like carbon or gold) mixing into the central hotspot, radiating the heat away before the burn wave can propagate.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // DESCRIPTION & QUIZ
    // ==========================================
    const description = "The highly complex Inertial Confinement Fusion (ICF) Target Chamber. This immense experimental physics facility precisely converges 192 ultra-powerful ultraviolet laser beams onto a millimeter-sized target in a synchronized blast lasting only nanoseconds. The immense energy vaporizes the outer shell of the target (or the surrounding Hohlraum), causing an equal and opposite rocket-like reaction that crushes the core of Deuterium-Tritium fuel to densities and temperatures surpassing the center of the Sun, igniting a microscopic star. It represents the pinnacle of human engineering in extreme optics, cryogenics, and plasma physics.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Hohlraum in an indirect-drive ICF experiment?",
            options: [
                "To cool the fuel pellet to cryogenic temperatures",
                "To convert incoming ultraviolet laser light into a uniform bath of X-rays",
                "To measure the neutron yield of the reaction",
                "To absorb the electromagnetic pulse (EMP) generated by the blast"
            ],
            correctAnswer: 1,
            explanation: "In indirect drive, lasers strike the inner walls of the gold Hohlraum, creating an intense X-ray oven. These X-rays are what actually compress and heat the fuel pellet uniformly."
        },
        {
            question: "Why must the main target chamber be maintained under an ultra-high vacuum?",
            options: [
                "To prevent the gold Hohlraum from oxidizing",
                "To keep the cryogenic fuel from melting via convection",
                "To prevent laser beams from ionizing the air and scattering before reaching the target",
                "To allow the turbomolecular pumps to spin faster"
            ],
            correctAnswer: 2,
            explanation: "If there were air in the chamber, the intense laser beams would instantly turn it into plasma (laser breakdown), scattering the beam energy long before it ever reached the target at the center."
        },
        {
            question: "What is the role of the Cryogenic Target Positioner (TARPOS)?",
            options: [
                "To capture target debris post-shot",
                "To precisely hold the target at the isocenter and keep the DT fuel in a solid ice state",
                "To insert diagnostic sensors near the blast",
                "To pump liquid helium into the chamber walls"
            ],
            correctAnswer: 1,
            explanation: "The positioner is a hyper-precise boom that keeps the target accurately placed in the center of the 192 converging beams, while circulating extreme cryogens to keep the Deuterium-Tritium fuel frozen solid."
        },
        {
            question: "What protects the expensive Final Optics Assemblies (FOA) from blast shrapnel?",
            options: [
                "Expendable debris shields",
                "First wall louvers",
                "Magnetic confinement fields",
                "The Hohlraum itself"
            ],
            correctAnswer: 0,
            explanation: "Thin, sacrificial pieces of fused silica glass called debris shields are placed in front of the main optics to absorb the impacts of shrapnel and X-ray damage, saving the expensive multi-million-dollar lenses."
        },
        {
            question: "What causes the compression (implosion) of the DT fuel pellet in Inertial Confinement Fusion?",
            options: [
                "A massive hydraulic press",
                "Magnetic fields pinching the plasma (Tokamak principle)",
                "The rocket-like blowoff of the pellet's outer shell when rapidly heated by X-rays",
                "The physical pressure of the laser light (radiation pressure) pushing it inwards"
            ],
            correctAnswer: 2,
            explanation: "As the X-rays rapidly heat the outer surface of the pellet (the ablator), it explodes outward at massive speeds. By Newton's Third Law, this outward explosion drives the rest of the pellet inwards with immense force, compressing the fuel."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshesObj = meshes) {
        if (meshesObj.truss) {
            meshesObj.truss.rotation.y = time * 0.02 * speed;
            meshesObj.truss.rotation.z = time * 0.01 * speed;
        }
        
        if (meshesObj.pumps) {
            meshesObj.pumps.children.forEach(pumpGroup => {
                const fan = pumpGroup.children[1];
                if (fan) {
                    fan.rotation.y += 1.5 * speed; 
                }
            });
        }

        if (meshesObj.dimPiston) {
            meshesObj.dimPiston.position.z = -7.5 + Math.sin(time * 0.3 * speed) * 3;
        }

        if (meshesObj.tassGroup) {
            meshesObj.tassGroup.children.forEach(child => {
                if(child.children[0]) {
                    child.children[0].material.opacity = 0.5 + Math.sin(time * 4 * speed) * 0.4;
                }
            });
        }

        const cycleLength = 12;
        const t = (time * speed * 0.5) % cycleLength;
        
        if (t < 5) {
            if (meshesObj.beams) {
                meshesObj.beams.forEach(b => b.material.opacity = 0);
            }
            if (meshesObj.pellet) {
                meshesObj.pellet.material.emissiveIntensity = 2.0;
                meshesObj.pellet.scale.set(1, 1, 1);
            }
            if (meshesObj.blast) {
                meshesObj.blast.material.opacity = 0;
                meshesObj.blast.scale.set(1, 1, 1);
                meshesObj.blastCore.material.opacity = 0;
            }
            if (meshesObj.hohlraumMesh) {
                meshesObj.hohlraumMesh.material.emissiveIntensity = 0.2;
                meshesObj.hohlraumMesh.material.transparent = false;
                meshesObj.hohlraumMesh.material.opacity = 1.0;
            }
        } else if (t >= 5 && t < 6) {
            const flashProg = (t - 5); 
            
            if (meshesObj.beams) {
                meshesObj.beams.forEach(b => {
                    b.material.opacity = flashProg > 0.3 ? 0.9 : flashProg * 3;
                    b.material.color.setHSL(0.5, 1.0, 0.4 + Math.random() * 0.6);
                });
            }
            
            if (meshesObj.laserNodes) {
                meshesObj.laserNodes.forEach(node => {
                    node.scale.setScalar(1 + (Math.random() * 0.05 * flashProg));
                });
            }

            if (meshesObj.hohlraumMesh) {
                meshesObj.hohlraumMesh.material.emissive.setHex(0xffaa00);
                meshesObj.hohlraumMesh.material.emissiveIntensity = flashProg * 15;
            }
        } else if (t >= 6 && t < 8) {
            if (meshesObj.beams) {
                meshesObj.beams.forEach(b => b.material.opacity = 0);
            }
            if (meshesObj.laserNodes) {
                meshesObj.laserNodes.forEach(node => node.scale.setScalar(1));
            }
            
            if (meshesObj.hohlraumMesh) {
                meshesObj.hohlraumMesh.material.transparent = true;
                meshesObj.hohlraumMesh.material.opacity = Math.max(0, 1 - ((t-6)*5));
                meshesObj.hohlraumMesh.material.emissiveIntensity = 0; 
            }

            const burnTime = (t - 6); 
            
            if (meshesObj.pellet) {
                const implosionScale = Math.max(0.01, 1 - burnTime * 3);
                meshesObj.pellet.scale.setScalar(implosionScale);
                meshesObj.pellet.material.emissiveIntensity = 30 + Math.random() * 70;
            }

            if (meshesObj.blast && burnTime > 0.3) {
                const blastProg = (burnTime - 0.3) / 1.7; 
                
                const s = 1 + (blastProg * 25);
                meshesObj.blast.scale.setScalar(s);
                meshesObj.blast.material.opacity = (1 - blastProg);
                
                meshesObj.blastCore.material.opacity = (1 - blastProg) * 0.8;
                
                meshesObj.blast.material.color.setHSL(0.1 + (0.7 * (1-blastProg)), 1.0, 0.5 + 0.5*(1-blastProg));
            }
        } else {
            if (meshesObj.blast) {
                meshesObj.blast.material.opacity = 0;
                meshesObj.blastCore.material.opacity = 0;
            }
            if (meshesObj.pellet) {
                meshesObj.pellet.material.emissiveIntensity = 0;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createICFChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
