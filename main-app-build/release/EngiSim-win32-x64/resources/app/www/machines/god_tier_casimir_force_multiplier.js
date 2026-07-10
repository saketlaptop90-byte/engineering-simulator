import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =========================================================================
    // ADVANCED MATERIAL DEFINITIONS
    // =========================================================================
    const perfectMirror = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.0,
        envMapIntensity: 3.0
    });

    const quantumEmissiveBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });

    const vacuumEmissivePurple = new THREE.MeshStandardMaterial({
        color: 0x6600ff,
        emissive: 0x9900ff,
        emissiveIntensity: 2.5,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: true
    });

    const intensePlasmaRed = new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xff0044,
        emissiveIntensity: 3.5,
        metalness: 0.7,
        roughness: 0.3
    });

    const ultraDarkSteel = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.7
    });
    
    const zeroPointGlow = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8
    });

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.3,
        bumpScale: 0.02
    });

    // =========================================================================
    // GEOMETRY GENERATION HELPER FUNCTIONS
    // =========================================================================

    function createUpperCasimirMirror() {
        const assembly = new THREE.Group();
        
        // Main Plate
        const plateGeo = new THREE.CylinderGeometry(150, 150, 5, 128);
        const plate = new THREE.Mesh(plateGeo, perfectMirror);
        plate.position.y = 2.5;
        assembly.add(plate);
        meshes.upperPlate = plate;

        // Structural Backing Matrix
        const matrixGeo = new THREE.TorusGeometry(140, 4, 32, 100);
        const matrix = new THREE.Mesh(matrixGeo, ultraDarkSteel);
        matrix.rotation.x = Math.PI / 2;
        matrix.position.y = 7;
        assembly.add(matrix);

        // Radial Reinforcements
        for(let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const ribGeo = new THREE.BoxGeometry(140, 3, 2);
            const rib = new THREE.Mesh(ribGeo, steel);
            rib.position.y = 6.5;
            rib.position.x = Math.cos(angle) * 70;
            rib.position.z = Math.sin(angle) * 70;
            rib.rotation.y = -angle;
            assembly.add(rib);
        }

        // Micro-adjustment Actuator Nodes
        meshes.upperActuators = [];
        for(let i = 0; i < 72; i++) {
            const angle = (i / 72) * Math.PI * 2;
            const actGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
            const act = new THREE.Mesh(actGeo, chrome);
            act.position.y = 9;
            act.position.x = Math.cos(angle) * 135;
            act.position.z = Math.sin(angle) * 135;
            assembly.add(act);
            meshes.upperActuators.push(act);
        }

        assembly.position.y = 10;
        return assembly;
    }

    function createLowerCasimirMirror() {
        const assembly = new THREE.Group();
        
        // Main Plate
        const plateGeo = new THREE.CylinderGeometry(150, 150, 5, 128);
        const plate = new THREE.Mesh(plateGeo, perfectMirror);
        plate.position.y = -2.5;
        assembly.add(plate);
        meshes.lowerPlate = plate;

        // Structural Backing Matrix
        const matrixGeo = new THREE.TorusGeometry(140, 4, 32, 100);
        const matrix = new THREE.Mesh(matrixGeo, ultraDarkSteel);
        matrix.rotation.x = Math.PI / 2;
        matrix.position.y = -7;
        assembly.add(matrix);

        // Radial Reinforcements
        for(let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const ribGeo = new THREE.BoxGeometry(140, 3, 2);
            const rib = new THREE.Mesh(ribGeo, steel);
            rib.position.y = -6.5;
            rib.position.x = Math.cos(angle) * 70;
            rib.position.z = Math.sin(angle) * 70;
            rib.rotation.y = -angle;
            assembly.add(rib);
        }

        // Micro-adjustment Actuator Nodes
        meshes.lowerActuators = [];
        for(let i = 0; i < 72; i++) {
            const angle = (i / 72) * Math.PI * 2;
            const actGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
            const act = new THREE.Mesh(actGeo, chrome);
            act.position.y = -9;
            act.position.x = Math.cos(angle) * 135;
            act.position.z = Math.sin(angle) * 135;
            assembly.add(act);
            meshes.lowerActuators.push(act);
        }

        assembly.position.y = -10;
        return assembly;
    }

    function createVacuumFluctuationInducers() {
        const assembly = new THREE.Group();
        meshes.fluctuators = [];
        
        // Create an array of complex shapes outside the plates
        for(let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const radius = 170;
            
            const inducerGroup = new THREE.Group();
            inducerGroup.position.x = Math.cos(angle) * radius;
            inducerGroup.position.z = Math.sin(angle) * radius;
            
            // Core crystal
            const crystalGeo = new THREE.OctahedronGeometry(5, 2);
            const crystal = new THREE.Mesh(crystalGeo, vacuumEmissivePurple);
            inducerGroup.add(crystal);
            
            // Outer Cage
            const cageGeo = new THREE.IcosahedronGeometry(8, 1);
            const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({
                color: 0x333333, wireframe: true, metalness: 1.0
            }));
            inducerGroup.add(cage);

            // Connection arm
            const armGeo = new THREE.CylinderGeometry(1, 1, 20, 8);
            const arm = new THREE.Mesh(armGeo, darkSteel);
            arm.rotation.z = Math.PI / 2;
            arm.position.x = -10;
            inducerGroup.add(arm);

            inducerGroup.lookAt(0, 0, 0);
            
            assembly.add(inducerGroup);
            meshes.fluctuators.push({
                group: inducerGroup,
                crystal: crystal,
                cage: cage,
                baseAngle: angle
            });
        }
        
        return assembly;
    }

    function createGravitationalStrutArray() {
        const assembly = new THREE.Group();
        meshes.struts = [];
        
        // 8 massive columns
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 120;
            
            const strutGroup = new THREE.Group();
            strutGroup.position.x = Math.cos(angle) * radius;
            strutGroup.position.z = Math.sin(angle) * radius;

            // Main Piston Cylinder
            const cylinderGeo = new THREE.CylinderGeometry(8, 8, 80, 32);
            const cylinder = new THREE.Mesh(cylinderGeo, ultraDarkSteel);
            strutGroup.add(cylinder);

            // Inner Piston Rod (visible at gaps)
            const rodGeo = new THREE.CylinderGeometry(5, 5, 100, 32);
            const rod = new THREE.Mesh(rodGeo, chrome);
            strutGroup.add(rod);

            // Hydraulic Ring Constraints
            for(let j = 0; j < 5; j++) {
                const ringGeo = new THREE.TorusGeometry(9, 1.5, 16, 32);
                const ring = new THREE.Mesh(ringGeo, copper);
                ring.position.y = -30 + (j * 15);
                strutGroup.add(ring);
            }

            // Energy pulsing tracks along the strut
            const trackGeo = new THREE.BoxGeometry(1, 78, 1);
            const track1 = new THREE.Mesh(trackGeo, quantumEmissiveBlue);
            track1.position.set(8.5, 0, 0);
            const track2 = new THREE.Mesh(trackGeo, quantumEmissiveBlue);
            track2.position.set(-8.5, 0, 0);
            const track3 = new THREE.Mesh(trackGeo, quantumEmissiveBlue);
            track3.position.set(0, 0, 8.5);
            const track4 = new THREE.Mesh(trackGeo, quantumEmissiveBlue);
            track4.position.set(0, 0, -8.5);
            
            strutGroup.add(track1, track2, track3, track4);

            assembly.add(strutGroup);
            meshes.struts.push({
                group: strutGroup,
                rod: rod,
                tracks: [track1, track2, track3, track4]
            });
        }
        return assembly;
    }

    function createHydraulicCounterPress() {
        const assembly = new THREE.Group();
        meshes.hydraulics = [];

        // 16 secondary struts
        for(let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const radius = 80;
            
            const hydGroup = new THREE.Group();
            hydGroup.position.x = Math.cos(angle) * radius;
            hydGroup.position.z = Math.sin(angle) * radius;

            // Base housing
            const baseGeo = new THREE.CylinderGeometry(4, 4, 20, 16);
            const base = new THREE.Mesh(baseGeo, steel);
            base.position.y = 20;
            hydGroup.add(base);

            // Lower housing
            const lowerBase = new THREE.Mesh(baseGeo, steel);
            lowerBase.position.y = -20;
            hydGroup.add(lowerBase);

            // Piston shaft
            const shaftGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const shaft = new THREE.Mesh(shaftGeo, chrome);
            hydGroup.add(shaft);

            // Accordion boot (rubber cover)
            const bootGeo = new THREE.CylinderGeometry(3.5, 3.5, 10, 16, 10, false);
            // Simulate folds with sine wave on vertices (conceptually, we just use a ribbed material or many toruses)
            for(let k=0; k<8; k++){
                const ribGeo = new THREE.TorusGeometry(3.2, 0.5, 8, 16);
                const rib = new THREE.Mesh(ribGeo, rubber);
                rib.position.y = -4 + k*1.1;
                hydGroup.add(rib);
            }

            assembly.add(hydGroup);
            meshes.hydraulics.push({
                group: hydGroup,
                shaft: shaft
            });
        }
        return assembly;
    }

    function createZeroPointEnergyTap() {
        const assembly = new THREE.Group();
        
        // Central extremely complex lathe geometry
        const points = [];
        for ( let i = 0; i <= 60; i ++ ) {
            const x = Math.sin(i * 0.2) * 5 + 2 + (i * 0.05);
            const y = (i - 30) * 1.5;
            points.push( new THREE.Vector2( x, y ) );
        }
        const tapGeo = new THREE.LatheGeometry( points, 64 );
        const tap = new THREE.Mesh(tapGeo, goldFoil);
        assembly.add(tap);

        // Core glowing plasma element inside tap (visible through gaps or at ends)
        const coreGeo = new THREE.CylinderGeometry(2, 2, 90, 32);
        const core = new THREE.Mesh(coreGeo, zeroPointGlow);
        assembly.add(core);

        meshes.zeroPointTap = tap;
        meshes.zeroPointCore = core;

        // Emitter rings
        meshes.emitterRings = [];
        for(let i = 0; i < 5; i++) {
            const ringGeo = new THREE.TorusGeometry(12, 1, 16, 64);
            const ring = new THREE.Mesh(ringGeo, intensePlasmaRed);
            ring.position.y = -20 + (i * 10);
            ring.rotation.x = Math.PI / 2;
            assembly.add(ring);
            meshes.emitterRings.push(ring);
        }

        return assembly;
    }

    function createQuantumFieldContainment() {
        const assembly = new THREE.Group();
        
        // Large spherical wireframe
        const sphereGeo = new THREE.SphereGeometry(200, 64, 64);
        const sphere = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({
            color: 0x0044ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
            emissive: 0x002288
        }));
        assembly.add(sphere);
        meshes.containmentSphere = sphere;

        // Orbital bands
        meshes.orbitalBands = [];
        for(let i = 0; i < 3; i++) {
            const bandGeo = new THREE.TorusGeometry(205, 1.5, 16, 128);
            const band = new THREE.Mesh(bandGeo, quantumEmissiveBlue);
            
            if(i === 0) band.rotation.x = Math.PI / 2;
            if(i === 1) band.rotation.y = Math.PI / 2;
            if(i === 2) {
                band.rotation.x = Math.PI / 4;
                band.rotation.y = Math.PI / 4;
            }
            
            assembly.add(band);
            meshes.orbitalBands.push(band);
        }

        return assembly;
    }

    function createCryogenicCoolingTubes() {
        const assembly = new THREE.Group();
        meshes.coolantTubes = [];

        // Generate hundreds of complex curved tubes wrapping around the base
        for(let i = 0; i < 48; i++) {
            const angle = (i / 48) * Math.PI * 2;
            
            // create a custom curve
            class CustomCurve extends THREE.Curve {
                constructor(scale = 1, angleOffset = 0) {
                    super();
                    this.scale = scale;
                    this.angleOffset = angleOffset;
                }
                getPoint(t, optionalTarget = new THREE.Vector3()) {
                    const tx = Math.cos(this.angleOffset + t * Math.PI) * (150 + Math.sin(t * Math.PI * 4) * 20);
                    const ty = (t - 0.5) * 120;
                    const tz = Math.sin(this.angleOffset + t * Math.PI) * (150 + Math.sin(t * Math.PI * 4) * 20);
                    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
                }
            }

            const path = new CustomCurve(1, angle);
            const tubeGeo = new THREE.TubeGeometry(path, 64, 1.5, 8, false);
            const tube = new THREE.Mesh(tubeGeo, glass); // glass to see coolant
            
            // Inner coolant fluid
            const fluidGeo = new THREE.TubeGeometry(path, 64, 1.2, 8, false);
            const fluid = new THREE.Mesh(fluidGeo, new THREE.MeshStandardMaterial({
                color: 0x00ffff, emissive: 0x00aaaa, emissiveIntensity: 1.0, transparent: true, opacity: 0.8
            }));

            assembly.add(tube);
            assembly.add(fluid);
            meshes.coolantTubes.push(fluid); // animate fluid emissiveness
        }

        return assembly;
    }

    function createMagneticLevitationRings() {
        const assembly = new THREE.Group();
        meshes.levRings = [];

        // Top ring
        const topRingGeo = new THREE.TorusGeometry(180, 8, 32, 128);
        const topRing = new THREE.Mesh(topRingGeo, darkSteel);
        topRing.position.y = 80;
        topRing.rotation.x = Math.PI / 2;
        
        // Bottom ring
        const botRingGeo = new THREE.TorusGeometry(180, 8, 32, 128);
        const botRing = new THREE.Mesh(botRingGeo, darkSteel);
        botRing.position.y = -80;
        botRing.rotation.x = Math.PI / 2;

        // Add magnetic nodes on the rings
        for(let i=0; i<36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const nodeGeo = new THREE.BoxGeometry(20, 10, 20);
            
            const topNode = new THREE.Mesh(nodeGeo, copper);
            topNode.position.x = Math.cos(angle) * 180;
            topNode.position.z = Math.sin(angle) * 180;
            topNode.position.y = 80;
            topNode.lookAt(0, 80, 0);
            assembly.add(topNode);

            const botNode = new THREE.Mesh(nodeGeo, copper);
            botNode.position.x = Math.cos(angle) * 180;
            botNode.position.z = Math.sin(angle) * 180;
            botNode.position.y = -80;
            botNode.lookAt(0, -80, 0);
            assembly.add(botNode);
        }

        assembly.add(topRing);
        assembly.add(botRing);
        
        meshes.levRings.push(topRing, botRing);
        return assembly;
    }

    function createOperatorCommandBridge() {
        const assembly = new THREE.Group();
        
        // Placed on an extension arm outside the containment sphere
        const armGeo = new THREE.BoxGeometry(40, 5, 150);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.set(0, 0, 200);
        assembly.add(arm);

        // Main Cabin
        const cabinGeo = new THREE.CylinderGeometry(25, 20, 30, 8);
        const cabin = new THREE.Mesh(cabinGeo, darkSteel);
        cabin.position.set(0, 15, 250);
        
        // Window
        const windowGeo = new THREE.CylinderGeometry(25.5, 20.5, 15, 8, 1, false, 0, Math.PI);
        const win = new THREE.Mesh(windowGeo, tinted);
        win.position.set(0, 15, 250);
        win.rotation.y = Math.PI;

        assembly.add(cabin);
        assembly.add(win);

        // Control Consoles inside (visible through window)
        const consoleGeo = new THREE.BoxGeometry(10, 5, 20);
        const controlPanel = new THREE.Mesh(consoleGeo, plastic);
        controlPanel.position.set(0, 5, 240);
        assembly.add(controlPanel);

        // Holographic display table
        const holoGeo = new THREE.CylinderGeometry(5, 5, 2, 16);
        const holoTable = new THREE.Mesh(holoGeo, chrome);
        holoTable.position.set(0, 5, 255);
        assembly.add(holoTable);

        const hologramGeo = new THREE.ConeGeometry(4, 10, 16);
        const hologram = new THREE.Mesh(hologramGeo, quantumEmissiveBlue);
        hologram.position.set(0, 12, 255);
        assembly.add(hologram);
        meshes.bridgeHolo = hologram;

        return assembly;
    }

    function createPlasmaExhaustVents() {
        const assembly = new THREE.Group();
        meshes.plasmaVents = [];
        meshes.exhaustPlumes = [];

        for(let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
            const radius = 190;
            
            const ventGroup = new THREE.Group();
            ventGroup.position.x = Math.cos(angle) * radius;
            ventGroup.position.z = Math.sin(angle) * radius;
            ventGroup.position.y = -60;

            const baseGeo = new THREE.CylinderGeometry(15, 10, 20, 16);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            ventGroup.add(base);

            const nozzleGeo = new THREE.CylinderGeometry(10, 18, 15, 16);
            const nozzle = new THREE.Mesh(nozzleGeo, steel);
            nozzle.position.y = -17.5;
            ventGroup.add(nozzle);

            // Plasma Plume
            const plumeGeo = new THREE.ConeGeometry(15, 60, 16);
            const plume = new THREE.Mesh(plumeGeo, intensePlasmaRed);
            plume.position.y = -45;
            plume.rotation.x = Math.PI;
            ventGroup.add(plume);

            assembly.add(ventGroup);
            meshes.plasmaVents.push(ventGroup);
            meshes.exhaustPlumes.push(plume);
        }
        
        return assembly;
    }

    function createResonanceDampeningBaffles() {
        const assembly = new THREE.Group();
        
        // Massive fin structures around the equator
        for(let i = 0; i < 120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const radius = 160;
            
            const shape = new THREE.Shape();
            shape.moveTo(0, -30);
            shape.lineTo(40, -10);
            shape.lineTo(40, 10);
            shape.lineTo(0, 30);
            shape.lineTo(-5, 0);
            shape.lineTo(0, -30);

            const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
            const finGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const fin = new THREE.Mesh(finGeo, steel);
            
            fin.position.x = Math.cos(angle) * radius;
            fin.position.z = Math.sin(angle) * radius;
            fin.rotation.y = -angle;
            
            assembly.add(fin);
        }

        return assembly;
    }

    function createEnergyDistributionManifold() {
        const assembly = new THREE.Group();
        
        // A tangle of pipes exiting the bottom tap
        for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            
            class PipeCurve extends THREE.Curve {
                constructor(a) { super(); this.a = a; }
                getPoint(t, target = new THREE.Vector3()) {
                    const r = 20 + t * 150;
                    const x = Math.cos(this.a + t*Math.PI) * r;
                    const y = -40 - t * 100;
                    const z = Math.sin(this.a + t*Math.PI) * r;
                    return target.set(x, y, z);
                }
            }
            const path = new PipeCurve(angle);
            const pipeGeo = new THREE.TubeGeometry(path, 64, 4, 12, false);
            const pipe = new THREE.Mesh(pipeGeo, copper);
            assembly.add(pipe);

            // Add coupling joints
            const jointGeo = new THREE.CylinderGeometry(6, 6, 10, 16);
            const joint = new THREE.Mesh(jointGeo, darkSteel);
            const point = path.getPoint(0.5);
            joint.position.copy(point);
            joint.lookAt(path.getPoint(0.51));
            joint.rotation.x += Math.PI/2;
            assembly.add(joint);
        }

        return assembly;
    }

    function createSubatomicSensorArray() {
        const assembly = new THREE.Group();
        meshes.sensorDish = [];

        // Dishes mounted around the containment sphere
        for(let i=0; i<6; i++) {
            const angle = (i/6) * Math.PI * 2;
            
            const sensorGroup = new THREE.Group();
            sensorGroup.position.x = Math.cos(angle) * 220;
            sensorGroup.position.z = Math.sin(angle) * 220;
            sensorGroup.position.y = 40;
            sensorGroup.lookAt(0,0,0);

            const dishGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI*2, 0, Math.PI/2.5);
            const dish = new THREE.Mesh(dishGeo, chrome);
            dish.rotation.x = -Math.PI/2;
            sensorGroup.add(dish);

            const antennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 20);
            const antenna = new THREE.Mesh(antennaGeo, copper);
            antenna.position.z = 10;
            antenna.rotation.x = Math.PI/2;
            sensorGroup.add(antenna);
            
            const tipGeo = new THREE.SphereGeometry(2, 16, 16);
            const tip = new THREE.Mesh(tipGeo, quantumEmissiveBlue);
            tip.position.z = 20;
            sensorGroup.add(tip);

            assembly.add(sensorGroup);
            meshes.sensorDish.push(sensorGroup);
        }

        return assembly;
    }

    function createSafetyOverrideCouplings() {
        const assembly = new THREE.Group();
        meshes.safetyBolts = [];

        // Massive explosive bolts connecting the strut array to the plates
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const radius = 120;

            // Top bolts
            const topBoltGroup = new THREE.Group();
            topBoltGroup.position.set(Math.cos(angle)*radius, 35, Math.sin(angle)*radius);
            
            const boltGeo = new THREE.CylinderGeometry(12, 12, 15, 6); // Hex bolt
            const bolt = new THREE.Mesh(boltGeo, steel);
            topBoltGroup.add(bolt);

            const chargeGeo = new THREE.CylinderGeometry(12.5, 12.5, 5, 16);
            const charge = new THREE.Mesh(chargeGeo, intensePlasmaRed); // The explosive part
            topBoltGroup.add(charge);
            
            assembly.add(topBoltGroup);
            meshes.safetyBolts.push(charge);

            // Bottom bolts
            const botBoltGroup = new THREE.Group();
            botBoltGroup.position.set(Math.cos(angle)*radius, -35, Math.sin(angle)*radius);
            const botBolt = new THREE.Mesh(boltGeo, steel);
            const botCharge = new THREE.Mesh(chargeGeo, intensePlasmaRed);
            botBoltGroup.add(botBolt, botCharge);
            
            assembly.add(botBoltGroup);
            meshes.safetyBolts.push(botCharge);
        }

        return assembly;
    }

    function createSuperconductingCoilWindings() {
        const assembly = new THREE.Group();
        meshes.coils = [];
        
        // Massive coils wrapping the primary struts
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const radius = 120;
            
            const coilGroup = new THREE.Group();
            coilGroup.position.x = Math.cos(angle) * radius;
            coilGroup.position.z = Math.sin(angle) * radius;

            // Create a spiral tube using a custom curve
            class SpiralCurve extends THREE.Curve {
                getPoint(t, target = new THREE.Vector3()) {
                    const turns = 20;
                    const r = 12;
                    const x = Math.cos(t * Math.PI * 2 * turns) * r;
                    const z = Math.sin(t * Math.PI * 2 * turns) * r;
                    const y = (t - 0.5) * 70;
                    return target.set(x, y, z);
                }
            }
            const path = new SpiralCurve();
            const coilGeo = new THREE.TubeGeometry(path, 400, 1.5, 8, false);
            const coil = new THREE.Mesh(coilGeo, copper);
            
            coilGroup.add(coil);
            assembly.add(coilGroup);
            meshes.coils.push(coilGroup);
        }

        return assembly;
    }

    // =========================================================================
    // BUILD MACHINE
    // =========================================================================
    group.add(createUpperCasimirMirror());
    group.add(createLowerCasimirMirror());
    group.add(createVacuumFluctuationInducers());
    group.add(createGravitationalStrutArray());
    group.add(createHydraulicCounterPress());
    group.add(createZeroPointEnergyTap());
    group.add(createQuantumFieldContainment());
    group.add(createCryogenicCoolingTubes());
    group.add(createMagneticLevitationRings());
    group.add(createOperatorCommandBridge());
    group.add(createPlasmaExhaustVents());
    group.add(createResonanceDampeningBaffles());
    group.add(createEnergyDistributionManifold());
    group.add(createSubatomicSensorArray());
    group.add(createSafetyOverrideCouplings());
    group.add(createSuperconductingCoilWindings());

    // Master scaling
    group.scale.set(0.05, 0.05, 0.05);

    // =========================================================================
    // PARTS DEFINITIONS
    // =========================================================================
    parts.push({
        name: "Upper Casimir Mirror Plate",
        description: "A perfectly flat, 300-meter diameter macroscopic mirror constructed from incredibly dense degenerate matter. It is polished to sub-nanometer precision to interact optimally with the quantum vacuum. The immense mass provides the primary boundary condition for excluding virtual particle wavelengths.",
        material: "PerfectMirror / Degenerate Matter Alloy",
        function: "Excludes specific wavelengths of quantum vacuum fluctuations, creating a region of negative pressure between it and the lower plate.",
        assemblyOrder: 1,
        connections: ["GravitationalStrutArray", "SafetyOverrideCouplings", "HydraulicCounter-Press"],
        failureEffect: "If surface precision degrades, the Casimir force becomes asymmetric, violently tearing the plate apart due to sheer quantum stress.",
        cascadeFailures: ["ZeroPointEnergyTap", "QuantumFieldContainment"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    parts.push({
        name: "Lower Casimir Mirror Plate",
        description: "The counterpart to the upper plate. While identical in composition, it is wired directly into the planetary bedrock via gravitational anchors to prevent the entire structure from being sucked into the vacuum anomaly.",
        material: "PerfectMirror / Degenerate Matter Alloy",
        function: "Forms the second boundary for the Casimir cavity. The pressure of virtual particles pounding against the outside of this plate attempts to push it upward into the upper plate.",
        assemblyOrder: 2,
        connections: ["GravitationalStrutArray", "EnergyDistributionManifold", "SafetyOverrideCouplings"],
        failureEffect: "Sudden collapse of the nanometer gap, resulting in cold fusion of the two plates and a localized spacetime fracture.",
        cascadeFailures: ["UpperCasimirMirror", "GravitationalStrutArray"],
        originalPosition: {x: 0, y: -10, z: 0},
        explodedPosition: {x: 0, y: -150, z: 0}
    });

    parts.push({
        name: "Vacuum Fluctuation Inducers",
        description: "24 perimeter nodes that synthetically stimulate the creation of virtual particle-antiparticle pairs outside the Casimir cavity. By increasing the energy density of the external vacuum, the pressure differential across the plates is multiplied by a factor of 10^12.",
        material: "VacuumEmissivePurple / Icosahedron Cages",
        function: "Stimulates external quantum vacuum to macro-scale pressures.",
        assemblyOrder: 3,
        connections: ["QuantumFieldContainment"],
        failureEffect: "Loss of differential pressure; the plates snap back to resting tension, shattering the internal tap.",
        cascadeFailures: ["ZeroPointEnergyTap"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 200, y: 0, z: 200}
    });

    parts.push({
        name: "Zero-Point Energy Tap",
        description: "The central spindle that penetrates the quantum void between the plates. It acts as an inductive siphon, translating the immense static pressure of the Casimir effect into a rushing current of raw electromagnetic energy.",
        material: "Gold Foil / Zero Point Glow",
        function: "Harvests the resulting energy from the manipulated vacuum state.",
        assemblyOrder: 4,
        connections: ["EnergyDistributionManifold", "UpperCasimirMirror", "LowerCasimirMirror"],
        failureEffect: "Energy backs up, superheating the mirrors until they vaporize, releasing all stored vacuum energy in a devastating omnidirectional flash.",
        cascadeFailures: ["CryogenicCoolingTubes", "PlasmaExhaustVents"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 300}
    });

    parts.push({
        name: "Gravitational Strut Array",
        description: "Eight massive columns that utilize artificial gravity fields and ultra-dense hydraulic fluids to keep the plates apart. The plates want to slam together with the force of several colliding moons; these struts are the only thing stopping them.",
        material: "UltraDarkSteel / Chrome Pistons",
        function: "Provides the primary opposing force to maintain the macroscopic Casimir gap.",
        assemblyOrder: 5,
        connections: ["UpperCasimirMirror", "LowerCasimirMirror", "SuperconductingCoilWindings"],
        failureEffect: "Instantaneous plate collision.",
        cascadeFailures: ["UpperCasimirMirror", "LowerCasimirMirror", "ZeroPointEnergyTap"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -200, y: 0, z: -200}
    });

    parts.push({
        name: "Hydraulic Counter-Press",
        description: "16 fast-response secondary struts. While the primary struts handle the main load, these hydraulics handle the micro-vibrations and quantum jitters, adjusting millions of times per second to keep the plates perfectly parallel.",
        material: "Steel / Chrome / Rubber",
        function: "Dynamic vibration dampening and parallel alignment maintenance.",
        assemblyOrder: 6,
        connections: ["UpperCasimirMirror", "LowerCasimirMirror"],
        failureEffect: "The plates become unaligned by a fraction of a degree, causing lateral sheer forces that snap the primary struts.",
        cascadeFailures: ["GravitationalStrutArray"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 150, y: 0, z: -150}
    });

    parts.push({
        name: "Quantum Field Containment Sphere",
        description: "A faint, glowing energy grid that limits the area of effect. Without this, the machine would suck the ambient vacuum energy from the surrounding atmosphere, causing localized freezing and atmospheric collapse.",
        material: "QuantumEmissiveBlue",
        function: "Isolates the experiment from the local spacetime environment.",
        assemblyOrder: 7,
        connections: ["VacuumFluctuationInducers", "SubatomicSensorArray"],
        failureEffect: "Immediate freezing of the surrounding 50km radius as heat is converted into virtual particles.",
        cascadeFailures: ["OperatorCommandBridge"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 300, z: 0}
    });

    parts.push({
        name: "Cryogenic Cooling Tubes",
        description: "Hundreds of complex, interwoven pipes pumping liquid helium-4. The struts and coils generate immense heat due to the extreme loads and currents, requiring constant thermal management.",
        material: "Glass / Cyan Coolant",
        function: "Prevents thermal degradation of the superconducting coils and struts.",
        assemblyOrder: 8,
        connections: ["SuperconductingCoilWindings", "GravitationalStrutArray"],
        failureEffect: "Superconductors quench, gravity fields fail, and the plates collide.",
        cascadeFailures: ["GravitationalStrutArray", "SuperconductingCoilWindings"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -100, y: 100, z: 100}
    });

    parts.push({
        name: "Magnetic Levitation Rings",
        description: "Two colossal rings at the top and bottom of the facility. They generate a localized magnetic cradle that isolates the entire machine from seismic activity.",
        material: "DarkSteel / Copper Nodes",
        function: "Seismic isolation and structural stabilization.",
        assemblyOrder: 9,
        connections: ["ResonanceDampeningBaffles"],
        failureEffect: "Earthquakes transfer directly into the mirrors, disrupting the Casimir effect.",
        cascadeFailures: ["HydraulicCounter-Press"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -250, z: 0}
    });

    parts.push({
        name: "Operator Command Bridge",
        description: "Suspended on a boom arm outside the main containment sphere, this heavily shielded bunker houses the brave physicists and engineers who monitor the machine.",
        material: "DarkSteel / Tinted Glass",
        function: "Human oversight and manual override control.",
        assemblyOrder: 10,
        connections: ["SubatomicSensorArray"],
        failureEffect: "Loss of manual control. The AI must manage the quantum jitters alone.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 400}
    });

    parts.push({
        name: "Plasma Exhaust Vents",
        description: "Four massive thruster-like vents pointing downwards. Not all harvested zero-point energy can be safely routed; excess is converted to plasma and vented to prevent core overload.",
        material: "DarkSteel / IntensePlasmaRed",
        function: "Waste heat and excess energy thermal dissipation.",
        assemblyOrder: 11,
        connections: ["ZeroPointEnergyTap", "EnergyDistributionManifold"],
        failureEffect: "Energy backup in the tap, leading to catastrophic explosion.",
        cascadeFailures: ["ZeroPointEnergyTap"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 200, y: -200, z: 200}
    });

    parts.push({
        name: "Resonance Dampening Baffles",
        description: "120 massive fins radiating from the equatorial belt. They physically absorb and dissipate acoustic and mechanical vibrations generated by the hydraulic pumps.",
        material: "Steel Extrusions",
        function: "Acoustic and mechanical noise reduction.",
        assemblyOrder: 12,
        connections: ["MagneticLevitationRings", "HydraulicCounter-Press"],
        failureEffect: "Vibrations build up into a resonant frequency that shatters the mirror plates.",
        cascadeFailures: ["UpperCasimirMirror", "LowerCasimirMirror"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -300, y: 0, z: 0}
    });

    parts.push({
        name: "Energy Distribution Manifold",
        description: "A tangle of heavily shielded pipes exiting the base of the machine, carrying the immense electrical current to the global power grid.",
        material: "Copper / DarkSteel Joints",
        function: "Exports harvested power.",
        assemblyOrder: 13,
        connections: ["ZeroPointEnergyTap"],
        failureEffect: "Grid disconnect; machine must emergency-vent all power through plasma vents.",
        cascadeFailures: ["PlasmaExhaustVents"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -300, z: 0}
    });

    parts.push({
        name: "Subatomic Sensor Array",
        description: "Delicate instrumentation dishes mounted around the sphere. They monitor the density of virtual particles to ensure the vacuum isn't being depleted faster than it replenishes.",
        material: "Chrome / QuantumEmissiveBlue",
        function: "Monitors local vacuum state.",
        assemblyOrder: 14,
        connections: ["OperatorCommandBridge"],
        failureEffect: "Blind operation. Operators cannot see if a localized false vacuum collapse is imminent.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 250, y: 150, z: -250}
    });

    parts.push({
        name: "Safety Override Couplings",
        description: "Explosive bolts connecting the struts. In a worst-case scenario, they detonate, immediately severing the connection and allowing the plates to smash together in a controlled (though totally destructive) manner, sealing the quantum rift.",
        material: "Steel / IntensePlasmaRed",
        function: "Emergency scuttling charge.",
        assemblyOrder: 15,
        connections: ["GravitationalStrutArray", "UpperCasimirMirror"],
        failureEffect: "Inability to abort. A runaway reaction could consume the planet.",
        cascadeFailures: ["All"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -150, y: 200, z: 150}
    });

    parts.push({
        name: "Superconducting Coil Windings",
        description: "Hundreds of turns of superconducting wire wrapping the main struts. They generate the gravity-shear fields required to hold the plates apart against the force of the vacuum.",
        material: "Copper Spirals",
        function: "Generates structural integrity fields.",
        assemblyOrder: 16,
        connections: ["GravitationalStrutArray", "CryogenicCoolingTubes"],
        failureEffect: "Loss of magnetic field, resulting in immediate strut failure under the crushing weight of the Casimir force.",
        cascadeFailures: ["GravitationalStrutArray"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 200, y: 200, z: -200}
    });

    // =========================================================================
    // QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "In standard Quantum Electrodynamics (QED), the Casimir effect arises because boundary conditions (like perfectly conducting plates) alter the zero-point energy of the vacuum. If the distance 'a' between two uncharged, perfectly conducting parallel plates is halved, how does the magnitude of the attractive Casimir force per unit area change?",
            options: [
                "It increases by a factor of 2.",
                "It increases by a factor of 4.",
                "It increases by a factor of 8.",
                "It increases by a factor of 16."
            ],
            correctAnswer: 3,
            explanation: "The Casimir force per unit area is proportional to 1/a^4 (F/A = - (pi^2 * hbar * c) / (240 * a^4)). Therefore, halving the distance 'a' increases the force by a factor of 2^4, which is 16. This extreme scaling is why maintaining nanometer gaps in macroscopic plates requires god-tier engineering."
        },
        {
            question: "The 'Vacuum Fluctuation Inducers' in this machine attempt to artificially increase the energy density of the exterior vacuum state. According to the Scharnhorst effect, how would the speed of light (for photons traveling perpendicular to the plates) behave inside a Casimir vacuum compared to the standard vacuum 'c'?",
            options: [
                "It would be strictly equal to c, preserving local Lorentz invariance.",
                "It would be slightly greater than c due to the reduced vacuum energy density.",
                "It would be slightly less than c due to photon-virtual particle scattering.",
                "It would be zero, as photons cannot propagate between perfectly conducting boundaries."
            ],
            correctAnswer: 1,
            explanation: "The Scharnhorst effect predicts that light signals traveling transversely between two closely spaced conducting plates (in the Casimir vacuum) would travel slightly faster than c. This is because the suppressed virtual particle interactions lower the vacuum refractive index below 1. While mathematically fascinating, the effect is minuscule and doesn't violate causality."
        },
        {
            question: "To prevent the macroscopic plates from fusing together, 'Gravitational Struts' are utilized. If the Casimir force between these massive plates exceeds the threshold to cause a localized vacuum decay, what theoretical catastrophe might occur?",
            options: [
                "A runaway chain reaction converting the plates into degenerate neutron matter.",
                "The spontaneous generation of a naked singularity.",
                "A transition to a true vacuum state, expanding outward at the speed of light and destroying all baryonic matter.",
                "The immediate evaporation of the machine via Hawking radiation."
            ],
            correctAnswer: 2,
            explanation: "If our universe's vacuum is metastable (a 'false vacuum'), a sufficiently extreme localized energy event could provide the activation energy for a phase transition. This would create a bubble of 'true vacuum' with lower energy, which would expand outward at the speed of light, altering the fundamental constants of nature and destroying everything it touches."
        },
        {
            question: "The 'Zero-Point Energy Tap' harvests power from vacuum fluctuations. Assuming you can dynamically oscillate the distance between the plates, what phenomenon allows for the generation of real photons from the quantum vacuum?",
            options: [
                "The Static Casimir Effect",
                "The Dynamical Casimir Effect",
                "The Aharonov-Bohm Effect",
                "The Schwinger Mechanism"
            ],
            correctAnswer: 1,
            explanation: "The Dynamical Casimir Effect occurs when a boundary (like a mirror) accelerates at relativistic speeds, converting virtual photons from the quantum vacuum into real, observable photons. Oscillating the plates rapidly is the theoretical mechanism by which this machine would 'tap' energy from the void."
        },
        {
            question: "The 'Cryogenic Cooling Tubes' pump liquid Helium-4. Why is supercooling absolutely critical when dealing with macroscopic Casimir forces in this context?",
            options: [
                "To freeze the virtual particles in place, reducing pressure.",
                "Because thermal fluctuations (thermal Casimir-Lifshitz force) at high temperatures overwhelm the pure quantum zero-point force, changing the force scaling.",
                "To increase the mass of the plates via Einstein's mass-energy equivalence.",
                "To prevent the spontaneous emission of alpha particles from the degenerate matter."
            ],
            correctAnswer: 1,
            explanation: "At zero temperature, the pure quantum Casimir effect dominates (scaling as 1/a^4). At finite, higher temperatures, thermal fluctuations of the electromagnetic field contribute significantly. For large separations or high temps, the thermal Casimir-Lifshitz force becomes classical and scales as 1/a^3. To maintain pure quantum force harvesting, the system must remain incredibly cold."
        }
    ];

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================
    const animate = function(time, speed) {
        // High-frequency jitter for the mirror plates to simulate unimaginable tension
        const jitterFreq = time * 50 * speed;
        const jitterAmp = 0.05 * speed;
        
        if(meshes.upperPlate && meshes.lowerPlate) {
            meshes.upperPlate.position.y = 2.5 + Math.sin(jitterFreq) * jitterAmp;
            meshes.lowerPlate.position.y = -2.5 + Math.cos(jitterFreq * 1.1) * jitterAmp;
        }

        // Actuators vibrating rapidly
        if(meshes.upperActuators) {
            meshes.upperActuators.forEach((act, idx) => {
                act.scale.y = 1.0 + Math.sin(time * 20 + idx) * 0.1 * speed;
            });
        }
        if(meshes.lowerActuators) {
            meshes.lowerActuators.forEach((act, idx) => {
                act.scale.y = 1.0 + Math.cos(time * 22 + idx) * 0.1 * speed;
            });
        }

        // Vacuum Inducers spinning and pulsing
        if(meshes.fluctuators) {
            meshes.fluctuators.forEach((fluc, idx) => {
                fluc.crystal.rotation.x += 0.05 * speed;
                fluc.crystal.rotation.y += 0.07 * speed;
                fluc.cage.rotation.z -= 0.02 * speed;
                fluc.cage.rotation.y += 0.01 * speed;

                // Pulsing emissive intensity
                const pulse = Math.abs(Math.sin(time * 5 + fluc.baseAngle));
                fluc.crystal.material.emissiveIntensity = 1.0 + pulse * 3.0;
                
                // Slight floating movement
                fluc.group.position.y = Math.sin(time * 2 + idx) * 5;
            });
        }

        // Gravitational Struts pulsing energy tracks
        if(meshes.struts) {
            meshes.struts.forEach((strut, idx) => {
                const trackPulse = Math.abs(Math.sin(time * 8 - idx));
                strut.tracks.forEach(t => {
                    t.material.emissiveIntensity = trackPulse * 4.0;
                });
                
                // The chrome rod strains slightly
                strut.rod.scale.y = 1.0 + Math.sin(time * 15 + idx) * 0.01;
            });
        }

        // Hydraulic Counter-Press piston pumping
        if(meshes.hydraulics) {
            meshes.hydraulics.forEach((hyd, idx) => {
                hyd.shaft.scale.y = 1.0 + Math.sin(time * 10 + idx * 0.5) * 0.2 * speed;
            });
        }

        // Zero-Point Tap rotation and pulsing
        if(meshes.zeroPointTap && meshes.zeroPointCore) {
            meshes.zeroPointTap.rotation.y = time * 2 * speed;
            meshes.zeroPointCore.material.emissiveIntensity = 4.0 + Math.sin(time * 10) * 2.0;
            meshes.zeroPointCore.scale.x = 1.0 + Math.sin(time * 30) * 0.1;
            meshes.zeroPointCore.scale.z = 1.0 + Math.cos(time * 30) * 0.1;
        }

        if(meshes.emitterRings) {
            meshes.emitterRings.forEach((ring, idx) => {
                ring.scale.setScalar(1.0 + Math.sin(time * 5 + idx) * 0.1);
                ring.rotation.z = time * speed;
            });
        }

        // Containment Sphere rotation
        if(meshes.containmentSphere) {
            meshes.containmentSphere.rotation.y = time * 0.2 * speed;
            meshes.containmentSphere.rotation.z = time * 0.1 * speed;
        }
        if(meshes.orbitalBands) {
            meshes.orbitalBands.forEach((band, idx) => {
                band.rotation.x += 0.01 * speed * (idx % 2 === 0 ? 1 : -1);
                band.rotation.y += 0.015 * speed;
            });
        }

        // Coolant tubes flashing to simulate flow
        if(meshes.coolantTubes) {
            meshes.coolantTubes.forEach((tube, idx) => {
                const flow = (Math.sin(time * 5 + idx * 0.5) + 1) / 2;
                tube.material.emissiveIntensity = 0.5 + flow * 2.0;
            });
        }

        // Magnetic Levitation Rings counter-rotating
        if(meshes.levRings && meshes.levRings.length === 2) {
            meshes.levRings[0].rotation.z = time * 0.5 * speed;
            meshes.levRings[1].rotation.z = -time * 0.5 * speed;
        }

        // Bridge Hologram spinning
        if(meshes.bridgeHolo) {
            meshes.bridgeHolo.rotation.y += 0.05 * speed;
            meshes.bridgeHolo.scale.y = 1.0 + Math.sin(time * 10) * 0.2;
        }

        // Plasma Vents fluctuating
        if(meshes.exhaustPlumes) {
            meshes.exhaustPlumes.forEach((plume, idx) => {
                plume.scale.y = 1.0 + Math.random() * 0.5 * speed; // Flickering effect
                plume.scale.x = 1.0 + Math.sin(time * 20 + idx) * 0.1;
                plume.scale.z = 1.0 + Math.cos(time * 20 + idx) * 0.1;
                plume.material.emissiveIntensity = 2.0 + Math.random() * 2.0;
            });
        }

        // Subatomic Sensor array scanning
        if(meshes.sensorDish) {
            meshes.sensorDish.forEach((dish, idx) => {
                dish.rotation.y = Math.sin(time + idx) * 0.5;
                dish.rotation.z = Math.cos(time * 0.5 + idx) * 0.2;
            });
        }

        // Safety Bolts blinking angrily
        if(meshes.safetyBolts) {
            meshes.safetyBolts.forEach(bolt => {
                bolt.material.emissiveIntensity = (Math.sin(time * 15) > 0.8) ? 5.0 : 0.5;
            });
        }

        // Superconducting Coils glowing based on load
        if(meshes.coils) {
            meshes.coils.forEach((coil, idx) => {
                const load = (Math.sin(time * 2 + idx) + 1) / 2;
                // Since material is shared, we'd normally clone it to pulse individually,
                // but we can pulse the scale to simulate strain
                coil.scale.setScalar(1.0 + load * 0.02 * speed);
            });
        }
    };

    return {
        group,
        parts,
        description: "The God Tier Casimir Force Multiplier scales the infinitesimal quantum vacuum pressure to macroscopic levels. By utilizing perfectly flat degenerate-matter plates separated by nanometers, and pumping the external vacuum with virtual particles, it generates crushing forces exceeding planetary masses. This immense static pressure is harvested via a Zero-Point Tap, requiring god-like structural engineering to prevent the machine from instantly annihilating itself and the surrounding spacetime.",
        quizQuestions,
        animate
    };
}
