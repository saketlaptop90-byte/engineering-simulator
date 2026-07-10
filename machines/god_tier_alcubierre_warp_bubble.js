import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = []; // Functions to call in animate()
    
    const description = "The God-Tier Alcubierre Warp Bubble Generator represents the pinnacle of human engineering. It utilizes exotic negative energy densities distributed across immense Torus arrays to contract spacetime in front of the vessel and expand it behind, allowing for superluminal transit without local time dilation. The vessel features full interior operator cabins, relativistic Cherenkov shielding, hydraulic off-road planetary landing gear, and high-pressure exotic matter coolant lines.";

    // -----------------------------------------------------------
    // SHADERS & CUSTOM MATERIALS
    // -----------------------------------------------------------
    const warpFieldVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float warpIntensity;
        
        void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 pos = position;
            float zDistortion = 0.0;
            
            // Bunching space in front (z < 0), stretching in back (z > 0)
            if (pos.z < 0.0) {
                // Extreme contraction ahead
                zDistortion = sin(pos.z * 5.0 - time * 20.0) * 0.15 * warpIntensity;
            } else {
                // Expansion behind
                zDistortion = sin(pos.z * 2.0 - time * 5.0) * 0.4 * warpIntensity;
            }
            pos.z += zDistortion;
            
            // Lateral spacetime shear
            pos.x += sin(pos.y * 12.0 + time * 8.0) * 0.08 * warpIntensity;
            pos.y += cos(pos.x * 12.0 + time * 8.0) * 0.08 * warpIntensity;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const warpFieldFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float warpIntensity;
        
        void main() {
            vec2 p = vUv * 2.0 - 1.0;
            float r = length(p);
            
            vec3 color = vec3(0.0);
            
            // Relativistic blueshift at front, redshift at back
            if (vPosition.z < 0.0) {
                // Intense Cherenkov blue/violet at leading edge
                float intensity = (1.0 - r) * warpIntensity * 2.5;
                color = vec3(0.2, 0.5, 1.0) * intensity;
                color += vec3(0.8, 0.9, 1.0) * pow(intensity, 3.0); // Hot core
            } else {
                // Deep redshift at trailing edge
                float intensity = (1.0 - r) * warpIntensity * 2.0;
                color = vec3(1.0, 0.2, 0.0) * intensity;
                color += vec3(1.0, 0.8, 0.0) * pow(intensity, 3.0);
            }
            
            // Quantum foam fluctuations
            float foam = sin(vPosition.x * 30.0 + time * 10.0) * cos(vPosition.y * 30.0 - time * 15.0);
            color += vec3(foam * 0.1 * warpIntensity);
            
            // Overall bubble opacity fades at edges
            float alpha = warpIntensity * (1.0 - r * r) * 0.6;
            
            gl_FragColor = vec4(color, alpha);
        }
    `;

    const warpFieldMaterial = new THREE.ShaderMaterial({
        vertexShader: warpFieldVertexShader,
        fragmentShader: warpFieldFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            warpIntensity: { value: 0.0 }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const exoticMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x5500ff,
        emissiveIntensity: 2.0,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
    });

    const activeEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const screenMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ff88, 
        emissive: 0x00ff88, 
        emissiveIntensity: 1.5 
    });

    // -----------------------------------------------------------
    // SPACETIME BUBBLE GENERATION
    // -----------------------------------------------------------
    const bubbleGeo = new THREE.SphereGeometry(60, 64, 64);
    const bubbleMesh = new THREE.Mesh(bubbleGeo, warpFieldMaterial);
    group.add(bubbleMesh);
    
    parts.push({
        name: 'Spacetime_Distortion_Bubble',
        description: 'The macroscopic Alcubierre metric manipulation field. Contracts space ahead, expands behind.',
        material: warpFieldMaterial,
        function: 'FTL Translation',
        assemblyOrder: 100,
        connections: ['Anterior_Warp_Ring', 'Posterior_Warp_Ring'],
        failureEffect: 'Instantaneous spaghettification of all internal matter.',
        cascadeFailures: ['Entire_Vessel'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // -----------------------------------------------------------
    // CENTRAL HULL (LATHE GEOMETRY)
    // -----------------------------------------------------------
    const hullPoints = [];
    // Hyper-detailed aerodynamic profile for relativistic travel
    // Nose Cone
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        hullPoints.push(new THREE.Vector2(0.1 + Math.sin(t * Math.PI / 2) * 3, -40 + t * 10)); // Forward is -Z, so Y in lathe maps to Z
    }
    // Forward Command Section
    for (let i = 1; i <= 15; i++) {
        const t = i / 15;
        hullPoints.push(new THREE.Vector2(3.1 + Math.sin(t * Math.PI) * 1.5, -30 + t * 15));
    }
    // Mid Habitation and Reactor Core
    for (let i = 1; i <= 25; i++) {
        const t = i / 25;
        hullPoints.push(new THREE.Vector2(4.6 + Math.sin(t * Math.PI * 2) * 0.5, -15 + t * 25));
    }
    // Rear Engineering & Expansion Baffles
    for (let i = 1; i <= 20; i++) {
        const t = i / 20;
        hullPoints.push(new THREE.Vector2(4.6 - t * 2, 10 + t * 20));
    }
    // Exhaust Bell
    for (let i = 1; i <= 10; i++) {
        const t = i / 10;
        hullPoints.push(new THREE.Vector2(2.6 + t * 4, 30 + t * 5));
    }

    const hullGeo = new THREE.LatheGeometry(hullPoints, 64);
    const hullMesh = new THREE.Mesh(hullGeo, steel);
    hullMesh.rotation.x = Math.PI / 2; // Align Lathe Y axis to Ship Z axis
    group.add(hullMesh);

    parts.push({
        name: 'Primary_Relativistic_Hull',
        description: 'Titanium-carbon nanotube composite hull designed to withstand extreme Hawking radiation and micrometeorite impacts at high fractional c velocities.',
        material: steel,
        function: 'Structural Integrity & Crew Protection',
        assemblyOrder: 1,
        connections: ['Central_Command_Bridge', 'Main_Reactor_Core'],
        failureEffect: 'Hull breach, explosive decompression, radiation poisoning.',
        cascadeFailures: ['Life_Support_Tanks'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });

    // Simulated Rivets / Panel lines via tiny spheres
    const rivetsGroup = new THREE.Group();
    for (let i = 0; i < 200; i++) {
        const z = (Math.random() - 0.5) * 70;
        const radiusAtZ = 4.5; // Approximate
        const angle = Math.random() * Math.PI * 2;
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 4), darkSteel);
        rivet.position.set(Math.cos(angle) * radiusAtZ, Math.sin(angle) * radiusAtZ, z);
        rivetsGroup.add(rivet);
    }
    group.add(rivetsGroup);
    parts.push({
        name: 'Hull_Panel_Rivets',
        description: 'Explosive micro-bolts for rapid panel ejection during critical overloads.',
        material: darkSteel,
        function: 'Panel Fastening',
        assemblyOrder: 2,
        connections: ['Primary_Relativistic_Hull'],
        failureEffect: 'Loss of exterior armor plating.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 20, z: 0 }
    });

    // -----------------------------------------------------------
    // CABIN & INTERIOR (EXTRUDE, DETAILS)
    // -----------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 4.2, -18); // Jutting out of the forward hull

    // Bridge Structure
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-3, 0);
    cabinShape.lineTo(3, 0);
    cabinShape.lineTo(2.5, 2);
    cabinShape.lineTo(-2.5, 2);
    cabinShape.lineTo(-3, 0);
    const cabinExtrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrudeSettings);
    const cabinMesh = new THREE.Mesh(cabinGeo, aluminum);
    cabinMesh.position.set(0, -1, -2); // center extrusion
    cabinGroup.add(cabinMesh);

    // Tinted Viewport Glass
    const glassGeo = new THREE.PlaneGeometry(4.8, 1.8);
    const cabinGlass = new THREE.Mesh(glassGeo, tinted);
    cabinGlass.position.set(0, 0.2, -2.1);
    cabinGlass.rotation.x = -Math.PI / 12;
    cabinGroup.add(cabinGlass);

    // Interior Controls (Visible through glass)
    const controlConsoleShape = new THREE.Shape();
    controlConsoleShape.moveTo(0, 0);
    controlConsoleShape.lineTo(3, 0);
    controlConsoleShape.lineTo(3, 1);
    controlConsoleShape.lineTo(0, 1.5);
    controlConsoleShape.lineTo(0, 0);
    const consoleGeo = new THREE.ExtrudeGeometry(controlConsoleShape, { depth: 0.5, bevelEnabled: false });
    const controlConsole = new THREE.Mesh(consoleGeo, darkSteel);
    controlConsole.position.set(-1.5, -0.8, -1.5);
    controlConsole.rotation.x = -Math.PI / 6;
    cabinGroup.add(controlConsole);

    // Screens
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), screenMat);
        screen.position.set(-0.8 + i*0.8, -0.2, -1.45);
        screen.rotation.x = -Math.PI / 6;
        cabinGroup.add(screen);
        updatables.push({
            update: (time, speed) => {
                screenMat.emissiveIntensity = 1.0 + Math.sin(time * 10 + i) * 0.5;
            }
        });
    }

    // Steering Wheel & Joysticks
    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 32), plastic);
    steeringWheel.position.set(0, -0.2, -1.2);
    steeringWheel.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringWheel);

    const joyBaseGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    const joyStickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const joyHandleGeo = new THREE.SphereGeometry(0.08);
    
    // Left Joystick
    const joyLeft = new THREE.Group();
    joyLeft.add(new THREE.Mesh(joyBaseGeo, darkSteel));
    const stickL = new THREE.Mesh(joyStickGeo, steel);
    stickL.position.y = 0.2;
    joyLeft.add(stickL);
    const handleL = new THREE.Mesh(joyHandleGeo, plastic);
    handleL.position.y = 0.4;
    joyLeft.add(handleL);
    joyLeft.position.set(-1.2, -0.4, -1.0);
    joyLeft.rotation.x = -Math.PI/6;
    cabinGroup.add(joyLeft);
    
    // Right Joystick
    const joyRight = joyLeft.clone();
    joyRight.position.set(1.2, -0.4, -1.0);
    cabinGroup.add(joyRight);

    updatables.push({
        update: (time, speed) => {
            steeringWheel.rotation.z = Math.sin(time * 2) * 0.2 * speed;
            joyLeft.rotation.z = Math.cos(time * 5) * 0.1 * speed;
            joyRight.rotation.x = -Math.PI/6 + Math.sin(time * 4) * 0.1 * speed;
        }
    });

    group.add(cabinGroup);

    parts.push({
        name: 'Operator_Command_Cabin',
        description: 'Advanced flight deck shielded with tinted transparent aluminum. Features manual override steering yokes and quantum metric screens.',
        material: aluminum,
        function: 'Vessel Command & Control',
        assemblyOrder: 3,
        connections: ['Primary_Relativistic_Hull'],
        failureEffect: 'Loss of manual flight control during causally disconnected warp.',
        cascadeFailures: ['Spacetime_Distortion_Bubble'],
        originalPosition: { x: 0, y: 4.2, z: -18 },
        explodedPosition: { x: 0, y: 15, z: -25 }
    });

    // -----------------------------------------------------------
    // ROTATING HABITATION RING
    // -----------------------------------------------------------
    const habGroup = new THREE.Group();
    habGroup.position.z = 0; // Center of mass
    
    const habGeo = new THREE.TorusGeometry(12, 1.8, 32, 64);
    const habRing = new THREE.Mesh(habGeo, aluminum);
    habGroup.add(habRing);
    
    // Habitation Windows
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const windowGeo = new THREE.BoxGeometry(1.2, 0.8, 4.0); // Thick box to intersect torus
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(Math.cos(angle) * 12, Math.sin(angle) * 12, 0);
        windowMesh.lookAt(0, 0, 0);
        habGroup.add(windowMesh);
    }

    // Struts connecting Hab Ring to Hull
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, 0);
        strut.rotation.z = angle;
        strut.rotation.x = Math.PI / 2;
        habGroup.add(strut);
    }

    group.add(habGroup);
    updatables.push({
        update: (time, speed) => {
            // Constant rotation for artificial gravity, independent of warp speed
            habGroup.rotation.z = time * 0.5;
        }
    });

    parts.push({
        name: 'Centrifugal_Habitation_Ring',
        description: 'Provides 1g of artificial gravity via rotation for the crew during sublight coasting phases.',
        material: aluminum,
        function: 'Crew Quarters & Life Support',
        assemblyOrder: 4,
        connections: ['Primary_Relativistic_Hull'],
        failureEffect: 'Loss of artificial gravity; severe bone density degradation for crew.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 }
    });

    // -----------------------------------------------------------
    // WARP RINGS (ANTERIOR & POSTERIOR)
    // -----------------------------------------------------------
    function buildWarpRing(zOffset, isAnterior) {
        const ringGroup = new THREE.Group();
        ringGroup.position.z = zOffset;
        
        const radius = isAnterior ? 28 : 35; // Rear ring is larger
        const thickness = isAnterior ? 3 : 4;

        // Main Housing
        const housingGeo = new THREE.TorusGeometry(radius, thickness, 64, 128);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        ringGroup.add(housing);

        // Inner Exotic Matter Channel
        const channelGeo = new THREE.TorusGeometry(radius, thickness * 0.6, 32, 128);
        const channel = new THREE.Mesh(channelGeo, exoticMatterMaterial);
        ringGroup.add(channel);

        // Magnetic Confinement Coils
        const coilCount = isAnterior ? 32 : 48;
        for (let i = 0; i < coilCount; i++) {
            const angle = (i / coilCount) * Math.PI * 2;
            const coilGeo = new THREE.TorusGeometry(thickness * 1.3, 0.4, 16, 32);
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            coil.rotation.x = Math.PI / 2;
            coil.rotation.y = angle;
            ringGroup.add(coil);
            
            // Push each coil as a distinct part for insane detail
            parts.push({
                name: `${isAnterior ? 'Anterior' : 'Posterior'}_Magnetic_Coil_${i}`,
                description: `Superconducting YBCO confinement coil ${i}. Stabilizes the negative energy density gradient.`,
                material: copper,
                function: 'Metric Tensor Stabilization',
                assemblyOrder: 10 + i,
                connections: [`${isAnterior ? 'Anterior' : 'Posterior'}_Warp_Ring_Housing`],
                failureEffect: 'Localized breakdown of the Casimir vacuum, causing explosive positive energy annihilation.',
                cascadeFailures: [],
                originalPosition: { x: coil.position.x, y: coil.position.y, z: zOffset },
                explodedPosition: { x: coil.position.x * 1.5, y: coil.position.y * 1.5, z: zOffset + (isAnterior ? -20 : 20) }
            });
        }

        // Plasma Vents / Exhaust Stacks on Rings
        const ventCount = 16;
        for(let i=0; i<ventCount; i++) {
            const angle = (i / ventCount) * Math.PI * 2 + (Math.PI/16);
            const ventGeo = new THREE.CylinderGeometry(0.8, 1.2, 5, 16);
            const vent = new THREE.Mesh(ventGeo, steel);
            vent.position.set(Math.cos(angle) * (radius + 2), Math.sin(angle) * (radius + 2), isAnterior ? -1.5 : 1.5);
            vent.rotation.x = Math.PI/2;
            vent.rotation.z = angle + Math.PI/2;
            ringGroup.add(vent);

            const plasmaGlow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), plasmaMaterial);
            plasmaGlow.position.set(0, 2.5, 0); // Top of the cylinder
            vent.add(plasmaGlow);

            updatables.push({
                update: (time, speed) => {
                    plasmaGlow.scale.setScalar(1.0 + Math.random() * 0.5 * speed);
                }
            });
        }

        return { group: ringGroup, channel: channel };
    }

    const anteriorRingData = buildWarpRing(-25, true);
    group.add(anteriorRingData.group);
    parts.push({
        name: 'Anterior_Warp_Ring_Housing',
        description: 'Forward toroid structure responsible for extreme spatial contraction. Requires immense negative energy density to violate the Null Energy Condition.',
        material: darkSteel,
        function: 'Space Contraction',
        assemblyOrder: 5,
        connections: ['Primary_Relativistic_Hull'],
        failureEffect: 'Loss of forward velocity, vessel drops to sublight speeds instantly.',
        cascadeFailures: ['Spacetime_Distortion_Bubble'],
        originalPosition: { x: 0, y: 0, z: -25 },
        explodedPosition: { x: 0, y: 0, z: -60 }
    });

    const posteriorRingData = buildWarpRing(25, false);
    group.add(posteriorRingData.group);
    parts.push({
        name: 'Posterior_Warp_Ring_Housing',
        description: 'Aft toroid structure responsible for expanding spacetime behind the vessel. Pushes the bubble forward along the York time gradient.',
        material: darkSteel,
        function: 'Space Expansion',
        assemblyOrder: 6,
        connections: ['Primary_Relativistic_Hull'],
        failureEffect: 'Vessel is crushed by uncompensated forward spatial contraction.',
        cascadeFailures: ['Spacetime_Distortion_Bubble'],
        originalPosition: { x: 0, y: 0, z: 25 },
        explodedPosition: { x: 0, y: 0, z: 60 }
    });

    updatables.push({
        update: (time, speed) => {
            anteriorRingData.group.rotation.z = time * 1.5 * speed;
            posteriorRingData.group.rotation.z = -time * 2.0 * speed;
            
            anteriorRingData.channel.material.emissiveIntensity = 2.0 + Math.sin(time * 10) * speed * 3.0;
            posteriorRingData.channel.material.emissiveIntensity = 2.0 + Math.cos(time * 12) * speed * 3.0;
        }
    });

    // -----------------------------------------------------------
    // HYDRAULIC & EXOTIC MATTER LINES (TUBE GEOMETRY)
    // -----------------------------------------------------------
    const flowNodes = [];
    
    function createCoolantLines(zStart, zEnd, radius, count, isAnterior) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const startPt = new THREE.Vector3(Math.cos(angle) * 4, Math.sin(angle) * 4, zStart);
            const midPt = new THREE.Vector3(Math.cos(angle) * (radius * 0.5), Math.sin(angle) * (radius * 0.5), (zStart + zEnd) * 0.5);
            const endPt = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, zEnd);
            
            // Add some organic curvature/slack
            midPt.x += Math.sin(angle * 3) * 2;
            midPt.y += Math.cos(angle * 3) * 2;

            const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
            const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.4, 8, false);
            const tube = new THREE.Mesh(tubeGeo, copper);
            group.add(tube);
            
            parts.push({
                name: `${isAnterior ? 'Forward' : 'Aft'}_Exotic_Matter_Line_${i}`,
                description: 'High-pressure hydraulic/magnetic conduits piping superfluid negative mass to the warp rings.',
                material: copper,
                function: 'Fuel Delivery',
                assemblyOrder: 60 + i,
                connections: ['Main_Reactor_Core'],
                failureEffect: 'Fuel starvation leading to asymmetrical warp field collapse.',
                cascadeFailures: [`${isAnterior ? 'Anterior' : 'Posterior'}_Magnetic_Coil_${i}`],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: Math.cos(angle) * 15, y: Math.sin(angle) * 15, z: (zStart + zEnd) * 0.5 }
            });

            // Energy nodes flowing through tubes
            for (let j = 0; j < 3; j++) {
                const node = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), activeEnergyMaterial);
                group.add(node);
                flowNodes.push({
                    mesh: node,
                    curve: curve,
                    offset: j / 3,
                    speed: 0.2 + Math.random() * 0.2,
                    direction: isAnterior ? 1 : -1 // Flow outwards from center
                });
            }
        }
    }

    createCoolantLines(-10, -25, 28, 16, true);
    createCoolantLines(10, 25, 35, 16, false);

    updatables.push({
        update: (time, speed) => {
            flowNodes.forEach(node => {
                let delta = node.speed * speed * 0.05 * node.direction;
                node.offset += delta;
                if (node.offset > 1.0) node.offset -= 1.0;
                if (node.offset < 0.0) node.offset += 1.0;
                
                const pt = node.curve.getPoint(node.offset);
                node.mesh.position.copy(pt);
                // Pulse size
                node.mesh.scale.setScalar(0.8 + Math.sin(time * 15 + node.offset * 10) * 0.4);
            });
        }
    });

    // -----------------------------------------------------------
    // PLANETARY LANDING GEAR (HYPER-REALISM RULE)
    // -----------------------------------------------------------
    const gearPistons = [];
    
    function createLandingGear(x, y, z, rotationY) {
        const gearGroup = new THREE.Group();
        gearGroup.position.set(x, y, z);
        gearGroup.rotation.y = rotationY;
        
        // Hydraulic Main Strut (Cylinder within Cylinder)
        const outerStrutGeo = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
        const outerStrut = new THREE.Mesh(outerStrutGeo, steel);
        outerStrut.position.y = 4;
        gearGroup.add(outerStrut);
        
        const innerStrutGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 32);
        const innerStrut = new THREE.Mesh(innerStrutGeo, chrome);
        innerStrut.position.y = 0; // Will slide up and down
        gearGroup.add(innerStrut);
        
        gearPistons.push({ inner: innerStrut, phase: Math.random() * Math.PI * 2 });

        // Heavy Duty Tire & Rim
        const wheelGroup = new THREE.Group();
        wheelGroup.position.y = -4; // Base of inner strut
        innerStrut.add(wheelGroup); // Attach to moving strut
        
        const tireGeo = new THREE.TorusGeometry(3.5, 1.8, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.x = Math.PI / 2;
        tire.rotation.y = Math.PI / 2; 
        wheelGroup.add(tire);
        
        // Aggressive Off-Road Lugs (Extruded Boxes)
        const lugCount = 80;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(4.0, 0.8, 1.0);
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 4.6, Math.sin(angle) * 4.6, 0);
            lug.rotation.z = angle;
            tire.add(lug);
        }
        
        // Complex Spoked Rim
        const rimGeo = new THREE.CylinderGeometry(2.8, 2.8, 2.0, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tire.add(rim);
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.6, 16);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.position.set(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            rim.add(spoke);
        }

        updatables.push({
            update: (time, speed) => {
                // When moving fast (speed > 0.1), retract gears? Or just spin tires for visual flair.
                // Let's spin tires based on a secondary slow time to simulate rolling on ground before takeoff.
                if (speed < 0.2) {
                    tire.rotation.z += 0.05;
                }
            }
        });

        group.add(gearGroup);
        
        parts.push({
            name: `Planetary_Landing_Gear_Array_${Math.random().toString(36).substr(2, 5)}`,
            description: 'Massive hydraulic landing strut equipped with aggressive Torus-based off-road tires and complex spoke rims for landing on unimproved alien terrains.',
            material: rubber,
            function: 'Planetary Touchdown & Shock Absorption',
            assemblyOrder: 150,
            connections: ['Primary_Relativistic_Hull'],
            failureEffect: 'Vessel collapses structurally under planetary gravity.',
            cascadeFailures: ['Primary_Relativistic_Hull'],
            originalPosition: { x: x, y: y, z: z },
            explodedPosition: { x: x * 2, y: y - 20, z: z }
        });
    }

    // Add 4 landing gears
    createLandingGear(8, -12, -15, 0);
    createLandingGear(-8, -12, -15, 0);
    createLandingGear(10, -12, 15, 0);
    createLandingGear(-10, -12, 15, 0);

    updatables.push({
        update: (time, speed) => {
            // Hydraulic piston active suspension pumping
            gearPistons.forEach(p => {
                // Suspensions bounce when idle, stiffen when at warp
                const bounce = speed < 0.1 ? Math.sin(time * 3 + p.phase) * 1.5 : 0;
                p.inner.position.y = bounce;
            });
        }
    });

    // -----------------------------------------------------------
    // ADDITIONAL GREEBLES & SENSORS
    // -----------------------------------------------------------
    function createTachyonSensor(x, y, z, rotationX, rotationZ) {
        const sensorGroup = new THREE.Group();
        sensorGroup.position.set(x, y, z);
        sensorGroup.rotation.x = rotationX;
        sensorGroup.rotation.z = rotationZ;
        
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2, 16), darkSteel);
        sensorGroup.add(base);
        
        const dish = new THREE.Mesh(new THREE.SphereGeometry(2.0, 16, 16, 0, Math.PI, 0, Math.PI), chrome);
        dish.position.y = 1.0;
        sensorGroup.add(dish);
        
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), copper);
        antenna.position.y = 3.0;
        sensorGroup.add(antenna);
        
        group.add(sensorGroup);

        updatables.push({
            update: (time, speed) => {
                dish.rotation.y = time * 2.0;
                dish.rotation.z = Math.sin(time * 5) * 0.2;
            }
        });

        parts.push({
            name: `Tachyon_Telemetry_Dish_${Math.random().toString(36).substr(2, 5)}`,
            description: 'Causality-violating tachyon transceiver for communicating across the isolated warp bubble horizon.',
            material: chrome,
            function: 'Superluminal Communication',
            assemblyOrder: 80,
            connections: ['Primary_Relativistic_Hull'],
            failureEffect: 'Total communications blackout; unable to detect objects ahead of the flight path.',
            cascadeFailures: [],
            originalPosition: { x: x, y: y, z: z },
            explodedPosition: { x: x * 1.5, y: y * 1.5, z: z }
        });
    }

    createTachyonSensor(0, 5, -35, Math.PI/2, 0); // Nose sensor
    createTachyonSensor(0, -5, -35, -Math.PI/2, 0);
    createTachyonSensor(5, 0, 10, 0, -Math.PI/2); // Side sensors
    createTachyonSensor(-5, 0, 10, 0, Math.PI/2);

    // -----------------------------------------------------------
    // QUIZ QUESTIONS
    // -----------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the Alcubierre metric, the parameter $v_s(t)$ represents the velocity of the Eulerian observers moving along the trajectory of the warp drive. What fundamental violation of energy conditions is required to sustain the warp bubble's geometry?",
            options: [
                "Violation of the Strong Energy Condition only.",
                "Violation of the Null Energy Condition, requiring negative energy density.",
                "Violation of the Dominant Energy Condition due to superluminal heat flux.",
                "No energy condition is violated if cosmic strings are used."
            ],
            answer: 1,
            explanation: "The Alcubierre metric inherently violates the Null Energy Condition (NEC), meaning it requires regions of negative energy density (exotic matter) to contract and expand spacetime."
        },
        {
            question: "The York time ($\\theta$) is a measure of the expansion of the spatial volume elements in a given spacetime. For an Alcubierre warp bubble traveling in the positive z-direction, how does the York time behave at the front and rear walls of the bubble?",
            options: [
                "$\\theta < 0$ (contraction) at the front, $\\theta > 0$ (expansion) at the rear.",
                "$\\theta > 0$ (expansion) at the front, $\\theta < 0$ (contraction) at the rear.",
                "$\\theta = 0$ everywhere except at the exact center of the ship.",
                "$\\theta$ diverges to infinity at the bubble boundaries."
            ],
            answer: 0,
            explanation: "Spacetime contracts in front of the ship (negative York time) and expands behind it (positive York time), effectively pushing the ship forward."
        },
        {
            question: "The Pfenning-Ford quantum inequality limits the magnitude and duration of negative energy density. How does this inequality theoretically restrict a macroscopic Alcubierre warp drive?",
            options: [
                "It limits the maximum speed to $c/2$.",
                "It requires the warp bubble wall thickness to be on the order of the Planck length, implying an absurdly massive energy requirement.",
                "It prevents the use of Casimir vacuum energy.",
                "It states that macroscopic quantum fields collapse into black holes."
            ],
            answer: 1,
            explanation: "Quantum inequalities dictate that strong negative energy can only exist for very short times and spaces, forcing the warp wall to be ultra-thin (Planck scale), which drives the total energy requirement up to unfeasible levels (e.g., greater than the mass of the visible universe) for a macroscopic ship."
        },
        {
            question: "A ship inside an Alcubierre warp bubble moves superluminally relative to external observers, but what is its proper acceleration and local velocity relative to the bubble itself?",
            options: [
                "Proper acceleration is infinite; local velocity is $c$.",
                "Proper acceleration is zero (freefall); local velocity is zero.",
                "Proper acceleration equals $g$; local velocity is proportional to external speed.",
                "Proper acceleration is negative due to exotic matter."
            ],
            answer: 1,
            explanation: "The ship rests in a locally flat region of spacetime within the bubble. Thus, it experiences zero proper acceleration (freefall) and its local velocity relative to the bubble is zero."
        },
        {
            question: "The 'horizon problem' for a superluminal Alcubierre drive suggests that the crew cannot control the warp bubble. Why does this occur?",
            options: [
                "The leading edge of the warp bubble is causally disconnected from the center of the bubble, meaning no signal from the ship can reach the front to steer or turn it off.",
                "The immense blueshift of incoming Hawking radiation blinds the sensors.",
                "Time dilation approaches infinity, stopping all on-board computation.",
                "The exotic matter decays before a signal can be sent."
            ],
            answer: 0,
            explanation: "Because the ship is moving faster than light relative to the outside universe, signals (which are limited to $c$) sent from the center of the bubble cannot reach the leading edge to alter the metric, making steering or stopping impossible from within."
        }
    ];

    // -----------------------------------------------------------
    // ANIMATION LOOP
    // -----------------------------------------------------------
    const animate = function(time, speed, meshes) {
        // Update warp field shaders
        warpFieldMaterial.uniforms.time.value = time;
        // Exponentially increase visual distortion at high speeds
        warpFieldMaterial.uniforms.warpIntensity.value = speed + Math.pow(speed, 3.0) * 2.0;
        
        // Relativistic vessel vibration at high warp
        if (speed > 0.5) {
            group.position.x = (Math.random() - 0.5) * 0.2 * speed;
            group.position.y = (Math.random() - 0.5) * 0.2 * speed;
        } else {
            group.position.x = 0;
            group.position.y = 0;
        }

        // Run all registered updatables
        updatables.forEach(u => u.update(time, speed));
    };

    return { group, parts, description, quizQuestions, animate };
}
