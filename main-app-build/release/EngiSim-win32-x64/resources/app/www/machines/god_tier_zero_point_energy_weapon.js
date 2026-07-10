import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * ZPEW - Zero-Point Energy Weapon (God Tier)
 * 
 * WARNING: This script constructs a hyper-complex, massively detailed 3D model.
 * It utilizes thousands of geometries, instanced meshes, custom curves, and 
 * extreme mathematical procedural generation to build a highly realistic, 
 * scientifically plausible (in a sci-fi context) superweapon.
 * 
 * Performance Note: Requires a robust GPU for full particle and shader effects.
 */
export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {}; // Store references for the extreme animation loop
    
    // =========================================================================
    // 1. ADVANCED CUSTOM MATERIALS
    // =========================================================================

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.8
    });

    const voidMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        depthWrite: true
    });

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x44aaff,
        emissive: 0x112244,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 2.5,
        thickness: 5.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const plasmaMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // =========================================================================
    // 2. PROCEDURAL GEOMETRY GENERATION
    // =========================================================================

    // -------------------------------------------------------------------------
    // PART A: Massive Stabilizing Chassis
    // -------------------------------------------------------------------------
    const chassisGroup = new THREE.Group();
    chassisGroup.position.set(0, -20, 0);
    group.add(chassisGroup);
    meshes.chassis = chassisGroup;

    // Core Base Plate (Complex Extrusion)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-50, -80);
    baseShape.lineTo(50, -80);
    baseShape.lineTo(70, -40);
    baseShape.lineTo(70, 40);
    baseShape.lineTo(50, 80);
    baseShape.lineTo(-50, 80);
    baseShape.lineTo(-70, 40);
    baseShape.lineTo(-70, -40);
    baseShape.lineTo(-50, -80);

    const baseHole = new THREE.Path();
    baseHole.moveTo(-20, -20);
    baseHole.lineTo(20, -20);
    baseHole.lineTo(20, 20);
    baseHole.lineTo(-20, 20);
    baseHole.lineTo(-20, -20);
    baseShape.holes.push(baseHole);

    const extrudeSettings = { 
        depth: 10, 
        bevelEnabled: true, 
        bevelSegments: 15, 
        steps: 5, 
        bevelSize: 3, 
        bevelThickness: 4 
    };
    
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    chassisGroup.add(baseMesh);

    // Armor Plating, Rivets, and Struts on Base
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const radius = 60;
        
        // Struts
        if (i % 3 === 0) {
            const strutGeo = new THREE.BoxGeometry(4, 30, 8);
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(Math.cos(angle) * radius, 15, Math.sin(angle) * radius);
            strut.lookAt(0, 15, 0);
            chassisGroup.add(strut);
        }

        // Rivets
        const rivetGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
        const rivet = new THREE.Mesh(rivetGeo, chrome);
        rivet.position.set(Math.cos(angle) * (radius - 5), 5, Math.sin(angle) * (radius - 5));
        chassisGroup.add(rivet);
    }

    // -------------------------------------------------------------------------
    // PART B: Vacuum Inductor Core
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 40, 0);
    group.add(coreGroup);

    // Outer Lathed Containment Vessel
    const corePoints = [];
    for (let i = 0; i <= 40; i++) {
        const x = Math.sin((i / 40) * Math.PI) * 25 + (Math.random() * 0.5); // Micro texturing
        const y = (i - 20) * 1.5;
        corePoints.push(new THREE.Vector2(x, y));
    }
    const coreGeo = new THREE.LatheGeometry(corePoints, 128);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreGroup.add(coreMesh);
    meshes.core = coreMesh;

    // The True Void inner sphere
    const innerCoreGeo = new THREE.SphereGeometry(20, 64, 64);
    const innerCore = new THREE.Mesh(innerCoreGeo, voidMaterial);
    coreGroup.add(innerCore);
    meshes.innerCore = innerCore;

    // Chaos Tendrils (Energy manifestations inside the core)
    meshes.tendrils = [];
    for (let i = 0; i < 24; i++) {
        const tendrilGeo = new THREE.TorusKnotGeometry(16, 0.4, 300, 32, Math.floor(Math.random()*4)+2, Math.floor(Math.random()*7)+3);
        const tendril = new THREE.Mesh(tendrilGeo, i % 2 === 0 ? neonPurple : neonBlue);
        tendril.rotation.x = Math.random() * Math.PI * 2;
        tendril.rotation.y = Math.random() * Math.PI * 2;
        tendril.rotation.z = Math.random() * Math.PI * 2;
        innerCore.add(tendril);
        meshes.tendrils.push({
            mesh: tendril,
            rx: Math.random() * 0.05 - 0.025,
            ry: Math.random() * 0.05 - 0.025,
            rz: Math.random() * 0.05 - 0.025
        });
    }

    // -------------------------------------------------------------------------
    // PART C: Crystalline Focusing Array
    // -------------------------------------------------------------------------
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(0, 40, 60);
    group.add(crystalGroup);
    meshes.crystals = [];
    
    // Central Primary Focusing Crystal
    const centralCrystalGeo = new THREE.OctahedronGeometry(15, 2);
    // Warp the octahedron to make it look like an elongated crystal
    const posAttribute = centralCrystalGeo.attributes.position;
    for(let i=0; i<posAttribute.count; i++){
        let z = posAttribute.getZ(i);
        if (z > 0) posAttribute.setZ(i, z * 3);
        if (z < 0) posAttribute.setZ(i, z * 0.5);
    }
    centralCrystalGeo.computeVertexNormals();
    const centralCrystal = new THREE.Mesh(centralCrystalGeo, crystalMaterial);
    centralCrystal.position.set(0, 0, 15);
    crystalGroup.add(centralCrystal);
    meshes.centralCrystal = centralCrystal;

    // Peripheral Secondary Crystals
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const crystalGeo = new THREE.ConeGeometry(4, 50, 7);
        const crystal = new THREE.Mesh(crystalGeo, crystalMaterial);
        
        crystal.position.set(Math.cos(angle) * 25, Math.sin(angle) * 25, 25);
        // Point them slightly inward
        crystal.lookAt(0, 0, 50);
        
        crystalGroup.add(crystal);
        meshes.crystals.push({
            mesh: crystal,
            angleOffset: angle,
            radius: 25
        });
    }

    // -------------------------------------------------------------------------
    // PART D: Accelerator Rings (Magnetic Containment)
    // -------------------------------------------------------------------------
    meshes.rings = [];
    for (let i = 0; i < 7; i++) {
        const radius = 40 + Math.pow(i, 1.5) * 3;
        const tubeThickness = 3 - (i * 0.2);
        const ringGeo = new THREE.TorusGeometry(radius, tubeThickness, 64, 200);
        const ring = new THREE.Mesh(ringGeo, aluminum);
        
        // Stagger positions along Z axis
        ring.position.set(0, 40, -30 + i * 18);
        
        // Add highly detailed magnetic nodes to the rings
        const numNodes = 16 + i * 4;
        for (let j = 0; j < numNodes; j++) {
            const nodeGroup = new THREE.Group();
            
            const nodeGeo = new THREE.BoxGeometry(tubeThickness * 2.5, tubeThickness * 2.5, tubeThickness * 4);
            const node = new THREE.Mesh(nodeGeo, copper);
            
            const rAngle = (j / numNodes) * Math.PI * 2;
            nodeGroup.position.set(Math.cos(rAngle) * radius, Math.sin(rAngle) * radius, 0);
            nodeGroup.rotation.z = rAngle;
            
            nodeGroup.add(node);
            
            // Neon pulse indicators on nodes
            const nodeLightGeo = new THREE.PlaneGeometry(tubeThickness, tubeThickness);
            const nodeLight = new THREE.Mesh(nodeLightGeo, neonBlue);
            nodeLight.position.set(0, tubeThickness * 1.3, 0);
            nodeLight.rotation.x = -Math.PI / 2;
            nodeGroup.add(nodeLight);

            ring.add(nodeGroup);
        }

        group.add(ring);
        meshes.rings.push({
            mesh: ring,
            speed: (0.02 + i * 0.005) * (i % 2 === 0 ? 1 : -1)
        });
    }

    // -------------------------------------------------------------------------
    // PART E: Recoil Dampener Hydraulics (Non-Newtonian Absorbers)
    // -------------------------------------------------------------------------
    const hydraulicGroup = new THREE.Group();
    group.add(hydraulicGroup);
    meshes.pistons = [];

    const hydraulicPositions = [
        {x: 45, z: 20}, {x: -45, z: 20},
        {x: 45, z: -20}, {x: -45, z: -20},
        {x: 0, z: -60}
    ];

    hydraulicPositions.forEach(pos => {
        // Main Cylinder
        const cylinderGeo = new THREE.CylinderGeometry(6, 6, 60, 32);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        cylinder.position.set(pos.x, -10, pos.z);
        hydraulicGroup.add(cylinder);

        // Internal Piston
        const pistonGeo = new THREE.CylinderGeometry(4, 4, 80, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(0, 30, 0);
        cylinder.add(piston);
        meshes.pistons.push(piston);

        // Connective Joints and Pressure valves
        const jointGeo = new THREE.SphereGeometry(8, 32, 32);
        const upperJoint = new THREE.Mesh(jointGeo, steel);
        upperJoint.position.set(0, 40, 0);
        piston.add(upperJoint);

        // Valve detailing
        const valveGeo = new THREE.TorusGeometry(7, 1, 16, 32);
        const valve = new THREE.Mesh(valveGeo, copper);
        valve.rotation.x = Math.PI / 2;
        valve.position.set(0, 25, 0);
        cylinder.add(valve);
    });

    // -------------------------------------------------------------------------
    // PART F: Energy Containment Shielding & Hex Grid
    // -------------------------------------------------------------------------
    const shieldGeo = new THREE.SphereGeometry(65, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.8);
    const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 40, 0);
    shield.rotation.x = -Math.PI / 2;
    group.add(shield);
    
    // Procedural Hexagonal Wireframe Forcefield
    const hexWireGeo = new THREE.IcosahedronGeometry(65.5, 5); // High detail subdivisions
    const hexWireMat = new THREE.MeshBasicMaterial({ 
        color: 0x00aaff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15 
    });
    const hexWire = new THREE.Mesh(hexWireGeo, hexWireMat);
    shield.add(hexWire);
    meshes.shieldHex = hexWire;

    // -------------------------------------------------------------------------
    // PART G: Complex Power Conduits (Spline-based Tubing)
    // -------------------------------------------------------------------------
    meshes.pulses = [];
    for (let i = 0; i < 10; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(i) * 20, 0, Math.sin(i) * 20),
            new THREE.Vector3(Math.cos(i) * 40, 20, Math.sin(i) * 40),
            new THREE.Vector3(Math.cos(i) * 30, 40, Math.sin(i) * 30),
            new THREE.Vector3(0, 40, 0) // Connecting to core
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.5, 16, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        group.add(tube);
        
        // Add animated energy pulse inside the tube
        const pulseGeo = new THREE.TubeGeometry(curve, 64, 1.8, 16, false);
        const pulseMat = neonBlue.clone();
        pulseMat.wireframe = true;
        pulseMat.opacity = 0; // Controlled in animation
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        tube.add(pulse);
        meshes.pulses.push(pulse);
    }

    // -------------------------------------------------------------------------
    // PART H: Emitter Nozzle with Internal Rifling
    // -------------------------------------------------------------------------
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0, 40, 120);
    group.add(nozzleGroup);
    meshes.nozzle = nozzleGroup;

    // Nozzle Outer Shell (Lathed)
    const nozzlePoints = [];
    for(let i=0; i<=30; i++){
        const radius = 25 * Math.exp(-i * 0.05); // Exponential taper
        nozzlePoints.push(new THREE.Vector2(radius, i * 4));
    }
    const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 64);
    const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
    nozzle.rotation.x = Math.PI / 2;
    nozzleGroup.add(nozzle);
    
    // Exotic Matter Rifling (Helical structures inside the nozzle)
    for(let i=0; i<16; i++){
        const riflingGroup = new THREE.Group();
        const angle = (i/16) * Math.PI * 2;
        riflingGroup.rotation.y = angle;
        
        // Create a helical spiral
        const spiralCurve = new THREE.CatmullRomCurve3(
            Array.from({length: 20}, (_, idx) => {
                const z = idx * 6;
                const r = 25 * Math.exp(-idx * 0.05) - 1; // Fit inside nozzle
                const theta = idx * 0.2; // Twist
                return new THREE.Vector3(Math.cos(theta)*r, z, Math.sin(theta)*r);
            })
        );
        
        const riflingGeo = new THREE.TubeGeometry(spiralCurve, 64, 0.8, 8, false);
        const riflingMesh = new THREE.Mesh(riflingGeo, chrome);
        riflingMesh.rotation.x = Math.PI / 2;
        nozzleGroup.add(riflingMesh);
    }

    // -------------------------------------------------------------------------
    // PART I: Cooling Radiators (Massive Heat Sinks)
    // -------------------------------------------------------------------------
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.set(0, 110, -10);
    group.add(radiatorGroup);
    meshes.radiators = [];
    
    // Arrays of extremely thin fins
    for (let x = -1; x <= 1; x += 2) {
        for (let i = 0; i < 80; i++) {
            const finGeo = new THREE.BoxGeometry(40, 8, 0.2);
            // Create a custom material that can glow red hot
            const finMat = new THREE.MeshStandardMaterial({
                color: 0x555555,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0xff2200,
                emissiveIntensity: 0.0 // Controlled in animation loop
            });
            const fin = new THREE.Mesh(finGeo, finMat);
            fin.position.set(x * 30, i * 0.8, 0);
            
            radiatorGroup.add(fin);
            meshes.radiators.push(finMat);
        }
    }

    // -------------------------------------------------------------------------
    // PART J: Control Cabin & Operator Interface
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-90, 10, 0);
    group.add(cabinGroup);

    const cabinGeo = new THREE.BoxGeometry(35, 30, 40);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);
    
    // Tinted Viewport
    const windowGeo = new THREE.PlaneGeometry(25, 12);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(17.6, 5, 0);
    windowMesh.rotation.y = Math.PI / 2;
    cabin.add(windowMesh);
    
    // Instanced Mesh for hundreds of buttons and screens
    const buttonGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00ff00 });
    const numButtons = 200;
    const buttonInstanced = new THREE.InstancedMesh(buttonGeo, buttonMat, numButtons);
    
    const dummyBtn = new THREE.Object3D();
    for(let i=0; i<numButtons; i++){
        const row = Math.floor(i / 20);
        const col = i % 20;
        dummyBtn.position.set(12, -2 - row * 1.5, -15 + col * 1.5);
        
        // Randomize button tilt
        dummyBtn.rotation.set(Math.random()*0.1, 0, Math.random()*0.1);
        dummyBtn.updateMatrix();
        
        // Color randomization applied via instanceColor
        const color = new THREE.Color();
        const rand = Math.random();
        if (rand > 0.8) color.setHex(0xff0000);
        else if (rand > 0.5) color.setHex(0x0088ff);
        else color.setHex(0x00ff00);
        
        buttonInstanced.setMatrixAt(i, dummyBtn.matrix);
        buttonInstanced.setColorAt(i, color);
    }
    cabin.add(buttonInstanced);
    
    // Radar / Sensor dish on top of cabin
    const dishGeo = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeo, plastic);
    dish.position.set(0, 20, 0);
    dish.rotation.x = -Math.PI / 2;
    cabin.add(dish);
    meshes.radarDish = dish;

    // -------------------------------------------------------------------------
    // PART K: Targeting Sensors & Tachyon Antennas
    // -------------------------------------------------------------------------
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(0, 120, 100);
    group.add(sensorGroup);

    const sensorBaseGeo = new THREE.CylinderGeometry(5, 8, 20, 32);
    const sensorBase = new THREE.Mesh(sensorBaseGeo, darkSteel);
    sensorGroup.add(sensorBase);

    // Multi-lens array
    for(let i=0; i<4; i++){
        const lensGeo = new THREE.SphereGeometry(3, 32, 32);
        const lens = new THREE.Mesh(lensGeo, glass);
        const angle = (i/4)*Math.PI*2;
        lens.position.set(Math.cos(angle)*6, 5, Math.sin(angle)*6);
        sensorBase.add(lens);
    }
    
    // Tachyon targeting laser
    const laserPointerGeo = new THREE.CylinderGeometry(0.2, 0.2, 1000, 16);
    const laserPointerMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending});
    const laserPointer = new THREE.Mesh(laserPointerGeo, laserPointerMat);
    laserPointer.position.set(0, 500, 0);
    laserPointer.rotation.x = Math.PI / 2; // Point forward
    sensorGroup.add(laserPointer);

    // -------------------------------------------------------------------------
    // PART L: Antimatter Initiator (Magnetic Trap)
    // -------------------------------------------------------------------------
    const initiatorGroup = new THREE.Group();
    initiatorGroup.position.set(0, 40, -100);
    group.add(initiatorGroup);
    
    const trapGeo = new THREE.DodecahedronGeometry(12, 1);
    const trapMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00, 
        emissive: 0xff3300, 
        emissiveIntensity: 2.0,
        wireframe: true
    });
    const trap = new THREE.Mesh(trapGeo, trapMat);
    initiatorGroup.add(trap);
    meshes.initiator = trap;

    // A tiny speck of antimatter
    const antimatterGeo = new THREE.SphereGeometry(1, 16, 16);
    const antimatterMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    const antimatter = new THREE.Mesh(antimatterGeo, antimatterMat);
    trap.add(antimatter);

    // -------------------------------------------------------------------------
    // PART M: Spatial Distortion Generators
    // -------------------------------------------------------------------------
    meshes.distortions = [];
    for(let i=0; i<3; i++){
        // Use TorusKnot to represent warped spacetime geometry
        const distGeo = new THREE.TorusKnotGeometry(25, 0.5, 150, 16, 3, 8);
        const distMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 1.0,
            roughness: 0.0,
            envMapIntensity: 5.0, // Highly reflective to look like a gravitational lens
            transparent: true,
            opacity: 0.7
        });
        const dist = new THREE.Mesh(distGeo, distMat);
        dist.position.set(0, 40, 0);
        group.add(dist);
        meshes.distortions.push({
            mesh: dist,
            rx: Math.random() * 0.02,
            ry: Math.random() * 0.02
        });
    }

    // -------------------------------------------------------------------------
    // PART N: Plasma Venting System
    // -------------------------------------------------------------------------
    const ventGroup = new THREE.Group();
    group.add(ventGroup);
    meshes.vents = [];

    for(let i=0; i<4; i++){
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        const ventBodyGeo = new THREE.CylinderGeometry(4, 6, 25, 16);
        const ventBody = new THREE.Mesh(ventBodyGeo, darkSteel);
        
        ventBody.position.set(Math.cos(angle)*50, 10, Math.sin(angle)*50);
        
        // Tilt outwards
        ventBody.lookAt(Math.cos(angle)*100, 50, Math.sin(angle)*100);
        
        ventGroup.add(ventBody);
        
        // Vent flames (cone)
        const flameGeo = new THREE.ConeGeometry(3.5, 30, 16);
        const flameMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00, 
            transparent: true, 
            opacity: 0.0, // Controlled during firing
            blending: THREE.AdditiveBlending
        });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(0, 25, 0);
        ventBody.add(flame);
        meshes.vents.push(flameMat);
    }

    // -------------------------------------------------------------------------
    // PART O: Zero-Point Beam (The Ultimate Destructive Force)
    // -------------------------------------------------------------------------
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 40, 240); // Start after nozzle
    group.add(beamGroup);
    meshes.beam = beamGroup;
    beamGroup.visible = false; // Initially hidden

    // Core solid white/blue beam
    const coreBeamGeo = new THREE.CylinderGeometry(8, 8, 4000, 64);
    // Shift origin so scaling scales from base, not center
    coreBeamGeo.translate(0, 2000, 0); 
    const coreBeamMat = plasmaMaterial.clone();
    const coreBeam = new THREE.Mesh(coreBeamGeo, coreBeamMat);
    coreBeam.rotation.x = Math.PI / 2;
    beamGroup.add(coreBeam);

    // Outer chaotic energy wrapper
    const outerBeamGeo = new THREE.CylinderGeometry(15, 20, 4000, 32, 100, true);
    outerBeamGeo.translate(0, 2000, 0);
    
    // Deform outer beam heavily
    const pos = outerBeamGeo.attributes.position;
    for(let i=0; i<pos.count; i++){
        const y = pos.getY(i);
        const deform = Math.sin(y * 0.1) * 3;
        pos.setX(i, pos.getX(i) + deform);
        pos.setZ(i, pos.getZ(i) + deform);
    }
    outerBeamGeo.computeVertexNormals();

    const outerBeamMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, 
        transparent: true, 
        opacity: 0.5, 
        blending: THREE.AdditiveBlending, 
        side: THREE.DoubleSide,
        wireframe: true
    });
    const outerBeam = new THREE.Mesh(outerBeamGeo, outerBeamMat);
    outerBeam.rotation.x = Math.PI / 2;
    beamGroup.add(outerBeam);
    meshes.outerBeam = outerBeam;

    // -------------------------------------------------------------------------
    // PART P: Instanced Particle Swarm (Quantum Foam Extract)
    // -------------------------------------------------------------------------
    const numParticles = 3000;
    const particleGeo = new THREE.TetrahedronGeometry(0.8, 0);
    const particleMat = neonBlue.clone();
    particleMat.blending = THREE.AdditiveBlending;
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, numParticles);
    
    const dummy = new THREE.Object3D();
    const particleData = [];
    
    for(let i=0; i<numParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 30 + Math.random() * 50;
        
        particleData.push({
            rBase: r,
            r: r,
            theta: theta,
            phi: phi,
            speedTheta: (Math.random() - 0.5) * 0.05,
            speedPhi: (Math.random() - 0.5) * 0.05,
            scale: Math.random() * 1.5 + 0.5
        });
        
        // Initial set handled in animate loop
    }
    
    particleMesh.position.set(0, 40, 0);
    group.add(particleMesh);
    meshes.particles = particleMesh;
    meshes.particleData = particleData;
    meshes.dummy = dummy;


    // =========================================================================
    // 3. ENCYCLOPEDIA PARTS METADATA
    // =========================================================================
    parts.push(
        {
            name: "Massive Stabilizing Chassis",
            description: "An immense frame of dark steel and reinforced plating required to anchor the weapon against the catastrophic recoil of collapsing local spacetime. Houses structural integrity field generators.",
            material: "Dark Steel / Structural Alloys",
            function: "Anchors the weapon and prevents it from tearing itself apart during firing.",
            assemblyOrder: 1,
            connections: ["Recoil Dampener Hydraulics", "Control Cabin", "Vacuum Inductor Core"],
            failureEffect: "Weapon implodes, consuming the local planetary body in a micro-singularity.",
            cascadeFailures: ["Vacuum Inductor Core", "Antimatter Initiator"],
            originalPosition: {x: 0, y: -20, z: 0},
            explodedPosition: {x: 0, y: -100, z: 0}
        },
        {
            name: "Vacuum Inductor Core",
            description: "The spherical heart of the weapon where virtual particles are separated before they can annihilate, harvesting their absolute energy.",
            material: "Void-State Metamaterial / Chrome",
            function: "Creates a localized region of false vacuum to siphon unlimited zero-point energy from the universe's baseline.",
            assemblyOrder: 2,
            connections: ["Accelerator Rings", "Crystalline Focusing Array", "Power Conduits"],
            failureEffect: "False vacuum decay initiates, expanding at the speed of light and destroying the universe.",
            cascadeFailures: ["Entire Universe"],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {x: 0, y: 200, z: 0}
        },
        {
            name: "Crystalline Focusing Array",
            description: "A matrix of artificially grown hyperspatial crystals possessing an index of refraction > 1 in 11 dimensions.",
            material: "Hyperspatial Crystal",
            function: "Focuses the chaotic zero-point energy into a coherent, directed beam of pure destructive force.",
            assemblyOrder: 3,
            connections: ["Vacuum Inductor Core", "Emitter Nozzle"],
            failureEffect: "Beam scatters, obliterating the weapon and the surrounding solar system.",
            cascadeFailures: ["Emitter Nozzle"],
            originalPosition: {x: 0, y: 40, z: 60},
            explodedPosition: {x: 0, y: 100, z: 150}
        },
        {
            name: "Accelerator Rings",
            description: "Massive super-conducting rings that generate shifting magnetic and gravitational fields.",
            material: "Super-conducting Aluminum / Copper",
            function: "Spins up the harvested virtual particles to near-light speed before feeding them into the focusing array.",
            assemblyOrder: 4,
            connections: ["Vacuum Inductor Core", "Power Conduits"],
            failureEffect: "Particles lose containment, causing localized atomic disintegration.",
            cascadeFailures: ["Energy Containment Shielding"],
            originalPosition: {x: 0, y: 40, z: -30},
            explodedPosition: {x: 0, y: -50, z: -150}
        },
        {
            name: "Recoil Dampener Hydraulics",
            description: "Gigantic pistons filled with a non-Newtonian quark-gluon plasma fluid.",
            material: "Dark Steel / Chrome",
            function: "Absorbs the kinetic shockwave of discharging zero-point energy.",
            assemblyOrder: 5,
            connections: ["Massive Stabilizing Chassis", "Vacuum Inductor Core"],
            failureEffect: "Weapon shears off its mounts and launches backward at relativistic speeds.",
            cascadeFailures: ["Massive Stabilizing Chassis"],
            originalPosition: {x: 0, y: -10, z: 0},
            explodedPosition: {x: 100, y: 50, z: 100}
        },
        {
            name: "Energy Containment Shielding",
            description: "A multi-layered hemispherical shell incorporating hex-grid forcefield emitters.",
            material: "Neutronium-Laced Alloys",
            function: "Prevents ambient radiation and spatial warping from instantly killing the operator.",
            assemblyOrder: 6,
            connections: ["Vacuum Inductor Core", "Control Cabin"],
            failureEffect: "Immediate vaporization of all organic matter within a 100-mile radius.",
            cascadeFailures: ["Control Cabin"],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {x: 0, y: 300, z: 0}
        },
        {
            name: "Power Conduits",
            description: "Thick, spiraling tubes transferring unimaginable electrical current and plasma.",
            material: "Copper / Plasma",
            function: "Routes excess power from the core to the peripheral systems and radiators.",
            assemblyOrder: 7,
            connections: ["Vacuum Inductor Core", "Cooling Radiators"],
            failureEffect: "Catastrophic plasma venting, melting the chassis.",
            cascadeFailures: ["Massive Stabilizing Chassis", "Cooling Radiators"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -150, y: 50, z: -50}
        },
        {
            name: "Emitter Nozzle",
            description: "The terrifying terminus of the weapon, heavily rifled with exotic matter to shape the beam.",
            material: "Dark Steel / Exotic Matter",
            function: "Provides final shaping and directional vectoring for the zero-point beam.",
            assemblyOrder: 8,
            connections: ["Crystalline Focusing Array"],
            failureEffect: "Beam defocuses, drastically reducing range and causing immediate backscatter.",
            cascadeFailures: ["Crystalline Focusing Array"],
            originalPosition: {x: 0, y: 40, z: 120},
            explodedPosition: {x: 0, y: 0, z: 350}
        },
        {
            name: "Cooling Radiators",
            description: "A vast array of ultra-thin cooling fins.",
            material: "Thermal Aluminum",
            function: "Radiates the immense waste heat into the environment, glowing red hot during operation.",
            assemblyOrder: 9,
            connections: ["Power Conduits"],
            failureEffect: "Weapon overheats and melts into a puddle of radioactive slag.",
            cascadeFailures: ["Power Conduits"],
            originalPosition: {x: 0, y: 110, z: -10},
            explodedPosition: {x: 0, y: 400, z: -50}
        },
        {
            name: "Control Cabin",
            description: "A heavily shielded, lead-lined room where a very brave or very foolish operator sits.",
            material: "Steel / Tinted Glass",
            function: "Provides manual override and targeting telemetry interfaces.",
            assemblyOrder: 10,
            connections: ["Massive Stabilizing Chassis", "Targeting Sensors"],
            failureEffect: "Operator is exposed to the vacuum core and spaghettified.",
            cascadeFailures: ["Targeting Sensors"],
            originalPosition: {x: -90, y: 10, z: 0},
            explodedPosition: {x: -300, y: 50, z: 0}
        },
        {
            name: "Targeting Sensors",
            description: "Advanced tachyon-based optical arrays and spatial distortion scanners.",
            material: "Plastic / Glass",
            function: "Allows the weapon to track targets moving faster than light by seeing their past positions.",
            assemblyOrder: 11,
            connections: ["Control Cabin", "Emitter Nozzle"],
            failureEffect: "Weapon can only fire blindly.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 120, z: 100},
            explodedPosition: {x: 0, y: 200, z: 200}
        },
        {
            name: "Antimatter Initiator",
            description: "A suspended magnetic trap holding exactly 1 gram of anti-hydrogen.",
            material: "Energy Fields",
            function: "Injects antimatter into the core to kickstart the zero-point extraction process.",
            assemblyOrder: 12,
            connections: ["Vacuum Inductor Core"],
            failureEffect: "Antimatter drops containment, causing a 43 kiloton explosion.",
            cascadeFailures: ["Vacuum Inductor Core", "Massive Stabilizing Chassis"],
            originalPosition: {x: 0, y: 40, z: -100},
            explodedPosition: {x: 0, y: 50, z: -300}
        },
        {
            name: "Spatial Distortion Generators",
            description: "Interlocking, invisible toroids of warped spacetime.",
            material: "Void",
            function: "Bends space around the weapon to prevent its own beam from ripping the local timeline apart.",
            assemblyOrder: 13,
            connections: ["Vacuum Inductor Core"],
            failureEffect: "Time loops infinitely for the operator, forcing them to fire the weapon forever.",
            cascadeFailures: ["Control Cabin"],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {x: 150, y: -100, z: -150}
        },
        {
            name: "Plasma Venting System",
            description: "Massive exhaust pipes angled away from the chassis.",
            material: "Dark Steel",
            function: "Vents excess normal matter that is accidentally drawn into the vacuum core.",
            assemblyOrder: 14,
            connections: ["Vacuum Inductor Core", "Massive Stabilizing Chassis"],
            failureEffect: "Pressure buildup causes a rapid unscheduled disassembly.",
            cascadeFailures: ["Vacuum Inductor Core"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 200, y: -50, z: 200}
        },
        {
            name: "Zero-Point Beam (Active State)",
            description: "A terrifyingly bright column of absolute destructive energy, unmaking matter at the quantum level.",
            material: "Pure Energy",
            function: "Erases the target from existence.",
            assemblyOrder: 15,
            connections: ["Emitter Nozzle"],
            failureEffect: "Beam reflects back, erasing the weapon.",
            cascadeFailures: ["Everything"],
            originalPosition: {x: 0, y: 40, z: 240},
            explodedPosition: {x: 0, y: 40, z: 1000}
        }
    );

    const description = "The Zero-Point Energy Weapon (God Tier). An ultra-high-tech, hyper-realistic, extremely complex device designed to weaponize the baseline vacuum energy of the universe. It rips virtual particles from the quantum foam and converts them into a blinding, purely destructive beam of zero-point energy. Features include massive crystalline focusing arrays, hyper-advanced accelerator rings, tachyon targeting sensors, and immense hydraulic recoil dampeners to survive its own cataclysmic output.";

    // =========================================================================
    // 4. PhD-LEVEL QUANTUM FIELD THEORY QUIZ
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of quantum field theory, how does the Vacuum Inductor Core extract energy from the zero-point field without violating the First Law of Thermodynamics?",
            options: [
                "By inducing a localized false vacuum decay, converting the energy difference between the false and true vacuum states into usable work.",
                "By simply capturing stray photons from background radiation.",
                "It uses a standard nuclear fission reactor hidden inside.",
                "By reversing the polarity of the neutron flow."
            ],
            correctAnswer: 0,
            explanation: "In quantum field theory, if a region of space is in a 'false vacuum' state (a local minimum of energy but not the global minimum), a transition to the 'true vacuum' releases immense energy equivalent to the difference in energy between the two states."
        },
        {
            question: "Why must the Recoil Dampener Hydraulics utilize a non-Newtonian quark-gluon plasma rather than standard hydraulic fluid?",
            options: [
                "Standard fluids freeze in space.",
                "Quark-gluon plasma exhibits asymptotic freedom, allowing it to become perfectly rigid under the instantaneous, near-infinite shear stress of the zero-point discharge.",
                "It looks cooler when it leaks.",
                "It prevents the hydraulic seals from rusting."
            ],
            correctAnswer: 1,
            explanation: "Asymptotic freedom in quantum chromodynamics describes how quarks behave as free particles at very high energies. Under extreme stress, this plasma can absorb virtually infinite kinetic shock by distributing it across strong-force interactions."
        },
        {
            question: "The Crystalline Focusing Array utilizes hyperspatial crystals with an index of refraction > 1 in 11 dimensions. What is the primary purpose of operating in 11 dimensions?",
            options: [
                "To make the beam invisible to standard 3D sensors.",
                "To intersect with M-theory branes, allowing the energy to bypass 3D spatial geometry and strike a target instantaneously across spacetime.",
                "To reduce the weight of the crystals.",
                "To increase the structural integrity of the glass."
            ],
            correctAnswer: 1,
            explanation: "M-theory posits an 11-dimensional universe consisting of multidimensional branes. Refracting energy through higher dimensions allows the beam to bypass standard 3D spacetime limitations (like the speed of light) and strike targets instantaneously."
        },
        {
            question: "What catastrophic event is described as 'False Vacuum Decay' if the weapon's core containment fails?",
            options: [
                "The weapon powers down safely.",
                "A bubble of true vacuum expands at the speed of light, altering the fundamental constants of physics and destroying all baryonic matter it touches.",
                "The core explodes like a regular thermonuclear bomb.",
                "The operator gets a mild sunburn."
            ],
            correctAnswer: 1,
            explanation: "False vacuum decay would initiate a bubble of lower energy state expanding outward at the speed of light. Inside this bubble, the laws of physics, masses of particles, and fundamental forces would change entirely, making chemistry and life impossible."
        },
        {
            question: "How do the Spatial Distortion Generators prevent the weapon from destroying itself via 'timeline ripping'?",
            options: [
                "They emit a loud noise to scare away time travelers.",
                "They utilize closed timelike curves to route the localized temporal paradoxes back into the vacuum core for re-absorption.",
                "They generate a magnetic field.",
                "They freeze time completely around the weapon."
            ],
            correctAnswer: 1,
            explanation: "Firing such massive energies can warp spacetime enough to create closed timelike curves (time loops). The generators manage these by feeding the energetic paradoxes back into the core before they can propagate and violate causality in the local frame."
        }
    ];

    // =========================================================================
    // 5. EXTREME ANIMATION LOGIC
    // =========================================================================
    let timeAcc = 0;
    
    function animate(time, speed, activeMeshes) {
        timeAcc += speed * 0.05;

        // --- Cycle Management (10 second cycle: 7s charge, 3s fire) ---
        const cycleLength = 10;
        const currentCycle = timeAcc % cycleLength;
        const isFiring = currentCycle > 7;
        const chargeRatio = isFiring ? 1.0 : (currentCycle / 7);

        // 1. Core and Tendrils Chaos
        if (meshes.core) {
            meshes.core.rotation.y = timeAcc * (isFiring ? 2.0 : 0.5);
        }
        if (meshes.tendrils) {
            meshes.tendrils.forEach(t => {
                t.mesh.rotation.x += t.rx * speed * (isFiring ? 5 : 1);
                t.mesh.rotation.y += t.ry * speed * (isFiring ? 5 : 1);
                t.mesh.rotation.z += t.rz * speed * (isFiring ? 5 : 1);
                
                const scaleBase = 1 + Math.sin(timeAcc * 10 + t.rx * 100) * 0.2;
                t.mesh.scale.setScalar(scaleBase * (1 + chargeRatio * 0.5));
                
                // Increase emission as it charges
                t.mesh.material.emissiveIntensity = 8 + (chargeRatio * 30);
            });
        }

        // 2. Accelerator Rings Spooling Up
        if (meshes.rings) {
            meshes.rings.forEach(ringObj => {
                const ringSpeed = ringObj.speed * (1 + chargeRatio * 5) * speed;
                ringObj.mesh.rotation.z += ringSpeed;
                // Vibrations
                ringObj.mesh.position.y = 40 + (isFiring ? (Math.random() - 0.5) * 2 : 0);
            });
        }

        // 3. Crystals Aligning and Glowing
        if (meshes.crystals) {
            meshes.crystals.forEach(c => {
                // As charge increases, crystals move inward to focus
                const currentRadius = c.radius - (chargeRatio * 10);
                c.mesh.position.x = Math.cos(c.angleOffset + timeAcc * 0.5) * currentRadius;
                c.mesh.position.y = Math.sin(c.angleOffset + timeAcc * 0.5) * currentRadius;
                
                // Pulsing glow
                c.mesh.material.emissiveIntensity = chargeRatio * 15;
            });
        }
        if (meshes.centralCrystal) {
            meshes.centralCrystal.rotation.x += speed * 0.1 * (1 + chargeRatio * 4);
            meshes.centralCrystal.rotation.y += speed * 0.15 * (1 + chargeRatio * 4);
            meshes.centralCrystal.material.emissiveIntensity = chargeRatio * 20;
        }

        // 4. Hydraulics and Structural Shaking
        if (meshes.pistons) {
            // Compress rapidly during fire, slowly reset
            meshes.pistons.forEach(piston => {
                if (isFiring) {
                    piston.position.y = THREE.MathUtils.lerp(piston.position.y, 10 + Math.random() * 5, 0.5);
                } else {
                    piston.position.y = THREE.MathUtils.lerp(piston.position.y, 30, 0.05);
                }
            });
        }

        // Whole group shake during fire
        if (isFiring) {
            group.position.x = (Math.random() - 0.5) * 4;
            group.position.y = (Math.random() - 0.5) * 4;
            group.position.z = (Math.random() - 0.5) * 4;
        } else {
            group.position.set(0, 0, 0);
        }

        // 5. Shield Hex Grid Pulsing
        if (meshes.shieldHex) {
            meshes.shieldHex.material.opacity = 0.1 + (chargeRatio * 0.4);
            meshes.shieldHex.rotation.y = timeAcc * 0.1;
            meshes.shieldHex.rotation.z = timeAcc * 0.05;
        }

        // 6. Power Conduit Pulses
        if (meshes.pulses) {
            meshes.pulses.forEach((pulse, idx) => {
                pulse.material.opacity = (Math.sin(timeAcc * 20 + idx) > 0.5) ? chargeRatio : 0;
            });
        }

        // 7. Radiator Heat Build-up
        if (meshes.radiators) {
            meshes.radiators.forEach(mat => {
                // Instantly heats up on fire, slowly cools down during charge
                if (isFiring) {
                    mat.emissiveIntensity = 2.0;
                } else {
                    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.01);
                }
            });
        }

        // 8. Radar Dish
        if (meshes.radarDish) {
            meshes.radarDish.rotation.z = timeAcc;
        }

        // 9. Antimatter Initiator
        if (meshes.initiator) {
            meshes.initiator.rotation.x += speed * 0.05;
            meshes.initiator.rotation.y += speed * 0.08;
            meshes.initiator.scale.setScalar(1 + Math.random() * (isFiring ? 0.5 : 0.05));
        }

        // 10. Spatial Distortions (Warping Spacetime)
        if (meshes.distortions) {
            meshes.distortions.forEach(dist => {
                dist.mesh.rotation.x += dist.rx * speed * (isFiring ? 10 : 1);
                dist.mesh.rotation.y += dist.ry * speed * (isFiring ? 10 : 1);
                dist.mesh.scale.setScalar(1 + Math.sin(timeAcc * 5)*0.1 + (isFiring ? 0.5 : 0));
            });
        }

        // 11. Venting Plasma
        if (meshes.vents) {
            meshes.vents.forEach(ventMat => {
                ventMat.opacity = isFiring ? 0.8 + Math.random() * 0.2 : (chargeRatio > 0.8 ? (chargeRatio - 0.8) : 0);
            });
        }

        // 12. The Zero-Point Beam!
        if (meshes.beam) {
            meshes.beam.visible = isFiring;
            if (isFiring) {
                // Expanding, chaotic scale
                meshes.beam.scale.x = 1 + Math.random() * 1.5;
                meshes.beam.scale.z = 1 + Math.random() * 1.5;
                
                if (meshes.outerBeam) {
                    meshes.outerBeam.rotation.y += speed * 2;
                    meshes.outerBeam.scale.x = 1 + Math.sin(timeAcc * 100) * 0.5;
                    meshes.outerBeam.scale.z = 1 + Math.cos(timeAcc * 100) * 0.5;
                }
            }
        }

        // 13. Instanced Quantum Particle Swarm
        if (meshes.particles) {
            for(let i=0; i<numParticles; i++){
                let data = meshes.particleData[i];
                
                // If charging, pull particles into core. If firing, violently eject them.
                if (isFiring) {
                    data.r += speed * 20;
                    if (data.r > 500) data.r = data.rBase; // reset far away
                } else {
                    data.r -= speed * (2 + chargeRatio * 5);
                    if (data.r < 15) data.r = 150 + Math.random() * 50; // loop back out
                }
                
                data.theta += data.speedTheta * speed * (1 + chargeRatio * 5);
                data.phi += data.speedPhi * speed * (1 + chargeRatio * 5);
                
                const x = data.r * Math.sin(data.phi) * Math.cos(data.theta);
                const y = data.r * Math.sin(data.phi) * Math.sin(data.theta);
                const z = data.r * Math.cos(data.phi);
                
                meshes.dummy.position.set(x, y, z);
                meshes.dummy.rotation.x += data.speedTheta;
                meshes.dummy.rotation.y += data.speedPhi;
                meshes.dummy.scale.setScalar(data.scale * (isFiring ? 2 : 1));
                meshes.dummy.updateMatrix();
                
                meshes.particles.setMatrixAt(i, meshes.dummy.matrix);
            }
            meshes.particles.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
