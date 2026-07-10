import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
        color: 0x889196,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.0,
        clearcoat: 0.2
    });

    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        metalness: 0.2,
        roughness: 0.1
    });
    
    const hydraulicFluidMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.0,
        metalness: 0.5
    });
    
    const blackRubber = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1
    });

    const warningStripeMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.6,
        metalness: 0.3
    });

    // Meshes dictionary for animation reference
    const meshes = {};

    // ---------------------------------------------------------
    // 1. BASE MOUNTING PLATE
    // ---------------------------------------------------------
    const baseMountGeom = new THREE.CylinderGeometry(3.5, 4.0, 1.5, 64);
    const baseMount = new THREE.Mesh(baseMountGeom, darkSteel);
    baseMount.position.set(0, 0, 0);
    group.add(baseMount);
    
    // Heavy-duty Base Bolts
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const boltGeom = new THREE.CylinderGeometry(0.25, 0.25, 1.8, 16);
        const bolt = new THREE.Mesh(boltGeom, chrome);
        bolt.position.set(Math.cos(angle) * 3.1, 0, Math.sin(angle) * 3.1);
        baseMount.add(bolt);
    }

    parts.push({
        name: "Base Mount & Bulkhead",
        description: "Heavy-duty titanium alloy mounting plate attaching the ROV arm to the main submarine chassis. Incorporates multi-stage pressure-sealed electrical and hydraulic passthroughs tested to 11,000 meters depth.",
        material: "Dark Steel / Titanium",
        function: "Structural Anchor",
        assemblyOrder: 1,
        connections: ["Shoulder Yaw Joint", "Hull Mainframe"],
        failureEffect: "Catastrophic detachment of the ROV arm from the submersible.",
        cascadeFailures: ["Loss of all hydraulic fluid", "Submersible hull breach"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-10, z:0}
    });

    // ---------------------------------------------------------
    // 2. SHOULDER YAW JOINT (Azimuth)
    // ---------------------------------------------------------
    const shoulderYawGroup = new THREE.Group();
    shoulderYawGroup.position.set(0, 0.75, 0);
    baseMount.add(shoulderYawGroup);
    meshes.shoulderYaw = shoulderYawGroup;

    const shoulderYawBaseGeom = new THREE.CylinderGeometry(2.8, 3.2, 2.0, 64);
    const shoulderYawBase = new THREE.Mesh(shoulderYawBaseGeom, titaniumMaterial);
    shoulderYawBase.position.set(0, 1.0, 0);
    shoulderYawGroup.add(shoulderYawBase);
    
    // Bearing Ring Array
    const bearingRingGeom = new THREE.TorusGeometry(3.0, 0.25, 32, 64);
    const bearingRing = new THREE.Mesh(bearingRingGeom, chrome);
    bearingRing.rotation.x = Math.PI / 2;
    bearingRing.position.set(0, 0.2, 0);
    shoulderYawGroup.add(bearingRing);

    parts.push({
        name: "Shoulder Yaw Azimuth Drive",
        description: "Ultra-high-torque rotary actuator utilizing a cycloidal gear system to provide 360-degree continuous rotation of the entire multi-ton arm assembly without backlash.",
        material: "Titanium Alloy",
        function: "Azimuth Rotation",
        assemblyOrder: 2,
        connections: ["Base Mount", "Shoulder Pitch Joint"],
        failureEffect: "Loss of horizontal sweeping capability.",
        cascadeFailures: ["Navigation collision risk due to stuck appendage"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    // ---------------------------------------------------------
    // 3. SHOULDER PITCH JOINT (Elevation)
    // ---------------------------------------------------------
    const shoulderPitchGroup = new THREE.Group();
    shoulderPitchGroup.position.set(0, 2.5, 0);
    shoulderYawGroup.add(shoulderPitchGroup);
    meshes.shoulderPitch = shoulderPitchGroup;

    const shoulderPitchGeom = new THREE.CylinderGeometry(2.5, 2.5, 5.0, 64);
    const shoulderPitch = new THREE.Mesh(shoulderPitchGeom, darkSteel);
    shoulderPitch.rotation.x = Math.PI / 2;
    shoulderPitchGroup.add(shoulderPitch);
    
    // Pitch Joint Endcaps with neon indicators
    const endcapGeom = new THREE.CylinderGeometry(2.6, 2.6, 0.5, 32);
    const endcap1 = new THREE.Mesh(endcapGeom, chrome);
    endcap1.rotation.x = Math.PI / 2;
    endcap1.position.z = 2.5;
    shoulderPitchGroup.add(endcap1);
    
    const endcap2 = new THREE.Mesh(endcapGeom, chrome);
    endcap2.rotation.x = Math.PI / 2;
    endcap2.position.z = -2.5;
    shoulderPitchGroup.add(endcap2);

    const pitchNeonGeom = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const pitchNeon1 = new THREE.Mesh(pitchNeonGeom, neonBlueMaterial);
    pitchNeon1.position.z = 2.76;
    shoulderPitchGroup.add(pitchNeon1);
    
    const pitchNeon2 = new THREE.Mesh(pitchNeonGeom, neonBlueMaterial);
    pitchNeon2.position.z = -2.76;
    shoulderPitchGroup.add(pitchNeon2);

    parts.push({
        name: "Shoulder Pitch Articulator Node",
        description: "Massive reinforced trunnion joint allowing the primary boom to elevate and depress. Features dual optical encoders for micrometer-level positional tracking.",
        material: "Dark Steel & Chrome",
        function: "Elevation Control",
        assemblyOrder: 3,
        connections: ["Shoulder Yaw Joint", "Primary Titanium Boom"],
        failureEffect: "Arm becomes limp, dropping to lowest elevation under its own weight.",
        cascadeFailures: ["Crushing damage to lower base structure", "Hydraulic line over-tension"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:-12}
    });

    // ---------------------------------------------------------
    // 4. PRIMARY BOOM (Upper Arm)
    // ---------------------------------------------------------
    const primaryBoomGroup = new THREE.Group();
    shoulderPitchGroup.add(primaryBoomGroup);
    
    // Complex Extruded Geometry for Boom
    const boomShape = new THREE.Shape();
    boomShape.moveTo(-1.8, -1.8);
    boomShape.lineTo(1.8, -1.8);
    boomShape.lineTo(1.2, 10.0);
    boomShape.lineTo(-1.2, 10.0);
    boomShape.lineTo(-1.8, -1.8);
    
    // Hollow inner section for wiring
    const innerHole = new THREE.Path();
    innerHole.moveTo(-1.0, -1.0);
    innerHole.lineTo(1.0, -1.0);
    innerHole.lineTo(0.6, 9.0);
    innerHole.lineTo(-0.6, 9.0);
    innerHole.lineTo(-1.0, -1.0);
    boomShape.holes.push(innerHole);
    
    const extrudeSettings = { depth: 2.5, bevelEnabled: true, bevelSegments: 6, steps: 3, bevelSize: 0.3, bevelThickness: 0.3 };
    const boomGeom = new THREE.ExtrudeGeometry(boomShape, extrudeSettings);
    const primaryBoom = new THREE.Mesh(boomGeom, titaniumMaterial);
    primaryBoom.position.set(0, 0, -1.25);
    primaryBoomGroup.add(primaryBoom);
    
    // Protective side panels on boom
    const panelGeom = new THREE.BoxGeometry(2.5, 8.0, 2.7);
    const panel = new THREE.Mesh(panelGeom, darkSteel);
    panel.position.set(0, 4.5, 0);
    primaryBoomGroup.add(panel);

    // Hazard stripes
    const stripeGeom = new THREE.BoxGeometry(2.6, 1.0, 2.8);
    const stripeMesh = new THREE.Mesh(stripeGeom, warningStripeMat);
    stripeMesh.position.set(0, 8.0, 0);
    primaryBoomGroup.add(stripeMesh);

    parts.push({
        name: "Primary Titanium Exo-Boom",
        description: "The main structural segment of the ROV arm, constructed from a solid billet of aerospace-grade titanium. It utilizes a hollow truss core to route sensitive fiber optic telemetry lines while maintaining structural rigidity.",
        material: "Titanium / Dark Steel",
        function: "Structural Reach",
        assemblyOrder: 4,
        connections: ["Shoulder Pitch Joint", "Elbow Articulation Node"],
        failureEffect: "Structural buckle leading to complete appendage collapse.",
        cascadeFailures: ["Complete severing of all internal hydraulic and fiber optic lines"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:18, z:0}
    });

    // ---------------------------------------------------------
    // 5. PRIMARY HYDRAULIC ACTUATORS
    // ---------------------------------------------------------
    const primaryHydraulicGroup = new THREE.Group();
    shoulderYawGroup.add(primaryHydraulicGroup);
    
    // Left and Right redundant lift cylinders
    const createHydraulicCylinder = (xOffset) => {
        const group = new THREE.Group();
        group.position.set(xOffset, 3.5, 3.0);
        group.rotation.x = Math.PI / 6;
        
        const cylinderGeom = new THREE.CylinderGeometry(0.7, 0.7, 7, 32);
        const cylinder = new THREE.Mesh(cylinderGeom, darkSteel);
        group.add(cylinder);
        
        const pistonGeom = new THREE.CylinderGeometry(0.35, 0.35, 7, 32);
        const piston = new THREE.Mesh(pistonGeom, chrome);
        piston.position.set(0, 7, 0);
        group.add(piston);
        
        return { group, piston };
    };

    const leftHydraulic = createHydraulicCylinder(1.5);
    const rightHydraulic = createHydraulicCylinder(-1.5);
    primaryHydraulicGroup.add(leftHydraulic.group);
    primaryHydraulicGroup.add(rightHydraulic.group);
    meshes.leftPiston = leftHydraulic.piston;
    meshes.rightPiston = rightHydraulic.piston;

    parts.push({
        name: "Redundant Lift Hydraulic Rams",
        description: "Twin high-pressure dual-action hydraulic cylinders operating at 5000 PSI. Responsible for providing the immense lifting capacity required to manipulate heavy salvage targets.",
        material: "Chromed Steel & Titanium",
        function: "Heavy Lift Actuation",
        assemblyOrder: 5,
        connections: ["Shoulder Yaw Joint", "Primary Titanium Exo-Boom"],
        failureEffect: "Significant reduction in lifting capacity; relies on single surviving cylinder.",
        cascadeFailures: ["Hydraulic pump overload", "Asymmetrical strain on trunnion pins"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:10, z:12}
    });

    // ---------------------------------------------------------
    // 6. ELBOW JOINT
    // ---------------------------------------------------------
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, 10.5, 0);
    primaryBoomGroup.add(elbowGroup);
    meshes.elbow = elbowGroup;

    const elbowGeom = new THREE.CylinderGeometry(1.8, 1.8, 4.0, 64);
    const elbow = new THREE.Mesh(elbowGeom, chrome);
    elbow.rotation.x = Math.PI / 2;
    elbowGroup.add(elbow);

    parts.push({
        name: "Elbow Articulation Node",
        description: "Rotary joint connecting the primary and secondary booms. Features advanced mud-wiper seals to prevent particulate ingress during seabed trenching operations.",
        material: "Hardened Chrome",
        function: "Secondary Elevation",
        assemblyOrder: 6,
        connections: ["Primary Titanium Exo-Boom", "Secondary Forearm Boom"],
        failureEffect: "Loss of dynamic reach adjustment.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:25, z:-15}
    });

    // ---------------------------------------------------------
    // 7. SECONDARY BOOM (Forearm)
    // ---------------------------------------------------------
    const forearmGroup = new THREE.Group();
    elbowGroup.add(forearmGroup);
    
    const forearmShape = new THREE.Shape();
    forearmShape.moveTo(-1.2, -1.2);
    forearmShape.lineTo(1.2, -1.2);
    forearmShape.lineTo(0.7, 8.5);
    forearmShape.lineTo(-0.7, 8.5);
    forearmShape.lineTo(-1.2, -1.2);
    
    const forearmExtrude = { depth: 1.8, bevelEnabled: true, bevelSegments: 4, steps: 3, bevelSize: 0.15, bevelThickness: 0.15 };
    const forearmGeom = new THREE.ExtrudeGeometry(forearmShape, forearmExtrude);
    const forearm = new THREE.Mesh(forearmGeom, titaniumMaterial);
    forearm.position.set(0, 0, -0.9);
    forearmGroup.add(forearm);

    // Forearm Impact Guard
    const forearmGripGeom = new THREE.CylinderGeometry(1.4, 1.4, 5, 32);
    const forearmGrip = new THREE.Mesh(forearmGripGeom, blackRubber);
    forearmGrip.position.set(0, 4.5, 0);
    forearmGroup.add(forearmGrip);

    parts.push({
        name: "Secondary Forearm Boom",
        description: "Tapered titanium boom segment encased in high-density impact rubber. Designed for extended reach and inserting into tight sub-sea wreckage.",
        material: "Titanium / Vulcanized Rubber",
        function: "Precision Reach",
        assemblyOrder: 7,
        connections: ["Elbow Articulation Node", "Wrist Pitch Pivot"],
        failureEffect: "Loss of precise manipulation range.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:35, z:0}
    });

    // Elbow Hydraulic Cylinder
    const elbowHydraulicGroup = new THREE.Group();
    primaryBoomGroup.add(elbowHydraulicGroup);
    
    const elbowCylinderGeom = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    const elbowCylinder = new THREE.Mesh(elbowCylinderGeom, darkSteel);
    elbowCylinder.position.set(0, 6.0, -2.0);
    elbowHydraulicGroup.add(elbowCylinder);
    
    const elbowPistonGeom = new THREE.CylinderGeometry(0.25, 0.25, 5, 32);
    const elbowPiston = new THREE.Mesh(elbowPistonGeom, chrome);
    elbowPiston.position.set(0, 8.5, -2.0);
    elbowHydraulicGroup.add(elbowPiston);
    meshes.elbowPiston = elbowPiston;

    parts.push({
        name: "Elbow Actuation Ram",
        description: "Compact hydraulic ram responsible for opening and closing the elbow joint angle, hidden behind the main boom's truss for protection.",
        material: "Chromed Steel & Dark Steel",
        function: "Elbow Actuation",
        assemblyOrder: 8,
        connections: ["Primary Titanium Exo-Boom", "Secondary Forearm Boom"],
        failureEffect: "Elbow joint permanently locked in current position.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:24, z:-18}
    });

    // ---------------------------------------------------------
    // 8. WRIST PITCH JOINT
    // ---------------------------------------------------------
    const wristPitchGroup = new THREE.Group();
    wristPitchGroup.position.set(0, 9.0, 0);
    forearmGroup.add(wristPitchGroup);
    meshes.wristPitch = wristPitchGroup;

    const wristPitchGeom = new THREE.CylinderGeometry(1.0, 1.0, 2.5, 32);
    const wristPitch = new THREE.Mesh(wristPitchGeom, darkSteel);
    wristPitch.rotation.x = Math.PI / 2;
    wristPitchGroup.add(wristPitch);

    parts.push({
        name: "Wrist Pitch Pivot",
        description: "Allows the manipulator hand to tilt up and down for precise alignment with target objects, utilizing micro-stepping hydraulic valves.",
        material: "Dark Steel",
        function: "Hand Pitch Control",
        assemblyOrder: 9,
        connections: ["Secondary Forearm Boom", "Wrist Roll Rotator"],
        failureEffect: "Inability to angle the claw up or down.",
        cascadeFailures: ["Improper grip leading to dropped payload"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:42, z:-6}
    });

    // ---------------------------------------------------------
    // 9. WRIST ROLL JOINT & SENSOR SUITE
    // ---------------------------------------------------------
    const wristRollGroup = new THREE.Group();
    wristPitchGroup.add(wristRollGroup);
    meshes.wristRoll = wristRollGroup;

    const wristRollGeom = new THREE.CylinderGeometry(0.9, 0.9, 2.0, 32);
    const wristRoll = new THREE.Mesh(wristRollGeom, chrome);
    wristRoll.position.set(0, 1.5, 0);
    wristRollGroup.add(wristRoll);
    
    // Wrist Camera and Lights Array
    const sensorPodGeom = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const sensorPod = new THREE.Mesh(sensorPodGeom, blackRubber);
    sensorPod.position.set(0, 1.5, 1.0);
    wristRollGroup.add(sensorPod);
    
    // Macro Lens
    const lensGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
    const lens = new THREE.Mesh(lensGeom, glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.5, 1.6);
    wristRollGroup.add(lens);
    
    // Dual Floodlights
    const lightGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
    const light1 = new THREE.Mesh(lightGeom, neonBlueMaterial);
    light1.rotation.x = Math.PI / 2;
    light1.position.set(0.4, 1.5, 1.6);
    wristRollGroup.add(light1);
    
    const light2 = new THREE.Mesh(lightGeom, neonBlueMaterial);
    light2.rotation.x = Math.PI / 2;
    light2.position.set(-0.4, 1.5, 1.6);
    wristRollGroup.add(light2);
    
    // Impact Cage for Sensor Pod
    const cageMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2, wireframe: true });
    const cageGeom = new THREE.SphereGeometry(1.0, 16, 16);
    const cage = new THREE.Mesh(cageGeom, cageMaterial);
    cage.position.set(0, 1.5, 1.5);
    // Use scale to flatten the sphere into a dome cage
    cage.scale.set(1, 0.6, 0.8);
    wristRollGroup.add(cage);

    parts.push({
        name: "Wrist Roll Rotator & Sensor Suite",
        description: "Provides continuous infinite rotation for the claw via slip-rings. Houses an armored high-definition macro camera and dual high-lumen LED floodlights protected by a titanium mesh cage.",
        material: "Chrome / Glass / Titanium Mesh",
        function: "Hand Rotation & Vision",
        assemblyOrder: 10,
        connections: ["Wrist Pitch Pivot", "Manipulator Palm Base"],
        failureEffect: "Total loss of local vision and inability to rotate gripped objects for inspection.",
        cascadeFailures: ["Camera implosion short-circuiting sensor bus"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:48, z:0}
    });

    // ---------------------------------------------------------
    // 10. PINCER CLAW BASE
    // ---------------------------------------------------------
    const clawBaseGroup = new THREE.Group();
    clawBaseGroup.position.set(0, 2.5, 0);
    wristRollGroup.add(clawBaseGroup);

    const clawBaseShape = new THREE.Shape();
    clawBaseShape.moveTo(-1.4, 0);
    clawBaseShape.lineTo(1.4, 0);
    clawBaseShape.lineTo(2.0, 2.0);
    clawBaseShape.lineTo(-2.0, 2.0);
    clawBaseShape.lineTo(-1.4, 0);
    
    const clawBaseExtrude = { depth: 1.2, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15 };
    const clawBaseGeom = new THREE.ExtrudeGeometry(clawBaseShape, clawBaseExtrude);
    const clawBase = new THREE.Mesh(clawBaseGeom, titaniumMaterial);
    clawBase.position.set(0, -0.6, -0.6);
    clawBaseGroup.add(clawBase);
    
    // Internal synchronization gears (visible)
    const gearGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.25, 16);
    const gear1 = new THREE.Mesh(gearGeom, steel);
    gear1.rotation.x = Math.PI / 2;
    gear1.position.set(-0.8, 0.5, 0);
    clawBaseGroup.add(gear1);
    
    const gear2 = new THREE.Mesh(gearGeom, steel);
    gear2.rotation.x = Math.PI / 2;
    gear2.position.set(0.8, 0.5, 0);
    clawBaseGroup.add(gear2);

    parts.push({
        name: "Manipulator Palm Base & Sync Gears",
        description: "Sturdy foundation for the pincer fingers, containing a synchronized exposed gearing mechanism to ensure perfectly parallel finger movement even when grasping irregularly shaped debris.",
        material: "Titanium / Steel",
        function: "Claw Support & Synchronization",
        assemblyOrder: 11,
        connections: ["Wrist Roll Rotator", "Serrated Pincer Fingers"],
        failureEffect: "Fingers move independently or jam entirely.",
        cascadeFailures: ["Gear teeth shearing off", "Loss of gripped payload"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:52, z:0}
    });

    // ---------------------------------------------------------
    // 11. PINCER FINGERS
    // ---------------------------------------------------------
    const leftFingerGroup = new THREE.Group();
    leftFingerGroup.position.set(-1.6, 1.2, 0);
    clawBaseGroup.add(leftFingerGroup);
    meshes.leftFinger = leftFingerGroup;
    
    const rightFingerGroup = new THREE.Group();
    rightFingerGroup.position.set(1.6, 1.2, 0);
    clawBaseGroup.add(rightFingerGroup);
    meshes.rightFinger = rightFingerGroup;

    // Highly detailed serrated finger shape
    const fingerShape = new THREE.Shape();
    fingerShape.moveTo(-0.6, 0);
    fingerShape.lineTo(0.6, 0);
    fingerShape.lineTo(0.4, 4.5);
    fingerShape.lineTo(0.1, 5.0);
    
    // Aggressive Diamond Serrations on inner edge
    fingerShape.lineTo(0.1, 4.5);
    fingerShape.lineTo(-0.4, 4.2);
    fingerShape.lineTo(0.1, 3.9);
    fingerShape.lineTo(-0.4, 3.6);
    fingerShape.lineTo(0.1, 3.3);
    fingerShape.lineTo(-0.4, 3.0);
    fingerShape.lineTo(0.1, 2.7);
    fingerShape.lineTo(-0.4, 2.4);
    fingerShape.lineTo(0.1, 2.1);
    fingerShape.lineTo(-0.4, 1.8);
    fingerShape.lineTo(0.1, 1.5);
    fingerShape.lineTo(-0.4, 1.2);
    fingerShape.lineTo(0.1, 0.9);
    fingerShape.lineTo(-0.4, 0.6);
    fingerShape.lineTo(-0.6, 0);

    const fingerExtrude = { depth: 0.8, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08 };
    const fingerGeom = new THREE.ExtrudeGeometry(fingerShape, fingerExtrude);
    
    const leftFinger = new THREE.Mesh(fingerGeom, darkSteel);
    leftFinger.position.set(0, 0, -0.4);
    leftFingerGroup.add(leftFinger);
    
    // Mirror for right finger
    const rightFinger = new THREE.Mesh(fingerGeom, darkSteel);
    rightFinger.scale.set(-1, 1, 1);
    rightFinger.position.set(0, 0, -0.4);
    rightFingerGroup.add(rightFinger);

    parts.push({
        name: "Diamond-Serrated Pincer Fingers",
        description: "Hardened tungsten-carbide steel interlocking pincers. Features aggressive diamond-coated serrations specifically engineered for maximizing grip strength on slick, heavily bio-fouled underwater structures.",
        material: "Tungsten-Carbide Dark Steel",
        function: "Grasping & Crushing",
        assemblyOrder: 12,
        connections: ["Manipulator Palm Base & Sync Gears"],
        failureEffect: "Unable to grasp, hold, or crush objects.",
        cascadeFailures: ["Dropped payload triggering secondary explosions/damage below"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:58, z:0}
    });

    // ---------------------------------------------------------
    // 12. EXPOSED HYDRAULIC UMBILICALS
    // ---------------------------------------------------------
    const createHydraulicLine = (points, colorMat, radius = 0.15) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeom = new THREE.TubeGeometry(curve, 128, radius, 12, false);
        return new THREE.Mesh(tubeGeom, colorMat);
    };

    const hoseMatSupply = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.8, metalness: 0.2 }); // Red
    const hoseMatReturn = new THREE.MeshStandardMaterial({ color: 0x0000cc, roughness: 0.8, metalness: 0.2 }); // Blue
    const hoseMatData = new THREE.MeshStandardMaterial({ color: 0xdddd00, roughness: 0.7, metalness: 0.4 }); // Yellow fiber

    // Hoses snaking up the primary boom
    const hosePointsSupply = [
        new THREE.Vector3(1.5, 1, 1.5),
        new THREE.Vector3(2.0, 4, 1.8),
        new THREE.Vector3(1.6, 7, 1.5),
        new THREE.Vector3(1.8, 10, 0)
    ];
    const hoseSupply = createHydraulicLine(hosePointsSupply, hoseMatSupply);
    primaryBoomGroup.add(hoseSupply);

    const hosePointsReturn = [
        new THREE.Vector3(-1.5, 1, 1.5),
        new THREE.Vector3(-2.0, 4, 1.8),
        new THREE.Vector3(-1.6, 7, 1.5),
        new THREE.Vector3(-1.8, 10, 0)
    ];
    const hoseReturn = createHydraulicLine(hosePointsReturn, hoseMatReturn);
    primaryBoomGroup.add(hoseReturn);
    
    // Data line wrapping around
    const hosePointsData = [
        new THREE.Vector3(0, 1, 2.2),
        new THREE.Vector3(2.2, 5, 0),
        new THREE.Vector3(0, 8, -2.2),
        new THREE.Vector3(-1.5, 10, 0)
    ];
    const hoseData = createHydraulicLine(hosePointsData, hoseMatData, 0.08);
    primaryBoomGroup.add(hoseData);

    parts.push({
        name: "Armored Hydraulic & Data Umbilicals",
        description: "Kevlar-reinforced fluid and fiber-optic lines transmitting power and telemetry to all distal actuators. Red indicates high-pressure supply, blue indicates low-pressure return, and yellow carries vital high-bandwidth camera feeds.",
        material: "Reinforced Rubber / Kevlar / Copper",
        function: "Power & Telemetry Transmission",
        assemblyOrder: 13,
        connections: ["Base Mount & Bulkhead", "All Actuators", "Sensor Suite"],
        failureEffect: "Catastrophic loss of actuation power or total sensor blackout.",
        cascadeFailures: ["Hydraulic fluid contamination of local marine environment", "System short-circuit"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:15, y:20, z:0}
    });

    // ---------------------------------------------------------
    // DESCRIPTION & QUIZ
    // ---------------------------------------------------------
    const description = "The Deep Sea ROV Manipulator Arm is a highly advanced, massively articulate titanium-alloy robotic limb designed for operation at abyssal depths. It features multi-axis rotational joints powered by redundant 5000 PSI high-pressure hydraulic rams, armored Kevlar umbilicals, and a tungsten-carbide diamond-serrated pincer claw equipped with a macro sensor and lighting suite. Built to withstand crushing pressures and highly corrosive environments, it is the ultimate precision tool for deep-sea engineering, pipeline repair, and extreme salvage operations.";

    const quizQuestions = [
        {
            question: "What material is primarily used for the main boom segments to withstand abyssal deep-sea pressures?",
            options: ["Extruded Aluminum", "Aerospace-grade Titanium", "Reinforced Polycarbonate", "Beryllium Copper"],
            correctAnswer: 1,
            explanation: "Titanium is utilized for its exceptional strength-to-weight ratio, complete resistance to saltwater corrosion, and ability to handle extreme crushing pressure."
        },
        {
            question: "Which component allows for continuous, backlash-free rotation of the entire multi-ton arm assembly?",
            options: ["Wrist Roll Rotator", "Shoulder Yaw Azimuth Drive", "Elbow Articulation Node", "Base Mount Bulkhead"],
            correctAnswer: 1,
            explanation: "The Shoulder Yaw Azimuth Drive is located at the base and utilizes a cycloidal gear system to sweep the heavy arm in a full 360-degree circle without slop or backlash."
        },
        {
            question: "Why is the Wrist Sensor Suite protected by a titanium mesh dome?",
            options: ["To prevent rust", "To diffuse the LED lighting", "To protect the delicate glass lens and lights from impact during salvage operations", "To filter out marine snow"],
            correctAnswer: 2,
            explanation: "In tight sub-sea wreckage, the arm will frequently bump into rigid, sharp metal objects. The titanium cage prevents the glass lens and LED bulbs from shattering."
        },
        {
            question: "In the armored umbilical system, what does the thin yellow line represent?",
            options: ["Coolant fluid", "High-pressure supply", "Low-pressure return", "High-bandwidth fiber-optic data telemetry"],
            correctAnswer: 3,
            explanation: "While red and blue carry hydraulic fluid, the yellow line routes sensitive high-bandwidth data required for the HD macro camera and optical positional encoders."
        },
        {
            question: "What is the primary function of the aggressive diamond-coated serrations on the pincer fingers?",
            options: ["To act as a saw blade", "To maximize grip strength on slick, heavily bio-fouled underwater structures", "To reduce the overall weight of the pincers", "To inject chemicals into objects"],
            correctAnswer: 1,
            explanation: "Objects underwater are often covered in slick mud, algae, or barnacles (bio-fouling). The hardened diamond serrations pierce this layer to provide immense friction and a secure hold."
        }
    ];

    // ---------------------------------------------------------
    // ANIMATION LOOP
    // ---------------------------------------------------------
    const animate = (time, speed, meshesObj = meshes) => {
        const t = time * speed;
        
        // 1. Arm sweeps back and forth smoothly
        if (meshesObj.shoulderYaw) {
            meshesObj.shoulderYaw.rotation.y = Math.sin(t * 0.4) * 1.8;
        }

        // 2. Main boom pitches up and down
        let shoulderPitchAngle = 0;
        if (meshesObj.shoulderPitch) {
            shoulderPitchAngle = Math.sin(t * 0.6) * 0.35 - 0.15;
            meshesObj.shoulderPitch.rotation.x = shoulderPitchAngle;
        }

        // 3. Simulate redundant hydraulic pistons extending/retracting accurately
        if (meshesObj.leftPiston && meshesObj.rightPiston) {
            // Trigonometric estimation of piston travel based on boom pitch
            const pistonTravel = 7 - (shoulderPitchAngle * 2.5);
            meshesObj.leftPiston.position.y = pistonTravel;
            meshesObj.rightPiston.position.y = pistonTravel;
        }

        // 4. Elbow bends and articulates
        let elbowAngle = 0;
        if (meshesObj.elbow) {
            elbowAngle = Math.sin(t * 0.7) * 0.5 + 0.7; // Stays mostly bent
            meshesObj.elbow.rotation.x = elbowAngle;
        }

        // 5. Elbow piston synchronization
        if (meshesObj.elbowPiston) {
            meshesObj.elbowPiston.position.y = 8.5 - (elbowAngle * 1.6);
        }

        // 6. Wrist pitches dynamically
        if (meshesObj.wristPitch) {
            meshesObj.wristPitch.rotation.x = Math.sin(t * 1.1) * 0.6;
        }

        // 7. Wrist rolls continuously and slowly
        if (meshesObj.wristRoll) {
            meshesObj.wristRoll.rotation.y = t * 1.5;
        }

        // 8. Pincer opens and closes synchronized via base gears
        if (meshesObj.leftFinger && meshesObj.rightFinger) {
            // Oscillate between 0 (closed) and ~0.6 (open)
            const clawOpen = Math.abs(Math.sin(t * 1.3)) * 0.6;
            meshesObj.leftFinger.rotation.z = -clawOpen;
            meshesObj.rightFinger.rotation.z = clawOpen;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createROVArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
