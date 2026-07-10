import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper to add parts
    function addPart(name, mesh, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, origPos, explPos) {
        mesh.name = name;
        mesh.userData = {
            originalPosition: new THREE.Vector3(origPos.x, origPos.y, origPos.z),
            explodedPosition: new THREE.Vector3(explPos.x, explPos.y, explPos.z)
        };
        group.add(mesh);
        meshes[name] = mesh;

        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // Material definitions for custom glows and specific parts
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a2be2, // Purple
        emissive: 0xaa00ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.85,
        wireframe: false
    });

    const superconductingMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x002244,
        emissiveIntensity: 0.5
    });
    
    const magneticCoilMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.4
    });

    const vacuumVesselMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide
    });

    const cryostatMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e0e0,
        metalness: 0.6,
        roughness: 0.2,
        transmission: 0.6,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    // 1. Central Solenoid
    const solenoidGroup = new THREE.Group();
    const solenoidCoreGeo = new THREE.CylinderGeometry(2, 2, 30, 64);
    const solenoidCore = new THREE.Mesh(solenoidCoreGeo, darkSteel);
    solenoidGroup.add(solenoidCore);
    
    for (let i = 0; i < 60; i++) {
        const ringGeo = new THREE.TorusGeometry(2.1, 0.15, 16, 64);
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -14.5 + i * 0.5;
        solenoidGroup.add(ring);
    }
    
    addPart('CentralSolenoid', solenoidGroup, 'Primary magnetic transformer core driving the plasma current.', 'Copper/Superconductor', 'Induces ohmic heating and drives the central plasma current.', 1, ['VacuumVessel', 'PoloidalFieldCoils'], 'Loss of primary plasma current, plasma collapse.', ['Disruption event', 'Plasma strike on first wall'], {x:0, y:0, z:0}, {x:0, y:30, z:0});

    // 2. Vacuum Vessel
    const vesselGroup = new THREE.Group();
    const vesselGeo = new THREE.TorusGeometry(10, 4, 64, 128);
    const vessel = new THREE.Mesh(vesselGeo, vacuumVesselMaterial);
    vessel.rotation.x = Math.PI / 2;
    vesselGroup.add(vessel);

    // First Wall (Inner lining)
    const firstWallGeo = new THREE.TorusGeometry(9.9, 3.8, 64, 128);
    const firstWall = new THREE.Mesh(firstWallGeo, new THREE.MeshStandardMaterial({color: 0x333333, metalness: 0.5, roughness: 0.8, wireframe: true}));
    firstWall.rotation.x = Math.PI / 2;
    vesselGroup.add(firstWall);
    
    addPart('VacuumVessel', vesselGroup, 'Toroidal chamber containing the plasma in a high vacuum.', 'Steel/Beryllium', 'Maintains ultra-high vacuum environment and houses the plasma.', 2, ['CentralSolenoid', 'DiagnosticPorts', 'Divertor'], 'Loss of vacuum, catastrophic plasma quench.', ['First wall melting', 'Cryogenic leak'], {x:0, y:0, z:0}, {x:0, y:-30, z:0});

    // 3. Toroidal Field Coils (D-shaped)
    const tfCoilsGroup = new THREE.Group();
    const tfCoilCount = 18;
    
    // Create D-shape path
    const dShapeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, -9, 0),
        new THREE.Vector3(6, -9, 0),
        new THREE.Vector3(12, -7, 0),
        new THREE.Vector3(15, -2, 0),
        new THREE.Vector3(15, 2, 0),
        new THREE.Vector3(12, 7, 0),
        new THREE.Vector3(6, 9, 0),
        new THREE.Vector3(1, 9, 0),
        new THREE.Vector3(1, -9, 0)
    ]);
    
    const tfCoilGeo = new THREE.TubeGeometry(dShapeCurve, 64, 1.2, 16, true);
    
    for (let i = 0; i < tfCoilCount; i++) {
        const angle = (i / tfCoilCount) * Math.PI * 2;
        const tfCoil = new THREE.Mesh(tfCoilGeo, superconductingMaterial);
        tfCoil.rotation.y = angle;
        
        // Add intricate detailing to each coil
        const coilWrapGeo = new THREE.TorusGeometry(1.3, 0.1, 8, 16);
        for(let j=0; j<20; j++) {
            const wrapper = new THREE.Mesh(coilWrapGeo, neonBlueMaterial);
            const t = j / 20;
            const pt = dShapeCurve.getPointAt(t);
            const tan = dShapeCurve.getTangentAt(t);
            wrapper.position.copy(pt);
            wrapper.lookAt(pt.clone().add(tan));
            tfCoil.add(wrapper);
        }
        
        tfCoilsGroup.add(tfCoil);
    }
    
    addPart('ToroidalFieldCoils', tfCoilsGroup, 'Massive D-shaped superconducting magnets.', 'Niobium-Tin Superconductor', 'Generates the primary toroidal magnetic field to confine the plasma.', 3, ['VacuumVessel', 'SupportStructure'], 'Loss of magnetic confinement, plasma expands into walls.', ['Vacuum vessel breach', 'Magnet quench'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Explodes radially in animate

    // 4. Poloidal Field Coils
    const pfCoilsGroup = new THREE.Group();
    const pfRadii = [4, 8, 16, 17, 13, 5];
    const pfHeights = [12, 11, 6, -5, -11, -12];
    const pfThickness = [0.8, 1.0, 1.2, 1.2, 1.0, 0.8];
    
    for (let i = 0; i < pfRadii.length; i++) {
        const pfCoilGeo = new THREE.TorusGeometry(pfRadii[i], pfThickness[i], 32, 128);
        const pfCoil = new THREE.Mesh(pfCoilGeo, magneticCoilMaterial);
        pfCoil.rotation.x = Math.PI / 2;
        pfCoil.position.y = pfHeights[i];
        
        // Add structural supports to PF coils
        for (let j=0; j<12; j++) {
            const angle = (j/12)*Math.PI*2;
            const supportGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
            const support = new THREE.Mesh(supportGeo, darkSteel);
            support.position.set(pfRadii[i] * Math.cos(angle), 0, pfRadii[i] * Math.sin(angle));
            pfCoil.add(support);
        }
        
        pfCoilsGroup.add(pfCoil);
    }
    
    addPart('PoloidalFieldCoils', pfCoilsGroup, 'Horizontal magnetic coil rings.', 'Niobium-Titanium Superconductor', 'Shapes the plasma and positions it away from the vessel walls.', 4, ['ToroidalFieldCoils', 'SupportStructure'], 'Plasma vertical displacement event.', ['Plasma disruption', 'First wall damage'], {x:0, y:0, z:0}, {x:0, y:50, z:0});

    // 5. Plasma Torus (Glowing)
    const plasmaGroup = new THREE.Group();
    const plasmaGeo = new THREE.TorusGeometry(10, 2.5, 64, 128);
    const plasmaCore = new THREE.Mesh(plasmaGeo, plasmaMaterial);
    plasmaCore.rotation.x = Math.PI / 2;
    plasmaGroup.add(plasmaCore);

    // Plasma inner flow (visual effect)
    const plasmaFlowGeo = new THREE.TorusGeometry(10, 2.0, 32, 64);
    const plasmaFlowMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 4.0,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const plasmaFlow = new THREE.Mesh(plasmaFlowGeo, plasmaFlowMat);
    plasmaFlow.rotation.x = Math.PI / 2;
    plasmaGroup.add(plasmaFlow);

    addPart('PlasmaTorus', plasmaGroup, '150 million degree ionized gas.', 'Deuterium-Tritium Plasma', 'The medium where fusion reactions occur.', 5, ['VacuumVessel', 'MagneticFields'], 'Fusion reaction ceases, extreme thermal radiation drops.', ['None'], {x:0, y:0, z:0}, {x:0, y:0, z:0});

    // 6. Divertor
    const divertorGroup = new THREE.Group();
    const divertorGeo = new THREE.TorusGeometry(9.5, 1.2, 32, 128);
    const divertor = new THREE.Mesh(divertorGeo, new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.9, roughness: 0.9}));
    divertor.rotation.x = Math.PI / 2;
    divertor.scale.set(1, 1, 0.5); // Flattened
    divertor.position.y = -3.5;
    
    // Add divertor cassettes
    for (let i = 0; i < 54; i++) {
        const angle = (i / 54) * Math.PI * 2;
        const cassetteGeo = new THREE.BoxGeometry(1.5, 1, 3);
        const cassette = new THREE.Mesh(cassetteGeo, steel);
        cassette.position.set(9.5 * Math.cos(angle), -3.8, 9.5 * Math.sin(angle));
        cassette.lookAt(0, -3.8, 0);
        divertorGroup.add(cassette);
    }
    
    addPart('Divertor', divertorGroup, 'Exhaust system at the bottom of the vacuum vessel.', 'Tungsten/Carbon-Carbon', 'Extracts heat and ash (helium) from the fusion reaction.', 6, ['VacuumVessel', 'CoolingSystem'], 'Extreme heat buildup, melting of bottom vessel components.', ['Vessel breach', 'Coolant leak'], {x:0, y:0, z:0}, {x:0, y:-45, z:0});

    // 7. Diagnostic Ports
    const diagnosticPortsGroup = new THREE.Group();
    const portGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const port = new THREE.Mesh(portGeo, steel);
        port.position.set(13 * Math.cos(angle), 0, 13 * Math.sin(angle));
        port.rotation.z = Math.PI / 2;
        port.rotation.y = -angle;
        
        // Add sensor lenses
        const lensGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.1, 32);
        const lens = new THREE.Mesh(lensGeo, tinted);
        lens.rotation.copy(port.rotation);
        lens.position.copy(port.position);
        
        diagnosticPortsGroup.add(port);
        diagnosticPortsGroup.add(lens);
    }
    
    addPart('DiagnosticPorts', diagnosticPortsGroup, 'Equatorial and vertical access ports.', 'Steel/Glass', 'Houses lasers, microwave interferometers, and neutron cameras.', 7, ['VacuumVessel'], 'Loss of plasma monitoring capabilities.', ['Control system failure'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Explode radially

    // 8. Cryogenic Cooling Lines
    const cryoLinesGroup = new THREE.Group();
    const cryoLineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(18, -15, 18),
        new THREE.Vector3(19, 0, 19),
        new THREE.Vector3(18, 15, -18),
        new THREE.Vector3(-18, 15, 18),
        new THREE.Vector3(-19, 0, -19),
        new THREE.Vector3(18, -15, 18)
    ]);
    const cryoLineGeo = new THREE.TubeGeometry(cryoLineCurve, 200, 0.4, 16, true);
    
    for (let i = 0; i < 4; i++) {
        const cryoLine = new THREE.Mesh(cryoLineGeo, chrome);
        cryoLine.rotation.y = (i * Math.PI) / 2;
        cryoLinesGroup.add(cryoLine);
    }
    
    addPart('CryogenicCoolingLines', cryoLinesGroup, 'Liquid helium distribution network.', 'Stainless Steel/Titanium', 'Cools the superconducting magnets to 4 Kelvin.', 8, ['ToroidalFieldCoils', 'PoloidalFieldCoils'], 'Magnet warming, quench, and catastrophic energy release.', ['Explosive coolant boil-off', 'Structural damage'], {x:0, y:0, z:0}, {x:0, y:-60, z:0});

    // 9. Neutral Beam Injectors (Heating)
    const nbiGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        
        const nbiChamberGeo = new THREE.CylinderGeometry(2, 3, 15, 32);
        const nbiChamber = new THREE.Mesh(nbiChamberGeo, aluminum);
        
        const nbiX = 22 * Math.cos(angle);
        const nbiZ = 22 * Math.sin(angle);
        
        nbiChamber.position.set(nbiX, 0, nbiZ);
        nbiChamber.lookAt(0, 0, 0);
        nbiChamber.rotation.x = Math.PI / 2;
        
        // Add high-tech glowing injector beam
        const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 15.1, 16);
        const beam = new THREE.Mesh(beamGeo, neonBlueMaterial);
        beam.position.copy(nbiChamber.position);
        beam.rotation.copy(nbiChamber.rotation);
        
        nbiGroup.add(nbiChamber);
        nbiGroup.add(beam);
    }
    
    addPart('NeutralBeamInjectors', nbiGroup, 'Particle accelerators injecting high-energy neutrals.', 'Composite', 'Provides auxiliary heating to reach fusion temperatures.', 9, ['VacuumVessel', 'DiagnosticPorts'], 'Inability to reach ignition temperature.', ['Plasma decay'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Explodes radially

    // 10. Cryostat (Outer Shell)
    const cryostatGroup = new THREE.Group();
    const cryoShellGeo = new THREE.CylinderGeometry(26, 26, 40, 64, 1, true);
    const cryoShell = new THREE.Mesh(cryoShellGeo, cryostatMaterial);
    
    const cryoBaseGeo = new THREE.CylinderGeometry(26, 26, 2, 64);
    const cryoBase = new THREE.Mesh(cryoBaseGeo, steel);
    cryoBase.position.y = -21;
    
    const cryoLidGeo = new THREE.CylinderGeometry(26, 26, 2, 64);
    const cryoLid = new THREE.Mesh(cryoLidGeo, steel);
    cryoLid.position.y = 21;
    
    cryostatGroup.add(cryoShell);
    cryostatGroup.add(cryoBase);
    cryostatGroup.add(cryoLid);
    
    addPart('Cryostat', cryostatGroup, 'Massive vacuum vessel enclosing the entire magnet system.', 'Stainless Steel', 'Provides secondary vacuum and thermal insulation for cryogenic components.', 10, ['SupportStructure'], 'Massive thermal leak, inability to cool magnets.', ['Complete system failure'], {x:0, y:0, z:0}, {x:0, y:70, z:0});

    // 11. Support Structure (Trusses)
    const supportGroup = new THREE.Group();
    const trussMaterial = new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.7, roughness: 0.5, wireframe: true});
    const trussGeo = new THREE.CylinderGeometry(25, 25, 38, 16, 8);
    const truss = new THREE.Mesh(trussGeo, trussMaterial);
    supportGroup.add(truss);
    
    // Solid base pillars
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(1, 1.5, 20, 16);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel);
        pillar.position.set(20 * Math.cos(angle), -30, 20 * Math.sin(angle));
        supportGroup.add(pillar);
    }

    addPart('SupportStructure', supportGroup, 'Immense structural framework.', 'Reinforced Concrete/Steel', 'Bears the massive weight and extreme electromagnetic forces of the reactor.', 11, ['Cryostat', 'ToroidalFieldCoils'], 'Catastrophic mechanical collapse.', ['Complete reactor destruction'], {x:0, y:0, z:0}, {x:0, y:-80, z:0});

    // 12. Blanket Modules
    const blanketGroup = new THREE.Group();
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const blanketGeo = new THREE.BoxGeometry(2, 6, 2);
        const blanket = new THREE.Mesh(blanketGeo, new THREE.MeshStandardMaterial({color: 0xaaaaaa, roughness: 0.2, metalness: 0.9}));
        blanket.position.set(8.5 * Math.cos(angle), 0, 8.5 * Math.sin(angle));
        blanket.lookAt(0, 0, 0);
        blanketGroup.add(blanket);
    }
    
    addPart('BlanketModules', blanketGroup, 'Thick inner wall shielding.', 'Lithium/Beryllium', 'Absorbs high-energy neutrons, breeds tritium fuel, and extracts heat.', 12, ['VacuumVessel'], 'Neutron irradiation of structural components.', ['Magnet degradation', 'Loss of tritium breeding'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Radial explode

    // 13. Ion Cyclotron Resonance Heating (ICRH) Antennae
    const icrhGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        const antennaGeo = new THREE.BoxGeometry(4, 4, 1);
        const antenna = new THREE.Mesh(antennaGeo, copper);
        antenna.position.set(11 * Math.cos(angle), 0, 11 * Math.sin(angle));
        antenna.lookAt(0,0,0);
        
        // Add glowing radio waves representation
        const waveGeo = new THREE.TorusGeometry(2, 0.1, 8, 32, Math.PI);
        const wave = new THREE.Mesh(waveGeo, neonBlueMaterial);
        wave.rotation.x = Math.PI/2;
        antenna.add(wave);
        
        icrhGroup.add(antenna);
    }
    
    addPart('ICRHAntennae', icrhGroup, 'High-power radio frequency emitters.', 'Copper/Ceramic', 'Heats the plasma ions directly using resonant radio waves.', 13, ['VacuumVessel', 'PlasmaTorus'], 'Reduced ion heating, ignition failure.', ['Sub-optimal plasma performance'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Radial explode

    // 14. Electron Cyclotron Resonance Heating (ECRH) Waveguides
    const ecrhGroup = new THREE.Group();
    const ecrhGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,0,0), new THREE.Vector3(0,5,5), new THREE.Vector3(0,10,15)
    ]), 64, 0.3, 16, false);
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const wg = new THREE.Mesh(ecrhGeo, chrome);
        wg.position.set(12 * Math.cos(angle), 5, 12 * Math.sin(angle));
        wg.lookAt(0,0,0);
        ecrhGroup.add(wg);
    }
    addPart('ECRHWaveguides', ecrhGroup, 'Microwave transmission lines.', 'Copper/Gold plated', 'Injects highly focused microwaves to heat electrons and drive current.', 14, ['DiagnosticPorts'], 'Loss of localized plasma current drive.', ['Tearing modes, plasma instability'], {x:0, y:0, z:0}, {x:0, y:80, z:0});

    // 15. Control Data Relays (Glowing Panels)
    const relaysGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const relayGeo = new THREE.BoxGeometry(1.5, 3, 0.2);
        const relay = new THREE.Mesh(relayGeo, new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.8}));
        relay.position.set(25.5 * Math.cos(angle), 15, 25.5 * Math.sin(angle));
        relay.lookAt(0, 15, 0);
        relaysGroup.add(relay);
    }
    addPart('ControlRelays', relaysGroup, 'Optical data transceivers.', 'Silicon/Glass', 'Transmits gigabytes of diagnostic data per second to the control room.', 15, ['Cryostat', 'DiagnosticPorts'], 'Loss of real-time control capability.', ['Automated emergency shutdown'], {x:0, y:0, z:0}, {x:0, y:0, z:0}); // Radial explode

    // Set radial explosions
    const radialParts = ['ToroidalFieldCoils', 'DiagnosticPorts', 'NeutralBeamInjectors', 'BlanketModules', 'ICRHAntennae', 'ControlRelays'];
    radialParts.forEach(name => {
        const mesh = meshes[name];
        mesh.children.forEach((child, index) => {
            if(child.type === "Mesh" || child.type === "Group") {
                 // Calculate a radial outward vector based on position
                 const outDir = new THREE.Vector3(child.position.x, 0, child.position.z).normalize().multiplyScalar(40);
                 if (outDir.lengthSq() === 0) {
                     // If at center, explode along random XZ
                     const angle = (index / mesh.children.length) * Math.PI * 2;
                     outDir.set(Math.cos(angle)*40, 0, Math.sin(angle)*40);
                 }
                 child.userData.radialExplodeDir = outDir;
            }
        });
    });

    const description = "The Plasma Physics Tokamak Reactor is the pinnacle of human engineering, designed to harness the power of the stars. It utilizes a massive torus-shaped vacuum vessel surrounded by ultra-powerful superconducting magnetic coils. These magnets confine and shape a 150-million-degree Deuterium-Tritium plasma, driving it to fusion conditions. It features extensive auxiliary heating systems, complex cryogenics, and precise diagnostic arrays, representing the ultimate high-tech, multi-functional machine.";

    const quizQuestions = [
        {
            question: "Which component is primarily responsible for inducing the ohmic heating and driving the central plasma current?",
            options: ["Toroidal Field Coils", "Central Solenoid", "Divertor", "Cryostat"],
            correctAnswer: 1,
            explanation: "The Central Solenoid acts as the primary transformer core, driving the central plasma current and providing initial ohmic heating."
        },
        {
            question: "What is the function of the Divertor?",
            options: ["To heat the electrons using microwaves", "To generate the toroidal magnetic field", "To extract heat and helium ash from the reaction", "To breed tritium fuel"],
            correctAnswer: 2,
            explanation: "The Divertor is located at the bottom of the vacuum vessel and is designed to exhaust heat and helium ash produced by the fusion reactions."
        },
        {
            question: "Which magnetic coils form the massive D-shaped structures around the vacuum vessel?",
            options: ["Poloidal Field Coils", "Central Solenoid", "Toroidal Field Coils", "ICRH Antennae"],
            correctAnswer: 2,
            explanation: "The Toroidal Field Coils are the massive D-shaped superconducting magnets that generate the primary magnetic field to confine the plasma."
        },
        {
            question: "What is the primary purpose of the Blanket Modules lining the inner wall?",
            options: ["To cool the superconducting magnets", "To absorb high-energy neutrons and breed tritium", "To inject high-energy neutral particles", "To emit microwave radiation"],
            correctAnswer: 1,
            explanation: "Blanket Modules absorb the kinetic energy of fusion neutrons, turning it into heat for electricity generation, and breed necessary tritium fuel using lithium."
        },
        {
            question: "At what temperature does the Cryogenic Cooling System maintain the superconducting magnets?",
            options: ["Room Temperature (293 K)", "Liquid Nitrogen (77 K)", "Liquid Helium (4 K)", "Absolute Zero (0 K)"],
            correctAnswer: 2,
            explanation: "The massive superconducting magnets require liquid helium cooling to reach ~4 Kelvin, making them superconductive and capable of carrying massive currents with zero electrical resistance."
        }
    ];

    function animate(time, speed, explodedness) {
        // Core plasma pulsation
        if (meshes['PlasmaTorus']) {
             const plasmaCore = meshes['PlasmaTorus'].children[0];
             const plasmaFlow = meshes['PlasmaTorus'].children[1];
             
             // Pulse emission
             const pulse = Math.sin(time * speed * 2) * 0.5 + 3.5;
             plasmaCore.material.emissiveIntensity = pulse;
             
             // Rotate inner flow
             plasmaFlow.rotation.z -= speed * 0.05;
             plasmaFlow.material.opacity = Math.sin(time * speed * 5) * 0.2 + 0.6;
        }

        // Magnetic Field Coils visual effects
        if (meshes['ToroidalFieldCoils']) {
            meshes['ToroidalFieldCoils'].children.forEach((coilGroup) => {
                 // Animate the glowing wrappers
                 coilGroup.children.forEach(wrap => {
                     if (wrap.material === neonBlueMaterial) {
                         wrap.rotation.x += speed * 0.1;
                         wrap.material.emissiveIntensity = Math.abs(Math.sin(time * speed + wrap.position.x)) * 2 + 1;
                     }
                 });
            });
        }

        // ICRH Wave emission animation
        if (meshes['ICRHAntennae']) {
             meshes['ICRHAntennae'].children.forEach(antenna => {
                 if (antenna.children.length > 0) {
                     const wave = antenna.children[0];
                     wave.scale.set(1 + Math.sin(time * speed * 8)*0.2, 1 + Math.sin(time * speed * 8)*0.2, 1);
                     wave.material.emissiveIntensity = Math.max(0, Math.sin(time * speed * 8)) * 3;
                 }
             });
        }

        // Neutral Beam Injectors glowing beam pulse
        if (meshes['NeutralBeamInjectors']) {
            meshes['NeutralBeamInjectors'].children.forEach(child => {
                if(child.material === neonBlueMaterial) {
                     child.scale.x = 1 + Math.sin(time * speed * 10) * 0.1;
                     child.scale.z = 1 + Math.sin(time * speed * 10) * 0.1;
                }
            });
        }

        // Control Relays blinking data transmission
        if (meshes['ControlRelays']) {
            meshes['ControlRelays'].children.forEach((relay, i) => {
                const blink = (Math.sin(time * speed * 15 + i) > 0) ? 1.0 : 0.2;
                relay.material.emissiveIntensity = blink;
            });
        }

        // Handle generic positional explosion
        Object.keys(meshes).forEach(name => {
            const mesh = meshes[name];
            
            // Special handling for radial explosion parts
            if (radialParts.includes(name)) {
                mesh.children.forEach(child => {
                    if (child.userData.radialExplodeDir) {
                        const origPos = new THREE.Vector3(0,0,0); // Group is origin, children have their own offsets
                        // child.position was set during creation. We must treat that as original
                        if (!child.userData.origPosCache) {
                            child.userData.origPosCache = child.position.clone();
                        }
                        
                        const targetPos = child.userData.origPosCache.clone().add(child.userData.radialExplodeDir);
                        child.position.lerpVectors(child.userData.origPosCache, targetPos, explodedness);
                    }
                });
            } else {
                // Standard linear explosion for the whole group
                const orig = mesh.userData.originalPosition;
                const expl = mesh.userData.explodedPosition;
                if (orig && expl) {
                    mesh.position.lerpVectors(orig, expl, explodedness);
                }
            }
            
            // Cryostat shell transparency based on explodedness for visibility
            if (name === 'Cryostat') {
                const shell = mesh.children[0];
                shell.material.opacity = 0.3 - (explodedness * 0.2); // Becomes almost invisible when exploded
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTokamak() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
