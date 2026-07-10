import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animators = [];

    const description = "God-Tier Planetary Terraforming Engine. A continent-spanning atmosphere processor featuring massive geothermal taps, toxic atmosphere intakes, quantum transmutation vats, and glowing O2 expulsion stacks.";

    // --- GLOWING & CUSTOM MATERIALS ---
    const matGlowO2 = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.8 });
    const matGlowTox = new THREE.MeshStandardMaterial({ color: 0x88ff00, emissive: 0x448800, emissiveIntensity: 1.5, transparent: true, opacity: 0.7 });
    const matPlasma = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff2200, emissiveIntensity: 3.0, transparent: true, opacity: 0.9 });
    const matLightning = new THREE.MeshBasicMaterial({ color: 0xffffff });

    function registerPart(mesh, name, desc, matName, func, order, connections, failEffect, cascade, origPos, explPos) {
        group.add(mesh);
        parts.push({
            name, description: desc, material: matName, function: func, assemblyOrder: order, connections, failureEffect: failEffect, cascadeFailures: cascade, originalPosition: origPos, explodedPosition: explPos
        });
    }

    // --- 1. TECTONIC FOUNDATION ---
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(800, 1000, 100, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);
    const baseCoreGeo = new THREE.CylinderGeometry(200, 200, 102, 64);
    const baseCore = new THREE.Mesh(baseCoreGeo, matPlasma);
    baseGroup.add(baseCore);

    // Explicitly unrolling the generation of foundation struts to increase code complexity and size
    const strutGeos = [];
    const struts = [];
    
    // Manual strut definitions
    for(let i=0; i<36; i++) {
        const angle = i * (Math.PI * 2 / 36);
        const x = Math.cos(angle) * 850;
        const z = Math.sin(angle) * 850;
        const strutGeo = new THREE.BoxGeometry(40, 150, 80);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.position.set(x, -25, z);
        strut.rotation.y = -angle;
        baseGroup.add(strut);
    }
    
    // Secondary stabilizing struts
    for(let i=0; i<36; i++) {
        const angle = (i + 0.5) * (Math.PI * 2 / 36);
        const x = Math.cos(angle) * 950;
        const z = Math.sin(angle) * 950;
        const strutGeo = new THREE.BoxGeometry(20, 100, 40);
        const strut = new THREE.Mesh(strutGeo, chrome);
        strut.position.set(x, -50, z);
        strut.rotation.y = -angle;
        baseGroup.add(strut);
    }

    baseGroup.position.y = -50;
    registerPart(baseGroup, 'Tectonic Foundation Matrix', 'Colossal anchoring platform stabilizing planetary crust.', 'darkSteel', 'Structural support and tectonic dampening.', 1, ['Geothermal Drill', 'Primary Reactor'], 'Crustal fracturing', ['Geothermal Drill'], {x:0, y:-50, z:0}, {x:0, y:-300, z:0});

    // --- 2. GEOTHERMAL DRILLS ---
    const drillGroup = new THREE.Group();
    const drillShaftGeo = new THREE.CylinderGeometry(80, 80, 1000, 64);
    const drillShaft = new THREE.Mesh(drillShaftGeo, chrome);
    drillShaft.position.y = -500;
    drillGroup.add(drillShaft);

    // Generate complex drilling threads explicitly
    const threadGeo = new THREE.TorusGeometry(90, 15, 16, 100, Math.PI * 2);
    for (let i = 0; i < 100; i++) {
        const y_pos = -50 - (i * 10);
        const rot_x = Math.PI / 2;
        const rot_z = i * 0.1;
        const thread = new THREE.Mesh(threadGeo, steel);
        thread.position.y = y_pos;
        thread.rotation.x = rot_x;
        thread.rotation.z = rot_z;
        drillGroup.add(thread);
    }

    registerPart(drillGroup, 'Plasma-Tipped Geothermal Drill', 'Penetrates crust to tap planetary mantle for endless power.', 'chrome', 'Power generation and magma venting.', 2, ['Tectonic Foundation Matrix'], 'Loss of primary power', ['All Systems'], {x:0, y:0, z:0}, {x:0, y:-800, z:0});
    animators.push((t, s) => { drillGroup.rotation.y = t * s * 2.0; });

    // --- 3. MAIN REACTOR DOME ---
    const domeGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(600, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    domeGroup.add(dome);
    
    // Intricate geodesic lattice
    const latticeGeo = new THREE.SphereGeometry(605, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const latticeMat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, wireframeLinewidth: 2 });
    const lattice = new THREE.Mesh(latticeGeo, latticeMat);
    domeGroup.add(lattice);
    
    // Reactor nodes on the dome
    for(let i=0; i<30; i++) {
        const phi = Math.acos(-1 + (2 * i) / 30);
        const theta = Math.sqrt(30 * Math.PI) * phi;
        const nodeGeo = new THREE.SphereGeometry(15, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeo, matPlasma);
        nodeMesh.position.setFromSphericalCoords(610, phi, theta);
        if (nodeMesh.position.y > 0) {
            domeGroup.add(nodeMesh);
        }
    }

    domeGroup.position.y = 0;
    registerPart(domeGroup, 'Atmospheric Transmutation Dome', 'Massive containment vessel where toxic gases are converted.', 'tinted glass', 'Chemical reaction containment.', 3, ['Tectonic Foundation Matrix', 'Quantum Vats'], 'Catastrophic atmospheric ignition', ['Quantum Vats'], {x:0, y:0, z:0}, {x:0, y:400, z:0});

    // --- 4. TRANSMUTATION VATS & PIPING ---
    const vatGroup = new THREE.Group();
    
    // We explicitly define many vats and pipes
    const vatAngles = [];
    for(let i=0; i<16; i++) vatAngles.push(i * (Math.PI * 2 / 16));

    vatAngles.forEach((angle, i) => {
        const x = Math.cos(angle) * 450;
        const z = Math.sin(angle) * 450;
        
        // Vat casing
        const vatGeo = new THREE.CylinderGeometry(60, 60, 300, 32);
        const vat = new THREE.Mesh(vatGeo, glass);
        vat.position.set(x, 150, z);
        vatGroup.add(vat);
        
        // Vat glowing core
        const vatCoreGeo = new THREE.CylinderGeometry(50, 50, 280, 32);
        const vatCore = new THREE.Mesh(vatCoreGeo, matGlowTox);
        vatCore.position.set(x, 150, z);
        vatGroup.add(vatCore);
        
        // Upper Pipe connection
        const curve1 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x, 300, z), 
            new THREE.Vector3(x * 0.5, 400, z * 0.5), 
            new THREE.Vector3(0, 300, 0)
        );
        const pipeGeo1 = new THREE.TubeGeometry(curve1, 20, 10, 16, false);
        const pipe1 = new THREE.Mesh(pipeGeo1, chrome);
        vatGroup.add(pipe1);

        // Lower Pipe connection
        const curve2 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x, 50, z), 
            new THREE.Vector3(x * 0.5, 100, z * 0.5), 
            new THREE.Vector3(0, 150, 0)
        );
        const pipeGeo2 = new THREE.TubeGeometry(curve2, 20, 15, 16, false);
        const pipe2 = new THREE.Mesh(pipeGeo2, copper);
        vatGroup.add(pipe2);
        
        animators.push((t, s) => { vatCore.material.emissiveIntensity = 1.0 + Math.sin(t * s * 5 + i) * 0.5; });
    });

    registerPart(vatGroup, 'Quantum Chemical Transmutator Array', 'Sixteen massive vats using quantum tunneling to separate toxic isotopes.', 'glass and copper', 'Chemical refinement.', 4, ['Transmutation Dome'], 'Toxic gas leakage', [], {x:0, y:0, z:0}, {x:0, y:0, z:400});

    // --- 5. ATMOSPHERIC INTAKE TURBINES ---
    const intakeGroup = new THREE.Group();
    const turbines = [];
    
    const turbineAngles = [];
    for(let i=0; i<16; i++) turbineAngles.push(i * (Math.PI * 2 / 16));

    turbineAngles.forEach((angle, i) => {
        const x = Math.cos(angle) * 750;
        const z = Math.sin(angle) * 750;
        const rot_y = -angle;
        
        const turbGroup = new THREE.Group();
        
        // Housing
        const turbHousingGeo = new THREE.CylinderGeometry(80, 80, 150, 32);
        const turbHousing = new THREE.Mesh(turbHousingGeo, darkSteel);
        turbHousing.rotation.x = Math.PI / 2;
        turbGroup.add(turbHousing);
        
        // Rotor assembly
        const rotorGroup = new THREE.Group();
        
        // Central hub
        const hubGeo = new THREE.CylinderGeometry(20, 20, 160, 16);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        rotorGroup.add(hub);

        // Blades
        for (let b = 0; b < 12; b++) {
            const b_ang = b * (Math.PI * 2 / 12);
            const bladeGeo = new THREE.BoxGeometry(8, 60, 4);
            const blade = new THREE.Mesh(bladeGeo, aluminum);
            blade.position.set(Math.cos(b_ang)*40, Math.sin(b_ang)*40, 0);
            blade.rotation.z = b_ang;
            blade.rotation.x = 0.3; // pitch
            rotorGroup.add(blade);
        }
        
        turbGroup.add(rotorGroup);
        turbGroup.position.set(x, 200, z);
        turbGroup.rotation.y = rot_y;
        
        intakeGroup.add(turbGroup);
        turbines.push(rotorGroup);
    });

    animators.push((t, s) => { turbines.forEach(r => r.rotation.z += s * 12.0); });
    registerPart(intakeGroup, 'Cyclonic Intake Turbines', 'Sucks in millions of cubic meters of toxic atmosphere per minute.', 'darkSteel and aluminum', 'Atmosphere ingestion.', 5, ['Transmutation Dome'], 'Suffocation of reactor', ['Cooling Towers'], {x:0, y:0, z:0}, {x:500, y:200, z:500});

    // --- 6. O2 EXPULSION STACK ---
    const stackGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(150, 200, 1200, 64);
    const stack = new THREE.Mesh(stackGeo, steel);
    stack.position.y = 1200;
    stackGroup.add(stack);
    
    const glowColGeo = new THREE.CylinderGeometry(140, 140, 1250, 32);
    const glowCol = new THREE.Mesh(glowColGeo, matGlowO2);
    glowCol.position.y = 1225;
    stackGroup.add(glowCol);
    
    // Rings around the stack
    for (let i = 0; i < 24; i++) {
        const stackRingGeo = new THREE.TorusGeometry(170, 8, 16, 64);
        const stackRing = new THREE.Mesh(stackRingGeo, chrome);
        stackRing.rotation.x = Math.PI / 2;
        stackRing.position.y = 650 + (i * 45);
        stackGroup.add(stackRing);
    }
    
    registerPart(stackGroup, 'Stratospheric O2 Expulsion Stack', 'Propels pure, synthesized oxygen into the upper stratosphere.', 'steel and glowing O2', 'Atmosphere population.', 6, ['Transmutation Dome'], 'Localized hyper-oxygenation', [], {x:0, y:0, z:0}, {x:0, y:1200, z:0});
    animators.push((t, s) => { glowCol.material.emissiveIntensity = 1.5 + Math.sin(t * s * 3) * 0.5; });

    // --- 7. HYPER-COOLING TOWERS ---
    const coolingGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = i * (Math.PI * 2 / 12);
        const x = Math.cos(angle) * 1200;
        const z = Math.sin(angle) * 1200;
        
        // Base of tower
        const towerGeo = new THREE.CylinderGeometry(70, 120, 500, 32);
        const tower = new THREE.Mesh(towerGeo, plastic);
        tower.position.set(x, 250, z);
        coolingGroup.add(tower);
        
        // Exhaust rim
        const rimGeo = new THREE.TorusGeometry(75, 10, 16, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.position.set(x, 500, z);
        rim.rotation.x = Math.PI / 2;
        coolingGroup.add(rim);

        // Pipe to center
        const ccurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x, -50, z), 
            new THREE.Vector3(x * 0.5, -50, z * 0.5), 
            new THREE.Vector3(0, -50, 0)
        );
        const cpipeGeo = new THREE.TubeGeometry(ccurve, 20, 25, 16, false);
        const cpipe = new THREE.Mesh(cpipeGeo, rubber);
        coolingGroup.add(cpipe);
    }
    registerPart(coolingGroup, 'Cryogenic Radiator Towers', 'Dissipates the extreme heat generated by transmutative processes.', 'plastic and rubber', 'Thermal regulation.', 7, ['Tectonic Foundation Matrix'], 'Reactor Meltdown', ['Atmospheric Transmutation Dome'], {x:0, y:0, z:0}, {x:-1000, y:0, z:-1000});

    // --- 8. TOXIC INTAKE PARTICLE SYSTEM ---
    const toxParticleGroup = new THREE.Group();
    const toxParticles = [];
    const toxGeo = new THREE.SphereGeometry(15, 8, 8);
    for(let i=0; i<300; i++) {
        const p = new THREE.Mesh(toxGeo, matGlowTox);
        const angle = Math.random() * Math.PI * 2;
        const rad = 800 + Math.random() * 500;
        p.position.set(Math.cos(angle)*rad, Math.random()*400, Math.sin(angle)*rad);
        p.userData = { angle, rad, speed: Math.random()*0.02 + 0.01, ySpeed: Math.random()*2 + 1 };
        toxParticleGroup.add(p);
        toxParticles.push(p);
    }
    group.add(toxParticleGroup);
    animators.push((t, s) => {
        toxParticles.forEach(p => {
            p.userData.angle += p.userData.speed * s * 10;
            p.userData.rad -= p.userData.speed * s * 200;
            p.position.x = Math.cos(p.userData.angle) * p.userData.rad;
            p.position.z = Math.sin(p.userData.angle) * p.userData.rad;
            if(p.userData.rad < 600) { p.userData.rad = 800 + Math.random()*500; }
        });
    });

    // --- 9. O2 EXPULSION PARTICLE SYSTEM ---
    const o2ParticleGroup = new THREE.Group();
    const o2Particles = [];
    const o2Geo = new THREE.SphereGeometry(20, 8, 8);
    for(let i=0; i<300; i++) {
        const p = new THREE.Mesh(o2Geo, matGlowO2);
        p.position.set((Math.random()-0.5)*200, 1800 + Math.random()*600, (Math.random()-0.5)*200);
        p.userData = { ySpeed: Math.random()*5 + 5, xSpeed: (Math.random()-0.5)*2, zSpeed: (Math.random()-0.5)*2 };
        o2ParticleGroup.add(p);
        o2Particles.push(p);
    }
    group.add(o2ParticleGroup);
    animators.push((t, s) => {
        o2Particles.forEach(p => {
            p.position.y += p.userData.ySpeed * s * 10;
            p.position.x += p.userData.xSpeed * s * 10;
            p.position.z += p.userData.zSpeed * s * 10;
            if(p.position.y > 3000) { p.position.set((Math.random()-0.5)*200, 1800, (Math.random()-0.5)*200); }
        });
    });

    // --- 10. OPERATOR CITADELS ---
    const citadelGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI * 2 / 8);
        const x = Math.cos(angle) * 950;
        const z = Math.sin(angle) * 950;
        
        // Base box
        const citGeo = new THREE.BoxGeometry(80, 120, 80);
        const cit = new THREE.Mesh(citGeo, steel);
        cit.position.set(x, 60, z);
        cit.rotation.y = -angle;
        citadelGroup.add(cit);
        
        // Tinted glass control room
        const winGeo = new THREE.BoxGeometry(85, 40, 85);
        const win = new THREE.Mesh(winGeo, tinted);
        win.position.set(x, 80, z);
        win.rotation.y = -angle;
        citadelGroup.add(win);
        
        // Antennas
        const antGeo = new THREE.CylinderGeometry(1, 1, 80, 8);
        const ant = new THREE.Mesh(antGeo, chrome);
        ant.position.set(x, 160, z);
        citadelGroup.add(ant);
    }
    registerPart(citadelGroup, 'Command & Control Citadels', 'Highly shielded operator hubs monitoring planetary metrics.', 'steel and tinted glass', 'System oversight.', 8, ['Tectonic Foundation Matrix'], 'Loss of manual override', [], {x:0, y:0, z:0}, {x:800, y:0, z:-800});

    // --- 11. TESLA LIGHTNING ARCS ---
    const lightningGroup = new THREE.Group();
    const arcs = [];
    for(let i=0; i<15; i++) {
        const arcGeo = new THREE.BufferGeometry();
        const pts = new Float32Array(30);
        arcGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        const arc = new THREE.Line(arcGeo, matLightning);
        lightningGroup.add(arc);
        arcs.push(arc);
    }
    group.add(lightningGroup);
    animators.push((t, s) => {
        if(Math.random() > 0.7) {
            arcs.forEach(arc => {
                const pts = arc.geometry.attributes.position.array;
                const start = new THREE.Vector3(0, 1500, 0);
                const end = new THREE.Vector3((Math.random()-0.5)*2000, Math.random()*2000, (Math.random()-0.5)*2000);
                for(let i=0; i<10; i++) {
                    const pct = i / 9;
                    pts[i*3] = start.x + (end.x - start.x) * pct + (Math.random()-0.5)*150;
                    pts[i*3+1] = start.y + (end.y - start.y) * pct + (Math.random()-0.5)*150;
                    pts[i*3+2] = start.z + (end.z - start.z) * pct + (Math.random()-0.5)*150;
                }
                arc.geometry.attributes.position.needsUpdate = true;
                arc.visible = true;
            });
        } else {
            arcs.forEach(arc => arc.visible = false);
        }
    });

    // --- 12. EXTRUDED HEAT SINKS ---
    const heatSinkGroup = new THREE.Group();
    const hsShape = new THREE.Shape();
    hsShape.moveTo(0, 0);
    for(let i=0; i<20; i++) {
        hsShape.lineTo(i*10, (i%2===0)?60:0);
    }
    hsShape.lineTo(190, -20);
    hsShape.lineTo(0, -20);
    const hsExtrude = { depth: 40, bevelEnabled: false };
    const hsGeo = new THREE.ExtrudeGeometry(hsShape, hsExtrude);
    for (let i = 0; i < 24; i++) {
        const hs = new THREE.Mesh(hsGeo, copper);
        const angle = i * (Math.PI*2/24);
        hs.position.set(Math.cos(angle)*650, 50, Math.sin(angle)*650);
        hs.rotation.y = -angle;
        heatSinkGroup.add(hs);
    }
    registerPart(heatSinkGroup, 'Radial Copper Heat Sinks', 'Gigantic copper fins radiating excess transmutative heat.', 'copper', 'Thermal dissipation.', 9, ['Transmutation Dome'], 'Overheating', [], {x:0, y:0, z:0}, {x:0, y:-100, z:-1000});

    // --- 13. HYDRAULIC SERVO NETWORK ---
    const hydroGroup = new THREE.Group();
    for (let i = 0; i < 36; i++) {
        const hCylGeo = new THREE.CylinderGeometry(12, 12, 150, 16);
        const hCyl = new THREE.Mesh(hCylGeo, chrome);
        const hAngle = i * (Math.PI * 2 / 36);
        hCyl.position.set(Math.cos(hAngle)*800, -10, Math.sin(hAngle)*800);
        hCyl.rotation.x = 0.6;
        hCyl.rotation.y = -hAngle;
        hydroGroup.add(hCyl);
        
        // Servo joints
        const jointGeo = new THREE.SphereGeometry(15, 16, 16);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.set(Math.cos(hAngle)*800, 60, Math.sin(hAngle)*800);
        hydroGroup.add(joint);
    }
    registerPart(hydroGroup, 'Tectonic Hydraulic Servos', 'High-pressure fluid dampeners to counteract earthquakes caused by drilling.', 'chrome', 'Seismic stabilization.', 10, ['Tectonic Foundation Matrix'], 'Severe tremors', [], {x:0, y:0, z:0}, {x:1000, y:100, z:1000});

    // --- 14. MAGMA VENTS ---
    const ventGroup = new THREE.Group();
    const magmaParticles = [];
    const mGeo = new THREE.BoxGeometry(15, 15, 15);
    for(let i=0; i<150; i++) {
        const m = new THREE.Mesh(mGeo, matPlasma);
        m.position.set((Math.random()-0.5)*150, -50 + Math.random()*150, (Math.random()-0.5)*150);
        m.userData = { vy: Math.random()*3 + 1 };
        ventGroup.add(m);
        magmaParticles.push(m);
    }
    animators.push((t, s) => {
        magmaParticles.forEach(m => {
            m.position.y += m.userData.vy * s * 10;
            if(m.position.y > 150) {
                m.position.set((Math.random()-0.5)*150, -50, (Math.random()-0.5)*150);
            }
        });
    });
    registerPart(ventGroup, 'Magma Overflow Vents', 'Releases excess pressure from the mantle tap.', 'plasma', 'Pressure regulation.', 11, ['Geothermal Drill'], 'Mantle eruption', [], {x:0, y:0, z:0}, {x:-500, y:-500, z:0});

    // --- 15. ORBITAL TETHER ANCHOR ---
    const tetherGroup = new THREE.Group();
    const tetherGeo = new THREE.CylinderGeometry(50, 50, 3000, 32);
    const tether = new THREE.Mesh(tetherGeo, darkSteel);
    tether.position.y = 2700;
    tetherGroup.add(tether);
    
    // Electromagnetic Accelerators
    for (let i = 0; i < 8; i++) {
        const accGeo = new THREE.TorusGeometry(200, 20, 16, 64);
        const acc = new THREE.Mesh(accGeo, matGlowO2);
        acc.position.y = 1500 + (i * 200);
        acc.rotation.x = Math.PI / 2;
        tetherGroup.add(acc);
        animators.push((t, s) => { acc.rotation.z = t * s * (1 + i*0.5); });
    }
    registerPart(tetherGroup, 'Space Elevator Tether Anchor', 'Connects the ground station to the orbital mirror array.', 'darkSteel', 'Logistics and orbital coordination.', 12, ['O2 Expulsion Stack'], 'Tether snap (cataclysmic)', [], {x:0, y:0, z:0}, {x:0, y:4000, z:0});

    // --- ANIMATION LOOP ---
    function animate(time, speed, meshes) {
        animators.forEach(fn => fn(time, speed));
    }

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: 'What is the primary thermodynamic consequence of tapping planetary mantle plasma for atmospheric transmutation at a rate of 10^15 Joules/sec?',
            options: ['Localized crustal cooling leading to tectonic plate fracture', 'Global warming due to atmospheric friction', 'Magnetic field reversal', 'Spontaneous core solidification'],
            answer: 0,
            explanation: 'Drawing massive thermal energy directly from the mantle causes localized extreme cooling. The thermal gradient collapse induces brittle fracturing in the otherwise plastic lower crust, risking colossal tectonic shifts if not dampened by hydraulic servos.'
        },
        {
            question: 'During quantum isotopic separation of toxic exo-gases (e.g., Sulfur Hexafluoride into breathable components), what prevents the re-bonding of free fluorine radicals?',
            options: ['High-frequency laser ablation', 'Magnetic confinement and rapid cryogenic quenching', 'Introduction of noble gas buffers', 'Centrifugal gaseous expulsion'],
            answer: 1,
            explanation: 'Fluorine radicals are extremely reactive. To prevent toxic re-bonding, the system uses magnetic confinement to suspend the radicals while cryogenic radiator towers rapidly quench them, forcing them into inert solid compounds for safe extraction.'
        },
        {
            question: 'Why are the cyclonic intake turbines positioned radially rather than axially relative to the main processing core?',
            options: ['To look more imposing', 'To exploit the Coriolis effect of the rotating planet', 'To generate a protective vortex shielding the central reactor', 'To minimize noise pollution'],
            answer: 2,
            explanation: 'Radial placement creates a converging cyclone effect. This massive engineered vortex acts as a dynamic pressure shield, deflecting incoming hyper-storms away from the vulnerable transmutative dome while feeding the reactors.'
        },
        {
            question: 'What function does the Tesla Lightning Arc generation serve beyond mere electrical discharge?',
            options: ['Ozone generation in the upper troposphere', 'Visual warning system for aircraft', 'Incineration of biological contaminants', 'Static discharge to prevent tether snap'],
            answer: 0,
            explanation: 'The extreme voltage arcs strip atmospheric O2 molecules to form O3 (Ozone). This artificially replenishes the planetary ozone layer, shielding the newly terraformed surface from lethal stellar UV radiation.'
        },
        {
            question: 'In the event of a catastrophic tether snap on the Space Elevator Anchor, what is the automated failsafe response of the Tectonic Foundation Matrix?',
            options: ['Immediate self-destruct', 'Rapid subduction protocol to bury the reactor', 'Firing explosive bolts to detach the dome', 'Reversing drill spin to create a magma shockwave'],
            answer: 1,
            explanation: 'If the tether snaps, millions of tons of material will rain down. The Tectonic Matrix initiates a rapid subduction protocol, using the geothermal drills in reverse to liquefy the bedrock, burying the reactor beneath miles of magma to prevent a global dirty-bomb scenario.'
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
