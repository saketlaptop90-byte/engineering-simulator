import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --------------------------------------------------------
    // 1. Central Star Core
    // --------------------------------------------------------
    const starCoreGeo = new THREE.SphereGeometry(150, 64, 64);
    const starCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffee,
        emissiveIntensity: 5.0,
        roughness: 0,
        metalness: 0
    });
    const starCore = new THREE.Mesh(starCoreGeo, starCoreMat);
    group.add(starCore);
    meshes.starCore = starCore;
    parts.push({
        name: 'CentralStarCore',
        description: 'The captive G-type main sequence star providing energy, gravity, and light to the Ringworld.',
        material: 'Plasma / Stellar Matter',
        function: 'Energy generation and illumination.',
        assemblyOrder: 1,
        connections: ['StarCorona', 'ShadowSquareArray'],
        failureEffect: 'Total collapse of the ecosystem, extreme freezing, and loss of gravitational anchoring.',
        cascadeFailures: ['All biological systems', 'Energy grids', 'Orbital stability'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3000, z: 0 }
    });

    // --------------------------------------------------------
    // 2. Star Corona and Containment Field
    // --------------------------------------------------------
    const starCoronaGeo = new THREE.SphereGeometry(155, 64, 64);
    const starCoronaMat = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const starCorona = new THREE.Mesh(starCoronaGeo, starCoronaMat);
    group.add(starCorona);
    meshes.starCorona = starCorona;
    parts.push({
        name: 'StarCorona',
        description: 'Magnetic containment fields managing stellar flares and coronal mass ejections.',
        material: 'Electromagnetic Energy Field',
        function: 'Preventing solar flares from scorching the inner surface of the Ringworld.',
        assemblyOrder: 2,
        connections: ['CentralStarCore'],
        failureEffect: 'Scorching of biomes by uncontrolled solar flares.',
        cascadeFailures: ['InnerBiosphere', 'AtmosphereContainmentField'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3500, z: 0 }
    });

    // --------------------------------------------------------
    // Shadow Squares (Independent orbit around star)
    // --------------------------------------------------------
    const shadowSquareOrbitRadius = 800;
    const shadowSquaresGroup = new THREE.Group();
    const numSquares = 20;
    const squareGeo = new THREE.BoxGeometry(200, 10, 450);
    const squareMat = new THREE.MeshStandardMaterial({ 
        color: 0x050505, 
        roughness: 0.9,
        metalness: 0.1 
    });
    
    for (let i = 0; i < numSquares; i++) {
        const angle = (i / numSquares) * Math.PI * 2;
        const square = new THREE.Mesh(squareGeo, squareMat);
        square.position.x = Math.cos(angle) * shadowSquareOrbitRadius;
        square.position.y = Math.sin(angle) * shadowSquareOrbitRadius;
        square.rotation.z = angle;
        
        // Add solar collectors on the sun-facing side
        const collectorGeo = new THREE.PlaneGeometry(180, 430);
        const collectorMat = new THREE.MeshStandardMaterial({
            color: 0x001133,
            emissive: 0x002266,
            roughness: 0.2,
            metalness: 1.0
        });
        const collector = new THREE.Mesh(collectorGeo, collectorMat);
        collector.rotation.x = Math.PI / 2;
        collector.position.y = -5.1;
        square.add(collector);

        shadowSquaresGroup.add(square);
    }
    group.add(shadowSquaresGroup);
    meshes.shadowSquaresGroup = shadowSquaresGroup;
    parts.push({
        name: 'ShadowSquareArray',
        description: 'Massive rectangular panels orbiting the star to create a day/night cycle on the Ringworld.',
        material: 'Dark Matter / Super-Steel',
        function: 'Simulate day and night by casting vast shadows on the inner surface.',
        assemblyOrder: 3,
        connections: ['ShadowSquareWire', 'CentralStarCore'],
        failureEffect: 'Perpetual daylight, leading to extreme overheating and total ecological collapse.',
        cascadeFailures: ['InnerBiosphere', 'GreatOcean', 'SpillMountains'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4000, z: 0 }
    });

    const wireGeo = new THREE.TorusGeometry(shadowSquareOrbitRadius, 1.5, 16, 256);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x333333, emissive: 0x111111, metalness: 1 });
    const shadowWire = new THREE.Mesh(wireGeo, wireMat);
    shadowSquaresGroup.add(shadowWire); 
    meshes.shadowWire = shadowWire;
    parts.push({
        name: 'ShadowSquareWire',
        description: 'Ultra-tensile monofilament cables connecting the shadow squares in their inner orbit.',
        material: 'Monofilament / Scrith-alloy',
        function: 'Maintain precise orbital stability and spacing of the shadow square array.',
        assemblyOrder: 4,
        connections: ['ShadowSquareArray'],
        failureEffect: 'Shadow squares break formation, orbit destabilizes, potentially colliding with the ring.',
        cascadeFailures: ['RingHull', 'CentralStarCore'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4500, z: 0 }
    });

    // --------------------------------------------------------
    // Massive Ring Structure (Grouped for unified rotation)
    // --------------------------------------------------------
    const ringGroup = new THREE.Group();
    group.add(ringGroup);
    meshes.ringGroup = ringGroup;

    const ringRadius = 2500;
    const ringWidth = 800;

    // 3. Ring Hull (Scrith Foundation)
    const hullGeo = new THREE.CylinderGeometry(ringRadius + 20, ringRadius + 20, ringWidth, 256, 1, true);
    const hullMat = darkSteel.clone();
    hullMat.side = THREE.DoubleSide;
    hullMat.roughness = 0.8;
    const ringHull = new THREE.Mesh(hullGeo, hullMat);
    ringHull.rotation.x = Math.PI / 2;
    ringGroup.add(ringHull);
    meshes.ringHull = ringHull;
    parts.push({
        name: 'RingHull',
        description: 'The indestructible foundation material (Scrith) of the Ringworld, capable of blocking 40% of neutrinos.',
        material: 'Scrith',
        function: 'Tensile structural integrity and impenetrable foundation for the entire megastructure.',
        assemblyOrder: 5,
        connections: ['RimWallNorth', 'RimWallSouth', 'InnerBiosphere', 'AttitudeJetsArray'],
        failureEffect: 'Structural breach, catastrophic atmosphere loss, and complete fragmentation.',
        cascadeFailures: ['Everything'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4000 }
    });

    // 4 & 5. Rim Walls
    const rimWallGeo = new THREE.TorusGeometry(ringRadius + 10, 40, 32, 256);
    const rimWallMat = steel.clone();
    
    const rimWallNorth = new THREE.Mesh(rimWallGeo, rimWallMat);
    rimWallNorth.position.z = -ringWidth / 2;
    ringGroup.add(rimWallNorth);
    meshes.rimWallNorth = rimWallNorth;
    parts.push({
        name: 'RimWallNorth',
        description: '1000-mile high retaining wall to hold the atmosphere on the ring structure (North edge).',
        material: 'Scrith / Hyper-Steel',
        function: 'Atmosphere containment and magnetic shielding.',
        assemblyOrder: 6,
        connections: ['RingHull', 'SpillMountains'],
        failureEffect: 'Atmospheric venting into the vacuum of space.',
        cascadeFailures: ['InnerBiosphere', 'AtmosphereContainmentField'],
        originalPosition: { x: 0, y: 0, z: -ringWidth / 2 },
        explodedPosition: { x: 0, y: 0, z: -ringWidth - 1500 }
    });

    const rimWallSouth = new THREE.Mesh(rimWallGeo, rimWallMat);
    rimWallSouth.position.z = ringWidth / 2;
    ringGroup.add(rimWallSouth);
    meshes.rimWallSouth = rimWallSouth;
    parts.push({
        name: 'RimWallSouth',
        description: '1000-mile high retaining wall to hold the atmosphere on the ring structure (South edge).',
        material: 'Scrith / Hyper-Steel',
        function: 'Atmosphere containment and magnetic shielding.',
        assemblyOrder: 7,
        connections: ['RingHull', 'SpillMountains'],
        failureEffect: 'Atmospheric venting into the vacuum of space.',
        cascadeFailures: ['InnerBiosphere', 'AtmosphereContainmentField'],
        originalPosition: { x: 0, y: 0, z: ringWidth / 2 },
        explodedPosition: { x: 0, y: 0, z: ringWidth + 1500 }
    });

    // 8. Inner Biosphere
    const bioGeo = new THREE.CylinderGeometry(ringRadius, ringRadius, ringWidth - 5, 256, 64, true);
    const bioMat = new THREE.MeshStandardMaterial({
        color: 0x1B4D3E,
        roughness: 0.95,
        side: THREE.BackSide,
        wireframe: false
    });
    
    // Procedural terrain generation on the inner surface
    const bioPos = bioGeo.attributes.position;
    for (let i = 0; i < bioPos.count; i++) {
        const x = bioPos.getX(i);
        const y = bioPos.getY(i);
        const z = bioPos.getZ(i);
        
        const noise1 = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 3;
        const noise2 = Math.sin(y * 0.1) * Math.cos(x * 0.05) * 2;
        const noise = noise1 + noise2;
        
        const len = Math.sqrt(x*x + z*z);
        const newLen = len - Math.abs(noise); 
        bioPos.setX(i, (x / len) * newLen);
        bioPos.setZ(i, (z / len) * newLen);
    }
    bioGeo.computeVertexNormals();
    const innerBiosphere = new THREE.Mesh(bioGeo, bioMat);
    innerBiosphere.rotation.x = Math.PI / 2;
    ringGroup.add(innerBiosphere);
    meshes.innerBiosphere = innerBiosphere;
    parts.push({
        name: 'InnerBiosphere',
        description: 'The livable surface area of the Ringworld, three million times the surface area of Earth.',
        material: 'Soil / Organic Matter / Silicates',
        function: 'Primary habitat for trillions of sapient and non-sapient beings.',
        assemblyOrder: 8,
        connections: ['RingHull', 'GreatOcean', 'SpillMountains'],
        failureEffect: 'Mass extinction events and habitat desertification.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2500 }
    });

    // 9. Great Ocean
    const oceanGeo = new THREE.CylinderGeometry(ringRadius - 1.5, ringRadius - 1.5, ringWidth * 0.4, 256, 1, true);
    const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x004477,
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
        side: THREE.BackSide
    });
    const greatOcean = new THREE.Mesh(oceanGeo, oceanMat);
    greatOcean.rotation.x = Math.PI / 2;
    ringGroup.add(greatOcean);
    meshes.greatOcean = greatOcean;
    parts.push({
        name: 'GreatOcean',
        description: 'A massive body of water spanning the center of the ring, deeper than any Earth ocean.',
        material: 'H2O / Saline Solution',
        function: 'Climate regulation, hydration, complex weather pattern generation, and marine habitat.',
        assemblyOrder: 9,
        connections: ['InnerBiosphere'],
        failureEffect: 'Extreme drought, climatic chaos, and death of the biosphere.',
        cascadeFailures: ['InnerBiosphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3000 }
    });

    // 10. Attitude Jets Array
    const jetsGroup = new THREE.Group();
    const jetGeo = new THREE.ConeGeometry(35, 120, 16);
    const jetMat = chrome.clone();
    const numJets = 48;
    for (let i = 0; i < numJets; i++) {
        const angle = (i / numJets) * Math.PI * 2;
        const jet = new THREE.Mesh(jetGeo, jetMat);
        jet.position.x = Math.cos(angle) * (ringRadius + 40);
        jet.position.y = Math.sin(angle) * (ringRadius + 40);
        
        jet.position.z = (i % 2 === 0) ? -ringWidth / 2 - 25 : ringWidth / 2 + 25;
        
        jet.rotation.x = Math.PI / 2; 
        jet.rotation.z = angle - Math.PI / 2;
        
        // Thrust plumes
        const plumeGeo = new THREE.CylinderGeometry(6, 25, 200, 16);
        const plumeMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
        const plume = new THREE.Mesh(plumeGeo, plumeMat);
        plume.position.y = -130;
        
        // Secondary inner plume
        const innerPlumeGeo = new THREE.CylinderGeometry(2, 10, 180, 16);
        const innerPlumeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
        const innerPlume = new THREE.Mesh(innerPlumeGeo, innerPlumeMat);
        plume.add(innerPlume);

        jet.add(plume);
        jetsGroup.add(jet);
    }
    ringGroup.add(jetsGroup);
    meshes.jetsGroup = jetsGroup;
    parts.push({
        name: 'AttitudeJetsArray',
        description: 'Monstrous Bussard ramjets mounted on the rims, powered by the suns magnetic field.',
        material: 'Super-alloys / Chrome / Scrith',
        function: 'Orbital station-keeping, preventing the dynamically unstable ring from drifting into the sun.',
        assemblyOrder: 10,
        connections: ['RingHull', 'RimWallNorth', 'RimWallSouth'],
        failureEffect: 'Ringworld drifts into the sun, resulting in complete vaporization.',
        cascadeFailures: ['CentralStarCore', 'RingHull', 'Everything'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5000, y: 0, z: 0 }
    });

    // 11. Spill Mountains
    const spillMountainsGroup = new THREE.Group();
    const mountainGeo = new THREE.ConeGeometry(45, 250, 12);
    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9, side: THREE.BackSide });
    
    for(let i=0; i<150; i++) {
        const m = new THREE.Mesh(mountainGeo, mountainMat);
        const angle = Math.random() * Math.PI * 2;
        const r = ringRadius - 10;
        m.position.x = Math.cos(angle) * r;
        m.position.y = Math.sin(angle) * r;
        m.position.z = (Math.random() > 0.5 ? 1 : -1) * (ringWidth / 2 - 40);
        
        m.lookAt(0, 0, m.position.z);
        spillMountainsGroup.add(m);
    }
    ringGroup.add(spillMountainsGroup);
    meshes.spillMountainsGroup = spillMountainsGroup;
    parts.push({
        name: 'SpillMountains',
        description: 'Gigantic artificial mountain ranges constructed to capture atmosphere and soil escaping outward.',
        material: 'Bedrock / Scrith',
        function: 'Erosion control, atmospheric dynamics, and recycling of biological matter.',
        assemblyOrder: 11,
        connections: ['InnerBiosphere', 'RimWallNorth', 'RimWallSouth'],
        failureEffect: 'Loss of fertile soil over the rim, eventual barrenness of the outer edges.',
        cascadeFailures: ['InnerBiosphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3000 }
    });

    // 12. Atmosphere Containment Field
    const fieldGeo = new THREE.CylinderGeometry(ringRadius - 50, ringRadius - 50, ringWidth + 10, 128, 1, true);
    const fieldMat = new THREE.MeshBasicMaterial({ 
        color: 0x66ccff, 
        transparent: true, 
        opacity: 0.05, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const containmentField = new THREE.Mesh(fieldGeo, fieldMat);
    containmentField.rotation.x = Math.PI / 2;
    ringGroup.add(containmentField);
    meshes.containmentField = containmentField;
    parts.push({
        name: 'AtmosphereContainmentField',
        description: 'Electromagnetic shield capping the upper atmosphere across the entire 800-width.',
        material: 'Plasma Shield / Electromagnetism',
        function: 'Secondary atmospheric retention, preventing solar wind from stripping the air.',
        assemblyOrder: 12,
        connections: ['RimWallNorth', 'RimWallSouth'],
        failureEffect: 'Gradual loss of atmospheric pressure over millennia.',
        cascadeFailures: ['InnerBiosphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4500, z: 0 }
    });

    // 13. Meteor Defense Lasers
    const laserGroup = new THREE.Group();
    const cannonBaseGeo = new THREE.BoxGeometry(25, 25, 25);
    const cannonBarrelGeo = new THREE.CylinderGeometry(3, 3, 50, 8);
    const laserMat = aluminum.clone();
    
    for (let i=0; i<180; i++) {
        const angle = (i / 180) * Math.PI * 2;
        const base = new THREE.Mesh(cannonBaseGeo, laserMat);
        base.position.x = Math.cos(angle) * (ringRadius + 35);
        base.position.y = Math.sin(angle) * (ringRadius + 35);
        base.position.z = (Math.random() - 0.5) * ringWidth;
        
        base.lookAt(base.position.x * 2, base.position.y * 2, base.position.z * 2);
        
        const barrel = new THREE.Mesh(cannonBarrelGeo, laserMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = 25;
        base.add(barrel);
        
        laserGroup.add(base);
    }
    ringGroup.add(laserGroup);
    meshes.laserGroup = laserGroup;
    parts.push({
        name: 'MeteorDefenseLasers',
        description: 'Automated high-energy laser batteries to vaporize incoming asteroids before impact.',
        material: 'Aluminum / Titanium / Plasma Emitting Diodes',
        function: 'Defend the vulnerable outer hull from catastrophic hypervelocity impacts.',
        assemblyOrder: 13,
        connections: ['RingHull'],
        failureEffect: 'Asteroid impacts puncture the hull, venting atmosphere in massive hurricanes.',
        cascadeFailures: ['RingHull', 'InnerBiosphere', 'AtmosphereContainmentField'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5500, z: 0 }
    });

    // 14. Spaceport Hubs
    const hubsGroup = new THREE.Group();
    const hubGeo = new THREE.TorusGeometry(80, 15, 16, 64);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.position.x = Math.cos(angle) * (ringRadius + 150);
        hub.position.y = Math.sin(angle) * (ringRadius + 150);
        hub.position.z = 0;
        
        hub.rotation.x = Math.PI / 2;
        hub.rotation.y = angle;
        
        const spokeGeo = new THREE.CylinderGeometry(4, 4, 160);
        const spoke1 = new THREE.Mesh(spokeGeo, hubMat);
        const spoke2 = new THREE.Mesh(spokeGeo, hubMat);
        spoke2.rotation.y = Math.PI / 2;
        hub.add(spoke1);
        hub.add(spoke2);
        
        const dockingCore = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 20), tinted.clone());
        hub.add(dockingCore);

        hubsGroup.add(hub);
    }
    ringGroup.add(hubsGroup);
    meshes.hubsGroup = hubsGroup;
    parts.push({
        name: 'SpaceportHubs',
        description: 'Massive orbital docking stations attached to the underside of the ring for deep space ships.',
        material: 'High-Tech Alloys / Tinted Glass',
        function: 'Interstellar trade, docking, transit, and quarantine zones.',
        assemblyOrder: 14,
        connections: ['RingHull', 'MagLevTransportNetwork'],
        failureEffect: 'Isolation from interstellar commerce and travel.',
        cascadeFailures: ['MagLevTransportNetwork'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6000, y: 0, z: 0 }
    });

    // 15. MagLev Transport Network
    const transportGeo = new THREE.TorusGeometry(ringRadius + 25, 6, 16, 256);
    const transportMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xaa0000, metalness: 0.7 });
    
    const transportRing1 = new THREE.Mesh(transportGeo, transportMat);
    transportRing1.position.z = -ringWidth / 4;
    ringGroup.add(transportRing1);
    
    const transportRing2 = new THREE.Mesh(transportGeo, transportMat);
    transportRing2.position.z = ringWidth / 4;
    ringGroup.add(transportRing2);
    
    meshes.transportRings = [transportRing1, transportRing2];
    
    parts.push({
        name: 'MagLevTransportNetwork',
        description: 'Vacuum-tube magnetic levitation trains circling the exterior hull.',
        material: 'Superconductors / Copper / Steel',
        function: 'Rapid transport of goods, resources, and populations around the 600-million-mile circumference.',
        assemblyOrder: 15,
        connections: ['RingHull', 'SpaceportHubs'],
        failureEffect: 'Massive logistical disruptions; localized famine.',
        cascadeFailures: ['SpaceportHubs'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5000 }
    });

    // 16. Radiator Fins
    const radiatorGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(120, 300, 6);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
    
    for (let i = 0; i < 720; i += 2) {
        const angle = (i / 720) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, finMat);
        fin.position.x = Math.cos(angle) * (ringRadius + 180);
        fin.position.y = Math.sin(angle) * (ringRadius + 180);
        
        fin.rotation.z = angle + Math.PI / 2;
        fin.position.z = (i % 4 === 0) ? -ringWidth / 3 : ringWidth / 3;
        
        radiatorGroup.add(fin);
    }
    ringGroup.add(radiatorGroup);
    meshes.radiatorGroup = radiatorGroup;
    parts.push({
        name: 'RadiatorFins',
        description: 'Extensive arrays of giant cooling fins extending into space to dissipate internal heat.',
        material: 'Thermal Graphene / DarkSteel',
        function: 'Thermal regulation to prevent the Ringworld from boiling itself.',
        assemblyOrder: 16,
        connections: ['RingHull'],
        failureEffect: 'Overheating of the Ringworld, vaporizing the Great Ocean and melting the inner crust.',
        cascadeFailures: ['InnerBiosphere', 'GreatOcean', 'SpillMountains'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5500, z: 0 }
    });

    // 17. Maintenance Scaffolding (Details)
    const scaffoldGroup = new THREE.Group();
    const scaffoldGeo = new THREE.CylinderGeometry(1.5, 1.5, 250, 6);
    const scaffoldMat = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
    
    for (let i = 0; i < 150; i++) {
        const scaffold = new THREE.Mesh(scaffoldGeo, scaffoldMat);
        const angle = Math.random() * Math.PI * 2;
        scaffold.position.x = Math.cos(angle) * (ringRadius + 40);
        scaffold.position.y = Math.sin(angle) * (ringRadius + 40);
        scaffold.position.z = (Math.random() - 0.5) * ringWidth;
        scaffold.rotation.x = Math.random() * Math.PI;
        scaffold.rotation.y = Math.random() * Math.PI;
        scaffoldGroup.add(scaffold);
    }
    ringGroup.add(scaffoldGroup);
    meshes.scaffoldGroup = scaffoldGroup;
    parts.push({
        name: 'MaintenanceScaffolding',
        description: 'Automated repair and maintenance drones traversing vast external scaffolding.',
        material: 'Titanium / Steel Matrix',
        function: 'Hull repair, sensor arrays alignment, and general upkeep.',
        assemblyOrder: 17,
        connections: ['RingHull'],
        failureEffect: 'Gradual degradation of exterior systems over thousands of years.',
        cascadeFailures: ['RadiatorFins', 'MeteorDefenseLasers', 'AttitudeJetsArray'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 7000, y: 0, z: 0 }
    });

    // Ambient Lighting
    const starLight = new THREE.PointLight(0xffffee, 2.5, 8000);
    group.add(starLight);
    meshes.starLight = starLight;

    const description = "The Megastructure Ringworld: A hyper-massive artificial habitat encircling a captive star. It boasts a livable surface area three million times that of Earth. Features include day/night shadow squares, massive rim walls for atmospheric retention, attitude jets for orbital stabilization, and towering spill mountains to catch eroding biomes.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Shadow Square Array?",
            options: [
                "To generate power for the Ringworld",
                "To cast shadows simulating a day/night cycle",
                "To defend against meteor impacts",
                "To hold the atmosphere in place"
            ],
            correctAnswer: 1,
            explanation: "The Shadow Squares orbit closer to the central star and cast massive shadows on the ring, providing a day and night cycle for the inhabitants."
        },
        {
            question: "Why are Attitude Jets critically required on the Ringworld's rims?",
            options: [
                "To travel through the galaxy",
                "To create wind on the inner surface",
                "To maintain orbital stability and prevent collision with the central star",
                "To vent waste heat from the Great Oceans"
            ],
            correctAnswer: 2,
            explanation: "The Ringworld is dynamically unstable in its plane. Attitude jets are needed to fire and push it back if it drifts toward the central star, preventing vaporization."
        },
        {
            question: "What purpose do the Spill Mountains serve?",
            options: [
                "Aesthetic scenery for the inhabitants",
                "To mine rare minerals from the deep crust",
                "To capture atmosphere and soil that erodes toward the rim walls",
                "They act as antennas for interstellar communication hubs"
            ],
            correctAnswer: 2,
            explanation: "Spill Mountains catch soil, water, and atmosphere that centrifugal forces push towards the edges, preventing loss over the rim walls and into space."
        },
        {
            question: "What material makes up the foundation (hull) of the Ringworld?",
            options: [
                "Titanium alloy",
                "Carbon nanotubes",
                "Scrith, a nearly indestructible artificial material",
                "Compressed stellar matter"
            ],
            correctAnswer: 2,
            explanation: "Scrith is the fictional, incredibly dense and strong foundation material of the Ringworld, capable of withstanding the extreme tensile forces of the spinning megastructure."
        },
        {
            question: "How is the atmosphere primarily held within the Ringworld?",
            options: [
                "By a complete glass dome covering the entire ring",
                "By planetary gravity alone",
                "By 1000-mile high rim walls on the edges, aided by centrifugal force",
                "It is constantly replenished from massive gas giants in orbit"
            ],
            correctAnswer: 2,
            explanation: "Centrifugal force (spin gravity) holds the air against the floor, while 1000-mile high rim walls prevent it from spilling out into space sideways."
        }
    ];

    // Animation states
    let shadowSquareAngle = 0;

    function animate(time, speed, meshes) {
        if (meshes.starCorona) {
            meshes.starCorona.rotation.y = time * 0.2 * speed;
            meshes.starCorona.rotation.z = time * 0.1 * speed;
            
            const scale = 1.0 + Math.sin(time * 2 * speed) * 0.015;
            meshes.starCore.scale.set(scale, scale, scale);
            meshes.starCorona.scale.set(scale + 0.01, scale + 0.01, scale + 0.01);
            
            if(meshes.starLight) {
                meshes.starLight.intensity = 2.5 + Math.sin(time * 15 * speed) * 0.15;
            }
        }

        if (meshes.shadowSquaresGroup) {
            shadowSquareAngle += 0.008 * speed;
            meshes.shadowSquaresGroup.rotation.z = shadowSquareAngle;
            // Slightly wobble the wire to simulate tension
            meshes.shadowWire.rotation.x = Math.sin(time * speed) * 0.01;
        }

        // Spin the entire ring complex
        if (meshes.ringGroup) {
            meshes.ringGroup.rotation.z += 0.002 * speed;
        }

        // The Attitude Jets pulse sequentially
        if (meshes.jetsGroup) {
            meshes.jetsGroup.children.forEach((jet, i) => {
                const plume = jet.children[0];
                if (plume) {
                    const active = Math.sin(time * 8 * speed + i * 0.5) > 0.4;
                    plume.scale.y = active ? 1.0 + Math.random() * 0.3 : 0.05;
                    plume.material.opacity = active ? 0.8 : 0.0;
                    
                    const innerPlume = plume.children[0];
                    if (innerPlume) {
                        innerPlume.scale.y = active ? 1.0 + Math.random() * 0.2 : 0.05;
                        innerPlume.material.opacity = active ? 1.0 : 0.0;
                    }
                }
            });
        }
        
        // Transport Network Rings spin at a different rate
        if (meshes.transportRings) {
            meshes.transportRings[0].rotation.z += 0.015 * speed;
            meshes.transportRings[1].rotation.z -= 0.012 * speed; // Counter-rotating maglev trains
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
