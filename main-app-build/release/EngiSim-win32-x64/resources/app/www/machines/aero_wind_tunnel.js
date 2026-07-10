import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Glowing Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });

    const neonPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.2,
        metalness: 0.8,
        roughness: 0.2
    });

    const fanGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        metalness: 0.9,
        roughness: 0.1
    });

    const flowGlow = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    // --- 1. Test Section ---
    const testSecGeo = new THREE.BoxGeometry(3, 2, 2);
    const testSec = new THREE.Mesh(testSecGeo, glass);
    const testSecPos = {x: 0, y: 0, z: 5};
    testSec.position.set(testSecPos.x, testSecPos.y, testSecPos.z);
    
    // Add neon frame to test section
    const frameGeo = new THREE.EdgesGeometry(testSecGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    const frame = new THREE.LineSegments(frameGeo, frameMat);
    testSec.add(frame);
    group.add(testSec);

    parts.push({
        name: "Test Section",
        description: "Transparent observation area where the model is placed.",
        material: glass,
        function: "Houses the aerodynamic model and measurement instruments in a high-speed uniform airflow.",
        assemblyOrder: 1,
        connections: ["Contraction Cone", "Diffuser"],
        failureEffect: "Loss of optical access, air leakage.",
        cascadeFailures: ["Measurement errors", "Flow disruption"],
        originalPosition: testSecPos,
        explodedPosition: {x: 0, y: 3, z: 8}
    });

    // --- 2. Diffuser ---
    const diffuserGeo = new THREE.CylinderGeometry(1.5, 1, 5, 32);
    diffuserGeo.rotateZ(-Math.PI / 2);
    const diffuser = new THREE.Mesh(diffuserGeo, steel);
    const diffuserPos = {x: 4, y: 0, z: 5};
    diffuser.position.set(diffuserPos.x, diffuserPos.y, diffuserPos.z);
    
    // Diffuser rings
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(1 + i*0.25, 0.05, 16, 64);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(2.5 + i*1.5, 0, 5);
        group.add(ring);
    }
    group.add(diffuser);

    parts.push({
        name: "Diffuser",
        description: "Expanding duct downstream of the test section.",
        material: steel,
        function: "Slows down the airflow, recovering static pressure and reducing energy loss.",
        assemblyOrder: 2,
        connections: ["Test Section", "Corner 1"],
        failureEffect: "Increased power consumption, flow separation.",
        cascadeFailures: ["Fan overload", "Turbulence increase"],
        originalPosition: diffuserPos,
        explodedPosition: {x: 4, y: 4, z: 8}
    });

    // --- 3. Corners 1 & 2 ---
    const corner1Geo = new THREE.BoxGeometry(3, 3, 3);
    const corner1 = new THREE.Mesh(corner1Geo, darkSteel);
    corner1.position.set(8, 0, 5);
    group.add(corner1);
    
    const corner2Geo = new THREE.BoxGeometry(3, 3, 3);
    const corner2 = new THREE.Mesh(corner2Geo, darkSteel);
    corner2.position.set(8, 0, -5);
    group.add(corner2);

    // Glowing turning vanes in Corner 1
    const vaneGroup = new THREE.Group();
    for(let i=-1; i<=1; i++) {
        const vaneGeo = new THREE.BoxGeometry(0.05, 2.8, 3.5);
        const vane = new THREE.Mesh(vaneGeo, neonPurple);
        vane.position.set(i*0.5, 0, 0);
        vaneGroup.add(vane);
    }
    vaneGroup.position.set(8, 0, 5);
    vaneGroup.rotation.y = Math.PI / 4;
    group.add(vaneGroup);

    parts.push({
        name: "Corners 1 & 2",
        description: "First pair of 90-degree corners equipped with turning vanes.",
        material: darkSteel,
        function: "Redirects airflow 180 degrees back towards the return passage with minimal turbulence.",
        assemblyOrder: 3,
        connections: ["Diffuser", "Return Passage"],
        failureEffect: "Massive flow separation, huge pressure loss.",
        cascadeFailures: ["Vibration", "Structural stress"],
        originalPosition: {x: 8, y: 0, z: 0},
        explodedPosition: {x: 12, y: 0, z: 0}
    });

    // --- 4. Return Passage & Main Fan ---
    const returnGeo = new THREE.CylinderGeometry(1.5, 1.5, 13, 32);
    returnGeo.rotateZ(Math.PI / 2);
    const returnPassage = new THREE.Mesh(returnGeo, darkSteel);
    const returnPos = {x: 0, y: 0, z: -5};
    returnPassage.position.set(returnPos.x, returnPos.y, returnPos.z);
    
    // Add wireframe to return passage for high-tech look
    const retFrameGeo = new THREE.WireframeGeometry(returnGeo);
    const retFrame = new THREE.LineSegments(retFrameGeo, new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.2 }));
    returnPassage.add(retFrame);
    group.add(returnPassage);

    parts.push({
        name: "Return Passage",
        description: "Long duct returning air to the front.",
        material: darkSteel,
        function: "Completes the closed circuit, conserving momentum of the airflow.",
        assemblyOrder: 4,
        connections: ["Corner 2", "Corner 3"],
        failureEffect: "Circuit breach, pressure drop.",
        cascadeFailures: ["Fan stall", "Test abort"],
        originalPosition: returnPos,
        explodedPosition: {x: 0, y: -4, z: -10}
    });

    // Massive Drive Fan
    const fanBlades = new THREE.Group();
    const fanHubGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    fanHubGeo.rotateZ(Math.PI / 2);
    const fanHub = new THREE.Mesh(fanHubGeo, chrome);
    fanBlades.add(fanHub);

    for(let i=0; i<8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.05, 2.6, 0.4);
        bladeGeo.translate(0, 1.3, 0);
        const blade = new THREE.Mesh(bladeGeo, fanGlow);
        blade.rotation.x = (i * Math.PI * 2) / 8;
        blade.rotation.z = Math.PI / 12; // pitch angle
        fanBlades.add(blade);
    }
    fanBlades.position.set(0, 0, -5);
    fanBlades.rotation.y = Math.PI / 2;
    group.add(fanBlades);

    // Neon ring housing for the fan
    const fanRingGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
    const fanRing = new THREE.Mesh(fanRingGeo, neonBlue);
    fanRing.rotation.y = Math.PI / 2;
    fanRing.position.set(0, 0, -5);
    group.add(fanRing);

    parts.push({
        name: "Main Drive Fan",
        description: "Massive axial fan powered by an electric motor.",
        material: fanGlow,
        function: "Provides the kinetic energy to overcome pressure losses and drive the airflow.",
        assemblyOrder: 5,
        connections: ["Return Passage", "Motor"],
        failureEffect: "Airflow stops immediately.",
        cascadeFailures: ["Overheating motor", "Blade disintegration"],
        originalPosition: {x: 0, y: 0, z: -5},
        explodedPosition: {x: 0, y: 6, z: -5}
    });

    // --- 5. Corners 3 & 4 ---
    const corner3Geo = new THREE.BoxGeometry(3, 3, 3);
    const corner3 = new THREE.Mesh(corner3Geo, darkSteel);
    corner3.position.set(-8, 0, -5);
    group.add(corner3);
    
    const corner4Geo = new THREE.BoxGeometry(4, 4, 4);
    const corner4 = new THREE.Mesh(corner4Geo, darkSteel);
    corner4.position.set(-8, 0, 5);
    group.add(corner4);

    // --- 6. Settling Chamber & Honeycomb ---
    const settlingGeo = new THREE.BoxGeometry(3, 4, 4);
    const settling = new THREE.Mesh(settlingGeo, aluminum);
    const settlingPos = {x: -4.5, y: 0, z: 5};
    settling.position.set(settlingPos.x, settlingPos.y, settlingPos.z);
    group.add(settling);
    
    // Honeycomb represented by a grid of glowing bars
    const honeycombGrp = new THREE.Group();
    const honeyPlaneGeo = new THREE.BoxGeometry(0.2, 3.8, 3.8);
    const honeyPlane = new THREE.Mesh(honeyPlaneGeo, neonBlue);
    honeycombGrp.add(honeyPlane);
    honeycombGrp.position.set(-5, 0, 5);
    group.add(honeycombGrp);

    parts.push({
        name: "Settling Chamber & Honeycomb",
        description: "Large volume section containing flow straighteners.",
        material: neonBlue,
        function: "Reduces turbulence and straightens the airflow before it enters the contraction cone.",
        assemblyOrder: 6,
        connections: ["Corner 4", "Contraction Cone"],
        failureEffect: "Highly turbulent, swirling air enters test section.",
        cascadeFailures: ["Invalid aerodynamic data", "Model vibration"],
        originalPosition: settlingPos,
        explodedPosition: {x: -5.5, y: -4, z: 10}
    });

    // --- 7. Contraction Cone ---
    const contractionGeo = new THREE.CylinderGeometry(1, 2, 3, 32);
    contractionGeo.rotateZ(Math.PI / 2);
    const contraction = new THREE.Mesh(contractionGeo, steel);
    const contractionPos = {x: -2, y: 0, z: 5};
    contraction.position.set(contractionPos.x, contractionPos.y, contractionPos.z);
    group.add(contraction);
    
    parts.push({
        name: "Contraction Cone",
        description: "Nozzle that accelerates the air into the test section.",
        material: steel,
        function: "Increases flow velocity and uniformity while reducing relative turbulence.",
        assemblyOrder: 7,
        connections: ["Settling Chamber", "Test Section"],
        failureEffect: "Uneven velocity profile.",
        cascadeFailures: ["Boundary layer separation", "Test failure"],
        originalPosition: contractionPos,
        explodedPosition: {x: -2, y: 4, z: 5}
    });

    // --- 8. Aerodynamic Model ---
    const modelGrp = new THREE.Group();
    const fuselageGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
    fuselageGeo.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, chrome);
    
    const wingGeo = new THREE.BoxGeometry(0.4, 0.02, 1.4);
    const wing = new THREE.Mesh(wingGeo, chrome);
    wing.position.set(-0.1, 0, 0); // slightly back

    const tailGeo = new THREE.BoxGeometry(0.2, 0.3, 0.02);
    const tail = new THREE.Mesh(tailGeo, chrome);
    tail.position.set(-0.5, 0.15, 0);

    modelGrp.add(fuselage);
    modelGrp.add(wing);
    modelGrp.add(tail);
    
    const stingGeo = new THREE.CylinderGeometry(0.02, 0.05, 1);
    stingGeo.rotateZ(Math.PI / 2);
    const sting = new THREE.Mesh(stingGeo, darkSteel);
    sting.position.set(-1, 0, 0);
    modelGrp.add(sting);

    modelGrp.position.set(0, 0, 5);
    group.add(modelGrp);
    
    parts.push({
        name: "Aerodynamic Model",
        description: "Scaled aircraft model mounted on a sting balance.",
        material: chrome,
        function: "Object under test to measure aerodynamic forces (lift, drag, pitch).",
        assemblyOrder: 8,
        connections: ["Test Section", "Force Balance"],
        failureEffect: "Model detachment at high speeds.",
        cascadeFailures: ["Tunnel destruction", "Fan damage"],
        originalPosition: {x: 0, y: 0, z: 5},
        explodedPosition: {x: 0, y: 2, z: 5}
    });

    // --- 9. Airflow Particle System ---
    const particleCount = 400;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const tArray = new Float32Array(particleCount);
    
    for(let i=0; i<particleCount; i++) {
        tArray[i] = Math.random(); // Parametric position along the loop
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('tVal', new THREE.BufferAttribute(tArray, 1));
    const particleSystem = new THREE.Points(particlesGeo, flowGlow);
    group.add(particleSystem);

    const description = "A high-tech closed-circuit full-scale wind tunnel used for testing aerodynamic properties of aircraft, vehicles, and structures. It recirculates air to maintain high efficiency and precisely controlled flow conditions.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the Contraction Cone in a wind tunnel?",
            options: [
                "To cool down the recirculating air",
                "To accelerate the airflow and improve uniformity",
                "To slow down the airflow and recover pressure",
                "To filter out dust particles"
            ],
            correct: 1,
            explanation: "The contraction cone acts as a nozzle. By reducing the cross-sectional area, it accelerates the flow (due to conservation of mass) and reduces the relative turbulence intensity, providing a clean, high-speed flow into the test section.",
            difficulty: "Medium"
        },
        {
            question: "Why does a closed-circuit wind tunnel require turning vanes at its corners?",
            options: [
                "To measure the air velocity",
                "To heat the air for supersonic tests",
                "To guide the airflow around corners with minimal pressure loss and turbulence",
                "To prevent the fan blades from spinning too fast"
            ],
            correct: 2,
            explanation: "Without turning vanes, flow would separate at the corners, creating massive turbulence and pressure losses. Vanes act like small airfoils to smoothly redirect the flow 90 degrees.",
            difficulty: "Hard"
        },
        {
            question: "What function does the Diffuser serve immediately after the test section?",
            options: [
                "It decelerates the airflow to recover static pressure and reduce energy losses.",
                "It speeds up the airflow before it hits the fan.",
                "It adds colored smoke for visualization.",
                "It straightens the airflow to remove swirls."
            ],
            correct: 0,
            explanation: "High-speed air leaving the test section has high dynamic pressure. The diffuser gradually expands in area, slowing the air down and converting dynamic pressure back to static pressure, making the tunnel more energy efficient.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate fan
        fanBlades.rotation.x -= 0.3 * speed;

        // Animate flow particles around the loop
        const positions = particleSystem.geometry.attributes.position.array;
        const tVals = particleSystem.geometry.attributes.tVal.array;
        
        for(let i=0; i<particleCount; i++) {
            let t = tVals[i];
            t += 0.003 * speed; // Base speed of flow
            if(t > 1.0) t -= 1.0;
            tVals[i] = t;
            
            let x=0, y=0, z=0;
            const p = t * 4; // Map t to 4 tunnel segments
            
            // Spatial noise offset based on index to distribute particles
            const offsetZ = Math.sin(i * 123.45) * 0.6;
            const offsetY = Math.cos(i * 98.76) * 0.6;

            if(p < 1) {
                // Segment 1: Bottom long side (Test section flow, -X to +X)
                x = -8 + (p) * 16;
                z = 5 + offsetZ;
                y = offsetY;
                // Squeeze particles in the test section (contraction effect)
                if (x > -2 && x < 2) {
                    z = 5 + offsetZ * 0.4;
                    y = offsetY * 0.4;
                }
            } else if (p < 2) {
                // Segment 2: Right short side (Corners 1 to 2, +Z to -Z)
                x = 8 + offsetZ;
                z = 5 - (p - 1) * 10;
                y = offsetY;
            } else if (p < 3) {
                // Segment 3: Top long side (Return passage, +X to -X)
                x = 8 - (p - 2) * 16;
                z = -5 + offsetZ;
                y = offsetY;
            } else {
                // Segment 4: Left short side (Corners 3 to 4, -Z to +Z)
                x = -8 + offsetZ;
                z = -5 + (p - 3) * 10;
                y = offsetY;
            }

            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.tVal.needsUpdate = true;

        // Dynamic vibration on the test model due to aerodynamic flutter
        modelGrp.rotation.z = Math.sin(time * 15) * 0.03 * speed;
        modelGrp.rotation.x = Math.cos(time * 20) * 0.01 * speed;
        modelGrp.position.y = Math.sin(time * 12) * 0.02 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createWindTunnel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
