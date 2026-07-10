import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    
    // Emissive and Special Materials
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2.5, metalness: 0.5, roughness: 0.5 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 1.5, metalness: 0.8, roughness: 0.2 });
    const plasmaEngine = new THREE.MeshStandardMaterial({ color: 0xff9900, emissive: 0xffaa00, emissiveIntensity: 5, transparent: true, opacity: 0.9 });
    const superBlack = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, metalness: 0.1 });
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4, metalness: 1.0, bumpScale: 0.05 });
    
    // 1. SKYHOOK MAIN ROTOR GROUP
    const skyhookRotor = new THREE.Group();
    group.add(skyhookRotor);
    meshes.skyhookRotor = skyhookRotor;

    // --- CENTRAL HUB ---
    const centralHub = new THREE.Group();
    skyhookRotor.add(centralHub);
    meshes.centralHub = centralHub;

    // Core Spindle (LatheGeometry)
    const spindlePoints = [];
    for(let i=0; i <= 30; i++) {
        const t = i / 30;
        const radius = 10 + 5 * Math.sin(t * Math.PI * 4) * Math.exp(-t * 2);
        spindlePoints.push(new THREE.Vector2(radius, (t - 0.5) * 60));
    }
    const spindleGeo = new THREE.LatheGeometry(spindlePoints, 128);
    const spindle = new THREE.Mesh(spindleGeo, darkSteel);
    centralHub.add(spindle);

    // Habitation Rings
    const createHabRing = (radius, tube, yPos) => {
        const ringGrp = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(radius, tube, 64, 128);
        const ring = new THREE.Mesh(ringGeo, aluminum);
        ring.rotation.x = Math.PI / 2;
        ringGrp.add(ring);

        // Windows / Viewports on Ring
        for(let i=0; i<36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const windowGeo = new THREE.BoxGeometry(tube * 2.2, tube * 0.8, tube * 0.8);
            const windowMesh = new THREE.Mesh(windowGeo, glowingBlue);
            windowMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            windowMesh.lookAt(0, 0, 0);
            ringGrp.add(windowMesh);
        }
        
        // Spokes connecting to hub
        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(2, 2, radius - 5, 32);
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = angle;
            spoke.position.set(Math.cos(angle) * (radius/2), 0, Math.sin(angle) * (radius/2));
            ringGrp.add(spoke);
        }
        ringGrp.position.y = yPos;
        return ringGrp;
    };

    const habRingUpper = createHabRing(40, 4, 15);
    const habRingLower = createHabRing(55, 6, -10);
    centralHub.add(habRingUpper);
    centralHub.add(habRingLower);

    // Radiator Panels
    const radiatorGrp = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const panelGeo = new THREE.BoxGeometry(2, 40, 20);
        const panel = new THREE.Mesh(panelGeo, chrome);
        
        // Add heat glow to radiators
        const glowGeo = new THREE.BoxGeometry(2.2, 38, 18);
        const heatGlow = new THREE.Mesh(glowGeo, glowingRed);
        
        const panelPivot = new THREE.Group();
        panelPivot.add(panel);
        panelPivot.add(heatGlow);
        panelPivot.position.set(Math.cos(angle) * 15, 0, Math.sin(angle) * 15);
        panelPivot.rotation.y = angle;
        radiatorGrp.add(panelPivot);
    }
    centralHub.add(radiatorGrp);
    meshes.radiators = radiatorGrp;

    // --- TETHER ARMS (Truss Structures) ---
    const buildTrussArm = (segments, segmentLength, width) => {
        const armGrp = new THREE.Group();
        for(let s=0; s<segments; s++) {
            const segGrp = new THREE.Group();
            const yOffset = s * segmentLength;
            
            // 4 main chords
            const chordGeo = new THREE.CylinderGeometry(0.8, 0.8, segmentLength, 16);
            const offsets = [
                [-width/2, -width/2], [width/2, -width/2],
                [-width/2, width/2], [width/2, width/2]
            ];
            offsets.forEach(off => {
                const chord = new THREE.Mesh(chordGeo, steel);
                chord.position.set(off[0], yOffset + segmentLength/2, off[1]);
                segGrp.add(chord);
            });

            // Cross bracing (X pattern on all 4 sides)
            const braceLen = Math.sqrt(width*width + segmentLength*segmentLength);
            const braceGeo = new THREE.CylinderGeometry(0.4, 0.4, braceLen, 8);
            
            const createBrace = (x, z, rotX, rotZ) => {
                const brace = new THREE.Mesh(braceGeo, darkSteel);
                brace.position.set(x, yOffset + segmentLength/2, z);
                if (rotX) brace.rotation.x = rotX;
                if (rotZ) brace.rotation.z = rotZ;
                return brace;
            };

            const angle = Math.atan2(width, segmentLength);
            segGrp.add(createBrace(0, width/2, angle, 0));
            segGrp.add(createBrace(0, width/2, -angle, 0));
            segGrp.add(createBrace(0, -width/2, angle, 0));
            segGrp.add(createBrace(0, -width/2, -angle, 0));
            
            segGrp.add(createBrace(width/2, 0, 0, angle));
            segGrp.add(createBrace(width/2, 0, 0, -angle));
            segGrp.add(createBrace(-width/2, 0, 0, angle));
            segGrp.add(createBrace(-width/2, 0, 0, -angle));

            // Connector rings at segment joints
            if (s > 0) {
                const jointGeo = new THREE.TorusGeometry(width * 0.8, 0.6, 16, 4);
                const joint = new THREE.Mesh(jointGeo, glowingGreen);
                joint.rotation.x = Math.PI / 2;
                joint.rotation.z = Math.PI / 4; // square alignment
                joint.position.y = yOffset;
                segGrp.add(joint);
            }

            armGrp.add(segGrp);
        }
        return armGrp;
    };

    const tetherLength = 200; // Total arm length
    const segmentLen = 20;
    const numSegments = tetherLength / segmentLen;
    const tetherWidth = 10;

    const upperArm = buildTrussArm(numSegments, segmentLen, tetherWidth);
    upperArm.position.y = 30; // start above hub
    skyhookRotor.add(upperArm);
    meshes.upperArm = upperArm;

    const lowerArm = buildTrussArm(numSegments, segmentLen, tetherWidth);
    lowerArm.rotation.x = Math.PI; // point downwards
    lowerArm.position.y = -30;
    skyhookRotor.add(lowerArm);
    meshes.lowerArm = lowerArm;

    // --- COUNTERWEIGHT (Upper Tip) ---
    const counterweight = new THREE.Group();
    // Huge mass structure
    const massGeo = new THREE.IcosahedronGeometry(25, 3);
    const massMesh = new THREE.Mesh(massGeo, darkSteel);
    counterweight.add(massMesh);

    // Thruster ring on counterweight for orbital keeping
    const cwRingGeo = new THREE.TorusGeometry(30, 2, 32, 64);
    const cwRing = new THREE.Mesh(cwRingGeo, aluminum);
    cwRing.rotation.x = Math.PI / 2;
    counterweight.add(cwRing);
    
    // Counterweight antennas
    for(let i=0; i<4; i++) {
        const antGeo = new THREE.CylinderGeometry(0.2, 0.5, 30);
        const ant = new THREE.Mesh(antGeo, steel);
        ant.position.set(Math.cos(i*Math.PI/2)*20, 25, Math.sin(i*Math.PI/2)*20);
        ant.rotation.x = Math.PI/8 * Math.cos(i*Math.PI/2);
        ant.rotation.z = Math.PI/8 * Math.sin(i*Math.PI/2);
        counterweight.add(ant);
        // glowing tip
        const tipGeo = new THREE.SphereGeometry(1, 16, 16);
        const tip = new THREE.Mesh(tipGeo, glowingRed);
        tip.position.y = 15;
        ant.add(tip);
    }
    counterweight.position.y = 30 + tetherLength;
    skyhookRotor.add(counterweight);
    meshes.counterweight = counterweight;

    // --- GRAPPLE MECHANISM (Lower Tip) ---
    const grappleGroup = new THREE.Group();
    const grappleBaseGeo = new THREE.CylinderGeometry(10, tetherWidth * 0.7, 15, 32);
    const grappleBase = new THREE.Mesh(grappleBaseGeo, steel);
    grappleBase.position.y = -7.5;
    grappleGroup.add(grappleBase);

    // Mechanical catching arms
    const catchArms = [];
    meshes.catchArms = catchArms;
    for(let i=0; i<3; i++) {
        const armPivot = new THREE.Group();
        const angle = (i / 3) * Math.PI * 2;
        armPivot.position.set(Math.cos(angle) * 8, -15, Math.sin(angle) * 8);
        armPivot.rotation.y = -angle;

        // Upper limb
        const limb1Geo = new THREE.BoxGeometry(2, 20, 4);
        const limb1 = new THREE.Mesh(limb1Geo, darkSteel);
        limb1.position.y = -10;
        
        // Elbow joint
        const jointGeo = new THREE.CylinderGeometry(3, 3, 5, 32);
        const joint = new THREE.Mesh(jointGeo, chrome);
        joint.rotation.z = Math.PI / 2;
        joint.position.y = -20;
        
        // Lower limb (Claw)
        const limb2Geo = new THREE.BoxGeometry(1.5, 15, 3);
        const limb2 = new THREE.Mesh(limb2Geo, aluminum);
        limb2.position.y = -7.5;
        limb2.rotation.x = -Math.PI / 4; // bent inward
        
        // Hydraulic Piston for claw
        const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8), darkSteel);
        const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8), chrome);
        pistonOuter.position.set(0, -3, 2);
        pistonOuter.rotation.x = Math.PI / 6;
        pistonInner.position.y = -4;
        pistonOuter.add(pistonInner);
        limb1.add(pistonOuter);

        joint.add(limb2);
        limb1.add(joint);
        armPivot.add(limb1);
        grappleGroup.add(armPivot);
        catchArms.push({pivot: armPivot, lower: limb2, piston: pistonInner});
    }

    // Grapple sensor array
    const sensorGeo = new THREE.SphereGeometry(3, 32, 32);
    const sensor = new THREE.Mesh(sensorGeo, tinted);
    sensor.position.y = -15;
    grappleGroup.add(sensor);
    
    // Grapple locator beams
    const beamGeo = new THREE.ConeGeometry(8, 40, 32, 1, true);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
    beam.position.y = -35;
    beam.rotation.x = Math.PI;
    grappleGroup.add(beam);

    grappleGroup.position.y = -30 - tetherLength;
    skyhookRotor.add(grappleGroup);
    meshes.grappleGroup = grappleGroup;

    // --- SPACECRAFT (The Payload to be caught & flung) ---
    const spacecraft = new THREE.Group();
    
    // Fuselage - Complex Extruded/Lathe shape
    const fusePoints = [];
    for(let i=0; i<=20; i++) {
        const t = i/20; // 0 to 1
        const r = (Math.sin(t * Math.PI) * 4) + (t < 0.2 ? t*15 : 0);
        fusePoints.push(new THREE.Vector2(r, -t * 30));
    }
    const fuselageGeo = new THREE.LatheGeometry(fusePoints, 64);
    const fuselage = new THREE.Mesh(fuselageGeo, goldFoil);
    spacecraft.add(fuselage);

    // Delta Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-12, -20);
    wingShape.lineTo(-12, -28);
    wingShape.lineTo(0, -25);
    const extSettings = { depth: 1, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.2, bevelSegments: 3 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extSettings);
    
    const leftWing = new THREE.Mesh(wingGeo, darkSteel);
    leftWing.position.set(0, 0, -0.5);
    spacecraft.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, darkSteel);
    rightWing.scale.set(-1, 1, 1);
    rightWing.position.set(0, 0, -0.5);
    spacecraft.add(rightWing);

    // Engine Nozzles (3-engine layout)
    const engineGroup = new THREE.Group();
    const createEngine = (x, y, z, scale) => {
        const engGrp = new THREE.Group();
        // Nozzle
        const nozPoints = [new THREE.Vector2(0,0), new THREE.Vector2(1.5, -2), new THREE.Vector2(2.5, -4), new THREE.Vector2(3, -5)];
        const nozGeo = new THREE.LatheGeometry(nozPoints, 32);
        const nozzle = new THREE.Mesh(nozGeo, darkSteel);
        engGrp.add(nozzle);
        
        // Exhaust Plume
        const plumeGeo = new THREE.CylinderGeometry(2.5, 0.1, 15, 32);
        const plume = new THREE.Mesh(plumeGeo, plasmaEngine);
        plume.position.y = -12;
        engGrp.add(plume);
        
        engGrp.position.set(x, y, z);
        engGrp.scale.setScalar(scale);
        return engGrp;
    };
    
    const mainEng = createEngine(0, -28, 0, 1.2);
    const sideEng1 = createEngine(-4, -26, 0, 0.8);
    const sideEng2 = createEngine(4, -26, 0, 0.8);
    engineGroup.add(mainEng);
    engineGroup.add(sideEng1);
    engineGroup.add(sideEng2);
    spacecraft.add(engineGroup);

    // Cockpit Canopy
    const canopyGeo = new THREE.CapsuleGeometry(2, 6, 16, 32);
    const canopy = new THREE.Mesh(canopyGeo, tinted);
    canopy.position.set(0, -10, 2.5);
    canopy.rotation.x = Math.PI / 12;
    spacecraft.add(canopy);

    // Spacecraft Docking Ring (Top)
    const dockRingGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 32);
    const dockRing = new THREE.Mesh(dockRingGeo, chrome);
    dockRing.rotation.x = Math.PI/2;
    spacecraft.add(dockRing);

    spacecraft.position.set(0, -300, 0); // Initially far below
    group.add(spacecraft);
    meshes.spacecraft = spacecraft;
    meshes.engines = engineGroup;

    // --- STARS BACKGROUND & ORBITAL DEBRIS ---
    // Add particle system for space dust / stars localized near the skyhook for speed reference
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 2000;
    const positions = new Float32Array(dustCount * 3);
    for(let i=0; i<dustCount*3; i+=3) {
        positions[i] = (Math.random() - 0.5) * 1000;
        positions[i+1] = (Math.random() - 0.5) * 1000;
        positions[i+2] = (Math.random() - 0.5) * 1000;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.6 });
    const spaceDust = new THREE.Points(dustGeo, dustMat);
    group.add(spaceDust);
    meshes.spaceDust = spaceDust;


    // ==========================================
    // PARTS ARRAY - 15+ Highly Detailed Entries
    // ==========================================
    parts.push(
        {
            name: "Central Spindle",
            description: "Massive dark steel core of the Skyhook hub, housing primary gyroscopes and attitude control algorithms.",
            material: "Dark Steel",
            function: "Maintains rotational stability and distributes tension from the tether arms.",
            assemblyOrder: 1,
            connections: ["Habitation Rings", "Radiator Panels", "Tether Arms"],
            failureEffect: "Catastrophic wobble leading to structural tearing and orbital decay.",
            cascadeFailures: ["Upper Arm Snap", "Lower Arm Snap"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 0, z: -100}
        },
        {
            name: "Upper Habitation Ring",
            description: "High-gravity crew quarters and laboratory facilities, rotating to simulate 0.8G.",
            material: "Aluminum & Steel",
            function: "Life support and scientific research during extended orbital missions.",
            assemblyOrder: 2,
            connections: ["Central Spindle", "Life Support Pipelines"],
            failureEffect: "Loss of crew habitat and life support capabilities.",
            cascadeFailures: ["Mission Abort", "Manual Override Failure"],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: 150, z: 0}
        },
        {
            name: "Lower Habitation Ring",
            description: "Low-gravity operational deck (0.3G) for mechanics, tether maintenance, and cargo processing.",
            material: "Aluminum & Steel",
            function: "Houses structural monitoring AI and maintenance drone deployment bays.",
            assemblyOrder: 3,
            connections: ["Central Spindle", "Maintenance Drones"],
            failureEffect: "Inability to repair tether micro-fractures in real-time.",
            cascadeFailures: ["Tether Degradation", "Catastrophic Arm Failure"],
            originalPosition: {x: 0, y: -10, z: 0},
            explodedPosition: {x: 0, y: -150, z: 0}
        },
        {
            name: "Thermal Radiator Array",
            description: "Massive 40-meter panels dissipating extreme heat generated by tension dampers and power cores.",
            material: "Chrome & Superconductive Mesh",
            function: "Prevents thermal meltdown of the central hub during high-energy payload capture.",
            assemblyOrder: 4,
            connections: ["Central Spindle", "Coolant Pumps"],
            failureEffect: "Hub overheating, causing tension cables to lose tensile strength.",
            cascadeFailures: ["Spindle Meltdown", "Hub Explosion"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 100, y: 0, z: 100}
        },
        {
            name: "Upper Tether Arm (Truss)",
            description: "200-meter carbon-nanotube reinforced truss structure. Acts as the upper lever arm.",
            material: "Steel, Carbon Nanotube, Dark Steel",
            function: "Provides the immense leverage required for momentum exchange and payload flinging.",
            assemblyOrder: 5,
            connections: ["Central Spindle", "Counterweight"],
            failureEffect: "Arm snap, sending the counterweight into a rogue trajectory.",
            cascadeFailures: ["Complete Loss of System Angular Momentum", "Station Destruction"],
            originalPosition: {x: 0, y: 30, z: 0},
            explodedPosition: {x: -200, y: 100, z: 0}
        },
        {
            name: "Lower Tether Arm (Truss)",
            description: "200-meter reinforced truss connecting the hub to the grappling mechanism, designed to endure extreme tensile shock.",
            material: "Steel & Green Neon Joints",
            function: "Reaches down into the upper atmosphere to match velocity with suborbital spacecraft.",
            assemblyOrder: 6,
            connections: ["Central Spindle", "Grapple Base"],
            failureEffect: "Arm snap during payload capture, destroying the payload.",
            cascadeFailures: ["Spacecraft Destruction", "Hub De-orbit"],
            originalPosition: {x: 0, y: -30, z: 0},
            explodedPosition: {x: 200, y: -100, z: 0}
        },
        {
            name: "Upper Counterweight Mass",
            description: "A massive solid icosahedron providing the sheer inertia required to anchor the Skyhook's rotation.",
            material: "High-Density Dark Steel",
            function: "Stores rotational kinetic energy. Prevents the hub from being pulled down during payload capture.",
            assemblyOrder: 7,
            connections: ["Upper Tether Arm"],
            failureEffect: "Center of mass shifts drastically, causing immediate atmospheric re-entry.",
            cascadeFailures: ["Total System Loss"],
            originalPosition: {x: 0, y: 230, z: 0},
            explodedPosition: {x: 0, y: 400, z: 0}
        },
        {
            name: "Counterweight Thruster Ring",
            description: "Orbital station-keeping engines mounted on the counterweight.",
            material: "Aluminum & Plasma Injectors",
            function: "Fires periodically to restore orbital altitude lost due to aerodynamic drag and momentum exchange.",
            assemblyOrder: 8,
            connections: ["Upper Counterweight Mass"],
            failureEffect: "Gradual orbital decay over multiple catch-and-release cycles.",
            cascadeFailures: ["Atmospheric Drag", "Station Burn-up"],
            originalPosition: {x: 0, y: 230, z: 0},
            explodedPosition: {x: 0, y: 400, z: 50}
        },
        {
            name: "Grapple Base Collar",
            description: "Thick cylindrical shock-absorber connecting the lower tether arm to the catching mechanism.",
            material: "Steel & Rubber Dampers",
            function: "Absorbs the multi-gigaton kinetic shock when the spacecraft connects.",
            assemblyOrder: 9,
            connections: ["Lower Tether Arm", "Catching Arms"],
            failureEffect: "Shockwave travels up the tether, shattering the central hub.",
            cascadeFailures: ["Tether Shatter", "Spindle Crack"],
            originalPosition: {x: 0, y: -230, z: 0},
            explodedPosition: {x: 0, y: -300, z: 0}
        },
        {
            name: "Primary Catching Arm",
            description: "Articulated mechanical limb with a hydraulic claw, engineered for microsecond-precision capture.",
            material: "Dark Steel & Chrome Pistons",
            function: "Clamps onto the spacecraft's docking ring at a relative velocity of Mach 12.",
            assemblyOrder: 10,
            connections: ["Grapple Base Collar"],
            failureEffect: "Missed capture, forcing the spacecraft to abort or crash.",
            cascadeFailures: ["Payload Loss"],
            originalPosition: {x: 0, y: -230, z: 0},
            explodedPosition: {x: -50, y: -350, z: -50}
        },
        {
            name: "Grapple Sensor Array",
            description: "Highly sensitive LIDAR and radar tracking globe.",
            material: "Tinted Glass & Sensor Nodes",
            function: "Tracks the incoming suborbital spacecraft to guide the mechanical arms.",
            assemblyOrder: 11,
            connections: ["Grapple Base Collar"],
            failureEffect: "Blind capture attempt, 98% probability of catastrophic collision.",
            cascadeFailures: ["Claw Shatter", "Spacecraft Destruction"],
            originalPosition: {x: 0, y: -245, z: 0},
            explodedPosition: {x: 0, y: -300, z: -100}
        },
        {
            name: "Spacecraft Fuselage",
            description: "Aerodynamic gold-foil shielded body of the hypersonic payload vehicle.",
            material: "Gold Foil & Heat Shielding",
            function: "Protects cargo and crew during atmospheric ascent and deep-space transit.",
            assemblyOrder: 12,
            connections: ["Delta Wings", "Main Engines", "Docking Ring"],
            failureEffect: "Hull breach during extreme acceleration.",
            cascadeFailures: ["Explosive Decompression", "Crew Loss"],
            originalPosition: {x: 0, y: -300, z: 0},
            explodedPosition: {x: -200, y: -400, z: 0}
        },
        {
            name: "Delta Wings",
            description: "Swept-back dark steel wings used for aerodynamic lift during suborbital ascent.",
            material: "Dark Steel",
            function: "Allows the spacecraft to reach the upper atmosphere rendezvous point without carrying massive orbital fuel loads.",
            assemblyOrder: 13,
            connections: ["Spacecraft Fuselage"],
            failureEffect: "Loss of aerodynamic control, causing trajectory deviation.",
            cascadeFailures: ["Missed Rendezvous", "Atmospheric Crash"],
            originalPosition: {x: 0, y: -300, z: 0},
            explodedPosition: {x: -250, y: -400, z: 50}
        },
        {
            name: "Main Plasma Engines",
            description: "Triple-array plasma propulsion system.",
            material: "Dark Steel Nozzles, Glowing Plasma",
            function: "Provides the initial thrust to match velocity with the Skyhook's lower tip, and later deep-space navigation.",
            assemblyOrder: 14,
            connections: ["Spacecraft Fuselage"],
            failureEffect: "Failure to reach Mach 12 rendezvous velocity.",
            cascadeFailures: ["Mission Abort"],
            originalPosition: {x: 0, y: -300, z: 0},
            explodedPosition: {x: -200, y: -450, z: 0}
        },
        {
            name: "Spacecraft Docking Ring",
            description: "Reinforced chrome toroid mounted on the spacecraft's nose.",
            material: "Chrome",
            function: "The structural hardpoint where the Skyhook's claws clamp onto.",
            assemblyOrder: 15,
            connections: ["Spacecraft Fuselage"],
            failureEffect: "Ring tears off during momentum exchange, flinging the spacecraft into a random trajectory.",
            cascadeFailures: ["Lost in Space"],
            originalPosition: {x: 0, y: -300, z: 0},
            explodedPosition: {x: -180, y: -380, z: 0}
        }
    );

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary purpose of the Skyhook's massive Counterweight?",
            options: [
                "To house the crew.",
                "To store rotational kinetic energy and anchor the tether.",
                "To generate electricity from solar radiation.",
                "To catch the incoming spacecraft."
            ],
            correctAnswer: 1,
            explanation: "The counterweight acts as an inertial anchor. By having a massive mass at the top, it balances the huge kinetic forces when a payload is caught at the bottom, preventing the Skyhook from tumbling out of orbit."
        },
        {
            question: "Why does the Skyhook utilize a momentum exchange mechanism?",
            options: [
                "To eliminate the need for the spacecraft to reach full orbital velocity using its own fuel.",
                "To cool down the central hub.",
                "To generate a magnetic field.",
                "To communicate with deep space probes."
            ],
            correctAnswer: 0,
            explanation: "A Skyhook's lower tip moves slower relative to the atmosphere, allowing suborbital spacecraft to attach. The Skyhook's rotation then literally throws the spacecraft into orbit or deep space, saving immense amounts of rocket fuel."
        },
        {
            question: "What happens if the Grapple Base Shock Dampers fail during capture?",
            options: [
                "The spacecraft simply bounces off.",
                "The shockwave travels up the tether, potentially shattering the Central Hub.",
                "The engines on the spacecraft shut down safely.",
                "The Counterweight detaches."
            ],
            correctAnswer: 1,
            explanation: "Catching a multi-ton spacecraft traveling at hypersonic speeds generates immense kinetic shock. If the dampers fail, this force propagates up the rigid truss, fracturing the critical central spindle."
        },
        {
            question: "Why are the Central Hub Habitation Rings rotating differently, or shaped as toruses?",
            options: [
                "To look aesthetically pleasing.",
                "To simulate gravity via centrifugal force for the crew.",
                "To store extra fuel in circular tanks.",
                "To act as giant gyroscopes for steering."
            ],
            correctAnswer: 1,
            explanation: "In zero-g, long-term habitation requires simulated gravity to prevent muscle atrophy and bone density loss. Torus rings rotating around a hub provide this via centrifugal force."
        },
        {
            question: "Which component is responsible for compensating orbital altitude lost after a payload is flung?",
            options: [
                "The Spacecraft's Main Engines",
                "The Thermal Radiator Array",
                "The Grapple Sensor Array",
                "The Counterweight Thruster Ring"
            ],
            correctAnswer: 3,
            explanation: "Flinging a payload transfers momentum, slightly lowering the Skyhook's orbit over time. The thrusters on the counterweight fire periodically to 'reboost' the massive structure back into a stable orbit."
        }
    ];

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    let capturePhase = 0; // 0 = waiting, 1 = ascending, 2 = locked/flinging, 3 = released
    
    const animate = (time, speed, meshes) => {
        const globalSpeed = speed * 0.5;
        
        // 1. Rotate the massive Skyhook rotor
        meshes.skyhookRotor.rotation.z -= 0.01 * globalSpeed; // Rotating clockwise

        // 2. Animate central hub components
        meshes.centralHub.children[1].rotation.z += 0.02 * globalSpeed; // Upper hab ring spinning
        meshes.centralHub.children[2].rotation.z -= 0.015 * globalSpeed; // Lower hab ring counter-spin
        
        // Radiators pulsing glow
        const heatIntensity = (Math.sin(time * 2) + 1) * 0.5;
        meshes.radiators.children.forEach(panelPivot => {
            const heatGlow = panelPivot.children[1];
            heatGlow.material.emissiveIntensity = 1 + heatIntensity * 3;
        });

        // 3. Spacecraft capture sequence logic
        const rotorAngle = meshes.skyhookRotor.rotation.z % (Math.PI * 2);
        // Normalize angle to [0, 2PI]
        let normAngle = -rotorAngle;
        while(normAngle < 0) normAngle += Math.PI * 2;
        while(normAngle >= Math.PI * 2) normAngle -= Math.PI * 2;

        // Spacecraft dynamics
        if (capturePhase === 0) {
            // Spacecraft is far below
            meshes.spacecraft.position.set(0, -500, 0);
            meshes.spacecraft.rotation.z = 0;
            // Flare engines
            meshes.engines.children.forEach(eng => {
                eng.children[1].scale.set(1, 1, 1);
            });
            
            // Wait for grapple to be roughly near bottom (angle near PI/2 or 270 deg)
            if (normAngle > 4.5 && normAngle < 4.8) {
                capturePhase = 1;
            }
        } 
        else if (capturePhase === 1) {
            // Ascending to meet grapple
            meshes.spacecraft.position.y += 4 * globalSpeed;
            // Flare engines wildly
            meshes.engines.children.forEach(eng => {
                eng.children[1].scale.set(1, 1.5 + Math.random(), 1);
            });

            // Open grapple claws
            meshes.catchArms.forEach(arm => {
                arm.pivot.rotation.x = THREE.MathUtils.lerp(arm.pivot.rotation.x, -0.5, 0.1);
                arm.piston.position.y = THREE.MathUtils.lerp(arm.piston.position.y, -3, 0.1);
            });

            // Calculate world position of grapple tip
            const grappleWorldPos = new THREE.Vector3();
            meshes.grappleGroup.getWorldPosition(grappleWorldPos);

            if (meshes.spacecraft.position.y >= grappleWorldPos.y - 5) {
                capturePhase = 2;
                meshes.spacecraft.position.set(0, -35, 0); // Attach relative to grapple
                meshes.grappleGroup.add(meshes.spacecraft);
            }
        }
        else if (capturePhase === 2) {
            // Locked and Flinging
            // Close grapple claws tightly
            meshes.catchArms.forEach(arm => {
                arm.pivot.rotation.x = THREE.MathUtils.lerp(arm.pivot.rotation.x, 0.2, 0.2);
                arm.piston.position.y = THREE.MathUtils.lerp(arm.piston.position.y, -5, 0.2);
            });

            // Engines off
            meshes.engines.children.forEach(eng => {
                eng.children[1].scale.set(1, 0.1, 1);
            });

            // Fling release when grapple reaches top (angle near PI/2)
            if (normAngle > 1.4 && normAngle < 1.7) {
                capturePhase = 3;
                // Detach to global space
                const releasePos = new THREE.Vector3();
                meshes.spacecraft.getWorldPosition(releasePos);
                const releaseRot = new THREE.Euler();
                meshes.spacecraft.getWorldQuaternion(new THREE.Quaternion()).set(releaseRot.x, releaseRot.y, releaseRot.z);
                
                group.add(meshes.spacecraft);
                meshes.spacecraft.position.copy(releasePos);
                // Retain current visual rotation for fling
                meshes.spacecraft.rotation.set(0, 0, normAngle);
            }
        }
        else if (capturePhase === 3) {
            // Flung into deep space
            meshes.spacecraft.position.x += Math.cos(normAngle) * 5 * globalSpeed;
            meshes.spacecraft.position.y += Math.sin(normAngle) * 5 * globalSpeed;
            
            // Engines back on
            meshes.engines.children.forEach(eng => {
                eng.children[1].scale.set(1, 2 + Math.random(), 1);
            });

            if (meshes.spacecraft.position.length() > 800) {
                capturePhase = 0; // Reset cycle
            }
        }

        // 4. Parallax Space Dust (move downwards slightly to simulate orbital speed)
        const dustPositions = meshes.spaceDust.geometry.attributes.position.array;
        for(let i=1; i<dustPositions.length; i+=3) {
            dustPositions[i] -= 2 * globalSpeed; // Y axis fall
            if (dustPositions[i] < -500) {
                dustPositions[i] = 500;
            }
        }
        meshes.spaceDust.geometry.attributes.position.needsUpdate = true;
    };

    return { group, parts, description: "Orbital Momentum Exchange Tether (Skyhook)", quizQuestions, animate };
}
