import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x5500aa,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.6
    });
    
    const darkCrystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111122,
        emissive: 0x000011,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.75,
        transmission: 0.9,
        ior: 2.4
    });

    const activeAcousticMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xaa5500,
        emissiveIntensity: 0.5,
        wireframe: false,
        metalness: 0.5,
        roughness: 0.3
    });

    // Helper for adding parts
    function addPart(name, mesh, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, origPos, explPos) {
        mesh.position.copy(origPos);
        mesh.userData = { originalPosition: origPos.clone(), explodedPosition: explPos.clone(), name: name };
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // 1. Base Isolation Mounts (Complex array of shock absorbers)
    const baseGroup = new THREE.Group();
    const baseRadius = 25;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const mount = new THREE.Group();
        
        const padGeom = new THREE.CylinderGeometry(3, 3.5, 2, 32);
        const pad = new THREE.Mesh(padGeom, rubber);
        pad.position.y = 1;
        mount.add(pad);
        
        const springGeom = new THREE.TorusGeometry(1.5, 0.4, 16, 64, Math.PI * 10);
        const spring = new THREE.Mesh(springGeom, darkSteel);
        spring.rotation.x = Math.PI / 2;
        spring.scale.z = 0.5;
        spring.position.y = 4;
        mount.add(spring);
        
        const strutGeom = new THREE.CylinderGeometry(1, 1, 6, 16);
        const strut = new THREE.Mesh(strutGeom, chrome);
        strut.position.y = 4;
        mount.add(strut);

        mount.position.set(Math.cos(angle) * baseRadius, 0, Math.sin(angle) * baseRadius);
        baseGroup.add(mount);
    }
    const baseRingGeom = new THREE.TorusGeometry(baseRadius, 1.5, 32, 128);
    const baseRing = new THREE.Mesh(baseRingGeom, steel);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 7;
    baseGroup.add(baseRing);
    
    addPart('base_isolation_mounts', baseGroup, 'Heavy-duty acoustic decoupling platform.', 'Rubber/Steel', 'Isolates the resonator from terrestrial seismic noise.', 1, ['main_cavity_hull'], 'Coupling of ground noise.', ['False resonance spikes'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -20, 0));

    // 2. Main Cavity Hull (Lathe Geometry for outer shell)
    const pointsHull = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const r = 20 * Math.sin(t * Math.PI) + 5;
        const y = 40 * t;
        pointsHull.push(new THREE.Vector2(r, y));
    }
    const hullGeom = new THREE.LatheGeometry(pointsHull, 128);
    const hullMesh = new THREE.Mesh(hullGeom, steel);
    // Add external ribs to hull
    for (let i = 0; i < 24; i++) {
        const ribGeom = new THREE.BoxGeometry(2, 40, 2);
        const rib = new THREE.Mesh(ribGeom, darkSteel);
        const angle = (i / 24) * Math.PI * 2;
        rib.position.set(Math.cos(angle) * 20, 20, Math.sin(angle) * 20);
        rib.rotation.y = -angle;
        hullMesh.add(rib);
    }
    addPart('main_cavity_hull', hullMesh, 'Primary pressure vessel.', 'Steel/Titanium', 'Contains the resonant volume and sustains high Q-factors.', 2, ['base_isolation_mounts', 'cavity_inner_crystal'], 'Pressure leakage.', ['Q-factor degradation', 'Wave scattering'], new THREE.Vector3(0, 7, 0), new THREE.Vector3(0, 0, -40));

    // 3. Cavity Inner Crystal (Complex polyhedral structure)
    const crystalGeom = new THREE.IcosahedronGeometry(18, 3);
    const crystalMesh = new THREE.Mesh(crystalGeom, darkCrystalMaterial);
    addPart('cavity_inner_crystal', crystalMesh, 'Crystalline inner acoustic boundary.', 'Metamaterial Crystal', 'Shapes internal standing waves with extreme precision.', 3, ['main_cavity_hull'], 'Mode distortion.', ['Loss of cosmic harmonic tracking'], new THREE.Vector3(0, 27, 0), new THREE.Vector3(0, 27, 40));

    // 4. Adjustable Neck Base
    const neckBaseGeom = new THREE.CylinderGeometry(8, 12, 10, 64);
    const neckBaseMesh = new THREE.Mesh(neckBaseGeom, chrome);
    // Add hydraulic actuators around neck base
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const actuatorGeom = new THREE.CylinderGeometry(1, 1, 8, 16);
        const actuator = new THREE.Mesh(actuatorGeom, darkSteel);
        actuator.position.set(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
        actuator.rotation.x = Math.PI / 8 * Math.cos(angle);
        actuator.rotation.z = Math.PI / 8 * Math.sin(angle);
        neckBaseMesh.add(actuator);
    }
    addPart('adjustable_neck_base', neckBaseMesh, 'Foundation for the dynamically adjustable resonator neck.', 'Chrome', 'Anchors the neck and houses adjustment servos.', 4, ['main_cavity_hull', 'neck_extension_cylinder'], 'Inability to tune base frequency.', ['Neck extension failure'], new THREE.Vector3(0, 47, 0), new THREE.Vector3(0, 60, 0));

    // 5. Neck Extension Cylinder (Telescoping)
    const neckExtGroup = new THREE.Group();
    const neck1Geom = new THREE.CylinderGeometry(7, 7, 15, 64);
    const neck1 = new THREE.Mesh(neck1Geom, aluminum);
    neckExtGroup.add(neck1);
    
    const neck2Geom = new THREE.CylinderGeometry(6, 6, 15, 64);
    const neck2 = new THREE.Mesh(neck2Geom, chrome);
    neck2.position.y = 7.5;
    neckExtGroup.add(neck2);
    
    addPart('neck_extension_cylinder', neckExtGroup, 'Telescopic tuning neck.', 'Aluminum/Chrome', 'Adjusts the acoustic mass to tune the resonance frequency.', 5, ['adjustable_neck_base', 'neck_iris_mechanism'], 'Frequency drift.', ['Resonance mismatch'], new THREE.Vector3(0, 57, 0), new THREE.Vector3(0, 90, 0));

    // 6. Neck Iris Mechanism
    const irisGroup = new THREE.Group();
    const irisRingGeom = new THREE.TorusGeometry(8, 1.5, 32, 64);
    const irisRing = new THREE.Mesh(irisRingGeom, steel);
    irisRing.rotation.x = Math.PI / 2;
    irisGroup.add(irisRing);
    
    for (let i = 0; i < 16; i++) {
        const bladeGeom = new THREE.BoxGeometry(4, 0.2, 8);
        const blade = new THREE.Mesh(bladeGeom, darkSteel);
        const angle = (i / 16) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
        blade.rotation.y = -angle + Math.PI / 4;
        irisGroup.add(blade);
    }
    addPart('neck_iris_mechanism', irisGroup, 'Acoustic aperture controller.', 'Steel', 'Varies the cross-sectional area of the neck dynamically.', 6, ['neck_extension_cylinder'], 'Uncontrolled acoustic resistance.', ['Impedance mismatch'], new THREE.Vector3(0, 72, 0), new THREE.Vector3(0, 110, 0));

    // 7. Resonance Tuning Ring (Rotating magnetic ring)
    const tuningRingGroup = new THREE.Group();
    const tringGeom = new THREE.TorusGeometry(15, 2, 32, 128);
    const tring = new THREE.Mesh(tringGeom, copper);
    tring.rotation.x = Math.PI / 2;
    tuningRingGroup.add(tring);
    // Add magnetic coils
    for (let i = 0; i < 36; i++) {
        const coilGeom = new THREE.BoxGeometry(3, 4, 3);
        const coil = new THREE.Mesh(coilGeom, activeAcousticMaterial);
        const angle = (i / 36) * Math.PI * 2;
        coil.position.set(Math.cos(angle) * 15, 0, Math.sin(angle) * 15);
        coil.rotation.y = -angle;
        tuningRingGroup.add(coil);
    }
    addPart('resonance_tuning_ring', tuningRingGroup, 'Magnetic field tuner for acoustic plasma.', 'Copper/Metamaterials', 'Fine-tunes the non-linear acoustic properties.', 7, ['adjustable_neck_base'], 'Plasma instability.', ['Harmonic distortion'], new THREE.Vector3(0, 52, 0), new THREE.Vector3(30, 52, 0));

    // 8. Wave Visualization Chamber (Glass enclosure around neck)
    const glassChamberGeom = new THREE.CylinderGeometry(14, 14, 35, 64);
    const glassChamber = new THREE.Mesh(glassChamberGeom, tinted);
    addPart('wave_visualization_chamber', glassChamber, 'Vacuum-sealed visualization shroud.', 'Tinted Glass', 'Contains the glowing ionization gas that makes sound waves visible.', 8, ['main_cavity_hull'], 'Loss of visualization.', ['Cannot monitor modes visually'], new THREE.Vector3(0, 57, 0), new THREE.Vector3(-30, 57, 0));

    // 9. Standing Wave Nodes (Glowing energy spheres)
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const nodeGeom = new THREE.SphereGeometry(2, 32, 32);
        const node = new THREE.Mesh(nodeGeom, neonBlue);
        node.position.y = (i - 2) * 6;
        nodesGroup.add(node);
    }
    // Also internal cavity nodes
    for (let i = 0; i < 3; i++) {
        const innerNodeGeom = new THREE.SphereGeometry(4, 32, 32);
        const innerNode = new THREE.Mesh(innerNodeGeom, neonPurple);
        innerNode.position.y = -20 + i * 15;
        nodesGroup.add(innerNode);
    }
    addPart('standing_wave_nodes', nodesGroup, 'Ionized acoustic pressure nodes.', 'Plasma', 'Manifests the high-pressure points of the standing waves.', 9, ['wave_visualization_chamber', 'cavity_inner_crystal'], 'Energy dissipation.', ['Complete resonance failure'], new THREE.Vector3(0, 57, 0), new THREE.Vector3(0, 57, 30));

    // 10. Acoustic Baffle Arrays (Inside the crystal)
    const baffleGroup = new THREE.Group();
    for (let j = 0; j < 6; j++) {
        const bLevel = new THREE.Group();
        const bRad = 15 * Math.sin(Math.PI * (j + 1) / 7);
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bPlate = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), aluminum);
            bPlate.position.set(Math.cos(angle) * bRad, 0, Math.sin(angle) * bRad);
            bPlate.rotation.y = -angle;
            bPlate.rotation.x = Math.PI / 6;
            bLevel.add(bPlate);
        }
        bLevel.position.y = j * 5 - 12;
        baffleGroup.add(bLevel);
    }
    addPart('acoustic_baffle_arrays', baffleGroup, 'Internal acoustic diffusers.', 'Aluminum', 'Suppresses unwanted higher-order transverse modes.', 10, ['cavity_inner_crystal'], 'Mode overlapping.', ['Acoustic chaos'], new THREE.Vector3(0, 27, 0), new THREE.Vector3(0, 27, -40));

    // 11. Pressure Sensor Array (Extruding from hull)
    const sensorGroup = new THREE.Group();
    for (let i = 0; i < 36; i++) {
        const sGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
        const sensor = new THREE.Mesh(sGeom, chrome);
        const angle = (i / 36) * Math.PI * 2;
        const radius = 22;
        sensor.position.set(Math.cos(angle) * radius, 25, Math.sin(angle) * radius);
        sensor.rotation.x = Math.PI / 2;
        sensor.rotation.y = -angle;
        sensorGroup.add(sensor);
    }
    addPart('pressure_sensor_array', sensorGroup, 'High-fidelity dynamic pressure transducers.', 'Chrome', 'Feeds back real-time cavity pressure to the control system.', 11, ['main_cavity_hull'], 'Blind tuning.', ['Sub-optimal resonance'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(40, 25, 0));

    // 12. Harmonic Stabilizer Struts
    const strutGroup2 = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*30, 0, Math.sin(angle)*30),
            new THREE.Vector3(Math.cos(angle)*40, 20, Math.sin(angle)*40),
            new THREE.Vector3(Math.cos(angle)*15, 60, Math.sin(angle)*15)
        ]);
        const tubeGeom = new THREE.TubeGeometry(path, 64, 1.5, 16, false);
        const tube = new THREE.Mesh(tubeGeom, steel);
        strutGroup2.add(tube);
    }
    addPart('harmonic_stabilizer_struts', strutGroup2, 'External structural stabilizers.', 'Steel', 'Prevents the entire chassis from ripping apart at high energy.', 12, ['base_isolation_mounts', 'adjustable_neck_base'], 'Structural failure.', ['Catastrophic explosion'], new THREE.Vector3(0, 7, 0), new THREE.Vector3(-40, 7, -40));

    // 13. Hydraulic Tuning Pistons
    const pistonGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pGeom = new THREE.CylinderGeometry(1.2, 1.2, 20, 32);
        const pMesh = new THREE.Mesh(pGeom, chrome);
        pMesh.position.set(Math.cos(angle) * 12, 10, Math.sin(angle) * 12);
        pistonGroup.add(pMesh);
    }
    addPart('hydraulic_tuning_pistons', pistonGroup, 'Massive hydraulic drives for the neck.', 'Chrome', 'Forces the neck extension against extreme acoustic pressure.', 13, ['neck_extension_cylinder'], 'Neck jamming.', ['Runaway resonance'], new THREE.Vector3(0, 47, 0), new THREE.Vector3(40, 47, 40));

    // 14. Piston Sleeves
    const sleeveGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sGeom = new THREE.CylinderGeometry(2, 2, 15, 32);
        const sMesh = new THREE.Mesh(sGeom, darkSteel);
        sMesh.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
        sleeveGroup.add(sMesh);
    }
    addPart('piston_sleeves', sleeveGroup, 'Hydraulic pressure containment sleeves.', 'Dark Steel', 'Houses the tuning pistons and highly pressurized hydraulic fluid.', 14, ['hydraulic_tuning_pistons', 'adjustable_neck_base'], 'Hydraulic leak.', ['Loss of tuning ability'], new THREE.Vector3(0, 47, 0), new THREE.Vector3(40, 47, -40));

    // 15. Energy Containment Field (Wireframe Sphere)
    const fieldGeom = new THREE.SphereGeometry(45, 64, 64);
    const fieldMesh = new THREE.Mesh(fieldGeom, neonBlue);
    fieldMesh.scale.set(1, 1.2, 1);
    addPart('energy_containment_field', fieldMesh, 'Electromagnetic boundary.', 'Plasma', 'Contains any potential acoustic shockwaves from escaping into the environment.', 15, ['base_isolation_mounts'], 'Shockwave release.', ['Deafening of personnel', 'Facility damage'], new THREE.Vector3(0, 35, 0), new THREE.Vector3(0, 100, 0));

    // 16. Plasma Venting Ports
    const ventGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const ventGeom = new THREE.TorusGeometry(3, 1, 16, 32);
        const vent = new THREE.Mesh(ventGeom, copper);
        vent.position.set(Math.cos(angle) * 25, 45, Math.sin(angle) * 25);
        vent.rotation.y = -angle;
        vent.rotation.x = Math.PI / 4;
        ventGroup.add(vent);
    }
    addPart('plasma_venting_ports', ventGroup, 'Overpressure exhaust valves.', 'Copper', 'Safely vents excess ionized acoustic plasma.', 16, ['main_cavity_hull'], 'Cavity rupture.', ['Catastrophic failure'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(-40, 45, 40));

    // 17. Cosmic Hum Receptor (Antenna array at top)
    const receptorGroup = new THREE.Group();
    const dishGeom = new THREE.SphereGeometry(10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dish = new THREE.Mesh(dishGeom, aluminum);
    dish.rotation.x = Math.PI;
    dish.position.y = 20;
    receptorGroup.add(dish);
    const spikeGeom = new THREE.CylinderGeometry(0.2, 0.5, 15, 16);
    const spike = new THREE.Mesh(spikeGeom, chrome);
    spike.position.y = 25;
    receptorGroup.add(spike);
    addPart('cosmic_hum_receptor', receptorGroup, 'Deep space acoustic-gravitational wave antenna.', 'Aluminum/Chrome', 'Captures the background hum of the universe to feed into the resonator.', 17, ['neck_iris_mechanism'], 'Signal loss.', ['Resonating with local noise only'], new THREE.Vector3(0, 72, 0), new THREE.Vector3(0, 140, 0));

    // 18. Control Interface Terminals
    const consoleGroup = new THREE.Group();
    const consoleBody = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 8), darkSteel);
    consoleBody.position.set(0, 7.5, 0);
    consoleGroup.add(consoleBody);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), plasmaMaterial);
    screen.position.set(0, 12, 4.1);
    consoleGroup.add(screen);
    const p1 = consoleGroup.clone();
    p1.position.set(0, 0, 35);
    const p2 = consoleGroup.clone();
    p2.position.set(0, 0, -35);
    p2.rotation.y = Math.PI;
    const allConsoles = new THREE.Group();
    allConsoles.add(p1, p2);
    addPart('control_interface_terminals', allConsoles, 'Holographic acoustic control stations.', 'Dark Steel/Glass', 'Provides manual override and telemetry readouts for PhD operators.', 18, ['base_isolation_mounts'], 'Loss of control.', ['Autonomous runaway'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(60, 0, 60));

    // 19. Coolant Circulation Pipes
    const pipeGroup = new THREE.Group();
    const pMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.8, roughness: 0.2 });
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r1 = 20;
        const r2 = 22;
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*r1, 10, Math.sin(angle)*r1),
            new THREE.Vector3(Math.cos(angle)*r2, 25, Math.sin(angle)*r2),
            new THREE.Vector3(Math.cos(angle)*(r1-2), 40, Math.sin(angle)*(r1-2))
        ]);
        const pGeom = new THREE.TubeGeometry(pipePath, 32, 0.8, 16, false);
        const pipe = new THREE.Mesh(pGeom, pMaterial);
        pipeGroup.add(pipe);
    }
    addPart('coolant_circulation_pipes', pipeGroup, 'Cryogenic liquid helium pipes.', 'Titanium', 'Cools the metamaterial crystal to maintain superconductivity of sound.', 19, ['main_cavity_hull'], 'Thermal overload.', ['Crystal melting'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(-60, 0, -60));

    // Animation function
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // Dynamic Neck adjustment (Telescoping action)
        if (activeMeshes['neck_extension_cylinder']) {
            const extY = Math.sin(t * 0.5) * 5;
            activeMeshes['neck_extension_cylinder'].position.y = activeMeshes['neck_extension_cylinder'].userData.originalPosition.y + extY;
            
            // Sync hydraulic pistons
            if (activeMeshes['hydraulic_tuning_pistons']) {
                activeMeshes['hydraulic_tuning_pistons'].position.y = activeMeshes['hydraulic_tuning_pistons'].userData.originalPosition.y + extY;
            }
            if (activeMeshes['neck_iris_mechanism']) {
                activeMeshes['neck_iris_mechanism'].position.y = activeMeshes['neck_iris_mechanism'].userData.originalPosition.y + extY;
            }
            if (activeMeshes['cosmic_hum_receptor']) {
                activeMeshes['cosmic_hum_receptor'].position.y = activeMeshes['cosmic_hum_receptor'].userData.originalPosition.y + extY;
            }
        }

        // Rotating tuning ring
        if (activeMeshes['resonance_tuning_ring']) {
            activeMeshes['resonance_tuning_ring'].rotation.y = t * 2.0;
        }

        // Pulsing Standing Wave Nodes
        if (activeMeshes['standing_wave_nodes']) {
            const nodes = activeMeshes['standing_wave_nodes'].children;
            nodes.forEach((node, index) => {
                // Nodes pulse based on their position and time, simulating a standing wave
                const phase = index * 0.5;
                const scale = 1 + Math.abs(Math.sin(t * 5 + phase)) * 1.5;
                node.scale.set(scale, scale, scale);
                // Intense glowing
                if (node.material.emissiveIntensity !== undefined) {
                    node.material.emissiveIntensity = 1.0 + Math.abs(Math.sin(t * 10 + phase)) * 3.0;
                }
            });
        }

        // Iris opening and closing
        if (activeMeshes['neck_iris_mechanism']) {
            const blades = activeMeshes['neck_iris_mechanism'].children;
            const apertureOpenness = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1
            blades.forEach((blade, index) => {
                if (index > 0) { // skip the torus ring
                    const angle = ((index - 1) / 16) * Math.PI * 2;
                    const r = 3 + apertureOpenness * 4;
                    blade.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
                    blade.rotation.y = -angle + Math.PI/4 + apertureOpenness * Math.PI/8;
                }
            });
        }

        // Energy containment field oscillation
        if (activeMeshes['energy_containment_field']) {
            const s = 1 + Math.sin(t * 8) * 0.02;
            activeMeshes['energy_containment_field'].scale.set(s, s * 1.2, s);
            activeMeshes['energy_containment_field'].rotation.y = t * 0.2;
            activeMeshes['energy_containment_field'].rotation.z = Math.sin(t * 0.1) * 0.1;
        }
        
        // Crystal cavity rotation and breathing
        if (activeMeshes['cavity_inner_crystal']) {
            activeMeshes['cavity_inner_crystal'].rotation.y = t * 0.5;
            activeMeshes['cavity_inner_crystal'].rotation.x = t * 0.3;
            const cScale = 1 + Math.sin(t * 15) * 0.01; // high frequency micro-vibrations
            activeMeshes['cavity_inner_crystal'].scale.set(cScale, cScale, cScale);
        }

        // Coolant pipes pulsing
        if (activeMeshes['coolant_circulation_pipes']) {
            activeMeshes['coolant_circulation_pipes'].children.forEach((pipe, index) => {
                const phase = index * (Math.PI / 4);
                pipe.material.emissiveIntensity = 0.5 + Math.sin(t * 4 + phase) * 0.5;
            });
        }
    }

    const description = "An Ultra God Tier Helmholtz Resonator. Designed to capture, isolate, and amplify the primordial background hum of the universe. It utilizes a metamaterial crystalline cavity, dynamically adjusting pneumatic neck, and ionized plasma wave visualization to lock onto the precise harmonic frequencies of cosmic radiation. When optimal resonance is achieved, standing waves manifest visually within the vacuum chamber, emitting intense radiation and localized spatial distortions.";

    const quizQuestions = [
        {
            question: "In the context of the God-Tier Resonator's dynamically adjusting neck, how does an increase in the effective acoustic mass (by extending the neck length) theoretically alter the primary Helmholtz resonance frequency, assuming a constant cavity volume and sound velocity?",
            options: [
                "The resonance frequency decreases, being inversely proportional to the square root of the neck's effective length.",
                "The resonance frequency increases proportionally to the square of the neck's length.",
                "The resonance frequency remains unchanged, as acoustic mass only affects the Q-factor.",
                "The resonance frequency decreases linearly with the neck length."
            ],
            correctAnswer: 0,
            explanation: "The Helmholtz resonance frequency is proportional to sqrt(A / (V * L_eff)), where L_eff is the effective length of the neck. Thus, increasing the length increases the acoustic mass and lowers the resonance frequency inversely proportional to the square root of the length."
        },
        {
            question: "To prevent high-energy acoustic chaos and mode overlapping, this resonator employs an internal Aluminum Acoustic Baffle Array. What specific role do these baffles play in modifying the acoustic impedance matrix of the internal cavity?",
            options: [
                "They act as perfectly rigid boundaries that lower the speed of sound, shifting all modes to lower frequencies.",
                "They increase the reactive component of the acoustic impedance for transverse modes, effectively damping non-axial standing waves while preserving the fundamental Helmholtz mode.",
                "They act as acoustic metamaterials with a negative bulk modulus, reversing the phase of the incident waves.",
                "They decrease the total internal volume proportionally, purely to raise the fundamental frequency."
            ],
            correctAnswer: 1,
            explanation: "Baffles inside a resonator are typically designed to disrupt transverse (non-axial) modes by presenting high reactive impedance to cross-modes, thereby damping them and preventing mode overlapping, allowing the fundamental Helmholtz resonance to dominate."
        },
        {
            question: "The 'Standing Wave Nodes' manifest visually as intense plasma spheres. In a completely idealized standing wave inside the neck of the resonator, what is the theoretical phase relationship between acoustic pressure and acoustic particle velocity at a pressure anti-node?",
            options: [
                "They are exactly in phase (0 degrees).",
                "They are perfectly out of phase (180 degrees).",
                "They are in quadrature (90 degrees out of phase).",
                "Particle velocity is infinite while pressure is zero."
            ],
            correctAnswer: 2,
            explanation: "In an ideal standing wave, acoustic pressure and particle velocity are in quadrature (90 degrees out of phase) everywhere. At a pressure anti-node, pressure variation is maximum while particle velocity is zero."
        },
        {
            question: "The 'Resonance Tuning Ring' utilizes a magnetic field to tune the acoustic plasma. According to the principles of magneto-acoustics, how does a strong transverse magnetic field alter the propagation of sound waves within an ionized plasma (a highly conductive fluid)?",
            options: [
                "It has absolutely no effect on acoustic waves, as sound is purely a mechanical longitudinal wave.",
                "It completely dampens all acoustic waves due to Lorentz force counteraction.",
                "It couples the acoustic wave with an Alfven wave, creating a fast magneto-acoustic wave with a phase velocity that depends on both the sound speed and the Alfven speed.",
                "It bends the acoustic waves into circular trajectories, confining them to the center of the ring."
            ],
            correctAnswer: 2,
            explanation: "In a highly conductive fluid like a plasma, a transverse magnetic field couples with the longitudinal sound wave to create a fast magneto-acoustic wave. Its phase velocity is roughly sqrt(c_s^2 + v_A^2), where c_s is sound speed and v_A is the Alfven speed."
        },
        {
            question: "Given the intense Q-factor required to isolate the 'background hum of the universe', what is the primary consequence of achieving an ultra-high Q-factor in terms of the resonator's transient response time (the 'ring-up' or 'ring-down' time)?",
            options: [
                "The transient response time becomes practically instantaneous, allowing for rapid signal tracking.",
                "The transient response time increases significantly, meaning the resonator takes a very long time to build up to maximum amplitude and a very long time to decay.",
                "The Q-factor has no relationship with the time-domain transient response.",
                "The resonator will become critically damped and will not oscillate at all."
            ],
            correctAnswer: 1,
            explanation: "Q-factor is directly proportional to the energy stored divided by the energy dissipated per cycle. A very high Q-factor means very low dissipation, which directly correlates to a long time constant. Thus, the system takes a long time to 'ring up' to steady state and 'ring down' when the source is removed."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createHelmholtzResonator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
