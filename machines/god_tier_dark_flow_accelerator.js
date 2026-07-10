import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        sails: [],
        energyStreams: [],
        primaryRings: [],
        secondaryRings: [],
        hydraulics: [],
        tires: [],
        coolingFins: [],
        sensorArrays: [],
        pylons: [],
        core: null,
        cabinScreens: [],
        joysticks: [],
        gears: [],
        exhaustVents: []
    };

    const description = "The God Tier Dark Flow Accelerator is an incomprehensibly vast megastructure engineered to harness the 'Dark Flow'—the controversial, non-random peculiar velocity of galaxy clusters moving toward a region outside the observable universe. By synthesizing a localized kinematic Sunyaev-Zel'dovich effect, it anchors its immense Spacetime Traction Tires to the quantum vacuum, while its topological Dark Matter Sails catch the momentum of universal expansion. Eerie, deep-purple energy streams pulsate through its frame, providing infinite relativistic propulsion. This is not merely a machine; it is a chariot of the cosmos.";

    // ==========================================
    // 1. CUSTOM ULTRA-HIGH-TECH MATERIALS
    // ==========================================
    
    const darkMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x030303,
        emissive: 0x1a0033,
        emissiveIntensity: 1.2,
        metalness: 1.0,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const deepPurpleEnergyMat = new THREE.MeshStandardMaterial({
        color: 0x5500ff,
        emissive: 0x8800ff,
        emissiveIntensity: 4.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const singularityCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x220033,
        emissiveIntensity: 5.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 1.0,
        roughness: 0.0
    });

    const hydraulicFluidMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ffaa,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.7
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const plasmaExhaustMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0022,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.8
    });

    // ==========================================
    // 2. GEOMETRY GENERATION FUNCTIONS
    // ==========================================

    /**
     * SUB-ASSEMBLY: CORE SINGULARITY HOUSING
     * A pulsating organic-looking geometric heart that houses the artificial singularity.
     */
    function createCore() {
        const coreGroup = new THREE.Group();
        
        // Complex displaced Icosahedron
        const geo = new THREE.IcosahedronGeometry(80, 16);
        const pos = geo.attributes.position;
        const initialPositions = new Float32Array(pos.count * 3);
        
        for(let i=0; i<pos.count; i++) {
            const p = new THREE.Vector3().fromBufferAttribute(pos, i);
            initialPositions[i*3] = p.x;
            initialPositions[i*3+1] = p.y;
            initialPositions[i*3+2] = p.z;
            
            // Initial procedural noise displacement
            const noise = Math.sin(p.x * 0.05) * Math.cos(p.y * 0.05) * Math.sin(p.z * 0.05);
            p.multiplyScalar(1 + noise * 0.1);
            pos.setXYZ(i, p.x, p.y, p.z);
        }
        geo.setAttribute('initialPos', new THREE.BufferAttribute(initialPositions, 3));
        geo.computeVertexNormals();

        const mesh = new THREE.Mesh(geo, singularityCoreMat);
        coreGroup.add(mesh);
        meshes.core = mesh;
        
        // Core Containment Lathe
        const lathePoints = [];
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const r = 90 + Math.sin(t * Math.PI * 8) * 15;
            const y = (t - 0.5) * 200;
            lathePoints.push(new THREE.Vector2(r, y));
        }
        const latheGeo = new THREE.LatheGeometry(lathePoints, 64);
        const latheMesh = new THREE.Mesh(latheGeo, darkSteel);
        latheMesh.material.wireframe = true;
        latheMesh.material.transparent = true;
        latheMesh.material.opacity = 0.3;
        coreGroup.add(latheMesh);

        group.add(coreGroup);
    }

    /**
     * SUB-ASSEMBLY: PRIMARY & SECONDARY ACCELERATION RINGS
     * Massive extruded structures that spin around the core to stabilize the spatial distortion.
     */
    function createRings() {
        // Complex cross-section for the primary ring
        const ringShape = new THREE.Shape();
        ringShape.moveTo(0, 20);
        ringShape.lineTo(10, 10);
        ringShape.lineTo(15, 10);
        ringShape.lineTo(20, 5);
        ringShape.lineTo(20, -5);
        ringShape.lineTo(15, -10);
        ringShape.lineTo(10, -10);
        ringShape.lineTo(0, -20);
        ringShape.lineTo(-10, -10);
        ringShape.lineTo(-15, -10);
        ringShape.lineTo(-20, -5);
        ringShape.lineTo(-20, 5);
        ringShape.lineTo(-15, 10);
        ringShape.lineTo(-10, 10);
        ringShape.moveTo(0, 20);

        const extrudeSettings = {
            depth: 0,
            bevelEnabled: false,
            curveSegments: 64,
            steps: 300,
            extrudePath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(300, 0, 0),
                new THREE.Vector3(0, 0, 300),
                new THREE.Vector3(-300, 0, 0),
                new THREE.Vector3(0, 0, -300)
            ], true)
        };

        const primaryRingGeo = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(400, 0, 0),
                new THREE.Vector3(0, 0, 400),
                new THREE.Vector3(-400, 0, 0),
                new THREE.Vector3(0, 0, -400)
            ], true), 256, 25, 32, true
        );
        
        for (let i = 0; i < 3; i++) {
            const pRing = new THREE.Mesh(primaryRingGeo, steel);
            pRing.rotation.x = (Math.PI / 3) * i;
            
            // Add rivets and panel lines via small toruses
            for (let j = 0; j < 12; j++) {
                const rivetGeo = new THREE.TorusGeometry(26, 2, 16, 64);
                const rivet = new THREE.Mesh(rivetGeo, copper);
                rivet.position.set(
                    Math.cos((j/12)*Math.PI*2) * 400,
                    0,
                    Math.sin((j/12)*Math.PI*2) * 400
                );
                rivet.lookAt(0,0,0);
                pRing.add(rivet);
            }
            
            group.add(pRing);
            meshes.primaryRings.push(pRing);
        }

        // Secondary Rings (TorusKnot)
        const secondaryGeo = new THREE.TorusKnotGeometry(250, 8, 256, 32, 3, 7);
        const sRing = new THREE.Mesh(secondaryGeo, chrome);
        group.add(sRing);
        meshes.secondaryRings.push(sRing);
        
        const tertiaryGeo = new THREE.TorusKnotGeometry(200, 5, 256, 32, 5, 11);
        const tRing = new THREE.Mesh(tertiaryGeo, deepPurpleEnergyMat);
        group.add(tRing);
        meshes.secondaryRings.push(tRing);
    }

    /**
     * SUB-ASSEMBLY: DARK MATTER SAILS
     * Massive planes of high-density topological fabric that catch the dark flow.
     */
    function createSails() {
        const sailPositions = [
            { x: 0, y: 500, z: -600, rotX: Math.PI / 4, rotY: 0, rotZ: 0 },
            { x: 0, y: -500, z: -600, rotX: -Math.PI / 4, rotY: 0, rotZ: 0 },
            { x: 600, y: 0, z: -500, rotX: 0, rotY: -Math.PI / 4, rotZ: Math.PI / 2 },
            { x: -600, y: 0, z: -500, rotX: 0, rotY: Math.PI / 4, rotZ: Math.PI / 2 }
        ];

        sailPositions.forEach((pos, index) => {
            const sailGroup = new THREE.Group();
            sailGroup.position.set(pos.x, pos.y, pos.z);
            sailGroup.rotation.set(pos.rotX, pos.rotY, pos.rotZ);

            // High vertex count for extreme rippling animation
            const sailGeo = new THREE.PlaneGeometry(800, 1200, 128, 128);
            
            // Store initial positions
            const posAttr = sailGeo.attributes.position;
            const initPos = new Float32Array(posAttr.count * 3);
            for(let i=0; i<posAttr.count; i++) {
                initPos[i*3] = posAttr.getX(i);
                initPos[i*3+1] = posAttr.getY(i);
                initPos[i*3+2] = posAttr.getZ(i);
            }
            sailGeo.setAttribute('initialPos', new THREE.BufferAttribute(initPos, 3));
            
            const sailMesh = new THREE.Mesh(sailGeo, darkMatterMat);
            sailGroup.add(sailMesh);
            
            // Sail Masts / Struts
            const mastGeo = new THREE.CylinderGeometry(15, 10, 1300, 32);
            const mast = new THREE.Mesh(mastGeo, darkSteel);
            mast.rotation.z = Math.PI / 2;
            mast.position.y = 600;
            sailGroup.add(mast);

            const mast2 = new THREE.Mesh(mastGeo, darkSteel);
            mast2.rotation.z = Math.PI / 2;
            mast2.position.y = -600;
            sailGroup.add(mast2);

            const spineGeo = new THREE.CylinderGeometry(20, 20, 1200, 32);
            const spine = new THREE.Mesh(spineGeo, aluminum);
            sailGroup.add(spine);
            
            group.add(sailGroup);
            meshes.sails.push(sailMesh);
        });
    }

    /**
     * SUB-ASSEMBLY: DEEP-PURPLE ENERGY STREAMS
     * Winding tubes of highly emissive energy twisting around the construct.
     */
    function createEnergyStreams() {
        for (let k = 0; k < 16; k++) {
            const points = [];
            const offset = (k / 16) * Math.PI * 2;
            for (let i = 0; i <= 150; i++) {
                const t = i / 150;
                // Expanding spiral formula
                const r = 80 + t * 450;
                const theta = t * Math.PI * 12 + offset;
                const y = Math.sin(t * Math.PI * 4) * 300 + (t - 0.5) * 800;
                points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const streamGeo = new THREE.TubeGeometry(curve, 300, 8, 16, false);
            const stream = new THREE.Mesh(streamGeo, deepPurpleEnergyMat);
            group.add(stream);
            meshes.energyStreams.push({
                mesh: stream,
                baseScale: 1.0,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    /**
     * SUB-ASSEMBLY: HYDRAULIC PISTONS & PIPING NETWORK
     * Intricate mechanical stabilization arms holding the rings to the core.
     */
    function createHydraulics() {
        for (let i = 0; i < 36; i++) {
            const armGroup = new THREE.Group();
            
            // Radial positioning
            const angle = (i / 36) * Math.PI * 2;
            const radiusBase = 120;
            armGroup.position.set(Math.cos(angle) * radiusBase, 0, Math.sin(angle) * radiusBase);
            armGroup.rotation.y = -angle; 
            armGroup.rotation.x = (i % 2 === 0) ? Math.PI / 4 : -Math.PI / 4;

            // Outer housing
            const outerGeo = new THREE.CylinderGeometry(12, 16, 150, 32);
            const outer = new THREE.Mesh(outerGeo, darkSteel);
            outer.position.y = 75;
            armGroup.add(outer);

            // Inner Piston
            const innerGeo = new THREE.CylinderGeometry(8, 8, 180, 32);
            const inner = new THREE.Mesh(innerGeo, chrome);
            inner.position.y = 75; 
            armGroup.add(inner);

            // Hydraulic Fluid lines winding around
            const tubeCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 10, 0),
                new THREE.Vector3(25, 40, 10),
                new THREE.Vector3(18, 90, -10),
                new THREE.Vector3(12, 140, 0)
            ]);
            const tubeGeo = new THREE.TubeGeometry(tubeCurve, 32, 2.5, 12, false);
            const tube = new THREE.Mesh(tubeGeo, hydraulicFluidMat);
            armGroup.add(tube);
            
            // Articulation joint
            const jointGeo = new THREE.SphereGeometry(18, 32, 32);
            const joint = new THREE.Mesh(jointGeo, steel);
            joint.position.y = 150;
            inner.add(joint);

            group.add(armGroup);
            meshes.hydraulics.push({
                innerMesh: inner,
                baseY: 75,
                phase: i * 0.5,
                speed: 1.5 + (i % 3) * 0.5
            });
        }
    }

    /**
     * SUB-ASSEMBLY: SPACETIME TRACTION TIRES (CRITICAL MANDATE)
     * Massive off-road tires required to "grip" the fabric of spacetime.
     * Uses TorusGeometry with hundreds of BoxGeometry lugs for aggressive treads.
     */
    function createSpacetimeTires() {
        const tirePositions = [
            { x: 500, y: -400, z: 300, rotY: 0 },
            { x: -500, y: -400, z: 300, rotY: 0 },
            { x: 500, y: -400, z: -300, rotY: 0 },
            { x: -500, y: -400, z: -300, rotY: 0 }
        ];

        tirePositions.forEach((pos, idx) => {
            const tireGroup = new THREE.Group();
            tireGroup.position.set(pos.x, pos.y, pos.z);
            tireGroup.rotation.y = pos.rotY;

            // Main Tire Body (Torus)
            const torusGeo = new THREE.TorusGeometry(120, 45, 64, 200);
            const torusMesh = new THREE.Mesh(torusGeo, rubber);
            tireGroup.add(torusMesh);

            // Aggressive Off-Road Treads (Hundreds of tiny extruded BoxGeometry lugs)
            const lugGeo = new THREE.BoxGeometry(25, 15, 60);
            const numLugs = 180;
            const radius = 165; // 120 + 45
            
            for (let i = 0; i < numLugs; i++) {
                const angle = (i / numLugs) * Math.PI * 2;
                const lug = new THREE.Mesh(lugGeo, rubber);
                
                lug.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    0
                );
                lug.rotation.z = angle;
                
                // Offset staggered lugs for aggressive military/space-rover look
                if (i % 2 === 0) {
                    lug.position.z += 18;
                    lug.rotation.x = 0.25;
                    lug.scale.set(1.2, 1, 1);
                } else {
                    lug.position.z -= 18;
                    lug.rotation.x = -0.25;
                    lug.scale.set(1.2, 1, 1);
                }
                
                // Add secondary micro-lugs
                const microLugGeo = new THREE.BoxGeometry(10, 8, 20);
                const microLug = new THREE.Mesh(microLugGeo, rubber);
                microLug.position.set(
                    Math.cos(angle + 0.01) * (radius - 5),
                    Math.sin(angle + 0.01) * (radius - 5),
                    (i % 2 === 0) ? -35 : 35
                );
                microLug.rotation.z = angle;
                tireGroup.add(microLug);

                tireGroup.add(lug);
            }

            // Complex Rim (Cylinder with arrays)
            const rimGeo = new THREE.CylinderGeometry(110, 110, 40, 128);
            const rim = new THREE.Mesh(rimGeo, darkSteel);
            rim.rotation.x = Math.PI / 2;
            tireGroup.add(rim);

            // Complex Spoke Array
            const spokeGeo = new THREE.CylinderGeometry(5, 5, 220, 32);
            for (let i = 0; i < 24; i++) {
                const angle = (i / 24) * Math.PI;
                const spoke = new THREE.Mesh(spokeGeo, aluminum);
                spoke.rotation.z = angle;
                spoke.rotation.x = Math.PI / 2;
                tireGroup.add(spoke);
                
                // Sub-spokes for hyper-detail
                const subGeo = new THREE.CylinderGeometry(2, 2, 80, 16);
                const subSpoke = new THREE.Mesh(subGeo, chrome);
                subSpoke.position.set(Math.cos(angle)*60, Math.sin(angle)*60, 15);
                subSpoke.rotation.z = angle + Math.PI/3;
                tireGroup.add(subSpoke);
            }
            
            // Hub cap
            const hubGeo = new THREE.CylinderGeometry(30, 35, 50, 64);
            const hub = new THREE.Mesh(hubGeo, steel);
            hub.rotation.x = Math.PI / 2;
            tireGroup.add(hub);

            // Suspension linkage
            const linkageGeo = new THREE.CylinderGeometry(20, 20, 300, 32);
            const linkage = new THREE.Mesh(linkageGeo, darkSteel);
            linkage.position.z = -150;
            linkage.rotation.x = Math.PI / 2;
            tireGroup.add(linkage);

            group.add(tireGroup);
            meshes.tires.push(tireGroup);
        });
    }

    /**
     * SUB-ASSEMBLY: OPERATOR CITADEL & SENSOR ARRAYS
     * A highly detailed cabin with tinted glass, joysticks, glowing screens, and ladders.
     */
    function createCitadel() {
        const citadelGroup = new THREE.Group();
        citadelGroup.position.set(0, 800, 0);

        // Main Hull (Extruded geometry)
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-100, -50);
        hullShape.lineTo(100, -50);
        hullShape.lineTo(150, 0);
        hullShape.lineTo(100, 80);
        hullShape.lineTo(-100, 80);
        hullShape.lineTo(-150, 0);
        hullShape.lineTo(-100, -50);

        const extrudeSettings = { depth: 200, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 8 };
        const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        const hull = new THREE.Mesh(hullGeo, darkSteel);
        hull.position.z = -100;
        citadelGroup.add(hull);

        // Tinted Glass Viewports
        const windowGeo = new THREE.PlaneGeometry(160, 60);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(0, 15, 105);
        citadelGroup.add(windowMesh);

        // Interior Dashboard & Glowing Screens
        const dashGeo = new THREE.BoxGeometry(180, 20, 40); // Standard console block
        const dash = new THREE.Mesh(dashGeo, plastic);
        dash.position.set(0, -10, 80);
        citadelGroup.add(dash);

        for (let i = 0; i < 8; i++) {
            const screenGeo = new THREE.PlaneGeometry(15, 10);
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.set(-60 + i * 17, -5, 101);
            screen.rotation.x = -0.2;
            citadelGroup.add(screen);
            meshes.cabinScreens.push(screen);
        }

        // Joysticks
        for (let i = 0; i < 2; i++) {
            const stickGroup = new THREE.Group();
            stickGroup.position.set(i === 0 ? -40 : 40, 5, 80);
            
            const baseGeo = new THREE.CylinderGeometry(4, 5, 8, 16);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            stickGroup.add(base);

            const shaftGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
            const shaft = new THREE.Mesh(shaftGeo, chrome);
            shaft.position.y = 10;
            stickGroup.add(shaft);

            const ballGeo = new THREE.SphereGeometry(3, 16, 16);
            const ball = new THREE.Mesh(ballGeo, rubber);
            ball.position.y = 18;
            stickGroup.add(ball);

            citadelGroup.add(stickGroup);
            meshes.joysticks.push(stickGroup);
        }

        // Grilles on the hull
        const grilleGroup = new THREE.Group();
        grilleGroup.position.set(0, -40, 105);
        for(let i=0; i<30; i++) {
            const barGeo = new THREE.CylinderGeometry(0.5, 0.5, 120, 8);
            const bar = new THREE.Mesh(barGeo, steel);
            bar.rotation.z = Math.PI / 2;
            bar.position.y = i * 1.5 - 20;
            grilleGroup.add(bar);
        }
        citadelGroup.add(grilleGroup);

        // Access Ladders spanning down to the core
        const ladderGroup = new THREE.Group();
        ladderGroup.position.set(-180, -300, 0);
        
        const railGeo = new THREE.CylinderGeometry(2, 2, 600, 16);
        const rail1 = new THREE.Mesh(railGeo, aluminum);
        rail1.position.z = 15;
        const rail2 = new THREE.Mesh(railGeo, aluminum);
        rail2.position.z = -15;
        ladderGroup.add(rail1);
        ladderGroup.add(rail2);

        for (let i = 0; i < 60; i++) {
            const rungGeo = new THREE.CylinderGeometry(1.5, 1.5, 30, 8);
            const rung = new THREE.Mesh(rungGeo, steel);
            rung.rotation.x = Math.PI / 2;
            rung.position.y = -300 + i * 10;
            ladderGroup.add(rung);
        }
        citadelGroup.add(ladderGroup);

        group.add(citadelGroup);
    }

    /**
     * SUB-ASSEMBLY: TACHYON SENSOR ARRAY
     * Fibonacci sphere distribution of sensor cones.
     */
    function createSensorArray() {
        const sensorGroup = new THREE.Group();
        sensorGroup.position.set(0, -700, 0); // Underside radar dome
        
        const domeGeo = new THREE.SphereGeometry(150, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, darkSteel);
        dome.rotation.x = Math.PI;
        sensorGroup.add(dome);

        const coneGeo = new THREE.ConeGeometry(3, 15, 8);
        const numSensors = 600;
        
        for (let i = 0; i < numSensors; i++) {
            const mesh = new THREE.Mesh(coneGeo, chrome);
            
            // Fibonacci sphere algorithm for even distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / numSensors);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            // Only place on bottom hemisphere
            if (phi > Math.PI / 2) {
                const r = 155;
                mesh.position.setFromSphericalCoords(r, phi, theta);
                mesh.lookAt(new THREE.Vector3(0,0,0));
                mesh.rotateX(-Math.PI / 2); // point outward
                sensorGroup.add(mesh);
                meshes.sensorArrays.push(mesh);
            }
        }
        group.add(sensorGroup);
    }

    /**
     * SUB-ASSEMBLY: RELATIVISTIC PLASMA VENTS
     */
    function createExhaustVents() {
        for (let i = 0; i < 8; i++) {
            const ventGroup = new THREE.Group();
            const angle = (i / 8) * Math.PI * 2;
            const r = 350;
            ventGroup.position.set(Math.cos(angle)*r, -200, Math.sin(angle)*r);
            ventGroup.rotation.y = -angle;
            ventGroup.rotation.x = Math.PI / 6;

            const casingGeo = new THREE.CylinderGeometry(40, 20, 150, 6);
            const casing = new THREE.Mesh(casingGeo, darkSteel);
            ventGroup.add(casing);

            const innerGlowGeo = new THREE.CylinderGeometry(35, 15, 148, 6);
            const glow = new THREE.Mesh(innerGlowGeo, plasmaExhaustMat);
            ventGroup.add(glow);

            group.add(ventGroup);
            meshes.exhaustVents.push(glow);
        }
    }

    /**
     * SUB-ASSEMBLY: MULTIVERSE ANCHOR PYLONS
     */
    function createPylons() {
        for (let i = 0; i < 4; i++) {
            const pylonGroup = new THREE.Group();
            const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
            const r = 600;
            pylonGroup.position.set(Math.cos(angle)*r, 400, Math.sin(angle)*r);
            
            const octGeo = new THREE.OctahedronGeometry(50, 2);
            const octMesh = new THREE.Mesh(octGeo, chrome);
            pylonGroup.add(octMesh);

            const ringGeo = new THREE.TorusGeometry(80, 5, 16, 64);
            const ringMesh = new THREE.Mesh(ringGeo, copper);
            ringMesh.rotation.x = Math.PI / 2;
            pylonGroup.add(ringMesh);

            group.add(pylonGroup);
            meshes.pylons.push({
                group: pylonGroup,
                ring: ringMesh,
                oct: octMesh,
                phase: i * Math.PI / 2
            });
        }
    }

    // ==========================================
    // 3. EXECUTE GEOMETRY GENERATION
    // ==========================================
    
    createCore();
    createRings();
    createSails();
    createEnergyStreams();
    createHydraulics();
    createSpacetimeTires();
    createCitadel();
    createSensorArray();
    createExhaustVents();
    createPylons();

    // ==========================================
    // 4. PARTS METADATA ARRAY (15+ ITEMS)
    // ==========================================

    parts.push(
        {
            name: 'Singularity Core Housing',
            description: 'The pulsating geometric heart of the accelerator. Contains a localized, gravitationally bound artificial singularity that generates the necessary spacetime curvature to interface with the Dark Flow.',
            material: 'Synthetic Event-Horizon Meta-material',
            function: 'Generates infinite mass-energy equivalence to anchor the ship against cosmic expansion.',
            assemblyOrder: 1,
            connections: ['Primary Acceleration Rings', 'Hydraulic Stabilizers', 'Energy Streams'],
            failureEffect: 'Immediate spaghettification of the local star system due to uncontained singularity expansion.',
            cascadeFailures: ['Total Structural Collapse', 'Multiverse Anchor Detachment'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 1500, z: 0 }
        },
        {
            name: 'Primary Acceleration Rings',
            description: 'Colossal, heavily riveted torus structures rotating at near light-speed. They stabilize the dimensional shear caused by the singularity, preventing spatial tears.',
            material: 'Dark Steel & Superconducting Copper',
            function: 'Maintains structural integrity and provides gyroscopic stabilization across 11 dimensions.',
            assemblyOrder: 2,
            connections: ['Core Housing', 'Tachyon Sensors'],
            failureEffect: 'Gyroscopic desynchronization leading to violent dimensional tumbling.',
            cascadeFailures: ['Hydraulic Fracture', 'Sail Shearing'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -1000, z: 0 }
        },
        {
            name: 'Secondary Resonance Rings',
            description: 'Intricate TorusKnot geometries woven from chrome and highly emissive purple energy. These rings tune the frequency of the gravitational waves to match the CMB cold spot.',
            material: 'Chrome & Emissive Energy Plasma',
            function: 'Harmonic frequency modulation of the gravitational wake.',
            assemblyOrder: 3,
            connections: ['Primary Rings'],
            failureEffect: 'Loss of lock on the Dark Flow trajectory, reverting ship to standard Newtonian drift.',
            cascadeFailures: ['Energy Stream Dissipation'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 1000, y: 0, z: 0 }
        },
        {
            name: 'Dark Matter Sail Alpha',
            description: 'Forward-port massive sail woven from topological defects. Catches the peculiar momentum of galaxy clusters.',
            material: 'Topological Spacetime Fabric (Dark Matter Phase)',
            function: 'Translates macroscopic cosmic bulk flow into localized kinetic acceleration.',
            assemblyOrder: 4,
            connections: ['Core Singularity Housing', 'Tension Struts'],
            failureEffect: 'Spacetime shearing, resulting in localized false vacuum decay.',
            cascadeFailures: ['Vessel Spin-out', 'Sail Beta Overload'],
            originalPosition: { x: 0, y: 500, z: -600 },
            explodedPosition: { x: 0, y: 1200, z: -1500 }
        },
        {
            name: 'Dark Matter Sail Beta',
            description: 'Forward-starboard massive sail. Features extreme rippling geometry as it interacts with dark matter winds.',
            material: 'Topological Spacetime Fabric',
            function: 'Momentum capture and steering vector alignment.',
            assemblyOrder: 5,
            connections: ['Core Singularity Housing', 'Tension Struts'],
            failureEffect: 'Severe yaw instability at relativistic speeds.',
            cascadeFailures: ['Sail Alpha Overload'],
            originalPosition: { x: 0, y: -500, z: -600 },
            explodedPosition: { x: 0, y: -1200, z: -1500 }
        },
        {
            name: 'Dark Matter Sail Gamma',
            description: 'Aft-port massive sail. Essential for braking against the expansion of the universe.',
            material: 'Topological Spacetime Fabric',
            function: 'Deceleration and kinematic SZ effect dampening.',
            assemblyOrder: 6,
            connections: ['Core Singularity Housing'],
            failureEffect: 'Inability to decelerate, resulting in collision with the cosmic microwave background boundary.',
            cascadeFailures: ['Thermal Overload'],
            originalPosition: { x: 600, y: 0, z: -500 },
            explodedPosition: { x: 1500, y: 0, z: -1500 }
        },
        {
            name: 'Dark Matter Sail Delta',
            description: 'Aft-starboard massive sail. Completes the tetrahedral sail arrangement for omni-directional Dark Flow surfing.',
            material: 'Topological Spacetime Fabric',
            function: 'Vector stabilization.',
            assemblyOrder: 7,
            connections: ['Core Singularity Housing'],
            failureEffect: 'Micro-wormhole tears along the trailing edge.',
            cascadeFailures: ['Plasma Vent Backflow'],
            originalPosition: { x: -600, y: 0, z: -500 },
            explodedPosition: { x: -1500, y: 0, z: -1500 }
        },
        {
            name: 'Deep-Purple Energy Streams',
            description: 'Sixteen massive CatmullRom splines of pure highly-emissive plasma twisting around the core, acting as the primary power transfer conduits.',
            material: 'Hyper-Emissive Plasma',
            function: 'Transfers tachyonic energy from the singularity to the outer systems.',
            assemblyOrder: 8,
            connections: ['Core Housing', 'Plasma Vents', 'Pylons'],
            failureEffect: 'Catastrophic power grid failure; immediate blackout.',
            cascadeFailures: ['Singularity Containment Drop', 'Life Support Failure'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 2000 }
        },
        {
            name: 'Hydraulic Piston Stabilizer Array',
            description: 'Thirty-six immense hydraulic arms featuring outer casings, chrome inner pistons, and winding green fluid lines. They dynamically adjust the distance between the core and the rings.',
            material: 'Dark Steel, Chrome, Synthetic Fluid',
            function: 'Dynamic shock absorption against dimensional ripples.',
            assemblyOrder: 9,
            connections: ['Core Housing', 'Primary Rings'],
            failureEffect: 'Rigid body snapping under immense tidal forces.',
            cascadeFailures: ['Ring Detachment'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -1000 }
        },
        {
            name: 'Spacetime Traction Tires',
            description: 'Four colossal off-road tires designed to physically grip the rough terrain of quantum foam. Features huge Torus geometries, hundreds of extruded Box geometry lugs, and massive cylindrical spoke arrays.',
            material: 'Cosmic Rubber & Dark Steel',
            function: 'Provides mechanical traction across non-continuous spacetime manifolds.',
            assemblyOrder: 10,
            connections: ['Suspension Linkages', 'Main Hull'],
            failureEffect: 'Loss of traction, causing the vessel to hydroplane on quantum fluctuations.',
            cascadeFailures: ['Spin-out', 'Navigation Failure'],
            originalPosition: { x: 500, y: -400, z: 300 },
            explodedPosition: { x: 2000, y: -1000, z: 1500 }
        },
        {
            name: 'Operator Citadel',
            description: 'The highly complex command center suspended above the core. Features extruded hulls, tinted quantum-glass, internal dashboard, joysticks, glowing screens, and massive access ladders.',
            material: 'Dark Steel, Tinted Glass, Plastic, Emissive Materials',
            function: 'Houses the navigation crew and protects them from Hawking radiation.',
            assemblyOrder: 11,
            connections: ['Tension Struts'],
            failureEffect: 'Depressurization and immediate crew vaporization.',
            cascadeFailures: ['Loss of Manual Control'],
            originalPosition: { x: 0, y: 800, z: 0 },
            explodedPosition: { x: 0, y: 2500, z: 0 }
        },
        {
            name: 'Tachyon Sensor Dome',
            description: 'A downward-facing radar dome studded with 300 perfectly distributed chrome cones via a Fibonacci sphere algorithm. Detects incoming peculiar velocity variations.',
            material: 'Dark Steel & Chrome',
            function: 'Maps the kinematic Sunyaev-Zel\'dovich effect in real-time.',
            assemblyOrder: 12,
            connections: ['Lower Hull'],
            failureEffect: 'Blind navigation through the dark flow, risking collision with superclusters.',
            cascadeFailures: ['Autopilot Disengagement'],
            originalPosition: { x: 0, y: -700, z: 0 },
            explodedPosition: { x: 0, y: -2000, z: 0 }
        },
        {
            name: 'Relativistic Plasma Vents',
            description: 'Eight hexagonal exhaust arrays that vent dangerous excess heat and plasma built up from braking against the expanding universe.',
            material: 'Dark Steel & Red Plasma',
            function: 'Thermal regulation and emergency thrust.',
            assemblyOrder: 13,
            connections: ['Energy Streams'],
            failureEffect: 'Core meltdown due to inability to dump heat.',
            cascadeFailures: ['Singularity Explosion'],
            originalPosition: { x: 0, y: -200, z: 0 },
            explodedPosition: { x: 800, y: -800, z: 800 }
        },
        {
            name: 'Multiverse Anchor Pylons',
            description: 'Four towering outriggers topped with rotating chrome octahedrons and copper rings. They anchor the ship\'s physics to the standard model while traversing anomalous regions.',
            material: 'Chrome & Copper',
            function: 'Maintains local physical constants.',
            assemblyOrder: 14,
            connections: ['Primary Rings'],
            failureEffect: 'Local physics break down; Pi becomes exactly 3, causing catastrophic geometric collapse.',
            cascadeFailures: ['Total Existence Failure'],
            originalPosition: { x: 600, y: 400, z: 600 },
            explodedPosition: { x: 2000, y: 1500, z: 2000 }
        },
        {
            name: 'Citadel Access Ladders & Grilles',
            description: 'Hundreds of cylindrical rails, rungs, and grilles providing maintenance access down the 800-meter drop from the Citadel to the core.',
            material: 'Aluminum & Steel',
            function: 'Allows manual repair of the singularity containment during combat or anomalies.',
            assemblyOrder: 15,
            connections: ['Operator Citadel', 'Core Housing'],
            failureEffect: 'Engineers unable to reach the core during critical emergencies.',
            cascadeFailures: ['Unmitigated Core Breach'],
            originalPosition: { x: -180, y: -300, z: 0 },
            explodedPosition: { x: -1000, y: -500, z: 0 }
        }
    );

    // ==========================================
    // 5. EXTREMELY DIFFICULT PhD-LEVEL QUIZ
    // ==========================================

    const quizQuestions = [
        {
            question: "In the context of the 'Dark Flow' phenomenon, what cosmological measurement anomaly initially suggested a coherent bulk velocity of galaxy clusters extending beyond the observable universe?",
            options: [
                "A large-scale dipole moment detected in the kinematic Sunyaev-Zel'dovich (kSZ) effect across hundreds of X-ray luminous galaxy clusters.",
                "The uniform suppression of the quadrupole moment in the Cosmic Microwave Background (CMB) angular power spectrum.",
                "Anomalous blueshifts in Type Ia supernovae localized to the constellation Centaurus.",
                "Violations of the generalized second law of thermodynamics observed in the accretion disks of supermassive black holes."
            ],
            correctAnswer: 0,
            explanation: "The dark flow hypothesis was proposed after analyzing WMAP data, which showed an unexpected dipole in the kinematic Sunyaev-Zel'dovich effect, indicating clusters moving collectively towards a specific patch of sky."
        },
        {
            question: "If a massive Dark Flow vector extends to scales significantly larger than the particle horizon, which fundamental pillar of the standard ΛCDM cosmological model is directly challenged?",
            options: [
                "The Cosmological Principle, which mandates large-scale isotropy and homogeneity.",
                "The scale-invariant Harrison-Zel'dovich spectrum of primordial density perturbations.",
                "The assumption that dark matter behaves as a cold, non-relativistic, collisionless fluid.",
                "The weak equivalence principle of General Relativity."
            ],
            correctAnswer: 0,
            explanation: "A coherent bulk flow extending beyond the observable universe introduces a preferred direction on the largest scales, blatantly violating the isotropy (sameness in all directions) required by the Cosmological Principle."
        },
        {
            question: "How might a pre-inflationary multiverse structure mathematically explain the existence of a persistent Dark Flow within our observable Hubble volume?",
            options: [
                "By inducing super-horizon scale primordial quantum entanglement that survives the inflationary e-folds, manifesting as a large-scale gravitational tilt.",
                "By locally modifying the fine-structure constant $\\alpha$, creating a pressure gradient in the photon-baryon fluid.",
                "By accelerating the decay rate of the false vacuum, creating localized 'bubbles' of differing physical laws that push against our universe.",
                "By generating localized regions of antimatter that annihilate and create directional cosmic winds."
            ],
            correctAnswer: 0,
            explanation: "Theorists suggest that before cosmic inflation rapidly expanded the universe, our region was entangled or interacting with adjacent regions (other 'universes'). Inflation expanded these pre-existing massive inhomogeneities beyond the horizon, leaving a residual gravitational 'tilt' that pulls matter today."
        },
        {
            question: "To accurately measure the kinematic Sunyaev-Zel'dovich (kSZ) effect used to map the Dark Flow, cosmologists must meticulously isolate it from the much stronger thermal Sunyaev-Zel'dovich (tSZ) effect. How do these two effects fundamentally differ in their impact on the CMB spectrum?",
            options: [
                "The tSZ effect shifts the CMB spectrum to higher frequencies without preserving its blackbody shape, whereas the kSZ effect preserves the blackbody shape while merely shifting its apparent temperature.",
                "The tSZ effect is caused by cold dark matter scattering, while the kSZ effect is caused exclusively by hot ionized gas.",
                "The tSZ effect is entirely independent of frequency, whereas the kSZ effect varies sharply with observation frequency.",
                "The tSZ effect only occurs in spiral galaxies, whereas the kSZ effect only occurs in elliptical galaxies."
            ],
            correctAnswer: 0,
            explanation: "The thermal SZ effect involves inverse Compton scattering of CMB photons by hot gas, distorting the blackbody spectrum (decrement at low frequencies, increment at high). The kinematic SZ effect, caused by the bulk motion of the cluster, induces a Doppler shift that preserves the blackbody spectrum but slightly changes the thermodynamic temperature."
        },
        {
            question: "Assuming a standard concordant $\\Lambda$CDM cosmology without any pre-inflationary anomalies, what is the theoretical expectation for the bulk flow root-mean-square (RMS) velocity variance at scales approaching $R \\sim 300 h^{-1} \\text{Mpc}$?",
            options: [
                "It should asymptotically converge toward zero, as density fluctuations average out on scales approaching the homogeneity scale.",
                "It should exponentially increase due to the accelerating expansion driven by Dark Energy ($\\Lambda$).",
                "It should remain constant at exactly $c / \\sqrt{3}$ due to relativistic limits.",
                "It should perfectly match the rotational velocity of the Milky Way galaxy."
            ],
            correctAnswer: 0,
            explanation: "In standard $\\Lambda$CDM, as you average over larger and larger volumes (approaching the scale of homogeneity), the net gravitational pull from density fluctuations cancels out. Therefore, the bulk flow RMS velocity is expected to vanish at very large scales, which contradicts the claims of the Dark Flow."
        }
    ];

    // ==========================================
    // 6. EXTREME ANIMATION LOGIC
    // ==========================================

    function animate(time, speed) {
        const timeVal = time * speed;
        
        // 1. Core Pulsation & Rotation
        if (meshes.core) {
            meshes.core.rotation.y = timeVal * 0.5;
            meshes.core.rotation.x = timeVal * 0.2;
            
            // Organic vertex displacement pulsing
            const geo = meshes.core.geometry;
            const pos = geo.attributes.position;
            const init = geo.attributes.initialPos;
            
            for (let i = 0; i < pos.count; i++) {
                const ix = init.getX(i);
                const iy = init.getY(i);
                const iz = init.getZ(i);
                
                // Breath function
                const breath = Math.sin(timeVal * 2.0 + ix * 0.05) * 2.0;
                pos.setXYZ(
                    i, 
                    ix + (ix > 0 ? breath : -breath), 
                    iy + (iy > 0 ? breath : -breath), 
                    iz + (iz > 0 ? breath : -breath)
                );
            }
            pos.needsUpdate = true;
            geo.computeVertexNormals();
        }

        // 2. Sail Rippling (Extreme logic)
        meshes.sails.forEach((sail, idx) => {
            const geo = sail.geometry;
            const pos = geo.attributes.position;
            const init = geo.attributes.initialPos;
            
            for (let i = 0; i < pos.count; i++) {
                const ix = init.getX(i);
                const iy = init.getY(i);
                
                // Complex interference wave formula simulating Dark Matter wind
                const wave1 = Math.sin(ix * 0.02 + timeVal * 3.0 + idx) * 30.0;
                const wave2 = Math.cos(iy * 0.015 - timeVal * 2.5) * 40.0;
                const wave3 = Math.sin((ix + iy) * 0.01 + timeVal * 4.0) * 15.0;
                
                pos.setZ(i, wave1 + wave2 + wave3);
            }
            pos.needsUpdate = true;
            geo.computeVertexNormals();
        });

        // 3. Ring Rotations
        meshes.primaryRings.forEach((ring, idx) => {
            ring.rotation.z = timeVal * (1.0 + idx * 0.2);
            ring.rotation.y = Math.sin(timeVal * 0.5) * 0.1;
        });

        meshes.secondaryRings.forEach((ring, idx) => {
            // Counter-rotating
            ring.rotation.x = timeVal * (idx % 2 === 0 ? 1.5 : -1.5);
            ring.rotation.y = timeVal * 0.8;
            ring.rotation.z = timeVal * 1.2;
            
            // Pulse emissive material on the tertiary ring
            if (ring.material === deepPurpleEnergyMat) {
                ring.material.emissiveIntensity = 3.0 + Math.sin(timeVal * 5.0) * 2.0;
            }
        });

        // 4. Energy Streams Pulsation & Winding
        meshes.energyStreams.forEach((stream) => {
            const mat = stream.mesh.material;
            mat.opacity = 0.6 + Math.sin(timeVal * 4.0 + stream.phase) * 0.4;
            stream.mesh.rotation.y = timeVal * 0.5; // whole network rotates
        });

        // 5. Hydraulic Pumping
        meshes.hydraulics.forEach((hyd) => {
            // Sinusoidal pumping motion
            const extension = Math.sin(timeVal * hyd.speed + hyd.phase) * 30;
            hyd.innerMesh.position.y = hyd.baseY + extension;
        });

        // 6. Spacetime Tires Spinning
        meshes.tires.forEach((tire, idx) => {
            // Massive aggressive spinning
            tire.children[0].rotation.z -= 0.1 * speed; // Torus spin
            tire.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'BoxGeometry') {
                    // Lugs spin with tire
                    // Actually, the whole group should spin to move the tire properly
                }
            });
            // Rotate the entire tire group to simulate rolling over spacetime
            tire.rotation.x = -timeVal * 2.0; 
            
            // Suspension bounce
            tire.position.y = -400 + Math.sin(timeVal * 8.0 + idx) * 10.0;
        });

        // 7. Cabin Joysticks & Screens
        meshes.cabinScreens.forEach((screen, idx) => {
            // Flickering screens
            screen.material.emissiveIntensity = 1.0 + Math.random() * 1.5;
        });
        meshes.joysticks.forEach((stick, idx) => {
            // Jittering joysticks as if actively piloted
            stick.rotation.x = Math.sin(timeVal * 10.0 + idx) * 0.2;
            stick.rotation.z = Math.cos(timeVal * 8.0 + idx) * 0.2;
        });

        // 8. Tachyon Sensor Array Breathing
        meshes.sensorArrays.forEach((cone, idx) => {
            const scale = 1.0 + Math.sin(timeVal * 5.0 + idx * 0.1) * 0.5;
            cone.scale.set(scale, scale, scale);
        });

        // 9. Relativistic Exhaust Vents Pulsing
        meshes.exhaustVents.forEach((vent, idx) => {
            vent.material.emissiveIntensity = 5.0 + Math.sin(timeVal * 12.0 + idx) * 3.0;
            // Slight jitter
            vent.parent.position.y = -200 + Math.random() * 2.0;
        });

        // 10. Pylons Rotating
        meshes.pylons.forEach((pylon) => {
            pylon.ring.rotation.z = timeVal * 2.0;
            pylon.oct.rotation.y = timeVal * 3.0 + pylon.phase;
            pylon.oct.rotation.x = timeVal * 1.5;
            
            // Hover effect
            pylon.group.position.y = 400 + Math.sin(timeVal * 2.0 + pylon.phase) * 20;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
