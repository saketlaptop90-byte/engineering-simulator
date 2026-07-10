import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatedMeshes = [];

    // Custom Materials for glows and effects
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const redMat = new THREE.MeshStandardMaterial({color: 0xaa0000, roughness: 0.4, metalness: 0.3});
    const blueMat = new THREE.MeshStandardMaterial({color: 0x0000aa, roughness: 0.4, metalness: 0.3});

    // Helper to register parts
    const addPart = (mesh, name, description, materialName, func, assemblyOrder, connections, failEffect, cascade, origPos, explPos) => {
        mesh.name = name;
        group.add(mesh);
        parts.push({
            name, description, material: materialName, function: func,
            assemblyOrder, connections, failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos, explodedPosition: explPos
        });
    };

    // 1. Structural Scaffolding & Base Platform
    const scaffoldGroup = new THREE.Group();
    
    // Base Plate
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-12, -12);
    baseShape.lineTo(12, -12);
    baseShape.lineTo(12, 12);
    baseShape.lineTo(-12, 12);
    baseShape.lineTo(-12, -12);
    const baseExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -0.5;
    scaffoldGroup.add(baseMesh);

    // Vertical Columns
    const colGeo = new THREE.CylinderGeometry(0.3, 0.3, 16, 16);
    for(let x=-10; x<=10; x+=10) {
        for(let z=-10; z<=10; z+=10) {
            const col = new THREE.Mesh(colGeo, darkSteel);
            col.position.set(x, 7.5, z);
            scaffoldGroup.add(col);
            
            // Column Flanges at base
            const colFlangeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
            const colFlange = new THREE.Mesh(colFlangeGeo, steel);
            colFlange.position.set(x, 0.1, z);
            scaffoldGroup.add(colFlange);
        }
    }
    
    // Cross Bracing
    const crossGeo = new THREE.CylinderGeometry(0.1, 0.1, 14.14, 8);
    for(let y=4; y<=12; y+=4) {
        for(let x=-10; x<10; x+=10) {
            const cross1 = new THREE.Mesh(crossGeo, darkSteel);
            cross1.position.set(x + 5, y, -10);
            cross1.rotation.z = Math.PI / 4;
            scaffoldGroup.add(cross1);
            
            const cross2 = new THREE.Mesh(crossGeo, darkSteel);
            cross2.position.set(x + 5, y, 10);
            cross2.rotation.z = -Math.PI / 4;
            scaffoldGroup.add(cross2);
        }
    }

    addPart(scaffoldGroup, 'structural_scaffolding', 'Heavy-duty steel support framework with anti-vibration mounts for cryogenic equipment.', 'darkSteel', 'Provides rigid mounting points, structural integrity, and dampens operational vibrations from heavy compressors.', 1, ['main_coldbox', 'primary_compressor', 'helium_storage_dewar'], 'Structural collapse', ['total system destruction', 'pipe ruptures'], {x:0, y:0, z:0}, {x:0, y:-10, z:0});

    // 2. Main Coldbox
    const coldboxGroup = new THREE.Group();
    // Complex Lathed Body
    const cbPoints = [];
    for ( let i = 0; i <= 30; i ++ ) {
        const radius = 3 + Math.sin(i * 0.3) * 0.2 + (i===0||i===30 ? -0.5 : 0);
        cbPoints.push( new THREE.Vector2( radius, i * 0.4 ) );
    }
    const cbGeo = new THREE.LatheGeometry( cbPoints, 64 );
    const cbMesh = new THREE.Mesh( cbGeo, steel );
    cbMesh.position.y = 0.5;
    coldboxGroup.add(cbMesh);
    
    // Massive Flanges on Coldbox
    const flangeGeo = new THREE.TorusGeometry(3.4, 0.15, 16, 64);
    for(let y=2.5; y<11; y+=2.5) {
        const flange = new THREE.Mesh(flangeGeo, chrome);
        flange.rotation.x = Math.PI/2;
        flange.position.y = y;
        coldboxGroup.add(flange);
        // Bolting details
        const boltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        for(let a=0; a<Math.PI*2; a+=Math.PI/16) {
            const bolt = new THREE.Mesh(boltGeo, darkSteel);
            bolt.position.set(Math.cos(a)*3.4, y, Math.sin(a)*3.4);
            coldboxGroup.add(bolt);
        }
    }
    
    // Inspection Port
    const portGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const port = new THREE.Mesh(portGeo, steel);
    port.rotation.z = Math.PI/2;
    port.position.set(3, 6, 0);
    coldboxGroup.add(port);
    const portGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.55, 32), glass);
    portGlass.rotation.z = Math.PI/2;
    portGlass.position.set(3, 6, 0);
    coldboxGroup.add(portGlass);

    coldboxGroup.position.set(0, 0, 0);
    addPart(coldboxGroup, 'main_coldbox', 'Massive high-vacuum insulated enclosure housing cryogenic heat exchangers and separators.', 'steel', 'Isolates internal cryogenic temperatures (down to 4.2K) from ambient heat leaks using multi-layer insulation and vacuum.', 2, ['heat_exchanger_array', 'expansion_turbine_1', 'expansion_turbine_2'], 'Massive heat leak', ['liquefaction failure', 'rapid boil-off'], {x:0, y:0, z:0}, {x:0, y:5, z:-15});

    // 3. Primary Compressor Station
    const compressorGroup = new THREE.Group();
    // Motor block
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const motor = new THREE.Mesh(motorGeo, darkSteel);
    motor.rotation.z = Math.PI/2;
    compressorGroup.add(motor);
    
    // Cooling fins on motor
    const finGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 32);
    for(let x=-1.2; x<=1.2; x+=0.15) {
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.rotation.z = Math.PI/2;
        fin.position.x = x;
        compressorGroup.add(fin);
    }
    
    // Compressor casing
    const compCasingGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const compCasing = new THREE.Mesh(compCasingGeo, steel);
    compCasing.rotation.z = Math.PI/2;
    compCasing.position.x = 2.75;
    compressorGroup.add(compCasing);
    
    // Coupling between motor and compressor
    const couplingGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.8, 16);
    const coupling = new THREE.Mesh(couplingGeo, chrome);
    coupling.rotation.z = Math.PI/2;
    coupling.position.x = 1.5 + 0.4;
    compressorGroup.add(coupling);
    animatedMeshes.push({ mesh: coupling, type: 'spin_x', speed: 30 });

    compressorGroup.position.set(-6, 2, 6);
    addPart(compressorGroup, 'primary_compressor', 'Heavy-duty rotary screw compressor unit powered by a 500kW induction motor.', 'aluminum', 'Compresses warm return helium gas from 1 bar up to 15-20 bar for the liquefaction cycle.', 3, ['cooling_water_manifold', 'purification_adsorber'], 'Loss of system pressure', ['total system halt', 'no gas flow'], {x:-6, y:2, z:6}, {x:-15, y:2, z:12});

    // 4. Secondary Compressor / Booster
    const secCompGroup = compressorGroup.clone();
    secCompGroup.position.set(-6, 2, 2);
    const secCoupling = secCompGroup.children[secCompGroup.children.length - 1];
    animatedMeshes.push({ mesh: secCoupling, type: 'spin_x', speed: 40 });
    addPart(secCompGroup, 'secondary_compressor', 'High-pressure booster compressor stage for enhanced mass flow.', 'aluminum', 'Further pressurizes helium gas for optimal expansion cooling in the turbines.', 4, ['primary_compressor', 'transfer_lines'], 'Pressure drop', ['reduced liquefaction rate'], {x:-6, y:2, z:2}, {x:-15, y:2, z:0});

    // 5. Expansion Turbine 1 (High Temp)
    const turbineGroup1 = new THREE.Group();
    // Turbine volute housing
    const voluteGeo = new THREE.TorusGeometry(0.8, 0.4, 32, 64, Math.PI * 1.5);
    const volute = new THREE.Mesh(voluteGeo, chrome);
    turbineGroup1.add(volute);
    // Center casing
    const tCenterGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const tCenter = new THREE.Mesh(tCenterGeo, steel);
    tCenter.rotation.x = Math.PI/2;
    turbineGroup1.add(tCenter);
    // Exposed turbine rotor blades for visual flair
    const rotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const rotorMesh = new THREE.Mesh(rotorGeo, darkSteel);
    rotorMesh.rotation.x = Math.PI/2;
    rotorMesh.position.z = 0.5;
    turbineGroup1.add(rotorMesh);
    const bladeGeo = new THREE.BoxGeometry(0.9, 0.1, 0.1);
    const blades = new THREE.Group();
    for(let i=0; i<8; i++) {
        const blade = new THREE.Mesh(bladeGeo, chrome);
        blade.rotation.z = (Math.PI/4) * i;
        blades.add(blade);
    }
    blades.position.z = 0.6;
    turbineGroup1.add(blades);
    animatedMeshes.push({ mesh: blades, type: 'spin_z', speed: 80 });

    turbineGroup1.position.set(3, 8, 2);
    addPart(turbineGroup1, 'expansion_turbine_1', 'First stage cryogenic turboexpander featuring dynamic gas bearings (120,000 RPM).', 'chrome', 'Removes energy from high-pressure helium gas through isentropic expansion, dropping temps from 80K to 40K.', 5, ['main_coldbox', 'heat_exchanger_array'], 'Bearing crash', ['overheating', 'turbine destruction', 'cycle stop'], {x:3, y:8, z:2}, {x:8, y:12, z:8});

    // 6. Expansion Turbine 2 (Low Temp)
    const turbineGroup2 = turbineGroup1.clone();
    turbineGroup2.position.set(3, 4, 2);
    const blades2 = turbineGroup2.children[turbineGroup2.children.length - 1];
    animatedMeshes.push({ mesh: blades2, type: 'spin_z', speed: 100 });
    addPart(turbineGroup2, 'expansion_turbine_2', 'Second stage ultra-low temp cryogenic turboexpander.', 'chrome', 'Cools helium gas down to 15K, preparing it for the final Joule-Thomson expansion.', 6, ['expansion_turbine_1', 'phase_separator'], 'Loss of cooling power', ['no liquid helium production'], {x:3, y:4, z:2}, {x:8, y:4, z:8});

    // 7. Heat Exchanger Array (Inside Coldbox - highly detailed matrix)
    const hxGroup = new THREE.Group();
    const hxCoreGeo = new THREE.BoxGeometry(2.5, 9, 2.5);
    const hxCore = new THREE.Mesh(hxCoreGeo, copper);
    hxGroup.add(hxCore);
    
    // Add intricate fins on the outside of the HX core
    const hxFinGeo = new THREE.BoxGeometry(2.6, 0.05, 2.6);
    for(let y=-4; y<=4; y+=0.15) {
        const fin = new THREE.Mesh(hxFinGeo, aluminum);
        fin.position.y = y;
        hxGroup.add(fin);
    }

    // Piping entering/exiting HX
    const hxPipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const hxPipe1 = new THREE.Mesh(hxPipeGeo, steel);
    hxPipe1.position.set(0, 5, 0);
    hxGroup.add(hxPipe1);
    const hxPipe2 = new THREE.Mesh(hxPipeGeo, steel);
    hxPipe2.position.set(0, -5, 0);
    hxGroup.add(hxPipe2);

    hxGroup.position.set(0, 6, 0);
    addPart(hxGroup, 'heat_exchanger_array', 'Massive brazed aluminum plate-fin heat exchanger matrix with thousands of micro-channels.', 'copper', 'Pre-cools incoming high-pressure gas using the sensible heat of the returning low-pressure cold gas.', 7, ['main_coldbox'], 'Thermal short or blockage', ['liquefaction stops completely'], {x:0, y:6, z:0}, {x:0, y:20, z:0});

    // 8. Vacuum Insulated Pipes (Complex Routing)
    const pipesGroup = new THREE.Group();
    
    class ComplexCurve1 extends THREE.Curve {
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const p0 = new THREE.Vector3(0, 10, 0);
            const p1 = new THREE.Vector3(5, 10, 0);
            const p2 = new THREE.Vector3(5, 5, -6);
            const p3 = new THREE.Vector3(8, 5, -6);
            const point = new THREE.Vector3(
                Math.pow(1-t, 3)*p0.x + 3*Math.pow(1-t, 2)*t*p1.x + 3*(1-t)*Math.pow(t, 2)*p2.x + Math.pow(t, 3)*p3.x,
                Math.pow(1-t, 3)*p0.y + 3*Math.pow(1-t, 2)*t*p1.y + 3*(1-t)*Math.pow(t, 2)*p2.y + Math.pow(t, 3)*p3.y,
                Math.pow(1-t, 3)*p0.z + 3*Math.pow(1-t, 2)*t*p1.z + 3*(1-t)*Math.pow(t, 2)*p2.z + Math.pow(t, 3)*p3.z
            );
            return optionalTarget.copy(point);
        }
    }
    const path1 = new ComplexCurve1();
    const pipeGeo1 = new THREE.TubeGeometry( path1, 64, 0.4, 16, false );
    const pipe1 = new THREE.Mesh(pipeGeo1, chrome);
    pipesGroup.add(pipe1);

    class ComplexCurve2 extends THREE.Curve {
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const p0 = new THREE.Vector3(-3, 2, 6);
            const p1 = new THREE.Vector3(-3, 5, 0);
            const p2 = new THREE.Vector3(0, 5, 0);
            const p3 = new THREE.Vector3(0, 2, 0);
            const point = new THREE.Vector3(
                Math.pow(1-t, 3)*p0.x + 3*Math.pow(1-t, 2)*t*p1.x + 3*(1-t)*Math.pow(t, 2)*p2.x + Math.pow(t, 3)*p3.x,
                Math.pow(1-t, 3)*p0.y + 3*Math.pow(1-t, 2)*t*p1.y + 3*(1-t)*Math.pow(t, 2)*p2.y + Math.pow(t, 3)*p3.y,
                Math.pow(1-t, 3)*p0.z + 3*Math.pow(1-t, 2)*t*p1.z + 3*(1-t)*Math.pow(t, 2)*p2.z + Math.pow(t, 3)*p3.z
            );
            return optionalTarget.copy(point);
        }
    }
    const path2 = new ComplexCurve2();
    const pipeGeo2 = new THREE.TubeGeometry( path2, 64, 0.3, 16, false );
    const pipe2 = new THREE.Mesh(pipeGeo2, steel);
    pipesGroup.add(pipe2);

    addPart(pipesGroup, 'vacuum_insulated_pipes', 'Multi-layered vacuum-jacketed transfer lines with inner stainless bellows.', 'chrome', 'Transports supercritical and liquid helium between modules with near-zero conductive/convective heat leak.', 8, ['main_coldbox', 'helium_storage_dewar'], 'Vacuum loss', ['rapid boil-off', 'pipe freezing', 'ice ball formation'], {x:0, y:0, z:0}, {x:5, y:15, z:10});

    // 9. Helium Storage Dewar (Massive Tank)
    const dewarGroup = new THREE.Group();
    const dewarGeo = new THREE.CylinderGeometry(3.5, 3.5, 8, 64);
    const dewarMesh = new THREE.Mesh(dewarGeo, steel);
    dewarMesh.position.y = 4;
    dewarGroup.add(dewarMesh);
    // Dome tops
    const domeGeo = new THREE.SphereGeometry(3.5, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
    const topDome = new THREE.Mesh(domeGeo, steel);
    topDome.position.y = 8;
    dewarGroup.add(topDome);
    const botDome = new THREE.Mesh(domeGeo, steel);
    botDome.rotation.x = Math.PI;
    botDome.position.y = 0;
    dewarGroup.add(botDome);

    // Dewar Support Legs
    const legGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    for(let i=0; i<6; i++) {
        const leg = new THREE.Mesh(legGeo, darkSteel);
        const a = (Math.PI*2/6) * i;
        leg.position.set(Math.cos(a)*3, -1.5, Math.sin(a)*3);
        dewarGroup.add(leg);
    }
    
    // Liquid Level Indicator Array
    const indicatorGeo = new THREE.BoxGeometry(0.2, 6, 0.2);
    const indicator = new THREE.Mesh(indicatorGeo, plastic);
    indicator.position.set(3.6, 4, 0);
    dewarGroup.add(indicator);
    const liquidBarGeo = new THREE.BoxGeometry(0.25, 4, 0.25);
    const liquidBar = new THREE.Mesh(liquidBarGeo, neonBlue);
    liquidBar.position.set(3.6, 3, 0);
    dewarGroup.add(liquidBar);
    animatedMeshes.push({ mesh: liquidBar, type: 'level_fluctuate', speed: 0.5 });

    dewarGroup.position.set(8, 2, -6);
    addPart(dewarGroup, 'helium_storage_dewar', '10,000-liter super-insulated liquid helium storage vessel with internal radiation shields.', 'steel', 'Safely stores liquid helium at 4.2K, buffering production before distribution to experiments.', 9, ['vacuum_insulated_pipes', 'safety_relief_system'], 'Catastrophic insulation failure', ['explosive pressure buildup', 'venting'], {x:8, y:2, z:-6}, {x:20, y:5, z:-15});

    // 10. Phase Separator & J-T Valve
    const psGroup = new THREE.Group();
    const psGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const psMesh = new THREE.Mesh(psGeo, aluminum);
    psGroup.add(psMesh);
    
    // J-T Valve Actuator
    const jtActGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const jtAct = new THREE.Mesh(jtActGeo, redMat);
    jtAct.position.set(0, 1.5, 0);
    psGroup.add(jtAct);
    const jtWheelGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    const jtWheel = new THREE.Mesh(jtWheelGeo, darkSteel);
    jtWheel.position.set(0, 2, 0);
    jtWheel.rotation.x = Math.PI/2;
    psGroup.add(jtWheel);
    animatedMeshes.push({ mesh: jtWheel, type: 'spin_y', speed: 1 }); // Slow adjustment

    psGroup.position.set(0, 1.25, 0);
    addPart(psGroup, 'phase_separator', 'Joule-Thomson expansion valve atop a phase separation vessel.', 'aluminum', 'Performs final isenthalpic expansion, dropping fluid below lambda point or generating 4.2K liquid-gas mixture.', 10, ['heat_exchanger_array', 'helium_storage_dewar'], 'Valve freeze/stuck', ['production halts completely'], {x:0, y:1.25, z:0}, {x:0, y:-3, z:0});

    // 11. Control Station
    const controlGroup = new THREE.Group();
    // Consoles
    const deskGeo = new THREE.BoxGeometry(4, 1.5, 2);
    const desk = new THREE.Mesh(deskGeo, plastic);
    desk.position.y = 0.75;
    controlGroup.add(desk);
    
    // Multiple Monitors
    const screenGeo = new THREE.BoxGeometry(1.5, 1, 0.1);
    
    const screen1 = new THREE.Mesh(screenGeo, neonBlue);
    screen1.position.set(-1.2, 2, -0.5);
    screen1.rotation.y = Math.PI/8;
    controlGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo, neonGreen);
    screen2.position.set(0, 2, -0.6);
    controlGroup.add(screen2);
    
    const screen3 = new THREE.Mesh(screenGeo, neonRed);
    screen3.position.set(1.2, 2, -0.5);
    screen3.rotation.y = -Math.PI/8;
    controlGroup.add(screen3);
    
    animatedMeshes.push({ mesh: screen1, type: 'flicker', speed: 12 });
    animatedMeshes.push({ mesh: screen2, type: 'flicker', speed: 7 });
    animatedMeshes.push({ mesh: screen3, type: 'blink', speed: 1 }); // Alert screen

    // Keyboards / Panels
    const kbGeo = new THREE.BoxGeometry(1, 0.1, 0.5);
    const kb = new THREE.Mesh(kbGeo, darkSteel);
    kb.position.set(0, 1.55, 0.2);
    kb.rotation.x = Math.PI/16;
    controlGroup.add(kb);

    controlGroup.position.set(0, 0, 10);
    addPart(controlGroup, 'control_station', 'Advanced SCADA operator terminal for complete liquefaction cycle monitoring.', 'plastic', 'Monitors RTD temperatures, pressures, turbine speeds, and actuates cryogenic valves.', 11, ['status_lighting_system', 'transfer_lines'], 'Loss of telemetry', ['blind operation', 'emergency shutdown'], {x:0, y:0, z:10}, {x:0, y:2, z:18});

    // 12. Transfer Lines & Pneumatics (Massive bundle of lines)
    const transferGroup = new THREE.Group();
    class LineCurve extends THREE.Curve {
        constructor(offsetX, offsetZ) {
            super();
            this.offsetX = offsetX;
            this.offsetZ = offsetZ;
        }
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const tx = t * 10 - 5 + this.offsetX;
            const ty = Math.sin(t * Math.PI * 4) * 0.5 + 1;
            const tz = t * 10 - 5 + this.offsetZ;
            return optionalTarget.set( tx, ty, tz );
        }
    }
    
    for(let i=0; i<8; i++) {
        const path = new LineCurve(Math.random(), Math.random()*2);
        const tubeGeo = new THREE.TubeGeometry( path, 64, 0.05, 8, false );
        const line = new THREE.Mesh(tubeGeo, rubber);
        transferGroup.add(line);
    }
    transferGroup.position.set(-2, 0.5, 4);
    addPart(transferGroup, 'transfer_lines', 'Massive bundle of pneumatic and instrumentation signal lines.', 'rubber', 'Transmits control signals from the SCADA and pressurized air to actuate massive cryogenic valves.', 12, ['control_station', 'phase_separator'], 'Line rupture', ['loss of valve control', 'fail-safe trigger'], {x:-2, y:0.5, z:4}, {x:-8, y:1, z:12});

    // 13. Safety Relief System (Vent stacks)
    const safetyGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 16);
    const stack1 = new THREE.Mesh(stackGeo, steel);
    stack1.position.set(-1, 5, 0);
    safetyGroup.add(stack1);
    
    const stack2 = new THREE.Mesh(stackGeo, steel);
    stack2.position.set(1, 5, 0);
    safetyGroup.add(stack2);

    // Burst discs
    const discGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
    const disc1 = new THREE.Mesh(discGeo, copper);
    disc1.position.set(-1, 10, 0);
    safetyGroup.add(disc1);
    const disc2 = new THREE.Mesh(discGeo, copper);
    disc2.position.set(1, 10, 0);
    safetyGroup.add(disc2);
    
    safetyGroup.position.set(4, 12, -4); 
    addPart(safetyGroup, 'safety_relief_system', 'Parallel rupture discs and relief valves venting to dedicated recovery or atmosphere.', 'steel', 'Prevents catastrophic overpressure in cryogenic vessels if vacuum is lost and liquid rapidly boils.', 13, ['helium_storage_dewar', 'main_coldbox'], 'Premature rupture', ['massive loss of helium inventory'], {x:4, y:12, z:-4}, {x:12, y:20, z:-8});

    // 14. Cooling Water Manifold (Pipes & Pumps)
    const waterGroup = new THREE.Group();
    const wpGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    
    const coldWater = new THREE.Mesh(wpGeo, blueMat);
    coldWater.rotation.x = Math.PI/2;
    coldWater.position.set(0, 0, 4);
    waterGroup.add(coldWater);
    
    const hotWater = new THREE.Mesh(wpGeo, redMat);
    hotWater.rotation.x = Math.PI/2;
    hotWater.position.set(0, 1, 4);
    waterGroup.add(hotWater);

    // Water Pump
    const pumpGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const pump = new THREE.Mesh(pumpGeo, darkSteel);
    pump.position.set(-3, 0.5, 4);
    waterGroup.add(pump);
    animatedMeshes.push({ mesh: pump, type: 'vibrate', speed: 50 });

    waterGroup.position.set(-8, 0.5, 6);
    addPart(waterGroup, 'cooling_water_manifold', 'High-flow chilled water supply and return lines with circulation pumps.', 'steel', 'Removes the massive heat of compression generated by the primary compressors.', 14, ['primary_compressor', 'secondary_compressor'], 'Cooling failure', ['compressor overheat', 'emergency system trip'], {x:-8, y:0.5, z:6}, {x:-18, y:0, z:20});

    // 15. Purification Adsorber (Dual Towers)
    const adsorberGroup = new THREE.Group();
    const adVesselGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 32);
    
    const adVessel1 = new THREE.Mesh(adVesselGeo, steel);
    adVessel1.position.set(-1.5, 2.5, 0);
    adsorberGroup.add(adVessel1);
    
    const adVessel2 = new THREE.Mesh(adVesselGeo, steel);
    adVessel2.position.set(1.5, 2.5, 0);
    adsorberGroup.add(adVessel2);
    
    // Heating coils for regeneration
    const jacketGeo = new THREE.TorusGeometry(1.3, 0.1, 16, 64);
    for(let y=0.5; y<=4.5; y+=0.4) {
        const coil1 = new THREE.Mesh(jacketGeo, copper);
        coil1.rotation.x = Math.PI/2;
        coil1.position.set(-1.5, y, 0);
        adsorberGroup.add(coil1);
        animatedMeshes.push({ mesh: coil1, type: 'pulse_color_adsorber', speed: 2, color1: 0xaa5500, color2: 0xff3300, offset: y });
        
        const coil2 = new THREE.Mesh(jacketGeo, copper);
        coil2.rotation.x = Math.PI/2;
        coil2.position.set(1.5, y, 0);
        adsorberGroup.add(coil2);
    }

    adsorberGroup.position.set(-8, 0, -6);
    addPart(adsorberGroup, 'purification_adsorber', 'Dual-bed charcoal adsorber towers operating alternately at 80K.', 'steel', 'Removes trace air, water, and neon impurities from helium gas before liquefaction to prevent heat exchanger blockage.', 15, ['primary_compressor', 'main_coldbox'], 'Impurity breakthrough', ['heat exchanger freezing', 'total blockage'], {x:-8, y:0, z:-6}, {x:-16, y:5, z:-12});

    // 16. Status Lighting System & Sensors
    const lightGroup = new THREE.Group();
    const beaconGeo = new THREE.SphereGeometry(0.4, 16, 16);
    
    const beacon1 = new THREE.Mesh(beaconGeo, neonRed);
    beacon1.position.set(-10, 14, -10);
    lightGroup.add(beacon1);
    
    const beacon2 = new THREE.Mesh(beaconGeo, neonBlue);
    beacon2.position.set(10, 14, -10);
    lightGroup.add(beacon2);
    
    const beacon3 = new THREE.Mesh(beaconGeo, neonGreen);
    beacon3.position.set(0, 14, 10);
    lightGroup.add(beacon3);
    
    animatedMeshes.push({ mesh: beacon1, type: 'blink', speed: 3 });
    animatedMeshes.push({ mesh: beacon2, type: 'pulse_scale', speed: 2 });
    animatedMeshes.push({ mesh: beacon3, type: 'blink', speed: 5 });
    
    addPart(lightGroup, 'status_lighting_system', 'Plant-wide visual indicator strobes and telemetry sensors.', 'glass', 'Provides immediate visual feedback on plant operational state across the massive facility.', 16, ['control_station', 'structural_scaffolding'], 'Sensor blindness', ['none directly'], {x:0, y:0, z:0}, {x:0, y:25, z:0});

    const description = "Ultra High-Tech Helium Liquefaction Plant. A massive, intricately detailed cryogenic facility capable of taking ambient gaseous helium and condensing it into a liquid at 4.2 Kelvin (-269°C). Features heavy-duty multi-stage primary compressors, dual ultra-high-speed expansion turbines running on gas bearings, massive vacuum-insulated transfer piping, and highly detailed heat exchanger internals.";

    const quizQuestions = [
        {
            question: "What is the primary function of the expansion turbines in the helium liquefaction process?",
            options: [
                "To compress the gas to high pressures.",
                "To remove energy from the gas through isentropic expansion, causing extreme cooling.",
                "To purify the helium gas of impurities.",
                "To pump liquid helium into the storage dewar."
            ],
            correctAnswer: 1,
            explanation: "Expansion turbines force the high-pressure gas to do work as it expands (spinning the turbine up to 120,000 RPM). This removes internal energy and drops the temperature dramatically, essential for reaching 4.2K."
        },
        {
            question: "Why are the main helium transfer lines vacuum-insulated?",
            options: [
                "To prevent the pipes from rusting.",
                "To eliminate convective and conductive heat transfer from the environment.",
                "To reduce the weight of the massive piping system.",
                "To increase the flow velocity of the liquid."
            ],
            correctAnswer: 1,
            explanation: "Vacuum insulation removes all air around the inner pipe, drastically cutting down convective and conductive heat leaks, which is critical when handling fluids at absolute temperatures near 4.2 Kelvin."
        },
        {
            question: "What role does the purification adsorber play in the helium cycle?",
            options: [
                "It cools the helium using liquid nitrogen.",
                "It removes trace impurities like air and neon before they can freeze and block the heat exchangers.",
                "It acts as a high-pressure buffer tank.",
                "It powers the expansion turbines."
            ],
            correctAnswer: 1,
            explanation: "At cryogenic temperatures, impurities like oxygen, nitrogen, and neon will freeze solid. The dual-bed charcoal adsorber removes them to prevent solid ice blockages in the microscopic channels of the heat exchangers."
        },
        {
            question: "What is the function of the Joule-Thomson phase separator valve?",
            options: [
                "It separates helium gas from liquid nitrogen.",
                "It performs the final isenthalpic expansion that flashes cold, dense gas into a liquid-gas mixture.",
                "It safely vents excess pressure to the atmosphere.",
                "It injects cooling water into the primary compressor."
            ],
            correctAnswer: 1,
            explanation: "The J-T valve exploits the Joule-Thomson effect. Expanding the already super-chilled, non-ideal helium gas below its inversion temperature results in further cooling, facilitating the final phase change into liquid helium."
        },
        {
            question: "Why is a massive cooling water manifold necessary for the primary compressors?",
            options: [
                "To slowly freeze the helium gas.",
                "To remove the intense heat of compression generated when pressurizing the gas.",
                "To internally clean the rotary screw rotors.",
                "To provide steam for driving the turbines."
            ],
            correctAnswer: 1,
            explanation: "Compressing a gas from 1 bar to 20 bar drastically increases its temperature due to the work done on it. The chilled water manifold removes this heat of compression so the gas enters the coldbox at a near-ambient temperature."
        }
    ];

    function animate(time, speed, meshes) {
        animatedMeshes.forEach(anim => {
            const m = anim.mesh;
            const t = time * speed;
            if (anim.type === 'spin_x') {
                m.rotation.x = t * anim.speed;
            } else if (anim.type === 'spin_y') {
                m.rotation.y = t * anim.speed;
            } else if (anim.type === 'spin_z') {
                m.rotation.z = t * anim.speed;
            } else if (anim.type === 'flicker') {
                m.material.opacity = 0.5 + Math.random() * 0.5;
            } else if (anim.type === 'blink') {
                m.material.opacity = Math.sin(t * anim.speed) > 0 ? 1 : 0.2;
            } else if (anim.type === 'pulse_scale') {
                const s = 1 + Math.sin(t * anim.speed) * 0.1;
                m.scale.set(s, s, s);
            } else if (anim.type === 'pulse_color_adsorber') {
                const wave = Math.sin(t * anim.speed + anim.offset * 2);
                m.material.color.setHex(wave > 0 ? anim.color2 : anim.color1);
            } else if (anim.type === 'vibrate') {
                m.position.x = -3 + Math.sin(t * anim.speed) * 0.05;
                m.position.y = 0.5 + Math.cos(t * anim.speed * 1.1) * 0.05;
            } else if (anim.type === 'level_fluctuate') {
                // Liquid level moves up and down slightly
                const scaleY = 1 + Math.sin(t * anim.speed) * 0.1;
                m.scale.y = scaleY;
                m.position.y = 1 + 2 * scaleY; // Keep base anchored roughly at y=1 relative to its parent
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
export function createLiquefier() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
