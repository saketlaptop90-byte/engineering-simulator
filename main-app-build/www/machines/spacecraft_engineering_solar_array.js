import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Materials
    const pvMaterial = new THREE.MeshStandardMaterial({
        color: 0x001533,
        emissive: 0x00081a,
        roughness: 0.2,
        metalness: 0.9,
    });

    const goldFoilMaterial = new THREE.MeshStandardMaterial({
        color: 0xffb700,
        roughness: 0.5,
        metalness: 0.8,
        bumpScale: 0.1
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 3
    });
    
    const warningMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 1
    });

    const meshes = {};

    // 1. Core Hub - Intricate Ribbed Structure
    const coreGroup = new THREE.Group();
    const coreRadius = 2.5;
    const coreLength = 8;
    
    // Main Hull
    const coreGeom = new THREE.CylinderGeometry(coreRadius, coreRadius, coreLength, 64);
    const coreMesh = new THREE.Mesh(coreGeom, goldFoilMaterial);
    coreMesh.rotation.x = Math.PI / 2;
    coreGroup.add(coreMesh);
    
    // Structural Ribs around the Core
    for (let i = -3.5; i <= 3.5; i += 1.75) {
        const ribGeom = new THREE.TorusGeometry(coreRadius + 0.1, 0.15, 16, 64);
        const rib = new THREE.Mesh(ribGeom, darkSteel);
        rib.position.z = i; // since core is rotated, local Z is along the cylinder length
        coreMesh.add(rib);
    }
    
    group.add(coreGroup);
    meshes.coreMesh = coreMesh;

    parts.push({
        name: 'Primary Core Hub',
        description: 'Central spacecraft bus structure wrapped in Multi-Layer Insulation (MLI). Contains main computing and power distribution nodes.',
        material: 'goldFoil / darkSteel',
        function: 'Structural backbone and central processing.',
        assemblyOrder: 1,
        connections: ['Power Conditioning Unit', 'Star Tracker Assembly', 'Sun Tracking Motor Base'],
        failureEffect: 'Catastrophic failure of all spacecraft operations.',
        cascadeFailures: ['All subsystems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // 2. Power Conditioning Unit (PCU) with intricate cooling matrix
    const pcuGroup = new THREE.Group();
    const pcuGeom = new THREE.BoxGeometry(3, 4, 3);
    const pcuMesh = new THREE.Mesh(pcuGeom, steel);
    pcuGroup.position.set(0, -coreLength/2 - 2, 0);
    pcuGroup.add(pcuMesh);
    coreGroup.add(pcuGroup);
    meshes.pcuGroup = pcuGroup;

    // Heat sink fins
    const fins = [];
    for (let i = -1.5; i <= 1.5; i += 0.2) {
        const finGeom = new THREE.BoxGeometry(3.4, 0.05, 3.4);
        const fin = new THREE.Mesh(finGeom, darkSteel);
        fin.position.y = i;
        pcuMesh.add(fin);
        fins.push(fin);
    }
    meshes.pcuFins = fins;

    parts.push({
        name: 'Power Conditioning Unit (PCU)',
        description: 'High-efficiency DC-DC converters, rectifiers, and thermal management matrix.',
        material: 'steel',
        function: 'Regulates raw variable voltage from arrays into stable spacecraft bus power.',
        assemblyOrder: 2,
        connections: ['Primary Core Hub'],
        failureEffect: 'Unregulated voltage spikes causing electronic component destruction.',
        cascadeFailures: ['Spacecraft Main Bus', 'Telemetry Antenna'],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 3. Star Tracker Assembly
    const starTrackerGroup = new THREE.Group();
    const trackerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), darkSteel);
    const trackerLens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 0.8, 16), glass);
    trackerLens.position.y = 0.9;
    starTrackerGroup.add(trackerBase);
    starTrackerGroup.add(trackerLens);
    starTrackerGroup.rotation.x = -Math.PI / 4;
    starTrackerGroup.position.set(2, 0, 2);
    coreGroup.add(starTrackerGroup);

    parts.push({
        name: 'Star Tracker Assembly',
        description: 'Optical camera system for stellar pattern recognition.',
        material: 'darkSteel / glass',
        function: 'Determines precise spacecraft attitude and orientation.',
        assemblyOrder: 3,
        connections: ['Primary Core Hub'],
        failureEffect: 'Loss of precise pointing capability.',
        cascadeFailures: ['Sun Tracking Motor Base'],
        originalPosition: { x: 2, y: 0, z: 2 },
        explodedPosition: { x: 10, y: 5, z: 10 }
    });

    // 4. Sun Tracking Motor Base (Stator)
    const motorBaseGeom = new THREE.CylinderGeometry(1.8, 2.2, 2.5, 64);
    const motorBase = new THREE.Mesh(motorBaseGeom, darkSteel);
    motorBase.position.set(0, coreLength/2 + 1.25, 0);
    coreGroup.add(motorBase);
    
    // Add warning decals / rings to motor base
    const warningRing = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, 0.2, 64), warningMaterial);
    warningRing.position.y = 0.5;
    motorBase.add(warningRing);

    parts.push({
        name: 'Sun Tracking Stator Base',
        description: 'Fixed housing containing extreme-duty magnetic coils and gold slip rings.',
        material: 'darkSteel',
        function: 'Provides magnetic flux to drive the rotor and transmits power across the rotating joint.',
        assemblyOrder: 4,
        connections: ['Primary Core Hub', 'Beta Gimbal Rotor'],
        failureEffect: 'Electrical short circuit across slip rings.',
        cascadeFailures: ['Beta Gimbal Rotor'],
        originalPosition: { x: 0, y: 5.25, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 5. Beta Gimbal Rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 1.5, 0);
    motorBase.add(rotorGroup);
    meshes.rotorGroup = rotorGroup;

    const rotorGeom = new THREE.TorusGeometry(2.0, 0.6, 32, 128);
    const rotor = new THREE.Mesh(rotorGeom, chrome);
    rotor.rotation.x = Math.PI / 2;
    rotorGroup.add(rotor);

    // Inner gear teeth for rotor
    for (let i = 0; i < 36; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.8), darkSteel);
        const angle = (i / 36) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
        tooth.rotation.z = angle;
        rotor.add(tooth);
    }

    parts.push({
        name: 'Beta Gimbal Rotor',
        description: 'Massive rotating joint element driven by stator magnetic fields.',
        material: 'chrome',
        function: 'Rotates the entire massive truss and panel assembly to track the sun.',
        assemblyOrder: 5,
        connections: ['Sun Tracking Stator Base', 'Main Truss Crossbeam'],
        failureEffect: 'Mechanical binding causing tracking failure.',
        cascadeFailures: ['All Solar Wings'],
        originalPosition: { x: 0, y: 6.75, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 6. Main Truss Crossbeam
    const crossBeamGroup = new THREE.Group();
    rotorGroup.add(crossBeamGroup);
    meshes.crossBeamGroup = crossBeamGroup;

    const beamLength = 10;
    const beamGeom = new THREE.CylinderGeometry(0.8, 0.8, beamLength, 32);
    const mainBeam = new THREE.Mesh(beamGeom, aluminum);
    mainBeam.rotation.z = Math.PI / 2;
    crossBeamGroup.add(mainBeam);
    
    // Complex Connection plates on the beam
    const plateGeom = new THREE.BoxGeometry(1.2, 1.2, 2.5);
    const sbPlate = new THREE.Mesh(plateGeom, steel);
    sbPlate.position.x = beamLength/2;
    crossBeamGroup.add(sbPlate);
    
    const portPlate = new THREE.Mesh(plateGeom, steel);
    portPlate.position.x = -beamLength/2;
    crossBeamGroup.add(portPlate);

    parts.push({
        name: 'Main Truss Crossbeam',
        description: 'Thick aluminum structural member bridging the central rotor to the lateral deployment arms.',
        material: 'aluminum / steel',
        function: 'Distributes massive torsional loads during rotation and orbital adjustments.',
        assemblyOrder: 6,
        connections: ['Beta Gimbal Rotor', 'Starboard Truss Arm', 'Port Truss Arm'],
        failureEffect: 'Shear fracture causing total loss of solar wing.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 15 }
    });

    // Truss Generator for extreme detail
    function createHyperComplexTruss(length, radius, colorMat) {
        const trussGroup = new THREE.Group();
        
        // 4 longeron tubes (Square cross-section truss)
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI/4;
            const longeron = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, length, 16), colorMat);
            longeron.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            trussGroup.add(longeron);
        }

        // Complex Zig-zag X-bracing on all 4 faces
        const segments = Math.floor(length / (radius * 1.5));
        const segmentLength = length / segments;
        
        for (let i = 0; i < segments; i++) {
            const yOffset = -length/2 + i * segmentLength + segmentLength/2;
            for (let j = 0; j < 4; j++) {
                const angle1 = (j * Math.PI) / 2 + Math.PI/4;
                const angle2 = ((j+1) * Math.PI) / 2 + Math.PI/4;
                
                const p1 = new THREE.Vector3(Math.cos(angle1) * radius, yOffset - segmentLength/2, Math.sin(angle1) * radius);
                const p2 = new THREE.Vector3(Math.cos(angle2) * radius, yOffset + segmentLength/2, Math.sin(angle2) * radius);
                const p3 = new THREE.Vector3(Math.cos(angle2) * radius, yOffset - segmentLength/2, Math.sin(angle2) * radius);
                const p4 = new THREE.Vector3(Math.cos(angle1) * radius, yOffset + segmentLength/2, Math.sin(angle1) * radius);

                // Diagonal 1
                const path1 = new THREE.LineCurve3(p1, p2);
                const brace1 = new THREE.Mesh(new THREE.TubeGeometry(path1, 4, 0.08, 8, false), colorMat);
                trussGroup.add(brace1);

                // Diagonal 2
                const path2 = new THREE.LineCurve3(p3, p4);
                const brace2 = new THREE.Mesh(new THREE.TubeGeometry(path2, 4, 0.08, 8, false), colorMat);
                trussGroup.add(brace2);
                
                // Horizontal brace
                const path3 = new THREE.LineCurve3(p2, p4);
                const brace3 = new THREE.Mesh(new THREE.TubeGeometry(path3, 4, 0.08, 8, false), colorMat);
                trussGroup.add(brace3);
            }
        }
        
        // Add internal hydraulic / power line conduit
        const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, length, 16), copper);
        trussGroup.add(conduit);
        
        return trussGroup;
    }

    // 7. Starboard Truss Arm
    const starboardArm = createHyperComplexTruss(12, 1.5, aluminum);
    starboardArm.rotation.z = -Math.PI / 2;
    starboardArm.position.x = beamLength/2 + 6;
    crossBeamGroup.add(starboardArm);

    parts.push({
        name: 'Starboard Truss Arm',
        description: 'Extended deployment boom utilizing an X-braced square truss geometry. Houses massive internal power conduits.',
        material: 'aluminum / copper',
        function: 'Offsets the solar array from the spacecraft body to prevent shadowing.',
        assemblyOrder: 7,
        connections: ['Main Truss Crossbeam', 'Starboard Root Hinge'],
        failureEffect: 'Boom buckling under thruster loads.',
        cascadeFailures: ['Starboard Solar Wing'],
        originalPosition: { x: 11, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 }
    });

    // 8. Port Truss Arm
    const portArm = createHyperComplexTruss(12, 1.5, aluminum);
    portArm.rotation.z = Math.PI / 2;
    portArm.position.x = -beamLength/2 - 6;
    crossBeamGroup.add(portArm);

    parts.push({
        name: 'Port Truss Arm',
        description: 'Extended deployment boom utilizing an X-braced square truss geometry. Houses massive internal power conduits.',
        material: 'aluminum / copper',
        function: 'Offsets the solar array from the spacecraft body to prevent shadowing.',
        assemblyOrder: 8,
        connections: ['Main Truss Crossbeam', 'Port Root Hinge'],
        failureEffect: 'Boom buckling under thruster loads.',
        cascadeFailures: ['Port Solar Wing'],
        originalPosition: { x: -11, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 0, z: 0 }
    });

    // Solar Panel Detailed Generator
    function createSolarPanelSegment(isBase = false) {
        const panelGroup = new THREE.Group();
        
        // Main composite backplane
        const frameGeom = new THREE.BoxGeometry(7, 14, 0.25);
        const frame = new THREE.Mesh(frameGeom, darkSteel);
        panelGroup.add(frame);

        // Highly detailed Instanced PV Cells
        const cellGeom = new THREE.PlaneGeometry(0.4, 0.8);
        const cols = 16;
        const rows = 16;
        const cellCount = cols * rows;
        const instancedCells = new THREE.InstancedMesh(cellGeom, pvMaterial, cellCount);
        
        const cellSpacingX = 0.42;
        const cellSpacingY = 0.84;
        
        let idx = 0;
        const dummy = new THREE.Object3D();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = - (cols * cellSpacingX) / 2 + (c * cellSpacingX) + (cellSpacingX/2);
                const y = - (rows * cellSpacingY) / 2 + (r * cellSpacingY) + (cellSpacingY/2);
                dummy.position.set(x, y, 0.13); // just above backplane
                dummy.updateMatrix();
                instancedCells.setMatrixAt(idx++, dummy.matrix);
            }
        }
        panelGroup.add(instancedCells);

        // Intricate Backside cooling pipes
        for(let i = -3; i <= 3; i += 1) {
            const pipePath = new THREE.LineCurve3(
                new THREE.Vector3(i, -6.5, -0.15),
                new THREE.Vector3(i, 6.5, -0.15)
            );
            const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipePath, 16, 0.05, 8, false), chrome);
            panelGroup.add(pipe);
        }
        
        // Edge strengthening brackets
        const bracketGeom = new THREE.BoxGeometry(0.4, 14.2, 0.4);
        const leftBracket = new THREE.Mesh(bracketGeom, aluminum);
        leftBracket.position.set(-3.5, 0, 0);
        panelGroup.add(leftBracket);
        
        const rightBracket = new THREE.Mesh(bracketGeom, aluminum);
        rightBracket.position.set(3.5, 0, 0);
        panelGroup.add(rightBracket);

        return panelGroup;
    }

    // Function to build entire deployable wing
    function buildWing(parentArm, sign, sideName, startOrder) {
        const wingMeshes = {};
        
        // Hinge A
        const hingeAGeom = new THREE.CylinderGeometry(0.8, 0.8, 7.5, 32);
        const hingeA = new THREE.Mesh(hingeAGeom, copper);
        hingeA.rotation.z = Math.PI/2;
        hingeA.position.y = 6; // End of the 12-length arm
        parentArm.add(hingeA);
        
        // Mechanical locking pin on hinge
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 16), steel);
        hingeA.add(pin);

        parts.push({
            name: `${sideName} Root Motorized Hinge`,
            description: `Primary deployment hinge mechanism containing stepper motors, harmonic drives, and redundant locking pins.`,
            material: 'copper / steel',
            function: 'Executes the first phase 90-degree deployment sequence.',
            assemblyOrder: startOrder,
            connections: [`${sideName} Truss Arm`, `${sideName} Base Panel`],
            failureEffect: 'Wing jams during deployment sequence.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: sign * 10, y: 10, z: 10 }
        });

        const p1Pivot = new THREE.Group();
        hingeA.add(p1Pivot);
        const panel1 = createSolarPanelSegment(true);
        panel1.position.y = 7; // shift so pivot is at bottom
        p1Pivot.add(panel1);
        wingMeshes.p1Pivot = p1Pivot;

        parts.push({
            name: `${sideName} Base Photovoltaic Array`,
            description: 'Massive first-stage panel. Features dense arrays of triple-junction Gallium Indium Phosphide / Gallium Arsenide / Germanium cells.',
            material: 'pvMaterial / darkSteel',
            function: 'Generates primary segment power and acts as structural base for extended panels.',
            assemblyOrder: startOrder + 1,
            connections: [`${sideName} Root Motorized Hinge`, `${sideName} Secondary Hinge`],
            failureEffect: 'Loss of 33% wing power capacity.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 15 }
        });

        // Hinge B
        const hingeB = new THREE.Mesh(hingeAGeom, copper);
        hingeB.position.y = 7; // top of panel 1
        panel1.add(hingeB);

        parts.push({
            name: `${sideName} Secondary Hinge`,
            description: 'Spring-loaded, viscous-damped deployment hinge.',
            material: 'copper',
            function: 'Provides smooth 180-degree unfolding of the middle segment.',
            assemblyOrder: startOrder + 2,
            connections: [`${sideName} Base Photovoltaic Array`, `${sideName} Middle Photovoltaic Array`],
            failureEffect: 'Violent snap-deployment causing structural fracture.',
            cascadeFailures: [`${sideName} Middle Photovoltaic Array`],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: sign * 10, y: 10, z: -10 }
        });

        const p2Pivot = new THREE.Group();
        hingeB.add(p2Pivot);
        const panel2 = createSolarPanelSegment();
        panel2.position.y = 7;
        p2Pivot.add(panel2);
        wingMeshes.p2Pivot = p2Pivot;

        parts.push({
            name: `${sideName} Middle Photovoltaic Array`,
            description: 'Second stage panel continuing the massive power generation surface.',
            material: 'pvMaterial',
            function: 'Provides secondary segment power.',
            assemblyOrder: startOrder + 3,
            connections: [`${sideName} Secondary Hinge`, `${sideName} Tertiary Hinge`],
            failureEffect: 'Loss of 33% wing power capacity.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -15 }
        });

        // Hinge C
        const hingeC = new THREE.Mesh(hingeAGeom, copper);
        hingeC.position.y = 7;
        panel2.add(hingeC);

        parts.push({
            name: `${sideName} Tertiary Hinge`,
            description: 'Final stage hinge with latching mechanisms to lock the entire wing in a rigid planar configuration.',
            material: 'copper',
            function: 'Completes deployment and ensures rigidity against orbital perturbations.',
            assemblyOrder: startOrder + 4,
            connections: [`${sideName} Middle Photovoltaic Array`, `${sideName} Outer Photovoltaic Array`],
            failureEffect: 'Panel flapping during thruster burns.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: sign * 10, y: 10, z: 10 }
        });

        const p3Pivot = new THREE.Group();
        hingeC.add(p3Pivot);
        const panel3 = createSolarPanelSegment();
        panel3.position.y = 7;
        p3Pivot.add(panel3);
        wingMeshes.p3Pivot = p3Pivot;
        
        // Add tension guide cables from Outer to Base
        const cableMat = rubber;
        const leftCableCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-3.5, 7, 0),
            new THREE.Vector3(-4, -7, 2),
            new THREE.Vector3(-3.5, -21, 0)
        );
        const leftCable = new THREE.Mesh(new THREE.TubeGeometry(leftCableCurve, 16, 0.05, 8, false), cableMat);
        panel3.add(leftCable);
        wingMeshes.leftCable = leftCable;

        parts.push({
            name: `${sideName} Outer Photovoltaic Array`,
            description: 'Terminal stage array housing additional edge sensors and tension cable anchoring points.',
            material: 'pvMaterial',
            function: 'Completes the massive power generation wing.',
            assemblyOrder: startOrder + 5,
            connections: [`${sideName} Tertiary Hinge`],
            failureEffect: 'Loss of terminal power segment.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 15 }
        });

        return wingMeshes;
    }

    const sbWings = buildWing(starboardArm, 1, 'Starboard', 9);
    meshes.sbWings = sbWings;
    
    const portWings = buildWing(portArm, -1, 'Port', 15);
    meshes.portWings = portWings;

    // Advanced Telemetry Antenna on the bottom of the core
    const antennaGroup = new THREE.Group();
    const dishGeom = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const dish = new THREE.Mesh(dishGeom, chrome);
    dish.rotation.x = Math.PI;
    
    // Intricate feed horn
    const feedGroup = new THREE.Group();
    const tripod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), steel);
    tripod1.position.set(1.5, -1, 0);
    tripod1.rotation.z = Math.PI/6;
    const tripod2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), steel);
    tripod2.position.set(-0.75, -1, 1.3);
    tripod2.rotation.z = -Math.PI/6;
    tripod2.rotation.x = -Math.PI/6;
    const tripod3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), steel);
    tripod3.position.set(-0.75, -1, -1.3);
    tripod3.rotation.z = -Math.PI/6;
    tripod3.rotation.x = Math.PI/6;
    
    const feedReceiver = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.5), copper);
    feedReceiver.position.y = -2.2;
    
    feedGroup.add(tripod1, tripod2, tripod3, feedReceiver);
    dish.add(feedGroup);
    
    antennaGroup.add(dish);
    antennaGroup.position.set(0, 0, -5);
    antennaGroup.rotation.x = Math.PI / 2;
    coreGroup.add(antennaGroup);
    meshes.antennaGroup = antennaGroup;

    parts.push({
        name: 'High-Gain Telemetry Dish',
        description: 'Parabolic reflector dish with a precision machined tri-pod feed horn. Transmits massive amounts of diagnostic array data to ground stations.',
        material: 'chrome / copper',
        function: 'Maintains ultra-high bandwidth S-band and X-band communication links.',
        assemblyOrder: 21,
        connections: ['Primary Core Hub'],
        failureEffect: 'Total loss of ground control telemetry and diagnostic monitoring.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -5 },
        explodedPosition: { x: 0, y: -10, z: -25 }
    });

    // Gyroscope / Reaction Wheel Assembly
    const gyroGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 32), steel);
        if (i===0) wheel.rotation.x = Math.PI/2;
        if (i===1) wheel.rotation.z = Math.PI/2;
        gyroGroup.add(wheel);
        
        // Add spinning indicator ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 16, 32), glowMaterial);
        wheel.add(ring);
    }
    gyroGroup.position.set(0, 0, 4);
    coreGroup.add(gyroGroup);
    meshes.gyroGroup = gyroGroup;

    parts.push({
        name: 'Attitude Control Reaction Wheels',
        description: 'Tri-axial heavy-mass spinning flywheels driven by redundant electric motors.',
        material: 'steel / glowMaterial',
        function: 'Stores angular momentum to control the spacecrafts pitch, yaw, and roll without consuming propellant.',
        assemblyOrder: 22,
        connections: ['Primary Core Hub'],
        failureEffect: 'Loss of precise stabilization; spacecraft may enter an uncontrolled spin.',
        cascadeFailures: ['Sun Tracking', 'Telemetry Alignment'],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 10, z: 25 }
    });

    // Extremely detailed quiz questions
    const quizQuestions = [
        {
            question: "What is the critical function of the Beta Gimbal Rotor in this assembly?",
            options: [
                "To rotate the solar arrays 360 degrees to continuously track the sun.",
                "To retract the arrays during orbital debris encounters.",
                "To generate artificial gravity for the core systems.",
                "To cool the panels by exposing both sides to deep space."
            ],
            correctAnswer: 0,
            explanation: "The Beta Gimbal Rotor, driven by the Stator Base, slowly and continuously rotates the massive truss and panel assembly. This ensures the solar cells remain perfectly perpendicular to the solar vector, maximizing power generation."
        },
        {
            question: "Why is the Central Truss Crossbeam constructed as a complex X-braced framework rather than a solid tube?",
            options: [
                "To allow sunlight to pass through and reach the core.",
                "To provide maximum torsional and bending rigidity while minimizing mass.",
                "To serve as a thermal radiator for the core hub.",
                "To trap micro-meteoroids before they hit the panels."
            ],
            correctAnswer: 1,
            explanation: "In spacecraft engineering, mass is heavily penalized. The X-braced truss geometry provides extreme structural stiffness against the torsional loads of the rotating arrays and thruster burns, using only a fraction of the mass of a solid structure."
        },
        {
            question: "How do the arrays handle the severe heat generated by the massive power output?",
            options: [
                "Through liquid coolant loops pumped directly into the solar cells.",
                "By shutting down half the arrays during peak solar exposure.",
                "Through intricate backside cooling pipes and the PCU's thermal radiator fins rejecting heat into space.",
                "By venting pressurized nitrogen gas."
            ],
            correctAnswer: 2,
            explanation: "The backside of the panels features a network of cooling pipes to distribute heat, while the Power Conditioning Unit (PCU) uses large metallic radiator fins to reject the immense thermal loads directly into the vacuum of space via infrared radiation."
        },
        {
            question: "What is the consequence of a failure in the Secondary or Tertiary Hinges during deployment?",
            options: [
                "The spacecraft's core will immediately overheat.",
                "The wings will snap off due to extreme tension.",
                "The panels will fail to lock into a rigid plane, causing them to flap and degrade structural integrity during orbital maneuvers.",
                "The sun tracking motor will automatically reverse to correct the fault."
            ],
            correctAnswer: 2,
            explanation: "The secondary and tertiary hinges are designed to unfold and securely lock the massive wings into a perfectly rigid planar state. Failure to lock leaves the structure loose, meaning thruster firings could cause catastrophic flapping and structural fatigue."
        },
        {
            question: "What role does the Multi-Layer Insulation (MLI) gold foil play on the Primary Core Hub?",
            options: [
                "It serves purely as a radar-absorbent material.",
                "It manages extreme thermal gradients by highly reflecting solar infrared radiation, protecting critical internal electronics.",
                "It generates secondary power via photoelectric effect.",
                "It acts as a physical shield against large orbital debris."
            ],
            correctAnswer: 1,
            explanation: "MLI 'gold foil' is a thermal control blanket. Spacecraft experience massive temperature swings (e.g., +200°C in sunlight to -150°C in shadow). The highly reflective MLI prevents heat absorption in sunlight and retains internal heat during eclipses."
        }
    ];

    // Animation variables
    const animState = {
        unfoldPhase: 0,
        deployDirection: 1
    };

    function animate(time, speed, meshes) {
        // Continuous Rotations
        meshes.rotorGroup.rotation.z = time * speed * 0.1;
        
        // Scan antenna slightly
        meshes.antennaGroup.rotation.z = Math.sin(time * speed * 0.5) * 0.2;
        meshes.antennaGroup.rotation.y = Math.cos(time * speed * 0.3) * 0.2;

        // Spin Reaction Wheels (Gyros) rapidly
        meshes.gyroGroup.children[0].rotation.y += speed * 0.5;
        meshes.gyroGroup.children[1].rotation.y -= speed * 0.4;
        meshes.gyroGroup.children[2].rotation.y += speed * 0.6;

        // Pulse the PCU radiator fins
        meshes.pcuFins.forEach((fin, index) => {
            const pulse = (Math.sin(time * speed * 4 + index) + 1) / 2;
            if (pulse > 0.85) {
                fin.material = glowMaterial;
            } else {
                fin.material = darkSteel;
            }
        });

        // Unfolding Kinematics with Smooth Easing
        const cycleSpeed = speed * 0.15;
        animState.unfoldPhase += cycleSpeed * animState.deployDirection;
        if (animState.unfoldPhase > 1) {
            animState.unfoldPhase = 1;
            animState.deployDirection = -1; // Auto reverse to simulate deploy/stow testing
        } else if (animState.unfoldPhase < 0) {
            animState.unfoldPhase = 0;
            animState.deployDirection = 1;
        }

        // Complex easing function (Sine in-out)
        const easeT = (Math.sin((animState.unfoldPhase - 0.5) * Math.PI) + 1) / 2;

        // Folding Angles
        // P1 targets 0, folded is 90 deg (Math.PI/2)
        const p1Target = 0;
        const p1Folded = Math.PI / 2;
        
        // P2 targets 0, folded is -180 deg (-Math.PI + 0.05 to avoid clip)
        const p2Target = 0;
        const p2Folded = -Math.PI + 0.05;

        // P3 targets 0, folded is 180 deg (Math.PI - 0.05)
        const p3Target = 0;
        const p3Folded = Math.PI - 0.05;

        const currentP1 = p1Folded + (p1Target - p1Folded) * easeT;
        const currentP2 = p2Folded + (p2Target - p2Folded) * easeT;
        const currentP3 = p3Folded + (p3Target - p3Folded) * easeT;

        // Apply to Starboard
        meshes.sbWings.p1Pivot.rotation.x = currentP1;
        meshes.sbWings.p2Pivot.rotation.x = currentP2;
        meshes.sbWings.p3Pivot.rotation.x = currentP3;

        // Apply to Port (mirrored symmetrically)
        meshes.portWings.p1Pivot.rotation.x = currentP1;
        meshes.portWings.p2Pivot.rotation.x = currentP2;
        meshes.portWings.p3Pivot.rotation.x = currentP3;
        
        // Tension cable dynamics - as the array folds, the cables droop/flex.
        // We simulate this by simply shifting their Z-scale slightly
        const cableScale = 1 + (1 - easeT) * 0.5; // bows out when folded
        meshes.sbWings.leftCable.scale.set(1, 1, cableScale);
        meshes.portWings.leftCable.scale.set(1, 1, cableScale);
    }

    return {
        group,
        parts,
        description: "An incredibly complex, hyper-realistic Spacecraft Engineering Solar Array. Features massive multi-stage photovoltaic wings deployed via motorized precision hinges. Engineered with a central Beta Gimbal tracking rotor, X-braced truss deployment booms, tri-axial reaction wheels, and a dense network of thermal management and telemetry systems. Simulates true mechanical unfolding kinematics and dynamic orbital structural logic.",
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createSolarArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
