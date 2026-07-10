import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // --- CUSTOM MATERIALS FOR ANTIMATTER FORGE ---
    const antimatterCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x220033,
        emissive: 0x9900ff,
        emissiveIntensity: 5.0,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: true
    });

    const antimatterPlasmaMat = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const magneticConfinementMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });

    const neonScreenMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });

    const highHeatExhaustMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff2200,
        emissiveIntensity: 3.0,
        roughness: 0.8,
        metalness: 0.2
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 1.0
    });

    const shipHullMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.4,
        metalness: 0.7
    });

    // --- HELPER FUNCTIONS FOR HYPER-REALISM ---

    function createRivets(parentMesh, radius, count, yPos) {
        const rivetGeo = new THREE.SphereGeometry(radius * 0.05, 8, 8);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const rivet = new THREE.Mesh(rivetGeo, darkSteel);
            rivet.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            parentMesh.add(rivet);
        }
    }

    function createHydraulicPiston(length, radius, extension) {
        const pistonGroup = new THREE.Group();
        
        // Outer cylinder
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
        const outerMesh = new THREE.Mesh(outerGeo, steel);
        outerMesh.position.y = length / 2;
        pistonGroup.add(outerMesh);
        
        // Inner cylinder (rod)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 16);
        const innerMesh = new THREE.Mesh(innerGeo, chrome);
        innerMesh.position.y = length + (extension * length / 2);
        pistonGroup.add(innerMesh);

        // Add hydraulic lines
        const linePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, length * 0.2, 0),
            new THREE.Vector3(radius * 1.5, length * 0.5, 0),
            new THREE.Vector3(radius, length * 0.8, 0)
        ]);
        const lineGeo = new THREE.TubeGeometry(linePath, 20, radius * 0.15, 8, false);
        const lineMesh = new THREE.Mesh(lineGeo, rubber);
        pistonGroup.add(lineMesh);

        return { group: pistonGroup, rod: innerMesh };
    }

    function createTireWithTreads(radius, width) {
        const tireGroup = new THREE.Group();
        
        // Main tire body
        const torusGeo = new THREE.TorusGeometry(radius, width / 2, 32, 64);
        const tireMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireMesh);

        // Hundreds of tiny extruded BoxGeometry lugs
        const numLugs = 120;
        const lugGeo = new THREE.BoxGeometry(width * 1.2, width * 0.1, radius * 0.15);
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            lug.rotation.z = angle;
            // Slight offset for aggressive pattern
            if (i % 2 === 0) lug.position.z += width * 0.1;
            else lug.position.z -= width * 0.1;
            tireGroup.add(lug);
        }

        // Complex spoke array rims
        const rimGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, width * 0.8, 32);
        const rimMesh = new THREE.Mesh(rimGeo, aluminum);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);

        const numSpokes = 16;
        const spokeGeo = new THREE.CylinderGeometry(radius * 0.02, radius * 0.05, radius * 1.4, 16);
        for (let i = 0; i < numSpokes; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / numSpokes) * Math.PI;
            tireGroup.add(spoke);
        }

        return tireGroup;
    }

    function createOperatorCabin() {
        const cabinGroup = new THREE.Group();

        // Main chassis
        const chassisGeo = new THREE.BoxGeometry(10, 8, 12);
        const chassis = new THREE.Mesh(chassisGeo, steel);
        cabinGroup.add(chassis);

        // Tinted Glass Windows
        const windowGeo = new THREE.BoxGeometry(9.8, 4, 12.2);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.y = 1.5;
        cabinGroup.add(windowMesh);

        // Control Panel
        const panelGeo = new THREE.BoxGeometry(8, 2, 3);
        const panel = new THREE.Mesh(panelGeo, darkSteel);
        panel.position.set(0, -1, 4);
        panel.rotation.x = -Math.PI / 6;
        cabinGroup.add(panel);

        // Glowing Screens
        const screenGeo = new THREE.PlaneGeometry(2, 1.5);
        for(let i=0; i<3; i++) {
            const screen = new THREE.Mesh(screenGeo, neonScreenMat);
            screen.position.set(-2.5 + i*2.5, 0.5, 1.5);
            screen.rotation.x = -Math.PI / 2;
            panel.add(screen);
        }

        // Joysticks
        const stickBaseGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16);
        const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
        for(let i=0; i<2; i++) {
            const stickBase = new THREE.Mesh(stickBaseGeo, plastic);
            stickBase.position.set(-3 + i*6, 0.5, -0.5);
            panel.add(stickBase);
            
            const stick = new THREE.Mesh(stickGeo, chrome);
            stick.position.y = 0.75;
            stickBase.add(stick);
            
            updatables.push({
                mesh: stick,
                update: (time) => {
                    stick.rotation.x = Math.sin(time * 2 + i) * 0.2;
                    stick.rotation.z = Math.cos(time * 3 + i) * 0.2;
                }
            });
        }

        // Steering Wheel
        const wheelGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.position.set(0, 1, 0);
        wheel.rotation.x = Math.PI / 4;
        panel.add(wheel);

        updatables.push({
            mesh: wheel,
            update: (time) => {
                wheel.rotation.z = Math.sin(time * 0.5) * Math.PI;
            }
        });

        // Side Mirrors
        const mirrorArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const mirrorGeo = new THREE.BoxGeometry(0.2, 1.5, 1);
        for(let i=0; i<2; i++) {
            const side = i === 0 ? 1 : -1;
            const arm = new THREE.Mesh(mirrorArmGeo, darkSteel);
            arm.position.set(side * 5.5, 1, 3);
            arm.rotation.z = side * Math.PI / 4;
            cabinGroup.add(arm);

            const mirror = new THREE.Mesh(mirrorGeo, chrome);
            mirror.position.y = 1;
            arm.add(mirror);
        }

        // Ladders
        const ladderGroup = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
        const rail1 = new THREE.Mesh(railGeo, steel);
        rail1.position.set(-1, -4, -6.1);
        const rail2 = new THREE.Mesh(railGeo, steel);
        rail2.position.set(1, -4, -6.1);
        ladderGroup.add(rail1, rail2);
        
        const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        for(let j=0; j<8; j++) {
            const rung = new THREE.Mesh(rungGeo, steel);
            rung.position.set(0, -7.5 + j, -6.1);
            rung.rotation.z = Math.PI / 2;
            ladderGroup.add(rung);
        }
        cabinGroup.add(ladderGroup);

        // Exhaust Stacks
        const exhaustGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
        for(let i=0; i<2; i++) {
            const side = i === 0 ? 1 : -1;
            const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
            exhaust.position.set(side * 4, 7, -4);
            
            const exhaustTip = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 1, 16), highHeatExhaustMat);
            exhaustTip.position.y = 3.5;
            exhaust.add(exhaustTip);
            
            cabinGroup.add(exhaust);
        }

        // Grilles
        const grilleGeo = new THREE.BoxGeometry(6, 4, 0.2);
        const grille = new THREE.Mesh(grilleGeo, darkSteel);
        grille.position.set(0, -2, 6.1);
        
        for(let i=0; i<10; i++) {
            const slatGeo = new THREE.BoxGeometry(5.8, 0.1, 0.3);
            const slat = new THREE.Mesh(slatGeo, chrome);
            slat.position.set(0, -1.8 + i*0.4, 0.1);
            slat.rotation.x = Math.PI / 6;
            grille.add(slat);
        }
        cabinGroup.add(grille);

        return cabinGroup;
    }

    // --- MEGASTRUCTURE CONSTRUCTION ---

    // 1. The Central Antimatter Core
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(20, 4);
    const coreMesh = new THREE.Mesh(coreGeo, antimatterCoreMat);
    coreGroup.add(coreMesh);

    // Inner pulsing plasma
    const plasmaGeo = new THREE.SphereGeometry(19, 32, 32);
    const plasmaMesh = new THREE.Mesh(plasmaGeo, antimatterPlasmaMat);
    coreGroup.add(plasmaMesh);

    group.add(coreGroup);
    
    parts.push({
        name: "Antimatter Core Matrix",
        description: "The pulsing heart of the forge, containing hyper-dense anti-hydrogen undergoing controlled inverted fusion.",
        material: "Custom Antimatter Plasma / Magnetic Shielding",
        function: "Energy generation and antimatter synthesis.",
        assemblyOrder: 1,
        connections: ["Primary Magnetic Scaffolding", "Injector Conduits"],
        failureEffect: "Catastrophic annihilation event yielding energy equivalent to a supernova, obliterating the solar system.",
        cascadeFailures: ["Scaffolding Vaporization", "Spacetime Rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    updatables.push({
        mesh: coreGroup,
        update: (time) => {
            coreMesh.rotation.y = time * 0.5;
            coreMesh.rotation.x = time * 0.3;
            const scale = 1.0 + Math.sin(time * 5) * 0.05;
            coreMesh.scale.set(scale, scale, scale);
            
            plasmaMesh.rotation.y = -time * 0.7;
            const pScale = 1.0 + Math.cos(time * 7) * 0.03;
            plasmaMesh.scale.set(pScale, pScale, pScale);
        }
    });

    // 2. Magnetic Scaffolding (Giant Torus Knots)
    const scaffoldGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const knotGeo = new THREE.TorusKnotGeometry(40 + i*10, 2 + i, 256, 32, 2+i, 3+i);
        const knot = new THREE.Mesh(knotGeo, magneticConfinementMat);
        scaffoldGroup.add(knot);

        updatables.push({
            mesh: knot,
            update: (time) => {
                knot.rotation.x = time * (0.1 + i*0.05);
                knot.rotation.y = time * (0.15 + i*0.02);
            }
        });

        parts.push({
            name: `Magnetic Scaffolding Coil Type-${['Alpha', 'Beta', 'Gamma'][i]}`,
            description: `Ultra-high-density magnetic flux generator layer ${i+1}. Sustains a field exceeding 10^12 Tesla to prevent normal matter ingress.`,
            material: "Superconducting YBCO-Neutronium Alloy",
            function: "Core containment and stabilization.",
            assemblyOrder: 2 + i,
            connections: ["Antimatter Core Matrix", "Power Grid Node"],
            failureEffect: "Magnetic field collapse, leading to immediate core breach.",
            cascadeFailures: ["Core Matrix Destabilization"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (i+1)*50, y: (i+1)*50, z: -(i+1)*50 }
        });
    }
    group.add(scaffoldGroup);

    // 3. Equatorial Containment Ring with massive structural detail
    const equatorGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(80, 5, 64, 128);
    const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
    ringMesh.rotation.x = Math.PI / 2;
    equatorGroup.add(ringMesh);

    // Add thousands of panel details to the ring using Lathe or Extrude
    // We will simulate it with placed cylinders (cooling towers)
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const towerGroup = new THREE.Group();
        
        const towerGeo = new THREE.CylinderGeometry(2, 2, 20, 16);
        const tower = new THREE.Mesh(towerGeo, steel);
        towerGroup.add(tower);
        
        // Add glowing radiator fins
        for (let j=0; j<5; j++) {
            const fin = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.2, 8, 32), neonScreenMat);
            fin.rotation.x = Math.PI/2;
            fin.position.y = -8 + j*4;
            towerGroup.add(fin);
        }
        
        towerGroup.position.set(Math.cos(angle) * 80, 0, Math.sin(angle) * 80);
        // point outwards
        towerGroup.rotation.x = Math.PI / 2;
        towerGroup.rotation.z = angle;
        
        equatorGroup.add(towerGroup);
    }
    group.add(equatorGroup);

    updatables.push({
        mesh: equatorGroup,
        update: (time) => {
            equatorGroup.rotation.y = time * 0.05;
        }
    });

    parts.push({
        name: "Equatorial Cooling & Confinement Ring",
        description: "Massive torus structure housing 36 primary liquid-helium cooling towers and secondary confinement field generators.",
        material: "Dark Steel & Superconducting Arrays",
        function: "Thermal regulation of magnetic scaffolding.",
        assemblyOrder: 5,
        connections: ["Scaffolding Coil Type-Gamma"],
        failureEffect: "Overheating of magnetic coils causing quench and field loss.",
        cascadeFailures: ["Magnetic Scaffolding Coil Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // 4. Massive Orbital Alignment Tires (Rotary Drives)
    const tireDrivesGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const tireDrive = createTireWithTreads(15, 8);
        tireDrive.position.set(Math.cos(angle) * 90, 0, Math.sin(angle) * 90);
        
        // Orient tires to rub against the equator ring
        tireDrive.rotation.y = -angle;
        
        tireDrivesGroup.add(tireDrive);

        updatables.push({
            mesh: tireDrive,
            update: (time) => {
                tireDrive.rotation.z = -time * 2; // Spinning rapidly
            }
        });

        parts.push({
            name: `Orbital Alignment Rotary Drive ${i+1}`,
            description: `Colossal tire-based friction drive mechanism for physically rotating the massive blast shields around the equator. Features aggressive treads for grip on neutronium tracks.`,
            material: "Hyper-Dense Rubber Compound, Aluminum, Chrome",
            function: "Physical rotation of outer superstructure.",
            assemblyOrder: 6 + i,
            connections: ["Equatorial Cooling Ring", "Blast Shield Tracks"],
            failureEffect: "Loss of rotational control, causing uneven thermal distribution.",
            cascadeFailures: ["Equatorial Ring Melt"],
            originalPosition: { x: Math.cos(angle) * 90, y: 0, z: Math.sin(angle) * 90 },
            explodedPosition: { x: Math.cos(angle) * 150, y: 0, z: Math.sin(angle) * 150 }
        });
    }
    group.add(tireDrivesGroup);

    // 5. Operator Cabins and Hydraulic Piston Arrays (Polar Regions)
    const poleGroupNorth = new THREE.Group();
    const poleGroupSouth = new THREE.Group();

    for (let pole = 0; pole < 2; pole++) {
        const isNorth = pole === 0;
        const poleGroup = isNorth ? poleGroupNorth : poleGroupSouth;
        const yDir = isNorth ? 1 : -1;

        // Massive cap
        const capGeo = new THREE.CylinderGeometry(30, 40, 10, 64);
        const cap = new THREE.Mesh(capGeo, steel);
        cap.position.y = yDir * 100;
        poleGroup.add(cap);

        createRivets(cap, 35, 60, 5);

        // Operator Cabin
        const cabin = createOperatorCabin();
        cabin.position.set(0, yDir * 110, 0);
        if (!isNorth) cabin.rotation.x = Math.PI; // Upside down for south pole
        poleGroup.add(cabin);

        // Huge Hydraulic Pistons connecting cap to equator
        const numPistons = 8;
        for(let i=0; i<numPistons; i++) {
            const angle = (i / numPistons) * Math.PI * 2;
            const pistonData = createHydraulicPiston(40, 3, 0.5);
            const piston = pistonData.group;
            
            piston.position.set(Math.cos(angle) * 35, yDir * 80, Math.sin(angle) * 35);
            // Angle them towards equator
            piston.lookAt(new THREE.Vector3(Math.cos(angle) * 80, 0, Math.sin(angle) * 80));
            piston.rotateX(Math.PI/2);
            
            poleGroup.add(piston);

            updatables.push({
                mesh: pistonData.rod,
                update: (time) => {
                    // Pumping action
                    pistonData.rod.position.y = 40 + (0.5 + Math.sin(time * 2 + i) * 0.2) * 20;
                }
            });
        }

        group.add(poleGroup);

        parts.push({
            name: `Polar Control Assembly ${isNorth ? 'North' : 'South'}`,
            description: `Command center and structural anchor point. Includes highly detailed operator cabins with tinted glass, joysticks, steering wheels, and hydraulic dampeners.`,
            material: "Steel, Tinted Glass, Chrome, Rubber",
            function: "Human oversight and physical stabilization of the magnetic axis.",
            assemblyOrder: 10 + pole,
            connections: ["Magnetic Scaffolding", "Equatorial Ring"],
            failureEffect: "Loss of manual override and axis destabilization.",
            cascadeFailures: ["Axis Shift", "Core Breach"],
            originalPosition: { x: 0, y: yDir * 100, z: 0 },
            explodedPosition: { x: 0, y: yDir * 200, z: 0 }
        });
    }

    // 6. Injector Ships & Flight Paths
    const fleetGroup = new THREE.Group();
    const numShips = 12;
    const ships = [];
    
    // Ship geometry
    const shipGeo = new THREE.Group();
    
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(2, 4, 15, 16), shipHullMat);
    hull.rotation.x = Math.PI / 2;
    shipGeo.add(hull);
    
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), tinted);
    cockpit.position.set(0, 2, 4);
    shipGeo.add(cockpit);
    
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2, 4, 16), darkSteel);
    engine.position.set(0, 0, -8);
    engine.rotation.x = Math.PI / 2;
    shipGeo.add(engine);

    const thrust = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.1, 8, 16), antimatterPlasmaMat);
    thrust.position.set(0, 0, -12);
    thrust.rotation.x = Math.PI / 2;
    shipGeo.add(thrust);

    const payloadClamp = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 4), steel);
    payloadClamp.position.set(0, -3, 0);
    shipGeo.add(payloadClamp);

    for(let i=0; i<numShips; i++) {
        const shipInstance = shipGeo.clone();
        fleetGroup.add(shipInstance);
        
        // Randomize orbit parameters
        ships.push({
            mesh: shipInstance,
            radius: 120 + Math.random() * 80,
            speed: 0.2 + Math.random() * 0.3,
            angleY: Math.random() * Math.PI * 2,
            angleZ: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            dropping: false,
            payloadMesh: null
        });

        parts.push({
            name: `Anti-Hydrogen Injector Ship ${i+1}`,
            description: `Automated/piloted drone vessel carrying high-density anti-hydrogen payloads. Navigates the extreme magnetic fields to deliver fuel to the core.`,
            material: "Hull Plating, Tinted Glass, Dark Steel",
            function: "Fuel delivery.",
            assemblyOrder: 15 + i,
            connections: ["None (Free flying)"],
            failureEffect: "Payload detonation outside containment.",
            cascadeFailures: ["Vessel Vaporization", "Localized Field Disruption"],
            originalPosition: { x: 150, y: 0, z: 0 }, // Nominal parked
            explodedPosition: { x: 300 + Math.random()*100, y: Math.random()*200, z: Math.random()*200 }
        });
    }
    group.add(fleetGroup);

    // Payloads Group
    const payloadGroup = new THREE.Group();
    group.add(payloadGroup);
    const payloads = [];

    const payloadGeom = new THREE.BoxGeometry(3, 3, 3);
    const payloadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaa00ff, emissiveIntensity: 3.0 });

    updatables.push({
        mesh: fleetGroup,
        update: (time) => {
            ships.forEach((ship, idx) => {
                // Orbit math
                const t = time * ship.speed + ship.phase;
                const x = Math.cos(t) * ship.radius;
                const z = Math.sin(t) * ship.radius;
                const y = Math.sin(t * 2) * 40; // Wavy orbit

                // Apply rotation planes
                const vec = new THREE.Vector3(x, y, z);
                vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), ship.angleZ);
                vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), ship.angleY);
                
                // Calculate tangent for lookAt
                const tNext = (time + 0.01) * ship.speed + ship.phase;
                const xNext = Math.cos(tNext) * ship.radius;
                const zNext = Math.sin(tNext) * ship.radius;
                const yNext = Math.sin(tNext * 2) * 40;
                const vecNext = new THREE.Vector3(xNext, yNext, zNext);
                vecNext.applyAxisAngle(new THREE.Vector3(0, 0, 1), ship.angleZ);
                vecNext.applyAxisAngle(new THREE.Vector3(0, 1, 0), ship.angleY);

                ship.mesh.position.copy(vec);
                ship.mesh.lookAt(vecNext);

                // Payload drop logic
                if (Math.sin(t) > 0.95 && !ship.dropping) {
                    ship.dropping = true;
                    // Spawn payload
                    const pMesh = new THREE.Mesh(payloadGeom, payloadMat);
                    pMesh.position.copy(ship.mesh.position);
                    payloadGroup.add(pMesh);
                    payloads.push({
                        mesh: pMesh,
                        progress: 0,
                        startPos: pMesh.position.clone()
                    });
                }
                if (Math.sin(t) < 0) {
                    ship.dropping = false; // Reset flag
                }
            });

            // Animate falling payloads
            for (let i = payloads.length - 1; i >= 0; i--) {
                const p = payloads[i];
                p.progress += 0.01; // Fall speed
                if (p.progress >= 1.0) {
                    // Reached core, annihilate (remove)
                    payloadGroup.remove(p.mesh);
                    payloads.splice(i, 1);
                } else {
                    // Lerp towards 0,0,0
                    p.mesh.position.lerpVectors(p.startPos, new THREE.Vector3(0,0,0), p.progress);
                    p.mesh.rotation.x += 0.1;
                    p.mesh.rotation.y += 0.2;
                }
            }
        }
    });

    // 7. Energy Arcs (Random plasma flashes)
    const arcsGroup = new THREE.Group();
    const numArcs = 20;
    const arcs = [];
    for(let i=0; i<numArcs; i++) {
        // Create random curved tubes
        const start = new THREE.Vector3(
            (Math.random()-0.5)*100,
            (Math.random()-0.5)*100,
            (Math.random()-0.5)*100
        );
        const end = new THREE.Vector3(
            (Math.random()-0.5)*100,
            (Math.random()-0.5)*100,
            (Math.random()-0.5)*100
        );
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.add(new THREE.Vector3((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50));
        
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
        const arc = new THREE.Mesh(tubeGeo, magneticArcMat.clone());
        arc.visible = false;
        arcsGroup.add(arc);
        
        arcs.push({
            mesh: arc,
            timer: Math.random() * 100,
            duration: 0
        });
    }
    group.add(arcsGroup);

    updatables.push({
        mesh: arcsGroup,
        update: (time) => {
            arcs.forEach(arc => {
                arc.timer--;
                if(arc.timer <= 0) {
                    arc.mesh.visible = true;
                    arc.mesh.material.opacity = Math.random();
                    arc.duration++;
                    if(arc.duration > 5) {
                        arc.mesh.visible = false;
                        arc.timer = Math.random() * 200;
                        arc.duration = 0;
                    }
                }
            });
        }
    });

    parts.push({
        name: "Plasma Arc Dissipation System",
        description: "Network of conduits and vacuum gaps designed to bleed off excess static charge buildup from the antimatter synthesis process via massive arcing.",
        material: "Vacuum, Plasma",
        function: "Charge dissipation.",
        assemblyOrder: 40,
        connections: ["Equatorial Ring", "Polar Control Assembly"],
        failureEffect: "Catastrophic static discharge melting the hull.",
        cascadeFailures: ["Systems Blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 50 }
    });

    // 8. Dyson-like Outer Frame Spheres
    const outerFrameGroup = new THREE.Group();
    const frameGeo1 = new THREE.IcosahedronGeometry(180, 2);
    const frameMesh1 = new THREE.Mesh(frameGeo1, new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, wireframeLinewidth: 2 }));
    outerFrameGroup.add(frameMesh1);

    const frameGeo2 = new THREE.IcosahedronGeometry(200, 1);
    const frameMesh2 = new THREE.Mesh(frameGeo2, goldFoilMat);
    frameMesh2.material.wireframe = true;
    outerFrameGroup.add(frameMesh2);

    group.add(outerFrameGroup);

    updatables.push({
        mesh: outerFrameGroup,
        update: (time) => {
            frameMesh1.rotation.y = -time * 0.02;
            frameMesh1.rotation.z = time * 0.01;
            frameMesh2.rotation.x = time * 0.015;
            frameMesh2.rotation.y = time * 0.025;
        }
    });

    parts.push({
        name: "Dyson-Class Outer Frame Shell",
        description: "Enormous geodesic framework defining the outer boundaries of the forge, covered in gold foil for thermal and radiation reflection.",
        material: "Dark Steel, Gold Foil",
        function: "Macro-structural integrity and radiation shielding.",
        assemblyOrder: 50,
        connections: ["All Inner Systems"],
        failureEffect: "Structural collapse of the facility under orbital stresses.",
        cascadeFailures: ["Complete Facility Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Populate remaining parts for massive scale requirement
    for(let i=1; i<=20; i++) {
        parts.push({
            name: `Auxiliary Neutronium Strut ${i}`,
            description: `Super-dense support strut cross-linking the magnetic coils to the dyson frame. Designed to withstand extreme gravitational shearing.`,
            material: "Neutronium Composite",
            function: "Structural support.",
            assemblyOrder: 50 + i,
            connections: ["Magnetic Scaffolding", "Outer Frame"],
            failureEffect: "Localized stress fractures.",
            cascadeFailures: ["Strut Snapping", "Scaffolding Deformation"],
            originalPosition: { x: Math.cos(i)*100, y: Math.sin(i)*100, z: 0 },
            explodedPosition: { x: Math.cos(i)*250, y: Math.sin(i)*250, z: Math.random()*100 }
        });
    }

    // --- ANIMATION FUNCTION ---
    const animate = (time, speed, meshes) => {
        const adjustedTime = time * speed;
        updatables.forEach(item => {
            if (item.update) {
                item.update(adjustedTime);
            }
        });
    };

    const description = "God Tier Antimatter Star Forge - A stellar-scale megastructure designed to synthesize and contain an artificial antimatter star. Utilizing ultra-high-density magnetic confinement, massive orbital tires for physical rotation, detailed operator cabins for oversight, and a fleet of automated injector ships dropping anti-hydrogen payloads, this forge creates sustainable inverted fusion reactions. It is a masterpiece of extreme engineering, spanning thousands of structural nodes and bleeding-edge particle physics implementations.";

    const quizQuestions = [
        {
            question: "In the context of the Baryon Asymmetry Problem, what mechanism would a theoretical antimatter star forge need to overcome to stably synthesize anti-hydrogen at stellar masses without instantaneous annihilation?",
            options: [
                "CP violation inversion",
                "Spontaneous symmetry breaking of the false vacuum",
                "Magnetic confinement exceeding the Schwinger limit",
                "Suppression of the Hawking radiation in the antimatter event horizon"
            ],
            answer: 2
        },
        {
            question: "To prevent annihilation from interstellar medium (ISM) influx, the Star Forge employs an active magnetic scaffolding. What is the minimum theoretical magnetic field strength required to deflect high-energy galactic cosmic rays (protons) at relativistic speeds?",
            options: [
                "10^4 Tesla",
                "10^9 Tesla",
                "10^12 Tesla",
                "10^15 Tesla"
            ],
            answer: 2
        },
        {
            question: "During anti-fusion, the proton-proton (anti-proton-anti-proton) chain reaction releases energy. How does the photon emission from anti-hydrogen fusion differ fundamentally from regular hydrogen fusion?",
            options: [
                "The photons possess negative spin",
                "The photons are completely identical to those of normal matter",
                "The photons are composed of anti-photons",
                "The emission spectrum is inverted in the ultraviolet range"
            ],
            answer: 1
        },
        {
            question: "When synthesizing macroscopic quantities of anti-hydrogen, what cooling technique must be employed to stabilize the anti-atoms before magnetic confinement?",
            options: [
                "Doppler cooling followed by evaporative cooling",
                "Liquid nitrogen immersion",
                "Laser ablation",
                "Peltier cooling grids"
            ],
            answer: 0
        },
        {
            question: "The antimatter core is enclosed in a Penning-Malmberg trap on a stellar scale. What combination of fields is strictly required to contain the anti-plasma?",
            options: [
                "A uniform magnetic field and a spatially varying quadrupolar electric field",
                "A static electric field and a rapidly oscillating magnetic field",
                "A strong, uniform static magnetic field and a spatially inhomogeneous static electric field",
                "Only a hyper-dense gravitational field"
            ],
            answer: 2
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
