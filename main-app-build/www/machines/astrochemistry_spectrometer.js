import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Emissive Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2, roughness: 0.2 });
    const safetyYellow = new THREE.MeshStandardMaterial({ color: 0xddbb00, roughness: 0.6, metalness: 0.4 });

    // 1. Base Platform
    const basePlatformGroup = new THREE.Group();
    const basePlatformGeo = new THREE.CylinderGeometry(12, 14, 4, 32);
    const basePlatform = new THREE.Mesh(basePlatformGeo, darkSteel);
    basePlatform.position.y = 2;
    basePlatformGroup.add(basePlatform);
    
    // Add detailing to base
    for(let i=0; i<16; i++) {
        const strutGeo = new THREE.BoxGeometry(2, 4.2, 3);
        const strut = new THREE.Mesh(strutGeo, steel);
        const angle = (i / 16) * Math.PI * 2;
        strut.position.set(Math.cos(angle) * 13, 2, Math.sin(angle) * 13);
        strut.rotation.y = -angle;
        basePlatformGroup.add(strut);
    }
    group.add(basePlatformGroup);
    meshes.basePlatformGroup = basePlatformGroup;

    parts.push({
        name: "Concrete/Steel Foundation Base",
        description: "The massive structural foundation providing stability against high winds and structural loads of the spectrometer dish.",
        material: "darkSteel",
        function: "Anchor",
        assemblyOrder: 1,
        connections: ["Azimuth Bearing"],
        failureEffect: "Catastrophic collapse of the entire telescope structure.",
        cascadeFailures: ["Complete systemic failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Azimuth Bearing
    const azimuthBearingGroup = new THREE.Group();
    azimuthBearingGroup.position.y = 4;
    const bearingGeo = new THREE.CylinderGeometry(11, 11, 1, 64);
    const bearing = new THREE.Mesh(bearingGeo, chrome);
    bearing.position.y = 0.5;
    azimuthBearingGroup.add(bearing);
    
    // Internal gear teeth ring
    const gearRingGeo = new THREE.TorusGeometry(10.5, 0.2, 8, 64);
    const gearRing = new THREE.Mesh(gearRingGeo, darkSteel);
    gearRing.rotation.x = Math.PI/2;
    gearRing.position.y = 1.1;
    azimuthBearingGroup.add(gearRing);

    group.add(azimuthBearingGroup);
    meshes.azimuthBearingGroup = azimuthBearingGroup;

    parts.push({
        name: "Azimuth Slewing Bearing",
        description: "A precision-engineered massive hydrostatic bearing allowing the entire multi-ton assembly to rotate 360 degrees horizontally.",
        material: "chrome",
        function: "Azimuth tracking",
        assemblyOrder: 2,
        connections: ["Foundation Base", "Yoke Mount"],
        failureEffect: "Inability to track sidereal motion horizontally.",
        cascadeFailures: ["Target acquisition loss", "Drive motor burnout"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 3. Yoke Mount (Azimuth Rotator)
    const yokeGroup = new THREE.Group();
    yokeGroup.position.y = 5;
    
    // Yoke base
    const yokeBaseGeo = new THREE.CylinderGeometry(10, 10, 2, 32);
    const yokeBase = new THREE.Mesh(yokeBaseGeo, steel);
    yokeBase.position.y = 1;
    yokeGroup.add(yokeBase);

    // Left and Right Arms (Massive steel structures)
    const armShape = new THREE.Shape();
    armShape.moveTo(-4, 0);
    armShape.lineTo(4, 0);
    armShape.lineTo(3, 15);
    armShape.lineTo(-3, 15);
    armShape.lineTo(-4, 0);
    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const armGeo = new THREE.ExtrudeGeometry(armShape, extrudeSettings);
    
    const leftArm = new THREE.Mesh(armGeo, steel);
    leftArm.position.set(-8, 2, -1.5);
    yokeGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, steel);
    rightArm.position.set(8, 2, -1.5);
    yokeGroup.add(rightArm);

    // Instrument Cabin built into Yoke
    const cabinGeo = new THREE.BoxGeometry(10, 8, 8);
    const cabin = new THREE.Mesh(cabinGeo, darkSteel);
    cabin.position.set(0, 6, 2);
    yokeGroup.add(cabin);
    
    // Cabin Windows
    const windowGeo = new THREE.BoxGeometry(8, 3, 0.5);
    const cabinWindow = new THREE.Mesh(windowGeo, tinted);
    cabinWindow.position.set(0, 6, 6.1);
    yokeGroup.add(cabinWindow);

    // Server Racks inside (visible through window if tinted allows, or glowing)
    for(let r=0; r<4; r++) {
        const rackGeo = new THREE.BoxGeometry(1.5, 6, 2);
        const rack = new THREE.Mesh(rackGeo, steel);
        rack.position.set(-3 + (r*2), 5.5, 4);
        yokeGroup.add(rack);
        // glowing LEDs on rack
        for(let l=0; l<10; l++) {
            const led = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.2), neonBlue);
            led.position.set(-3 + (r*2), 3 + l*0.5, 4.9);
            yokeGroup.add(led);
            meshes[`serverLed_${r}_${l}`] = led;
        }
    }

    group.add(yokeGroup);
    meshes.yokeGroup = yokeGroup;

    parts.push({
        name: "Alidade / Yoke Structure",
        description: "The main structural fork that holds the elevation axis, housing the cryogenic compressors and primary instrumentation cabin.",
        material: "steel",
        function: "Support and Rotation",
        assemblyOrder: 3,
        connections: ["Azimuth Bearing", "Elevation Axis", "Instrument Cabin"],
        failureEffect: "Structural sagging affecting pointing accuracy.",
        cascadeFailures: ["Spectrometer misalignment", "Elevation bearing binding"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 30 }
    });

    parts.push({
        name: "Data Processing Cabin",
        description: "Shielded enclosure containing correlators, signal digitizers, and the atomic clock for phase-locked observations.",
        material: "darkSteel",
        function: "Signal Processing",
        assemblyOrder: 4,
        connections: ["Yoke Structure", "Waveguides"],
        failureEffect: "Loss of scientific data due to thermal noise or interference.",
        cascadeFailures: ["Data corruption"],
        originalPosition: { x: 0, y: 11, z: 2 },
        explodedPosition: { x: 0, y: 11, z: -30 }
    });

    // 4. Elevation Axis & Dish Backing Structure
    const elevationGroup = new THREE.Group();
    elevationGroup.position.set(0, 17, 0); // At the top of the yoke arms
    yokeGroup.add(elevationGroup); // elevation moves with yoke azimuth
    meshes.elevationGroup = elevationGroup;

    // Bearings
    const elevAxisGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const elevAxis = new THREE.Mesh(elevAxisGeo, chrome);
    elevAxis.rotation.z = Math.PI / 2;
    elevationGroup.add(elevAxis);

    parts.push({
        name: "Elevation Trunnion Axis",
        description: "The primary horizontal pivot for the massive reflector, utilizing ultra-low friction hydrostatic bearings.",
        material: "chrome",
        function: "Elevation tracking",
        assemblyOrder: 5,
        connections: ["Yoke Structure", "Truss Backing"],
        failureEffect: "Jamming of the elevation movement.",
        cascadeFailures: ["Actuator overload", "Tracking failure"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: -30, y: 22, z: 0 }
    });

    // Dish Truss Structure (Massive space frame backing)
    const trussGroup = new THREE.Group();
    elevationGroup.add(trussGroup);

    const rings = [4, 8, 12, 16];
    const nodePoints = [];
    nodePoints.push(new THREE.Vector3(0,0,-1));

    for(let r=0; r<rings.length; r++) {
        const radius = rings[r];
        const numNodes = 8 * (r+1);
        for(let n=0; n<numNodes; n++) {
            const angle = (n/numNodes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            // curve the backing structure like a parabola to support the dish
            const z = - (x*x + y*y)/(4 * 12) - 1.5; 
            const node = new THREE.Vector3(x, y, z);
            nodePoints.push(node);
            
            const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), darkSteel);
            nodeMesh.position.copy(node);
            trussGroup.add(nodeMesh);
        }
    }

    const connectNodes = (p1, p2) => {
        const dist = p1.distanceTo(p2);
        if(dist < 0.1 || dist > 6.0) return; // Only connect close neighboring nodes
        const cylinderGeo = new THREE.CylinderGeometry(0.12, 0.12, dist, 8);
        const strut = new THREE.Mesh(cylinderGeo, steel);
        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        strut.position.copy(midpoint);
        strut.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(p2, p1).normalize());
        trussGroup.add(strut);
    };

    for(let i=0; i<nodePoints.length; i++) {
        for(let j=i+1; j<nodePoints.length; j++) {
            connectNodes(nodePoints[i], nodePoints[j]);
        }
    }

    parts.push({
        name: "Space Frame Truss Backing",
        description: "A highly complex geometrical space frame ensuring the main parabolic reflector maintains its shape under varying gravity loads.",
        material: "steel",
        function: "Structural Rigidity",
        assemblyOrder: 6,
        connections: ["Elevation Axis", "Main Reflector", "Counterweights"],
        failureEffect: "Surface deformation of the dish.",
        cascadeFailures: ["Loss of high-frequency gain", "Beam distortion"],
        originalPosition: { x: 0, y: 22, z: -5 },
        explodedPosition: { x: 0, y: 40, z: -20 }
    });

    // Counterweights on the truss
    const cwGroup = new THREE.Group();
    cwGroup.position.set(0, -8, -6);
    const cwGeo = new THREE.BoxGeometry(10, 4, 4);
    const cw1 = new THREE.Mesh(cwGeo, darkSteel);
    cw1.position.set(-6, 0, 0);
    cwGroup.add(cw1);
    const cw2 = new THREE.Mesh(cwGeo, darkSteel);
    cw2.position.set(6, 0, 0);
    cwGroup.add(cw2);
    trussGroup.add(cwGroup);

    // 5. Main Dish Reflector
    const focalLength = 12;
    const dishRadius = 18;
    const dishPoints = [];
    for (let i = 0; i <= 64; i++) {
        const r = (i / 64) * dishRadius;
        const z = (r * r) / (4 * focalLength);
        dishPoints.push(new THREE.Vector2(r, z));
    }
    // thickness
    for (let i = 64; i >= 0; i--) {
        const r = (i / 64) * dishRadius;
        const z = (r * r) / (4 * focalLength) - 0.2;
        dishPoints.push(new THREE.Vector2(r, z));
    }
    const dishGeo = new THREE.LatheGeometry(dishPoints, 128);
    // Lathe revolves around Y. Our dish points along +Y. Let's rotate it to point to +Z.
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.rotation.x = Math.PI / 2;
    elevationGroup.add(dish);
    meshes.mainDish = dish;

    parts.push({
        name: "Primary Parabolic Reflector",
        description: "Massive 36-meter precision machined aluminum surface that collects and focuses faint radio waves from deep space.",
        material: "aluminum",
        function: "Signal Collection",
        assemblyOrder: 7,
        connections: ["Space Frame Truss"],
        failureEffect: "Inability to focus radio waves.",
        cascadeFailures: ["Complete system blindness"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 6. Subreflector Quadripod Legs
    const quadripodGroup = new THREE.Group();
    dish.add(quadripodGroup);

    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const startR = dishRadius - 1;
        const startZ = (startR * startR) / (4 * focalLength); 
        
        const endR = 1.5;
        const endZ = focalLength - 0.5;

        class LegCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const r = startR + (endR - startR) * t;
                const z = startZ + (endZ - startZ) * t;
                const bulge = Math.sin(t * Math.PI) * 0.5; 
                const x = Math.cos(angle) * (r + bulge);
                const y = z; // local optical axis
                const _z = Math.sin(angle) * (r + bulge);
                return optionalTarget.set(x, y, _z);
            }
        }
        const legGeo = new THREE.TubeGeometry(new LegCurve(), 32, 0.2, 12, false);
        const leg = new THREE.Mesh(legGeo, darkSteel);
        quadripodGroup.add(leg);
    }

    parts.push({
        name: "Quadripod Support Legs",
        description: "Four hyper-rigid composite struts that suspend the subreflector precisely at the focal point.",
        material: "darkSteel",
        function: "Subreflector Suspension",
        assemblyOrder: 8,
        connections: ["Primary Reflector", "Subreflector"],
        failureEffect: "Subreflector dropping or misalignment.",
        cascadeFailures: ["Phase errors", "Signal defocusing"],
        originalPosition: { x: 0, y: 22, z: 5 },
        explodedPosition: { x: 0, y: 22, z: 40 }
    });

    // 7. Subreflector
    const subPoints = [];
    const subRadius = 2.5;
    for(let i=0; i<=32; i++) {
        const r = (i/32) * subRadius;
        const z = - (r*r) / (4 * 2); 
        subPoints.push(new THREE.Vector2(r, z));
    }
    for(let i=32; i>=0; i--) {
        const r = (i/32) * subRadius;
        const z = - (r*r) / (4 * 2) + 0.1; 
        subPoints.push(new THREE.Vector2(r, z));
    }
    const subGeo = new THREE.LatheGeometry(subPoints, 64);
    const subreflector = new THREE.Mesh(subGeo, aluminum);
    subreflector.position.y = focalLength; 
    dish.add(subreflector);

    parts.push({
        name: "Cassegrain Subreflector",
        description: "Hyperbolic secondary mirror that reflects focused radio waves down into the central receiver horn.",
        material: "aluminum",
        function: "Secondary Focusing",
        assemblyOrder: 9,
        connections: ["Quadripod Support Legs"],
        failureEffect: "Signal scattered away from receiver.",
        cascadeFailures: ["Total signal loss"],
        originalPosition: { x: 0, y: 22, z: 12 },
        explodedPosition: { x: 0, y: 22, z: 50 }
    });

    // 8. Central Feed Horn (Corrugated)
    const feedGroup = new THREE.Group();
    feedGroup.position.y = 1.5; 
    dish.add(feedGroup);
    
    for(let i=0; i<15; i++) {
        const radius = 0.5 + (i * 0.05);
        const height = 0.2;
        const yPos = i * 0.2;
        
        const ringGeo = new THREE.CylinderGeometry(radius, radius - 0.05, height, 32);
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.position.y = yPos;
        feedGroup.add(ring);

        const flangeGeo = new THREE.CylinderGeometry(radius + 0.1, radius + 0.1, 0.05, 32);
        const flange = new THREE.Mesh(flangeGeo, chrome);
        flange.position.y = yPos;
        feedGroup.add(flange);
    }

    parts.push({
        name: "Corrugated Feed Horn",
        description: "Precision-grooved copper horn antenna that perfectly couples the incoming free-space electromagnetic waves into the waveguides.",
        material: "copper",
        function: "Electromagnetic Coupling",
        assemblyOrder: 10,
        connections: ["Primary Reflector Center", "Cryogenic Waveguide"],
        failureEffect: "Massive signal reflection and standing waves.",
        cascadeFailures: ["LNA destruction via feedback"],
        originalPosition: { x: 0, y: 22, z: 1.5 },
        explodedPosition: { x: 0, y: 22, z: 20 }
    });

    // 9. Cryocooler and LNA (Low Noise Amplifier) system
    const cryoGroup = new THREE.Group();
    cryoGroup.position.y = -2;
    dish.add(cryoGroup);

    const vacuumChamberGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const vacuumChamber = new THREE.Mesh(vacuumChamberGeo, steel);
    cryoGroup.add(vacuumChamber);

    for(let i=0; i<20; i++) {
        const finGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.05, 32);
        const fin = new THREE.Mesh(finGeo, darkSteel);
        fin.position.y = -1.8 + i * 0.18;
        cryoGroup.add(fin);
    }

    class SpiralCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const y = -1.8 + t * 3.6;
            const r = 1.6;
            const angle = t * Math.PI * 10;
            return optionalTarget.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
        }
    }
    const spiralGeo = new THREE.TubeGeometry(new SpiralCurve(), 200, 0.05, 12, false);
    const spiralPipe = new THREE.Mesh(spiralGeo, copper);
    cryoGroup.add(spiralPipe);

    const cryoLed = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), neonGreen);
    cryoLed.position.set(1.1, 1, 0.5);
    cryoGroup.add(cryoLed);
    meshes.cryoLed = cryoLed;

    parts.push({
        name: "Helium Cryostat & LNA",
        description: "Ultra-high vacuum chamber cooling the Low Noise Amplifiers to 4 Kelvin, eliminating thermal electron noise.",
        material: "steel",
        function: "Thermal Noise Reduction & Amplification",
        assemblyOrder: 11,
        connections: ["Feed Horn", "Waveguide Plumbing"],
        failureEffect: "Thermal noise completely overwhelms the faint cosmic signal.",
        cascadeFailures: ["Data degradation", "Helium leak"],
        originalPosition: { x: 0, y: 22, z: -2 },
        explodedPosition: { x: 0, y: 22, z: -20 }
    });

    // 10. Waveguide Plumbing
    const wgGroup = new THREE.Group();
    dish.add(wgGroup);
    class WGCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const p0 = new THREE.Vector3(0, -4, 0);
            const p1 = new THREE.Vector3(3, -6, 0);
            const p2 = new THREE.Vector3(6, -5, -3);
            const p3 = new THREE.Vector3(9, -2, -2);
            
            const x = Math.pow(1-t, 3)*p0.x + 3*Math.pow(1-t, 2)*t*p1.x + 3*(1-t)*Math.pow(t, 2)*p2.x + Math.pow(t, 3)*p3.x;
            const y = Math.pow(1-t, 3)*p0.y + 3*Math.pow(1-t, 2)*t*p1.y + 3*(1-t)*Math.pow(t, 2)*p2.y + Math.pow(t, 3)*p3.y;
            const z = Math.pow(1-t, 3)*p0.z + 3*Math.pow(1-t, 2)*t*p1.z + 3*(1-t)*Math.pow(t, 2)*p2.z + Math.pow(t, 3)*p3.z;
            return optionalTarget.set(x, y, z);
        }
    }
    const wgGeo = new THREE.TubeGeometry(new WGCurve(), 64, 0.2, 12, false);
    const waveguide = new THREE.Mesh(wgGeo, copper);
    wgGroup.add(waveguide);

    parts.push({
        name: "OFC Waveguide Plumbing",
        description: "Oxygen-Free Copper rectangular conduits transporting the amplified microwave signals down to the spectrometer cabin without loss.",
        material: "copper",
        function: "Signal Transmission",
        assemblyOrder: 12,
        connections: ["Cryostat", "Spectrometer Cabin"],
        failureEffect: "Signal attenuation and standing wave reflections.",
        cascadeFailures: ["Signal death"],
        originalPosition: { x: 3, y: 20, z: -2 },
        explodedPosition: { x: 30, y: 20, z: -20 }
    });

    // 11. Elevation Actuators (Hydraulic Pistons)
    const actuatorGroup = new THREE.Group();
    yokeGroup.add(actuatorGroup);

    const buildActuator = (xOffset) => {
        const act = new THREE.Group();
        
        const outerGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 32);
        const outer = new THREE.Mesh(outerGeo, safetyYellow);
        outer.position.y = 4;
        act.add(outer);

        const innerGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = 8;
        act.add(inner);
        
        act.position.set(xOffset, 2, 6);
        act.rotation.x = -Math.PI / 6;

        return { act, inner, outer };
    };

    const leftActuator = buildActuator(-6);
    const rightActuator = buildActuator(6);
    
    actuatorGroup.add(leftActuator.act);
    actuatorGroup.add(rightActuator.act);

    meshes.leftActRod = leftActuator.inner;
    meshes.rightActRod = rightActuator.inner;
    meshes.leftAct = leftActuator.act;
    meshes.rightAct = rightActuator.act;

    parts.push({
        name: "Elevation Hydraulic Actuators",
        description: "Massive twin hydraulic rams operating at 5000 PSI to tilt the hundreds of tons of reflector structure with arcsecond precision.",
        material: "chrome",
        function: "Pitch Control",
        assemblyOrder: 13,
        connections: ["Yoke Structure", "Space Frame Truss"],
        failureEffect: "Loss of elevation control, dish drops to zenith limit.",
        cascadeFailures: ["Hydraulic fluid rupture", "Structural impact damage"],
        originalPosition: { x: -6, y: 15, z: 6 },
        explodedPosition: { x: -20, y: 10, z: 20 }
    });

    // 12. Walkways and Ladders
    const catwalkGroup = new THREE.Group();
    const catwalkGeo = new THREE.RingGeometry(10.5, 12.5, 64);
    const catwalk = new THREE.Mesh(catwalkGeo, steel);
    catwalk.rotation.x = -Math.PI/2;
    catwalk.position.y = 7;
    yokeGroup.add(catwalk);

    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI * 2;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), steel);
        post.position.set(Math.cos(angle)*12.3, 7.6, Math.sin(angle)*12.3);
        yokeGroup.add(post);
    }
    const railGeo = new THREE.TorusGeometry(12.3, 0.05, 64, 16);
    const rail = new THREE.Mesh(railGeo, steel);
    rail.rotation.x = Math.PI/2;
    rail.position.y = 8.2;
    yokeGroup.add(rail);

    parts.push({
        name: "Maintenance Catwalk & Railings",
        description: "Galvanized steel walkways permitting engineers access to the azimuth drives and instrument cabin.",
        material: "steel",
        function: "Personnel Access",
        assemblyOrder: 14,
        connections: ["Yoke Structure"],
        failureEffect: "Inability to perform maintenance.",
        cascadeFailures: ["Long-term degradation of unserviced parts"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 25 }
    });

    // 13. Weather Sensors (Anemometer)
    const anemometerGroup = new THREE.Group();
    anemometerGroup.position.set(-9, 16, -2);
    yokeGroup.add(anemometerGroup);
    
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), steel);
    mast.position.y = 1.5;
    anemometerGroup.add(mast);

    const spinnerGroup = new THREE.Group();
    spinnerGroup.position.y = 3;
    anemometerGroup.add(spinnerGroup);
    meshes.spinnerGroup = spinnerGroup;

    for(let i=0; i<3; i++) {
        const angle = (i/3)*Math.PI*2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), steel);
        arm.rotation.z = Math.PI/2;
        arm.rotation.y = angle;
        arm.position.set(Math.cos(angle)*0.5, 0, Math.sin(angle)*0.5);
        spinnerGroup.add(arm);

        const cup = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI), plastic);
        cup.rotation.y = angle;
        cup.position.set(Math.cos(angle)*1, 0, Math.sin(angle)*1);
        spinnerGroup.add(cup);
    }

    parts.push({
        name: "Ultrasonic Anemometer & Weather Station",
        description: "Monitors wind shear and gusts, triggering automatic stow-protocols if wind speeds exceed structural safety limits (80 km/h).",
        material: "plastic",
        function: "Environmental Monitoring",
        assemblyOrder: 15,
        connections: ["Yoke Structure", "Safety Interlock System"],
        failureEffect: "Failure to stow during a hurricane, leading to destruction.",
        cascadeFailures: ["Dish warping", "Drive motor strip-out"],
        originalPosition: { x: -9, y: 22, z: -2 },
        explodedPosition: { x: -30, y: 22, z: -20 }
    });

    // 14. Aviation Warning Lights
    const beaconGroup = new THREE.Group();
    dish.add(beaconGroup);
    
    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), neonRed);
    beaconLight.position.set(0, 18, 5);
    beaconGroup.add(beaconLight);
    meshes.beaconLight = beaconLight;

    parts.push({
        name: "Aviation Obstacle Beacons",
        description: "High-intensity flashing red LED arrays to prevent aircraft collisions with the apex of the structure.",
        material: "glass", 
        function: "Aircraft Warning",
        assemblyOrder: 16,
        connections: ["Primary Reflector Perimeter"],
        failureEffect: "Regulatory violation, extreme collision risk.",
        cascadeFailures: ["Catastrophic physical impact"],
        originalPosition: { x: 0, y: 40, z: 5 },
        explodedPosition: { x: 0, y: 60, z: 5 }
    });

    // 15. Grounding System
    parts.push({
        name: "Lightning Arrestor System",
        description: "Massive copper braided cables bypassing the sensitive bearings to route lightning strikes safely to deep earth rods.",
        material: "copper",
        function: "Surge Protection",
        assemblyOrder: 17,
        connections: ["Primary Reflector", "Foundation Base"],
        failureEffect: "Bearings pit and fuse together from millions of volts.",
        cascadeFailures: ["Bearing seizure", "Electronics fry"],
        originalPosition: { x: 2, y: 15, z: -4 },
        explodedPosition: { x: 20, y: -5, z: -20 }
    });

    const description = "The Astrochemistry Radio Spectrometer is an ultra-high-precision, colossal rotating dish antenna designed to detect incredibly faint molecular line emissions from distant nebulas and star-forming regions. Operating at millimeter and sub-millimeter wavelengths, its 36-meter primary reflector must maintain its perfect parabolic shape to within a fraction of a millimeter regardless of gravity or temperature. The core of its sensitivity lies in the Cryocooler, which drops the Low Noise Amplifiers (LNAs) to 4 Kelvin (-269°C) using compressed liquid helium, completely silencing the thermal noise of the electrons inside the circuits. It tracks sidereal targets via a massive hydrostatic azimuth bearing and twin 5000-PSI hydraulic elevation rams, streaming gigabytes of raw waveform data per second to the onboard correlator racks in the shielded cabin.";

    const quizQuestions = [
        {
            question: "Why must the Low Noise Amplifiers (LNAs) in the receiver be cooled to 4 Kelvin using liquid helium?",
            options: [
                "To prevent the copper waveguides from melting under high power.",
                "To reduce thermal electron noise that would otherwise drown out faint cosmic radio signals.",
                "To shrink the metal components and change the receiving frequency.",
                "To generate a superconducting magnetic field for tracking."
            ],
            correctAnswer: 1,
            explanation: "At room temperature, the random thermal motion of electrons in the circuits creates 'Johnson-Nyquist noise', which is much louder than the incredibly faint signals from space. Cooling to 4K practically stops this motion."
        },
        {
            question: "What is the primary function of the Cassegrain Subreflector?",
            options: [
                "To block incoming sunlight from heating up the main dish.",
                "To reflect the focused radio waves back down into the central corrugated feed horn.",
                "To act as a counterweight for the quadripod legs.",
                "To transmit radar pulses out into space."
            ],
            correctAnswer: 1,
            explanation: "In a Cassegrain optical layout, the large primary dish reflects waves up to the smaller, hyperbolic secondary mirror (subreflector), which then reflects them down into the receiver horn at the center."
        },
        {
            question: "What is the purpose of the massive Space Frame Truss backing the primary reflector?",
            options: [
                "To provide an aerodynamic profile to reduce wind resistance.",
                "To store spare parts and maintenance equipment out of the weather.",
                "To provide extreme structural rigidity so the dish doesn't deform under changing gravitational loads.",
                "To act as a giant Faraday cage to block local radio stations."
            ],
            correctAnswer: 2,
            explanation: "As the huge dish tilts in elevation, the direction of gravity across the dish changes. The truss ensures the parabolic surface deforms by less than a millimeter, maintaining focus."
        },
        {
            question: "Why are hydrostatic bearings used for the Azimuth and Elevation axes instead of standard ball bearings?",
            options: [
                "They are significantly cheaper to manufacture at massive scales.",
                "They use a thin film of highly pressurized oil to support thousands of tons with virtually zero friction or stick-slip.",
                "They generate electricity as the telescope turns to power the cabin.",
                "They operate in a total vacuum environment without evaporating."
            ],
            correctAnswer: 1,
            explanation: "Hydrostatic bearings pump high-pressure oil between the pads, literally floating the entire telescope. This allows incredibly smooth, microscopic tracking movements of massive weights without juddering."
        },
        {
            question: "What triggers the telescope to abandon its observation and initiate 'stow-protocols'?",
            options: [
                "A solar eclipse passing overhead.",
                "The target galaxy moving below the horizon.",
                "Data storage in the cabin reaching full capacity.",
                "The Ultrasonic Anemometer detecting wind speeds exceeding safe structural limits."
            ],
            correctAnswer: 3,
            explanation: "High winds act on the massive solid dish like a sail. If wind loads become dangerous, the system aborts operations and points the dish directly up (zenith) to minimize its aerodynamic profile."
        }
    ];

    const animate = (time, speed, machineMeshes) => {
        const t = time * speed;

        if(machineMeshes.yokeGroup) {
            machineMeshes.yokeGroup.rotation.y = Math.sin(t * 0.1) * Math.PI;
        }

        if(machineMeshes.elevationGroup) {
            const elevAngle = -Math.PI/4 + Math.sin(t * 0.15) * Math.PI/4; 
            machineMeshes.elevationGroup.rotation.x = elevAngle;

            if(machineMeshes.leftActRod && machineMeshes.leftAct) {
                const extension = (elevAngle / (-Math.PI/2)) * 4; 
                machineMeshes.leftActRod.position.y = 8 + extension;
                machineMeshes.rightActRod.position.y = 8 + extension;
                
                const actTilt = -Math.PI/6 - (elevAngle * 0.2);
                machineMeshes.leftAct.rotation.x = actTilt;
                machineMeshes.rightAct.rotation.x = actTilt;
            }
        }

        if(machineMeshes.spinnerGroup) {
            machineMeshes.spinnerGroup.rotation.y = t * 5;
        }

        if(machineMeshes.beaconLight) {
            const flash = (Math.sin(t * 10) > 0.8) ? 3 : 0.2;
            machineMeshes.beaconLight.material.emissiveIntensity = flash;
        }

        for(let r=0; r<4; r++) {
            for(let l=0; l<10; l++) {
                const led = machineMeshes[`serverLed_${r}_${l}`];
                if(led) {
                    led.material.emissiveIntensity = Math.random() > 0.5 ? 2 : 0;
                }
            }
        }

        if(machineMeshes.cryoLed) {
            machineMeshes.cryoLed.material.emissiveIntensity = 1 + Math.sin(t * 2);
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAstrochemistrySpectrometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
