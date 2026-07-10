import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Waverider Nose Cone (Shockwave generator)
    const noseGeo = new THREE.ConeGeometry( 0.5, 3, 32 );
    noseGeo.translate( 0, 1.5, 0 );
    noseGeo.rotateX( -Math.PI / 2 );
    const plasmaGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4500,
        emissive: 0xff1100,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const nose = new THREE.Mesh( noseGeo, plasmaGlowMaterial );
    nose.position.set( 0, 0, 4 );
    group.add( nose );
    meshes.nose = nose;
    
    parts.push({
        name: "Ablative Nose Cone",
        description: "Sharply angled nose tip designed to trap and ride the hypersonic shockwave.",
        material: "Ultra-High Temperature Ceramic (UHTC)",
        function: "Generates the primary bow shockwave and deflects initial Mach 10 aerodynamic heating.",
        assemblyOrder: 1,
        connections: ["Leading Edges", "Plasma Shield Emitters"],
        failureEffect: "Instantaneous catastrophic thermal vaporization of the forward section.",
        cascadeFailures: ["Scramjet Inlet Ramp", "Cockpit Array"],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // 2. Titanium Leading Edges
    const edgeGeo = new THREE.BoxGeometry( 4, 0.1, 4 );
    const positions = edgeGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        let z = positions.getZ(i);
        if (z < 0) {
            let x = positions.getX(i);
            positions.setX(i, x * 0.1); // taper towards nose
        }
    }
    edgeGeo.computeVertexNormals();
    
    const edgeGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.2
    });
    const leadingEdges = new THREE.Mesh( edgeGeo, edgeGlowMaterial );
    leadingEdges.position.set( 0, -0.2, 2.5 );
    group.add( leadingEdges );
    meshes.leadingEdges = leadingEdges;

    parts.push({
        name: "Titanium Swept Edges",
        description: "75-degree swept wing leading edges for waverider compression.",
        material: "Titanium-Aluminide Alloy",
        function: "Maintains aerodynamic stability and traps the high-pressure shockwave beneath the hull.",
        assemblyOrder: 2,
        connections: ["Ablative Nose Cone", "Thermal Tiles"],
        failureEffect: "Loss of lift and massive roll instability.",
        cascadeFailures: ["Hull Integrity", "Scramjet Intake"],
        originalPosition: { x: 0, y: -0.2, z: 2.5 },
        explodedPosition: { x: -3, y: -1, z: 5 }
    });

    // 3. Main Hull Body (Carbon-Carbon)
    const hullGeo = new THREE.BoxGeometry( 4.5, 0.8, 6 );
    const hullMat = darkSteel;
    const hull = new THREE.Mesh( hullGeo, hullMat );
    hull.position.set( 0, 0.2, -1 );
    group.add( hull );
    meshes.hull = hull;
    
    parts.push({
        name: "Waverider Main Fuselage",
        description: "The primary airframe housing payload, fuel, and avionics.",
        material: "Reinforced Carbon-Carbon",
        function: "Provides structural rigidity against 20G maneuvers and houses internal subsystems.",
        assemblyOrder: 3,
        connections: ["Leading Edges", "Active Cooling Network", "Dorsal Fins"],
        failureEffect: "Structural fragmentation due to dynamic pressure.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0.2, z: -1 },
        explodedPosition: { x: 0, y: 3, z: -1 }
    });

    // 4. Scramjet Inlet Ramp
    const inletGeo = new THREE.BoxGeometry( 1.5, 0.5, 2 );
    const inlet = new THREE.Mesh( inletGeo, chrome );
    inlet.position.set( 0, -0.45, 0.5 );
    inlet.rotation.x = Math.PI / 16;
    group.add( inlet );
    meshes.inlet = inlet;

    parts.push({
        name: "Scramjet Inlet Ramp",
        description: "Variable geometry ramp under the fuselage.",
        material: "Molybdenum",
        function: "Compresses incoming hypersonic air without slowing it to subsonic speeds.",
        assemblyOrder: 4,
        connections: ["Main Fuselage", "Scramjet Combustion Chamber"],
        failureEffect: "Engine unstart, massive drag increase.",
        cascadeFailures: ["Combustion Chamber", "Airframe Integrity"],
        originalPosition: { x: 0, y: -0.45, z: 0.5 },
        explodedPosition: { x: 0, y: -3, z: 0.5 }
    });

    // 5. Scramjet Combustion Chamber
    const combustorGeo = new THREE.CylinderGeometry( 0.6, 0.6, 2, 16 );
    combustorGeo.rotateX( Math.PI / 2 );
    const plasmaCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    const combustor = new THREE.Mesh( combustorGeo, plasmaCoreMat );
    combustor.position.set( 0, -0.5, -1.5 );
    group.add( combustor );
    meshes.combustor = combustor;

    parts.push({
        name: "Supersonic Combustion Ramjet (Scramjet)",
        description: "The pulsing heart of the waverider, burning fuel in a supersonic airstream.",
        material: "Plasma-Confined Inconel",
        function: "Provides thrust to maintain or exceed Mach 10.",
        assemblyOrder: 5,
        connections: ["Scramjet Inlet Ramp", "Expansion Nozzle"],
        failureEffect: "Complete loss of thrust.",
        cascadeFailures: ["Altitude Loss", "Thermal Overload"],
        originalPosition: { x: 0, y: -0.5, z: -1.5 },
        explodedPosition: { x: 0, y: -4, z: -1.5 }
    });

    // 6. Active Cooling Network
    const pipeGeo = new THREE.TorusGeometry( 0.7, 0.05, 16, 50 );
    const pipeMat = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.9
    });
    
    meshes.coolingPipes = [];
    for(let i=0; i<5; i++) {
        const pipe = new THREE.Mesh( pipeGeo, pipeMat );
        pipe.position.set( 0, -0.5, -1.5 + (i * 0.4) - 0.8 );
        pipe.rotation.x = Math.PI / 2;
        group.add( pipe );
        meshes.coolingPipes.push(pipe);
    }

    parts.push({
        name: "Cryogenic Cooling Network",
        description: "Micro-tubing circulating liquid hydrogen around the combustor.",
        material: "Superconducting Niobium-Tin",
        function: "Cools the scramjet and hull by using the fuel as a heat sink before combustion.",
        assemblyOrder: 6,
        connections: ["Scramjet Combustion Chamber", "Main Fuselage"],
        failureEffect: "Engine melt-down within milliseconds.",
        cascadeFailures: ["Scramjet Combustion Chamber", "Expansion Nozzle"],
        originalPosition: { x: 0, y: -0.5, z: -2 },
        explodedPosition: { x: 4, y: -2, z: -2 }
    });

    // 7. Expansion Nozzle / Exhaust
    const exhaustGeo = new THREE.BoxGeometry( 2, 0.6, 1.5 );
    const exPos = exhaustGeo.attributes.position;
    for (let i = 0; i < exPos.count; i++) {
        if (exPos.getZ(i) < 0) {
            exPos.setX(i, exPos.getX(i) * 1.5);
            exPos.setY(i, exPos.getY(i) * 1.5);
        }
    }
    exhaustGeo.computeVertexNormals();
    const exhaustMat = steel;
    const exhaust = new THREE.Mesh( exhaustGeo, exhaustMat );
    exhaust.position.set( 0, -0.5, -3.25 );
    group.add( exhaust );
    meshes.exhaust = exhaust;

    // Glowing exhaust plume
    const plumeGeo = new THREE.ConeGeometry( 0.8, 4, 32 );
    plumeGeo.rotateX( -Math.PI / 2 );
    const plumeMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff0088,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const plume = new THREE.Mesh( plumeGeo, plumeMat );
    plume.position.set( 0, -0.5, -5 );
    group.add( plume );
    meshes.plume = plume;

    parts.push({
        name: "Expansion Nozzle & Plume",
        description: "Aft section directing hypersonic exhaust gases.",
        material: "Tungsten-Rhenium Alloy",
        function: "Converts high-pressure combustion gas into kinetic thrust.",
        assemblyOrder: 7,
        connections: ["Scramjet Combustion Chamber"],
        failureEffect: "Asymmetric thrust, catastrophic spin.",
        cascadeFailures: ["Airframe Integrity"],
        originalPosition: { x: 0, y: -0.5, z: -3.25 },
        explodedPosition: { x: 0, y: -1, z: -6 }
    });

    // 8. Plasma Shield Emitters
    const emitterGeo = new THREE.SphereGeometry( 0.15, 16, 16 );
    const emitterMat = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 5.0
    });
    const emitter1 = new THREE.Mesh( emitterGeo, emitterMat );
    emitter1.position.set( -0.6, 0.2, 2.5 );
    group.add( emitter1 );
    const emitter2 = new THREE.Mesh( emitterGeo, emitterMat );
    emitter2.position.set( 0.6, 0.2, 2.5 );
    group.add( emitter2 );
    meshes.emitters = [emitter1, emitter2];

    parts.push({
        name: "Electromagnetic Plasma Emitters",
        description: "Twin nodes that generate a magnetic field at the bow shock.",
        material: "Yttrium Barium Copper Oxide",
        function: "Magnetohydrodynamic (MHD) bypass to reduce thermal load and extract electrical power from the plasma sheath.",
        assemblyOrder: 8,
        connections: ["Ablative Nose Cone", "Main Fuselage"],
        failureEffect: "Excessive thermal load on the nose cone.",
        cascadeFailures: ["Ablative Nose Cone"],
        originalPosition: { x: 0.6, y: 0.2, z: 2.5 },
        explodedPosition: { x: 2, y: 2, z: 4 }
    });

    // 9. Dorsal Aft Fins
    const finGeo = new THREE.ConeGeometry( 0.2, 1.5, 4 );
    const finMat = darkSteel;
    const fin1 = new THREE.Mesh( finGeo, finMat );
    fin1.position.set( -1.5, 1.0, -2.5 );
    fin1.rotation.x = -Math.PI / 4;
    fin1.rotation.z = Math.PI / 8;
    group.add( fin1 );
    const fin2 = new THREE.Mesh( finGeo, finMat );
    fin2.position.set( 1.5, 1.0, -2.5 );
    fin2.rotation.x = -Math.PI / 4;
    fin2.rotation.z = -Math.PI / 8;
    group.add( fin2 );
    meshes.fins = [fin1, fin2];

    parts.push({
        name: "Dorsal Stabilizer Fins",
        description: "Cantilevered fins at the rear of the vehicle.",
        material: "Titanium with Ablative Coating",
        function: "Provides yaw and roll stability at hypersonic speeds where standard control surfaces lose authority.",
        assemblyOrder: 9,
        connections: ["Main Fuselage"],
        failureEffect: "Uncontrollable yaw instability.",
        cascadeFailures: ["Hull Integrity"],
        originalPosition: { x: -1.5, y: 1.0, z: -2.5 },
        explodedPosition: { x: -4, y: 4, z: -2.5 }
    });
    
    // 10. Shockwave Visualization (Animated Cone)
    const shockGeo = new THREE.ConeGeometry( 6, 12, 32, 1, true );
    shockGeo.translate( 0, -3, 0 );
    shockGeo.rotateX( -Math.PI / 2 );
    const shockMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const shockwave = new THREE.Mesh( shockGeo, shockMat );
    shockwave.position.set( 0, 0, 4.5 );
    group.add( shockwave );
    meshes.shockwave = shockwave;

    parts.push({
        name: "Mach 10 Bow Shockwave (Visualization)",
        description: "The conical pressure wave generated by hypersonic flight.",
        material: "Superheated Air / Plasma",
        function: "Provides 'lift' for the waverider by trapping high pressure below the hull.",
        assemblyOrder: 10,
        connections: ["Ablative Nose Cone"],
        failureEffect: "N/A - aerodynamic phenomenon.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 4.5 },
        explodedPosition: { x: 0, y: 5, z: 10 }
    });

    const description = "A highly advanced hypersonic waverider vehicle designed to cruise at Mach 10 by riding its own shockwave. Features a supersonic combustion ramjet (scramjet), ablative titanium leading edges, magnetohydrodynamic plasma shielding, and an active cryogenic cooling network to prevent thermal disintegration.";

    const quizQuestions = [
        {
            question: "How does a 'waverider' vehicle generate lift at hypersonic speeds?",
            options: [
                "By using large rotary blades like a helicopter.",
                "By trapping the high-pressure bow shockwave underneath its hull.",
                "By utilizing lighter-than-air buoyancy chambers.",
                "By directing all scramjet thrust downwards."
            ],
            correct: 1,
            explanation: "A waverider uses its specially designed hull to trap the high-pressure shockwave it generates on its underside, effectively 'riding' the shockwave for lift.",
            difficulty: "Medium"
        },
        {
            question: "Why is an active cryogenic cooling network required?",
            options: [
                "To keep the pilot comfortable.",
                "To freeze the incoming air into a solid.",
                "To circulate liquid fuel to cool the scramjet and airframe before combustion.",
                "To extinguish internal fires."
            ],
            correct: 2,
            explanation: "At Mach 10, aerodynamic friction creates immense heat. The cryogenic fuel (often liquid hydrogen) is circulated through the hull and engine to absorb this heat before being injected into the scramjet and burned.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the scramjet inlet ramp?",
            options: [
                "To slow the incoming air to subsonic speeds.",
                "To compress incoming hypersonic air while keeping it supersonic for combustion.",
                "To filter out birds and debris.",
                "To generate electromagnetic plasma."
            ],
            correct: 1,
            explanation: "Unlike a standard ramjet, a scramjet (Supersonic Combustion Ramjet) inlet compresses the incoming air but maintains supersonic airflow through the entire engine, allowing for much higher speeds.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) activeMeshes = meshes;

        // Pulsate plasma nose cone
        if (activeMeshes.nose) {
            activeMeshes.nose.material.emissiveIntensity = 5.0 + Math.sin(time * speed * 10) * 2.0;
        }

        // Animate leading edge glow
        if (activeMeshes.leadingEdges) {
            activeMeshes.leadingEdges.material.emissiveIntensity = 2.0 + Math.cos(time * speed * 8) * 1.5;
        }

        // Rotate and scale the shockwave to simulate fluctuation
        if (activeMeshes.shockwave) {
            activeMeshes.shockwave.rotation.z = time * speed;
            activeMeshes.shockwave.scale.setScalar( 1.0 + Math.sin(time * speed * 5) * 0.05 );
            activeMeshes.shockwave.material.opacity = 0.1 + Math.sin(time * speed * 15) * 0.05;
        }

        // Plume flicker
        if (activeMeshes.plume) {
            activeMeshes.plume.scale.set(
                1.0 + Math.random() * 0.2,
                1.0 + Math.random() * 0.4,
                1.0 + Math.random() * 0.2
            );
            activeMeshes.plume.material.emissiveIntensity = 6.0 + Math.random() * 4.0;
        }

        // Combustor internal plasma rotation
        if (activeMeshes.combustor) {
            activeMeshes.combustor.rotation.y = time * speed * 15;
            activeMeshes.combustor.material.emissiveIntensity = 8.0 + Math.sin(time * speed * 20) * 3.0;
        }

        // Active cooling pipes pulsating
        if (activeMeshes.coolingPipes) {
            activeMeshes.coolingPipes.forEach((pipe, i) => {
                pipe.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 5 + i) * 1.5;
            });
        }

        // Plasma shield emitters flashing
        if (activeMeshes.emitters) {
            activeMeshes.emitters.forEach(emitter => {
                emitter.material.emissiveIntensity = 5.0 + Math.sin(time * speed * 25) * 5.0;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
