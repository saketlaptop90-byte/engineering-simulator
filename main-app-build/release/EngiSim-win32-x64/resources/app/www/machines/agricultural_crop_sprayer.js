import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Emissive and High-Tech Materials
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2 });
    const metallicGreen = new THREE.MeshStandardMaterial({ color: 0x114411, metalness: 0.8, roughness: 0.2 });
    const brightWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5 });
    const cautionYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.3, roughness: 0.6 });

    // ==========================================
    // 1. MAIN CHASSIS FRAME
    // ==========================================
    const chassisGroup = new THREE.Group();
    // Huge C-channel or tubular main rails
    for(let i=0; i<2; i++) {
        const x = i === 0 ? 1 : -1;
        
        // Primary upper rail
        const mainRailGeo = new THREE.CylinderGeometry(0.2, 0.2, 9, 32);
        const mainRail = new THREE.Mesh(mainRailGeo, darkSteel);
        mainRail.rotation.x = Math.PI / 2;
        mainRail.position.set(x * 1, 2.8, 0);
        chassisGroup.add(mainRail);
        
        // Lower truss rail for heavy payload support
        const lowerRailGeo = new THREE.CylinderGeometry(0.12, 0.12, 7, 16);
        const lowerRail = new THREE.Mesh(lowerRailGeo, darkSteel);
        lowerRail.rotation.x = Math.PI / 2;
        lowerRail.position.set(x * 1, 2.2, 0.5);
        chassisGroup.add(lowerRail);

        // Vertical truss supports
        for(let j=-3; j<=3; j+=1.5) {
            const vSupportGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
            const vSupport = new THREE.Mesh(vSupportGeo, darkSteel);
            vSupport.position.set(x * 1, 2.5, j + 0.5);
            chassisGroup.add(vSupport);
        }
        
        // Diagonal cross bracing
        for(let j=-3; j<3; j+=1.5) {
            const diagGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
            const diag = new THREE.Mesh(diagGeo, darkSteel);
            diag.position.set(x * 1, 2.5, j + 1.25);
            diag.rotation.x = Math.PI / 4;
            chassisGroup.add(diag);
        }
    }
    
    // Cross members connecting left and right rails
    for(let j=-4; j<=4; j+=2) {
        const crossGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 32);
        const cross = new THREE.Mesh(crossGeo, darkSteel);
        cross.rotation.z = Math.PI / 2;
        cross.position.set(0, 2.8, j);
        chassisGroup.add(cross);
    }

    // Belly pan / Skid plate to protect internals from crop impact
    const skidShape = new THREE.Shape();
    skidShape.moveTo(-1.1, -4.5);
    skidShape.lineTo(1.1, -4.5);
    skidShape.lineTo(1.1, 4.5);
    skidShape.lineTo(-1.1, 4.5);
    const skidGeo = new THREE.ExtrudeGeometry(skidShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelSegments: 2 });
    const skid = new THREE.Mesh(skidGeo, steel);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(0, 2.1, -4.5);
    chassisGroup.add(skid);

    meshes.chassis = chassisGroup;
    group.add(chassisGroup);
    parts.push({
        name: "High-Clearance Truss Chassis",
        description: "Heavy-duty tubular steel truss chassis providing extreme 50+ inch ground clearance.",
        material: "High-Tensile Dark Steel",
        function: "Structural foundation",
        assemblyOrder: 1,
        connections: ["DropAxleFront", "DropAxleRear", "MainLiquidTank", "OperatorCabin"],
        failureEffect: "Structural collapse under load",
        cascadeFailures: ["Entire machine geometry"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-3, z:0}
    });

    // ==========================================
    // 2. DROP AXLES & SUSPENSION
    // ==========================================
    const createDropAxle = (zPos, name, isFront) => {
        const axleGroup = new THREE.Group();
        
        // Massive differential / central mounting block
        const diffGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
        const diff = new THREE.Mesh(diffGeo, darkSteel);
        diff.rotation.z = Math.PI / 2;
        diff.position.set(0, 2.8, 0);
        axleGroup.add(diff);

        // Axle tubes extending horizontally
        const axleTubeGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.8, 32);
        const axleTube = new THREE.Mesh(axleTubeGeo, darkSteel);
        axleTube.rotation.z = Math.PI / 2;
        axleTube.position.set(0, 2.8, 0);
        axleGroup.add(axleTube);
        
        const steeringKnuckles = [];
        
        // Drop legs with integrated hydraulic suspension
        for(let i=0; i<2; i++) {
            const x = i === 0 ? 1.4 : -1.4;
            const legGrp = new THREE.Group();
            
            // Upper housing
            const upperLegGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 32);
            const upperLeg = new THREE.Mesh(upperLegGeo, darkSteel);
            upperLeg.position.set(0, 2.05, 0);
            legGrp.add(upperLeg);

            // Lower sliding tube (chrome strut)
            const strutGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32);
            const strut = new THREE.Mesh(strutGeo, chrome);
            strut.position.set(0, 0.8, 0);
            legGrp.add(strut);
            
            // Suspension Spring coil
            const springCurve = new THREE.CatmullRomCurve3(
                Array.from({length: 40}, (_, k) => {
                    const t = k / 39;
                    const loops = 8;
                    const r = 0.28;
                    return new THREE.Vector3(Math.cos(t * Math.PI * 2 * loops) * r, t * 1.5 + 0.8, Math.sin(t * Math.PI * 2 * loops) * r);
                })
            );
            const springGeo = new THREE.TubeGeometry(springCurve, 100, 0.04, 16, false);
            const spring = new THREE.Mesh(springGeo, cautionYellow);
            legGrp.add(spring);

            // Wheel Hub Motor casing (Hydrostatic Drive)
            const hubGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 32);
            const hub = new THREE.Mesh(hubGeo, steel);
            hub.rotation.z = Math.PI / 2;
            hub.position.set(i===0?0.2:-0.2, 0, 0);
            legGrp.add(hub);
            
            // Hydraulic hoses to hub motor
            for(let h=0; h<2; h++) {
                const hoseCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(i===0?0.3:-0.3, 0.2, (h===0?0.2:-0.2)),
                    new THREE.Vector3(i===0?0.4:-0.4, 1.0, 0),
                    new THREE.Vector3(0, 2.0, 0)
                ]);
                const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 16, 0.03, 8, false), rubber);
                legGrp.add(hose);
            }

            // Steering mechanism
            if(isFront) {
                const knuckle = new THREE.Group();
                knuckle.position.set(x, 2.0, 0);
                
                const steeringArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
                const steeringArm = new THREE.Mesh(steeringArmGeo, chrome);
                steeringArm.rotation.x = Math.PI / 2;
                steeringArm.position.set(0, 0, 0.25);
                knuckle.add(steeringArm);
                
                axleGroup.add(knuckle);
                steeringKnuckles.push(knuckle);
            }
            
            legGrp.position.set(x, 0, 0);
            axleGroup.add(legGrp);
        }
        
        // Steering cylinder connecting the two legs
        if(isFront) {
            const steerCylGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
            const steerCyl = new THREE.Mesh(steerCylGeo, steel);
            steerCyl.rotation.z = Math.PI / 2;
            steerCyl.position.set(0, 2.0, 0.5);
            axleGroup.add(steerCyl);
            
            const tieRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 16);
            const tieRod = new THREE.Mesh(tieRodGeo, chrome);
            tieRod.rotation.z = Math.PI / 2;
            tieRod.position.set(0, 2.0, 0.5);
            meshes.tieRod = tieRod;
            axleGroup.add(tieRod);
        }
        
        axleGroup.position.set(0, 0, zPos);
        return axleGroup;
    };
    
    const axleFront = createDropAxle(3.5, "DropAxleFront", true);
    meshes.axleFront = axleFront;
    group.add(axleFront);
    parts.push({
        name: "Front Articulated Drop Axle",
        description: "Hydropneumatic suspended drop axle with heavy-duty hydraulic steering tie-rods.",
        material: "Cast Steel / Chrome",
        function: "Steering, suspension, and crop clearance",
        assemblyOrder: 2,
        connections: ["High-Clearance Chassis", "WheelFrontLeft", "WheelFrontRight"],
        failureEffect: "Loss of steering and damping",
        cascadeFailures: ["Wheel alignment", "Crop clearance"],
        originalPosition: {x:0, y:0, z:3.5},
        explodedPosition: {x:0, y:0, z:9.5}
    });

    const axleRear = createDropAxle(-3.5, "DropAxleRear", false);
    meshes.axleRear = axleRear;
    group.add(axleRear);
    parts.push({
        name: "Rear Rigid Drop Axle",
        description: "Fixed drop axle with independent strut suspension handling the massive liquid payload.",
        material: "Cast Steel / Chrome",
        function: "Weight distribution and stability",
        assemblyOrder: 3,
        connections: ["High-Clearance Chassis", "WheelRearLeft", "WheelRearRight"],
        failureEffect: "Chassis bottom-out",
        cascadeFailures: ["MainLiquidTank stress fracture"],
        originalPosition: {x:0, y:0, z:-3.5},
        explodedPosition: {x:0, y:0, z:-9.5}
    });

    // ==========================================
    // 3. WHEELS (Massive & Aggressive)
    // ==========================================
    const createWheel = () => {
        const wheelGrp = new THREE.Group();
        
        // Tall, thin pneumatic tire carcass
        const tireGeo = new THREE.TorusGeometry(1.8, 0.22, 48, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGrp.add(tire);
        
        // High-traction deep V-lugs (Classic agricultural tread)
        const numLugs = 56;
        for(let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const isLeftLug = i % 2 === 0;
            
            const lugShape = new THREE.Shape();
            lugShape.moveTo(-0.1, 0);
            lugShape.lineTo(0.1, 0);
            lugShape.lineTo(0.06, 0.45);
            lugShape.lineTo(-0.06, 0.45);
            const lugGeo = new THREE.ExtrudeGeometry(lugShape, {depth: 0.28, bevelEnabled:true, bevelSize:0.02, bevelThickness:0.02});
            
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.rotation.x = Math.PI / 2;
            lug.rotation.y = isLeftLug ? Math.PI/3.5 : -Math.PI/3.5;
            
            const r = 2.0;
            lug.position.set(Math.cos(angle)*r, Math.sin(angle)*r, isLeftLug ? 0.06 : -0.06);
            lug.lookAt(0, 0, lug.position.z);
            wheelGrp.add(lug);
        }
        
        // Massive planetary gear rim
        const rimGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.28, 64);
        const rim = new THREE.Mesh(rimGeo, metallicGreen);
        rim.rotation.x = Math.PI / 2;
        wheelGrp.add(rim);
        
        // Complex structural rim webbing
        const webGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.32, 32);
        const web = new THREE.Mesh(webGeo, chrome);
        web.rotation.x = Math.PI / 2;
        wheelGrp.add(web);
        
        for(let i=0; i<16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 16);
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.position.set(Math.cos(angle)*1.1, Math.sin(angle)*1.1, 0);
            spoke.rotation.z = angle + Math.PI/2;
            spoke.rotation.x = Math.PI/2;
            wheelGrp.add(spoke);
        }
        
        // Planetary hub with bolts
        const hubCapGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32);
        const hubCap = new THREE.Mesh(hubCapGeo, darkSteel);
        hubCap.rotation.x = Math.PI/2;
        wheelGrp.add(hubCap);

        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const boltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.rotation.x = Math.PI/2;
            bolt.position.set(Math.cos(angle)*0.28, Math.sin(angle)*0.28, 0);
            wheelGrp.add(bolt);
        }
        
        return wheelGrp;
    };
    
    meshes.wheelFL = createWheel();
    meshes.wheelFL.position.set(1.7, 0, 3.5);
    meshes.wheelFL.rotation.y = Math.PI / 2;
    group.add(meshes.wheelFL);
    parts.push({ name: "Wheel Front Left", description: "380/90R46 pneumatic tire with planetary drive hub.", material: "Rubber / Steel", function: "Locomotion / Traction", assemblyOrder: 4, connections: ["DropAxleFront"], failureEffect: "Immobility", cascadeFailures: [], originalPosition: {x:1.7, y:0, z:3.5}, explodedPosition: {x:7, y:0, z:3.5} });

    meshes.wheelFR = createWheel();
    meshes.wheelFR.position.set(-1.7, 0, 3.5);
    meshes.wheelFR.rotation.y = Math.PI / 2;
    group.add(meshes.wheelFR);
    parts.push({ name: "Wheel Front Right", description: "380/90R46 pneumatic tire with planetary drive hub.", material: "Rubber / Steel", function: "Locomotion / Traction", assemblyOrder: 5, connections: ["DropAxleFront"], failureEffect: "Immobility", cascadeFailures: [], originalPosition: {x:-1.7, y:0, z:3.5}, explodedPosition: {x:-7, y:0, z:3.5} });

    meshes.wheelRL = createWheel();
    meshes.wheelRL.position.set(1.7, 0, -3.5);
    meshes.wheelRL.rotation.y = Math.PI / 2;
    group.add(meshes.wheelRL);
    parts.push({ name: "Wheel Rear Left", description: "380/90R46 pneumatic tire with planetary drive hub.", material: "Rubber / Steel", function: "Locomotion / Traction", assemblyOrder: 6, connections: ["DropAxleRear"], failureEffect: "Immobility", cascadeFailures: [], originalPosition: {x:1.7, y:0, z:-3.5}, explodedPosition: {x:7, y:0, z:-3.5} });

    meshes.wheelRR = createWheel();
    meshes.wheelRR.position.set(-1.7, 0, -3.5);
    meshes.wheelRR.rotation.y = Math.PI / 2;
    group.add(meshes.wheelRR);
    parts.push({ name: "Wheel Rear Right", description: "380/90R46 pneumatic tire with planetary drive hub.", material: "Rubber / Steel", function: "Locomotion / Traction", assemblyOrder: 7, connections: ["DropAxleRear"], failureEffect: "Immobility", cascadeFailures: [], originalPosition: {x:-1.7, y:0, z:-3.5}, explodedPosition: {x:-7, y:0, z:-3.5} });

    // ==========================================
    // 4. POWERPLANT (Engine & Hydraulics)
    // ==========================================
    const engineGrp = new THREE.Group();
    
    // Main engine block geometry using lathe and extrude
    const blockShape = new THREE.Shape();
    blockShape.moveTo(-0.4, 0); blockShape.lineTo(0.4, 0);
    blockShape.lineTo(0.6, 0.8); blockShape.lineTo(0.3, 1.2);
    blockShape.lineTo(-0.3, 1.2); blockShape.lineTo(-0.6, 0.8);
    const blockGeo = new THREE.ExtrudeGeometry(blockShape, {depth: 2.0, bevelEnabled:true, bevelSize: 0.05, bevelSegments: 3});
    const block = new THREE.Mesh(blockGeo, steel);
    block.position.set(0, 0, -1.0);
    engineGrp.add(block);

    // V-configuration cylinders (V6 Engine)
    for(let i=0; i<3; i++) {
        for(let j=0; j<2; j++) {
            const cylGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32);
            const cyl = new THREE.Mesh(cylGeo, chrome);
            const sign = j===0 ? 1 : -1;
            cyl.rotation.z = sign * Math.PI/5;
            cyl.position.set(sign*0.4, 1.0, -0.6 + i*0.6);
            engineGrp.add(cyl);
            
            // High-pressure Fuel injectors
            const injGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
            const inj = new THREE.Mesh(injGeo, copper);
            inj.rotation.z = sign * Math.PI/5;
            inj.position.set(sign*0.5, 1.3, -0.6 + i*0.6);
            engineGrp.add(inj);
        }
    }
    
    // Turbocharger assembly
    const turboGrp = new THREE.Group();
    const turboGeo = new THREE.TorusGeometry(0.2, 0.1, 32, 32);
    const turbo = new THREE.Mesh(turboGeo, darkSteel);
    turbo.rotation.y = Math.PI/2;
    turboGrp.add(turbo);
    const turboPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16), chrome);
    turboPipe.position.set(0, 0, 0.5);
    turboPipe.rotation.x = Math.PI/2;
    turboGrp.add(turboPipe);
    turboGrp.position.set(0, 1.5, -0.8);
    engineGrp.add(turboGrp);

    // Massive Radiator Fan & Shroud
    const fanGrp = new THREE.Group();
    const fanCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 32), darkSteel);
    fanCenter.rotation.x = Math.PI/2;
    fanGrp.add(fanCenter);
    for(let i=0; i<8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.12, 0.8, 0.02);
        const blade = new THREE.Mesh(bladeGeo, plastic); 
        blade.position.set(Math.cos(i/8*Math.PI*2)*0.45, Math.sin(i/8*Math.PI*2)*0.45, 0);
        blade.rotation.z = i/8*Math.PI*2;
        blade.rotation.y = Math.PI/5; 
        fanGrp.add(blade);
    }
    fanGrp.position.set(0, 0.6, 1.2);
    meshes.fan = fanGrp;
    engineGrp.add(fanGrp);
    
    // Radiator housing
    const radGeo = new THREE.BoxGeometry(1.6, 1.8, 0.2);
    const rad = new THREE.Mesh(radGeo, darkSteel);
    rad.position.set(0, 0.6, 1.4);
    engineGrp.add(rad);

    engineGrp.position.set(0, 2.8, 1.8);
    group.add(engineGrp);
    parts.push({
        name: "9.0L Turbo-Diesel Powerplant", description: "380 HP engine generating immense hydraulic flow and tractive effort.", material: "Cast Iron / Aluminum", function: "Power Generation", assemblyOrder: 8, connections: ["High-Clearance Chassis"], failureEffect: "Total machine shutdown", cascadeFailures: ["HydraulicSystem", "Locomotion", "Steering"], originalPosition: {x:0, y:2.8, z:1.8}, explodedPosition: {x:0, y:7.0, z:5.0}
    });

    // ==========================================
    // 5. HYDRAULIC RESERVOIR & PUMPS
    // ==========================================
    const hydSysGrp = new THREE.Group();
    const resGeo = new THREE.BoxGeometry(0.9, 1.4, 0.9);
    const reservoir = new THREE.Mesh(resGeo, steel);
    reservoir.position.set(-0.8, 0.7, 0);
    hydSysGrp.add(reservoir);
    
    // Hydraulic pump array attached to engine PTO
    for(let i=0; i<3; i++) {
        const pumpGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32);
        const pump = new THREE.Mesh(pumpGeo, chrome);
        pump.rotation.x = Math.PI/2;
        pump.position.set(0, 0.5, -i*0.45 - 0.2);
        hydSysGrp.add(pump);
        
        // Braided Hoses
        const hoseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.5, -i*0.45 - 0.2),
            new THREE.Vector3(-0.4, 0.9, -i*0.45 - 0.2),
            new THREE.Vector3(-0.8, 0.7, 0)
        ]);
        const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 16, 0.04, 16, false), rubber);
        hydSysGrp.add(hose);
    }
    
    hydSysGrp.position.set(0, 2.8, 0.5);
    group.add(hydSysGrp);
    parts.push({
        name: "Multi-Stage Hydraulic System", description: "High-capacity reservoir and tandem hydrostatic pumps driving wheels, steering, and booms.", material: "Steel / Rubber", function: "Fluid Power", assemblyOrder: 9, connections: ["9.0L Turbo-Diesel Powerplant", "Wheel Hub Motors"], failureEffect: "Loss of implement control", cascadeFailures: ["BoomLiftMast", "Wheel Hub Motors"], originalPosition: {x:0, y:2.8, z:0.5}, explodedPosition: {x:-4, y:5.0, z:0.5}
    });

    // ==========================================
    // 6. MAIN LIQUID TANK
    // ==========================================
    const tankGrp = new THREE.Group();
    // Huge intricate capsule-like tank
    const tankPoints = [];
    for ( let i = 0; i <= 60; i ++ ) {
        const v = i / 60;
        const phi = v * Math.PI;
        // slightly elliptical profile
        let x = Math.sin(phi) * 1.6;
        let y = Math.cos(phi) * 1.6;
        if(v < 0.5) y += 1.8;
        else y -= 1.8;
        tankPoints.push( new THREE.Vector2( x, y ) );
    }
    const tankGeo = new THREE.LatheGeometry( tankPoints, 64 );
    const tankMesh = new THREE.Mesh(tankGeo, plastic); // White polymer tank
    tankMesh.rotation.x = Math.PI / 2;
    tankGrp.add(tankMesh);
    
    // Steel saddle straps holding the tank
    for(let i=-2.2; i<=2.2; i+=1.46) {
        const bandGeo = new THREE.TorusGeometry(1.62, 0.04, 16, 64);
        const band = new THREE.Mesh(bandGeo, darkSteel);
        band.position.z = i;
        tankGrp.add(band);
        
        // Tension bolts on the straps
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16), chrome);
        bolt.position.set(1.62, 0, i);
        bolt.rotation.z = Math.PI/2;
        tankGrp.add(bolt);
        const bolt2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16), chrome);
        bolt2.position.set(-1.62, 0, i);
        bolt2.rotation.z = Math.PI/2;
        tankGrp.add(bolt2);
    }
    
    // Tank Lid & Overflow vent
    const lidGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const lid = new THREE.Mesh(lidGeo, darkSteel);
    lid.position.set(0, 1.5, 0);
    tankGrp.add(lid);

    // Sight tube (Level indicator)
    const levelTubeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16);
    const levelTube = new THREE.Mesh(levelTubeGeo, glass);
    levelTube.rotation.x = Math.PI/2;
    levelTube.position.set(-1.55, 0, 0);
    tankGrp.add(levelTube);
    
    tankGrp.position.set(0, 4.8, -1.8);
    group.add(tankGrp);
    parts.push({
        name: "1200-Gallon Poly Tank", description: "Massive ultra-durable polymer tank with internal anti-slosh baffling.", material: "Polymer / Stainless Steel", function: "Chemical Payload", assemblyOrder: 10, connections: ["High-Clearance Chassis", "High-Volume Centrifugal Pump"], failureEffect: "Chemical spill / Loss of payload", cascadeFailures: ["Nozzle Pressure"], originalPosition: {x:0, y:4.8, z:-1.8}, explodedPosition: {x:0, y:11.0, z:-1.8}
    });

    // ==========================================
    // 7. OPERATOR CABIN & PLATFORM
    // ==========================================
    const cabGrp = new THREE.Group();
    // Cab base frame
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-1.1, -1.1); cabShape.lineTo(1.1, -1.1);
    cabShape.lineTo(1.2, 0.3); cabShape.lineTo(0.9, 1.7);
    cabShape.lineTo(-0.9, 1.7); cabShape.lineTo(-1.2, 0.3);
    cabShape.lineTo(-1.1, -1.1);
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, { depth: 2.2, bevelEnabled: true, bevelSize: 0.05, bevelSegments: 3 });
    const cabMesh = new THREE.Mesh(cabGeo, tinted);
    cabMesh.position.set(0, 0, -1.1);
    cabGrp.add(cabMesh);
    
    // ROPS structure (Roll Over Protection System)
    const ropsGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
    const rops1 = new THREE.Mesh(ropsGeo, steel); rops1.position.set(1.2, 0.3, 1.0); rops1.rotation.z = -Math.PI/12; cabGrp.add(rops1);
    const rops2 = new THREE.Mesh(ropsGeo, steel); rops2.position.set(-1.2, 0.3, 1.0); rops2.rotation.z = Math.PI/12; cabGrp.add(rops2);
    const rops3 = new THREE.Mesh(ropsGeo, steel); rops3.position.set(1.0, 1.1, -1.0); rops3.rotation.z = -Math.PI/12; cabGrp.add(rops3);
    const rops4 = new THREE.Mesh(ropsGeo, steel); rops4.position.set(-1.0, 1.1, -1.0); rops4.rotation.z = Math.PI/12; cabGrp.add(rops4);

    // Cab Roof and A/C module
    const roofGeo = new THREE.BoxGeometry(2.2, 0.25, 2.2);
    const roof = new THREE.Mesh(roofGeo, metallicGreen);
    roof.position.set(0, 1.8, 0);
    cabGrp.add(roof);
    
    const acGeo = new THREE.BoxGeometry(0.9, 0.4, 0.9);
    const ac = new THREE.Mesh(acGeo, plastic);
    ac.position.set(0, 2.05, -0.2);
    cabGrp.add(ac);

    // Interior High-Tech Details
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), darkSteel);
    seatBase.position.set(0, -0.8, 0.2);
    cabGrp.add(seatBase);
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), rubber);
    seatCushion.position.set(0, -0.5, 0.2);
    cabGrp.add(seatCushion);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.2), rubber);
    seatBack.position.set(0, 0.05, -0.1);
    cabGrp.add(seatBack);

    // Armrests with Joysticks (Hydrostatic controls)
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.7), plastic);
    armL.position.set(0.4, -0.3, 0.3);
    cabGrp.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.7), plastic);
    armR.position.set(-0.4, -0.3, 0.3);
    cabGrp.add(armR);
    
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8), chrome);
    stick.position.set(0.4, -0.1, 0.5);
    stick.rotation.x = Math.PI/6;
    cabGrp.add(stick);

    // Steering Column & Wheel
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16), plastic);
    column.position.set(0, -0.5, 0.9);
    column.rotation.x = -Math.PI/4;
    cabGrp.add(column);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 16, 32), rubber);
    wheel.position.set(0, -0.1, 1.2);
    wheel.rotation.x = -Math.PI/4;
    cabGrp.add(wheel);

    // Glowing AR/Data Displays
    const monitor1 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), neonBlue);
    monitor1.position.set(-0.4, 0, 1.1);
    monitor1.rotation.y = Math.PI/5;
    cabGrp.add(monitor1);
    const monitor2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), neonGreen);
    monitor2.position.set(0.4, 0, 1.1);
    monitor2.rotation.y = -Math.PI/5;
    cabGrp.add(monitor2);
    
    // Front LED Work Lights
    for(let i=0; i<4; i++) {
        const light = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.1), brightWhite);
        light.position.set(-0.9 + i*0.6, 1.9, 1.1);
        cabGrp.add(light);
    }

    // Safety Beacon
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16), neonRed);
    beacon.position.set(-0.9, 2.1, 0);
    meshes.beacon = beacon;
    cabGrp.add(beacon);

    cabGrp.position.set(0, 5.0, 4.0);
    group.add(cabGrp);
    parts.push({
        name: "Command Center Cabin", description: "Pressurized, charcoal-filtered cab with multi-monitor precision ag interface.", material: "Glass / Steel", function: "Operator Environment", assemblyOrder: 11, connections: ["High-Clearance Chassis"], failureEffect: "Chemical exposure / Loss of control", cascadeFailures: ["Navigation"], originalPosition: {x:0, y:5.0, z:4.0}, explodedPosition: {x:0, y:12.0, z:6.0}
    });

    // Catwalk Platform and Retractable Ladder
    const platGrp = new THREE.Group();
    const platGeo = new THREE.BoxGeometry(2.6, 0.05, 1.8);
    const plat = new THREE.Mesh(platGeo, darkSteel);
    platGrp.add(plat);
    
    // Handrails
    for(let i=0; i<5; i++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8), metallicGreen);
        post.position.set(-1.2 + (i*0.6), 0.5, 0.85);
        platGrp.add(post);
    }
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 8), metallicGreen);
    rail.rotation.z = Math.PI/2;
    rail.position.set(0, 1.0, 0.85);
    platGrp.add(rail);

    // Ladder mechanism
    for(let i=0; i<10; i++) {
        const step = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16), steel);
        step.rotation.z = Math.PI/2;
        step.position.set(1.5, -i*0.35, 0.85 - i*0.15);
        platGrp.add(step);
    }
    
    platGrp.position.set(0, 3.9, 4.0);
    group.add(platGrp);
    parts.push({
        name: "Access Platform & Folding Ladder", description: "Grating platform for cab entry and safe tank inspection.", material: "Steel", function: "Access", assemblyOrder: 12, connections: ["High-Clearance Chassis"], failureEffect: "Inaccessibility", cascadeFailures: [], originalPosition: {x:0, y:3.9, z:4.0}, explodedPosition: {x:5.0, y:3.9, z:4.0}
    });

    // ==========================================
    // 8. BOOM LIFT MAST
    // ==========================================
    const mastGrp = new THREE.Group();
    // Massive parallelogram lift mechanism
    const mastPostGeo = new THREE.BoxGeometry(0.25, 5.5, 0.25);
    const mPostL = new THREE.Mesh(mastPostGeo, steel); mPostL.position.set(-1.2, 2.5, 0); mastGrp.add(mPostL);
    const mPostR = new THREE.Mesh(mastPostGeo, steel); mPostR.position.set(1.2, 2.5, 0); mastGrp.add(mPostR);
    
    const mastCrossGeo = new THREE.BoxGeometry(2.4, 0.2, 0.2);
    for(let i=1; i<5; i+=1.5) {
        const mCross = new THREE.Mesh(mastCrossGeo, steel);
        mCross.position.set(0, i, 0);
        mastGrp.add(mCross);
    }
    
    // Hydraulic Lift Cylinders (Massive double-acting)
    const liftCylGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.0, 32);
    const liftCyl1 = new THREE.Mesh(liftCylGeo, chrome); liftCyl1.position.set(-0.8, 1.5, -0.2); mastGrp.add(liftCyl1);
    const liftCyl2 = new THREE.Mesh(liftCylGeo, chrome); liftCyl2.position.set(0.8, 1.5, -0.2); mastGrp.add(liftCyl2);

    // Boom Mounting Carriage (Moves up/down during animation)
    const boomCarriage = new THREE.Group();
    const carriageFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 0.5), darkSteel);
    boomCarriage.add(carriageFrame);
    
    // Shock absorbers for boom yaw/pitch
    const shockBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.0, 16), cautionYellow);
    shockBase.position.set(0, 0.6, 0.25);
    boomCarriage.add(shockBase);
    
    boomCarriage.position.set(0, 2.5, 0.3);
    meshes.boomCarriage = boomCarriage;
    mastGrp.add(boomCarriage);

    mastGrp.position.set(0, 2.2, -5.5);
    group.add(mastGrp);
    parts.push({
        name: "Parallelogram Boom Mast", description: "Heavy-duty lifting mast providing up to 8 feet of vertical boom travel.", material: "High-Tensile Steel", function: "Boom Height Adjustment", assemblyOrder: 13, connections: ["High-Clearance Chassis", "Center Boom Rack"], failureEffect: "Fixed spray height", cascadeFailures: ["Crop impact damage"], originalPosition: {x:0, y:2.2, z:-5.5}, explodedPosition: {x:0, y:5.0, z:-11.0}
    });

    // ==========================================
    // 9. SPRAY BOOMS (120-foot simulated scale)
    // ==========================================
    // Center rack
    const centerRack = new THREE.Group();
    const crFrameGeo = new THREE.BoxGeometry(3.4, 0.9, 0.5);
    const crFrame = new THREE.Mesh(crFrameGeo, metallicGreen);
    centerRack.add(crFrame);
    
    // Main Fluid distribution manifolds
    const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 32), plastic);
    manifold.rotation.z = Math.PI/2;
    manifold.position.set(0, -0.55, 0);
    centerRack.add(manifold);

    // Helper to add complex nozzles and visual spray cones
    const addNozzles = (grp, length, count) => {
        for(let i=0; i<count; i++) {
            const nozGrp = new THREE.Group();
            
            // Electronic Valve body (PWM control)
            const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.1), plastic);
            nozGrp.add(body);
            
            // Brass/Ceramic Spray tip
            const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.05, 0.1, 16), copper);
            tip.position.y = -0.12;
            nozGrp.add(tip);
            
            // Visual simulated spray cone (transparent/emissive)
            const cone = new THREE.Mesh(
                new THREE.ConeGeometry(0.3, 0.6, 16),
                new THREE.MeshStandardMaterial({color: 0x00ffff, transparent: true, opacity: 0.15, emissive: 0x00aaff})
            );
            cone.position.y = -0.4;
            if(!meshes.sprayCones) meshes.sprayCones = [];
            meshes.sprayCones.push(cone);
            nozGrp.add(cone);

            nozGrp.position.set(-length/2 + (i/(count-1))*length, -0.7, 0);
            grp.add(nozGrp);
        }
    };
    addNozzles(centerRack, 3.2, 10);
    boomCarriage.add(centerRack);
    parts.push({ name: "Center Boom Rack", description: "Main stability platform housing section valves and primary plumbing.", material: "Steel / Polymer", function: "Core Distribution", assemblyOrder: 14, connections: ["Boom Lift Mast", "Left Primary Boom", "Right Primary Boom"], failureEffect: "Total fluid cutoff", cascadeFailures: ["All Spray Zones"], originalPosition: {x:0, y:2.5, z:-5.2}, explodedPosition: {x:0, y:6.0, z:-13.0} });

    // Function to generate complex truss arms with hydraulic lines
    const createTrussArm = (length, nozzleCount, isLeft) => {
        const armGrp = new THREE.Group();
        
        // Main structural tubes
        const topTube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, length, 16), metallicGreen);
        topTube.rotation.z = Math.PI / 2;
        topTube.position.set((isLeft?1:-1)*length/2, 0.5, 0);
        armGrp.add(topTube);
        
        const botTubeFront = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 16), metallicGreen);
        botTubeFront.rotation.z = Math.PI / 2;
        botTubeFront.position.set((isLeft?1:-1)*length/2, 0, 0.25);
        armGrp.add(botTubeFront);

        const botTubeBack = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 16), metallicGreen);
        botTubeBack.rotation.z = Math.PI / 2;
        botTubeBack.position.set((isLeft?1:-1)*length/2, 0, -0.25);
        armGrp.add(botTubeBack);

        // Zig-zag truss webbing
        const numWebs = Math.floor(length / 0.5);
        for(let i=0; i<numWebs; i++) {
            const xPos = (isLeft?1:-1) * (i*0.5 + 0.25);
            // Front diagonal
            const diagF = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), aluminum);
            diagF.position.set(xPos, 0.25, 0.125);
            diagF.rotation.z = Math.PI/4 * (i%2===0?1:-1);
            armGrp.add(diagF);
            // Back diagonal
            const diagB = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), aluminum);
            diagB.position.set(xPos, 0.25, -0.125);
            diagB.rotation.z = Math.PI/4 * (i%2===0?-1:1);
            armGrp.add(diagB);
            // Bottom cross brace
            const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), aluminum);
            cross.position.set(xPos, 0, 0);
            cross.rotation.x = Math.PI/2;
            armGrp.add(cross);
        }

        // Main Chemical line routed through the truss
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length, 16), plastic);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set((isLeft?1:-1)*length/2, -0.15, 0);
        armGrp.add(pipe);
        
        // Hydraulic lines for folding
        const hydroLine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, length, 8), rubber);
        hydroLine.rotation.z = Math.PI / 2;
        hydroLine.position.set((isLeft?1:-1)*length/2, 0.4, 0.1);
        armGrp.add(hydroLine);

        // Nozzles
        const nozGrp = new THREE.Group();
        addNozzles(nozGrp, length - 0.5, nozzleCount);
        nozGrp.position.set((isLeft?1:-1)*length/2, 0.5, 0); // local offset
        armGrp.add(nozGrp);

        return armGrp;
    };

    // Constructing folding left boom
    const leftPrimary = new THREE.Group();
    const lpArm = createTrussArm(9, 18, true);
    leftPrimary.add(lpArm);
    
    // Massive hinge motor / pivot
    const hinge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32), darkSteel);
    hinge1.rotation.x = Math.PI/2;
    leftPrimary.add(hinge1);

    leftPrimary.position.set(1.7, 0, 0);
    meshes.leftPrimary = leftPrimary;
    centerRack.add(leftPrimary);
    parts.push({ name: "Left Primary Boom", description: "Massive aluminum truss section for extensive swath coverage.", material: "Aluminum / Steel", function: "Wide Area Spraying", assemblyOrder: 15, connections: ["Center Boom Rack", "Left Breakaway Boom"], failureEffect: "Left side missed coverage", cascadeFailures: ["Yield loss"], originalPosition: {x:6.2, y:2.5, z:-5.2}, explodedPosition: {x:14.0, y:2.5, z:-5.2} });

    const leftBreakaway = new THREE.Group();
    const lbArm = createTrussArm(7, 14, true);
    leftBreakaway.add(lbArm);
    
    const hinge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 32), darkSteel);
    hinge2.rotation.x = Math.PI/2;
    leftBreakaway.add(hinge2);

    leftBreakaway.position.set(9, 0, 0);
    meshes.leftBreakaway = leftBreakaway;
    leftPrimary.add(leftBreakaway);
    parts.push({ name: "Left Breakaway Boom", description: "Outer tip section with spring-loaded collision breakaway.", material: "Aluminum", function: "Edge Coverage / Safety", assemblyOrder: 16, connections: ["Left Primary Boom"], failureEffect: "Tip strike damage", cascadeFailures: [], originalPosition: {x:15.2, y:2.5, z:-5.2}, explodedPosition: {x:26.0, y:2.5, z:-5.2} });

    // Constructing folding right boom
    const rightPrimary = new THREE.Group();
    const rpArm = createTrussArm(9, 18, false);
    rightPrimary.add(rpArm);
    
    const hinge3 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32), darkSteel);
    hinge3.rotation.x = Math.PI/2;
    rightPrimary.add(hinge3);

    rightPrimary.position.set(-1.7, 0, 0);
    meshes.rightPrimary = rightPrimary;
    centerRack.add(rightPrimary);
    parts.push({ name: "Right Primary Boom", description: "Massive aluminum truss section for extensive swath coverage.", material: "Aluminum / Steel", function: "Wide Area Spraying", assemblyOrder: 17, connections: ["Center Boom Rack", "Right Breakaway Boom"], failureEffect: "Right side missed coverage", cascadeFailures: ["Yield loss"], originalPosition: {x:-6.2, y:2.5, z:-5.2}, explodedPosition: {x:-14.0, y:2.5, z:-5.2} });

    const rightBreakaway = new THREE.Group();
    const rbArm = createTrussArm(7, 14, false);
    rightBreakaway.add(rbArm);
    
    const hinge4 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 32), darkSteel);
    hinge4.rotation.x = Math.PI/2;
    rightBreakaway.add(hinge4);

    rightBreakaway.position.set(-9, 0, 0);
    meshes.rightBreakaway = rightBreakaway;
    rightPrimary.add(rightBreakaway);
    parts.push({ name: "Right Breakaway Boom", description: "Outer tip section with spring-loaded collision breakaway.", material: "Aluminum", function: "Edge Coverage / Safety", assemblyOrder: 18, connections: ["Right Primary Boom"], failureEffect: "Tip strike damage", cascadeFailures: [], originalPosition: {x:-15.2, y:2.5, z:-5.2}, explodedPosition: {x:-26.0, y:2.5, z:-5.2} });

    // ==========================================
    // 10. PLUMBING, PUMPS & EXHAUST DETAILS
    // ==========================================
    const pumpGrp = new THREE.Group();
    // Huge centrifugal pump casting
    const pBodyGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const pBody = new THREE.Mesh(pBodyGeo, steel);
    pumpGrp.add(pBody);
    
    // Inlet/Outlet flanges
    const pFlange1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.4, 32), darkSteel);
    pFlange1.position.set(0, 0.45, 0); pFlange1.rotation.x = Math.PI/2; pumpGrp.add(pFlange1);
    const pFlange2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 32), darkSteel);
    pFlange2.position.set(0.45, 0, 0); pFlange2.rotation.z = Math.PI/2; pumpGrp.add(pFlange2);

    // Intricate pipe routing to boom mast (using thick rubber tube)
    const routeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.45, 0, 0),
        new THREE.Vector3(1.4, 0, 0),
        new THREE.Vector3(1.4, -0.6, -2.0),
        new THREE.Vector3(0, -0.6, -3.2)
    ]);
    const routeHose = new THREE.Mesh(new THREE.TubeGeometry(routeCurve, 64, 0.12, 16, false), rubber);
    pumpGrp.add(routeHose);

    pumpGrp.position.set(0, 2.0, -2.5);
    group.add(pumpGrp);
    parts.push({ name: "High-Output Centrifugal Solution Pump", description: "Stainless steel wet-seal pump maintaining perfect droplet pressure.", material: "Stainless Steel", function: "Fluid Pressurization", assemblyOrder: 19, connections: ["Main Liquid Tank", "Center Boom Rack"], failureEffect: "Loss of spray pressure", cascadeFailures: ["Droplet size alteration"], originalPosition: {x:0, y:2.0, z:-2.5}, explodedPosition: {x:4.0, y:0, z:-2.5} });

    // Exhaust Stack
    const exhaustGrp = new THREE.Group();
    const exhCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.7, 0, 0),
        new THREE.Vector3(0.9, 1.2, 0),
        new THREE.Vector3(0.9, 3.8, 0)
    ]);
    const exhGeo = new THREE.TubeGeometry(exhCurve, 64, 0.14, 32, false);
    const exhaust = new THREE.Mesh(exhGeo, chrome);
    exhaustGrp.add(exhaust);
    
    // Rain flap that rattles during engine operation
    const flapGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.02, 32);
    const flap = new THREE.Mesh(flapGeo, darkSteel);
    flap.position.set(0.9, 3.85, 0);
    meshes.flap = flap;
    exhaustGrp.add(flap);
    
    // Massive DPF / SCR filter box for emissions
    const dpf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.6), steel);
    dpf.position.set(0.7, 0.6, 0);
    exhaustGrp.add(dpf);

    exhaustGrp.position.set(0.4, 3.0, 1.0);
    group.add(exhaustGrp);
    parts.push({ name: "Tier 4 Final Exhaust System", description: "Includes Diesel Particulate Filter and SCR for low emissions.", material: "Stainless / Chrome", function: "Emission Control", assemblyOrder: 20, connections: ["9.0L Turbo-Diesel Powerplant"], failureEffect: "Engine derate", cascadeFailures: ["Engine"], originalPosition: {x:0.4, y:3.0, z:1.0}, explodedPosition: {x:5.0, y:6.0, z:1.0} });

    // Chemical Eductor / Hopper
    const eductorGrp = new THREE.Group();
    const hopGeo = new THREE.CylinderGeometry(0.45, 0.1, 0.7, 32);
    const hopper = new THREE.Mesh(hopGeo, plastic);
    hopper.position.y = 0.35;
    eductorGrp.add(hopper);
    
    const valve = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), darkSteel);
    valve.position.y = -0.1;
    eductorGrp.add(valve);
    
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 16), neonRed);
    handle.position.set(0.18, -0.1, 0);
    handle.rotation.z = Math.PI/2;
    eductorGrp.add(handle);

    eductorGrp.position.set(-1.4, 1.8, -1.0);
    group.add(eductorGrp);
    parts.push({ name: "Chemical Eductor Hopper", description: "Stainless steel drop-down hopper for safely mixing raw chemicals from ground level.", material: "Polymer / Steel", function: "Chemical Mixing", assemblyOrder: 21, connections: ["Main Liquid Tank", "High-Output Centrifugal Solution Pump"], failureEffect: "Inability to mix product", cascadeFailures: [], originalPosition: {x:-1.4, y:1.8, z:-1.0}, explodedPosition: {x:-5.0, y:1.0, z:-1.0} });

    // Sensor Dome
    const domeGrp = new THREE.Group();
    const dBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 32), darkSteel);
    domeGrp.add(dBase);
    const dTop = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32, 0, Math.PI*2, 0, Math.PI/2), plastic);
    dTop.position.y = 0.05;
    domeGrp.add(dTop);
    const dRing = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.03, 16, 64), neonBlue);
    dRing.rotation.x = Math.PI/2;
    domeGrp.add(dRing);
    
    domeGrp.position.set(0, 6.1, 4.0); // Highest point on cab
    group.add(domeGrp);
    parts.push({ name: "StarFire RTK Receiver", description: "Sub-inch accurate GPS dome for auto-guidance and individual nozzle control mapping.", material: "Polymer", function: "Precision Navigation", assemblyOrder: 22, connections: ["Command Center Cabin"], failureEffect: "Loss of auto-steer", cascadeFailures: ["Overlapping spray passes"], originalPosition: {x:0, y:6.1, z:4.0}, explodedPosition: {x:0, y:13.0, z:4.0} });


    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshesObj) => {
        // Continuous locomotion (Wheels)
        const wheelRot = time * speed * 1.8;
        meshesObj.wheelFL.rotation.x = wheelRot;
        meshesObj.wheelFR.rotation.x = wheelRot;
        meshesObj.wheelRL.rotation.x = wheelRot;
        meshesObj.wheelRR.rotation.x = wheelRot;
        
        // High-RPM Cooling Fan
        meshesObj.fan.rotation.z = time * speed * 20;
        
        // Exhaust flap bouncing erratically to simulate exhaust pressure
        meshesObj.flap.rotation.x = (Math.sin(time * 40 * speed) > 0) ? -Math.PI/8 : 0;

        // Rotating Safety Beacon
        meshesObj.beacon.rotation.y = time * 12;
        
        // Tie rod oscillation (simulate minor steering adjustments over rough terrain)
        if(meshesObj.tieRod) {
            meshesObj.tieRod.position.x = Math.sin(time * 2 * speed) * 0.1;
        }

        // Boom Unfolding / Suspension Animation
        // Map sine wave from 0 to 1 for smooth folding transition
        const foldState = (Math.sin(time * 0.4) + 1) / 2; 
        
        // When foldState = 1: Booms extended horizontally for spraying
        // When foldState = 0: Booms folded forward for transport
        
        // Left Primary folds forward (rotation Y negative)
        meshesObj.leftPrimary.rotation.y = (1 - foldState) * (-Math.PI / 2.1);
        // Left Breakaway folds further in
        meshesObj.leftBreakaway.rotation.y = (1 - foldState) * (-Math.PI / 1.1);

        // Right Primary folds forward (rotation Y positive)
        meshesObj.rightPrimary.rotation.y = (1 - foldState) * (Math.PI / 2.1);
        // Right Breakaway folds further in
        meshesObj.rightBreakaway.rotation.y = (1 - foldState) * (Math.PI / 1.1);

        // Active Boom Suspension (Mast bounces slightly to absorb field terrain)
        meshesObj.boomCarriage.position.y = 2.5 + Math.sin(time * 6 * speed) * 0.15;

        // Spray Cone pulsating opacity
        if (meshesObj.sprayCones) {
            meshesObj.sprayCones.forEach((cone, idx) => {
                // If folded, turn off spray. If extended, turn on.
                if(foldState > 0.9) {
                    cone.material.opacity = 0.15 + Math.sin(time * 30 + idx) * 0.05;
                    cone.visible = true;
                } else {
                    cone.visible = false;
                }
            });
        }
    };

    const quizQuestions = [
        {
            question: "What is the primary function of the Drop Axle suspension on a modern crop sprayer?",
            options: [
                "To lower the center of gravity for high-speed road travel",
                "To provide extreme ground clearance to straddle mature crops without damage",
                "To automatically align the tires with GPS coordinates",
                "To reduce the overall weight of the chassis"
            ],
            correct: 1,
            explanation: "Drop axles mount the wheels far below the main chassis rails. This provides the 50+ inches of ground clearance required to spray mature crops like corn without knocking down the plants."
        },
        {
            question: "Why are the tires on this machine designed to be extremely tall and thin?",
            options: [
                "To fit precisely between crop rows and minimize soil compaction",
                "To hold excess chemical fluid inside the tires",
                "To make the sprayer easier to transport on flatbed trailers",
                "To increase aerodynamic efficiency"
            ],
            correct: 0,
            explanation: "Tall, thin pneumatic tires (like a 380/90R46) create a long but very narrow footprint. This ensures the tires drive purely in the dirt between crop rows, minimizing plant damage and soil compaction."
        },
        {
            question: "What is the purpose of the 'Breakaway Boom' sections on the outer tips?",
            options: [
                "To spray fertilizers directly upwards into trees",
                "To allow the booms to safely deflect backward if they strike the ground or an obstacle",
                "To disconnect entirely and be left in the field",
                "To fold vertically into an umbrella shape"
            ],
            correct: 1,
            explanation: "With spray widths exceeding 120 feet, outer booms can easily hit the ground on uneven terrain, or strike a fence post. Breakaway hinges use springs to bend backwards upon impact, preventing catastrophic structural damage."
        },
        {
            question: "How does the RTK GPS Receiver (Dome) improve spraying efficiency?",
            options: [
                "It plays satellite radio for the operator",
                "It enables sub-inch auto-steering and automatic section control to prevent chemical overlap",
                "It uses lasers to vaporize weeds",
                "It detects incoming rain clouds"
            ],
            correct: 1,
            explanation: "RTK (Real-Time Kinematic) GPS provides incredible accuracy. It drives the auto-steer to ensure perfectly parallel passes. It also controls individual spray nozzles, shutting them off instantly if crossing an area already sprayed, saving money and the environment."
        },
        {
            question: "What role does the Parallelogram Boom Mast play?",
            options: [
                "It acts as a ladder for the operator",
                "It pumps chemicals into the tank",
                "It allows the massive boom rack to be hydraulically raised and lowered while remaining perfectly level",
                "It is the main exhaust pipe for the engine"
            ],
            correct: 2,
            explanation: "The parallelogram mast attaches the boom to the rear of the chassis. It can hydraulically raise or lower the entire 120-foot boom to maintain the optimal height above different crops, while keeping the boom perfectly level with the ground."
        }
    ];

    return { 
        group, 
        parts, 
        description: "Ultra-Modern Self-Propelled Agricultural Crop Sprayer featuring 50+ inch ground clearance, 120-ft articulating aluminum booms, and RTK precision guidance systems.", 
        quizQuestions, 
        animate,
        meshes 
    };
}
