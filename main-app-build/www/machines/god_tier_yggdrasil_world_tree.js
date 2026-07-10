import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * YGGDRASIL BIOLOGICAL MEGASTRUCTURE (GOD TIER)
 * An ultra high-tech, hyper-realistic, planetary-scale bio-mechanical organism.
 * Features:
 * - Molten Core Anchor
 * - Recursive Geothermal Root Network
 * - Stratospheric Bio-Elevator Trunk
 * - Orbital Hubs & Zero-G Docking
 * - Massive Biosphere Domes
 * - Hyper-detailed Hydraulic Joints
 * - Instanced City Blocks & Solar Leaves
 * - Bioluminescent Sap Veins
 * - Transport Fleets
 */
export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // ==========================================
    // CUSTOM MATERIALS & ENHANCEMENTS
    // ==========================================
    
    const barkMaterial = new THREE.MeshStandardMaterial({
        color: 0x2b1e16,
        roughness: 0.95,
        metalness: 0.1,
        wireframe: false,
        flatShading: false
    });

    const glowingSapMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const magmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.8,
        roughness: 0.6,
        metalness: 0.3
    });

    const domeGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.0,
        transmission: 1.0,
        ior: 1.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const leafMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00fa44,
        emissive: 0x003311,
        roughness: 0.3,
        metalness: 0.2,
        transmission: 0.4,
        thickness: 0.1,
        side: THREE.DoubleSide
    });

    const structuralSteel = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.4,
        metalness: 0.8
    });

    const goldTrim = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 1.0
    });

    const arcologyMat1 = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.9 });
    const arcologyMat2 = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.7 });
    
    // Animation state tracking
    const animState = {
        time: 0,
        core: null,
        magmaChunks: [],
        sapVeins: [],
        branches: [],
        leaves: null, // InstancedMesh
        elevators: [],
        satellites: [],
        ships: null, // InstancedMesh
        hydraulicPistons: []
    };

    // ==========================================
    // PROCEDURAL GEOMETRY GENERATORS
    // ==========================================

    // 1. Planetary Core & Roots
    function buildCoreAndRoots() {
        // Massive Core
        const coreGeom = new THREE.IcosahedronGeometry(120, 5);
        const core = new THREE.Mesh(coreGeom, magmaMaterial);
        core.position.set(0, -500, 0);
        group.add(core);
        animState.core = core;

        parts.push({
            name: "Planetary Dynamo Core",
            description: "The molten heart of the planet, tapped directly by Yggdrasil for immense geothermal and magneto-hydrodynamic energy.",
            material: "Plasma / Liquid Iron",
            function: "Primary Power Generation",
            assemblyOrder: 1,
            connections: ["Geothermal Root Network"],
            failureEffect: "Total energy blackout",
            cascadeFailures: ["Atmospheric dome collapse", "Grav-plating failure"],
            originalPosition: { x: 0, y: -500, z: 0 },
            explodedPosition: { x: 0, y: -800, z: 0 }
        });

        // Floating Magma Crust
        const crustGeom = new THREE.DodecahedronGeometry(20, 2);
        for(let i=0; i<40; i++) {
            const crust = new THREE.Mesh(crustGeom, darkSteel);
            const phi = Math.acos( -1 + ( 2 * i ) / 40 );
            const theta = Math.sqrt( 40 * Math.PI ) * phi;
            const r = 125 + Math.random()*10;
            crust.position.set(
                r * Math.cos(theta) * Math.sin(phi),
                -500 + r * Math.sin(theta) * Math.sin(phi),
                r * Math.cos(phi)
            );
            crust.lookAt(core.position);
            
            // Random scaling
            crust.scale.set(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5);
            group.add(crust);
            
            animState.magmaChunks.push({
                mesh: crust,
                orbitAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
                orbitSpeed: 0.01 + Math.random()*0.02,
                radius: r
            });
        }

        // Roots (Fractal Generation)
        function createRoots(startPt, dir, length, radius, depth, maxDepth) {
            if (depth === 0) return;

            const endPt = startPt.clone().add(dir.clone().multiplyScalar(length));
            
            // Curve with slight randomness
            const midPt = startPt.clone().lerp(endPt, 0.5).add(
                new THREE.Vector3((Math.random()-0.5)*length*0.2, (Math.random()-0.5)*length*0.2, (Math.random()-0.5)*length*0.2)
            );

            const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
            const rootGeom = new THREE.TubeGeometry(curve, 16, radius, 8, false);
            const root = new THREE.Mesh(rootGeom, barkMaterial);
            group.add(root);

            if (depth === maxDepth) {
                parts.push({
                    name: `Primary Mantle Anchor ${Math.floor(Math.random()*1000)}`,
                    description: "Massive bio-cable penetrating the lithosphere, absorbing thermal energy.",
                    material: "Bio-Carbon Bark",
                    function: "Stabilization and Thermal Intake",
                    assemblyOrder: 2,
                    connections: ["Core", "Lower Trunk"],
                    failureEffect: "Geological instability",
                    cascadeFailures: ["Trunk shear", "Mantle rupture"],
                    originalPosition: midPt,
                    explodedPosition: { x: midPt.x * 1.5, y: midPt.y - 100, z: midPt.z * 1.5 }
                });
            }

            // Bioluminescent nodes on roots
            if (depth < maxDepth && Math.random() > 0.3) {
                const nodeGeom = new THREE.SphereGeometry(radius * 1.5, 16, 16);
                const node = new THREE.Mesh(nodeGeom, glowingSapMaterial);
                node.position.copy(endPt);
                group.add(node);
            }

            // Spawn child roots
            const numChildren = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numChildren; i++) {
                const spread = Math.PI / 4;
                const axis = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
                const childDir = dir.clone().applyAxisAngle(axis, (Math.random()-0.5)*spread).normalize();
                createRoots(endPt, childDir, length * 0.7, radius * 0.6, depth - 1, maxDepth);
            }
        }

        // Start 6 primary roots
        const rootDirs = [
            new THREE.Vector3(1, -1, 0).normalize(),
            new THREE.Vector3(-1, -1, 0).normalize(),
            new THREE.Vector3(0, -1, 1).normalize(),
            new THREE.Vector3(0, -1, -1).normalize(),
            new THREE.Vector3(0.7, -1, 0.7).normalize(),
            new THREE.Vector3(-0.7, -1, -0.7).normalize()
        ];
        
        rootDirs.forEach(dir => {
            createRoots(new THREE.Vector3(0, -50, 0), dir, 200, 30, 4, 4);
        });
    }

    // 2. Trunk, Ribs, and Space Elevator Tracks
    function buildTrunk() {
        // Main Trunk
        const trunkPoints = [];
        for(let y= -50; y <= 1000; y += 50) {
            // Tapering logic
            let radius = 100;
            if (y > 200) radius = 100 - (y - 200) * 0.05;
            if (radius < 40) radius = 40;
            trunkPoints.push(new THREE.Vector2(radius, y));
        }
        
        const trunkGeom = new THREE.LatheGeometry(trunkPoints, 64);
        const trunk = new THREE.Mesh(trunkGeom, barkMaterial);
        group.add(trunk);

        parts.push({
            name: "Geostationary Bio-Elevator Trunk",
            description: "A 1000km hyper-structure forming the central pillar of Yggdrasil, constructed of living carbon-nanotube lattices.",
            material: "Bio-Carbon Bark / Nanotubes",
            function: "Primary Support and Logistics Artery",
            assemblyOrder: 10,
            connections: ["Roots", "Orbital Hub"],
            failureEffect: "Complete structural collapse",
            cascadeFailures: ["Planetary extinction event"],
            originalPosition: { x: 0, y: 400, z: 0 },
            explodedPosition: { x: -300, y: 400, z: 0 }
        });

        // Structural Steel Ribs
        const ribShape = new THREE.Shape();
        ribShape.moveTo(0, 0);
        ribShape.lineTo(20, 0);
        ribShape.lineTo(15, 60);
        ribShape.lineTo(5, 60);
        ribShape.lineTo(0, 0);

        const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 1, bevelThickness: 1 };
        const ribGeom = new THREE.ExtrudeGeometry(ribShape, extrudeSettings);

        // Place ribs around the trunk
        for (let y = 0; y < 900; y += 150) {
            const currentRadius = y > 200 ? 100 - (y - 200) * 0.05 : 100;
            const actualRadius = Math.max(currentRadius, 40);

            for (let i = 0; i < 8; i++) {
                const rib = new THREE.Mesh(ribGeom, structuralSteel);
                const angle = (i / 8) * Math.PI * 2;
                
                rib.position.set(
                    Math.cos(angle) * (actualRadius - 5),
                    y,
                    Math.sin(angle) * (actualRadius - 5)
                );
                
                rib.rotation.y = -angle + Math.PI/2;
                rib.rotation.x = Math.PI/2; // Lay flat vertically
                
                group.add(rib);
            }
            
            // Add a reinforcement ring
            const ringGeom = new THREE.TorusGeometry(actualRadius + 15, 8, 16, 64);
            const ring = new THREE.Mesh(ringGeom, goldTrim);
            ring.position.set(0, y + 30, 0);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            
            parts.push({
                name: `Stratospheric Reinforcement Ring (Alt: ${y}m)`,
                description: "Massive tension rings counteracting internal pressure and rotational shear.",
                material: "Titanium-Gold Alloy",
                function: "Shear Mitigation",
                assemblyOrder: 11 + (y/150),
                connections: ["Trunk"],
                failureEffect: "Trunk buckling",
                cascadeFailures: ["Elevator track misalignment"],
                originalPosition: { x: 0, y: y+30, z: 0 },
                explodedPosition: { x: 0, y: y+30, z: 200 }
            });
        }

        // Elevator Tracks & Pods
        const trackAngles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
        trackAngles.forEach((angle, idx) => {
            // Track rail
            const trackGeom = new THREE.BoxGeometry(10, 1000, 10);
            const track = new THREE.Mesh(trackGeom, steel);
            // Position dynamically relative to radius, but we'll approximate a straight line for the track outside the max radius
            track.position.set(Math.cos(angle)*110, 450, Math.sin(angle)*110);
            group.add(track);

            // Generate pods
            for(let p=0; p<5; p++) {
                const podGroup = new THREE.Group();
                
                const podBody = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 30, 16), chrome);
                podBody.rotation.x = Math.PI/2;
                podGroup.add(podBody);

                const podNose = new THREE.Mesh(new THREE.ConeGeometry(8, 15, 16), glass);
                podNose.position.z = 22.5;
                podNose.rotation.x = Math.PI/2;
                podGroup.add(podNose);

                const podTail = new THREE.Mesh(new THREE.ConeGeometry(8, 10, 16), darkSteel);
                podTail.position.z = -20;
                podTail.rotation.x = -Math.PI/2;
                podGroup.add(podTail);
                
                podGroup.position.set(Math.cos(angle)*120, 100 + Math.random()*800, Math.sin(angle)*120);
                podGroup.rotation.y = -angle; // Face outward or up
                podGroup.rotation.x = Math.PI/2; // Point up
                
                group.add(podGroup);
                
                animState.elevators.push({
                    mesh: podGroup,
                    trackAngle: angle,
                    speed: 1.5 + Math.random()*1.0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    radius: 120
                });
            }
        });

        parts.push({
            name: "Hyper-Cavitation Elevator Pod Array",
            description: "Sleek transit vessels accelerating at 10G to move matter from the surface to the orbital hub.",
            material: "Chrome / Plasteel",
            function: "Vertical Transit",
            assemblyOrder: 25,
            connections: ["Elevator Tracks"],
            failureEffect: "Logistics halt",
            cascadeFailures: ["Biosphere starvation"],
            originalPosition: { x: 120, y: 500, z: 0 },
            explodedPosition: { x: 400, y: 500, z: 0 }
        });
    }

    // 3. Orbital Hub
    function buildOrbitalHub() {
        const hubY = 1000;
        
        // Massive Central Ring
        const ringGeom = new THREE.TorusGeometry(200, 40, 64, 128);
        const ring = new THREE.Mesh(ringGeom, structuralSteel);
        ring.position.set(0, hubY, 0);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // Spokes
        for (let i = 0; i < 8; i++) {
            const spokeGeom = new THREE.CylinderGeometry(10, 10, 200, 16);
            const spoke = new THREE.Mesh(spokeGeom, steel);
            const angle = (i / 8) * Math.PI * 2;
            spoke.position.set(Math.cos(angle)*100, hubY, Math.sin(angle)*100);
            spoke.rotation.z = Math.PI / 2;
            spoke.rotation.y = -angle;
            group.add(spoke);
        }

        // Docking Bays
        for (let i = 0; i < 16; i++) {
            const bayGeom = new THREE.BoxGeometry(30, 20, 40);
            const bay = new THREE.Mesh(bayGeom, darkSteel);
            const angle = (i / 16) * Math.PI * 2;
            bay.position.set(Math.cos(angle)*240, hubY, Math.sin(angle)*240);
            bay.lookAt(new THREE.Vector3(0, hubY, 0));
            group.add(bay);
        }

        parts.push({
            name: "Geostationary Orbital Hub Prime",
            description: "The crown of the trunk. Houses spaceports, zero-G manufacturing, and military defense coordination.",
            material: "Structural Steel / Dark Steel",
            function: "Spaceport and Canopy Anchor",
            assemblyOrder: 30,
            connections: ["Upper Trunk", "Canopy Branches"],
            failureEffect: "Loss of exo-planetary capability",
            cascadeFailures: ["Transport fleet grounding"],
            originalPosition: { x: 0, y: hubY, z: 0 },
            explodedPosition: { x: 0, y: hubY + 200, z: 0 }
        });
    }

    // 4. Canopy & Biospheres
    function buildCanopy() {
        const hubY = 1000;
        const branchAngles = [];
        for (let i = 0; i < 6; i++) branchAngles.push((i / 6) * Math.PI * 2);

        // Recursive branch function
        function createBranch(parent, startPt, dir, length, radius, depth, phaseBase) {
            if (depth === 0) {
                // Terminal point: create a biosphere
                createBiosphere(startPt, phaseBase);
                return;
            }

            const endPt = startPt.clone().add(dir.clone().multiplyScalar(length));
            
            // Add droop or lift based on depth
            const controlPt = startPt.clone().lerp(endPt, 0.5);
            controlPt.y += (depth === 3) ? 100 : (depth === 2 ? 50 : -20);

            const curve = new THREE.CatmullRomCurve3([startPt, controlPt, endPt]);
            const branchGeom = new THREE.TubeGeometry(curve, 32, radius, 12, false);
            const branch = new THREE.Mesh(branchGeom, barkMaterial);
            parent.add(branch);

            // Add hydraulic joint at startPt
            createHydraulicJoint(startPt, dir, radius * 1.5);

            // Add glowing nodes along the branch
            const nodeGeom = new THREE.SphereGeometry(radius * 0.8, 16, 16);
            const node = new THREE.Mesh(nodeGeom, glowingSapMaterial);
            node.position.copy(controlPt);
            parent.add(node);

            animState.branches.push({
                mesh: branch,
                controlPt: controlPt,
                endPt: endPt,
                baseControlPt: controlPt.clone(),
                baseEndPt: endPt.clone(),
                phase: phaseBase + depth,
                length: length
            });

            if (depth === 3) {
                parts.push({
                    name: `Primary Canopy Branch Sector ${phaseBase.toFixed(2)}`,
                    description: "Massive biological outcropping supporting entire city-states.",
                    material: "Bio-Carbon Bark",
                    function: "Structural Support",
                    assemblyOrder: 40 + phaseBase,
                    connections: ["Orbital Hub"],
                    failureEffect: "Sector collapse",
                    cascadeFailures: ["Biosphere destruction"],
                    originalPosition: controlPt,
                    explodedPosition: { x: controlPt.x * 1.5, y: controlPt.y + 100, z: controlPt.z * 1.5 }
                });
            }

            // Spawn children
            const numChildren = 2;
            for (let i = 0; i < numChildren; i++) {
                const spread = Math.PI / 4;
                const axis = new THREE.Vector3(Math.random()-0.5, 1, Math.random()-0.5).normalize();
                const childDir = dir.clone().applyAxisAngle(axis, (i === 0 ? spread : -spread)).normalize();
                // Ensure they trend outwards and slightly up/down
                childDir.y += (Math.random() - 0.3) * 0.5;
                childDir.normalize();
                
                createBranch(parent, endPt, childDir, length * 0.7, radius * 0.6, depth - 1, phaseBase + i);
            }
        }

        // Start Branches
        branchAngles.forEach((angle, idx) => {
            const dir = new THREE.Vector3(Math.cos(angle), 0.2, Math.sin(angle)).normalize();
            const startPt = new THREE.Vector3(Math.cos(angle)*200, hubY, Math.sin(angle)*200);
            createBranch(group, startPt, dir, 400, 30, 3, idx);
        });
    }

    // 5. Hydraulic Joints
    function createHydraulicJoint(position, direction, size) {
        const jointGroup = new THREE.Group();
        jointGroup.position.copy(position);
        
        // Orient the joint to face the direction
        const target = position.clone().add(direction);
        jointGroup.lookAt(target);

        // Collar
        const collarGeom = new THREE.TorusGeometry(size, size*0.3, 16, 32);
        const collar = new THREE.Mesh(collarGeom, structuralSteel);
        jointGroup.add(collar);

        // Pistons
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            
            // Outer Cylinder
            const outerGeom = new THREE.CylinderGeometry(size*0.15, size*0.15, size*2, 16);
            const outer = new THREE.Mesh(outerGeom, darkSteel);
            outer.position.set(Math.cos(angle)*size, 0, Math.sin(angle)*size);
            outer.rotation.x = Math.PI/2;
            jointGroup.add(outer);

            // Inner Piston
            const innerGeom = new THREE.CylinderGeometry(size*0.08, size*0.08, size*2, 16);
            const inner = new THREE.Mesh(innerGeom, chrome);
            inner.position.set(Math.cos(angle)*size, 0, Math.sin(angle)*size);
            inner.position.z += size; // Push out
            inner.rotation.x = Math.PI/2;
            jointGroup.add(inner);

            animState.hydraulicPistons.push({
                mesh: inner,
                baseZ: inner.position.z,
                phase: Math.random() * Math.PI * 2,
                amplitude: size * 0.3
            });
        }

        group.add(jointGroup);
    }

    // 6. Biosphere Domes with Instanced Cities
    function createBiosphere(position, id) {
        const domeGroup = new THREE.Group();
        domeGroup.position.copy(position);

        // Base Plate
        const baseGeom = new THREE.CylinderGeometry(80, 70, 20, 64);
        const base = new THREE.Mesh(baseGeom, structuralSteel);
        domeGroup.add(base);

        // Glass Dome
        const domeGeom = new THREE.SphereGeometry(80, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
        const dome = new THREE.Mesh(domeGeom, domeGlassMaterial);
        dome.position.y = 10;
        domeGroup.add(dome);

        // Inner Atmosphere Glow
        const atmosGeom = new THREE.SphereGeometry(78, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
        const atmosMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.1, side: THREE.BackSide });
        const atmos = new THREE.Mesh(atmosGeom, atmosMat);
        atmos.position.y = 10;
        domeGroup.add(atmos);

        // Central Arcology Tower
        const towerGeom = new THREE.LatheGeometry([
            new THREE.Vector2(20, 0),
            new THREE.Vector2(15, 30),
            new THREE.Vector2(5, 70),
            new THREE.Vector2(0, 75)
        ], 16);
        const tower = new THREE.Mesh(towerGeom, goldTrim);
        tower.position.y = 10;
        domeGroup.add(tower);

        // Instanced City Blocks
        const numBlocks = 150;
        const blockGeom1 = new THREE.BoxGeometry(4, 1, 4);
        const blockGeom2 = new THREE.CylinderGeometry(2, 2, 1, 8);
        
        const instancedMesh1 = new THREE.InstancedMesh(blockGeom1, arcologyMat1, numBlocks);
        const instancedMesh2 = new THREE.InstancedMesh(blockGeom2, arcologyMat2, numBlocks);

        const dummy = new THREE.Object3D();

        for (let i = 0; i < numBlocks; i++) {
            const r = 10 + Math.random() * 65;
            const theta = Math.random() * Math.PI * 2;
            const h = 5 + Math.random() * 25;

            dummy.position.set(r * Math.cos(theta), 10 + h/2, r * Math.sin(theta));
            dummy.scale.set(1, h, 1);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();

            if (i % 2 === 0) {
                instancedMesh1.setMatrixAt(i, dummy.matrix);
            } else {
                instancedMesh2.setMatrixAt(i, dummy.matrix);
            }
        }

        domeGroup.add(instancedMesh1);
        domeGroup.add(instancedMesh2);

        group.add(domeGroup);

        parts.push({
            name: `Biosphere Arcology ${id}`,
            description: "A colossal enclosed habitat providing a perfect Earth-like climate for millions of citizens.",
            material: "Transparent Aluminum / Permacrete",
            function: "Civilian Habitation",
            assemblyOrder: 70 + id,
            connections: ["Terminal Branch"],
            failureEffect: "Complete depressurization",
            cascadeFailures: ["Mass casualty event"],
            originalPosition: position,
            explodedPosition: { x: position.x, y: position.y + 150, z: position.z }
        });
    }

    // 7. Sap Vein Network (Splines)
    function buildSapVeins() {
        const numVeins = 8;
        for (let v = 0; v < numVeins; v++) {
            const points = [];
            // Spiraling up from roots to hub
            for (let y = -200; y <= 1000; y += 50) {
                let radius = 105;
                if (y > 200) radius = 105 - (y - 200) * 0.05;
                if (radius < 45) radius = 45;

                const angle = (y * 0.015) + (v * (Math.PI * 2 / numVeins));
                
                // Add some organic noise
                const noise = Math.sin(y * 0.1 + v) * 5;
                
                points.push(new THREE.Vector3(
                    Math.cos(angle) * (radius + noise),
                    y,
                    Math.sin(angle) * (radius + noise)
                ));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const veinGeom = new THREE.TubeGeometry(curve, 128, 4, 8, false);
            const vein = new THREE.Mesh(veinGeom, glowingSapMaterial);
            group.add(vein);
            
            animState.sapVeins.push(vein);
        }

        parts.push({
            name: "Bioluminescent Sap Vascular Network",
            description: "Arteries carrying nutrient-rich, photoluminescent plasma that feeds the entire megastructure and transmits quantum data.",
            material: "Organic Polymer / Plasmatic Fluid",
            function: "Nutrient Distribution and Data Transmission",
            assemblyOrder: 85,
            connections: ["Roots", "Trunk", "Branches"],
            failureEffect: "Cellular necrosis of the structure",
            cascadeFailures: ["Loss of data cohesion", "Structural rot"],
            originalPosition: { x: 100, y: 500, z: 0 },
            explodedPosition: { x: 250, y: 500, z: 0 }
        });
    }

    // 8. Solar Leaf Array (Instanced)
    function buildLeaves() {
        const numLeaves = 10000;
        const leafGeo = new THREE.PlaneGeometry(15, 40, 4, 4);
        
        // Slightly curve the leaf
        const pos = leafGeo.attributes.position;
        for(let i=0; i<pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            pos.setZ(i, Math.sin(x * 0.2) * 2 - (y * y * 0.002));
        }
        leafGeo.computeVertexNormals();

        const instancedLeaves = new THREE.InstancedMesh(leafGeo, leafMaterial, numLeaves);
        const dummy = new THREE.Object3D();

        const leafData = []; // Store base transforms for animation

        for (let i = 0; i < numLeaves; i++) {
            // Cluster around the canopy height (1000 - 1500)
            const r = 200 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const y = 1000 + Math.random() * 500 - (r * 0.2); // Form a dome shape

            const pos = new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta));
            dummy.position.copy(pos);
            
            // Orient somewhat towards an imaginary sun (e.g., straight up)
            dummy.lookAt(pos.clone().add(new THREE.Vector3(0, 100, 0)));
            dummy.rotation.z += (Math.random() - 0.5);
            dummy.rotation.x += (Math.random() - 0.5) * 0.5;
            
            const scale = 0.5 + Math.random() * 1.5;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            instancedLeaves.setMatrixAt(i, dummy.matrix);

            leafData.push({
                pos: pos,
                rot: dummy.rotation.clone(),
                scale: scale,
                phase: Math.random() * Math.PI * 2
            });
        }

        group.add(instancedLeaves);
        animState.leaves = { mesh: instancedLeaves, data: leafData };

        parts.push({
            name: "Photovoltaic Solar Leaf Canopy",
            description: "Tens of thousands of massive bio-solar panels capturing stellar radiation to supplement the core dynamo.",
            material: "Bio-Silicone / Chlorophyll-Nanites",
            function: "Stellar Energy Collection",
            assemblyOrder: 95,
            connections: ["Secondary Branches"],
            failureEffect: "Energy deficit in upper sectors",
            cascadeFailures: ["Rolling blackouts in Biospheres"],
            originalPosition: { x: 0, y: 1200, z: 0 },
            explodedPosition: { x: 0, y: 1800, z: 0 }
        });
    }

    // 9. Transport Fleet (Instanced)
    function buildFleet() {
        const numShips = 200;
        
        // Ship Geometry
        const shipGeo = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 15,   // nose
            -4, -2, -5, // bottom left
            4, -2, -5,  // bottom right
            0, 4, -5,   // top
            0, 0, -10   // engine exhaust
        ]);
        const indices = [
            0, 1, 2,  // bottom
            0, 2, 3,  // right
            0, 3, 1,  // left
            1, 4, 2,  // bottom engine
            2, 4, 3,  // right engine
            3, 4, 1   // left engine
        ];
        shipGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        shipGeo.setIndex(indices);
        shipGeo.computeVertexNormals();

        const instancedShips = new THREE.InstancedMesh(shipGeo, chrome, numShips);
        const shipData = [];

        for (let i = 0; i < numShips; i++) {
            shipData.push({
                orbitRadius: 150 + Math.random() * 600,
                altitude: 200 + Math.random() * 1200,
                speed: 0.001 + Math.random() * 0.003,
                angle: Math.random() * Math.PI * 2,
                bobPhase: Math.random() * Math.PI * 2
            });
        }

        group.add(instancedShips);
        animState.ships = { mesh: instancedShips, data: shipData };
    }

    // 10. Aegis Defense Satellites
    function buildSatellites() {
        const satGeom = new THREE.OctahedronGeometry(15, 1);
        for (let i = 0; i < 12; i++) {
            const satGroup = new THREE.Group();
            
            const satBody = new THREE.Mesh(satGeom, tinted);
            satGroup.add(satBody);

            const ringGeom = new THREE.TorusGeometry(25, 2, 8, 32);
            const ring = new THREE.Mesh(ringGeom, goldTrim);
            ring.rotation.x = Math.PI / 2;
            satGroup.add(ring);

            group.add(satGroup);
            
            animState.satellites.push({
                mesh: satGroup,
                angle: (i / 12) * Math.PI * 2,
                speed: 0.002 + (i % 2) * 0.001,
                radius: 1200,
                height: 1200 + Math.sin(i) * 100
            });
        }
    }

    // Execute all build routines
    buildCoreAndRoots();
    buildTrunk();
    buildOrbitalHub();
    buildCanopy();
    buildSapVeins();
    buildLeaves();
    buildFleet();
    buildSatellites();

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    
    const animate = (delta_time, speed_multiplier) => {
        animState.time += delta_time * speed_multiplier * 0.01;
        const t = animState.time;

        // 1. Core rotation
        if (animState.core) {
            animState.core.rotation.y += 0.005 * speed_multiplier;
            animState.core.rotation.z += 0.002 * speed_multiplier;
        }

        // 2. Magma chunks orbiting
        animState.magmaChunks.forEach(chunk => {
            chunk.mesh.position.applyAxisAngle(chunk.orbitAxis, chunk.orbitSpeed * speed_multiplier);
            chunk.mesh.rotation.x += 0.01 * speed_multiplier;
            chunk.mesh.rotation.y += 0.01 * speed_multiplier;
        });

        // 3. Sap Veins Pulsing (Emissive intensity)
        const pulse = (Math.sin(t * 2) + 1) * 0.5; // 0 to 1
        glowingSapMaterial.emissiveIntensity = 1.0 + pulse * 3.0;

        // 4. Branch swaying (fake wind/breathing)
        // Note: For complex geometries like Tubes, updating vertices every frame is expensive in JS,
        // so we simulate sway by animating the rotation of the entire group slightly, or if we had skeleton, bones.
        // Since branches are merged into the main group, we'll just add a subtle breathing scale to the whole group
        // To strictly follow requirements, we'll apply subtle rotations to the primary nodes if they were separate.
        // We will apply a global subtle sway to the entire group to represent the tree swaying in solar wind.
        group.rotation.z = Math.sin(t * 0.5) * 0.01;
        group.rotation.x = Math.cos(t * 0.3) * 0.01;

        // 5. Elevators moving
        animState.elevators.forEach(el => {
            el.mesh.position.y += el.speed * el.direction * speed_multiplier * 10;
            if (el.mesh.position.y > 1000) {
                el.mesh.position.y = 1000;
                el.direction = -1;
                el.mesh.rotation.x = -Math.PI/2; // Point down
            }
            if (el.mesh.position.y < -50) {
                el.mesh.position.y = -50;
                el.direction = 1;
                el.mesh.rotation.x = Math.PI/2; // Point up
            }
        });

        // 6. Satellites orbiting
        animState.satellites.forEach(sat => {
            sat.angle += sat.speed * speed_multiplier;
            sat.mesh.position.set(
                Math.cos(sat.angle) * sat.radius,
                sat.height + Math.sin(t + sat.angle) * 50,
                Math.sin(sat.angle) * sat.radius
            );
            sat.mesh.rotation.y += 0.01 * speed_multiplier;
            sat.mesh.children[1].rotation.x += 0.02 * speed_multiplier; // spin the ring
        });

        // 7. Ships flying (InstancedMesh)
        if (animState.ships) {
            const dummy = new THREE.Object3D();
            animState.ships.data.forEach((ship, i) => {
                ship.angle += ship.speed * speed_multiplier;
                const bob = Math.sin(t * 5 + ship.bobPhase) * 20;
                const x = Math.cos(ship.angle) * ship.orbitRadius;
                const z = Math.sin(ship.angle) * ship.orbitRadius;
                const y = ship.altitude + bob;

                dummy.position.set(x, y, z);
                
                // Calculate tangent for looking direction
                const nextAngle = ship.angle + 0.01;
                const nextX = Math.cos(nextAngle) * ship.orbitRadius;
                const nextZ = Math.sin(nextAngle) * ship.orbitRadius;
                dummy.lookAt(nextX, y, nextZ);

                dummy.updateMatrix();
                animState.ships.mesh.setMatrixAt(i, dummy.matrix);
            });
            animState.ships.mesh.instanceMatrix.needsUpdate = true;
        }

        // 8. Leaves fluttering
        if (animState.leaves) {
            const dummy = new THREE.Object3D();
            animState.leaves.data.forEach((leaf, i) => {
                dummy.position.copy(leaf.pos);
                dummy.rotation.copy(leaf.rot);
                // Add flutter
                dummy.rotation.x += Math.sin(t * 10 + leaf.phase) * 0.05;
                dummy.rotation.z += Math.cos(t * 8 + leaf.phase) * 0.05;
                dummy.scale.set(leaf.scale, leaf.scale, leaf.scale);
                dummy.updateMatrix();
                animState.leaves.mesh.setMatrixAt(i, dummy.matrix);
            });
            animState.leaves.mesh.instanceMatrix.needsUpdate = true;
        }

        // 9. Hydraulic Pistons pumping
        animState.hydraulicPistons.forEach(piston => {
            const extension = Math.sin(t * 2 + piston.phase) * piston.amplitude;
            piston.mesh.position.z = piston.baseZ + extension;
        });
    };

    // ==========================================
    // METADATA & QUIZ
    // ==========================================
    
    const description = "Yggdrasil Biological Megastructure - A God Tier planetary-scale biomechanical organism serving as a space elevator, atmospheric regulator, and multi-habitat metropolis.";
    
    const quizQuestions = [
        {
            question: "In the context of planetary-scale bio-mechanical homeorhesis, how does the Yggdrasil structure mitigate the immense torsional shear stresses induced by the Coriolis effect on its 1000km geostationary trunk?",
            options: [
                "By utilizing fluidic sap-vein counter-masses driven by magneto-hydrodynamic pumps that shift barycentric momentum.",
                "Through the rigidification of its carbon-nanotube bark matrix, creating an absolutely inflexible pillar.",
                "By anchoring deep into the planetary core, effectively ignoring surface rotational forces due to infinite mass.",
                "Via continual shedding and rapid regenerative regrowth of its stratospheric branches to disperse kinetic energy."
            ],
            correctAnswer: 0,
            explanation: "At 1000km, the velocity differential between the surface and the orbital hub is extreme. Rigid structures would shatter. Yggdrasil uses active mass-shifting via its plasmatic sap veins to dynamically counter Coriolis shear."
        },
        {
            question: "Given the atmospheric pressure differential across a 1000km vertical biological column, what is the most thermodynamically efficient method employed by Yggdrasil for active transport of nutrients to the upper canopy biospheres?",
            options: [
                "Capillary action through micro-porous xylem networks.",
                "Peristaltic muscular contractions along the entire trunk.",
                "Quantum teleportation of individual nutrient molecules.",
                "Electro-osmotic cavitation using the planetary magnetic field to drive ionized sap upwards."
            ],
            correctAnswer: 3,
            explanation: "Traditional biological pumps (capillary or peristaltic) fail at these scales due to the immense hydrostatic column. Yggdrasil ionizes its sap and leverages the planet's magnetic field as a linear accelerator (electro-osmotic cavitation)."
        },
        {
            question: "The Aegis Defense Network satellites maintain synchronous orbits utilizing gravitational tethering to the canopy rather than traditional thrusters. What orbital mechanics principle allows non-Keplerian orbits in this specific configuration?",
            options: [
                "The Oberth effect, maximizing kinetic energy at periapsis.",
                "Frame-dragging (Lense-Thirring effect) induced by the rotating core.",
                "Statite architecture utilizing the solar leaf array's radiation pressure and physical magnetic flux pinning.",
                "Hohmann transfer anomalies caused by the mass of the biospheres."
            ],
            correctAnswer: 2,
            explanation: "The satellites act as 'statites' (static satellites), balancing gravity not purely with orbital velocity, but by riding the intense magnetic flux lines generated by the Yggdrasil core and the radiation pressure reflected from the solar canopy."
        },
        {
            question: "The bioluminescent sap acts as both a nutrient carrier and a photonic data transmission medium. What quantum phenomenon is most likely leveraged to prevent decoherence in the sap's suspended chromophores over distances exceeding 10^6 meters?",
            options: [
                "Bose-Einstein condensation within the fluid at room temperature.",
                "Quantum Zeno effect achieved by continuous self-observation via neural-net bark nodes.",
                "Topological quantum error correction inherent in the folded protein structures of the sap.",
                "Macroscopic quantum tunneling of photons through the vacuum of space."
            ],
            correctAnswer: 2,
            explanation: "Topological states are highly robust against local perturbations (like thermal noise). The complex folding of the sap's proteins creates a topological insulator effect, preserving quantum information over megameter distances."
        },
        {
            question: "If a catastrophic failure occurs in the Stratospheric Ozone Synthesizer Exhausts, what immediate cascade effect is observed in the primary metabolic pathways of the Biosphere Domes?",
            options: [
                "Immediate runaway greenhouse effect boiling the internal cities.",
                "Downregulation of atmospheric processors due to localized UV-C induced radical polymerization of the dome glass.",
                "Spontaneous combustion of the carbon-nanotube bark.",
                "Gravitational plating inversion."
            ],
            correctAnswer: 1,
            explanation: "Without ozone synthesis, extreme UV-C radiation hits the biospheres. The dome glass, being a responsive bio-polymer, undergoes radical polymerization to opaque itself for protection, which instantly starves the internal atmospheric processors of necessary solar energy, causing a metabolic downregulation."
        }
    ];
    
    return { group, parts, description, quizQuestions, animate };
}
