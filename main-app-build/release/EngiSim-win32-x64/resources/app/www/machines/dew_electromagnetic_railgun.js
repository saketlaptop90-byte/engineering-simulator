import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const animationState = {
        chargeLevel: 0,
        firing: false,
        recoilTimer: 0,
        armaturePos: 0,
        turretAngle: 0,
        elevationAngle: 0,
        timeElapsed: 0
    };

    // Custom High-Tech Materials
    const plasmaEmissive = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const warningRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        roughness: 0.4
    });

    const heatGlow = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 0.0, // Dynamic during animation
        roughness: 0.6,
        metalness: 0.7
    });

    const heavilyScratchedArmor = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        roughness: 0.8,
        metalness: 0.6,
        bumpScale: 0.05
    });

    // Helper: Create thick armor plating using ExtrudeGeometry
    function createHexArmor(width, length, thickness) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(width, 0);
        shape.lineTo(width + 2, length * 0.2);
        shape.lineTo(width, length);
        shape.lineTo(0, length);
        shape.lineTo(-2, length * 0.2);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.2,
            bevelThickness: 0.2
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // Helper: Create complex Lathe geometry for base and joints
    function createLatheHub(radius, height, segments) {
        const points = [];
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const r = radius * (1 - 0.2 * Math.sin(t * Math.PI));
            points.push(new THREE.Vector2(r, t * height));
        }
        return new THREE.LatheGeometry(points, segments);
    }

    // --------------------------------------------------------
    // Part 1: Foundation Platform
    // --------------------------------------------------------
    const foundationGroup = new THREE.Group();
    const foundationGeo = createLatheHub(20, 5, 64);
    const foundationMesh = new THREE.Mesh(foundationGeo, heavilyScratchedArmor);
    foundationMesh.rotation.x = -Math.PI / 2;
    foundationGroup.add(foundationMesh);

    // Add hundreds of anchor bolts
    for(let i=0; i<36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const boltGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 12);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(Math.cos(angle) * 18, 0.75, Math.sin(angle) * 18);
        foundationGroup.add(bolt);
    }

    parts.push({
        name: "Foundation Platform",
        description: "Massive reinforced trunnion base embedded in bedrock, providing stability against the immense recoil of hypersonic projectile launches.",
        material: "Reinforced Plasteel",
        function: "Absorbs recoil forces and houses the primary subterranean power couplings.",
        assemblyOrder: 1,
        connections: ["Azimuth Swivel Ring"],
        failureEffect: "Catastrophic structural failure upon firing, launching the entire gun assembly backward.",
        cascadeFailures: ["Complete systemic destruction", "Power core breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });
    group.add(foundationGroup);
    meshes.foundation = foundationGroup;

    // --------------------------------------------------------
    // Part 2: Azimuth Swivel Ring (Turret Base)
    // --------------------------------------------------------
    const swivelGroup = new THREE.Group();
    swivelGroup.position.y = 5;
    const swivelGeo = new THREE.TorusGeometry(15, 2, 32, 100);
    const swivelMesh = new THREE.Mesh(swivelGeo, steel);
    swivelMesh.rotation.x = Math.PI / 2;
    swivelGroup.add(swivelMesh);

    // Add gear teeth to the swivel ring
    for(let i=0; i<120; i++) {
        const angle = (i / 120) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 2), darkSteel);
        tooth.position.set(Math.cos(angle) * 16.5, 0, Math.sin(angle) * 16.5);
        tooth.lookAt(0, 0, 0);
        swivelGroup.add(tooth);
    }

    parts.push({
        name: "Azimuth Swivel Ring",
        description: "Giant electromagnetically driven gear ring allowing the turret 360-degree rotation in milliseconds.",
        material: "Titanium-Tungsten Alloy",
        function: "Provides horizontal targeting rotation.",
        assemblyOrder: 2,
        connections: ["Foundation Platform", "Main Turret Housing"],
        failureEffect: "Turret becomes locked in a single horizontal vector.",
        cascadeFailures: ["Targeting optics misalignment", "Servo motor burnout"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -20 }
    });
    group.add(swivelGroup);
    meshes.swivel = swivelGroup;

    // --------------------------------------------------------
    // Part 3: Main Turret Housing
    // --------------------------------------------------------
    const housingGroup = new THREE.Group();
    housingGroup.position.y = 6;
    
    // Core structure
    const housingCoreGeo = new THREE.CylinderGeometry(14, 16, 12, 16);
    const housingCoreMesh = new THREE.Mesh(housingCoreGeo, heavilyScratchedArmor);
    housingGroup.add(housingCoreMesh);

    // Complex armor plating on the housing
    for(let i=0; i<8; i++) {
        const armorMesh = new THREE.Mesh(createHexArmor(6, 10, 1.5), darkSteel);
        const angle = (i / 8) * Math.PI * 2;
        armorMesh.position.set(Math.cos(angle) * 14, -5, Math.sin(angle) * 14);
        armorMesh.lookAt(0, -5, 0);
        housingGroup.add(armorMesh);
    }

    parts.push({
        name: "Main Turret Housing",
        description: "Heavily armored superstructure protecting the sensitive capacitor relays and elevation trunnions.",
        material: "Depleted Uranium Composite",
        function: "Armored protection and structural mount for the railgun barrel.",
        assemblyOrder: 3,
        connections: ["Azimuth Swivel Ring", "Elevation Hydraulics", "Capacitor Banks"],
        failureEffect: "Exposes critical internal systems to enemy fire.",
        cascadeFailures: ["Capacitor breach", "Elevation servo damage"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });
    swivelGroup.add(housingGroup); // Attached to swivel for rotation
    meshes.housing = housingGroup;

    // --------------------------------------------------------
    // Part 4 & 5: Elevation Hydraulics (Left & Right)
    // --------------------------------------------------------
    function createHydraulicSystem(isLeft) {
        const hydGroup = new THREE.Group();
        const sign = isLeft ? 1 : -1;
        hydGroup.position.set(sign * 9, 2, 8); // Offset from housing center

        // Outer cylinder
        const outerGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
        const outer = new THREE.Mesh(outerGeo, steel);
        outer.rotation.x = Math.PI / 4;
        hydGroup.add(outer);

        // Inner piston (moves during elevation)
        const innerGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = 4;
        inner.rotation.x = Math.PI / 4;
        hydGroup.add(inner);

        // Complex hydraulic lines
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -3, 1),
            new THREE.Vector3(sign * 2, -1, 2),
            new THREE.Vector3(0, 3, 1)
        ]);
        const lineGeo = new THREE.TubeGeometry(lineCurve, 20, 0.3, 8, false);
        const line = new THREE.Mesh(lineGeo, rubber);
        hydGroup.add(line);

        return { root: hydGroup, piston: inner };
    }

    const leftHydraulics = createHydraulicSystem(true);
    const rightHydraulics = createHydraulicSystem(false);
    housingGroup.add(leftHydraulics.root);
    housingGroup.add(rightHydraulics.root);

    parts.push({
        name: "Port Elevation Hydraulics",
        description: "Massive dual-piston liquid-metal hydraulic actuator for raising the heavy railgun barrel.",
        material: "Tungsten/Graphene, Synthetic Hydraulic Fluid",
        function: "Controls the pitch (elevation) of the weapon.",
        assemblyOrder: 4,
        connections: ["Main Turret Housing", "Rail Bracing Structure"],
        failureEffect: "Inability to target aerial or orbital threats.",
        cascadeFailures: ["Asymmetric barrel stress", "Right hydraulic overload"],
        originalPosition: { x: 9, y: 2, z: 8 },
        explodedPosition: { x: 25, y: 5, z: 15 }
    });
    meshes.leftPiston = leftHydraulics;

    parts.push({
        name: "Starboard Elevation Hydraulics",
        description: "Massive dual-piston liquid-metal hydraulic actuator mirroring the port system.",
        material: "Tungsten/Graphene, Synthetic Hydraulic Fluid",
        function: "Assists in controlling the pitch (elevation) of the weapon.",
        assemblyOrder: 5,
        connections: ["Main Turret Housing", "Rail Bracing Structure"],
        failureEffect: "Inability to depress weapon.",
        cascadeFailures: ["Port hydraulic overload"],
        originalPosition: { x: -9, y: 2, z: 8 },
        explodedPosition: { x: -25, y: 5, z: 15 }
    });
    meshes.rightPiston = rightHydraulics;

    // --------------------------------------------------------
    // Weapon Elevation Group (The part that tilts up and down)
    // --------------------------------------------------------
    const weaponElevationGroup = new THREE.Group();
    weaponElevationGroup.position.set(0, 8, -4);
    housingGroup.add(weaponElevationGroup);
    meshes.weaponElevation = weaponElevationGroup;

    // --------------------------------------------------------
    // Part 6: Capacitor Bank Array
    // --------------------------------------------------------
    const capacitorGroup = new THREE.Group();
    capacitorGroup.position.set(0, -2, -10);
    
    // Generate dozens of cylindrical ultracapacitors
    const capArrayWidth = 5;
    const capArrayLength = 4;
    for(let w = -capArrayWidth; w <= capArrayWidth; w += 2.5) {
        for(let l = -capArrayLength; l <= capArrayLength; l += 2.5) {
            const cap = new THREE.Group();
            cap.position.set(w, 0, l);

            const baseGeo = new THREE.CylinderGeometry(1, 1, 6, 16);
            const baseMesh = new THREE.Mesh(baseGeo, copper);
            cap.add(baseMesh);

            const glowRingGeo = new THREE.TorusGeometry(1.05, 0.15, 8, 32);
            const glowRing = new THREE.Mesh(glowRingGeo, neonBlue);
            glowRing.position.y = 2;
            glowRing.rotation.x = Math.PI / 2;
            cap.add(glowRing);

            capacitorGroup.add(cap);
        }
    }

    parts.push({
        name: "Giga-Capacitor Array",
        description: "Dense matrix of rapid-discharge ultracapacitors capable of dumping 50 terajoules in a microsecond.",
        material: "Graphene Aerogel / Yttrium Barium Copper Oxide",
        function: "Stores and rapidly releases the immense electrical energy required to drive the armature.",
        assemblyOrder: 6,
        connections: ["Main Turret Housing", "Primary Magnetic Rails", "Power Cables"],
        failureEffect: "Weapon fails to fire; immense buildup of thermal energy.",
        cascadeFailures: ["Thermal explosion", "Plasma venting into turret housing"],
        originalPosition: { x: 0, y: -2, z: -10 },
        explodedPosition: { x: 0, y: 20, z: -25 }
    });
    weaponElevationGroup.add(capacitorGroup);
    meshes.capacitors = capacitorGroup;

    // --------------------------------------------------------
    // Part 7 & 8: Primary Magnetic Rails (Left & Right)
    // --------------------------------------------------------
    function createMagneticRail(isLeft) {
        const railGroup = new THREE.Group();
        const sign = isLeft ? 1 : -1;
        
        // Complex Extruded Rail Body
        const railShape = new THREE.Shape();
        railShape.moveTo(0, -3);
        railShape.lineTo(4, -3);
        railShape.lineTo(5, -1);
        railShape.lineTo(5, 4);
        railShape.lineTo(3, 6);
        railShape.lineTo(0, 6);
        railShape.lineTo(-1, 3);
        railShape.lineTo(-1, 0);
        railShape.lineTo(0, -3);

        const railExtrude = {
            depth: 60,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 5,
            bevelSize: 0.5,
            bevelThickness: 0.5
        };
        const railGeo = new THREE.ExtrudeGeometry(railShape, railExtrude);
        const railMesh = new THREE.Mesh(railGeo, steel);
        railMesh.position.set(sign * 2.5, 0, 0); // Inner gap for projectile
        
        // Heat sink fins along the outer edge
        for(let z = 2; z < 58; z += 1.5) {
            const finGeo = new THREE.BoxGeometry(3, 10, 0.5);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(sign * 6, 1.5, z);
            railGroup.add(fin);
        }

        // Electromagnetic Coils wrapped around the rail
        for(let z = 5; z < 55; z += 5) {
            const coilGeo = new THREE.BoxGeometry(9, 12, 2);
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.position.set(sign * 4, 1.5, z);
            railGroup.add(coil);

            // Inner glowing strip (Lorentz force generator)
            const stripGeo = new THREE.BoxGeometry(0.5, 6, 2);
            const strip = new THREE.Mesh(stripGeo, heatGlow);
            strip.position.set(sign * 2.1, 1.5, z); // Right on the inside edge
            railGroup.add(strip);
        }

        railGroup.add(railMesh);
        return railGroup;
    }

    const leftRail = createMagneticRail(true);
    const rightRail = createMagneticRail(false);
    weaponElevationGroup.add(leftRail);
    weaponElevationGroup.add(rightRail);

    parts.push({
        name: "Port Primary Magnetic Rail",
        description: "Massive solid-state conductive rail. Generates a powerful Lorentz force when extreme current is passed through it.",
        material: "Silver-infused High-Tensile Steel",
        function: "Conducts current and magnetically accelerates the armature.",
        assemblyOrder: 7,
        connections: ["Rail Bracing Structure", "Armature Injection Chamber"],
        failureEffect: "Projectile deflects internally, destroying the barrel.",
        cascadeFailures: ["Complete barrel vaporization"],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 0, z: 30 }
    });
    meshes.leftRail = leftRail;

    parts.push({
        name: "Starboard Primary Magnetic Rail",
        description: "Matches the port rail; completes the extreme-voltage circuit.",
        material: "Silver-infused High-Tensile Steel",
        function: "Completes the circuit, repelling the projectile at Mach 7+.",
        assemblyOrder: 8,
        connections: ["Rail Bracing Structure", "Armature Injection Chamber"],
        failureEffect: "Circuit breakage; firing abort.",
        cascadeFailures: ["Capacitor feedback surge"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 30 }
    });
    meshes.rightRail = rightRail;

    // --------------------------------------------------------
    // Part 9: Rail Bracing Structure
    // --------------------------------------------------------
    const bracingGroup = new THREE.Group();
    // Huge metal bands holding the rails together against repelling magnetic forces
    for(let z = 10; z < 55; z += 12) {
        const braceGeo = new THREE.BoxGeometry(16, 14, 4);
        const brace = new THREE.Mesh(braceGeo, darkSteel);
        brace.position.set(0, 1.5, z);
        
        // Cutout for the projectile path
        const holeGeo = new THREE.BoxGeometry(6, 8, 4.1);
        const hole = new THREE.Mesh(holeGeo, glass); // Using transparent glass just as a visual dummy in this CSG-less approach
        hole.position.set(0, 1.5, z);

        // We simulate a hollow box by building 4 walls per brace
        const top = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 4), darkSteel);
        top.position.set(0, 7, z);
        const bot = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 4), darkSteel);
        bot.position.set(0, -4, z);
        const lft = new THREE.Mesh(new THREE.BoxGeometry(5, 8, 4), darkSteel);
        lft.position.set(5.5, 1.5, z);
        const rgt = new THREE.Mesh(new THREE.BoxGeometry(5, 8, 4), darkSteel);
        rgt.position.set(-5.5, 1.5, z);

        bracingGroup.add(top, bot, lft, rgt);
    }

    parts.push({
        name: "Hyper-Tensile Bracing Structure",
        description: "Ultra-heavy reinforced clamps designed to counteract the magnetic repulsion that tries to tear the rails apart during firing.",
        material: "Forged Titanium",
        function: "Maintains structural integrity of the barrel under millions of Newtons of outward force.",
        assemblyOrder: 9,
        connections: ["Primary Magnetic Rails", "Elevation Hydraulics"],
        failureEffect: "Rails violently repel each other, splitting the weapon in half like a banana.",
        cascadeFailures: ["Total structural collapse", "Lethal shrapnel explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 40 }
    });
    weaponElevationGroup.add(bracingGroup);

    // --------------------------------------------------------
    // Part 10: Armature Injection Chamber
    // --------------------------------------------------------
    const injectionGroup = new THREE.Group();
    const injGeo = new THREE.BoxGeometry(10, 12, 12);
    const injMesh = new THREE.Mesh(injGeo, steel);
    injMesh.position.set(0, 1.5, -4);
    injectionGroup.add(injMesh);

    // Feeder mechanism
    const feederGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
    const feeder = new THREE.Mesh(feederGeo, chrome);
    feeder.rotation.x = Math.PI / 2;
    feeder.position.set(0, -6, -4);
    injectionGroup.add(feeder);

    parts.push({
        name: "Armature Injection Chamber",
        description: "Automated high-speed auto-loader that inserts the projectile and seals the breech.",
        material: "Chromium-Molybdenum Steel",
        function: "Loads the kinetic kill vehicle and seats it perfectly between the rails.",
        assemblyOrder: 10,
        connections: ["Primary Magnetic Rails", "Main Turret Housing"],
        failureEffect: "Jammed projectile; firing mechanism locked.",
        cascadeFailures: ["Misfire", "Breech explosion if fired improperly"],
        originalPosition: { x: 0, y: 1.5, z: -4 },
        explodedPosition: { x: 0, y: -10, z: -15 }
    });
    weaponElevationGroup.add(injectionGroup);

    // --------------------------------------------------------
    // Part 11: Glowing Plasma Armature (The Projectile)
    // --------------------------------------------------------
    const armatureGroup = new THREE.Group();
    // The physical slug
    const slugGeo = new THREE.ConeGeometry(1.5, 6, 8);
    const slug = new THREE.Mesh(slugGeo, chrome);
    slug.rotation.x = Math.PI / 2;
    armatureGroup.add(slug);

    // The plasma wake/arc
    const arcGeo = new THREE.SphereGeometry(2, 16, 16);
    const arcMesh = new THREE.Mesh(arcGeo, plasmaEmissive);
    arcMesh.position.z = -2;
    armatureGroup.add(arcMesh);

    // Inner core glow
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
    const coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({color: 0xffffff}));
    coreMesh.rotation.x = Math.PI / 2;
    armatureGroup.add(coreMesh);

    armatureGroup.position.set(0, 1.5, 0);

    parts.push({
        name: "Kinetic Kill Vehicle & Plasma Armature",
        description: "A solid tungsten sabot propelled by a trailing pocket of superheated conductive plasma bridging the rails.",
        material: "Tungsten Carbide, Superheated Argon Plasma",
        function: "Delivers devastating kinetic energy to the target at orbital velocities.",
        assemblyOrder: 11,
        connections: ["Armature Injection Chamber"],
        failureEffect: "Premature plasma dissipation causes loss of acceleration.",
        cascadeFailures: ["Barrel scoring", "Inaccurate trajectory"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 80 }
    });
    weaponElevationGroup.add(armatureGroup);
    meshes.armature = armatureGroup;

    // --------------------------------------------------------
    // Part 12 & 13: Active Cooling Matrix & Conduits
    // --------------------------------------------------------
    const coolingGroup = new THREE.Group();
    
    // Large radiators at the rear
    for(let i=0; i<4; i++) {
        const radGeo = new THREE.BoxGeometry(4, 12, 4);
        const rad = new THREE.Mesh(radGeo, aluminum);
        rad.position.set(-8 + i*5.3, 8, -12);
        
        // Vent slats
        for(let j=0; j<10; j++) {
            const slat = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 4.2), darkSteel);
            slat.position.set(-8 + i*5.3, 2.5 + j, -12);
            coolingGroup.add(slat);
        }
        coolingGroup.add(rad);
    }

    // Huge coolant pipes wrapping around
    const coolantCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 8, -12),
        new THREE.Vector3(-14, 5, -5),
        new THREE.Vector3(-14, -2, 5),
        new THREE.Vector3(-10, -5, 10),
        new THREE.Vector3(-3, -5, 15)
    ]);
    const pipeGeo = new THREE.TubeGeometry(coolantCurve, 64, 1.2, 16, false);
    const pipeMesh1 = new THREE.Mesh(pipeGeo, rubber);
    coolingGroup.add(pipeMesh1);

    const pipeMesh2 = new THREE.Mesh(pipeGeo, rubber);
    pipeMesh2.scale.set(-1, 1, 1); // Mirror to the other side
    coolingGroup.add(pipeMesh2);

    parts.push({
        name: "Active Cryogenic Cooling Matrix",
        description: "Massive radiators using liquid nitrogen to shed the immense thermal waste generated by firing.",
        material: "Aluminum-Lithium Alloy",
        function: "Prevents the rails and capacitors from melting during rapid fire.",
        assemblyOrder: 12,
        connections: ["Main Turret Housing", "Coolant Conduits"],
        failureEffect: "Thermal runaway.",
        cascadeFailures: ["Rail warping", "Capacitor explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: -20 }
    });
    meshes.cooling = coolingGroup;
    weaponElevationGroup.add(coolingGroup);

    parts.push({
        name: "Super-Chilled Coolant Conduits",
        description: "Thick, heavily insulated pipes transferring cryogenic fluids from the matrix to the rail heatsinks.",
        material: "Reinforced Synthetic Rubber, Teflon",
        function: "Circulates coolant throughout the weapon.",
        assemblyOrder: 13,
        connections: ["Active Cryogenic Cooling Matrix", "Primary Magnetic Rails"],
        failureEffect: "Coolant leak; localized overheating.",
        cascadeFailures: ["Pressure loss", "System emergency shutdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // Part 14: Targeting Optics Module
    // --------------------------------------------------------
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(0, 16, 5);

    const opticHousing = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 8), darkSteel);
    opticsGroup.add(opticHousing);

    // Glowing lenses
    const lensGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const lens = new THREE.Mesh(lensGeo, new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2}));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 4.1);
    opticsGroup.add(lens);

    parts.push({
        name: "Quantum Targeting Optics Module",
        description: "Hyper-advanced sensor array combining LIDAR, thermal, and predictive AI targeting systems.",
        material: "Sapphire Glass, Titanium Housing",
        function: "Tracks targets at extreme ranges and calculates perfect firing solutions.",
        assemblyOrder: 14,
        connections: ["Main Turret Housing"],
        failureEffect: "Weapon must be fired manually, vastly reducing accuracy at long range.",
        cascadeFailures: ["Data link severance"],
        originalPosition: { x: 0, y: 16, z: 5 },
        explodedPosition: { x: 0, y: 25, z: 15 }
    });
    weaponElevationGroup.add(opticsGroup);

    // --------------------------------------------------------
    // Part 15: Phased Array Radar Dome
    // --------------------------------------------------------
    const radarGroup = new THREE.Group();
    radarGroup.position.set(0, 15, -6);
    
    const domeGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, plastic);
    radarGroup.add(dome);

    parts.push({
        name: "Phased Array Radar Dome",
        description: "AESA radar providing 360-degree atmospheric and low-orbital tracking.",
        material: "Radar-Transparent Composite",
        function: "Detects incoming threats and provides early warning telemetry to the optics module.",
        assemblyOrder: 15,
        connections: ["Main Turret Housing"],
        failureEffect: "Blind to over-the-horizon threats.",
        cascadeFailures: ["Targeting lag"],
        originalPosition: { x: 0, y: 15, z: -6 },
        explodedPosition: { x: 0, y: 35, z: -10 }
    });
    weaponElevationGroup.add(radarGroup);

    // --------------------------------------------------------
    // Part 16: Armored Power Feed Cables
    // --------------------------------------------------------
    const cableGroup = new THREE.Group();
    // Huge bundles of cables entering the base
    for(let i=0; i<6; i++) {
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4 + i*1.6, -15, -15),
            new THREE.Vector3(-4 + i*1.6, -5, -8),
            new THREE.Vector3(-3 + i*1.2, 5, -2)
        ]);
        const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.6, 8, false);
        const cable = new THREE.Mesh(cableGeo, darkSteel);
        cableGroup.add(cable);
    }

    parts.push({
        name: "Armored Power Feed Cables",
        description: "Superconducting conduits linking the railgun directly to a subterranean fusion reactor.",
        material: "Carbon-Nanotube Weave, Superconductive Core",
        function: "Delivers continuous gigawatts of power to the weapon systems.",
        assemblyOrder: 16,
        connections: ["Foundation Platform", "Main Turret Housing"],
        failureEffect: "Total power loss. Weapon becomes an expensive statue.",
        cascadeFailures: ["Capacitor drain", "Cooling system failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: -30 }
    });
    group.add(cableGroup); // Static to base

    const description = "The DEW-7 'Juggernaut' Electromagnetic Railgun is a massive, hyper-advanced directed energy weapon. By utilizing immense Lorentz forces generated across two superconductive rails, it accelerates a kinetic kill vehicle enveloped in glowing plasma to Mach 10. The system features massive cryogenic cooling, colossal capacitor arrays, and heavy depleted-uranium armor plating to protect its delicate quantum targeting systems. It represents the pinnacle of long-range terrestrial defense.";

    const quizQuestions = [
        {
            question: "What physical force is primarily responsible for accelerating the armature down the rails?",
            options: [
                "Lorentz Force",
                "Centrifugal Force",
                "Gravitational Force",
                "Strong Nuclear Force"
            ],
            correctAnswer: 0,
            explanation: "Railguns utilize the Lorentz force. An electric current flows up one rail, across the armature, and down the other rail, creating a magnetic field that pushes the armature forward."
        },
        {
            question: "Why is an active cryogenic cooling matrix essential for this weapon?",
            options: [
                "To cool down the atmospheric radar",
                "To prevent the rails and capacitors from melting due to extreme electrical resistance and friction",
                "To freeze the target upon impact",
                "To keep the hydraulic fluid from solidifying"
            ],
            correctAnswer: 1,
            explanation: "The immense electrical currents (millions of amps) and the hyper-velocity friction of the armature generate enormous thermal waste, which would instantly melt the weapon without active super-cooling."
        },
        {
            question: "What prevents the magnetic rails from violently flying apart during a firing sequence?",
            options: [
                "The Azimuth Swivel Ring",
                "The Quantum Targeting Optics",
                "The Hyper-Tensile Bracing Structure",
                "Gravity"
            ],
            correctAnswer: 2,
            explanation: "The current running in opposite directions down the parallel rails creates a powerful magnetic repulsion. Massive structural bracing is required to hold the rails together against this outward force."
        },
        {
            question: "What is the function of the plasma in the 'Kinetic Kill Vehicle & Plasma Armature'?",
            options: [
                "It acts as a laser beam to melt the target",
                "It serves as a frictionless, highly conductive bridge between the rails, pushing the solid slug forward",
                "It obscures the weapon from enemy radar",
                "It powers the targeting computer"
            ],
            correctAnswer: 1,
            explanation: "Many advanced railguns use a plasma armature—a pocket of superheated ionized gas—because it is perfectly conductive and expands violently, acting as an electromagnetic 'sail' to propel the physical projectile without the mechanical wear of a solid metal sliding contact."
        },
        {
            question: "What is the purpose of the Giga-Capacitor Array rather than running power straight from a reactor?",
            options: [
                "Reactors cannot generate power quickly enough for the microsecond burst required by the rails",
                "Capacitors are lighter than reactors",
                "To provide a backup in case the power cables are cut",
                "To absorb enemy EMP attacks"
            ],
            correctAnswer: 0,
            explanation: "Railguns require an astronomical amount of energy delivered in fractions of a second. While a reactor can provide huge continuous power, only advanced capacitors can store that energy and dump it instantly to create the required acceleration."
        }
    ];

    function animate(time, speed, meshes, uiState) {
        // Time multiplier
        const t = time * 0.001 * speed;
        
        // Weapon state machine
        if (meshes.armature) {
            // Idle scanning
            if (!animationState.firing) {
                animationState.chargeLevel += 0.005 * speed;
                
                // Slow turret rotation scanning
                meshes.swivel.rotation.y = Math.sin(t * 0.5) * 0.5;
                
                // Elevation scanning
                meshes.weaponElevation.rotation.x = Math.sin(t * 0.3) * 0.2 + 0.1;

                // Sync pistons to elevation
                // The elevation tilts around x-axis. As it tilts up (positive), piston needs to extend.
                const elevationTilt = meshes.weaponElevation.rotation.x;
                meshes.leftPiston.piston.position.y = 4 + (elevationTilt * 5);
                meshes.rightPiston.piston.position.y = 4 + (elevationTilt * 5);

                // Capacitor glowing/pulsing as it charges
                heatGlow.emissiveIntensity = animationState.chargeLevel * 2;
                neonBlue.emissiveIntensity = 2.0 + Math.sin(t * 10) * animationState.chargeLevel;

                // Fire when fully charged
                if (animationState.chargeLevel >= 1.0) {
                    animationState.firing = true;
                    animationState.armaturePos = 0;
                    heatGlow.emissiveIntensity = 10.0;
                }
                
                meshes.armature.position.z = 0;
                meshes.armature.visible = true;
            } 
            // Firing sequence
            else {
                // Accelerate projectile down the rails
                animationState.armaturePos += 20 * speed;
                meshes.armature.position.z = animationState.armaturePos;

                // Violent weapon recoil
                if (animationState.armaturePos < 60) {
                    meshes.weaponElevation.position.z = -4 - Math.random() * 2; // Shake
                } else {
                    // Reset recoil and state after projectile leaves
                    meshes.weaponElevation.position.z = -4;
                    meshes.armature.visible = false;
                    
                    animationState.recoilTimer += 0.05 * speed;
                    
                    // Cool down
                    heatGlow.emissiveIntensity = Math.max(0, 10.0 - animationState.recoilTimer * 5);
                    
                    if (animationState.recoilTimer >= 2.0) {
                        animationState.firing = false;
                        animationState.chargeLevel = 0;
                        animationState.recoilTimer = 0;
                    }
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createElectromagneticRailgun() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
