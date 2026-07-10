import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    let partId = 1;

    // --- ADVANCED CUSTOM MATERIALS ---
    // Translucent, reality-bending material for the Dark Energy Sail
    const realityBendingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0a0022,
        emissive: 0x220055,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        thickness: 2.0,
        ior: 1.8,
        roughness: 0.1,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Spacetime distortion material
    const spaceTimeDistortionMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x050511,
        emissiveIntensity: 0.5,
        transmission: 1.0,
        opacity: 0.4,
        metalness: 0.1,
        roughness: 0.1,
        ior: 2.5, // High index of refraction for intense lensing
        thickness: 50.0,
        transparent: true,
        side: THREE.BackSide
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9
    });

    const exoticMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xff00ff,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    // --- HELPER FUNCTION ---
    function registerPart(config) {
        config.mesh.position.set(config.originalPosition.x, config.originalPosition.y, config.originalPosition.z);
        group.add(config.mesh);
        
        parts.push({
            id: partId++,
            name: config.name,
            description: config.description,
            material: config.material,
            function: config.function,
            assemblyOrder: config.assemblyOrder,
            connections: config.connections,
            failureEffect: config.failureEffect,
            cascadeFailures: config.cascadeFailures,
            originalPosition: config.originalPosition,
            explodedPosition: config.explodedPosition
        });
    }

    // ==========================================
    // 1. CENTRAL SPINDLE CORE
    // ==========================================
    const corePoints = [];
    for (let i = 0; i <= 300; i++) {
        const t = i / 300;
        const radius = 5 + Math.sin(t * Math.PI * 40) * 0.8 + Math.cos(t * Math.PI * 8) * 2;
        const y = (t - 0.5) * 400; 
        corePoints.push(new THREE.Vector2(radius, y));
    }
    const coreGeo = new THREE.LatheGeometry(corePoints, 128);
    const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
    meshes.coreMesh = coreMesh;
    
    // Add Rivets and Panel Lines to the Core
    for (let i = 0; i < 200; i++) {
        const rivetGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const rivet = new THREE.Mesh(rivetGeo, chrome);
        const t = Math.random();
        const y = (t - 0.5) * 400;
        const radius = 5 + Math.sin(t * Math.PI * 40) * 0.8 + Math.cos(t * Math.PI * 8) * 2 + 0.1;
        const angle = Math.random() * Math.PI * 2;
        rivet.position.set(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
        coreMesh.add(rivet);
    }

    registerPart({
        name: 'Central Spindle Core',
        mesh: coreMesh,
        description: 'Massive central hull containing exotic matter conduits and primary crew habs. Constructed from collapsed neutron-star matter forged in a hyper-dimensional loom.',
        material: 'darkSteel, composite',
        function: 'Structural spine and quantum communication array housing.',
        assemblyOrder: 1,
        connections: ['Sail Tethers', 'Habitation Rings', 'Containment Arrays'],
        failureEffect: 'Complete structural failure and ship disintegration into fundamental strings.',
        cascadeFailures: ['Habitation Rings', 'Sail Tethers', 'Coolant Lines'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // ==========================================
    // 2. OPERATOR COMMAND CABIN (Hyper-Detailed)
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Cabin Body
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(0, 0);
    cabinShape.lineTo(25, 0);
    cabinShape.lineTo(30, 15);
    cabinShape.lineTo(15, 25);
    cabinShape.lineTo(5, 25);
    cabinShape.lineTo(0, 15);
    cabinShape.lineTo(0, 0);
    const cabinExtrude = { depth: 30, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 1, bevelThickness: 1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinMesh.position.set(-15, -12, -15);
    cabinGroup.add(cabinMesh);

    // Tinted Glass Windows
    const windowShape = new THREE.Shape();
    windowShape.moveTo(2, 2);
    windowShape.lineTo(23, 2);
    windowShape.lineTo(27, 14);
    windowShape.lineTo(14, 23);
    windowShape.lineTo(6, 23);
    windowShape.lineTo(2, 14);
    windowShape.lineTo(2, 2);
    const winExtrude = { depth: 31, bevelEnabled: false };
    const winGeo = new THREE.ExtrudeGeometry(windowShape, winExtrude);
    const winMesh = new THREE.Mesh(winGeo, tinted);
    winMesh.position.set(-15, -12, -15.5);
    cabinGroup.add(winMesh);

    // Steering Wheel
    const wheelGroup = new THREE.Group();
    const wheelGeo = new THREE.TorusGeometry(3.5, 0.6, 32, 64);
    const wheelMesh = new THREE.Mesh(wheelGeo, rubber);
    wheelGroup.add(wheelMesh);
    for(let i=0; i<4; i++){
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 7, 16);
        const spoke = new THREE.Mesh(spokeGeo, aluminum);
        spoke.rotation.z = (Math.PI / 4) * i;
        wheelGroup.add(spoke);
    }
    const columnGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 32);
    const column = new THREE.Mesh(columnGeo, darkSteel);
    column.rotation.x = Math.PI/2;
    column.position.z = -6;
    wheelGroup.add(column);
    wheelGroup.position.set(0, 5, 8);
    wheelGroup.rotation.x = -Math.PI/5;
    meshes.steeringWheel = wheelGroup;
    cabinGroup.add(wheelGroup);

    // Joysticks
    const joyGroup = new THREE.Group();
    const joyBaseGeo = new THREE.BoxGeometry(4, 2, 4);
    const joyBase = new THREE.Mesh(joyBaseGeo, plastic);
    joyGroup.add(joyBase);
    const stickGeo = new THREE.CylinderGeometry(0.3, 0.5, 8, 32);
    const stick = new THREE.Mesh(stickGeo, chrome);
    stick.position.y = 5;
    joyGroup.add(stick);
    const knobGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const knob = new THREE.Mesh(knobGeo, plasmaMaterial);
    knob.position.y = 9;
    joyGroup.add(knob);
    
    const joyL = joyGroup.clone();
    joyL.position.set(-8, 0, 8);
    meshes.joystickL = joyL;
    cabinGroup.add(joyL);
    
    const joyR = joyGroup.clone();
    joyR.position.set(8, 0, 8);
    meshes.joystickR = joyR;
    cabinGroup.add(joyR);

    // Side Mirrors
    const mirrorGroup = new THREE.Group();
    const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 16), darkSteel);
    mirrorArm.rotation.z = Math.PI / 2;
    mirrorArm.position.x = 4;
    mirrorGroup.add(mirrorArm);
    const mirrorBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 6, 4), plastic);
    mirrorBox.position.x = 8;
    mirrorGroup.add(mirrorBox);
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 5.5), glass);
    mirrorGlass.position.set(8.76, 0, 0);
    mirrorGlass.rotation.y = Math.PI / 2;
    mirrorGroup.add(mirrorGlass);
    
    const mirrorL = mirrorGroup.clone();
    mirrorL.position.set(-18, 5, -5);
    mirrorL.rotation.y = Math.PI;
    cabinGroup.add(mirrorL);
    
    const mirrorR = mirrorGroup.clone();
    mirrorR.position.set(13, 5, -5);
    cabinGroup.add(mirrorR);

    // Glowing Control Panels
    const panelGeo = new THREE.PlaneGeometry(15, 6);
    const panelMat = new THREE.MeshStandardMaterial({color: 0x111111, emissive: 0x00ffaa, emissiveIntensity: 2, wireframe: true});
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 8, 14);
    panel.rotation.x = -Math.PI/4;
    cabinGroup.add(panel);

    registerPart({
        name: 'Heavy-Duty Operator Cabin',
        mesh: cabinGroup,
        description: 'Industrial-grade command center with tactile controls (steering wheel, joysticks), side mirrors, and glowing holographic panels. Ensures the pilot can manually override reality-warping maneuvers.',
        material: 'steel, tinted glass, rubber, chrome',
        function: 'Manual navigation and multiversal piloting interface.',
        assemblyOrder: 2,
        connections: ['Central Spindle Core', 'Nav-Deflector'],
        failureEffect: 'Pilot exposure to hard vacuum and immediate mind-shattering from viewing raw spacetime.',
        cascadeFailures: ['Ship Control', 'Navigation'],
        originalPosition: { x: 0, y: 150, z: 25 },
        explodedPosition: { x: 0, y: 300, z: 100 }
    });

    // ==========================================
    // 3. SPACETIME TRACTION TIRES & HYDRAULICS
    // ==========================================
    const suspensionGroup = new THREE.Group();
    const wheels = [];
    const pistons = [];
    const hydraulicLines = [];
    
    const wheelPositions = [
        {x: 60, y: -100, z: 60},
        {x: -60, y: -100, z: 60},
        {x: 60, y: -100, z: -60},
        {x: -60, y: -100, z: -60}
    ];
    
    wheelPositions.forEach((pos, index) => {
        const cornerGroup = new THREE.Group();
        cornerGroup.position.set(pos.x, pos.y, pos.z);
        
        // Hydraulic Boom Arm
        const boomGroup = new THREE.Group();
        
        // Piston Outer Cylinder
        const outerPistonGeo = new THREE.CylinderGeometry(6, 6, 60, 32);
        const outerPiston = new THREE.Mesh(outerPistonGeo, steel);
        outerPiston.position.y = 30;
        boomGroup.add(outerPiston);
        
        // Piston Inner Cylinder
        const innerPistonGeo = new THREE.CylinderGeometry(4, 4, 60, 32);
        const innerPiston = new THREE.Mesh(innerPistonGeo, chrome);
        innerPiston.position.y = -10;
        boomGroup.add(innerPiston);
        pistons.push(innerPiston); 
        
        // Hydraulic Lines (TubeGeometry) winding around piston
        const lineCurvePoints = [];
        for(let k=0; k<=80; k++) {
            const t = k/80;
            const y = t * 60;
            const angle = t * Math.PI * 12; // Coiling
            lineCurvePoints.push(new THREE.Vector3(Math.cos(angle)*7, y, Math.sin(angle)*7));
        }
        const lineCurve = new THREE.CatmullRomCurve3(lineCurvePoints);
        const hLineGeo = new THREE.TubeGeometry(lineCurve, 128, 0.8, 16, false);
        const hLine = new THREE.Mesh(hLineGeo, rubber);
        boomGroup.add(hLine);
        hydraulicLines.push(hLine);
        
        // Aim boom towards origin of ship
        boomGroup.lookAt(new THREE.Vector3(0, 0, 0));
        cornerGroup.add(boomGroup);
        
        // The Tire
        const tireGroup = new THREE.Group();
        const tireGeo = new THREE.TorusGeometry(25, 10, 64, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        tireGroup.add(tire);
        
        // Treads (Hundreds of lugs)
        for(let t=0; t<180; t++) {
            const angle = (t/180) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(24, 3, 5);
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle)*34, Math.sin(angle)*34, 0);
            lug.rotation.z = angle;
            lug.rotation.y = Math.PI / 2;
            if (t % 2 === 0) {
                lug.rotation.x = Math.PI / 6;
            } else {
                lug.rotation.x = -Math.PI / 6;
            }
            tireGroup.add(lug);
        }
        
        // Cylinder Rims & Spokes
        const rimGeo = new THREE.CylinderGeometry(18, 18, 22, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        for(let s=0; s<16; s++) {
            const sAngle = (s/16) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(1.5, 1.5, 36, 16);
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.position.set(Math.cos(sAngle)*9, Math.sin(sAngle)*9, 0);
            spoke.rotation.z = sAngle;
            tireGroup.add(spoke);
        }
        
        tireGroup.position.set(0, -30, 0);
        cornerGroup.add(tireGroup);
        wheels.push(tireGroup); 
        
        suspensionGroup.add(cornerGroup);
    });
    meshes.wheels = wheels;
    meshes.pistons = pistons;
    meshes.hydraulicLines = hydraulicLines;

    registerPart({
        name: 'Dark Energy Spacetime Traction Tires',
        mesh: suspensionGroup,
        description: 'Hyper-advanced off-road tires with hundreds of rubberized lugs, cylinder rims, and hydraulic boom arms. Grips the literal fabric of spacetime to provide mechanical torque when navigating quantum foam.',
        material: 'rubber, chrome, darkSteel',
        function: 'Multiversal all-terrain locomotion and timeline traction.',
        assemblyOrder: 3,
        connections: ['Central Spindle Core', 'Power Conduits'],
        failureEffect: 'Loss of traction; spinning out into a parallel dimension.',
        cascadeFailures: ['Hydraulic Pumps', 'Axle Integrity'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // ==========================================
    // 4. DARK ENERGY SAIL
    // ==========================================
    const sailGeo = new THREE.PlaneGeometry(1500, 1500, 256, 256);
    const sailMesh = new THREE.Mesh(sailGeo, realityBendingMaterial);
    sailMesh.rotation.x = -Math.PI / 2;
    meshes.sailMesh = sailMesh;
    
    // Store original vertices for intense ripple animations
    const sailPosAttribute = sailMesh.geometry.attributes.position;
    const sailOriginalZ = new Float32Array(sailPosAttribute.count);
    for (let i = 0; i < sailPosAttribute.count; i++) {
        sailOriginalZ[i] = sailPosAttribute.getZ(i);
    }
    meshes.sailPosAttribute = sailPosAttribute;
    meshes.sailOriginalZ = sailOriginalZ;

    registerPart({
        name: 'Cosmological Constant Dark Energy Sail',
        mesh: sailMesh,
        description: 'A translucent, reality-bending metamaterial plane spanning kilometers. It catches the expansion of the universe itself by coupling directly to the vacuum energy.',
        material: 'reality-bending exotic metamaterial',
        function: 'Primary interstellar and intergalactic propulsion.',
        assemblyOrder: 4,
        connections: ['Quantum Entanglement Tethers'],
        failureEffect: 'Uncontrolled acceleration ripping the ship out of the observable universe.',
        cascadeFailures: ['Tethers', 'Spindle Core'],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // ==========================================
    // 5. QUANTUM ENTANGLEMENT TETHERS
    // ==========================================
    const tetherGeo = new THREE.BufferGeometry();
    const tetherPositions = [];
    const numTethers = 800;
    for(let i=0; i<numTethers; i++) {
        const radius = Math.random() * 730 + 20;
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        
        const shipY = 80 + Math.random()*30;
        const shipRadius = 8;
        const sx = Math.cos(theta) * shipRadius;
        const sz = Math.sin(theta) * shipRadius;
        
        tetherPositions.push(sx, shipY, sz);
        tetherPositions.push(x, 120, z); // Sail height
    }
    tetherGeo.setAttribute('position', new THREE.Float32BufferAttribute(tetherPositions, 3));
    const tetherMat = new THREE.LineBasicMaterial({ color: 0x8844ff, transparent: true, opacity: 0.6 });
    const tethers = new THREE.LineSegments(tetherGeo, tetherMat);
    meshes.tethers = tethers;

    registerPart({
        name: 'Quantum Entanglement Tethers',
        mesh: tethers,
        description: 'Hundreds of monofilament lines anchoring the massive dark energy sail to the central spindle.',
        material: 'hyper-diamond, carbon nanotubes',
        function: 'Transfers multiversal momentum from the sail to the hull.',
        assemblyOrder: 5,
        connections: ['Dark Energy Sail', 'Spindle Core'],
        failureEffect: 'Sail detachment; hull shearing forces.',
        cascadeFailures: ['Dark Energy Sail', 'Hull Integrity'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    // ==========================================
    // 6. CENTRIFUGAL HABITATION TORUS
    // ==========================================
    const habTorusGroup = new THREE.Group();
    const habTorusGeo = new THREE.TorusGeometry(80, 8, 64, 256);
    const habTorusMesh = new THREE.Mesh(habTorusGeo, steel);
    habTorusMesh.rotation.x = Math.PI / 2;
    habTorusGroup.add(habTorusMesh);
    
    // Add Habitation Pods and Glowing Windows
    for (let i = 0; i < 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        const podGeo = new THREE.CylinderGeometry(4, 4, 10, 32);
        const pod = new THREE.Mesh(podGeo, aluminum);
        pod.position.set(Math.cos(theta) * 88, 0, Math.sin(theta) * 88);
        pod.rotation.x = Math.PI / 2;
        pod.rotation.z = -theta;
        habTorusGroup.add(pod);
        
        const winGeo = new THREE.BoxGeometry(4.5, 4.5, 1);
        const win = new THREE.Mesh(winGeo, plasmaMaterial);
        win.position.set(Math.cos(theta) * 92, 0, Math.sin(theta) * 92);
        win.rotation.y = -theta;
        habTorusGroup.add(win);
    }
    meshes.habTorusGroup = habTorusGroup;

    registerPart({
        name: 'Centrifugal Habitation Torus',
        mesh: habTorusGroup,
        description: 'Massive rotating habitat providing 1G artificial gravity. Houses millions of crew members, agricultural bays, and recreational holodecks.',
        material: 'steel, aluminum, tinted glass',
        function: 'Life support, crew habitation, and morale preservation.',
        assemblyOrder: 6,
        connections: ['Spindle Core', 'Life Support Conduits'],
        failureEffect: 'Catastrophic loss of gravity and explosive decompression.',
        cascadeFailures: ['Crew Viability', 'Agricultural Bays'],
        originalPosition: { x: 0, y: -60, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // ==========================================
    // 7. ALCUBIERRE WARP RINGS
    // ==========================================
    const distortionRings = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const rGeo = new THREE.TorusGeometry(40 + i*6, 1.5, 32, 128);
        const rMesh = new THREE.Mesh(rGeo, copper);
        rMesh.rotation.x = Math.PI / 2;
        rMesh.position.y = -100 - i*10;
        distortionRings.add(rMesh);
    }
    meshes.distortionRings = distortionRings;

    registerPart({
        name: 'Alcubierre Metric Warp Rings',
        mesh: distortionRings,
        description: 'Generates regions of negative energy density to contract space ahead and expand it behind, bypassing the cosmic speed limit.',
        material: 'copper, exotic matter',
        function: 'Faster-than-light propulsion assistance and temporal shielding.',
        assemblyOrder: 7,
        connections: ['Quantum Field Stabilizer', 'Power Conduits'],
        failureEffect: 'Catastrophic spacetime shear; spaghettification of the vessel.',
        cascadeFailures: ['Hull Integrity', 'Spacetime Wake Envelope'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 0 }
    });

    // ==========================================
    // 8. DARK ENERGY SCOOPS
    // ==========================================
    const scoopsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const theta = (i/8) * Math.PI * 2;
        
        const scoopShape = new THREE.Shape();
        scoopShape.moveTo(0, 0);
        scoopShape.lineTo(10, 30);
        scoopShape.bezierCurveTo(15, 40, 20, 50, 40, 60);
        scoopShape.lineTo(0, 70);
        scoopShape.lineTo(-40, 60);
        scoopShape.bezierCurveTo(-20, 50, -15, 40, -10, 30);
        scoopShape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 1, bevelThickness: 1 };
        const scoopGeo = new THREE.ExtrudeGeometry(scoopShape, extrudeSettings);
        const scoop = new THREE.Mesh(scoopGeo, chrome);
        
        scoop.position.set(Math.cos(theta)*15, 100, Math.sin(theta)*15);
        scoop.rotation.y = -theta + Math.PI/2;
        scoop.rotation.x = Math.PI / 10;
        
        const fieldGeo = new THREE.SphereGeometry(8, 32, 32);
        const field = new THREE.Mesh(fieldGeo, exoticMatterMaterial);
        field.position.set(0, 40, 2);
        scoop.add(field);
        
        scoopsGroup.add(scoop);
    }
    meshes.scoopsGroup = scoopsGroup;

    registerPart({
        name: 'Dark Energy Collection Scoops',
        mesh: scoopsGroup,
        description: 'Electromagnetic funnels capturing zero-point energy fluctuations from the vacuum.',
        material: 'chrome, plasma',
        function: 'Gathering vacuum energy to feed the dark energy sail and reactors.',
        assemblyOrder: 8,
        connections: ['Main Reactor', 'Sail Exciter'],
        failureEffect: 'Energy starvation; uncontrolled deceleration.',
        cascadeFailures: ['Sail Exciter', 'Life Support'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // ==========================================
    // 9. SUPERFLUID HELIUM COOLANT LINES
    // ==========================================
    const coolantGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const curvePoints = [];
        for (let j = 0; j <= 100; j++) {
            const t = j / 100;
            const y = (t - 0.5) * 350;
            const angle = t * Math.PI * 15 + (i * Math.PI / 6);
            const radius = 6.5 + Math.sin(t * Math.PI * 16) * 1.5;
            curvePoints.push(new THREE.Vector3(Math.cos(angle)*radius, y, Math.sin(angle)*radius));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 200, 1.2, 16, false);
        const tube = new THREE.Mesh(tubeGeo, glass);
        
        const fluidGeo = new THREE.TubeGeometry(curve, 200, 0.8, 16, false);
        const fluid = new THREE.Mesh(fluidGeo, plasmaMaterial);
        
        coolantGroup.add(tube);
        coolantGroup.add(fluid);
    }
    meshes.coolantGroup = coolantGroup;

    registerPart({
        name: 'Superfluid Helium Coolant Lines',
        mesh: coolantGroup,
        description: 'Network of transparent tubes carrying near-absolute-zero fluid to quench the quantum core and prevent thermal runaway.',
        material: 'glass, superfluid helium',
        function: 'Extreme thermal regulation of exotic matter reactors.',
        assemblyOrder: 9,
        connections: ['Spindle Core', 'Alcubierre Rings', 'Radiator Fins'],
        failureEffect: 'Core meltdown leading to runaway vacuum decay.',
        cascadeFailures: ['Spindle Core', 'Containment Pods'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 150 }
    });

    // ==========================================
    // 10. SPACETIME WAKE ENVELOPE
    // ==========================================
    const wakeGeo = new THREE.CylinderGeometry(10, 600, 800, 128, 128, true);
    const wakeMesh = new THREE.Mesh(wakeGeo, spaceTimeDistortionMaterial);
    wakeMesh.position.y = -400;
    meshes.wakeMesh = wakeMesh;

    registerPart({
        name: 'Spacetime Wake Envelope',
        mesh: wakeMesh,
        description: 'A physical manifestation and visual artifact of intense spacetime stretching, frame-dragging, and gravitational lensing behind the vessel.',
        material: 'gravitational lensing metric',
        function: 'Dissipates chroniton buildup and prevents temporal paradoxes.',
        assemblyOrder: 10,
        connections: ['Alcubierre Rings'],
        failureEffect: 'Severe timeline pollution and grandfather paradoxes.',
        cascadeFailures: ['Causality'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -800, z: 0 }
    });

    // ==========================================
    // 11. HADRON COLLIDER RINGS
    // ==========================================
    const accelGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const ringGeo = new THREE.TorusGeometry(120, 4, 64, 256);
        const ring = new THREE.Mesh(ringGeo, darkSteel);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y = (i * Math.PI) / 4;
        
        for (let j = 0; j < 16; j++) {
            const nodeGeo = new THREE.BoxGeometry(10, 10, 15);
            const node = new THREE.Mesh(nodeGeo, chrome);
            const angle = (j / 16) * Math.PI * 2;
            node.position.set(Math.cos(angle)*120, 0, Math.sin(angle)*120);
            node.rotation.y = -angle;
            
            const glowGeo = new THREE.SphereGeometry(6, 16, 16);
            const glow = new THREE.Mesh(glowGeo, exoticMatterMaterial);
            node.add(glow);
            
            ring.add(node);
        }
        accelGroup.add(ring);
    }
    meshes.accelGroup = accelGroup;

    registerPart({
        name: 'Hadron Collider Rings',
        mesh: accelGroup,
        description: 'Gigantic circumferential particle accelerators generating antimatter and exotic matter on the fly.',
        material: 'darkSteel, chrome, plasma',
        function: 'In-situ exotic matter synthesis for the warp rings.',
        assemblyOrder: 11,
        connections: ['Alcubierre Rings', 'Power Conduits'],
        failureEffect: 'Antimatter containment failure resulting in a 100-teraton explosion.',
        cascadeFailures: ['Containment Fields', 'Habitation Torus'],
        originalPosition: { x: 0, y: -30, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // ==========================================
    // 12. TACHYON DEFLECTOR ARRAY
    // ==========================================
    const deflectorGeo = new THREE.ConeGeometry(30, 60, 64);
    const deflector = new THREE.Mesh(deflectorGeo, chrome);
    deflector.rotation.x = Math.PI;
    
    const deflectorCoreGeo = new THREE.SphereGeometry(15, 64, 64);
    const deflectorCore = new THREE.Mesh(deflectorCoreGeo, plasmaMaterial);
    deflectorCore.position.y = -30;
    deflector.add(deflectorCore);
    
    const grillGeo = new THREE.TorusGeometry(32, 2, 16, 64);
    const grill = new THREE.Mesh(grillGeo, steel);
    grill.rotation.x = Math.PI/2;
    grill.position.y = -30;
    deflector.add(grill);

    meshes.deflector = deflector;

    registerPart({
        name: 'Tachyon Deflector Array',
        mesh: deflector,
        description: 'Projects a massive forward-facing tachyon field to instantly vaporize interstellar debris and dark matter clumps before impact.',
        material: 'chrome, plasma, steel',
        function: 'Micro-meteoroid and extreme radiation shielding at relativistic speeds.',
        assemblyOrder: 12,
        connections: ['Spindle Core', 'Sensor Array'],
        failureEffect: 'Catastrophic hull impacts obliterating the vessel at 0.99c.',
        cascadeFailures: ['Hull Integrity', 'Bridge'],
        originalPosition: { x: 0, y: 190, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // ==========================================
    // 13. PLASMA EXHAUST STACKS
    // ==========================================
    const ventsGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const angle = (i/20) * Math.PI * 2;
        const ventGeo = new THREE.CylinderGeometry(3, 6, 30, 32);
        const vent = new THREE.Mesh(ventGeo, steel);
        vent.position.set(Math.cos(angle)*25, -200, Math.sin(angle)*25);
        vent.rotation.x = Math.PI;
        vent.rotation.z = Math.PI / 8;
        
        const plumeGeo = new THREE.ConeGeometry(5, 60, 32);
        const plume = new THREE.Mesh(plumeGeo, plasmaMaterial);
        plume.position.y = -35;
        plume.rotation.x = Math.PI;
        vent.add(plume);
        
        ventsGroup.add(vent);
    }
    meshes.ventsGroup = ventsGroup;

    registerPart({
        name: 'Plasma Exhaust Stacks',
        mesh: ventsGroup,
        description: 'Massive industrial exhaust stacks venting excess thermal, temporal, and radiative energy safely away from the crew.',
        material: 'steel, plasma',
        function: 'Heat and temporal paradox dissipation.',
        assemblyOrder: 13,
        connections: ['Coolant Lines', 'Main Reactor'],
        failureEffect: 'Internal core melting and temporal loops.',
        cascadeFailures: ['Coolant Lines', 'Reactor Containment'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // ==========================================
    // 14. EXOSKELETAL TRUSSES
    // ==========================================
    const trussGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const tGeo = new THREE.CylinderGeometry(1.5, 1.5, 150, 16);
        const tMesh = new THREE.Mesh(tGeo, steel);
        tMesh.position.set(0, -100 + i*7, 25);
        tMesh.rotation.x = Math.PI / 4;
        
        const tMesh2 = new THREE.Mesh(tGeo, steel);
        tMesh2.position.set(0, -100 + i*7, -25);
        tMesh2.rotation.x = -Math.PI / 4;
        
        trussGroup.add(tMesh);
        trussGroup.add(tMesh2);
    }
    meshes.trussGroup = trussGroup;

    registerPart({
        name: 'Exoskeletal Diamondoid Trusses',
        mesh: trussGroup,
        description: 'External diamondoid bracing criss-crossing the spindle core to reinforce the hull against extreme multiversal shear.',
        material: 'steel, diamondoid',
        function: 'Prevents longitudinal shear during insane acceleration curves.',
        assemblyOrder: 14,
        connections: ['Spindle Core'],
        failureEffect: 'Spindle snapping in half under extreme G-forces.',
        cascadeFailures: ['Spindle Core', 'Habitation Torus'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 0 }
    });

    // ==========================================
    // 15. DEPLOYABLE HEAT RADIATORS
    // ==========================================
    const radiatorGroup = new THREE.Group();
    const radiators = [];
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const radPivot = new THREE.Group();
        radPivot.position.set(Math.cos(angle)*15, -50, Math.sin(angle)*15);
        radPivot.rotation.y = -angle;
        
        const panelShape = new THREE.Shape();
        panelShape.moveTo(0,0);
        panelShape.lineTo(0, 100);
        panelShape.lineTo(40, 80);
        panelShape.lineTo(40, 20);
        panelShape.lineTo(0,0);
        
        const radGeo = new THREE.ExtrudeGeometry(panelShape, { depth: 2, bevelEnabled: true });
        const radMesh = new THREE.Mesh(radGeo, copper);
        radMesh.rotation.y = Math.PI/2;
        radPivot.add(radMesh);
        
        radiators.push(radPivot);
        radiatorGroup.add(radPivot);
    }
    meshes.radiators = radiators;

    registerPart({
        name: 'Deployable Graphene Heat Radiators',
        mesh: radiatorGroup,
        description: 'Gigantic folding copper-graphene fins that radiate petawatts of waste heat into the cosmic microwave background.',
        material: 'copper, graphene',
        function: 'Blackbody radiation of reactor waste heat.',
        assemblyOrder: 15,
        connections: ['Coolant Lines', 'Spindle Core'],
        failureEffect: 'Crew boiled alive; systems melt.',
        cascadeFailures: ['Life Support', 'Reactor Containment'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -200 }
    });

    // ==========================================
    // PARTICLES (RELATIVISTIC DUST)
    // ==========================================
    const particleCount = 20000;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 2000;
        posArray[i*3+1] = (Math.random() - 0.5) * 2000;
        posArray[i*3+2] = (Math.random() - 0.5) * 2000;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 3.0,
        color: 0xaa00ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    group.add(particleSystem);
    meshes.particleSystem = particleSystem;

    // ==========================================
    // QUIZ QUESTIONS (PHD LEVEL)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of dark energy, the Cosmological Constant Problem refers to the massive discrepancy between the observed value of the vacuum energy density and the value predicted by Quantum Field Theory (QFT). What is the approximate magnitude of this discrepancy?",
            options: [
                "120 orders of magnitude (10^120)",
                "60 orders of magnitude (10^60)",
                "10 orders of magnitude (10^10)",
                "The values match exactly."
            ],
            correctAnswer: 0,
            explanation: "QFT predicts a vacuum energy density that is roughly 10^120 times larger than the observed value of the cosmological constant, making it arguably the worst theoretical prediction in the history of physics."
        },
        {
            question: "Quintessence models represent dark energy as a dynamic scalar field $\\phi$. For a quintessence field to successfully drive the accelerated expansion of the universe, what condition must its equation of state parameter, $w = p/\\rho$, satisfy?",
            options: [
                "$w < -1/3$",
                "$w = 1$",
                "$w > 0$",
                "$w = -1$ exactly"
            ],
            correctAnswer: 0,
            explanation: "For the universe's expansion to accelerate, the strong energy condition must be violated, which translates to an equation of state parameter $w < -1/3$. The cosmological constant is a specific non-dynamic case where $w = -1$."
        },
        {
            question: "The Alcubierre metric allows for effective superluminal travel by expanding space behind a ship and contracting it in front. What is the primary physical obstacle to creating an Alcubierre warp drive as dictated by General Relativity?",
            options: [
                "It requires a macroscopic distribution of matter with negative energy density (violating the weak and null energy conditions).",
                "It requires an infinite amount of positive invariant mass.",
                "The ship would be instantly crushed by intense Hawking radiation from the warp bubble.",
                "It requires the ship to be a perfect sphere of constant density."
            ],
            correctAnswer: 0,
            explanation: "The stress-energy tensor required to generate the Alcubierre spacetime geometry requires regions of negative energy density, which violates all classical energy conditions."
        },
        {
            question: "In a flat universe dominated entirely by a cosmological constant (dark energy with $w = -1$), how does the scale factor $a(t)$ evolve with time $t$ according to the Friedmann equations?",
            options: [
                "$a(t) \\propto e^{Ht}$ (exponential expansion)",
                "$a(t) \\propto t^{2/3}$",
                "$a(t) \\propto t^{1/2}$",
                "$a(t) \\propto \\ln(t)$"
            ],
            correctAnswer: 0,
            explanation: "In a dark-energy dominated, spatially flat universe, the Hubble parameter $H$ becomes constant. Solving the Friedmann equation yields an exponential growth of the scale factor $a(t) \\propto e^{Ht}$, resulting in de Sitter spacetime."
        },
        {
            question: "If dark energy takes the form of 'Phantom Energy', characterized by an equation of state parameter $w < -1$, what is the ultimate theorized fate of the universe?",
            options: [
                "The Big Rip, where the expansion rate becomes infinite in finite time, tearing apart galaxies, stars, and eventually atoms.",
                "The Big Crunch, where the universe recollapses into a singularity.",
                "The Big Chill, an asymptotic approach to absolute zero with constant acceleration.",
                "A perfectly static, eternal universe."
            ],
            correctAnswer: 0,
            explanation: "Phantom energy ($w < -1$) causes the energy density of the universe to increase as it expands, leading to a singularity where the scale factor and expansion rate diverge to infinity in a finite time. This catastrophic event rips apart all gravitationally bound and electromagnetically bound structures."
        }
    ];

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // 1. Ripple the Dark Energy Sail
        const posAttribute = meshes.sailPosAttribute;
        const originalZ = meshes.sailOriginalZ;
        for (let i = 0; i < posAttribute.count; i++) {
            const x = posAttribute.getX(i);
            const y = posAttribute.getY(i); 
            const zOffset = Math.sin(x * 0.01 + t * 2) * 20 + 
                            Math.cos(y * 0.015 - t * 1.5) * 25 + 
                            Math.sin(Math.sqrt(x*x + y*y) * 0.03 - t * 4) * 10;
            posAttribute.setZ(i, originalZ[i] + zOffset);
        }
        posAttribute.needsUpdate = true;
        meshes.sailMesh.rotation.z = t * 0.02;

        // 2. Rotate Habitation Torus
        meshes.habTorusGroup.rotation.z = t * 0.4;

        // 3. Spacetime Wake Pulse
        meshes.wakeMesh.scale.x = 1 + Math.sin(t * 3) * 0.3;
        meshes.wakeMesh.scale.z = 1 + Math.cos(t * 2.5) * 0.3;
        meshes.wakeMesh.position.y = -400 + Math.sin(t * 8) * 10;

        // 4. Warp Rings sequence pulse
        meshes.distortionRings.children.forEach((ring, index) => {
            ring.scale.setScalar(1 + Math.sin(t * 5 + index) * 0.2);
            ring.rotation.y = t * (0.3 + index * 0.05);
        });

        // 5. Coolant Lines fluid pulse
        meshes.coolantGroup.children.forEach((child, index) => {
            if (index % 2 === 1) { 
                child.scale.setScalar(1 + Math.sin(t * 12 + index) * 0.3);
            }
        });

        // 6. Relativistic Particle streaming
        const pPositions = meshes.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < 20000; i++) {
            pPositions[i*3+1] -= speed * 150; 
            if (pPositions[i*3+1] < -1000) {
                pPositions[i*3+1] = 1000;
                pPositions[i*3] = (Math.random() - 0.5) * 2000;
                pPositions[i*3+2] = (Math.random() - 0.5) * 2000;
            }
        }
        meshes.particleSystem.geometry.attributes.position.needsUpdate = true;

        // 7. Hadron Collider Rings
        meshes.accelGroup.children.forEach((ring, i) => {
            ring.rotation.z = t * (1.5 + i * 0.5);
        });

        // 8. Dark Energy Scoops
        meshes.scoopsGroup.children.forEach((scoop, i) => {
            scoop.rotation.x = Math.PI / 10 + Math.sin(t * 3 + i) * 0.15;
            scoop.children[0].scale.setScalar(1 + Math.sin(t * 10 + i) * 0.4);
        });

        // 9. Deployable Radiators
        meshes.radiators.forEach((rad, i) => {
            const targetRotation = Math.max(0, Math.sin(t * 0.5));
            rad.rotation.z = targetRotation * (Math.PI / 3);
        });
        
        // 10. Wheels and Hydraulics (Traction Tires)
        meshes.wheels.forEach(wheel => {
            wheel.rotation.x -= speed * 0.5; // Rolling forward
        });
        meshes.pistons.forEach((piston, i) => {
            piston.position.y = -10 + Math.sin(t * 4 + i) * 5; // Pumping action
        });
        meshes.hydraulicLines.forEach((line, i) => {
            line.scale.y = 1 + Math.sin(t * 4 + i) * 0.05; // Lines expanding/contracting slightly
        });
        
        // 11. Cabin Controls
        meshes.steeringWheel.rotation.z = Math.sin(t * 1.5) * (Math.PI / 4);
        meshes.joystickL.rotation.x = Math.cos(t * 2) * 0.3;
        meshes.joystickR.rotation.x = Math.sin(t * 2.2) * 0.3;
        meshes.joystickL.rotation.z = Math.sin(t * 1.8) * 0.2;
        meshes.joystickR.rotation.z = Math.cos(t * 2.5) * 0.2;
    }

    return {
        group,
        parts,
        description: "A God-Tier Dark Energy Sail spaceship. It harnesses the expansion of the universe itself, riding the cosmological constant by coupling directly to vacuum energy fluctuations. Features a massively detailed central spindle, Alcubierre warp rings, hadron collider loops, and a rippling translucent reality-bending metamaterial sail spanning thousands of kilometers. Complete with an industrial operator cabin and multiversal spacetime traction tires with extreme treads and pumping hydraulic booms.",
        quizQuestions,
        animate,
        meshes
    };
}
