import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials for Microscopic High-Tech Vibe
    const hotCeramicMat = new THREE.MeshStandardMaterial({ color: 0xaa2200, roughness: 0.9, emissive: 0x330000, emissiveIntensity: 0.5 });
    const coldCeramicMat = new THREE.MeshStandardMaterial({ color: 0x0022aa, roughness: 0.9, emissive: 0x000033, emissiveIntensity: 0.5 });
    const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const holeMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const nTypeAtomMat = new THREE.MeshPhysicalMaterial({ color: 0x228822, transmission: 0.5, opacity: 1, metalness: 0.2, roughness: 0.1, clearcoat: 1.0 });
    const pTypeAtomMat = new THREE.MeshPhysicalMaterial({ color: 0x882288, transmission: 0.5, opacity: 1, metalness: 0.2, roughness: 0.1, clearcoat: 1.0 });
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 3 });

    // --------------------------------------------------------------------------------
    // 1. COMPLEX CERAMIC PLATES (HOT & COLD SIDES) - Using ExtrudeGeometry
    // --------------------------------------------------------------------------------
    const plateShape = new THREE.Shape();
    plateShape.moveTo(-15, -8);
    plateShape.lineTo(15, -8);
    plateShape.lineTo(18, -5);
    plateShape.lineTo(18, 5);
    plateShape.lineTo(15, 8);
    plateShape.lineTo(-15, 8);
    plateShape.lineTo(-18, 5);
    plateShape.lineTo(-18, -5);
    plateShape.lineTo(-15, -8);

    // Cutouts to make it look highly engineered
    const hole1 = new THREE.Path();
    hole1.absarc(-12, 0, 1.5, 0, Math.PI * 2, false);
    const hole2 = new THREE.Path();
    hole2.absarc(12, 0, 1.5, 0, Math.PI * 2, false);
    plateShape.holes.push(hole1, hole2);

    const plateExtrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };

    const hotPlateGeo = new THREE.ExtrudeGeometry(plateShape, plateExtrudeSettings);
    const hotPlate = new THREE.Mesh(hotPlateGeo, hotCeramicMat);
    hotPlate.rotation.x = Math.PI / 2;
    hotPlate.position.set(0, -12, 0);
    group.add(hotPlate);
    meshes.hotPlate = hotPlate;

    const coldPlateGeo = new THREE.ExtrudeGeometry(plateShape, plateExtrudeSettings);
    const coldPlate = new THREE.Mesh(coldPlateGeo, coldCeramicMat);
    coldPlate.rotation.x = Math.PI / 2;
    coldPlate.position.set(0, 12, 0);
    group.add(coldPlate);
    meshes.coldPlate = coldPlate;

    parts.push({
        name: "Hot Side Alumina Substrate",
        description: "Thermally conductive but electrically insulating ceramic base, exposed to the heat source. Absorbs thermal energy to generate phonon vibrations.",
        material: "Alumina Ceramic (Al2O3)",
        function: "Thermal coupling and electrical isolation",
        assemblyOrder: 1,
        connections: ["Hot Copper Interconnect"],
        failureEffect: "Thermal bottleneck, reducing temperature delta and device efficiency.",
        cascadeFailures: ["Junction overheating", "Solder reflow and detachment"],
        originalPosition: { x: 0, y: -12, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    parts.push({
        name: "Cold Side Alumina Substrate",
        description: "Dissipates waste heat to the ambient environment. Maintains the necessary temperature gradient.",
        material: "Alumina Ceramic (Al2O3)",
        function: "Heat dissipation and electrical isolation",
        assemblyOrder: 2,
        connections: ["Cold Copper Interconnects P/N"],
        failureEffect: "Loss of delta-T, causing the Seebeck voltage to collapse to zero.",
        cascadeFailures: ["Complete power output failure"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // --------------------------------------------------------------------------------
    // 2. COPPER INTERCONNECTS (Highly detailed shapes)
    // --------------------------------------------------------------------------------
    const interconnectShape = new THREE.Shape();
    interconnectShape.moveTo(-6, -4);
    interconnectShape.lineTo(6, -4);
    interconnectShape.lineTo(7, -3);
    interconnectShape.lineTo(7, 3);
    interconnectShape.lineTo(6, 4);
    interconnectShape.lineTo(-6, 4);
    interconnectShape.lineTo(-7, 3);
    interconnectShape.lineTo(-7, -3);
    interconnectShape.lineTo(-6, -4);

    const interExtrude = { depth: 1, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.3, bevelThickness: 0.3 };
    const copperGeo = new THREE.ExtrudeGeometry(interconnectShape, interExtrude);

    const hotCopper = new THREE.Mesh(copperGeo, copper);
    hotCopper.rotation.x = Math.PI / 2;
    hotCopper.position.set(0, -9.5, 0);
    group.add(hotCopper);
    meshes.hotCopper = hotCopper;

    const coldCopperN = new THREE.Mesh(copperGeo, copper);
    coldCopperN.scale.set(0.45, 1, 1);
    coldCopperN.rotation.x = Math.PI / 2;
    coldCopperN.position.set(-4, 10.5, 0);
    group.add(coldCopperN);

    const coldCopperP = new THREE.Mesh(copperGeo, copper);
    coldCopperP.scale.set(0.45, 1, 1);
    coldCopperP.rotation.x = Math.PI / 2;
    coldCopperP.position.set(4, 10.5, 0);
    group.add(coldCopperP);

    parts.push({
        name: "Hot Copper Interconnect",
        description: "Heavy-duty copper busbar bridging the N and P type semiconductor legs in series electrically, but in parallel thermally.",
        material: "Oxygen-Free High Conductivity Copper",
        function: "Series electrical connection",
        assemblyOrder: 3,
        connections: ["N-Type Leg", "P-Type Leg", "Hot Alumina Substrate"],
        failureEffect: "Open circuit, halting all electron flow.",
        cascadeFailures: ["Total system failure"],
        originalPosition: { x: 0, y: -9.5, z: 0 },
        explodedPosition: { x: 0, y: -18, z: 0 }
    });

    // --------------------------------------------------------------------------------
    // 3. SEMICONDUCTOR LATTICES (N-TYPE & P-TYPE)
    // We will build a true 3D crystal lattice using spheres and cylinders
    // --------------------------------------------------------------------------------
    const latticeGroupN = new THREE.Group();
    const latticeGroupP = new THREE.Group();
    latticeGroupN.position.set(-4, 0, 0);
    latticeGroupP.position.set(4, 0, 0);
    group.add(latticeGroupN, latticeGroupP);

    const atomGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const bondGeoVert = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const bondGeoHorz = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    bondGeoHorz.rotateZ(Math.PI / 2);
    const bondGeoDepth = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    bondGeoDepth.rotateX(Math.PI / 2);

    const latticeNodesN = [];
    const latticeNodesP = [];
    
    const xSteps = 4;
    const ySteps = 10;
    const zSteps = 4;
    const spacing = 1.5;

    for(let x=0; x<xSteps; x++) {
        for(let y=0; y<ySteps; y++) {
            for(let z=0; z<zSteps; z++) {
                const px = (x - xSteps/2 + 0.5) * spacing;
                const py = (y - ySteps/2 + 0.5) * spacing;
                const pz = (z - zSteps/2 + 0.5) * spacing;

                // N-Type Atom
                const atomN = new THREE.Mesh(atomGeo, nTypeAtomMat);
                atomN.position.set(px, py, pz);
                latticeGroupN.add(atomN);
                latticeNodesN.push(atomN);

                // P-Type Atom
                const atomP = new THREE.Mesh(atomGeo, pTypeAtomMat);
                atomP.position.set(px, py, pz);
                latticeGroupP.add(atomP);
                latticeNodesP.push(atomP);

                // Add Bonds
                if (y < ySteps - 1) {
                    const bVN = new THREE.Mesh(bondGeoVert, bondMat);
                    bVN.position.set(px, py + spacing/2, pz);
                    latticeGroupN.add(bVN);
                    
                    const bVP = new THREE.Mesh(bondGeoVert, bondMat);
                    bVP.position.set(px, py + spacing/2, pz);
                    latticeGroupP.add(bVP);
                }
                if (x < xSteps - 1) {
                    const bHN = new THREE.Mesh(bondGeoHorz, bondMat);
                    bHN.position.set(px + spacing/2, py, pz);
                    latticeGroupN.add(bHN);

                    const bHP = new THREE.Mesh(bondGeoHorz, bondMat);
                    bHP.position.set(px + spacing/2, py, pz);
                    latticeGroupP.add(bHP);
                }
                if (z < zSteps - 1) {
                    const bDN = new THREE.Mesh(bondGeoDepth, bondMat);
                    bDN.position.set(px, py, pz + spacing/2);
                    latticeGroupN.add(bDN);

                    const bDP = new THREE.Mesh(bondGeoDepth, bondMat);
                    bDP.position.set(px, py, pz + spacing/2);
                    latticeGroupP.add(bDP);
                }
            }
        }
    }

    parts.push({
        name: "N-Type Bismuth Telluride Lattice",
        description: "Doped semiconductor crystal heavily populated with free electrons. Temperature gradient pushes high-energy electrons toward the cold side.",
        material: "Bi2Te3 (Selenium doped)",
        function: "Electron transport medium",
        assemblyOrder: 4,
        connections: ["Hot Copper Interconnect", "Cold Copper Interconnect N"],
        failureEffect: "Lattice degradation, increased electrical resistance, reduced charge carrier mobility.",
        cascadeFailures: ["Junction meltdown", "Efficiency drop"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    parts.push({
        name: "P-Type Antimony Telluride Lattice",
        description: "Doped semiconductor crystal with an abundance of holes (positive charge carriers). Holes migrate toward the cold side under the thermal gradient.",
        material: "Sb2Te3 (Bismuth doped)",
        function: "Hole transport medium",
        assemblyOrder: 5,
        connections: ["Hot Copper Interconnect", "Cold Copper Interconnect P"],
        failureEffect: "Lattice micro-fractures blocking hole transport.",
        cascadeFailures: ["Localized heating", "Component fracture"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    // --------------------------------------------------------------------------------
    // 4. CHARGE CARRIERS (ELECTRONS & HOLES) - Particle Migration System
    // --------------------------------------------------------------------------------
    const electrons = [];
    const holes = [];
    const carrierGeo = new THREE.SphereGeometry(0.2, 12, 12);
    
    // N-Type Carriers (Electrons)
    for(let i=0; i<60; i++) {
        const electron = new THREE.Mesh(carrierGeo, electronMat);
        electron.position.set(
            -4 + (Math.random() - 0.5) * 4,
            -8 + Math.random() * 16,
            (Math.random() - 0.5) * 4
        );
        electron.userData = { speed: 0.05 + Math.random() * 0.05, phase: Math.random() * Math.PI * 2 };
        group.add(electron);
        electrons.push(electron);
    }

    // P-Type Carriers (Holes)
    for(let i=0; i<60; i++) {
        const hole = new THREE.Mesh(carrierGeo, holeMat);
        hole.position.set(
            4 + (Math.random() - 0.5) * 4,
            -8 + Math.random() * 16,
            (Math.random() - 0.5) * 4
        );
        hole.userData = { speed: 0.05 + Math.random() * 0.05, phase: Math.random() * Math.PI * 2 };
        group.add(hole);
        holes.push(hole);
    }

    meshes.electrons = electrons;
    meshes.holes = holes;
    meshes.latticeNodesN = latticeNodesN;
    meshes.latticeNodesP = latticeNodesP;

    parts.push({
        name: "Free Electrons (N-Type Charge Carriers)",
        description: "Negatively charged subatomic particles driven by the Seebeck effect from the hot junction to the cold junction.",
        material: "Pure Energy/Mass",
        function: "Current transmission",
        assemblyOrder: 6,
        connections: ["N-Type Lattice"],
        failureEffect: "Electron trapping at defect sites.",
        cascadeFailures: ["Voltage drop"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -16, y: 5, z: 5 }
    });

    parts.push({
        name: "Electron Holes (P-Type Charge Carriers)",
        description: "Absence of electrons in the lattice acting as positive charge carriers, moving in parallel with the heat flux.",
        material: "Quantum Quasiparticles",
        function: "Current transmission (Positive)",
        assemblyOrder: 7,
        connections: ["P-Type Lattice"],
        failureEffect: "Recombination with stray electrons, neutralizing charge flow.",
        cascadeFailures: ["Current loss"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 16, y: 5, z: 5 }
    });

    // --------------------------------------------------------------------------------
    // 5. HIGH-TECH MICRO-PROBES (Diagnostic Instruments attached to the cell)
    // --------------------------------------------------------------------------------
    const probeGroup = new THREE.Group();
    
    // Lathe Geometry for precise scientific instrument look
    const probePoints = [];
    for ( let i = 0; i < 10; i ++ ) {
        probePoints.push( new THREE.Vector2( 0.2 + Math.sin( i * 0.2 ) * 0.5, i * 1.5 ) );
    }
    const probeGeo = new THREE.LatheGeometry(probePoints, 32);
    
    // Left Probe (Measuring N-Type)
    const probeL = new THREE.Mesh(probeGeo, chrome);
    probeL.rotation.z = -Math.PI / 4;
    probeL.position.set(-10, 5, 5);
    probeGroup.add(probeL);

    const laserLineNGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const laserLineN = new THREE.Mesh(laserLineNGeo, neonBlue);
    laserLineN.position.set(-7, 2, 2.5);
    laserLineN.rotation.z = Math.PI / 4;
    probeGroup.add(laserLineN);

    // Right Probe (Measuring P-Type)
    const probeR = new THREE.Mesh(probeGeo, chrome);
    probeR.rotation.z = Math.PI / 4;
    probeR.position.set(10, 5, 5);
    probeGroup.add(probeR);

    const laserLinePGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const laserLineP = new THREE.Mesh(laserLinePGeo, neonRed);
    laserLineP.position.set(7, 2, 2.5);
    laserLineP.rotation.z = -Math.PI / 4;
    probeGroup.add(laserLineP);

    group.add(probeGroup);

    parts.push({
        name: "N-Type Diagnostic Nanoprobe",
        description: "Advanced chromium-plated probe utilizing laser interferometry to measure electron flux and lattice phonon vibrations in real-time.",
        material: "Chromium / Optical Glass",
        function: "Real-time carrier diagnostics",
        assemblyOrder: 8,
        connections: ["Microscope Base"],
        failureEffect: "Loss of N-Type telemetry data.",
        cascadeFailures: ["Telemetry desync"],
        originalPosition: { x: -10, y: 5, z: 5 },
        explodedPosition: { x: -20, y: 10, z: 10 }
    });

    parts.push({
        name: "P-Type Diagnostic Nanoprobe",
        description: "Measures hole mobility, localized thermal hotspots, and Seebeck coefficient efficiency using quantum sensors.",
        material: "Chromium / Optical Glass",
        function: "Real-time hole diagnostics",
        assemblyOrder: 9,
        connections: ["Microscope Base"],
        failureEffect: "Loss of P-Type telemetry.",
        cascadeFailures: ["Telemetry desync"],
        originalPosition: { x: 10, y: 5, z: 5 },
        explodedPosition: { x: 20, y: 10, z: 10 }
    });

    // --------------------------------------------------------------------------------
    // 6. HYDRAULIC ACTUATORS & MOUNTS (Supporting the massive structure)
    // --------------------------------------------------------------------------------
    const frameGroup = new THREE.Group();
    const frameCylGeo = new THREE.CylinderGeometry(1, 1, 30, 16);
    
    const strut1 = new THREE.Mesh(frameCylGeo, darkSteel);
    strut1.position.set(-18, 0, -8);
    frameGroup.add(strut1);

    const strut2 = new THREE.Mesh(frameCylGeo, darkSteel);
    strut2.position.set(18, 0, -8);
    frameGroup.add(strut2);

    // Hydraulic Pistons on struts
    const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 10, 16);
    const piston1 = new THREE.Mesh(pistonGeo, steel);
    piston1.position.set(-18, -10, -8);
    frameGroup.add(piston1);
    
    const piston2 = new THREE.Mesh(pistonGeo, steel);
    piston2.position.set(18, -10, -8);
    frameGroup.add(piston2);

    meshes.pistons = [piston1, piston2];
    group.add(frameGroup);

    parts.push({
        name: "Heavy-Duty Stabilization Struts",
        description: "Isolates the microscopic testbed from macro-scale seismic vibrations using active damping.",
        material: "Dark Steel Alloy",
        function: "Vibration isolation",
        assemblyOrder: 10,
        connections: ["Hydraulic Dampers", "Vacuum Chamber Base"],
        failureEffect: "External vibrations disrupt lattice measurements.",
        cascadeFailures: ["Probe misalignment", "Data corruption"],
        originalPosition: { x: -18, y: 0, z: -8 },
        explodedPosition: { x: -30, y: 0, z: -15 }
    });

    parts.push({
        name: "Hydraulic Active Dampers",
        description: "High-pressure hydraulic pistons that constantly adjust to keep the Seebeck module perfectly level under extreme thermal expansion.",
        material: "Machined Steel / Hydraulic Fluid",
        function: "Thermal expansion compensation",
        assemblyOrder: 11,
        connections: ["Stabilization Struts"],
        failureEffect: "Hydraulic seal blowout, causing structural leaning.",
        cascadeFailures: ["Substrate cracking due to uneven pressure"],
        originalPosition: { x: -18, y: -10, z: -8 },
        explodedPosition: { x: -30, y: -15, z: -15 }
    });

    // --------------------------------------------------------------------------------
    // 7. POWER EXTRACTION COILS (Torus Geometries + Wiring)
    // --------------------------------------------------------------------------------
    const coilGeo = new THREE.TorusGeometry(3, 0.5, 16, 64);
    const coilN = new THREE.Mesh(coilGeo, copper);
    coilN.position.set(-4, 15, 0);
    coilN.rotation.x = Math.PI / 2;
    group.add(coilN);

    const coilP = new THREE.Mesh(coilGeo, copper);
    coilP.position.set(4, 15, 0);
    coilP.rotation.x = Math.PI / 2;
    group.add(coilP);

    // Thick Power cables exiting the system
    const cableCurveL = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-4, 15, -3),
        new THREE.Vector3(-10, 20, -10),
        new THREE.Vector3(-20, -5, -20)
    );
    const cableGeoL = new THREE.TubeGeometry(cableCurveL, 20, 0.8, 8, false);
    const cableL = new THREE.Mesh(cableGeoL, rubber);
    group.add(cableL);

    const cableCurveR = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(4, 15, -3),
        new THREE.Vector3(10, 20, -10),
        new THREE.Vector3(20, -5, -20)
    );
    const cableGeoR = new THREE.TubeGeometry(cableCurveR, 20, 0.8, 8, false);
    const cableR = new THREE.Mesh(cableGeoR, rubber);
    group.add(cableR);

    parts.push({
        name: "N-Terminal Extraction Coil",
        description: "Inductive toroidal coupling drawing DC current from the N-type leg.",
        material: "Copper / Ferromagnetic Core",
        function: "Current extraction",
        assemblyOrder: 12,
        connections: ["Cold Copper N", "N-Terminal Cable"],
        failureEffect: "Short circuit to ground.",
        cascadeFailures: ["Power loss"],
        originalPosition: { x: -4, y: 15, z: 0 },
        explodedPosition: { x: -8, y: 25, z: 0 }
    });

    parts.push({
        name: "P-Terminal Extraction Coil",
        description: "Inductive toroidal coupling drawing DC current from the P-type leg.",
        material: "Copper / Ferromagnetic Core",
        function: "Current extraction",
        assemblyOrder: 13,
        connections: ["Cold Copper P", "P-Terminal Cable"],
        failureEffect: "Inductive breakdown.",
        cascadeFailures: ["Power loss"],
        originalPosition: { x: 4, y: 15, z: 0 },
        explodedPosition: { x: 8, y: 25, z: 0 }
    });

    parts.push({
        name: "Main Power Bus Cables",
        description: "Heavy insulated rubber cabling routing the generated DC voltage to the external payload.",
        material: "Industrial Rubber / Copper Strands",
        function: "External power routing",
        assemblyOrder: 14,
        connections: ["Extraction Coils"],
        failureEffect: "Insulation melting leading to arc flash.",
        cascadeFailures: ["Fire", "Complete module destruction"],
        originalPosition: { x: 0, y: 18, z: -10 },
        explodedPosition: { x: 0, y: 30, z: -30 }
    });

    // --------------------------------------------------------------------------------
    // 8. ENVIRONMENTAL CHAMBER DETAILS
    // --------------------------------------------------------------------------------
    const chamberBaseGeo = new THREE.CylinderGeometry(25, 28, 4, 32);
    const chamberBase = new THREE.Mesh(chamberBaseGeo, steel);
    chamberBase.position.set(0, -16, 0);
    group.add(chamberBase);

    const glowingRingGeo = new THREE.TorusGeometry(26, 0.3, 16, 64);
    const glowingRing = new THREE.Mesh(glowingRingGeo, neonBlue);
    glowingRing.position.set(0, -14, 0);
    glowingRing.rotation.x = Math.PI / 2;
    group.add(glowingRing);
    meshes.glowingRing = glowingRing;

    parts.push({
        name: "Vacuum Chamber Base Plate",
        description: "Massive steel bulkhead sealing the microscopic test environment in a hard vacuum to prevent convective heat loss.",
        material: "Forged Steel",
        function: "Atmospheric isolation",
        assemblyOrder: 15,
        connections: ["Stabilization Struts", "Hot Substrate"],
        failureEffect: "Vacuum leak introduces air, destroying the thermal gradient via convection.",
        cascadeFailures: ["Oxidation of copper", "Efficiency drop to near zero"],
        originalPosition: { x: 0, y: -16, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    parts.push({
        name: "Status Indicator Plasma Ring",
        description: "Neon plasma containment ring indicating the vacuum seal integrity and overall module power generation state.",
        material: "Ionized Argon / Glass",
        function: "Visual telemetry",
        assemblyOrder: 16,
        connections: ["Vacuum Chamber Base Plate"],
        failureEffect: "Flickering or color change indicating seal compromise.",
        cascadeFailures: ["None directly"],
        originalPosition: { x: 0, y: -14, z: 0 },
        explodedPosition: { x: 0, y: -38, z: 0 }
    });

    // --------------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // --------------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In a thermoelectric generator, what physical phenomenon directly causes charge carriers to migrate from the hot side to the cold side?",
            options: ["The Peltier Effect", "The Seebeck Effect", "The Thomson Effect", "The Joule Heating Effect"],
            correctAnswer: 1,
            explanation: "The Seebeck effect describes the generation of a voltage gradient across a semiconductor due to a temperature gradient, causing charge carriers to diffuse toward the cold side."
        },
        {
            question: "Why are N-type and P-type semiconductors used in pairs within a thermoelectric module?",
            options: ["To balance structural weight", "To create a strong magnetic field", "So their voltages add together rather than cancel out", "To prevent thermal runaway"],
            correctAnswer: 2,
            explanation: "In an N-type material, electrons move to the cold side. In a P-type material, holes move to the cold side. If connected electrically in series at the hot side, their generated Seebeck voltages are additive."
        },
        {
            question: "What is the primary function of the Alumina Ceramic Substrates on the top and bottom of the junction?",
            options: ["To amplify the electrical current", "To act as an electrical insulator while being a good thermal conductor", "To emit photons for diagnostics", "To absorb mechanical shock"],
            correctAnswer: 1,
            explanation: "Alumina is chosen because it conducts heat well (maintaining the delta-T across the legs) but strictly isolates the internal electrical circuit from the external casing."
        },
        {
            question: "What happens to the charge carrier mobility if the semiconductor lattice becomes highly disorganized or physically degraded?",
            options: ["Mobility increases due to less friction", "Mobility decreases, raising electrical resistance and lowering efficiency", "It turns into a superconductor", "Holes and electrons swap properties"],
            correctAnswer: 1,
            explanation: "Lattice defects scatter charge carriers (electrons and holes), which increases electrical resistance (Joule heating) and dramatically reduces the module's Figure of Merit (ZT)."
        },
        {
            question: "Why must the thermoelectric module ideally be operated in a vacuum or heavily insulated environment?",
            options: ["To prevent the copper from turning to gold", "To stop convection from bypassing the semiconductors and equalizing the temperature", "Because electrons cannot travel in air", "To prevent radioactive decay of Bismuth"],
            correctAnswer: 1,
            explanation: "Convective heat transfer through surrounding air would allow heat to flow from the hot side to the cold side without passing through the semiconductors, ruining the temperature gradient."
        }
    ];

    // --------------------------------------------------------------------------------
    // ANIMATION FUNCTION
    // --------------------------------------------------------------------------------
    function animate(time, speed, m) {
        const delta = 0.01 * speed;
        
        // 1. Animate Charge Carriers (Electrons & Holes)
        // N-Type: Electrons move up (from hot at -10 to cold at +10)
        m.electrons.forEach(electron => {
            electron.position.y += electron.userData.speed * speed;
            // Oscillate slightly in X/Z to simulate lattice scattering
            electron.position.x += Math.sin(time * 10 + electron.userData.phase) * 0.05 * speed;
            electron.position.z += Math.cos(time * 10 + electron.userData.phase) * 0.05 * speed;

            if (electron.position.y > 10) {
                electron.position.y = -8; // Reset to hot side
                electron.position.x = -4 + (Math.random() - 0.5) * 4;
                electron.position.z = (Math.random() - 0.5) * 4;
            }
        });

        // P-Type: Holes move up (from hot at -10 to cold at +10)
        m.holes.forEach(hole => {
            hole.position.y += hole.userData.speed * speed;
            // Oscillate slightly in X/Z
            hole.position.x += Math.cos(time * 10 + hole.userData.phase) * 0.05 * speed;
            hole.position.z += Math.sin(time * 10 + hole.userData.phase) * 0.05 * speed;

            if (hole.position.y > 10) {
                hole.position.y = -8; // Reset to hot side
                hole.position.x = 4 + (Math.random() - 0.5) * 4;
                hole.position.z = (Math.random() - 0.5) * 4;
            }
        });

        // 2. Lattice Phonon Vibration (Thermal Energy Simulation)
        // Hotter side vibrates more
        m.latticeNodesN.forEach(node => {
            // Base positions are captured, but we just apply a tiny jitter based on Y height
            const intensity = Math.max(0, (12 - node.position.y) * 0.005);
            node.position.x += (Math.random() - 0.5) * intensity * speed;
            node.position.z += (Math.random() - 0.5) * intensity * speed;
            // Snapping back slightly to maintain crystal structure
            node.position.x += ((-4 + (node.position.x > -4 ? 1 : -1) * (Math.abs(node.position.x + 4) % 1.5)) - node.position.x) * 0.1;
        });

        // 3. Pulse the Hot Plate Emissive Material
        const pulse = (Math.sin(time * 2) + 1) / 2;
        hotCeramicMat.emissiveIntensity = 0.5 + pulse * 0.5;

        // 4. Animate Hydraulic Pistons (Active Damping)
        m.pistons.forEach((piston, idx) => {
            piston.position.y = -10 + Math.sin(time * 3 + idx * Math.PI) * 0.2 * speed;
        });

        // 5. Plasma Ring Rotation & Pulsing
        m.glowingRing.rotation.z -= 0.02 * speed;
        neonBlue.emissiveIntensity = 2 + Math.random() * 1.5;
    }

    return {
        group,
        parts,
        description: "A massively upscaled, microscopic diagnostic view of a P-N Junction Thermoelectric Couple. Demonstrates the Seebeck effect through highly detailed semiconductor lattices, real-time electron/hole carrier migration, and advanced laser interferometry probes. Operating under a massive thermal gradient to generate DC power.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createPNJunctionCouple() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
