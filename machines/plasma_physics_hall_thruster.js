import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for adding parts
    function addPart(name, mesh, description, functionDesc, assemblyOrder, originalPos, materialName, failureEffect, cascadeFailures, explodedPos) {
        mesh.position.copy(originalPos);
        mesh.userData = { name, originalPosition: originalPos.clone(), explodedPosition: explodedPos.clone() };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            failureEffect,
            cascadeFailures,
            originalPosition: originalPos.clone(),
            explodedPosition: explodedPos.clone(),
            connections: cascadeFailures
        });
    }

    // High tech custom glowing materials
    const plasmaCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 2.5, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending 
    });
    const plasmaPlumeMat = new THREE.MeshStandardMaterial({ 
        color: 0x0066ff, emissive: 0x0033ff, emissiveIntensity: 1.5, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    const cathodePlasmaMat = new THREE.MeshStandardMaterial({ 
        color: 0xaaffff, emissive: 0xffffff, emissiveIntensity: 4.0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending 
    });
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.95, metalness: 0.05 });
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xaa7733, roughness: 0.4, metalness: 0.85 });
    const magneticCoreMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.5 });
    const wireInsulationMat = new THREE.MeshStandardMaterial({ color: 0x880000, roughness: 0.7, metalness: 0.1 });
    const goldPlatedMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.2, metalness: 1.0 });

    // ==========================================
    // PART 1: Main Mounting Backplate & Chassis
    // ==========================================
    const backplateGroup = new THREE.Group();
    const backplateGeom = new THREE.CylinderGeometry(16, 16, 3, 64);
    const backplateMesh = new THREE.Mesh(backplateGeom, darkSteel);
    backplateMesh.rotation.x = Math.PI / 2;
    backplateGroup.add(backplateMesh);
    
    // Add intricate ribbed cooling structures on the backplate
    for(let i=0; i<24; i++) {
        const finGeom = new THREE.BoxGeometry(2, 4, 15);
        const fin = new THREE.Mesh(finGeom, aluminum);
        const angle = (i / 24) * Math.PI * 2;
        fin.position.set(12 * Math.cos(angle), 12 * Math.sin(angle), 1);
        fin.rotation.z = angle;
        backplateGroup.add(fin);
    }
    
    // Add heavy mounting bolts
    for(let i=0; i<16; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 16), chrome);
        const angle = (i / 16) * Math.PI * 2;
        bolt.position.set(14.5 * Math.cos(angle), 14.5 * Math.sin(angle), 0);
        bolt.rotation.x = Math.PI / 2;
        backplateGroup.add(bolt);
    }

    addPart('Mounting Backplate', backplateGroup, 'Primary structural mount for the thruster assembly to the spacecraft bus, heavily ribbed for thermal dissipation.', 'Provides structural integrity, mounting points, and thermal sinking for the magnetic circuit.', 1, new THREE.Vector3(0, 0, -6), 'darkSteel/aluminum', 'Thruster misalignment, overheating, catastrophic mission failure.', ['Xenon Feed Lines', 'Wiring Harness', 'Thermal Shielding'], new THREE.Vector3(0, 0, -30));

    // ==========================================
    // PART 2: Inner Magnetic Pole & Core
    // ==========================================
    const innerPoleGroup = new THREE.Group();
    const innerPoleGeom = new THREE.CylinderGeometry(3.5, 3.5, 12, 64);
    const innerPole = new THREE.Mesh(innerPoleGeom, magneticCoreMat);
    innerPole.rotation.x = Math.PI / 2;
    innerPoleGroup.add(innerPole);
    
    // Core details (laminations)
    for(let i=0; i<10; i++) {
        const lamination = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.1, 8, 64), chrome);
        lamination.position.set(0, 0, -5 + i);
        innerPoleGroup.add(lamination);
    }
    
    addPart('Inner Magnetic Pole', innerPoleGroup, 'Central ferromagnetic core channeling the magnetic field, constructed from soft iron laminations to prevent eddy currents.', 'Shapes the radial magnetic field across the discharge channel to trap electrons.', 2, new THREE.Vector3(0, 0, -1), 'magneticCoreMat', 'Loss of magnetic field topology, electrons escape, severe loss of efficiency.', ['Discharge Channel', 'Inner Electromagnet Coil'], new THREE.Vector3(0, 0, -15));

    // ==========================================
    // PART 3: Inner Electromagnet Coil
    // ==========================================
    const innerCoilGroup = new THREE.Group();
    const innerCoilSpool = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 8, 64), plastic);
    innerCoilSpool.rotation.x = Math.PI / 2;
    innerCoilGroup.add(innerCoilSpool);
    
    // High-poly copper windings
    for(let i=0; i<40; i++) {
        const winding = new THREE.Mesh(new THREE.TorusGeometry(4.15, 0.15, 8, 64), copper);
        winding.position.set(0, 0, -3.8 + (i * 0.2));
        innerCoilGroup.add(winding);
    }
    
    addPart('Inner Electromagnet Coil', innerCoilGroup, 'High-current, densely packed copper windings around the inner pole piece.', 'Generates the primary central magnetic field component.', 3, new THREE.Vector3(0, 0, -1), 'copper/plastic', 'Loss of central magnetic field, discharge instability.', ['Plasma Confinement', 'Wiring Harness'], new THREE.Vector3(0, 0, 10));

    // ==========================================
    // PART 4: Outer Magnetic Pole Ring
    // ==========================================
    const outerPoleGroup = new THREE.Group();
    const outerPoleGeom = new THREE.TorusGeometry(13.5, 1.8, 64, 128);
    const outerPole = new THREE.Mesh(outerPoleGeom, magneticCoreMat);
    outerPoleGroup.add(outerPole);
    
    // Inner shaping lips of the outer pole
    const lipGeom = new THREE.TorusGeometry(12, 0.5, 32, 128);
    const lip = new THREE.Mesh(lipGeom, magneticCoreMat);
    lip.position.set(0, 0, 1.5);
    outerPoleGroup.add(lip);

    addPart('Outer Magnetic Pole Ring', outerPoleGroup, 'Outer ferromagnetic ring for completing the magnetic circuit, featuring specialized shaping lips.', 'Works with the inner pole to create a strong, precisely shaped radial magnetic field lens.', 4, new THREE.Vector3(0, 0, 3.5), 'magneticCoreMat', 'Weakened magnetic field, decreased thrust and efficiency.', ['Outer Electromagnet Array'], new THREE.Vector3(0, 0, -8));

    // ==========================================
    // PART 5: Outer Electromagnet Array
    // ==========================================
    const outerCoilsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const coilAssembly = new THREE.Group();
        
        // Iron core
        const core = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 7, 32), magneticCoreMat);
        core.rotation.x = Math.PI / 2;
        coilAssembly.add(core);
        
        // Spool
        const spool = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 6.5, 32), plastic);
        spool.rotation.x = Math.PI / 2;
        coilAssembly.add(spool);
        
        // Windings
        for(let w=0; w<25; w++) {
            const wrap = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.12, 8, 32), copper);
            wrap.position.set(0, 0, -3 + (w * 0.25));
            coilAssembly.add(wrap);
        }
        
        const angle = (i / 8) * Math.PI * 2;
        coilAssembly.position.set(13.5 * Math.cos(angle), 13.5 * Math.sin(angle), 0);
        outerCoilsGroup.add(coilAssembly);
    }
    
    addPart('Outer Electromagnet Array', outerCoilsGroup, 'Array of 8 evenly spaced electromagnets distributed around the outer perimeter.', 'Generates the outer boundary of the magnetic field and allows for minor thrust vector control by varying current.', 5, new THREE.Vector3(0, 0, 0), 'copper/magneticCore', 'Asymmetrical magnetic field, unstable thrust vector, torque imparted to spacecraft.', ['Outer Magnetic Pole Ring'], new THREE.Vector3(0, 0, 18));

    // ==========================================
    // PART 6: Gas Distributor / Anode Manifold
    // ==========================================
    const anodeGroup = new THREE.Group();
    const anodeGeom = new THREE.TorusGeometry(8.5, 1.2, 64, 128);
    const anodeBase = new THREE.Mesh(anodeGeom, anodeMat);
    anodeGroup.add(anodeBase);
    
    // Add intricate injection baffles
    for(let i=0; i<48; i++) {
        const baffle = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), chrome);
        const angle = (i/48) * Math.PI * 2;
        baffle.position.set(8.5 * Math.cos(angle), 8.5 * Math.sin(angle), 1);
        baffle.rotation.z = angle;
        baffle.rotation.y = Math.PI / 4;
        anodeGroup.add(baffle);
    }
    
    addPart('Gas Distributor & Anode', anodeGroup, 'Highly machined annular manifold with complex baffles that injects propellant and serves as the positive high-voltage electrode.', 'Distributes neutral Xenon gas perfectly evenly and draws massive electron current to establish the accelerating electric field.', 6, new THREE.Vector3(0, 0, -2.5), 'anodeMat/chrome', 'Uneven gas flow leading to discharge extinguishment, total loss of acceleration field.', ['Discharge Channel', 'Xenon Feed Lines'], new THREE.Vector3(0, 0, 25));

    // ==========================================
    // PART 7: Ceramic Discharge Channel
    // ==========================================
    const channelGroup = new THREE.Group();
    
    // Inner wall
    const innerWallGeom = new THREE.CylinderGeometry(5.5, 5.5, 9, 64, 1, true);
    const innerWall = new THREE.Mesh(innerWallGeom, ceramicMat);
    innerWall.rotation.x = Math.PI / 2;
    channelGroup.add(innerWall);
    
    // Outer wall
    const outerWallGeom = new THREE.CylinderGeometry(11.5, 11.5, 9, 64, 1, true);
    const outerWall = new THREE.Mesh(outerWallGeom, ceramicMat);
    outerWall.rotation.x = Math.PI / 2;
    channelGroup.add(outerWall);
    
    // Back plate of channel
    const channelBackGeom = new THREE.RingGeometry(5.5, 11.5, 64);
    const channelBack = new THREE.Mesh(channelBackGeom, ceramicMat);
    channelBack.position.set(0, 0, -4.5);
    channelGroup.add(channelBack);
    
    // Eroded groove texturing (simulated by adding thin dark toruses on the walls)
    for(let i=0; i<3; i++) {
        const grooveOuter = new THREE.Mesh(new THREE.TorusGeometry(11.45, 0.05, 8, 64), darkSteel);
        grooveOuter.position.set(0, 0, 1 + i);
        channelGroup.add(grooveOuter);
        
        const grooveInner = new THREE.Mesh(new THREE.TorusGeometry(5.55, 0.05, 8, 64), darkSteel);
        grooveInner.position.set(0, 0, 1 + i);
        channelGroup.add(grooveInner);
    }
    
    addPart('Ceramic Discharge Channel', channelGroup, 'Annular chamber made from high-purity Boron Nitride ceramic, designed to withstand plasma bombardment.', 'Contains the plasma, withstands thousands of degrees of heat, and provides crucial secondary electron emission to sustain the discharge.', 7, new THREE.Vector3(0, 0, 2), 'ceramicMat', 'Wall erosion leading to short circuit between anode and magnetic poles.', ['Anode', 'Magnetic Poles'], new THREE.Vector3(0, 0, 35));

    // ==========================================
    // PART 8: Primary Xenon Feed Plumbing
    // ==========================================
    const plumbingGroup = new THREE.Group();
    
    const feedCurve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -16, -6),
        new THREE.Vector3(8, -14, -4),
        new THREE.Vector3(8.5, -8.5, -2.5)
    ]);
    const feedPipe1 = new THREE.Mesh(new THREE.TubeGeometry(feedCurve1, 64, 0.5, 16, false), steel);
    plumbingGroup.add(feedPipe1);
    
    const feedCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -16, -6),
        new THREE.Vector3(-8, -14, -4),
        new THREE.Vector3(-8.5, -8.5, -2.5)
    ]);
    const feedPipe2 = new THREE.Mesh(new THREE.TubeGeometry(feedCurve2, 64, 0.5, 16, false), steel);
    plumbingGroup.add(feedPipe2);
    
    // Add heavy flow control valves
    const valve1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), goldPlatedMat);
    valve1.position.set(8, -14, -4);
    plumbingGroup.add(valve1);
    
    const valve2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), goldPlatedMat);
    valve2.position.set(-8, -14, -4);
    plumbingGroup.add(valve2);

    addPart('Xenon Feed Plumbing & Valves', plumbingGroup, 'High-pressure stainless steel tubing with redundantly paired solenoid flow control valves.', 'Carries supercritical Xenon gas from spacecraft tanks directly to the distributor manifold.', 8, new THREE.Vector3(0, 0, 0), 'steel/goldPlated', 'Propellant leak, valve stuck closed, total loss of thrust.', ['Gas Distributor & Anode', 'Spacecraft Tanks'], new THREE.Vector3(20, -20, -15));

    // ==========================================
    // PART 9: Hollow Cathode Neutralizer
    // ==========================================
    const cathodeGroup = new THREE.Group();
    
    // Main Body
    const cathodeBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6, 32), chrome);
    cathodeBody.position.set(0, 0, 3);
    cathodeBody.rotation.x = Math.PI / 2;
    cathodeGroup.add(cathodeBody);
    
    // Heater Coils on outside
    for(let i=0; i<15; i++) {
        const heater = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.1, 16, 32), darkSteel);
        heater.position.set(0, 0, 1 + (i*0.2));
        cathodeGroup.add(heater);
    }
    
    // Keeper Electrode Tip
    const cathodeTip = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.2, 1.5, 32), anodeMat);
    cathodeTip.position.set(0, 0, 6.75);
    cathodeTip.rotation.x = Math.PI / 2;
    cathodeGroup.add(cathodeTip);
    
    // Emissive Plasma point
    const cathodePlasma = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), cathodePlasmaMat);
    cathodePlasma.position.set(0, 0, 7.8);
    cathodeGroup.add(cathodePlasma);
    
    // Cathode Mount Arm
    const cathodeArm = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 1), steel);
    cathodeArm.position.set(0, -3, 1);
    cathodeGroup.add(cathodeArm);

    cathodeGroup.position.set(0, 16, 4);
    cathodeGroup.rotation.x = -Math.PI / 10;
    
    addPart('Hollow Cathode Neutralizer', cathodeGroup, 'Thermionic electron emitting device utilizing a low-work-function barium oxide insert, positioned outside the exhaust.', 'Provides immense electron current to ionize the main gas flow and subsequently neutralizes the exiting positive ion beam.', 9, new THREE.Vector3(0, 0, 0), 'chrome/anodeMat', 'Beam charging, catastrophic spacecraft electrical arcing, complete thrust cessation.', ['Spacecraft Bus', 'Plasma Plume'], new THREE.Vector3(0, 30, 20));

    // ==========================================
    // PART 10: Cathode Feed & Wiring Harness
    // ==========================================
    const harnessGroup = new THREE.Group();
    
    const cathodeWireCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 16, 0),
        new THREE.Vector3(-4, 14, -3),
        new THREE.Vector3(-6, 8, -5),
        new THREE.Vector3(-4, 0, -6)
    ]);
    
    // Create a bundle of wires
    for(let i=0; i<3; i++) {
        const offsetCurve = new THREE.CatmullRomCurve3(
            cathodeWireCurve.points.map(p => new THREE.Vector3(p.x + (i*0.3), p.y, p.z))
        );
        const wire = new THREE.Mesh(new THREE.TubeGeometry(offsetCurve, 64, 0.15, 16, false), wireInsulationMat);
        harnessGroup.add(wire);
    }
    
    // Add small cathode gas feed tube
    const cathodeGas = new THREE.Mesh(new THREE.TubeGeometry(cathodeWireCurve, 64, 0.2, 16, false), steel);
    cathodeGas.position.set(0.5, 0, 0);
    harnessGroup.add(cathodeGas);

    addPart('Cathode Wiring & Feed Harness', harnessGroup, 'Bundle of high-temperature Kapton-insulated wires and a dedicated micro-bore Xenon feed line.', 'Supplies massive heater current (10A+), high voltage keeper ignition potential, and a small trickle of Xenon flow to sustain the cathode plasma bridge.', 10, new THREE.Vector3(0, 0, 0), 'wireInsulationMat/steel', 'Cathode fails to ignite or extinguishes.', ['Hollow Cathode'], new THREE.Vector3(-15, 20, -10));

    // ==========================================
    // PART 11: Thermal Radiator Shielding
    // ==========================================
    const shieldGroup = new THREE.Group();
    const shieldGeom = new THREE.CylinderGeometry(15.5, 15.5, 12, 64, 1, true);
    const shield = new THREE.Mesh(shieldGeom, aluminum);
    shield.rotation.x = Math.PI / 2;
    shieldGroup.add(shield);
    
    // Add complex louvers to the shield
    for(let i=0; i<8; i++) {
        const louver = new THREE.Mesh(new THREE.TorusGeometry(15.7, 0.3, 16, 128), chrome);
        louver.position.set(0, 0, -5 + (i * 1.4));
        shieldGroup.add(louver);
    }
    
    addPart('Thermal Radiator Shielding', shieldGroup, 'Multilayer polished aluminum housing with integrated louvers.', 'Reflects and radiates the immense heat generated by the 3000K+ plasma discharge away from sensitive spacecraft avionics.', 11, new THREE.Vector3(0, 0, -1), 'aluminum/chrome', 'Thermal bleed into spacecraft, avionics meltdown.', ['Mounting Backplate'], new THREE.Vector3(0, 0, -40));

    // ==========================================
    // PART 12: Electrical Power Connectors
    // ==========================================
    const connectorsGroup = new THREE.Group();
    
    const connector1 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 4), plastic);
    connector1.position.set(-10, -14, -7);
    connectorsGroup.add(connector1);
    
    const pinGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    for(let i=0; i<9; i++) {
        const pin = new THREE.Mesh(pinGeom, goldPlatedMat);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(-11 + (i%3), -15 + Math.floor(i/3), -9);
        connectorsGroup.add(pin);
    }
    
    const connector2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 4), plastic);
    connector2.position.set(10, -14, -7);
    connectorsGroup.add(connector2);
    
    for(let i=0; i<9; i++) {
        const pin = new THREE.Mesh(pinGeom, goldPlatedMat);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(9 + (i%3), -15 + Math.floor(i/3), -9);
        connectorsGroup.add(pin);
    }

    addPart('PPU Electrical Interfaces', connectorsGroup, 'Heavy duty, aerospace-grade multi-pin connectors linking to the Power Processing Unit (PPU).', 'Routes 300V+ discharge power, multi-amp electromagnet currents, and critical diagnostic telemetry.', 12, new THREE.Vector3(0, 0, 0), 'plastic/goldPlated', 'Loss of electrical continuity, dead thruster.', ['Mounting Backplate', 'Wiring Harness'], new THREE.Vector3(0, -35, -20));

    // ==========================================
    // PART 13: Plasma Ionization Core
    // ==========================================
    const plasmaCoreGroup = new THREE.Group();
    const plasmaCoreGeom = new THREE.TorusGeometry(8.5, 2.5, 64, 128);
    const plasmaCore = new THREE.Mesh(plasmaCoreGeom, plasmaCoreMat);
    plasmaCoreGroup.add(plasmaCore);
    
    // Add inner intense ring
    const intenseCore = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.8, 32, 128), new THREE.MeshStandardMaterial({ 
        color: 0xffffff, emissive: 0xaaffff, emissiveIntensity: 5.0, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending 
    }));
    plasmaCoreGroup.add(intenseCore);

    addPart('Plasma Ionization Core', plasmaCoreGroup, 'The hyper-dense, electromagnetically trapped region of swirling electrons and ionizing Xenon.', 'High collision rate zone where neutral Xenon atoms are stripped of electrons to become positively charged ions (Xe+).', 13, new THREE.Vector3(0, 0, 5), 'plasmaCoreMat', 'Loss of ionization, neutral gas vents to space uselessly.', ['Accelerated Ion Beam'], new THREE.Vector3(0, 0, 50));

    // ==========================================
    // PART 14: Accelerated Ion Beam
    // ==========================================
    const ionBeamGroup = new THREE.Group();
    const ionBeamGeom = new THREE.CylinderGeometry(8.5, 8.5, 10, 64, 1, true);
    const ionBeam = new THREE.Mesh(ionBeamGeom, plasmaPlumeMat);
    ionBeam.rotation.x = Math.PI / 2;
    ionBeamGroup.add(ionBeam);
    
    // Add striations to the beam
    for(let i=0; i<4; i++) {
        const striation = new THREE.Mesh(new THREE.CylinderGeometry(8.0 - i*0.5, 8.0 - i*0.5, 10, 32, 1, true), new THREE.MeshStandardMaterial({
            color: 0x00ffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
        }));
        striation.rotation.x = Math.PI / 2;
        ionBeamGroup.add(striation);
    }

    addPart('Accelerated Ion Beam', ionBeamGroup, 'The highly directional region where ions are linearly accelerated by the intense electric field.', 'Produces the physical momentum (thrust) by ejecting heavy Xenon ions at velocities exceeding 20,000 m/s.', 14, new THREE.Vector3(0, 0, 10), 'plasmaPlumeMat', 'No thrust produced.', ['Exhaust Plasma Plume'], new THREE.Vector3(0, 0, 70));

    // ==========================================
    // PART 15: Exhaust Plasma Plume
    // ==========================================
    const plumeGroup = new THREE.Group();
    const plumeGeom = new THREE.CylinderGeometry(8.5, 45, 80, 64, 32, true);
    const plume = new THREE.Mesh(plumeGeom, plasmaPlumeMat);
    plume.rotation.x = Math.PI / 2;
    plumeGroup.add(plume);
    
    // Complex nested expanding plumes for hyper-realism
    for(let i=0; i<5; i++) {
        const innerPlume = new THREE.Mesh(
            new THREE.CylinderGeometry(8.5, 15 + (i*6), 30 + (i*12), 64, 1, true), 
            new THREE.MeshStandardMaterial({
                color: 0x00ffff, emissive: 0x0022ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.25 - (i*0.04), blending: THREE.AdditiveBlending, side: THREE.DoubleSide
            })
        );
        innerPlume.rotation.x = Math.PI / 2;
        innerPlume.position.set(0, 0, (30 + (i*12))/2 - 40); // Align base to thruster exit
        plumeGroup.add(innerPlume);
    }

    addPart('Exhaust Plasma Plume', plumeGroup, 'The massive, diverging exhaust beam of neutralized Xenon plasma.', 'Carries monumental kinetic energy away from the spacecraft, completing the thrust generation cycle in the vacuum of space.', 15, new THREE.Vector3(0, 0, 55), 'plasmaPlumeMat', 'Plume impingement on solar arrays, degrading power generation.', [], new THREE.Vector3(0, 0, 120));


    // ==========================================
    // Advanced Particle System for Plume
    // ==========================================
    const particleCount = 2500;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    
    for(let i=0; i<particleCount; i++) {
        const radius = 5.5 + Math.random() * 6; // Spread across the channel annulus
        const angle = Math.random() * Math.PI * 2;
        particlePositions[i*3] = radius * Math.cos(angle);
        particlePositions[i*3+1] = radius * Math.sin(angle);
        particlePositions[i*3+2] = 5 + Math.random() * 10; 
        
        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.4,
            y: (Math.random() - 0.5) * 0.4,
            z: 3 + Math.random() * 4 
        });
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Creating a custom sprite-like material using Points
    const particleMat = new THREE.PointsMaterial({
        color: 0xaaffff, size: 0.35, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const plumeParticles = new THREE.Points(particlesGeom, particleMat);
    group.add(plumeParticles);
    
    // Store references for the animate function
    meshes.plasmaCoreGroup = plasmaCoreGroup;
    meshes.ionBeamGroup = ionBeamGroup;
    meshes.plumeGroup = plumeGroup;
    meshes.cathodePlasma = cathodeGroup.children[3]; // 4th child is the sphere
    meshes.plumeParticles = plumeParticles;
    meshes.particleVelocities = particleVelocities;

    const description = "The Hall Effect Thruster (HET) is an ultra-advanced, hyper-efficient form of electric ion propulsion utilized in deep space missions and modern satellite constellations. It operates by trapping electrons in a complex radial magnetic field lens created by powerful electromagnets, forcing them into a 'Hall current'. Neutral Xenon gas is injected and stripped of electrons in this dense plasma core. The newly created positive Xenon ions are then violently accelerated out of the ceramic chamber by an immense axial electric field, achieving exhaust velocities exceeding 30,000 meters per second. A critical external Hollow Cathode Neutralizer continuously fires an electron beam into the wake to prevent the spacecraft from accumulating a mission-ending electrical charge. This highly detailed model features perfectly mapped magnetic topologies, complex propellant plumbing, multi-stage ceramic discharge channels, and a dynamically simulated, intensely glowing Xenon plasma plume.";

    const quizQuestions = [
        {
            question: "What is the primary function of the radial magnetic field created by the inner and outer poles?",
            options: [
                "To magnetically accelerate the Xenon ions out of the engine",
                "To trap electrons and force them to spiral, drastically increasing ionization efficiency",
                "To cool the Boron Nitride ceramic walls of the discharge channel",
                "To superheat the Xenon gas before it enters the ionization chamber"
            ],
            correctAnswer: 1,
            explanation: "The radial magnetic field is precisely tuned to trap lightweight electrons while allowing heavy ions to pass. The trapped electrons spiral around the channel (the Hall drift), vastly increasing the likelihood they will collide with and ionize neutral Xenon atoms."
        },
        {
            question: "Why MUST the Hollow Cathode Neutralizer be positioned outside the main discharge channel?",
            options: [
                "To prevent its delicate barium oxide insert from melting due to the 3000K plasma",
                "To inject secondary propellants into the exhaust stream for an afterburner effect",
                "To provide electrons that neutralize the exiting positive ion beam, preventing severe spacecraft charging",
                "To act as a redundant backup ignition system in case the primary anode fails"
            ],
            correctAnswer: 2,
            explanation: "If the positive ion beam wasn't neutralized, the spacecraft would instantly build up a massive negative charge, pulling the ions right back into the engine and killing all thrust. The cathode emits a stream of electrons that perfectly balances the charge of the exhaust plume."
        },
        {
            question: "What specific material is typically used for the walls of the Discharge Channel, and why?",
            options: [
                "Oxygen-free Copper, for extreme electrical conductivity",
                "Boron Nitride Ceramic, for high thermal shock resistance and crucial secondary electron emission",
                "Depleted Tungsten, for maximum density and radiation shielding",
                "Carbon Fiber Composite, to minimize the overall dry mass of the propulsion system"
            ],
            correctAnswer: 1,
            explanation: "Boron Nitride is favored because it withstands the extreme erosion of the plasma, provides electrical insulation so it doesn't short circuit the anode, and critically, it emits secondary electrons when struck by plasma, which helps sustain the discharge."
        },
        {
            question: "Which high-precision component acts as the positive high-voltage electrode while simultaneously distributing propellant?",
            options: [
                "The Inner Magnetic Pole Core",
                "The Hollow Cathode Keeper Electrode",
                "The Gas Distributor / Anode Manifold",
                "The Multilayer Thermal Shielding"
            ],
            correctAnswer: 2,
            explanation: "The Anode sits at the very back of the discharge channel. It uses complex micro-baffles to distribute the neutral Xenon gas perfectly evenly, and operates at +300V (or higher) to establish the massive electric field that ultimately accelerates the ions."
        },
        {
            question: "What quantum physical process gives the Hall Thruster exhaust its characteristic, brilliantly bright blue glow?",
            options: [
                "High-power blue LED status indicators mounted on the outer magnetic pole",
                "Extreme blackbody thermal radiation from the superheated ceramic channel walls",
                "Atomic emission spectra of excited Xenon ions releasing photons as electrons drop to lower energy states",
                "Cherenkov radiation generated by Xenon ions exceeding the speed of light in the local medium"
            ],
            correctAnswer: 2,
            explanation: "As Xenon ions and atoms are bombarded by the electron swarm, their electrons are excited to higher quantum energy levels. When they inevitably fall back down to their resting state, they release energy as photons. Xenon's specific emission spectrum is intensely weighted in the blue/violet wavelengths."
        }
    ];

    function animate(time, speed, meshes) {
        const pulse = Math.sin(time * 12 * speed) * 0.15 + 0.85;
        const erraticFlicker = Math.random() * 0.2 + 0.9;
        
        // Pulse the dense plasma core
        if(meshes.plasmaCoreGroup) {
            meshes.plasmaCoreGroup.children.forEach(child => {
                if(child.material) {
                    child.material.emissiveIntensity = 2.5 * pulse * erraticFlicker;
                }
            });
            meshes.plasmaCoreGroup.scale.set(1 + pulse*0.02, 1 + pulse*0.02, 1 + pulse*0.02);
        }
        
        // Modulate the accelerating ion beam
        if(meshes.ionBeamGroup) {
            meshes.ionBeamGroup.children.forEach((child, index) => {
                if(child.material) {
                    child.material.opacity = (0.4 - (index*0.08)) * pulse;
                }
            });
        }
        
        // Violently flicker the cathode plasma point
        if(meshes.cathodePlasma && meshes.cathodePlasma.material) {
            meshes.cathodePlasma.material.emissiveIntensity = 3.0 + Math.random() * 3.0;
            const cathodeScale = 0.7 + Math.random() * 0.6;
            meshes.cathodePlasma.scale.set(cathodeScale, cathodeScale, cathodeScale);
        }

        // Animate the extended plume geometry to simulate flow instability
        if(meshes.plumeGroup) {
            meshes.plumeGroup.scale.set(1.0 + Math.sin(time * 8 * speed)*0.03, 1, 1.0 + Math.cos(time * 7 * speed)*0.03);
            
            meshes.plumeGroup.children.forEach((child, index) => {
                // Ignore the main outer plume which is at index 0
                if(index > 0) {
                    child.rotation.y = time * index * 2 * speed;
                    child.material.opacity = (0.25 - (index*0.04)) * pulse;
                    // Slightly shift inner plumes
                    child.position.x = Math.sin(time * 10 * speed + index) * 0.2;
                    child.position.y = Math.cos(time * 9 * speed + index) * 0.2;
                }
            });
        }

        // Extremely high-speed particle simulation for the ion exhaust
        if(meshes.plumeParticles && meshes.particleVelocities) {
            const positions = meshes.plumeParticles.geometry.attributes.position.array;
            for(let i=0; i<meshes.particleVelocities.length; i++) {
                
                // Add velocity to positions
                positions[i*3] += meshes.particleVelocities[i].x * speed * 2;
                positions[i*3+1] += meshes.particleVelocities[i].y * speed * 2;
                positions[i*3+2] += meshes.particleVelocities[i].z * speed * 2;

                // Add some outward radial expansion based on Z distance
                const currentZ = positions[i*3+2];
                if(currentZ > 10) {
                    const expansionFactor = 1.0 + (0.01 * speed);
                    positions[i*3] *= expansionFactor;
                    positions[i*3+1] *= expansionFactor;
                }

                // Recycle particles that travel too far down the plume
                if(currentZ > 100) {
                    const radius = 5.5 + Math.random() * 6;
                    const angle = Math.random() * Math.PI * 2;
                    positions[i*3] = radius * Math.cos(angle);
                    positions[i*3+1] = radius * Math.sin(angle);
                    positions[i*3+2] = 5 + Math.random() * 2;
                    
                    // Slightly randomize new velocities
                    meshes.particleVelocities[i].x = (Math.random() - 0.5) * 0.4;
                    meshes.particleVelocities[i].y = (Math.random() - 0.5) * 0.4;
                }
            }
            meshes.plumeParticles.geometry.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHallThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
