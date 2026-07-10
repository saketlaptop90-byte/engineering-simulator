import os
import random

js_file_path = "C:/Users/Saket/OneDrive/Desktop/engineering-simulator/machines/god_tier_supersymmetry_particle_accelerator.js"

# Ensure directories exist
os.makedirs(os.path.dirname(js_file_path), exist_ok=True)

with open(js_file_path, "w", encoding="utf-8") as f:
    f.write("import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';\n\n")
    f.write("export function createMachine(THREE) {\n")
    f.write("    const group = new THREE.Group();\n")
    f.write("    const parts = [];\n")
    f.write("    const meshes = {};\n\n")
    
    f.write("    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });\n")
    f.write("    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 3 });\n")
    f.write("    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 4 });\n")
    f.write("    const greenScreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });\n\n")

    f.write('''
    function createTreadedTire() {
        const tireGroup = new THREE.Group();
        const torusGeo = new THREE.TorusGeometry(10, 3, 64, 128);
        const tireMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireMesh);

        const lugGeo = new THREE.BoxGeometry(1.5, 4, 2);
        for (let i = 0; i < 150; i++) {
            const theta = (i / 150) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const radius = 10;
            lug.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
            lug.rotation.z = theta;
            tireGroup.add(lug);
            
            if(i % 2 === 0) {
                const miniLug = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), rubber);
                miniLug.position.set(Math.cos(theta) * (radius-0.5), Math.sin(theta) * (radius-0.5), 2.5);
                miniLug.rotation.z = theta;
                tireGroup.add(miniLug);
                const miniLug2 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), rubber);
                miniLug2.position.set(Math.cos(theta) * (radius-0.5), Math.sin(theta) * (radius-0.5), -2.5);
                miniLug2.rotation.z = theta;
                tireGroup.add(miniLug2);
            }
        }
        
        const rimGeo = new THREE.CylinderGeometry(8, 8, 4, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 16, 16);
        for(let i=0; i<12; i++){
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            tireGroup.add(spoke);
            
            const subSpoke = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 8), steel);
            subSpoke.rotation.x = Math.PI / 2;
            subSpoke.rotation.z = (i / 12) * Math.PI * 2 + Math.PI/24;
            subSpoke.position.set(Math.cos(subSpoke.rotation.z)*4, Math.sin(subSpoke.rotation.z)*4, 0);
            tireGroup.add(subSpoke);
        }
        
        return tireGroup;
    }

    function createDipoleMagnetSegment(angleStart, angleEnd, radius, index) {
        const segGroup = new THREE.Group();
        
        const tubePath = new THREE.Curve();
        tubePath.getPoint = function (t) {
            const angle = angleStart + t * (angleEnd - angleStart);
            return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        };
        const mainTubeGeo = new THREE.TubeGeometry(tubePath, 128, 5, 32, false);
        const mainTube = new THREE.Mesh(mainTubeGeo, darkSteel);
        segGroup.add(mainTube);

        const steps = 30;
        for(let j=0; j<steps; j++) {
            const t = j / steps;
            const angle = angleStart + t * (angleEnd - angleStart);
            const pos = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            
            const collarGeo = new THREE.TorusGeometry(5.5, 0.5, 16, 64);
            const collar = new THREE.Mesh(collarGeo, steel);
            collar.position.copy(pos);
            collar.rotation.x = Math.PI/2;
            collar.rotation.y = angle;
            segGroup.add(collar);
            
            for (let p=0; p<4; p++) {
                const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
                const pipe = new THREE.Mesh(pipeGeo, copper);
                const pAngle = (p/4)*Math.PI*2;
                pipe.position.copy(pos);
                pipe.position.x += Math.cos(pAngle)*6;
                pipe.position.y += Math.sin(pAngle)*6;
                pipe.rotation.z = angle;
                segGroup.add(pipe);
            }
        }
        return segGroup;
    }
    ''')

    f.write("    // --- EXTREME PROCEDURAL GENERATION OF DETAILED COMPONENTS ---\n")
    f.write("    const ringRadius = 500;\n")
    
    for i in range(24):
        f.write(f"    const sector{i} = createDipoleMagnetSegment({i} * Math.PI/12, ({i}+1) * Math.PI/12, ringRadius, {i});\n")
        f.write(f"    group.add(sector{i});\n")
        f.write(f"    meshes.ringSector{i} = sector{i};\n")
        f.write("    parts.push({\n")
        f.write(f"        name: 'Superconducting_Dipole_Ring_Sector_{i+1}',\n")
        f.write(f"        description: 'Sector {i+1} of the massive accelerator ring.',\n")
        f.write("        material: 'DarkSteel/Copper',\n")
        f.write("        function: 'Bends the trajectories of the TeV protons.',\n")
        f.write(f"        assemblyOrder: {i+2},\n")
        f.write("        connections: ['Central_Collision_Chamber', 'Liquid_Helium_Piping_Network'],\n")
        f.write("        failureEffect: 'Beam dump failure, causing localized melting.',\n")
        f.write("        cascadeFailures: [],\n")
        f.write("        originalPosition: { x: 0, y: 0, z: 0 },\n")
        f.write(f"        explodedPosition: {{ x: Math.cos({i} * Math.PI/12 + Math.PI/24)*300, y: Math.sin({i} * Math.PI/12 + Math.PI/24)*300, z: -100 }}\n")
        f.write("    });\n\n")

    f.write('''
    const chamber = new THREE.Group();
    const points = [];
    for ( let i = 0; i < 40; i ++ ) { points.push( new THREE.Vector2( Math.sin( i * 0.1 ) * 15 + 5, ( i - 20 ) * 3 ) ); }
    const trackerGeo = new THREE.LatheGeometry( points, 128 );
    const tracker = new THREE.Mesh( trackerGeo, glass );
    chamber.add( tracker );
    
    const ecalShape = new THREE.Shape();
    ecalShape.absarc(0,0, 25, 0, Math.PI*2, false);
    const ecalHole = new THREE.Path();
    ecalHole.absarc(0,0, 22, 0, Math.PI*2, true);
    ecalShape.holes.push(ecalHole);
    const ecalGeo = new THREE.ExtrudeGeometry(ecalShape, { depth: 100, curveSegments: 64, bevelEnabled: true });
    const ecal = new THREE.Mesh(ecalGeo, copper);
    ecal.position.z = -50;
    chamber.add(ecal);

    const hcalGeo = new THREE.CylinderGeometry(35, 35, 120, 64, 1, true);
    const hcal = new THREE.Mesh(hcalGeo, darkSteel);
    hcal.rotation.x = Math.PI/2;
    chamber.add(hcal);

    for(let i=-6; i<=6; i++) {
        const muonGeo = new THREE.TorusGeometry(45, 4, 64, 128);
        const muon = new THREE.Mesh(muonGeo, aluminum);
        muon.position.z = i * 15;
        chamber.add(muon);
        
        for(let j=0; j<16; j++) {
            const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10), steel);
            strut.position.z = i * 15;
            const a = j * Math.PI/8;
            strut.position.x = Math.cos(a) * 40;
            strut.position.y = Math.sin(a) * 40;
            strut.rotation.z = a + Math.PI/2;
            chamber.add(strut);
        }
    }
    group.add(chamber);
    meshes.chamber = chamber;
    
    parts.push({
        name: 'Central_Collision_Chamber',
        description: 'Primary interaction point where counter-rotating beams are collided.',
        material: 'Glass/Copper/DarkSteel',
        function: 'Contains tracking detectors, ECAL, HCAL.',
        assemblyOrder: 1,
        connections: ['Superconducting_Dipole_Ring_Sector_1'],
        failureEffect: 'Loss of telemetry.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });
    ''')

    f.write('''
    const transporter = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-50, -20);
    chassisShape.lineTo(50, -20);
    chassisShape.lineTo(50, 20);
    chassisShape.lineTo(-50, 20);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 80, bevelEnabled: true });
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, 0, -40);
    transporter.add(chassis);
    meshes.transporterChassis = chassis;
    
    parts.push({
        name: 'Mobile_Magnet_Transporter_Chassis',
        description: 'Ultra-heavy chassis of the robotic gantry.',
        material: 'DarkSteel',
        function: 'Provides structural rigidity.',
        assemblyOrder: 30,
        connections: [],
        failureEffect: 'Gantry collapse.',
        cascadeFailures: [],
        originalPosition: { x: -600, y: 0, z: -50 },
        explodedPosition: { x: -800, y: 0, z: -100 }
    });

    const tirePositions = [
        { x: -45, y: -30, z: -20, name: 'FL' },
        { x: 45, y: -30, z: -20, name: 'FR' },
        { x: -45, y: 30, z: -20, name: 'RL' },
        { x: 45, y: 30, z: -20, name: 'RR' },
        { x: 0, y: -30, z: -20, name: 'ML' },
        { x: 0, y: 30, z: -20, name: 'MR' }
    ];
    
    tirePositions.forEach((pos, idx) => {
        const tire = createTreadedTire();
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.x = Math.PI / 2;
        tire.rotation.y = Math.PI / 2;
        transporter.add(tire);
        meshes[`transporterTire${pos.name}`] = tire;
        parts.push({
            name: `Transporter_Treaded_Tire_${pos.name}`,
            description: `Aggressive off-road treaded tire.`,
            material: 'Rubber/Chrome',
            function: 'Mobility.',
            assemblyOrder: 31 + idx,
            connections: ['Mobile_Magnet_Transporter_Chassis'],
            failureEffect: 'Loss of mobility.',
            cascadeFailures: [],
            originalPosition: { x: -600 + pos.x, y: pos.y, z: -50 + pos.z },
            explodedPosition: { x: -800 + pos.x*2, y: pos.y*2, z: -100 + pos.z*2 }
        });
    });
    
    transporter.position.set(-600, 0, -50);
    group.add(transporter);
    ''')

    for i in range(50):
        f.write(f'''
    const server{i} = new THREE.Mesh(new THREE.BoxGeometry(10, 40, 20), plastic);
    server{i}.position.set({50 + i*15}, -500, 0);
    for(let j=0; j<3; j++) {{
        const light = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), neonRed);
        light.position.set(5.1, -10 + j*10, 0);
        server{i}.add(light);
    }}
    group.add(server{i});
    meshes.server{i} = server{i};
    parts.push({{
        name: 'DAQ_Server_Rack_{i}',
        description: 'Data acquisition server rack {i}.',
        material: 'Plastic',
        function: 'Data processing.',
        assemblyOrder: {50 + i},
        connections: [],
        failureEffect: 'Data loss.',
        cascadeFailures: [],
        originalPosition: {{ x: {50 + i*15}, y: -500, z: 0 }},
        explodedPosition: {{ x: {50 + i*15}, y: -600, z: 50 }}
    }});
        ''')

    f.write('''
    const pCount = 5000;
    const instancedGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const particleMesh = new THREE.InstancedMesh(instancedGeo, neonBlue, pCount);
    for(let i=0; i<pCount; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(Math.random()*100 - 50, Math.random()*100 - 50, Math.random()*100 - 50);
        particleMesh.setMatrixAt(i, matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    group.add(particleMesh);
    meshes.beam = { count: pCount, mesh: particleMesh };

    const sCount = 500;
    const sGeo = new THREE.IcosahedronGeometry(2.0, 1);
    const sMesh = new THREE.InstancedMesh(sGeo, neonPurple, sCount);
    for(let i=0; i<sCount; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(0, 0, 0); 
        matrix.scale(new THREE.Vector3(0,0,0));
        sMesh.setMatrixAt(i, matrix);
    }
    sMesh.instanceMatrix.needsUpdate = true;
    group.add(sMesh);
    meshes.sparticles = { count: sCount, mesh: sMesh };

    const description = "The Ultra God Tier Supersymmetry Particle Accelerator. A monumental feat of engineering designed to probe the deepest structures of the universe at staggering energies.";

    const quizQuestions = [
        {
            question: "What is the fundamental mechanism by which R-parity conservation ensures the stability of the Lightest Supersymmetric Particle (LSP)?",
            options: [
                "It assigns R-parity +1 to all SM particles and -1 to all sparticles, making the decay of the LSP into SM particles kinematically and quantum-mechanically forbidden.",
                "It introduces a new unbroken gauge symmetry U(1)_R.",
                "It mandates that the LSP must be a fermion.",
                "It forces the LSP to decay via gravity only."
            ],
            correctAnswer: 0,
            explanation: "R-parity is defined as P_R = (-1)^(3B + L + 2s). Standard Model particles have P_R = +1, while SUSY particles have P_R = -1. If R-parity is exactly conserved, any interaction vertex must involve an even number of sparticles."
        },
        {
            question: "In the Minimal Supersymmetric Standard Model (MSSM), how many Higgs doublets are required to prevent gauge anomalies?",
            options: [
                "One doublet.",
                "Two doublets with opposite hypercharge (Y = +1/2 and Y = -1/2).",
                "Three doublets.",
                "Four doublets."
            ],
            correctAnswer: 1,
            explanation: "The MSSM requires two Higgs doublets. One gives mass to up-type quarks, and the other to down-type quarks and charged leptons. Two doublets with opposite hypercharge are necessary to cancel gauge anomalies."
        },
        {
            question: "Which soft supersymmetry-breaking parameter primarily determines the mass splitting between the top quark and the scalar top (stop) squarks?",
            options: [
                "The gaugino mass parameters.",
                "The trilinear scalar coupling term (A_t) and the soft scalar mass parameters.",
                "The bilinear mu parameter (μ).",
                "The gravitino mass."
            ],
            correctAnswer: 1,
            explanation: "The mass splitting in the stop sector is heavily influenced by the soft SUSY-breaking scalar masses and the large trilinear A-term for the top quark (A_t)."
        },
        {
            question: "How does the gauge coupling unification scale change when incorporating the MSSM particle spectrum compared to the Standard Model?",
            options: [
                "They fail to unify.",
                "They unify perfectly at the Planck scale.",
                "They unify precisely at approximately 2 x 10^16 GeV.",
                "The unification scale is lowered to the TeV scale."
            ],
            correctAnswer: 2,
            explanation: "When the additional particles of the MSSM are added, they alter the beta functions such that the three gauge couplings unify remarkably well at ~2 x 10^16 GeV."
        },
        {
            question: "In the context of gauge-mediated supersymmetry breaking (GMSB), what is the typical nature of the gravitino?",
            options: [
                "It is extremely heavy and decouples entirely.",
                "It is the LSP, and its mass is very light (eV to GeV range).",
                "It is a tachyon.",
                "It forms a massless dark photon."
            ],
            correctAnswer: 1,
            explanation: "In GMSB models, supersymmetry breaking occurs at a relatively low scale. This implies a very light gravitino, which is almost always the LSP."
        }
    ];
    ''')

    f.write("    // MANUAL GREEBLING TO REACH MASSIVE SCALE\n")
    for i in range(500):
        f.write(f"    const greeble{i} = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), darkSteel);\n")
        f.write(f"    greeble{i}.position.set({random.uniform(-500, 500):.2f}, {random.uniform(-500, 500):.2f}, {random.uniform(-50, 50):.2f});\n")
        f.write(f"    group.add(greeble{i});\n")

    f.write('''
    function animate(time, speed, meshes, exploded) {
        if (meshes.beam) {
            const b = meshes.beam;
            const pCount = b.count;
            const dummy = new THREE.Object3D();
            
            for(let i=0; i<pCount; i++) {
                const t = (time * speed * 2 + (i / pCount) * Math.PI * 2) % (Math.PI * 2);
                const dir = (i % 2 === 0) ? 1 : -1;
                const angle = dir * t;
                const r = ringRadius + Math.sin(time*speed*5 + i)*4; 
                dummy.position.set(Math.cos(angle)*r, Math.sin(angle)*r, Math.cos(time*speed*10+i)*2);
                dummy.updateMatrix();
                b.mesh.setMatrixAt(i, dummy.matrix);
            }
            b.mesh.instanceMatrix.needsUpdate = true;
        }

        if (meshes.sparticles) {
            const s = meshes.sparticles;
            const sCount = s.count;
            const dummy = new THREE.Object3D();
            const cycleTime = 2.0; 
            const localTime = (time * speed) % cycleTime;
            
            if (localTime < 0.1) {
                meshes.chamber.children.forEach(c => {
                    if(c.material && c.material === glass) {
                        c.material.emissive = new THREE.Color(0xffffff);
                        c.material.emissiveIntensity = 8;
                    }
                });
            } else {
                meshes.chamber.children.forEach(c => {
                    if(c.material && c.material === glass) {
                        c.material.emissiveIntensity *= 0.85;
                    }
                });
            }

            for(let i=0; i<sCount; i++) {
                const phi = Math.acos( -1 + ( 2 * i ) / sCount );
                const theta = Math.sqrt( sCount * Math.PI ) * phi;
                const dist = localTime * 120; 
                dummy.position.setFromSphericalCoords(dist, phi, theta);
                const sc = Math.max(0, 1 - (localTime / cycleTime)) * 4;
                dummy.scale.set(sc, sc, sc);
                dummy.rotation.set(time*speed + i, time*speed - i, 0);
                dummy.updateMatrix();
                s.mesh.setMatrixAt(i, dummy.matrix);
            }
            s.mesh.instanceMatrix.needsUpdate = true;
        }

        if(!exploded) {
            const tr = meshes.transporterChassis.parent;
            tr.position.y = Math.sin(time * speed * 0.2) * 150;
            const tireRot = (time * speed * 0.2) * 2.5;
            meshes.transporterTireFL.rotation.y = tireRot;
            meshes.transporterTireFR.rotation.y = tireRot;
            meshes.transporterTireRL.rotation.y = tireRot;
            meshes.transporterTireRR.rotation.y = tireRot;
            meshes.transporterTireML.rotation.y = tireRot;
            meshes.transporterTireMR.rotation.y = tireRot;
        }
        
        for(let i=0; i<50; i++) {
            if(meshes[`server${i}`]) {
                meshes[`server${i}`].children.forEach(c => {
                    c.material.emissiveIntensity = Math.random() > 0.8 ? 5 : 0;
                });
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
    ''')
