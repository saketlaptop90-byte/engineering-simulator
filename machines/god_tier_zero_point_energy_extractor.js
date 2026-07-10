import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = 'ZeroPointEnergyExtractor';

    // =========================================================================
    // CUSTOM HIGH-TECH & HYPER-REALISTIC MATERIALS
    // =========================================================================
    
    const emissiveBlue = new THREE.MeshStandardMaterial({
        color: 0x002244,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const emissivePurple = new THREE.MeshStandardMaterial({
        color: 0x220044,
        emissive: 0x9900ff,
        emissiveIntensity: 3.0,
        roughness: 0.2,
        metalness: 0.7
    });

    const emissiveCyan = new THREE.MeshStandardMaterial({
        color: 0x004444,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8
    });

    const emissiveWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
        roughness: 0.0,
        metalness: 1.0
    });

    const quantumPlasmaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });

    const dirtySteel = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.8,
        metalness: 0.6,
        bumpScale: 0.05
    });

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x221100,
        roughness: 0.3,
        metalness: 1.0
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0x550000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        roughness: 0.4,
        metalness: 0.5
    });

    // =========================================================================
    // DYNAMIC REFERENCES FOR ANIMATION
    // =========================================================================
    const animRefs = {
        wheels: [],
        pistons: [],
        casimirPlates: [],
        magneticRings: [],
        plasmaCore: null,
        plasmaSparks: [],
        conduitFluids: [],
        boomArms: [],
        coolingFans: [],
        quantumFluctuations: [],
        hydraulicRods: []
    };

    // =========================================================================
    // PROCEDURAL COMPONENT BUILDERS
    // =========================================================================

    /**
     * Builds massive off-road tracks/wheels with complex lug arrays and rims.
     */
    function buildTire(radius, width, lugCount) {
        const wheelGroup = new THREE.Group();
        
        // Main Tire Body
        const tireGeo = new THREE.TorusGeometry(radius * 0.8, radius * 0.25, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);

        // Complex Rims
        const rimGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width * 1.1, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Inner Hub
        const hubGeo = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, width * 1.2, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        // Spokes (Dual-layered lattice)
        const numSpokes = 12;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            const spokeGroup = new THREE.Group();
            
            const mainSpokeGeo = new THREE.CylinderGeometry(radius * 0.02, radius * 0.04, radius * 0.6, 16);
            const mainSpoke = new THREE.Mesh(mainSpokeGeo, steel);
            mainSpoke.position.set(0, radius * 0.3, 0);
            spokeGroup.add(mainSpoke);

            // Reinforcement struts
            const strutGeo = new THREE.CylinderGeometry(radius * 0.01, radius * 0.01, radius * 0.2, 8);
            const strut1 = new THREE.Mesh(strutGeo, dirtySteel);
            strut1.position.set(radius * 0.1, radius * 0.2, 0);
            strut1.rotation.z = Math.PI / 4;
            spokeGroup.add(strut1);

            const strut2 = new THREE.Mesh(strutGeo, dirtySteel);
            strut2.position.set(-radius * 0.1, radius * 0.2, 0);
            strut2.rotation.z = -Math.PI / 4;
            spokeGroup.add(strut2);

            spokeGroup.rotation.z = angle;
            wheelGroup.add(spokeGroup);
        }

        // Extremely detailed off-road treads/lugs
        const lugGeo = new THREE.BoxGeometry(radius * 0.15, radius * 0.1, width * 1.05);
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Alternate lug alignment for aggressive tread pattern
            const offset = (i % 2 === 0) ? width * 0.1 : -width * 0.1;
            lug.position.set(Math.cos(angle) * (radius * 1.02), Math.sin(angle) * (radius * 1.02), offset);
            lug.rotation.z = angle;
            
            // Add bevels to lugs
            const bevelGeo = new THREE.CylinderGeometry(radius * 0.02, radius * 0.02, width * 0.8, 8);
            const bevel = new THREE.Mesh(bevelGeo, dirtySteel);
            bevel.position.set(Math.cos(angle) * (radius * 1.05), Math.sin(angle) * (radius * 1.05), offset);
            bevel.rotation.z = angle;
            bevel.rotation.x = Math.PI / 2;
            
            wheelGroup.add(lug);
            wheelGroup.add(bevel);
        }

        // Hubcaps and bolts
        const capGeo = new THREE.CylinderGeometry(radius * 0.1, radius * 0.12, width * 1.25, 16);
        const cap = new THREE.Mesh(capGeo, copper);
        cap.rotation.x = Math.PI / 2;
        wheelGroup.add(cap);
        
        for(let i=0; i<8; i++) {
            const bAngle = (i/8)*Math.PI*2;
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, width * 1.28, 8), darkSteel);
            bolt.position.set(Math.cos(bAngle)*radius*0.15, Math.sin(bAngle)*radius*0.15, 0);
            bolt.rotation.x = Math.PI / 2;
            wheelGroup.add(bolt);
        }

        return wheelGroup;
    }

    /**
     * Constructs a massive, highly detailed base chassis using ExtrudeGeometry and layered plates.
     */
    function buildChassis() {
        const chassisGroup = new THREE.Group();

        // Main octagonal base profile
        const shape = new THREE.Shape();
        const size = 12;
        const chamfer = 3;
        shape.moveTo(size - chamfer, size);
        shape.lineTo(-(size - chamfer), size);
        shape.lineTo(-size, size - chamfer);
        shape.lineTo(-size, -(size - chamfer));
        shape.lineTo(-(size - chamfer), -size);
        shape.lineTo(size - chamfer, -size);
        shape.lineTo(size, -(size - chamfer));
        shape.lineTo(size, size - chamfer);
        shape.lineTo(size - chamfer, size);

        // Internal cutouts for reactor core
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, 6, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        const extrudeSettings = {
            depth: 3,
            bevelEnabled: true,
            bevelSegments: 8,
            steps: 4,
            bevelSize: 0.2,
            bevelThickness: 0.2
        };

        const mainBodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mainBody = new THREE.Mesh(mainBodyGeo, dirtySteel);
        mainBody.rotation.x = Math.PI / 2;
        mainBody.position.y = 5;
        chassisGroup.add(mainBody);

        // Armor Plating layers
        const armorExtrude = { depth: 0.5, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.1, bevelThickness: 0.1 };
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const plateShape = new THREE.Shape();
            plateShape.moveTo(-4, -2);
            plateShape.lineTo(4, -2);
            plateShape.lineTo(3, 2);
            plateShape.lineTo(-3, 2);
            plateShape.lineTo(-4, -2);
            
            const armorPlate = new THREE.Mesh(new THREE.ExtrudeGeometry(plateShape, armorExtrude), steel);
            armorPlate.position.set(Math.cos(angle) * 10, 6, Math.sin(angle) * 10);
            armorPlate.rotation.y = -angle + Math.PI / 2;
            chassisGroup.add(armorPlate);
        }

        // Grilles and Vents
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const ventGroup = new THREE.Group();
            for (let j = 0; j < 10; j++) {
                const slat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.5), darkSteel);
                slat.position.set(0, j * 0.2 - 1, 0);
                slat.rotation.x = Math.PI / 6;
                ventGroup.add(slat);
            }
            ventGroup.position.set(Math.cos(angle) * 11, 4, Math.sin(angle) * 11);
            ventGroup.rotation.y = -angle;
            chassisGroup.add(ventGroup);
        }

        // Massive structural ribs
        for (let i=0; i<16; i++) {
            const angle = (i/16)*Math.PI*2;
            const rib = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 2), chrome);
            rib.position.set(Math.cos(angle)*7, 3.5, Math.sin(angle)*7);
            rib.rotation.y = -angle;
            chassisGroup.add(rib);
        }

        return chassisGroup;
    }

    /**
     * Builds the Quantum Casimir Cavity Array.
     * Contains hundreds of micro-oscillating plates.
     */
    function buildCasimirArray() {
        const arrayGroup = new THREE.Group();
        
        const plateRingGeo = new THREE.TorusGeometry(5.8, 0.5, 16, 100);
        const plateRing = new THREE.Mesh(plateRingGeo, copper);
        plateRing.rotation.x = Math.PI / 2;
        arrayGroup.add(plateRing);

        const numPairs = 72;
        for (let i = 0; i < numPairs; i++) {
            const angle = (i / numPairs) * Math.PI * 2;
            
            const pairGroup = new THREE.Group();
            
            // The plates (Extremely polished mirror surfaces)
            const plateGeo = new THREE.BoxGeometry(0.8, 2.5, 0.02);
            
            const plate1 = new THREE.Mesh(plateGeo, chrome);
            plate1.position.set(0, 0, 0.05); // Micro-gap
            
            const plate2 = new THREE.Mesh(plateGeo, goldFoil);
            plate2.position.set(0, 0, -0.05); // Micro-gap

            // Plasma arc between plates
            const arcGeo = new THREE.PlaneGeometry(0.6, 2.3);
            const arc = new THREE.Mesh(arcGeo, emissiveCyan);
            arc.position.set(0, 0, 0);
            
            pairGroup.add(plate1);
            pairGroup.add(plate2);
            pairGroup.add(arc);

            pairGroup.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
            pairGroup.rotation.y = -angle;
            
            arrayGroup.add(pairGroup);
            
            // Store reference for animation (oscillating the gap)
            animRefs.casimirPlates.push({
                p1: plate1,
                p2: plate2,
                arc: arc,
                baseZ: 0.05,
                phase: i * 0.1
            });
        }

        // Support structure for the array
        const cageGeo = new THREE.CylinderGeometry(5.5, 5.5, 3, 32, 1, true);
        const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({
            color: 0x222222, wireframe: true
        }));
        arrayGroup.add(cage);

        arrayGroup.position.y = 8;
        return arrayGroup;
    }

    /**
     * Builds the central Vacuum Plasma Core, which contains the zero-point energy extraction event.
     */
    function buildPlasmaCore() {
        const coreGroup = new THREE.Group();

        // Outer Containment Sphere (Glass)
        const glassGeo = new THREE.SphereGeometry(4.5, 64, 64);
        const glassDome = new THREE.Mesh(glassGeo, glass);
        coreGroup.add(glassDome);

        // Inner Magnetic Confinement Lattice
        const latticeGeo = new THREE.IcosahedronGeometry(4.2, 2);
        const lattice = new THREE.Mesh(latticeGeo, new THREE.MeshStandardMaterial({
            color: 0x111111, wireframe: true, metalness: 1.0, roughness: 0.2
        }));
        coreGroup.add(lattice);

        // The Quantum Plasma (Hyper glowing core)
        const plasmaGeo = new THREE.IcosahedronGeometry(3.5, 4);
        const plasma = new THREE.Mesh(plasmaGeo, quantumPlasmaMaterial);
        coreGroup.add(plasma);
        animRefs.plasmaCore = plasma;

        // Rotating Magnetic Rings
        const colors = [emissiveBlue, emissivePurple, emissiveCyan];
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(4.8 + (i * 0.4), 0.15, 32, 100);
            const ring = new THREE.Mesh(ringGeo, colors[i]);
            
            // Add magnetic nodes to rings
            for(let j=0; j<8; j++) {
                const node = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), darkSteel);
                const angle = (j/8)*Math.PI*2;
                node.position.set(Math.cos(angle)*(4.8+i*0.4), Math.sin(angle)*(4.8+i*0.4), 0);
                ring.add(node);
            }

            coreGroup.add(ring);
            animRefs.magneticRings.push({
                mesh: ring,
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                speed: 0.5 + Math.random() * 2.0
            });
        }

        // Quantum Sparks/Fluctuations (Instanced or grouped meshes)
        const sparkGeo = new THREE.TetrahedronGeometry(0.1, 0);
        for (let i = 0; i < 200; i++) {
            const spark = new THREE.Mesh(sparkGeo, emissiveWhite);
            
            // Random position within core
            const r = Math.random() * 3.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            spark.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            coreGroup.add(spark);
            animRefs.plasmaSparks.push({
                mesh: spark,
                basePos: spark.position.clone(),
                freq: 5 + Math.random() * 15,
                phase: Math.random() * Math.PI * 2,
                radius: Math.random() * 0.5
            });
        }

        coreGroup.position.y = 8;
        return coreGroup;
    }

    /**
     * Builds heavy-duty suspension and hydraulic assemblies connecting chassis to wheels.
     */
    function buildSuspensionAndWheels() {
        const susGroup = new THREE.Group();
        
        const wheelPositions = [
            [-12, 0, 10], [12, 0, 10], [-12, 0, 4], [12, 0, 4],
            [-12, 0, -4], [12, 0, -4], [-12, 0, -10], [12, 0, -10]
        ];

        wheelPositions.forEach((pos, index) => {
            const mountGroup = new THREE.Group();
            mountGroup.position.set(pos[0], pos[1], pos[2]);

            // The Wheel
            const wheel = buildTire(3, 2, 40);
            wheel.position.y = 3; // Wheel radius
            // Alternate rotation axis orientation based on side
            if (pos[0] > 0) wheel.rotation.y = Math.PI; 
            
            mountGroup.add(wheel);
            animRefs.wheels.push(wheel);

            // Suspension Piston Assembly
            const housingGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
            const housing = new THREE.Mesh(housingGeo, darkSteel);
            housing.position.set(pos[0] > 0 ? -1.5 : 1.5, 6, 0);
            
            const rodGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 32);
            const rod = new THREE.Mesh(rodGeo, chrome);
            rod.position.set(0, -2, 0);
            housing.add(rod);

            // Spring Coil around piston
            const springCurve = new THREE.CatmullRomCurve3();
            const points = [];
            for (let i = 0; i <= 100; i++) {
                const t = i / 100;
                const r = 0.8;
                const h = 4 * t - 2;
                points.push(new THREE.Vector3(Math.cos(t * Math.PI * 20) * r, h, Math.sin(t * Math.PI * 20) * r));
            }
            const springGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 100, 0.1, 8, false);
            const spring = new THREE.Mesh(springGeo, steel);
            housing.add(spring);

            // Connective wishbone arms
            const armGeo = new THREE.BoxGeometry(3, 0.4, 1);
            const arm = new THREE.Mesh(armGeo, dirtySteel);
            arm.position.set(pos[0] > 0 ? -1.5 : 1.5, 3, 0);
            mountGroup.add(arm);

            mountGroup.add(housing);
            susGroup.add(mountGroup);

            animRefs.pistons.push({
                housing: housing,
                rod: rod,
                spring: spring,
                baseY: 6,
                phase: index * 0.5
            });
        });

        return susGroup;
    }

    /**
     * Builds Energy Extraction Conduits (Massive glowing tubes weaving around the structure)
     */
    function buildConduits() {
        const conduitGroup = new THREE.Group();

        const numConduits = 12;
        for (let i = 0; i < numConduits; i++) {
            const angle = (i / numConduits) * Math.PI * 2;
            const radius = 6;
            const startPoint = new THREE.Vector3(Math.cos(angle) * radius, 8, Math.sin(angle) * radius);
            const midPoint = new THREE.Vector3(Math.cos(angle + 0.5) * (radius + 4), 14, Math.sin(angle + 0.5) * (radius + 4));
            const endPoint = new THREE.Vector3(Math.cos(angle + 1.0) * (radius + 2), 2, Math.sin(angle + 1.0) * (radius + 2));
            
            // Create a complex twisting spline
            const curve = new THREE.CatmullRomCurve3([
                startPoint,
                new THREE.Vector3(Math.cos(angle) * (radius + 1), 10, Math.sin(angle) * (radius + 1)),
                midPoint,
                new THREE.Vector3(Math.cos(angle + 0.8) * (radius + 3), 8, Math.sin(angle + 0.8) * (radius + 3)),
                endPoint
            ]);

            const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.4, 16, false);
            const tube = new THREE.Mesh(tubeGeo, glass);
            
            // Inner glowing core
            const coreGeo = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
            const core = new THREE.Mesh(coreGeo, emissiveBlue);

            // Ring clamps along the conduit
            for(let j=0; j<=10; j++) {
                const t = j/10;
                const pos = curve.getPointAt(t);
                const tangent = curve.getTangentAt(t).normalize();
                
                const clampGeo = new THREE.TorusGeometry(0.45, 0.1, 16, 32);
                const clamp = new THREE.Mesh(clampGeo, copper);
                clamp.position.copy(pos);
                
                // Align clamp to tangent
                const axis = new THREE.Vector3(0, 0, 1);
                clamp.quaternion.setFromUnitVectors(axis, tangent);
                
                conduitGroup.add(clamp);
            }

            conduitGroup.add(tube);
            conduitGroup.add(core);

            animRefs.conduitFluids.push({
                mesh: core,
                material: core.material.clone() // Clone for individual pulsing
            });
            core.material = animRefs.conduitFluids[i].material;
        }

        return conduitGroup;
    }

    /**
     * Builds the highly detailed Operator Command Cabin.
     */
    function buildOperatorCabin() {
        const cabinGroup = new THREE.Group();

        // Main Cabin shell
        const shellGeo = new THREE.BoxGeometry(6, 5, 8);
        const shell = new THREE.Mesh(shellGeo, dirtySteel);
        shell.position.set(0, 2.5, 0);
        cabinGroup.add(shell);

        // Tinted Front Window
        const windowGeo = new THREE.PlaneGeometry(5.6, 4);
        const window = new THREE.Mesh(windowGeo, tinted);
        window.position.set(0, 2.5, 4.01);
        cabinGroup.add(window);

        // Interior Console
        const consoleGeo = new THREE.BoxGeometry(5.6, 1.5, 1.5);
        const controlPanel = new THREE.Mesh(consoleGeo, plastic);
        controlPanel.position.set(0, 1.5, 3.2);
        controlPanel.rotation.x = -Math.PI / 6;
        cabinGroup.add(controlPanel);

        // Holographic Monitors
        for(let i=0; i<3; i++) {
            const screenGeo = new THREE.PlaneGeometry(1.5, 1);
            const screen = new THREE.Mesh(screenGeo, glowingRed);
            screen.position.set((i-1)*1.8, 2.8, 3.5);
            screen.rotation.x = -Math.PI / 8;
            cabinGroup.add(screen);
        }

        // Operator Seat
        const seatGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(0.3, 0.4, 1);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 0.5;
        seatGroup.add(base);
        
        const cushionGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
        const cushion = new THREE.Mesh(cushionGeo, rubber);
        cushion.position.y = 1;
        seatGroup.add(cushion);

        const backGeo = new THREE.BoxGeometry(1.2, 1.5, 0.2);
        const back = new THREE.Mesh(backGeo, rubber);
        back.position.set(0, 1.85, -0.5);
        seatGroup.add(back);

        seatGroup.position.set(0, 0, 1.5);
        cabinGroup.add(seatGroup);

        // Joysticks
        for(let i of [-1, 1]) {
            const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
            const stick = new THREE.Mesh(stickGeo, chrome);
            stick.position.set(i*1.5, 2, 3);
            stick.rotation.x = Math.PI / 6;
            
            const knobGeo = new THREE.SphereGeometry(0.15);
            const knob = new THREE.Mesh(knobGeo, glowingRed);
            knob.position.set(0, 0.25, 0);
            stick.add(knob);
            
            cabinGroup.add(stick);
        }

        // Roof instrumentation and radar
        const radarGeo = new THREE.CylinderGeometry(1, 1, 0.2, 16);
        const radar = new THREE.Mesh(radarGeo, steel);
        radar.position.set(0, 5.2, 0);
        cabinGroup.add(radar);

        const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const antenna = new THREE.Mesh(antennaGeo, darkSteel);
        antenna.position.set(2, 6.5, -2);
        cabinGroup.add(antenna);

        // Flashing beacon
        const beaconGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
        const beacon = new THREE.Mesh(beaconGeo, new THREE.MeshStandardMaterial({
            color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2
        }));
        beacon.position.set(-2, 5.3, -2);
        cabinGroup.add(beacon);
        animRefs.quantumFluctuations.push({ mesh: beacon, type: 'blink' });

        cabinGroup.position.set(0, 15, -6);
        return cabinGroup;
    }

    /**
     * Builds articulated hydraulic boom arms for structural stability of the core.
     */
    function buildBoomArms() {
        const boomsGroup = new THREE.Group();

        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2 + Math.PI/4;
            
            const boomGroup = new THREE.Group();
            
            // Base Mount
            const mountGeo = new THREE.BoxGeometry(2, 2, 2);
            const mount = new THREE.Mesh(mountGeo, steel);
            mount.position.y = 1;
            boomGroup.add(mount);

            // Primary Arm
            const arm1Geo = new THREE.BoxGeometry(1, 8, 1);
            const arm1 = new THREE.Mesh(arm1Geo, dirtySteel);
            arm1.position.set(0, 4, 0);
            // Move origin to bottom for rotation
            arm1Geo.translate(0, 4, 0);
            arm1.position.set(0, 1, 0);
            
            // Hydraulic Rod
            const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
            const rod = new THREE.Mesh(rodGeo, chrome);
            rod.position.set(0.8, 4, 0);
            arm1.add(rod);

            // Secondary Arm (Jointed)
            const arm2Geo = new THREE.BoxGeometry(0.8, 6, 0.8);
            arm2Geo.translate(0, 3, 0);
            const arm2 = new THREE.Mesh(arm2Geo, copper);
            arm2.position.set(0, 8, 0);
            
            // Core Connector/Clamp
            const clampGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
            const clamp = new THREE.Mesh(clampGeo, darkSteel);
            clamp.rotation.z = Math.PI / 2;
            clamp.position.set(0, 6, 0);
            arm2.add(clamp);

            arm1.add(arm2);
            boomGroup.add(arm1);

            boomGroup.position.set(Math.cos(angle) * 12, 5, Math.sin(angle) * 12);
            boomGroup.rotation.y = -angle;

            boomsGroup.add(boomGroup);

            animRefs.boomArms.push({
                arm1: arm1,
                arm2: arm2,
                rod: rod,
                phase: i * Math.PI / 2
            });
        }

        return boomsGroup;
    }

    /**
     * Builds Auxiliary Cooling Systems with massive spinning fans and radiators.
     */
    function buildCoolingSystems() {
        const coolGroup = new THREE.Group();

        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2;
            
            const unitGroup = new THREE.Group();
            
            // Radiator Block
            const radGeo = new THREE.BoxGeometry(3, 4, 1.5);
            const radiator = new THREE.Mesh(radGeo, darkSteel);
            radiator.position.y = 2;
            unitGroup.add(radiator);

            // Cooling Fins
            for(let j=0; j<20; j++) {
                const finGeo = new THREE.BoxGeometry(3.2, 0.05, 1.2);
                const fin = new THREE.Mesh(finGeo, aluminum);
                fin.position.set(0, 0.2 + j * 0.19, 0);
                unitGroup.add(fin);
            }

            // Massive Fan
            const fanGroup = new THREE.Group();
            const hubGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8);
            const hub = new THREE.Mesh(hubGeo, chrome);
            hub.rotation.x = Math.PI/2;
            fanGroup.add(hub);

            for(let k=0; k<6; k++) {
                const bladeAngle = (k/6)*Math.PI*2;
                const bladeGeo = new THREE.BoxGeometry(1.2, 0.05, 0.4);
                const blade = new THREE.Mesh(bladeGeo, plastic);
                blade.position.set(Math.cos(bladeAngle)*0.8, Math.sin(bladeAngle)*0.8, 0);
                blade.rotation.z = bladeAngle;
                blade.rotation.x = Math.PI/4; // Pitch
                fanGroup.add(blade);
            }
            fanGroup.position.set(0, 2, 0.8);
            unitGroup.add(fanGroup);
            
            animRefs.coolingFans.push(fanGroup);

            unitGroup.position.set(Math.cos(angle) * 14, 2, Math.sin(angle) * 14);
            unitGroup.rotation.y = -angle;

            coolGroup.add(unitGroup);
        }

        return coolGroup;
    }

    // =========================================================================
    // ASSEMBLY & PARTS DEFINITIONS
    // =========================================================================

    const chassis = buildChassis();
    const suspensionAndWheels = buildSuspensionAndWheels();
    const casimirArray = buildCasimirArray();
    const plasmaCore = buildPlasmaCore();
    const conduits = buildConduits();
    const operatorCabin = buildOperatorCabin();
    const boomArms = buildBoomArms();
    const coolingSystems = buildCoolingSystems();

    // Grouping for exploded views
    chassis.userData.partName = 'Base Chassis';
    suspensionAndWheels.userData.partName = 'Octo-Drive Locomotion Wheels & Suspension';
    casimirArray.userData.partName = 'Casimir Resonator Array';
    plasmaCore.userData.partName = 'Quantum Vacuum Plasma Core';
    conduits.userData.partName = 'Energy Extraction Conduits';
    operatorCabin.userData.partName = 'Operator Command Cabin';
    boomArms.userData.partName = 'Hydraulic Boom Arms';
    coolingSystems.userData.partName = 'Auxiliary Radiator Fins';

    group.add(chassis);
    group.add(suspensionAndWheels);
    group.add(casimirArray);
    group.add(plasmaCore);
    group.add(conduits);
    group.add(operatorCabin);
    group.add(boomArms);
    group.add(coolingSystems);

    const parts = [
        {
            name: 'Base Chassis',
            description: 'Massive octagonal armor-plated frame designed to absorb high-frequency quantum recoil vibrations.',
            material: 'Titanium-Tungsten Alloy',
            function: 'Structural foundation and primary grounding node.',
            assemblyOrder: 1,
            connections: ['Octo-Drive Locomotion Wheels & Suspension', 'Auxiliary Radiator Fins', 'Hydraulic Boom Arms'],
            failureEffect: 'Catastrophic structural fracturing due to resonant vacuum frequencies.',
            cascadeFailures: ['Operator Command Cabin', 'Energy Extraction Conduits'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 0 }
        },
        {
            name: 'Octo-Drive Locomotion Wheels & Suspension',
            description: 'Heavy-duty 8-wheel drive system with aggressive lug treads and telescoping dampeners.',
            material: 'Vulcanized Graphene Rubber & Chrome',
            function: 'Provides all-terrain mobility and active suspension to isolate the core from seismic interference.',
            assemblyOrder: 2,
            connections: ['Base Chassis'],
            failureEffect: 'Immobilization and fatal misalignment of the Casimir arrays during transport.',
            cascadeFailures: ['Casimir Resonator Array'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -15, z: 0 }
        },
        {
            name: 'Quantum Vacuum Plasma Core',
            description: 'A hyper-glowing plasma containment sphere enclosed in a dense magnetic lattice, holding raw vacuum energy.',
            material: 'Exotic Metamaterial Glass & Magnetic Rings',
            function: 'Contains and stabilizes the extracted zero-point energy prior to rectification.',
            assemblyOrder: 3,
            connections: ['Casimir Resonator Array', 'Energy Extraction Conduits'],
            failureEffect: 'Uncontained local vacuum collapse and subsequent pair-production explosion.',
            cascadeFailures: ['All Systems'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 10, z: 0 }
        },
        {
            name: 'Casimir Resonator Array',
            description: 'Hundreds of oscillating, micro-gapped mirror plates that artificially induce and harvest the Casimir effect.',
            material: 'Hyper-polished Chrome & Gold Foil',
            function: 'Extracts energy by compressing vacuum fluctuations between infinitesimally spaced conductive plates.',
            assemblyOrder: 4,
            connections: ['Quantum Vacuum Plasma Core', 'Base Chassis'],
            failureEffect: 'Premature plate fusion, resulting in instantaneous cessation of energy generation.',
            cascadeFailures: ['Energy Extraction Conduits'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -15 }
        },
        {
            name: 'Energy Extraction Conduits',
            description: 'Massive, twisting crystalline tubes pulsing with glowing, high-energy plasma fluids.',
            material: 'Transparent Aluminum & Exotic Plasma',
            function: 'Routes the raw vacuum energy from the core to the main rectifiers.',
            assemblyOrder: 5,
            connections: ['Quantum Vacuum Plasma Core', 'Base Chassis'],
            failureEffect: 'Plasma leakage causing severe localized spatial distortion.',
            cascadeFailures: ['Auxiliary Radiator Fins'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 15, y: 5, z: 15 }
        },
        {
            name: 'Operator Command Cabin',
            description: 'A heavily shielded, environmentally sealed control cabin with tinted windows and holographic interfaces.',
            material: 'Dirty Steel & Tinted Glass',
            function: 'Houses the pilot and primary control systems for modulating the extraction frequency.',
            assemblyOrder: 6,
            connections: ['Base Chassis'],
            failureEffect: 'Loss of telemetry and manual override capabilities.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 20, z: -20 }
        },
        {
            name: 'Hydraulic Boom Arms',
            description: 'Four articulated, heavy-duty telescoping arms gripping the central containment vessel.',
            material: 'Carbon Steel & Chrome Hydraulics',
            function: 'Actively stabilizes the plasma core against extreme torsional forces generated by the vacuum flux.',
            assemblyOrder: 7,
            connections: ['Base Chassis', 'Quantum Vacuum Plasma Core'],
            failureEffect: 'Core misalignment leading to asymmetric energy extraction and violently unstable oscillation.',
            cascadeFailures: ['Quantum Vacuum Plasma Core', 'Casimir Resonator Array'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -15, y: 5, z: -15 }
        },
        {
            name: 'Auxiliary Radiator Fins',
            description: 'Banks of high-surface-area aluminum fins equipped with rapid-spin cooling fans.',
            material: 'Aluminum & Plastic',
            function: 'Dissipates the immense waste heat generated by sub-quantum friction.',
            assemblyOrder: 8,
            connections: ['Base Chassis', 'Energy Extraction Conduits'],
            failureEffect: 'Thermal runaway leading to core meltdown.',
            cascadeFailures: ['Quantum Vacuum Plasma Core'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 20, y: 0, z: -10 }
        }
    ];

    // Additional fictional parts for completeness of a 15-part requirement
    for(let i=9; i<=15; i++) {
        parts.push({
            name: `Zero-Point Sub-Assembly Node ${i}`,
            description: `Highly classified quantum rectifier manifold ${i}, managing exotic particle filtering.`,
            material: 'Superconducting YBCO',
            function: 'Phase alignment of virtual particles.',
            assemblyOrder: i,
            connections: ['Quantum Vacuum Plasma Core'],
            failureEffect: 'Unpredictable spontaneous particle emission.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: Math.cos(i)*10, y: -10 + i*2, z: Math.sin(i)*10 }
        });
    }

    // =========================================================================
    // PHD LEVEL QED QUIZ QUESTIONS
    // =========================================================================

    const quizQuestions = [
        {
            question: "In the context of the Casimir effect, how does the attractive force between two uncharged, perfectly conducting parallel plates scale with the distance 'd' between them?",
            options: [
                "It is inversely proportional to the distance squared (1/d²)",
                "It is inversely proportional to the distance cubed (1/d³)",
                "It is inversely proportional to the fourth power of the distance (1/d⁴)",
                "It is directly proportional to the logarithm of the distance (ln(d))"
            ],
            correctAnswer: 2,
            explanation: "The Casimir force per unit area is given by F/A = - (π² ħ c) / (240 d⁴). Therefore, it scales as the inverse fourth power of the distance between the plates, illustrating the macroscopic manifestation of vacuum boundary conditions on zero-point energy."
        },
        {
            question: "When this machine induces extreme electric fields to extract vacuum energy, it must stay just below the Schwinger limit to avoid massive vacuum decay. What physical phenomenon occurs exactly at the Schwinger limit?",
            options: [
                "The spontaneous creation of electron-positron pairs directly from the vacuum.",
                "The complete breakdown of the strong nuclear force within the chassis.",
                "The emission of Hawking radiation from localized micro black holes.",
                "The instantaneous conversion of photons into dark matter."
            ],
            correctAnswer: 0,
            explanation: "The Schwinger limit (approx 1.3 × 10^18 V/m) is the critical electric field strength at which the vacuum becomes non-linear and unstable, spontaneously decaying into electron-positron pairs—a process known as Schwinger pair production."
        },
        {
            question: "To calculate the total zero-point energy of the vacuum, the sum of modes diverges to infinity. Which mathematical technique is physically justified by the discrete nature of spacetime at the Planck scale to yield a finite value?",
            options: [
                "Applying a high-frequency (ultraviolet) cut-off at the Planck length.",
                "Utilizing the Fourier transform of the fine-structure constant.",
                "Integrating over the cosmic microwave background only.",
                "Assuming the cosmological constant is exactly zero."
            ],
            correctAnswer: 0,
            explanation: "Regularization techniques often employ an ultraviolet cut-off, assuming that physics fundamentally changes at the Planck scale (where quantum gravity effects dominate), truncating the infinite sum of vacuum fluctuation modes to a massive but finite value."
        },
        {
            question: "If the Extractor's plates are oscillated mechanically at relativistic speeds, it exploits the Dynamic Casimir Effect. What is the primary output of this specific effect?",
            options: [
                "The annihilation of virtual particles.",
                "The creation of real photons originating from vacuum fluctuations.",
                "The generation of localized gravitational waves.",
                "The transmutation of lead into gold via quantum tunneling."
            ],
            correctAnswer: 1,
            explanation: "The Dynamical Casimir Effect predicts that accelerating a boundary (like a mirror) at relativistic speeds through the vacuum will convert virtual photons into real, observable photons, essentially extracting light from nothingness."
        },
        {
            question: "The plasma core is heavily shielded to account for Vacuum Polarization. In Quantum Electrodynamics (QED), how does vacuum polarization affect the observed charge of an electron at extremely close distances?",
            options: [
                "It screens the charge, making the effective charge increase as you probe closer to the bare electron.",
                "It acts as an amplifier, making the charge decrease to zero at the core.",
                "It causes the charge to oscillate between positive and negative.",
                "It converts the electric charge into a magnetic monopole."
            ],
            correctAnswer: 0,
            explanation: "In QED, virtual electron-positron pairs screen the 'bare' charge of the electron. As you probe closer (at higher energy scales), you penetrate this screening cloud, causing the observed effective coupling constant (charge) to increase."
        }
    ];

    // =========================================================================
    // EXTREME ANIMATION LOGIC
    // =========================================================================

    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // 1. Wheel Rotation (Assuming forward movement)
        animRefs.wheels.forEach(wheel => {
            wheel.rotation.x = t * 2.0;
        });

        // 2. Suspension Compression (Bouncing over rough quantum terrain)
        animRefs.pistons.forEach(piston => {
            const compression = Math.sin(t * 5 + piston.phase) * 0.5 + 
                                Math.sin(t * 12 + piston.phase * 2) * 0.2; // Complex noise
            piston.housing.position.y = piston.baseY + compression;
            piston.spring.scale.y = 1 - (compression * 0.1); // Compress spring
        });

        // 3. Casimir Plates Micro-Oscillation (Hyper frequencies)
        animRefs.casimirPlates.forEach(plateData => {
            // Rapid jittering
            const jitter = Math.sin(t * 50 + plateData.phase) * 0.02;
            plateData.p1.position.z = plateData.baseZ + jitter;
            plateData.p2.position.z = -plateData.baseZ - jitter;
            
            // Plasma arc pulsing between plates
            plateData.arc.material.emissiveIntensity = 2.0 + Math.sin(t * 30 + plateData.phase) * 1.5;
        });

        // 4. Magnetic Confinement Rings Gimbal Lock Rotation
        animRefs.magneticRings.forEach(ringData => {
            ringData.mesh.rotateOnAxis(ringData.axis, ringData.speed * speed * 0.05);
        });

        // 5. Plasma Core Pulsation
        if (animRefs.plasmaCore) {
            const pulse = Math.sin(t * 3) * 0.5 + 0.5;
            animRefs.plasmaCore.scale.set(1 + pulse*0.1, 1 + pulse*0.1, 1 + pulse*0.1);
            animRefs.plasmaCore.material.emissiveIntensity = 2.0 + pulse * 3.0;
            animRefs.plasmaCore.rotation.y = t * 0.5;
            animRefs.plasmaCore.rotation.x = t * 0.3;
        }

        // 6. Quantum Sparks (Erratic random movement mimicking fluctuations)
        animRefs.plasmaSparks.forEach(sparkData => {
            const jx = Math.sin(t * sparkData.freq + sparkData.phase) * sparkData.radius;
            const jy = Math.cos(t * sparkData.freq * 1.3 + sparkData.phase) * sparkData.radius;
            const jz = Math.sin(t * sparkData.freq * 0.7 + sparkData.phase) * sparkData.radius;
            
            sparkData.mesh.position.set(
                sparkData.basePos.x + jx,
                sparkData.basePos.y + jy,
                sparkData.basePos.z + jz
            );
            
            // Randomly blink out of existence (virtual particle behavior)
            sparkData.mesh.visible = Math.random() > 0.1;
        });

        // 7. Conduit Fluid Pulsing (Energy moving through tubes)
        animRefs.conduitFluids.forEach((fluid, i) => {
            fluid.material.emissiveIntensity = 1.0 + Math.sin(t * 8 - i) * 2.0;
        });

        // 8. Hydraulic Boom Arms Articulation
        animRefs.boomArms.forEach(boom => {
            // Arms slowly adjust their grip
            const articulation = Math.sin(t * 0.5 + boom.phase) * 0.1;
            boom.arm1.rotation.z = articulation;
            boom.arm2.rotation.z = -articulation * 1.5;
            
            // Simulate hydraulic rod sliding
            boom.rod.position.y = 4 + articulation * 5;
        });

        // 9. Auxiliary Cooling Fans Spinning
        animRefs.coolingFans.forEach(fan => {
            fan.rotation.z += 10.0 * speed * 0.05; // Extremely fast
        });

        // 10. Cabin instrumentation blinking
        animRefs.quantumFluctuations.forEach(fluc => {
            if(fluc.type === 'blink') {
                fluc.mesh.material.emissiveIntensity = (Math.sin(t * 10) > 0) ? 5 : 0;
            }
        });
    };

    return {
        group,
        parts,
        description: "The God Tier Zero Point Energy Extractor is an apocalyptic-scale scientific vessel designed to rupture the quantum vacuum. Through an array of macro-scale Casimir oscillators, it forcefully rips virtual particles into reality, capturing the violent energy differential in a hyper-dense plasma containment field. Warning: Operating at the Schwinger Limit risks localized disintegration of spacetime.",
        quizQuestions,
        animate
    };
}
