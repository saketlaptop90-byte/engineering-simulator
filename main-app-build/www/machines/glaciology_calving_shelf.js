import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Setup Custom Advanced Materials
    const iceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xcceeff,
        transmission: 0.9,
        opacity: 0.95,
        metalness: 0.1,
        roughness: 0.2,
        ior: 1.33,
        thickness: 15.0,
        specularIntensity: 1.0,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const deepIceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x003366,
        transmission: 0.6,
        opacity: 0.98,
        metalness: 0.2,
        roughness: 0.5,
        clearcoat: 0.2,
        side: THREE.DoubleSide
    });

    const oceanMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x001144,
        transmission: 0.95,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide,
        transparent: true
    });

    const foamMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1.0,
        transparent: true,
        opacity: 0.6
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xcc0000,
        emissiveIntensity: 2.0
    });

    // 2. Generate Massive Ocean Surface
    const oceanGeo = new THREE.PlaneGeometry(250, 250, 128, 128);
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = 0;
    
    // Perturb ocean vertices initially for hyper-realistic start state
    const pos = oceanGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const zDist = Math.sqrt(x*x + y*y);
        pos.setZ(i, Math.sin(zDist * 0.4) * 0.6);
    }
    oceanGeo.computeVertexNormals();
    group.add(oceanMesh);
    meshes.ocean = oceanMesh;

    parts.push({
        name: "ocean_surface_base",
        description: "Dynamic thermodynamic ocean surface responding to glacial calving events with complex wave propagation mathematics.",
        material: "oceanMaterial",
        function: "Simulates fluid dynamics, wave displacement, and structural buoyancy.",
        assemblyOrder: 1,
        connections: ["underwater_ice_profile", "water_displacement_rings"],
        failureEffect: "Tsunami wave generation and hydrodynamic desync in simulation.",
        cascadeFailures: ["underwater_sonar_buoy", "calving_block_1"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 3. Generate Main Ice Shelf (Complex Extruded Shape)
    const shelfShape = new THREE.Shape();
    shelfShape.moveTo(-50, -30);
    // Complex cliff edge using mathematical interference
    for(let i=0; i<=100; i+=2) {
        const x = -50 + i;
        const y = Math.sin(i*0.3)*4 + Math.cos(i*0.8)*2.5 + Math.sin(i*0.1)*5 + 8;
        shelfShape.lineTo(x, y);
    }
    shelfShape.lineTo(50, -30);
    shelfShape.lineTo(-50, -30);

    const extrudeSettings = {
        depth: 35,
        steps: 15,
        bevelEnabled: true,
        bevelSegments: 6,
        bevelSize: 1.5,
        bevelThickness: 1.5
    };
    
    const shelfGeo = new THREE.ExtrudeGeometry(shelfShape, extrudeSettings);
    // Micro-perturbations for hyper-realism on cliff face
    const sPos = shelfGeo.attributes.position;
    for (let i = 0; i < sPos.count; i++) {
        const vx = sPos.getX(i);
        const vy = sPos.getY(i);
        const vz = sPos.getZ(i);
        sPos.setX(i, vx + Math.sin(vy*0.9)*0.7);
        sPos.setY(i, vy + Math.cos(vz*0.7)*0.7);
        sPos.setZ(i, vz + Math.sin(vx*0.8)*0.7);
    }
    shelfGeo.computeVertexNormals();

    const shelfMesh = new THREE.Mesh(shelfGeo, iceMaterial);
    shelfMesh.position.set(0, 5, -20);
    group.add(shelfMesh);
    meshes.mainShelf = shelfMesh;

    parts.push({
        name: "main_ice_shelf",
        description: "Massive primary glacier body exhibiting a sheer, structurally compromised cliff face and multi-stress micro-fractures.",
        material: "iceMaterial",
        function: "Supports advanced monitoring stations and acts as the primary calving source.",
        assemblyOrder: 2,
        connections: ["underwater_ice_profile", "fracture_zone_alpha"],
        failureEffect: "Catastrophic structural collapse resulting in massive tidal surges.",
        cascadeFailures: ["monitoring_station_hub", "hydraulic_drill_rig", "solar_panel_array"],
        originalPosition: { x: 0, y: 5, z: -20 },
        explodedPosition: { x: 0, y: 40, z: -40 }
    });

    // 4. Underwater Ice Profile
    const underGeo = new THREE.ExtrudeGeometry(shelfShape, { depth: 50, steps: 10, bevelEnabled: false });
    const uPos = underGeo.attributes.position;
    for (let i = 0; i < uPos.count; i++) {
        let vx = uPos.getX(i);
        let vy = uPos.getY(i);
        let vz = uPos.getZ(i);
        // Taper outwards at bottom for stability simulation
        const depthRatio = Math.abs(vz) / 50;
        vx *= (1 + depthRatio * 0.8);
        vy *= (1 + depthRatio * 0.8);
        uPos.setX(i, vx + Math.sin(vy*0.5)*2.5);
        uPos.setY(i, vy + Math.cos(vx*0.5)*2.5);
    }
    underGeo.computeVertexNormals();
    const underMesh = new THREE.Mesh(underGeo, deepIceMaterial);
    underMesh.position.set(0, -45, -20);
    group.add(underMesh);
    meshes.underwaterIce = underMesh;

    parts.push({
        name: "underwater_ice_profile",
        description: "Expansive submerged glacial mass providing buoyancy and multi-axis stability via dense pack ice.",
        material: "deepIceMaterial",
        function: "Counterbalances the above-water shelf mass, absorbing kinetic shock.",
        assemblyOrder: 3,
        connections: ["main_ice_shelf", "underwater_sonar_buoy"],
        failureEffect: "Capsizing of the entire ice shelf structure due to buoyancy loss.",
        cascadeFailures: ["all_surface_equipment"],
        originalPosition: { x: 0, y: -45, z: -20 },
        explodedPosition: { x: 0, y: -80, z: -20 }
    });

    // 5. Calving Blocks (Falling Ice Dynamics)
    meshes.calvingBlocks = [];
    for(let i=0; i<4; i++) {
        const blockGeo = new THREE.IcosahedronGeometry(Math.random()*3 + 4, 4);
        const bPos = blockGeo.attributes.position;
        for(let j=0; j<bPos.count; j++) {
            bPos.setXYZ(j, 
                bPos.getX(j) * (1 + Math.random()*0.4),
                bPos.getY(j) * (1 + Math.random()*0.6),
                bPos.getZ(j) * (1 + Math.random()*0.4)
            );
        }
        blockGeo.computeVertexNormals();
        const blockMesh = new THREE.Mesh(blockGeo, iceMaterial);
        
        // Initial positions precariously near the cliff face
        const startX = -30 + i*20;
        const startY = 15 + Math.random()*10;
        const startZ = 8 + Math.random()*3;
        blockMesh.position.set(startX, startY, startZ);
        blockMesh.rotation.set(Math.random(), Math.random(), Math.random());
        
        group.add(blockMesh);
        meshes.calvingBlocks.push({
            mesh: blockMesh,
            phase: Math.random() * Math.PI * 2,
            baseY: startY,
            falling: false,
            vy: 0
        });

        parts.push({
            name: `calving_block_${i+1}`,
            description: `Unstable multi-ton serac unit ${i+1} on the verge of detachment.`,
            material: "iceMaterial",
            function: "Demonstrates physical calving mechanics, gravity equations, and water displacement effects.",
            assemblyOrder: 4 + i,
            connections: ["main_ice_shelf"],
            failureEffect: "Premature detachment and avalanche.",
            cascadeFailures: [`water_displacement_ring_${i+1}`],
            originalPosition: { x: startX, y: startY, z: startZ },
            explodedPosition: { x: startX * 1.5, y: startY + 20, z: startZ + 30 }
        });
    }

    // 6. Water Displacement Rings
    meshes.displacementRings = [];
    for(let i=0; i<4; i++) {
        const ringGeo = new THREE.TorusGeometry(3, 0.8, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, foamMaterial);
        ringMesh.rotation.x = Math.PI/2;
        ringMesh.position.set(-30 + i*20, 0.2, 8);
        ringMesh.scale.set(0.1, 0.1, 0.1);
        ringMesh.visible = false;
        group.add(ringMesh);
        meshes.displacementRings.push({
            mesh: ringMesh,
            active: false,
            scale: 0.1,
            opacity: 1.0
        });

        parts.push({
            name: `water_displacement_ring_${i+1}`,
            description: `Hydrodynamic foam expansion ring ${i+1} calculating fluid kinetic transfer.`,
            material: "foamMaterial",
            function: "Visualizes the kinetic energy transfer from falling ice mass to the ocean.",
            assemblyOrder: 8 + i,
            connections: ["ocean_surface_base"],
            failureEffect: "Simulation engine particle desync.",
            cascadeFailures: [],
            originalPosition: { x: -30 + i*20, y: 0.2, z: 8 },
            explodedPosition: { x: -30 + i*20, y: 10, z: 25 }
        });
    }

    // 7. Monitoring Station Hub
    const hubGroup = new THREE.Group();
    const hubBaseGeo = new THREE.CylinderGeometry(5, 6, 3, 64);
    const hubBase = new THREE.Mesh(hubBaseGeo, darkSteel);
    hubGroup.add(hubBase);
    
    const hubDomeGeo = new THREE.SphereGeometry(4.5, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
    const hubDome = new THREE.Mesh(hubDomeGeo, tinted);
    hubDome.position.y = 1.5;
    hubGroup.add(hubDome);

    const hubRingGeo = new THREE.TorusGeometry(5.2, 0.3, 32, 64);
    const hubRing = new THREE.Mesh(hubRingGeo, neonBlue);
    hubRing.rotation.x = Math.PI/2;
    hubRing.position.y = 1.5;
    hubGroup.add(hubRing);
    meshes.hubRing = hubRing;

    // Advanced hydraulic legs
    for(let i=0; i<6; i++){
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.1, 6, 16), steel);
        leg.position.set(Math.cos(i*Math.PI/3)*5.5, -1, Math.sin(i*Math.PI/3)*5.5);
        leg.rotation.x = -Math.PI/8 * Math.sin(i*Math.PI/3);
        leg.rotation.z = Math.PI/8 * Math.cos(i*Math.PI/3);
        hubGroup.add(leg);
    }

    hubGroup.position.set(0, 35, -10);
    group.add(hubGroup);

    parts.push({
        name: "monitoring_station_hub",
        description: "Central command geodesic dome with multi-spectral environmental shielding and hydraulic leveling legs.",
        material: "tinted, darkSteel, steel, neonBlue",
        function: "Coordinates sensor telemetry, drone sub-routines, and structural integrity analysis.",
        assemblyOrder: 12,
        connections: ["main_ice_shelf", "seismic_sensor_array"],
        failureEffect: "Loss of all telemetry and autonomous control systems.",
        cascadeFailures: ["radar_dish_rotator", "hydraulic_drill_rig", "survey_drone_swarm"],
        originalPosition: { x: 0, y: 35, z: -10 },
        explodedPosition: { x: 0, y: 60, z: -10 }
    });

    // 8. Radar Dish Rotator
    const radarGroup = new THREE.Group();
    const radarMastGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 32);
    const radarMast = new THREE.Mesh(radarMastGeo, aluminum);
    radarMast.position.y = 4;
    radarGroup.add(radarMast);

    const dishPivot = new THREE.Group();
    dishPivot.position.y = 8;
    const dishGeo = new THREE.SphereGeometry(4, 64, 32, 0, Math.PI*2, 0, Math.PI/2.5);
    const dish = new THREE.Mesh(dishGeo, chrome);
    dish.rotation.x = -Math.PI/2;
    dishPivot.add(dish);

    const receiverGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    const receiver = new THREE.Mesh(receiverGeo, copper);
    receiver.position.set(0, 2.5, 0);
    receiver.rotation.x = Math.PI/2;
    dishPivot.add(receiver);
    
    // Sub-antennae
    const subAnt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 8), darkSteel);
    subAnt1.position.set(2, 2, 0);
    dishPivot.add(subAnt1);

    radarGroup.add(dishPivot);
    radarGroup.position.set(-12, 33, -15);
    group.add(radarGroup);
    meshes.radarDish = dishPivot;

    parts.push({
        name: "radar_dish_rotator",
        description: "High-gain parabolic antenna with synthetic aperture capabilities and multi-band receivers.",
        material: "chrome, aluminum, copper",
        function: "Tracks atmospheric changes and transmits real-time glacial mass shift data.",
        assemblyOrder: 13,
        connections: ["monitoring_station_hub"],
        failureEffect: "Data uplink severed.",
        cascadeFailures: ["data_transmission_laser"],
        originalPosition: { x: -12, y: 33, z: -15 },
        explodedPosition: { x: -25, y: 55, z: -25 }
    });

    // 9. Hydraulic Drill Rig
    const drillGroup = new THREE.Group();
    const dBase = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 6), steel);
    drillGroup.add(dBase);

    const dTower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 18, 32), darkSteel);
    dTower.position.set(0, 9, -1.5);
    drillGroup.add(dTower);

    const drillShaftGroup = new THREE.Group();
    const dShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 16, 32), chrome);
    dShaft.position.y = 8;
    drillShaftGroup.add(dShaft);
    
    const dBit = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 32), copper);
    dBit.position.y = 0;
    dBit.rotation.x = Math.PI;
    drillShaftGroup.add(dBit);
    
    drillGroup.add(drillShaftGroup);
    meshes.drillShaft = drillShaftGroup;

    // Complex Support Hydraulics
    const piston1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 32), aluminum);
    piston1.position.set(-2, 6, 1);
    piston1.rotation.x = -Math.PI/6;
    drillGroup.add(piston1);
    
    const piston2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 32), aluminum);
    piston2.position.set(2, 6, 1);
    piston2.rotation.x = -Math.PI/6;
    drillGroup.add(piston2);

    drillGroup.position.set(15, 30, -12);
    group.add(drillGroup);

    parts.push({
        name: "hydraulic_drill_rig",
        description: "Heavy-duty deep ice core sampling rig equipped with hyper-torque titanium-copper alloy bits.",
        material: "steel, darkSteel, chrome, copper, aluminum",
        function: "Extracts ancient ice core samples for high-precision isotopic and atmospheric analysis.",
        assemblyOrder: 14,
        connections: ["main_ice_shelf", "ice_core_storage_facility"],
        failureEffect: "Drill binds catastrophically in the ice, overheating and causing micro-fractures.",
        cascadeFailures: ["fracture_zone_alpha"],
        originalPosition: { x: 15, y: 30, z: -12 },
        explodedPosition: { x: 35, y: 50, z: -12 }
    });

    // 10. Data Transmission Laser
    const laserBeamGeo = new THREE.CylinderGeometry(0.15, 0.15, 80, 16);
    const laserBeam = new THREE.Mesh(laserBeamGeo, neonRed);
    laserBeam.position.set(0, 60, -10);
    laserBeam.rotation.x = Math.PI/4;
    group.add(laserBeam);
    meshes.laser = laserBeam;

    parts.push({
        name: "data_transmission_laser",
        description: "Red-shifted high-intensity optical laser uplink to orbital geostationary satellites.",
        material: "neonRed (emissive)",
        function: "Maintains uninterrupted high-bandwidth connection with low-earth orbit relays.",
        assemblyOrder: 15,
        connections: ["radar_dish_rotator", "monitoring_station_hub"],
        failureEffect: "Signal loss due to atmospheric interference.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 60, z: -10 },
        explodedPosition: { x: 0, y: 90, z: 15 }
    });

    // 11. Seismic Sensor Array
    const seismicGroup = new THREE.Group();
    for(let i=0; i<6; i++){
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 16), darkSteel);
        spike.position.set(Math.cos(i*Math.PI/3)*4, 1.5, Math.sin(i*Math.PI/3)*4);
        spike.rotation.x = Math.PI;
        
        const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(spike.position.x, 1.5, spike.position.z),
            new THREE.Vector3(spike.position.x*0.5, 2, spike.position.z*0.5),
            new THREE.Vector3(0, 1.5, 0)
        ]), 16, 0.08, 16, false), rubber);
        
        seismicGroup.add(spike);
        seismicGroup.add(wire);
    }
    const centerNode = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), aluminum);
    centerNode.position.y = 1.5;
    seismicGroup.add(centerNode);
    seismicGroup.position.set(-20, 28, -5);
    group.add(seismicGroup);
    meshes.seismicCenter = centerNode;

    parts.push({
        name: "seismic_sensor_array",
        description: "Hex-geophone array detecting deep micro-fractures in the glacial bed rock interface.",
        material: "darkSteel, rubber, aluminum",
        function: "Predicts massive calving events via advanced acoustic emission analysis.",
        assemblyOrder: 16,
        connections: ["main_ice_shelf", "monitoring_station_hub"],
        failureEffect: "Inability to predict sudden glacial detachment.",
        cascadeFailures: ["calving_block_1", "calving_block_2", "calving_block_3", "calving_block_4"],
        originalPosition: { x: -20, y: 28, z: -5 },
        explodedPosition: { x: -35, y: 40, z: -5 }
    });

    // 12. Underwater Sonar Buoy
    const sonarGroup = new THREE.Group();
    const sBuoy = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 5, 32, 32), plastic);
    sonarGroup.add(sBuoy);
    
    const sRing = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.3, 32, 64), neonBlue);
    sRing.rotation.x = Math.PI/2;
    sonarGroup.add(sRing);
    meshes.sonarRing = sRing;

    const sCable = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 40, 16), rubber);
    sCable.position.y = 22.5;
    sonarGroup.add(sCable);

    sonarGroup.position.set(25, -20, 15);
    group.add(sonarGroup);
    meshes.sonarBuoy = sonarGroup;

    parts.push({
        name: "underwater_sonar_buoy",
        description: "Deep-ocean acoustic mapper and thermal sensor array.",
        material: "plastic, neonBlue, rubber",
        function: "Monitors sub-surface ice profile melt rates and thermal halocline shifts.",
        assemblyOrder: 17,
        connections: ["underwater_ice_profile", "ocean_surface_base"],
        failureEffect: "Loss of thermal halocline mapping leading to inaccurate melt projections.",
        cascadeFailures: [],
        originalPosition: { x: 25, y: -20, z: 15 },
        explodedPosition: { x: 40, y: -10, z: 35 }
    });

    // 13. Fracture Zone Alpha (Visualized as glowing faults)
    const fractureCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-30, 25, 0),
        new THREE.Vector3(-15, 20, 3),
        new THREE.Vector3(-5, 15, 1),
        new THREE.Vector3(5, 12, 5),
        new THREE.Vector3(20, 10, 4)
    ]);
    const fractureGeo = new THREE.TubeGeometry(fractureCurve, 64, 0.4, 16, false);
    const fracture = new THREE.Mesh(fractureGeo, neonBlue);
    group.add(fracture);
    meshes.fracture = fracture;

    parts.push({
        name: "fracture_zone_alpha",
        description: "Primary deep-structural fault line propagating through the ice shelf matrix.",
        material: "neonBlue (emissive)",
        function: "Visualizes the critical structural stress points prior to a massive calving event.",
        assemblyOrder: 18,
        connections: ["main_ice_shelf"],
        failureEffect: "Immediate multi-block calving.",
        cascadeFailures: ["calving_block_1", "calving_block_2", "calving_block_3", "calving_block_4"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });

    // 14. High-Voltage Power Conduit
    const conduitGeo = new THREE.TorusGeometry(12, 0.6, 32, 128, Math.PI);
    const conduit = new THREE.Mesh(conduitGeo, copper);
    conduit.rotation.x = Math.PI/2;
    conduit.position.set(0, 34, -12);
    group.add(conduit);

    parts.push({
        name: "high_voltage_power_conduit",
        description: "Supercooled superconducting copper energy transfer array.",
        material: "copper",
        function: "Distributes megawatt energy from the solar farm to the drill and command hub.",
        assemblyOrder: 19,
        connections: ["monitoring_station_hub", "hydraulic_drill_rig"],
        failureEffect: "Complete power loss to all active high-drain machinery.",
        cascadeFailures: ["radar_dish_rotator", "underwater_sonar_buoy", "data_transmission_laser"],
        originalPosition: { x: 0, y: 34, z: -12 },
        explodedPosition: { x: 0, y: 55, z: -25 }
    });

    // 15. Solar Panel Array
    const solarGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4), glass);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 4.4), aluminum);
        panel.position.set(-25 + i*8, 38, -25);
        panel.rotation.x = Math.PI/6;
        frame.position.set(-25 + i*8, 38, -25);
        frame.rotation.x = Math.PI/6;
        
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5), darkSteel);
        stand.position.set(-25 + i*8, 35.5, -25);
        
        solarGroup.add(panel);
        solarGroup.add(frame);
        solarGroup.add(stand);
    }
    group.add(solarGroup);

    parts.push({
        name: "solar_panel_array",
        description: "Photovoltaic cells optimized for high albedo reflection capture and extreme cold efficiency.",
        material: "glass, aluminum, darkSteel",
        function: "Provides clean, renewable power to the entire glaciology research station.",
        assemblyOrder: 20,
        connections: ["high_voltage_power_conduit", "main_ice_shelf"],
        failureEffect: "Station switches to limited emergency battery reserves.",
        cascadeFailures: ["high_voltage_power_conduit"],
        originalPosition: { x: -10, y: 38, z: -25 },
        explodedPosition: { x: -25, y: 65, z: -40 }
    });

    // 16. Ice Core Storage Facility
    const storageGroup = new THREE.Group();
    for(let i=0; i<6; i++){
        for(let j=0; j<4; j++){
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 16), glass);
            tube.position.set(i*1.5, j*1.5, 0);
            tube.rotation.x = Math.PI/2;
            
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4.8, 16), iceMaterial);
            core.position.set(i*1.5, j*1.5, 0);
            core.rotation.x = Math.PI/2;
            
            storageGroup.add(tube);
            storageGroup.add(core);
        }
    }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(9, 6, 6), steel);
    frame.position.set(3.75, 2.25, 0);
    frame.material.wireframe = true;
    storageGroup.add(frame);
    
    storageGroup.position.set(-35, 30, -18);
    group.add(storageGroup);

    parts.push({
        name: "ice_core_storage_facility",
        description: "Cryogenic containment unit for cataloging ancient ice samples.",
        material: "glass, iceMaterial, steel",
        function: "Preserves the delicate isotopic integrity of deep core samples until extraction.",
        assemblyOrder: 21,
        connections: ["hydraulic_drill_rig", "main_ice_shelf"],
        failureEffect: "Samples melt, losing thousands of years of irreplaceable climate data.",
        cascadeFailures: [],
        originalPosition: { x: -35, y: 30, z: -18 },
        explodedPosition: { x: -55, y: 45, z: -30 }
    });

    // 17. Glaciology Drone Pad
    const padGroup = new THREE.Group();
    const padGeo = new THREE.CylinderGeometry(4, 4, 0.8, 64);
    const pad = new THREE.Mesh(padGeo, steel);
    padGroup.add(pad);
    
    const hLogo = new THREE.Mesh(new THREE.RingGeometry(1.5, 2, 64), neonRed);
    hLogo.rotation.x = -Math.PI/2;
    hLogo.position.y = 0.42;
    padGroup.add(hLogo);

    padGroup.position.set(28, 30, -15);
    group.add(padGroup);
    meshes.dronePad = padGroup;

    parts.push({
        name: "glaciology_drone_pad",
        description: "Automated VTOL drone launch, recovery, and rapid charging system.",
        material: "steel, neonRed",
        function: "Deploys aerial survey drones to map newly formed crevasses.",
        assemblyOrder: 22,
        connections: ["main_ice_shelf"],
        failureEffect: "Loss of aerial photogrammetry data.",
        cascadeFailures: ["survey_drone_swarm"],
        originalPosition: { x: 28, y: 30, z: -15 },
        explodedPosition: { x: 45, y: 50, z: -30 }
    });

    // 18. Survey Drone Swarm
    meshes.drones = [];
    for(let i=0; i<4; i++) {
        const drone = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), plastic);
        
        const rotor1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16), darkSteel);
        rotor1.position.set(0.7, 0.2, 0.7);
        const rotor2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16), darkSteel);
        rotor2.position.set(-0.7, 0.2, 0.7);
        const rotor3 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16), darkSteel);
        rotor3.position.set(0.7, 0.2, -0.7);
        const rotor4 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16), darkSteel);
        rotor4.position.set(-0.7, 0.2, -0.7);
        
        const cam = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glass);
        cam.position.set(0, -0.2, 0.5);
        
        drone.add(body, rotor1, rotor2, rotor3, rotor4, cam);
        
        const baseX = 20 + i*6;
        const baseY = 40 + i*3;
        const baseZ = -5 + i*4;
        
        drone.position.set(baseX, baseY, baseZ);
        group.add(drone);
        
        meshes.drones.push({
            mesh: drone,
            rotors: [rotor1, rotor2, rotor3, rotor4],
            offset: i * 2.5,
            baseX: baseX,
            baseY: baseY,
            baseZ: baseZ
        });
    }

    parts.push({
        name: "survey_drone_swarm",
        description: "Autonomous quadcopters equipped with LIDAR, thermal imaging, and high-res stereoscopic cameras.",
        material: "plastic, darkSteel, glass",
        function: "Scans the ice surface for micro-fissures and dynamically maps the calving face.",
        assemblyOrder: 23,
        connections: ["glaciology_drone_pad", "monitoring_station_hub"],
        failureEffect: "Loss of high-resolution surface mapping.",
        cascadeFailures: [],
        originalPosition: { x: 20, y: 40, z: -5 },
        explodedPosition: { x: 50, y: 80, z: 10 }
    });

    const description = "A massive, ultra high-tech glaciology research station situated on a fracturing calving ice shelf. Features hyper-realistic water displacement physics, advanced underwater sonar arrays, hydraulic deep-core drills, an autonomous drone swarm, and dynamic ice block calving events integrated into an advanced telemetry network.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Seismic Sensor Array on the ice shelf?",
            options: [
                "To detect micro-fractures and predict calving events via acoustic emissions",
                "To drill deep ice cores for isotopic analysis",
                "To melt the ice for water extraction",
                "To track satellite orbits via red-shifted lasers"
            ],
            correctAnswer: 0
        },
        {
            question: "How does the Underwater Sonar Buoy assist in the glaciology simulation?",
            options: [
                "It maps the thermal halocline and sub-surface ice profile melt rates",
                "It generates artificial tidal waves",
                "It cools down the ocean water to prevent melting",
                "It acts as an autonomous submarine docking station"
            ],
            correctAnswer: 0
        },
        {
            question: "What visual indicator reveals structural stress points prior to a massive calving event?",
            options: [
                "The Glowing Fracture Zone Alpha emitting deep structural light",
                "The Radar Dish Rotator spinning three times faster",
                "The Drone Pad emitting warning smoke",
                "The Solar Panels flipping upside down automatically"
            ],
            correctAnswer: 0
        },
        {
            question: "What material system powers the High-Voltage Power Conduit connecting the high-drain machinery?",
            options: [
                "Supercooled superconducting copper energy transfer array",
                "Basic uninsulated aluminum wiring",
                "Kinetic springs and tension cables",
                "Fiber optic glass tubing"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the consequence of the Underwater Ice Profile suffering a catastrophic buoyancy failure?",
            options: [
                "Capsizing of the entire ice shelf structure",
                "The hydraulic drill spins faster to compensate",
                "The ocean freezes instantly around the station",
                "The data transmission laser shifts from red to green"
            ],
            correctAnswer: 0
        }
    ];

    let timeAcc = 0;
    
    function animate(time, speed, activeMeshes) {
        timeAcc += speed * 0.05;

        // 1. Hyper-realistic Ocean Waves
        if(meshes.ocean) {
            const pos = meshes.ocean.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const zDist = Math.sqrt(x*x + y*y);
                const wave1 = Math.sin(x * 0.15 + timeAcc * 1.8) * 0.6;
                const wave2 = Math.cos(y * 0.15 + timeAcc * 1.3) * 0.6;
                const wave3 = Math.sin(zDist * 0.08 - timeAcc * 2.5) * 0.5;
                pos.setZ(i, wave1 + wave2 + wave3);
            }
            meshes.ocean.geometry.attributes.position.needsUpdate = true;
            meshes.ocean.geometry.computeVertexNormals();
        }

        // 2. Hub Ring Pulsing
        if(meshes.hubRing) {
            meshes.hubRing.scale.set(
                1 + Math.sin(timeAcc * 4) * 0.06,
                1 + Math.sin(timeAcc * 4) * 0.06,
                1 + Math.sin(timeAcc * 4) * 0.06
            );
            meshes.hubRing.material.emissiveIntensity = 1.5 + Math.sin(timeAcc * 8) * 0.6;
        }

        // 3. Radar Dish Scanning
        if(meshes.radarDish) {
            meshes.radarDish.parent.rotation.y = timeAcc;
            meshes.radarDish.rotation.x = -Math.PI/2 + Math.sin(timeAcc * 0.6) * 0.3;
        }

        // 4. Hydraulic Drill Operating
        if(meshes.drillShaft) {
            meshes.drillShaft.rotation.y += speed * 0.6;
            meshes.drillShaft.position.y = 5 + Math.sin(timeAcc * 1.5) * 3;
        }

        // 5. Data Transmission Laser pulsing
        if(meshes.laser) {
            meshes.laser.material.opacity = 0.6 + Math.sin(timeAcc * 20) * 0.4;
            meshes.laser.material.emissiveIntensity = 2.0 + Math.random() * 1.0;
        }

        // 6. Seismic Center processing
        if(meshes.seismicCenter) {
            const pulse = Math.floor(timeAcc * 12) % 3 === 0;
            meshes.seismicCenter.material.emissive = new THREE.Color(pulse ? 0xff3300 : 0x000000);
        }

        // 7. Sonar Buoy Bobbing & Ring expanding
        if(meshes.sonarBuoy) {
            meshes.sonarBuoy.position.y = -20 + Math.sin(timeAcc * 1.2) * 2;
            if(meshes.sonarRing) {
                meshes.sonarRing.scale.x = 1 + (timeAcc % 2.5);
                meshes.sonarRing.scale.y = 1 + (timeAcc % 2.5);
                meshes.sonarRing.material.opacity = 1 - (timeAcc % 2.5)/2.5;
            }
        }

        // 8. Fracture Zone Pulsing
        if(meshes.fracture) {
            meshes.fracture.material.emissiveIntensity = 1.2 + Math.sin(timeAcc * 3) * 0.8;
            meshes.fracture.material.opacity = 0.6 + Math.sin(timeAcc * 1.5) * 0.4;
        }

        // 9. Calving Events (Physics simulation)
        if(meshes.calvingBlocks && meshes.displacementRings) {
            meshes.calvingBlocks.forEach((blockObj, i) => {
                const trigger = Math.sin(timeAcc * 0.4 + blockObj.phase);
                if(trigger > 0.96 && !blockObj.falling) {
                    blockObj.falling = true;
                    blockObj.vy = 0;
                }

                if(blockObj.falling) {
                    blockObj.vy -= 0.08 * speed; // Accelerated Gravity
                    blockObj.mesh.position.y += blockObj.vy;
                    blockObj.mesh.rotation.x += 0.03 * speed;
                    blockObj.mesh.rotation.z += 0.04 * speed;

                    // Hit water surface (splash down)
                    if(blockObj.mesh.position.y < 0) {
                        blockObj.falling = false;
                        blockObj.mesh.position.y = blockObj.baseY; // Reset for continuous simulation
                        blockObj.mesh.rotation.set(Math.random(), Math.random(), Math.random());
                        
                        // Trigger massive displacement ring
                        const ringObj = meshes.displacementRings[i];
                        ringObj.mesh.visible = true;
                        ringObj.scale = 0.1;
                        ringObj.opacity = 1.0;
                    }
                }
            });

            // Animate displacement rings
            meshes.displacementRings.forEach(ringObj => {
                if(ringObj.mesh.visible) {
                    ringObj.scale += 0.15 * speed;
                    ringObj.opacity -= 0.015 * speed;
                    
                    ringObj.mesh.scale.set(ringObj.scale, ringObj.scale, ringObj.scale);
                    ringObj.mesh.material.opacity = ringObj.opacity;

                    if(ringObj.opacity <= 0) {
                        ringObj.mesh.visible = false;
                    }
                }
            });
        }

        // 10. Drone Swarm Patrol
        if(meshes.drones) {
            meshes.drones.forEach(d => {
                d.mesh.position.y = d.baseY + Math.sin(timeAcc * 1.5 + d.offset) * 2;
                d.mesh.position.x = d.baseX + Math.cos(timeAcc * 0.8 + d.offset) * 15;
                d.mesh.position.z = d.baseZ + Math.sin(timeAcc * 0.8 + d.offset) * 10;
                
                // Tilt in direction of movement
                d.mesh.rotation.y = -timeAcc * 0.8 - d.offset;
                d.mesh.rotation.z = Math.cos(timeAcc * 1.5 + d.offset) * 0.15;
                d.mesh.rotation.x = Math.sin(timeAcc * 1.5 + d.offset) * 0.15;
                
                // Rotors spinning rapidly
                d.rotors.forEach(r => {
                    r.rotation.y += speed * 3.0;
                });
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createCalvingShelf() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
