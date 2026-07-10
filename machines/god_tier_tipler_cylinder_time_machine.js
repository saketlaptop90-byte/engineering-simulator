import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshesToAnimate = [];
    
    // --- ADVANCED MATERIAL DEFINITIONS ---
    const neutroniumMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.1,
        metalness: 1.0,
        emissive: 0x0a0015,
        emissiveIntensity: 0.8,
        envMapIntensity: 2.0
    });

    const activeEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });
    
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const goldFoilMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 1.0,
        bumpScale: 0.05
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });

    // --- PROCEDURAL GEOMETRY GENERATORS ---

    // 1. Main Tipler Cylinder Core using LatheGeometry for extreme detail
    const generateTiplerCore = () => {
        const points = [];
        const length = 400;
        const baseRadius = 20;
        
        for (let i = 0; i <= 100; i++) {
            const y = (i / 100) * length - length / 2;
            // Introduce microscopic structural ripples to simulate extreme gravity binding
            const ripple = Math.sin(i * 0.5) * 0.5;
            const radius = baseRadius + ripple;
            points.push(new THREE.Vector2(radius, y));
        }
        
        const geometry = new THREE.LatheGeometry(points, 256);
        const coreMesh = new THREE.Mesh(geometry, neutroniumMaterial);
        coreMesh.castShadow = true;
        coreMesh.receiveShadow = true;
        
        // Add intricate surface paneling lines
        const wireframeGeo = new THREE.WireframeGeometry(geometry);
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0x220033, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
        coreMesh.add(wireframe);
        
        return coreMesh;
    };

    // 2. Temporal Traction Tires (As per mandate: Torus with hundreds of lugs & complex spokes)
    const generateTemporalTire = (radius, tube, radialSegments, tubularSegments, lugCount) => {
        const tireGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const torusMesh = new THREE.Mesh(torusGeo, rubber);
        torusMesh.castShadow = true;
        tireGroup.add(torusMesh);
        
        // Aggressive off-road spacetime lugs
        const lugGeo = new THREE.BoxGeometry(tube * 2.5, tube * 0.8, tube * 1.5);
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position on the outer edge of the torus
            lug.position.x = Math.cos(angle) * (radius + tube * 0.3);
            lug.position.y = Math.sin(angle) * (radius + tube * 0.3);
            lug.position.z = 0;
            // Orient the lug
            lug.rotation.z = angle;
            lug.rotation.x = Math.PI / 2;
            // Add slight alternating angle for aggressive tread pattern
            if (i % 2 === 0) lug.rotation.y = 0.2;
            else lug.rotation.y = -0.2;
            
            lug.castShadow = true;
            tireGroup.add(lug);
        }
        
        // Complex Spoke Arrays (CylinderGeometry)
        const rimGeo = new THREE.CylinderGeometry(radius - tube, radius - tube, tube * 1.2, 64);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);
        
        const spokeCount = 24;
        const spokeGeo = new THREE.CylinderGeometry(tube * 0.1, tube * 0.2, radius - tube, 16);
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.position.x = Math.cos(angle) * ((radius - tube) / 2);
            spoke.position.y = Math.sin(angle) * ((radius - tube) / 2);
            spoke.rotation.z = angle + Math.PI / 2;
            
            // Add sub-spoke struts for hyper-complexity
            const strutGeo = new THREE.CylinderGeometry(tube * 0.05, tube * 0.05, tube * 2, 8);
            const strut = new THREE.Mesh(strutGeo, darkSteel);
            strut.position.y = (radius - tube) / 3;
            strut.rotation.x = Math.PI / 2;
            spoke.add(strut);
            
            tireGroup.add(spoke);
        }
        
        return tireGroup;
    };

    // 3. Hydraulic Piston Assemblies (Cylinder within Cylinder)
    const generateHydraulicPiston = (length, radius) => {
        const pistonGroup = new THREE.Group();
        
        // Outer casing
        const casingGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const casing = new THREE.Mesh(casingGeo, darkSteel);
        casing.position.y = length * 0.3;
        
        // Inner rod
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length * 0.7; // Initial extended position
        
        // Piston Head
        const headGeo = new THREE.CylinderGeometry(radius * 1.2, radius * 1.2, length * 0.1, 32);
        const head = new THREE.Mesh(headGeo, copper);
        head.position.y = length * 0.6;
        casing.add(head);

        // Fluid input line (TubeGeometry)
        class PistonPipeCurve extends THREE.Curve {
            constructor(scale) {
                super();
                this.scale = scale;
            }
            getPoint(t) {
                const x = Math.cos(t * Math.PI) * this.scale;
                const y = Math.sin(t * Math.PI) * this.scale * 2;
                const z = t * this.scale * 0.5;
                return new THREE.Vector3(x, y, z);
            }
        }
        const pipePath = new PistonPipeCurve(radius * 2);
        const pipeGeo = new THREE.TubeGeometry(pipePath, 20, radius * 0.2, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipe.position.set(radius, length * 0.1, 0);
        casing.add(pipe);

        pistonGroup.add(casing);
        pistonGroup.add(rod);
        
        pistonGroup.userData = {
            casing: casing,
            rod: rod,
            baseLength: length
        };
        
        return pistonGroup;
    };

    // 4. Extruded Geometries for Control Cabins and Operator Stations
    const generateOperatorCabin = () => {
        const cabinGroup = new THREE.Group();
        
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(10, 0);
        shape.lineTo(12, 5);
        shape.lineTo(10, 10);
        shape.lineTo(2, 10);
        shape.lineTo(0, 5);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            depth: 8,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5
        };

        const cabinGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const cabinMesh = new THREE.Mesh(cabinGeo, darkSteel);
        cabinGroup.add(cabinMesh);

        // Tinted Glass Window
        const windowShape = new THREE.Shape();
        windowShape.moveTo(1, 1);
        windowShape.lineTo(9, 1);
        windowShape.lineTo(10.5, 5);
        windowShape.lineTo(9, 9);
        windowShape.lineTo(2.5, 9);
        windowShape.lineTo(1, 5);
        windowShape.lineTo(1, 1);
        
        const windowGeo = new THREE.ExtrudeGeometry(windowShape, { depth: 8.2, bevelEnabled: false });
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.z = -0.1;
        cabinGroup.add(windowMesh);

        // Interior Console
        const consoleGeo = new THREE.BoxGeometry(6, 3, 2);
        const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
        consoleMesh.position.set(5, 2, 4);
        cabinGroup.add(consoleMesh);
        
        // Glowing Screens
        const screenGeo = new THREE.PlaneGeometry(5, 2);
        const screen = new THREE.Mesh(screenGeo, screenMaterial);
        screen.position.set(5, 3.6, 3.01);
        screen.rotation.x = -Math.PI / 6;
        cabinGroup.add(screen);
        
        // Joysticks
        const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
        const stick1 = new THREE.Mesh(stickGeo, chrome);
        stick1.position.set(3, 3, 4.5);
        cabinGroup.add(stick1);
        const stick2 = new THREE.Mesh(stickGeo, chrome);
        stick2.position.set(7, 3, 4.5);
        cabinGroup.add(stick2);
        
        return cabinGroup;
    };

    // 5. Spacetime Twist / Frame Dragging Visualizer (Shader-like effect using extensive particle/line math)
    const generateSpacetimeGrid = () => {
        const gridGroup = new THREE.Group();
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.4 });
        
        // Create multiple nested helical shells
        const shells = 10;
        const height = 400;
        for (let s = 1; s <= shells; s++) {
            const radius = 25 + s * 15;
            const segments = 200;
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const y = (t - 0.5) * height;
                // Frame dragging twist is stronger closer to the core
                const twist = (1 / Math.sqrt(radius)) * y * 0.5; 
                const x = Math.cos(twist) * radius;
                const z = Math.sin(twist) * radius;
                vertices.push(x, y, z);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const helix = new THREE.Line(geometry, lineMaterial);
            helix.userData = { radius: radius, baseTwistFactor: 1 / Math.sqrt(radius) };
            gridGroup.add(helix);
            meshesToAnimate.push({ type: 'spacetime_helix', mesh: helix, segments, height });
        }
        return gridGroup;
    };

    // --- ASSEMBLY OF THE MACHINE ---

    // Part 1: Neutronium Core
    const core = generateTiplerCore();
    core.name = "neutronium_core_cylinder";
    group.add(core);
    meshesToAnimate.push({ type: 'core', mesh: core });

    // Part 2 & 3: Temporal Traction Tires (Top and Bottom)
    // To literally grip and spin spacetime
    const topTire = generateTemporalTire(35, 8, 32, 128, 60);
    topTire.position.y = 180;
    topTire.rotation.x = Math.PI / 2;
    topTire.name = "ergosphere_containment_ring_alpha";
    group.add(topTire);
    meshesToAnimate.push({ type: 'tire', mesh: topTire, direction: 1 });

    const bottomTire = generateTemporalTire(35, 8, 32, 128, 60);
    bottomTire.position.y = -180;
    bottomTire.rotation.x = Math.PI / 2;
    bottomTire.name = "ergosphere_containment_ring_omega";
    group.add(bottomTire);
    meshesToAnimate.push({ type: 'tire', mesh: bottomTire, direction: -1 });

    // Part 4: Frame-Dragging Induction Array (Spiral coils around core)
    const inductionGroup = new THREE.Group();
    const coilCount = 8;
    for (let c = 0; c < coilCount; c++) {
        class HelixCurve extends THREE.Curve {
            getPoint(t) {
                const radius = 23;
                const height = 360;
                const angle = t * Math.PI * 10 + (c * Math.PI * 2 / coilCount);
                return new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * height, Math.sin(angle) * radius);
            }
        }
        const coilGeo = new THREE.TubeGeometry(new HelixCurve(), 300, 1.5, 12, false);
        const coil = new THREE.Mesh(coilGeo, copper);
        inductionGroup.add(coil);
    }
    inductionGroup.name = "frame_dragging_induction_array";
    group.add(inductionGroup);
    meshesToAnimate.push({ type: 'induction_array', mesh: inductionGroup });

    // Part 5: Gravitational Wave Dampener Nodes
    const dampenerGroup = new THREE.Group();
    const nodeGeo = new THREE.IcosahedronGeometry(4, 1);
    for (let i = 0; i < 20; i++) {
        const node = new THREE.Mesh(nodeGeo, activeEnergyMaterial);
        const angle = (i / 20) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 45, 0, Math.sin(angle) * 45);
        dampenerGroup.add(node);
        meshesToAnimate.push({ type: 'dampener_node', mesh: node, index: i });
    }
    dampenerGroup.name = "gravitational_wave_dampener_nodes";
    group.add(dampenerGroup);

    // Part 6: Exotic Matter Feedline Manifold (Extensive Hydraulic Lines)
    const feedlineGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const p1 = new THREE.Vector3(Math.cos(angle)*50, 150, Math.sin(angle)*50);
        const p2 = new THREE.Vector3(Math.cos(angle)*22, 100, Math.sin(angle)*22);
        const p3 = new THREE.Vector3(Math.cos(angle)*22, -100, Math.sin(angle)*22);
        const p4 = new THREE.Vector3(Math.cos(angle)*50, -150, Math.sin(angle)*50);
        const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
        const pipeGeo = new THREE.TubeGeometry(curve, 50, 2, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        
        // Add rivet rings along the pipe
        for(let j=0.1; j<0.9; j+=0.1) {
            const pt = curve.getPointAt(j);
            const tangent = curve.getTangentAt(j);
            const ringGeo = new THREE.TorusGeometry(2.5, 0.5, 8, 16);
            const ring = new THREE.Mesh(ringGeo, darkSteel);
            ring.position.copy(pt);
            ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), tangent);
            feedlineGroup.add(ring);
        }
        
        feedlineGroup.add(pipe);
    }
    feedlineGroup.name = "exotic_matter_feedline_manifold";
    group.add(feedlineGroup);

    // Part 7: Chronal Shift Matrix Core (Central Processing Ring)
    const shiftMatrixGeo = new THREE.TorusGeometry(60, 5, 32, 128);
    const shiftMatrix = new THREE.Mesh(shiftMatrixGeo, goldFoilMaterial);
    shiftMatrix.rotation.x = Math.PI / 2;
    shiftMatrix.name = "chronal_shift_matrix_core";
    group.add(shiftMatrix);
    meshesToAnimate.push({ type: 'shift_matrix', mesh: shiftMatrix });

    // Part 8: CTC Stabilizer Gyros
    const gyroGroup = new THREE.Group();
    const gyroCount = 4;
    for(let i=0; i<gyroCount; i++) {
        const angle = (i/gyroCount) * Math.PI * 2;
        const gyroLocalGroup = new THREE.Group();
        
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(10, 0.8, 16, 64), chrome);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(8, 0.8, 16, 64), copper);
        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6, 0.8, 16, 64), steel);
        const core = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), activeEnergyMaterial);
        
        gyroLocalGroup.add(ring1, ring2, ring3, core);
        gyroLocalGroup.position.set(Math.cos(angle)*80, 0, Math.sin(angle)*80);
        gyroGroup.add(gyroLocalGroup);
        
        meshesToAnimate.push({ type: 'gyro', mesh: gyroLocalGroup, rings: [ring1, ring2, ring3], index: i });
    }
    gyroGroup.name = "ctc_stabilizer_gyros";
    group.add(gyroGroup);

    // Part 9: Spacetime Metric Modulator Panels
    const panelGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(15, 40, 2);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const panel = new THREE.Mesh(panelGeo, aluminum);
        panel.position.set(Math.cos(angle)*70, 50, Math.sin(angle)*70);
        panel.rotation.y = -angle + Math.PI/2;
        panel.rotation.x = 0.2; // Tilted
        panelGroup.add(panel);
        
        // Add some glowing lines to panels
        const glowGeo = new THREE.PlaneGeometry(12, 35);
        const glow = new THREE.Mesh(glowGeo, plasmaMaterial);
        glow.position.z = 1.1;
        panel.add(glow);
        meshesToAnimate.push({ type: 'panel_glow', mesh: glow, index: i });
    }
    panelGroup.name = "spacetime_metric_modulator_panels";
    group.add(panelGroup);

    // Part 10: Hawking Radiation Deflector Shields
    const shieldGroup = new THREE.Group();
    const shieldGeo = new THREE.CylinderGeometry(90, 90, 20, 64, 1, true, 0, Math.PI);
    const shieldTop = new THREE.Mesh(shieldGeo, glass);
    shieldTop.position.y = 120;
    const shieldBot = new THREE.Mesh(shieldGeo, glass);
    shieldBot.position.y = -120;
    shieldBot.rotation.x = Math.PI;
    shieldBot.rotation.y = Math.PI;
    shieldGroup.add(shieldTop, shieldBot);
    shieldGroup.name = "hawking_radiation_deflector_shields";
    group.add(shieldGroup);
    meshesToAnimate.push({ type: 'shield', mesh: shieldGroup });

    // Part 11: Quantum Vacuum Energy Tap
    const energyTap = new THREE.Group();
    const tapBase = new THREE.Mesh(new THREE.CylinderGeometry(20, 30, 20, 32), darkSteel);
    tapBase.position.y = 220;
    const tapSpire = new THREE.Mesh(new THREE.ConeGeometry(5, 50, 16), activeEnergyMaterial);
    tapSpire.position.y = 250;
    energyTap.add(tapBase, tapSpire);
    energyTap.name = "quantum_vacuum_energy_tap";
    group.add(energyTap);
    meshesToAnimate.push({ type: 'energy_tap', mesh: tapSpire });

    // Part 12: Relativistic Mass Compensator Coils (Large external rings)
    const compGroup = new THREE.Group();
    const compRingGeo = new THREE.TorusGeometry(120, 3, 32, 128);
    for(let i=0; i<5; i++) {
        const y = -100 + i * 50;
        const ring = new THREE.Mesh(compRingGeo, copper);
        ring.position.y = y;
        ring.rotation.x = Math.PI / 2;
        compGroup.add(ring);
    }
    compGroup.name = "relativistic_mass_compensator_coils";
    group.add(compGroup);

    // Part 13: Cauchy Horizon Projector Lenses
    const lensGroup = new THREE.Group();
    const lensGeo = new THREE.SphereGeometry(25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
    const lensTop = new THREE.Mesh(lensGeo, glass);
    lensTop.position.y = 200;
    const lensBot = new THREE.Mesh(lensGeo, glass);
    lensBot.position.y = -200;
    lensBot.rotation.x = Math.PI;
    lensGroup.add(lensTop, lensBot);
    lensGroup.name = "cauchy_horizon_projector_lenses";
    group.add(lensGroup);

    // Part 14: Singular Boundary Monitor Array
    const monitorArray = new THREE.Group();
    const armGeo = new THREE.BoxGeometry(2, 2, 40);
    for(let i=0; i<16; i++) {
        const arm = new THREE.Mesh(armGeo, steel);
        const angle = (i/16) * Math.PI * 2;
        arm.position.set(Math.cos(angle)*100, 0, Math.sin(angle)*100);
        arm.rotation.y = -angle;
        
        // Add sensor dish
        const dishGeo = new THREE.CylinderGeometry(5, 0.1, 2, 16);
        const dish = new THREE.Mesh(dishGeo, darkSteel);
        dish.position.z = 20;
        dish.rotation.x = Math.PI / 2;
        arm.add(dish);
        
        monitorArray.add(arm);
        meshesToAnimate.push({ type: 'monitor_arm', mesh: arm, index: i });
    }
    monitorArray.name = "singular_boundary_monitor_array";
    group.add(monitorArray);

    // Part 15: Lorentz Factor Amplifier Rings
    const lorentzGroup = new THREE.Group();
    const lRingGeo = new THREE.TorusGeometry(30, 2, 16, 64);
    for(let i=0; i<20; i++) {
        const lRing = new THREE.Mesh(lRingGeo, plasmaMaterial);
        lRing.position.y = -190 + (i * 20);
        lRing.rotation.x = Math.PI / 2;
        lorentzGroup.add(lRing);
        meshesToAnimate.push({ type: 'lorentz_ring', mesh: lRing, index: i, baseY: lRing.position.y });
    }
    lorentzGroup.name = "lorentz_factor_amplifier_rings";
    group.add(lorentzGroup);

    // Part 16: Cauchy Surface Disruptor Beam
    const beamGeo = new THREE.CylinderGeometry(1, 1, 600, 16);
    const beam = new THREE.Mesh(beamGeo, plasmaMaterial);
    beam.name = "cauchy_surface_disruptor_beam";
    group.add(beam);
    meshesToAnimate.push({ type: 'disruptor_beam', mesh: beam });

    // Part 17: Observer Vessel 'Tipler's Dream' (Detailed probe interacting with CTC)
    const observerGroup = new THREE.Group();
    const hullGeo = new THREE.CapsuleGeometry(3, 10, 16, 32);
    const hull = new THREE.Mesh(hullGeo, steel);
    hull.rotation.z = Math.PI / 2;
    observerGroup.add(hull);
    
    const engineGeo = new THREE.CylinderGeometry(2, 3, 4, 16);
    const engine = new THREE.Mesh(engineGeo, copper);
    engine.position.x = -6;
    engine.rotation.z = Math.PI / 2;
    observerGroup.add(engine);

    const engineGlow = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), activeEnergyMaterial);
    engineGlow.position.x = -8;
    observerGroup.add(engineGlow);
    
    observerGroup.name = "observer_vessel_tiplers_dream";
    group.add(observerGroup);
    meshesToAnimate.push({ type: 'probe', mesh: observerGroup });

    // Add Spacetime Grid
    const spacetimeGrid = generateSpacetimeGrid();
    group.add(spacetimeGrid);

    // Add heavily detailed Hydraulic Pistons syncing everything
    const pistonSystem = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const piston = generateHydraulicPiston(80, 4);
        piston.position.set(Math.cos(angle) * 40, -40, Math.sin(angle) * 40);
        
        // Angle them outward
        piston.lookAt(Math.cos(angle) * 100, -40, Math.sin(angle) * 100);
        piston.rotateX(Math.PI / 4);
        
        pistonSystem.add(piston);
        meshesToAnimate.push({ type: 'piston', mesh: piston, index: i });
    }
    pistonSystem.name = "hydraulic_articulation_system";
    group.add(pistonSystem);

    // Add Operator Cabin at a safe distance
    const cabin = generateOperatorCabin();
    cabin.position.set(150, 0, 150);
    cabin.lookAt(0, 0, 0);
    cabin.name = "operator_control_cabin";
    group.add(cabin);

    // --- PARTS DEFINITIONS (Massive details) ---
    parts.push(
        {
            name: "neutronium_core_cylinder",
            description: "An infinitely dense (simulated) cylinder composed of hyper-compressed neutronium. Its immense mass and extreme angular velocity induce severe frame-dragging, twisting spacetime into closed timelike curves. The surface features quantum binding ripples.",
            material: "Neutronium (Custom Dense State)",
            function: "Primary mass and rotation source for spacetime distortion. Generates the Lense-Thirring effect required to tilt light cones into the past.",
            assemblyOrder: 1,
            connections: ["frame_dragging_induction_array", "ergosphere_containment_ring_alpha", "ergosphere_containment_ring_omega"],
            failureEffect: "Catastrophic singularity collapse; spontaneous generation of unshielded naked singularities.",
            cascadeFailures: ["hawking_radiation_deflector_shields", "cauchy_surface_disruptor_beam"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        },
        {
            name: "ergosphere_containment_ring_alpha",
            description: "Top temporal traction tire. Uses complex Torus geometries and thousands of aggressive off-road spacetime lugs to literally grip the fabric of spacetime, accelerating the cylinder's rotation to fractions of the speed of light.",
            material: "Rubberized Exotic Matter / Chrome",
            function: "Spacetime grip and angular momentum injection.",
            assemblyOrder: 2,
            connections: ["neutronium_core_cylinder", "exotic_matter_feedline_manifold"],
            failureEffect: "Loss of traction on the spacetime metric; cylinder spin decay, collapse of the ergosphere.",
            cascadeFailures: ["ctc_stabilizer_gyros"],
            originalPosition: topTire.position.clone(),
            explodedPosition: { x: 0, y: 300, z: 0 }
        },
        {
            name: "ergosphere_containment_ring_omega",
            description: "Bottom temporal traction tire. Counter-anchors the alpha ring, providing torsional stability across the z-axis of the Tipler cylinder. Heavily reinforced with steel and chrome spoke arrays.",
            material: "Rubberized Exotic Matter / Chrome",
            function: "Gyroscopic and torsional anchoring for the lower ergosphere.",
            assemblyOrder: 3,
            connections: ["neutronium_core_cylinder", "exotic_matter_feedline_manifold"],
            failureEffect: "Asymmetric frame dragging; the resulting gravitational shear would tear the machine (and the solar system) apart.",
            cascadeFailures: ["relativistic_mass_compensator_coils"],
            originalPosition: bottomTire.position.clone(),
            explodedPosition: { x: 0, y: -300, z: 0 }
        },
        {
            name: "frame_dragging_induction_array",
            description: "Massive copper helical coils wrapping the core. They induce a synthetic electromagnetic field that couples with the gravitoelectromagnetic field of the rotating neutronium.",
            material: "Superconducting Copper",
            function: "Amplifies the natural Lense-Thirring effect of the core, artificially extending the ergosphere boundaries.",
            assemblyOrder: 4,
            connections: ["neutronium_core_cylinder", "quantum_vacuum_energy_tap"],
            failureEffect: "Induction feedback loop causing a localized false-vacuum decay.",
            cascadeFailures: ["chronal_shift_matrix_core"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 0, z: 100 }
        },
        {
            name: "gravitational_wave_dampener_nodes",
            description: "Icosahedral nodes floating around the equator. Emitting precise anti-gravitational waves to destructively interfere with the immense gravitational radiation produced by the cylinder.",
            material: "Active Energy / Exotic Plasma",
            function: "Prevents the energy of rotation from bleeding off as gravitational waves (which would rapidly halt the machine).",
            assemblyOrder: 5,
            connections: ["singular_boundary_monitor_array"],
            failureEffect: "Emission of lethal gravitational waves that would shatter nearby planets.",
            cascadeFailures: ["observer_vessel_tiplers_dream"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -150, y: 0, z: -150 }
        },
        {
            name: "exotic_matter_feedline_manifold",
            description: "Intricate hydraulic/tubular network running alongside the machine. Pumps exotic matter (negative mass) into the ergosphere to stabilize the Cauchy horizon against blue-shift mass inflation.",
            material: "Reinforced Steel / Dark Steel",
            function: "Delivers negative energy density to violate the weak energy condition just enough to keep the CTCs navigable.",
            assemblyOrder: 6,
            connections: ["ergosphere_containment_ring_alpha", "ergosphere_containment_ring_omega"],
            failureEffect: "Mass inflation instability triggers; incoming light blue-shifts to infinite energy, vaporizing the machine and any travelers.",
            cascadeFailures: ["cauchy_horizon_projector_lenses"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 200, y: 0, z: 0 }
        },
        {
            name: "chronal_shift_matrix_core",
            description: "Central computational torus made of gold foil. Uses quantum entanglement across time to calculate safe trajectories through the infinitely looping spacetime curves.",
            material: "Gold Foil / Quantum Compute Matrix",
            function: "Trajectory calculation for the observer vessel to ensure it emerges in the correct past light cone without paradox collision.",
            assemblyOrder: 7,
            connections: ["ctc_stabilizer_gyros"],
            failureEffect: "Navigation error; vessel is crushed by tidal forces or emerges in a logically inconsistent timeline.",
            cascadeFailures: ["observer_vessel_tiplers_dream"],
            originalPosition: shiftMatrix.position.clone(),
            explodedPosition: { x: 0, y: 0, z: 200 }
        },
        {
            name: "ctc_stabilizer_gyros",
            description: "Four massive, multi-axis spinning gyroscopes. They maintain the structural integrity of the closed timelike curves, preventing them from unraveling back into normal linear time.",
            material: "Chrome, Copper, Steel, Active Energy",
            function: "Temporal stabilization and paradox buffering.",
            assemblyOrder: 8,
            connections: ["chronal_shift_matrix_core"],
            failureEffect: "CTCs collapse; time reverts to linear progression, violently ejecting anything currently inside the curve.",
            cascadeFailures: ["spacetime_metric_modulator_panels"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -200, y: 0, z: 0 }
        },
        {
            name: "spacetime_metric_modulator_panels",
            description: "Aluminum panels with glowing plasma lines. They act as 'rudders' for spacetime, subtly altering the local metric tensor to steer the orientation of the light cone tilt.",
            material: "Aluminum / Plasma",
            function: "Fine-tuning the degree of frame dragging.",
            assemblyOrder: 9,
            connections: ["lorentz_factor_amplifier_rings"],
            failureEffect: "Uncontrolled light cone tilting; time flows sideways or stops locally.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 200 }
        },
        {
            name: "hawking_radiation_deflector_shields",
            description: "Massive curved glass shields at the poles. Deflects the intense Hawking radiation emitted if microscopic black holes form in the turbulent spacetime near the cylinder ends.",
            material: "Tinted Glass / Deflector Field",
            function: "Radiation shielding for the external environment.",
            assemblyOrder: 10,
            connections: ["cauchy_horizon_projector_lenses"],
            failureEffect: "Lethal gamma-ray bursts sterilizing the local sector.",
            cascadeFailures: ["operator_control_cabin"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 350, z: 0 }
        },
        {
            name: "quantum_vacuum_energy_tap",
            description: "A dark steel base with an active energy cone extending upward. It extracts zero-point energy from the vacuum to power the immense rotation required.",
            material: "Dark Steel / Active Energy",
            function: "Infinite power supply for relativistic acceleration.",
            assemblyOrder: 11,
            connections: ["frame_dragging_induction_array"],
            failureEffect: "Power starvation; cylinder rapidly decelerates, erasing CTCs.",
            cascadeFailures: ["neutronium_core_cylinder"],
            originalPosition: energyTap.position.clone(),
            explodedPosition: { x: 0, y: 400, z: 0 }
        },
        {
            name: "relativistic_mass_compensator_coils",
            description: "Five massive copper rings enclosing the system. As the cylinder approaches light speed, its relativistic mass approaches infinity. These coils generate a counter-field to keep the mass finite and manageable.",
            material: "Copper",
            function: "Mitigates relativistic mass increase to prevent spontaneous gravitational collapse into a black hole.",
            assemblyOrder: 12,
            connections: ["ergosphere_containment_ring_omega"],
            failureEffect: "Cylinder mass becomes infinite, instantly forming a supermassive black hole.",
            cascadeFailures: ["neutronium_core_cylinder"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 300, y: 0, z: -300 }
        },
        {
            name: "cauchy_horizon_projector_lenses",
            description: "Glass spherical caps at the extreme ends. They project a boundary condition that separates the region with CTCs from the causal exterior universe.",
            material: "Glass",
            function: "Defines the boundary of the time machine's effective area.",
            assemblyOrder: 13,
            connections: ["hawking_radiation_deflector_shields"],
            failureEffect: "Causality leaks into the broader universe, potentially causing grandfather paradoxes on a cosmic scale.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -400, z: 0 }
        },
        {
            name: "singular_boundary_monitor_array",
            description: "16 rotating arms with sensor dishes. They constantly measure the Weyl tensor to detect the formation of unwanted naked singularities.",
            material: "Steel / Dark Steel",
            function: "Early warning system for spacetime tearing.",
            assemblyOrder: 14,
            connections: ["gravitational_wave_dampener_nodes"],
            failureEffect: "Blindness to singularity formation.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -250, y: -100, z: 250 }
        },
        {
            name: "lorentz_factor_amplifier_rings",
            description: "20 plasma rings stacked vertically. They sequentially pulse to multiply the Lorentz factor (gamma) locally, enhancing the time dilation effect.",
            material: "Plasma",
            function: "Increases the efficiency of time travel by steepening the time dilation gradient.",
            assemblyOrder: 15,
            connections: ["spacetime_metric_modulator_panels"],
            failureEffect: "Inefficient time travel; travelers age normally during transit.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 150, y: -150, z: -150 }
        },
        {
            name: "cauchy_surface_disruptor_beam",
            description: "A continuous plasma beam running directly through the central axis. It actively disrupts the formation of a global Cauchy surface, mathematically allowing CTCs to exist.",
            material: "Plasma",
            function: "Fulfills the topological requirement for a time machine by preventing the spacetime from being globally hyperbolic.",
            assemblyOrder: 16,
            connections: ["neutronium_core_cylinder"],
            failureEffect: "Spacetime becomes globally hyperbolic; time travel becomes strictly impossible by definition.",
            cascadeFailures: ["ctc_stabilizer_gyros"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -400 }
        },
        {
            name: "observer_vessel_tiplers_dream",
            description: "A highly shielded probe designed to orbit the cylinder against the direction of rotation, dropping below the static limit surface and entering a closed timelike curve to meet its past self.",
            material: "Steel / Copper / Active Energy",
            function: "Demonstrates the reality of CTCs.",
            assemblyOrder: 17,
            connections: ["chronal_shift_matrix_core"],
            failureEffect: "Vessel destroyed by tidal forces or infinite blue-shift.",
            cascadeFailures: [],
            originalPosition: { x: -60, y: 0, z: 0 },
            explodedPosition: { x: -300, y: 300, z: -300 }
        }
    );

    // --- PHD LEVEL QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of a finite Tipler cylinder, how does the absence of a cosmological constant affect the formation of closed timelike curves (CTCs) as derived from the weak energy condition?",
            options: [
                "A finite cylinder can generate CTCs locally without violating the weak energy condition, provided the rotation is fast enough.",
                "Hawking's chronology protection conjecture mathematically proves that a finite cylinder requires a negative cosmological constant to form CTCs.",
                "Hawking showed that without violating the weak energy condition (requiring exotic matter), a finite rotating cylinder cannot form CTCs, as no CTCs can be created in a finite region devoid of curvature singularities.",
                "The cosmological constant acts as a mass compensator, allowing finite cylinders to bypass the Lense-Thirring limits."
            ],
            correctAnswer: 2,
            explanation: "Stephen Hawking proved a theorem in 1992 (Chronology Protection Conjecture) showing that creating a time machine in a finite region of spacetime, without curvature singularities, strictly requires the violation of the weak energy condition (i.e., exotic matter with negative energy density). Thus, a 'realistic' finite Tipler cylinder cannot work with normal matter alone."
        },
        {
            question: "Analyze the frame-dragging (Lense-Thirring) angular velocity $\\omega$ outside an infinitely long, rotating, dense cylinder. If the cylinder radius is $R$ and its surface velocity is $v$, how does the metric tensor component $g_{t\\phi}$ scale with radial distance $r$ in the exterior vacuum spacetime?",
            options: [
                "It scales as $1/r^3$, similar to the Kerr metric for a spherical mass.",
                "It remains completely constant ($g_{t\\phi} \\propto r^0$) due to the infinite longitudinal extent of the cylinder, meaning frame-dragging does not fall off with distance.",
                "It scales as $\\ln(r)$, growing logarithmically and causing the spacetime to become asymptotically flat.",
                "It scales as $1/r$, representing a cylindrical decay rate."
            ],
            correctAnswer: 1,
            explanation: "For an infinitely long, rotating cylinder (the van Stockum dust or similar exact solutions), the exterior spacetime is not asymptotically flat. The 'drag' does not fall off with distance in the same way as a localized mass; in fact, the exact vacuum solution shows that the metric component responsible for frame dragging does not decay to zero, leading to CTCs at large radii."
        },
        {
            question: "Describe the transformation of light cones within the ergoregion of a rapidly rotating Tipler cylinder. How does the Killing vector field $\\partial_t$ behave as one crosses the static limit surface?",
            options: [
                "The Killing vector field $\\partial_t$ transitions from being timelike outside the static limit surface to being spacelike inside, meaning stationary observers cannot exist.",
                "The Killing vector field $\\partial_t$ becomes null, and all light cones point strictly radially inward toward the singularity.",
                "The light cones are narrowed to a single line, causing time to stop completely.",
                "The Killing vector field $\\partial_t$ remains timelike, but $\\partial_\\phi$ becomes timelike, allowing travel in angular dimensions."
            ],
            correctAnswer: 0,
            explanation: "The static limit surface is defined precisely as the boundary where the asymptotic time translation Killing vector field $\\partial_t$ becomes null and then spacelike inside the ergoregion. This means an observer must rotate with the cylinder just to remain causally future-directed; they cannot remain stationary relative to infinity."
        },
        {
            question: "In a spacetime containing a Tipler cylinder, what is the role of the Cauchy horizon, and how does the blue-shift instability (mass inflation) potentially destabilize the formation of CTCs before an observer can traverse them?",
            options: [
                "The Cauchy horizon guarantees safe passage. Blue-shift instability only affects outgoing radiation, cooling the machine.",
                "The Cauchy horizon is the boundary beyond which the future is no longer determined by initial conditions. Radiation entering this horizon from the outside universe is infinitely blue-shifted, creating a curtain of infinite energy that would destroy the time machine.",
                "The Cauchy horizon generates the CTCs by reflecting gravitational waves. Mass inflation prevents the cylinder from spinning too fast.",
                "The Cauchy horizon is a purely coordinate singularity that can be transformed away, and mass inflation is a quantum artifact."
            ],
            correctAnswer: 1,
            explanation: "The Cauchy horizon represents the boundary of predictability. In models like the inner horizon of a Kerr black hole (or similar regions in time machines), incoming radiation is compressed and blue-shifted to infinite energy as measured by an observer crossing the horizon. This 'mass inflation' instability is a major theoretical barrier to the survivability of any CTC."
        },
        {
            question: "Which singularity structure is fundamentally required for an ideal, infinitely long Tipler cylinder to permit CTCs without violating the weak energy condition?",
            options: [
                "A ring singularity.",
                "A naked line singularity along the axis of rotation.",
                "A localized point singularity at the origin.",
                "No singularity is required; infinite length is sufficient to satisfy the weak energy condition."
            ],
            correctAnswer: 1,
            explanation: "In van Stockum's and Tipler's exact solutions for infinitely long cylinders, to avoid exotic matter (violating WEC), the spacetime inherently contains a naked line singularity along the z-axis (or the density must be physically impossible). This singularity provides the extreme topological distortion required to tilt the light cones globally."
        }
    ];

    // --- EXTREME ANIMATION LOGIC ---
    let time = 0;
    let duplicateProbes = [];
    
    const animate = (delta, speed, partsToRender, isExploded) => {
        time += delta * speed * 2.0;
        
        // 1. Core Rotation (Rapid)
        const coreData = meshesToAnimate.find(m => m.type === 'core');
        if (coreData) {
            coreData.mesh.rotation.y += delta * speed * 10.0;
            // Simulate relativistic longitudinal flattening (Lorentz contraction)
            // As speed increases, length appears shorter to an outside observer
            const contraction = Math.max(0.2, 1.0 - (speed * 0.1));
            coreData.mesh.scale.y = contraction;
        }

        // 2. Temporal Traction Tires
        meshesToAnimate.filter(m => m.type === 'tire').forEach(tire => {
            // Tires spin violently to grip spacetime
            tire.mesh.rotation.z += delta * speed * 15.0 * tire.direction;
        });

        // 3. Induction Array Coils
        const induction = meshesToAnimate.find(m => m.type === 'induction_array');
        if (induction) {
            induction.mesh.rotation.y -= delta * speed * 5.0; // Counter-rotating
            // Pulse copper material
            induction.mesh.children.forEach(c => {
                c.material.emissiveIntensity = 1 + Math.sin(time * 10) * 0.5;
            });
        }

        // 4. Dampener Nodes
        meshesToAnimate.filter(m => m.type === 'dampener_node').forEach(node => {
            const offset = node.index * 0.5;
            node.mesh.position.y = Math.sin(time * 5 + offset) * 15;
            // Color shift from blue to red (Doppler shift simulation)
            const hue = (Math.sin(time * 2 + offset) + 1) / 2;
            node.mesh.material.color.setHSL(hue * 0.8, 1, 0.5);
            node.mesh.material.emissive.setHSL(hue * 0.8, 1, 0.5);
        });

        // 5. Shift Matrix
        const shift = meshesToAnimate.find(m => m.type === 'shift_matrix');
        if (shift) {
            shift.mesh.rotation.z += delta * speed * 2.0;
            shift.mesh.scale.set(1 + Math.sin(time*3)*0.05, 1 + Math.sin(time*3)*0.05, 1 + Math.sin(time*3)*0.05);
        }

        // 6. CTC Stabilizer Gyros (Multi-axis rotation)
        meshesToAnimate.filter(m => m.type === 'gyro').forEach(gyro => {
            gyro.rings[0].rotation.x += delta * speed * 3;
            gyro.rings[1].rotation.y += delta * speed * 4;
            gyro.rings[2].rotation.z += delta * speed * 5;
            gyro.mesh.position.y = Math.cos(time * 2 + gyro.index) * 20;
        });

        // 7. Modulator Panel Glows
        meshesToAnimate.filter(m => m.type === 'panel_glow').forEach(glow => {
            glow.mesh.material.opacity = 0.5 + Math.sin(time * 15 + glow.index) * 0.5;
        });

        // 8. Shields (Slow counter rotation)
        const shield = meshesToAnimate.find(m => m.type === 'shield');
        if (shield) {
            shield.mesh.rotation.y += delta * speed * 0.5;
        }

        // 9. Energy Tap Pulse
        const tap = meshesToAnimate.find(m => m.type === 'energy_tap');
        if (tap) {
            tap.mesh.scale.y = 1 + Math.sin(time * 20) * 0.3;
            tap.mesh.material.emissiveIntensity = 2 + Math.sin(time * 20) * 2;
        }

        // 10. Monitor Arms
        meshesToAnimate.filter(m => m.type === 'monitor_arm').forEach(arm => {
            arm.mesh.rotation.x = Math.sin(time + arm.index) * 0.2;
        });

        // 11. Lorentz Rings (Sequential pulsing wave)
        meshesToAnimate.filter(m => m.type === 'lorentz_ring').forEach(ring => {
            const wave = Math.sin(time * 5 + ring.index * 0.5);
            ring.mesh.scale.set(1 + wave * 0.1, 1 + wave * 0.1, 1 + wave * 0.1);
            ring.mesh.material.emissiveIntensity = 2 + wave * 3;
            // Slight vertical compression
            ring.mesh.position.y = ring.baseY + wave * 2;
        });

        // 12. Disruptor Beam
        const beam = meshesToAnimate.find(m => m.type === 'disruptor_beam');
        if (beam) {
            beam.mesh.scale.x = 1 + Math.random() * 0.5;
            beam.mesh.scale.z = 1 + Math.random() * 0.5;
            beam.mesh.material.opacity = 0.6 + Math.random() * 0.4;
        }

        // 13. Spacetime Grid Frame Dragging Effect
        meshesToAnimate.filter(m => m.type === 'spacetime_helix').forEach(helixData => {
            const positions = helixData.mesh.geometry.attributes.position.array;
            for (let i = 0; i <= helixData.segments; i++) {
                const idx = i * 3;
                const t = i / helixData.segments;
                const y = (t - 0.5) * helixData.height;
                // Complex frame dragging equation: rotation speed impacts twist factor
                const dynamicTwist = helixData.baseTwistFactor * y * (0.5 + speed * 0.2) + time * 5.0 * helixData.baseTwistFactor;
                
                const r = helixData.radius;
                // Add a breathing effect to the grid based on time
                const breath = 1.0 + Math.sin(time * 2 + y * 0.05) * 0.05;
                
                positions[idx] = Math.cos(dynamicTwist) * (r * breath);
                positions[idx + 2] = Math.sin(dynamicTwist) * (r * breath);
            }
            helixData.mesh.geometry.attributes.position.needsUpdate = true;
            // Shift color based on twist intensity
            const intensity = Math.abs(Math.sin(time * 2 + helixData.radius * 0.1));
            helixData.mesh.material.color.setHSL(0.5 + intensity * 0.2, 1, 0.5 + intensity * 0.3);
        });

        // 14. Hydraulic Pistons Sync
        meshesToAnimate.filter(m => m.type === 'piston').forEach(pData => {
            const casing = pData.mesh.userData.casing;
            const rod = pData.mesh.userData.rod;
            const baseLen = pData.mesh.userData.baseLength;
            
            // Calculate a complex rhythmic pumping action synced with rotation
            const pump = Math.sin(time * 8 + pData.index * Math.PI / 4); // values between -1 and 1
            
            // Adjust rod position inside the casing
            // Base rod position is length * 0.7, travel distance is roughly length * 0.2
            rod.position.y = (baseLen * 0.7) + (pump * baseLen * 0.15);
            
            // Vibrate the casing slightly under extreme pressure
            casing.rotation.z = (Math.random() - 0.5) * 0.02 * speed;
        });

        // 15. The Probe and CTC (Closed Timelike Curve) Duplication Logic
        const probeData = meshesToAnimate.find(m => m.type === 'probe');
        if (probeData && !isExploded) {
            const probe = probeData.mesh;
            
            // Probe orbits the cylinder, spiraling downwards and accelerating
            const orbitRadius = 60 - Math.sin(time * 0.5) * 20; // Dips into the ergosphere
            const orbitSpeed = time * 2.0; // Moving against rotation
            const yPos = Math.sin(time * 0.3) * 100;
            
            probe.position.set(
                Math.cos(orbitSpeed) * orbitRadius,
                yPos,
                Math.sin(orbitSpeed) * orbitRadius
            );
            
            // Orient probe along its path
            probe.lookAt(
                Math.cos(orbitSpeed + 0.1) * orbitRadius,
                yPos + Math.cos(time * 0.3) * 5,
                Math.sin(orbitSpeed + 0.1) * orbitRadius
            );

            // Engine glow pulsing
            probe.children[2].scale.setScalar(1 + Math.random() * 0.5);

            // CTC EFFECT: When probe dips deep into the ergoregion (radius < 45), 
            // it travels back in time, meaning we should see duplicates of it 
            // flying in formation (its past/future selves).
            if (orbitRadius < 45) {
                if (duplicateProbes.length === 0) {
                    // Spawn past/future selves
                    for (let i = 1; i <= 3; i++) {
                        const clone = probe.clone();
                        group.add(clone);
                        duplicateProbes.push({ mesh: clone, timeOffset: i * 0.5 });
                    }
                }
                
                // Animate clones
                duplicateProbes.forEach((dup, index) => {
                    const tOffset = time - dup.timeOffset;
                    const oRad = 60 - Math.sin(tOffset * 0.5) * 20;
                    const oSpd = tOffset * 2.0;
                    const oY = Math.sin(tOffset * 0.3) * 100;
                    
                    dup.mesh.position.set(
                        Math.cos(oSpd) * oRad,
                        oY,
                        Math.sin(oSpd) * oRad
                    );
                    
                    dup.mesh.lookAt(
                        Math.cos(oSpd + 0.1) * oRad,
                        oY + Math.cos(tOffset * 0.3) * 5,
                        Math.sin(oSpd + 0.1) * oRad
                    );
                    
                    // Clones are ghostly
                    dup.mesh.children.forEach(c => {
                        if (c.material) {
                            // Clone material to make it transparent
                            if (!c.userData.originalMat) {
                                c.userData.originalMat = c.material;
                                c.material = c.material.clone();
                                c.material.transparent = true;
                                c.material.opacity = 0.4;
                            }
                        }
                    });
                });
            } else {
                // Remove clones when out of the CTC zone
                if (duplicateProbes.length > 0) {
                    duplicateProbes.forEach(dup => {
                        group.remove(dup.mesh);
                    });
                    duplicateProbes = [];
                }
            }
        } else if (isExploded && duplicateProbes.length > 0) {
            duplicateProbes.forEach(dup => {
                group.remove(dup.mesh);
            });
            duplicateProbes = [];
        }
    };

    return {
        group,
        parts,
        description: "The Tipler Cylinder Time Machine (God Tier). An infinitely dense, rapidly rotating cylinder designed to drag spacetime into closed timelike curves, allowing macroscopic time travel. It features hyper-complex geometry, relativistic compensators, and temporal traction tires.",
        quizQuestions,
        animate
    };
}
