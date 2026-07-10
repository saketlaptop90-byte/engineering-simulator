import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // custom materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.1
    });

    const jetPlumeMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const createMesh = (geometry, material, name) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    };

    const addPart = (mesh, name, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, explodedPosition) => {
        const originalPosition = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition,
            explodedPosition
        });
        group.add(mesh);
        return mesh;
    };

    // 1. Main Manifold / Housing
    const housingGeom = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const housing = createMesh(housingGeom, darkSteel, 'Housing');
    housing.position.set(0, 0, 0);
    addPart(housing, 'Main Manifold Block', 'Central distribution hub for high-pressure propellant lines.', 'Dark Steel / Titanium Alloy', 'Distributes hydrazine and nitrogen tetroxide to individual thrusters while handling extreme thermal loads.', 1, ['Fuel Lines', 'Oxidizer Lines', 'Thruster Nozzles'], 'Total loss of thrust capability.', ['Attitude Control Failure', 'Thermal Runaway'], {x: 0, y: 2.5, z: 0});

    // 2. Heat Shielding Panels
    const shieldGeom = new THREE.BoxGeometry(1.7, 0.1, 1.7);
    const topShield = createMesh(shieldGeom, chrome, 'TopShield');
    topShield.position.set(0, 0.65, 0);
    addPart(topShield, 'Thermal Protection Shield', 'Reflective barrier protecting electronics from engine heat.', 'Chrome Plated Tungsten', 'Reflects radiant heat away from the sensitive Electronic Control Unit.', 2, ['Main Manifold Block', 'ECU'], 'Electronics overheating.', ['ECU Failure', 'Erratic Valve Behavior'], {x: 0, y: 4.0, z: 0});

    // 3. Propellant Valves & Piping (4 sets)
    const valveGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const pipeGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const valvePositions = [
        [0.7, 0.2, 0.7],
        [-0.7, 0.2, 0.7],
        [0.7, 0.2, -0.7],
        [-0.7, 0.2, -0.7]
    ];
    
    valvePositions.forEach((pos, idx) => {
        const valveGroup = new THREE.Group();
        valveGroup.position.set(...pos);
        
        const valve = createMesh(valveGeom, copper, `Valve_${idx}`);
        valveGroup.add(valve);
        
        const pipe = createMesh(pipeGeom, aluminum, `Pipe_${idx}`);
        pipe.rotation.x = Math.PI / 2;
        pipe.position.set(0, -0.3, 0);
        valveGroup.add(pipe);

        addPart(valveGroup, `Solenoid Valve Assembly ${idx+1}`, 'Electromagnetic valve array regulating hypergolic propellant flow.', 'Copper / Stainless Steel', 'Precisely meters the flow of propellant to the combustion chamber in millisecond pulses.', 3, ['Main Manifold Block', `Nozzle ${idx+1}`], 'Valve stuck open or closed.', ['Propellant leak', 'Continuous unwanted thrust'], {x: pos[0]*3, y: pos[1]*3, z: pos[2]*3});
    });

    // 4. Thruster Nozzles (4 pointing outward)
    const nozzleGeom = new THREE.CylinderGeometry(0.35, 0.08, 0.8, 32, 1, true);
    const combustionChamberGeom = new THREE.SphereGeometry(0.2, 16, 16);
    
    const thrusterData = [
        { rot: [0, 0, Math.PI/2], pos: [1.2, 0, 0], exp: [3.5, 0, 0], dir: [1,0,0] }, // right
        { rot: [0, 0, -Math.PI/2], pos: [-1.2, 0, 0], exp: [-3.5, 0, 0], dir: [-1,0,0] }, // left
        { rot: [-Math.PI/2, 0, 0], pos: [0, 0, 1.2], exp: [0, 0, 3.5], dir: [0,0,1] }, // front
        { rot: [Math.PI/2, 0, 0], pos: [0, 0, -1.2], exp: [0, 0, -3.5], dir: [0,0,-1] } // back
    ];

    const plumes = [];
    const chambers = [];

    thrusterData.forEach((data, idx) => {
        const thrusterGroup = new THREE.Group();
        thrusterGroup.rotation.set(...data.rot);
        thrusterGroup.position.set(...data.pos);

        const nozzle = createMesh(nozzleGeom, steel, `Nozzle_Mesh_${idx}`);
        thrusterGroup.add(nozzle);

        const chamber = createMesh(combustionChamberGeom, glowingOrange, `Chamber_${idx}`);
        chamber.position.set(0, 0.4, 0); // At the throat
        chamber.material.emissiveIntensity = 0.2; // Idle state
        thrusterGroup.add(chamber);
        chambers.push(chamber);

        addPart(thrusterGroup, `Expansion Nozzle & Chamber ${idx+1}`, 'Combustion chamber and bell-shaped nozzle.', 'Niobium Alloy', 'Mixes propellants for combustion and accelerates exhaust gases to supersonic speeds.', 4, [`Solenoid Valve Assembly ${idx+1}`, 'Main Manifold Block'], 'Thrust vector misalignment or chamber rupture.', ['Loss of specific impulse', 'Catastrophic explosion'], {x: data.exp[0], y: data.exp[1], z: data.exp[2]});

        // Add a visual plume for animation
        const plumeGeom = new THREE.ConeGeometry(0.25, 2.0, 16);
        const plume = new THREE.Mesh(plumeGeom, jetPlumeMaterial.clone());
        plume.position.set(0, -1.2, 0); // Extend out from nozzle
        thrusterGroup.add(plume);
        plume.userData = { active: false, phase: Math.random() * Math.PI * 2, dir: data.dir };
        plumes.push(plume);
    });

    // 5. Electronic Control Unit (ECU)
    const ecuGeom = new THREE.BoxGeometry(1.0, 0.3, 1.0);
    const ecu = createMesh(ecuGeom, glowingBlue, 'ECU');
    ecu.position.set(0, 0.9, 0);
    addPart(ecu, 'Electronic Control Unit (ECU)', 'Avionics package processing flight computer commands.', 'Silicon / Gold / Ceramic', 'Translates digital attitude control commands into analog voltage spikes for solenoids.', 5, ['Thermal Protection Shield', 'Valves'], 'Failure to fire any thruster.', ['Complete loss of attitude control'], {x: 0, y: 5, z: 0});

    const description = "The high-performance Aerospace Reaction Control System (RCS) Thruster Block is a vital spacecraft module providing 6-degree-of-freedom attitude control and micro-translation. Utilizing hypergolic bipropellants (typically Monomethylhydrazine and Nitrogen Tetroxide), these engines ignite instantly upon mixing without an ignition source. Built from exotic alloys like Niobium and Tungsten, this quad-thruster pod handles extreme thermal gradients and delivers precise, millisecond-scale impulse bursts for orbital docking and station-keeping.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Expansion Nozzle in an RCS thruster?",
            options: [
                "To cool the exhaust gases via radiative cooling",
                "To accelerate combustion exhaust gases to supersonic speeds",
                "To chemically mix the fuel and oxidizer",
                "To regulate the back-pressure of the main propellant tank"
            ],
            correct: 1,
            explanation: "The expansion nozzle (often a de Laval nozzle) takes the high-pressure, high-temperature gas from the combustion chamber and expands it, accelerating it to supersonic velocities to maximize thrust (Specific Impulse).",
            difficulty: "Medium"
        },
        {
            question: "Why are hypergolic propellants favored in orbital RCS systems?",
            options: [
                "They are extremely safe and non-toxic for astronauts to handle",
                "They are inexpensive and widely available commercially",
                "They combust spontaneously upon contact, eliminating complex ignition systems",
                "They provide the absolute highest specific impulse of any known chemical fuel"
            ],
            correct: 2,
            explanation: "Hypergolic propellants ignite on contact with each other. This eliminates the need for spark plugs or igniters, vastly increasing reliability for systems that must pulse thousands of times during a mission without failure.",
            difficulty: "Hard"
        },
        {
            question: "What catastrophic effect occurs if a solenoid valve fails in the 'stuck open' position?",
            options: [
                "The thruster operates at a higher efficiency",
                "The spacecraft experiences continuous, uncontrolled thrust causing hazardous spin",
                "The propellant lines immediately freeze solid due to depressurization",
                "The Electronic Control Unit simply reroutes power to a backup valve"
            ],
            correct: 1,
            explanation: "A stuck-open valve causes a continuous flow of propellant and continuous thrust. This rapidly depletes fuel and induces an uncontrolled spin or drift, requiring immediate manual isolation of that propellant branch to save the mission.",
            difficulty: "Medium"
        },
        {
            question: "What material property is most critical for the Thermal Protection Shield placed below the ECU?",
            options: [
                "High electrical conductivity",
                "High thermal reflectivity and low thermal conductivity",
                "Optical transparency",
                "High tensile strength and elasticity"
            ],
            correct: 1,
            explanation: "The shield must protect sensitive electronics from the immense radiant heat of the combustion chambers. Therefore, it requires high thermal reflectivity to bounce heat away, and low thermal conductivity to prevent heat from soaking through.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Animate the ECU glowing pulse
        const ecuMesh = group.getObjectByName('ECU');
        if (ecuMesh && ecuMesh.material.emissiveIntensity !== undefined) {
            ecuMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 3) * 0.8;
        }

        // Simulate RCS Thruster firing (pulsing jets)
        plumes.forEach((plume, idx) => {
            const chamber = chambers[idx];
            // Complex pulse logic to make it look like random thruster firing
            const pulseRate = 8 * speed;
            const activationTime = (Math.sin(time * pulseRate + plume.userData.phase) + Math.cos(time * pulseRate * 0.5)) / 2;
            
            if (activationTime > 0.75) {
                plume.visible = true;
                const scale = 1.0 + Math.random() * 0.4;
                plume.scale.set(1, scale, 1);
                plume.material.opacity = 0.4 + Math.random() * 0.6;
                // Light up the combustion chamber
                chamber.material.emissiveIntensity = 3.0 + Math.random() * 2.0;
            } else {
                plume.visible = false;
                // Cool down the chamber
                chamber.material.emissiveIntensity = Math.max(0.2, chamber.material.emissiveIntensity - 0.1);
            }
        });
        
        // Gentle floating rotation
        group.rotation.x = Math.sin(time * 0.5 * speed) * 0.15;
        group.rotation.z = Math.cos(time * 0.3 * speed) * 0.15;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRCSThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
