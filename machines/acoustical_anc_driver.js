import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "Ultra God Tier Acoustical ANC Driver. A planetary-scale apparatus designed to actively cancel the shockwaves of exploding stars using perfectly out-of-phase anti-sound. Constructed with metamaterials, dyson-swarm energy collectors, and degenerate matter, this device achieves total silence through relativistic wave interference.";

    // ==========================================
    // CUSTOM EMISSIVE AND METAMATERIALS
    // ==========================================
    const emissiveBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, wireframe: false 
    });
    const emissiveRed = new THREE.MeshStandardMaterial({ 
        color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 
    });
    const emissiveCyan = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5.0, wireframe: true 
    });
    const metamaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, metalness: 0.9, roughness: 0.2, wireframe: false 
    });
    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0x880088, emissiveIntensity: 4.0, transparent: true, opacity: 0.6
    });

    // Object holding references to meshes that require animation updates
    const animatedMeshes = {
        coneGroup: new THREE.Group(),
        hydraulics: [],
        rotors: [],
        incomingWave: null,
        outgoingWave: null
    };
    
    group.add(animatedMeshes.coneGroup);

    // ==========================================
    // HELPER: PART REGISTRATION
    // ==========================================
    /**
     * Registers a part to the global parts array and adds its mesh to the scene.
     * Enforces extremely detailed metadata for the simulator's engineering analysis.
     */
    const registerPart = (mesh, name, desc, matString, func, order, conns, failure, cascade, origPos, explPos, parent = group) => {
        mesh.position.copy(origPos);
        mesh.userData.originalPosition = origPos.clone();
        mesh.userData.explodedPosition = explPos.clone();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        
        parts.push({
            name: name,
            description: desc,
            material: matString,
            function: func,
            assemblyOrder: order,
            connections: conns,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: { x: origPos.x, y: origPos.y, z: origPos.z },
            explodedPosition: { x: explPos.x, y: explPos.y, z: explPos.z }
        });
        return mesh;
    };

    // ==========================================
    // SUBSYSTEM 1: MAGNETIC FLUX CONTAINMENT
    // ==========================================
    /*
     * The magnetic core must generate a B-field of approx 10^9 Tesla.
     * We use a massive lathe geometry representing a degenerate matter pole piece.
     */
    const polePiecePoints = [];
    for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        // Complex curvature for the pole piece to focus magnetic flux precisely into the gap
        const radius = 10 + Math.sin(t * Math.PI) * 5 - t * 2;
        const z = -40 + t * 45;
        polePiecePoints.push(new THREE.Vector2(radius, z));
    }
    const polePieceGeom = new THREE.LatheGeometry(polePiecePoints, 128);
    const polePieceMesh = new THREE.Mesh(polePieceGeom, darkSteel);
    
    registerPart(
        polePieceMesh,
        "Degenerate_Matter_Pole_Piece",
        "The central core of the magnetic motor structure. Machined from degenerate matter to withstand a 10^9 Tesla magnetic field.",
        "Degenerate Matter",
        "Focuses magnetic flux perfectly into the voice coil gap.",
        1,
        ["Back_Plate", "Voice_Coil", "Phase_Plug"],
        "Magnetic saturation leading to non-linear Lorentz forces.",
        ["Acoustic Harmonic Distortion", "Voice Coil Vaporization"],
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -100)
    );

    // Massive Back Plate
    const backPlateGeom = new THREE.CylinderGeometry(40, 40, 10, 128);
    const backPlateMesh = new THREE.Mesh(backPlateGeom, steel);
    backPlateMesh.rotation.x = Math.PI / 2;
    
    registerPart(
        backPlateMesh,
        "Titanium_Alloy_Back_Plate",
        "Provides the return path for the magnetic circuit and acts as a primary thermal heat sink.",
        "Titanium Alloy",
        "Magnetic return path.",
        2,
        ["Pole_Piece", "Magnets"],
        "Fracture under magnetic stress.",
        ["Total Loss of Magnetic Confinement", "Implosion"],
        new THREE.Vector3(0, 0, -45),
        new THREE.Vector3(0, 0, -150)
    );

    // ==========================================
    // SUBSYSTEM 2: NEODYMIUM-ANTIMATTER HYBRID MAGNETS
    // ==========================================
    // A stacked array of highly emissive torus magnets
    for (let i = 0; i < 4; i++) {
        const magnetGeom = new THREE.TorusGeometry(25 + i * 2, 5, 32, 128);
        const magnetMesh = new THREE.Mesh(magnetGeom, plasmaMat);
        
        registerPart(
            magnetMesh,
            `Hybrid_Magnet_Ring_Layer_${i}`,
            `Layer ${i} of the magnetic drive. Uses antimatter-pumped plasma circulating in a toroidal containment field to generate permanent magnetic flux.`,
            "Antimatter Plasma",
            "Generates the static B-field for the motor.",
            3 + i,
            ["Back_Plate", "Top_Plate"],
            "Containment breach of the plasma.",
            ["Annihilation Event", "Sector Eradication"],
            new THREE.Vector3(0, 0, -35 + i * 8),
            new THREE.Vector3(0, 0, -200 - i * 50)
        );
    }

    // ==========================================
    // SUBSYSTEM 3: RADIATOR FINS
    // ==========================================
    for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(25, 0);
        finShape.lineTo(30, -25);
        finShape.lineTo(5, -25);
        finShape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.3, bevelThickness: 0.3 };
        const finGeom = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
        const finMesh = new THREE.Mesh(finGeom, aluminum);
        
        finMesh.rotation.z = angle;
        finMesh.rotation.x = Math.PI / 2;
        
        registerPart(
            finMesh,
            `Thermal_Radiator_Fin_${i}`,
            `Graphene-reinforced radiator fin ${i}. Dissipates petawatts of excess thermal energy from the magnetic core into the vacuum of space.`,
            "Graphene/Aluminum Matrix",
            "Thermal Management.",
            10 + i,
            ["Magnetic_Core"],
            "Core overheating.",
            ["Thermal Runaway", "Magnet Quench", "Explosion"],
            new THREE.Vector3(Math.cos(angle)*30, Math.sin(angle)*30, -20),
            new THREE.Vector3(Math.cos(angle)*100, Math.sin(angle)*100, -20)
        );
    }

    // ==========================================
    // SUBSYSTEM 4: THE METAMATERIAL DIAPHRAGM
    // ==========================================
    const conePoints = [];
    for (let i = 0; i <= 300; i++) {
        const t = i / 300;
        // Exponential flare to match interstellar acoustic impedance
        const radius = 10.5 + Math.pow(t, 2.2) * 90; 
        const z = 5 + t * 50; 
        conePoints.push(new THREE.Vector2(radius, z));
    }
    // Add thickness for the back of the cone (creates a solid shell)
    for (let i = 300; i >= 0; i--) {
        const t = i / 300;
        const radius = 10.5 + Math.pow(t, 2.2) * 90; 
        const z = 5 + t * 50 - 1.2;
        conePoints.push(new THREE.Vector2(radius, z));
    }
    const coneGeom = new THREE.LatheGeometry(conePoints, 256);
    const coneMesh = new THREE.Mesh(coneGeom, metamaterial);
    
    registerPart(
        coneMesh,
        "Exotic_Metamaterial_Diaphragm",
        "The primary acoustic radiating surface. Woven from cosmic string fragments and single-walled carbon nanotubes to withstand relativistic stresses.",
        "Cosmic String Metamaterial",
        "Couples the mechanical motion of the voice coil to the interstellar medium to generate the anti-shockwave.",
        100,
        ["Voice_Coil_Former", "Surround", "Dust_Cap"],
        "Cone breakup or shattering due to extreme acceleration.",
        ["Acoustic Distortion", "Loss of Phase Coherence", "Ineffective Cancellation"],
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 150),
        animatedMeshes.coneGroup
    );

    // ==========================================
    // SUBSYSTEM 5: THE VOICE COIL & FORMER
    // ==========================================
    const coilFormerGeom = new THREE.CylinderGeometry(10.5, 10.5, 25, 128, 1, true);
    const coilFormerMesh = new THREE.Mesh(coilFormerGeom, plastic); 
    
    registerPart(
        coilFormerMesh,
        "Kapton_Voice_Coil_Former",
        "A hyper-resilient polymer cylindrical former on which the superconducting wire is wound. Resists temperatures up to 5000K.",
        "Kapton-X",
        "Transfers Lorentz force from the voice coil wire to the diaphragm.",
        80,
        ["Voice_Coil_Wire", "Spider_Suspension", "Diaphragm"],
        "Deformation under load, leading to coil rubbing against the pole piece.",
        ["Coil Rub", "Frictional Vaporization"],
        new THREE.Vector3(0, 0, -2.5),
        new THREE.Vector3(0, 0, 80),
        animatedMeshes.coneGroup
    );

    class VoiceCoilCurve extends THREE.Curve {
        constructor(radius, turns, height) {
            super();
            this.radius = radius;
            this.turns = turns;
            this.height = height;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            const z = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }
    const vCoilCurve = new VoiceCoilCurve(10.7, 100, 15);
    const vCoilGeom = new THREE.TubeGeometry(vCoilCurve, 1000, 0.2, 16, false);
    const vCoilMesh = new THREE.Mesh(vCoilGeom, copper);
    
    registerPart(
        vCoilMesh,
        "Superconducting_Voice_Coil_Winding",
        "100 turns of hyper-dense YBCO superconducting wire. Carrying 5.4 Yottawatts of power to generate the opposing magnetic field.",
        "YBCO Superconductor",
        "Generates the Lorentz force to move the massive diaphragm.",
        81,
        ["Voice_Coil_Former", "Superconducting_Conduits"],
        "Quench event. The wire loses superconductivity and instantly vaporizes with the energy of a small star.",
        ["Nuclear Explosion", "Total Destruction"],
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(0, 0, 90),
        animatedMeshes.coneGroup
    );

    // ==========================================
    // SUBSYSTEM 6: NEUTRON STAR ALLOY SPIDER
    // ==========================================
    const spiderPoints = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const radius = 11 + t * 30; // from radius 11 to 41
        // Corrugations: a diminishing sine wave
        const z = Math.sin(t * Math.PI * 30) * (2.0 - t * 1.5);
        spiderPoints.push(new THREE.Vector2(radius, z));
    }
    const spiderGeom = new THREE.LatheGeometry(spiderPoints, 128);
    const spiderMesh = new THREE.Mesh(spiderGeom, rubber);
    
    registerPart(
        spiderMesh,
        "Neutron_Alloy_Spider_Suspension",
        "The primary restoring force mechanism. A highly corrugated suspension matrix made of neutron-degenerate matter.",
        "Neutron-Alloy Rubber",
        "Maintains voice coil concentricity within the magnetic gap while allowing massive axial excursion.",
        75,
        ["Voice_Coil_Former", "Basket_Frame"],
        "Asymmetric stiffness leading to voice coil rock.",
        ["Coil Rub", "Short Circuit"],
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(0, 0, 100),
        animatedMeshes.coneGroup // Moves with the cone for simulation purposes
    );

    // ==========================================
    // SUBSYSTEM 7: HYPER-ELASTIC SURROUND ROLL
    // ==========================================
    const surroundRadius = 100.5; // aligns with cone outer edge
    const surroundTube = 6;
    const surroundGeom = new THREE.TorusGeometry(surroundRadius, surroundTube, 64, 256);
    const surroundMesh = new THREE.Mesh(surroundGeom, rubber);
    
    registerPart(
        surroundMesh,
        "Hyper_Elastic_Surround_Roll",
        "A half-roll surround made of synthetic hyper-elastic polymers. Allows extreme axial excursion (thousands of kilometers) while maintaining centration.",
        "Hyper-Polymer",
        "Outer suspension and acoustic seal.",
        105,
        ["Diaphragm", "Basket_Frame"],
        "Tear in the surround, causing an acoustic short circuit.",
        ["Loss of Low Frequency Response", "Cone Misalignment"],
        new THREE.Vector3(0, 0, 55),
        new THREE.Vector3(0, 0, 180),
        animatedMeshes.coneGroup
    );

    // ==========================================
    // SUBSYSTEM 8: TITANIUM BASKET FRAME
    // ==========================================
    const topRingGeom = new THREE.TorusGeometry(surroundRadius + 6, 4, 64, 256);
    const topRingMesh = new THREE.Mesh(topRingGeom, steel);
    
    registerPart(
        topRingMesh,
        "Basket_Top_Mounting_Ring",
        "Massive forged titanium ring securing the surround to the rigid frame.",
        "Forged Titanium",
        "Structural rigidity for the outer suspension.",
        110,
        ["Surround", "Basket_Struts"],
        "Ring fracture.",
        ["Total Structural Collapse"],
        new THREE.Vector3(0, 0, 55),
        new THREE.Vector3(0, 0, 200)
    );

    // The struts connecting top ring to magnet base
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        
        const p1 = new THREE.Vector3(Math.cos(angle)*40, Math.sin(angle)*40, -10); // at magnet
        const p2 = new THREE.Vector3(Math.cos(angle)*70, Math.sin(angle)*70, 20);  // mid curve
        const p3 = new THREE.Vector3(Math.cos(angle)*(surroundRadius+6), Math.sin(angle)*(surroundRadius+6), 55); // at top ring
        
        const strutCurve = new THREE.CatmullRomCurve3([p1, p2, p3]);
        const strutGeom = new THREE.TubeGeometry(strutCurve, 64, 3, 16, false);
        const strutMesh = new THREE.Mesh(strutGeom, darkSteel);
        
        registerPart(
            strutMesh,
            `Titanium_Basket_Strut_${i}`,
            `Aerodynamic titanium strut ${i}, supporting the top ring while minimizing acoustic reflections from the backwave.`,
            "Dark Titanium Alloy",
            "Structural Support.",
            111 + i,
            ["Basket_Top_Mounting_Ring", "Magnetic_Core"],
            "Strut buckling under recoil.",
            ["Frame Warpage", "Voice Coil Rub"],
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(Math.cos(angle)*150, Math.sin(angle)*150, 55)
        );
    }

    // ==========================================
    // SUBSYSTEM 9: HYDRAULIC DAMPING MATRIX
    // ==========================================
    for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const radius = 60;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // Cylinder Body
        const cylGeom = new THREE.CylinderGeometry(2, 2, 25, 32);
        const cylMesh = new THREE.Mesh(cylGeom, darkSteel);
        cylMesh.rotation.x = Math.PI / 2;
        
        registerPart(
            cylMesh,
            `Hydraulic_Damper_Cylinder_${i}`,
            `Magneto-rheological hydraulic damper cylinder ${i}. Absorbs the 10^15 Newton recoil force from the anti-shockwave pulse.`,
            "Dark Steel",
            "Kinetic energy dissipation.",
            150 + i,
            ["Basket_Frame", "Damper_Rod"],
            "Cylinder rupture.",
            ["Loss of Damping", "Structural Shear"],
            new THREE.Vector3(x, y, 20),
            new THREE.Vector3(x * 1.5, y * 1.5, 40)
        );
        
        // Piston Rod
        const rodGeom = new THREE.CylinderGeometry(1.2, 1.2, 25, 32);
        const rodMesh = new THREE.Mesh(rodGeom, chrome);
        rodMesh.position.set(0, 12.5, 0); // relative to cylinder
        cylMesh.add(rodMesh);
        
        animatedMeshes.hydraulics.push(rodMesh);
    }

    // ==========================================
    // SUBSYSTEM 10: DEGENERATE MATTER PHASE PLUG
    // ==========================================
    const plugPoints = [];
    for(let i=0; i<=100; i++) {
        const t = i / 100;
        // Machined bullet shape for optimal acoustic dispersion
        const radius = 9.8 * (1 - Math.pow(t, 2.5));
        const z = -5 + t * 40;
        plugPoints.push(new THREE.Vector2(radius, z));
    }
    const plugGeom = new THREE.LatheGeometry(plugPoints, 128);
    const plugMesh = new THREE.Mesh(plugGeom, chrome);
    
    registerPart(
        plugMesh,
        "Acoustic_Phase_Plug",
        "A precisely machined solid bullet of degenerate matter placed in the pole piece center. It equalizes path lengths of high-frequency anti-sound waves to prevent destructive interference before leaving the horn.",
        "Machined Degenerate Chrome",
        "Phase coherence alignment for high-frequency transient shockwaves.",
        70,
        ["Magnetic_Pole_Piece"],
        "Misalignment causes internal acoustic reflections.",
        ["Comb Filtering", "Ineffective High-Frequency Cancellation"],
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 250)
    );

    // ==========================================
    // SUBSYSTEM 11: TACHYONIC SHOCKWAVE SENSOR ARRAY
    // ==========================================
    for(let i=0; i<20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 200;
        
        // Sensor body
        const sensorGeom = new THREE.OctahedronGeometry(4, 2);
        const sensorMesh = new THREE.Mesh(sensorGeom, glass);
        const sensorZ = 200 + (i % 2 === 0 ? 50 : 0);
        
        // Sensor core glowing
        const coreGeom = new THREE.SphereGeometry(2, 16, 16);
        const coreMesh = new THREE.Mesh(coreGeom, emissiveCyan);
        sensorMesh.add(coreMesh);
        
        registerPart(
            sensorMesh,
            `Tachyonic_Sensor_Probe_${i}`,
            `Advanced tachyon-based acoustic sensor. Detects incoming stellar shockwaves faster than light to give the ANC processor time to compute the perfect anti-wave.`,
            "Metaglass / Plasma Core",
            "Early warning shockwave detection.",
            180 + i,
            ["ANC_Processor"],
            "Sensor blindness.",
            ["Late Anti-Wave Firing", "Constructive Interference (Catastrophic)"],
            new THREE.Vector3(Math.cos(angle)*radius, Math.sin(angle)*radius, sensorZ),
            new THREE.Vector3(Math.cos(angle)*300, Math.sin(angle)*300, sensorZ + 100)
        );
        
        animatedMeshes.rotors.push(sensorMesh); // Spin them for visual effect
    }

    // ==========================================
    // SUBSYSTEM 12: SUPERCONDUCTING POWER CONDUITS
    // ==========================================
    for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const startPt = new THREE.Vector3(Math.cos(angle)*90, Math.sin(angle)*90, -80);
        const midPt1 = new THREE.Vector3(Math.cos(angle)*40, Math.sin(angle)*40, -40);
        const midPt2 = new THREE.Vector3(Math.cos(angle)*20, Math.sin(angle)*20, -10);
        const endPt = new THREE.Vector3(Math.cos(angle)*10, Math.sin(angle)*10, 0);
        
        const curve = new THREE.CatmullRomCurve3([startPt, midPt1, midPt2, endPt]);
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 1.0, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, copper);
        
        registerPart(
            tubeMesh,
            `Superconducting_Conduit_${i}`,
            `YBCO superconducting power conduit ${i}, bathed in liquid helium. Carries 8.5 Teramps to the voice coil.`,
            "YBCO Copper Composite",
            "Power Transmission",
            300 + i,
            ["Antimatter_Reactor", "Voice_Coil_Terminal"],
            "Massive thermal runaway, resulting in a localized plasma explosion and loss of symmetric drive.",
            ["Voice Coil Asymmetry", "Driver Implosion"],
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(Math.cos(angle)*40, Math.sin(angle)*40, -100)
        );
    }

    // ==========================================
    // SUBSYSTEM 13: ANTIMATTER REACTORS
    // ==========================================
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        
        const reactorGeom = new THREE.SphereGeometry(12, 64, 64);
        const reactorMesh = new THREE.Mesh(reactorGeom, steel);
        
        const plasmaGeom = new THREE.SphereGeometry(10, 32, 32);
        const plasmaMesh = new THREE.Mesh(plasmaGeom, emissiveBlue);
        reactorMesh.add(plasmaMesh);
        
        registerPart(
            reactorMesh,
            `Antimatter_Reactor_Core_${i}`,
            `Provides the petawatts of energy required to generate the anti-sound waves. Contains magnetically suspended antihydrogen.`,
            "Neutronium Steel / Plasma",
            "Power Generation",
            200 + i,
            ["Superconducting_Conduits"],
            "Containment failure. Antimatter annihilates with the vessel, destroying the entire sector.",
            ["Sector Destruction", "Cascade Annihilation"],
            new THREE.Vector3(Math.cos(angle)*100, Math.sin(angle)*100, -80),
            new THREE.Vector3(Math.cos(angle)*250, Math.sin(angle)*250, -250)
        );
    }

    // ==========================================
    // SUBSYSTEM 14: SHOCKWAVE VISUALIZATION ENGINE
    // ==========================================
    // We create two massively parallel InstancedMeshes to represent the interfering waves.
    const particleCount = 15000;
    const incomingGeom = new THREE.TetrahedronGeometry(2.0, 0);
    const outgoingGeom = new THREE.TetrahedronGeometry(2.0, 0);
    
    const incomingMesh = new THREE.InstancedMesh(incomingGeom, emissiveRed, particleCount);
    const outgoingMesh = new THREE.InstancedMesh(outgoingGeom, emissiveBlue, particleCount);
    
    const dummy = new THREE.Object3D();
    const incomingData = [];
    const outgoingData = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Distribute spherically, biased towards the front (positive Z hemisphere)
        const phi = Math.acos( -1 + ( 2 * i ) / particleCount ) * 0.55; 
        const theta = Math.sqrt( particleCount * Math.PI ) * phi;
        
        const vec = new THREE.Vector3();
        vec.setFromSphericalCoords(1, phi, theta);
        
        // Random offsets for a chaotic but coherent wave front
        const offset = Math.random() * 30 - 15;
        const speedMultiplier = 1.0 + (Math.random() * 0.1 - 0.05);
        
        incomingData.push({ dir: vec.clone(), offset, speedMultiplier });
        outgoingData.push({ dir: vec.clone(), offset, speedMultiplier });
        
        dummy.scale.set(0,0,0);
        dummy.updateMatrix();
        incomingMesh.setMatrixAt(i, dummy.matrix);
        outgoingMesh.setMatrixAt(i, dummy.matrix);
    }
    
    incomingMesh.instanceMatrix.needsUpdate = true;
    outgoingMesh.instanceMatrix.needsUpdate = true;
    
    group.add(incomingMesh);
    group.add(outgoingMesh);
    
    animatedMeshes.incomingWave = { mesh: incomingMesh, data: incomingData };
    animatedMeshes.outgoingWave = { mesh: outgoingMesh, data: outgoingData };


    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In an unbounded fluid medium, the acoustic wave equation for sound pressure p is derived from the linearized continuity and Euler equations. If the medium is isotropic and homogenous, what is the spatial and temporal form of the active noise cancellation field p_anc required to perfectly nullify a spherically expanding stellar shockwave p_inc = (A/r) * e^(j(wt - kr)) at all points r > r0?",
            options: [
                "p_anc = -(A/r) * e^(j(wt - kr))",
                "p_anc = (A/r) * e^(-j(wt - kr))",
                "p_anc = -(A/r^2) * e^(j(wt + kr))",
                "p_anc = (A/r) * e^(j(wt + kr))"
            ],
            correctAnswer: 0,
            explanation: "Perfect active noise cancellation of a linear acoustic wave requires the generation of a secondary field that is the exact logical inverse (anti-phase) of the primary incident wave at all points in the target region. Superposition dictates p_total = p_inc + p_anc = 0. Thus, p_anc = -p_inc."
        },
        {
            question: "The acoustic impedance of a degenerate matter metamaterial diaphragm is Z_d. To achieve maximum power transfer from the electromechanical transducer to the interstellar medium (impedance Z_0 = ρ_0 * c_0) for launching the anti-sound wave, what must the mechanical impedance of the voice coil and suspension Z_m be, assuming an electromechanical coupling factor of α?",
            options: [
                "Z_m = α^2 / (Z_d + Z_0)",
                "Z_m = (Z_d * Z_0) / α",
                "Z_m must be the complex conjugate of the radiation impedance, ignoring Z_d.",
                "Z_m = (α^2 / Z_0) - Z_d"
            ],
            correctAnswer: 0,
            explanation: "For maximum electromechanical power transfer in a heavily damped acoustic system, the mechanical impedance Z_m (including the coil and suspension) must match the transformed acoustic load. This is a classic impedance matching problem where Z_m = α^2 / Z_acoustic, and Z_acoustic is the sum of the diaphragm and medium impedances (Z_d + Z_0)."
        },
        {
            question: "At relativistic speeds of the speaker cone, the acoustic shockwave generated is non-linear. The steepening of the wavefront leads to a jump in pressure governed by the Rankine-Hugoniot relations. To perfectly cancel a shockwave with a Mach number M = 5, what must the density ratio ρ_2 / ρ_1 of the anti-shockwave be, given the heat capacity ratio γ = 5/3?",
            options: [
                "ρ_2 / ρ_1 = 4",
                "ρ_2 / ρ_1 = 25",
                "ρ_2 / ρ_1 = (4 * 25) / (25 + 3) = 3.57",
                "ρ_2 / ρ_1 = 1"
            ],
            correctAnswer: 2,
            explanation: "Using the Rankine-Hugoniot density ratio for a strong shock: ρ_2 / ρ_1 = ((γ + 1) * M^2) / ((γ - 1) * M^2 + 2). With γ = 5/3 (monatomic interstellar gas) and M = 5, we get ((8/3)*25) / ((2/3)*25 + 2) = 200/3 / (50/3 + 6/3) = 200/56 = 25/7 ≈ 3.57. The anti-wave must exactly match this density compression in reverse phase."
        },
        {
            question: "The radiation directivity of a colossal speaker cone of radius a vibrating uniformly in a rigid baffle is given by the directivity function D(θ) = 2 * J_1(ka sinθ) / (ka sinθ). If the cone radius is equal to the radius of Earth (a = 6.4 x 10^6 m) and the frequency is 10^-3 Hz, what is the half-power beamwidth? (Assume speed of sound in interstellar plasma c = 300 km/s).",
            options: [
                "It is completely omnidirectional (ka << 1).",
                "It forms a tight beam of 0.1 degrees.",
                "It forms a beam of 45 degrees.",
                "The directivity is undefined at this scale."
            ],
            correctAnswer: 0,
            explanation: "First, calculate the wavenumber k = ω/c = 2πf/c = 2π(10^-3) / 300,000 ≈ 2.09 x 10^-8 rad/m. Then ka = (2.09 x 10^-8) * (6.4 x 10^6) ≈ 0.134. Since ka << 1 (the wavelength is much larger than the circumference of the cone), the speaker acts as a simple point source, radiating omnidirectionally."
        },
        {
            question: "When two high-intensity waves completely destructively interfere, where does the energy go? Given the energy density equation E = (1/2)ρv^2 + p^2/(2ρc^2), how does the system conserve energy during perfect broadband cancellation of a supernova shockwave?",
            options: [
                "The energy vanishes entirely, violating the first law of thermodynamics.",
                "The energy is converted entirely into heat at the collision interface.",
                "The source of the anti-wave absorbs the energy of the incoming wave by acting as an acoustic sink.",
                "The waves pass through each other; they do not actually cancel in terms of energy, only pressure."
            ],
            correctAnswer: 2,
            explanation: "In active noise cancellation, perfect global destructive interference means the total power radiated by the combined sources is zero. The secondary source (the ANC driver) must operate such that its acoustic impedance relative to the primary wave causes it to absorb the incident energy, effectively acting as an active acoustic sink. The absorbed energy is then dissipated mechanically or electrically within the driver's damping matrix."
        }
    ];

    // ==========================================
    // ANIMATION ENGINE
    // ==========================================
    const animate = (time, speed, meshes) => {
        // We simulate the extreme cycle of a supernova shockwave hitting and being cancelled.
        // The cycle takes 10 simulated seconds.
        const cycleDuration = 10.0;
        const t = (time * speed) % cycleDuration;
        
        // Shockwave parameters
        const incomingStartRadius = 600;
        const waveSpeed = 80; // units per simulated second
        const r_incoming = incomingStartRadius - t * waveSpeed;
        
        // The driver fires when incoming wave reaches radius 200.
        // 600 - t*80 = 200 => 400 = 80t => t = 5.0
        const fireTime = 5.0;
        
        let r_outgoing = 0;
        let interference = false;
        
        // Cone Excursion Logic
        let coneZ = 0;
        if (t > fireTime - 0.2 && t < fireTime + 0.3) {
            // Massive forward excursion to launch the anti-wave
            const pulsePhase = (t - (fireTime - 0.2)) / 0.5; 
            coneZ = Math.sin(pulsePhase * Math.PI) * 35;
        } else if (t >= fireTime + 0.3 && t < fireTime + 2.0) {
            // Complex settling/ringing as the damping matrix absorbs the recoil
            const settlePhase = t - (fireTime + 0.3);
            coneZ = Math.sin(settlePhase * 18) * 12 * Math.exp(-settlePhase * 3.5);
        }
        
        animatedMeshes.coneGroup.position.z = coneZ;
        
        // Update Hydraulic Dampers dynamically based on cone excursion
        animatedMeshes.hydraulics.forEach((rod) => {
            // The rod extends/retracts inside the cylinder.
            // Cylinder is at z=20, rod local y is 12.5.
            // We map the cone's Z movement to the rod's local Y extension.
            rod.position.y = 12.5 + coneZ * 0.8; 
        });
        
        // Spin the sensor arrays to simulate scanning
        animatedMeshes.rotors.forEach(r => {
            r.rotation.z += 0.05 * speed;
            r.rotation.x += 0.02 * speed;
        });
        
        if (t > fireTime) {
            r_outgoing = 50 + (t - fireTime) * waveSpeed;
        }
        
        // Determine Interference Point
        // They meet when r_incoming = r_outgoing
        // 600 - 80t = 50 + 80(t - 5)
        // 600 - 80t = 50 + 80t - 400
        // 600 - 80t = 80t - 350
        // 950 = 160t => t = 5.9375
        // At t = 5.9375, r_incoming = 125, r_outgoing = 125. Perfect silence is achieved.
        if (t >= 5.9375) {
            interference = true;
        }
        
        // Update Particle Systems
        const inMesh = animatedMeshes.incomingWave.mesh;
        const inData = animatedMeshes.incomingWave.data;
        const outMesh = animatedMeshes.outgoingWave.mesh;
        const outData = animatedMeshes.outgoingWave.data;
        
        for (let i = 0; i < particleCount; i++) {
            // Incoming Shockwave (Red)
            if (interference || t < 0.1) {
                // If they have met and cancelled, scale to 0 (Silence)
                dummy.scale.set(0, 0, 0);
            } else {
                const iD = inData[i];
                // Introduce spatial noise for realism
                const scatter = Math.sin(i * 13.5 + time * 15) * 4;
                const r = r_incoming + scatter + iD.offset;
                dummy.position.copy(iD.dir).multiplyScalar(r);
                
                // Intensity increases as it approaches
                const scale = Math.max(0, Math.min(3.5, 700 / Math.max(r, 1)));
                dummy.scale.set(scale, scale, scale);
                dummy.rotation.set(time * 2 + i, time - i, time);
            }
            dummy.updateMatrix();
            inMesh.setMatrixAt(i, dummy.matrix);
            
            // Outgoing Anti-Shockwave (Blue)
            if (interference || t <= fireTime) {
                dummy.scale.set(0, 0, 0);
            } else {
                const oD = outData[i];
                const scatter = Math.sin(i * 21.1 - time * 15) * 4;
                const r = r_outgoing + scatter + oD.offset;
                dummy.position.copy(oD.dir).multiplyScalar(r);
                
                // Intensity spreads as it expands
                const scale = Math.max(0.1, 250 / Math.max(r, 1));
                dummy.scale.set(scale, scale, scale);
                dummy.rotation.set(-time * 2 + i, time + i, -time);
            }
            dummy.updateMatrix();
            outMesh.setMatrixAt(i, dummy.matrix);
        }
        
        inMesh.instanceMatrix.needsUpdate = true;
        outMesh.instanceMatrix.needsUpdate = true;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createANCHeadphoneDriver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
