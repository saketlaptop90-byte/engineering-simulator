import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Hyper-realistic custom materials (using standard inputs to blend with environment)
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xaa00ff, emissiveIntensity: 2, metalness: 0.5, roughness: 0.2 });
    const ledRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3, metalness: 0.2, roughness: 0.1 });
    const ledBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 3, metalness: 0.2, roughness: 0.1 });
    const waterMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transparent: true, opacity: 0.7, transmission: 0.9, ior: 1.33, roughness: 0.1 });
    const mistMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeff, transparent: true, opacity: 0.15, depthWrite: false });
    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.9, metalness: 0.0 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x11cc22, roughness: 0.4, metalness: 0.1, side: THREE.DoubleSide });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ff88, emissiveIntensity: 0.8, roughness: 0.2 });

    function addPart(name, mesh, description, materialName, func, assemblyOrder, originalPos, connections, failure, cascade) {
        mesh.position.set(originalPos.x, originalPos.y, originalPos.z);
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder,
            connections,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: originalPos,
            explodedPosition: { 
                x: originalPos.x * 2.5 + (Math.random() * 15 - 7.5), 
                y: originalPos.y * 1.5 + (Math.random() * 15 - 7.5), 
                z: originalPos.z * 2.5 + (Math.random() * 15 - 7.5) 
            }
        });
    }

    // 1. nutrient_reservoir
    const reservoirGroup = new THREE.Group();
    const resPoints = [];
    for ( let i = 0; i <= 24; i ++ ) {
        const y = i * 1.2;
        const x = (i < 4) ? 18 : (i > 20) ? 18 - (i-20)*2 : 19 + Math.sin(i * 0.5) * 0.5;
        resPoints.push( new THREE.Vector2( x, y ) );
    }
    const resGeo = new THREE.LatheGeometry(resPoints, 128);
    const resMesh = new THREE.Mesh(resGeo, darkSteel);
    reservoirGroup.add(resMesh);
    
    // Add glowing fluid indicator ring to reservoir
    const indicatorGeo = new THREE.TorusGeometry(19.2, 0.3, 16, 128);
    const indicatorMesh = new THREE.Mesh(indicatorGeo, neonBlue);
    indicatorMesh.rotation.x = Math.PI / 2;
    indicatorMesh.position.y = 15;
    reservoirGroup.add(indicatorMesh);

    // Reinforcement ribs for pressure containment
    for (let i = 0; i < 8; i++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 0.5), steel);
        rib.rotation.y = (i / 8) * Math.PI;
        rib.position.y = 5;
        reservoirGroup.add(rib);
        
        const ribUpper = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, 0.5), steel);
        ribUpper.rotation.y = (i / 8) * Math.PI;
        ribUpper.position.y = 20;
        reservoirGroup.add(ribUpper);
    }

    addPart('nutrient_reservoir', reservoirGroup, 'Massive high-capacity containment unit for chilled, nutrient-rich solution. Features hydro-dynamic internal baffling.', 'darkSteel', 'Stores and regulates the temperature of the base nutrient fluid.', 1, {x:0, y:0, z:0}, ['reservoir_chiller_unit', 'main_pump_motor', 'recirculation_drain'], 'Complete loss of nutrient flow', ['pump cavitation', 'root necrosis', 'crop failure']);

    // 2. reservoir_chiller_unit
    const chillerGroup = new THREE.Group();
    for (let i = 0; i < 48; i++) {
        const finGeo = new THREE.BoxGeometry(4.5, 25, 0.4);
        const fin = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 48) * Math.PI * 2;
        fin.position.x = Math.cos(angle) * 20;
        fin.position.z = Math.sin(angle) * 20;
        fin.rotation.y = -angle;
        fin.position.y = 14;
        chillerGroup.add(fin);
    }
    
    // Chiller compressor manifold
    const compressor = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 10, 32), chrome);
    compressor.position.set(-22, 10, 0);
    chillerGroup.add(compressor);
    
    addPart('reservoir_chiller_unit', chillerGroup, 'Radial thermal dissipation fins and active peltier coolers coupled with a rotary compressor.', 'aluminum', 'Maintains optimal dissolved oxygen levels by keeping fluid cold.', 2, {x:0, y:0, z:0}, ['nutrient_reservoir', 'power_distribution_unit'], 'Fluid temperature spikes', ['dissolved oxygen drop', 'pathogen bloom']);

    // 3. main_pump_motor
    const pumpGroup = new THREE.Group();
    const pumpCoreGeo = new THREE.CylinderGeometry(4, 4, 16, 64);
    const pumpCore = new THREE.Mesh(pumpCoreGeo, steel);
    pumpCore.rotation.z = Math.PI / 2;
    pumpGroup.add(pumpCore);
    
    for(let i = 0; i < 14; i++) {
        const motorFin = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.4, 16, 64), aluminum);
        motorFin.rotation.y = Math.PI / 2;
        motorFin.position.x = -6 + (i * 1.0);
        pumpGroup.add(motorFin);
    }
    
    const termBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.5, 3.5), darkSteel);
    termBox.position.set(0, 5, 0);
    pumpGroup.add(termBox);

    const powerCable = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 15, 16), rubber);
    powerCable.position.set(0, 10, -5);
    powerCable.rotation.x = Math.PI / 4;
    pumpGroup.add(powerCable);
    
    addPart('main_pump_motor', pumpGroup, 'High-RPM, multi-stage centrifugal pump motor driven by a brushless DC drive.', 'steel', 'Pressurizes the nutrient fluid for the atomization manifold.', 3, {x: 28, y: 10, z: 0}, ['nutrient_reservoir', 'pump_housing', 'power_distribution_unit'], 'Zero line pressure', ['nozzle sputtering', 'immediate plant wilting']);

    // 4. pump_housing
    const housingGroup = new THREE.Group();
    const voluteGeo = new THREE.TorusGeometry(3.8, 2.8, 32, 64);
    const volute = new THREE.Mesh(voluteGeo, chrome);
    volute.rotation.x = Math.PI / 2;
    volute.position.x = 10;
    housingGroup.add(volute);
    
    const intakePipe = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 12, 32), copper);
    intakePipe.rotation.z = Math.PI / 2;
    intakePipe.position.set(4, 0, 0);
    housingGroup.add(intakePipe);
    
    const dischargeFlange = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32), steel);
    dischargeFlange.position.set(10, 4, 0);
    housingGroup.add(dischargeFlange);
    
    addPart('pump_housing', housingGroup, 'Stainless steel impeller housing and volute casing engineered for caviation resistance.', 'chrome', 'Converts motor kinetic energy into fluid pressure.', 4, {x: 28, y: 10, z: 0}, ['main_pump_motor', 'primary_feed_pipe'], 'Housing rupture', ['catastrophic fluid leak', 'pressure drop']);

    // 5. primary_feed_pipe
    const pipeGroup = new THREE.Group();
    const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(38, 14, 0),
        new THREE.Vector3(42, 18, 0),
        new THREE.Vector3(42, 45, 0),
        new THREE.Vector3(25, 45, 0),
        new THREE.Vector3(0, 45, 0)
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 256, 1.2, 32, false);
    const pipe = new THREE.Mesh(pipeGeo, plastic);
    pipeGroup.add(pipe);
    
    // Add flanges to pipe for high realism
    const pipePoints = pipeCurve.getSpacedPoints(30);
    pipePoints.forEach((pt, index) => {
        if (index > 0 && index % 5 === 0 && index < 29) {
            const flange = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.4, 16, 32), darkSteel);
            flange.position.copy(pt);
            
            const tangent = pipeCurve.getTangent(index/30);
            const axis = new THREE.Vector3(0, 0, 1);
            flange.quaternion.setFromUnitVectors(axis, tangent);
            pipeGroup.add(flange);
            
            for(let b=0; b<8; b++) {
                const bAngle = (b/8)*Math.PI*2;
                const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 8), chrome);
                bolt.position.set(Math.cos(bAngle)*1.4, Math.sin(bAngle)*1.4, 0);
                bolt.rotation.x = Math.PI/2;
                flange.add(bolt);
            }
        }
    });

    addPart('primary_feed_pipe', pipeGroup, 'High-pressure PVC-U feed conduit reinforced with kevlar weave.', 'plastic', 'Delivers pressurized nutrient solution to the upper chamber manifold.', 5, {x: 0, y: 0, z: 0}, ['pump_housing', 'distribution_manifold'], 'Pipe burst', ['flooding', 'loss of mist']);

    // 6. root_containment_chamber
    const chamberGroup = new THREE.Group();
    const chamberGeo = new THREE.CylinderGeometry(16, 16, 50, 64, 1, true);
    const chamber = new THREE.Mesh(chamberGeo, tinted);
    chamber.position.y = 55;
    chamberGroup.add(chamber);
    
    const chamberBase = new THREE.Mesh(new THREE.TorusGeometry(16, 1.2, 32, 128), rubber);
    chamberBase.position.y = 30;
    chamberBase.rotation.x = Math.PI / 2;
    chamberGroup.add(chamberBase);
    
    const chamberTop = new THREE.Mesh(new THREE.TorusGeometry(16, 1.2, 32, 128), rubber);
    chamberTop.position.y = 80;
    chamberTop.rotation.x = Math.PI / 2;
    chamberGroup.add(chamberTop);
    
    addPart('root_containment_chamber', chamberGroup, 'Optically tinted, hermetically sealed borosilicate glass cylinder designed to withstand extreme internal pressure variations.', 'tinted', 'Maintains 100% humidity environment while blocking UV light from roots.', 6, {x: 0, y: 0, z: 0}, ['nutrient_reservoir', 'chamber_support_frame', 'plant_support_deck'], 'Seal breach', ['humidity escape', 'root shock']);

    // 7. chamber_support_frame
    const frameGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 85, 32), aluminum);
        strut.position.x = Math.cos(angle) * 18;
        strut.position.z = Math.sin(angle) * 18;
        strut.position.y = 42.5;
        frameGroup.add(strut);
        
        // Horizontal reinforcing rings with intricate bolt patterns
        if (i === 0) {
            for(let y = 40; y <= 70; y+=15) {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(18, 0.5, 16, 128), aluminum);
                ring.position.y = y;
                ring.rotation.x = Math.PI / 2;
                frameGroup.add(ring);
                
                for(let b=0; b<12; b++) {
                    const boltAngle = (b/12) * Math.PI * 2;
                    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.5, 8), darkSteel);
                    bolt.position.set(Math.cos(boltAngle)*18.5, y, Math.sin(boltAngle)*18.5);
                    bolt.rotation.x = Math.PI/2;
                    bolt.rotation.z = boltAngle;
                    frameGroup.add(bolt);
                }
            }
        }
    }
    addPart('chamber_support_frame', frameGroup, 'Hexagonal anodized aluminum exoskeleton utilizing geodesic load distribution.', 'aluminum', 'Provides structural rigidity and mounting points for sensors.', 7, {x: 0, y: 0, z: 0}, ['nutrient_reservoir', 'root_containment_chamber'], 'Structural warping', ['glass chamber fracture']);

    // 8. distribution_manifold
    const manifoldGroup = new THREE.Group();
    const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 10, 32), chrome);
    manifoldGroup.add(centerHub);
    
    // Rotating arms
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 14, 32), plastic);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = angle;
        arm.position.x = Math.cos(angle) * 7;
        arm.position.z = Math.sin(-angle) * 7;
        manifoldGroup.add(arm);
    }
    
    addPart('distribution_manifold', manifoldGroup, 'Central rotating fluid distribution hub equipped with ceramic dynamic seals.', 'chrome', 'Splits high-pressure fluid to the misting array via rotary joint.', 8, {x: 0, y: 45, z: 0}, ['primary_feed_pipe', 'misting_nozzle_array'], 'Rotary joint jam', ['uneven mist coverage', 'localized root death']);

    // 9. misting_nozzle_array
    const nozzleGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const armAngle = (i / 6) * Math.PI * 2;
        for (let j = 1; j <= 5; j++) {
            const dist = j * 2.5;
            const nx = Math.cos(armAngle) * dist;
            const nz = Math.sin(-armAngle) * dist;
            
            const nozzleBody = new THREE.Mesh(new THREE.LatheGeometry([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(0.4, 0),
                new THREE.Vector2(0.5, 0.5),
                new THREE.Vector2(0.2, 1),
                new THREE.Vector2(0, 1)
            ], 16), copper);
            nozzleBody.position.set(nx, 0, nz);
            nozzleBody.rotation.x = Math.PI; 
            nozzleGroup.add(nozzleBody);
            
            const nozzleTip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), chrome);
            nozzleTip.position.set(nx, 1.1, nz);
            nozzleGroup.add(nozzleTip);
        }
    }
    addPart('misting_nozzle_array', nozzleGroup, 'High-frequency ultrasonic atomization brass nozzles.', 'copper', 'Shears fluid into 5-50 micron droplets for maximum root epidermal absorption.', 9, {x: 0, y: 45, z: 0}, ['distribution_manifold', 'mist_cloud'], 'Nozzle clogging', ['dry spots in root zone']);

    // 10. plant_support_deck
    const deckGroup = new THREE.Group();
    const deckGeo = new THREE.CylinderGeometry(16.8, 16.8, 2.5, 64);
    const deck = new THREE.Mesh(deckGeo, steel);
    deckGroup.add(deck);
    
    const plantSlots = 16;
    for(let i=0; i<plantSlots; i++) {
        const angle = (i/plantSlots) * Math.PI * 2;
        const slot = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.4, 16, 32), rubber);
        slot.position.x = Math.cos(angle) * 11;
        slot.position.z = Math.sin(angle) * 11;
        slot.position.y = 1.25;
        slot.rotation.x = Math.PI/2;
        deckGroup.add(slot);
    }
    
    addPart('plant_support_deck', deckGroup, 'Steel composite upper deck with hermetic rubberized neoprene collars.', 'steel', 'Secures the plant crowns and seals the top of the mist chamber.', 10, {x: 0, y: 80, z: 0}, ['root_containment_chamber', 'aeroponic_roots', 'led_grow_light_array'], 'Collar degradation', ['pathogen entry', 'light leak into root zone']);

    // 11. aeroponic_roots
    const plantGroup = new THREE.Group();
    for(let i=0; i<plantSlots; i++) {
        const angle = (i/plantSlots) * Math.PI * 2;
        const px = Math.cos(angle) * 11;
        const pz = Math.sin(angle) * 11;
        
        const rootStrands = 6;
        for(let r=0; r<rootStrands; r++) {
            const rootCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(px, 79, pz),
                new THREE.Vector3(px + Math.random()*2-1, 65, pz + Math.random()*2-1),
                new THREE.Vector3(px + Math.random()*5-2.5, 50, pz + Math.random()*5-2.5),
                new THREE.Vector3(px + Math.random()*8-4, 35, pz + Math.random()*8-4)
            ]);
            const rootGeo = new THREE.TubeGeometry(rootCurve, 64, 0.2 - (r*0.02), 16, false);
            const root = new THREE.Mesh(rootGeo, rootMaterial);
            plantGroup.add(root);
            
            // Add root hairs
            const hairCount = 20;
            for(let h=0; h<hairCount; h++) {
                const hair = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.8, 4), rootMaterial);
                const t = h / hairCount;
                const point = rootCurve.getPoint(t);
                
                hair.position.copy(point);
                const randomVec = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
                hair.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), randomVec);
                plantGroup.add(hair);
            }
        }
        
        for(let l=0; l<10; l++) {
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.quadraticCurveTo(2, 4, 0, 9);
            leafShape.quadraticCurveTo(-2, 4, 0, 0);
            const leafExtrude = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
            const leafGeo = new THREE.ExtrudeGeometry(leafShape, leafExtrude);
            const leaf = new THREE.Mesh(leafGeo, leafMaterial);
            
            leaf.position.set(px, 81.5, pz);
            leaf.rotation.y = (l/10) * Math.PI * 2 + Math.random();
            leaf.rotation.x = Math.random() * 0.6 + 0.2;
            plantGroup.add(leaf);
        }
    }
    addPart('aeroponic_roots', plantGroup, 'Engineered transgenic crop structures with hyper-developed root mass.', 'plastic', 'Absorbs aerosolized nutrients and performs rapid photosynthesis.', 11, {x: 0, y: 0, z: 0}, ['plant_support_deck', 'mist_cloud'], 'Root rot', ['plant death']);

    // 12. led_grow_light_array
    const ledGroup = new THREE.Group();
    const lightDome = new THREE.Mesh(new THREE.SphereGeometry(18, 64, 64, 0, Math.PI * 2, 0, Math.PI/4.5), aluminum);
    lightDome.rotation.x = Math.PI;
    lightDome.position.y = 110;
    ledGroup.add(lightDome);
    
    const rings = [3, 7, 11, 15];
    rings.forEach((r) => {
        const ringY = 110 - Math.sqrt(18*18 - r*r);
        const ledCount = r * 6;
        for(let i=0; i<ledCount; i++) {
            const angle = (i/ledCount) * Math.PI * 2;
            const led = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), (i%4===0) ? ledBlue : ledRed);
            led.position.set(Math.cos(angle)*r, ringY - 0.2, Math.sin(angle)*r);
            ledGroup.add(led);
        }
    });

    const sensorBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 20, 16), darkSteel);
    sensorBoom.position.y = 95;
    ledGroup.add(sensorBoom);
    
    const sensorPod = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), chrome);
    sensorPod.position.y = 85;
    ledGroup.add(sensorPod);
    
    for(let i=0; i<4; i++) {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), neonBlue);
        lens.rotation.x = Math.PI/2;
        lens.rotation.y = (i/4)*Math.PI*2;
        lens.position.y = 85;
        ledGroup.add(lens);
    }
    
    addPart('led_grow_light_array', ledGroup, 'High-intensity, multi-spectrum COB LED array in a parabolic reflector with integrated canopy sensors.', 'aluminum', 'Provides precisely tuned PAR light for optimal canopy photosynthesis.', 12, {x: 0, y: 0, z: 0}, ['light_heat_sink', 'plant_support_deck'], 'Diode failure', ['etiolation', 'stunted growth']);

    // 13. light_heat_sink
    const heatSinkGroup = new THREE.Group();
    for(let i=0; i<60; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 18, 7), darkSteel);
        const angle = (i/60) * Math.PI * 2;
        fin.position.set(Math.cos(angle)*8, 117, Math.sin(angle)*8);
        fin.rotation.y = -angle;
        heatSinkGroup.add(fin);
    }
    const topFan = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 3, 64), chrome);
    topFan.position.y = 127;
    heatSinkGroup.add(topFan);
    
    // Add fan blades
    for(let i=0; i<7; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 3), darkSteel);
        blade.rotation.y = (i/7) * Math.PI * 2;
        blade.rotation.x = Math.PI/6;
        blade.position.y = 127;
        heatSinkGroup.add(blade);
    }

    addPart('light_heat_sink', heatSinkGroup, 'Massive active cooling tower and fin array for LED modules.', 'darkSteel', 'Dissipates extreme thermal loads from the multi-kilowatt LED array.', 13, {x: 0, y: 0, z: 0}, ['led_grow_light_array'], 'Fan stall', ['LED thermal runaway', 'fire hazard']);

    // 14. recirculation_drain
    const drainGroup = new THREE.Group();
    const drainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 30, 0),
        new THREE.Vector3(0, 15, 0),
        new THREE.Vector3(8, 5, 8),
        new THREE.Vector3(12, 15, 12),
        new THREE.Vector3(0, 25, 0)
    ]);
    const drainGeo = new THREE.TubeGeometry(drainCurve, 128, 2, 32, true);
    const drainMesh = new THREE.Mesh(drainGeo, plastic);
    drainGroup.add(drainMesh);
    
    const filterBox = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 8, 32), chrome);
    filterBox.position.set(12, 15, 12);
    drainGroup.add(filterBox);
    
    addPart('recirculation_drain', drainGroup, 'Gravity-fed return conduit with integrated cyclonic particulate filter.', 'plastic', 'Recovers condensed mist and root exudates back to the reservoir.', 14, {x: 0, y: 0, z: 0}, ['root_containment_chamber', 'nutrient_reservoir'], 'Drain blockage', ['chamber flooding', 'root drowning']);

    // 15. nutrient_doser_valves
    const doserGroup = new THREE.Group();
    const doserBase = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 5), steel);
    doserGroup.add(doserBase);
    
    for(let i=0; i<4; i++) {
        const pPump = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 2.5, 32), chrome);
        pPump.rotation.z = Math.PI / 2;
        pPump.position.set(4, 5 - i*3.5, 0);
        doserGroup.add(pPump);
        
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6, 16), plastic);
        tube.rotation.x = Math.PI / 2;
        tube.position.set(5, 5 - i*3.5, -3);
        doserGroup.add(tube);
    }
    addPart('nutrient_doser_valves', doserGroup, 'Quad-head high-precision peristaltic dosing pumps.', 'steel', 'Injects micro/macro nutrients and pH buffers into the main reservoir.', 15, {x: -24, y: 15, z: 0}, ['nutrient_reservoir', 'power_distribution_unit'], 'Dosing calibration error', ['nutrient burn', 'pH lockout']);

    // 16. hmi_control_panel
    const hmiGroup = new THREE.Group();
    const hmiArm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 18, 32), aluminum);
    hmiArm.rotation.z = Math.PI / 4;
    hmiArm.position.set(-15, 45, 15);
    hmiGroup.add(hmiArm);
    
    const screenBase = new THREE.Mesh(new THREE.BoxGeometry(12, 9, 1.5), darkSteel);
    screenBase.position.set(-21, 51, 21);
    screenBase.rotation.y = -Math.PI / 4;
    screenBase.rotation.x = -Math.PI / 8;
    hmiGroup.add(screenBase);
    
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(11, 8), screenMaterial);
    screen.position.set(-20.6, 51, 21.4);
    screen.rotation.y = -Math.PI / 4;
    screen.rotation.x = -Math.PI / 8;
    hmiGroup.add(screen);
    
    addPart('hmi_control_panel', hmiGroup, 'Holographic Human-Machine Interface and diagnostic display.', 'darkSteel', 'Allows operator to monitor VPD, EC, pH, and fluid temperatures.', 16, {x: 0, y: 0, z: 0}, ['chamber_support_frame', 'power_distribution_unit'], 'UI freeze', ['loss of manual override']);

    // 17. power_distribution_unit
    const pduGroup = new THREE.Group();
    const pduBox = new THREE.Mesh(new THREE.BoxGeometry(14, 24, 10), steel);
    pduGroup.add(pduBox);
    
    for(let i=0; i<6; i++) {
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 16), rubber);
        cable.position.set(-5 + i*2, -18, 0);
        pduGroup.add(cable);
    }
    const warningLight = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), ledRed);
    warningLight.position.set(0, 13, 0);
    pduGroup.add(warningLight);
    
    addPart('power_distribution_unit', pduGroup, 'Industrial AC/DC step-down transformer and solid-state breaker panel.', 'steel', 'Conditions and routes multi-phase power to all electrical subsystems.', 17, {x: -28, y: 10, z: -18}, ['main_pump_motor', 'led_grow_light_array'], 'Breaker trip', ['total system blackout']);

    // 18. mist_cloud
    const mistGroup = new THREE.Group();
    for(let i=0; i<50; i++) {
        const cloud = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*4 + 2, 32, 32), mistMaterial);
        cloud.position.set(
            Math.random()*26 - 13,
            Math.random()*40 + 35,
            Math.random()*26 - 13
        );
        mistGroup.add(cloud);
    }
    addPart('mist_cloud', mistGroup, 'Dense aerosolized fog of highly oxygenated nutrient solution.', 'plastic', 'Directly interfaces with root epidermal cells for maximal absorption.', 18, {x: 0, y: 0, z: 0}, ['misting_nozzle_array', 'aeroponic_roots'], 'Mist dissipation', ['rapid cellular desiccation']);


    const description = "The Advanced Aeroponic Grow Chamber is a hyper-realistic, precision-engineered closed-loop agricultural system. It uses high-pressure centrifugal pumps to atomize chilled nutrient solutions through ultrasonic copper nozzles. A rotating distribution manifold ensures 360-degree coverage of the genetically optimized suspended root mass, housed within a hermetic borosilicate chamber. Above, a multi-kilowatt, spectrum-tunable LED array drives explosive vegetative growth, actively cooled by a massive finned heat sink and rotary fans.";

    const quizQuestions = [
        {
            question: "Which component is responsible for shearing the fluid into 5-50 micron droplets?",
            options: ["distribution_manifold", "main_pump_motor", "misting_nozzle_array", "nutrient_doser_valves"],
            correctAnswer: 2,
            explanation: "The misting_nozzle_array uses ultrasonic atomization brass nozzles to shear fluid into microscopic droplets for optimal root absorption."
        },
        {
            question: "What is the primary function of the root_containment_chamber?",
            options: ["To expose roots to direct UV light", "To maintain 100% humidity while blocking UV light", "To structurally support the LED array", "To chill the nutrient fluid"],
            correctAnswer: 1,
            explanation: "The hermetically sealed borosilicate glass cylinder maintains a 100% humidity environment and blocks harmful UV light from reaching the sensitive root mass."
        },
        {
            question: "How does the system prevent the high-intensity LED array from overheating?",
            options: ["reservoir_chiller_unit", "misting_nozzle_array", "light_heat_sink", "recirculation_drain"],
            correctAnswer: 2,
            explanation: "The light_heat_sink consists of a massive active cooling tower and fin array designed specifically to dissipate extreme thermal loads from the LEDs."
        },
        {
            question: "What happens if the main_pump_motor experiences a failure?",
            options: ["LEDs overheat", "Zero line pressure causing nozzle sputtering and wilting", "Nutrient fluid temperature spikes", "UI freezes"],
            correctAnswer: 1,
            explanation: "A pump failure drops the line pressure to zero, immediately halting the misting process and causing rapid plant wilting."
        },
        {
            question: "Which subsystem precisely injects micro and macro nutrients into the main reservoir?",
            options: ["distribution_manifold", "nutrient_doser_valves", "recirculation_drain", "primary_feed_pipe"],
            correctAnswer: 1,
            explanation: "The nutrient_doser_valves use quad-head high-precision peristaltic pumps to inject specific nutrients and pH buffers into the reservoir."
        }
    ];

    function animate(time, speed, meshes) {
        if (meshes['distribution_manifold']) {
            meshes['distribution_manifold'].rotation.y = time * speed * 2.5;
        }
        
        if (meshes['main_pump_motor']) {
            meshes['main_pump_motor'].rotation.x = Math.sin(time * speed * 60) * 0.03;
        }

        if (meshes['led_grow_light_array']) {
            meshes['led_grow_light_array'].children.forEach(child => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = 2.5 + Math.sin(time * speed * 12) * 1.5;
                }
            });
        }

        if (meshes['mist_cloud']) {
            meshes['mist_cloud'].rotation.y = time * speed * 0.6;
            meshes['mist_cloud'].children.forEach((cloud, index) => {
                cloud.position.y += Math.sin(time * speed * 3 + index) * 0.08;
                cloud.scale.setScalar(1 + Math.sin(time * speed * 4 + index) * 0.15);
            });
        }
        
        if (meshes['light_heat_sink']) {
            const fanGroupOffset = meshes['light_heat_sink'].children.length - 8;
            for(let i=0; i<7; i++) {
                const blade = meshes['light_heat_sink'].children[fanGroupOffset + 1 + i];
                if (blade) blade.rotation.y -= time * speed * 20; 
            }
        }
        
        if (meshes['hmi_control_panel']) {
            const screen = meshes['hmi_control_panel'].children[2];
            if (screen && screen.material) {
                screen.material.emissiveIntensity = 0.8 + Math.random() * 0.3;
            }
        }
        
        if (meshes['nutrient_doser_valves']) {
            for(let i=1; i<=4; i++) {
                const p = meshes['nutrient_doser_valves'].children[i*2 - 1]; 
                if (p) p.rotation.z = time * speed * 6 + i;
            }
        }
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
export function createAeroponicChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
