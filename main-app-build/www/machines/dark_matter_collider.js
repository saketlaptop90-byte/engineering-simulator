import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    function addPart(mesh, name, description, material, func, order, connections, failure, cascade, origPos, explPos) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material: material.type,
            function: func,
            assemblyOrder: order,
            connections,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // High-tech emissive materials for intense visual flair
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, roughness: 0.1, metalness: 0.5 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x8800ff, emissiveIntensity: 2.0 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 3.0 });
    const greenGlow = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 2.5 });
    const yellowGlow = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffdd00, emissiveIntensity: 2.0 });

    // ==========================================
    // 1. CAVERN ENVIRONMENT & ROCK WALLS
    // ==========================================
    const cavernShape = new THREE.Shape();
    cavernShape.moveTo(0, -90);
    cavernShape.lineTo(120, -90);
    cavernShape.lineTo(140, -50);
    cavernShape.lineTo(150, 0);
    cavernShape.lineTo(140, 70);
    cavernShape.lineTo(110, 110);
    cavernShape.lineTo(0, 110);

    const cavernGeom = new THREE.LatheGeometry(cavernShape.getPoints(), 64);
    const cavernMesh = new THREE.Mesh(cavernGeom, darkSteel);
    cavernMesh.material.side = THREE.BackSide;
    cavernMesh.material.roughness = 1.0;
    
    // Add stalactites and rugged rock formations
    const rocksGroup = new THREE.Group();
    for(let i=0; i<400; i++) {
        const rockGeom = new THREE.DodecahedronGeometry(Math.random() * 8 + 3, 1);
        const rock = new THREE.Mesh(rockGeom, darkSteel);
        const angle = Math.random() * Math.PI * 2;
        const radius = 135 + Math.random() * 15;
        const y = (Math.random() - 0.5) * 180 + 10;
        rock.position.set(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
        rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        rocksGroup.add(rock);
    }
    cavernMesh.add(rocksGroup);
    
    addPart(cavernMesh, 'UndergroundCavern', 'Deep subterranean laboratory carved into bedrock, 2km underground', darkSteel, 'Shields the detector from the continuous barrage of cosmic rays', 1, [], 'Cosmic ray background overwhelms dark matter signal', [], {x:0, y:0, z:0}, {x:0, y:-200, z:0});

    // ==========================================
    // 2. MASSIVE CHERENKOV WATER VETO TANK
    // ==========================================
    const waterTankGroup = new THREE.Group();
    const waterTankGeom = new THREE.CylinderGeometry(60, 60, 120, 64);
    const waterTank = new THREE.Mesh(waterTankGeom, tinted);
    waterTank.material.transparent = true;
    waterTank.material.opacity = 0.25;
    waterTank.material.color.setHex(0x001133);
    waterTankGroup.add(waterTank);

    // Structural Ribs for Water Tank
    for(let i=0; i<24; i++) {
        const ribGeom = new THREE.BoxGeometry(3, 120, 4);
        const rib = new THREE.Mesh(ribGeom, steel);
        const angle = (i / 24) * Math.PI * 2;
        rib.position.set(Math.cos(angle) * 60, 0, Math.sin(angle) * 60);
        rib.lookAt(0, 0, 0);
        waterTankGroup.add(rib);
    }
    // Horizontal reinforcing rings
    for(let i=0; i<8; i++) {
        const ringGeom = new THREE.TorusGeometry(61, 1.5, 16, 64);
        const ring = new THREE.Mesh(ringGeom, steel);
        ring.position.y = -50 + i * (100/7);
        ring.rotation.x = Math.PI / 2;
        waterTankGroup.add(ring);
    }

    addPart(waterTankGroup, 'CherenkovWaterShield', 'Colossal tank filled with ultra-pure water', tinted, 'Acts as an active muon veto and passive neutron shield', 2, ['OuterVacuumCryostat'], 'Environmental radiation contaminates the signal', ['MuonVetoPMTs'], {x:0, y:0, z:0}, {x:0, y:0, z:200});

    // ==========================================
    // 3. MUON VETO PMT ARRAYS
    // ==========================================
    const vetoPmtGroup = new THREE.Group();
    for(let i=0; i<90; i++) {
        const angle = (i / 90) * Math.PI * 2;
        for(let j=0; j<6; j++) {
            const pmt = new THREE.Group();
            
            // 8-inch PMT Bulb
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), glass);
            bulb.scale.y = 0.8;
            const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.6, 1.5, 16), darkSteel);
            body.position.y = -0.75;
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.0, 16), plastic);
            base.position.y = -2;
            
            // Wiring tail
            const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, -2.5, 0), new THREE.Vector3(0, -5, 2)), 8, 0.1, 8, false), rubber);
            
            pmt.add(bulb, body, base, wire);
            
            const r = 57;
            const yPos = -45 + j * 18;
            pmt.position.set(Math.cos(angle) * r, yPos, Math.sin(angle) * r);
            pmt.lookAt(0, yPos, 0); // pointing inward towards cryostat
            vetoPmtGroup.add(pmt);
        }
    }
    addPart(vetoPmtGroup, 'MuonVetoPMTs', '8-inch Hamamatsu R5912 photomultiplier tubes', glass, 'Detects faint Cherenkov radiation emitted by passing cosmic muons in the water', 3, ['CherenkovWaterShield'], 'Blind spots in cosmic veto tagging', [], {x:0,y:0,z:0}, {x:0, y:100, z:200});

    // ==========================================
    // 4. OUTER VACUUM CRYOSTAT VESSEL
    // ==========================================
    const outerCryoGroup = new THREE.Group();
    
    const outerCryoShape = new THREE.Shape();
    outerCryoShape.moveTo(0, -35);
    outerCryoShape.lineTo(20, -35);
    outerCryoShape.bezierCurveTo(28, -35, 28, -25, 28, -20);
    outerCryoShape.lineTo(28, 20);
    outerCryoShape.bezierCurveTo(28, 25, 28, 35, 20, 35);
    outerCryoShape.lineTo(0, 35);
    
    const outerCryoGeom = new THREE.LatheGeometry(outerCryoShape.getPoints(), 128);
    const outerCryo = new THREE.Mesh(outerCryoGeom, chrome);
    outerCryoGroup.add(outerCryo);
    
    // Massive Flanges and Bolts
    const flangeGeom = new THREE.TorusGeometry(28.5, 1.5, 32, 128);
    const flange = new THREE.Mesh(flangeGeom, darkSteel);
    flange.rotation.x = Math.PI / 2;
    flange.position.y = 15;
    
    for(let i=0; i<120; i++) {
        const bolt = new THREE.Group();
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 6), steel);
        head.position.y = 1.6;
        const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8), copper);
        const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 6), steel);
        nut.position.y = -1.6;
        bolt.add(head, thread, nut);
        
        const angle = (i/120)*Math.PI*2;
        bolt.position.set(Math.cos(angle)*28.5, 0, Math.sin(angle)*28.5);
        flange.add(bolt);
    }
    outerCryoGroup.add(flange);

    // Stiffening ribs
    for(let i=0; i<32; i++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(1.5, 40, 2), steel);
        const angle = (i/32)*Math.PI*2;
        rib.position.set(Math.cos(angle)*28.5, -5, Math.sin(angle)*28.5);
        rib.lookAt(0, -5, 0);
        outerCryoGroup.add(rib);
    }

    addPart(outerCryoGroup, 'OuterVacuumCryostat', 'Massive low-radioactivity titanium pressure vessel', chrome, 'Maintains thermal isolation via ultra-high vacuum', 4, ['InnerCryostat'], 'Vacuum loss resulting in catastrophic thermal load', ['InnerCryostat', 'LiquidXenonTarget'], {x:0, y:0, z:0}, {x:-100, y:0, z:0});

    // ==========================================
    // 5. INNER CRYOSTAT VESSEL & COOLING LOOPS
    // ==========================================
    const innerCryoGroup = new THREE.Group();
    const innerCryoGeom = new THREE.CylinderGeometry(24, 24, 60, 128);
    const innerCryo = new THREE.Mesh(innerCryoGeom, steel);
    innerCryoGroup.add(innerCryo);
    
    // Helical Cooling Loops mapping the entire surface
    const coolingTubeCurve = new THREE.CatmullRomCurve3(
        Array.from({length: 200}).map((_, i) => {
            const t = i / 199;
            const y = -28 + t * 56;
            const angle = t * Math.PI * 80; // 40 full wraps
            return new THREE.Vector3(Math.cos(angle)*24.3, y, Math.sin(angle)*24.3);
        })
    );
    const coolingTube = new THREE.Mesh(new THREE.TubeGeometry(coolingTubeCurve, 1000, 0.35, 12, false), copper);
    innerCryoGroup.add(coolingTube);

    addPart(innerCryoGroup, 'InnerCryostat', 'Double-walled ultra-pure Oxygen-Free High Thermal Conductivity (OFHC) copper vessel', steel, 'Contains the 7 tonnes of liquid xenon at -100°C', 5, ['OuterVacuumCryostat', 'TPC_PTFE_Pillars'], 'Xenon boiling, massive pressure spike, potential rupture', ['LiquidXenonTarget'], {x:0, y:0, z:0}, {x:100, y:0, z:0});

    // ==========================================
    // 6. PTFE (TEFLON) REFLECTIVE TPC FRAME
    // ==========================================
    const tpcGroup = new THREE.Group();
    for(let i=0; i<24; i++) {
        // Interlocking pillar design
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 55, 32), plastic);
        const angle = (i/24) * Math.PI*2;
        pillar.position.set(Math.cos(angle)*22, 0, Math.sin(angle)*22);
        
        // Add carved slots for field rings
        for(let j=0; j<60; j++) {
            const slot = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 2), darkSteel);
            slot.position.y = -25 + j*0.85;
            pillar.add(slot);
        }
        
        tpcGroup.add(pillar);
    }
    addPart(tpcGroup, 'TPC_PTFE_Pillars', 'Ultra-pure Teflon interlocking support pillars', plastic, 'Provides extreme structural rigidity while acting as a near-perfect reflector for VUV scintillation light', 6, ['FieldCageRings'], 'Structural collapse and optical signal degradation', ['CathodeGrid'], {x:0, y:0, z:0}, {x:0, y:120, z:0});

    // ==========================================
    // 7. PRECISION FIELD CAGE
    // ==========================================
    const fieldCage = new THREE.Group();
    for(let i=0; i<60; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(21.5, 0.25, 16, 128), copper);
        ring.rotation.x = Math.PI/2;
        ring.position.y = -25 + i * 0.85;
        
        // Redundant mega-ohm resistor chains connecting rings
        if (i < 59) {
            for(let j=0; j<6; j++) {
                const resistor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.85, 12), darkSteel);
                // Striping on resistor
                const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 12), neonRed);
                resistor.add(stripe);
                
                const angle = (j/6) * Math.PI*2;
                resistor.position.set(Math.cos(angle)*21.5, -25 + i * 0.85 + 0.425, Math.sin(angle)*21.5);
                fieldCage.add(resistor);
            }
        }
        
        fieldCage.add(ring);
    }
    addPart(fieldCage, 'FieldCageRings', 'Copper shaping rings connected by precision parallel resistor chains', copper, 'Maintains a perfectly uniform drift electric field for ionization electrons', 7, ['TPC_PTFE_Pillars', 'CathodeGrid'], 'Electric field distortion, destroying track reconstruction', [], {x:0, y:0, z:0}, {x:0, y:0, z:-100});

    // ==========================================
    // 8. TOP & BOTTOM PMT ARRAYS (R11410)
    // ==========================================
    function createPMTArray(isTop) {
        const arrayGroup = new THREE.Group();
        const pmtRadius = 1.4; // 3-inch PMT
        
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(21.5, 21.5, 1.5, 128), copper);
        plate.position.y = isTop ? 28 : -28;
        arrayGroup.add(plate);

        for(let x=-20; x<=20; x+=2.9) {
            for(let z=-20; z<=20; z+=2.9) {
                if (x*x + z*z < 400) {
                    const pmt = new THREE.Group();
                    
                    // Quartz window
                    const window = new THREE.Mesh(new THREE.CylinderGeometry(pmtRadius, pmtRadius, 0.5, 32), glass);
                    // Kovar metal body
                    const body = new THREE.Mesh(new THREE.CylinderGeometry(pmtRadius*0.9, pmtRadius*0.5, 3, 32), chrome);
                    body.position.y = isTop ? 1.75 : -1.75;
                    // Base electronics
                    const base = new THREE.Mesh(new THREE.CylinderGeometry(pmtRadius*0.5, pmtRadius*0.5, 1, 32), plastic);
                    base.position.y = isTop ? 3.75 : -3.75;
                    
                    // Coaxial cable connection
                    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5, 8), rubber);
                    cable.position.y = isTop ? 6.75 : -6.75;

                    pmt.add(window, body, base, cable);
                    
                    if (isTop) {
                        pmt.position.set(x, 26, z);
                    } else {
                        pmt.position.set(x, -26, z);
                        pmt.rotation.x = Math.PI; // flip upside down
                    }
                    
                    arrayGroup.add(pmt);
                }
            }
        }
        return arrayGroup;
    }

    const topPmtArray = createPMTArray(true);
    addPart(topPmtArray, 'TopPMTArray', 'Dense honeycomb array of 253 ultra-low background 3-inch PMTs', darkSteel, 'Primarily detects and localizes the secondary proportional scintillation (S2)', 8, ['AnodeGrid'], 'Complete loss of XY position reconstruction capabilities', [], {x:0, y:0, z:0}, {x:0, y:180, z:0});

    const bottomPmtArray = createPMTArray(false);
    addPart(bottomPmtArray, 'BottomPMTArray', 'Bottom array consisting of 241 optimized PMTs', copper, 'Maximizes collection of the prompt primary scintillation (S1) light', 9, ['CathodeGrid'], 'Catastrophic loss of energy resolution', [], {x:0, y:0, z:0}, {x:0, y:-180, z:0});

    // ==========================================
    // 9. HIGH VOLTAGE GRIDS (Cathode, Gate, Anode)
    // ==========================================
    function createGrid(radius, yPos, wirePitch, label) {
        const gridGroup = new THREE.Group();
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.4, 32, 128), steel);
        ring.rotation.x = Math.PI/2;
        gridGroup.add(ring);
        
        for(let i=-radius; i<=radius; i+=wirePitch) {
            const length = 2 * Math.sqrt(Math.max(0, radius*radius - i*i));
            if (length > 0) {
                // X wires
                const wireX = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, length, 8), steel);
                wireX.rotation.z = Math.PI/2;
                wireX.position.z = i;
                gridGroup.add(wireX);
                
                // Z wires (woven)
                const wireZ = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, length, 8), steel);
                wireZ.rotation.x = Math.PI/2;
                wireZ.position.x = i;
                gridGroup.add(wireZ);
            }
        }
        gridGroup.position.y = yPos;
        return gridGroup;
    }

    const cathodeGrid = createGrid(21, -24, 0.5, 'Cathode');
    addPart(cathodeGrid, 'CathodeGrid', 'Photo-etched stainless steel grid biased at -100 kV', steel, 'Generates the primary vertical drift field', 10, ['FieldCageRings'], 'High voltage sparks, destroying pre-amplifiers', [], {x:0, y:0, z:0}, {x:0, y:-80, z:-120});

    const extractionGrids = new THREE.Group();
    const gateGrid = createGrid(21, 24, 0.25, 'Gate'); // tighter pitch
    const anodeGrid = createGrid(21, 25, 0.25, 'Anode');
    extractionGrids.add(gateGrid, anodeGrid);
    addPart(extractionGrids, 'ExtractionGrids', 'Gate and Anode grid stack operating at high field differences', steel, 'Extracts electrons from liquid to gas phase for signal amplification', 11, ['TopPMTArray'], 'Electrons trapped at liquid surface, obliterating S2 signal', [], {x:0, y:0, z:0}, {x:0, y:80, z:-120});

    // ==========================================
    // 10. DUAL PHASE LIQUID XENON TARGET
    // ==========================================
    const lxeGroup = new THREE.Group();
    // Liquid Phase
    const lxeGeom = new THREE.CylinderGeometry(21.4, 21.4, 49, 128);
    const lxeMesh = new THREE.Mesh(lxeGeom, neonBlue);
    lxeMesh.position.y = -0.5;
    
    // Gas phase (top 1cm)
    const gasGeom = new THREE.CylinderGeometry(21.4, 21.4, 1, 128);
    const gasMesh = new THREE.Mesh(gasGeom, neonPurple); // distinct color for gas phase
    gasMesh.position.y = 24.5;
    
    lxeGroup.add(lxeMesh, gasMesh);
    addPart(lxeGroup, 'DualPhaseXenonTarget', '7 tonnes of continuously purified Xenon (Liquid and Gas phases)', neonBlue, 'Provides massive dense target for WIMP scattering and distinct phase for S2 amplification', 12, ['InnerCryostat'], 'Total experimental failure', [], {x:0, y:0, z:0}, {x:0, y:0, z:150});

    // ==========================================
    // 11. UMBILICAL TOWER & CRYOGENIC PLUMBING
    // ==========================================
    const umbilicalGroup = new THREE.Group();
    const umbilicalShape = new THREE.Shape();
    umbilicalShape.absarc(0,0, 6, 0, Math.PI*2);
    const holePath = new THREE.Path();
    holePath.absarc(0,0, 5, 0, Math.PI*2);
    umbilicalShape.holes.push(holePath);
    
    const umbilicalExtrude = { depth: 60, bevelEnabled: false, curveSegments: 64 };
    const umbilicalGeom = new THREE.ExtrudeGeometry(umbilicalShape, umbilicalExtrude);
    const umbilical = new THREE.Mesh(umbilicalGeom, chrome);
    umbilical.rotation.x = Math.PI/2;
    umbilical.position.y = 95;
    umbilicalGroup.add(umbilical);
    
    // Internal plumbing: Xenon return, feed, HV cables, optic fibers
    const pipeTypes = [copper, steel, rubber, plastic, neonBlue, darkSteel];
    for(let i=0; i<12; i++) {
        const pipeMat = pipeTypes[i % pipeTypes.length];
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 60, 16), pipeMat);
        const angle = (i/12)*Math.PI*2;
        pipe.position.set(Math.cos(angle)*3, 65, Math.sin(angle)*3);
        umbilicalGroup.add(pipe);
    }
    
    // Massive Central High Voltage Feedthrough
    const hvFeedthrough = new THREE.Group();
    const hvCore = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 65, 32), rubber);
    const hvInsulator = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 60, 32), plastic);
    
    // Corrugated insulator rings
    for(let i=0; i<30; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.4, 16, 32), plastic);
        ring.rotation.x = Math.PI/2;
        ring.position.y = -25 + i*1.8;
        hvInsulator.add(ring);
    }
    
    hvFeedthrough.add(hvCore, hvInsulator);
    hvFeedthrough.position.set(0, 65, 0);
    umbilicalGroup.add(hvFeedthrough);

    addPart(umbilicalGroup, 'UmbilicalTower', 'Massive multi-service vacuum tube penetrating the water shield', chrome, 'Routes all cryogenics, high-voltage, and thousands of signal cables into the vessel safely', 13, ['OuterVacuumCryostat'], 'Catastrophic breach of vacuum and water flooding', [], {x:0, y:0, z:0}, {x:0, y:120, z:80});

    // ==========================================
    // 12. PULSE TUBE REFRIGERATOR ARRAY (CRYOCENTER)
    // ==========================================
    const cryoCenter = new THREE.Group();
    const platformBase = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 2, 64), darkSteel);
    cryoCenter.add(platformBase);

    // 4 Independent Cryocoolers for redundancy
    for(let i=0; i<4; i++) {
        const ptr = new THREE.Group();
        // Compressor block
        const compressor = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 6), steel);
        compressor.position.y = 5;
        
        // Surge tanks
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32), darkSteel);
        tank.position.set(4, 5, 0);
        
        // Rotary valve motor
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 32), copper);
        motor.rotation.z = Math.PI/2;
        motor.position.set(0, 10, 0);
        
        // Cold head assembly (goes down)
        const coldhead = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 32), chrome);
        coldhead.position.y = -4;
        
        // Heat exchange fins
        for(let f=0; f<15; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 8), copper);
            fin.position.y = 2 + f*0.6;
            ptr.add(fin);
        }
        
        ptr.add(compressor, tank, motor, coldhead);
        
        const angle = (i/4) * Math.PI*2;
        ptr.position.set(Math.cos(angle)*10, 0, Math.sin(angle)*10);
        ptr.rotation.y = -angle; // face outwards
        cryoCenter.add(ptr);
    }
    
    // Status indicators
    const masterStatus = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3), greenGlow);
    masterStatus.position.set(0, 15, 0);
    cryoCenter.add(masterStatus);

    cryoCenter.position.y = 100;
    addPart(cryoCenter, 'PulseTubeRefrigerators', 'Redundant array of acoustic Pulse Tube Refrigerators (PTRs)', darkSteel, 'Liquefies recirculating xenon gas continuously with zero moving parts in the cold zone', 14, ['UmbilicalTower'], 'Thermal runaway leading to xenon boil-off', [], {x:0, y:0, z:0}, {x:0, y:220, z:0});

    // ==========================================
    // 13. XENON PURIFICATION & GAS HANDLING SKID
    // ==========================================
    const purificationSkid = new THREE.Group();
    const skidFloor = new THREE.Mesh(new THREE.BoxGeometry(40, 2, 20), steel);
    purificationSkid.add(skidFloor);

    // Q-Drive Pumps
    for(let i=0; i<3; i++) {
        const pump = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 6, 32), darkSteel);
        body.rotation.z = Math.PI/2;
        body.position.y = 4;
        
        const head = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), chrome);
        head.position.set(3, 4, 0);
        
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8, 16), copper);
        exhaust.position.set(3, 9, 0);
        
        pump.add(body, head, exhaust);
        pump.position.set(-12 + i*12, 0, -5);
        purificationSkid.add(pump);
    }

    // High-Temperature Zirconium Getters
    for(let i=0; i<2; i++) {
        const getter = new THREE.Group();
        const vessel = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 18, 32), steel);
        vessel.position.y = 10;
        
        // Intense red glowing heater jackets
        const heater = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 10, 32), neonRed);
        heater.position.y = 10;
        
        // Massive flanges
        const flangeTop = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 16, 64), darkSteel);
        flangeTop.rotation.x = Math.PI/2;
        flangeTop.position.y = 18;
        
        getter.add(vessel, heater, flangeTop);
        getter.position.set(10 + i*10, 0, 5);
        purificationSkid.add(getter);
    }
    
    // Piping maze connecting them
    const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 10, -5),
        new THREE.Vector3(-10, 15, 0),
        new THREE.Vector3(15, 15, 5),
        new THREE.Vector3(15, 19, 5)
    ]);
    const skidPiping = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 64, 0.6, 16, false), copper);
    purificationSkid.add(skidPiping);

    purificationSkid.position.set(-50, 100, 0);
    addPart(purificationSkid, 'PurificationSkid', 'Gas handling system with magnetically coupled pumps and Zirconium getters', steel, 'Circulates 1000 standard liters per minute, stripping electronegative impurities to sub-PPT levels', 15, ['UmbilicalTower'], 'Loss of electron lifetime; signals absorbed before reaching top', [], {x:0, y:0, z:0}, {x:-140, y:180, z:0});

    // ==========================================
    // 14. DATA ACQUISITION (DAQ) & TRIGGER SERVERS
    // ==========================================
    const daqFacility = new THREE.Group();
    // Raised server floor
    const daqFloor = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 30), darkSteel);
    daqFacility.add(daqFloor);

    // 8 Massive Server Racks
    for(let r=0; r<8; r++) {
        const rack = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(6, 24, 8), darkSteel);
        frame.position.y = 13;
        rack.add(frame);
        
        // Populate with dense digitizer blades
        for(let blade=0; blade<32; blade++) {
            const server = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.6, 7.8), steel);
            server.position.y = 2 + blade*0.7;
            
            // LED Activity lights on front panel
            for(let led=0; led<12; led++) {
                const lightMat = Math.random() > 0.3 ? greenGlow : (Math.random() > 0.5 ? neonBlue : yellowGlow);
                const ledMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), lightMat);
                ledMesh.position.set(-2.5 + led*0.45, server.position.y, 4.0);
                rack.add(ledMesh);
            }
            rack.add(server);
        }
        
        // Cable bundles dropping from ceiling
        const cables = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15, 16), rubber);
        cables.position.set(0, 32, 0);
        rack.add(cables);
        
        const px = -18 + (r%4)*12;
        const pz = r < 4 ? -8 : 8;
        rack.position.set(px, 0, pz);
        daqFacility.add(rack);
    }
    
    daqFacility.position.set(60, 100, 0);
    addPart(daqFacility, 'DAQ_Electronics', 'High-speed digitizers (250 MS/s) and FPGA-based trigger logic', darkSteel, 'Digitizes massive waveforms from all PMTs and decides in real-time if an event is a WIMP candidate', 16, ['TopPMTArray', 'BottomPMTArray'], 'Zero data recorded', [], {x:0, y:0, z:0}, {x:160, y:180, z:0});

    // ==========================================
    // 15. CALIBRATION SOURCE DEPLOYMENT TUBES
    // ==========================================
    const calibTubesGroup = new THREE.Group();
    
    // Helical tubes wrapping around the outer cryostat for gamma/neutron sources
    for(let i=0; i<3; i++) {
        const calibTubeCurve = new THREE.CatmullRomCurve3(
            Array.from({length: 100}).map((_, idx) => {
                const t = idx / 99;
                const y = -35 + t * 70;
                const angle = t * Math.PI * 6 + (i * Math.PI * 2 / 3);
                return new THREE.Vector3(Math.cos(angle)*30, y, Math.sin(angle)*30);
            })
        );
        const tube = new THREE.Mesh(new THREE.TubeGeometry(calibTubeCurve, 200, 0.5, 16, false), plastic);
        calibTubesGroup.add(tube);
        
        // Motorized spools on deck
        const spool = new THREE.Group();
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 32), chrome);
        drum.rotation.x = Math.PI/2;
        const motor = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), darkSteel);
        motor.position.x = 3;
        spool.add(drum, motor);
        
        const spoolAngle = (i * Math.PI * 2 / 3);
        spool.position.set(Math.cos(spoolAngle)*30, 40, Math.sin(spoolAngle)*30);
        spool.lookAt(0, 40, 0);
        calibTubesGroup.add(spool);
    }
    
    addPart(calibTubesGroup, 'CalibrationDeployment', 'Motorized PTFE guide tubes and spool systems', plastic, 'Deploys radioactive isotopes (e.g., YBe, AmBe, Kr-83m) into the veto and cryostat to calibrate energy scales and background models', 17, ['OuterVacuumCryostat'], 'Inability to calibrate detector response', [], {x:0, y:0, z:0}, {x:0, y:0, z:120});

    // ==========================================
    // 16. NEUTRON VETO PANELS (GD-LOADED LIQUID SCINTILLATOR)
    // ==========================================
    const neutronVetoGroup = new THREE.Group();
    // Hexagonal ring of massive panels outside the cryostat, inside the water
    for(let i=0; i<16; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(12, 80, 4), plastic);
        panel.material = new THREE.MeshStandardMaterial({color: 0x111111, emissive: 0x330088, emissiveIntensity: 1.0, transparent: true, opacity: 0.9}); // deep glowing purple
        
        const angle = (i/16)*Math.PI*2;
        panel.position.set(Math.cos(angle)*40, 0, Math.sin(angle)*40);
        panel.rotation.y = -angle; // face center
        
        // Frame for panel
        const frame = new THREE.Mesh(new THREE.BoxGeometry(13, 81, 4.5), steel);
        frame.material.wireframe = true;
        panel.add(frame);
        
        neutronVetoGroup.add(panel);
    }
    addPart(neutronVetoGroup, 'NeutronVetoPanels', 'Acrylic panels filled with Gadolinium-loaded liquid scintillator', plastic, 'Captures radiogenic neutrons with extremely high efficiency, vetoing events that mimic WIMP signals', 18, ['CherenkovWaterShield'], 'Neutron background masquerades as dark matter discovery', [], {x:0, y:0, z:0}, {x:0, y:0, z:-200});

    // ==========================================
    // 17. ACCESS WALKWAYS AND PLATFORMS
    // ==========================================
    const walkways = new THREE.Group();
    // Main circular deck above water tank
    const deckRing = new THREE.Mesh(new THREE.RingGeometry(32, 80, 128, 1), darkSteel);
    deckRing.rotation.x = -Math.PI/2;
    // Transparent grate look
    deckRing.material.wireframe = true;
    
    // Safety railings
    for(let radius of [32, 80]) {
        const topRail = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.4, 16, 128), steel);
        topRail.rotation.x = Math.PI/2;
        topRail.position.y = 4;
        
        const midRail = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.2, 16, 128), steel);
        midRail.rotation.x = Math.PI/2;
        midRail.position.y = 2;
        
        walkways.add(topRail, midRail);
        
        for(let i=0; i<64; i++) {
            const angle = (i/64)*Math.PI*2;
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), steel);
            post.position.set(Math.cos(angle)*radius, 2, Math.sin(angle)*radius);
            walkways.add(post);
        }
    }
    
    walkways.add(deckRing);
    walkways.position.y = 98; // Just below cryo and DAQ levels
    addPart(walkways, 'OperationsDeck', 'Heavy-duty steel grating and walkways', darkSteel, 'Provides physical access for scientists and engineers to manage cryogenics and DAQ systems', 19, ['UmbilicalTower'], 'Maintenance access blocked', [], {x:0, y:0, z:0}, {x:0, y:280, z:0});

    // ==========================================
    // 18. SIMULATED PARTICLE INTERACTION (WIMP EVENT)
    // ==========================================
    const eventGroup = new THREE.Group();
    
    // Core interaction vertex
    const vertex = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 2), neonRed);
    eventGroup.add(vertex);
    
    // Prompt S1 light rays shooting outwards (spherical)
    for(let i=0; i<30; i++) {
        const rayGeo = new THREE.CylinderGeometry(0.05, 0.05, 30, 8);
        const ray = new THREE.Mesh(rayGeo, neonBlue);
        ray.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2);
        vertex.add(ray);
    }
    
    // Electron cloud drifting upwards
    const electronCloud = new THREE.Group();
    for(let i=0; i<50; i++) {
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), yellowGlow);
        e.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*2, (Math.random()-0.5)*3);
        electronCloud.add(e);
    }
    eventGroup.add(electronCloud);
    
    // S2 Proportional Scintillation Flash in Gas Phase
    const s2Flash = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1, 32), neonPurple);
    s2Flash.position.y = 24.5; // Gas phase height
    eventGroup.add(s2Flash);

    eventGroup.visible = false;
    addPart(eventGroup, 'WIMP_Collision_Event', 'Simulated Dark Matter recoil event', neonRed, 'Visualizes the physics mechanism: S1 prompt light followed by upward drifting electrons and S2 gas flash', 20, ['DualPhaseXenonTarget'], 'No Nobel Prize awarded', [], {x:0, y:0, z:0}, {x:0, y:0, z:0});

    const description = "The Ultra-Massive Dual-Phase Liquid Xenon Time Projection Chamber represents the absolute bleeding edge of particle astrophysics. Deployed kilometers underground to escape cosmic radiation, it contains 7 tonnes of liquid xenon cooled by advanced acoustic pulse tube refrigerators. The detector hunts for Weakly Interacting Massive Particles (WIMPs). A WIMP striking a xenon nucleus produces a prompt flash of light (S1), while freed electrons are drifted upwards by a 100kV electric field into a gas phase, generating a massive secondary proportional flash (S2). Arrays of hundreds of ultra-sensitive photomultiplier tubes capture these photons, allowing 3D reconstruction of the event with millimeter precision, while gigantic water and liquid scintillator vetoes reject false signals.";

    const quizQuestions = [
        {
            question: "What is the primary function of the massive Cherenkov Water Shield surrounding the cryostats?",
            options: [
                "To cool the liquid xenon down to -100°C",
                "To act as an active veto by detecting Cherenkov radiation from cosmic muons while passively blocking environmental neutrons",
                "To act as a secondary target medium for WIMP collisions",
                "To maintain the ultra-high vacuum in the outer cryostat"
            ],
            correctAnswer: 1,
            explanation: "The Cherenkov water shield serves a dual purpose: its immense mass passively absorbs neutrons emitted by the surrounding cavern rock, while PMTs inside the tank detect the Cherenkov light produced by cosmic muons passing through, allowing those background events to be tagged and rejected."
        },
        {
            question: "Why does the Time Projection Chamber utilize a dual-phase (liquid and gas) xenon target?",
            options: [
                "Because liquid xenon cannot transmit light on its own",
                "To allow the heavy xenon nuclei to float",
                "To generate two distinct signals (S1 and S2) for precise 3D position reconstruction and powerful background discrimination",
                "Because the pumps can only circulate gaseous xenon"
            ],
            correctAnswer: 2,
            explanation: "A collision creates prompt light (S1) in the liquid. Electrons are drifted into the gas phase at the top, where strong electric fields accelerate them, causing proportional scintillation (a much larger flash, S2). The time delay between S1 and S2 gives the depth (Z), while the top PMTs localize the S2 flash in X and Y."
        },
        {
            question: "What role do the Zirconium Getters in the purification skid play?",
            options: [
                "They act as physical anchors for the heavy cryostat",
                "They strip electronegative impurities (like oxygen and water) from the xenon gas down to parts-per-trillion levels",
                "They generate the high voltage required for the cathode grid",
                "They cool the gaseous xenon back into a liquid state"
            ],
            correctAnswer: 1,
            explanation: "Electrons freed by a particle collision must drift up to a meter through the liquid xenon. If electronegative impurities are present, they will capture the electrons before they reach the top, destroying the S2 signal. Zirconium getters operate at high temperatures to chemically bond and permanently remove these impurities."
        },
        {
            question: "What is the purpose of the Pulse Tube Refrigerators (PTRs) located in the Umbilical Tower?",
            options: [
                "To liquefy the recirculating xenon gas continuously with zero moving parts in the cold zone",
                "To pump water out of the Cherenkov shield",
                "To transmit data from the PMTs to the DAQ servers",
                "To generate acoustic pulses that calibrate the PMT arrays"
            ],
            correctAnswer: 0,
            explanation: "PTRs use acoustic pressure waves in helium gas to provide continuous, extremely reliable cooling power. Because they have no moving parts in the cold head, they introduce minimal vibration, which is critical for maintaining a stable liquid-gas interface in the detector."
        },
        {
            question: "How does the Cathode Grid at the bottom of the TPC contribute to the detection process?",
            options: [
                "It filters physical particulates out of the liquid xenon",
                "It provides structural support for the massive weight of the liquid",
                "It emits electrons to trigger calibration events",
                "It is biased at an extreme negative voltage (e.g., -100 kV) to create the uniform drift electric field"
            ],
            correctAnswer: 3,
            explanation: "The cathode grid creates a powerful electric field between the bottom and the top of the chamber. When a particle collision ionizes xenon atoms, this field prevents the electrons and ions from immediately recombining, forcing the electrons to drift upward towards the extraction grids."
        }
    ];

    let timeOffset = 0;
    
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        timeOffset += 0.01 * speed;

        // 1. DAQ Server Racks blinking furiously
        if (meshes['DAQ_Electronics']) {
            meshes['DAQ_Electronics'].children.forEach(rack => {
                // Skip the frame (index 0) and cables (index last)
                rack.children.forEach(child => {
                    if (child.geometry.type === 'BoxGeometry' && (child.material === greenGlow || child.material === neonBlue || child.material === yellowGlow)) {
                        child.material.emissiveIntensity = Math.random() > 0.85 ? 3 : 0.5;
                    }
                });
            });
        }

        // 2. Cryocooler PTR Motors spinning
        if (meshes['PulseTubeRefrigerators']) {
            meshes['PulseTubeRefrigerators'].children.forEach(ptr => {
                if (ptr.children.length > 2) {
                    ptr.children[2].rotation.z = t * 10; // rotary valve motor
                }
            });
            // Master status indicator pulse
            const master = meshes['PulseTubeRefrigerators'].children[4];
            if (master) master.material.emissiveIntensity = 1 + Math.sin(t * 8) * 1.5;
        }

        // 3. Purification Skid Pumps spinning and heaters glowing
        if (meshes['PurificationSkid']) {
            meshes['PurificationSkid'].children.forEach(child => {
                if (child.children && child.children.length === 3 && child.children[0].geometry.type === 'CylinderGeometry') {
                    // It's a pump
                    child.children[0].rotation.x = t * 20; // rapidly spin pump body
                }
                if (child.children && child.children.length === 3 && child.children[1].material === neonRed) {
                    // It's a getter heater
                    child.children[1].material.emissiveIntensity = 2 + Math.sin(t * 2) * 1; // slow thermal pulse
                }
            });
        }

        // 4. Liquid Xenon Target subtle phase shift effect
        if (meshes['DualPhaseXenonTarget']) {
            const liquid = meshes['DualPhaseXenonTarget'].children[0];
            const gas = meshes['DualPhaseXenonTarget'].children[1];
            liquid.material.opacity = 0.8 + Math.sin(t * 1.5) * 0.1;
            gas.material.opacity = 0.8 + Math.cos(t * 3) * 0.2;
        }

        // 5. Muon Veto PMT Cherenkov Flashes (Background events)
        if (meshes['MuonVetoPMTs']) {
            if (Math.random() > 0.9) {
                // Simulate a cosmic muon passing through
                const count = Math.floor(Math.random() * 5) + 1;
                for(let k=0; k<count; k++) {
                    const pmtIdx = Math.floor(Math.random() * meshes['MuonVetoPMTs'].children.length);
                    const pmt = meshes['MuonVetoPMTs'].children[pmtIdx];
                    if(pmt.children[0]) {
                        pmt.children[0].material = neonBlue; 
                        setTimeout(() => { if(pmt.children[0]) pmt.children[0].material = glass; }, 50);
                    }
                }
            }
        }

        // 6. Neutron Veto Scintillation
        if (meshes['NeutronVetoPanels']) {
            if (Math.random() > 0.98) {
                const panelIdx = Math.floor(Math.random() * meshes['NeutronVetoPanels'].children.length);
                const panel = meshes['NeutronVetoPanels'].children[panelIdx];
                const oldMat = panel.material;
                panel.material = neonPurple;
                setTimeout(() => { panel.material = oldMat; }, 200);
            }
        }

        // 7. WIMP Event Simulation Cycle
        if (meshes['WIMP_Collision_Event']) {
            const cycle = (timeOffset % 8); // 8 second cycle
            const eventGroup = meshes['WIMP_Collision_Event'];
            const vertex = eventGroup.children[0];
            const electronCloud = eventGroup.children[1];
            const s2Flash = eventGroup.children[2];
            
            if (cycle < 0.1) {
                // Initialize event position randomly inside TPC
                const r = Math.random() * 15;
                const theta = Math.random() * Math.PI * 2;
                const y = (Math.random() - 0.5) * 40;
                vertex.position.set(Math.cos(theta)*r, y, Math.sin(theta)*r);
                
                electronCloud.position.copy(vertex.position);
                s2Flash.position.set(vertex.position.x, 24.5, vertex.position.z);
                
                eventGroup.visible = true;
                s2Flash.visible = false;
                electronCloud.visible = false;
                vertex.visible = true;
                vertex.scale.set(1,1,1);
                
            } else if (cycle < 0.3) {
                // S1 Prompt Flash expands
                vertex.scale.multiplyScalar(1.2);
                vertex.material.opacity = (0.3 - cycle) * 5;
            } else if (cycle < 2.0) {
                // Electrons drifting upwards
                vertex.visible = false;
                electronCloud.visible = true;
                
                // Drift velocity
                electronCloud.position.y += 0.5 * speed; 
                
                // Wiggle electrons
                electronCloud.children.forEach(e => {
                    e.position.x += (Math.random() - 0.5) * 0.1;
                    e.position.z += (Math.random() - 0.5) * 0.1;
                });
                
                // Stop drifting when reaching gas phase
                if (electronCloud.position.y > 24) {
                    electronCloud.visible = false;
                }
            } else if (cycle > 2.0 && cycle < 2.4 && electronCloud.position.y > 23) {
                // S2 Proportional Scintillation in gas phase
                electronCloud.visible = false;
                s2Flash.visible = true;
                
                // Massive flash
                const flashIntensity = (2.4 - cycle) * 5;
                s2Flash.scale.set(1 + (2.4-cycle)*2, 1, 1 + (2.4-cycle)*2);
                s2Flash.material.opacity = flashIntensity;
            } else {
                eventGroup.visible = false;
            }
        }
        
        // 8. Calibration spools rotating
        if (meshes['CalibrationDeployment']) {
            meshes['CalibrationDeployment'].children.forEach(child => {
                if(child.type === 'Group') { // Spool group
                    child.children[0].rotation.y = t * 2; // spin drum
                }
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
