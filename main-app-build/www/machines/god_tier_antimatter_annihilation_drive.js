import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ============================================================================
// CUSTOM SHADERS FOR GOD-TIER VISUAL EFFECTS
// ============================================================================

const plasmaVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Complex organic turbulence for the plasma
    vec3 pos = position;
    float noise = sin(pos.y * 10.0 + time * 5.0) * 0.1;
    noise += cos(pos.x * 15.0 - time * 3.0) * 0.05;
    noise += sin(pos.z * 8.0 + time * 7.0) * 0.05;
    pos += normal * noise;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const plasmaFragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform vec3 colorPrimary;
uniform vec3 colorSecondary;

void main() {
    // Pulsing core effect
    float intensity = abs(sin(vPosition.y * 5.0 - time * 10.0)) * 0.5 + 0.5;
    
    // Rim lighting for plasma edge
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float rim = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    rim = smoothstep(0.6, 1.0, rim);
    
    // Mix colors based on height and time
    vec3 finalColor = mix(colorPrimary, colorSecondary, vUv.y + sin(time * 2.0) * 0.2);
    finalColor += vec3(rim * 2.0); // Super bright edges
    
    // Alpha fades at the edges
    float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y) * (0.5 + intensity * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

const containmentVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const containmentFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform float time;
uniform vec3 fieldColor;

void main() {
    // Hexagonal or grid-like pulsing pattern
    float grid1 = abs(sin(vUv.x * 100.0)) * abs(sin(vUv.y * 100.0));
    float grid2 = abs(cos(vUv.x * 50.0 + time * 2.0)) * abs(cos(vUv.y * 50.0 - time * 2.0));
    float pattern = max(grid1, grid2);
    
    // Fresnel effect for the spherical shield
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(normal, viewDir);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    float intensity = pattern * 0.2 + fresnel * 0.8;
    float pulse = (sin(time * 8.0) * 0.2 + 0.8);
    
    vec3 finalColor = fieldColor * intensity * pulse;
    float alpha = fresnel * 0.6 + pattern * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

// ============================================================================
// MAIN MACHINE GENERATOR
// ============================================================================

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshesToAnimate = [];

    // Helper for emissive materials
    const createNeon = (color, intensity = 2.0) => {
        return new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity,
            transparent: true,
            opacity: 0.9,
            metalness: 0.1,
            roughness: 0.2
        });
    };

    const neonBlue = createNeon(0x00ffff, 3.0);
    const neonPurple = createNeon(0xaa00ff, 3.0);
    const neonRed = createNeon(0xff0044, 2.0);
    const neonOrange = createNeon(0xff5500, 2.5);
    const neonGreen = createNeon(0x00ff44, 2.0);

    // Dynamic Shader Materials
    const plasmaMaterial = new THREE.ShaderMaterial({
        vertexShader: plasmaVertexShader,
        fragmentShader: plasmaFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            colorPrimary: { value: new THREE.Color(0xaa00ff) },
            colorSecondary: { value: new THREE.Color(0x00ffff) }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    meshesToAnimate.push({ mesh: plasmaMaterial, type: 'shader' });

    const containmentMaterial = new THREE.ShaderMaterial({
        vertexShader: containmentVertexShader,
        fragmentShader: containmentFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            fieldColor: { value: new THREE.Color(0x00aaff) }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide
    });
    meshesToAnimate.push({ mesh: containmentMaterial, type: 'shader' });

    const antiContainmentMaterial = new THREE.ShaderMaterial({
        vertexShader: containmentVertexShader,
        fragmentShader: containmentFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            fieldColor: { value: new THREE.Color(0xff0055) }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide
    });
    meshesToAnimate.push({ mesh: antiContainmentMaterial, type: 'shader' });

    // ========================================================================
    // PART 1: CENTRAL ANNIHILATION CHAMBER CORE
    // ========================================================================
    const chamberGroup = new THREE.Group();
    
    // Core Sphere
    const coreGeo = new THREE.SphereGeometry(12, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    chamberGroup.add(coreMesh);

    // Intricate Geared Equatorial Ring (Magnetic Pinch Generator)
    const gearShape = new THREE.Shape();
    const teeth = 128;
    const innerRad = 12.5;
    const outerRad = 15;
    for (let i = 0; i < teeth * 2; i++) {
        const r = i % 2 === 0 ? outerRad : innerRad;
        const angle = (i / (teeth * 2)) * Math.PI * 2;
        if (i === 0) gearShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else gearShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    const gearExtrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const gearGeo = new THREE.ExtrudeGeometry(gearShape, gearExtrudeSettings);
    gearGeo.center();
    const equatorialRing = new THREE.Mesh(gearGeo, darkSteel);
    equatorialRing.rotation.x = Math.PI / 2;
    chamberGroup.add(equatorialRing);
    meshesToAnimate.push({ mesh: equatorialRing, type: 'rotateY', speed: 0.5 });

    // Inner Glowing Plasma Core (visible through equatorial gaps)
    const innerPlasmaGeo = new THREE.SphereGeometry(11.8, 32, 32);
    const innerPlasmaMesh = new THREE.Mesh(innerPlasmaGeo, plasmaMaterial);
    chamberGroup.add(innerPlasmaMesh);

    group.add(chamberGroup);
    parts.push({
        name: 'Central Annihilation Core',
        description: 'A hyper-dense chromium-steel containment sphere where matter and antimatter are precisely injected and annihilated. The equatorial ring houses the primary magnetic pinch generators rotating at extreme velocities.',
        material: 'Chrome, Dark Steel, Plasma',
        function: 'Catalyzes the matter-antimatter annihilation event, converting mass entirely into gamma-ray energy and high-velocity pions.',
        assemblyOrder: 1,
        connections: ['Magnetic Pinch Coils', 'Matter Feed Injector', 'Antimatter Feed Injector', 'Gamma Baffle Shielding'],
        failureEffect: 'Immediate uncontrolled annihilation resulting in a catastrophic multi-teraton explosion, atomizing the vessel.',
        cascadeFailures: ['Gamma Baffle Shielding', 'Coolant Manifold', 'Magnetic Nozzle'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ========================================================================
    // PART 2: MAGNETIC PINCH COILS (TOROIDAL ARRAY)
    // ========================================================================
    const coilGroup = new THREE.Group();
    const numCoils = 16;
    for (let i = 0; i < numCoils; i++) {
        const theta = (i / numCoils) * Math.PI * 2;
        const coilGeo = new THREE.TorusGeometry(18, 1.5, 32, 100);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        
        // Position them spherically around the core
        coilMesh.position.x = Math.cos(theta) * 2;
        coilMesh.position.z = Math.sin(theta) * 2;
        coilMesh.rotation.y = -theta;
        
        // Add glowing super-conductor track
        const trackGeo = new THREE.TorusGeometry(18.2, 0.4, 16, 100);
        const trackMesh = new THREE.Mesh(trackGeo, neonBlue);
        coilMesh.add(trackMesh);
        
        coilGroup.add(coilMesh);
    }
    group.add(coilGroup);
    meshesToAnimate.push({ mesh: coilGroup, type: 'pulseScale', speed: 2.0, baseScale: 1.0, variance: 0.02 });

    parts.push({
        name: 'Toroidal Magnetic Pinch Coils',
        description: 'An array of 16 massive, cryogenically cooled copper-niobium superconducting electromagnets. They generate a multi-tesla magnetic bottle to keep the annihilation plasma from touching the physical chamber walls.',
        material: 'Copper, Superconductor Neon',
        function: 'Maintains the structural integrity of the plasma core via electromagnetic suspension.',
        assemblyOrder: 2,
        connections: ['Central Annihilation Core', 'Power Regulation Matrix'],
        failureEffect: 'Plasma touches the containment walls, instantly vaporizing the core and triggering a breach.',
        cascadeFailures: ['Central Annihilation Core', 'Diagnostic Sensor Array'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 0, z: 0 }
    });

    // ========================================================================
    // PART 3: ANTIMATTER PENNING TRAP ASSEMBLY (BOTTOM)
    // ========================================================================
    const antimatterGroup = new THREE.Group();
    antimatterGroup.position.y = -35;

    // Complex Lathe Geometry for the trap housing
    const amPoints = [];
    for(let i=0; i<=20; i++) {
        const t = i / 20;
        const r = 8 + Math.sin(t * Math.PI) * 4 + (i%2===0? 1 : 0); // ribbed texture
        amPoints.push(new THREE.Vector2(r, t * -25));
    }
    const amGeo = new THREE.LatheGeometry(amPoints, 64);
    const amMesh = new THREE.Mesh(amGeo, darkSteel);
    antimatterGroup.add(amMesh);

    // Containment Field Visualizer
    const amFieldGeo = new THREE.CylinderGeometry(7, 10, 24, 32);
    const amFieldMesh = new THREE.Mesh(amFieldGeo, antiContainmentMaterial);
    amFieldMesh.position.y = -12.5;
    antimatterGroup.add(amFieldMesh);

    // Magnetic Trap Rings
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(12, 1, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        ringMesh.position.y = -4 - (i * 4);
        ringMesh.rotation.x = Math.PI / 2;
        
        // Emissive inlays
        const inlayGeo = new THREE.TorusGeometry(12.2, 0.3, 8, 64);
        const inlayMesh = new THREE.Mesh(inlayGeo, neonRed);
        ringMesh.add(inlayMesh);
        
        antimatterGroup.add(ringMesh);
        meshesToAnimate.push({ mesh: ringMesh, type: 'rotateZ', speed: (i%2===0? 1 : -1) * 2.0 });
    }

    group.add(antimatterGroup);
    parts.push({
        name: 'Antimatter Penning Trap Assembly',
        description: 'A heavily shielded, multi-stage Penning trap that suspends antihydrogen using precisely tuned axial magnetic and quadrupole electric fields. Ribbed dark-steel housing prevents stray radiation.',
        material: 'Dark Steel, Steel, Neon Red',
        function: 'Safely stores and prepares antihydrogen for injection into the annihilation core.',
        assemblyOrder: 3,
        connections: ['Antimatter Feed Injector', 'Structural Support Truss'],
        failureEffect: 'Antimatter makes contact with normal matter in the tank, causing localized detonation and vessel destruction.',
        cascadeFailures: ['Antimatter Feed Injector', 'Central Annihilation Core'],
        originalPosition: { x: 0, y: -35, z: 0 },
        explodedPosition: { x: 0, y: -80, z: 0 }
    });

    // ========================================================================
    // PART 4: MATTER STORAGE & PRE-HEATER (TOP)
    // ========================================================================
    const matterGroup = new THREE.Group();
    matterGroup.position.y = 35;

    // Similar but distinct Lathe Geometry for normal matter (Deuterium/Helium-3)
    const mPoints = [];
    for(let i=0; i<=15; i++) {
        const t = i / 15;
        const r = 9 + Math.cos(t * Math.PI) * 3;
        mPoints.push(new THREE.Vector2(r, t * 20));
    }
    const mGeo = new THREE.LatheGeometry(mPoints, 32);
    const mMesh = new THREE.Mesh(mGeo, aluminum);
    matterGroup.add(mMesh);

    // Matter Field Visualizer
    const mFieldGeo = new THREE.CylinderGeometry(8, 6, 18, 32);
    const mFieldMesh = new THREE.Mesh(mFieldGeo, containmentMaterial);
    mFieldMesh.position.y = 10;
    matterGroup.add(mFieldMesh);

    // Heater Coils
    const heaterGeo = new THREE.TorusKnotGeometry(10, 0.8, 128, 16, 2, 5);
    const heaterMesh = new THREE.Mesh(heaterGeo, copper);
    heaterMesh.position.y = 10;
    matterGroup.add(heaterMesh);
    meshesToAnimate.push({ mesh: heaterMesh, type: 'rotateY', speed: 1.5 });

    group.add(matterGroup);
    parts.push({
        name: 'Deuterium Storage & Pre-Heater',
        description: 'An aluminum-alloy reinforced storage tank for normal matter (Deuterium). Includes a complex copper torus-knot induction heater to pre-ionize the matter before injection.',
        material: 'Aluminum, Copper, Containment Field',
        function: 'Stores, heats, and ionizes normal matter to ensure a perfectly uniform annihilation cross-section.',
        assemblyOrder: 4,
        connections: ['Matter Feed Injector', 'Structural Support Truss'],
        failureEffect: 'Loss of matter feed pressure, resulting in an asymmetrical annihilation and catastrophic core destabilization.',
        cascadeFailures: ['Central Annihilation Core', 'Magnetic Nozzle Bell'],
        originalPosition: { x: 0, y: 35, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // ========================================================================
    // PART 5: FEED INJECTORS (EXTENSIVE TUBE GEOMETRIES)
    // ========================================================================
    const injectorGroup = new THREE.Group();
    const numInjectors = 8;
    
    for (let i = 0; i < numInjectors; i++) {
        const theta = (i / numInjectors) * Math.PI * 2;
        
        // Top Injectors (Matter)
        const startTop = new THREE.Vector3(Math.cos(theta)*8, 35, Math.sin(theta)*8);
        const c1Top = new THREE.Vector3(Math.cos(theta)*20, 25, Math.sin(theta)*20);
        const c2Top = new THREE.Vector3(Math.cos(theta)*15, 10, Math.sin(theta)*15);
        const endTop = new THREE.Vector3(Math.cos(theta)*5, 8, Math.sin(theta)*5);
        
        const topCurve = new THREE.CubicBezierCurve3(startTop, c1Top, c2Top, endTop);
        const topTubeGeo = new THREE.TubeGeometry(topCurve, 32, 1.5, 12, false);
        const topTube = new THREE.Mesh(topTubeGeo, chrome);
        
        // Add glowing flow lines
        const topFlowGeo = new THREE.TubeGeometry(topCurve, 32, 1.6, 4, false);
        const topFlow = new THREE.Mesh(topFlowGeo, new THREE.MeshStandardMaterial({color:0x000000, wireframe: true}));
        topTube.add(topFlow);
        injectorGroup.add(topTube);

        // Bottom Injectors (Antimatter)
        const startBot = new THREE.Vector3(Math.cos(theta)*8, -35, Math.sin(theta)*8);
        const c1Bot = new THREE.Vector3(Math.cos(theta)*20, -25, Math.sin(theta)*20);
        const c2Bot = new THREE.Vector3(Math.cos(theta)*15, -10, Math.sin(theta)*15);
        const endBot = new THREE.Vector3(Math.cos(theta)*5, -8, Math.sin(theta)*5);
        
        const botCurve = new THREE.CubicBezierCurve3(startBot, c1Bot, c2Bot, endBot);
        const botTubeGeo = new THREE.TubeGeometry(botCurve, 32, 1.5, 12, false);
        const botTube = new THREE.Mesh(botTubeGeo, darkSteel);
        
        // Antimatter warning stripes (simulated via glowing wireframe)
        const botFlowGeo = new THREE.TubeGeometry(botCurve, 32, 1.6, 4, false);
        const botFlow = new THREE.Mesh(botFlowGeo, neonRed);
        botFlow.material.wireframe = true;
        botTube.add(botFlow);
        
        injectorGroup.add(botTube);
    }

    group.add(injectorGroup);
    parts.push({
        name: 'Matter/Antimatter Feed Injectors',
        description: 'A symmetrical array of 16 magnetically shielded injection tubes. Top tubes transport pre-heated Deuterium, bottom tubes transport antihydrogen. Complex bezier curves ensure equal path lengths and injection timing down to the picosecond.',
        material: 'Chrome, Dark Steel, Neon Red',
        function: 'Delivers precise volumetric flows of matter and antimatter directly into the core intersection point.',
        assemblyOrder: 5,
        connections: ['Central Annihilation Core', 'Deuterium Storage', 'Antimatter Penning Trap'],
        failureEffect: 'Asymmetric injection leading to off-center annihilation, instantly melting the primary containment coils.',
        cascadeFailures: ['Toroidal Magnetic Pinch Coils', 'Central Annihilation Core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -60, y: 0, z: -60 }
    });

    // ========================================================================
    // PART 6: GAMMA RAY BAFFLE SHIELDING
    // ========================================================================
    const baffleGroup = new THREE.Group();
    baffleGroup.position.z = -25; // Placed behind the core, towards the nozzle
    baffleGroup.rotation.x = Math.PI / 2;

    const numBaffles = 10;
    for (let i = 0; i < numBaffles; i++) {
        // Create a disc with a hole
        const baffleShape = new THREE.Shape();
        baffleShape.absarc(0, 0, 30 - i * 0.5, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, 10 + i * 1.5, 0, Math.PI * 2, true);
        baffleShape.holes.push(holePath);

        const baffleGeo = new THREE.ExtrudeGeometry(baffleShape, { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 });
        const baffleMesh = new THREE.Mesh(baffleGeo, steel);
        baffleMesh.position.z = i * -4; // Spread them out
        baffleGroup.add(baffleMesh);
    }

    group.add(baffleGroup);
    parts.push({
        name: 'Gamma Ray Baffle Shielding',
        description: 'An array of 10 massive tungsten-carbide and steel composite discs with variable apertures. Designed to absorb and redirect stray high-energy gamma radiation away from the forward crew compartment.',
        material: 'Tungsten-Steel Composite',
        function: 'Provides crucial radiation shielding from the primary annihilation event.',
        assemblyOrder: 6,
        connections: ['Central Annihilation Core', 'Structural Support Truss'],
        failureEffect: 'Crew is instantly irradiated with lethal doses of gamma radiation. Ship electronics fry.',
        cascadeFailures: ['Diagnostic Sensor Array', 'Power Regulation Matrix'],
        originalPosition: { x: 0, y: 0, z: -25 },
        explodedPosition: { x: 0, y: 0, z: -80 }
    });

    // ========================================================================
    // PART 7: MAGNETIC NOZZLE BELL (MASSIVE)
    // ========================================================================
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.z = -40; // Behind baffles
    nozzleGroup.rotation.x = -Math.PI / 2;

    // Giant Lathe Profile for the Bell
    const bellPoints = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        // Parabolic expansion curve
        const r = 12 + Math.pow(t, 2) * 50;
        bellPoints.push(new THREE.Vector2(r, t * -80));
    }
    const bellGeo = new THREE.LatheGeometry(bellPoints, 64);
    const bellMesh = new THREE.Mesh(bellGeo, darkSteel);
    
    // Inner reflective surface (Chrome)
    const innerBellGeo = new THREE.LatheGeometry(bellPoints, 64);
    const innerBellMesh = new THREE.Mesh(innerBellGeo, chrome);
    innerBellMesh.scale.set(0.99, 1.0, 0.99); // Slightly smaller to be inside
    // Reverse normals for inner rendering
    innerBellMesh.material.side = THREE.BackSide;
    bellMesh.add(innerBellMesh);

    nozzleGroup.add(bellMesh);

    parts.push({
        name: 'Magnetic Nozzle Bell Base',
        description: 'A colossal paraboloid structure forged from dark steel, lined with an ultra-reflective chromium alloy. Forms the physical foundation for the magnetic vectoring fields that direct the plasma exhaust.',
        material: 'Dark Steel, Chrome',
        function: 'Directs the high-velocity pion and plasma exhaust out of the rear of the ship to generate thrust.',
        assemblyOrder: 7,
        connections: ['Gamma Ray Baffle Shielding', 'Nozzle Cooling Lattice', 'Vectoring Gimbal Actuators'],
        failureEffect: 'Exhaust expands spherically, melting the aft section of the ship and dropping thrust to near zero.',
        cascadeFailures: ['Nozzle Cooling Lattice', 'Vectoring Gimbal Actuators'],
        originalPosition: { x: 0, y: 0, z: -40 },
        explodedPosition: { x: 0, y: 0, z: -150 }
    });

    // ========================================================================
    // PART 8: NOZZLE COOLING LATTICE (EXTREME GREEBLING)
    // ========================================================================
    const latticeGroup = new THREE.Group();
    
    // We will wrap the bell in a wireframe-like lattice of tubes and rings
    const rings = 12;
    for(let i=0; i<rings; i++) {
        const t = i / (rings - 1);
        const yPos = t * -80;
        const r = 12.5 + Math.pow(t, 2) * 50; // Follow bell curve slightly outside
        
        const latticeRingGeo = new THREE.TorusGeometry(r, 0.8, 16, 64);
        const latticeRing = new THREE.Mesh(latticeRingGeo, copper);
        latticeRing.position.y = yPos;
        latticeRing.rotation.x = Math.PI/2;
        latticeGroup.add(latticeRing);
        
        // Vertical struts
        if (i < rings - 1) {
            const nextT = (i+1) / (rings - 1);
            const nextYPos = nextT * -80;
            const nextR = 12.5 + Math.pow(nextT, 2) * 50;
            
            const struts = 16;
            for(let j=0; j<struts; j++) {
                const angle = (j / struts) * Math.PI * 2;
                const startStrut = new THREE.Vector3(Math.cos(angle)*r, yPos, Math.sin(angle)*r);
                const endStrut = new THREE.Vector3(Math.cos(angle)*nextR, nextYPos, Math.sin(angle)*nextR);
                
                const strutCurve = new THREE.LineCurve3(startStrut, endStrut);
                const strutGeo = new THREE.TubeGeometry(strutCurve, 1, 0.4, 8, false);
                const strutMesh = new THREE.Mesh(strutGeo, aluminum);
                latticeGroup.add(strutMesh);
            }
        }
    }
    nozzleGroup.add(latticeGroup);
    group.add(nozzleGroup);

    parts.push({
        name: 'Nozzle Cooling Lattice & Field Projectors',
        description: 'An intricate external web of copper and aluminum piping acting as both a liquid-helium heat exchanger and secondary magnetic field projectors. Matches the parabolic curve of the bell.',
        material: 'Copper, Aluminum',
        function: 'Prevents the primary nozzle bell from vaporizing due to radiant heat and fine-tunes the magnetic exhaust envelope.',
        assemblyOrder: 8,
        connections: ['Magnetic Nozzle Bell Base', 'Coolant Manifold System'],
        failureEffect: 'Nozzle bell overheats and undergoes thermal expansion fracturing, ripping the aft section apart under thrust.',
        cascadeFailures: ['Magnetic Nozzle Bell Base'],
        originalPosition: { x: 0, y: 0, z: -40 },
        explodedPosition: { x: 0, y: 0, z: -200 }
    });

    // ========================================================================
    // PART 9: EXHAUST PLASMA PLUME (CUSTOM SHADER CONE)
    // ========================================================================
    const plumeGroup = new THREE.Group();
    plumeGroup.position.z = -120; // Starting inside the bell, extending far back
    plumeGroup.rotation.x = -Math.PI / 2;

    const plumeGeo = new THREE.ConeGeometry(60, 200, 64, 64, true);
    // Adjust pivot to top of cone
    plumeGeo.translate(0, -100, 0); 
    const plumeMesh = new THREE.Mesh(plumeGeo, plasmaMaterial);
    
    // Add inner brighter core plume
    const innerPlumeGeo = new THREE.ConeGeometry(25, 250, 32, 32, true);
    innerPlumeGeo.translate(0, -125, 0);
    const innerPlumeMesh = new THREE.Mesh(innerPlumeGeo, new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending}));
    
    plumeGroup.add(plumeMesh);
    plumeGroup.add(innerPlumeMesh);
    group.add(plumeGroup);

    meshesToAnimate.push({ mesh: plumeGroup, type: 'thrustPulse', speed: 10.0 });

    parts.push({
        name: 'Gamma-Ray Plasma Exhaust Plume',
        description: 'The visual manifestation of the annihilation event: a super-luminous stream of charged pions and gamma radiation expanding at relativistic velocities.',
        material: 'Pure Energy (Custom Shader)',
        function: 'The action force generating extreme Specific Impulse (Isp).',
        assemblyOrder: 9,
        connections: ['Magnetic Nozzle Bell Base'],
        failureEffect: 'N/A (This is the output, not a physical part).',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -120 },
        explodedPosition: { x: 0, y: 0, z: -300 }
    });

    // ========================================================================
    // PART 10: VECTORING GIMBAL ACTUATORS (HYDRAULICS)
    // ========================================================================
    const hydraulicGroup = new THREE.Group();
    hydraulicGroup.position.z = -35;
    
    const numHydraulics = 6;
    for(let i=0; i<numHydraulics; i++) {
        const angle = (i / numHydraulics) * Math.PI * 2;
        // Connects baffle ring to nozzle bell
        
        const hGroup = new THREE.Group();
        hGroup.position.set(Math.cos(angle)*32, Math.sin(angle)*32, 0);
        
        // Piston Cylinder
        const cylGeo = new THREE.CylinderGeometry(2, 2, 20, 16);
        cylGeo.translate(0, 10, 0);
        const cylMesh = new THREE.Mesh(cylGeo, darkSteel);
        cylMesh.rotation.x = Math.PI/2;
        cylMesh.rotation.y = angle;
        hGroup.add(cylMesh);
        
        // Piston Rod
        const rodGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
        rodGeo.translate(0, 10, 0);
        const rodMesh = new THREE.Mesh(rodGeo, chrome);
        rodMesh.position.z = -10; // offset inside cylinder
        rodMesh.rotation.x = Math.PI/2;
        rodMesh.rotation.y = angle;
        hGroup.add(rodMesh);

        // Animate the rod pumping
        meshesToAnimate.push({ mesh: rodMesh, type: 'pistonPump', speed: 2.0, offset: i });
        
        hydraulicGroup.add(hGroup);
    }
    group.add(hydraulicGroup);

    parts.push({
        name: 'Thrust Vectoring Gimbal Actuators',
        description: 'A set of 6 massive hydraulic-magnetic pistons connecting the ship\'s spaceframe to the nozzle bell. Used to physically tilt the massive magnetic bell for thrust vectoring and steering.',
        material: 'Dark Steel, Chrome, High-Pressure Fluids',
        function: 'Provides yaw and pitch control by physically altering the thrust vector angle.',
        assemblyOrder: 10,
        connections: ['Gamma Ray Baffle Shielding', 'Magnetic Nozzle Bell Base'],
        failureEffect: 'Loss of navigational control. Ship cannot steer under thrust.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -35 },
        explodedPosition: { x: 0, y: 80, z: -35 }
    });

    // ========================================================================
    // PART 11: DIAGNOSTIC SENSOR ARRAY (INSTANCED MESHES)
    // ========================================================================
    const sensorRingGeo = new THREE.TorusGeometry(38, 1, 16, 64);
    const sensorRing = new THREE.Mesh(sensorRingGeo, steel);
    sensorRing.position.z = -10;
    
    // Hundreds of tiny sensors using InstancedMesh
    const sensorBaseGeo = new THREE.BoxGeometry(1, 2, 3);
    const numSensors = 120;
    const sensorInstanced = new THREE.InstancedMesh(sensorBaseGeo, aluminum, numSensors);
    
    const dummy = new THREE.Object3D();
    for(let i=0; i<numSensors; i++) {
        const angle = (i / numSensors) * Math.PI * 2;
        dummy.position.set(Math.cos(angle)*38, Math.sin(angle)*38, 0);
        dummy.rotation.set(0, 0, angle);
        dummy.updateMatrix();
        sensorInstanced.setMatrixAt(i, dummy.matrix);
    }
    
    // Blinking lights
    const lightInstanced = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 8, 8), neonGreen, numSensors);
    for(let i=0; i<numSensors; i++) {
        const angle = (i / numSensors) * Math.PI * 2;
        dummy.position.set(Math.cos(angle)*38, Math.sin(angle)*38, 1.5); // Slightly forward
        dummy.rotation.set(0, 0, angle);
        dummy.updateMatrix();
        lightInstanced.setMatrixAt(i, dummy.matrix);
    }
    meshesToAnimate.push({ mesh: lightInstanced, type: 'blinkInstanced', count: numSensors });

    sensorRing.add(sensorInstanced);
    sensorRing.add(lightInstanced);
    group.add(sensorRing);

    parts.push({
        name: 'Diagnostic Sensor Array Ring',
        description: 'A 76-meter diameter steel ring housing 120 high-fidelity telemetry sensors, interferometers, and spectral analyzers. Instanced geometry provides extreme detail without performance loss.',
        material: 'Steel, Aluminum, Neon Green (LEDs)',
        function: 'Monitors plasma stability, magnetic field fluctuations, and annihilation efficiency in real-time.',
        assemblyOrder: 11,
        connections: ['Central Annihilation Core', 'Structural Support Truss'],
        failureEffect: 'Loss of telemetry. Reactor management AI goes blind, leading to highly conservative (low efficiency) thrust profiles or auto-scram.',
        cascadeFailures: ['Power Regulation Matrix'],
        originalPosition: { x: 0, y: 0, z: -10 },
        explodedPosition: { x: 0, y: 0, z: 80 }
    });

    // ========================================================================
    // PART 12: COOLANT MANIFOLD SYSTEM
    // ========================================================================
    const coolantGroup = new THREE.Group();
    // Complex helical wraps around the pods
    
    const createHelix = (radius, height, turns, mat) => {
        const points = [];
        const segments = 100;
        for(let i=0; i<=segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 * turns;
            points.push(new THREE.Vector3(Math.cos(angle)*radius, t*height - height/2, Math.sin(angle)*radius));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 100, 0.8, 8, false);
        return new THREE.Mesh(geo, mat);
    };

    const topHelix1 = createHelix(11, 30, 5, copper);
    topHelix1.position.y = 35;
    const topHelix2 = createHelix(12, 30, -5, steel);
    topHelix2.position.y = 35;
    
    const botHelix1 = createHelix(10, 30, 6, copper);
    botHelix1.position.y = -35;
    const botHelix2 = createHelix(11, 30, -6, steel);
    botHelix2.position.y = -35;

    coolantGroup.add(topHelix1, topHelix2, botHelix1, botHelix2);
    group.add(coolantGroup);

    parts.push({
        name: 'Cryogenic Coolant Manifolds',
        description: 'Interwoven helical tubes carrying near-absolute-zero liquid helium. Wraps tightly around both the normal matter and antimatter storage pods.',
        material: 'Copper, Steel',
        function: 'Keeps the superconducting coils below their critical temperature and prevents the storage tanks from overheating due to stray gamma radiation.',
        assemblyOrder: 12,
        connections: ['Deuterium Storage', 'Antimatter Penning Trap', 'Nozzle Cooling Lattice'],
        failureEffect: 'Superconductors quench (lose superconductivity). Magnetic fields collapse. Instant catastrophic annihilation.',
        cascadeFailures: ['Toroidal Magnetic Pinch Coils', 'Antimatter Penning Trap Assembly'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: 0, z: 0 }
    });

    // ========================================================================
    // PART 13: STRUCTURAL SUPPORT TRUSS
    // ========================================================================
    const trussGroup = new THREE.Group();
    
    // Massive dark steel girders holding the top and bottom pods to the core
    const createGirder = (x, z) => {
        const girderShape = new THREE.Shape();
        girderShape.moveTo(-2, -2);
        girderShape.lineTo(2, -2);
        girderShape.lineTo(2, 2);
        girderShape.lineTo(-2, 2);
        
        // Make it an I-beam or hollow square. Let's do hollow square for simplicity
        const hole = new THREE.Path();
        hole.moveTo(-1.5, -1.5);
        hole.lineTo(1.5, -1.5);
        hole.lineTo(1.5, 1.5);
        hole.lineTo(-1.5, 1.5);
        girderShape.holes.push(hole);

        const girderGeo = new THREE.ExtrudeGeometry(girderShape, { depth: 100, bevelEnabled: false });
        girderGeo.translate(0, 0, -50); // center
        const girder = new THREE.Mesh(girderGeo, darkSteel);
        girder.rotation.x = Math.PI / 2;
        girder.position.set(x, 0, z);
        return girder;
    };

    trussGroup.add(createGirder(20, 20));
    trussGroup.add(createGirder(-20, 20));
    trussGroup.add(createGirder(20, -20));
    trussGroup.add(createGirder(-20, -20));

    // Cross braces
    const braceGeo = new THREE.CylinderGeometry(1, 1, 60, 8);
    const brace1 = new THREE.Mesh(braceGeo, steel);
    brace1.rotation.z = Math.PI / 4;
    brace1.position.set(0, 0, 20);
    trussGroup.add(brace1);

    const brace2 = new THREE.Mesh(braceGeo, steel);
    brace2.rotation.z = -Math.PI / 4;
    brace2.position.set(0, 0, -20);
    trussGroup.add(brace2);

    group.add(trussGroup);

    parts.push({
        name: 'Titanium-Graphene Structural Truss',
        description: 'Four massive, hollow-core dark steel girders reinforced with graphene cross-bracing. Runs the entire vertical length of the drive.',
        material: 'Dark Steel, Steel',
        function: 'Absorbs the immense shear forces and G-loads generated by the engine during extreme acceleration, holding the components in perfect millimeter alignment.',
        assemblyOrder: 13,
        connections: ['Central Annihilation Core', 'Deuterium Storage', 'Antimatter Penning Trap', 'Gamma Ray Baffle Shielding'],
        failureEffect: 'Vessel shears in half under acceleration. The antimatter trap ruptures.',
        cascadeFailures: ['All components'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 0, z: 80 }
    });

    // ========================================================================
    // PART 14: PARTICLE STREAMS (INTERNAL ANIMATION)
    // ========================================================================
    
    // Matter stream particles
    const mParticleCount = 1000;
    const mParticleGeo = new THREE.BufferGeometry();
    const mParticlePos = new Float32Array(mParticleCount * 3);
    for(let i=0; i<mParticleCount; i++) {
        mParticlePos[i*3] = (Math.random() - 0.5) * 4;
        mParticlePos[i*3+1] = Math.random() * 40; // Starts from top
        mParticlePos[i*3+2] = (Math.random() - 0.5) * 4;
    }
    mParticleGeo.setAttribute('position', new THREE.BufferAttribute(mParticlePos, 3));
    const mParticleMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true, blending: THREE.AdditiveBlending });
    const mParticleMesh = new THREE.Points(mParticleGeo, mParticleMat);
    group.add(mParticleMesh);
    meshesToAnimate.push({ mesh: mParticleMesh, type: 'particleFlowDown', speed: 20.0 });

    // Antimatter stream particles
    const amParticleGeo = new THREE.BufferGeometry();
    const amParticlePos = new Float32Array(mParticleCount * 3);
    for(let i=0; i<mParticleCount; i++) {
        amParticlePos[i*3] = (Math.random() - 0.5) * 4;
        amParticlePos[i*3+1] = -(Math.random() * 40); // Starts from bottom
        amParticlePos[i*3+2] = (Math.random() - 0.5) * 4;
    }
    amParticleGeo.setAttribute('position', new THREE.BufferAttribute(amParticlePos, 3));
    const amParticleMat = new THREE.PointsMaterial({ color: 0xff0044, size: 0.5, transparent: true, blending: THREE.AdditiveBlending });
    const amParticleMesh = new THREE.Points(amParticleGeo, amParticleMat);
    group.add(amParticleMesh);
    meshesToAnimate.push({ mesh: amParticleMesh, type: 'particleFlowUp', speed: 20.0 });

    parts.push({
        name: 'Matter/Antimatter Particle Streams',
        description: 'Visual representation of the ionized deuterium and antihydrogen plasmas accelerating through the injector conduits toward the annihilation point.',
        material: 'Plasma Points',
        function: 'Fuel delivery mechanism.',
        assemblyOrder: 14,
        connections: ['Feed Injectors', 'Central Annihilation Core'],
        failureEffect: 'Fuel flow disruption causes engine stutter and destructive harmonic resonance.',
        cascadeFailures: ['Central Annihilation Core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ========================================================================
    // PART 15: QUANTUM VACUUM FLUCTUATOR (POWER SOURCE FOR TRAPS)
    // ========================================================================
    const qvfGroup = new THREE.Group();
    qvfGroup.position.set(0, 0, 15); // Front of the core
    
    const qvfBaseGeo = new THREE.CylinderGeometry(8, 8, 4, 32);
    qvfBaseGeo.rotateX(Math.PI/2);
    const qvfBase = new THREE.Mesh(qvfBaseGeo, darkSteel);
    qvfGroup.add(qvfBase);

    // Glowing inner rings
    const qvfRingGeo = new THREE.TorusGeometry(6, 0.5, 16, 64);
    const qvfRing1 = new THREE.Mesh(qvfRingGeo, neonPurple);
    qvfRing1.rotation.x = Math.PI/4;
    qvfGroup.add(qvfRing1);
    
    const qvfRing2 = new THREE.Mesh(qvfRingGeo, neonPurple);
    qvfRing2.rotation.x = -Math.PI/4;
    qvfGroup.add(qvfRing2);

    meshesToAnimate.push({ mesh: qvfRing1, type: 'rotateX', speed: 3.0 });
    meshesToAnimate.push({ mesh: qvfRing2, type: 'rotateY', speed: 3.5 });
    meshesToAnimate.push({ mesh: qvfBase, type: 'pulseScale', speed: 1.0, baseScale: 1.0, variance: 0.05 });

    group.add(qvfGroup);

    parts.push({
        name: 'Quantum Vacuum Fluctuator',
        description: 'A highly experimental auxiliary generator that taps into zero-point energy to power the magnetic containment traps independent of the main annihilation reactor.',
        material: 'Dark Steel, Neon Purple',
        function: 'Provides guaranteed, uninterrupted power to the antimatter Penning traps even if the primary reactor goes offline (failsafe).',
        assemblyOrder: 15,
        connections: ['Antimatter Penning Trap Assembly', 'Power Regulation Matrix'],
        failureEffect: 'Loss of backup power. If primary power also fails, containment drops and the ship explodes.',
        cascadeFailures: ['Antimatter Penning Trap Assembly'],
        originalPosition: { x: 0, y: 0, z: 15 },
        explodedPosition: { x: 0, y: 0, z: 100 }
    });


    // ========================================================================
    // ANIMATION LOGIC
    // ========================================================================
    const clock = new THREE.Clock();
    
    const animate = (time, speed, meshes) => {
        const delta = clock.getDelta() * speed;
        const totalTime = time * speed;

        meshesToAnimate.forEach(anim => {
            if (anim.type === 'shader') {
                anim.mesh.uniforms.time.value = totalTime;
            } 
            else if (anim.type === 'rotateY') {
                anim.mesh.rotation.y += anim.speed * delta;
            }
            else if (anim.type === 'rotateZ') {
                anim.mesh.rotation.z += anim.speed * delta;
            }
            else if (anim.type === 'rotateX') {
                anim.mesh.rotation.x += anim.speed * delta;
            }
            else if (anim.type === 'pulseScale') {
                const s = anim.baseScale + Math.sin(totalTime * anim.speed) * anim.variance;
                anim.mesh.scale.set(s, s, s);
            }
            else if (anim.type === 'pistonPump') {
                // Hydraulic rod goes back and forth
                anim.mesh.position.z = -10 + Math.sin(totalTime * anim.speed + anim.offset) * 4;
            }
            else if (anim.type === 'thrustPulse') {
                // Pulse the exhaust cone length and opacity
                const s = 1.0 + Math.random() * 0.1; 
                anim.mesh.scale.set(1.0, s, 1.0);
            }
            else if (anim.type === 'blinkInstanced') {
                // Randomly blink diagnostic lights by updating instance colors
                // To save performance in standard loop, we just pulse the whole material, 
                // but for "hyper realistic" we could update the buffer. Let's do a sine wave on the material opacity.
                anim.mesh.material.opacity = 0.5 + Math.sin(totalTime * 10.0) * 0.5;
            }
            else if (anim.type === 'particleFlowDown') {
                const positions = anim.mesh.geometry.attributes.position.array;
                for(let i=1; i<positions.length; i+=3) {
                    positions[i] -= anim.speed * delta;
                    if(positions[i] < 0) positions[i] = 40; // reset to top
                }
                anim.mesh.geometry.attributes.position.needsUpdate = true;
            }
            else if (anim.type === 'particleFlowUp') {
                const positions = anim.mesh.geometry.attributes.position.array;
                for(let i=1; i<positions.length; i+=3) {
                    positions[i] += anim.speed * delta;
                    if(positions[i] > 0) positions[i] = -40; // reset to bottom
                }
                anim.mesh.geometry.attributes.position.needsUpdate = true;
            }
        });
    };

    // ========================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ========================================================================
    const quizQuestions = [
        {
            question: "In a Penning trap containing antihydrogen, what happens to the required axial magnetic field strength if the mass of the confined particle increases by a factor of 4 while charge remains constant, assuming constant cyclotron frequency?",
            options: [
                "It must decrease by a factor of 4.",
                "It must increase by a factor of 4.",
                "It must increase by a factor of 16.",
                "It remains unchanged."
            ],
            correctAnswer: 1,
            explanation: "The cyclotron frequency is ω_c = (q*B)/m. If the mass (m) increases by a factor of 4, the magnetic field (B) must also increase by a factor of 4 to keep ω_c constant."
        },
        {
            question: "When a proton and an antiproton annihilate, the process predominantly produces which of the following sequences of intermediate and final particles?",
            options: [
                "Two gamma ray photons directly.",
                "Charged and neutral pions, which then decay into muons, electrons, neutrinos, and gamma rays.",
                "Z bosons which decay into bottom quarks.",
                "A shower of alpha particles and high-energy neutrons."
            ],
            correctAnswer: 1,
            explanation: "Proton-antiproton annihilation rarely produces just two photons directly (unlike electron-positron). Instead, it mostly creates multiple pions. Neutral pions decay quickly into gamma rays, while charged pions travel further before decaying into muons and neutrinos, making shielding and nozzle design extremely complex."
        },
        {
            question: "Calculate the theoretical maximum Specific Impulse (Isp) of a perfectly directed proton-antiproton photon rocket, assuming 100% conversion of mass to directed energy.",
            options: [
                "~3,000 seconds",
                "~1,000,000 seconds",
                "~30,000,000 seconds",
                "Infinite"
            ],
            correctAnswer: 2,
            explanation: "The maximum exhaust velocity is 'c' (the speed of light). Isp = V_e / g_0. Therefore, Isp = (299,792,458 m/s) / 9.80665 m/s² ≈ 30.56 million seconds."
        },
        {
            question: "Why is Tungsten-Carbide utilized in the Gamma Ray Baffle Shielding over standard Lead (Pb)?",
            options: [
                "Lead becomes dangerously radioactive via neutron activation.",
                "Tungsten-Carbide has a higher attenuation coefficient for high-energy gamma rays and a significantly higher melting point to withstand thermal bloom.",
                "Lead is diamagnetic and would disrupt the Penning trap.",
                "Tungsten-Carbide acts as a superconductor at high temperatures."
            ],
            correctAnswer: 1,
            explanation: "The core annihilation event produces immense heat alongside gamma radiation. Lead melts at just 327°C, which would instantly liquefy near the core. Tungsten has a much higher density for gamma shielding and a melting point of over 3400°C."
        },
        {
            question: "In the context of the magnetic nozzle, how does the 'magnetic detachment' of the exhaust plasma occur?",
            options: [
                "The plasma cools down and solidifies.",
                "The plasma pressure overcomes the magnetic field pressure (Beta > 1) as it expands, breaking frozen-in field lines.",
                "The onboard computer manually switches the electromagnets on and off rapidly.",
                "Antimatter repels magnetic fields inherently."
            ],
            correctAnswer: 1,
            explanation: "For a magnetic nozzle to produce thrust, the exhaust plasma must eventually detach from the ship's magnetic field lines, otherwise it would just loop back. This happens when the plasma's kinetic pressure exceeds the local magnetic field pressure (plasma Beta > 1), allowing it to stretch and break the field lines (reconnection/detachment)."
        }
    ];

    return {
        group,
        parts,
        description: "The God-Tier Antimatter Annihilation Drive. An incredibly intricate, hyper-realistic spacecraft propulsion system utilizing perfectly synchronized magnetic confinement fields to mix and annihilate deuterium and antihydrogen. Features extreme particle flow, dynamic pulsing shaders, custom neon geometries, and massive magnetic vectoring nozzles.",
        quizQuestions,
        animate
    };
}
