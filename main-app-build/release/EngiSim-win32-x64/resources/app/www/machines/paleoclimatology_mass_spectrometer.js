import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Create emissive materials for screens and high-tech glow
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0022, emissive: 0xff0022, emissiveIntensity: 2, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff22, emissive: 0x00ff22, emissiveIntensity: 1.5, roughness: 0.2 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2.5, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });

    const meshes = {};
    const parts = [];

    function registerPart(name, meshGroup, description, materialName, func, assemblyOrder, originalPos, explodedPos, connections = [], failEffect = '', cascade = []) {
        group.add(meshGroup);
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: originalPos,
            explodedPosition: explodedPos
        });
        meshes[name] = meshGroup;
    }

    // --- 1. BASE FRAME ---
    const frameGroup = new THREE.Group();
    const frameMat = darkSteel;
    const strutGeom = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 16);
    for(let i=0; i<4; i++) {
        const leg = new THREE.Mesh(strutGeom, frameMat);
        leg.position.set((i%2===0?-2.0:2.0), 2.25, (i<2?-1.5:1.5));
        frameGroup.add(leg);
        
        // Add rubber isolation feet
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.2, 16), rubber);
        foot.position.set((i%2===0?-2.0:2.0), 0.1, (i<2?-1.5:1.5));
        frameGroup.add(foot);
    }
    const crossGeom = new THREE.CylinderGeometry(0.08, 0.08, 3, 16);
    for(let i=0; i<2; i++) {
        const cross = new THREE.Mesh(crossGeom, frameMat);
        cross.rotation.z = Math.PI/2;
        cross.position.set(0, 1.5, (i===0?-1.5:1.5));
        frameGroup.add(cross);
    }
    const longCrossGeom = new THREE.CylinderGeometry(0.08, 0.08, 4, 16);
    for(let i=0; i<2; i++) {
        const cross = new THREE.Mesh(longCrossGeom, frameMat);
        cross.rotation.x = Math.PI/2;
        cross.position.set((i===0?-2.0:2.0), 1.5, 0);
        frameGroup.add(cross);
    }
    // Complex optical breadboard style tabletop
    const tableTopShape = new THREE.Shape();
    tableTopShape.moveTo(-2.5, -2);
    tableTopShape.lineTo(2.5, -2);
    tableTopShape.lineTo(2.5, 2);
    tableTopShape.lineTo(-2.5, 2);
    const tableTopGeom = new THREE.ExtrudeGeometry(tableTopShape, {depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05});
    const tableTop = new THREE.Mesh(tableTopGeom, aluminum);
    tableTop.rotation.x = Math.PI/2;
    tableTop.position.set(0, 4.6, -2);
    frameGroup.add(tableTop);

    registerPart('BaseFrame', frameGroup, 'Heavy duty anti-vibration isolation frame.', 'Dark Steel / Rubber', 'Dampens ambient seismic vibrations that could distort ion paths.', 1, {x:0, y:0, z:0}, {x:0, y:-5, z:0});

    // --- 2. ION SOURCE CHAMBER ---
    const ionSourceGroup = new THREE.Group();
    const points = [];
    for ( let i = 0; i <= 15; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.15 ) * 0.6 + 0.3, ( i - 7 ) * 0.2 ) );
    }
    const chamberGeom = new THREE.LatheGeometry( points, 64 );
    const chamber = new THREE.Mesh( chamberGeom, chrome );
    chamber.rotation.x = Math.PI/2;
    ionSourceGroup.add(chamber);
    
    // Viewports
    for(let i=0; i<4; i++) {
        const vp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), steel);
        vp.rotation.z = Math.PI/2;
        vp.rotation.x = (i * Math.PI/2);
        vp.position.set(Math.cos(i*Math.PI/2)*0.8, Math.sin(i*Math.PI/2)*0.8, 0);
        ionSourceGroup.add(vp);
        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 16), tinted);
        glassMesh.rotation.copy(vp.rotation);
        glassMesh.position.copy(vp.position);
        ionSourceGroup.add(glassMesh);
    }
    // Filament
    const filamentGeom = new THREE.TorusGeometry(0.15, 0.02, 16, 64);
    const filament = new THREE.Mesh(filamentGeom, neonBlue);
    filament.rotation.y = Math.PI/2;
    ionSourceGroup.add(filament);
    
    ionSourceGroup.position.set(-1.5, 5.5, 0);
    registerPart('IonSource', ionSourceGroup, 'Electron ionization source chamber.', 'Chrome / Glass', 'Bombards sample gas with electrons to create positive ions.', 2, {x:-1.5, y:5.5, z:0}, {x:-4, y:7, z:0});

    // --- 3. FLIGHT TUBE ---
    const flightTubeGroup = new THREE.Group();
    class TubeCurve extends THREE.Curve {
        constructor( scale = 1 ) { super(); this.scale = scale; }
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const tx = Math.cos( Math.PI * t * 0.5 + Math.PI ) * 2.0 + 2.0;
            const ty = Math.sin( Math.PI * t * 0.5 + Math.PI ) * 2.0;
            const tz = 0;
            return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
        }
    }
    const path = new TubeCurve(1);
    const flightTubeGeom = new THREE.TubeGeometry( path, 128, 0.35, 32, false );
    const flightTube = new THREE.Mesh( flightTubeGeom, steel );
    flightTubeGroup.add(flightTube);
    
    for(let i=0; i<=30; i++) {
        const finGeom = new THREE.TorusGeometry(0.45, 0.03, 16, 32);
        const fin = new THREE.Mesh(finGeom, aluminum);
        const pt = path.getPoint(i/30);
        const tangent = path.getTangent(i/30);
        fin.position.copy(pt);
        fin.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), tangent);
        flightTubeGroup.add(fin);
    }
    flightTubeGroup.position.set(-1.5, 5.5, 0);
    registerPart('FlightTube', flightTubeGroup, 'High-vacuum curved flight tube.', 'Steel / Aluminum', 'Provides a curved, collision-free path for accelerating ions.', 3, {x:-1.5, y:5.5, z:0}, {x:0, y:8, z:0});

    // --- 4. MAGNETIC SECTOR ---
    const magnetGroup = new THREE.Group();
    const magnetShape = new THREE.Shape();
    magnetShape.absarc(2.0, 0, 2.5, Math.PI, Math.PI*1.5, false);
    magnetShape.absarc(2.0, 0, 1.5, Math.PI*1.5, Math.PI, true);
    const extrudeSettings = { depth: 1.2, bevelEnabled: true, bevelSegments: 4, steps: 16, bevelSize: 0.1, bevelThickness: 0.1 };
    const magnetGeom = new THREE.ExtrudeGeometry( magnetShape, extrudeSettings );
    const magnetMesh = new THREE.Mesh( magnetGeom, darkSteel );
    magnetMesh.position.set(0, 0, -0.6);
    magnetGroup.add(magnetMesh);

    const coilGeom = new THREE.TorusGeometry( 0.6, 0.3, 32, 128 );
    const coil1 = new THREE.Mesh( coilGeom, copper );
    coil1.rotation.x = Math.PI/2;
    coil1.position.set(0, -2.0, 0);
    magnetGroup.add(coil1);
    const coil2 = new THREE.Mesh( coilGeom, copper );
    coil2.rotation.x = Math.PI/2;
    coil2.rotation.y = Math.PI/4;
    coil2.position.set(0.5, -0.5, 0);
    magnetGroup.add(coil2);

    magnetGroup.position.set(-1.5, 5.5, 0);
    registerPart('MagneticSector', magnetGroup, 'Massive electromagnet sector.', 'Dark Steel / Copper', 'Generates a strong magnetic field to deflect ions based on m/z ratio.', 4, {x:-1.5, y:5.5, z:0}, {x:2, y:5, z:3});

    // --- 5. TURBOMOLECULAR PUMPS ---
    const turboPumpGroup = new THREE.Group();
    const tpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32), aluminum);
    turboPumpGroup.add(tpBody);
    for(let i=0; i<20; i++) {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 16), steel);
        blade.position.y = -0.6 + i*0.06;
        const indent = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.05), aluminum);
        indent.rotation.y = i * 0.3;
        indent.position.copy(blade.position);
        turboPumpGroup.add(blade);
        turboPumpGroup.add(indent); // simulated complex blading
    }
    const tpBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32), darkSteel);
    tpBase.position.y = -0.95;
    turboPumpGroup.add(tpBase);
    
    turboPumpGroup.position.set(-1.5, 4.0, 0);
    registerPart('TurboPumpSource', turboPumpGroup, 'Ultra-high vacuum turbomolecular pump.', 'Aluminum / Steel', 'Evacuates the ion source to 10^-8 Torr.', 5, {x:-1.5, y:4.0, z:0}, {x:-3, y:3, z:-2});

    // --- 6. DETECTOR ARRAY ---
    const detectorGroup = new THREE.Group();
    const detBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), aluminum);
    detectorGroup.add(detBody);
    for(let i=0; i<5; i++) {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6, 32), goldMat);
        cup.position.set(-0.4 + i*0.2, 0.3, 0);
        cup.rotation.x = Math.PI/2;
        detectorGroup.add(cup);
    }
    detectorGroup.position.set(0.5, 7.5, 0);
    registerPart('DetectorArray', detectorGroup, 'Faraday cup multi-collector array.', 'Aluminum / Gold', 'Collects separated isotope ion beams and measures picoampere currents.', 6, {x:0.5, y:7.5, z:0}, {x:1, y:10, z:0});

    // --- 7. SAMPLE INTRO SYSTEM ---
    const introGroup = new THREE.Group();
    const introValve = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32), chrome);
    introValve.rotation.z = Math.PI/2;
    introGroup.add(introValve);
    const capillary1 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,-1,0)), 20, 0.02, 8, false), copper);
    introGroup.add(capillary1);
    introGroup.position.set(-2.5, 5.5, 0);
    registerPart('DualInletSystem', introGroup, 'Precision gas sample introduction system.', 'Chrome', 'Alternates standard and sample gases seamlessly.', 7, {x:-2.5, y:5.5, z:0}, {x:-5, y:5, z:1});

    // --- 8. ROUGHING PUMPS ---
    const roughingGroup = new THREE.Group();
    const rpBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.8), darkSteel);
    roughingGroup.add(rpBody);
    const rpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 32), steel);
    rpMotor.rotation.z = Math.PI/2;
    rpMotor.position.set(1.0, 0, 0);
    roughingGroup.add(rpMotor);
    // Cooling fins on motor
    for(let i=0; i<8; i++){
        const mfin = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32), darkSteel);
        mfin.rotation.z = Math.PI/2;
        mfin.position.set(0.6 + i*0.1, 0, 0);
        roughingGroup.add(mfin);
    }
    roughingGroup.position.set(1.5, 0.5, 1);
    registerPart('RoughingPump', roughingGroup, 'Rotary vane mechanical vacuum pump.', 'Dark Steel', 'Provides backing vacuum for the turbopumps.', 8, {x:1.5, y:0.5, z:1}, {x:5, y:0, z:5});

    // --- 9. HIGH VOLTAGE RACK ---
    const hvRackGroup = new THREE.Group();
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.5, 1.2), darkSteel);
    rack.position.y = 1.75;
    hvRackGroup.add(rack);
    for(let i=0; i<6; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.05), aluminum);
        panel.position.set(0, 0.5 + i*0.5, 0.61);
        hvRackGroup.add(panel);
        const btn = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.1), (i%2===0?neonRed:neonBlue));
        btn.position.set(0.3, 0.5 + i*0.5, 0.63);
        hvRackGroup.add(btn);
    }
    hvRackGroup.position.set(2.5, 4.6, -1.0);
    registerPart('HighVoltageRack', hvRackGroup, '10kV Acceleration Power Supply.', 'Dark Steel', 'Provides massive electrical potential to accelerate ions.', 9, {x:2.5, y:4.6, z:-1.0}, {x:6, y:5, z:-3});

    // --- 10. CONTROL CONSOLE ---
    const consoleGroup = new THREE.Group();
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 1.0), plastic);
    consoleGroup.add(desk);
    const screenBody1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.1), plastic);
    screenBody1.position.set(-0.5, 0.5, -0.3);
    screenBody1.rotation.x = -Math.PI/12;
    screenBody1.rotation.y = Math.PI/12;
    consoleGroup.add(screenBody1);
    const screenDisplay1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.11), neonGreen);
    screenDisplay1.position.copy(screenBody1.position);
    screenDisplay1.rotation.copy(screenBody1.rotation);
    consoleGroup.add(screenDisplay1);
    const screenBody2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.1), plastic);
    screenBody2.position.set(0.5, 0.5, -0.3);
    screenBody2.rotation.x = -Math.PI/12;
    screenBody2.rotation.y = -Math.PI/12;
    consoleGroup.add(screenBody2);
    const screenDisplay2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.11), neonOrange);
    screenDisplay2.position.copy(screenBody2.position);
    screenDisplay2.rotation.copy(screenBody2.rotation);
    consoleGroup.add(screenDisplay2);
    consoleGroup.position.set(0, 4.7, 1.5);
    registerPart('OperatorConsole', consoleGroup, 'Digital mass-spec workstation.', 'Plastic / Glass', 'Processes raw signals into precise isotopic delta values.', 10, {x:0, y:4.7, z:1.5}, {x:0, y:3, z:4});

    // --- 11. LIQUID NITROGEN COLD TRAP ---
    const ln2Group = new THREE.Group();
    const dewar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), chrome);
    ln2Group.add(dewar);
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), plastic);
    vent.position.set(0, 0.9, 0);
    ln2Group.add(vent);
    ln2Group.position.set(-2.5, 4.6, -1.5);
    registerPart('LN2ColdTrap', ln2Group, 'Cryogenic vapor trap.', 'Chrome', 'Freezes out water vapor and CO2 from the sample line.', 11, {x:-2.5, y:4.6, z:-1.5}, {x:-6, y:4, z:-4});

    // --- 12. PNEUMATIC VALVES NETWORK ---
    const valvesGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 16), steel);
        pipe.rotation.x = Math.PI/2;
        pipe.position.set(-2.0 + i*0.15, 4.5, 0.5);
        valvesGroup.add(pipe);
        const valve = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), darkSteel);
        valve.position.set(-2.0 + i*0.15, 4.5, 0.5);
        valvesGroup.add(valve);
        const indicator = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16), neonBlue);
        indicator.position.set(-2.0 + i*0.15, 4.6, 0.5);
        valvesGroup.add(indicator);
    }
    registerPart('PneumaticValves', valvesGroup, 'Compressed air actuated micro-valves.', 'Steel', 'Routes samples with zero dead-volume.', 12, {x:0, y:0, z:0}, {x:-2, y:2, z:3});

    // --- 13. COOLING WATER CHILLER ---
    const chillerGroup = new THREE.Group();
    const chillerBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), aluminum);
    chillerBody.position.y = 0.75;
    chillerGroup.add(chillerBody);
    const fan = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 16, 32), plastic);
    fan.position.set(0, 0.75, 0.61);
    chillerGroup.add(fan);
    chillerGroup.position.set(-1.5, 0, -1.5);
    registerPart('WaterChiller', chillerGroup, 'Recirculating water chiller.', 'Aluminum', 'Removes massive heat generated by the magnetic sector coils.', 13, {x:-1.5, y:0, z:-1.5}, {x:-4, y:0, z:-5});

    // --- 14. HYDRAULIC VACUUM LINES ---
    const lineGroup = new THREE.Group();
    class LineCurve extends THREE.Curve {
        getPoint( t, opt = new THREE.Vector3() ) {
            return opt.set( t*3.0 - 1.5, Math.sin(t*Math.PI)*1.0 + 2.0, t*1.0 );
        }
    }
    const bellowsLine = new THREE.Mesh(new THREE.TubeGeometry(new LineCurve(), 128, 0.2, 16, false), rubber);
    lineGroup.add(bellowsLine);
    registerPart('VacuumLines', lineGroup, 'Corrugated steel/rubber backing lines.', 'Rubber', 'Connects turbopumps to the roughing pump.', 14, {x:0, y:0, z:0}, {x:0, y:2, z:0});

    // --- 15. LASER ABLATION INTERFACE ---
    const laserGroup = new THREE.Group();
    const laserBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.8), chrome);
    laserGroup.add(laserBody);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16), neonRed);
    beam.rotation.z = Math.PI/2;
    beam.position.set(0.75, 0, 0);
    laserGroup.add(beam);
    laserGroup.position.set(-2.5, 6.5, 0);
    registerPart('LaserAblation', laserGroup, 'Laser ablation microprobe.', 'Chrome', 'Vaporizes solid carbonate samples directly into the ion source.', 15, {x:-2.5, y:6.5, z:0}, {x:-3, y:9, z:-1});

    // --- 16. DATA CABLING ---
    const cables = new THREE.Group();
    for(let i=0; i<15; i++) {
        class CableCurve extends THREE.Curve {
            getPoint(t, opt = new THREE.Vector3()) {
                return opt.set( Math.sin(t*Math.PI*2)*0.5 + i*0.05, -t*3, Math.cos(t*Math.PI)*0.4 );
            }
        }
        const cable = new THREE.Mesh(new THREE.TubeGeometry(new CableCurve(), 64, 0.015, 8, false), plastic);
        cables.add(cable);
    }
    cables.position.set(1, 7.5, 0);
    registerPart('DataCables', cables, 'Shielded triaxial signal cables.', 'Plastic / Copper', 'Transmits ultra-low picoampere currents to amplifiers.', 16, {x:1, y:7.5, z:0}, {x:3, y:8, z:2});

    // --- 17. GATE VALVE ---
    const gateValveGroup = new THREE.Group();
    const gvBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), darkSteel);
    gateValveGroup.add(gvBody);
    const pistonCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16), steel);
    pistonCylinder.position.set(0, 1.0, 0);
    gateValveGroup.add(pistonCylinder);
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16), chrome);
    pistonRod.position.set(0, 1.2, 0);
    gateValveGroup.add(pistonRod);
    gateValveGroup.position.set(-1.5, 2.5, 0);
    registerPart('GateValve', gateValveGroup, 'Ultra-high vacuum pneumatic gate valve.', 'Steel / Chrome', 'Isolates turbopumps from the main chamber.', 17, {x:-1.5, y:2.5, z:0}, {x:-4, y:1, z:3});

    // --- 18. AUTOMATED SAMPLE CAROUSEL ---
    const carouselGroup = new THREE.Group();
    const carBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), aluminum);
    carouselGroup.add(carBase);
    for(let i=0; i<40; i++) {
        const angle = (i/40)*Math.PI*2;
        const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 16), glass);
        vial.position.set(Math.cos(angle)*1.0, 0.2, Math.sin(angle)*1.0);
        carouselGroup.add(vial);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.05, 16), plastic);
        cap.position.set(Math.cos(angle)*1.0, 0.3, Math.sin(angle)*1.0);
        carouselGroup.add(cap);
    }
    const injectorArm = new THREE.Group();
    const armBase = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), darkSteel);
    armBase.position.set(0, 0.5, 0);
    injectorArm.add(armBase);
    const armExt = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.08), steel);
    armExt.position.set(0.5, 0.8, 0);
    injectorArm.add(armExt);
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), chrome);
    needle.position.set(1.0, 0.6, 0);
    injectorArm.add(needle);
    carouselGroup.add(injectorArm);
    carouselGroup.position.set(-3.5, 4.6, 1.5);
    registerPart('AutoSampler', carouselGroup, 'Robotic sample carousel.', 'Aluminum / Glass', 'Automatically introduces hundreds of carbonate samples.', 18, {x:-3.5, y:4.6, z:1.5}, {x:-7, y:4, z:4});

    // Ambient Lighting inside group
    const pointLight = new THREE.PointLight(0x00aaff, 2, 8);
    pointLight.position.set(-1.5, 5.5, 2);
    group.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xff5500, 1.5, 8);
    pointLight2.position.set(2.5, 5, -2);
    group.add(pointLight2);

    return { 
        group, 
        parts, 
        description: "The Paleoclimatology Mass Spectrometer is an ultra-high precision, magnetic sector isotope ratio mass spectrometer (IRMS). Used to analyze stable isotopes in ancient ice cores and foraminifera to reconstruct Earth's past climate. This hyper-complex machine requires deep vacuum, extreme voltages, and intense magnetic fields to separate atomic masses perfectly.", 
        quizQuestions: [
            {
                question: "What is the primary function of the Magnetic Sector?",
                options: ["To cool the samples", "To deflect ions based on mass-to-charge ratio", "To create a vacuum", "To ionize the gas"],
                answer: 1,
                explanation: "The magnetic sector acts like a prism for ions, bending the paths of lighter isotopes more than heavier ones, allowing them to be separated and measured."
            },
            {
                question: "Why is the Roughing Pump necessary if the system has Turbomolecular Pumps?",
                options: ["It cools the turbopump", "Turbopumps cannot discharge directly to atmospheric pressure", "It acts as a backup", "It powers the magnetic sector"],
                answer: 1,
                explanation: "Turbopumps require a 'backing' vacuum to operate; they cannot compress gas all the way up to 1 atmosphere. The roughing pump provides this intermediate vacuum."
            },
            {
                question: "What does the LN2 Cold Trap do?",
                options: ["Cools the magnets", "Freezes out water and CO2 from the sample line", "Provides liquid nitrogen", "Cools the faraday cups"],
                answer: 1,
                explanation: "Water vapor can cause severe isobaric interferences in mass spectrometry. The cryogenic trap freezes these condensables out of the sample gas before it enters the ion source."
            },
            {
                question: "What is the purpose of the Faraday Cup Multi-collector array?",
                options: ["To store liquid nitrogen", "To collect separated isotope ion beams and measure current", "To shoot electrons", "To trap stray radiation"],
                answer: 1,
                explanation: "Faraday cups are conductive metal cups that catch the separated ion beams. As ions strike the cup, they acquire electrons, generating a tiny, measurable electrical current."
            },
            {
                question: "Why does the Flight Tube require an ultra-high vacuum?",
                options: ["To prevent ions from colliding with air molecules", "To keep it cold", "To prevent rust", "To increase gravity"],
                answer: 0,
                explanation: "If the flight tube contained air, the flying ions would crash into air molecules, scattering their paths and completely destroying the mass resolution."
            }
        ], 
        animate: function(time, speed, activeMeshes) {
            if (activeMeshes['TurboPumpSource']) {
                const pump = activeMeshes['TurboPumpSource'];
                for(let i=1; i<41; i+=2) { 
                    if(pump.children[i]) pump.children[i].rotation.y += speed * 0.8;
                }
            }
            if (activeMeshes['RoughingPump']) {
                activeMeshes['RoughingPump'].children[1].rotation.x += speed * 0.5;
            }
            if (activeMeshes['IonSource']) {
                const fil = activeMeshes['IonSource'].children[9];
                if(fil) fil.material.emissiveIntensity = 2 + Math.sin(time * 15) * 1.5;
            }
            if (activeMeshes['OperatorConsole']) {
                const sc1 = activeMeshes['OperatorConsole'].children[2];
                const sc2 = activeMeshes['OperatorConsole'].children[4];
                if(sc1) sc1.material.emissiveIntensity = 1.0 + Math.random();
                if(sc2) sc2.material.emissiveIntensity = 1.0 + Math.random();
            }
            if (activeMeshes['PneumaticValves']) {
                const valves = activeMeshes['PneumaticValves'];
                for(let i=1; i<valves.children.length; i+=3) {
                    valves.children[i].position.y = 4.5 + Math.sin(time*3 + i)*0.03;
                }
            }
            if (activeMeshes['WaterChiller']) {
                const fan = activeMeshes['WaterChiller'].children[1];
                if(fan) fan.rotation.z += speed * 0.6;
            }
            if (activeMeshes['LaserAblation']) {
                const beam = activeMeshes['LaserAblation'].children[1];
                if(beam) {
                    beam.visible = Math.random() > 0.1;
                    beam.scale.x = 1 + Math.random()*0.3;
                }
            }
            if (activeMeshes['AutoSampler']) {
                const arm = activeMeshes['AutoSampler'].children[81];
                if(arm) {
                    arm.rotation.y = Math.sin(time * 0.5) * Math.PI/4;
                    arm.children[2].position.y = 0.6 + Math.sin(time * 2) * 0.2;
                }
            }
            if (activeMeshes['GateValve']) {
                const rod = activeMeshes['GateValve'].children[2];
                if(rod) {
                    rod.position.y = 1.2 + Math.sin(time)*0.2;
                }
            }
        } 
    };
}

// Auto-generated missing stub
export function createMassSpectrometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
