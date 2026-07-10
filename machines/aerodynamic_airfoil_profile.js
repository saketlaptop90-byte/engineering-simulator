import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationTargets = {};

    // ============================================================================
    // HIGH-TECH MATERIALS DEFINITION
    // ============================================================================
    const ablativeHeatShield = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.9, metalness: 0.2, bumpScale: 0.05,
        name: "Ablative C-C Composite"
    });
    const scramjetCombustorMat = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b, roughness: 0.7, metalness: 0.8,
        name: "Ceramic Matrix Composite"
    });
    const shockwaveMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true,
        roughness: 0, metalness: 0, ior: 1.2, side: THREE.DoubleSide,
        name: "Compressed Air Plasma"
    });
    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 4, 
        transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
        name: "Ionized Exhaust"
    });
    const activeCoolingMat = new THREE.MeshStandardMaterial({
        color: 0x331111, roughness: 0.3, metalness: 0.9,
        name: "Cryogenic Coolant Tubing"
    });
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 2,
        name: "Optical Laser Emitter"
    });
    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 2,
        name: "Thermal Probe Tip"
    });
    const metamaterialMat = new THREE.MeshStandardMaterial({
        color: 0x666677, roughness: 0.4, metalness: 0.9, wireframe: false,
        name: "Active Morphing Metamaterial"
    });

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================
    function addPart(name, description, material, mesh, functionDesc, assemblyOrder, connections, failure, cascade, origPos, explPos) {
        parts.push({
            name, description, material, function: functionDesc, assemblyOrder,
            connections, failureEffect: failure, cascadeFailures: cascade,
            originalPosition: origPos, explodedPosition: explPos
        });
        if (mesh) {
            mesh.name = name;
            group.add(mesh);
        }
    }

    function createPipe(curvePoints, radius, tubularSegments, radialSegments, material) {
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
        return new THREE.Mesh(geometry, material);
    }

    // ============================================================================
    // HYPER-REALISTIC GEOMETRY GENERATION
    // ============================================================================

    // 1. WAVERIDER MAIN BODY (TOP SURFACE)
    const bodyGeometry = new THREE.BufferGeometry();
    const bodyVertices = [];
    const bodyIndices = [];
    const bodyUvs = [];
    const length = 120;
    const width = 50;
    const height = 18;
    const xSegments = 120;
    const zSegments = 60;
    
    // Procedurally generate a waverider power-law body
    for (let i = 0; i <= xSegments; i++) {
        const xNorm = i / xSegments;
        const x = xNorm * length - length / 2;
        for (let j = 0; j <= zSegments; j++) {
            const zNorm = j / zSegments;
            const z = (zNorm - 0.5) * width;
            let y = 0;
            if (xNorm < 0.5) {
                // Forebody compression surface
                y = height * Math.pow(xNorm * 2, 0.75) * (1 - Math.pow(Math.abs(zNorm - 0.5) * 2, 2.5));
            } else {
                // Afterbody expansion surface
                y = height * (1 - Math.pow((xNorm - 0.5) * 2, 1.5)) * (1 - Math.pow(Math.abs(zNorm - 0.5) * 2, 2));
            }
            bodyVertices.push(x, y, z);
            bodyUvs.push(xNorm, zNorm);
        }
    }
    
    for (let i = 0; i < xSegments; i++) {
        for (let j = 0; j < zSegments; j++) {
            const a = i * (zSegments + 1) + j;
            const b = i * (zSegments + 1) + j + 1;
            const c = (i + 1) * (zSegments + 1) + j;
            const d = (i + 1) * (zSegments + 1) + j + 1;
            bodyIndices.push(a, b, d);
            bodyIndices.push(a, d, c);
        }
    }
    bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bodyVertices, 3));
    bodyGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(bodyUvs, 2));
    bodyGeometry.setIndex(bodyIndices);
    bodyGeometry.computeVertexNormals();
    
    const waveriderBody = new THREE.Mesh(bodyGeometry, darkSteel);
    
    addPart("Morphing Waverider Airframe", 
        "Primary lifting body constructed of high-temperature carbon-carbon composites and active metamaterials.", 
        "Active Metamaterial / Carbon-Carbon", waveriderBody, 
        "Provides immense aerodynamic lift at hypersonic speeds and houses the internal scramjet flow path. Morphing capability optimizes L/D ratio.", 
        1, ["Scramjet Inlet", "Actuator Network", "Cooling System"], 
        "Loss of shock attachment, immediate extreme drag increase and thermal destruction.", 
        ["Structural Failure", "Engine Unstart"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: 15, z: 0}
    );

    // 2. METAMATERIAL SCALES (THOUSANDS OF THEM)
    const scaleGeom = new THREE.BoxGeometry(0.9, 0.05, 0.9);
    const scaleCount = (xSegments) * (zSegments);
    const scalesInstanced = new THREE.InstancedMesh(scaleGeom, metamaterialMat, scaleCount);
    const dummy = new THREE.Object3D();
    
    let scaleIdx = 0;
    // Map to hold scale reference positions for animation
    const scaleData = new Float32Array(scaleCount * 3);
    for (let i = 0; i < xSegments; i++) {
        for (let j = 0; j < zSegments; j++) {
            const xNorm = i / xSegments;
            const zNorm = j / zSegments;
            const x = xNorm * length - length / 2;
            const z = (zNorm - 0.5) * width;
            let y = 0;
            if (xNorm < 0.5) {
                y = height * Math.pow(xNorm * 2, 0.75) * (1 - Math.pow(Math.abs(zNorm - 0.5) * 2, 2.5));
            } else {
                y = height * (1 - Math.pow((xNorm - 0.5) * 2, 1.5)) * (1 - Math.pow(Math.abs(zNorm - 0.5) * 2, 2));
            }
            
            dummy.position.set(x, y + 0.1, z);
            dummy.rotation.z = Math.PI / 24 * xNorm; 
            dummy.updateMatrix();
            scalesInstanced.setMatrixAt(scaleIdx, dummy.matrix);
            
            scaleData[scaleIdx * 3] = xNorm;
            scaleData[scaleIdx * 3 + 1] = y + 0.1;
            scaleData[scaleIdx * 3 + 2] = zNorm;
            scaleIdx++;
        }
    }
    scalesInstanced.instanceMatrix.needsUpdate = true;
    animationTargets.scales = { mesh: scalesInstanced, data: scaleData, count: scaleCount };
    
    addPart("Thermal Metamaterial Scales", 
        "Thousands of individual actively cooled tiles forming a morphing hypersonic skin.", 
        "Tungsten-Carbide/Chrome", scalesInstanced, 
        "Interlock seamlessly to form a smooth hypersonic flow surface while allowing the underlying substrate to morph and flex.", 
        2, ["Morphing Waverider Airframe"], 
        "Localized aerodynamic heating, leading to plasma breakthrough.", 
        ["Airframe Melting", "Catastrophic Disintegration"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: 25, z: 0}
    );

    // 3. SCRAMJET INLET COWL
    const cowlShape = new THREE.Shape();
    cowlShape.moveTo(0, 0);
    cowlShape.lineTo(35, -2);
    cowlShape.lineTo(35, -4);
    cowlShape.lineTo(0, -6);
    cowlShape.lineTo(0, 0);
    const cowlGeom = new THREE.ExtrudeGeometry(cowlShape, { depth: 22, bevelEnabled: true, bevelThickness: 0.5 });
    const cowlMesh = new THREE.Mesh(cowlGeom, steel);
    cowlMesh.position.set(-15, -8, -11);
    
    // Create a pivot group for the cowl
    const cowlGroup = new THREE.Group();
    cowlGroup.position.set(-15, -8, 0); // pivot at the leading edge of the cowl
    cowlMesh.position.set(0, 0, -11); // relative to group
    cowlGroup.add(cowlMesh);
    
    addPart("Active Inlet Cowl", 
        "Variable geometry lower lip of the scramjet engine module.", 
        "High-Temp Steel / Thermal Blanket", cowlGroup, 
        "Actuates dynamically to capture the oblique shockwave generated by the forebody (shock-on-lip condition), ensuring optimal mass flow recovery into the isolator.", 
        3, ["Hydraulic Actuators", "Isolator Duct"], 
        "Engine unstart due to shock swallowing or excessive spillage.", 
        ["Combustion Blowout", "Complete Thrust Loss"], 
        {x: -15, y: -8, z: 0}, {x: -20, y: -20, z: 0}
    );
    animationTargets.cowl = cowlGroup;

    // 4. HYDRAULIC ACTUATORS FOR COWL
    const actuatorGroup = new THREE.Group();
    const pistonTargets = [];
    for(let i = -1; i <= 1; i+=2) {
        const cylinderGeom = new THREE.CylinderGeometry(0.8, 0.8, 12, 32);
        const pistonGeom = new THREE.CylinderGeometry(0.5, 0.5, 16, 32);
        
        const cyl = new THREE.Mesh(cylinderGeom, darkSteel);
        const pist = new THREE.Mesh(pistonGeom, chrome);
        
        cyl.position.set(-5, -4, i * 9);
        cyl.rotation.z = Math.PI / 4;
        pist.position.set(0, -6, 0); 
        
        cyl.add(pist);
        actuatorGroup.add(cyl);
        pistonTargets.push(pist);
    }
    addPart("Hydraulic Cowl Actuators", 
        "Massive high-pressure linear actuators nested within the fuselage.", 
        "Titanium/Chrome Alloy", actuatorGroup, 
        "Drive the active inlet cowl against immense hypersonic dynamic pressure (Q).", 
        4, ["Active Inlet Cowl", "Waverider Main Body"], 
        "Cowl locks in place, inability to adapt to Mach number changes.", 
        ["Engine Unstart", "Vehicle Disintegration"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: -15, z: -15}
    );
    animationTargets.pistons = pistonTargets;

    // 5. ISOLATOR DUCT
    const isolatorShape = new THREE.Shape();
    isolatorShape.moveTo(-18, -2);
    isolatorShape.lineTo(18, -2);
    isolatorShape.lineTo(18, 2);
    isolatorShape.lineTo(-18, 2);
    isolatorShape.lineTo(-18, -2);
    const isolatorGeom = new THREE.ExtrudeGeometry(isolatorShape, { depth: 22, bevelEnabled: false });
    const isolatorMesh = new THREE.Mesh(isolatorGeom, scramjetCombustorMat);
    isolatorMesh.rotation.y = Math.PI / 2;
    isolatorMesh.position.set(15, -7, -11);
    
    addPart("Isolator Duct", 
        "Constant-area section containing the pre-combustion shock train.", 
        "Ceramic Matrix Composite", isolatorMesh, 
        "Contains the internal shock train, preventing combustor pressure rise (back-pressure) from propagating forward and unstarting the inlet.", 
        5, ["Scramjet Inlet Cowl", "Supersonic Combustor"], 
        "Shock boundary layer interaction failure.", 
        ["Flameout", "Thermal Choke"], 
        {x: 15, y: -7, z: -11}, {x: 15, y: -30, z: 0}
    );

    // 6. SUPERSONIC COMBUSTOR
    const combustorGeom = new THREE.BoxGeometry(30, 5, 22);
    const combustorMesh = new THREE.Mesh(combustorGeom, ablativeHeatShield);
    combustorMesh.position.set(35, -7, 0);
    
    addPart("Supersonic Combustor", 
        "Diverging channel with integral cavity flameholders.", 
        "Ablative Heat Shield / C-C", combustorMesh, 
        "Mixes and ignites supercritical hydrogen fuel into the supersonic freestream in fractions of a millisecond.", 
        6, ["Isolator Duct", "Fuel Injection Struts", "Expansion Nozzle"], 
        "Thermal choke or complete flame blowout.", 
        ["Loss of Thrust", "Catastrophic Explosion"], 
        {x: 35, y: -7, z: 0}, {x: 35, y: -40, z: 0}
    );

    // 7. FUEL INJECTION STRUTS
    const strutGroup = new THREE.Group();
    for (let i = -4; i <= 4; i++) {
        const strutGeom = new THREE.CylinderGeometry(0.3, 0.6, 4.8, 32);
        const strut = new THREE.Mesh(strutGeom, copper);
        strut.position.set(22, -7, i * 2.2);
        
        // Micro-nozzles
        for (let j = -2; j <= 2; j+=1.5) {
            const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), steel);
            nozzle.rotation.z = -Math.PI/2;
            nozzle.position.set(0.4, j, 0);
            strut.add(nozzle);
        }
        strutGroup.add(strut);
    }
    addPart("Fuel Injection Struts", 
        "Aerodynamic pylons laced with hundreds of micro-nozzles.", 
        "Copper Alloy / Inconel", strutGroup, 
        "Injects supercritical hydrogen directly into the supersonic flow. Placed strategically to generate turbulent mixing vortices.", 
        7, ["Supersonic Combustor"], 
        "Inadequate mixing; fuel passes through unburnt.", 
        ["Severe Thrust Loss", "Inefficiency"], 
        {x: 0, y: 0, z: 0}, {x: 20, y: -50, z: 0}
    );

    // 8. EXPANSION NOZZLE (SERN)
    const nozzleShape = new THREE.Shape();
    nozzleShape.moveTo(50, -9.5);
    nozzleShape.quadraticCurveTo(70, -3, 90, 8);
    nozzleShape.lineTo(90, -20);
    nozzleShape.lineTo(50, -20);
    nozzleShape.lineTo(50, -9.5);
    const nozzleGeom = new THREE.ExtrudeGeometry(nozzleShape, { depth: 22, bevelEnabled: false });
    const nozzleMesh = new THREE.Mesh(nozzleGeom, steel);
    nozzleMesh.rotation.y = Math.PI / 2;
    nozzleMesh.position.set(0, 0, -11);
    
    addPart("Single Expansion Ramp Nozzle (SERN)", 
        "Asymmetric exhaust expansion surface integrated seamlessly into the lower airframe.", 
        "High-Temp Steel / C-C", nozzleMesh, 
        "Expands supersonic exhaust gases to generate massive thrust. The asymmetric design also contributes to vehicle lift and pitch trim.", 
        8, ["Supersonic Combustor"], 
        "Flow separation from the ramp surface.", 
        ["Thrust Vector Misalignment", "Extreme Pitch Up Anomaly"], 
        {x: 0, y: 0, z: 0}, {x: 60, y: -30, z: 0}
    );

    // 9. PLASMA THRUST EXHAUST
    const exhaustGeom = new THREE.ConeGeometry(12, 60, 64);
    const exhaustMesh = new THREE.Mesh(exhaustGeom, plasmaMat);
    exhaustMesh.rotation.z = -Math.PI / 2;
    exhaustMesh.position.set(100, -6, 0);
    
    addPart("Scramjet Plume", 
        "Brilliant blue supersonic ionized exhaust plume.", 
        "Plasma / H2O Vapor", exhaustMesh, 
        "High-velocity exhaust generating the primary propulsive force. Pulses with supersonic combustion instabilities.", 
        9, ["Expansion Nozzle"], 
        "N/A", [], 
        {x: 100, y: -6, z: 0}, {x: 120, y: -6, z: 0}
    );
    animationTargets.exhaust = exhaustMesh;

    // 10. OBLIQUE SHOCKWAVE VISUALIZATION
    const shockGeom = new THREE.ConeGeometry(40, 140, 128, 1, true, 0, Math.PI);
    const shockMesh = new THREE.Mesh(shockGeom, shockwaveMat);
    shockMesh.rotation.z = Math.PI / 2;
    shockMesh.rotation.x = Math.PI; 
    shockMesh.position.set(10, 8, 0);
    
    addPart("Attached Oblique Shock", 
        "Supersonic compression wave envelope.", 
        "Compressed Air (Visualization)", shockMesh, 
        "Compresses freestream air prior to inlet entry. Must be precisely attached to the leading edge to prevent massive drag.", 
        10, ["Waverider Main Body"], 
        "Detachment creates a normal shock.", 
        ["Massive Drag", "Engine Unstart"], 
        {x: 10, y: 8, z: 0}, {x: 10, y: 30, z: 0}
    );
    animationTargets.shockwave = shockMesh;
    
    // 11. INTERNAL FLOW SHOCK TRAIN
    const internalShockGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
        const sGeom = new THREE.PlaneGeometry(4, 22);
        const sMesh = new THREE.Mesh(sGeom, plasmaMat);
        sMesh.rotation.y = Math.PI/2;
        sMesh.rotation.x = (i%2===0) ? Math.PI/6 : -Math.PI/6;
        sMesh.position.set(5 + i*3.5, -7, 0);
        internalShockGroup.add(sMesh);
    }
    addPart("Isolator Shock Train", 
        "Complex X-pattern shock reflections within the isolator.", 
        "Compressed Air/Plasma", internalShockGroup, 
        "Gradually decelerates the supersonic flow and increases static pressure without causing a highly lossy normal shock.", 
        11, ["Isolator Duct"], 
        "Shock boundary layer interaction causes boundary layer separation.", 
        ["Engine Choke"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 30}
    );
    animationTargets.shockTrain = internalShockGroup;

    // 12. ACTIVE REGENERATIVE COOLING CHANNELS
    const coolingGroup = new THREE.Group();
    for (let i = -10; i <= 10; i+=1.5) {
        const points = [];
        for (let x = -50; x <= 50; x+=4) {
            points.push(new THREE.Vector3(x, height * Math.pow((x+60)/120, 0.6) - 1.5, i + Math.sin(x/4)*0.5));
        }
        const pipe = createPipe(points, 0.2, 128, 12, activeCoolingMat);
        coolingGroup.add(pipe);
    }
    addPart("Regenerative Cooling Network", 
        "Thousands of micro-channel heat exchangers woven into the airframe.", 
        "Copper/Inconel", coolingGroup, 
        "Circulates cryogenic hydrogen fuel around the combustor and airframe before injection, preventing thermal destruction and pre-heating the fuel.", 
        12, ["Waverider Main Body", "Supersonic Combustor"], 
        "Coolant leak or blockage.", 
        ["Melt Through", "Catastrophic Explosion"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: 40, z: 0}
    );
    animationTargets.cooling = activeCoolingMat; 

    // 13. QUANTUM FLIGHT CONTROLLER
    const avionicsGeom = new THREE.BoxGeometry(6, 3, 8);
    const avionicsMesh = new THREE.Mesh(avionicsGeom, glowingBlue);
    avionicsMesh.position.set(-25, 6, 0);
    
    // Adding intricate circuit board details to the avionics
    for(let k=0; k<20; k++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), chrome);
        chip.position.set((Math.random()-0.5)*5, 1.6, (Math.random()-0.5)*7);
        avionicsMesh.add(chip);
    }
    
    addPart("Hypersonic Avionics Core", 
        "Triple-redundant quantum flight controller.", 
        "Silicon/Gold/Glass/Sapphire", avionicsMesh, 
        "Processes millions of sensor inputs per millisecond to continuously morph the airframe and actuate the cowl to maintain shock attachment in turbulent atmospheric density.", 
        13, ["Actuator Network", "Cooling Network"], 
        "Computation lag or radiation single-event upset.", 
        ["Loss of Control", "Vehicle Disintegration"], 
        {x: -25, y: 6, z: 0}, {x: -25, y: 50, z: 0}
    );

    // 14. LEADING EDGE SENSOR ARRAY
    const sensorGroup = new THREE.Group();
    for (let i = -20; i <= 20; i+=2) {
        const probeGeom = new THREE.CylinderGeometry(0.08, 0.08, 3, 16);
        const probe = new THREE.Mesh(probeGeom, steel);
        probe.rotation.z = Math.PI / 2;
        probe.position.set(-58, 0, i);
        
        const tipGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const tip = new THREE.Mesh(tipGeom, glowingOrange);
        tip.position.set(-1.5, 0, 0);
        probe.add(tip);
        
        sensorGroup.add(probe);
    }
    addPart("Pitot-Static & Flush Air Data Probes", 
        "Advanced pressure/temperature sensor array lining the leading edge.", 
        "Iridium/Platinum Alloys", sensorGroup, 
        "Measures Mach number, angle of attack, and dynamic pressure immediately behind the bow shock.", 
        14, ["Waverider Main Body", "Avionics Core"], 
        "Probe ablation due to extreme hypersonic heating.", 
        ["Erroneous Data", "Control Failure"], 
        {x: 0, y: 0, z: 0}, {x: -80, y: 0, z: 0}
    );

    // 15. TRAILING EDGE ELEVONS
    const elevonGroup = new THREE.Group();
    const elevonTargets = [];
    for (let i = -1; i <= 1; i+=2) {
        const elevonGeom = new THREE.BoxGeometry(15, 1.5, 20);
        const elevon = new THREE.Mesh(elevonGeom, darkSteel);
        elevon.position.set(55, -2, i * 15);
        elevon.geometry.translate(7.5, 0, 0); // Pivot at the hinge line
        elevonGroup.add(elevon);
        elevonTargets.push(elevon);
    }
    addPart("Morphing Elevons", 
        "Aerodynamic control surfaces formed from flexible composites.", 
        "Carbon-Carbon", elevonGroup, 
        "Provides pitch and roll control. At hypersonic speeds, even tiny deflections produce massive forces.", 
        15, ["Waverider Main Body"], 
        "Actuator stall under high dynamic pressure.", 
        ["Loss of Pitch/Roll Authority"], 
        {x: 0, y: 0, z: 0}, {x: 80, y: 0, z: 0}
    );
    animationTargets.elevons = elevonTargets;

    // 16. PLASMA IGNITERS
    const igniterGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const igGeom = new THREE.SphereGeometry(0.8, 32, 32);
        const igMesh = new THREE.Mesh(igGeom, glowingBlue);
        igMesh.position.set(28 + i*4, -7, Math.sin(i)*6);
        igniterGroup.add(igMesh);
    }
    addPart("Laser Induced Plasma Igniters", 
        "Optical ignition system utilizing high-power lasers.", 
        "Synthetic Sapphire / Laser Emitters", igniterGroup, 
        "Focuses high-energy lasers to create plasma pockets, providing continuous, unblowable ignition sources in the Mach 3+ supersonic internal flow.", 
        16, ["Supersonic Combustor"], 
        "Laser misalignment or lens ablation.", 
        ["Combustion Blowout"], 
        {x: 0, y: 0, z: 0}, {x: 0, y: -20, z: 20}
    );
    animationTargets.igniters = igniterGroup;

    // 17. MASSIVE TELEMETRY DATA ARRAY (To ensure extreme complexity and realism)
    // Simulating thousands of internal sensors
    const telemetryNodes = [];
    for(let t=0; t<200; t++) {
        telemetryNodes.push({
            id: `NODE-${1000+t}`,
            x: (Math.random()-0.5)*100,
            y: (Math.random()-0.5)*20,
            z: (Math.random()-0.5)*40,
            type: t % 3 === 0 ? 'THERMOCOUPLE' : (t % 3 === 1 ? 'STRAIN_GAUGE' : 'PRESSURE_TRANSDUCER'),
            baseline: Math.random() * 100
        });
    }

    // ============================================================================
    // PHD LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In a scramjet operating at Mach 8, what is the fundamental purpose of the 'isolator' duct located between the inlet and the supersonic combustor?",
            options: [
                "To accelerate the internal flow to even higher supersonic speeds before fuel injection to prevent auto-ignition.",
                "To house a pre-combustion shock train that prevents the immense back-pressure generated by heat addition from propagating forward and unstarting the inlet.",
                "To physically isolate the cryogenic liquid hydrogen fuel lines from the extreme conductive heat of the combustion chamber walls.",
                "To rapidly transition the flow from supersonic (Mach > 1) to subsonic (Mach < 1) via a strong normal shock for stable combustion."
            ],
            correctAnswer: 1,
            explanation: "The isolator provides a constant-area or slightly diverging duct where a complex 'shock train' (a series of oblique shocks) forms. This shock train acts as a buffer, accommodating the massive pressure rise caused by combustion (heat addition in a supersonic flow causes pressure to rise and Mach number to drop towards 1, known as thermal choking). Without the isolator, this back-pressure would push the inlet shock out of the engine, causing an 'unstart'."
        },
        {
            question: "Why does the waverider aerodynamic configuration fundamentally rely on maintaining 'shock attachment' at its leading edge across all hypersonic flight regimes?",
            options: [
                "Attached shocks generate maximum lift while strictly confining the high-pressure post-shock region to the lower aerodynamic surface, preventing 'leakage' to the upper surface.",
                "It eliminates all aerodynamic heating on the leading edge by pushing the stagnation point infinitely far away from the physical structure.",
                "It prevents the formation of an ionized plasma sheath, allowing GPS and radio communication to continue uninterrupted during flight.",
                "Attached shocks increase the boundary layer thickness exponentially, drastically reducing viscous skin friction drag."
            ],
            correctAnswer: 0,
            explanation: "A waverider is sculpted from the flowfield of a known shockwave. By ensuring the bow shock is precisely attached to its sharp leading edge, the vehicle traps the high pressure generated by the shock entirely beneath it. This prevents high-pressure air from wrapping around to the upper surface, allowing the vehicle to literally 'ride' its own shockwave and achieve exceptionally high lift-to-drag (L/D) ratios."
        },
        {
            question: "Scramjet combustion is often described as 'lighting a match in a hurricane'. Which fundamental fluid dynamics parameter dictates this extreme difficulty?",
            options: [
                "The incredibly low Reynolds number of the flow, which prevents turbulence and makes fuel mixing impossible.",
                "The flow residence time inside the combustor is on the order of a millisecond, requiring ultra-fast molecular mixing and chemical kinetic reaction rates.",
                "Diatomic oxygen (O2) completely dissociates into monatomic oxygen (O) at supersonic speeds, making standard hydrocarbon or hydrogen combustion reactions impossible.",
                "The immense static pressure inside the combustor physically crushes the injected fuel molecules, altering their chemical bonds."
            ],
            correctAnswer: 1,
            explanation: "Because the flow remains supersonic throughout the entire engine (Scramjet = Supersonic Combustion Ramjet), the air passes through the combustor incredibly fast. The residence time (time a particle spends in the combustor) is typically less than 1 millisecond. Mixing fuel and air, and completing the chemical combustion reactions within this minuscule time frame is exceptionally difficult."
        },
        {
            question: "How does the implementation of 'regenerative cooling' simultaneously solve both the catastrophic thermal management problem and the fuel preparation problem in a hypersonic vehicle?",
            options: [
                "By using incoming atmospheric air to cool the exhaust nozzle, which inadvertently generates additional thrust via the Meredith effect.",
                "By circulating cryogenic liquid fuel through micro-channels in the airframe, which absorbs structural heat and pre-heats the fuel to a supercritical state, drastically reducing ignition delay.",
                "By continuously venting unburned fuel out of the leading edge to create a protective, low-temperature boundary layer film.",
                "By using a massive, closed-loop liquid sodium cooling system similar to a fast-breeder nuclear reactor, and using the waste heat to power avionics."
            ],
            correctAnswer: 1,
            explanation: "Regenerative cooling routes extremely cold cryogenic fuel (like liquid hydrogen or methane) through thousands of tiny channels within the engine walls and airframe. This acts as a heat sink, preventing the materials from melting under extreme aerodynamic and combustion heating. Simultaneously, the absorbed heat drastically raises the fuel's temperature and energy, turning it into a supercritical fluid, which significantly improves mixing and combustion efficiency when finally injected into the scramjet."
        },
        {
            question: "What aerodynamic effect is being explicitly controlled by the dynamic morphing action of the 'Active Inlet Cowl' as the vehicle accelerates from Mach 5 to Mach 10?",
            options: [
                "The magnitude of viscous skin friction drag generated on the expansive upper wing surface.",
                "The 'shock-on-lip' condition, ensuring the oblique shock generated by the vehicle forebody intersects the engine cowl exactly, maximizing mass capture and preventing spillage.",
                "The expansion area ratio of the exhaust nozzle, preventing flow over-expansion at high altitudes.",
                "The formation of strong leading-edge vortices to generate non-linear lift over the delta wing planform."
            ],
            correctAnswer: 1,
            explanation: "As Mach number increases, the angle of the oblique shock generated by the forebody becomes shallower (lies closer to the body). If the inlet cowl were fixed, at high Mach, the shock would fall inside the inlet (swallowed shock, inefficient), and at low Mach, it would fall outside (air spillage, loss of thrust). The active cowl moves to keep the shock precisely intersecting its leading edge ('shock-on-lip'), capturing the exact design mass flow."
        }
    ];

    const description = "The Ultra God Tier Morphing Scramjet Airfoil is an uncompromising, hyper-realistic conceptual model of a hypersonic waverider powered by a supersonic combustion ramjet (scramjet). Constructed from active metamaterials, the airframe continuously morphs to maintain optimal shock attachment and lift-to-drag ratio across a wide Mach regime (Mach 5 to 15+). Internally, regenerative cooling channels circulate cryogenic hydrogen, acting as a heat sink for the immense aerodynamic heating while pre-conditioning the fuel into a supercritical state. The highly complex inlet duct utilizes active cowl articulation driven by massive hydraulic actuators to guarantee 'shock-on-lip' mass capture. This feeds the isolator duct, which manages the pre-combustion shock train, and the supersonic combustor, where laser-induced plasma ensures ignition in milliseconds. The massive Single Expansion Ramp Nozzle (SERN) at the rear expands the ionized plasma exhaust to generate extreme thrust while providing necessary aerodynamic pitch trim.";

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    let machNumber = 5;
    let timeAccumulator = 0;

    function animate(time, speed, meshes) {
        timeAccumulator += speed * 0.05;
        
        // 1. SIMULATE FLIGHT ENVELOPE (Mach number oscillates between 5 and 12)
        machNumber = 8.5 + Math.sin(timeAccumulator * 0.15) * 3.5;
        
        // 2. SHOCKWAVE ATTACHMENT & ANGLE
        if (animationTargets.shockwave) {
            // As Mach increases, shock angle decreases (gets closer to the body). Approx relation for weak shock.
            const shockAngleFactor = 1 / (machNumber * 0.25);
            animationTargets.shockwave.scale.set(1, 1 + (12 - machNumber)*0.3, 1 + (12 - machNumber)*0.1);
            // Pulsing opacity based on dynamic pressure fluctuations
            animationTargets.shockwave.material.opacity = 0.4 + 0.3 * Math.abs(Math.sin(timeAccumulator * 4));
        }

        // 3. ACTIVE INLET COWL ACTUATION (Shock-on-Lip maintenance)
        if (animationTargets.cowl) {
            // Cowl opens wider at lower Mach, closes down at high Mach
            const targetCowlRot = (machNumber - 5) * 0.04; 
            animationTargets.cowl.rotation.z = -targetCowlRot;
            
            // Move hydraulic pistons to match
            if (animationTargets.pistons) {
                animationTargets.pistons.forEach(pist => {
                    pist.position.y = -6 + (targetCowlRot * 18);
                });
            }
        }

        // 4. SCRAMJET EXHAUST PLUME
        if (animationTargets.exhaust) {
            // Plume length and width vary with thrust
            const thrustFactor = Math.pow(machNumber / 5, 1.8);
            animationTargets.exhaust.scale.set(
                thrustFactor + Math.random()*0.15, 
                thrustFactor * 1.5 + Math.random()*0.3, 
                thrustFactor + Math.random()*0.15
            );
            animationTargets.exhaust.material.emissiveIntensity = 2 + 3 * thrustFactor * Math.abs(Math.sin(timeAccumulator * 12));
        }

        // 5. ISOLATOR SHOCK TRAIN (Combustion Back-Pressure Sim)
        if (animationTargets.shockTrain) {
            // Shock train moves forward and backward
            const backPressurePos = Math.sin(timeAccumulator * 1.5) * 3;
            animationTargets.shockTrain.position.x = backPressurePos;
            
            // Rapid flickering and angle shifting of the shock diamonds
            animationTargets.shockTrain.children.forEach((mesh, index) => {
                mesh.material.opacity = 0.5 + 0.5 * Math.random();
                const baseAngle = (index%2===0) ? Math.PI/6 : -Math.PI/6;
                mesh.rotation.x = baseAngle + (Math.random() - 0.5) * 0.1;
            });
        }

        // 6. REGENERATIVE COOLING THERMAL PULSE
        if (animationTargets.cooling) {
            // Simulate extreme heat load as Mach increases
            const heatIntensity = Math.max(0, (machNumber - 6) / 6); 
            animationTargets.cooling.emissive.setHex(0xff2200);
            animationTargets.cooling.emissiveIntensity = heatIntensity * (0.5 + 0.5 * Math.sin(timeAccumulator * 10));
        }

        // 7. HIGH-FREQUENCY ELEVON FLUTTER & TRIM
        if (animationTargets.elevons) {
            const trim = Math.sin(timeAccumulator * 0.3) * 0.15;
            const flutter = Math.sin(timeAccumulator * 25) * 0.02;
            animationTargets.elevons[0].rotation.z = trim + flutter; // Left
            animationTargets.elevons[1].rotation.z = trim - flutter; // Right (differential)
        }

        // 8. LASER PLASMA IGNITER STROBING
        if (animationTargets.igniters) {
            animationTargets.igniters.children.forEach((mesh, index) => {
                const isOn = Math.sin(timeAccumulator * 40 + index * 1.5) > 0.6;
                mesh.material.emissiveIntensity = isOn ? 12 : 1;
                mesh.scale.setScalar(isOn ? 1.4 : 1.0);
            });
        }
        
        // 9. METAMATERIAL SCALES MORPHING (InstancedMesh Wave Equation)
        if (animationTargets.scales) {
            const { mesh, data, count } = animationTargets.scales;
            const waveSpeed = timeAccumulator * 8;
            
            // Create a complex interference pattern of morphing
            for (let i = 0; i < count; i++) {
                const xNorm = data[i * 3];
                const yBase = data[i * 3 + 1];
                const zNorm = data[i * 3 + 2];
                
                const ripple1 = Math.sin(xNorm * 25 - waveSpeed) * Math.cos(zNorm * 12) * 0.3;
                const ripple2 = Math.sin(xNorm * 15 + zNorm * 20 - waveSpeed * 1.5) * 0.15;
                const totalRipple = ripple1 + ripple2;
                
                mesh.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                
                // Active aeroelastic morphing (breathing effect)
                dummy.scale.set(1, 1 + Math.abs(totalRipple), 1);
                
                // Very subtle rotation changes based on the wave gradient to redirect local flow
                const pitchChange = Math.cos(xNorm * 25 - waveSpeed) * 0.1;
                dummy.rotation.z = (Math.PI / 24 * xNorm) + pitchChange;
                
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
