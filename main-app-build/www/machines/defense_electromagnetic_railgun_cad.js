import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const activeParts = [];

    // Custom high-tech materials for energy and plasma
    const energyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9
    });
    
    const warningMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.7,
        roughness: 0.3
    });

    // Utility function to create realistic heavy cables with sag
    function createCable(start, end, radius, material) {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y -= 4; // realistic gravity sag
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const geom = new THREE.TubeGeometry(curve, 32, radius, 12, false);
        return new THREE.Mesh(geom, material);
    }

    // ==========================================
    // 1. TURRET FOUNDATION & BASE
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Complex layered base using multiple cylinders and torus geometries
    const baseFoundationGeom = new THREE.CylinderGeometry(28, 32, 6, 64);
    const baseFoundation = new THREE.Mesh(baseFoundationGeom, darkSteel);
    baseFoundation.position.y = 3;
    baseGroup.add(baseFoundation);

    const baseCollar = new THREE.Mesh(new THREE.TorusGeometry(28, 2, 32, 64), steel);
    baseCollar.rotation.x = Math.PI / 2;
    baseCollar.position.y = 6;
    baseGroup.add(baseCollar);

    // Massive anchor bolts around the foundation
    for(let i=0; i<48; i++) {
        const boltGroup = new THREE.Group();
        const boltBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2, 16), darkSteel);
        const boltHead = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 6), chrome);
        boltHead.position.y = 1.5;
        boltGroup.add(boltBase);
        boltGroup.add(boltHead);
        
        const angle = (i / 48) * Math.PI * 2;
        boltGroup.position.set(Math.cos(angle) * 30, 7, Math.sin(angle) * 30);
        baseGroup.add(boltGroup);
    }
    
    // Internal glowing power core
    const powerCore = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 6.5, 32), energyMaterial);
    powerCore.position.y = 3;
    baseGroup.add(powerCore);
    
    group.add(baseGroup);
    
    parts.push({
        name: "Turret Foundation",
        description: "Massive reinforced steel base, bolted deep into bedrock to withstand millions of Newtons of recoil force.",
        material: "darkSteel",
        function: "Structural Anchoring",
        assemblyOrder: 1,
        connections: ["Azimuth Drive Array"],
        failureEffect: "Catastrophic unmooring during firing sequence, leading to complete structural collapse.",
        cascadeFailures: ["Azimuth Drive Array", "Heavy Yoke Assembly"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // 2. AZIMUTH DRIVE ARRAY
    // ==========================================
    const azimuthGroup = new THREE.Group();
    azimuthGroup.position.y = 7.5;
    
    const azimuthRingGeom = new THREE.CylinderGeometry(25, 25, 4, 64);
    const azimuthRing = new THREE.Mesh(azimuthRingGeom, steel);
    azimuthGroup.add(azimuthRing);

    // High precision gear teeth
    for(let i=0; i<180; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 3), chrome);
        const angle = (i / 180) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * 25.5, 0, Math.sin(angle) * 25.5);
        tooth.rotation.y = -angle;
        azimuthGroup.add(tooth);
    }

    // Swivel mount that rotates horizontally
    const swivelGroup = new THREE.Group();
    swivelGroup.position.y = 7.5;
    group.add(swivelGroup);
    swivelGroup.add(azimuthGroup);
    activeParts.push({ mesh: swivelGroup, type: "azimuth" });

    parts.push({
        name: "Azimuth Drive Array",
        description: "Ultra-high-torque gear array powered by redundant electric motors for rapid horizontal target tracking.",
        material: "steel",
        function: "Horizontal Targeting",
        assemblyOrder: 2,
        connections: ["Turret Foundation", "Heavy Yoke Assembly"],
        failureEffect: "Inability to track moving targets or adjust firing azimuth.",
        cascadeFailures: ["Targeting Radar Sync"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // ==========================================
    // 3. HEAVY YOKE ASSEMBLY
    // ==========================================
    const yokeGroup = new THREE.Group();
    yokeGroup.position.y = 12;
    
    // Complex yoke base
    const yokeBase = new THREE.Mesh(new THREE.BoxGeometry(34, 6, 24), darkSteel);
    yokeGroup.add(yokeBase);
    
    // Slanted heavy support arms using custom shapes
    const armGeom = new THREE.CylinderGeometry(8, 12, 22, 32);
    
    const yokeArmL = new THREE.Mesh(armGeom, darkSteel);
    yokeArmL.position.set(16, 12, 0);
    yokeGroup.add(yokeArmL);
    
    const yokeArmR = new THREE.Mesh(armGeom, darkSteel);
    yokeArmR.position.set(-16, 12, 0);
    yokeGroup.add(yokeArmR);

    // Hydraulic accumulator tanks on the yoke
    for(let i=0; i<2; i++) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 10, 32), chrome);
        tank.rotation.x = Math.PI / 2;
        tank.position.set(i === 0 ? 10 : -10, 4, 15);
        yokeGroup.add(tank);
        
        // Pressure dials
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), glass);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(i === 0 ? 10 : -10, 4, 20.5);
        yokeGroup.add(dial);
    }

    swivelGroup.add(yokeGroup);

    parts.push({
        name: "Heavy Yoke Assembly",
        description: "Forged dark steel structural frame that cradles the multi-ton barrel and houses hydraulic accumulators.",
        material: "darkSteel",
        function: "Elevation Cradling",
        assemblyOrder: 3,
        connections: ["Azimuth Drive Array", "Magnetic Trunnion Bearings"],
        failureEffect: "Barrel collapse under its own extreme weight.",
        cascadeFailures: ["Reinforced Barrel Casing", "Elevation Actuators"],
        originalPosition: { x: 0, y: 19.5, z: 0 },
        explodedPosition: { x: 0, y: 19.5, z: 40 }
    });

    // ==========================================
    // 4. TRUNNIONS & ELEVATION PIVOT
    // ==========================================
    const trunnionGroup = new THREE.Group();
    trunnionGroup.position.set(0, 26, 0);

    const trunnionL = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 64), chrome);
    trunnionL.rotation.z = Math.PI / 2;
    trunnionL.position.set(16, 0, 0);
    trunnionGroup.add(trunnionL);

    const trunnionR = trunnionL.clone();
    trunnionR.position.set(-16, 0, 0);
    trunnionGroup.add(trunnionR);

    // Electromagnetic suspension rings
    const magRingL = new THREE.Mesh(new THREE.TorusGeometry(6, 1, 32, 64), energyMaterial);
    magRingL.rotation.y = Math.PI / 2;
    magRingL.position.set(12, 0, 0);
    trunnionGroup.add(magRingL);
    
    const magRingR = magRingL.clone();
    magRingR.position.set(-12, 0, 0);
    trunnionGroup.add(magRingR);

    swivelGroup.add(trunnionGroup);
    
    // Elevating Group pivots precisely on trunnions
    const elevatingGroup = new THREE.Group();
    elevatingGroup.position.set(0, 26, 0);
    swivelGroup.add(elevatingGroup);
    activeParts.push({ mesh: elevatingGroup, type: "elevation" });

    parts.push({
        name: "Magnetic Trunnion Bearings",
        description: "Frictionless electromagnetic suspension rings allowing perfectly smooth vertical pitching of the colossal gun barrel.",
        material: "chrome",
        function: "Pitch Axis Pivot",
        assemblyOrder: 4,
        connections: ["Heavy Yoke Assembly", "Reinforced Barrel Casing"],
        failureEffect: "Seizing of the pitch axis, preventing altitude targeting.",
        cascadeFailures: ["Elevation Actuators"],
        originalPosition: { x: 0, y: 33.5, z: 0 },
        explodedPosition: { x: 40, y: 33.5, z: 0 }
    });

    // ==========================================
    // 5. MAIN BARREL CASING
    // ==========================================
    const casingGroup = new THREE.Group();
    // Offset so the pivot is located near the breech (rear) of the gun
    casingGroup.position.z = -15; 
    
    // Complex core geometry
    const casingCore = new THREE.Mesh(new THREE.BoxGeometry(24, 22, 120), darkSteel);
    casingCore.position.z = -35;
    casingGroup.add(casingCore);

    // Heavy reinforced ribbing along the barrel
    for(let i=0; i<22; i++) {
        const ribGeom = new THREE.BoxGeometry(26, 24, 3);
        const rib = new THREE.Mesh(ribGeom, steel);
        rib.position.z = 15 - (i * 5);
        
        // Add rivets to ribs
        for(let j=0; j<8; j++) {
            const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 25), chrome);
            rivet.rotation.z = Math.PI / 2;
            rivet.position.set(0, 10, 0);
            rib.add(rivet);
        }
        
        casingGroup.add(rib);
    }
    
    // Heat dispersion vents along the top
    for(let i=0; i<15; i++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 4), aluminum);
        vent.position.set(0, 11, 5 - (i * 7));
        
        const glow = new THREE.Mesh(new THREE.BoxGeometry(14, 1, 3), energyMaterial);
        glow.position.y = 1;
        vent.add(glow);
        activeParts.push({ mesh: glow, type: "ventGlow" });
        
        casingGroup.add(vent);
    }

    elevatingGroup.add(casingGroup);
    activeParts.push({ mesh: casingGroup, type: "casingRecoil" });

    parts.push({
        name: "Composite Barrel Casing",
        description: "Titanium-reinforced composite shell designed to contain the immense repulsive forces that attempt to blow the rails apart during firing.",
        material: "darkSteel",
        function: "Structural Containment",
        assemblyOrder: 5,
        connections: ["Magnetic Trunnion Bearings", "Electromagnetic Accelerator Rails"],
        failureEffect: "Explosive rail blowout, destroying the entire upper assembly.",
        cascadeFailures: ["Electromagnetic Accelerator Rails", "Capacitor Banks"],
        originalPosition: { x: 0, y: 26, z: -15 },
        explodedPosition: { x: 0, y: 70, z: -15 }
    });

    // ==========================================
    // 6. ELECTROMAGNETIC RAILS
    // ==========================================
    const railsGroup = new THREE.Group();
    railsGroup.position.set(0, 0, -35);
    casingGroup.add(railsGroup);

    // Massive conductive rails
    const railGeom = new THREE.BoxGeometry(8, 14, 130);
    const railL = new THREE.Mesh(railGeom, copper);
    railL.position.set(7, 0, 0);
    railsGroup.add(railL);

    const railR = new THREE.Mesh(railGeom, copper);
    railR.position.set(-7, 0, 0);
    railsGroup.add(railR);

    // Superconducting inner surface strips
    const energyStripGeom = new THREE.BoxGeometry(0.5, 10, 130);
    const energyStripL = new THREE.Mesh(energyStripGeom, energyMaterial);
    energyStripL.position.set(2.75, 0, 0);
    railsGroup.add(energyStripL);

    const energyStripR = new THREE.Mesh(energyStripGeom, energyMaterial);
    energyStripR.position.set(-2.75, 0, 0);
    railsGroup.add(energyStripR);
    
    activeParts.push({ mesh: energyStripL, type: "railGlow" });
    activeParts.push({ mesh: energyStripR, type: "railGlow" });

    parts.push({
        name: "Electromagnetic Accelerator Rails",
        description: "Hyper-conductive solid copper rails that transmit millions of amperes to generate a colossal Lorentz force.",
        material: "copper",
        function: "Projectile Acceleration",
        assemblyOrder: 6,
        connections: ["Composite Barrel Casing", "Sabot Armature"],
        failureEffect: "Loss of Lorentz force; severe arcing causing localized melting.",
        cascadeFailures: ["Sabot Armature", "Pulse-Forming Network"],
        originalPosition: { x: 0, y: 26, z: -50 },
        explodedPosition: { x: -40, y: 26, z: -50 }
    });

    // ==========================================
    // 7. HIGH-VOLTAGE CAPACITOR BANKS
    // ==========================================
    const capacitorGroupL = new THREE.Group();
    capacitorGroupL.position.set(18, 0, -35);
    casingGroup.add(capacitorGroupL);

    const capacitorGroupR = new THREE.Group();
    capacitorGroupR.position.set(-18, 0, -35);
    casingGroup.add(capacitorGroupR);

    const capGeom = new THREE.CylinderGeometry(2, 2, 10, 32);
    const capRingGeom = new THREE.TorusGeometry(2.1, 0.3, 16, 32);
    
    // Arrays of ultra-dense capacitors flanking the casing
    for(let row=0; row<2; row++) {
        for(let col=0; col<18; col++) {
            const cap = new THREE.Mesh(capGeom, aluminum);
            cap.position.set(row * 4.5 - 2, 0, (col * 5.5) - 45);
            
            // Glowing energy rings on capacitors
            const ring = new THREE.Mesh(capRingGeom, energyMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 3;
            cap.add(ring);
            
            // Wiring manifold
            const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), copper);
            wire.position.set(-2, 4, 0);
            wire.rotation.z = Math.PI / 2;
            cap.add(wire);
            
            capacitorGroupL.add(cap);
            
            const capR = cap.clone();
            capR.children[1].position.set(2, 4, 0); // mirror wire
            capacitorGroupR.add(capR);
            
            activeParts.push({ mesh: ring, type: "capGlow" });
            activeParts.push({ mesh: capR.children[0], type: "capGlow" });
        }
    }

    parts.push({
        name: "Pulse-Forming Capacitor Banks",
        description: "Dense arrays of advanced capacitors that store and instantaneously discharge terawatts of electrical energy into the rails.",
        material: "aluminum",
        function: "Energy Storage & Discharge",
        assemblyOrder: 7,
        connections: ["Electromagnetic Accelerator Rails", "Superconducting Power Feeds"],
        failureEffect: "Incomplete charge, resulting in low muzzle velocity or a misfire.",
        cascadeFailures: ["Sabot Armature", "Cryogenic Cooling System"],
        originalPosition: { x: 18, y: 26, z: -50 },
        explodedPosition: { x: 70, y: 26, z: -50 }
    });

    // ==========================================
    // 8. SABOT ARMATURE & PROJECTILE
    // ==========================================
    const projectileGroup = new THREE.Group();
    projectileGroup.position.set(0, 0, 50); // Starts deep in the breech
    railsGroup.add(projectileGroup);
    activeParts.push({ mesh: projectileGroup, type: "projectile" });

    // Armature (Conductive U-shape saddle)
    const armatureBase = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 6), aluminum);
    projectileGroup.add(armatureBase);
    
    const armL = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 8), aluminum);
    armL.position.set(2.25, 0, -1);
    projectileGroup.add(armL);
    
    const armR = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 8), aluminum);
    armR.position.set(-2.25, 0, -1);
    projectileGroup.add(armR);

    // Intense Plasma trail behind armature
    const plasma = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 32), plasmaMaterial);
    plasma.position.z = 3;
    plasma.scale.z = 2; // stretch it out
    projectileGroup.add(plasma);
    activeParts.push({ mesh: plasma, type: "plasma" });

    // Tungsten Hypervelocity Slug (Cone/Cylinder)
    const slugGroup = new THREE.Group();
    slugGroup.position.z = -7;
    
    const slugBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32), chrome);
    slugBody.rotation.x = -Math.PI / 2;
    slugGroup.add(slugBody);
    
    const slugTip = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.5, 4, 32), darkSteel);
    slugTip.rotation.x = -Math.PI / 2;
    slugTip.position.z = -5;
    slugGroup.add(slugTip);
    
    projectileGroup.add(slugGroup);

    parts.push({
        name: "Sabot Armature & Tungsten Slug",
        description: "A conductive aluminum saddle acting as a bridge between the rails, pushing a dense, aerodynamic tungsten dart at Mach 7.",
        material: "chrome",
        function: "Kinetic Payload",
        assemblyOrder: 8,
        connections: ["Electromagnetic Accelerator Rails"],
        failureEffect: "Catastrophic friction welding to rails, causing barrel explosion.",
        cascadeFailures: ["Composite Barrel Casing", "Electromagnetic Muzzle Arrester"],
        originalPosition: { x: 0, y: 26, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // ==========================================
    // 9. HYDRAULIC ELEVATION ACTUATORS
    // ==========================================
    const pistonLGroup = new THREE.Group();
    pistonLGroup.position.set(16, 16, 10);
    swivelGroup.add(pistonLGroup);
    
    const pistonCasingGeom = new THREE.CylinderGeometry(3, 3, 20, 32);
    const pistonCylinderL = new THREE.Mesh(pistonCasingGeom, darkSteel);
    pistonCylinderL.rotation.x = Math.PI / 4;
    pistonLGroup.add(pistonCylinderL);
    
    const pistonShaftL = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 20, 32), chrome);
    pistonShaftL.rotation.x = Math.PI / 4;
    pistonShaftL.position.set(0, 7, -7); 
    pistonLGroup.add(pistonShaftL);
    activeParts.push({ mesh: pistonShaftL, type: "pistonL" });

    const pistonRGroup = pistonLGroup.clone();
    pistonRGroup.position.set(-16, 16, 10);
    swivelGroup.add(pistonRGroup);
    activeParts.push({ mesh: pistonRGroup.children[1], type: "pistonR" });

    parts.push({
        name: "Hydraulic Elevation Actuators",
        description: "Twin industrial-grade hydraulic rams capable of fine-tuning the pitch of a 400-ton barrel assembly.",
        material: "chrome",
        function: "Elevation Control",
        assemblyOrder: 9,
        connections: ["Heavy Yoke Assembly", "Composite Barrel Casing"],
        failureEffect: "Loss of hydraulic pressure, forcing the barrel to drop to neutral elevation.",
        cascadeFailures: [],
        originalPosition: { x: 16, y: 23.5, z: 10 },
        explodedPosition: { x: 40, y: 23.5, z: 30 }
    });

    // ==========================================
    // 10. CRYOGENIC COOLING SYSTEM
    // ==========================================
    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 24, -40);
    casingGroup.add(coolingGroup);
    
    for(let i=0; i<10; i++) {
        const fanHousing = new THREE.Mesh(new THREE.BoxGeometry(22, 6, 8), darkSteel);
        fanHousing.position.z = i * 9 - 30;
        coolingGroup.add(fanHousing);
        
        // Detailed twin turbine fans per housing
        const fanGeom = new THREE.CylinderGeometry(3, 3, 6.5, 16);
        const fanBladeGeom = new THREE.BoxGeometry(5.5, 1, 0.2);
        
        const fanL = new THREE.Mesh(fanGeom, darkSteel);
        fanL.rotation.z = Math.PI/2;
        fanL.position.set(6, 0, fanHousing.position.z);
        
        for(let b=0; b<6; b++) {
            const blade = new THREE.Mesh(fanBladeGeom, chrome);
            blade.rotation.y = (b/6) * Math.PI * 2;
            fanL.add(blade);
        }
        coolingGroup.add(fanL);
        activeParts.push({ mesh: fanL, type: "fan" });

        const fanR = fanL.clone();
        fanR.position.set(-6, 0, fanHousing.position.z);
        coolingGroup.add(fanR);
        activeParts.push({ mesh: fanR, type: "fan" });
    }

    parts.push({
        name: "Cryogenic Cooling Turbines",
        description: "High-RPM turbofans circulating liquid nitrogen to prevent the rails from turning into molten slag during discharge.",
        material: "darkSteel",
        function: "Thermal Management",
        assemblyOrder: 10,
        connections: ["Composite Barrel Casing", "Electromagnetic Accelerator Rails"],
        failureEffect: "Critical thermal runaway, melting the weapon internals within seconds of firing.",
        cascadeFailures: ["Electromagnetic Accelerator Rails", "Pulse-Forming Capacitor Banks"],
        originalPosition: { x: 0, y: 50, z: -55 },
        explodedPosition: { x: 0, y: 100, z: -55 }
    });

    // ==========================================
    // 11. SUPERCONDUCTING POWER FEEDS
    // ==========================================
    const cableGroup = new THREE.Group();
    
    // Create thick cables from base to yoke
    const cable1 = createCable(new THREE.Vector3(10, 10, 5), new THREE.Vector3(14, 20, -10), 1.5, rubber);
    cableGroup.add(cable1);
    const cable2 = createCable(new THREE.Vector3(-10, 10, 5), new THREE.Vector3(-14, 20, -10), 1.5, rubber);
    cableGroup.add(cable2);
    
    // Cables from yoke to capacitors
    const cable3 = createCable(new THREE.Vector3(14, 20, -10), new THREE.Vector3(20, 26, -30), 2, rubber);
    cableGroup.add(cable3);
    const cable4 = createCable(new THREE.Vector3(-14, 20, -10), new THREE.Vector3(-20, 26, -30), 2, rubber);
    cableGroup.add(cable4);

    swivelGroup.add(cableGroup);

    parts.push({
        name: "Superconducting Power Feeds",
        description: "Massive insulated cable bundles transferring raw gigawatts from the base reactor to the capacitor banks.",
        material: "rubber",
        function: "Energy Transmission",
        assemblyOrder: 11,
        connections: ["Turret Foundation", "Pulse-Forming Capacitor Banks"],
        failureEffect: "Severed energy flow, leaving the weapon completely dead.",
        cascadeFailures: ["Azimuth Drive Array"],
        originalPosition: { x: 10, y: 20, z: -10 },
        explodedPosition: { x: 50, y: 20, z: -10 }
    });

    // ==========================================
    // 12. OPERATOR CONTROL CABIN
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-28, 12, 0);
    swivelGroup.add(cabinGroup);
    
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(12, 16, 18), darkSteel);
    cabinGroup.add(cabinBody);
    
    // Wrap-around tinted armored glass
    const windowFront = new THREE.Mesh(new THREE.BoxGeometry(12.2, 6, 8), tinted);
    windowFront.position.set(0, 2, 5);
    cabinGroup.add(windowFront);
    
    const windowSide = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 18.2), tinted);
    windowSide.position.set(-2, 2, 0);
    cabinGroup.add(windowSide);
    
    // Communication Antennas
    const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2), darkSteel);
    antennaBase.position.set(-3, 8.5, -5);
    cabinGroup.add(antennaBase);
    
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 12, 8), chrome);
    antenna.position.set(-3, 14, -5);
    cabinGroup.add(antenna);
    
    // Blinking status light
    const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), warningMaterial);
    statusLight.position.set(0, 9, 0);
    cabinGroup.add(statusLight);
    activeParts.push({ mesh: statusLight, type: "statusLight" });

    parts.push({
        name: "Armored Control Cabin",
        description: "Shock-mounted, electromagnetically shielded operator booth with blast-proof glass and targeting telemetry displays.",
        material: "tinted",
        function: "Manual Override & Fire Control",
        assemblyOrder: 12,
        connections: ["Heavy Yoke Assembly"],
        failureEffect: "Loss of localized human oversight and emergency override capabilities.",
        cascadeFailures: [],
        originalPosition: { x: -28, y: 19.5, z: 0 },
        explodedPosition: { x: -60, y: 19.5, z: 0 }
    });

    // ==========================================
    // 13. TARGETING RADAR
    // ==========================================
    const radarGroup = new THREE.Group();
    radarGroup.position.set(0, 14, 15);
    casingGroup.add(radarGroup);
    
    const radarPillar = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 8), darkSteel);
    radarGroup.add(radarPillar);
    
    const dishAssembly = new THREE.Group();
    dishAssembly.position.y = 5;
    
    // Radar Dish
    const dish = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 16, 0, Math.PI), plastic);
    dish.rotation.x = Math.PI / 2;
    dishAssembly.add(dish);
    
    // Feed horn and supports
    const feedHorn = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.2, 7), aluminum);
    feedHorn.rotation.x = Math.PI / 2;
    feedHorn.position.set(0, 0, 3.5);
    dishAssembly.add(feedHorn);
    
    radarGroup.add(dishAssembly);
    activeParts.push({ mesh: dishAssembly, type: "radarDish" });

    parts.push({
        name: "Phased Array Targeting Radar",
        description: "High-frequency tracking radar capable of locking onto targets beyond the horizon for precise atmospheric intercepts.",
        material: "plastic",
        function: "Target Acquisition",
        assemblyOrder: 13,
        connections: ["Composite Barrel Casing"],
        failureEffect: "Zero targeting accuracy; weapon must be fired blind.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 20 }
    });

    // ==========================================
    // 14. ELECTROMAGNETIC MUZZLE ARRESTER
    // ==========================================
    const muzzleGroup = new THREE.Group();
    muzzleGroup.position.set(0, 0, -100);
    casingGroup.add(muzzleGroup);
    
    const muzzleBlock = new THREE.Mesh(new THREE.BoxGeometry(28, 26, 15), darkSteel);
    muzzleGroup.add(muzzleBlock);
    
    // Arrester rings
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 2, 32), warningMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = -8 - (i * 4);
        muzzleGroup.add(ring);
    }
    
    // Plasma vents on sides
    const ventL = new THREE.Mesh(new THREE.BoxGeometry(4, 16, 12), chrome);
    ventL.position.set(15, 0, 0);
    muzzleGroup.add(ventL);
    
    const ventR = ventL.clone();
    ventR.position.set(-15, 0, 0);
    muzzleGroup.add(ventR);

    parts.push({
        name: "Electromagnetic Muzzle Arrester",
        description: "Crucial endpoint mechanism that halts the conductive armature, venting expanding plasma laterally while allowing the aerodynamic slug to exit cleanly.",
        material: "warningMaterial",
        function: "Sabot Separation & Plasma Venting",
        assemblyOrder: 14,
        connections: ["Composite Barrel Casing"],
        failureEffect: "Armature escapes the barrel, creating immense aerodynamic drag and severe trajectory deviation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 26, z: -115 },
        explodedPosition: { x: 0, y: 26, z: -160 }
    });

    // ==========================================
    // 15. MAINTENANCE ACCESS CATWALKS
    // ==========================================
    const catwalkGroup = new THREE.Group();
    catwalkGroup.position.set(0, -6, -20);
    casingGroup.add(catwalkGroup);

    const walkwayL = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 80), steel);
    walkwayL.position.set(18, 0, -20);
    catwalkGroup.add(walkwayL);

    const walkwayR = walkwayL.clone();
    walkwayR.position.set(-18, 0, -20);
    catwalkGroup.add(walkwayR);

    // Railings
    for(let i=0; i<16; i++) {
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5), chrome);
        postL.position.set(21.5, 2.5, 15 - (i * 5));
        catwalkGroup.add(postL);
        
        const postR = postL.clone();
        postR.position.set(-21.5, 2.5, 15 - (i * 5));
        catwalkGroup.add(postR);
    }
    
    const handrailL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 80), warningMaterial);
    handrailL.rotation.x = Math.PI / 2;
    handrailL.position.set(21.5, 5, -20);
    catwalkGroup.add(handrailL);
    
    const handrailR = handrailL.clone();
    handrailR.position.set(-21.5, 5, -20);
    catwalkGroup.add(handrailR);

    parts.push({
        name: "Maintenance Access Catwalks",
        description: "Industrial steel grated walkways and handrails allowing engineering crews to perform diagnostics on the capacitor arrays.",
        material: "steel",
        function: "Accessibility",
        assemblyOrder: 15,
        connections: ["Composite Barrel Casing"],
        failureEffect: "Minor operational delay for physical repairs.",
        cascadeFailures: [],
        originalPosition: { x: 18, y: 20, z: -35 },
        explodedPosition: { x: 50, y: 20, z: -35 }
    });

    // ==========================================
    // META DATA & QUIZ
    // ==========================================
    const description = "The Defense Electromagnetic Railgun is a pinnacle of kinetic energy weaponry. Bypassing volatile chemical propellants, it utilizes immense arrays of pulse-forming capacitors to instantly dump millions of amperes through solid copper rails. The resulting Lorentz force accelerates a sabot-encased tungsten slug to hypersonic velocities (Mach 7+). Capable of pinpoint strikes over massive distances, this weapon requires gargantuan structural reinforcement and intensive cryogenic cooling to manage extreme physical and thermal stresses.";

    const quizQuestions = [
        {
            question: "What physical principle is utilized to propel the projectile in this weapon?",
            options: ["Pneumatic gas expansion", "Lorentz force via electromagnetism", "Controlled nuclear fusion", "Chemical propellant combustion"],
            correctAnswer: 1,
            explanation: "Railguns work by running extreme electrical currents up one rail, across the armature, and down the other, generating interacting magnetic fields (Lorentz force) that violently push the armature forward."
        },
        {
            question: "Why are the Cryogenic Cooling Turbines absolutely critical to the railgun's function?",
            options: ["They keep the radar electronics from overheating", "They cool the operator cabin during desert deployments", "They dissipate extreme resistive and friction heat to stop the copper rails from melting instantly", "They freeze the air in front of the barrel to reduce drag"],
            correctAnswer: 2,
            explanation: "Millions of amps traveling through metal generate phenomenal resistive heat, compounded by the Mach 7 friction of the armature. Without aggressive cryogenic cooling, the rails would liquify upon firing."
        },
        {
            question: "What specific role do the Pulse-Forming Capacitor Banks serve?",
            options: ["They store and instantaneously release terawatts of energy required for launch", "They act as heavy counterweights for the barrel", "They generate the localized radar targeting frequencies", "They filter atmospheric static from the power grid"],
            correctAnswer: 0,
            explanation: "Standard power sources cannot release energy fast enough. The capacitor banks store massive amounts of power and discharge it in milliseconds, creating the extreme power spike needed for the Lorentz force."
        },
        {
            question: "What occurs at the Electromagnetic Muzzle Arrester at the end of the barrel?",
            options: ["The slug explodes before hitting the target", "The conductive armature is violently halted and plasma vented, letting only the aerodynamic slug exit", "The weapon is reloaded with a new projectile", "A final magnetic boost is applied to the slug"],
            correctAnswer: 1,
            explanation: "The sabot/armature is aerodynamically terrible and conductive. The arrester catches it and vents the trailing plasma, ensuring the clean, drag-free flight of the aerodynamic tungsten dart."
        },
        {
            question: "Which component allows the multi-hundred-ton barrel casing to elevate and depress flawlessly?",
            options: ["The Azimuth Drive Array", "The Superconducting Power Feeds", "The Magnetic Trunnion Bearings", "The Turret Foundation"],
            correctAnswer: 2,
            explanation: "The trunnions serve as the pitch axis pivot. Utilizing electromagnetic suspension bearings, they eliminate friction, allowing the massive casing to be aimed vertically with absolute precision."
        }
    ];

    // ==========================================
    // COMPLEX SYNCHRONIZED ANIMATION
    // ==========================================
    function animate(time, speed, meshes) {
        if (!meshes || meshes.length === 0) return;
        
        const swivel = activeParts.find(p => p.type === "azimuth")?.mesh;
        const elevation = activeParts.find(p => p.type === "elevation")?.mesh;
        const casing = activeParts.find(p => p.type === "casingRecoil")?.mesh;
        const radarDish = activeParts.find(p => p.type === "radarDish")?.mesh;
        const fans = activeParts.filter(p => p.type === "fan").map(p => p.mesh);
        const projectile = activeParts.find(p => p.type === "projectile")?.mesh;
        const plasma = activeParts.find(p => p.type === "plasma")?.mesh;
        const statusLight = activeParts.find(p => p.type === "statusLight")?.mesh;
        
        const railGlows = activeParts.filter(p => p.type === "railGlow").map(p => p.mesh);
        const capGlows = activeParts.filter(p => p.type === "capGlow").map(p => p.mesh);
        const ventGlows = activeParts.filter(p => p.type === "ventGlow").map(p => p.mesh);

        const pistonL = activeParts.find(p => p.type === "pistonL")?.mesh;
        const pistonR = activeParts.find(p => p.type === "pistonR")?.mesh;

        // 1. Swivel & Radar Scanning (Constant)
        if (swivel) swivel.rotation.y = Math.sin(time * 0.2 * speed) * 0.7;
        if (radarDish) radarDish.rotation.z = time * 2 * speed; // spins fast
        if (statusLight) statusLight.material.emissiveIntensity = (Math.sin(time * 10 * speed) > 0) ? 2 : 0; // Blink

        // 2. Elevation Pitching & Piston Sync
        let currentElevation = 0;
        if (elevation) {
            // Sine wave pitching upwards (0 to -0.5 radians)
            currentElevation = (Math.sin(time * 0.4 * speed) - 1) * 0.25; 
            elevation.rotation.x = currentElevation;
        }

        // Piston shaft extension math based on elevation angle
        if (pistonL && pistonR) {
            const extension = currentElevation * -12; // scales inversely with pitch
            pistonL.position.set(0, 7 + extension, -7 - extension);
            pistonR.position.set(0, 7 + extension, -7 - extension);
        }

        // 3. Cooling Turbines (Constant high speed)
        fans.forEach(fan => {
            fan.rotation.y += 1.5 * speed; // High RPM
        });

        // 4. Advanced Firing Sequence Cycle
        const cycleLength = 6.0;
        const cycle = (time * speed) % cycleLength; 
        
        // Fases:
        // 0.0 - 3.0 : Capacitor Charging (Glow increasing, plasma building)
        // 3.0 - 3.2 : FIRING (Projectile moves, instant max glow, brutal recoil)
        // 3.2 - 6.0 : Recoil recovery, cooling, resetting
        
        // Glow logic
        if (railGlows.length > 0 && capGlows.length > 0) {
            if (cycle < 3.0) {
                // Charging phase
                const intensity = (cycle / 3.0) * 8;
                const flicker = Math.random() * 0.5;
                const totalGlow = intensity + flicker;
                
                railGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = totalGlow; });
                capGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = totalGlow; });
                ventGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = totalGlow * 0.5; });
                
                if(plasma) {
                    plasma.scale.set(0.5 + intensity*0.1, 0.5 + intensity*0.1, 1 + intensity*0.2);
                    plasma.material.emissiveIntensity = totalGlow * 2;
                }
                
            } else if (cycle < 3.2) {
                // Flash max at firing
                const flash = 25;
                railGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = flash; });
                capGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = flash; });
                ventGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = flash; });
                if(plasma) plasma.material.emissiveIntensity = flash * 2;
                
            } else {
                // Rapid cool down
                const coolProgress = (cycle - 3.2) / 2.8;
                const fade = Math.max(0, 15 - (coolProgress * 15));
                
                railGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = fade; });
                capGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = fade; });
                ventGlows.forEach(g => { if(g.material) g.material.emissiveIntensity = fade * 0.5; });
                if(plasma) plasma.material.emissiveIntensity = fade;
            }
        }

        // Projectile & Recoil Logic
        if (projectile && casing) {
            if (cycle < 3.0) {
                // Pre-fire: holding in breech, heavy trembling as energy builds
                const tremble = (cycle / 3.0) * 0.3;
                projectile.position.z = 50 + (Math.random() - 0.5) * tremble;
                projectile.visible = true;
                casing.position.z = -15; // default position
                
            } else if (cycle < 3.2) {
                // Firing: Projectile accelerates down rails instantly
                const progress = (cycle - 3.0) / 0.2; // 0 to 1
                projectile.position.z = 50 - (progress * 165); // shoots past arrester
                
                // Brutal Recoil: Casing snaps back
                casing.position.z = -15 - (Math.sin(progress * Math.PI) * 12);
                
            } else {
                // Post-fire
                projectile.visible = false;
                
                // Slow recoil recovery
                if (cycle < 4.5) {
                    const recovery = (cycle - 3.2) / 1.3;
                    casing.position.z = -27 + (recovery * 12);
                } else {
                    casing.position.z = -15;
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
