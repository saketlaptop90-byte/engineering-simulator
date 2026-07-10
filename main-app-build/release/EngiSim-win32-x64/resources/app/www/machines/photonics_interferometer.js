import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const laserBeamMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8
    });
    const laserBeamSplitMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.6
    });
    const activeScreenMat = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        wireframe: true
    });
    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x88bbff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.5,
        ior: 1.5
    });

    // --- Helper Functions ---
    function addPart(name, mesh, description, materialName, func, fail, cascade, ox, oy, oz) {
        mesh.position.set(ox, oy, oz);
        group.add(mesh);
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder: parts.length + 1,
            connections: ['Optical Bench', 'Laser Path'],
            failureEffect: fail,
            cascadeFailures: cascade,
            originalPosition: { x: ox, y: oy, z: oz },
            explodedPosition: { x: ox + (Math.random()-0.5)*15, y: oy + 5 + Math.random()*10, z: oz + (Math.random()-0.5)*15 }
        });
        meshes[name] = mesh;
    }

    // 1. Optical Bench
    const benchGroup = new THREE.Group();
    
    // Breadboard top
    const boardGeom = new THREE.BoxGeometry(40, 1, 30);
    const board = new THREE.Mesh(boardGeom, darkSteel);
    board.position.y = 0.5;
    benchGroup.add(board);
    
    // Honeycomb pattern holes
    const holeGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.01, 8);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    for(let i = -18; i <= 18; i+=1.5) {
        for(let j = -13; j <= 13; j+=1.5) {
            const hole = new THREE.Mesh(holeGeom, holeMat);
            hole.position.set(i, 0.5, j);
            benchGroup.add(hole);
        }
    }
    
    // Vibration Isolators (Legs)
    for(let x of [-18, 18]) {
        for(let z of [-13, 13]) {
            const legGroup = new THREE.Group();
            
            const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 10, 32), steel);
            outerCyl.position.y = -5;
            legGroup.add(outerCyl);
            
            const piston = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 12, 32), chrome);
            piston.position.y = -6;
            legGroup.add(piston);
            
            // Pneumatic valves
            const valve = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), copper);
            valve.position.set(1.5, -3, 0);
            legGroup.add(valve);
            
            legGroup.position.set(x, 0, z);
            benchGroup.add(legGroup);
        }
    }
    
    addPart('Vibration-Isolated Optical Bench', benchGroup, 'Massive steel breadboard with pneumatic vibration isolation legs.', 'Steel/Dark Steel', 'Provides an ultra-stable platform for interferometry, isolating optical components from seismic noise.', 'Misalignment of optics due to vibrations.', ['Fringe pattern washout', 'Data corruption'], 0, 0, 0);

    // 2. High-Power Solid State Laser Source
    const laserGroup = new THREE.Group();
    
    // Casing
    const laserBody = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 3), aluminum);
    laserBody.position.y = 1.5;
    laserGroup.add(laserBody);
    
    // Heatsink fins
    for(let i = -2.5; i <= 2.5; i+=0.4) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 3.2), darkSteel);
        fin.position.set(i, 1.5, 0);
        laserGroup.add(fin);
    }
    
    // Aperture
    const aperture = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), chrome);
    aperture.rotation.z = Math.PI / 2;
    aperture.position.set(3.1, 1.5, 0);
    laserGroup.add(aperture);
    
    // Warning Labels and connectors
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshStandardMaterial({color: 0xffff00}));
    label.position.set(0, 3.01, 0);
    label.rotation.x = -Math.PI/2;
    laserGroup.add(label);
    
    const powerConnect = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), copper);
    powerConnect.rotation.z = Math.PI/2;
    powerConnect.position.set(-3.1, 1.5, 0);
    laserGroup.add(powerConnect);

    addPart('Nd:YAG Pump Laser Source', laserGroup, 'High-stability narrow-linewidth laser source.', 'Aluminum/Dark Steel', 'Generates the coherent light beam required for the interferometer.', 'Loss of coherence or total beam failure.', ['No interference pattern', 'Experiment shutdown'], -14, 1, 10);

    // Kinematic Mount Generator
    function createKinematicMount(height, opticMesh, isBeamSplitter) {
        const mount = new THREE.Group();
        
        // Base pedestal
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, height, 32), steel);
        pedestal.position.y = height/2;
        mount.add(pedestal);
        
        // Fixed Plate
        const fixedPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 3), darkSteel);
        fixedPlate.position.set(-0.25, height + 1.5, 0);
        mount.add(fixedPlate);
        
        // Moving Plate
        const movingPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 3), aluminum);
        movingPlate.position.set(0.25, height + 1.5, 0);
        mount.add(movingPlate);
        
        // Micrometer Adjusters
        const knobPoints = [];
        for (let i = 0; i < 10; i++) knobPoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.1 + 0.3, i * 0.1));
        const knobGeom = new THREE.LatheGeometry(knobPoints, 32);
        
        for(let py of [height+0.5, height+2.5]) {
            for(let pz of [-1, 1]) {
                if(py === height+2.5 && pz === -1) continue; // 3-point kinematic
                const knob = new THREE.Mesh(knobGeom, chrome);
                knob.rotation.z = -Math.PI/2;
                knob.position.set(-0.5, py, pz);
                mount.add(knob);
                
                const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), steel);
                shaft.rotation.z = Math.PI/2;
                shaft.position.set(0, py, pz);
                mount.add(shaft);
            }
        }
        
        // Optic
        opticMesh.position.set(0.6, height + 1.5, 0);
        mount.add(opticMesh);
        
        return mount;
    }

    // 3. Beam Splitter 1
    const bs1Geom = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const bs1Optic = new THREE.Mesh(bs1Geom, glass);
    bs1Optic.rotation.x = Math.PI/2;
    bs1Optic.rotation.y = Math.PI/4; // 45 deg
    const bs1Mount = createKinematicMount(2, bs1Optic, true);
    addPart('Primary Beam Splitter (BS1)', bs1Mount, '50/50 non-polarizing beam splitter on kinematic mount.', 'Steel/Glass', 'Splits the initial laser into reference and test arms.', 'Unequal intensity in arms.', ['Poor fringe visibility'], -6, 1, 10);

    // 4. Mirror 1
    const m1Geom = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const m1Optic = new THREE.Mesh(m1Geom, goldPlated);
    m1Optic.rotation.x = Math.PI/2;
    m1Optic.rotation.y = -Math.PI/4;
    const m1Mount = createKinematicMount(2, m1Optic, false);
    addPart('Reference Arm Mirror (M1)', m1Mount, 'Highly reflective gold-plated mirror on kinematic mount.', 'Steel/Gold', 'Folds the reference beam towards the second beam splitter.', 'Beam divergence or absorption.', ['Loss of reference signal'], 6, 1, 10);

    // 5. Mirror 2
    const m2Optic = new THREE.Mesh(m1Geom, goldPlated);
    m2Optic.rotation.x = Math.PI/2;
    m2Optic.rotation.y = Math.PI/4;
    const m2Mount = createKinematicMount(2, m2Optic, false);
    // Rotating the mount itself to face the beam from BS1
    m2Mount.rotation.y = -Math.PI/2;
    addPart('Test Arm Mirror (M2)', m2Mount, 'Highly reflective mirror folding the test arm.', 'Steel/Gold', 'Directs the test beam to recombine.', 'Beam misalignment.', ['Interference failure'], -6, 1, 0);

    // 6. Phase Modulator (Electro-Optic)
    const modulatorGroup = new THREE.Group();
    const modPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 1.5, 16), steel);
    modPedestal.position.y = 0.75;
    modulatorGroup.add(modPedestal);
    
    const modBody = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 4), aluminum);
    modBody.position.y = 2.5;
    modulatorGroup.add(modBody);
    
    const modCrystal = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.5), lensMat);
    modCrystal.position.y = 2.5;
    modulatorGroup.add(modCrystal);
    
    // SMA Connectors & Wires
    const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), chrome);
    sma.position.set(0, 3.5, 0);
    modulatorGroup.add(sma);
    
    const wireShape = new THREE.CurvePath();
    const wirePath = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,3.7,0), new THREE.Vector3(0,5,-3), new THREE.Vector3(4,0,-3));
    const wireTube = new THREE.Mesh(new THREE.TubeGeometry(wirePath, 20, 0.05, 8, false), rubber);
    modulatorGroup.add(wireTube);
    
    addPart('Electro-Optic Phase Modulator', modulatorGroup, 'Lithium Niobate crystal modulator for rapid phase shifting.', 'Aluminum/Glass/Rubber', 'Induces a precise, electrically-controllable phase shift in the test arm.', 'Inability to sweep phase.', ['Static fringe pattern'], -6, 1, 5);

    // 7. Sample Chamber
    const chamberGroup = new THREE.Group();
    const cBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 1, 32), darkSteel);
    cBase.position.y = 0.5;
    chamberGroup.add(cBase);
    
    const cWindowGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32, 1, true);
    const cWindow = new THREE.Mesh(cWindowGeom, tinted);
    cWindow.position.y = 2.5;
    chamberGroup.add(cWindow);
    
    const cTop = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), darkSteel);
    cTop.position.y = 4.25;
    chamberGroup.add(cTop);
    
    // Internal sample holder
    const sampleHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), steel);
    sampleHolder.position.y = 2.5;
    chamberGroup.add(sampleHolder);
    
    addPart('Vacuum Sample Chamber', chamberGroup, 'Environmental isolation chamber for test samples.', 'Dark Steel/Tinted Glass', 'Holds the material/gas being measured by the interferometer.', 'Atmospheric fluctuations enter test arm.', ['Noisy phase data'], 0, 1, 0);

    // 8. Beam Splitter 2 (Recombination)
    const bs2Optic = new THREE.Mesh(bs1Geom, glass);
    bs2Optic.rotation.x = Math.PI/2;
    bs2Optic.rotation.y = Math.PI/4;
    const bs2Mount = createKinematicMount(2, bs2Optic, true);
    bs2Mount.rotation.y = -Math.PI/2;
    addPart('Recombination Beam Splitter (BS2)', bs2Mount, 'Recombines the reference and test arms to form interference.', 'Steel/Glass', 'Superimposes the two waves to create fringes.', 'Beams do not overlap properly.', ['No fringes formed'], 6, 1, 0);

    // 9. Detector Array
    const detectorGroup = new THREE.Group();
    const detBase = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), darkSteel);
    detBase.position.y = 0.5;
    detectorGroup.add(detBase);
    
    const detTube = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), aluminum);
    detTube.rotation.z = Math.PI/2;
    detTube.position.set(-1.5, 2.5, 0);
    detectorGroup.add(detTube);
    
    const detSensor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), activeScreenMat);
    detSensor.rotation.y = -Math.PI/2;
    detSensor.position.set(-0.49, 2.5, 0);
    detectorGroup.add(detSensor);
    
    // Readout Screen on detector
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 2), plastic);
    screen.position.set(1.4, 3, 0);
    detectorGroup.add(screen);
    const screenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.3), activeScreenMat);
    screenDisplay.rotation.y = Math.PI/2;
    screenDisplay.position.set(1.46, 3, 0);
    detectorGroup.add(screenDisplay);
    meshes['FringeScreen'] = screenDisplay;

    // Data Cables
    for(let i=0; i<3; i++) {
        const dCable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5), rubber);
        dCable.rotation.x = Math.PI/2;
        dCable.position.set(0, 0.5, 2.5 + i*0.2);
        detectorGroup.add(dCable);
    }

    addPart('High-Speed Photodiode Array', detectorGroup, 'Avalanche photodiode array for detecting fringe intensity.', 'Aluminum/Dark Steel/Plastic', 'Measures the constructive and destructive interference intensity.', 'Signal loss.', ['Measurement totally fails'], 12, 1, 0);

    // 10. Data Acquisition System (DAQ)
    const daqGroup = new THREE.Group();
    const rack = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 5), darkSteel);
    rack.position.y = 6;
    daqGroup.add(rack);
    
    for(let i=0; i<4; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(6.1, 2, 4.8), aluminum);
        panel.position.y = 2.5 + i*2.5;
        daqGroup.add(panel);
        
        for(let j=0; j<5; j++) {
            const ledMat = new THREE.MeshStandardMaterial({color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000, emissive: 0x00ff00, emissiveIntensity: 2});
            const led = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2), ledMat);
            led.rotation.x = Math.PI/2;
            led.position.set(-2 + j*0.5, 2.5 + i*2.5, 2.45);
            daqGroup.add(led);
            meshes['LED_' + i + '_' + j] = led;
        }
    }
    
    // Main Monitor
    const monitorBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), plastic);
    monitorBase.position.set(0, 12.5, 0);
    daqGroup.add(monitorBase);
    
    const monitorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), steel);
    monitorArm.position.set(0, 13.5, 0);
    daqGroup.add(monitorArm);
    
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.5), plastic);
    monitor.position.set(0, 14.5, 0.5);
    daqGroup.add(monitor);
    
    const uiScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.8), activeScreenMat);
    uiScreen.position.set(0, 14.5, 0.76);
    daqGroup.add(uiScreen);
    meshes['UIScreen'] = uiScreen;

    addPart('Data Acquisition & Control Unit', daqGroup, 'Central processor for phase modulation control and readout.', 'Steel/Plastic', 'Coordinates modulation and computes phase shift from detector intensity.', 'System goes offline.', ['Complete failure'], -15, -6, -10);

    // --- BEAM PATHS ---
    const beamRadius = 0.05;
    const beams = new THREE.Group();
    
    function createBeam(x1, y1, z1, x2, y2, z2, split = false) {
        const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
        const geom = new THREE.CylinderGeometry(beamRadius, beamRadius, length, 8);
        geom.translate(0, length/2, 0);
        geom.rotateX(Math.PI/2);
        const mesh = new THREE.Mesh(geom, split ? laserBeamSplitMat : laserBeamMat);
        mesh.position.set(x1, y1, z1);
        mesh.lookAt(x2, y2, z2);
        return mesh;
    }

    const yLevel = 4.5;
    
    const beam1 = createBeam(-11, yLevel, 10, -6, yLevel, 10);
    beams.add(beam1);
    
    const beam2 = createBeam(-6, yLevel, 10, 6, yLevel, 10, true);
    beams.add(beam2);
    
    const beam3 = createBeam(6, yLevel, 10, 6, yLevel, 0, true);
    beams.add(beam3);
    
    const beam4 = createBeam(-6, yLevel, 10, -6, yLevel, 0, true);
    beams.add(beam4);
    
    const beam5 = createBeam(-6, yLevel, 0, 6, yLevel, 0, true);
    beams.add(beam5);
    
    const beam6 = createBeam(6, yLevel, 0, 11, yLevel, 0, false);
    beams.add(beam6);
    
    const beam7 = createBeam(6, yLevel, 0, 6, yLevel, -3, true);
    beams.add(beam7);

    addPart('Laser Beam Paths', beams, 'Coherent 532nm laser emission traveling through the optical train.', 'Light', 'Interferes to create measurable phase differences.', 'Beam blocked.', ['No data'], 0, 0, 0);

    // 12. Fiber Optic Couplers
    const fiberGroup = new THREE.Group();
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2, 32), plastic);
    spool.rotation.x = Math.PI/2;
    spool.position.set(-10, 2, -10);
    fiberGroup.add(spool);
    
    const fiberMat = new THREE.MeshStandardMaterial({color: 0xffaa00, wireframe: false});
    const coil = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 64), fiberMat);
    coil.rotation.x = Math.PI/2;
    coil.position.set(-10, 2, -10);
    fiberGroup.add(coil);
    
    addPart('Fiber Optic Delay Line', fiberGroup, 'Spool of polarization-maintaining single-mode fiber.', 'Plastic', 'Adds optical path length to balance the interferometer arms perfectly.', 'Dispersion.', ['Poor fringe visibility'], 0, 0, 0);

    // 13. Collimator Optics
    const colGroup = new THREE.Group();
    const colMount = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 32), darkSteel);
    colMount.rotation.x = Math.PI/2;
    colMount.position.set(-9, 4.5, 10);
    colGroup.add(colMount);
    
    const colLens = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), lensMat);
    colLens.scale.z = 0.2;
    colLens.position.set(-9, 4.5, 10);
    colGroup.add(colLens);

    addPart('Beam Expander / Collimator', colGroup, 'Multi-element lens system to expand and parallelize the beam.', 'Dark Steel/Glass', 'Ensures the beam does not diverge over long path lengths.', 'Beam divergence.', ['Beam clips optics edges'], 0, 0, 0);

    // 14. Environmental Enclosure Frame
    const frameGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.5, roughness: 0.5});
    const strutGeom = new THREE.BoxGeometry(0.5, 15, 0.5);
    
    for(let x of [-19.5, 19.5]) {
        for(let z of [-14.5, 14.5]) {
            const strut = new THREE.Mesh(strutGeom, frameMat);
            strut.position.set(x, 7.5, z);
            frameGroup.add(strut);
        }
    }
    const topX = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 0.5), frameMat);
    topX.position.set(0, 15, 14.5);
    frameGroup.add(topX);
    const topX2 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 0.5), frameMat);
    topX2.position.set(0, 15, -14.5);
    frameGroup.add(topX2);
    
    const topZ = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 30), frameMat);
    topZ.position.set(19.5, 15, 0);
    frameGroup.add(topZ);
    const topZ2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 30), frameMat);
    topZ2.position.set(-19.5, 15, 0);
    frameGroup.add(topZ2);

    addPart('Acoustic Isolation Frame', frameGroup, 'Outer structural frame for acoustic and thermal shielding panels.', 'Aluminum', 'Provides a stable environment by blocking air currents and temperature gradients.', 'Air currents disturb phase.', ['Fringe drift'], 0, 0, 0);
    
    // 15. Alignment Lasers (HeNe)
    const heneGroup = new THREE.Group();
    const heneBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 32), aluminum);
    heneBody.rotation.z = Math.PI/2;
    heneBody.position.set(0, 5, 12);
    heneGroup.add(heneBody);
    addPart('HeNe Alignment Laser', heneGroup, 'Low power red laser used strictly for initial optical alignment.', 'Aluminum', 'Provides visible guide beam when setting up infrared paths.', 'Alignment takes longer.', ['None during operation'], 0, 0, 0);

    const description = "The Mach-Zehnder Photonics Interferometer is an ultra-precision optical instrument used to determine the relative phase shift variations between two collimated beams derived by splitting light from a single source. Featuring a massively stable pneumatic optical bench, kinematic optical mounts, an electro-optic phase modulator, and a high-speed photodiode detector array, this system can measure displacements down to fractions of a nanometer. The test arm passes through a vacuum sample chamber, while the reference arm is routed cleanly to recombine at BS2. The resulting interference fringes are digitized by the DAQ unit for real-time Fourier analysis.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Beam Splitter 1 (BS1)?",
            options: [
                "To focus the beam onto the detector.",
                "To divide the incoming laser into a reference arm and a test arm.",
                "To recombine the beams.",
                "To modulate the phase of the beam."
            ],
            correctAnswer: 1,
            explanation: "BS1 divides the initial coherent beam into two paths: the reference arm and the test arm."
        },
        {
            question: "Why is the entire setup mounted on a massive breadboard with pneumatic legs?",
            options: [
                "To conduct electricity.",
                "To provide magnetic shielding.",
                "To isolate the optical components from seismic vibrations and acoustic noise.",
                "To cool the laser."
            ],
            correctAnswer: 2,
            explanation: "Interferometry relies on path length differences on the order of nanometers; even tiny building vibrations can wash out the fringes."
        },
        {
            question: "What does the Electro-Optic Phase Modulator do in the test arm?",
            options: [
                "It blocks the beam completely.",
                "It changes the polarization to circular.",
                "It induces a precisely controllable phase shift in the test beam.",
                "It amplifies the laser power."
            ],
            correctAnswer: 2,
            explanation: "By applying a voltage, the refractive index of the crystal changes, altering the optical path length and shifting the phase."
        },
        {
            question: "What happens at Beam Splitter 2 (BS2)?",
            options: [
                "The beams are absorbed.",
                "The reference and test arms recombine and superimpose.",
                "The laser is generated.",
                "The beams are converted to electrons."
            ],
            correctAnswer: 1,
            explanation: "BS2 overlaps the reference and test beams. Their phase difference at this point dictates whether they interfere constructively or destructively."
        },
        {
            question: "How does the interference pattern (fringes) indicate a change in the sample?",
            options: [
                "The color of the laser changes.",
                "The beam becomes wider.",
                "The intensity at the detector oscillates as the relative phase changes.",
                "The beam splits into multiple colors."
            ],
            correctAnswer: 2,
            explanation: "As the optical path length of the test arm changes due to the sample, the phase difference changes, causing the detected intensity to cycle between bright and dark (fringes)."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // Pulse laser beams
        const pulse = (Math.sin(t * 5) * 0.2) + 0.8;
        laserBeamMat.emissiveIntensity = 5.0 * pulse;
        laserBeamSplitMat.emissiveIntensity = 2.5 * pulse;
        
        // Simulate vibration isolation (very slow slight drift to show it's active)
        if (meshes['Vibration-Isolated Optical Bench']) {
            meshes['Vibration-Isolated Optical Bench'].position.y = Math.sin(t * 0.5) * 0.05;
        }
        
        // Blink DAQ LEDs
        for(let i=0; i<4; i++) {
            for(let j=0; j<5; j++) {
                const led = meshes['LED_' + i + '_' + j];
                if(led) {
                    led.material.emissiveIntensity = Math.random() > 0.8 ? 2 : 0.2;
                }
            }
        }
        
        // Animate screens (simulate rolling interference fringes on the texture via color/opacity tricks, or just pulse)
        if (meshes['FringeScreen']) {
            const fringeValue = (Math.sin(t * 10) + 1) / 2; // 0 to 1
            meshes['FringeScreen'].material.color.setHex(0x00ff00).multiplyScalar(fringeValue);
            meshes['FringeScreen'].material.emissiveIntensity = fringeValue * 2;
        }
        if (meshes['UIScreen']) {
            meshes['UIScreen'].material.color.setHex(Math.random() * 0xffffff);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createInterferometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
