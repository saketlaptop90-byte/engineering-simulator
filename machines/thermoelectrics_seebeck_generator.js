import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import * as THREE from 'three';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationMeshes = [];

    // --- CUSTOM ADVANCED MATERIALS ---
    const heatMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 2.5,
        roughness: 0.7,
        metalness: 0.3,
    });
    const coldMaterial = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x001155,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.8,
    });
    const electricityMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });
    const ceramicMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.9,
        metalness: 0.1,
    });
    const pTypeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2222ff,
        roughness: 0.5,
        metalness: 0.6,
    });
    const nTypeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        roughness: 0.5,
        metalness: 0.6,
    });
    const glowingWireMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8,
    });
    const displayScreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff00,
        emissiveIntensity: 1,
        roughness: 0.1,
        metalness: 0.9,
    });

    // --- GEOMETRY HELPERS ---
    function createRoundedRect(width, length, radius) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2 + radius, -length/2);
        shape.lineTo(width/2 - radius, -length/2);
        shape.quadraticCurveTo(width/2, -length/2, width/2, -length/2 + radius);
        shape.lineTo(width/2, length/2 - radius);
        shape.quadraticCurveTo(width/2, length/2, width/2 - radius, length/2);
        shape.lineTo(-width/2 + radius, length/2);
        shape.quadraticCurveTo(-width/2, length/2, -width/2, length/2 - radius);
        shape.lineTo(-width/2, -length/2 + radius);
        shape.quadraticCurveTo(-width/2, -length/2, -width/2 + radius, -length/2);
        return shape;
    }

    // 1. Heavy Structural Base
    const baseShape = createRoundedRect(24, 16, 2);
    const baseExtrude = { depth: 1.5, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 4 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrude);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.set(0, -10, 0);
    group.add(baseMesh);

    parts.push({
        name: "Heavy Structural Base",
        description: "A robust cast-iron base providing vibrational stability and mounting points for the entire Seebeck generator assembly.",
        material: "Dark Steel",
        function: "Structural support and vibration dampening",
        assemblyOrder: 1,
        connections: ["Support Pillars", "Control Panel"],
        failureEffect: "Generator instability and misalignment of thermal contacts.",
        cascadeFailures: ["Thermal Interface Rupture", "Pillar Collapse"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Control Panel
    const panelShape = createRoundedRect(6, 4, 0.5);
    const panelExtrude = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 };
    const panelGeo = new THREE.ExtrudeGeometry(panelShape, panelExtrude);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    panelMesh.rotation.x = -Math.PI / 6;
    panelMesh.position.set(0, -7, 9);
    group.add(panelMesh);

    const screenGeo = new THREE.PlaneGeometry(5, 3);
    const screenMesh = new THREE.Mesh(screenGeo, displayScreenMaterial);
    screenMesh.position.set(0, -6.8, 9.2);
    screenMesh.rotation.x = -Math.PI / 6;
    group.add(screenMesh);
    animationMeshes.push({ mesh: screenMesh, type: "screen" });

    parts.push({
        name: "Diagnostic Control Panel",
        description: "High-tech operator interface displaying real-time voltage, thermal gradients, and module efficiency.",
        material: "Plastic & Electronics",
        function: "System monitoring",
        assemblyOrder: 2,
        connections: ["Heavy Structural Base", "Wiring Harness"],
        failureEffect: "Loss of telemetry and inability to regulate load.",
        cascadeFailures: ["Thermal Runaway", "Overvoltage"],
        originalPosition: { x: 0, y: -7, z: 9 },
        explodedPosition: { x: 0, y: -12, z: 15 }
    });

    // 3. Support Pillars (Complex Lathe)
    const supportPillars = new THREE.Group();
    const pillarPoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        const radius = 0.5 + Math.sin(i * 1.5) * 0.15 + (i%5===0 ? 0.3 : 0);
        pillarPoints.push( new THREE.Vector2( radius, i * 0.3 ) );
    }
    const pillarGeo = new THREE.LatheGeometry(pillarPoints, 32);
    
    const pillarPositions = [
        [-10, -9.5, -6], [10, -9.5, -6], [-10, -9.5, 6], [10, -9.5, 6],
        [-10, -9.5, 0], [10, -9.5, 0]
    ];
    
    pillarPositions.forEach((pos) => {
        const pillar = new THREE.Mesh(pillarGeo, chrome);
        pillar.position.set(pos[0], pos[1], pos[2]);
        supportPillars.add(pillar);
    });
    group.add(supportPillars);

    parts.push({
        name: "Vibration-Damped Support Pillars",
        description: "Six machined chrome pillars with internal pneumatic damping to isolate the thermoelectric modules from external shocks.",
        material: "Chrome",
        function: "Elevation and isolation",
        assemblyOrder: 3,
        connections: ["Heavy Structural Base", "Isotope Containment Vessel"],
        failureEffect: "Misalignment and uneven thermal stress.",
        cascadeFailures: ["Module Fracture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 4. Isotope Containment Vessel (Heat Source)
    const vesselGroup = new THREE.Group();
    const vesselPoints = [];
    vesselPoints.push(new THREE.Vector2(0, 0));
    vesselPoints.push(new THREE.Vector2(5, 0));
    vesselPoints.push(new THREE.Vector2(5.5, 0.5));
    vesselPoints.push(new THREE.Vector2(5.5, 4.5));
    vesselPoints.push(new THREE.Vector2(5, 5));
    vesselPoints.push(new THREE.Vector2(0, 5));
    const vesselGeo = new THREE.LatheGeometry(vesselPoints, 64);
    const vesselMesh = new THREE.Mesh(vesselGeo, steel);
    vesselMesh.position.set(0, -4, 0);
    vesselGroup.add(vesselMesh);

    // Glowing core exposed through slots
    const corePoints = [];
    corePoints.push(new THREE.Vector2(0, 0));
    corePoints.push(new THREE.Vector2(4.8, 0));
    corePoints.push(new THREE.Vector2(4.8, 4.5));
    corePoints.push(new THREE.Vector2(0, 4.5));
    const coreGeo = new THREE.LatheGeometry(corePoints, 64);
    const coreMesh = new THREE.Mesh(coreGeo, heatMaterial);
    coreMesh.position.set(0, -3.8, 0);
    vesselGroup.add(coreMesh);
    animationMeshes.push({ mesh: coreMesh, type: "heat" });

    // Shielding Ribs (Complex Extrusion)
    const ribShape = new THREE.Shape();
    ribShape.moveTo(-0.5, -2.5);
    ribShape.lineTo(0.5, -2.5);
    ribShape.lineTo(0.3, 2.5);
    ribShape.lineTo(-0.3, 2.5);
    ribShape.lineTo(-0.5, -2.5);
    const ribExtrude = { depth: 2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 };
    const ribGeo = new THREE.ExtrudeGeometry(ribShape, ribExtrude);
    
    for(let i=0; i<12; i++) {
        const rib = new THREE.Mesh(ribGeo, darkSteel);
        rib.position.set(Math.cos(i*Math.PI/6)*5.5, -1.5, Math.sin(i*Math.PI/6)*5.5);
        rib.rotation.y = -i*Math.PI/6;
        vesselGroup.add(rib);
    }
    group.add(vesselGroup);

    parts.push({
        name: "Radioisotope Containment Vessel",
        description: "Heavily shielded vessel housing a decaying radioisotope core that generates extreme, continuous heat.",
        material: "Steel and Radioactive Isotope",
        function: "Primary heat generation",
        assemblyOrder: 4,
        connections: ["Support Pillars", "Hot Side Heat Exchanger"],
        failureEffect: "Catastrophic loss of thermal gradient or radiation leak.",
        cascadeFailures: ["Total System Failure", "Environmental Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 5. Hot Side Heat Exchanger
    const hotExchangerShape = createRoundedRect(16, 12, 1);
    const hotExchangerExtrude = { depth: 1, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.1, bevelThickness: 0.2 };
    const hotExchangerGeo = new THREE.ExtrudeGeometry(hotExchangerShape, hotExchangerExtrude);
    const hotExchanger = new THREE.Mesh(hotExchangerGeo, copper);
    hotExchanger.rotation.x = Math.PI / 2;
    hotExchanger.position.set(0, 1, 0);
    group.add(hotExchanger);

    parts.push({
        name: "Copper Heat Exchanger (Hot Side)",
        description: "A massive, high-purity copper block designed to perfectly distribute extreme heat across the thermoelectric module array.",
        material: "Copper",
        function: "Thermal distribution",
        assemblyOrder: 5,
        connections: ["Isotope Containment Vessel", "Thermoelectric Module Array"],
        failureEffect: "Uneven heating causing severe thermal shock to the modules.",
        cascadeFailures: ["Module Fracture", "Efficiency Drop"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 6. Thermoelectric Module Array
    const tecGroup = new THREE.Group();
    const rows = 4;
    const cols = 6;
    const spacingX = 2.5;
    const spacingZ = 2.5;
    const pTypeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const nTypeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const plateShape = createRoundedRect(2.2, 2.2, 0.2);
    const plateExtrude = { depth: 0.1, bevelEnabled: false };
    const plateGeo = new THREE.ExtrudeGeometry(plateShape, plateExtrude);

    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            const moduleGrp = new THREE.Group();
            
            // Bottom Ceramic
            const bottomPlate = new THREE.Mesh(plateGeo, ceramicMaterial);
            bottomPlate.rotation.x = Math.PI / 2;
            bottomPlate.position.set(0, -0.4, 0);
            moduleGrp.add(bottomPlate);

            // Top Ceramic
            const topPlate = new THREE.Mesh(plateGeo, ceramicMaterial);
            topPlate.rotation.x = Math.PI / 2;
            topPlate.position.set(0, 0.5, 0);
            moduleGrp.add(topPlate);

            // Semiconductors (P/N pairs)
            for(let pr=0; pr<3; pr++) {
                for(let pc=0; pc<3; pc++) {
                    const isPType = (pr + pc) % 2 === 0;
                    const semi = new THREE.Mesh(isPType ? pTypeGeo : nTypeGeo, isPType ? pTypeMaterial : nTypeMaterial);
                    semi.position.set(-0.7 + pc*0.7, 0, -0.7 + pr*0.7);
                    moduleGrp.add(semi);
                }
            }

            moduleGrp.position.set(
                -((cols-1)*spacingX)/2 + c*spacingX,
                1.5,
                -((rows-1)*spacingZ)/2 + r*spacingZ
            );
            tecGroup.add(moduleGrp);
        }
    }
    group.add(tecGroup);

    parts.push({
        name: "Bismuth Telluride Thermoelectric Array",
        description: "A densely packed array of 24 massive Peltier/Seebeck modules, utilizing alternating P-type and N-type semiconductor pillars to convert thermal gradients directly into electrical current.",
        material: "Ceramic, Bismuth Telluride",
        function: "Thermoelectric power generation",
        assemblyOrder: 6,
        connections: ["Hot Side Heat Exchanger", "Cold Side Heat Exchanger", "Wiring Harness"],
        failureEffect: "Total loss of power generation capabilities.",
        cascadeFailures: ["Electrical Grid Failure"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 7. Cold Side Heat Exchanger
    const coldExchangerGeo = new THREE.ExtrudeGeometry(hotExchangerShape, hotExchangerExtrude);
    const coldExchanger = new THREE.Mesh(coldExchangerGeo, aluminum);
    coldExchanger.rotation.x = Math.PI / 2;
    coldExchanger.position.set(0, 3, 0);
    group.add(coldExchanger);

    parts.push({
        name: "Aluminum Heat Exchanger (Cold Side)",
        description: "A thick aluminum base plate for the heatsink, absorbing heat from the modules to maintain the temperature delta.",
        material: "Aluminum",
        function: "Heat absorption and thermal gradient maintenance",
        assemblyOrder: 7,
        connections: ["Thermoelectric Module Array", "Massive Finned Heatsink"],
        failureEffect: "Loss of temperature delta, halting power generation.",
        cascadeFailures: ["Thermal Runaway", "Module Melt"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 }
    });

    // 8. Massive Finned Heatsink
    const heatsinkGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(-0.15, 0);
    finShape.lineTo(-0.05, 8);
    finShape.lineTo(0.05, 8);
    finShape.lineTo(0.15, 0);
    finShape.lineTo(-0.15, 0);
    const finExtrude = { depth: 15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);

    for(let i=0; i<30; i++) {
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(-7.25 + i*0.5, 3, -7.5);
        heatsinkGroup.add(fin);
    }
    
    // Crossbars for fins
    const crossBarGeo = new THREE.CylinderGeometry(0.2, 0.2, 16, 16);
    for(let i=0; i<3; i++) {
        const crossBar = new THREE.Mesh(crossBarGeo, steel);
        crossBar.rotation.z = Math.PI / 2;
        crossBar.position.set(0, 7, -5 + i*5);
        heatsinkGroup.add(crossBar);
    }
    group.add(heatsinkGroup);

    parts.push({
        name: "Massive Finned Heatsink",
        description: "An array of 30 tall, extruded aluminum cooling fins with cross-bracing. Maximizes surface area to dissipate waste heat into the surrounding atmosphere.",
        material: "Aluminum",
        function: "Waste heat dissipation",
        assemblyOrder: 8,
        connections: ["Cold Side Heat Exchanger", "Cooling Fans"],
        failureEffect: "Rapid overheating of the cold side, nullifying the Seebeck effect.",
        cascadeFailures: ["Total System Shutdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 9. Active Cooling Fans (Animated)
    const fanGroup = new THREE.Group();
    const fanHousingShape = new THREE.Shape();
    fanHousingShape.absarc(0, 0, 3, 0, Math.PI*2, false);
    const fanHole = new THREE.Path();
    fanHole.absarc(0, 0, 2.8, 0, Math.PI*2, true);
    fanHousingShape.holes.push(fanHole);
    const fanHousingExtrude = { depth: 1, bevelEnabled: false };
    const fanHousingGeo = new THREE.ExtrudeGeometry(fanHousingShape, fanHousingExtrude);
    
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(1, 1.5, 0.5, 2.7);
    bladeShape.quadraticCurveTo(0, 2.8, -0.5, 2.7);
    bladeShape.quadraticCurveTo(-1, 1.5, 0, 0);
    const bladeExtrude = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeExtrude);
    
    for(let f=0; f<2; f++) {
        const singleFanGrp = new THREE.Group();
        const housing = new THREE.Mesh(fanHousingGeo, plastic);
        housing.position.set(0, 0, -0.5);
        singleFanGrp.add(housing);

        const rotor = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16), darkSteel);
        hub.rotation.x = Math.PI / 2;
        rotor.add(hub);

        for(let b=0; b<7; b++) {
            const blade = new THREE.Mesh(bladeGeo, plastic);
            blade.rotation.z = (b * Math.PI * 2) / 7;
            blade.rotation.y = Math.PI / 6; // pitch
            rotor.add(blade);
        }
        singleFanGrp.add(rotor);
        animationMeshes.push({ mesh: rotor, type: "fan" });

        singleFanGrp.position.set(0, 7, f===0 ? 8 : -8);
        fanGroup.add(singleFanGrp);
    }
    group.add(fanGroup);

    parts.push({
        name: "Dual Active Cooling Fans",
        description: "High-RPM, seven-blade axial fans providing forced convection across the massive heatsink to maintain optimal thermal delta.",
        material: "High-Density Plastic & Dark Steel",
        function: "Forced convection cooling",
        assemblyOrder: 9,
        connections: ["Massive Finned Heatsink", "Wiring Harness"],
        failureEffect: "Reduced cooling efficiency, limiting power output.",
        cascadeFailures: ["Thermal Throttle"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 10 }
    });

    // 10. Heavy Duty Wiring Harness
    const wirePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(8, 1.5, 0),
        new THREE.Vector3(10, 1.5, 2),
        new THREE.Vector3(10, -5, 5),
        new THREE.Vector3(5, -6, 8)
    ]);
    const wirePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 1.5, 0),
        new THREE.Vector3(-10, 1.5, 2),
        new THREE.Vector3(-10, -5, 5),
        new THREE.Vector3(-5, -6, 8)
    ]);
    const wireGeo1 = new THREE.TubeGeometry(wirePath1, 64, 0.3, 16, false);
    const wireGeo2 = new THREE.TubeGeometry(wirePath2, 64, 0.3, 16, false);
    const wire1 = new THREE.Mesh(wireGeo1, glowingWireMaterial);
    const wire2 = new THREE.Mesh(wireGeo2, glowingWireMaterial);
    group.add(wire1);
    group.add(wire2);
    animationMeshes.push({ mesh: wire1, type: "wire" });
    animationMeshes.push({ mesh: wire2, type: "wire" });

    parts.push({
        name: "Superconducting Wiring Harness",
        description: "Thick, heavily insulated cabling carrying high-amperage direct current from the thermoelectric modules to the load and control systems.",
        material: "Copper Core with Glowing Insulation",
        function: "Power transmission",
        assemblyOrder: 10,
        connections: ["Thermoelectric Module Array", "Control Panel", "Electrical Load Grid"],
        failureEffect: "Short circuit and total loss of power delivery.",
        cascadeFailures: ["Electrocution Hazard", "Control Panel Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 5 }
    });

    // 11. Hydraulic Compression Tensioners
    const tensionerGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.15, 0.15, 8, 16);
    const pistonGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    
    const tensionerPositions = [
        [-8.5, 2, -6.5], [8.5, 2, -6.5], [-8.5, 2, 6.5], [8.5, 2, 6.5]
    ];

    tensionerPositions.forEach((pos) => {
        const tGrp = new THREE.Group();
        const rod = new THREE.Mesh(rodGeo, chrome);
        const piston = new THREE.Mesh(pistonGeo, steel);
        piston.position.set(0, -2.5, 0);
        tGrp.add(rod);
        tGrp.add(piston);
        tGrp.position.set(pos[0], pos[1], pos[2]);
        tensionerGroup.add(tGrp);
        animationMeshes.push({ mesh: tGrp, type: "tensioner" });
    });
    group.add(tensionerGroup);

    parts.push({
        name: "Hydraulic Compression Tensioners",
        description: "Maintains exact, continuous mechanical pressure between the heat exchangers and the delicate ceramic surfaces of the thermoelectric modules to guarantee optimal thermal contact.",
        material: "Chrome and Steel",
        function: "Dynamic mechanical compression",
        assemblyOrder: 11,
        connections: ["Hot Side Heat Exchanger", "Cold Side Heat Exchanger"],
        failureEffect: "Loss of thermal contact pressure, severely degrading efficiency.",
        cascadeFailures: ["Module Fracture due to expansion shifting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 10, z: 0 }
    });

    // 12. Energy Storage Capacitor Bank
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    for(let i=0; i<3; i++) {
        const cap = new THREE.Mesh(capGeo, plastic);
        cap.position.set(-3 + i*3, -7.5, -5);
        cap.rotation.x = Math.PI/2;
        
        // Cap terminals
        const termGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
        const term1 = new THREE.Mesh(termGeo, copper);
        term1.position.set(0, 2, 0.5);
        const term2 = new THREE.Mesh(termGeo, copper);
        term2.position.set(0, 2, -0.5);
        cap.add(term1);
        cap.add(term2);
        
        capGroup.add(cap);
    }
    group.add(capGroup);

    parts.push({
        name: "High-Capacity Supercapacitor Bank",
        description: "Smooths voltage fluctuations and provides immediate burst power from the Seebeck generator's steady DC output.",
        material: "Plastic and Chemical Dielectric",
        function: "Power smoothing and storage",
        assemblyOrder: 12,
        connections: ["Heavy Structural Base", "Wiring Harness"],
        failureEffect: "Voltage spikes damaging the load.",
        cascadeFailures: ["Inverter Burnout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -18, z: -10 }
    });

    // 13. High-Voltage Power Output Load (Glowing Plasma Globe)
    const globeGroup = new THREE.Group();
    const baseLathePts = [
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(1.5, 0.2),
        new THREE.Vector2(1.2, 1),
        new THREE.Vector2(0.8, 2)
    ];
    const globeBaseGeo = new THREE.LatheGeometry(baseLathePts, 32);
    const globeBase = new THREE.Mesh(globeBaseGeo, darkSteel);
    globeBase.position.set(0, -9, 13);
    globeGroup.add(globeBase);

    const bulbGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const bulb = new THREE.Mesh(bulbGeo, glass);
    bulb.position.set(0, -5, 13);
    globeGroup.add(bulb);

    const plasmaGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const plasma = new THREE.Mesh(plasmaGeo, electricityMaterial);
    plasma.position.set(0, -5, 13);
    globeGroup.add(plasma);
    animationMeshes.push({ mesh: plasma, type: "plasma" });
    
    // Internal Arcs
    for(let i=0; i<5; i++) {
        const arcGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1),
            new THREE.Vector3(Math.random()*2.5-1.25, Math.random()*2.5-1.25, Math.random()*2.5-1.25)
        ]), 20, 0.05, 8, false);
        const arc = new THREE.Mesh(arcGeo, glowingWireMaterial);
        arc.position.set(0, -5, 13); // Set origin to center of bulb
        globeGroup.add(arc);
        animationMeshes.push({ mesh: arc, type: "arc" });
    }

    group.add(globeGroup);

    parts.push({
        name: "Plasma Confinement Electrical Load",
        description: "A specialized demonstration load utilizing raw DC current to excite rare noble gases into a visible plasma state, proving the power output of the generator.",
        material: "Glass, Steel, Plasma",
        function: "Energy consumption and visualization",
        assemblyOrder: 13,
        connections: ["Wiring Harness", "Heavy Structural Base"],
        failureEffect: "Zero-load condition causing generator free-spin or voltage overload.",
        cascadeFailures: ["Capacitor Detonation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 25 }
    });

    // 14. Instrumentation Sensors & Probes
    const sensorGroup = new THREE.Group();
    const probeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    for(let i=0; i<6; i++) {
        const probe = new THREE.Mesh(probeGeo, steel);
        probe.rotation.z = Math.PI/2;
        // Interleaved between the modules
        probe.position.set(0, 1.5, -6 + i*2.4);
        sensorGroup.add(probe);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Thermocouple Instrumentation Probes",
        description: "Micro-probes inserted directly between the TEC modules to provide hyper-accurate telemetry to the control panel.",
        material: "Steel and Platinum",
        function: "Thermal telemetry",
        assemblyOrder: 14,
        connections: ["Thermoelectric Module Array", "Control Panel"],
        failureEffect: "Blind operation of the generator.",
        cascadeFailures: ["Unnoticed Thermal Runaway"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 1.5, z: 0 }
    });

    // 15. Outer Protective Cage
    const cageGroup = new THREE.Group();
    const frameGeo = new THREE.CylinderGeometry(0.2, 0.2, 28, 16);
    
    // Vertical rails
    const railPositions = [
        [-12, -8, -8], [12, -8, -8], [-12, -8, 8], [12, -8, 8]
    ];
    railPositions.forEach(pos => {
        const rail = new THREE.Mesh(frameGeo, darkSteel);
        rail.position.set(pos[0], pos[1] + 14, pos[2]);
        cageGroup.add(rail);
    });

    // Top square
    const topRailGeoX = new THREE.CylinderGeometry(0.2, 0.2, 24, 16);
    const topRailGeoZ = new THREE.CylinderGeometry(0.2, 0.2, 16, 16);
    
    const tr1 = new THREE.Mesh(topRailGeoX, darkSteel);
    tr1.rotation.z = Math.PI/2;
    tr1.position.set(0, 20, -8);
    cageGroup.add(tr1);
    
    const tr2 = new THREE.Mesh(topRailGeoX, darkSteel);
    tr2.rotation.z = Math.PI/2;
    tr2.position.set(0, 20, 8);
    cageGroup.add(tr2);

    const tr3 = new THREE.Mesh(topRailGeoZ, darkSteel);
    tr3.rotation.x = Math.PI/2;
    tr3.position.set(-12, 20, 0);
    cageGroup.add(tr3);

    const tr4 = new THREE.Mesh(topRailGeoZ, darkSteel);
    tr4.rotation.x = Math.PI/2;
    tr4.position.set(12, 20, 0);
    cageGroup.add(tr4);

    group.add(cageGroup);

    parts.push({
        name: "Industrial Roll Cage",
        description: "Heavy-duty steel exoskeleton protecting the sensitive internal fins, modules, and isotopic core from catastrophic external impacts.",
        material: "Dark Steel",
        function: "Impact protection",
        assemblyOrder: 15,
        connections: ["Heavy Structural Base"],
        failureEffect: "Vulnerability to external physical damage.",
        cascadeFailures: ["Frame Collapse", "Core Breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    const description = "The Mark V Hyper-Seebeck Generator is a massive solid-state energy converter. It harnesses the extreme thermal energy emitted by a decaying radioisotope core, creating a massive temperature delta against a forced-air cooled finned heatsink. Sandwiched between these extremes are dense arrays of Bismuth Telluride semiconductor pillars that generate high-amperage direct current via the Seebeck effect. Characterized by zero moving parts in its primary generation cycle, it boasts immense reliability.";

    const quizQuestions = [
        {
            question: "What physical principle allows this generator to produce electricity?",
            options: ["The Seebeck Effect", "Electromagnetic Induction", "Photovoltaic Effect", "Piezoelectric Effect"],
            correctAnswer: 0,
            explanation: "The generator uses the Seebeck effect, where a temperature difference between two dissimilar electrical conductors or semiconductors produces a voltage difference."
        },
        {
            question: "What role do the P-type and N-type pillars play in the module?",
            options: ["They act as structural support", "They form the thermocouple junctions converting heat flow to current", "They filter radiation from the isotope", "They store excess electrical charge"],
            correctAnswer: 1,
            explanation: "In a thermoelectric module, alternating P-type and N-type semiconductor pillars are connected electrically in series and thermally in parallel to generate current from the heat flow."
        },
        {
            question: "Why is an extreme temperature delta (difference) necessary?",
            options: ["To keep the isotope from melting", "To increase the voltage output and overall efficiency", "To power the cooling fans", "To prevent the plasma globe from exploding"],
            correctAnswer: 1,
            explanation: "The efficiency and voltage output of a Seebeck generator scale directly with the temperature difference (delta T) between the hot side and the cold side."
        },
        {
            question: "What is the function of the hydraulic compression tensioners?",
            options: ["To spin the cooling fans", "To pump coolant through the fins", "To maintain immense mechanical pressure for optimal thermal contact", "To act as shock absorbers for the base"],
            correctAnswer: 2,
            explanation: "Thermoelectric modules require extreme, uniform pressure against the heat exchangers to minimize thermal contact resistance and maximize heat transfer."
        },
        {
            question: "What occurs if the active cooling fans fail?",
            options: ["The generator produces more power", "The cold side heats up, destroying the thermal delta and halting power output", "The isotope core shuts down", "The supercapacitors instantly discharge"],
            correctAnswer: 1,
            explanation: "Without forced air to dissipate waste heat, the massive finned heatsink will saturate. The cold side temperature will rise to match the hot side, eliminating the temperature gradient required for the Seebeck effect."
        }
    ];

    function animate(time, speed, meshes) {
        // time is continuous elapsed time, speed is a multiplier (0 to 2)
        const t = time * speed;

        animationMeshes.forEach(item => {
            if (item.type === "fan") {
                // Fans spin very fast when running
                item.mesh.rotation.z -= 15 * speed * 0.016;
            } 
            else if (item.type === "heat") {
                // Heat core pulses
                const intensity = 2.5 + Math.sin(t * 2) * 0.5;
                item.mesh.material.emissiveIntensity = intensity;
            }
            else if (item.type === "screen") {
                // Screen flickers slightly based on data
                item.mesh.material.emissiveIntensity = 1 + Math.random() * 0.2 * speed;
            }
            else if (item.type === "wire") {
                // Wires pulse with energy
                const wireInt = 1.2 + Math.sin(t * 5 + item.mesh.uuid.charCodeAt(0)) * 0.4 * speed;
                item.mesh.material.emissiveIntensity = wireInt;
            }
            else if (item.type === "plasma") {
                // Plasma globe distorts and pulses
                const scale = 1 + Math.sin(t * 10) * 0.05 * speed;
                item.mesh.scale.set(scale, scale, scale);
                item.mesh.rotation.y += 2 * speed * 0.016;
                item.mesh.rotation.z += 1.5 * speed * 0.016;
            }
            else if (item.type === "arc") {
                // Plasma arcs jitter randomly
                if (Math.random() < 0.2 * speed) {
                    item.mesh.rotation.x = Math.random() * Math.PI * 2;
                    item.mesh.rotation.y = Math.random() * Math.PI * 2;
                    item.mesh.rotation.z = Math.random() * Math.PI * 2;
                }
            }
            else if (item.type === "tensioner") {
                // Tensioners subtly adjust to thermal expansion
                const expansion = Math.sin(t * 0.5) * 0.02 * speed;
                if (!item.mesh.userData.originalY) item.mesh.userData.originalY = item.mesh.position.y;
                item.mesh.position.y = item.mesh.userData.originalY + expansion;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createSeebeckGenerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
