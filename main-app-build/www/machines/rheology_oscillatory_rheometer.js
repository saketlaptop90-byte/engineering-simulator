import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // High-tech emissive materials for neon flair
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, metalness: 0.5, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, metalness: 0.5, roughness: 0.2 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.8 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0, transparent: true, opacity: 0.7 });
    const sampleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0x221100,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    function registerPart(name, mesh, info) {
        mesh.name = name;
        // Keep track of original positions for explosion/animations
        mesh.userData.originalPosition = new THREE.Vector3(info.originalPosition.x, info.originalPosition.y, info.originalPosition.z);
        mesh.userData.originalRotation = new THREE.Euler().copy(mesh.rotation);
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({ name, ...info });
    }

    // 1. BASE HOUSING - Lathe geometry for an aerodynamic, heavy vibration-isolating base
    const basePoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        basePoints.push(new THREE.Vector2(12 + Math.sin(t * Math.PI) * 2 - t * 3, i * 0.4));
    }
    const baseGeom = new THREE.LatheGeometry(basePoints, 128);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 0, 0);
    registerPart('Vibration_Isolating_Base', baseMesh, {
        description: 'Massive cast iron and depleted uranium base to nullify any seismic or acoustic vibrations.',
        material: 'Vibranium-doped Cast Iron',
        function: 'Foundation and isolation',
        assemblyOrder: 1,
        connections: ['Leveling_Feet', 'Main_Column'],
        failureEffect: 'Measurement noise increases drastically.',
        cascadeFailures: ['Air_Bearing', 'Optical_Encoder'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 2. LEVELING FEET - 4 complex hydraulic feet
    const feetGroup = new THREE.Group();
    const footGeom = new THREE.CylinderGeometry(1.5, 2.5, 2, 32);
    const padGeom = new THREE.TorusGeometry(1.5, 0.5, 16, 64);
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const foot = new THREE.Mesh(footGeom, chrome);
        const pad = new THREE.Mesh(padGeom, rubber);
        pad.rotation.x = Math.PI / 2;
        pad.position.y = -1;
        foot.add(pad);
        foot.position.set(Math.cos(angle) * 11, -1, Math.sin(angle) * 11);
        feetGroup.add(foot);
    }
    registerPart('Hydraulic_Leveling_Feet', feetGroup, {
        description: 'Active hydraulic leveling feet with micro-adjustment sensors.',
        material: 'Chrome and Synthetic Rubber',
        function: 'Keeps the rheometer perfectly horizontal.',
        assemblyOrder: 2,
        connections: ['Vibration_Isolating_Base'],
        failureEffect: 'Gravity vector misalignment causing skewed torque readings.',
        cascadeFailures: ['Motor_Shaft'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -30, z: 0}
    });

    // 3. MAIN COLUMN - Massive extruded housing
    const colShape = new THREE.Shape();
    colShape.moveTo(-4, -4);
    colShape.lineTo(4, -4);
    colShape.quadraticCurveTo(6, 0, 4, 4);
    colShape.lineTo(-4, 4);
    colShape.quadraticCurveTo(-6, 0, -4, -4);
    const colExtrude = { depth: 30, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const colGeom = new THREE.ExtrudeGeometry(colShape, colExtrude);
    const colMesh = new THREE.Mesh(colGeom, aluminum);
    colMesh.rotation.x = -Math.PI / 2;
    colMesh.position.set(0, 8, -6);
    registerPart('Main_Support_Column', colMesh, {
        description: 'Aerospace-grade aluminum spine holding the primary measurement head.',
        material: 'Aluminum 7075-T6',
        function: 'Structural spine',
        assemblyOrder: 3,
        connections: ['Vibration_Isolating_Base', 'Measurement_Head'],
        failureEffect: 'Head misalignment.',
        cascadeFailures: ['Drive_Shaft'],
        originalPosition: {x: 0, y: 8, z: -6},
        explodedPosition: {x: 0, y: 8, z: -30}
    });

    // 4. MEASUREMENT HEAD HOUSING
    const headGeom = new THREE.CylinderGeometry(6, 6, 12, 64);
    const headMesh = new THREE.Mesh(headGeom, darkSteel);
    headMesh.position.set(0, 32, 2);
    headMesh.rotation.x = 0;
    registerPart('Measurement_Head_Housing', headMesh, {
        description: 'Contains the EC motor, optical encoder, and air bearing.',
        material: 'Dark Steel',
        function: 'Protects hyper-sensitive measurement electronics.',
        assemblyOrder: 4,
        connections: ['Main_Support_Column', 'EC_Motor'],
        failureEffect: 'Thermal fluctuations affect electronics.',
        cascadeFailures: ['Optical_Encoder'],
        originalPosition: {x: 0, y: 32, z: 2},
        explodedPosition: {x: 0, y: 50, z: 2}
    });

    // 5. EC MOTOR (Electronically Commutated)
    const motorGroup = new THREE.Group();
    const statorGeom = new THREE.TorusGeometry(4.5, 1, 32, 64);
    const stator = new THREE.Mesh(statorGeom, copper);
    stator.rotation.x = Math.PI / 2;
    motorGroup.add(stator);
    // Motor coils
    for(let i=0; i<12; i++) {
        const coilGeom = new THREE.BoxGeometry(1.5, 2.5, 1.5);
        const coil = new THREE.Mesh(coilGeom, chrome);
        const angle = (i / 12) * Math.PI * 2;
        coil.position.set(Math.cos(angle)*4.5, 0, Math.sin(angle)*4.5);
        coil.rotation.y = -angle;
        motorGroup.add(coil);
    }
    motorGroup.position.set(0, 34, 2);
    registerPart('EC_Servo_Motor', motorGroup, {
        description: 'Drag-cup motor for ultra-low inertia and exact torque application.',
        material: 'Copper Coils & Chrome Casing',
        function: 'Applies oscillatory torque or strain.',
        assemblyOrder: 5,
        connections: ['Measurement_Head_Housing', 'Drive_Shaft'],
        failureEffect: 'Torque inaccuracies.',
        cascadeFailures: ['Viscoelastic_Sample'],
        originalPosition: {x: 0, y: 34, z: 2},
        explodedPosition: {x: 0, y: 65, z: 2}
    });

    // 6. OPTICAL ENCODER
    const encoderGeom = new THREE.CylinderGeometry(5.5, 5.5, 0.5, 128);
    const encoderMesh = new THREE.Mesh(encoderGeom, glass);
    const encoderMarkings = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.1, 16, 128), neonBlue);
    encoderMarkings.rotation.x = Math.PI/2;
    encoderMesh.add(encoderMarkings);
    encoderMesh.position.set(0, 30, 2);
    registerPart('High_Res_Optical_Encoder', encoderMesh, {
        description: 'Nanometer-resolution optical disc for precise strain detection.',
        material: 'Silica Glass and Neon Indicators',
        function: 'Measures angular displacement.',
        assemblyOrder: 6,
        connections: ['Measurement_Head_Housing', 'Drive_Shaft'],
        failureEffect: 'Strain resolution lost.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 30, z: 2},
        explodedPosition: {x: 0, y: 75, z: 2}
    });

    // 7. DRIVE SHAFT
    const shaftGeom = new THREE.CylinderGeometry(0.8, 0.8, 22, 32);
    const shaftMesh = new THREE.Mesh(shaftGeom, chrome);
    shaftMesh.position.set(0, 21, 2);
    registerPart('Air_Bearing_Drive_Shaft', shaftMesh, {
        description: 'Frictionless air-bearing supported drive shaft.',
        material: 'Polished Chrome',
        function: 'Transmits torque to the upper geometry without friction.',
        assemblyOrder: 7,
        connections: ['EC_Servo_Motor', 'Upper_Geometry_Plate'],
        failureEffect: 'Friction introduces torque artifacts.',
        cascadeFailures: ['EC_Servo_Motor'],
        originalPosition: {x: 0, y: 21, z: 2},
        explodedPosition: {x: 0, y: 40, z: 2}
    });

    // 8. UPPER GEOMETRY PLATE (Parallel Plate)
    const upperPlateGroup = new THREE.Group();
    const uPlateGeom = new THREE.CylinderGeometry(3, 3, 0.5, 64);
    const uPlateMesh = new THREE.Mesh(uPlateGeom, steel);
    upperPlateGroup.add(uPlateMesh);
    const couplingGeom = new THREE.CylinderGeometry(1, 0.8, 2, 32);
    const coupling = new THREE.Mesh(couplingGeom, darkSteel);
    coupling.position.y = 1.25;
    upperPlateGroup.add(coupling);
    upperPlateGroup.position.set(0, 10, 2);
    registerPart('Upper_Geometry_Plate', upperPlateGroup, {
        description: 'Quick-connect parallel plate geometry (50mm equivalent).',
        material: 'Stainless Steel',
        function: 'Interfaces with the fluid sample, oscillating to apply shear.',
        assemblyOrder: 8,
        connections: ['Air_Bearing_Drive_Shaft', 'Viscoelastic_Sample'],
        failureEffect: 'Slip at the wall boundary condition.',
        cascadeFailures: ['Measurement_Data'],
        originalPosition: {x: 0, y: 10, z: 2},
        explodedPosition: {x: 0, y: 25, z: 2}
    });

    // 9. LOWER PELTIER PLATE
    const lowerPlateGroup = new THREE.Group();
    const lPlateGeom = new THREE.CylinderGeometry(4, 4, 1.5, 64);
    const lPlateMesh = new THREE.Mesh(lPlateGeom, steel);
    lowerPlateGroup.add(lPlateMesh);
    const peltierGeom = new THREE.CylinderGeometry(4.2, 4.2, 0.5, 64);
    const peltier = new THREE.Mesh(peltierGeom, copper);
    peltier.position.y = -1;
    lowerPlateGroup.add(peltier);
    lowerPlateGroup.position.set(0, 8.25, 2);
    registerPart('Peltier_Temperature_Controller', lowerPlateGroup, {
        description: 'Active thermoelectric cooling/heating plate for exact thermal control (-40 to 200 C).',
        material: 'Steel and Copper',
        function: 'Sets the environmental temperature of the sample.',
        assemblyOrder: 9,
        connections: ['Vibration_Isolating_Base', 'Viscoelastic_Sample'],
        failureEffect: 'Sample viscosity changes dramatically due to thermal drift.',
        cascadeFailures: ['Measurement_Data'],
        originalPosition: {x: 0, y: 8.25, z: 2},
        explodedPosition: {x: 0, y: 0, z: 2}
    });

    // 10. VISCOELASTIC SAMPLE
    // Complex geometry to allow deformation in animation
    const sampleGeom = new THREE.CylinderGeometry(2.9, 2.9, 1.5, 64, 16, false);
    const sampleMesh = new THREE.Mesh(sampleGeom, sampleMat);
    sampleMesh.position.set(0, 9.25, 2);
    // Store original vertices for deformation
    const positions = sampleGeom.attributes.position.array;
    sampleMesh.userData.originalVertices = new Float32Array(positions);
    registerPart('Viscoelastic_Sample', sampleMesh, {
        description: 'Polymer melt or hydrogel exhibiting both viscous flow and elastic recovery (G\' and G\").',
        material: 'Viscoelastic Fluid',
        function: 'The material being tested.',
        assemblyOrder: 10,
        connections: ['Upper_Geometry_Plate', 'Peltier_Temperature_Controller'],
        failureEffect: 'Sample fracture or edge failure (shear banding).',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 9.25, z: 2},
        explodedPosition: {x: 20, y: 9.25, z: 2}
    });

    // 11. ENVIRONMENTAL CHAMBER (Glass Enclosure)
    const chamberGeom = new THREE.CylinderGeometry(5.5, 5.5, 6, 64, 1, true, 0, Math.PI * 1.5);
    const chamberMesh = new THREE.Mesh(chamberGeom, glass);
    chamberMesh.position.set(0, 9, 2);
    const chamberFrame = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.6, 6.2, 64, 1, true, 0, 0.1), darkSteel);
    chamberMesh.add(chamberFrame);
    registerPart('Active_Hood_Environmental_Chamber', chamberMesh, {
        description: 'Purged gas environmental chamber with radiant heating coils.',
        material: 'Quartz Glass and Steel',
        function: 'Prevents sample oxidation and maintains uniform temperature gradient.',
        assemblyOrder: 11,
        connections: ['Peltier_Temperature_Controller'],
        failureEffect: 'Thermal gradient issues and sample oxidation.',
        cascadeFailures: ['Viscoelastic_Sample'],
        originalPosition: {x: 0, y: 9, z: 2},
        explodedPosition: {x: -20, y: 9, z: 2}
    });

    // 12. HYDRAULIC/COOLANT LINES (Complex Tubes)
    const lineGroup = new THREE.Group();
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new CustomSinCurve(5);
    const tubeGeom = new THREE.TubeGeometry(path, 64, 0.3, 16, false);
    for(let i=0; i<3; i++) {
        const line = new THREE.Mesh(tubeGeom, rubber);
        line.position.set(0, 15 + i*2, -2);
        line.rotation.z = Math.PI / 2;
        line.rotation.x = Math.PI / 2;
        lineGroup.add(line);
    }
    registerPart('Cooling_Circulation_Lines', lineGroup, {
        description: 'Glycol/water circulation for the Peltier heat sink.',
        material: 'Reinforced Silicone Rubber',
        function: 'Removes waste heat from the lower plate.',
        assemblyOrder: 12,
        connections: ['Peltier_Temperature_Controller', 'Main_Support_Column'],
        failureEffect: 'Peltier overheats and burns out.',
        cascadeFailures: ['Peltier_Temperature_Controller'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -20}
    });

    // 13. CONTROL PANEL DISPLAY
    const panelGroup = new THREE.Group();
    const panelBack = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 0.5), darkSteel);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(7, 5), screenGlow);
    screen.position.z = 0.26;
    panelGroup.add(panelBack);
    panelGroup.add(screen);
    panelGroup.position.set(5, 20, 5);
    panelGroup.rotation.y = Math.PI / 4;
    panelGroup.rotation.x = -Math.PI / 8;
    registerPart('Touchscreen_Interface', panelGroup, {
        description: 'Real-time Lissajous curve display for LAOS (Large Amplitude Oscillatory Shear) analysis.',
        material: 'Glass and LED Array',
        function: 'Operator interface and real-time rheogram plotting.',
        assemblyOrder: 13,
        connections: ['Main_Support_Column'],
        failureEffect: 'Loss of visual feedback.',
        cascadeFailures: [],
        originalPosition: {x: 5, y: 20, z: 5},
        explodedPosition: {x: 30, y: 20, z: 15}
    });

    // 14. NORMAL FORCE TRANSDUCER
    const transGeom = new THREE.CylinderGeometry(2, 2, 2, 32);
    const transMesh = new THREE.Mesh(transGeom, chrome);
    const transRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.2, 16, 32), neonRed);
    transMesh.add(transRing);
    transMesh.position.set(0, 15, 2);
    registerPart('Normal_Force_Transducer', transMesh, {
        description: 'Capacitive sensor measuring the normal force (N1) generated by the fluid.',
        material: 'Chrome and Neon Red Indicator',
        function: 'Detects polymer chain entanglement and Weissenberg effects.',
        assemblyOrder: 14,
        connections: ['Air_Bearing_Drive_Shaft', 'Upper_Geometry_Plate'],
        failureEffect: 'Cannot detect structural breakdown in Z-axis.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 15, z: 2},
        explodedPosition: {x: 0, y: 30, z: 2}
    });

    // 15. LASER ALIGNMENT SYSTEM
    const laserGroup = new THREE.Group();
    const laserEmitter = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), darkSteel);
    const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 10, 16), laserMat);
    laserBeam.position.z = 5;
    laserBeam.rotation.x = Math.PI / 2;
    laserEmitter.add(laserBeam);
    laserEmitter.position.set(-8, 9.25, 2);
    laserEmitter.rotation.y = Math.PI / 2;
    laserGroup.add(laserEmitter);
    registerPart('Laser_Gap_Calibration', laserGroup, {
        description: 'Micrometer-precision laser diode for absolute gap zeroing.',
        material: 'Steel and Photonics',
        function: 'Measures the exact gap between upper and lower plates.',
        assemblyOrder: 15,
        connections: ['Main_Support_Column'],
        failureEffect: 'Gap error leads to massive shear rate miscalculations.',
        cascadeFailures: ['Measurement_Data'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 0, z: 0}
    });


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In an oscillatory rheology sweep, what does the storage modulus (G') primarily represent?",
            options: [
                "The viscous energy dissipated as heat",
                "The elastic energy stored and recovered per cycle",
                "The total resistance to flow (complex viscosity)",
                "The normal force generated by the fluid"
            ],
            correctAnswer: 1,
            explanation: "G' (Storage Modulus) represents the solid-like, elastic behavior of the material, indicating energy stored during deformation."
        },
        {
            question: "Why is an air bearing critical for the drive shaft of a high-end rheometer?",
            options: [
                "To cool the EC motor",
                "To levitate the entire machine",
                "To provide an essentially frictionless rotation for ultra-low torque measurements",
                "To inject air into the viscoelastic sample"
            ],
            correctAnswer: 2,
            explanation: "Air bearings eliminate mechanical friction, allowing the instrument to measure infinitesimally small torques accurately."
        },
        {
            question: "What is the purpose of the Peltier plate in this setup?",
            options: [
                "To oscillate the bottom plate",
                "To measure the normal force",
                "To rapidly and precisely control the sample's temperature",
                "To align the laser"
            ],
            correctAnswer: 2,
            explanation: "Peltier (thermoelectric) elements allow for extremely fast and precise heating and cooling, crucial since viscosity is highly temperature-dependent."
        },
        {
            question: "During Large Amplitude Oscillatory Shear (LAOS), the material response becomes non-linear. What visual shape on the control panel indicates this?",
            options: [
                "A perfect circle",
                "A straight line",
                "A distorted Lissajous curve",
                "A sine wave with constant amplitude"
            ],
            correctAnswer: 2,
            explanation: "In the non-linear viscoelastic regime, the stress-strain relationship distorts, transforming the elliptical Lissajous curve into a distorted, complex shape."
        },
        {
            question: "If the normal force transducer fails during the testing of a highly entangled polymer melt, what phenomenon goes unmeasured?",
            options: [
                "The Weissenberg (rod-climbing) effect",
                "The thermal degradation",
                "The shear rate",
                "The acoustic emission"
            ],
            correctAnswer: 0,
            explanation: "Entangled polymers generate positive normal stress differences when sheared, causing them to push the plates apart (related to the Weissenberg effect). The normal force transducer measures this."
        }
    ];

    // --- ANIMATION SYSTEM ---
    let oscillationPhase = 0;
    
    function animate(time, speed, activeMeshes) {
        const timeSec = time * 0.001 * speed;
        
        // 1. Oscillatory Shear (Top Plate & Shaft)
        // Simulate a rapid sinusoidal oscillation (Frequency sweep)
        const frequency = 2.0; // Hz
        const amplitude = 0.5; // Radians
        oscillationPhase = Math.sin(timeSec * Math.PI * 2 * frequency) * amplitude;
        
        if (activeMeshes['Air_Bearing_Drive_Shaft']) {
            activeMeshes['Air_Bearing_Drive_Shaft'].rotation.y = activeMeshes['Air_Bearing_Drive_Shaft'].userData.originalRotation.y + oscillationPhase;
        }
        if (activeMeshes['Upper_Geometry_Plate']) {
            activeMeshes['Upper_Geometry_Plate'].rotation.y = activeMeshes['Upper_Geometry_Plate'].userData.originalRotation.y + oscillationPhase;
        }
        if (activeMeshes['EC_Servo_Motor']) {
            // Spin the coils visually relative to the stator
            activeMeshes['EC_Servo_Motor'].rotation.y = oscillationPhase;
        }

        // 2. Viscoelastic Sample Deformation
        // The top of the sample rotates with the plate, the bottom stays fixed (Couette flow profile approximation)
        if (activeMeshes['Viscoelastic_Sample']) {
            const sample = activeMeshes['Viscoelastic_Sample'];
            const geom = sample.geometry;
            const positions = geom.attributes.position.array;
            const original = sample.userData.originalVertices;
            
            // Sample height boundaries (Y bounds for cylinder are approx -0.75 to +0.75)
            const height = 1.5;
            
            for (let i = 0; i < positions.length; i += 3) {
                const ox = original[i];
                const oy = original[i + 1];
                const oz = original[i + 2];
                
                // Calculate shear ratio based on Y position (0 at bottom, 1 at top)
                const shearRatio = (oy + height/2) / height;
                
                // Angle of twist at this height
                const twistAngle = oscillationPhase * shearRatio;
                
                // Apply rotation matrix
                const cosA = Math.cos(twistAngle);
                const sinA = Math.sin(twistAngle);
                
                positions[i] = ox * cosA - oz * sinA;
                positions[i + 2] = ox * sinA + oz * cosA;
                
                // Viscoelastic normal force swelling (Weissenberg effect simulation)
                // When sheared rapidly, the sample pushes outward slightly in the middle
                const shearStrainSquared = Math.pow(twistAngle, 2);
                const swell = 1.0 + (shearStrainSquared * 0.05 * Math.sin(Math.PI * shearRatio));
                positions[i] *= swell;
                positions[i+2] *= swell;
            }
            geom.attributes.position.needsUpdate = true;
            geom.computeVertexNormals(); // Recalculate lighting for dynamic surface
        }

        // 3. Control Panel Interface
        if (activeMeshes['Touchscreen_Interface']) {
            // Pulse the screen glow to simulate scanning/processing
            const glowMat = activeMeshes['Touchscreen_Interface'].children[1].material;
            glowMat.emissiveIntensity = 1.5 + Math.sin(timeSec * 10) * 0.5;
        }

        // 4. Optical Encoder indicator spinning rapidly
        if (activeMeshes['High_Res_Optical_Encoder']) {
            const neonRing = activeMeshes['High_Res_Optical_Encoder'].children[0];
            // Encoder flashes or rotates based on absolute position
            neonRing.material.emissiveIntensity = 1.5 + Math.abs(Math.sin(oscillationPhase * 10)) * 2.0;
            activeMeshes['High_Res_Optical_Encoder'].rotation.y = oscillationPhase; 
        }

        // 5. Environmental Chamber active glow
        if (activeMeshes['Active_Hood_Environmental_Chamber']) {
            // Very subtle color shift to simulate heating
            const glassMat = activeMeshes['Active_Hood_Environmental_Chamber'].material;
            glassMat.color.setHSL(0.0, 1.0, 0.5 + Math.sin(timeSec*0.5)*0.1); 
        }
    }

    return {
        group,
        parts,
        description: "An ultra high-tech, highly advanced Oscillatory Rheometer. It utilizes an electronically commutated drag-cup motor and a frictionless air bearing to apply precise rotational strain to a viscoelastic sample, measuring the resulting torque to determine Storage (G') and Loss (G'') moduli. Features hyper-realistic dynamic sample deformation.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createOscillatoryRheometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
