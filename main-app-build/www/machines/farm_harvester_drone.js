import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, metalness: 0.1, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });
    const scannerGlass = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.6, envMapIntensity: 1.0, clearcoat: 1.0 });

    function addPart(name, mesh, description, materialName, func, failEffect, cascade, origPos, explPos, parent = group) {
        mesh.name = name;
        mesh.position.copy(origPos);
        parent.add(mesh);
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder: parts.length + 1,
            connections: [],
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos.clone(),
            explodedPosition: explPos.clone()
        });
        meshes[name] = mesh;
        return mesh;
    }

    // --- 1. CORE CHASSIS ---
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(0, 5);
    chassisShape.lineTo(4, 2.5);
    chassisShape.lineTo(4, -2.5);
    chassisShape.lineTo(0, -5);
    chassisShape.lineTo(-4, -2.5);
    chassisShape.lineTo(-4, 2.5);
    chassisShape.lineTo(0, 5);
    
    // Add inner cutouts for detail
    const holePath = new THREE.Path();
    holePath.moveTo(0, 2);
    holePath.lineTo(1.5, 1);
    holePath.lineTo(1.5, -1);
    holePath.lineTo(0, -2);
    holePath.lineTo(-1.5, -1);
    holePath.lineTo(-1.5, 1);
    holePath.lineTo(0, 2);
    chassisShape.holes.push(holePath);

    const extrudeSettings = { depth: 2.5, bevelEnabled: true, bevelSegments: 6, steps: 3, bevelSize: 0.4, bevelThickness: 0.4 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeo.center();
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    
    // Extensive surface detailing on chassis
    for (let i = -2; i <= 2; i += 0.4) {
        const finGeo = new THREE.BoxGeometry(8, 0.1, 3.5);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(0, i, 0);
        chassisMesh.add(fin);
    }

    // Rivets around the chassis
    for (let i=0; i<24; i++) {
        const angle = (i * Math.PI*2)/24;
        const rivetGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const rivet = new THREE.Mesh(rivetGeo, chrome);
        rivet.position.set(Math.cos(angle)*3.8, Math.sin(angle)*3.8, 1.3);
        chassisMesh.add(rivet);
    }
    
    addPart('Central_Chassis', chassisMesh, 'Main heavy-duty hexagonal body housing flight computer, ground drivetrain, and power distribution.', 'darkSteel', 'Structural integrity and component housing.', 'Drone structural failure', ['Flight_Computer', 'Power_Core'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0));

    // --- 2. FLIGHT & GROUND CONTROL COMPUTER ---
    const fcGeo = new THREE.BoxGeometry(2.5, 2.5, 3);
    const fcMesh = new THREE.Mesh(fcGeo, copper);
    
    // Multi-layered core
    const fcCoreGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 32);
    const fcCore = new THREE.Mesh(fcCoreGeo, neonBlue);
    fcCore.rotation.x = Math.PI / 2;
    fcMesh.add(fcCore);

    // Glowing data conduits
    for(let i=0; i<8; i++) {
        const conduitGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,-1.2,0), new THREE.Vector3(0,1.2,0)), 10, 0.05, 8, false);
        const conduit = new THREE.Mesh(conduitGeo, neonRed);
        conduit.position.set(Math.cos(i*Math.PI/4)*1, 0, Math.sin(i*Math.PI/4)*1);
        fcMesh.add(conduit);
    }

    addPart('Flight_Computer', fcMesh, 'Advanced AI control unit, handling both aerial acrobatics and rough terrain navigation.', 'copper', 'Stabilizes flight, ground movement, and processes LiDAR.', 'Total loss of control', ['Rotor_Motors', 'Hybrid_Drivetrain'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 15), chassisMesh);

    // --- 3. HIGH-CAPACITY HYBRID BATTERY PACKS ---
    const batteryGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const batGeo = new THREE.BoxGeometry(2, 4, 1.5);
        const bat = new THREE.Mesh(batGeo, steel);
        
        // Heat dissipation fins on batteries
        for(let j=-1.5; j<=1.5; j+=0.2) {
            const batFinGeo = new THREE.BoxGeometry(2.2, 0.05, 1.6);
            const batFin = new THREE.Mesh(batFinGeo, darkSteel);
            batFin.position.y = j;
            bat.add(batFin);
        }

        const indGeo = new THREE.PlaneGeometry(1.5, 3.5);
        const ind = new THREE.Mesh(indGeo, neonBlue);
        ind.position.z = 0.76;
        bat.add(ind);
        
        const angle = (i * Math.PI) / 2 + Math.PI/4;
        bat.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, -1);
        bat.lookAt(0,0,-1);
        batteryGroup.add(bat);
    }
    addPart('Battery_Packs', batteryGroup, 'Solid-state quantum lithium battery array with extreme energy density.', 'steel', 'Provides high-amperage electrical power to rotors and drive wheels.', 'Total power loss', ['Central_Chassis', 'Flight_Computer'], new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -10, -10));

    // --- 4. LiDAR DOME SCANNER ---
    const lidarGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, scannerGlass);
    
    const scanGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, -1),
        new THREE.Vector2(1, -0.8),
        new THREE.Vector2(1.5, 0),
        new THREE.Vector2(1, 0.8),
        new THREE.Vector2(0, 1)
    ], 32);
    const scanMesh = new THREE.Mesh(scanGeo, chrome);
    
    // Multiple laser emitters
    for(let i=0; i<4; i++) {
        const laserGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
        const laser = new THREE.Mesh(laserGeo, neonRed);
        laser.rotation.z = Math.PI / 2;
        laser.rotation.y = (i*Math.PI)/4;
        scanMesh.add(laser);
    }
    
    lidarGroup.add(dome);
    lidarGroup.add(scanMesh);
    meshes['LiDAR_Spinner'] = scanMesh;
    
    addPart('LiDAR_Scanner', lidarGroup, '360-degree high-res topographic, crop health, and terrain scanner.', 'scannerGlass', 'Obstacle avoidance and target fruit identification.', 'Blindness', ['Robotic_Arm'], new THREE.Vector3(0, 0, 1.5), new THREE.Vector3(0, 20, 5));

    // --- 5. HEX ROTOR ARMS ---
    const rotorArms = new THREE.Group();
    const props = [];
    
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const armGroup = new THREE.Group();
        
        // Complex Truss Arm using grouped cylinders and tubes
        const mainStrutCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(9,0,0));
        const mainStrutGeo = new THREE.TubeGeometry(mainStrutCurve, 32, 0.3, 16, false);
        const mainStrut = new THREE.Mesh(mainStrutGeo, aluminum);
        
        const topStrutCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,0.8), new THREE.Vector3(8.5,0,0.5));
        const topStrutGeo = new THREE.TubeGeometry(topStrutCurve, 32, 0.15, 12, false);
        const topStrut = new THREE.Mesh(topStrutGeo, darkSteel);
        mainStrut.add(topStrut);

        const botStrutCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,-0.8), new THREE.Vector3(8.5,0,-0.5));
        const botStrutGeo = new THREE.TubeGeometry(botStrutCurve, 32, 0.15, 12, false);
        const botStrut = new THREE.Mesh(botStrutGeo, darkSteel);
        mainStrut.add(botStrut);
        
        // Zig-zag bracing for the truss
        for (let j = 1; j < 8; j++) {
            const braceGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8);
            const brace = new THREE.Mesh(braceGeo, steel);
            brace.position.set(j, 0, 0);
            brace.rotation.x = (Math.PI / 3) * (j%2===0?1:-1);
            mainStrut.add(brace);
        }

        // Hydraulic fluid lines running along the arm
        const lineCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0.3,0), new THREE.Vector3(4,0.4,0), new THREE.Vector3(9,0.3,0));
        const lineGeo = new THREE.TubeGeometry(lineCurve, 20, 0.05, 8, false);
        const hLine = new THREE.Mesh(lineGeo, rubber);
        mainStrut.add(hLine);

        armGroup.add(mainStrut);

        // Motor Housing
        const motorPoints = [
            new THREE.Vector2(0, -1.5),
            new THREE.Vector2(1.5, -1.2),
            new THREE.Vector2(1.8, 0),
            new THREE.Vector2(1.5, 1.2),
            new THREE.Vector2(0, 1.5)
        ];
        const motorGeo = new THREE.LatheGeometry(motorPoints, 48);
        const motorMesh = new THREE.Mesh(motorGeo, chrome);
        motorMesh.position.set(9, 0, 0);
        motorMesh.rotation.x = Math.PI / 2;
        
        // Stator coils
        for (let c=0; c<12; c++) {
            const coilGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
            const coil = new THREE.Mesh(coilGeo, copper);
            const cAng = (c*Math.PI*2)/12;
            coil.position.set(Math.cos(cAng)*1.2, 0, Math.sin(cAng)*1.2);
            motorMesh.add(coil);
        }

        armGroup.add(motorMesh);
        
        // Quad-blade Propellers
        const propGroup = new THREE.Group();
        propGroup.position.set(9, 0, 1.5);
        
        const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32);
        const hub = new THREE.Mesh(hubGeo, steel);
        hub.rotation.x = Math.PI / 2;
        propGroup.add(hub);

        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(0, -0.3);
        bladeShape.quadraticCurveTo(3, -0.6, 5, -0.2);
        bladeShape.quadraticCurveTo(5.5, 0, 5, 0.2);
        bladeShape.quadraticCurveTo(3, 0.6, 0, 0.3);
        const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 });
        bladeGeo.translate(0, 0, -0.05);

        for (let k = 0; k < 4; k++) {
            const blade = new THREE.Mesh(bladeGeo, plastic);
            blade.rotation.z = (k * Math.PI * 2) / 4;
            blade.rotation.x = 0.25; // Aerodynamic pitch
            propGroup.add(blade);
        }
        
        armGroup.add(propGroup);
        props.push(propGroup);
        armGroup.rotation.z = angle;
        rotorArms.add(armGroup);
    }
    meshes['Props'] = props;
    addPart('Rotor_Arms_Array', rotorArms, 'Hex-configured carbon-fiber truss arms with quad-blade rotors.', 'aluminum', 'Provides extreme lift capacity for heavy fruit payloads.', 'Loss of altitude and crash', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -25));

    // --- 6. AGGRESSIVE OFF-ROAD TIRES / LANDING GEAR ---
    // The mandate demands TorusGeometry with hundreds of BoxGeometry lugs and Cylinder rims with spokes.
    const hybridDrivetrain = new THREE.Group();
    const wheels = [];
    
    for(let i=0; i<4; i++) {
        const wheelGroup = new THREE.Group();
        const angle = (i * Math.PI) / 2 + Math.PI/4;
        
        // Suspension strut connecting wheel to chassis
        const susGroup = new THREE.Group();
        const shockOuterGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
        const shockOuter = new THREE.Mesh(shockOuterGeo, darkSteel);
        const shockInnerGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
        const shockInner = new THREE.Mesh(shockInnerGeo, chrome);
        shockInner.position.y = -1.5;
        
        // Spring using TubeGeometry
        const springCurve = new THREE.CatmullRomCurve3([]);
        for(let s=0; s<=20; s++) {
            const t = s/20;
            springCurve.points.push(new THREE.Vector3(Math.cos(t*Math.PI*8)*0.4, -t*3, Math.sin(t*Math.PI*8)*0.4));
        }
        const springGeo = new THREE.TubeGeometry(springCurve, 64, 0.08, 8, false);
        const spring = new THREE.Mesh(springGeo, neonRed);
        
        shockOuter.add(shockInner);
        shockOuter.add(spring);
        shockOuter.rotation.x = Math.PI/2;
        
        // Position suspension
        susGroup.add(shockOuter);
        
        // Rim: Cylinder with complex spoke arrays
        const rimGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI/2;
        rim.position.set(0, 0, -4);
        
        // Spokes
        for (let s = 0; s < 8; s++) {
            const spokeGeo = new THREE.CylinderGeometry(0.1, 0.2, 3, 16);
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = (s * Math.PI * 2) / 8;
            spoke.rotation.x = Math.PI/2;
            rim.add(spoke);
        }

        // Tire: TorusGeometry
        const tireGeo = new THREE.TorusGeometry(1.8, 0.6, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        
        // Hundreds of tiny extruded BoxGeometry lugs for off-road treads
        const lugGeo = new THREE.BoxGeometry(1.2, 0.4, 0.2);
        for(let l=0; l<72; l++) {
            const lug = new THREE.Mesh(lugGeo, rubber);
            const lAngle = (l * Math.PI * 2) / 72;
            lug.position.set(Math.cos(lAngle)*2.3, Math.sin(lAngle)*2.3, 0);
            lug.rotation.z = lAngle;
            // Angle the lugs to form a chevron V tread pattern
            lug.rotation.y = l % 2 === 0 ? 0.3 : -0.3;
            tire.add(lug);
        }
        
        rim.add(tire);
        
        wheelGroup.add(susGroup);
        wheelGroup.add(rim);
        
        wheelGroup.position.set(Math.cos(angle)*5, Math.sin(angle)*5, -2);
        
        // Align wheels forward
        wheelGroup.lookAt(Math.cos(angle)*10, Math.sin(angle)*10, -2);
        
        hybridDrivetrain.add(wheelGroup);
        wheels.push(rim);
    }
    meshes['Wheels'] = wheels;
    addPart('Hybrid_Drivetrain', hybridDrivetrain, 'All-terrain aggressive off-road wheels allowing the drone to rove when flying is inefficient.', 'rubber', 'Ground mobility and massive shock absorption.', 'Immobility on ground', ['Battery_Packs'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -20));

    // --- 7. ARTICULATED ROBOTIC GRIPPER ARM ---
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 0, -3);
    
    // Base Mount
    const mountGeo = new THREE.CylinderGeometry(2, 2.5, 1.5, 64);
    const mountMesh = new THREE.Mesh(mountGeo, darkSteel);
    mountMesh.rotation.x = Math.PI / 2;
    armGroup.add(mountMesh);

    // Shoulder Joint
    const shoulderGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const shoulder = new THREE.Mesh(shoulderGeo, steel);
    shoulder.position.set(0, 0, -1.5);
    armGroup.add(shoulder);

    // Bicep (Upper Arm)
    const bicepCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(0, 0, -6));
    const bicepGeo = new THREE.TubeGeometry(bicepCurve, 32, 0.8, 32, false);
    const bicep = new THREE.Mesh(bicepGeo, aluminum);
    shoulder.add(bicep);
    meshes['Shoulder'] = shoulder;

    // Heavy Duty Hydraulic Pistons (Cylinder within Cylinder) on Bicep
    const pistonGroup = new THREE.Group();
    const pCylGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 32);
    const pCyl = new THREE.Mesh(pCylGeo, steel);
    pCyl.position.set(0, 1.2, -3);
    pCyl.rotation.x = Math.PI / 2;
    const pRodGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 32);
    const pRod = new THREE.Mesh(pRodGeo, chrome);
    pRod.position.set(0, -2, 0);
    pCyl.add(pRod);
    pistonGroup.add(pCyl);
    bicep.add(pistonGroup);
    meshes['Shoulder_Piston'] = pRod;

    // Elbow Joint
    const elbowGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 64);
    const elbow = new THREE.Mesh(elbowGeo, chrome);
    elbow.rotation.x = Math.PI / 2;
    elbow.position.set(0, 0, -6);
    bicep.add(elbow);

    // Forearm (Lower Arm)
    const forearmCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(0, 5, 0));
    const forearmGeo = new THREE.TubeGeometry(forearmCurve, 32, 0.7, 32, false);
    const forearm = new THREE.Mesh(forearmGeo, aluminum);
    forearm.rotation.x = -Math.PI / 2; 
    elbow.add(forearm);
    meshes['Elbow'] = elbow;

    // Forearm Hydraulics
    const pCyl2 = new THREE.Mesh(pCylGeo, steel);
    pCyl2.position.set(0, 2.5, 1);
    const pRod2 = new THREE.Mesh(pRodGeo, chrome);
    pRod2.position.set(0, 2, 0);
    pCyl2.add(pRod2);
    forearm.add(pCyl2);
    meshes['Elbow_Piston'] = pRod2;

    // Wrist Joint
    const wristGeo = new THREE.SphereGeometry(1, 64, 64);
    const wrist = new THREE.Mesh(wristGeo, steel);
    wrist.position.set(0, 5, 0);
    forearm.add(wrist);
    meshes['Wrist'] = wrist;

    // Complex Gripper Hand
    const handGroup = new THREE.Group();
    const palmShape = new THREE.Shape();
    palmShape.arc(0,0, 1.2, 0, Math.PI*2, false);
    const palmGeo = new THREE.ExtrudeGeometry(palmShape, {depth:0.8, bevelEnabled:true, bevelSize:0.1, bevelThickness:0.1});
    palmGeo.center();
    const palm = new THREE.Mesh(palmGeo, darkSteel);
    handGroup.add(palm);

    // 4 Articulated Claws
    const claws = [];
    for(let i=0; i<4; i++) {
        const clawGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 4;
        
        const knuckleGeo = new THREE.BoxGeometry(0.4, 1.5, 0.4);
        const knuckle = new THREE.Mesh(knuckleGeo, chrome);
        knuckle.position.set(0, 0.75, 0);
        
        const tipGeo = new THREE.ConeGeometry(0.25, 1.2, 32);
        const tip = new THREE.Mesh(tipGeo, rubber);
        tip.position.set(0, 1.2, -0.2);
        tip.rotation.x = -Math.PI / 4;
        
        knuckle.add(tip);
        clawGroup.add(knuckle);
        
        clawGroup.position.set(Math.cos(angle)*1, 0.4, Math.sin(angle)*1);
        clawGroup.lookAt(0, 2, 0);
        
        handGroup.add(clawGroup);
        claws.push(clawGroup);
    }
    meshes['Claws'] = claws;
    
    wrist.add(handGroup);

    addPart('Robotic_Gripper_Arm', armGroup, 'Heavy-duty 5-DOF articulated manipulator with synchronized hydraulics for fruit picking.', 'aluminum', 'Harvests delicate produce with extreme precision and force control.', 'Inability to harvest', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -25, 0));

    // --- 8. MULTI-SPECTRAL CAMERAS & SENSORS ---
    const camGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const camHousingGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.2, 32);
        const camHousing = new THREE.Mesh(camHousingGeo, plastic);
        
        const lensGeo = new THREE.SphereGeometry(0.35, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
        const lens = new THREE.Mesh(lensGeo, tinted);
        lens.position.y = 0.6;
        camHousing.add(lens);
        
        const angle = (i * Math.PI * 2) / 4;
        camHousing.position.set(Math.cos(angle)*2, Math.sin(angle)*2, -3.5);
        camHousing.lookAt(0,0,-8);
        camGroup.add(camHousing);
    }
    addPart('Multi_Spectral_Cameras', camGroup, 'High-fidelity sensor suite capturing IR, UV, and visible light to assess crop ripeness.', 'plastic', 'Determines optimal harvest targets and navigates foliage.', 'Misidentification of crops', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, -10));

    // --- 9. MICRO-SPRAYER TANKS ---
    const tankGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
        const tankGeo = new THREE.CapsuleGeometry(1, 3, 32, 64);
        const tank = new THREE.Mesh(tankGeo, tinted);
        tank.position.set(i===0 ? 3 : -3, i===0 ? 3 : -3, -2.5);
        tank.rotation.x = Math.PI / 2;
        
        // Pressure gauges on tanks
        const gaugeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const gauge = new THREE.Mesh(gaugeGeo, chrome);
        gauge.position.set(0, 1.5, 0.8);
        gauge.rotation.x = Math.PI/2;
        tank.add(gauge);

        // Tubes connecting to chassis
        const tubeCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, -1.5, 0),
            new THREE.Vector3(0, -2, 1),
            new THREE.Vector3(i===0?-3:3, i===0?-3:3, 1)
        );
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 32, 0.15, 16, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        tank.add(tube);
        
        tankGroup.add(tank);
    }
    addPart('Sprayer_Tanks', tankGroup, 'Pressurized micro-reservoirs for spot-treating plants with nutrients or pesticides.', 'tinted', 'Delivers precise micro-doses of chemicals directly to targets.', 'Chemical leakage', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(-15, -15, 0));

    // --- 10. COMM ANTENNAS ---
    const antGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
        const antGeo = new THREE.CylinderGeometry(0.08, 0.15, 5, 16);
        const ant = new THREE.Mesh(antGeo, steel);
        ant.position.set(i===0 ? 2 : -2, 0, 4);
        ant.rotation.x = Math.PI / 2;
        
        // Glowing tips
        const tipGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const tip = new THREE.Mesh(tipGeo, neonRed);
        tip.position.y = 2.5;
        ant.add(tip);
        meshes['Antenna_Tip_' + i] = tip;
        antGroup.add(ant);
    }
    addPart('Comm_Antennas', antGroup, 'Long-range swarm coordination multi-band datalinks.', 'steel', 'Maintains telemetry with farm mainframe and drone swarm.', 'Loss of swarm coordination', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, 15));

    // --- 11. NAVIGATION LIGHTS ARRAY ---
    const navGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const lightGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const lightMat = i % 2 === 0 ? neonRed : neonBlue;
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(Math.cos(angle)*8, Math.sin(angle)*8, 0);
        
        // Casing for light
        const caseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
        const caseMesh = new THREE.Mesh(caseGeo, darkSteel);
        caseMesh.rotation.x = Math.PI/2;
        light.add(caseMesh);
        
        navGroup.add(light);
    }
    meshes['NavLights'] = navGroup.children;
    addPart('Nav_Lights', navGroup, 'High-intensity LED markers for low-visibility and night operations.', 'glass', 'Visual tracking and collision deterrence.', 'Reduced visibility', [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 8));

    // --- 12. EXHAUST & COOLING MATRIX ---
    const ventGroup = new THREE.Group();
    const ventGeo = new THREE.TorusGeometry(3.5, 0.4, 32, 128);
    const ventMesh = new THREE.Mesh(ventGeo, darkSteel);
    ventGroup.add(ventMesh);
    
    // Complex inner mesh
    for (let i=0; i<24; i++) {
        const slatGeo = new THREE.BoxGeometry(0.1, 7, 0.4);
        const slat = new THREE.Mesh(slatGeo, aluminum);
        slat.rotation.z = (i * Math.PI) / 12;
        ventGroup.add(slat);
    }
    ventGroup.position.set(0, 0, -2.5);
    addPart('Heat_Sinks', ventGroup, 'Active thermal dissipation matrix featuring heavy-duty aluminum fins.', 'aluminum', 'Prevents system overheating during peak processing and flight.', 'Thermal throttling', ['Flight_Computer'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12));

    // --- 13. RTK GPS MODULE ---
    const gpsGeo = new THREE.BoxGeometry(1.5, 1.5, 0.8);
    const whitePlastic = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
    const gpsMesh = new THREE.Mesh(gpsGeo, whitePlastic);
    
    const gpsDomeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 64);
    const gpsDome = new THREE.Mesh(gpsDomeGeo, glass);
    gpsDome.position.z = 0.6;
    gpsDome.rotation.x = Math.PI / 2;
    gpsMesh.add(gpsDome);
    
    addPart('RTK_GPS', gpsMesh, 'Real-Time Kinematic GPS module for centimeter-level spatial positioning.', 'plastic', 'Provides ultra-precise global coordinates.', 'Navigation drift', ['Flight_Computer'], new THREE.Vector3(-3, 3, 1.5), new THREE.Vector3(-10, 10, 8));

    // --- 14. PAYLOAD QUICK-RELEASE MECHANISM ---
    const qrGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.8, 64);
    const qrMesh = new THREE.Mesh(qrGeo, chrome);
    qrMesh.rotation.x = Math.PI / 2;
    qrMesh.position.set(0, 0, -2.2);
    
    // Interlocking magnetic pins
    for (let i = 0; i < 6; i++) {
        const pinGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
        const pin = new THREE.Mesh(pinGeo, steel);
        pin.position.set(Math.cos(i*Math.PI/3)*1.8, 0, Math.sin(i*Math.PI/3)*1.8);
        qrMesh.add(pin);
    }
    addPart('Quick_Release', qrMesh, 'Magnetic interlock collar for swappable tools (gripper, shear, pruner).', 'chrome', 'Secures heavy robotic arms to chassis.', 'Tool drops mid-flight', ['Robotic_Gripper_Arm'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, -5, -8));

    // --- 15. MAIN WIRING HARNESS ---
    const wireGroup = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(angle)*3, Math.sin(angle)*3, 1.5),
            new THREE.Vector3(Math.cos(angle)*6, Math.sin(angle)*6, -1.5),
            new THREE.Vector3(Math.cos(angle)*8.5, Math.sin(angle)*8.5, 0)
        );
        const wGeo = new THREE.TubeGeometry(curve, 64, 0.15, 12, false);
        const wire = new THREE.Mesh(wGeo, wireMat);
        
        // Add secondary wire wrapping around the main one
        const wrapCurve = new THREE.CatmullRomCurve3([]);
        for(let w=0; w<=50; w++) {
            const t = w/50;
            const pt = curve.getPoint(t);
            const tan = curve.getTangent(t);
            const up = new THREE.Vector3(0,0,1);
            const axis = new THREE.Vector3().crossVectors(up, tan).normalize();
            const rad = 0.25;
            const offset = new THREE.Vector3(Math.cos(t*Math.PI*20)*rad, Math.sin(t*Math.PI*20)*rad, 0);
            pt.add(offset);
            wrapCurve.points.push(pt);
        }
        const wrapGeo = new THREE.TubeGeometry(wrapCurve, 128, 0.05, 8, false);
        const wrap = new THREE.Mesh(wrapGeo, copper);
        
        wireGroup.add(wire);
        wireGroup.add(wrap);
    }
    addPart('Wiring_Harness', wireGroup, 'Heavily shielded umbilical cables routing high-voltage power to motors.', 'rubber', 'Distributes power and signals reliably.', 'Short circuit and motor failure', ['Rotor_Arms_Array'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -15));

    // Orient the whole machine upright
    group.rotation.x = -Math.PI / 2;

    const description = "The Farm Harvester Drone is a massive, hyper-advanced agricultural hybrid machine. It boasts a hex-rotor configuration for extreme heavy lifting and an all-terrain wheel drivetrain for ground roving. Equipped with a 5-DOF robotic gripper arm, high-density quantum batteries, and multi-spectral/LiDAR sensor suites, it precisely identifies and harvests crops without human intervention.";

    const quizQuestions = [
        {
            question: "What is the primary function of the multi-spectral camera array?",
            options: [
                "Capturing IR, UV, and visible light to assess crop ripeness",
                "Providing a live video feed to the operator",
                "Measuring wind speed",
                "Charging the batteries via solar power"
            ],
            correctAnswer: 0,
            explanation: "The multi-spectral cameras capture various light spectrums (IR, UV, visible) to analyze the health and ripeness of crops, ensuring only mature fruit is harvested."
        },
        {
            question: "How does the drone achieve centimeter-level positioning accuracy?",
            options: [
                "Ultrasonic sensors",
                "LiDAR Dome",
                "RTK GPS Module",
                "Nav Lights"
            ],
            correctAnswer: 2,
            explanation: "The Real-Time Kinematic (RTK) GPS module corrects traditional GPS signals to provide ultra-precise spatial coordinates down to the centimeter."
        },
        {
            question: "Why does this specific harvester drone model feature aggressive off-road tires?",
            options: [
                "To look intimidating",
                "To allow ground roving when flying is inefficient or impossible",
                "To act as bumpers when hitting trees",
                "To store extra hydraulic fluid"
            ],
            correctAnswer: 1,
            explanation: "The hybrid drivetrain allows the drone to conserve battery by roving on the ground between harvest zones, rather than constantly hovering."
        },
        {
            question: "What mechanical advantage does the hex-rotor configuration offer over a quad-rotor?",
            options: [
                "It is lighter in weight",
                "It consumes less battery",
                "Redundancy and immense heavy lift capacity",
                "It requires less processing power"
            ],
            correctAnswer: 2,
            explanation: "A hex-rotor provides mechanical redundancy (surviving motor failure) and significant lift capability to carry heavy fruit payloads and massive battery banks."
        },
        {
            question: "How does the robotic arm ensure delicate fruit isn't crushed?",
            options: [
                "It doesn't; it just rips them off",
                "By using heavy-duty synchronized hydraulics with extreme precision and force control",
                "By dropping the fruit from high altitude",
                "By freezing the fruit first"
            ],
            correctAnswer: 1,
            explanation: "The 5-DOF arm utilizes advanced hydraulics and precise control algorithms to apply exactly enough force to grip without damaging the produce."
        }
    ];

    function animate(time, speed, meshes_ref) {
        const t = time * speed;
        
        // Spin props rapidly
        if (meshes['Props']) {
            meshes['Props'].forEach((prop, i) => {
                const dir = i % 2 === 0 ? 1 : -1;
                prop.rotation.z += 1.5 * speed * dir;
            });
        }
        
        // Spin off-road wheels (simulating roving)
        if (meshes['Wheels']) {
            meshes['Wheels'].forEach((wheel) => {
                wheel.rotation.y += 0.2 * speed;
            });
        }
        
        // Spin LiDAR Scanner
        if (meshes['LiDAR_Spinner']) {
            meshes['LiDAR_Spinner'].rotation.y = t * 3;
        }

        // Pulse Nav Lights
        if (meshes['NavLights']) {
            meshes['NavLights'].forEach((light, i) => {
                light.material.emissiveIntensity = 1 + Math.sin(t * 4 + i) * 0.8;
            });
        }
        
        // Pulse Antenna Tips
        for(let i=0; i<2; i++) {
            if (meshes['Antenna_Tip_' + i]) {
                meshes['Antenna_Tip_' + i].material.emissiveIntensity = 1.5 + Math.sin(t * 8 + i*Math.PI) * 1.5;
            }
        }

        // Articulate the Robotic Arm dynamically
        if (meshes['Shoulder']) {
            meshes['Shoulder'].rotation.x = Math.sin(t * 0.5) * 0.4;
            meshes['Shoulder'].rotation.y = Math.cos(t * 0.3) * 0.3;
        }
        if (meshes['Elbow']) {
            meshes['Elbow'].rotation.x = Math.sin(t * 0.4 + 1) * 0.6;
        }
        if (meshes['Wrist']) {
            meshes['Wrist'].rotation.x = Math.sin(t * 0.6) * 0.5;
            meshes['Wrist'].rotation.z = Math.cos(t * 0.7) * 0.3;
        }
        
        // Synchronized Hydraulic Pistons on the arm
        if (meshes['Shoulder_Piston']) {
            // translate rod in and out based on shoulder rotation
            meshes['Shoulder_Piston'].position.y = -2 + Math.sin(t * 0.5) * 0.5;
        }
        if (meshes['Elbow_Piston']) {
            meshes['Elbow_Piston'].position.y = 2 + Math.sin(t * 0.4 + 1) * 0.5;
        }

        // Open/Close Claws
        if (meshes['Claws']) {
            const clawAngle = (Math.sin(t * 2) + 1) * 0.25; 
            meshes['Claws'].forEach(claw => {
                claw.rotation.x = clawAngle;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHarvesterDrone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
