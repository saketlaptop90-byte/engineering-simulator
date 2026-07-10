import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const supercooledMirror = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.01,
        envMapIntensity: 3.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });

    const cryogenicGold = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 1.5
    });

    const nbTiSuperconductor = new THREE.MeshStandardMaterial({
        color: 0x8899a6,
        metalness: 0.8,
        roughness: 0.4,
        wireframe: false
    });

    const glowingPhoton = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingNeon = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8
    });

    const sapphireDielectric = new THREE.MeshPhysicalMaterial({
        color: 0xaaccff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.76,
        transparent: true
    });

    const plasmaMat = new THREE.MeshBasicMaterial({
        color: 0xaa00ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRY
    // ==========================================
    function createFlangedCylinder(radius, height, thickness, flangeWidth, boltCount, material) {
        const obj = new THREE.Group();
        
        // Main cylinder
        const cylGeom = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
        const cyl = new THREE.Mesh(cylGeom, material);
        obj.add(cyl);

        // Top and Bottom Flanges
        const flangeGeom = new THREE.RingGeometry(radius, radius + flangeWidth, 64);
        const topFlange = new THREE.Mesh(flangeGeom, material);
        topFlange.rotation.x = -Math.PI / 2;
        topFlange.position.y = height / 2;
        
        const bottomFlange = new THREE.Mesh(flangeGeom, material);
        bottomFlange.rotation.x = Math.PI / 2;
        bottomFlange.position.y = -height / 2;

        obj.add(topFlange);
        obj.add(bottomFlange);

        // Bolts
        const boltGeom = new THREE.CylinderGeometry(thickness*0.3, thickness*0.3, thickness*1.5, 16);
        for(let i = 0; i < boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const bx = Math.cos(angle) * (radius + flangeWidth/2);
            const bz = Math.sin(angle) * (radius + flangeWidth/2);
            
            const topBolt = new THREE.Mesh(boltGeom, darkSteel);
            topBolt.position.set(bx, height/2, bz);
            obj.add(topBolt);

            const botBolt = new THREE.Mesh(boltGeom, darkSteel);
            botBolt.position.set(bx, -height/2, bz);
            obj.add(botBolt);
        }
        return obj;
    }

    function createCryoPipes(count, radius, height, helixFrequency, material) {
        const pipeGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const path = new THREE.CurvePath();
            const phase = (i / count) * Math.PI * 2;
            
            class HelixCurve extends THREE.Curve {
                getPoint(t, optionalTarget = new THREE.Vector3()) {
                    const y = (t - 0.5) * height;
                    const r = radius;
                    const theta = t * Math.PI * 2 * helixFrequency + phase;
                    const x = Math.cos(theta) * r;
                    const z = Math.sin(theta) * r;
                    return optionalTarget.set(x, y, z);
                }
            }
            
            const geom = new THREE.TubeGeometry(new HelixCurve(), 200, 0.05, 8, false);
            const mesh = new THREE.Mesh(geom, material);
            pipeGroup.add(mesh);
        }
        return pipeGroup;
    }

    function createWireHarness(startPoint, endPoint, controlPoints, thickness, material) {
        const curve = new THREE.CatmullRomCurve3([startPoint, ...controlPoints, endPoint]);
        const geom = new THREE.TubeGeometry(curve, 64, thickness, 8, false);
        return new THREE.Mesh(geom, material);
    }

    function createGear(radius, teeth, thickness, material) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.8;
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : innerRadius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        
        const hole = new THREE.Path();
        hole.absarc(0, 0, radius * 0.3, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        const geom = new THREE.ExtrudeGeometry(shape, {
            depth: thickness,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.02
        });
        const mesh = new THREE.Mesh(geom, material);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    // ==========================================
    // 1. OUTER VACUUM VESSEL (OVC)
    // ==========================================
    const ovcGroup = createFlangedCylinder(4, 12, 0.2, 0.5, 72, steel);
    ovcGroup.position.y = 0;
    group.add(ovcGroup);
    
    parts.push({
        name: "Outer Vacuum Chamber (OVC)",
        description: "A colossal stainless steel pressure vessel. It isolates the internal cryogenic stages from room temperature via extreme high vacuum (10^-9 mbar).",
        material: "Stainless Steel 316LN",
        function: "Thermal and atmospheric isolation.",
        assemblyOrder: 1,
        connections: ["Atmosphere", "Liquid Nitrogen Shield"],
        failureEffect: "Catastrophic thermal leak; internal temperatures rapidly rise, destroying superconductivity.",
        cascadeFailures: ["Superconducting Magnet Quench", "Cavity Thermal Noise Spike"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // ==========================================
    // 2. LIQUID NITROGEN SHIELD (77K)
    // ==========================================
    const ln2Shield = createFlangedCylinder(3.5, 11, 0.1, 0.3, 36, aluminum);
    group.add(ln2Shield);

    parts.push({
        name: "Liquid Nitrogen Thermal Shield",
        description: "Highly polished aluminum shield actively cooled by liquid nitrogen to 77K. Intercepts blackbody radiation from the OVC.",
        material: "Polished Aluminum",
        function: "Radiative heat shielding.",
        assemblyOrder: 2,
        connections: ["OVC", "Liquid Helium Shield", "LN2 Piping"],
        failureEffect: "Increased heat load on the 4K stage, boiling off liquid helium reserves.",
        cascadeFailures: ["Helium Depletion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // ==========================================
    // 3. LIQUID HELIUM SHIELD (4K)
    // ==========================================
    const lheShield = createFlangedCylinder(3.0, 10, 0.1, 0.2, 24, copper);
    group.add(lheShield);

    parts.push({
        name: "Liquid Helium Thermal Shield",
        description: "An OFHC (Oxygen-Free High Thermal Conductivity) copper shield cooled to 4K. Protects the magnet and dilution refrigerator from 77K radiation.",
        material: "OFHC Copper",
        function: "Deep cryogenic thermal shielding.",
        assemblyOrder: 3,
        connections: ["LN2 Shield", "Magnet Support", "LHe Piping"],
        failureEffect: "Magnet quench due to thermal overload.",
        cascadeFailures: ["Magnet Quench", "Explosive Helium Boil-off"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // ==========================================
    // 4. SUPERCONDUCTING 20-TESLA MAGNET
    // ==========================================
    const magnetGroup = new THREE.Group();
    // Magnet bobbin
    const bobbin = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 8, 64, 1, true), darkSteel);
    magnetGroup.add(bobbin);
    
    // Coil windings (represented by stacked toruses for extreme detail)
    const coils = new THREE.Group();
    const numCoils = 150;
    for(let i=0; i<numCoils; i++) {
        const coilGeom = new THREE.TorusGeometry(2.5, 0.04, 8, 128);
        const coilMesh = new THREE.Mesh(coilGeom, nbTiSuperconductor);
        coilMesh.rotation.x = Math.PI/2;
        coilMesh.position.y = -3.9 + (i * (7.8 / numCoils));
        coils.add(coilMesh);
    }
    magnetGroup.add(coils);
    
    // Magnet banding / reinforcement
    for(let i=0; i<8; i++) {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.6, 0.5, 64), steel);
        band.position.y = -3.5 + i;
        magnetGroup.add(band);
    }
    group.add(magnetGroup);

    parts.push({
        name: "20-Tesla Superconducting Solenoid",
        description: "A massive multi-coil Niobium-Tin (Nb3Sn) superconducting magnet. Provides the intense transverse magnetic field required to convert axions into microwave photons via the Primakoff effect.",
        material: "Nb3Sn / Cu / Steel",
        function: "Generates massive magnetic field for Primakoff conversion.",
        assemblyOrder: 4,
        connections: ["4K Shield", "Dilution Refrigerator"],
        failureEffect: "Quench! Huge release of stored electromagnetic energy (Gigajoules), vaporizing cryogens instantly.",
        cascadeFailures: ["Rupture Disks Blown", "Complete System Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // ==========================================
    // 5. DILUTION REFRIGERATOR (1K, 100mK, 10mK STAGES)
    // ==========================================
    const drGroup = new THREE.Group();
    drGroup.position.y = 4;
    
    // 1K Plate
    const plate1K = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.1, 32), cryogenicGold);
    plate1K.position.y = 0;
    drGroup.add(plate1K);
    
    // 100mK Plate
    const plate100mK = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32), cryogenicGold);
    plate100mK.position.y = -1;
    drGroup.add(plate100mK);
    
    // 10mK Mixing Chamber
    const mixChamber = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.3, 32), cryogenicGold);
    mixChamber.position.y = -2;
    drGroup.add(mixChamber);

    // Heat Exchangers (spiral tubes)
    const hex1 = createCryoPipes(6, 1.7, 1, 3, copper);
    hex1.position.y = -0.5;
    drGroup.add(hex1);
    
    const hex2 = createCryoPipes(12, 1.2, 1, 5, copper);
    hex2.position.y = -1.5;
    drGroup.add(hex2);

    // Support pillars
    const pillarGeom = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    for(let i=0; i<4; i++) {
        const x = Math.cos(i * Math.PI/2) * 1.2;
        const z = Math.sin(i * Math.PI/2) * 1.2;
        const p1 = new THREE.Mesh(pillarGeom, darkSteel);
        p1.position.set(x, -0.5, z);
        drGroup.add(p1);
        
        const px = Math.cos(i * Math.PI/2) * 0.8;
        const pz = Math.sin(i * Math.PI/2) * 0.8;
        const p2 = new THREE.Mesh(pillarGeom, darkSteel);
        p2.position.set(px, -1.5, pz);
        drGroup.add(p2);
    }
    group.add(drGroup);

    parts.push({
        name: "He3/He4 Dilution Refrigerator",
        description: "Circulates a mixture of Helium-3 and Helium-4. Phase separation across the mixing boundary absorbs heat, chilling the cavity down to ~10 milliKelvin to eliminate thermal microwave noise.",
        material: "Gold-plated OFHC Copper / Stainless Steel",
        function: "Ultra-low temperature cooling.",
        assemblyOrder: 5,
        connections: ["Mixing Chamber", "Resonant Cavity", "Pumping Lines"],
        failureEffect: "Loss of base temperature. Cavity floods with thermal blackbody photons, masking the axion signal.",
        cascadeFailures: ["Detector Blindness"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 8 }
    });

    // ==========================================
    // 6. RESONANT MICROWAVE CAVITY (THE DETECTOR)
    // ==========================================
    const cavityGroup = new THREE.Group();
    cavityGroup.position.y = -2;
    
    // The main barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 6, 64, 1, true), supercooledMirror);
    // Add end caps
    const capGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 64);
    const topCap = new THREE.Mesh(capGeom, supercooledMirror);
    topCap.position.y = 3;
    const botCap = new THREE.Mesh(capGeom, supercooledMirror);
    botCap.position.y = -3;
    
    cavityGroup.add(barrel);
    cavityGroup.add(topCap);
    cavityGroup.add(botCap);

    // Inner tuning rod mechanism
    const tuningRodGeom = new THREE.CylinderGeometry(0.2, 0.2, 5.8, 32);
    const tuningRod1 = new THREE.Mesh(tuningRodGeom, sapphireDielectric);
    tuningRod1.position.set(0.5, 0, 0);
    cavityGroup.add(tuningRod1);
    
    const tuningRod2 = new THREE.Mesh(tuningRodGeom, sapphireDielectric);
    tuningRod2.position.set(-0.5, 0, 0);
    cavityGroup.add(tuningRod2);

    group.add(cavityGroup);

    parts.push({
        name: "High-Q Resonant Microwave Cavity",
        description: "A flawless, supercooled, oxygen-free copper cylinder plated with superconducting NbTi and mirror-polished. It resonates at specific microwave frequencies. When an axion converts in the magnetic field, a photon is deposited in the cavity.",
        material: "Superconducting NbTi / Sapphire",
        function: "Traps and resonates axion-induced photons.",
        assemblyOrder: 6,
        connections: ["Dilution Refrigerator", "Tuning Rods", "SQUID Antenna"],
        failureEffect: "Loss of quality factor (Q). Photons dissipate instantly.",
        cascadeFailures: ["Zero Signal Conversion"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 12 }
    });

    // ==========================================
    // 7. PRECISION TUNING MECHANISM
    // ==========================================
    const tuningMechGroup = new THREE.Group();
    tuningMechGroup.position.y = 1.5;
    
    // Gears to rotate the rods
    const gear1 = createGear(0.4, 20, 0.1, chrome);
    gear1.position.set(0.5, 0, 0);
    tuningMechGroup.add(gear1);
    
    const gear2 = createGear(0.4, 20, 0.1, chrome);
    gear2.position.set(-0.5, 0, 0);
    tuningMechGroup.add(gear2);
    
    const driveGear = createGear(0.2, 10, 0.1, steel);
    driveGear.position.set(0, 0, 0.6);
    tuningMechGroup.add(driveGear);

    // Drive shaft extending upwards
    const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 16), steel);
    driveShaft.position.set(0, 4, 0.6);
    tuningMechGroup.add(driveShaft);

    group.add(tuningMechGroup);

    parts.push({
        name: "Piezoelectric Tuning Mechanism",
        description: "Rotates the sapphire dielectric tuning rods inside the cavity with sub-nanometer precision to scan through the axion mass frequency space.",
        material: "Cryogenic Chrome / Titanium",
        function: "Adjusts resonant frequency of cavity.",
        assemblyOrder: 7,
        connections: ["Tuning Rods", "Room Temp Drive Motor"],
        failureEffect: "Inability to scan frequencies; stuck at one hypothetical axion mass.",
        cascadeFailures: ["Experiment Stagnation"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 8, y: 1.5, z: 0 }
    });

    // ==========================================
    // 8. SQUID QUANTUM AMPLIFIERS
    // ==========================================
    const squidGroup = new THREE.Group();
    squidGroup.position.set(0, 1.2, -0.8);
    
    // Antenna inserted into cavity
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), copper);
    antenna.position.set(0, -0.25, 0);
    squidGroup.add(antenna);
    
    // SQUID Box
    const squidBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), cryogenicGold);
    squidBox.position.set(0, 0.1, 0);
    squidGroup.add(squidBox);
    
    // Wiring
    const coax = createWireHarness(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 6, -1.5), [new THREE.Vector3(0, 2, -1), new THREE.Vector3(1, 4, -1)], 0.03, copper);
    squidGroup.add(coax);

    group.add(squidGroup);

    parts.push({
        name: "SQUID Quantum Amplifier Array",
        description: "Superconducting QUantum Interference Device. Operates near the Standard Quantum Limit. Extracts the Yoctowatt (10^-24 W) photon signal from the cavity and amplifies it without adding thermal noise.",
        material: "Josephson Junctions / Niobium",
        function: "Ultra-low noise microwave amplification.",
        assemblyOrder: 8,
        connections: ["Cavity Antenna", "Coaxial Output", "10mK Plate"],
        failureEffect: "Amplifier saturation. True axion signals lost in noise floor.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 1.2, z: -0.8 },
        explodedPosition: { x: 0, y: 1.2, z: -8 }
    });

    // ==========================================
    // 9. DATA ACQUISITION & CONTROL RACKS
    // ==========================================
    const daqGroup = new THREE.Group();
    daqGroup.position.set(-6, 0, 6);
    
    // Main Rack Body
    const rack = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), darkSteel);
    rack.position.y = 3;
    daqGroup.add(rack);
    
    // Blinking lights and panels
    const panelGeom = new THREE.PlaneGeometry(1.8, 1);
    for(let i=0; i<4; i++) {
        const panel = new THREE.Mesh(panelGeom, tinted);
        panel.position.set(0, 1.5 + i*1.2, 1.01);
        
        // Add random LED blips to panels
        for(let j=0; j<10; j++) {
            const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), glowingPhoton);
            led.position.set(-0.8 + Math.random()*1.6, -0.4 + Math.random()*0.8, 0.02);
            led.userData.blinkOffset = Math.random() * Math.PI * 2;
            led.userData.blinkSpeed = 2 + Math.random() * 5;
            panel.add(led);
        }
        daqGroup.add(panel);
    }
    group.add(daqGroup);

    parts.push({
        name: "DAQ & FPGA Control Rack",
        description: "High-speed digitizers and FPGA processors capturing the amplified RF signal. Runs Fast Fourier Transforms (FFT) in real-time to look for the tiny spectral peak of an axion.",
        material: "Silicon / Steel / PCB",
        function: "Data digitization and analysis.",
        assemblyOrder: 9,
        connections: ["SQUID Coax", "Tuning Controller", "Cryo Sensors"],
        failureEffect: "Data stream corruption. Potential axion detection events missed.",
        cascadeFailures: [],
        originalPosition: { x: -6, y: 0, z: 6 },
        explodedPosition: { x: -12, y: 0, z: 12 }
    });

    // ==========================================
    // 10. HYDRAULIC & CRYO PUMPING LINES
    // ==========================================
    const pumpGroup = new THREE.Group();
    const mainPumpTube = createWireHarness(new THREE.Vector3(0, 6, 0), new THREE.Vector3(5, -2, -5), [new THREE.Vector3(3, 8, -2), new THREE.Vector3(6, 4, -4)], 0.3, steel);
    pumpGroup.add(mainPumpTube);

    // Add a massive turbo molecular pump at the end
    const turboPump = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), chrome);
    turboPump.position.set(5, -3, -5);
    pumpGroup.add(turboPump);
    group.add(pumpGroup);

    parts.push({
        name: "Turbo-Molecular Vacuum Pump",
        description: "Spins at 90,000 RPM to evacuate the OVC, maintaining an extreme vacuum. Essential for cryogenic insulation.",
        material: "Titanium Blades / Steel",
        function: "Maintains high vacuum.",
        assemblyOrder: 10,
        connections: ["OVC Pumping Port"],
        failureEffect: "Vacuum degradation. Cryogens boil off rapidly due to convective heating.",
        cascadeFailures: ["Thermal Catastrophe"],
        originalPosition: { x: 5, y: -3, z: -5 },
        explodedPosition: { x: 12, y: -3, z: -12 }
    });

    // ==========================================
    // 11. MAGNETIC FIELD VISUALIZER (COMPLEX ANIMATION)
    // ==========================================
    // We will create hundreds of curved lines to represent the 20T B-field
    const bFieldGroup = new THREE.Group();
    const bLines = [];
    const numLines = 200;
    
    for (let i = 0; i < numLines; i++) {
        const phi = Math.random() * Math.PI * 2;
        const r0 = 0.5 + Math.random() * 1.5;
        
        const curve = new THREE.CurvePath();
        class BFieldCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Dipole-like field shape within the solenoid
                const z = (t - 0.5) * 16;
                // Field flares out at ends
                const r = r0 * (1 + 0.5 * Math.pow(Math.abs(z)/6, 3));
                const x = r * Math.cos(phi);
                const y = r * Math.sin(phi);
                return optionalTarget.set(x, z, y);
            }
        }
        
        const lineGeom = new THREE.TubeGeometry(new BFieldCurve(), 64, 0.02, 4, false);
        const lineMesh = new THREE.Mesh(lineGeom, plasmaMat);
        lineMesh.rotation.x = Math.PI / 2; // align with Y axis
        // custom property for animation
        lineMesh.userData = {
            baseOpacity: 0.1 + Math.random() * 0.4,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 1 + Math.random() * 3
        };
        bFieldGroup.add(lineMesh);
        bLines.push(lineMesh);
    }
    group.add(bFieldGroup);

    parts.push({
        name: "Magnetic Field Lines (20-Tesla)",
        description: "Visual representation of the intense magnetic flux. Axions interact with these virtual photons to convert into real microwave photons.",
        material: "Quantum Flux (Visualization)",
        function: "Provides the interaction field for the Primakoff effect.",
        assemblyOrder: 11,
        connections: ["Magnet Coils"],
        failureEffect: "No magnetic field = No axion conversion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 12. AXION & PHOTON PARTICLE SYSTEM
    // ==========================================
    const particleGroup = new THREE.Group();
    
    // Axions streaming downwards (invisible dark matter)
    const axionCount = 300;
    const axionGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const axionInstanced = new THREE.InstancedMesh(axionGeo, axionMat, axionCount);
    
    const dummy = new THREE.Object3D();
    const axionData = [];
    for(let i=0; i<axionCount; i++) {
        axionData.push({
            x: -2 + Math.random() * 4,
            y: 10 + Math.random() * 20,
            z: -2 + Math.random() * 4,
            speed: 5 + Math.random() * 5
        });
    }
    particleGroup.add(axionInstanced);

    // Photons inside the cavity (very rare spawns)
    const photonCount = 10;
    const photonGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const photonInstanced = new THREE.InstancedMesh(photonGeo, glowingPhoton, photonCount);
    
    const photonData = [];
    for(let i=0; i<photonCount; i++) {
        photonData.push({
            active: false,
            x: 0, y: 0, z: 0,
            life: 0
        });
        // hide initially
        dummy.position.set(999, 999, 999);
        dummy.updateMatrix();
        photonInstanced.setMatrixAt(i, dummy.matrix);
    }
    photonInstanced.instanceMatrix.needsUpdate = true;
    particleGroup.add(photonInstanced);

    group.add(particleGroup);

    parts.push({
        name: "Axion-Photon Conversion Event",
        description: "Rare instances where a theoretical Axion interacts with the B-field inside the cavity, emitting a microwave photon.",
        material: "Energy (Visualization)",
        function: "The fundamental interaction this machine is designed to observe.",
        assemblyOrder: 12,
        connections: ["Cavity", "B-Field", "SQUID"],
        failureEffect: "Standard Model remains incomplete.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Primakoff effect used in haloscopes, the rate of axion-to-photon conversion is proportional to which properties of the magnetic field and cavity?",
            options: [
                "B-field squared, cavity volume, and cavity Quality factor (Q)",
                "B-field linearly, cavity length, and temperature",
                "Magnetic flux quantum, cavity radius squared",
                "B-field cubed, SQUID noise temperature"
            ],
            correctAnswer: 0,
            explanation: "The conversion power is proportional to B^2 * V * C * Q, where B is the magnetic field, V is volume, C is a mode form factor, and Q is the loaded quality factor."
        },
        {
            question: "Why is a dilution refrigerator required to cool the cavity to ~10 mK, rather than just using liquid helium at 4.2 K?",
            options: [
                "To make the copper cavity superconducting.",
                "To reduce the thermal (blackbody) photon population in the microwave regime below the expected axion signal.",
                "To increase the speed of the axions passing through.",
                "To prevent the 20-Tesla magnet from quenching."
            ],
            correctAnswer: 1,
            explanation: "At microwave frequencies (~GHz), the thermal blackbody noise at 4.2K is much larger than the expected axion signal (10^-24 W). Cooling to 10mK exponentially suppresses this thermal photon noise."
        },
        {
            question: "What is the purpose of the dielectric sapphire rods inside the cylindrical resonant cavity?",
            options: [
                "To generate the magnetic field.",
                "To absorb cosmic ray muons.",
                "To tune the resonant frequency of the cavity by altering the effective permittivity of the volume.",
                "To amplify the signal before it reaches the SQUID."
            ],
            correctAnswer: 2,
            explanation: "By moving dielectric rods (like sapphire) laterally within the cavity, the electromagnetic field distribution and the effective permittivity change, thereby smoothly shifting the resonant frequency to scan for unknown axion masses."
        },
        {
            question: "What defines the 'Standard Quantum Limit' (SQL) for a linear amplifier, such as the SQUID used in this detector?",
            options: [
                "The maximum voltage it can output.",
                "The minimum noise added by the amplifier, constrained by Heisenberg's Uncertainty Principle (half a photon quantum per mode).",
                "The lowest temperature the SQUID can operate at without going normal.",
                "The maximum frequency it can amplify."
            ],
            correctAnswer: 1,
            explanation: "Quantum mechanics dictates that any linear phase-preserving amplifier must add noise equivalent to at least half a photon per mode (hf/2), known as the Standard Quantum Limit."
        },
        {
            question: "If the axion mass is exactly 4.135 micro-eV, what is the expected frequency of the converted microwave photon?",
            options: [
                "1 GHz",
                "10 GHz",
                "100 MHz",
                "4.135 GHz"
            ],
            correctAnswer: 0,
            explanation: "Using E=hf, where h = 4.135 x 10^-15 eV*s. f = E/h = (4.135 x 10^-6 eV) / (4.135 x 10^-15 eV*s) = 10^9 Hz = 1 GHz. The photon frequency directly maps to the axion mass."
        }
    ];

    // ==========================================
    // HIGHLY COMPLEX ANIMATION LOGIC
    // ==========================================
    function animate(time, speed, meshes) {
        const t = time * speed;

        // 1. Rotate the tuning mechanism gears
        gear1.rotation.z = t * 2;
        gear2.rotation.z = -t * 2;
        driveGear.rotation.z = t * 4;
        driveShaft.rotation.y = t * 4;

        // 2. Move the tuning rods inside the cavity based on gear rotation
        // Sine wave sweeping back and forth
        const sweep = Math.sin(t * 0.5) * 0.3;
        tuningRod1.position.x = 0.5 + sweep;
        tuningRod2.position.x = -0.5 - sweep;

        // 3. Pulse the magnetic field lines
        bLines.forEach(line => {
            const opacity = line.userData.baseOpacity + Math.sin(t * line.userData.pulseSpeed + line.userData.pulsePhase) * 0.2;
            line.material.opacity = Math.max(0, opacity);
            // subtle twist
            line.rotation.y = t * 0.1;
        });

        // 4. Blink the DAQ LEDs
        daqGroup.children.forEach(child => {
            if (child.geometry.type === 'PlaneGeometry') {
                child.children.forEach(led => {
                    const blink = Math.sin(t * led.userData.blinkSpeed + led.userData.blinkOffset);
                    led.material.emissiveIntensity = blink > 0.8 ? 10.0 : 0.5;
                });
            }
        });

        // 5. Axion Particle Rain Simulation
        for(let i=0; i<axionCount; i++) {
            const data = axionData[i];
            data.y -= data.speed * speed * 0.05;
            if (data.y < -15) {
                data.y = 15; // reset to top
                data.x = -2 + Math.random() * 4;
                data.z = -2 + Math.random() * 4;
            }
            dummy.position.set(data.x, data.y, data.z);
            dummy.updateMatrix();
            axionInstanced.setMatrixAt(i, dummy.matrix);
        }
        axionInstanced.instanceMatrix.needsUpdate = true;

        // 6. Rare Axion -> Photon Conversion Events inside cavity
        // Cavity is between y=-5 and y=1
        for(let i=0; i<photonCount; i++) {
            const data = photonData[i];
            
            if (!data.active) {
                // Rare spawn chance
                if (Math.random() < 0.005 * speed) {
                    data.active = true;
                    // Spawn inside cavity
                    data.x = -0.8 + Math.random() * 1.6;
                    data.y = -4 + Math.random() * 4;
                    data.z = -0.8 + Math.random() * 1.6;
                    data.life = 1.0;
                } else {
                    dummy.position.set(999, 999, 999);
                    dummy.updateMatrix();
                    photonInstanced.setMatrixAt(i, dummy.matrix);
                }
            } else {
                // Photon is active, let it bounce around or fade
                data.life -= 0.05 * speed;
                
                // Rapid jitter (bouncing in cavity)
                data.x += (Math.random() - 0.5) * 0.2;
                data.y += (Math.random() - 0.5) * 0.2;
                data.z += (Math.random() - 0.5) * 0.2;
                
                // Clamp to cavity bounds
                if (data.x > 0.9) data.x = 0.9;
                if (data.x < -0.9) data.x = -0.9;
                if (data.y > 0.9) data.y = 0.9;
                if (data.y < -4.9) data.y = -4.9;
                if (data.z > 0.9) data.z = 0.9;
                if (data.z < -0.9) data.z = -0.9;

                // Scale based on life
                const scale = data.life * 2;
                dummy.position.set(data.x, data.y, data.z);
                dummy.scale.set(scale, scale, scale);
                dummy.updateMatrix();
                photonInstanced.setMatrixAt(i, dummy.matrix);
                
                if (data.life <= 0) {
                    data.active = false;
                }
            }
        }
        photonInstanced.instanceMatrix.needsUpdate = true;

        // 7. Pulse the Turbo Pump
        turboPump.rotation.y += speed * 0.5; // High speed spin

        // 8. Slight vibration of the main OVC (simulating cooling pumps)
        ovcGroup.position.x = Math.sin(t * 50) * 0.002;
        ovcGroup.position.z = Math.cos(t * 47) * 0.002;
    }

    return { group, parts, description, quizQuestions, animate };
}
