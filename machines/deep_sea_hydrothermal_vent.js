import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animations = [];
    
    // --- CUSTOM & EXTENDED MATERIALS ---
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9, metalness: 0.1 });
    const mineralMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3b, roughness: 0.8, metalness: 0.3 });
    const wormTubeMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.8 });
    const wormPlumeMat = new THREE.MeshStandardMaterial({ color: 0xdd1111, roughness: 0.4 });
    const biolumMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2 });
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff3300, emissiveIntensity: 3 });
    
    // --- TERRAIN (ABYSSAL FOUNDATION) ---
    const terrainGeo = new THREE.CylinderGeometry(60, 75, 15, 128, 32);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        if (y > 0) { // Only distort the top surface
            let h = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 4.0;
            h += Math.sin(x * 0.4 + z * 0.2) * 2.0;
            h += Math.sin(x * 0.05) * 3.0;
            // Add some sharp rocky spikes
            h += Math.pow(Math.sin(x * 0.8) * Math.cos(z * 0.8), 4) * 2.5;
            pos.setY(i, y + h);
        }
    }
    terrainGeo.computeVertexNormals();
    const terrain = new THREE.Mesh(terrainGeo, rockMat);
    terrain.position.y = -7.5;
    group.add(terrain);
    
    parts.push({
        name: "Abyssal Plain Foundation",
        description: "The rugged, mineral-rich basaltic crust forming the seabed floor. Heavily displaced by tectonic activity.",
        material: "Basalt Rock",
        function: "Provides the structural base for the hydrothermal vent and anchors the research platform.",
        assemblyOrder: 1,
        connections: ["vent_chimney", "abyssal_monitoring_ring"],
        failureEffect: "Geological collapse leading to structural failure of the entire vent ecosystem.",
        cascadeFailures: ["chimney_collapse", "sensor_network_destruction"],
        originalPosition: { x: 0, y: -7.5, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // --- MAGMA FRACTURES (GLOWING CRACKS IN TERRAIN) ---
    const magmaGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const crackPoints = [];
        let cx = (Math.random() - 0.5) * 40;
        let cz = (Math.random() - 0.5) * 40;
        for (let j = 0; j < 10; j++) {
            crackPoints.push(new THREE.Vector3(cx, 0, cz));
            cx += (Math.random() - 0.5) * 5;
            cz += (Math.random() - 0.5) * 5;
        }
        const crackCurve = new THREE.CatmullRomCurve3(crackPoints);
        const crackGeo = new THREE.TubeGeometry(crackCurve, 20, 0.5, 5, false);
        const crackMesh = new THREE.Mesh(crackGeo, magmaMat);
        crackMesh.position.y = 0.5; // just above terrain
        magmaGroup.add(crackMesh);
    }
    group.add(magmaGroup);

    // --- BLACK SMOKER CHIMNEY ---
    const chimneyGroup = new THREE.Group();
    // Use LatheGeometry stacked with noise for organic spire
    const spirePoints = [];
    for(let i=0; i<=40; i++) {
        const h = i * 1.2; // up to 48 units tall
        // Exponentional decay for radius + sinusoidal bulges
        const r = 10 * Math.exp(-i * 0.08) + Math.sin(i * 1.5) * 1.5 + Math.random() * 0.8 + 1.0;
        spirePoints.push(new THREE.Vector2(r, h));
    }
    const chimneyGeo = new THREE.LatheGeometry(spirePoints, 64);
    const cPos = chimneyGeo.attributes.position;
    for(let i=0; i<cPos.count; i++) {
        const x = cPos.getX(i);
        const y = cPos.getY(i);
        const z = cPos.getZ(i);
        let d = Math.sin(y * 0.4 + x) * 0.6 + Math.cos(y * 0.7 + z) * 0.6;
        cPos.setX(i, x + x*d*0.15);
        cPos.setZ(i, z + z*d*0.15);
    }
    chimneyGeo.computeVertexNormals();
    const chimney = new THREE.Mesh(chimneyGeo, mineralMat);
    chimneyGroup.add(chimney);
    group.add(chimneyGroup);
    
    parts.push({
        name: "Black Smoker Spire",
        description: "A towering chimney made of iron, copper, and zinc sulfides precipitated from superheated hydrothermal fluids.",
        material: "Polymetallic Sulfides / Anhydrite",
        function: "Channels superheated (400°C), mineral-rich fluid from the earth's crust into the ocean.",
        assemblyOrder: 2,
        connections: ["Abyssal Plain Foundation", "superheated_plume"],
        failureEffect: "Blockage causes massive subterranean pressure buildup and potential explosive lateral eruption.",
        cascadeFailures: ["magma_vent_rupture", "ecosystem_boil", "station_destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // --- TUBE WORMS (Riftia pachyptila) ---
    const wormGroup = new THREE.Group();
    const numWorms = 250;
    
    for (let i = 0; i < numWorms; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.pow(Math.random(), 2) * 15; // cluster closer to center
        const startX = Math.cos(angle) * radius;
        const startZ = Math.sin(angle) * radius;
        
        const curvePoints = [];
        let currX = startX;
        let currY = 0;
        let currZ = startZ;
        const length = 4 + Math.random() * 6;
        const segments = 5;
        
        for (let j = 0; j <= segments; j++) {
            curvePoints.push(new THREE.Vector3(currX, currY, currZ));
            currX += (Math.random() - 0.5) * 1.5;
            currY += length / segments;
            currZ += (Math.random() - 0.5) * 1.5;
            
            // lean towards the heat of the chimney
            currX -= (currX * 0.08);
            currZ -= (currZ * 0.08);
        }
        
        const path = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(path, 16, 0.25 + Math.random()*0.1, 8, false);
        const wormMesh = new THREE.Mesh(tubeGeo, wormTubeMat);
        wormGroup.add(wormMesh);
        
        // Red gill plumes
        const plumeGeo = new THREE.ConeGeometry(0.35, 1.5, 12);
        plumeGeo.translate(0, 0.75, 0); 
        const plumeMesh = new THREE.Mesh(plumeGeo, wormPlumeMat);
        const finalPoint = curvePoints[curvePoints.length - 1];
        plumeMesh.position.copy(finalPoint);
        
        const prevPoint = curvePoints[curvePoints.length - 2];
        const dir = new THREE.Vector3().subVectors(finalPoint, prevPoint).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        plumeMesh.setRotationFromQuaternion(quaternion);
        
        wormGroup.add(plumeMesh);
        
        animations.push({
            type: 'worm_plume',
            mesh: plumeMesh,
            phase: Math.random() * Math.PI * 2,
            baseRot: plumeMesh.rotation.clone()
        });
    }
    group.add(wormGroup);
    
    parts.push({
        name: "Riftia pachyptila Colonies",
        description: "Dense biological clusters of giant tube worms thriving on symbiotic chemosynthetic bacteria in their trophosomes.",
        material: "Chitin Tubing / Hemoglobin Gill Plumes",
        function: "Converts toxic hydrogen sulfide into organic matter, forming the foundational base of the local food web.",
        assemblyOrder: 3,
        connections: ["Abyssal Plain Foundation"],
        failureEffect: "Mass die-off resulting in a cascading starvation event across the vent ecosystem.",
        cascadeFailures: ["predator_starvation", "bacterial_overgrowth"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 25, y: 5, z: 25 }
    });

    // --- HIGH-TECH MONITORING STATION RING ---
    const stationGroup = new THREE.Group();
    
    // Main structural torus
    const ringGeo = new THREE.TorusGeometry(26, 1.8, 32, 12);
    const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 3;
    stationGroup.add(ringMesh);
    
    // Hydraulic anchoring legs
    const numLegs = 8;
    const legsGroup = new THREE.Group();
    for (let i = 0; i < numLegs; i++) {
        const angle = (i / numLegs) * Math.PI * 2;
        const legGroup = new THREE.Group();
        
        // Main cylinder housing
        const housingGeo = new THREE.CylinderGeometry(1.0, 1.2, 10, 24);
        const housingMesh = new THREE.Mesh(housingGeo, steel);
        housingMesh.rotation.x = Math.PI / 3.5;
        housingMesh.position.set(0, 5, 5);
        legGroup.add(housingMesh);
        
        // Inner chrome piston
        const pistonGeo = new THREE.CylinderGeometry(0.6, 0.6, 10, 24);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.rotation.x = Math.PI / 3.5;
        pistonMesh.position.set(0, 2, 9);
        legGroup.add(pistonMesh);
        
        // Massive drilling foot pad
        const footGeo = new THREE.BoxGeometry(4, 1.5, 5);
        const footMesh = new THREE.Mesh(footGeo, darkSteel);
        footMesh.position.set(0, -2.5, 12.5);
        
        // Drilling spikes on foot
        const spikeGeo = new THREE.ConeGeometry(0.4, 1.5, 8);
        const s1 = new THREE.Mesh(spikeGeo, chrome); s1.position.set(1.2, -1, 1.5); s1.rotation.x = Math.PI; footMesh.add(s1);
        const s2 = new THREE.Mesh(spikeGeo, chrome); s2.position.set(-1.2, -1, 1.5); s2.rotation.x = Math.PI; footMesh.add(s2);
        const s3 = new THREE.Mesh(spikeGeo, chrome); s3.position.set(1.2, -1, -1.5); s3.rotation.x = Math.PI; footMesh.add(s3);
        const s4 = new THREE.Mesh(spikeGeo, chrome); s4.position.set(-1.2, -1, -1.5); s4.rotation.x = Math.PI; footMesh.add(s4);
        
        legGroup.add(footMesh);
        
        // Heavy hydraulic hosing (TubeGeometry)
        const hosePath = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 6, 2),
            new THREE.Vector3(2, 4, 6),
            new THREE.Vector3(0, 2, 9)
        );
        const hoseGeo = new THREE.TubeGeometry(hosePath, 16, 0.15, 8, false);
        const hoseMesh = new THREE.Mesh(hoseGeo, rubber);
        legGroup.add(hoseMesh);
        
        legGroup.position.x = Math.cos(angle) * 26;
        legGroup.position.z = Math.sin(angle) * 26;
        legGroup.rotation.y = -angle; 
        
        legsGroup.add(legGroup);
        
        animations.push({
            type: 'hydraulic_leg',
            piston: pistonMesh,
            phase: i * 0.5,
            basePos: pistonMesh.position.clone()
        });
    }
    stationGroup.add(legsGroup);
    
    parts.push({
        name: "Abyssal Monitoring Ring Array",
        description: "A heavily armored, titanium-reinforced hexagonal superstructure equipped with core-drilling hydraulic anchors to maintain stability in extreme deep-ocean currents.",
        material: "Titanium Alloy / Tungsten Carbide / Rubber",
        function: "Provides a localized power grid and sensory hub for deep-sea instrumentation.",
        assemblyOrder: 4,
        connections: ["Hydraulic Anchors", "Thermal Extraction Piping", "Sensor Pods"],
        failureEffect: "Structural shearing. The station would be crushed by pressure or swept into the vent plume.",
        cascadeFailures: ["telemetry_loss", "power_cable_severance", "rov_tether_snap"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // --- THERMAL EXTRACTION PIPING (WRAPPING THE CHIMNEY) ---
    const pipingGroup = new THREE.Group();
    const pipePoints = [];
    let px = 10, py = 0, pz = 10;
    for(let i=0; i<30; i++) {
        pipePoints.push(new THREE.Vector3(px, py, pz));
        const angle = i * 0.4;
        const radius = 8 * Math.exp(-i * 0.08) + 3;
        px = Math.cos(angle) * radius;
        pz = Math.sin(angle) * radius;
        py += 1.5;
        
        // Add extreme 90-degree industrial bends
        if (i % 4 === 0 && i < 25) {
            pipePoints.push(new THREE.Vector3(px + 1.5, py, pz));
            pipePoints.push(new THREE.Vector3(px + 1.5, py + 1.5, pz));
            py += 1.5;
        }
    }
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 200, 0.6, 16, false);
    const pipeMesh = new THREE.Mesh(pipeGeo, copper);
    pipingGroup.add(pipeMesh);
    
    // Add radial cooling fins to the pipe
    for(let i=10; i<25; i+=0.5) {
        const finGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16);
        const finMesh = new THREE.Mesh(finGeo, aluminum);
        const pt = pipeCurve.getPoint(i / 30);
        const ptNext = pipeCurve.getPoint((i+0.01) / 30);
        finMesh.position.copy(pt);
        finMesh.lookAt(ptNext);
        finMesh.rotation.x += Math.PI / 2;
        pipingGroup.add(finMesh);
    }
    group.add(pipingGroup);
    
    parts.push({
        name: "Geothermal Extraction Conduit",
        description: "A highly conductive, copper-lined titanium pipeline spiraling the smoker to siphon thermal energy.",
        material: "Copper / Aluminum Heat Sinks",
        function: "Converts the 400°C ambient heat differential into electrical power for the monitoring station.",
        assemblyOrder: 5,
        connections: ["Abyssal Monitoring Ring Array", "Black Smoker Spire"],
        failureEffect: "Loss of primary power generation; systems switch to backup batteries (24h lifespan).",
        cascadeFailures: ["sensor_blackout", "rov_shutdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 15, z: -30 }
    });

    // --- MULTI-SPECTRAL SENSOR PODS ---
    const sensorGroup = new THREE.Group();
    for (let i = 0; i < numLegs; i++) {
        const angle = (i / numLegs) * Math.PI * 2 + (Math.PI / numLegs);
        const sGroup = new THREE.Group();
        
        const baseGeo = new THREE.BoxGeometry(2.5, 4, 3);
        const baseMesh = new THREE.Mesh(baseGeo, aluminum);
        baseMesh.position.y = 2;
        sGroup.add(baseMesh);
        
        // Large glass optic lens
        const lensGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.6, 24);
        const lensMesh = new THREE.Mesh(lensGeo, tinted);
        lensMesh.rotation.x = Math.PI / 2;
        lensMesh.position.set(0, 3, 1.5);
        sGroup.add(lensMesh);
        
        // Internal glowing data element
        const glowGeo = new THREE.SphereGeometry(0.5, 12, 12);
        const glowMesh = new THREE.Mesh(glowGeo, biolumMat);
        glowMesh.position.set(0, 3, 1.6);
        sGroup.add(glowMesh);
        
        // Antenna array
        const antGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const antMesh = new THREE.Mesh(antGeo, chrome);
        antMesh.position.set(1, 5, 0);
        sGroup.add(antMesh);
        
        sGroup.position.x = Math.cos(angle) * 26;
        sGroup.position.z = Math.sin(angle) * 26;
        sGroup.rotation.y = -angle;
        
        sensorGroup.add(sGroup);
        
        animations.push({
            type: 'sensor_glow',
            mesh: glowMesh,
            phase: i * 1.5
        });
    }
    stationGroup.add(sensorGroup);

    // --- AUTONOMOUS ROV 'NEREUS-VII' ---
    const rovGroup = new THREE.Group();
    rovGroup.position.set(20, 12, 20);
    rovGroup.rotation.y = Math.PI / 3;
    
    // Main Chassis
    const rovBodyGeo = new THREE.BoxGeometry(5, 4, 7);
    const rovBody = new THREE.Mesh(rovBodyGeo, plastic); 
    rovBody.material.color.setHex(0xeebb00); // deep sea yellow
    rovGroup.add(rovBody);
    
    // Syntactic foam buoyancy array (top)
    const foamGeo = new THREE.BoxGeometry(5.2, 1.5, 7.2);
    const foam = new THREE.Mesh(foamGeo, plastic);
    foam.material.color.setHex(0xffffff);
    foam.position.y = 2.75;
    rovGroup.add(foam);
    
    // Complex Thruster Array (using Torus, Cylinder, and custom placement)
    const thrusterGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 24);
    const thrusterShroudGeo = new THREE.TorusGeometry(0.9, 0.15, 12, 32);
    const propGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 12);
    const propMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const thrusterPositions = [
        { x: -3.2, y: 0, z: -2.5, rx: Math.PI/2, ry: 0, rz: 0 }, // Port aft
        { x: 3.2, y: 0, z: -2.5, rx: Math.PI/2, ry: 0, rz: 0 },  // Starboard aft
        { x: 0, y: 0, z: 4.2, rx: 0, ry: Math.PI/2, rz: 0 },     // Lateral bow
        { x: -2, y: 4, z: 1, rx: 0, ry: 0, rz: 0 },              // Vertical port
        { x: 2, y: 4, z: 1, rx: 0, ry: 0, rz: 0 }                // Vertical starboard
    ];
    
    thrusterPositions.forEach((pos) => {
        const tGroup = new THREE.Group();
        const tBody = new THREE.Mesh(thrusterGeo, darkSteel);
        tBody.rotation.set(pos.rx, pos.ry, pos.rz);
        
        const tShroud = new THREE.Mesh(thrusterShroudGeo, plastic);
        tShroud.material.color.setHex(0x000000);
        tShroud.rotation.set(pos.rx, pos.ry, pos.rz);
        if (pos.rx === Math.PI/2) tShroud.rotation.x = 0;
        
        const prop = new THREE.Mesh(propGeo, propMat);
        prop.rotation.set(pos.rx, pos.ry, pos.rz);
        
        tGroup.add(tBody);
        tGroup.add(tShroud);
        tGroup.add(prop);
        tGroup.position.set(pos.x, pos.y, pos.z);
        rovGroup.add(tGroup);
        
        animations.push({
            type: 'propeller',
            mesh: prop,
            axis: pos.rx === Math.PI/2 ? 'z' : (pos.ry === Math.PI/2 ? 'x' : 'y'),
            speed: 15 + Math.random() * 8
        });
    });
    
    // Dual Complex Manipulator Arms
    const createArm = (offsetX) => {
        const armG = new THREE.Group();
        armG.position.set(offsetX, -2, 3.5);
        
        const baseG = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 24);
        const baseM = new THREE.Mesh(baseG, steel);
        baseM.rotation.z = Math.PI / 2;
        armG.add(baseM);
        
        const seg1G = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 24);
        seg1G.translate(0, 1.75, 0);
        const seg1 = new THREE.Mesh(seg1G, darkSteel);
        seg1.rotation.x = Math.PI / 4;
        armG.add(seg1);
        
        const seg2G = new THREE.CylinderGeometry(0.25, 0.25, 3.0, 24);
        seg2G.translate(0, 1.5, 0);
        const seg2 = new THREE.Mesh(seg2G, chrome);
        seg2.position.set(0, 3.5 * Math.sin(Math.PI/4), 3.5 * Math.cos(Math.PI/4));
        seg2.rotation.x = Math.PI / 2;
        armG.add(seg2);
        
        const clawBase = new THREE.BoxGeometry(0.8, 0.5, 0.5);
        const cbMesh = new THREE.Mesh(clawBase, steel);
        cbMesh.position.set(0, 3.0, 0);
        seg2.add(cbMesh);
        
        return { armGroup: armG, seg1, seg2 };
    };
    
    const leftArm = createArm(-1.5);
    const rightArm = createArm(1.5);
    rovGroup.add(leftArm.armGroup);
    rovGroup.add(rightArm.armGroup);
    
    stationGroup.add(rovGroup);
    
    // Dynamic Umbilical Tether (Bezier curve to Ring)
    const tetherPath = new THREE.CubicBezierCurve3(
        rovGroup.position.clone().add(new THREE.Vector3(0, 3, -3.5)),
        new THREE.Vector3(15, 20, 5),
        new THREE.Vector3(10, 5, 25),
        new THREE.Vector3(0, 3, 26)
    );
    const tetherGeo = new THREE.TubeGeometry(tetherPath, 64, 0.2, 12, false);
    const tetherMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.6 });
    const tetherMesh = new THREE.Mesh(tetherGeo, tetherMat);
    stationGroup.add(tetherMesh);
    
    animations.push({
        type: 'rov_hover',
        group: rovGroup,
        basePos: rovGroup.position.clone(),
        baseRot: rovGroup.rotation.clone(),
        lArm: leftArm,
        rArm: rightArm
    });

    parts.push({
        name: "Autonomous ROV 'Nereus-VII'",
        description: "Heavy-duty abyssal vehicle equipped with 4K macro cameras, dual extreme-pressure manipulator arms, and syntactic foam buoyancy. Built to withstand 6000m depths.",
        material: "Syntactic Foam / Titanium / Polycarbonate",
        function: "Conducts precision sampling of toxic tube worms, mineral deposits, and performs maintenance on the monitoring ring.",
        assemblyOrder: 6,
        connections: ["Umbilical Tether", "Abyssal Monitoring Ring Array"],
        failureEffect: "Loss of mobile sampling capability. Vehicle implosion could severely damage surrounding delicate biological structures.",
        cascadeFailures: ["tether_entanglement", "battery_implosion"],
        originalPosition: { x: 20, y: 12, z: 20 },
        explodedPosition: { x: 45, y: 20, z: 45 }
    });

    group.add(stationGroup);

    // --- SUPERHEATED HYDROTHERMAL PLUME (PARTICLE SYSTEM) ---
    // Using InstancedMesh for extreme high performance with massive particle count
    const particleCount = 2500;
    const pGeo = new THREE.SphereGeometry(1.8, 12, 12);
    // Dark, turbulent smoke representing iron sulfide precipitation
    const pMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        transparent: true,
        opacity: 0.7,
        roughness: 1.0,
        depthWrite: false
    });
    
    const smokeInstanced = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    const particleData = [];
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 3;
        const y = 48 + (Math.random() * 40); // spread vertically
        const z = (Math.random() - 0.5) * 3;
        
        dummy.position.set(x, y, z);
        const scale = 0.5 + Math.random() * 2.5;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        smokeInstanced.setMatrixAt(i, dummy.matrix);
        
        particleData.push({
            x: x,
            y: y,
            z: z,
            vx: (Math.random() - 0.5) * 0.15,
            vy: 0.3 + Math.random() * 0.5,
            vz: (Math.random() - 0.5) * 0.15,
            scale: scale,
            life: Math.random() * 120
        });
    }
    
    smokeInstanced.instanceMatrix.needsUpdate = true;
    group.add(smokeInstanced);
    
    animations.push({
        type: 'smoke_plume',
        mesh: smokeInstanced,
        data: particleData,
        dummy: dummy
    });

    parts.push({
        name: "Superheated Hydrothermal Plume",
        description: "A continuous, violent eruption of 400°C fluid saturated with dissolved minerals. It appears black due to the instantaneous precipitation of iron and zinc sulfides upon hitting 2°C seawater.",
        material: "Supercritical Water / Iron Sulfide Particulates",
        function: "Transfers intense geological heat and essential minerals from the Earth's mantle directly into the oceanic ecosystem.",
        assemblyOrder: 7,
        connections: ["Black Smoker Spire"],
        failureEffect: "Cessation of flow signifies vent extinction, causing immediate death of the localized chemosynthetic ecosystem.",
        cascadeFailures: ["temperature_crash", "mass_extinction_event"],
        originalPosition: { x: 0, y: 65, z: 0 },
        explodedPosition: { x: 0, y: 110, z: 0 }
    });

    // --- ANIMATION CONTROLLER ---
    const animate = (time, speed, meshes) => {
        const delta = speed * 0.05;
        const t = time * speed;
        
        animations.forEach(anim => {
            if (anim.type === 'worm_plume') {
                // Biologically accurate waving in the abyssal current
                anim.mesh.rotation.z = anim.baseRot.z + Math.sin(t * 1.5 + anim.phase) * 0.25;
                anim.mesh.rotation.x = anim.baseRot.x + Math.cos(t * 1.2 + anim.phase) * 0.25;
            }
            else if (anim.type === 'hydraulic_leg') {
                // Micro-adjustments of the drilling legs stabilizing the platform
                const ext = Math.sin(t * 0.8 + anim.phase) * 0.4;
                anim.piston.position.y = anim.basePos.y + ext;
            }
            else if (anim.type === 'sensor_glow') {
                // Pulsing bioluminescent mimicry to attract specific deep-sea fauna
                anim.mesh.material.emissiveIntensity = 1.0 + Math.sin(t * 4 + anim.phase) * 1.0;
            }
            else if (anim.type === 'propeller') {
                // Spin ROV thrusters
                if (anim.axis === 'x') anim.mesh.rotation.x += anim.speed * delta;
                if (anim.axis === 'y') anim.mesh.rotation.y += anim.speed * delta;
                if (anim.axis === 'z') anim.mesh.rotation.z += anim.speed * delta;
            }
            else if (anim.type === 'rov_hover') {
                // 6-DOF hovering bobbing for the ROV
                anim.group.position.y = anim.basePos.y + Math.sin(t * 1.2) * 0.6;
                anim.group.position.x = anim.basePos.x + Math.cos(t * 0.8) * 0.3;
                anim.group.rotation.x = anim.baseRot.x + Math.sin(t * 1.5) * 0.08;
                anim.group.rotation.z = anim.baseRot.z + Math.cos(t * 1.7) * 0.08;
                
                // Complex asynchronous manipulator arm movements
                anim.lArm.seg1.rotation.x = Math.PI / 4 + Math.sin(t * 2.5) * 0.3;
                anim.lArm.seg2.rotation.x = Math.PI / 2 + Math.cos(t * 3.1) * 0.4;
                
                anim.rArm.seg1.rotation.x = Math.PI / 4 + Math.cos(t * 2.2) * 0.3;
                anim.rArm.seg2.rotation.x = Math.PI / 2 + Math.sin(t * 2.8) * 0.4;
            }
            else if (anim.type === 'smoke_plume') {
                // Process massive fluid dynamics particle system
                for (let i = 0; i < anim.data.length; i++) {
                    const p = anim.data[i];
                    p.x += p.vx * speed;
                    p.y += p.vy * speed;
                    p.z += p.vz * speed;
                    p.life += speed;
                    
                    // Introduce turbulent lateral ocean current drift
                    p.x += Math.sin(p.y * 0.04 + t) * 0.03 * speed;
                    p.z += Math.cos(p.y * 0.03 + t) * 0.02 * speed;
                    
                    // Thermal expansion as fluid rises
                    p.scale += 0.015 * speed;
                    
                    // Respawn particles that exceed lifespan or height
                    if (p.y > 120 || p.life > 180) {
                        p.y = 47 + Math.random() * 2;
                        p.x = (Math.random() - 0.5) * 2.0;
                        p.z = (Math.random() - 0.5) * 2.0;
                        p.scale = 0.5 + Math.random() * 1.5;
                        p.life = 0;
                    }
                    
                    anim.dummy.position.set(p.x, p.y, p.z);
                    anim.dummy.scale.set(p.scale, p.scale, p.scale);
                    anim.dummy.updateMatrix();
                    anim.mesh.setMatrixAt(i, anim.dummy.matrix);
                }
                anim.mesh.instanceMatrix.needsUpdate = true;
            }
        });
    };

    return {
        group,
        parts,
        description: "An ultra high-tech, hyper-realistic simulation combining a natural Deep-Sea Hydrothermal Vent (Black Smoker) with a highly advanced autonomous abyssal monitoring array. Features massive scale, multi-spectral telemetry, 2500+ particle turbulent fluid dynamics, procedurally generated Riftia pachyptila biological clusters, and a fully articulated 6-DOF ROV.",
        quizQuestions: [
            {
                question: "What is the primary energy source utilized by the giant tube worms (Riftia pachyptila) living adjacent to the hydrothermal vent?",
                options: [
                    "Sunlight via minimal deep-ocean photosynthesis.",
                    "Direct absorption of geothermal heat.",
                    "Chemosynthesis via symbiotic bacteria processing toxic hydrogen sulfide.",
                    "Filtering microscopic organic detritus from the abyssal water column."
                ],
                correctAnswer: 2,
                explanation: "Deep-sea tube worms completely lack a digestive system. They rely exclusively on symbiotic bacteria housed in their trophosome to convert toxic hydrogen sulfide from the vent fluid into organic carbon molecules via chemosynthesis."
            },
            {
                question: "Why does the superheated fluid emitted from a 'black smoker' appear pitch black?",
                options: [
                    "It is heavily mixed with crude oil reserves fractured from the ocean floor.",
                    "It contains massive concentrations of dark extremophile bacteria.",
                    "Dissolved iron and sulfur minerals instantaneously precipitate when 400°C water meets 2°C seawater.",
                    "The water is undergoing combustion due to direct mantle magma contact."
                ],
                correctAnswer: 2,
                explanation: "The superheated hydrothermal fluid is heavily saturated with dissolved minerals. When it violently impacts the near-freezing ambient ocean water, metals like iron and zinc rapidly precipitate out as fine, dark sulfide particles, creating the visual effect of 'black smoke'."
            },
            {
                question: "What critical function does the Geothermal Extraction Conduit serve on the Abyssal Monitoring Ring?",
                options: [
                    "To pump cold water directly into the magma chamber.",
                    "To utilize the extreme heat differential to generate electrical power for the station.",
                    "To extract polymetallic sulfides for commercial mining operations.",
                    "To artificially increase the pressure of the vent plume."
                ],
                correctAnswer: 1,
                explanation: "Operating at extreme depths makes traditional power sources difficult. The conduit utilizes the extreme thermal gradient between the 400°C vent and the 2°C ocean to generate localized, sustainable thermoelectric power for continuous telemetry."
            },
            {
                question: "If the Black Smoker Spire were to become entirely occluded by rapid mineral deposition, what is the most probable catastrophic geological result?",
                options: [
                    "The local ocean temperature would drop to absolute zero.",
                    "Massive subterranean pressure buildup leading to a violent lateral eruption or magma vent rupture.",
                    "The tube worms would immediately detach and float to the surface.",
                    "The monitoring station would collapse under its own weight."
                ],
                correctAnswer: 1,
                explanation: "Hydrothermal vents act as critical release valves for immense thermodynamic pressure in the Earth's crust. If a spire becomes totally blocked, the superheated fluid will eventually violently rupture the crust at a weak point, often causing highly destructive lateral eruptions."
            },
            {
                question: "What specific engineering feature on the ROV 'Nereus-VII' allows it to maintain precise buoyancy and hover capabilities at 6000m depths?",
                options: [
                    "Pressurized titanium air ballast tanks.",
                    "Solid syntactic foam blocks.",
                    "Multi-spectral sensor pods.",
                    "High-precision hydraulic manipulator arms."
                ],
                correctAnswer: 1,
                explanation: "Standard air-filled ballasts would be instantly crushed by the extreme pressure at 6000m (over 600 atmospheres). ROVs utilize syntactic foam—a specialized matrix filled with microscopic glass spheres—to provide robust, incompressible buoyancy."
            }
        ],
        animate
    };
}

// Auto-generated missing stub
export function createDeepSeaHydrothermalVent() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
