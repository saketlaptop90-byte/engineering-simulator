import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animObjects = [];

    // Custom Glowing/High-Tech Materials
    const customMats = {
        quantumGlow: new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3.5,
            transparent: true,
            opacity: 0.9,
            wireframe: false
        }),
        quantumWireframe: new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 2.0,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        }),
        hyperMatter: new THREE.MeshPhysicalMaterial({
            color: 0x110022,
            emissive: 0x220055,
            emissiveIntensity: 1.5,
            metalness: 1.0,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        }),
        energyPulse: new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xff4400,
            emissiveIntensity: 4.0,
            transparent: true,
            opacity: 0.95
        }),
        screenGreen: new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 2.5
        }),
        screenRed: new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 2.5
        })
    };

    // Helper Curve for Suspension Springs
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    // Custom Geometry for Klein Bottle approximation
    function createKleinBottleGeometry(segmentsU = 100, segmentsV = 40) {
        const vertices = [];
        const indices = [];
        const normals = [];
        const uvs = [];

        for (let i = 0; i <= segmentsU; i++) {
            const u = i / segmentsU;
            const uAngle = u * Math.PI * 2;
            for (let j = 0; j <= segmentsV; j++) {
                const v = j / segmentsV;
                const vAngle = v * Math.PI * 2;
                
                const cosU = Math.cos(uAngle);
                const sinU = Math.sin(uAngle);
                const cosV = Math.cos(vAngle);
                const sinV = Math.sin(vAngle);
                
                let x, y, z;
                if (uAngle < Math.PI) {
                    x = 3 * cosU * (1 + sinU) + (2 * (1 - cosU / 2)) * cosU * cosV;
                    z = -8 * sinU - 2 * (1 - cosU / 2) * sinU * cosV;
                } else {
                    x = 3 * cosU * (1 + sinU) + (2 * (1 - cosU / 2)) * Math.cos(vAngle + Math.PI);
                    z = -8 * sinU;
                }
                y = -2 * (1 - cosU / 2) * sinV;

                x *= 2.5; y *= 2.5; z *= 2.5;

                vertices.push(x, y, z);
                uvs.push(u, v);
                normals.push(x, y, z); // Approximate outward normals
            }
        }

        for (let i = 0; i < segmentsU; i++) {
            for (let j = 0; j < segmentsV; j++) {
                const a = i * (segmentsV + 1) + j;
                const b = i * (segmentsV + 1) + j + 1;
                const c = (i + 1) * (segmentsV + 1) + j;
                const d = (i + 1) * (segmentsV + 1) + j + 1;
                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
    }

    // --- Component Builders ---

    function buildChassis() {
        const chassisGroup = new THREE.Group();
        chassisGroup.position.set(0, 15, 0);

        // Main beams
        const mainBeamGeo = new THREE.BoxGeometry(16, 4, 60);
        const leftBeam = new THREE.Mesh(mainBeamGeo, steel);
        leftBeam.position.set(-14, 0, 0);
        const rightBeam = new THREE.Mesh(mainBeamGeo, steel);
        rightBeam.position.set(14, 0, 0);
        chassisGroup.add(leftBeam, rightBeam);

        // Cross members
        const crossGeo = new THREE.BoxGeometry(28, 3, 4);
        for(let i=0; i<5; i++) {
            const cross = new THREE.Mesh(crossGeo, darkSteel);
            cross.position.set(0, 0, -24 + i * 12);
            chassisGroup.add(cross);
        }

        // Underbelly shield
        const shieldGeo = new THREE.BoxGeometry(32, 1, 56);
        const shield = new THREE.Mesh(shieldGeo, chrome);
        shield.position.set(0, -2.5, 0);
        chassisGroup.add(shield);

        // Hydraulic anchor points
        const anchorGeo = new THREE.CylinderGeometry(2, 2, 6, 16);
        anchorGeo.rotateZ(Math.PI / 2);
        const positions = [
            [-16, -1, 22], [16, -1, 22],
            [-16, -1, -22], [16, -1, -22]
        ];
        positions.forEach(pos => {
            const anchor = new THREE.Mesh(anchorGeo, darkSteel);
            anchor.position.set(pos[0], pos[1], pos[2]);
            chassisGroup.add(anchor);
        });

        group.add(chassisGroup);
        parts.push({
            name: "Brane_Intersection_Nexus_Chassis",
            description: "The primary structural foundation mapping 4D space coordinates. Forged from collapsed star-core steel to withstand immense dimensional shear forces.",
            material: "Neutron-forged steel and dark chromite.",
            function: "Anchors the compactified manifold to the localized timeline and provides mounting for the dimensional mobility system.",
            assemblyOrder: 1,
            connections: ["Hydraulic_Suspension_Network", "Central_Calabi_Yau_Core", "Heavy_Duty_Grilles_And_Ladders"],
            failureEffect: "Structural de-coherence causing the entire machine to instantly phase-shift into a void dimension.",
            cascadeFailures: ["Central_Calabi_Yau_Core", "Operator_Command_Cabin"],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: -20, z: 0}
        });
    }

    function buildTire(name, position, assemblyIdx) {
        const tireGroup = new THREE.Group();
        tireGroup.position.copy(position);

        // Base tire torus
        const tireBaseGeo = new THREE.TorusGeometry(10, 4, 32, 100);
        const tireBase = new THREE.Mesh(tireBaseGeo, rubber);
        tireGroup.add(tireBase);

        // Aggressive off-road treads (Lugs)
        const lugGeo = new THREE.BoxGeometry(3, 2, 5.5);
        const numLugs = 144;
        for (let i = 0; i < numLugs; i++) {
            const theta = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(theta) * 13, Math.sin(theta) * 13, 0);
            lug.lookAt(tireGroup.position);
            
            // Zig-zag offset for aggressive look
            lug.position.z += (i % 2 === 0 ? 1.5 : -1.5);
            lug.rotation.y += (i % 2 === 0 ? 0.25 : -0.25);
            lug.rotation.z += 0.1;
            tireGroup.add(lug);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(8, 8, 5, 64);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        tireGroup.add(rim);

        // Hub cap
        const hubGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, chrome);
        tireGroup.add(hub);

        // Complex Spoke Array
        const numSpokes = 36;
        const spokeGeo = new THREE.CylinderGeometry(0.4, 0.4, 16, 16);
        spokeGeo.rotateZ(Math.PI / 2);
        for (let i = 0; i < numSpokes; i++) {
            const theta = (i / numSpokes) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, copper);
            spoke.rotation.y = theta;
            spoke.rotation.x = 0.15 * (i % 2 === 0 ? 1 : -1);
            tireGroup.add(spoke);
        }

        // Inner glowing quantum brake disc
        const brakeGeo = new THREE.TorusGeometry(6, 0.5, 16, 64);
        const brake = new THREE.Mesh(brakeGeo, customMats.energyPulse);
        brake.scale.set(1, 1, 0.2);
        tireGroup.add(brake);

        group.add(tireGroup);
        animObjects.push({ mesh: tireGroup, type: 'tire', speedMultiplier: 1.5 });

        parts.push({
            name: name,
            description: "Multi-dimensional off-road mobility unit. Treads interact with localized spacetime to generate forward momentum across all 11 dimensions.",
            material: "Hyper-vulcanized temporal rubber and copper-laced chromite rims.",
            function: "Provides traction on both Euclidean terrain and Calabi-Yau branes.",
            assemblyOrder: assemblyIdx,
            connections: ["Hydraulic_Suspension_Network"],
            failureEffect: "Traction loss in the 5th dimension, causing infinite slip across parallel universes.",
            cascadeFailures: ["Brane_Intersection_Nexus_Chassis"],
            originalPosition: {x: position.x, y: position.y, z: position.z},
            explodedPosition: {x: position.x * 2, y: position.y, z: position.z * 1.5}
        });
    }

    function buildSuspension(posIndex) {
        const susGroup = new THREE.Group();
        const positions = [
            { x: -24, y: 15, z: 22 }, { x: 24, y: 15, z: 22 },
            { x: -24, y: 15, z: -22 }, { x: 24, y: 15, z: -22 }
        ];
        const pos = positions[posIndex];
        susGroup.position.set(pos.x > 0 ? pos.x - 4 : pos.x + 4, pos.y, pos.z);

        // A-Arms
        const armGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
        armGeo.rotateZ(Math.PI / 2);
        const upperArm = new THREE.Mesh(armGeo, aluminum);
        upperArm.position.set(0, 4, 0);
        const lowerArm = new THREE.Mesh(armGeo, steel);
        lowerArm.position.set(0, -4, 0);
        susGroup.add(upperArm, lowerArm);

        // Main strut
        const strutOuterGeo = new THREE.CylinderGeometry(2.5, 2.5, 10, 32);
        const strutOuter = new THREE.Mesh(strutOuterGeo, darkSteel);
        strutOuter.position.set(pos.x > 0 ? 4 : -4, 2, 0);
        
        const strutInnerGeo = new THREE.CylinderGeometry(1.5, 1.5, 14, 32);
        const strutInner = new THREE.Mesh(strutInnerGeo, chrome);
        strutInner.position.set(pos.x > 0 ? 4 : -4, -4, 0);
        
        susGroup.add(strutOuter, strutInner);

        // Coil Spring
        const path = new HelixCurve(3.5, 16, 6);
        const springGeo = new THREE.TubeGeometry(path, 100, 0.6, 16, false);
        const spring = new THREE.Mesh(springGeo, customMats.quantumGlow);
        spring.position.set(pos.x > 0 ? 4 : -4, 0, 0);
        susGroup.add(spring);

        // Hydraulic lines
        const linePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 4, 0),
            new THREE.Vector3(2, 6, 2),
            new THREE.Vector3(pos.x > 0 ? 4 : -4, 5, 0)
        ]);
        const lineGeo = new THREE.TubeGeometry(linePath, 32, 0.2, 8, false);
        const line = new THREE.Mesh(lineGeo, rubber);
        susGroup.add(line);

        group.add(susGroup);
        animObjects.push({ mesh: susGroup, type: 'suspension', phaseOffset: posIndex });
    }

    function buildSuspensionNetwork() {
        for(let i=0; i<4; i++) buildSuspension(i);
        parts.push({
            name: "Hydraulic_Suspension_Network",
            description: "Heavy-duty articulation system with quantum-coil springs. Dynamically adjusts to macroscopic spatial distortions.",
            material: "Titanium-aluminum alloys, energized quantum fluid, and synthetic rubber.",
            function: "Absorbs shockwaves generated by spontaneous brane collisions beneath the vehicle.",
            assemblyOrder: 6,
            connections: ["Dimensional_Tires", "Brane_Intersection_Nexus_Chassis"],
            failureEffect: "Severe rattling causing operators to bit-flip out of reality.",
            cascadeFailures: ["Dimensional_Tires"],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: 30, z: 0}
        });
    }

    function buildCabin() {
        const cabinGroup = new THREE.Group();
        cabinGroup.position.set(0, 32, 12);
        
        // Floor & Base
        const floorGeo = new THREE.BoxGeometry(26, 2, 22);
        const floor = new THREE.Mesh(floorGeo, steel);
        cabinGroup.add(floor);
        
        // Pillars
        const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 18, 16);
        const pPositions = [ [-12, 10, -10], [12, 10, -10], [-12, 10, 10], [12, 10, 10] ];
        pPositions.forEach(p => {
            const pillar = new THREE.Mesh(pillarGeo, darkSteel);
            pillar.position.set(p[0], p[1], p[2]);
            cabinGroup.add(pillar);
        });

        // Roof
        const roofGeo = new THREE.BoxGeometry(28, 2, 24);
        const roof = new THREE.Mesh(roofGeo, aluminum);
        roof.position.set(0, 19, 0);
        
        // Radar/Antenna on roof
        const domeGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, glass);
        dome.position.set(0, 1, -4);
        roof.add(dome);
        
        const antennaGeo = new THREE.CylinderGeometry(0.2, 0.2, 8);
        const antenna = new THREE.Mesh(antennaGeo, chrome);
        antenna.position.set(6, 4, 4);
        roof.add(antenna);
        cabinGroup.add(roof);

        // Tinted Glass Panes
        const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(23.5, 16, 0.5), tinted);
        frontGlass.position.set(0, 10, 10);
        const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(23.5, 16, 0.5), tinted);
        rearGlass.position.set(0, 10, -10);
        const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 16, 19.5), tinted);
        sideGlassL.position.set(-12, 10, 0);
        const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 16, 19.5), tinted);
        sideGlassR.position.set(12, 10, 0);
        cabinGroup.add(frontGlass, rearGlass, sideGlassL, sideGlassR);

        // Control Panel
        const panelGeo = new THREE.BoxGeometry(22, 4, 6);
        const panel = new THREE.Mesh(panelGeo, plastic);
        panel.position.set(0, 6, 6);
        panel.rotation.x = -Math.PI / 8;
        cabinGroup.add(panel);

        // Screens and Instruments
        const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), customMats.screenGreen);
        screen1.position.set(-5, 8.1, 7.5);
        screen1.rotation.x = -Math.PI / 8;
        const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), customMats.screenRed);
        screen2.position.set(5, 8.1, 7.5);
        screen2.rotation.x = -Math.PI / 8;
        cabinGroup.add(screen1, screen2);
        animObjects.push({ mesh: screen1, type: 'screen', mat: customMats.screenGreen });
        animObjects.push({ mesh: screen2, type: 'screen', mat: customMats.screenRed });
        
        // Joysticks
        for(let i=-1; i<=1; i+=2) {
            const jGroup = new THREE.Group();
            const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3, 16), steel);
            stick.position.y = 1.5;
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), customMats.energyPulse);
            knob.position.y = 3;
            jGroup.add(stick, knob);
            jGroup.position.set(i * 8, 7, 5);
            jGroup.rotation.x = Math.PI / 6;
            cabinGroup.add(jGroup);
            animObjects.push({ mesh: jGroup, type: 'joystick' });
        }

        // Steering Assembly
        const swGroup = new THREE.Group();
        const swColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), steel);
        swColumn.rotation.x = Math.PI / 4;
        swColumn.position.set(0, 3, -1);
        const swWheel = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 16, 64), rubber);
        swWheel.rotation.x = Math.PI / 4;
        swWheel.position.set(0, 4.5, -2.5);
        
        // Wheel spokes
        const wSpoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.5), aluminum);
        wSpoke1.rotation.x = Math.PI / 4; wSpoke1.position.set(0, 4.5, -2.5);
        const wSpoke2 = wSpoke1.clone();
        wSpoke2.rotation.z = Math.PI / 2;
        swGroup.add(swColumn, swWheel, wSpoke1, wSpoke2);
        swGroup.position.set(0, 5, 2);
        cabinGroup.add(swGroup);
        animObjects.push({ mesh: swGroup, type: 'steering' });

        // Operator Seat
        const seatGroup = new THREE.Group();
        const seatBase = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), plastic);
        seatBase.position.set(0, 2.5, -2);
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 2), plastic);
        seatBack.position.set(0, 8, -4);
        const headRest = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 2), plastic);
        headRest.position.set(0, 13, -4);
        seatGroup.add(seatBase, seatBack, headRest);
        cabinGroup.add(seatGroup);

        group.add(cabinGroup);

        parts.push({
            name: "Operator_Command_Cabin",
            description: "A heavily shielded observation deck featuring tinted anti-Hawking radiation glass. Outfitted with precision joysticks for navigating non-Euclidean probability fields.",
            material: "Plas-steel framing, quantum-tinted observation glass, and ergonomic synthetic leather.",
            function: "Houses the biological or AI operator in a localized 3D safe-zone while manipulating 11-dimensional mechanics.",
            assemblyOrder: 7,
            connections: ["Brane_Intersection_Nexus_Chassis", "Control_Panels_And_Joysticks"],
            failureEffect: "Spaghettification of the occupant due to extreme gravitational shearing.",
            cascadeFailures: ["Control_Panels_And_Joysticks"],
            originalPosition: {x: 0, y: 32, z: 12},
            explodedPosition: {x: 0, y: 80, z: 40}
        });

        parts.push({
            name: "Control_Panels_And_Joysticks",
            description: "Highly sensitive inputs linked directly to the manifold's metric tensor. Adjusts compactification radius on the fly.",
            material: "Conductive plastics, steel, and crystal displays.",
            function: "Translates human motor skills into macroscopic adjustments of the 5th dimension.",
            assemblyOrder: 8,
            connections: ["Operator_Command_Cabin"],
            failureEffect: "Loss of steering control in higher dimensional planes.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 38, z: 18},
            explodedPosition: {x: 0, y: 90, z: 50}
        });
    }

    function buildCalabiYauCore() {
        const coreGroup = new THREE.Group();
        coreGroup.position.set(0, 35, -20); // Behind the cabin

        // Extreme Nested Torus Knots
        for(let i=0; i<32; i++) {
            const p = (i % 6) + 2;
            const q = (i % 8) + 3;
            const radius = 6 + Math.sin(i * 0.5) * 4;
            const tube = 0.3 + Math.abs(Math.cos(i)) * 0.5;
            const geo = new THREE.TorusKnotGeometry(radius, tube, 256, 32, p, q);
            
            let mat;
            if (i % 4 === 0) mat = customMats.quantumGlow;
            else if (i % 4 === 1) mat = customMats.hyperMatter;
            else if (i % 4 === 2) mat = customMats.quantumWireframe;
            else mat = glass;

            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            coreGroup.add(mesh);
            animObjects.push({ mesh: mesh, type: 'core_knot', idx: i });
        }

        // Inner glowing sphere
        const sphereGeo = new THREE.IcosahedronGeometry(4, 5);
        const sphere = new THREE.Mesh(sphereGeo, customMats.energyPulse);
        coreGroup.add(sphere);
        animObjects.push({ mesh: sphere, type: 'core_sphere' });

        group.add(coreGroup);

        parts.push({
            name: "Central_Calabi_Yau_Core",
            description: "A macroscopic, self-intersecting projection of curled-up higher dimensions. Forms the heart of the engine, constantly folding 6 extra dimensions into a dense energetic knot.",
            material: "Hyper-condensed string fluid, energized plasma, and theoretical hyper-matter.",
            function: "Generates the fundamental fields required to twist local 4D spacetime, creating gravity and electromagnetism from geometric topology.",
            assemblyOrder: 9,
            connections: ["U1_Gauge_Field_Manifold", "Metric_Tensor_Distortion_Grid"],
            failureEffect: "Spontaneous decompactification. The extra dimensions expand to macroscopic sizes, destroying the known universe.",
            cascadeFailures: ["Klein_Topology_Inverter", "Vacuum_Energy_Manifold"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: 50, z: -80}
        });
    }

    function buildGaugeFields() {
        const gaugeGroup = new THREE.Group();
        gaugeGroup.position.set(0, 35, -20);

        // Multiple rotating rings representing U(1) and SU(2) fields
        const ringGeo1 = new THREE.TorusGeometry(18, 0.8, 32, 128);
        const ringGeo2 = new THREE.TorusGeometry(22, 1.2, 32, 128);
        const ringGeo3 = new THREE.TorusGeometry(26, 0.5, 32, 128);

        for (let i=0; i<3; i++) {
            const mesh1 = new THREE.Mesh(ringGeo1, copper);
            const mesh2 = new THREE.Mesh(ringGeo2, chrome);
            const mesh3 = new THREE.Mesh(ringGeo3, customMats.quantumWireframe);

            mesh1.rotation.x = Math.PI / (i+1);
            mesh2.rotation.y = Math.PI / (i+1);
            mesh3.rotation.z = Math.PI / (i+1);

            gaugeGroup.add(mesh1, mesh2, mesh3);
            animObjects.push({ mesh: mesh1, type: 'gauge_ring', axis: 'x', speed: 0.02 * (i+1) });
            animObjects.push({ mesh: mesh2, type: 'gauge_ring', axis: 'y', speed: 0.03 * (i+1) });
            animObjects.push({ mesh: mesh3, type: 'gauge_ring', axis: 'z', speed: 0.04 * (i+1) });
        }

        group.add(gaugeGroup);

        parts.push({
            name: "U1_Gauge_Field_Manifold",
            description: "Physical manifestation of the U(1) gauge symmetry. The continuous rotation of these rings produces electromagnetic flux via the Kaluza-Klein mechanism.",
            material: "Superconducting copper and quantum-entangled chromite wireframes.",
            function: "Translates 5th dimensional momentum into 4D electromagnetic fields.",
            assemblyOrder: 10,
            connections: ["Central_Calabi_Yau_Core", "Electromagnetic_Tensor_Flux_Rings"],
            failureEffect: "Complete loss of electromagnetism. Atoms disintegrate.",
            cascadeFailures: ["Electromagnetic_Tensor_Flux_Rings"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: -40, y: 35, z: -20}
        });
    }

    function buildFluxRingsAndStabilizer() {
        const fluxGroup = new THREE.Group();
        fluxGroup.position.set(0, 35, -20);

        // Stabilizer outer housing
        const points = [];
        for (let i = 0; i < 20; i ++) {
            points.push(new THREE.Vector2(30 + Math.sin(i * 0.4) * 2, (i - 10) * 1.5));
        }
        const stabilizerGeo = new THREE.LatheGeometry(points, 64);
        const stabilizer = new THREE.Mesh(stabilizerGeo, darkSteel);
        fluxGroup.add(stabilizer);

        // Flux ring emitters
        const emitterGeo = new THREE.CylinderGeometry(1, 1, 65, 32);
        emitterGeo.rotateZ(Math.PI / 2);
        for(let i=0; i<8; i++) {
            const emitter = new THREE.Mesh(emitterGeo, customMats.energyPulse);
            emitter.rotation.y = (i / 8) * Math.PI * 2;
            fluxGroup.add(emitter);
        }

        // Detailed rivets on stabilizer
        const rivetGeo = new THREE.CylinderGeometry(0.5, 0.5, 1);
        rivetGeo.rotateX(Math.PI / 2);
        for(let i=0; i<36; i++) {
            const theta = (i / 36) * Math.PI * 2;
            const rivet1 = new THREE.Mesh(rivetGeo, chrome);
            rivet1.position.set(Math.cos(theta) * 31.5, 10, Math.sin(theta) * 31.5);
            rivet1.lookAt(new THREE.Vector3(0, 10, 0));
            const rivet2 = new THREE.Mesh(rivetGeo, chrome);
            rivet2.position.set(Math.cos(theta) * 31.5, -10, Math.sin(theta) * 31.5);
            rivet2.lookAt(new THREE.Vector3(0, -10, 0));
            fluxGroup.add(rivet1, rivet2);
        }

        group.add(fluxGroup);
        animObjects.push({ mesh: fluxGroup, type: 'stabilizer' });

        parts.push({
            name: "Electromagnetic_Tensor_Flux_Rings",
            description: "High-energy plasma conduits that shape the raw gauge field into usable macroscopic forces.",
            material: "Contained energy pulse within a magnetic bottle.",
            function: "Directs electromagnetic forces outwards to the distortion grid.",
            assemblyOrder: 11,
            connections: ["U1_Gauge_Field_Manifold"],
            failureEffect: "Uncontrolled EMP blasts annihilating all electronics in a 10-parsec radius.",
            cascadeFailures: ["Operator_Command_Cabin"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: -40, z: -20}
        });

        parts.push({
            name: "Compactification_Radius_Stabilizer",
            description: "A massive Lathe-turned hull component studded with rivets. Prevents the 5th dimension from uncurling by applying extreme inward mechanical pressure.",
            material: "Hyper-dense dark steel.",
            function: "Maintains the Planck-length radius of the compactified dimensions.",
            assemblyOrder: 12,
            connections: ["Central_Calabi_Yau_Core"],
            failureEffect: "Radius increases, diluting gravity to zero.",
            cascadeFailures: ["Metric_Tensor_Distortion_Grid"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 80, y: 35, z: -20}
        });
    }

    function buildKleinManifold() {
        const kleinGroup = new THREE.Group();
        kleinGroup.position.set(0, 35, -55); // Behind the core

        // Custom Klein geometry
        const kleinGeo = createKleinBottleGeometry(150, 60);
        const kleinMesh = new THREE.Mesh(kleinGeo, customMats.quantumWireframe);
        kleinGroup.add(kleinMesh);
        
        // Inner opaque core of the Klein bottle
        const kleinInnerMat = new THREE.MeshStandardMaterial({color: 0xaa00ff, metalness: 0.8, roughness: 0.1, side: THREE.DoubleSide});
        const kleinMeshInner = new THREE.Mesh(kleinGeo, kleinInnerMat);
        kleinMeshInner.scale.set(0.95, 0.95, 0.95);
        kleinGroup.add(kleinMeshInner);

        group.add(kleinGroup);
        animObjects.push({ mesh: kleinGroup, type: 'klein' });

        parts.push({
            name: "Klein_Topology_Inverter",
            description: "A non-orientable mathematical surface rendered into physical reality. Creates a feedback loop for vacuum energy, feeding exhaust back into the intake without crossing an edge.",
            material: "Quantum wireframe overlaying a double-sided strange metal.",
            function: "Inverts parity and charge without utilizing the 4th spatial dimension, effectively hacking CPT symmetry.",
            assemblyOrder: 13,
            connections: ["Central_Calabi_Yau_Core", "Vacuum_Energy_Manifold"],
            failureEffect: "Antimatter conversion of the entire chassis.",
            cascadeFailures: ["Brane_Intersection_Nexus_Chassis"],
            originalPosition: {x: 0, y: 35, z: -55},
            explodedPosition: {x: 0, y: 80, z: -100}
        });
    }

    function buildDistortionGridAndEmitters() {
        const gridGroup = new THREE.Group();
        gridGroup.position.set(0, 35, -20);

        // Spherical lattice representing a metric tensor field
        const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const linkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
        linkGeo.rotateX(Math.PI / 2);

        const gridSize = 4;
        const spacing = 12;

        for(let x=-gridSize; x<=gridSize; x+=2) {
            for(let y=-gridSize; y<=gridSize; y+=2) {
                for(let z=-gridSize; z<=gridSize; z+=2) {
                    // Only build a shell to save some vertices, but keep it complex
                    if (Math.abs(x) < gridSize && Math.abs(y) < gridSize && Math.abs(z) < gridSize) continue;
                    
                    const px = x * spacing;
                    const py = y * spacing;
                    const pz = z * spacing;
                    
                    const node = new THREE.Mesh(nodeGeo, customMats.quantumGlow);
                    node.position.set(px, py, pz);
                    gridGroup.add(node);

                    // Add some links pointing to center
                    const linkLength = Math.sqrt(px*px + py*py + pz*pz);
                    const link = new THREE.Mesh(linkGeo, copper);
                    link.scale.set(1, 1, linkLength);
                    link.position.set(px/2, py/2, pz/2);
                    link.lookAt(new THREE.Vector3(0,0,0));
                    gridGroup.add(link);
                }
            }
        }

        group.add(gridGroup);
        animObjects.push({ mesh: gridGroup, type: 'grid' });

        parts.push({
            name: "Metric_Tensor_Distortion_Grid",
            description: "A sprawling 3D lattice mapping the discrete components of the metric tensor (g_mu_nu). Nodes glow intensely as gravitational waves pass through.",
            material: "Super-cooled glowing quantum nodes connected by copper conduits.",
            function: "Visualizes and manipulates the curvature of spacetime locally.",
            assemblyOrder: 14,
            connections: ["Central_Calabi_Yau_Core", "Dilaton_Field_Emitter"],
            failureEffect: "Spacetime becomes discontinuous. Movement becomes impossible.",
            cascadeFailures: ["Central_Calabi_Yau_Core"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: 150, z: -20}
        });

        // Dilaton Emitters
        const emitterGroup = new THREE.Group();
        emitterGroup.position.set(0, 35, -20);
        const dilatonGeo = new THREE.IcosahedronGeometry(4, 0);
        const positions = [
            [50, 50, 50], [-50, 50, 50], [50, -50, 50], [-50, -50, 50],
            [50, 50, -50], [-50, 50, -50], [50, -50, -50], [-50, -50, -50]
        ];
        
        positions.forEach((pos, idx) => {
            const em = new THREE.Mesh(dilatonGeo, glass);
            em.position.set(pos[0], pos[1], pos[2]);
            
            // Beam pointing to center
            const dist = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1] + pos[2]*pos[2]);
            const beamGeo = new THREE.CylinderGeometry(0.1, 2, dist, 16);
            beamGeo.rotateX(Math.PI / 2);
            const beam = new THREE.Mesh(beamGeo, customMats.quantumGlow);
            beam.position.set(pos[0]/2, pos[1]/2, pos[2]/2);
            beam.lookAt(new THREE.Vector3(0,0,0));
            
            emitterGroup.add(em, beam);
            animObjects.push({ mesh: em, type: 'dilaton', idx: idx });
        });

        group.add(emitterGroup);
        parts.push({
            name: "Dilaton_Field_Emitter",
            description: "Icosahedral arrays firing concentrated beams of scalar fields into the core. Regulates the strength of gravity and string coupling constants.",
            material: "Theoretical glass matrix with energized scalar beams.",
            function: "Stabilizes the size of the extra dimensions.",
            assemblyOrder: 15,
            connections: ["Metric_Tensor_Distortion_Grid"],
            failureEffect: "Gravity becomes a repulsive force.",
            cascadeFailures: ["Compactification_Radius_Stabilizer"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: 0, z: -150}
        });
    }

    function buildGrillesAndExhaust() {
        // Massive front grille
        const grilleGroup = new THREE.Group();
        grilleGroup.position.set(0, 15, 30); // Front of chassis

        const frameGeo = new THREE.BoxGeometry(30, 20, 2);
        const frame = new THREE.Mesh(frameGeo, darkSteel);
        grilleGroup.add(frame);

        // Hundreds of tiny extruded boxes
        const holeGeo = new THREE.BoxGeometry(1.5, 1.5, 2.5);
        for(let x=-13; x<=13; x+=2) {
            for(let y=-8; y<=8; y+=2) {
                const hole = new THREE.Mesh(holeGeo, customMats.hyperMatter);
                hole.position.set(x, y, 0);
                grilleGroup.add(hole);
            }
        }

        // Bumper
        const bumperGeo = new THREE.CylinderGeometry(2, 2, 34, 16);
        bumperGeo.rotateZ(Math.PI / 2);
        const bumper = new THREE.Mesh(bumperGeo, steel);
        bumper.position.set(0, -10, 3);
        grilleGroup.add(bumper);

        // Headlights (glowing intensely)
        const lightGeo = new THREE.BoxGeometry(4, 4, 1);
        const lightL = new THREE.Mesh(lightGeo, customMats.energyPulse);
        lightL.position.set(-16, 2, 2);
        const lightR = new THREE.Mesh(lightGeo, customMats.energyPulse);
        lightR.position.set(16, 2, 2);
        grilleGroup.add(lightL, lightR);

        group.add(grilleGroup);
        parts.push({
            name: "Heavy_Duty_Grilles_And_Ladders",
            description: "Industrial-grade frontal protection. Filters macroscopic debris (like entire rogue planets) from entering the dimensional intake.",
            material: "Hyper-matter laced steel grids.",
            function: "Impact protection and spatial filtering.",
            assemblyOrder: 16,
            connections: ["Brane_Intersection_Nexus_Chassis"],
            failureEffect: "Debris clogs the Calabi-Yau core, causing a localized big bang.",
            cascadeFailures: ["Central_Calabi_Yau_Core"],
            originalPosition: {x: 0, y: 15, z: 30},
            explodedPosition: {x: 0, y: 15, z: 60}
        });

        // Massive Exhaust Stacks
        const exhaustGroup = new THREE.Group();
        const stackGeo = new THREE.CylinderGeometry(2, 3, 40, 32);
        
        const stackL = new THREE.Mesh(stackGeo, chrome);
        stackL.position.set(-18, 40, 10);
        const stackR = new THREE.Mesh(stackGeo, chrome);
        stackR.position.set(18, 40, 10);

        // Exhaust energy pulses inside
        const pulseGeo = new THREE.CylinderGeometry(1.8, 1.8, 38, 16);
        const pulseL = new THREE.Mesh(pulseGeo, customMats.energyPulse);
        pulseL.position.set(-18, 40, 10);
        const pulseR = new THREE.Mesh(pulseGeo, customMats.energyPulse);
        pulseR.position.set(18, 40, 10);

        exhaustGroup.add(stackL, stackR, pulseL, pulseR);
        group.add(exhaustGroup);

        animObjects.push({ mesh: pulseL, type: 'exhaust_pulse' });
        animObjects.push({ mesh: pulseR, type: 'exhaust_pulse' });

        parts.push({
            name: "Exhaust_Stacks_And_Radiators",
            description: "Twin towering chromite smokestacks. They don't vent smoke, but rather radiate excess vacuum energy and hawking radiation generated by the core.",
            material: "Heat-tempered chrome and energy plasma.",
            function: "Vents excess entropy into alternate timelines to prevent thermodynamic collapse.",
            assemblyOrder: 17,
            connections: ["Brane_Intersection_Nexus_Chassis"],
            failureEffect: "Thermal overload resulting in a kugelblitz (black hole made of pure energy).",
            cascadeFailures: ["Operator_Command_Cabin", "Central_Calabi_Yau_Core"],
            originalPosition: {x: 0, y: 40, z: 10},
            explodedPosition: {x: 0, y: 100, z: 10}
        });
    }

    function buildKaluzaHarmonicsAndFoam() {
        const harmonicsGroup = new THREE.Group();
        harmonicsGroup.position.set(0, 35, -20);
        
        // Nested angled cylinders for Harmonics
        for(let i=1; i<=5; i++) {
            const harmGeo = new THREE.CylinderGeometry(15 + i*2, 15 + i*2, 4, 64, 1, true);
            const harm = new THREE.Mesh(harmGeo, customMats.quantumWireframe);
            harm.rotation.x = Math.PI / 2;
            // Add some angled cuts (simulated by rotation and clipping, but we just rotate here)
            harm.rotation.y = (i * Math.PI) / 5;
            harm.rotation.z = (i * Math.PI) / 7;
            harmonicsGroup.add(harm);
            animObjects.push({ mesh: harm, type: 'harmonic', speed: i * 0.01 });
        }
        
        group.add(harmonicsGroup);
        parts.push({
            name: "Kaluza_Cylinder_Harmonics",
            description: "A series of resonant wireframe cylinder bounds representing the 'cylinder condition', rendering the 5th dimension unobservable at low energies.",
            material: "Quantum wireframe.",
            function: "Imposes boundary conditions on the 5D metric, allowing 4D physics to proceed normally.",
            assemblyOrder: 18,
            connections: ["Central_Calabi_Yau_Core"],
            failureEffect: "The 5th dimension becomes macroscopically visible, driving observers insane.",
            cascadeFailures: ["Operator_Command_Cabin"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 60, y: 80, z: -20}
        });

        // Quantum Foam Substructure
        const foamGroup = new THREE.Group();
        foamGroup.position.set(0, 35, -20);
        const foamGeo = new THREE.TorusGeometry(2, 1.5, 8, 16);
        for(let i=0; i<150; i++) {
            const foam = new THREE.Mesh(foamGeo, glass);
            const r = Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            foam.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            foam.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            const s = Math.random() * 0.5 + 0.1;
            foam.scale.set(s, s, s);
            foamGroup.add(foam);
            animObjects.push({ mesh: foam, type: 'foam' });
        }
        group.add(foamGroup);
        parts.push({
            name: "Quantum_Foam_Substructure",
            description: "Violent microscopic fluctuations in spacetime topology. A seething mass of tiny wormholes and virtual particles at the Planck scale.",
            material: "Theoretical glass.",
            function: "Provides the base probabilistic medium for the manifold to operate within.",
            assemblyOrder: 19,
            connections: ["Central_Calabi_Yau_Core"],
            failureEffect: "Spacetime becomes completely smooth, violating the uncertainty principle and crashing the universe.",
            cascadeFailures: ["Central_Calabi_Yau_Core", "Vacuum_Energy_Manifold"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: 35, z: -80}
        });
    }

    function buildRadionOscillators() {
        const radionGroup = new THREE.Group();
        radionGroup.position.set(0, 35, -20);

        const radGeo = new THREE.TorusKnotGeometry(40, 1.5, 300, 32, 2, 9);
        const radMesh = new THREE.Mesh(radGeo, customMats.quantumGlow);
        radionGroup.add(radMesh);
        
        const radGeo2 = new THREE.TorusKnotGeometry(42, 0.5, 300, 32, 9, 2);
        const radMesh2 = new THREE.Mesh(radGeo2, customMats.quantumWireframe);
        radionGroup.add(radMesh2);

        group.add(radionGroup);
        animObjects.push({ mesh: radionGroup, type: 'radion' });

        parts.push({
            name: "Radion_Field_Oscillator",
            description: "Massive perimeter knots that pulse continuously. The radion field governs the distance between branes in higher dimensional bulk space.",
            material: "Glowing quantum plasma.",
            function: "Prevents neighboring branes (parallel universes) from colliding with the chassis.",
            assemblyOrder: 20,
            connections: ["Compactification_Radius_Stabilizer"],
            failureEffect: "Ekpyrotic brane collision. Total cosmic reset.",
            cascadeFailures: ["Brane_Intersection_Nexus_Chassis", "Central_Calabi_Yau_Core"],
            originalPosition: {x: 0, y: 35, z: -20},
            explodedPosition: {x: 0, y: 150, z: -150}
        });
    }

    // Execute builders
    buildChassis();
    buildTire("Dimensional_Tires_Front_Left", new THREE.Vector3(-18, 10, 22), 2);
    buildTire("Dimensional_Tires_Front_Right", new THREE.Vector3(18, 10, 22), 3);
    buildTire("Dimensional_Tires_Rear_Left", new THREE.Vector3(-18, 10, -22), 4);
    buildTire("Dimensional_Tires_Rear_Right", new THREE.Vector3(18, 10, -22), 5);
    buildSuspensionNetwork();
    buildCabin();
    buildCalabiYauCore();
    buildGaugeFields();
    buildFluxRingsAndStabilizer();
    buildKleinManifold();
    buildDistortionGridAndEmitters();
    buildGrillesAndExhaust();
    buildKaluzaHarmonicsAndFoam();
    buildRadionOscillators();

    const description = "Ultra God-Tier Kaluza-Klein Compactification Manifold mounted on a Heavy-Duty Dimensional Mobility Chassis. This machine physically renders 11-dimensional string theory mathematics into macro-scale mechanics. It features deeply nested Calabi-Yau cores, pulsing U(1) gauge field toroids, fully articulated hydraulic suspensions, and aggressive off-road treads capable of finding traction on non-Euclidean probability curves. An absolute pinnacle of theoretical engineering.";

    const quizQuestions = [
        {
            question: "In the original Kaluza-Klein theory, what does the off-diagonal component of the 5D metric tensor correspond to in 4D spacetime?",
            options: [
                "The Electromagnetic Vector Potential (A_mu)",
                "The Graviton field (g_mu_nu)",
                "The Dilaton scalar field (phi)",
                "The Higgs boson"
            ],
            answer: 0,
            explanation: "In Kaluza's original formulation, the off-diagonal elements g_{mu 5} of the 5-dimensional metric tensor are identified with the 4-dimensional electromagnetic vector potential A_mu, beautifully unifying gravity and electromagnetism via pure geometry."
        },
        {
            question: "What is the primary physical implication of the 'cylinder condition' imposed by Kaluza in his 1921 paper?",
            options: [
                "The universe is shaped like a hyper-cylinder.",
                "All derivatives of the 5D metric components with respect to the fifth coordinate must vanish.",
                "Energy cannot escape into the 5th dimension.",
                "The extra dimension must be exactly 1 Planck length in radius."
            ],
            answer: 1,
            explanation: "The cylinder condition states that no physical quantities depend on the fifth coordinate (derivatives w.r.t. x^5 are zero), explaining why we don't macroscopically observe the fifth dimension despite living in it."
        },
        {
            question: "In the context of modern string theory, compactification on a Calabi-Yau manifold preserves a fraction of the original supersymmetry. What specific mathematical property of the Calabi-Yau manifold ensures N=1 supersymmetry in the resulting 4D effective field theory?",
            options: [
                "It has a negative Euler characteristic.",
                "It is a complex Kähler manifold with a vanishing first Chern class (SU(3) holonomy).",
                "It possesses exactly 6 dimensions.",
                "It is a non-orientable surface like a Klein bottle."
            ],
            answer: 1,
            explanation: "A Calabi-Yau threefold is a complex Kähler manifold with vanishing first Chern class, which implies it admits a Ricci-flat metric and has SU(3) holonomy. This specific holonomy guarantees that exactly one unbroken supersymmetry generator survives in 4D."
        },
        {
            question: "How does the size of the compactified extra dimension (radius R) in Kaluza-Klein theory relate to the quantized electric charge (e) in 4D?",
            options: [
                "Electric charge is proportional to R squared.",
                "Electric charge is completely independent of R.",
                "The fundamental unit of electric charge is inversely proportional to the radius (e ~ 1/R).",
                "Electric charge is equal to the circumference of the dimension."
            ],
            answer: 2,
            explanation: "Momentum in the compact fifth dimension is quantized as p_5 = n/R. In 4D, this extra-dimensional momentum manifests as electric charge, meaning the fundamental charge unit e is proportional to 1/R, neatly explaining charge quantization."
        },
        {
            question: "When extending Kaluza-Klein theory to non-Abelian gauge groups (e.g., SU(2) x U(1) for the electroweak force), what type of geometric structure must the compactified extra dimensions form?",
            options: [
                "A simple 1D circle (S1).",
                "A flat Euclidean torus (Tn).",
                "A continuous symmetry group manifold or coset space.",
                "A perfectly spherical black hole horizon."
            ],
            answer: 2,
            explanation: "To generate non-Abelian gauge symmetries, the extra dimensions cannot be just circles or flat tori; they must form a curved space possessing continuous continuous symmetries (isometries) matching the desired gauge group, such as a continuous group manifold or coset space acting as a fiber."
        }
    ];

    function animate(time, speed, meshes) {
        const scaledTime = time * speed;
        
        animObjects.forEach(obj => {
            if (obj.type === 'tire') {
                // Tires rotate forward
                obj.mesh.rotation.x = scaledTime * obj.speedMultiplier;
            } 
            else if (obj.type === 'suspension') {
                // Suspensions bounce slightly using sine waves
                const bounce = Math.sin(scaledTime * 5 + obj.phaseOffset) * 1.5;
                obj.mesh.children[0].rotation.z = bounce * 0.05; // upper arm
                obj.mesh.children[1].rotation.z = bounce * 0.05; // lower arm
                obj.mesh.children[2].position.y = 2 + bounce * 0.5; // outer strut
                obj.mesh.children[3].position.y = -4 + bounce * 0.5; // inner strut
                obj.mesh.children[4].scale.y = 1 - bounce * 0.05; // spring scales
            }
            else if (obj.type === 'screen') {
                // Screens flicker/pulse
                obj.mat.emissiveIntensity = 1.5 + Math.random();
            }
            else if (obj.type === 'joystick') {
                // Joysticks twitch
                obj.mesh.rotation.x = Math.PI / 6 + Math.sin(scaledTime * 10) * 0.1;
                obj.mesh.rotation.z = Math.cos(scaledTime * 8) * 0.1;
            }
            else if (obj.type === 'steering') {
                // Steering wheel auto-adjusts
                obj.mesh.rotation.z = Math.sin(scaledTime * 2) * 0.3;
            }
            else if (obj.type === 'core_knot') {
                // Complex rotation for the 32 knots
                obj.mesh.rotation.x += 0.01 * speed * (obj.idx % 2 === 0 ? 1 : -1);
                obj.mesh.rotation.y += 0.015 * speed;
                obj.mesh.rotation.z += 0.02 * speed * (obj.idx % 3 === 0 ? 1 : -1);
                
                // Pulsing scale
                const scale = 1 + Math.sin(scaledTime * 3 + obj.idx) * 0.05;
                obj.mesh.scale.set(scale, scale, scale);
            }
            else if (obj.type === 'core_sphere') {
                const scale = 1 + Math.sin(scaledTime * 10) * 0.2;
                obj.mesh.scale.set(scale, scale, scale);
                obj.mesh.rotation.y += 0.05 * speed;
            }
            else if (obj.type === 'gauge_ring') {
                obj.mesh.rotation[obj.axis] += obj.speed * speed;
            }
            else if (obj.type === 'stabilizer') {
                obj.mesh.rotation.y = scaledTime * 0.5;
            }
            else if (obj.type === 'klein') {
                // Topology inverts/twists
                obj.mesh.rotation.x = Math.sin(scaledTime * 0.5) * Math.PI;
                obj.mesh.rotation.y = scaledTime * 0.2;
                obj.mesh.scale.x = 1 + Math.sin(scaledTime * 2) * 0.2;
                obj.mesh.scale.z = 1 + Math.cos(scaledTime * 2) * 0.2;
            }
            else if (obj.type === 'grid') {
                // Grid pulsates and twists
                obj.mesh.rotation.y = Math.sin(scaledTime * 0.3) * 0.5;
                const scale = 1 + Math.sin(scaledTime * 4) * 0.1;
                obj.mesh.scale.set(scale, scale, scale);
            }
            else if (obj.type === 'dilaton') {
                obj.mesh.rotation.x += 0.05 * speed;
                obj.mesh.rotation.y += 0.05 * speed;
                // Jitter position slightly
                obj.mesh.position.y += Math.sin(scaledTime * 20 + obj.idx) * 0.2;
            }
            else if (obj.type === 'exhaust_pulse') {
                // Energy pulsing up the stack
                obj.mesh.scale.y = 1 + Math.sin(scaledTime * 15) * 0.05;
                // Move UVs if textured, else just pulse intensity (we don't have direct mat access here, so we skip mat update for performance)
            }
            else if (obj.type === 'harmonic') {
                obj.mesh.rotation.z += obj.speed * speed;
                obj.mesh.rotation.x = Math.PI / 2 + Math.sin(scaledTime * 2) * 0.1;
            }
            else if (obj.type === 'foam') {
                // Foam bubbles randomly rotating and scaling
                obj.mesh.rotation.x += Math.random() * 0.1 * speed;
                obj.mesh.rotation.y += Math.random() * 0.1 * speed;
                const scale = 0.5 + Math.sin(scaledTime * 5 + obj.mesh.position.x) * 0.3;
                obj.mesh.scale.set(scale, scale, scale);
            }
            else if (obj.type === 'radion') {
                obj.mesh.rotation.x = scaledTime * 0.1;
                obj.mesh.rotation.y = scaledTime * -0.15;
                const scale = 1 + Math.sin(scaledTime * 0.5) * 0.1;
                obj.mesh.scale.set(scale, scale, scale);
            }
        });
        
        // Pulse custom materials globally
        customMats.quantumGlow.emissiveIntensity = 3.5 + Math.sin(scaledTime * 8) * 1.5;
        customMats.quantumWireframe.emissiveIntensity = 2.0 + Math.cos(scaledTime * 12) * 1.0;
        customMats.energyPulse.emissiveIntensity = 4.0 + Math.sin(scaledTime * 15) * 2.0;
    }

    return { group, parts, description, quizQuestions, animate };
}
