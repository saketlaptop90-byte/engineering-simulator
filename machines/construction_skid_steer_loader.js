import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for geometry
    function createTire() {
        const tireGroup = new THREE.Group();
        
        // Main tire body
        const tireGeo = new THREE.TorusGeometry(0.8, 0.4, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tire);
        
        // Treads
        const treadCount = 60;
        const treadGeo = new THREE.BoxGeometry(0.9, 0.1, 0.2);
        for (let i = 0; i < treadCount; i++) {
            const tread = new THREE.Mesh(treadGeo, rubber);
            const angle = (i / treadCount) * Math.PI * 2;
            tread.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
            tread.rotation.z = angle;
            tireGroup.add(tread);
        }
        
        // Rim
        const rimGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 32);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, chrome);
        tireGroup.add(rim);
        
        // Spokes / Hub details
        const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        tireGroup.add(hub);
        
        const spokeCount = 8;
        const spokeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
        for (let i = 0; i < spokeCount; i++) {
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = (i / spokeCount) * Math.PI;
            tireGroup.add(spoke);
        }
        
        // Lug nuts
        for(let i = 0; i < 5; i++) {
            const lugGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 6);
            lugGeo.rotateX(Math.PI / 2);
            const lug = new THREE.Mesh(lugGeo, steel);
            const angle = (i / 5) * Math.PI * 2;
            lug.position.set(Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0);
            tireGroup.add(lug);
        }
        
        return tireGroup;
    }

    // --- Geometries & Meshes ---
    
    // 1. Chassis
    const chassisGroup = new THREE.Group();
    
    // Core body (Extrude geometry for realistic profile)
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-2, 0.5);
    chassisShape.lineTo(2, 0.5);
    chassisShape.lineTo(2.5, 1.5);
    chassisShape.lineTo(1.8, 2.8);
    chassisShape.lineTo(-1.5, 2.8);
    chassisShape.lineTo(-2.2, 1.5);
    chassisShape.lineTo(-2, 0.5);
    
    const chassisExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    chassisGeo.translate(0, 0, -1);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisGroup.add(chassisMesh);
    
    // Underbelly armor
    const armorGeo = new THREE.BoxGeometry(4.5, 0.2, 1.8);
    const armorMesh = new THREE.Mesh(armorGeo, steel);
    armorMesh.position.set(0, 0.4, 0);
    chassisGroup.add(armorMesh);

    // Hydraulic Hoses
    class CustomHoseCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 1.5;
            const ty = Math.sin(t * Math.PI) * 0.5;
            const tz = 0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    
    const hosePath = new CustomHoseCurve(1);
    const hoseGeo = new THREE.TubeGeometry(hosePath, 20, 0.04, 8, false);
    const hose1 = new THREE.Mesh(hoseGeo, rubber);
    hose1.position.set(-0.2, 1.5, 1.0);
    hose1.rotation.y = Math.PI / 4;
    chassisGroup.add(hose1);

    const hose2 = new THREE.Mesh(hoseGeo, rubber);
    hose2.position.set(-0.2, 1.5, -1.0);
    hose2.rotation.y = -Math.PI / 4;
    chassisGroup.add(hose2);

    group.add(chassisGroup);
    meshes.chassis = chassisGroup;

    // 2. Engine Compartment
    const engineGroup = new THREE.Group();
    const engineBlockGeo = new THREE.BoxGeometry(1.8, 1.5, 1.6);
    const engineBlock = new THREE.Mesh(engineBlockGeo, darkSteel);
    engineBlock.position.set(-1.2, 1.5, 0);
    engineGroup.add(engineBlock);

    // Engine details (Pistons, vents, wires)
    for(let i=0; i<4; i++) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.6, 16), aluminum);
        cyl.rotation.x = Math.PI / 2;
        cyl.position.set(-1.5 + (i * 0.3), 1.8, 0);
        engineGroup.add(cyl);
    }
    
    const radiatorGeo = new THREE.BoxGeometry(0.2, 1.2, 1.4);
    const radiator = new THREE.Mesh(radiatorGeo, copper);
    radiator.position.set(-2.1, 1.5, 0);
    engineGroup.add(radiator);

    group.add(engineGroup);
    meshes.engine = engineGroup;

    // 3. Cabin Shell
    const cabinGroup = new THREE.Group();
    const cabinBaseGeo = new THREE.BoxGeometry(2, 0.2, 1.6);
    const cabinBase = new THREE.Mesh(cabinBaseGeo, steel);
    cabinBase.position.set(0.5, 1.8, 0);
    cabinGroup.add(cabinBase);

    // Seat
    const seatBaseGeo = new THREE.BoxGeometry(0.6, 0.3, 0.6);
    const seatBase = new THREE.Mesh(seatBaseGeo, rubber);
    seatBase.position.set(0.2, 2.0, 0);
    cabinGroup.add(seatBase);
    
    const seatBackGeo = new THREE.BoxGeometry(0.2, 0.8, 0.6);
    const seatBack = new THREE.Mesh(seatBackGeo, rubber);
    seatBack.position.set(-0.1, 2.5, 0);
    seatBack.rotation.z = -0.1;
    cabinGroup.add(seatBack);
    
    group.add(cabinGroup);
    meshes.cabin = cabinGroup;

    // 4. ROPS Cage & Glass
    const ropsGroup = new THREE.Group();
    const tubeMat = steel;
    
    // Front posts
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    p1.position.set(1.4, 2.8, 0.75);
    p1.rotation.z = -0.1;
    ropsGroup.add(p1);
    
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    p2.position.set(1.4, 2.8, -0.75);
    p2.rotation.z = -0.1;
    ropsGroup.add(p2);
    
    // Rear posts
    const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    p3.position.set(-0.4, 2.8, 0.75);
    ropsGroup.add(p3);
    
    const p4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    p4.position.set(-0.4, 2.8, -0.75);
    ropsGroup.add(p4);
    
    // Roof beams
    const roof1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    roof1.position.set(0.5, 3.65, 0.75);
    roof1.rotation.z = Math.PI / 2;
    ropsGroup.add(roof1);
    
    const roof2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), tubeMat);
    roof2.position.set(0.5, 3.65, -0.75);
    roof2.rotation.z = Math.PI / 2;
    ropsGroup.add(roof2);

    // Cross beams
    const cb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), tubeMat);
    cb1.position.set(1.3, 3.65, 0);
    cb1.rotation.x = Math.PI / 2;
    ropsGroup.add(cb1);
    
    const cb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), tubeMat);
    cb2.position.set(-0.4, 3.65, 0);
    cb2.rotation.x = Math.PI / 2;
    ropsGroup.add(cb2);
    
    // Glass panes
    const glassGeo = new THREE.BoxGeometry(1.6, 1.5, 0.02);
    const sideGlassL = new THREE.Mesh(glassGeo, tinted);
    sideGlassL.position.set(0.5, 2.8, 0.8);
    ropsGroup.add(sideGlassL);
    
    const sideGlassR = new THREE.Mesh(glassGeo, tinted);
    sideGlassR.position.set(0.5, 2.8, -0.8);
    ropsGroup.add(sideGlassR);
    
    const frontGlassGeo = new THREE.BoxGeometry(0.02, 1.5, 1.4);
    const frontGlass = new THREE.Mesh(frontGlassGeo, tinted);
    frontGlass.position.set(1.35, 2.8, 0);
    frontGlass.rotation.z = -0.1;
    ropsGroup.add(frontGlass);
    
    group.add(ropsGroup);
    meshes.rops = ropsGroup;

    // 5-8. Wheels
    const tireFL = createTire();
    tireFL.position.set(1.4, 0.8, 1.25);
    group.add(tireFL);
    meshes.tireFL = tireFL;

    const tireFR = createTire();
    tireFR.position.set(1.4, 0.8, -1.25);
    group.add(tireFR);
    meshes.tireFR = tireFR;

    const tireRL = createTire();
    tireRL.position.set(-1.4, 0.8, 1.25);
    group.add(tireRL);
    meshes.tireRL = tireRL;

    const tireRR = createTire();
    tireRR.position.set(-1.4, 0.8, -1.25);
    group.add(tireRR);
    meshes.tireRR = tireRR;
    
    // Axles
    const frontAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.8, 16), steel);
    frontAxle.rotation.x = Math.PI/2;
    frontAxle.position.set(1.4, 0.8, 0);
    group.add(frontAxle);
    
    const rearAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.8, 16), steel);
    rearAxle.rotation.x = Math.PI/2;
    rearAxle.position.set(-1.4, 0.8, 0);
    group.add(rearAxle);

    // 9-10. Boom Arms
    const boomL = new THREE.Group();
    const boomR = new THREE.Group();
    
    const boomShape = new THREE.Shape();
    boomShape.moveTo(0, -0.3);
    boomShape.lineTo(2.5, -0.3);
    boomShape.lineTo(3.8, -2.5);
    boomShape.lineTo(3.4, -2.5);
    boomShape.lineTo(2.2, -0.1);
    boomShape.lineTo(0, -0.1);
    boomShape.lineTo(0, -0.3);
    
    const boomExtrude = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const boomGeoL = new THREE.ExtrudeGeometry(boomShape, boomExtrude);
    const boomMeshL = new THREE.Mesh(boomGeoL, steel);
    boomMeshL.position.set(0, 0, -0.1); // center depth
    boomL.add(boomMeshL);
    
    // Add joints and hydraulic mounts to boom
    const jointGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
    jointGeo.rotateX(Math.PI/2);
    const joint1 = new THREE.Mesh(jointGeo, darkSteel);
    boomL.add(joint1); // Pivot point
    const joint2 = new THREE.Mesh(jointGeo, darkSteel);
    joint2.position.set(3.6, -2.5, 0); // Bucket attachment point
    boomL.add(joint2);
    
    const boomGeoR = new THREE.ExtrudeGeometry(boomShape, boomExtrude);
    const boomMeshR = new THREE.Mesh(boomGeoR, steel);
    boomMeshR.position.set(0, 0, -0.1);
    boomR.add(boomMeshR);
    const joint3 = new THREE.Mesh(jointGeo, darkSteel);
    boomR.add(joint3);
    const joint4 = new THREE.Mesh(jointGeo, darkSteel);
    joint4.position.set(3.6, -2.5, 0);
    boomR.add(joint4);
    
    // Position booms
    // Pivot at rear top
    const pivotX = -0.5;
    const pivotY = 2.6;
    boomL.position.set(pivotX, pivotY, 1.2);
    boomR.position.set(pivotX, pivotY, -1.2);
    
    group.add(boomL);
    group.add(boomR);
    meshes.boomL = boomL;
    meshes.boomR = boomR;

    // Cross-member connecting booms
    const crossMemberGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16);
    crossMemberGeo.rotateX(Math.PI/2);
    const crossMember = new THREE.Mesh(crossMemberGeo, steel);
    crossMember.position.set(2.0, -0.2, 0);
    boomL.add(crossMember); // Add to one boom so it moves with it

    // 11. Main Lift Hydraulics
    // Left
    const hydL = new THREE.Group();
    const cylOuterGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    cylOuterGeo.translate(0, 0.75, 0); // pivot at base
    const cylOuterL = new THREE.Mesh(cylOuterGeo, darkSteel);
    hydL.add(cylOuterL);
    
    const cylInnerGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
    cylInnerGeo.translate(0, 0.9, 0);
    const cylInnerL = new THREE.Mesh(cylInnerGeo, chrome);
    hydL.add(cylInnerL);
    meshes.hydInnerL = cylInnerL;
    
    hydL.position.set(-0.2, 1.0, 1.1);
    group.add(hydL);
    meshes.hydL = hydL;

    // Right
    const hydR = new THREE.Group();
    const cylOuterR = new THREE.Mesh(cylOuterGeo, darkSteel);
    hydR.add(cylOuterR);
    const cylInnerR = new THREE.Mesh(cylInnerGeo, chrome);
    hydR.add(cylInnerR);
    meshes.hydInnerR = cylInnerR;
    
    hydR.position.set(-0.2, 1.0, -1.1);
    group.add(hydR);
    meshes.hydR = hydR;

    // 12. Bucket Tilt Hydraulics
    const tiltHyd = new THREE.Group();
    const tiltOuter = new THREE.Mesh(cylOuterGeo, darkSteel);
    tiltOuter.scale.set(0.8, 0.6, 0.8);
    tiltHyd.add(tiltOuter);
    
    const tiltInner = new THREE.Mesh(cylInnerGeo, chrome);
    tiltInner.scale.set(0.8, 0.8, 0.8);
    tiltHyd.add(tiltInner);
    meshes.tiltInner = tiltInner;
    
    // We attach tilt hyd to the crossmember of the boom so it moves with the boom
    tiltHyd.position.set(2.0, 0, 0);
    boomL.add(tiltHyd);
    meshes.tiltHyd = tiltHyd;

    // 13. Front Bucket
    const bucketGroup = new THREE.Group();
    
    const bucketShape = new THREE.Shape();
    bucketShape.moveTo(0, 0);
    bucketShape.lineTo(0.8, 0);
    bucketShape.lineTo(1.2, -0.6);
    bucketShape.lineTo(1.5, -0.6);
    bucketShape.lineTo(0.5, -1.2);
    bucketShape.lineTo(-0.2, -1.2);
    bucketShape.lineTo(-0.5, -0.5);
    bucketShape.lineTo(0, 0);
    
    // We want a hollow bucket, so we use multiple plates
    // Back plate
    const backGeo = new THREE.BoxGeometry(0.1, 1.2, 2.6);
    const backMesh = new THREE.Mesh(backGeo, steel);
    backMesh.rotation.z = -0.3;
    bucketGroup.add(backMesh);
    
    // Bottom plate
    const bottomGeo = new THREE.BoxGeometry(1.4, 0.1, 2.6);
    const bottomMesh = new THREE.Mesh(bottomGeo, steel);
    bottomMesh.position.set(0.7, -0.6, 0);
    bucketGroup.add(bottomMesh);
    
    // Side plates
    const sideShape = new THREE.Shape();
    sideShape.moveTo(0, 0.6);
    sideShape.lineTo(1.4, -0.6);
    sideShape.lineTo(-0.1, -0.6);
    sideShape.lineTo(0, 0.6);
    
    const sideExtrude = { depth: 0.1, bevelEnabled: false };
    const sideGeo = new THREE.ExtrudeGeometry(sideShape, sideExtrude);
    
    const sideL = new THREE.Mesh(sideGeo, steel);
    sideL.position.set(0, 0, 1.25);
    bucketGroup.add(sideL);
    
    const sideR = new THREE.Mesh(sideGeo, steel);
    sideR.position.set(0, 0, -1.35);
    bucketGroup.add(sideR);
    
    // Teeth
    for(let i=0; i<8; i++) {
        const toothGeo = new THREE.ConeGeometry(0.08, 0.3, 4);
        toothGeo.rotateZ(-Math.PI/2);
        const tooth = new THREE.Mesh(toothGeo, darkSteel);
        tooth.position.set(1.5, -0.6, -1.1 + i * 0.31);
        bucketGroup.add(tooth);
    }
    
    // Bucket is attached to the boom ends
    // boom tip is at 3.6, -2.5 relative to pivot (-0.5, 2.6) -> Absolute: (3.1, 0.1)
    bucketGroup.position.set(3.6, -2.5, 0); 
    boomL.add(bucketGroup); // Nest it inside the boom so it follows translation/rotation automatically
    meshes.bucket = bucketGroup;
    
    // 14. Control Joysticks
    const joystickGroup = new THREE.Group();
    
    const stickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
    stickGeo.translate(0, 0.3, 0);
    
    const stickL = new THREE.Mesh(stickGeo, darkSteel);
    stickL.position.set(0.8, 1.9, 0.4);
    stickL.rotation.z = -0.2;
    joystickGroup.add(stickL);
    
    const knobGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const knobL = new THREE.Mesh(knobGeo, plastic);
    knobL.position.set(0.8 + 0.6 * Math.sin(0.2), 1.9 + 0.6 * Math.cos(0.2), 0.4);
    joystickGroup.add(knobL);
    
    const stickR = new THREE.Mesh(stickGeo, darkSteel);
    stickR.position.set(0.8, 1.9, -0.4);
    stickR.rotation.z = -0.2;
    joystickGroup.add(stickR);
    
    const knobR = new THREE.Mesh(knobGeo, plastic);
    knobR.position.set(0.8 + 0.6 * Math.sin(0.2), 1.9 + 0.6 * Math.cos(0.2), -0.4);
    joystickGroup.add(knobR);
    
    // Control panel screens
    const screenGeo = new THREE.BoxGeometry(0.02, 0.3, 0.4);
    const screen = new THREE.Mesh(screenGeo, plastic);
    screen.position.set(1.2, 2.2, 0.5);
    screen.rotation.z = -0.4;
    screen.rotation.y = -0.4;
    
    // Add glowing screen material
    const screenGlow = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5});
    const displayGeo = new THREE.PlaneGeometry(0.25, 0.35);
    const display = new THREE.Mesh(displayGeo, screenGlow);
    display.position.set(1.19, 2.2, 0.5);
    display.rotation.z = -0.4;
    display.rotation.y = Math.PI / 2 - 0.4;
    joystickGroup.add(screen);
    joystickGroup.add(display);
    
    group.add(joystickGroup);
    meshes.joysticks = joystickGroup;

    // 15. Exhaust Stack
    const exhaustGroup = new THREE.Group();
    
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
    const pipe = new THREE.Mesh(pipeGeo, darkSteel);
    pipe.position.set(-1.8, 2.8, -0.6);
    exhaustGroup.add(pipe);
    
    const pipeTopGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
    const pipeTop = new THREE.Mesh(pipeTopGeo, darkSteel);
    pipeTop.position.set(-1.8, 3.4, -0.6);
    pipeTop.rotation.x = 0.4;
    exhaustGroup.add(pipeTop);
    
    // Muffler bulge
    const mufflerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const muffler = new THREE.Mesh(mufflerGeo, darkSteel);
    muffler.position.set(-1.8, 2.7, -0.6);
    exhaustGroup.add(muffler);
    
    const flapGeo = new THREE.CircleGeometry(0.1, 16);
    const flap = new THREE.Mesh(flapGeo, darkSteel);
    flap.position.set(-1.8, 3.58, -0.6 + 0.08);
    flap.rotation.x = -Math.PI / 2 + 0.4;
    exhaustGroup.add(flap);
    meshes.exhaustFlap = flap;
    
    group.add(exhaustGroup);
    meshes.exhaust = exhaustGroup;

    // 16. Rear Grille & Lighting
    const grilleGroup = new THREE.Group();
    const grilleFrameGeo = new THREE.BoxGeometry(0.2, 1.6, 1.4);
    const grilleFrame = new THREE.Mesh(grilleFrameGeo, steel);
    grilleFrame.position.set(-2.1, 1.4, 0);
    grilleGroup.add(grilleFrame);
    
    for(let i=0; i<10; i++) {
        const slatGeo = new THREE.BoxGeometry(0.25, 0.05, 1.2);
        const slat = new THREE.Mesh(slatGeo, darkSteel);
        slat.position.set(-2.1, 0.8 + i * 0.13, 0);
        slat.rotation.z = -0.3;
        grilleGroup.add(slat);
    }
    
    // Rear Lights
    const lightMat = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8});
    const lightGeo = new THREE.BoxGeometry(0.1, 0.3, 0.15);
    const lightL = new THREE.Mesh(lightGeo, lightMat);
    lightL.position.set(-2.15, 2.0, 0.8);
    grilleGroup.add(lightL);
    
    const lightR = new THREE.Mesh(lightGeo, lightMat);
    lightR.position.set(-2.15, 2.0, -0.8);
    grilleGroup.add(lightR);
    
    // Headlights (Front ROPS)
    const hlMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0});
    const hlGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
    hlGeo.rotateZ(Math.PI/2);
    
    const hlL = new THREE.Mesh(hlGeo, hlMat);
    hlL.position.set(1.4, 3.6, 0.6);
    ropsGroup.add(hlL);
    
    const hlR = new THREE.Mesh(hlGeo, hlMat);
    hlR.position.set(1.4, 3.6, -0.6);
    ropsGroup.add(hlR);
    
    group.add(grilleGroup);
    meshes.grille = grilleGroup;

    // Populate Parts Array
    parts.push(
        {
            name: "Chassis",
            description: "Main lower structural frame carrying the axles and drivetrain.",
            material: "Dark Steel & Steel",
            function: "Provides robust foundation and low center of gravity.",
            assemblyOrder: 1,
            connections: ["Wheels", "Engine Compartment", "Cabin Shell"],
            failureEffect: "Structural failure leading to total machine collapse.",
            cascadeFailures: ["Boom Arms", "Drivetrain"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: -2, z: 0}
        },
        {
            name: "Engine Compartment",
            description: "Rear-mounted diesel engine, radiator, and hydraulic pumps.",
            material: "Dark Steel, Aluminum, Copper",
            function: "Provides mechanical power for wheels and hydraulic pressure for booms.",
            assemblyOrder: 2,
            connections: ["Chassis", "Exhaust Stack", "Rear Grille"],
            failureEffect: "Loss of motive and hydraulic power.",
            cascadeFailures: ["Hydraulics", "Cooling System"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -3, y: 0, z: 0}
        },
        {
            name: "Cabin Shell & Seat",
            description: "Operator's enclosure and seating area.",
            material: "Steel, Rubber",
            function: "Houses operator controls and provides basic weather protection.",
            assemblyOrder: 3,
            connections: ["Chassis", "ROPS Cage", "Joysticks"],
            failureEffect: "Operator discomfort and lack of control interface.",
            cascadeFailures: ["Controls"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 2, z: 0}
        },
        {
            name: "ROPS Cage & Glass",
            description: "Roll-Over Protective Structure with tinted safety glass.",
            material: "Steel, Tinted Glass",
            function: "Protects operator from rollovers and falling debris.",
            assemblyOrder: 4,
            connections: ["Cabin Shell"],
            failureEffect: "Severe safety risk to operator during accidents.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 5, z: 0}
        },
        {
            name: "Front Left Wheel",
            description: "Pneumatic tire with aggressive tread on steel rim.",
            material: "Rubber, Chrome, Steel",
            function: "Provides traction, steering (via skid), and mobility.",
            assemblyOrder: 5,
            connections: ["Chassis"],
            failureEffect: "Loss of mobility and steering control.",
            cascadeFailures: ["Drivetrain"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 2, y: 0, z: 4}
        },
        {
            name: "Front Right Wheel",
            description: "Pneumatic tire with aggressive tread on steel rim.",
            material: "Rubber, Chrome, Steel",
            function: "Provides traction, steering (via skid), and mobility.",
            assemblyOrder: 6,
            connections: ["Chassis"],
            failureEffect: "Loss of mobility and steering control.",
            cascadeFailures: ["Drivetrain"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 2, y: 0, z: -4}
        },
        {
            name: "Rear Left Wheel",
            description: "Pneumatic tire with aggressive tread on steel rim.",
            material: "Rubber, Chrome, Steel",
            function: "Provides traction, steering (via skid), and mobility.",
            assemblyOrder: 7,
            connections: ["Chassis"],
            failureEffect: "Loss of mobility and steering control.",
            cascadeFailures: ["Drivetrain"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -2, y: 0, z: 4}
        },
        {
            name: "Rear Right Wheel",
            description: "Pneumatic tire with aggressive tread on steel rim.",
            material: "Rubber, Chrome, Steel",
            function: "Provides traction, steering (via skid), and mobility.",
            assemblyOrder: 8,
            connections: ["Chassis"],
            failureEffect: "Loss of mobility and steering control.",
            cascadeFailures: ["Drivetrain"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -2, y: 0, z: -4}
        },
        {
            name: "Left Boom Arm",
            description: "Heavy steel lifting arm.",
            material: "Steel",
            function: "Supports and lifts the front bucket/attachment.",
            assemblyOrder: 9,
            connections: ["Chassis", "Front Bucket", "Main Lift Hydraulics"],
            failureEffect: "Inability to lift loads, asymmetric stress.",
            cascadeFailures: ["Front Bucket", "Right Boom Arm"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 3, z: 3}
        },
        {
            name: "Right Boom Arm",
            description: "Heavy steel lifting arm.",
            material: "Steel",
            function: "Supports and lifts the front bucket/attachment.",
            assemblyOrder: 10,
            connections: ["Chassis", "Front Bucket", "Main Lift Hydraulics"],
            failureEffect: "Inability to lift loads, asymmetric stress.",
            cascadeFailures: ["Front Bucket", "Left Boom Arm"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 3, z: -3}
        },
        {
            name: "Main Lift Hydraulics",
            description: "Twin heavy-duty hydraulic cylinders.",
            material: "Dark Steel, Chrome",
            function: "Provides massive force to actuate the boom arms.",
            assemblyOrder: 11,
            connections: ["Chassis", "Left Boom Arm", "Right Boom Arm"],
            failureEffect: "Boom arms cannot raise or lower.",
            cascadeFailures: ["Hydraulic Pump"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -1, y: 3, z: 0}
        },
        {
            name: "Bucket Tilt Hydraulics",
            description: "Central hydraulic cylinder for bucket articulation.",
            material: "Dark Steel, Chrome",
            function: "Tilts the bucket to scoop or dump materials.",
            assemblyOrder: 12,
            connections: ["Boom Arms", "Front Bucket"],
            failureEffect: "Inability to dump or scoop.",
            cascadeFailures: ["Bucket Linkage"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 3, y: 3, z: 0}
        },
        {
            name: "Front Bucket",
            description: "Heavy-duty steel bucket with digging teeth.",
            material: "Steel",
            function: "Excavates and transports material.",
            assemblyOrder: 13,
            connections: ["Left Boom Arm", "Right Boom Arm", "Bucket Tilt Hydraulics"],
            failureEffect: "Loss of primary work tool functionality.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 5, y: -1, z: 0}
        },
        {
            name: "Control Joysticks & Displays",
            description: "Dual ergonomic joysticks and digital multi-function displays.",
            material: "Plastic, Glowing Screens",
            function: "Interface for operator to control drive and hydraulics.",
            assemblyOrder: 14,
            connections: ["Cabin Shell"],
            failureEffect: "Loss of machine control.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 1, y: 3, z: 0}
        },
        {
            name: "Exhaust Stack",
            description: "Vertical exhaust pipe with rain flap.",
            material: "Dark Steel",
            function: "Vents diesel engine exhaust gases upward.",
            assemblyOrder: 15,
            connections: ["Engine Compartment"],
            failureEffect: "Engine overheating or choking on exhaust.",
            cascadeFailures: ["Engine"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -3, y: 4, z: -1}
        },
        {
            name: "Rear Grille & Lighting",
            description: "Ventilated steel grille with LED tail lights.",
            material: "Steel, Emissive LEDs",
            function: "Protects radiator while allowing air flow; provides visibility.",
            assemblyOrder: 16,
            connections: ["Engine Compartment"],
            failureEffect: "Radiator damage or overheating.",
            cascadeFailures: ["Engine"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -4, y: 1, z: 0}
        }
    );

    const description = "The Construction Skid Steer Loader is a highly versatile, compact, and powerful machine. Featuring a unique rear-engine layout for counterweight balance, rigid chassis, and dual lifting boom arms. It maneuvers by 'skid steering'—driving the wheels on each side independently. This hyper-realistic model incorporates detailed tire treads, a fully modeled ROPS cabin with tinted glass and digital displays, intricate hydraulic linkages, and articulated components.";

    const quizQuestions = [
        {
            question: "Why is the engine mounted at the very rear of a Skid Steer Loader?",
            options: [
                "To reduce noise in the cabin",
                "To act as a counterweight for heavy loads in the front bucket",
                "To improve fuel efficiency",
                "To allow for a larger radiator"
            ],
            correctAnswer: 1,
            explanation: "The rear-mounted engine provides essential counterweight, balancing the machine when the front bucket is loaded with heavy materials, preventing it from tipping forward."
        },
        {
            question: "How does a Skid Steer Loader turn?",
            options: [
                "Using a front steering axle like a car",
                "Articulated joint in the middle of the chassis",
                "By operating the left and right wheels at different speeds or in opposite directions",
                "Using a rear steering wheel"
            ],
            correctAnswer: 2,
            explanation: "Skid steers lack a steering mechanism. They turn by 'skidding'—driving the wheels on one side faster, slower, or in the opposite direction to the other side."
        },
        {
            question: "What is the primary function of the ROPS cage?",
            options: [
                "Aerodynamics",
                "To provide mounting points for lights",
                "To protect the operator in the event of a rollover or falling objects",
                "To stiffen the chassis for heavy lifting"
            ],
            correctAnswer: 2,
            explanation: "ROPS stands for Roll-Over Protective Structure. It is a heavy-duty steel cage designed to protect the operator from being crushed if the machine tips over or if debris falls onto the cabin."
        },
        {
            question: "Which hydraulic cylinders are responsible for altering the angle of the front bucket?",
            options: [
                "Main Lift Hydraulics",
                "Bucket Tilt Hydraulics",
                "Steering Cylinders",
                "Stabilizer Cylinders"
            ],
            correctAnswer: 1,
            explanation: "The Bucket Tilt Hydraulics control the articulation (curl and dump) of the bucket, while the Main Lift Hydraulics raise and lower the entire boom arm assembly."
        },
        {
            question: "Why do skid steer tires have such aggressive, deep treads?",
            options: [
                "For high-speed travel on highways",
                "To maximize traction in mud, dirt, and loose terrain while enduring the scrubbing forces of skid steering",
                "To reduce ground pressure and protect delicate grass",
                "Purely for aesthetic appeal"
            ],
            correctAnswer: 1,
            explanation: "The aggressive treads bite into loose surfaces for maximum traction. They are also made of tough rubber compounds to withstand the high friction and 'scrubbing' that occurs during skid turning."
        }
    ];

    let animationTime = 0;
    
    // Calculate hydraulic kinematics
    function animate(time, speed, meshes) {
        animationTime += speed * 0.05;
        
        // Wheel rotation (simulate driving forward)
        const wheelRot = animationTime * 2;
        meshes.tireFL.rotation.z = -wheelRot;
        meshes.tireFR.rotation.z = -wheelRot;
        meshes.tireRL.rotation.z = -wheelRot;
        meshes.tireRR.rotation.z = -wheelRot;

        // Boom animation (sine wave)
        // Normal range: 0 to 0.8 radians upwards
        const boomAngle = (Math.sin(animationTime * 0.5) * 0.5 + 0.5) * 0.8;
        meshes.boomL.rotation.z = boomAngle;
        meshes.boomR.rotation.z = boomAngle;
        
        // Hydraulic Lift cylinders sync
        // Base of hyd is at (-0.2, 1.0)
        const bx = -0.5, by = 2.6;
        const ax_local = 1.2, ay_local = -0.2;
        
        const attachX = bx + ax_local * Math.cos(boomAngle) - ay_local * Math.sin(boomAngle);
        const attachY = by + ax_local * Math.sin(boomAngle) + ay_local * Math.cos(boomAngle);
        
        const hx = -0.2, hy = 1.0;
        const dx = attachX - hx;
        const dy = attachY - hy;
        
        const hydAngle = Math.atan2(dy, dx) - Math.PI/2;
        const hydLen = Math.sqrt(dx*dx + dy*dy);
        
        meshes.hydL.rotation.z = hydAngle;
        meshes.hydR.rotation.z = hydAngle;
        
        meshes.hydInnerL.position.y = (hydLen - 1.5) * 0.8 + 0.9;
        meshes.hydInnerR.position.y = (hydLen - 1.5) * 0.8 + 0.9;
        
        // Bucket tilt animation
        const bucketTilt = -boomAngle * 1.2 + 0.5; 
        meshes.bucket.rotation.z = bucketTilt;
        
        const ext = Math.sin(bucketTilt) * 0.5;
        meshes.tiltInner.position.y = 0.9 + ext;

        // Exhaust flap flap
        meshes.exhaustFlap.rotation.x = -Math.PI/2 + 0.2 + Math.abs(Math.sin(animationTime * 8)) * 0.3;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
