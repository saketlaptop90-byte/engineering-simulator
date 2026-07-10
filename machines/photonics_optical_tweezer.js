import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const laserBeamMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const intenseLaserMat = new THREE.MeshStandardMaterial({
        color: 0xaaffaa,
        emissive: 0x00ff00,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x44aaff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.9
    });

    const tableMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.3
    });

    const brass = new THREE.MeshStandardMaterial({
        color: 0xb5a642,
        roughness: 0.3,
        metalness: 0.8
    });

    const wireMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        roughness: 0.5,
        metalness: 0.1
    });
    
    const ledMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    // We will store meshes that need animation in an array
    const animatedObjects = {
        laserBeams: [],
        particle: null,
        floatingParticles: [],
        leadScrewsX: [],
        leadScrewsY: [],
        leadScrewsZ: [],
        stageX: null,
        stageY: null,
        stageZ: null,
        indicators: []
    };

    // 1. Optical Table Base
    function createOpticalTable() {
        const tableGroup = new THREE.Group();
        
        // Main Breadboard
        const boardGeo = new THREE.BoxGeometry(40, 2, 30);
        const board = new THREE.Mesh(boardGeo, tableMat);
        board.position.y = 1;
        board.castShadow = true;
        board.receiveShadow = true;
        tableGroup.add(board);

        // Grid of tapped holes (simulated with small dark cylinders)
        const holeGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.01, 8);
        const holeMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
        
        // Instantiate matrix for holes to save performance while maintaining complexity
        const gridX = 38;
        const gridZ = 28;
        const instancedHoles = new THREE.InstancedMesh(holeGeo, holeMat, gridX * gridZ);
        let idx = 0;
        const matrix = new THREE.Matrix4();
        for(let i = 0; i < gridX; i++) {
            for(let j = 0; j < gridZ; j++) {
                matrix.setPosition(i - gridX/2 + 0.5, 1, j - gridZ/2 + 0.5);
                instancedHoles.setMatrixAt(idx++, matrix);
            }
        }
        tableGroup.add(instancedHoles);

        // Pneumatic Legs
        const legPositions = [
            [-18, -10, -13], [18, -10, -13],
            [-18, -10, 13], [18, -10, 13]
        ];
        
        legPositions.forEach(pos => {
            const legGroup = new THREE.Group();
            
            // Outer cylinder
            const outerGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
            const outer = new THREE.Mesh(outerGeo, steel);
            outer.position.y = 0;
            legGroup.add(outer);
            
            // Rubber bellow (using Torus array)
            for(let k = 0; k < 6; k++) {
                const bellowGeo = new THREE.TorusGeometry(1.6, 0.3, 16, 32);
                const bellow = new THREE.Mesh(bellowGeo, rubber);
                bellow.position.y = 5 + k * 0.8;
                bellow.rotation.x = Math.PI / 2;
                legGroup.add(bellow);
            }
            
            legGroup.position.set(...pos);
            tableGroup.add(legGroup);
        });

        group.add(tableGroup);

        parts.push({
            name: "Vibration Isolation Table",
            description: "A pneumatic isolation optical breadboard that dampens environmental vibrations, ensuring nanometer-scale precision for optical trapping.",
            material: "Steel, Rubber, Aluminum",
            function: "Provides a stable platform for all optical and mechanical components.",
            assemblyOrder: 1,
            connections: ["Laboratory Floor", "Optical Mounts"],
            failureEffect: "External vibrations would couple into the system, causing the trapped particle to oscillate wildly and escape the optical trap.",
            cascadeFailures: ["Loss of particle", "Measurement noise", "Laser misalignment"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -20, z: 0 }
        });
    }

    // 2. High-Power Laser Source
    function createLaserSource() {
        const laserGroup = new THREE.Group();
        laserGroup.position.set(-15, 2, 0);

        // Laser Housing
        const bodyGeo = new THREE.BoxGeometry(8, 4, 6);
        const body = new THREE.Mesh(bodyGeo, darkSteel);
        body.position.y = 2;
        laserGroup.add(body);

        // Cooling Fins
        for(let i = 0; i < 15; i++) {
            const finGeo = new THREE.BoxGeometry(0.1, 4.2, 5.8);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(-3.5 + (i * 0.5), 2.1, 0);
            laserGroup.add(fin);
        }

        // Warning Label & Indicators
        const labelGeo = new THREE.PlaneGeometry(2, 1.5);
        const labelMat = new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(4.01, 2.5, 0);
        label.rotation.y = Math.PI / 2;
        laserGroup.add(label);

        const ledGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(4.01, 1.5, 2);
        led.rotation.z = Math.PI / 2;
        laserGroup.add(led);
        animatedObjects.indicators.push(led);

        // Output Aperture
        const apertureGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const aperture = new THREE.Mesh(apertureGeo, brass);
        aperture.position.set(4.2, 2, 0);
        aperture.rotation.z = Math.PI / 2;
        laserGroup.add(aperture);

        // Fiber Coupler
        const couplerGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 32);
        const coupler = new THREE.Mesh(couplerGeo, steel);
        coupler.position.set(5.2, 2, 0);
        coupler.rotation.z = Math.PI / 2;
        laserGroup.add(coupler);

        group.add(laserGroup);

        parts.push({
            name: "Nd:YAG Continuous Wave Laser",
            description: "A 1064 nm infrared laser source providing 5 Watts of continuous power. Operates in the near-infrared to minimize photodamage (opticution) to biological samples.",
            material: "Aluminum, Electronics, YAG Crystal",
            function: "Generates the high-intensity, coherent photon stream required to create the gradient force trap.",
            assemblyOrder: 2,
            connections: ["Optical Fiber", "Power Supply", "Table"],
            failureEffect: "No photons, no trap. The dielectric particle will immediately diffuse away due to Brownian motion.",
            cascadeFailures: ["Complete system failure", "Loss of experimental sample"],
            originalPosition: { x: -15, y: 2, z: 0 },
            explodedPosition: { x: -30, y: 10, z: 0 }
        });
    }

    // Kinematic Mirror Mount Factory
    function createMirrorMount(x, y, z, rotY, name) {
        const mountGroup = new THREE.Group();
        mountGroup.position.set(x, y, z);
        mountGroup.rotation.y = rotY;

        // Base post
        const postGeo = new THREE.CylinderGeometry(0.4, 0.4, y - 2, 32);
        const post = new THREE.Mesh(postGeo, steel);
        post.position.y = -(y - 2)/2;
        mountGroup.add(post);

        // Base holder
        const holderGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
        const holder = new THREE.Mesh(holderGeo, darkSteel);
        holder.position.y = 0;
        mountGroup.add(holder);

        // Kinematic Plate
        const plateGeo = new THREE.BoxGeometry(0.3, 2, 2);
        const plate = new THREE.Mesh(plateGeo, aluminum);
        plate.position.set(0.9, 0, 0);
        mountGroup.add(plate);

        // Actuator Screws (3x)
        const screwGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
        const screwPositions = [
            [0.6, 0.7, 0.7],
            [0.6, 0.7, -0.7],
            [0.6, -0.7, 0]
        ];
        
        screwPositions.forEach(sp => {
            const screw = new THREE.Mesh(screwGeo, brass);
            screw.position.set(...sp);
            screw.rotation.z = Math.PI / 2;
            mountGroup.add(screw);
        });

        // Mirror
        const mirrorGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const mirror = new THREE.Mesh(mirrorGeo, chrome);
        mirror.position.set(1.1, 0, 0);
        mirror.rotation.z = Math.PI / 2;
        mountGroup.add(mirror);

        group.add(mountGroup);

        parts.push({
            name: name,
            description: "High-precision kinematic mirror mount with dielectric-coated broadband mirrors. Uses 100 TPI (threads per inch) adjustment screws for sub-milliradian pointing accuracy.",
            material: "Aluminum, Stainless Steel, Dielectric Glass",
            function: "Steers the laser beam precisely into the objective lens back aperture.",
            assemblyOrder: 3,
            connections: ["Optical Table", "Laser Beam Path"],
            failureEffect: "Beam misalignment. The laser will not fill the objective lens back aperture symmetrically, severely degrading trap stiffness or destroying the trap entirely.",
            cascadeFailures: ["Beam clipping", "Loss of particle trapping"],
            originalPosition: { x: x, y: y, z: z },
            explodedPosition: { x: x + 10, y: y + 5, z: z - 10 }
        });
    }

    // 3. Beam Expanders and Optics
    function createOpticsPath() {
        // Mirror 1 (Turns beam 90 degrees)
        createMirrorMount(-5, 4, 0, Math.PI / 4, "Beam Steering Mirror 1");
        
        // Mirror 2 (Turns beam to objective)
        createMirrorMount(-5, 4, 10, -Math.PI / 4, "Beam Steering Mirror 2");

        // Beam Expander (Telescope)
        const telescopeGroup = new THREE.Group();
        telescopeGroup.position.set(-5, 4, 5);
        telescopeGroup.rotation.x = Math.PI / 2; // Aligned with Z axis

        const lensTubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
        const lensTube = new THREE.Mesh(lensTubeGeo, darkSteel);
        telescopeGroup.add(lensTube);

        // Internal lenses (visualized slightly sticking out)
        const lensGeo1 = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
        const lens1 = new THREE.Mesh(lensGeo1, glass);
        lens1.position.y = -2;
        telescopeGroup.add(lens1);

        const lensGeo2 = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
        const lens2 = new THREE.Mesh(lensGeo2, glass);
        lens2.position.y = 2;
        
        // Expanding part of tube
        const expanderTubeGeo = new THREE.CylinderGeometry(1.4, 0.8, 1.5, 32);
        const expanderTube = new THREE.Mesh(expanderTubeGeo, darkSteel);
        expanderTube.position.y = 2.75;
        telescopeGroup.add(expanderTube);
        telescopeGroup.add(lens2);

        // Mount for telescope
        const teleMountGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
        const teleMount = new THREE.Mesh(teleMountGeo, steel);
        teleMount.rotation.x = -Math.PI/2;
        teleMount.position.set(0, 0, -2);
        telescopeGroup.add(teleMount);

        group.add(telescopeGroup);

        parts.push({
            name: "Keplerian Beam Expander",
            description: "A combination of plano-concave and plano-convex lenses. Expands the 1mm laser beam to 5mm to perfectly overfill the objective's back aperture.",
            material: "Anodized Aluminum, BK7 Glass",
            function: "Increases beam diameter. Overfilling the objective is strictly required to achieve the high numerical aperture (NA) needed for a stable 3D optical trap.",
            assemblyOrder: 4,
            connections: ["Optical Table", "Laser Path"],
            failureEffect: "Underfilling the objective lens reduces the effective NA. The axial scattering force will overpower the gradient force, blowing the particle away rather than trapping it.",
            cascadeFailures: ["Inability to trap in 3D"],
            originalPosition: { x: -5, y: 4, z: 5 },
            explodedPosition: { x: -5, y: 15, z: 5 }
        });
        
        // Dichroic Mirror (Directs laser up into objective, lets light pass down to camera)
        const dichroicGroup = new THREE.Group();
        dichroicGroup.position.set(5, 4, 10);
        
        const dmBaseGeo = new THREE.BoxGeometry(2, 2, 2);
        const dmBase = new THREE.Mesh(dmBaseGeo, darkSteel);
        dichroicGroup.add(dmBase);
        
        const dmGlassGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
        const dmGlass = new THREE.Mesh(dmGlassGeo, tinted);
        dmGlass.rotation.x = Math.PI / 4;
        dmGlass.rotation.z = Math.PI / 2;
        dichroicGroup.add(dmGlass);
        
        const dmMountGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
        const dmMount = new THREE.Mesh(dmMountGeo, steel);
        dmMount.position.y = -2;
        dichroicGroup.add(dmMount);

        group.add(dichroicGroup);
        
        parts.push({
            name: "Dichroic Beam Splitter",
            description: "A specialized interference filter that highly reflects 1064nm IR laser light but transmits visible light.",
            material: "Dielectric Coated Fused Silica",
            function: "Couples the trapping laser into the optical axis of the microscope while allowing visible imaging light to pass through to the camera.",
            assemblyOrder: 5,
            connections: ["Optical Path", "Microscope Axis"],
            failureEffect: "Laser light would reach the camera, completely saturating and destroying the CCD sensor. Visible light wouldn't reach the camera, making observation impossible.",
            cascadeFailures: ["Camera destruction", "Loss of visualization"],
            originalPosition: { x: 5, y: 4, z: 10 },
            explodedPosition: { x: 5, y: -5, z: 20 }
        });
    }

    // 4. Objective Lens Assembly
    function createObjectiveLens() {
        const objGroup = new THREE.Group();
        objGroup.position.set(5, 7, 10);

        // Complex Lathe Geometry for Objective
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(1.5, 0));
        points.push(new THREE.Vector2(1.5, 0.5));
        points.push(new THREE.Vector2(1.8, 0.6));
        points.push(new THREE.Vector2(1.8, 2.0));
        points.push(new THREE.Vector2(1.2, 2.5));
        points.push(new THREE.Vector2(1.2, 3.0));
        points.push(new THREE.Vector2(0.8, 3.5));
        points.push(new THREE.Vector2(0.8, 4.0));
        points.push(new THREE.Vector2(0.2, 4.5)); // Tip
        points.push(new THREE.Vector2(0, 4.5));
        
        const objGeo = new THREE.LatheGeometry(points, 64);
        const objective = new THREE.Mesh(objGeo, chrome);
        
        // Color bands (indicating magnification / immersion type)
        const bandGeo = new THREE.TorusGeometry(1.22, 0.05, 16, 64);
        const band1 = new THREE.Mesh(bandGeo, new THREE.MeshStandardMaterial({ color: 0x000000 }));
        band1.position.y = 2.6;
        band1.rotation.x = Math.PI / 2;
        objGroup.add(band1);

        const band2Geo = new THREE.TorusGeometry(0.82, 0.05, 16, 64);
        const band2 = new THREE.Mesh(band2Geo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        band2.position.y = 3.6;
        band2.rotation.x = Math.PI / 2;
        objGroup.add(band2);
        
        objGroup.add(objective);

        // Mounting Turret
        const turretGeo = new THREE.CylinderGeometry(3, 3, 1, 64);
        const turret = new THREE.Mesh(turretGeo, darkSteel);
        turret.position.y = -0.5;
        objGroup.add(turret);
        
        // Pillar supporting turret
        const pillarGeo = new THREE.BoxGeometry(2, 6, 2);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel);
        pillar.position.set(-2, -3, 0);
        objGroup.add(pillar);

        group.add(objGroup);

        parts.push({
            name: "100x Oil Immersion Objective Lens (NA 1.49)",
            description: "An ultra-high numerical aperture infinity-corrected objective lens. Contains over 15 highly engineered optical elements. Requires index-matching immersion oil between the lens and sample.",
            material: "Brass, Chrome, Fluorite, Fused Silica",
            function: "Focuses the trapping laser to a diffraction-limited spot (waist < 1 um), creating the immense photon momentum gradient required to physically trap particles. Also collects visible imaging light.",
            assemblyOrder: 6,
            connections: ["Dichroic Mirror", "Sample Stage"],
            failureEffect: "Without a high NA lens, the laser focus is too broad. The gradient force (pulling particles to the center) becomes weaker than the scattering force (pushing particles away). Trapping fails.",
            cascadeFailures: ["Complete functional failure"],
            originalPosition: { x: 5, y: 7, z: 10 },
            explodedPosition: { x: 5, y: 25, z: 10 }
        });
    }

    // 5. 3D Nanopositioning Stage
    function createTranslationStage() {
        const stageGroup = new THREE.Group();
        stageGroup.position.set(5, 10.5, 10); // Placed just above objective

        // Base Plate (X-axis mount)
        const baseGeo = new THREE.BoxGeometry(10, 0.5, 10);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        stageGroup.add(base);

        // X-Axis Stage
        const xStageGroup = new THREE.Group();
        const xPlateGeo = new THREE.BoxGeometry(8, 0.5, 8);
        const xPlate = new THREE.Mesh(xPlateGeo, aluminum);
        xPlate.position.y = 0.8;
        xStageGroup.add(xPlate);
        
        // Linear rails X
        const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
        const railX1 = new THREE.Mesh(railGeo, chrome);
        railX1.rotation.z = Math.PI / 2;
        railX1.position.set(0, 0.4, -3);
        const railX2 = railX1.clone();
        railX2.position.set(0, 0.4, 3);
        stageGroup.add(railX1);
        stageGroup.add(railX2);

        // Lead Screw X
        const leadScrewGeo = new THREE.CylinderGeometry(0.15, 0.15, 9, 32);
        const leadScrewX = new THREE.Mesh(leadScrewGeo, brass);
        leadScrewX.rotation.z = Math.PI / 2;
        leadScrewX.position.set(0, 0.4, 0);
        stageGroup.add(leadScrewX);
        animatedObjects.leadScrewsX.push(leadScrewX);

        // Y-Axis Stage
        const yStageGroup = new THREE.Group();
        const yPlateGeo = new THREE.BoxGeometry(6, 0.5, 6);
        const yPlate = new THREE.Mesh(yPlateGeo, darkSteel);
        yPlate.position.y = 1.6;
        yStageGroup.add(yPlate);
        
        // Linear rails Y
        const railY1 = new THREE.Mesh(railGeo, chrome);
        railY1.rotation.x = Math.PI / 2;
        railY1.scale.y = 0.8;
        railY1.position.set(-2, 1.2, 0);
        const railY2 = railY1.clone();
        railY2.position.set(2, 1.2, 0);
        xStageGroup.add(railY1);
        xStageGroup.add(railY2);

        // Lead Screw Y
        const leadScrewY = new THREE.Mesh(leadScrewGeo, brass);
        leadScrewY.rotation.x = Math.PI / 2;
        leadScrewY.scale.y = 0.7;
        leadScrewY.position.set(0, 1.2, 0);
        xStageGroup.add(leadScrewY);
        animatedObjects.leadScrewsY.push(leadScrewY);

        // Z-Axis Stage & Sample Holder
        const zStageGroup = new THREE.Group();
        const zPillarGeo = new THREE.BoxGeometry(2, 4, 2);
        const zPillar = new THREE.Mesh(zPillarGeo, darkSteel);
        zPillar.position.set(-4, 3.5, 0);
        yStageGroup.add(zPillar);

        const zPlateGeo = new THREE.BoxGeometry(4, 0.5, 4);
        const zPlate = new THREE.Mesh(zPlateGeo, aluminum);
        zPlate.position.set(-1, 3.5, 0);
        zStageGroup.add(zPlate);
        
        // Sample Chamber (Glass slide with coverslip)
        const slideGeo = new THREE.BoxGeometry(3, 0.1, 1.5);
        const slide = new THREE.Mesh(slideGeo, glass);
        slide.position.set(1.5, 0.3, 0);
        zStageGroup.add(slide);

        const fluidGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
        const fluid = new THREE.Mesh(fluidGeo, tinted);
        fluid.position.set(1.5, 0.38, 0);
        zStageGroup.add(fluid);

        const coverslipGeo = new THREE.BoxGeometry(1, 0.02, 1);
        const coverslip = new THREE.Mesh(coverslipGeo, glass);
        coverslip.position.set(1.5, 0.42, 0);
        zStageGroup.add(coverslip);

        // Piezo Actuators/Motors
        const motorGeo = new THREE.BoxGeometry(2, 2, 2);
        const motorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        
        const motorX = new THREE.Mesh(motorGeo, motorMat);
        motorX.position.set(6, 0.4, 0);
        stageGroup.add(motorX);

        const motorY = new THREE.Mesh(motorGeo, motorMat);
        motorY.position.set(0, 1.2, -5);
        xStageGroup.add(motorY);

        const motorZ = new THREE.Mesh(motorGeo, motorMat);
        motorZ.position.set(-4, 6.5, 0);
        yStageGroup.add(motorZ);

        yStageGroup.add(zStageGroup);
        xStageGroup.add(yStageGroup);
        stageGroup.add(xStageGroup);

        // Store stages for animation
        animatedObjects.stageX = xStageGroup;
        animatedObjects.stageY = yStageGroup;
        animatedObjects.stageZ = zStageGroup;

        // Base mounting pillars down to table
        const mountPillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
        const m1 = new THREE.Mesh(mountPillarGeo, steel);
        m1.position.set(-4, -4, -4);
        const m2 = m1.clone();
        m2.position.set(-4, -4, 4);
        const m3 = m1.clone();
        m3.position.set(4, -4, -4);
        const m4 = m1.clone();
        m4.position.set(4, -4, 4);
        stageGroup.add(m1, m2, m3, m4);

        group.add(stageGroup);

        parts.push({
            name: "3-Axis Piezoelectric Nanopositioning Stage",
            description: "Closed-loop piezoelectric translation stage providing sub-nanometer resolution in X, Y, and Z axes. Includes capacitive sensors for active feedback.",
            material: "Titanium, Aluminum, Piezoelectric Ceramics",
            function: "Moves the sample chamber with exquisite precision around the stationary optical trap, allowing manipulation of trapped objects relative to the surrounding environment.",
            assemblyOrder: 7,
            connections: ["Optical Table", "Sample Chamber", "Motor Controllers"],
            failureEffect: "Loss of positional feedback loop causes stage drift. The trapped particle crashes into the coverslip or escapes the field of view.",
            cascadeFailures: ["Sample destruction", "Objective lens damage if crashed into slide"],
            originalPosition: { x: 5, y: 10.5, z: 10 },
            explodedPosition: { x: 15, y: 30, z: 10 }
        });
        
        parts.push({
            name: "Sample Chamber (Fluidic Cell)",
            description: "A standard borosilicate glass microscope slide with a thin (No. 1.5, 0.17mm) coverslip containing an aqueous buffer and suspended dielectric beads.",
            material: "Borosilicate Glass, Aqueous Buffer",
            function: "Houses the biological or synthetic sample. Provides the exact optical thickness required by the objective lens to prevent spherical aberration.",
            assemblyOrder: 8,
            connections: ["Nanopositioning Stage"],
            failureEffect: "Using the wrong coverslip thickness induces spherical aberration, distorting the laser focus and drastically reducing trapping forces.",
            cascadeFailures: ["Trap instability", "Fluid leakage"],
            originalPosition: { x: 5, y: 14.5, z: 10 }, // Relative world pos approx
            explodedPosition: { x: 5, y: 35, z: 10 }
        });
    }

    // 6. Camera and Detection System
    function createCameraSystem() {
        const camGroup = new THREE.Group();
        camGroup.position.set(5, -2, 10); // Below the dichroic

        const tubeGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
        const tube = new THREE.Mesh(tubeGeo, darkSteel);
        tube.position.y = 2;
        camGroup.add(tube);
        
        const camBodyGeo = new THREE.BoxGeometry(3, 3, 3);
        const camBody = new THREE.Mesh(camBodyGeo, aluminum);
        camBody.position.y = -0.5;
        camGroup.add(camBody);

        // Heat sink on camera
        for(let i=0; i<10; i++) {
            const finGeo = new THREE.BoxGeometry(3, 0.1, 3);
            const fin = new THREE.Mesh(finGeo, darkSteel);
            fin.position.y = -2.2 - (i * 0.2);
            camGroup.add(fin);
        }

        // Condenser Lens (above the stage for illumination)
        const condenserGroup = new THREE.Group();
        condenserGroup.position.set(5, 18, 10);
        
        const condTubeGeo = new THREE.CylinderGeometry(1.5, 0.8, 4, 32);
        const condTube = new THREE.Mesh(condTubeGeo, darkSteel);
        condenserGroup.add(condTube);
        
        const condLensGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32);
        const condLens = new THREE.Mesh(condLensGeo, glass);
        condLens.position.y = -2;
        condenserGroup.add(condLens);
        
        // LED Illuminator
        const illBoxGeo = new THREE.BoxGeometry(2, 2, 2);
        const illBox = new THREE.Mesh(illBoxGeo, aluminum);
        illBox.position.y = 3;
        condenserGroup.add(illBox);

        const lightGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        const lightMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2});
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.y = 2;
        condenserGroup.add(light);
        animatedObjects.indicators.push(light);
        
        // Mount condenser to table
        const cPillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 20, 32);
        const cPillar = new THREE.Mesh(cPillarGeo, steel);
        cPillar.position.set(-2, -8, 0);
        condenserGroup.add(cPillar);

        group.add(camGroup);
        group.add(condenserGroup);

        parts.push({
            name: "sCMOS High-Speed Camera",
            description: "Scientific CMOS camera capable of 10,000 frames per second at region-of-interest. Thermoelectrically cooled to -30°C.",
            material: "Aluminum, Silicon Sensor",
            function: "Records the Brownian motion of the trapped particle with microsecond resolution to calibrate trap stiffness and calculate applied forces via fluctuation dissipation theorem.",
            assemblyOrder: 9,
            connections: ["Optical Path", "Data Acquisition PC"],
            failureEffect: "Inability to track particle position. The system functions as a trap but cannot be used as an optical force sensor.",
            cascadeFailures: ["Loss of force spectroscopy data"],
            originalPosition: { x: 5, y: -2, z: 10 },
            explodedPosition: { x: 5, y: -15, z: 10 }
        });
        
        parts.push({
            name: "Köhler Illumination Condenser",
            description: "High-power white LED source with an iris diaphragm and condenser lens.",
            material: "Aluminum, Glass Optics, LED",
            function: "Provides uniform, high-contrast brightfield or DIC illumination of the sample, essential for visualizing microscopic dielectric particles in the fluid chamber.",
            assemblyOrder: 10,
            connections: ["Optical Table", "Power Supply"],
            failureEffect: "Without illumination, the camera cannot see the sample, making it impossible to manually align the trap over a target particle.",
            cascadeFailures: ["Blind operation"],
            originalPosition: { x: 5, y: 18, z: 10 },
            explodedPosition: { x: 5, y: 25, z: -5 }
        });
    }

    // 7. Electronic Controller Box & Cables
    function createElectronics() {
        const boxGroup = new THREE.Group();
        boxGroup.position.set(15, 6, -10);

        const boxGeo = new THREE.BoxGeometry(10, 8, 8);
        const box = new THREE.Mesh(boxGeo, darkSteel);
        boxGroup.add(box);

        const panelGeo = new THREE.PlaneGeometry(9, 7);
        const panel = new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({color: 0x222222, side: THREE.DoubleSide}));
        panel.position.set(0, 0, 4.01);
        boxGroup.add(panel);

        // Dials and Screens
        const screenGeo = new THREE.PlaneGeometry(6, 3);
        const screenMat = new THREE.MeshStandardMaterial({color: 0x004400, emissive: 0x00ff00, emissiveIntensity: 0.5});
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 1.5, 4.02);
        boxGroup.add(screen);

        for(let i=0; i<4; i++) {
            const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
            const dial = new THREE.Mesh(dialGeo, aluminum);
            dial.rotation.x = Math.PI/2;
            dial.position.set(-3 + i*2, -2, 4.25);
            boxGroup.add(dial);
        }

        // Cables using TubeGeometry
        class CustomSinCurve extends THREE.Curve {
            constructor(scale, p1, p2) {
                super();
                this.scale = scale;
                this.p1 = p1;
                this.p2 = p2;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = this.p1.x + (this.p2.x - this.p1.x) * t;
                const ty = this.p1.y + (this.p2.y - this.p1.y) * t - Math.sin(t * Math.PI) * 5; // sagging cable
                const tz = this.p1.z + (this.p2.z - this.p1.z) * t;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        
        // Cable from laser to box
        const path1 = new CustomSinCurve(1, new THREE.Vector3(-10, 2, 0), new THREE.Vector3(10, 6, -10));
        const tube1Geo = new THREE.TubeGeometry(path1, 64, 0.2, 8, false);
        const tube1 = new THREE.Mesh(tube1Geo, wireMat);
        group.add(tube1);

        // Cable from stage to box
        const path2 = new CustomSinCurve(1, new THREE.Vector3(11, 11, 10), new THREE.Vector3(15, 6, -6));
        const tube2Geo = new THREE.TubeGeometry(path2, 64, 0.15, 8, false);
        const tube2 = new THREE.Mesh(tube2Geo, new THREE.MeshStandardMaterial({color: 0x0000ff}));
        group.add(tube2);

        group.add(boxGroup);

        parts.push({
            name: "System Control Electronics",
            description: "Houses laser power supply, piezoelectric motor drivers, and high-speed data acquisition (DAQ) boards.",
            material: "Steel, Copper, Silicon Electronics",
            function: "Synchronizes laser intensity, stage position, and camera triggers to execute complex manipulation and force measurement protocols.",
            assemblyOrder: 11,
            connections: ["All Subsystems", "AC Mains"],
            failureEffect: "Total system blackout or erratic stage movements tearing the optical trap.",
            cascadeFailures: ["System reboot required"],
            originalPosition: { x: 15, y: 6, z: -10 },
            explodedPosition: { x: 30, y: 6, z: -20 }
        });
    }

    // 8. Laser Beam Visualization and Trapped Particle
    function createLaserBeamsAndParticle() {
        // Beam from Laser to Mirror 1
        const beam1Geo = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
        const beam1 = new THREE.Mesh(beam1Geo, laserBeamMat);
        beam1.rotation.z = Math.PI / 2;
        beam1.position.set(-10, 4, 0);
        
        // Beam from Mirror 1 to Mirror 2
        const beam2Geo = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
        const beam2 = new THREE.Mesh(beam2Geo, laserBeamMat);
        beam2.rotation.x = Math.PI / 2;
        beam2.position.set(-5, 4, 5);

        // Expanded Beam from Expander to Dichroic
        const beam3Geo = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
        const beam3 = new THREE.Mesh(beam3Geo, laserBeamMat);
        beam3.rotation.z = Math.PI / 2;
        beam3.position.set(0, 4, 10);

        // Beam bouncing UP from Dichroic into Objective
        const beam4Geo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
        const beam4 = new THREE.Mesh(beam4Geo, laserBeamMat);
        beam4.position.set(5, 5.5, 10);

        // Highly focused Cone out of objective to sample
        const coneGeo = new THREE.CylinderGeometry(0.01, 0.5, 3.5, 32);
        const cone = new THREE.Mesh(coneGeo, intenseLaserMat);
        cone.position.set(5, 10.25, 10); // Focus at y = 12
        
        // Add all to animated arrays for pulsing effects
        animatedObjects.laserBeams.push(beam1, beam2, beam3, beam4, cone);
        group.add(beam1, beam2, beam3, beam4, cone);

        // Trapped Particle (Polystyrene Bead)
        const particleGeo = new THREE.IcosahedronGeometry(0.3, 3);
        const particle = new THREE.Mesh(particleGeo, particleMat);
        // Particle sits exactly at the focal point of the cone
        particle.position.set(5, 12, 10); // Matches cone tip (10.25 + 3.5/2 = 12)
        animatedObjects.particle = particle;
        group.add(particle);
        
        // Background free-floating particles
        for(let i=0; i<30; i++) {
            const freePartGeo = new THREE.IcosahedronGeometry(0.15, 2);
            const freePart = new THREE.Mesh(freePartGeo, particleMat.clone());
            freePart.material.emissiveIntensity = 0.2; // Dimmer since not in trap
            
            // Random positions around the stage
            const x = 5 + (Math.random() - 0.5) * 4;
            const y = 11.5 + (Math.random() * 1);
            const z = 10 + (Math.random() - 0.5) * 4;
            
            freePart.position.set(x, y, z);
            
            // Give them random velocity vectors for animation
            freePart.userData.vel = new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );
            freePart.userData.origin = new THREE.Vector3(x, y, z);
            
            animatedObjects.floatingParticles.push(freePart);
            group.add(freePart);
        }

        parts.push({
            name: "1064nm Trapping Beam & Dielectric Microsphere",
            description: "A highly focused Gaussian laser beam creates a strong electric field gradient. The 1 μm polystyrene or silica bead acts as a dipole, being drawn to the highest intensity region (the focal point).",
            material: "Photons, Polystyrene/Silica",
            function: "The core mechanism of the machine. Forms a 3D harmonic potential well (optical spring) to hold, move, and measure forces on biological molecules attached to the bead.",
            assemblyOrder: 12,
            connections: ["Objective Lens", "Sample Fluid"],
            failureEffect: "Laser fluctuation causes trap stiffness (k) to vary, invalidating force measurements. Too much power induces local heating and convection currents, destroying the sample.",
            cascadeFailures: ["Loss of particle", "Boiling fluid"],
            originalPosition: { x: 5, y: 12, z: 10 },
            explodedPosition: { x: 5, y: 12, z: -10 }
        });
    }

    // Execute builder functions
    createOpticalTable();
    createLaserSource();
    createOpticsPath();
    createObjectiveLens();
    createTranslationStage();
    createCameraSystem();
    createElectronics();
    createLaserBeamsAndParticle();

    // Machine Description
    const description = `
### Dual-Beam Photonic Optical Tweezer
A hyper-realistic, high-tech simulation of an advanced optical trapping system. 
This machine utilizes the momentum of photons from a 5W Nd:YAG 1064nm continuous-wave laser, tightly focused through a 1.49 NA objective lens, to create a strong electric field gradient. This gradient exerts piconewton-scale forces on microscopic dielectric particles, trapping them in 3D space. 

It features a massive pneumatic vibration isolation table, sub-nanometer piezoelectric translation stages, complex optical beam expansion and steering components, and a high-speed sCMOS detection system. This tool is heavily used in biophysics to manipulate single DNA molecules, measure molecular motor steps, and explore quantum thermodynamic limits.
    `.trim();

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Why is a high Numerical Aperture (NA) objective lens absolutely critical for an optical tweezer?",
            options: [
                "It produces a steeper intensity gradient, ensuring the gradient force overcomes the scattering force to enable 3D trapping.",
                "It makes the laser beam larger so it can trap bigger objects like red blood cells.",
                "It prevents the laser from overheating the sample fluid.",
                "It filters out stray room light from entering the camera."
            ],
            correctAnswer: 0,
            explanation: "The gradient force pulls particles toward the laser focus, while the scattering force pushes them along the beam propagation direction. A high NA lens creates a cone of light steep enough that the axial gradient force overcomes the scattering force, allowing stable trapping in 3D."
        },
        {
            question: "What is the primary function of the Keplerian Beam Expander in this system?",
            options: [
                "To decrease the laser intensity to prevent biological damage.",
                "To expand the laser beam diameter so it completely overfills the back aperture of the objective lens.",
                "To change the wavelength of the laser from infrared to visible.",
                "To split the beam into two separate traps."
            ],
            correctAnswer: 1,
            explanation: "Overfilling the back aperture of the objective lens is required to utilize the full Numerical Aperture of the lens, which is necessary to achieve the tight diffraction-limited spot size needed for a strong trap."
        },
        {
            question: "Why is an infrared (1064nm) laser typically chosen over visible lasers for biological optical tweezers?",
            options: [
                "It is cheaper to manufacture than visible lasers.",
                "Biological tissues and water have a 'transparency window' in the near-infrared, minimizing photon absorption and fatal heating (opticution).",
                "Infrared light carries more momentum per photon than blue light.",
                "Infrared cameras are much faster than visible light cameras."
            ],
            correctAnswer: 1,
            explanation: "Visible light is highly absorbed by biological pigments, and longer IR wavelengths are absorbed strongly by water. 1064nm sits in a sweet spot where absorption is low, preventing the sample from being cooked by the immense laser power at the focus."
        },
        {
            question: "What physical phenomenon causes the trapped dielectric particle to jitter constantly inside the trap?",
            options: [
                "Laser mode hopping.",
                "Brownian motion (thermal fluctuations) resulting from collisions with fluid molecules.",
                "Vibrations from the building's HVAC system.",
                "Piezoelectric stage noise."
            ],
            correctAnswer: 1,
            explanation: "Even in a perfect trap, the particle will exhibit Brownian motion due to thermal energy (kT) causing constant collisions with surrounding water molecules. The camera tracks this motion to calibrate the trap stiffness."
        },
        {
            question: "What would happen if you used an air objective instead of an oil-immersion objective in this setup?",
            options: [
                "The trap would become stronger due to less viscous drag.",
                "Total internal reflection at the glass-air interface would severely limit the NA, destroying the axial trapping ability.",
                "The sample fluid would evaporate faster.",
                "The laser would reflect back and destroy the laser cavity."
            ],
            correctAnswer: 1,
            explanation: "Air has an index of refraction of 1.0, while glass/oil is ~1.51. An air gap causes severe refraction and total internal reflection of high-angle rays, drastically dropping the effective NA below the threshold required for 3D trapping."
        }
    ];

    // Complex Animation Loop
    function animate(time, speed, meshes) {
        // 1. Laser beam pulsing (simulating intensity fluctuations or mode structure)
        const pulse = (Math.sin(time * 10 * speed) + 1) * 0.1 + 0.9;
        animatedObjects.laserBeams.forEach(beam => {
            if(beam.material.emissiveIntensity) {
                // Modulate opacity and emissive
                beam.material.opacity = 0.5 * pulse;
            }
        });

        // 2. Trapped Particle Brownian Motion
        // Confined to a small harmonic potential well at the focus
        if(animatedObjects.particle) {
            const bx = (Math.sin(time * 45 * speed) + Math.cos(time * 31 * speed)) * 0.02;
            const by = (Math.cos(time * 55 * speed) + Math.sin(time * 27 * speed)) * 0.02;
            const bz = (Math.sin(time * 39 * speed) + Math.sin(time * 41 * speed)) * 0.02;
            
            // Base focus position is (5, 12, 10)
            animatedObjects.particle.position.set(5 + bx, 12 + by, 10 + bz);
            
            // Pulsing glow on the particle due to laser scattering
            animatedObjects.particle.material.emissiveIntensity = 1.0 + (pulse * 0.5);
        }

        // 3. Stage Scanning (Lissajous curve scan pattern)
        if(animatedObjects.stageX && animatedObjects.stageY) {
            // Stage moves relative to the base. The particle stays in the trap (world fixed).
            // This simulates dragging the sample chamber around the trapped particle.
            const scanX = Math.sin(time * 2 * speed) * 0.5;
            const scanY = Math.cos(time * 3 * speed) * 0.5;
            
            animatedObjects.stageX.position.x = scanX;
            animatedObjects.stageY.position.z = scanY; // Y stage moves along Z axis in our rig
            
            // Spin lead screws to match stage translation
            animatedObjects.leadScrewsX.forEach(screw => {
                screw.rotation.y = time * 20 * speed * Math.sign(Math.cos(time * 2 * speed));
            });
            animatedObjects.leadScrewsY.forEach(screw => {
                screw.rotation.y = time * 20 * speed * Math.sign(-Math.sin(time * 3 * speed));
            });
        }

        // 4. Free-floating particles Brownian motion + dragging
        // The fluid moves with the stage, so particles drift with the stage PLUS brownian motion
        animatedObjects.floatingParticles.forEach(fp => {
            // Brownian step
            fp.userData.vel.x += (Math.random() - 0.5) * 0.005;
            fp.userData.vel.y += (Math.random() - 0.5) * 0.005;
            fp.userData.vel.z += (Math.random() - 0.5) * 0.005;
            
            // Damping (viscosity)
            fp.userData.vel.multiplyScalar(0.9);
            
            // Update relative position
            fp.userData.origin.add(fp.userData.vel);
            
            // Apply stage offset to get world position (since fluid moves with stage)
            // But visually we are just moving the particle in world space based on stage offset
            const scanX = Math.sin(time * 2 * speed) * 0.5;
            const scanY = Math.cos(time * 3 * speed) * 0.5;
            
            fp.position.x = fp.userData.origin.x + scanX;
            fp.position.y = fp.userData.origin.y;
            fp.position.z = fp.userData.origin.z + scanY;
            
            // Slowly rotate floating particles
            fp.rotation.x += fp.userData.vel.x * 10;
            fp.rotation.y += fp.userData.vel.y * 10;
        });

        // 5. LED Indicators blinking
        animatedObjects.indicators.forEach((led, index) => {
            // Different blink rates
            const blink = Math.sin(time * (5 + index * 2) * speed) > 0 ? 1 : 0;
            led.material.emissiveIntensity = blink * 2.0;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOpticalTweezer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
