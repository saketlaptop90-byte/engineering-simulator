import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const animatedObjects = {};

    const glowingYellow = new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffaa00, emissiveIntensity: 2.5, roughness: 0.2, metalness: 0.8 });
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x88ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.8 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff0000, emissiveIntensity: 1.5 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x44ff44, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const glowingWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });
    const quartzGlass = new THREE.MeshPhysicalMaterial({ color: 0xe0ffff, transparent: true, opacity: 0.5, transmission: 0.9, roughness: 0.05, ior: 1.5, thickness: 1.0 });
    
    function addPart(name, mesh, meta) {
        mesh.userData = { ...meta, originalPosition: { ...meta.originalPosition } };
        mesh.position.set(meta.originalPosition.x, meta.originalPosition.y, meta.originalPosition.z);
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name: name,
            description: meta.description,
            material: meta.material,
            function: meta.function,
            assemblyOrder: meta.assemblyOrder,
            connections: meta.connections,
            failureEffect: meta.failureEffect,
            cascadeFailures: meta.cascadeFailures,
            originalPosition: meta.originalPosition,
            explodedPosition: meta.explodedPosition
        });
    }

    // 1. Titanium Pressure Hull
    const hullGroup = new THREE.Group();
    const hullGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const mainHullMesh = new THREE.Mesh(hullGeo, darkSteel);
    hullGroup.add(mainHullMesh);
    
    // Add external structural ribbing
    for (let i = 0; i < 12; i++) {
        const ribGeo = new THREE.TorusGeometry(3.55, 0.1, 16, 100);
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.rotation.y = (Math.PI / 6) * i;
        hullGroup.add(rib);
    }
    for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        const radius = Math.sqrt(3.5*3.5 - i*i);
        const hRibGeo = new THREE.TorusGeometry(radius + 0.05, 0.08, 16, 100);
        const hRib = new THREE.Mesh(hRibGeo, steel);
        hRib.rotation.x = Math.PI / 2;
        hRib.position.y = i;
        hullGroup.add(hRib);
    }

    addPart('Titanium Pressure Hull', hullGroup, {
        description: 'Forged titanium alloy sphere with heavy external ribbing for extreme pressure resistance.',
        material: 'Titanium-Aluminium-Vanadium Alloy (Grade 5)',
        function: 'Protects life support and electronics from the crushing depths of the abyssal zone.',
        assemblyOrder: 1,
        connections: ['Observation Windows', 'Top Hatch', 'Landing Skids', 'Propulsion Modules'],
        failureEffect: 'Instantaneous catastrophic implosion.',
        cascadeFailures: ['Crew Fatality', 'Total Mission Loss'],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0}
    });

    // 2-4. Observation Windows
    const windowConfigs = [
        { name: 'Front Observation Window', pos: {x: 0, y: 0, z: 3.45}, rot: {x: Math.PI/2, y: 0, z: 0}, exp: {x: 0, y: 0, z: 6} },
        { name: 'Port Observation Window', pos: {x: -3.45, y: 0, z: 0}, rot: {x: 0, y: 0, z: Math.PI/2}, exp: {x: -6, y: 0, z: 0} },
        { name: 'Starboard Observation Window', pos: {x: 3.45, y: 0, z: 0}, rot: {x: 0, y: 0, z: -Math.PI/2}, exp: {x: 6, y: 0, z: 0} }
    ];

    windowConfigs.forEach((wc, i) => {
        const winGroup = new THREE.Group();
        const frameGeo = new THREE.CylinderGeometry(1.0, 1.2, 0.5, 32);
        const frame = new THREE.Mesh(frameGeo, steel);
        
        // Window bolts
        for (let b = 0; b < 16; b++) {
            const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.55, 8);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            const angle = (Math.PI * 2 / 16) * b;
            bolt.position.set(Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1);
            frame.add(bolt);
        }

        const glassGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 32);
        const glass = new THREE.Mesh(glassGeo, quartzGlass);
        
        winGroup.add(frame);
        winGroup.add(glass);
        winGroup.rotation.set(wc.rot.x, wc.rot.y, wc.rot.z);

        addPart(wc.name, winGroup, {
            description: 'Ultra-thick fused quartz observation viewport with reinforced steel flange.',
            material: 'Fused Quartz and High-Tensile Steel',
            function: 'Provides critical visibility for navigation and scientific observation.',
            assemblyOrder: 2 + i,
            connections: ['Titanium Pressure Hull'],
            failureEffect: 'Water ingress at hypersonic velocities.',
            cascadeFailures: ['Hull Implosion', 'Instant System Short Circuit'],
            originalPosition: wc.pos,
            explodedPosition: wc.exp
        });
    });

    // 5. Top Entry Hatch & Locking Mechanism
    const hatchGroup = new THREE.Group();
    const hatchBaseGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.6, 32);
    const hatchBase = new THREE.Mesh(hatchBaseGeo, steel);
    hatchGroup.add(hatchBase);
    
    const hatchCapGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI*2, 0, Math.PI/4);
    const hatchCap = new THREE.Mesh(hatchCapGeo, darkSteel);
    hatchCap.position.y = 0.3;
    hatchGroup.add(hatchCap);
    
    const hatchWheelGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
    const hatchWheel = new THREE.Mesh(hatchWheelGeo, chrome);
    hatchWheel.rotation.x = Math.PI / 2;
    hatchWheel.position.y = 0.8;
    hatchGroup.add(hatchWheel);
    
    for(let j=0; j<8; j++) {
        const spokeGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8);
        const spoke = new THREE.Mesh(spokeGeo, chrome);
        spoke.rotation.z = Math.PI/2;
        spoke.rotation.y = (Math.PI/4) * j;
        spoke.position.y = 0.8;
        hatchGroup.add(spoke);
    }
    animatedObjects.hatchWheel = hatchWheel;

    addPart('Top Entry Hatch Assembly', hatchGroup, {
        description: 'Multi-stage mechanical locking entry hatch with heavy redundant seals.',
        material: 'Titanium and Chrome-Moly Steel',
        function: 'Enables ingress/egress while maintaining absolute pressure integrity when sealed.',
        assemblyOrder: 5,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Catastrophic flooding of crew compartment.',
        cascadeFailures: ['Loss of Life Support', 'Loss of Buoyancy'],
        originalPosition: {x: 0, y: 3.4, z: 0},
        explodedPosition: {x: 0, y: 7, z: 0}
    });

    // 6. Reinforced Landing Skids
    const skidGroup = new THREE.Group();
    const createSkid = (xPos) => {
        const s = new THREE.Group();
        const tubeGeo = new THREE.CylinderGeometry(0.25, 0.25, 9, 16);
        const tube = new THREE.Mesh(tubeGeo, aluminum);
        tube.rotation.x = Math.PI / 2;
        s.add(tube);
        
        const frontCurveGeo = new THREE.TorusGeometry(0.5, 0.25, 16, 16, Math.PI);
        const frontCurve = new THREE.Mesh(frontCurveGeo, aluminum);
        frontCurve.rotation.y = Math.PI / 2;
        frontCurve.position.set(0, 0.5, 4.5);
        s.add(frontCurve);
        
        const backCurve = frontCurve.clone();
        backCurve.position.set(0, 0.5, -4.5);
        s.add(backCurve);
        
        s.position.x = xPos;
        return s;
    };
    skidGroup.add(createSkid(-2.5));
    skidGroup.add(createSkid(2.5));

    // Crossbars
    for(let z = -3; z <= 3; z += 2) {
        const crossGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
        const cross = new THREE.Mesh(crossGeo, aluminum);
        cross.rotation.z = Math.PI/2;
        cross.position.set(0, 0, z);
        skidGroup.add(cross);
    }
    // Vertical supports
    const supportPositions = [
        {x: -2.5, y: 1.5, z: 2, rotZ: Math.PI/8}, {x: -2.5, y: 1.5, z: -2, rotZ: Math.PI/8},
        {x: 2.5, y: 1.5, z: 2, rotZ: -Math.PI/8}, {x: 2.5, y: 1.5, z: -2, rotZ: -Math.PI/8}
    ];
    supportPositions.forEach(sp => {
        const suppGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 16);
        const supp = new THREE.Mesh(suppGeo, aluminum);
        supp.position.set(sp.x, sp.y, sp.z);
        supp.rotation.z = sp.rotZ;
        skidGroup.add(supp);
    });

    addPart('Reinforced Landing Skids', skidGroup, {
        description: 'Heavy-duty impact-absorbing aluminum landing frame.',
        material: 'Marine-grade Aluminum Alloy 5083',
        function: 'Supports the Bathysphere on the seabed and absorbs landing shock.',
        assemblyOrder: 6,
        connections: ['Titanium Pressure Hull', 'Drop Ballasts'],
        failureEffect: 'Inability to safely rest on the ocean floor; hull damage.',
        cascadeFailures: ['Structural Integrity Compromise'],
        originalPosition: {x: 0, y: -4.0, z: 0},
        explodedPosition: {x: 0, y: -9, z: 0}
    });

    // 7. Heavy Lifting Cable Assembly
    const cableGroup = new THREE.Group();
    const anchorGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 32);
    const anchor = new THREE.Mesh(anchorGeo, darkSteel);
    cableGroup.add(anchor);
    
    const eyeGeo = new THREE.TorusGeometry(0.5, 0.15, 16, 32);
    const eye = new THREE.Mesh(eyeGeo, darkSteel);
    eye.position.y = 0.8;
    cableGroup.add(eye);
    
    const cableGeo = new THREE.CylinderGeometry(0.15, 0.15, 15, 16);
    const cable = new THREE.Mesh(cableGeo, darkSteel);
    cable.position.y = 8.5;
    cableGroup.add(cable);

    addPart('Heavy Lifting Cable Assembly', cableGroup, {
        description: 'High-tension braided steel umbilical and mounting anchor.',
        material: 'Braided Steel Wire Rope',
        function: 'Provides mechanical lowering/raising and data telemetry to the surface vessel.',
        assemblyOrder: 7,
        connections: ['Top Entry Hatch Assembly'],
        failureEffect: 'Bathysphere stranded on the ocean floor.',
        cascadeFailures: ['Loss of Telemetry', 'Dependence on Emergency Buoyancy'],
        originalPosition: {x: 0, y: 4.2, z: -1.5},
        explodedPosition: {x: 0, y: 15, z: -3}
    });

    // 8-10. Thrusters
    const createThruster = () => {
        const tg = new THREE.Group();
        const ductGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32, 1, true);
        const duct = new THREE.Mesh(ductGeo, steel);
        tg.add(duct);
        
        const motorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
        const motor = new THREE.Mesh(motorGeo, darkSteel);
        tg.add(motor);
        
        // Propeller
        const propGroup = new THREE.Group();
        const hubGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const hub = new THREE.Mesh(hubGeo, chrome);
        propGroup.add(hub);
        
        for(let k=0; k<5; k++) {
            const bladeGeo = new THREE.BoxGeometry(0.7, 0.02, 0.2);
            const blade = new THREE.Mesh(bladeGeo, darkSteel);
            blade.position.x = 0.4;
            blade.rotation.x = Math.PI / 6;
            
            const pivot = new THREE.Group();
            pivot.rotation.y = (Math.PI*2/5) * k;
            pivot.add(blade);
            propGroup.add(pivot);
        }
        tg.add(propGroup);
        return { tg, propGroup };
    };

    const tPort = createThruster();
    tPort.tg.rotation.x = Math.PI/2;
    animatedObjects.propPort = tPort.propGroup;
    addPart('Port Vertical Thruster', tPort.tg, {
        description: 'Ducted electric propulsion unit for vertical maneuverability.',
        material: 'Stainless Steel and Carbon Fiber',
        function: 'Provides precise depth control and pitch adjustments.',
        assemblyOrder: 8,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Loss of port-side vertical control.',
        cascadeFailures: ['Reduced Maneuverability'],
        originalPosition: {x: -4.5, y: 0, z: 2},
        explodedPosition: {x: -8, y: 0, z: 4}
    });

    const tStar = createThruster();
    tStar.tg.rotation.x = Math.PI/2;
    animatedObjects.propStar = tStar.propGroup;
    addPart('Starboard Vertical Thruster', tStar.tg, {
        description: 'Ducted electric propulsion unit for vertical maneuverability.',
        material: 'Stainless Steel and Carbon Fiber',
        function: 'Provides precise depth control and pitch adjustments.',
        assemblyOrder: 9,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Loss of starboard-side vertical control.',
        cascadeFailures: ['Reduced Maneuverability'],
        originalPosition: {x: 4.5, y: 0, z: 2},
        explodedPosition: {x: 8, y: 0, z: 4}
    });

    const tAft = createThruster();
    animatedObjects.propAft = tAft.propGroup;
    addPart('Aft Horizontal Propulsion Unit', tAft.tg, {
        description: 'Primary forward propulsion vectoring thruster.',
        material: 'Stainless Steel and Carbon Fiber',
        function: 'Drives the bathysphere forward and allows for yaw control.',
        assemblyOrder: 10,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Inability to move forward or steer effectively.',
        cascadeFailures: ['Stranding in ocean currents'],
        originalPosition: {x: 0, y: 0, z: -4.5},
        explodedPosition: {x: 0, y: 0, z: -8}
    });

    // 11-13. Floodlight Arrays
    const createFloodlightArray = () => {
        const fg = new THREE.Group();
        const mountGeo = new THREE.BoxGeometry(2, 0.4, 0.4);
        const mount = new THREE.Mesh(mountGeo, steel);
        fg.add(mount);
        
        for(let l=-0.75; l<=0.75; l+=0.75) {
            const lightHousingGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.4, 16);
            const lightHousing = new THREE.Mesh(lightHousingGeo, darkSteel);
            lightHousing.rotation.x = Math.PI/2;
            lightHousing.position.set(l, 0, 0.3);
            
            const bulbGeo = new THREE.SphereGeometry(0.25, 16, 16, 0, Math.PI*2, 0, Math.PI/2);
            const bulb = new THREE.Mesh(bulbGeo, glowingWhite);
            bulb.rotation.x = -Math.PI/2;
            bulb.position.y = 0.2;
            lightHousing.add(bulb);
            
            fg.add(lightHousing);
        }
        return fg;
    };

    const lightPort = createFloodlightArray();
    lightPort.rotation.y = Math.PI/2;
    addPart('Port Floodlight Array', lightPort, {
        description: 'High-intensity LED matrix array for deep sea illumination.',
        material: 'Titanium Housings, Sapphire Glass Lenses',
        function: 'Illuminates the pitch-black abyssal environment for cameras and pilot.',
        assemblyOrder: 11,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Loss of port visibility.',
        cascadeFailures: ['Navigation Hazard'],
        originalPosition: {x: -3.8, y: 2, z: 2},
        explodedPosition: {x: -7, y: 4, z: 4}
    });

    const lightStar = createFloodlightArray();
    lightStar.rotation.y = -Math.PI/2;
    addPart('Starboard Floodlight Array', lightStar, {
        description: 'High-intensity LED matrix array for deep sea illumination.',
        material: 'Titanium Housings, Sapphire Glass Lenses',
        function: 'Illuminates the pitch-black abyssal environment for cameras and pilot.',
        assemblyOrder: 12,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Loss of starboard visibility.',
        cascadeFailures: ['Navigation Hazard'],
        originalPosition: {x: 3.8, y: 2, z: 2},
        explodedPosition: {x: 7, y: 4, z: 4}
    });

    const lightFront = createFloodlightArray();
    addPart('Front Floodlight Array', lightFront, {
        description: 'Primary forward illumination high-intensity LED matrix.',
        material: 'Titanium Housings, Sapphire Glass Lenses',
        function: 'Provides crucial forward visibility and lights up the main work area.',
        assemblyOrder: 13,
        connections: ['Titanium Pressure Hull', 'Battery Bank'],
        failureEffect: 'Severe impairment of forward visibility.',
        cascadeFailures: ['Inability to perform manipulator tasks'],
        originalPosition: {x: 0, y: 2.5, z: 3.6},
        explodedPosition: {x: 0, y: 5, z: 7}
    });

    // 14-15. External Battery Banks
    const createBatteryBank = () => {
        const bg = new THREE.Group();
        const caseGeo = new THREE.BoxGeometry(1.5, 3, 1);
        const caseMesh = new THREE.Mesh(caseGeo, darkSteel);
        bg.add(caseMesh);
        
        // Heat sinks
        for(let h=-1.3; h<=1.3; h+=0.2) {
            const finGeo = new THREE.BoxGeometry(1.6, 0.05, 1.1);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = h;
            bg.add(fin);
        }
        
        // Power cables (simplified tube approximation)
        const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const pCable = new THREE.Mesh(cableGeo, rubber);
        pCable.position.set(0, 1.6, -0.2);
        pCable.rotation.x = Math.PI/4;
        bg.add(pCable);
        
        return bg;
    };

    const batPort = createBatteryBank();
    addPart('External Battery Bank (Port)', batPort, {
        description: 'High-density pressure-compensated Lithium-Ion polymer battery bank.',
        material: 'Titanium Casing, Lithium-Polymer Cells, Oil-Compensated',
        function: 'Supplies immense electrical power for thrusters, lights, and life support.',
        assemblyOrder: 14,
        connections: ['Titanium Pressure Hull', 'Power Distribution Bus'],
        failureEffect: '50% loss of total vehicle power.',
        cascadeFailures: ['Reduced Thruster Output', 'Reduced Lighting'],
        originalPosition: {x: -2.5, y: -1, z: -2.5},
        explodedPosition: {x: -5, y: -2, z: -5}
    });

    const batStar = createBatteryBank();
    addPart('External Battery Bank (Starboard)', batStar, {
        description: 'High-density pressure-compensated Lithium-Ion polymer battery bank.',
        material: 'Titanium Casing, Lithium-Polymer Cells, Oil-Compensated',
        function: 'Supplies immense electrical power for thrusters, lights, and life support.',
        assemblyOrder: 15,
        connections: ['Titanium Pressure Hull', 'Power Distribution Bus'],
        failureEffect: '50% loss of total vehicle power.',
        cascadeFailures: ['Reduced Thruster Output', 'Reduced Lighting'],
        originalPosition: {x: 2.5, y: -1, z: -2.5},
        explodedPosition: {x: 5, y: -2, z: -5}
    });

    // 16. Life Support Scrubber Unit
    const scrubberGroup = new THREE.Group();
    const scrubBodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
    const scrubBody = new THREE.Mesh(scrubBodyGeo, steel);
    scrubberGroup.add(scrubBody);
    
    const scrubCapGeo = new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const scrubCap = new THREE.Mesh(scrubCapGeo, chrome);
    scrubCap.position.y = 1;
    scrubberGroup.add(scrubCap);
    
    const scrubBase = scrubCap.clone();
    scrubBase.rotation.x = Math.PI;
    scrubBase.position.y = -1;
    scrubberGroup.add(scrubBase);
    
    const hoseGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
    const hose = new THREE.Mesh(hoseGeo, rubber);
    hose.position.set(0, 1.2, 0.5);
    hose.rotation.x = Math.PI/4;
    scrubberGroup.add(hose);

    addPart('CO2 Scrubber & Life Support Unit', scrubberGroup, {
        description: 'Lithium hydroxide chemical scrubber and high-pressure O2 delivery system.',
        material: 'Stainless Steel, Lithium Hydroxide, Teflon Hoses',
        function: 'Removes toxic CO2 from the cabin atmosphere and replenishes Oxygen.',
        assemblyOrder: 16,
        connections: ['Titanium Pressure Hull', 'Interior Cabin Air Vents'],
        failureEffect: 'Build up of fatal CO2 levels in the cabin.',
        cascadeFailures: ['Crew Asphyxiation', 'Total Mission Failure'],
        originalPosition: {x: 0, y: -1, z: -3.6},
        explodedPosition: {x: 0, y: -2, z: -7}
    });

    // 17. Emergency Drop Ballast
    const ballastGroup = new THREE.Group();
    for(let b=-1; b<=1; b+=2) {
        const weightGeo = new THREE.BoxGeometry(1.5, 0.8, 1.5);
        const weight = new THREE.Mesh(weightGeo, darkSteel);
        weight.position.x = b * 2;
        
        const magLockGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
        const magLock = new THREE.Mesh(magLockGeo, steel);
        magLock.position.set(b * 2, 0.65, 0);
        
        ballastGroup.add(weight);
        ballastGroup.add(magLock);
    }

    addPart('Emergency Drop Ballast Weights', ballastGroup, {
        description: 'Solid iron blocks held in place by electromagnets.',
        material: 'Solid Iron and Electromagnet Coils',
        function: 'Provides negative buoyancy for descent. Dropped to achieve rapid positive buoyancy in emergencies.',
        assemblyOrder: 17,
        connections: ['Reinforced Landing Skids', 'Power Distribution Bus'],
        failureEffect: 'Inability to shed weight, potential stranding on ocean floor.',
        cascadeFailures: ['Loss of Vehicle', 'Crew Fatality'],
        originalPosition: {x: 0, y: -3.5, z: 0},
        explodedPosition: {x: 0, y: -12, z: 0}
    });

    // 18-23. Hydraulic Manipulator Arms
    const createManipulatorArm = (isLeft) => {
        const armGroup = new THREE.Group();
        
        // Base
        const baseGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.rotation.x = Math.PI/2;
        armGroup.add(base);
        
        // Shoulder Joint
        const shoulderGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const shoulder = new THREE.Mesh(shoulderGeo, steel);
        shoulder.position.z = 0.4;
        armGroup.add(shoulder);
        
        // Boom
        const boomGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 16);
        const boom = new THREE.Mesh(boomGeo, chrome);
        boom.position.set(0, 1.25, 0.4);
        armGroup.add(boom);
        
        // Elbow Joint
        const elbowGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const elbow = new THREE.Mesh(elbowGeo, steel);
        elbow.position.set(0, 2.6, 0.4);
        armGroup.add(elbow);
        
        // Forearm
        const forearmGeo = new THREE.CylinderGeometry(0.1, 0.15, 2.0, 16);
        const forearm = new THREE.Mesh(forearmGeo, chrome);
        forearm.position.set(0, 3.7, 0.4);
        armGroup.add(forearm);
        
        // Claw / End Effector
        const clawGroup = new THREE.Group();
        clawGroup.position.set(0, 4.8, 0.4);
        
        const wristGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
        const wrist = new THREE.Mesh(wristGeo, darkSteel);
        clawGroup.add(wrist);
        
        const pincerGeo = new THREE.BoxGeometry(0.1, 0.6, 0.2);
        const pincer1 = new THREE.Mesh(pincerGeo, steel);
        pincer1.position.set(-0.15, 0.4, 0);
        pincer1.rotation.z = Math.PI/8;
        clawGroup.add(pincer1);
        
        const pincer2 = new THREE.Mesh(pincerGeo, steel);
        pincer2.position.set(0.15, 0.4, 0);
        pincer2.rotation.z = -Math.PI/8;
        clawGroup.add(pincer2);
        
        armGroup.add(clawGroup);
        
        return { armGroup, shoulder, boom, elbow, forearm, clawGroup, pincer1, pincer2 };
    };

    const leftArm = createManipulatorArm(true);
    leftArm.armGroup.rotation.x = Math.PI/2;
    leftArm.armGroup.rotation.z = -Math.PI/4;
    animatedObjects.leftArmBoom = leftArm.boom;
    animatedObjects.leftArmForearm = leftArm.forearm;
    animatedObjects.leftClaw1 = leftArm.pincer1;
    animatedObjects.leftClaw2 = leftArm.pincer2;

    addPart('Left Hydraulic Manipulator Arm', leftArm.armGroup, {
        description: 'Titanium heavy-duty hydraulic 6-DOF manipulator arm with precision end-effector claw.',
        material: 'Titanium, Stainless Steel, Hydraulic Fluid',
        function: 'Allows interaction with the outside environment, sample collection, and debris clearing.',
        assemblyOrder: 18,
        connections: ['Titanium Pressure Hull', 'Hydraulic Pump System'],
        failureEffect: 'Loss of port-side manipulation capability.',
        cascadeFailures: ['Inability to perform complex external tasks'],
        originalPosition: {x: -2.5, y: -1.5, z: 3},
        explodedPosition: {x: -6, y: -3, z: 6}
    });

    const rightArm = createManipulatorArm(false);
    rightArm.armGroup.rotation.x = Math.PI/2;
    rightArm.armGroup.rotation.z = Math.PI/4;
    animatedObjects.rightArmBoom = rightArm.boom;
    animatedObjects.rightArmForearm = rightArm.forearm;
    animatedObjects.rightClaw1 = rightArm.pincer1;
    animatedObjects.rightClaw2 = rightArm.pincer2;

    addPart('Right Hydraulic Manipulator Arm', rightArm.armGroup, {
        description: 'Titanium heavy-duty hydraulic 6-DOF manipulator arm with precision end-effector claw.',
        material: 'Titanium, Stainless Steel, Hydraulic Fluid',
        function: 'Allows interaction with the outside environment, sample collection, and debris clearing.',
        assemblyOrder: 19,
        connections: ['Titanium Pressure Hull', 'Hydraulic Pump System'],
        failureEffect: 'Loss of starboard-side manipulation capability.',
        cascadeFailures: ['Inability to perform complex external tasks'],
        originalPosition: {x: 2.5, y: -1.5, z: 3},
        explodedPosition: {x: 6, y: -3, z: 6}
    });

    // 24. Acoustic Sonar Array
    const sonarGroup = new THREE.Group();
    const sonarDomeGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const sonarDome = new THREE.Mesh(sonarDomeGeo, rubber);
    sonarDome.rotation.x = -Math.PI/2;
    sonarGroup.add(sonarDome);
    
    const transducerGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
    const transducer = new THREE.Mesh(transducerGeo, copper);
    transducer.position.y = -0.1;
    sonarGroup.add(transducer);

    addPart('Acoustic Sonar Array', sonarGroup, {
        description: 'Multi-beam synthetic aperture sonar housed in an acoustically transparent rubber dome.',
        material: 'Acoustic Rubber, Copper Transducers, Electronics',
        function: 'Provides high-resolution topographical mapping of the sea floor and object detection.',
        assemblyOrder: 20,
        connections: ['Titanium Pressure Hull', 'Data Telemetry Bus'],
        failureEffect: 'Total blindness beyond visual range in turbid water.',
        cascadeFailures: ['Collision with unseen terrain'],
        originalPosition: {x: 0, y: -3, z: 3.2},
        explodedPosition: {x: 0, y: -6, z: 6}
    });

    // 25. Telemetry & Comm Antenna
    const antennaGroup = new THREE.Group();
    const antBaseGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 16);
    const antBase = new THREE.Mesh(antBaseGeo, darkSteel);
    antennaGroup.add(antBase);
    
    const antMastGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
    const antMast = new THREE.Mesh(antMastGeo, chrome);
    antMast.position.y = 1.7;
    antennaGroup.add(antMast);
    
    const antDishGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI*2, 0, Math.PI/3);
    const antDish = new THREE.Mesh(antDishGeo, steel);
    antDish.rotation.x = Math.PI;
    antDish.position.y = 1.0;
    antennaGroup.add(antDish);
    
    animatedObjects.antennaDish = antDish;

    addPart('Telemetry & Comm Antenna', antennaGroup, {
        description: 'High-frequency acoustic modem and surface RF antenna assembly.',
        material: 'Titanium, Chrome, Ceramic Insulators',
        function: 'Transmits data and voice communications through water via acoustic pulses, and via RF when surfaced.',
        assemblyOrder: 21,
        connections: ['Titanium Pressure Hull', 'Communications Bus'],
        failureEffect: 'Loss of contact with surface support vessel.',
        cascadeFailures: ['Mission Abort', 'Isolation'],
        originalPosition: {x: -2, y: 3.2, z: -1.5},
        explodedPosition: {x: -4, y: 8, z: -3}
    });

    // 26. Interior Pilot Controls
    const interiorGroup = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0, -0.8, -0.5);
    interiorGroup.add(seat);
    
    const joystickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    const joystickL = new THREE.Mesh(joystickGeo, chrome);
    joystickL.position.set(-0.8, -0.2, 0.2);
    joystickL.rotation.x = Math.PI/8;
    interiorGroup.add(joystickL);
    
    const joystickR = new THREE.Mesh(joystickGeo, chrome);
    joystickR.position.set(0.8, -0.2, 0.2);
    joystickR.rotation.x = Math.PI/8;
    interiorGroup.add(joystickR);
    
    const panelGeo = new THREE.PlaneGeometry(2, 1);
    const panel = new THREE.Mesh(panelGeo, glowingBlue);
    panel.position.set(0, 0.2, 1.5);
    panel.rotation.y = Math.PI;
    interiorGroup.add(panel);

    addPart('Interior Pilot Controls & Seat', interiorGroup, {
        description: 'Ergonomic pressure-isolated command chair with dual HOTAS control sticks and holographic MFDs.',
        material: 'Synthetic Leather, Carbon Fiber, Electronics',
        function: 'Allows the pilot to command thrusters, manipulators, and monitor life support.',
        assemblyOrder: 22,
        connections: ['Titanium Pressure Hull', 'Fly-by-wire System'],
        failureEffect: 'Loss of manual control over the Bathysphere.',
        cascadeFailures: ['Dependence on surface remote control or automated emergency ascent'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -4}
    });

    return {
        group,
        parts,
        description: "The 'Abyssal Vanguard' Deep Sea Bathysphere is a hyper-realistic, massively armored submersible designed for extreme-depth ocean exploration. It features a solid titanium spherical pressure hull reinforced by massive ribs, ultra-thick fused quartz observation windows, complex hydraulic manipulator arms, high-intensity LED floodlights, and a robust skid frame. It is engineered to withstand the crushing hydrostatic pressure of the deepest trenches while providing crucial scientific feedback through advanced sonar and telemetry systems.",
        quizQuestions: [
            {
                question: "What is the primary material used in the construction of the Bathysphere's pressure hull to withstand extreme depths?",
                options: ["Aluminum Alloy", "Fused Quartz", "Titanium-Aluminium-Vanadium Alloy (Grade 5)", "Carbon Fiber"],
                answer: "Titanium-Aluminium-Vanadium Alloy (Grade 5)",
                explanation: "Titanium Grade 5 is used for its incredibly high strength-to-weight ratio and ability to resist extreme hydrostatic pressures without catastrophic yielding."
            },
            {
                question: "How does the Bathysphere quickly achieve positive buoyancy in an extreme emergency?",
                options: ["By pumping air into ballast tanks", "By firing explosive bolts to detach the entire skid frame", "By dropping solid iron ballast weights held by electromagnets", "By deploying emergency inflatable balloons"],
                answer: "By dropping solid iron ballast weights held by electromagnets",
                explanation: "At extreme depths, pumping air is impossible against the pressure. Dropping solid weights held by electromagnets (which release if power fails) is the most reliable emergency ascent method."
            },
            {
                question: "What is the function of the Acoustic Sonar Array housed in the rubber dome?",
                options: ["To communicate with whales", "To provide high-resolution topographical mapping beyond visual range in turbid water", "To measure water temperature and salinity", "To generate acoustic shockwaves to clear debris"],
                answer: "To provide high-resolution topographical mapping beyond visual range in turbid water",
                explanation: "Light does not travel far in deep ocean water. Synthetic aperture sonar provides critical imaging and navigation capabilities in pitch-black, turbid conditions."
            },
            {
                question: "Why are the observation windows made of Fused Quartz instead of standard glass or acrylic?",
                options: ["It is cheaper to manufacture", "It provides a better refractive index for cameras", "It possesses massive compressive strength required to resist hypersonic water ingress at extreme pressures", "It is completely immune to bio-fouling"],
                answer: "It possesses massive compressive strength required to resist hypersonic water ingress at extreme pressures",
                explanation: "Standard materials would instantly crack and implode under deep sea pressures. Fused quartz is extremely thick and has immense compressive strength."
            },
            {
                question: "What system is responsible for removing toxic CO2 from the Bathysphere's interior cabin?",
                options: ["The external battery banks", "The heavy lifting cable", "The Lithium Hydroxide Life Support Scrubber Unit", "The Telemetry & Comm Antenna"],
                answer: "The Lithium Hydroxide Life Support Scrubber Unit",
                explanation: "In a sealed pressure vessel, exhaled CO2 builds up quickly and is fatal. The scrubber unit chemically removes this CO2 using lithium hydroxide."
            }
        ],
        animate: function(time, speed, explodedMode) {
            // Thruster propellers spin rapidly
            if (animatedObjects.propPort) animatedObjects.propPort.rotation.z += 0.5 * speed;
            if (animatedObjects.propStar) animatedObjects.propStar.rotation.z -= 0.5 * speed;
            if (animatedObjects.propAft) animatedObjects.propAft.rotation.z += 0.4 * speed;

            // Hatch wheel locking mechanism slow rotation
            if (animatedObjects.hatchWheel && !explodedMode) {
                animatedObjects.hatchWheel.rotation.z = Math.sin(time * 0.5) * 0.5;
            }

            // Antenna dish rotating to scan
            if (animatedObjects.antennaDish) {
                animatedObjects.antennaDish.rotation.y += 0.05 * speed;
            }

            // Complex hydraulic manipulator arm animation
            if (animatedObjects.leftArmBoom && !explodedMode) {
                animatedObjects.leftArmBoom.rotation.x = Math.sin(time * 1.2) * 0.3;
                animatedObjects.leftArmForearm.rotation.x = Math.cos(time * 1.5) * 0.4;
                
                // Claws opening and closing
                const clawAngle = (Math.sin(time * 3) * 0.5 + 0.5) * (Math.PI/6);
                animatedObjects.leftClaw1.rotation.z = Math.PI/8 + clawAngle;
                animatedObjects.leftClaw2.rotation.z = -Math.PI/8 - clawAngle;
            }

            if (animatedObjects.rightArmBoom && !explodedMode) {
                animatedObjects.rightArmBoom.rotation.x = Math.cos(time * 1.1) * 0.3;
                animatedObjects.rightArmForearm.rotation.x = Math.sin(time * 1.4) * 0.4;
                
                const clawAngleR = (Math.cos(time * 2.5) * 0.5 + 0.5) * (Math.PI/6);
                animatedObjects.rightClaw1.rotation.z = Math.PI/8 + clawAngleR;
                animatedObjects.rightClaw2.rotation.z = -Math.PI/8 - clawAngleR;
            }
        }
    };
}

// Auto-generated missing stub
export function createBathysphere() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
