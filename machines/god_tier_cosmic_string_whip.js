import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ----------------------------------------------------------------------------------
    // COSMOLOGICAL PHYSICS & SUPERWEAPON DESCRIPTION
    // ----------------------------------------------------------------------------------
    const description = "The God-Tier Cosmic String Whip is an apocalyptic superweapon built on a colossal 8-wheeled crawler platform. It harnesses a localized Grand Unified Theory (GUT) phase transition to project and manipulate a one-dimensional topological defect—a cosmic string. Boasting immense mass and tension (approx. 10^22 kg/m), the string lashes out at near-light speed, utilizing catastrophic tidal forces and gravitational lensing to cleave planetary bodies in half while its containment facility manages the unfathomable gravitational feedback and spacetime distortion.";

    // ----------------------------------------------------------------------------------
    // CUSTOM SHADERS & MATERIALS
    // ----------------------------------------------------------------------------------
    
    // Cosmic String Shader
    const stringUniforms = {
        time: { value: 0 },
        strikePhase: { value: 0 },
        targetPos: { value: new THREE.Vector3(0, 300, -2500) } // Relative to string base
    };

    const cosmicStringMaterial = new THREE.ShaderMaterial({
        uniforms: stringUniforms,
        vertexShader: `
            varying vec2 vUv;
            varying float vFactor;
            uniform float time;
            uniform float strikePhase;
            uniform vec3 targetPos;

            void main() {
                vUv = uv;
                vec3 pos = position;
                // pos.y goes from 0 to 3000
                float normY = pos.y / 3000.0;
                vFactor = normY;
                
                // Idle wave simulation (quantum fluctuations)
                float waveX = sin(normY * 25.0 + time * 10.0) * 15.0 * normY;
                float waveZ = cos(normY * 20.0 - time * 8.0) * 15.0 * normY;
                vec3 idlePos = vec3(pos.x + waveX, pos.y, pos.z + waveZ);
                
                // Target strike position calculation
                vec3 dir = targetPos; 
                vec3 strikeTargetPos = normalize(dir) * (pos.y * 1.05); // slightly stretches
                
                // Physical whip dynamics using non-linear interpolation
                float whipWarp = pow(normY, 1.8); 
                vec3 finalPos = mix(idlePos, strikeTargetPos, strikePhase * whipWarp);
                
                // Spacetime rippling effect along the string
                finalPos.x += sin(finalPos.y * 0.1 + time * 20.0) * 2.0 * strikePhase;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying float vFactor;
            uniform float time;
            uniform float strikePhase;

            void main() {
                // Intense glowing core with halo
                float edge = abs(vUv.x - 0.5) * 2.0; // 0 at center, 1 at edge
                float core = smoothstep(0.8, 0.0, edge);
                
                vec3 coreColor = vec3(1.0, 1.0, 1.0);
                vec3 haloColor = vec3(0.1, 0.4, 1.0) * (1.0 + sin(time * 15.0 - vFactor * 50.0) * 0.5);
                
                // Spike brightness during strike
                float brightness = 1.0 + max(0.0, strikePhase) * 5.0;
                vec3 finalColor = mix(haloColor, coreColor, core) * brightness;
                
                gl_FragColor = vec4(finalColor, 1.0 - edge * 0.5);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // Spacetime Distortion Material
    const spacetimeMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPos;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // TorusKnot displacement
                float noise = sin(pos.x * 0.05 + time) * cos(pos.y * 0.05 - time) * sin(pos.z * 0.05 + time);
                pos += normal * noise * 5.0;
                vPos = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPos;
            uniform float time;
            void main() {
                float pulse = abs(sin(vPos.y * 0.02 - time * 2.0));
                vec3 color = vec3(0.5, 0.1, 0.8) * pulse;
                gl_FragColor = vec4(color, 0.3 * pulse);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        wireframe: true
    });

    // ----------------------------------------------------------------------------------
    // MASSIVE ANCHOR FACILITY (CRAWLER BASE)
    // ----------------------------------------------------------------------------------
    const anchorGroup = new THREE.Group();
    group.add(anchorGroup);

    // 1. Main Chassis
    const chassisGroup = new THREE.Group();
    anchorGroup.add(chassisGroup);

    const chassisGeo = new THREE.BoxGeometry(300, 60, 500);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 80, 0);
    chassisGroup.add(chassisMesh);

    // 2. Chassis Greebles & Rivets
    const greebleGroup = new THREE.Group();
    chassisGroup.add(greebleGroup);
    const rivetGeo = new THREE.SphereGeometry(1.5, 8, 8);
    for(let i = 0; i < 200; i++) {
        const rivet = new THREE.Mesh(rivetGeo, chrome);
        const rx = (Math.random() - 0.5) * 290;
        const rz = (Math.random() - 0.5) * 490;
        const side = Math.random() > 0.5 ? 110 : 50; // top or bottom of chassis box
        rivet.position.set(rx, side, rz);
        greebleGroup.add(rivet);
    }

    // Heavy Plating on chassis
    for(let i = 0; i < 20; i++) {
        const plateGeo = new THREE.BoxGeometry(40, 5, 40);
        const plate = new THREE.Mesh(plateGeo, steel);
        plate.position.set((Math.random() - 0.5) * 250, 112, (Math.random() - 0.5) * 450);
        plate.rotation.y = Math.random() * Math.PI;
        greebleGroup.add(plate);
    }

    parts.push({
        name: 'Crawler Chassis Base',
        description: 'The titanic dark-steel hull housing the zero-point energy reactors. It provides extreme mass ballast to counteract the apocalyptic recoil of the cosmic string whip.',
        material: 'darkSteel / steel',
        function: 'Mobile Ground Anchorage',
        assemblyOrder: 1,
        connections: ['Suspension Hydraulics', 'Graviton Emitter Tower'],
        failureEffect: 'Structural tear; the entire facility flips and is dragged into space by the string.',
        cascadeFailures: ['All Wheels', 'Emitter Core Integrity'],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // ----------------------------------------------------------------------------------
    // COMPLEX TIRE/WHEEL GENERATOR
    // ----------------------------------------------------------------------------------
    function createComplexWheel(radius, tube, spokesCount, lugCount) {
        const wheel = new THREE.Group();
        
        // Tire base
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.x = Math.PI / 2;
        wheel.add(tire);
        
        // Aggressive Off-road Lugs
        for(let i=0; i<lugCount; i++) {
            const lugGeo = new THREE.BoxGeometry(tube * 2.4, tube * 0.6, tube * 1.0);
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (i / lugCount) * Math.PI * 2;
            lug.position.set(Math.cos(angle) * (radius + tube*0.15), Math.sin(angle) * (radius + tube*0.15), 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? 0.35 : -0.35; // V-pattern tread
            wheel.add(lug);
        }
        
        // Rim outer
        const rimOuterGeo = new THREE.CylinderGeometry(radius - tube*0.8, radius - tube*0.8, tube * 2.5, 64);
        const rimOuter = new THREE.Mesh(rimOuterGeo, aluminum);
        rimOuter.rotation.x = Math.PI / 2;
        wheel.add(rimOuter);
        
        // Inner Hub
        const hubGeo = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, tube * 3.5, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        wheel.add(hub);
        
        // Spokes Complex Truss
        for(let i=0; i<spokesCount; i++) {
            const spokeGroup = new THREE.Group();
            const angle = (i / spokesCount) * Math.PI * 2;
            
            const mainSpoke = new THREE.Mesh(new THREE.CylinderGeometry(tube*0.25, tube*0.35, radius*0.7, 16), steel);
            mainSpoke.position.y = radius * 0.35;
            spokeGroup.add(mainSpoke);
            
            // X-Braces
            const braceGeo = new THREE.CylinderGeometry(tube*0.1, tube*0.1, radius*0.4, 8);
            const brace1 = new THREE.Mesh(braceGeo, darkSteel);
            brace1.position.set(tube*0.5, radius*0.4, 0);
            brace1.rotation.z = Math.PI / 4;
            spokeGroup.add(brace1);
            
            const brace2 = new THREE.Mesh(braceGeo, darkSteel);
            brace2.position.set(-tube*0.5, radius*0.4, 0);
            brace2.rotation.z = -Math.PI / 4;
            spokeGroup.add(brace2);

            spokeGroup.rotation.z = angle;
            wheel.add(spokeGroup);
        }

        // Hub bolts
        for(let i=0; i<12; i++) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(tube*0.15, tube*0.15, tube*4.0, 12), darkSteel);
            const ba = (i/12)*Math.PI*2;
            bolt.position.set(Math.cos(ba)*radius*0.2, Math.sin(ba)*radius*0.2, 0);
            bolt.rotation.x = Math.PI / 2;
            wheel.add(bolt);
        }
        
        return wheel;
    }

    const wheelPositions = [
        {x: 180, z: 200, name: 'Front-Left Heavy Drive Wheel'},
        {x: -180, z: 200, name: 'Front-Right Heavy Drive Wheel'},
        {x: 180, z: 70, name: 'Mid-Front-Left Drive Wheel'},
        {x: -180, z: 70, name: 'Mid-Front-Right Drive Wheel'},
        {x: 180, z: -70, name: 'Mid-Rear-Left Drive Wheel'},
        {x: -180, z: -70, name: 'Mid-Rear-Right Drive Wheel'},
        {x: 180, z: -200, name: 'Rear-Left Heavy Drive Wheel'},
        {x: -180, z: -200, name: 'Rear-Right Heavy Drive Wheel'}
    ];

    const wheelMeshes = [];
    const suspensionGroup = new THREE.Group();
    anchorGroup.add(suspensionGroup);

    wheelPositions.forEach((wp, idx) => {
        const wheel = createComplexWheel(40, 15, 12, 80);
        wheel.position.set(wp.x, 40, wp.z);
        wheel.rotation.y = Math.PI / 2; // Face forward
        anchorGroup.add(wheel);
        wheelMeshes.push(wheel);

        // Suspension arm
        const suspArm = new THREE.Mesh(new THREE.BoxGeometry(60, 20, 20), steel);
        // Connect chassis to wheel
        const signX = Math.sign(wp.x);
        suspArm.position.set(wp.x - signX * 30, 60, wp.z);
        suspArm.rotation.z = signX * Math.PI / 6;
        suspensionGroup.add(suspArm);

        // Huge shock absorber
        const shockOuter = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 40, 16), chrome);
        shockOuter.position.set(wp.x - signX * 10, 70, wp.z);
        suspensionGroup.add(shockOuter);

        const shockInner = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 40, 16), darkSteel);
        shockInner.position.set(wp.x - signX * 10, 50, wp.z);
        suspensionGroup.add(shockInner);

        parts.push({
            name: wp.name,
            description: `Colossal all-terrain traction unit utilizing Torus geometries and 80 extruded rubber lugs per wheel to anchor against the extreme shear forces of the whip crack.`,
            material: 'rubber / aluminum / steel',
            function: 'Locomotion and Shear Absorption',
            assemblyOrder: 2 + idx,
            connections: ['Suspension Hydraulics', 'Crawler Chassis Base'],
            failureEffect: 'Loss of traction causes the platform to skid violently, inducing seismic devastation to the local terrain.',
            cascadeFailures: ['Chassis Alignment'],
            originalPosition: { x: wp.x, y: 40, z: wp.z },
            explodedPosition: { x: wp.x * 1.5, y: 40, z: wp.z * 1.5 }
        });
    });

    parts.push({
        name: 'Active Suspension & Hydraulics',
        description: 'Hydraulic struts operating at pressures exceeding 50,000 PSI to maintain level anchoring.',
        material: 'steel / chrome / darkSteel',
        function: 'Kinetic dampening',
        assemblyOrder: 10,
        connections: ['Wheels', 'Chassis'],
        failureEffect: 'Base platform tilts, throwing off the graviton beam alignment and shredding the facility.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 60, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });


    // ----------------------------------------------------------------------------------
    // OPERATOR COMMAND CENTER
    // ----------------------------------------------------------------------------------
    const commandCenter = new THREE.Group();
    commandCenter.position.set(0, 130, 200); // Front of the chassis
    anchorGroup.add(commandCenter);

    const cabinGeo = new THREE.BoxGeometry(60, 40, 50);
    const cabin = new THREE.Mesh(cabinGeo, darkSteel);
    commandCenter.add(cabin);

    // Front Window (Slanted)
    const windowGeo = new THREE.PlaneGeometry(55, 25);
    const cabinWindow = new THREE.Mesh(windowGeo, tinted);
    cabinWindow.position.set(0, 5, 25.1);
    cabinWindow.rotation.x = -0.1;
    commandCenter.add(cabinWindow);

    // Side Windows
    const sideWinGeo = new THREE.PlaneGeometry(30, 20);
    const sideWinL = new THREE.Mesh(sideWinGeo, tinted);
    sideWinL.position.set(30.1, 5, 0);
    sideWinL.rotation.y = Math.PI / 2;
    commandCenter.add(sideWinL);

    const sideWinR = new THREE.Mesh(sideWinGeo, tinted);
    sideWinR.position.set(-30.1, 5, 0);
    sideWinR.rotation.y = -Math.PI / 2;
    commandCenter.add(sideWinR);

    // Interior Consoles
    const consoleGeo = new THREE.BoxGeometry(50, 15, 15);
    const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
    consoleMesh.position.set(0, -10, 15);
    commandCenter.add(consoleMesh);

    // Glowing Holographic Screens
    const screenGeo = new THREE.PlaneGeometry(12, 8);
    const screenMat1 = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
    const screenMat2 = new THREE.MeshBasicMaterial({ color: 0xff3366, wireframe: true });
    
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(screenGeo, i%2==0 ? screenMat1 : screenMat2);
        screen.position.set(-15 + i*15, -2, 22.6);
        screen.rotation.x = -Math.PI / 6;
        commandCenter.add(screen);
    }

    // Steering / Joysticks
    const steeringCol = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10, 16), darkSteel);
    steeringCol.position.set(-10, -5, 10);
    steeringCol.rotation.x = Math.PI / 4;
    commandCenter.add(steeringCol);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 16, 32), plastic);
    steeringWheel.position.set(-10, -1, 14);
    steeringWheel.rotation.x = Math.PI / 4;
    commandCenter.add(steeringWheel);

    const joystickBase = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), rubber);
    joystickBase.position.set(10, -3, 10);
    commandCenter.add(joystickBase);

    const joystickStick = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 16), steel);
    joystickStick.position.set(10, 1, 10);
    commandCenter.add(joystickStick);

    // Operator Chair
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 16), darkSteel);
    chairBase.position.set(-10, -16, 5);
    commandCenter.add(chairBase);
    
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), rubber);
    chairSeat.position.set(-10, -12, 5);
    commandCenter.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(10, 12, 2), rubber);
    chairBack.position.set(-10, -6, 0);
    commandCenter.add(chairBack);

    parts.push({
        name: 'Operator Command Center',
        description: 'Heavily shielded, tinted-glass command bridge where a highly trained psychokinetic astrogator computes the intense topological math required to crack the string without destroying Earth.',
        material: 'darkSteel / tinted / plastic',
        function: 'Targeting and Execution',
        assemblyOrder: 11,
        connections: ['Chassis Base', 'Targeting Relays'],
        failureEffect: 'Operator suffers immediate ego death due to localized paradoxes, firing the whip uncontrollably.',
        cascadeFailures: ['Targeting Relays'],
        originalPosition: { x: 0, y: 130, z: 200 },
        explodedPosition: { x: 0, y: 230, z: 300 }
    });

    // ----------------------------------------------------------------------------------
    // GRAVITON EMITTER TOWER & CONTAINMENT RINGS
    // ----------------------------------------------------------------------------------
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, 110, -50);
    anchorGroup.add(towerGroup);

    // Tower Base
    const towerBaseGeo = new THREE.CylinderGeometry(80, 100, 40, 64);
    const towerBase = new THREE.Mesh(towerBaseGeo, darkSteel);
    towerBase.position.y = 20;
    towerGroup.add(towerBase);

    // Superfluid Cooling Lines (Complex Tubes)
    const pipeGroup = new THREE.Group();
    towerGroup.add(pipeGroup);
    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI * 2;
        const r1 = 90;
        const r2 = 60;
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(angle)*r1, 0, Math.sin(angle)*r1),
            new THREE.Vector3(Math.cos(angle)*(r1+20), 40, Math.sin(angle)*(r1+20)),
            new THREE.Vector3(Math.cos(angle)*r2, 100, Math.sin(angle)*r2)
        );
        const pipeGeo = new THREE.TubeGeometry(curve, 20, 3, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pipeGroup.add(pipe);
    }

    parts.push({
        name: 'Superfluid Helium Cooling Lines',
        description: '32 pure copper cryogenic tubes pumping superfluid helium to prevent the graviton core from initiating a false-vacuum decay.',
        material: 'copper',
        function: 'Thermal Regulation',
        assemblyOrder: 12,
        connections: ['Tower Base', 'Core Mantle'],
        failureEffect: 'Core meltdown resulting in a localized Big Crunch.',
        cascadeFailures: ['Graviton Emitter Core'],
        originalPosition: { x: 0, y: 110, z: -50 },
        explodedPosition: { x: 0, y: 110, z: -150 }
    });

    // The Central Core
    const coreGeo = new THREE.SphereGeometry(30, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x0055ff, emissiveIntensity: 2, roughness: 0.1 });
    const emitterCore = new THREE.Mesh(coreGeo, coreMat);
    emitterCore.position.y = 120;
    towerGroup.add(emitterCore);

    // Inner Lenses
    for(let i=0; i<4; i++) {
        const lensGeo = new THREE.CylinderGeometry(35 + i*5, 35 + i*5, 5, 64);
        const lens = new THREE.Mesh(lensGeo, glass);
        lens.position.y = 100 + i*10;
        towerGroup.add(lens);
    }

    parts.push({
        name: 'Graviton Emitter Core & Lenses',
        description: 'A pulsating, hyper-dense sphere of degenerate matter generating a graviton beam, focused through hyper-glass lenses to tether the 1D string to our 3D reality.',
        material: 'glass / emissive',
        function: 'String Anchorage',
        assemblyOrder: 13,
        connections: ['Cooling Lines', 'Containment Rings'],
        failureEffect: 'Unanchored string detaches and slices randomly through the solar system.',
        cascadeFailures: ['Spacetime Integrity'],
        originalPosition: { x: 0, y: 230, z: -50 },
        explodedPosition: { x: 0, y: 400, z: -50 }
    });

    // Magnetic Containment Rings
    const ringGroup = new THREE.Group();
    towerGroup.add(ringGroup);
    const ringMeshes = [];
    
    for (let i = 0; i < 12; i++) {
        const ringRadius = 60 - i * 3;
        const ringGeo = new THREE.TorusGeometry(ringRadius, 4, 32, 100);
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        ringMesh.position.y = 130 + i * 15;
        ringMesh.rotation.x = Math.PI / 2;
        
        // Add intricate electromagnetic nodes
        for(let j=0; j<8; j++) {
            const lugGeo = new THREE.BoxGeometry(8, 8, 12);
            const lug = new THREE.Mesh(lugGeo, steel);
            const angle = (j / 8) * Math.PI * 2;
            lug.position.set(Math.cos(angle)*ringRadius, Math.sin(angle)*ringRadius, 0);
            lug.rotation.z = angle;
            
            // Add a tiny glowing tip to the node
            const tipGeo = new THREE.CylinderGeometry(2, 2, 14, 16);
            const tip = new THREE.Mesh(tipGeo, screenMat1); // reuse glowing material
            tip.rotation.x = Math.PI / 2;
            lug.add(tip);

            ringMesh.add(lug);
        }

        ringGroup.add(ringMesh);
        ringMeshes.push({ mesh: ringMesh, speed: (i % 2 === 0 ? 1 : -1) * (1.0 + i * 0.2) });
    }

    parts.push({
        name: 'Electromagnetic Containment Rings',
        description: 'A stack of 12 counter-rotating chrome toruses bristling with electromagnetic nodes. They generate a pinching magnetic bottle to stabilize the volatile base of the string.',
        material: 'chrome / steel',
        function: 'String Stabilization',
        assemblyOrder: 14,
        connections: ['Emitter Core', 'Cosmic String Base'],
        failureEffect: 'String base wildly destabilizes, carving the facility into subatomic confetti.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 330, z: -50 },
        explodedPosition: { x: 0, y: 600, z: -50 }
    });

    // Articulated Stabilizer Arms (4x around the tower)
    const armGroup = new THREE.Group();
    towerGroup.add(armGroup);
    for(let i=0; i<4; i++) {
        const armPivot = new THREE.Group();
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        
        // Base mount
        const mountGeo = new THREE.BoxGeometry(20, 30, 20);
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.position.set(Math.cos(angle)*90, 40, Math.sin(angle)*90);
        mount.rotation.y = -angle;
        armPivot.add(mount);
        
        // Lower Arm
        const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 120, 32), steel);
        lowerArm.position.set(Math.cos(angle)*80, 100, Math.sin(angle)*80);
        // Tilt inwards
        lowerArm.rotation.y = -angle;
        lowerArm.rotation.x = Math.cos(angle)*0.3;
        lowerArm.rotation.z = Math.sin(angle)*0.3;
        armPivot.add(lowerArm);

        // Claws
        const clawGeo = new THREE.BoxGeometry(10, 40, 10);
        const claw = new THREE.Mesh(clawGeo, chrome);
        claw.position.set(Math.cos(angle)*65, 150, Math.sin(angle)*65);
        claw.lookAt(0, 150, 0);
        armPivot.add(claw);

        armGroup.add(armPivot);
    }

    parts.push({
        name: 'Articulated Stabilizer Arms',
        description: 'Four massive mechanical steel arms that physically clamp down on the ambient kinetic shockwaves emitting from the containment field.',
        material: 'darkSteel / steel / chrome',
        function: 'Physical Shock Absorption',
        assemblyOrder: 15,
        connections: ['Tower Base', 'Upper Containment Rings'],
        failureEffect: 'Rings vibrate themselves to pieces.',
        cascadeFailures: ['Containment Rings'],
        originalPosition: { x: 0, y: 210, z: -50 },
        explodedPosition: { x: 0, y: 210, z: 150 }
    });

    // ----------------------------------------------------------------------------------
    // THE COSMIC STRING & SPACETIME DISTORTION
    // ----------------------------------------------------------------------------------
    
    // Spacetime Distortion Mesh (TorusKnot)
    const distortionGeo = new THREE.TorusKnotGeometry(120, 40, 256, 64, 4, 9);
    const distortionMesh = new THREE.Mesh(distortionGeo, spacetimeMaterial);
    distortionMesh.position.set(0, 250, -50);
    anchorGroup.add(distortionMesh);

    parts.push({
        name: 'Spacetime Distortion Field',
        description: 'Not a physical part, but a severe visual manifestation of localized space warping caused by the extreme mass density of the string base. Rendered as a chaotic, twisting wireframe.',
        material: 'Spacetime Shader',
        function: 'Visualizing Gravitational Lensing',
        assemblyOrder: 16,
        connections: [],
        failureEffect: 'None (It is a byproduct)',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 250, z: -50 },
        explodedPosition: { x: 0, y: 250, z: -50 }
    });

    // The String Itself
    const whipLength = 3000;
    const stringGeo = new THREE.CylinderGeometry(8, 0.5, whipLength, 64, 250); 
    stringGeo.translate(0, whipLength / 2, 0); // Base at 0,0,0
    const cosmicStringMesh = new THREE.Mesh(stringGeo, cosmicStringMaterial);
    cosmicStringMesh.position.set(0, 310, -50); // Top of the rings
    anchorGroup.add(cosmicStringMesh);

    parts.push({
        name: 'Cosmic String (God-Tier Defect)',
        description: 'A 1D topological defect spanning 3000 meters in this localized configuration. Infinitely thin at its core, it is enveloped in a blinding halo of Cherenkov radiation and lensing artifacts.',
        material: 'Emissive String Shader',
        function: 'Absolute Destruction / Planetary Cleaving',
        assemblyOrder: 17,
        connections: ['Emitter Core'],
        failureEffect: 'Universal False Vacuum Decay.',
        cascadeFailures: ['The Universe'],
        originalPosition: { x: 0, y: 310, z: -50 },
        explodedPosition: { x: 0, y: 1000, z: -50 }
    });

    // ----------------------------------------------------------------------------------
    // CELESTIAL TARGET (PLANET) & DEBRIS
    // ----------------------------------------------------------------------------------
    const targetGroup = new THREE.Group();
    // Planet is 2500 units away on the Z axis, floating high
    targetGroup.position.set(0, 800, -2550);
    group.add(targetGroup);

    // Top Hemisphere
    const planetTopGeo = new THREE.SphereGeometry(400, 128, 128, 0, Math.PI * 2, 0, Math.PI / 2);
    // Add terrain noise
    const topPos = planetTopGeo.attributes.position;
    for(let i=0; i<topPos.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(topPos, i);
        const noise = Math.sin(p.x * 0.02) * Math.cos(p.y * 0.02) * Math.sin(p.z * 0.02);
        p.addScaledVector(p.clone().normalize(), noise * 20);
        topPos.setXYZ(i, p.x, p.y, p.z);
    }
    planetTopGeo.computeVertexNormals();

    const planetMat = new THREE.MeshStandardMaterial({
        color: 0x336699,
        roughness: 0.9,
        metalness: 0.1
    });
    const planetTop = new THREE.Mesh(planetTopGeo, planetMat);
    targetGroup.add(planetTop);

    // Bottom Hemisphere
    const planetBotGeo = new THREE.SphereGeometry(400, 128, 128, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botPos = planetBotGeo.attributes.position;
    for(let i=0; i<botPos.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(botPos, i);
        const noise = Math.sin(p.x * 0.02) * Math.cos(p.y * 0.02) * Math.sin(p.z * 0.02);
        p.addScaledVector(p.clone().normalize(), noise * 20);
        botPos.setXYZ(i, p.x, p.y, p.z);
    }
    planetBotGeo.computeVertexNormals();

    const planetBottom = new THREE.Mesh(planetBotGeo, planetMat);
    targetGroup.add(planetBottom);

    // Magma Core Cuts
    const coreCutGeo = new THREE.CircleGeometry(398, 128); // slightly smaller to avoid z-fighting at edge
    const coreCutMat = new THREE.MeshStandardMaterial({ 
        color: 0xff4400, 
        emissive: 0xff1100, 
        emissiveIntensity: 3, 
        roughness: 1.0, 
        side: THREE.DoubleSide 
    });
    
    const topCut = new THREE.Mesh(coreCutGeo, coreCutMat);
    topCut.rotation.x = Math.PI / 2;
    planetTop.add(topCut);

    const botCut = new THREE.Mesh(coreCutGeo, coreCutMat);
    botCut.rotation.x = Math.PI / 2;
    planetBottom.add(botCut);

    // Core Light
    const coreLight = new THREE.PointLight(0xff2200, 0, 2000);
    targetGroup.add(coreLight);

    parts.push({
        name: 'Celestial Target (Planet)',
        description: 'A rogue planetoid hauled into the testing range. Features a solid silicate crust and a hyper-pressurized magma core, perfectly suited for demonstrating the string\'s cleaving power.',
        material: 'Rock / Magma',
        function: 'Target Practice',
        assemblyOrder: 18,
        connections: [],
        failureEffect: 'Target survives.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 800, z: -2550 },
        explodedPosition: { x: 0, y: 800, z: -2550 }
    });

    // Debris Particle System for the Strike
    const debrisCount = 1000;
    const debrisGroup = new THREE.Group();
    targetGroup.add(debrisGroup);
    const debrisData = [];
    const rockGeo = new THREE.DodecahedronGeometry(8, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    
    for(let i=0; i<debrisCount; i++) {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        // Distribute along the equator (the cut line)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 400;
        rock.position.set(Math.cos(angle)*radius, (Math.random()-0.5)*20, Math.sin(angle)*radius);
        rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        rock.visible = false;
        debrisGroup.add(rock);
        
        debrisData.push({
            mesh: rock,
            // Explosion velocity favors outward and Y directions
            velocity: new THREE.Vector3( 
                Math.cos(angle) * (100 + Math.random()*400), 
                (Math.random()-0.5)*500, 
                Math.sin(angle) * (100 + Math.random()*400) 
            ),
            rotSpeed: new THREE.Vector3( Math.random()*10, Math.random()*10, Math.random()*10 ),
            origin: rock.position.clone()
        });
    }

    // Whip Strike Flash
    const tipFlashGeo = new THREE.SphereGeometry(150, 32, 32);
    const tipFlashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const tipFlash = new THREE.Mesh(tipFlashGeo, tipFlashMat);
    targetGroup.add(tipFlash);

    // Exhaust Particle System for Crawler
    const exhaustCount = 800;
    const exhaustGeo = new THREE.BufferGeometry();
    const exPos = new Float32Array(exhaustCount * 3);
    const exVel = [];
    for(let i=0; i<exhaustCount; i++) {
        exPos[i*3] = (Math.random() - 0.5) * 200;
        exPos[i*3+1] = 100 + Math.random() * 50;
        exPos[i*3+2] = (Math.random() - 0.5) * 300;
        exVel.push({
            x: (Math.random() - 0.5) * 20,
            y: -100 - Math.random() * 100, // shooting down
            z: (Math.random() - 0.5) * 20
        });
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exPos, 3));
    const exhaustMat = new THREE.PointsMaterial({ color: 0x00ccff, size: 4, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const exhaustSystem = new THREE.Points(exhaustGeo, exhaustMat);
    anchorGroup.add(exhaustSystem);


    // ----------------------------------------------------------------------------------
    // QUIZ QUESTIONS (PhD Level Cosmology / Physics)
    // ----------------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary mechanism by which cosmic strings are theorized to form in the early universe?",
            options: [
                "Hawking radiation condensation around primordial black holes",
                "The Kibble mechanism during symmetry-breaking phase transitions",
                "Supernova nucleosynthesis collapsing 1D spatial dimensions",
                "Spontaneous compactification of string theory's Calabi-Yau manifolds"
            ],
            answer: "The Kibble mechanism during symmetry-breaking phase transitions",
            explanation: "According to Tom Kibble, cosmic strings are 1D topological defects that can form when the symmetry of the universe broke during rapid cooling fractions of a second after the Big Bang, similar to cracks forming in rapidly freezing ice."
        },
        {
            question: "In terms of General Relativity, a perfectly straight cosmic string modifies local spacetime geometry to create what specific curvature?",
            options: [
                "A Schwarzschild metric with infinite singularity",
                "A conical spacetime with a deficit angle \u00Delta\u03B8 = 8\u03C0G\u03BC",
                "An anti-de Sitter space with negative cosmological constant",
                "A Kerr-Newman metric with extreme angular momentum"
            ],
            answer: "A conical spacetime with a deficit angle \u00Delta\u03B8 = 8\u03C0G\u03BC",
            explanation: "Locally, spacetime around a straight cosmic string is flat (zero Riemann curvature), but globally it is conical. A slice perpendicular to the string is a cone, meaning a circle around it has less than 360 degrees."
        },
        {
            question: "What observable astronomical phenomenon would be the most direct, unequivocal signature of a cosmic string passing between Earth and a distant galaxy?",
            options: [
                "Extreme blueshift of the galaxy due to string tension",
                "Gravitational lensing resulting in two identical, unmagnified images of the galaxy separated by a constant angle",
                "An Einstein ring with immense magnification and localized time dilation",
                "Sudden polarization of the Cosmic Microwave Background (CMB) into B-modes only"
            ],
            answer: "Gravitational lensing resulting in two identical, unmagnified images of the galaxy separated by a constant angle",
            explanation: "Because of the conical spacetime, light rays from a background source can travel around the string on two different paths. This produces double images that are exact copies, with no magnification or distortion, unlike standard galactic lensing."
        },
        {
            question: "What is the expected approximate mass per unit length (tension, \u03BC) of a Grand Unified Theory (GUT) scale cosmic string?",
            options: [
                "10^10 kg/m (Mass of a mountain per meter)",
                "10^22 kg/m (Mass of a continent per meter)",
                "10^30 kg/m (Mass of the Sun per meter)",
                "1 kg/m (Negligible mass, pure energy)"
            ],
            answer: "10^22 kg/m (Mass of a continent per meter)",
            explanation: "A GUT-scale cosmic string is unimaginably dense. A one-meter segment would weigh approximately as much as the Earth's entire continental crust, exerting immense gravitational forces."
        },
        {
            question: "When two cosmic strings intersect, what is the most statistically likely outcome according to extensive numerical simulations?",
            options: [
                "They annihilate completely, converting mass into a gamma-ray burst",
                "They pass right through each other unaffected",
                "They intercommute (exchange ends), eventually forming closed loops that decay via gravitational radiation",
                "They fuse together, doubling their tension and forming a string wall"
            ],
            answer: "They intercommute (exchange ends), eventually forming closed loops that decay via gravitational radiation",
            explanation: "Simulations show that colliding strings almost always 'intercommute' or reconnect. This mechanism allows long intersecting strings to chop themselves up into loops, which oscillate and slowly radiate away their energy as gravitational waves."
        }
    ];

    // ----------------------------------------------------------------------------------
    // ANIMATION LOGIC (THE STRIKE)
    // ----------------------------------------------------------------------------------
    
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        const delta = speed * 0.016; // Approx 60fps delta
        
        // 1. Wheel Rotation (Idle driving)
        wheelMeshes.forEach(w => {
            w.rotation.z -= delta * 2.0;
        });

        // 2. Containment Rings Rotation
        ringMeshes.forEach(r => {
            r.mesh.rotation.z += delta * r.speed;
        });

        // 3. Spacetime Distortion pulsing
        distortionMesh.rotation.x += delta * 0.5;
        distortionMesh.rotation.y += delta * 0.3;
        const distScale = 1.0 + Math.sin(t * 5.0) * 0.15;
        distortionMesh.scale.set(distScale, distScale, distScale);
        spacetimeMaterial.uniforms.time.value = t;

        // 4. Exhaust Particles
        const exPositions = exhaustSystem.geometry.attributes.position.array;
        for(let i=0; i<exhaustCount; i++) {
            exPositions[i*3] += exVel[i].x * delta;
            exPositions[i*3+1] += exVel[i].y * delta;
            exPositions[i*3+2] += exVel[i].z * delta;
            
            if (exPositions[i*3+1] < -50) {
                exPositions[i*3] = (Math.random() - 0.5) * 200;
                exPositions[i*3+1] = 100 + Math.random() * 50;
                exPositions[i*3+2] = (Math.random() - 0.5) * 300;
            }
        }
        exhaustSystem.geometry.attributes.position.needsUpdate = true;

        // 5. THE WHIP STRIKE LOGIC
        // 10 second cycle. Strike happens from sec 8.0 to 10.0
        const cycle = t % 10.0;
        let sPhase = 0.0;
        
        if (cycle > 7.5 && cycle < 8.2) {
            // Wind up backward
            sPhase = -0.3 * ((cycle - 7.5) / 0.7);
        } else if (cycle >= 8.2 && cycle < 8.5) {
            // Crack! Lash forward at immense speed
            sPhase = 1.25 * ((cycle - 8.2) / 0.3);
        } else if (cycle >= 8.5) {
            // Pull back slowly
            sPhase = 1.25 - 1.25 * ((cycle - 8.5) / 1.5);
        }
        
        // Clamp to avoid extreme shader glitches
        sPhase = Math.max(-0.4, Math.min(1.25, sPhase));
        
        cosmicStringMaterial.uniforms.time.value = t;
        cosmicStringMaterial.uniforms.strikePhase.value = sPhase;

        // 6. PLANET CLEAVING LOGIC
        let sliceDist = 0;
        if (cycle >= 8.4 && cycle < 9.5) {
            // Planet splits open exponentially
            sliceDist = Math.pow((cycle - 8.4), 2.5) * 150.0;
        } else if (cycle >= 9.5) {
            // Planet magically reforming for the next cycle
            let reverseT = (10.0 - cycle) / 0.5; // goes 1 to 0
            let maxDist = Math.pow((9.5 - 8.4), 2.5) * 150.0;
            sliceDist = maxDist * reverseT;
        }

        planetTop.position.y = sliceDist;
        planetBottom.position.y = -sliceDist;
        
        // Magma Core lighting spikes
        if (sliceDist > 0) {
            coreLight.intensity = Math.min(20000, sliceDist * 500.0);
            targetGroup.rotation.y += delta * 0.05 * sliceDist; // Planet spins out of control when hit
        } else {
            coreLight.intensity = 0;
            targetGroup.rotation.y = 0;
        }

        // 7. DEBRIS EXPLOSION
        if (cycle >= 8.4 && cycle < 9.9) {
            const dt = cycle - 8.4;
            for(let i=0; i<debrisCount; i++) {
                const d = debrisData[i];
                d.mesh.visible = true;
                d.mesh.position.copy(d.origin).addScaledVector(d.velocity, dt);
                d.mesh.rotation.x += d.rotSpeed.x * delta;
                d.mesh.rotation.y += d.rotSpeed.y * delta;
                d.mesh.rotation.z += d.rotSpeed.z * delta;
            }
        } else {
            for(let i=0; i<debrisCount; i++) {
                debrisData[i].mesh.visible = false;
                debrisData[i].mesh.position.copy(debrisData[i].origin);
            }
        }

        // 8. FLASH BANG
        if (cycle >= 8.3 && cycle < 8.6) {
            const flashInt = Math.sin((cycle - 8.3) / 0.3 * Math.PI);
            tipFlash.material.opacity = flashInt;
            tipFlash.scale.setScalar(1.0 + flashInt * 8.0);
        } else {
            tipFlash.material.opacity = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
