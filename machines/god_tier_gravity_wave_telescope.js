import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const animRefs = {
        stations: [],
        lasers: [],
        pistons: [],
        gyroTires: [],
        screens: [],
        mirrors: [],
        time: 0,
        gridMaterial: null,
        basePositions: []
    };

    // -------------------------------------------------------------------------
    // CUSTOM MATERIALS & SHADERS
    // -------------------------------------------------------------------------
    
    const blindingGreenLaser = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const glowingScreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0
    });

    const cryogenicSapphire = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.99,
        thickness: 5.0,
        ior: 1.76,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        emissive: 0x113355,
        emissiveIntensity: 0.5
    });

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.8,
        roughness: 0.3,
        bumpScale: 0.05
    });

    // Space-Time Distortion Shader
    const gridVertexShader = `
        uniform float time;
        uniform float waveAmplitude;
        uniform float waveFrequency;
        uniform float waveSpeed;
        uniform vec3 waveDirection;
        varying vec2 vUv;
        varying float vDistortion;

        void main() {
            vUv = uv;
            float dist = dot(position, waveDirection);
            float phase = waveFrequency * dist - waveSpeed * time;
            
            // Plus polarization h_+ approximation
            float h_plus = waveAmplitude * cos(phase);
            // Cross polarization h_x approximation
            float h_cross = waveAmplitude * sin(phase);
            
            vec3 displacedPosition = position;
            // Quadrupole spatial distortion approximation
            displacedPosition.y += h_plus * 20.0 * sin(position.x * 0.02) * cos(position.z * 0.02);
            displacedPosition.x += h_cross * 5.0 * cos(position.z * 0.01);
            
            vDistortion = h_plus;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
    `;

    const gridFragmentShader = `
        uniform float time;
        uniform vec3 gridColor;
        varying vec2 vUv;
        varying float vDistortion;

        void main() {
            float gridX = abs(fract(vUv.x * 150.0) - 0.5) * 2.0;
            float gridY = abs(fract(vUv.y * 150.0) - 0.5) * 2.0;
            float line = max(smoothstep(0.85, 1.0, gridX), smoothstep(0.85, 1.0, gridY));
            
            vec3 color = mix(vec3(0.0), gridColor, line);
            color += gridColor * (abs(vDistortion) / 15.0) * 3.0; // Glow on wave peaks
            
            gl_FragColor = vec4(color, line * 0.6 + (abs(vDistortion) / 15.0));
        }
    `;

    const spaceTimeUniforms = {
        time: { value: 0 },
        waveAmplitude: { value: 15.0 },
        waveFrequency: { value: 0.02 },
        waveSpeed: { value: 3.0 },
        waveDirection: { value: new THREE.Vector3(1, 0, 0.5).normalize() },
        gridColor: { value: new THREE.Color(0x00ff88) }
    };

    const spaceTimeMaterial = new THREE.ShaderMaterial({
        vertexShader: gridVertexShader,
        fragmentShader: gridFragmentShader,
        uniforms: spaceTimeUniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    animRefs.gridMaterial = spaceTimeMaterial;

    // -------------------------------------------------------------------------
    // PROCEDURAL GENERATION HELPERS
    // -------------------------------------------------------------------------

    function createAggressiveTire(radius, tube, radialSegments, tubularSegments, lugCount) {
        const tireGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const tireMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireMesh);

        // Hundreds of extruded lugs for aggressive off-road treads
        const lugGeo = new THREE.BoxGeometry(tube * 1.6, tube * 0.4, tube * 0.8);
        for(let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * (radius + tube * 0.4), Math.sin(angle) * (radius + tube * 0.4), 0);
            lug.rotation.z = angle;
            // Alternating chevron pattern
            lug.rotation.y = (i % 2 === 0) ? Math.PI / 8 : -Math.PI / 8;
            tireGroup.add(lug);
        }

        // Rims (Cylinder with complex spokes)
        const rimGeo = new THREE.CylinderGeometry(radius - tube * 0.6, radius - tube * 0.6, tube * 1.3, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        const spokeCount = 16;
        const spokeGeo = new THREE.CylinderGeometry(tube * 0.15, tube * 0.15, radius * 1.9, 16);
        for (let i = 0; i < spokeCount / 2; i++) {
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / (spokeCount / 2)) * Math.PI;
            tireGroup.add(spoke);
        }

        // Hub cap
        const hubGeo = new THREE.CylinderGeometry(tube * 0.6, tube * 0.6, tube * 1.5, 16);
        const hub = new THREE.Mesh(hubGeo, steel);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        return tireGroup;
    }

    function createOperatorCabin() {
        const cabin = new THREE.Group();

        // Complex Hull using Shape & Extrude
        const cabinShape = new THREE.Shape();
        cabinShape.moveTo(-10, -5);
        cabinShape.lineTo(10, -5);
        cabinShape.lineTo(12, 5);
        cabinShape.lineTo(8, 10);
        cabinShape.lineTo(-8, 10);
        cabinShape.lineTo(-12, 5);
        cabinShape.lineTo(-10, -5);

        const extrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
        const hullGeo = new THREE.ExtrudeGeometry(cabinShape, extrudeSettings);
        const hull = new THREE.Mesh(hullGeo, steel);
        hull.position.z = -7.5;
        cabin.add(hull);

        // Tinted Glass Windows
        const windowGeo = new THREE.PlaneGeometry(14, 6);
        const frontWindow = new THREE.Mesh(windowGeo, tinted);
        frontWindow.position.set(0, 3, 7.6);
        cabin.add(frontWindow);

        // Steering Wheels
        const wheelGeo = new THREE.TorusGeometry(1.5, 0.2, 8, 24);
        const wheel1 = new THREE.Mesh(wheelGeo, darkSteel);
        wheel1.position.set(-4, 0, 5);
        wheel1.rotation.x = -Math.PI / 4;
        cabin.add(wheel1);
        
        const wheel2 = new THREE.Mesh(wheelGeo, darkSteel);
        wheel2.position.set(4, 0, 5);
        wheel2.rotation.x = -Math.PI / 4;
        cabin.add(wheel2);

        // Joysticks
        const joyBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
        const joyStickGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        const joyKnobGeo = new THREE.SphereGeometry(0.3, 16, 16);
        
        for(let i of [-6, -2, 2, 6]) {
            const joystick = new THREE.Group();
            const base = new THREE.Mesh(joyBaseGeo, rubber);
            const stick = new THREE.Mesh(joyStickGeo, chrome);
            stick.position.y = 1;
            const knob = new THREE.Mesh(joyKnobGeo, plastic);
            knob.position.y = 2;
            joystick.add(base, stick, knob);
            joystick.position.set(i, -2, 4);
            joystick.rotation.x = -Math.PI/6;
            cabin.add(joystick);
        }

        // Glowing Control Screens
        const screenGeo = new THREE.PlaneGeometry(3, 2);
        for(let i=0; i<5; i++) {
            const screen = new THREE.Mesh(screenGeo, glowingScreenMat);
            screen.position.set(-6 + i*3, 3, 4.5);
            screen.rotation.x = -Math.PI/4;
            cabin.add(screen);
            animRefs.screens.push(screen);
        }

        // Side Mirrors
        const mirrorArmGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const mirrorHousingGeo = new THREE.BoxGeometry(2, 3, 0.5);
        const mirrorGlassGeo = new THREE.PlaneGeometry(1.8, 2.8);
        
        [-13, 13].forEach((x, idx) => {
            const mirrorGroup = new THREE.Group();
            const arm = new THREE.Mesh(mirrorArmGeo, steel);
            arm.rotation.z = idx === 0 ? Math.PI/2 : -Math.PI/2;
            arm.position.set(idx === 0 ? 1.5 : -1.5, 0, 0);
            
            const housing = new THREE.Mesh(mirrorHousingGeo, darkSteel);
            housing.position.set(idx === 0 ? 3 : -3, 0, 0);
            housing.rotation.y = idx === 0 ? Math.PI/6 : -Math.PI/6;
            
            const glassMesh = new THREE.Mesh(mirrorGlassGeo, chrome);
            glassMesh.position.set(idx === 0 ? 3 : -3, 0, 0.26);
            glassMesh.rotation.y = idx === 0 ? Math.PI/6 : -Math.PI/6;
            
            mirrorGroup.add(arm, housing, glassMesh);
            mirrorGroup.position.set(x, 2, 5);
            cabin.add(mirrorGroup);
        });

        // Exhaust Stacks
        const exhaustGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
        for(let i=0; i<6; i++) {
            const leftExhaust = new THREE.Mesh(exhaustGeo, darkSteel);
            leftExhaust.position.set(-11, 8, -5 + i*2);
            cabin.add(leftExhaust);
            
            const rightExhaust = new THREE.Mesh(exhaustGeo, darkSteel);
            rightExhaust.position.set(11, 8, -5 + i*2);
            cabin.add(rightExhaust);
        }

        // Ladders & Grilles
        const ladderGroup = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 15, 8);
        const railL = new THREE.Mesh(railGeo, steel); railL.position.x = -1.5;
        const railR = new THREE.Mesh(railGeo, steel); railR.position.x = 1.5;
        ladderGroup.add(railL, railR);
        
        const rungGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        for(let i=0; i<20; i++) {
            const rung = new THREE.Mesh(rungGeo, steel);
            rung.position.y = -7 + i*0.75;
            rung.rotation.z = Math.PI/2;
            ladderGroup.add(rung);
        }
        ladderGroup.position.set(0, -10, 8);
        cabin.add(ladderGroup);
        
        // Grille
        const grilleGroup = new THREE.Group();
        const grilleBar = new THREE.BoxGeometry(10, 0.2, 0.2);
        for(let i=0; i<10; i++) {
            const bar = new THREE.Mesh(grilleBar, chrome);
            bar.position.y = i * 0.5;
            grilleGroup.add(bar);
        }
        grilleGroup.position.set(0, -3, 7.8);
        cabin.add(grilleGroup);

        return cabin;
    }

    function createHydraulicPiston() {
        const group = new THREE.Group();
        
        // Cylinder
        const cylGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const cylinder = new THREE.Mesh(cylGeo, darkSteel);
        cylinder.position.y = 7.5;
        group.add(cylinder);

        // Rod
        const rodGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 15; // Extends upwards
        group.add(rod);
        
        // Hydraulic Lines (TubeGeometry)
        class CustomSinCurve extends THREE.Curve {
            constructor(scale = 1) { super(); this.scale = scale; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.sin(t * Math.PI * 4) * 2;
                const ty = t * 15;
                const tz = Math.cos(t * Math.PI * 4) * 2;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        const path = new CustomSinCurve(1);
        const lineGeo = new THREE.TubeGeometry(path, 64, 0.2, 8, false);
        const hLine1 = new THREE.Mesh(lineGeo, rubber);
        hLine1.position.set(1.5, 0, 0);
        group.add(hLine1);

        animRefs.pistons.push({ rod, basePos: 15 });
        return group;
    }

    function createMassiveStation(stationName, scaleMult = 1.0) {
        const station = new THREE.Group();
        
        // 1. Central Hub (Highly detailed LatheGeometry)
        const points = [];
        for (let i = 0; i <= 60; i++) {
            const t = i / 60;
            const y = (t - 0.5) * 100;
            const radius = 30 + Math.sin(t * Math.PI * 10) * 5 + (Math.abs(y) < 20 ? 15 : 0) + (i % 10 === 0 ? 8 : 0);
            points.push(new THREE.Vector2(radius, y));
        }
        const hubGeo = new THREE.LatheGeometry(points, 64);
        const hub = new THREE.Mesh(hubGeo, goldFoil);
        station.add(hub);

        // 2. Cryogenic Sapphire Mirror Chamber
        const mirrorHousingGeo = new THREE.CylinderGeometry(20, 20, 40, 32);
        const mirrorHousing = new THREE.Mesh(mirrorHousingGeo, steel);
        mirrorHousing.position.y = 60;
        station.add(mirrorHousing);

        const mirrorGeo = new THREE.CylinderGeometry(15, 15, 5, 64);
        const mirror = new THREE.Mesh(mirrorGeo, cryogenicSapphire);
        mirror.position.y = 60;
        mirror.rotation.x = Math.PI / 2;
        station.add(mirror);
        animRefs.mirrors.push(mirror);

        // 3. Kinetic Stabilizer Gyro-Tires
        const tireCount = 6;
        for (let i = 0; i < tireCount; i++) {
            const angle = (i / tireCount) * Math.PI * 2;
            const tire = createAggressiveTire(25, 8, 32, 64, 120);
            tire.position.set(Math.cos(angle) * 60, -40, Math.sin(angle) * 60);
            // Orient tires tangent to the ring
            tire.rotation.y = -angle + Math.PI/2;
            station.add(tire);
            animRefs.gyroTires.push(tire);
        }

        // 4. Operator Cabin
        const cabin = createOperatorCabin();
        cabin.position.set(0, 15, 45);
        station.add(cabin);

        // 5. Hydraulic Actuators connecting hub to mirror housing
        for(let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const piston = createHydraulicPiston();
            piston.position.set(Math.cos(angle) * 25, 30, Math.sin(angle) * 25);
            // Point towards center slightly
            piston.rotation.x = Math.cos(angle) * 0.2;
            piston.rotation.z = -Math.sin(angle) * 0.2;
            station.add(piston);
        }

        // 6. Thruster Pods
        const thrusterGroup = new THREE.Group();
        const thrusterGeo = new THREE.ConeGeometry(5, 15, 16);
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const thruster = new THREE.Mesh(thrusterGeo, darkSteel);
            thruster.position.set(Math.cos(angle) * 45, -60, Math.sin(angle) * 45);
            thruster.rotation.x = Math.PI;
            thrusterGroup.add(thruster);
        }
        station.add(thrusterGroup);

        // 7. Thermal Radiator Arrays (Extensive fins)
        const radiatorGroup = new THREE.Group();
        const finGeo = new THREE.BoxGeometry(2, 40, 15);
        for(let i=0; i<36; i++) {
            const angle = (i/36) * Math.PI * 2;
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(Math.cos(angle) * 55, 0, Math.sin(angle) * 55);
            fin.rotation.y = -angle;
            radiatorGroup.add(fin);
        }
        station.add(radiatorGroup);

        // 8. Interlocking Truss Ring
        const trussRing = new THREE.Group();
        const ringTorusGeo = new THREE.TorusGeometry(70, 2, 16, 64);
        const ring1 = new THREE.Mesh(ringTorusGeo, steel);
        ring1.rotation.x = Math.PI/2;
        ring1.position.y = -20;
        const ring2 = new THREE.Mesh(ringTorusGeo, steel);
        ring2.rotation.x = Math.PI/2;
        ring2.position.y = 20;
        trussRing.add(ring1, ring2);

        const crossStrutGeo = new THREE.CylinderGeometry(1, 1, 40, 8);
        for(let i=0; i<64; i++) {
            const angle = (i/64) * Math.PI * 2;
            const strut = new THREE.Mesh(crossStrutGeo, darkSteel);
            strut.position.set(Math.cos(angle) * 70, 0, Math.sin(angle) * 70);
            strut.rotation.z = (i % 2 === 0) ? Math.PI/6 : -Math.PI/6;
            strut.rotation.y = -angle;
            trussRing.add(strut);
        }
        station.add(trussRing);

        station.scale.set(scaleMult, scaleMult, scaleMult);
        return station;
    }

    // -------------------------------------------------------------------------
    // SCENE ASSEMBLY
    // -------------------------------------------------------------------------

    // A: (0, 0, -400)
    // B: (346.41, 0, 200)
    // C: (-346.41, 0, 200)
    const radius = 600; 
    const posA = new THREE.Vector3(0, 0, -radius);
    const posB = new THREE.Vector3(radius * Math.sin(Math.PI * 2/3), 0, radius * Math.cos(Math.PI * 2/3));
    const posC = new THREE.Vector3(radius * Math.sin(Math.PI * 4/3), 0, radius * Math.cos(Math.PI * 4/3));

    const stationA = createMassiveStation("Alpha", 1.0);
    stationA.position.copy(posA);
    group.add(stationA);
    animRefs.stations.push(stationA);
    animRefs.basePositions.push(posA.clone());

    const stationB = createMassiveStation("Beta", 1.0);
    stationB.position.copy(posB);
    group.add(stationB);
    animRefs.stations.push(stationB);
    animRefs.basePositions.push(posB.clone());

    const stationC = createMassiveStation("Gamma", 1.0);
    stationC.position.copy(posC);
    group.add(stationC);
    animRefs.stations.push(stationC);
    animRefs.basePositions.push(posC.clone());

    // Connect them with blinding green lasers
    function createInterferometerLaser(p1, p2) {
        const distance = p1.distanceTo(p2);
        const laserGeo = new THREE.CylinderGeometry(3, 3, distance, 32);
        const laser = new THREE.Mesh(laserGeo, blindingGreenLaser);
        
        const midPoint = p1.clone().add(p2).multiplyScalar(0.5);
        laser.position.copy(midPoint);
        
        const axis = new THREE.Vector3(0, 1, 0);
        const dir = p2.clone().sub(p1).normalize();
        laser.quaternion.setFromUnitVectors(axis, dir);
        
        // Add a secondary inner core for intense brightness
        const coreGeo = new THREE.CylinderGeometry(1, 1, distance, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        laser.add(core);

        group.add(laser);
        animRefs.lasers.push(laser);
        return laser;
    }

    createInterferometerLaser(posA, posB);
    createInterferometerLaser(posB, posC);
    createInterferometerLaser(posC, posA);

    // Build the Space-Time Grid
    const gridGeo = new THREE.PlaneGeometry(3000, 3000, 150, 150);
    const spaceTimeMesh = new THREE.Mesh(gridGeo, spaceTimeMaterial);
    spaceTimeMesh.rotation.x = -Math.PI / 2;
    spaceTimeMesh.position.y = -150;
    group.add(spaceTimeMesh);

    // -------------------------------------------------------------------------
    // PARTS ARRAY
    // -------------------------------------------------------------------------

    const parts = [
        {
            name: "Alpha Station - Central Interferometry Hub",
            description: "The primary beam splitter and quantum squeezed light injection node. Houses the master control computers and coordinates TDI (Time-Delay Interferometry).",
            material: "goldFoil, steel",
            function: "Splits the primary Nd:YAG laser into two orthogonal beams traveling towards Beta and Gamma.",
            assemblyOrder: 1,
            connections: ["Inter-Station Laser Conduit", "Quantum Squeezed Light Injector", "Space-Time Grid"],
            failureEffect: "Complete loss of interferometric lock and signal cancellation.",
            cascadeFailures: ["Data Processing Supercomputer Array", "Calibration Photodiode Array"],
            originalPosition: { x: posA.x, y: posA.y, z: posA.z },
            explodedPosition: { x: posA.x, y: posA.y + 200, z: posA.z - 200 }
        },
        {
            name: "Beta Station - Primary Reflector Array",
            description: "Houses ultra-pure cryogenic sapphire test masses suspended by fused silica fibers to reflect the laser beam back to Alpha.",
            material: "goldFoil, steel, aluminum",
            function: "Reflects laser phase information, forming one arm of the massive triangular Michelson interferometer.",
            assemblyOrder: 2,
            connections: ["Cryogenic Sapphire Test Mass B", "Thermal Dissipation Radiators"],
            failureEffect: "Laser beam diverges into deep space. Severe reduction in detector sensitivity.",
            cascadeFailures: ["Alpha Station Hub"],
            originalPosition: { x: posB.x, y: posB.y, z: posB.z },
            explodedPosition: { x: posB.x + 200, y: posB.y + 200, z: posB.z + 200 }
        },
        {
            name: "Gamma Station - Secondary Reflector Array",
            description: "Symmetrical twin to Beta station. Completes the equilateral Sagnac interferometer topology.",
            material: "goldFoil, steel, aluminum",
            function: "Provides the secondary path for differential arm length measurements.",
            assemblyOrder: 3,
            connections: ["Cryogenic Sapphire Test Mass C", "Thermal Dissipation Radiators"],
            failureEffect: "Inability to distinguish gravitational wave signals from frequency noise.",
            cascadeFailures: ["Alpha Station Hub"],
            originalPosition: { x: posC.x, y: posC.y, z: posC.z },
            explodedPosition: { x: posC.x - 200, y: posC.y + 200, z: posC.z + 200 }
        },
        {
            name: "Quantum Squeezed Light Injector",
            description: "Injects phase-squeezed vacuum states into the dark port of the interferometer to reduce quantum shot noise.",
            material: "chrome, glass",
            function: "Lowers the quantum noise limit, enhancing sensitivity to high-frequency gravitational wave transients.",
            assemblyOrder: 4,
            connections: ["Alpha Station - Central Interferometry Hub"],
            failureEffect: "Increased shot noise masking high-frequency signals.",
            cascadeFailures: [],
            originalPosition: { x: posA.x, y: posA.y + 60, z: posA.z },
            explodedPosition: { x: posA.x, y: posA.y + 120, z: posA.z }
        },
        {
            name: "Cryogenic Sapphire Test Mass A",
            description: "A 40kg, ultra-pure sapphire cylinder cooled to 20 Kelvin. Acts as the free-falling test mass.",
            material: "cryogenicSapphire",
            function: "Changes physical position infinitesimally as space-time is stretched and compressed by a passing gravitational wave.",
            assemblyOrder: 5,
            connections: ["Vibration Isolation Pendulums", "Hydraulic Mirror Actuator System"],
            failureEffect: "Thermal noise overwhelms the GW signal.",
            cascadeFailures: ["Interferometer Lock"],
            originalPosition: { x: posA.x, y: posA.y + 60, z: posA.z },
            explodedPosition: { x: posA.x, y: posA.y + 100, z: posA.z }
        },
        {
            name: "Hydraulic Mirror Actuator System",
            description: "Complex network of high-pressure hydraulic lines and cylinders that constantly adjust the mirror housing.",
            material: "rubber, chrome, darkSteel",
            function: "Maintains exact alignment of the test masses against tidal forces and solar wind pressure.",
            assemblyOrder: 6,
            connections: ["Cryogenic Sapphire Test Mass A", "Alpha Station - Central Interferometry Hub"],
            failureEffect: "Mirror misalignment leading to immediate loss of laser resonance.",
            cascadeFailures: ["Interferometer Lock", "Data Processing Supercomputer Array"],
            originalPosition: { x: posA.x, y: posA.y + 30, z: posA.z },
            explodedPosition: { x: posA.x - 50, y: posA.y + 30, z: posA.z }
        },
        {
            name: "Kinetic Stabilizer Gyro-Tires",
            description: "Massive gyroscopic reaction wheels designed with aggressive off-road treads to also function as magnetic track drives in docking bays.",
            material: "rubber, darkSteel, chrome",
            function: "Absorbs macroscopic angular momentum to keep the station orientation perfect within nano-radians.",
            assemblyOrder: 7,
            connections: ["Alpha Station - Central Interferometry Hub", "Beta Station", "Gamma Station"],
            failureEffect: "Station uncontrolled spin, tearing the optical cables.",
            cascadeFailures: ["Hydraulic Mirror Actuator System"],
            originalPosition: { x: posA.x + 60, y: posA.y - 40, z: posA.z },
            explodedPosition: { x: posA.x + 150, y: posA.y - 40, z: posA.z }
        },
        {
            name: "Operator Override Cabin - Alpha",
            description: "Pressurized module for human engineers. Features tinted windows, joysticks, steering wheels, and blindingly bright control screens.",
            material: "steel, tinted, plastic",
            function: "Allows manual, on-site recalibration of the Sagnac loops during catastrophic automation failures.",
            assemblyOrder: 8,
            connections: ["Alpha Station - Central Interferometry Hub"],
            failureEffect: "Loss of manual repair capabilities.",
            cascadeFailures: [],
            originalPosition: { x: posA.x, y: posA.y + 15, z: posA.z + 45 },
            explodedPosition: { x: posA.x, y: posA.y + 15, z: posA.z + 100 }
        },
        {
            name: "Inter-Station Laser Conduit",
            description: "The blinding green Nd:YAG laser beam spanning millions of miles between stations, forming the measurement arms.",
            material: "blindingGreenLaser",
            function: "Measures the relative proper distance between the free-falling test masses.",
            assemblyOrder: 9,
            connections: ["Alpha Station", "Beta Station", "Gamma Station"],
            failureEffect: "Total instrument failure.",
            cascadeFailures: ["Data Processing Supercomputer Array"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 0 }
        },
        {
            name: "Space-Time Grid Distortion Sensor Matrix",
            description: "Visualized projection of the local metric tensor $g_{\mu\nu}$. Warps visibly as gravitational waves pass.",
            material: "ShaderMaterial",
            function: "Maps the spatial strain $h$ caused by the propagating ripple in the curvature of spacetime.",
            assemblyOrder: 10,
            connections: ["Universe"],
            failureEffect: "Physics ceases to function locally.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: -150, z: 0 },
            explodedPosition: { x: 0, y: -300, z: 0 }
        },
        {
            name: "Thermal Dissipation Radiators",
            description: "Arrays of deep-finned aluminum heat sinks surrounding the central hubs.",
            material: "aluminum",
            function: "Radiates excess heat generated by the multi-megawatt lasers into the vacuum of space.",
            assemblyOrder: 11,
            connections: ["Alpha Station Hub", "Beta Station", "Gamma Station"],
            failureEffect: "Overheating of the cryogenic mirrors, inducing massive thermal noise.",
            cascadeFailures: ["Cryogenic Sapphire Test Mass A", "Laser Generator"],
            originalPosition: { x: posB.x, y: posB.y, z: posB.z },
            explodedPosition: { x: posB.x, y: posB.y, z: posB.z - 100 }
        },
        {
            name: "Positional Telemetry Thruster Array",
            description: "Conical chemical and ion thruster bells located at the base of the stations.",
            material: "darkSteel",
            function: "Provides station-keeping delta-v to counter orbital drift and solar radiation pressure.",
            assemblyOrder: 12,
            connections: ["Alpha Station Hub"],
            failureEffect: "Orbital decay and eventual loss of the triangular formation.",
            cascadeFailures: ["Laser Conduit", "Interferometer Lock"],
            originalPosition: { x: posC.x, y: posC.y - 60, z: posC.z },
            explodedPosition: { x: posC.x, y: posC.y - 120, z: posC.z }
        },
        {
            name: "Interlocking Truss Ring",
            description: "Massive toroidal structural frame reinforced with cross-struts.",
            material: "steel, darkSteel",
            function: "Provides extreme rigidity to the station hull, preventing vibrational modes from coupling into the mirrors.",
            assemblyOrder: 13,
            connections: ["Thermal Dissipation Radiators", "Operator Override Cabin"],
            failureEffect: "Structural resonance that mimics a gravitational wave signal (false positive).",
            cascadeFailures: ["Data Processing Supercomputer Array"],
            originalPosition: { x: posA.x, y: posA.y, z: posA.z },
            explodedPosition: { x: posA.x, y: posA.y + 150, z: posA.z }
        },
        {
            name: "Exhaust Stacks and Ventilation",
            description: "Industrial-grade exhaust pipes extending from the operator cabin and thruster modules.",
            material: "darkSteel",
            function: "Vents hypergolic propellent bleed-off and life support byproducts.",
            assemblyOrder: 14,
            connections: ["Operator Override Cabin"],
            failureEffect: "Toxic gas buildup in the cabin.",
            cascadeFailures: ["Operator Override Cabin"],
            originalPosition: { x: posA.x - 11, y: posA.y + 23, z: posA.z + 40 },
            explodedPosition: { x: posA.x - 30, y: posA.y + 50, z: posA.z + 40 }
        },
        {
            name: "Dark Matter Baffle Shields",
            description: "Thick concentric rings lining the optical path to absorb stray photons and potential weakly interacting massive particles.",
            material: "rubber, steel",
            function: "Prevents scattered laser light from recombining with the main beam with a random phase.",
            assemblyOrder: 15,
            connections: ["Inter-Station Laser Conduit", "Cryogenic Sapphire Test Mass A"],
            failureEffect: "Phase noise floor rises, masking the GW signals.",
            cascadeFailures: [],
            originalPosition: { x: posB.x, y: posB.y + 60, z: posB.z },
            explodedPosition: { x: posB.x, y: posB.y + 160, z: posB.z }
        }
    ];

    // -------------------------------------------------------------------------
    // PHD-LEVEL EDUCATIONAL QUIZ
    // -------------------------------------------------------------------------

    const quizQuestions = [
        {
            question: "In a space-based, triangular gravitational wave detector like this God-Tier Observatory, what is the primary purpose of Time-Delay Interferometry (TDI)?",
            options: [
                "To amplify the amplitude of the gravitational wave by creating constructive interference at specific frequencies.",
                "To cancel out overwhelming laser frequency noise by combining phase measurements shifted by exact photon flight times.",
                "To compensate for the Doppler shift caused by the expansion of the universe over the millions of miles between stations.",
                "To dynamically adjust the hydraulic pistons in real-time to track the exact center of the passing wavefront."
            ],
            correctAnswer: 1,
            explanation: "Because the arm lengths of a space-based detector cannot be kept perfectly equal, laser frequency noise does not perfectly cancel at the beam splitter. TDI relies on forming combinations of time-shifted phase measurements that synthetically reproduce an equal-arm interferometer, thus suppressing laser frequency noise by many orders of magnitude."
        },
        {
            question: "How does the injection of a phase-squeezed vacuum state into the dark port of a Fabry-Perot Michelson interferometer alter the Heisenberg Uncertainty Principle bounds for the measurement?",
            options: [
                "It violates the uncertainty principle by simultaneously reducing both phase and amplitude uncertainty below the standard quantum limit.",
                "It reduces phase uncertainty (decreasing shot noise at high frequencies) at the direct expense of increasing amplitude uncertainty (increasing quantum radiation pressure noise at low frequencies).",
                "It increases the number of photons in the dark port, thereby boosting the signal-to-noise ratio uniformly across all frequencies.",
                "It cools the cryogenic sapphire mirrors to absolute zero by absorbing scattered phonons."
            ],
            correctAnswer: 1,
            explanation: "Squeezed light exploits the Heisenberg uncertainty principle (ΔX1 * ΔX2 ≥ ħ/2). By squeezing the phase quadrature (reducing shot noise), the anti-squeezed amplitude quadrature introduces fluctuations in radiation pressure acting on the mirrors, which degrades sensitivity at low frequencies. This trade-off is fundamental to quantum non-demolition measurements."
        },
        {
            question: "What is the specific geometric effect of the cross polarization ($h_\\times$) of a gravitational wave on a ring of freely falling test particles in the transverse plane?",
            options: [
                "It causes the ring to expand and contract uniformly in all directions simultaneously (a breathing mode).",
                "It distorts the ring into an ellipse, with the axes of the ellipse rotated by 45 degrees relative to the plus ($h_+$) polarization.",
                "It causes the particles to oscillate longitudinally along the direction of wave propagation.",
                "It induces a purely rotational frame-dragging effect, spinning the ring without changing its shape."
            ],
            correctAnswer: 1,
            explanation: "Gravitational waves are transverse, traceless tensor perturbations. The plus ($h_+$) polarization stretches along the x-axis and compresses along the y-axis (and vice versa). The cross ($h_\\times$) polarization has the exact same stretching/compressing effect, but rotated by exactly 45 degrees (π/4 radians) in the transverse plane."
        },
        {
            question: "In the context of the Hellings-Downs curve for detecting a Stochastic Gravitational Wave Background (SGWB), what does the curve fundamentally map?",
            options: [
                "The expected correlation between the timing residuals of two pulsars (or detectors) as a function of the angular separation between them on the sky.",
                "The decay rate of a binary neutron star orbit due to the emission of gravitational radiation.",
                "The power spectral density of thermal noise in the cryogenic sapphire mirrors as a function of temperature.",
                "The phase delay introduced by dark matter passing through the inter-station laser conduit."
            ],
            correctAnswer: 0,
            explanation: "The Hellings-Downs curve predicts the angular cross-correlation function of the isotropic stochastic gravitational wave background. Because the GW background induces a quadrupolar spatial distortion, the correlation between timing residuals in an array of detectors (like pulsar timing arrays or multi-baseline networks) varies predictably based on the angle between them."
        },
        {
            question: "Why is an equilateral triangle topology (Sagnac configuration) uniquely advantageous for a space-based GW detector over a traditional L-shaped detector?",
            options: [
                "It provides a completely redundant third arm, allowing for continuous operation even if one laser conduit completely fails.",
                "It allows the formation of a null stream—a specific data combination that cancels the gravitational wave signal entirely, leaving only instrumental noise for precise calibration.",
                "It naturally aligns with the magnetic field lines of the solar system, providing passive magnetic shielding for the test masses.",
                "The triangular shape physically focuses the gravitational waves into the center hub, massively amplifying the strain."
            ],
            correctAnswer: 1,
            explanation: "By combining the phase measurements from all three arms of an equilateral triangular detector, one can construct a 'Sagnac' observable (the null stream). Because GWs are quadrupolar, their effect largely cancels out in a symmetric closed loop, while instrumental noises do not. This null stream serves as a perfect real-time noise monitor and calibration reference."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------

    function animate(time, speed, meshes) {
        animRefs.time = time * speed;

        // 1. Ripple the Space-Time Grid
        if (animRefs.gridMaterial) {
            animRefs.gridMaterial.uniforms.time.value = animRefs.time;
        }

        // 2. Gravitational Wave physically displaces the stations
        // We use the same math as the shader to move the actual 3D objects!
        const waveFreq = spaceTimeUniforms.waveFrequency.value;
        const waveSpeed = spaceTimeUniforms.waveSpeed.value;
        const waveAmp = spaceTimeUniforms.waveAmplitude.value;
        const waveDir = spaceTimeUniforms.waveDirection.value;

        animRefs.stations.forEach((station, idx) => {
            const basePos = animRefs.basePositions[idx];
            const dist = basePos.dot(waveDir);
            const phase = waveFreq * dist - waveSpeed * animRefs.time;
            const h_plus = waveAmp * Math.cos(phase);
            const h_cross = waveAmp * Math.sin(phase);

            // Apply metric spatial distortion to the station's physical position
            station.position.x = basePos.x + h_cross * 5.0;
            station.position.y = basePos.y + h_plus * 20.0 * Math.sin(basePos.x * 0.02) * Math.cos(basePos.z * 0.02);
            station.position.z = basePos.z;

            // Gentle orbital wobble
            station.rotation.y = Math.sin(animRefs.time * 0.2 + idx) * 0.03;
            station.rotation.z = Math.cos(animRefs.time * 0.15 + idx) * 0.02;
        });

        // 3. Pulse the Lasers based on the passing wave
        const globalWavePulse = Math.sin(animRefs.time * waveSpeed) * 0.5 + 0.5;
        animRefs.lasers.forEach(laser => {
            // Re-aim the lasers constantly to track the moving stations
            // This represents the extreme precision required.
            // (Assuming lasers are stored A->B, B->C, C->A)
            laser.material.emissiveIntensity = 3.0 + globalWavePulse * 7.0; // Blinding pulsing
            laser.material.opacity = 0.7 + globalWavePulse * 0.3;
        });

        // 4. Spin the Kinetic Stabilizer Gyro-Tires incredibly fast
        animRefs.gyroTires.forEach(tire => {
            tire.rotation.x += 0.2 * speed;
        });

        // 5. Animate Hydraulic Pistons adjusting the mirror housings
        animRefs.pistons.forEach((p, idx) => {
            // Rapid micro-adjustments
            const extension = Math.sin(animRefs.time * 5.0 + idx * 2.1) * 3.0;
            p.rod.position.y = p.basePos + extension;
        });

        // 6. Blink the Operator Cabin Screens randomly
        animRefs.screens.forEach(screen => {
            if (Math.random() > 0.8) {
                screen.material.emissiveIntensity = Math.random() * 4.0;
            }
        });

        // 7. Rotate the cryogenic mirrors slowly to distribute thermal loads
        animRefs.mirrors.forEach(mirror => {
            mirror.rotation.y += 0.01 * speed;
        });
    }

    return { group, parts, description: "Stellar-Scale Gravity Wave Telescope (God Tier). A massive, three-station Sagnac interferometer spanning millions of miles. Features advanced spacetime grid distortion shaders, blinding Nd:YAG lasers, highly detailed operator cabins with kinetic stabilizer gyro-tires, and cryogenic sapphire test masses.", quizQuestions, animate };
}
