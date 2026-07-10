import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // EXTREME GOD-TIER MATERIALS
    // ==========================================
    const exoticMatterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0xaa00ff,
        emissiveIntensity: 6.0,
        metalness: 1.0,
        roughness: 0.0,
        clearcoat: 1.0,
        transmission: 0.9,
        ior: 2.8,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const tachyonFieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const chronosGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x222244,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.05,
        transmission: 1.0,
        ior: 3.5,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    const darkEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0x050011,
        emissive: 0x1a0033,
        emissiveIntensity: 2.0,
        metalness: 0.9,
        roughness: 0.3,
        side: THREE.DoubleSide
    });

    const frameDragMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff2200,
        emissiveIntensity: 5.0,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const paradoxGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        wireframe: true
    });

    // ==========================================
    // MASSIVE TIPLER CYLINDER CORE
    // ==========================================
    const coreGroup = new THREE.Group();
    group.add(coreGroup);

    const tiplerRadius = 150;
    const tiplerLength = 2000;
    const tiplerGeo = new THREE.CylinderGeometry(tiplerRadius, tiplerRadius, tiplerLength, 256, 128, false);
    const tiplerMesh = new THREE.Mesh(tiplerGeo, exoticMatterMaterial);
    tiplerMesh.rotation.x = Math.PI / 2;
    coreGroup.add(tiplerMesh);
    updatables.push({ mesh: tiplerMesh, type: 'tipler' });

    parts.push({
        name: "God-Tier Tipler Cylinder",
        description: "An infinitely dense cylinder of exotic matter spinning at 0.999999999c. Its extreme rotation drags the fabric of spacetime, creating a region where light cones are tilted into the past, allowing closed timelike curves (CTCs).",
        material: "Exotic Dark Matter with Negative Energy Density",
        function: "Generates the immense frame-dragging required for temporal looping.",
        assemblyOrder: 1,
        connections: ["Wormhole Throat", "Tachyon Injectors", "Gravity Conduits"],
        failureEffect: "Spontaneous singularity collapse leading to vacuum metastability event.",
        cascadeFailures: ["Chronosphere Detonation", "Local Hubble Volume Erasure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1000, z: 0 }
    });

    // Inner Core Containment Grid (Intricate Lathe)
    const points = [];
    for (let i = 0; i < 100; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 20 + tiplerRadius + 10, (i - 50) * 20));
    }
    const containmentGeo = new THREE.LatheGeometry(points, 128);
    const containmentMesh = new THREE.Mesh(containmentGeo, chronosGlassMaterial);
    containmentMesh.rotation.x = Math.PI / 2;
    coreGroup.add(containmentMesh);
    updatables.push({ mesh: containmentMesh, type: 'containment' });

    parts.push({
        name: "Chronos Glass Containment Grid",
        description: "A lattice of hyper-dimensional glass designed to prevent the Tipler core's infinite density from radiating Hawking radiation indiscriminately.",
        material: "Chronos Glass",
        function: "Stabilizes the singularity boundary.",
        assemblyOrder: 2,
        connections: ["Tipler Cylinder", "Temporal Anchors"],
        failureEffect: "Severe Hawking radiation leaks, incinerating the facility.",
        cascadeFailures: ["Total Event Horizon Breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 0, z: 0 }
    });

    // ==========================================
    // GRAVITATIONAL LENSING RINGS
    // ==========================================
    const lensingGroup = new THREE.Group();
    group.add(lensingGroup);
    
    for (let i = 0; i < 7; i++) {
        const ringRadius = 400 + i * 150;
        const tubeRadius = 20 + i * 5;
        const ringGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 64, 256);
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        
        // Add extreme details onto the ring (thousands of tiny nodes)
        for(let j=0; j<36; j++) {
            const nodeGeo = new THREE.BoxGeometry(tubeRadius*3, tubeRadius*3, tubeRadius*3);
            const nodeMesh = new THREE.Mesh(nodeGeo, darkEnergyMaterial);
            const angle = (j / 36) * Math.PI * 2;
            nodeMesh.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);
            nodeMesh.lookAt(0,0,0);
            ringMesh.add(nodeMesh);
        }

        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = (i - 3) * 300;
        lensingGroup.add(ringMesh);
        updatables.push({ mesh: ringMesh, type: 'lensRing', index: i });
        
        parts.push({
            name: `Lensing Ring Array - Tier ${i+1}`,
            description: `Superconducting macro-ring responsible for bending light around the naked singularity to prevent observer paradoxes.`,
            material: "Neutron-Star Crust Alloy (Chrome Plated)",
            function: "Manages gravitational lensing and spacetime metric stabilization.",
            assemblyOrder: 3 + i,
            connections: ["Frame-Dragging Coils"],
            failureEffect: "Spacetime shear, tearing local matter into constituent quarks.",
            cascadeFailures: ["Singularity Unveiling"],
            originalPosition: { x: 0, y: (i - 3) * 300, z: 0 },
            explodedPosition: { x: (i%2==0? 1000 : -1000), y: (i - 3) * 300, z: 1000 }
        });
    }

    // ==========================================
    // TACHYON INJECTORS & FRAME DRAGGING COILS
    // ==========================================
    const coilGroup = new THREE.Group();
    group.add(coilGroup);
    
    const coilPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1000, 200),
        new THREE.Vector3(200, -500, 0),
        new THREE.Vector3(0, 0, -200),
        new THREE.Vector3(-200, 500, 0),
        new THREE.Vector3(0, 1000, 200)
    ]);
    coilPath.closed = true;

    for (let i=0; i<12; i++) {
        const tubeGeo = new THREE.TubeGeometry(coilPath, 512, 15, 32, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, frameDragMaterial);
        tubeMesh.rotation.y = (i / 12) * Math.PI * 2;
        coilGroup.add(tubeMesh);
        updatables.push({ mesh: tubeMesh, type: 'coil', index: i });
        
        parts.push({
            name: `Frame Dragging Coil - Sector ${i}`,
            description: "Pumps negative mass-energy into the vicinity of the Tipler cylinder to hold the throat of the wormhole open.",
            material: "Hyper-Conductive Plasma",
            function: "Induces extreme frame dragging.",
            assemblyOrder: 10 + i,
            connections: ["Tipler Cylinder", "Lensing Ring Array"],
            failureEffect: "Wormhole throat pinches off violently.",
            cascadeFailures: ["Decapitation of traversing entities"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: Math.cos((i/12)*Math.PI*2)*1500, y: 0, z: Math.sin((i/12)*Math.PI*2)*1500 }
        });
    }

    // ==========================================
    // TEMPORAL GHOSTS / ECHOES
    // ==========================================
    const ghostGroup = new THREE.Group();
    group.add(ghostGroup);

    // Create a complex "traveler" or "capsule" that has ghosts
    const capsuleGeo = new THREE.IcosahedronGeometry(60, 2);
    const capsuleMesh = new THREE.Mesh(capsuleGeo, steel);
    capsuleMesh.position.set(300, 0, 0);
    ghostGroup.add(capsuleMesh);
    updatables.push({ mesh: capsuleMesh, type: 'capsule' });

    for (let i = 1; i <= 20; i++) {
        const ghostMesh = new THREE.Mesh(capsuleGeo, paradoxGlowMaterial);
        ghostMesh.position.set(300, 0, 0);
        ghostGroup.add(ghostMesh);
        updatables.push({ mesh: ghostMesh, type: 'ghost', index: i, target: capsuleMesh });
    }

    parts.push({
        name: "Chrononaut Capsule",
        description: "The vehicle designed to endure extreme tidal forces and navigate the Cauchy horizon into the past.",
        material: "Neutronium-laced Titanium",
        function: "Houses observers safely during CTC transit.",
        assemblyOrder: 50,
        connections: [],
        failureEffect: "Spaghettification.",
        cascadeFailures: ["Chronological contamination"],
        originalPosition: { x: 300, y: 0, z: 0 },
        explodedPosition: { x: 300, y: -500, z: -500 }
    });

    // ==========================================
    // MASSIVE HYDRAULIC & MACHINERY DETAILS
    // ==========================================
    const machineryGroup = new THREE.Group();
    group.add(machineryGroup);

    // Huge pillars supporting the generator
    for (let p = 0; p < 8; p++) {
        const angle = (p / 8) * Math.PI * 2;
        const r = 1200;
        
        // Main Pillar
        const pillarGeo = new THREE.CylinderGeometry(50, 80, 3000, 32);
        const pillarMesh = new THREE.Mesh(pillarGeo, darkSteel);
        pillarMesh.position.set(Math.cos(angle)*r, 0, Math.sin(angle)*r);
        machineryGroup.add(pillarMesh);
        
        // Hydraulic pistons on pillars
        const pistonBaseGeo = new THREE.CylinderGeometry(30, 30, 800, 16);
        const pistonBaseMesh = new THREE.Mesh(pistonBaseGeo, copper);
        pistonBaseMesh.position.set(Math.cos(angle)*(r-100), -500, Math.sin(angle)*(r-100));
        machineryGroup.add(pistonBaseMesh);

        const pistonRodGeo = new THREE.CylinderGeometry(15, 15, 800, 16);
        const pistonRodMesh = new THREE.Mesh(pistonRodGeo, steel);
        pistonRodMesh.position.set(Math.cos(angle)*(r-100), 0, Math.sin(angle)*(r-100));
        machineryGroup.add(pistonRodMesh);
        updatables.push({ mesh: pistonRodMesh, type: 'pistonRod', baseY: 0, phase: p });
        
        // Piping
        const pipePath = new THREE.LineCurve3(
            new THREE.Vector3(Math.cos(angle)*(r-100), 400, Math.sin(angle)*(r-100)),
            new THREE.Vector3(Math.cos(angle)*400, 0, Math.sin(angle)*400)
        );
        const pipeGeo = new THREE.TubeGeometry(pipePath, 64, 10, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, rubber);
        machineryGroup.add(pipeMesh);
        
        parts.push({
            name: `Structural Pillar Assembly - ${p}`,
            description: "Massive dark-steel pillars anchoring the machine to the bedrock of the universe, absorbing the violent vibrations of spacetime tearing.",
            material: "Dark Steel & Copper Hydraulics",
            function: "Structural integrity and vibration dampening.",
            assemblyOrder: 100 + p,
            connections: ["Ground", "Lensing Ring Array"],
            failureEffect: "Machine rips itself from reality, becoming a rogue projectile in higher dimensions.",
            cascadeFailures: ["Multiversal impact"],
            originalPosition: { x: Math.cos(angle)*r, y: 0, z: Math.sin(angle)*r },
            explodedPosition: { x: Math.cos(angle)*(r+1000), y: 0, z: Math.sin(angle)*(r+1000) }
        });
    }
    
    // ==========================================
    // EXOTIC ENERGY PARTICLE EMITTERS
    // ==========================================
    const particleCount = 10000;
    const particleGeo = new THREE.BoxGeometry(4, 4, 10);
    const particleInstancedMesh = new THREE.InstancedMesh(particleGeo, tachyonFieldMaterial, particleCount);
    const dummy = new THREE.Object3D();
    const particleData = [];
    
    for(let i=0; i<particleCount; i++) {
        const radius = Math.random() * 800 + 200;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 2000;
        
        particleData.push({
            r: radius,
            theta: theta,
            y: y,
            speed: Math.random() * 0.1 + 0.05,
            angularSpeed: Math.random() * 0.2 + 0.1
        });
        
        dummy.position.set(Math.cos(theta)*radius, y, Math.sin(theta)*radius);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dummy.updateMatrix();
        particleInstancedMesh.setMatrixAt(i, dummy.matrix);
    }
    group.add(particleInstancedMesh);
    updatables.push({ mesh: particleInstancedMesh, type: 'particles', data: particleData, dummy: dummy });
    
    parts.push({
        name: "Tachyon Emission Field",
        description: "A maelstrom of faster-than-light tachyons generated as a byproduct of extreme frame dragging.",
        material: "Tachyonic Plasma",
        function: "Dissipates excess causal paradox energy.",
        assemblyOrder: 200,
        connections: [],
        failureEffect: "Accumulation of paradox energy leading to a causal loop feedback.",
        cascadeFailures: ["Grandfather Paradox Resolution (Erasing timeline)"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2000, z: 0 }
    });

    // ==========================================
    // CAUCHY HORIZON GENERATOR (EXTRUDED GEARS)
    // ==========================================
    const gearShape = new THREE.Shape();
    const numTeeth = 36;
    const outerRadius = 800;
    const innerRadius = 700;
    for(let i=0; i<numTeeth*2; i++) {
        const r = (i%2 === 0) ? outerRadius : innerRadius;
        const angle = (i/(numTeeth*2)) * Math.PI * 2;
        if(i===0) gearShape.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
        else gearShape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
    }
    gearShape.closePath();
    
    const extrudeSettings = { depth: 100, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 5, bevelThickness: 10 };
    const gearGeo = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
    gearGeo.center();
    
    for(let g=0; g<3; g++) {
        const gearMesh = new THREE.Mesh(gearGeo, tinted);
        gearMesh.rotation.x = Math.PI / 2;
        gearMesh.position.y = (g - 1) * 900;
        group.add(gearMesh);
        updatables.push({ mesh: gearMesh, type: 'gear', direction: (g%2===0 ? 1 : -1) });
        
        parts.push({
            name: `Cauchy Horizon Gear - Level ${g+1}`,
            description: "Gigantic mechanical compensators that mechanically resist the immense torque of spacetime twisting.",
            material: "Hyper-Dense Tinted Poly-Alloy",
            function: "Prevents the facility from spinning with the frame-dragging effect.",
            assemblyOrder: 300 + g,
            connections: ["Structural Pillar Assembly", "Tipler Cylinder"],
            failureEffect: "Facility spins at near light speed, annihilating instantly.",
            cascadeFailures: ["Planetary shear"],
            originalPosition: { x: 0, y: (g - 1) * 900, z: 0 },
            explodedPosition: { x: 0, y: (g - 1) * 1500, z: 0 }
        });
    }

    // ==========================================
    // MULTIPLE OPERATOR CABINS
    // ==========================================
    for(let c=0; c<4; c++) {
        const cabinGroup = new THREE.Group();
        
        // Base Box
        const baseGeo = new THREE.BoxGeometry(150, 100, 200);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        cabinGroup.add(baseMesh);
        
        // Glass Window
        const windowGeo = new THREE.BoxGeometry(160, 50, 180);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.y = 10;
        cabinGroup.add(windowMesh);
        
        // Control Panels (Lots of small boxes)
        for(let p=0; p<10; p++) {
            const panelGeo = new THREE.BoxGeometry(20, 5, 20);
            const panelMesh = new THREE.Mesh(panelGeo, tachyonFieldMaterial);
            panelMesh.position.set((Math.random()-0.5)*100, -20, (Math.random()-0.5)*100);
            panelMesh.rotation.x = Math.random();
            cabinGroup.add(panelMesh);
        }
        
        const angle = (c/4) * Math.PI * 2 + Math.PI/4;
        const cabR = 1400;
        cabinGroup.position.set(Math.cos(angle)*cabR, 0, Math.sin(angle)*cabR);
        cabinGroup.lookAt(0,0,0);
        group.add(cabinGroup);
        
        parts.push({
            name: `Operator Command Cabin ${c+1}`,
            description: "Heavily shielded observation deck where physicists monitor the formation of the Cauchy horizon. Contains massive computational arrays to calculate paradox resolutions.",
            material: "Dark Steel and Tinted Plasteel Glass",
            function: "Operation and monitoring of the CTC generator.",
            assemblyOrder: 400 + c,
            connections: ["Structural Pillar Assembly"],
            failureEffect: "Observers witness their own deaths before they occur, causing severe psychological collapse.",
            cascadeFailures: ["Operator error leading to timeline divergence"],
            originalPosition: { x: Math.cos(angle)*cabR, y: 0, z: Math.sin(angle)*cabR },
            explodedPosition: { x: Math.cos(angle)*2000, y: 500, z: Math.sin(angle)*2000 }
        });
    }

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const ghostHistory = [];
    const maxHistory = 100;

    const animate = (time, speed, meshes) => {
        const delta = speed * 0.05;
        const timeVal = time * 0.001 * speed;

        updatables.forEach(obj => {
            if(obj.type === 'tipler') {
                // Spins impossibly fast
                obj.mesh.rotation.y += delta * 15;
            } 
            else if(obj.type === 'containment') {
                obj.mesh.rotation.y -= delta * 5;
                // Scale pulses slightly with exotic energy
                const scale = 1.0 + Math.sin(timeVal * 10) * 0.02;
                obj.mesh.scale.set(scale, scale, scale);
            }
            else if(obj.type === 'lensRing') {
                // Complex multiaxial rotation
                obj.mesh.rotation.x = Math.PI / 2 + Math.sin(timeVal * 2 + obj.index) * 0.2;
                obj.mesh.rotation.z += delta * 2 * (obj.index % 2 === 0 ? 1 : -1);
            }
            else if(obj.type === 'coil') {
                // Flowing tachyonic energy simulation
                obj.mesh.material.emissiveIntensity = 5.0 + Math.sin(timeVal * 15 + obj.index) * 4.0;
                // Coils slowly orbit
                obj.mesh.rotation.y = (obj.index / 12) * Math.PI * 2 + timeVal * 0.5;
            }
            else if(obj.type === 'gear') {
                obj.mesh.rotation.z += delta * 0.5 * obj.direction;
            }
            else if(obj.type === 'pistonRod') {
                // Hydraulic pumping matched to gravitational waves
                obj.mesh.position.y = obj.baseY + Math.sin(timeVal * 5 + obj.phase) * 200;
            }
            else if(obj.type === 'particles') {
                const data = obj.data;
                const mesh = obj.mesh;
                const d = obj.dummy;
                for(let i=0; i<data.length; i++) {
                    data[i].theta += data[i].angularSpeed * delta;
                    data[i].y += Math.sin(timeVal*5 + i) * 10 * speed; // Jitter
                    // Spiraling inwards and upwards like a funnel
                    data[i].r -= data[i].speed * delta * 50;
                    if(data[i].r < 200) data[i].r = 1000; // Reset
                    
                    d.position.set(
                        Math.cos(data[i].theta) * data[i].r,
                        data[i].y,
                        Math.sin(data[i].theta) * data[i].r
                    );
                    d.rotation.x += 0.1 * speed;
                    d.updateMatrix();
                    mesh.setMatrixAt(i, d.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }
            else if(obj.type === 'capsule') {
                // The capsule traverses a complex 3D lissajous curve, diving towards the core
                const cx = Math.sin(timeVal * 0.5) * 800;
                const cy = Math.cos(timeVal * 0.3) * 600;
                const cz = Math.sin(timeVal * 0.7) * 800;
                obj.mesh.position.set(cx, cy, cz);
                obj.mesh.rotation.x += delta;
                obj.mesh.rotation.y += delta * 1.5;
                
                // Record history for ghosts
                ghostHistory.push({
                    pos: obj.mesh.position.clone(),
                    rot: obj.mesh.rotation.clone()
                });
                if(ghostHistory.length > maxHistory) {
                    ghostHistory.shift();
                }
            }
            else if(obj.type === 'ghost') {
                // Ghosts replay history from the future/past (temporal echoing)
                const delayIndex = ghostHistory.length - 1 - (obj.index * 4);
                if(delayIndex >= 0 && delayIndex < ghostHistory.length) {
                    const hist = ghostHistory[delayIndex];
                    obj.mesh.position.copy(hist.pos);
                    obj.mesh.rotation.copy(hist.rot);
                    // Pulsing paradox glow
                    obj.mesh.material.opacity = 0.15 + Math.sin(timeVal*10 + obj.index)*0.1;
                }
            }
        });
    };

    // ==========================================
    // EXTREMELY DIFFICULT PhD GR QUIZ
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Tipler cylinder, how does the cylinder's infinite length strictly avoid the formation of an event horizon while generating Closed Timelike Curves (CTCs)?",
            options: [
                "The infinite length ensures that the Weyl curvature tensor perfectly cancels the Ricci curvature along the longitudinal axis.",
                "By maintaining translational symmetry, the spacetime metric lacks a localized mass center, preventing gravitational collapse into a singularity while extreme frame-dragging tilts the light cones.",
                "The cylinder utilizes exotic dark energy to generate a repulsive force that balances the intense localized gravity.",
                "It doesn't; an infinite Tipler cylinder actually does form a naked singularity but masks the event horizon with tachyon fields."
            ],
            correctAnswer: 1,
            explanation: "An infinite Tipler cylinder maintains perfect translational symmetry along its axis. Because of this, the mass is not localized into a singular point or compact region, preventing the formation of an event horizon (unlike a finite mass collapsing). The rapid rotation generates severe frame-dragging (Lense-Thirring effect) that tilts the light cones until they tip past the temporal axis, creating CTCs."
        },
        {
            question: "When traversing the Cauchy horizon to enter a region with CTCs, an observer theoretically encounters a 'wall of extreme radiation'. What is the physical mechanism causing this?",
            options: [
                "Hawking radiation emitted from the naked singularity is blue-shifted to infinite energy as it reaches the Cauchy horizon.",
                "The timeline loops back on itself, causing vacuum fluctuations to traverse the loop infinitely many times, constructively interfering and diverging to infinite energy density.",
                "Dark matter annihilates with baryonic matter at the boundary due to chiral symmetry breaking.",
                "Frame-dragging creates localized extreme friction in the quantum foam, igniting virtual particles into real plasma."
            ],
            correctAnswer: 1,
            explanation: "This is known as the 'chronology protection conjecture' mechanism suggested by Stephen Hawking. As a CTC forms, virtual particles and vacuum fluctuations can travel around the closed loop infinitely many times. From the perspective of the Cauchy horizon, these fluctuations pile up and are infinitely blueshifted, causing the stress-energy tensor to diverge and potentially destroying the wormhole or time machine before it can be used."
        },
        {
            question: "Assuming a Kerr black hole is utilized for time travel via its ring singularity, what specific mathematical region allows for movement backwards in time?",
            options: [
                "The Ergosphere, where rotational energy can be extracted via the Penrose process.",
                "The region strictly between the outer event horizon (r_+) and the inner Cauchy horizon (r_-).",
                "The region inside the inner Cauchy horizon (r < r_-), where the metric coefficient g_phi_phi becomes negative, making the azimuthal angular coordinate timelike.",
                "The photon sphere (r = 3M), where light orbits infinitely, allowing temporal mapping."
            ],
            correctAnswer: 2,
            explanation: "In the Kerr metric, once an observer passes through the inner horizon (Cauchy horizon) into the region r < r_-, the $g_{\\phi\\phi}$ component of the metric tensor can become negative. This means that movement along the azimuthal angle $\\phi$ (which is normally a spacelike coordinate) becomes timelike. Navigating around the ring singularity in this region allows one to form closed timelike curves."
        },
        {
            question: "How does the Novikov self-consistency principle resolve the 'Grandfather Paradox' in a spacetime containing CTCs?",
            options: [
                "By invoking the Many-Worlds interpretation of quantum mechanics, where traveling back in time forces a branch into a parallel universe, preserving the original timeline.",
                "By constraining the probability amplitude of any event that would cause a paradox to zero, meaning the laws of physics strictly ensure only self-consistent events can occur globally.",
                "By utilizing exotic matter to absorb the paradoxical energy, converting causal violations into bursts of Hawking radiation.",
                "By stipulating that time travel can only occur to a point in time after the time machine was created, making the paradox physically impossible to setup."
            ],
            correctAnswer: 1,
            explanation: "The Novikov self-consistency principle asserts that if an event exists that would cause a paradox (or any change to the past) in a spacetime with CTCs, then the probability of that event is strictly zero. In classical and quantum mechanics frameworks adapted for CTCs, the global solution to the physical equations must be consistent with itself throughout the entire loop. Therefore, you cannot kill your grandfather because the fact that you exist means you didn't."
        },
        {
            question: "To stabilize a traversable wormhole (a Morris-Thorne metric) for use as a time machine, 'exotic matter' is required. What specific mathematical property must the stress-energy tensor of this matter possess?",
            options: [
                "It must have a positive trace (T > 0) to counteract the extreme curvature of the throat.",
                "It must violate the Null Energy Condition (NEC), meaning $T_{\\mu\\nu} k^\\mu k^\\nu < 0$ for some null vector $k^\\mu$, resulting in a negative energy density from certain reference frames.",
                "It must possess a completely zero stress-energy tensor ($T_{\\mu\\nu} = 0$), relying purely on the Weyl curvature to sustain the throat.",
                "It must violate the Conservation of Energy ($T^{\\mu\\nu}_{;\\nu} \\neq 0$) to continuously inject tachyons."
            ],
            correctAnswer: 1,
            explanation: "Traversable wormholes require matter that violates the Null Energy Condition (NEC) to keep the throat from pinching off gravitationally. This means that for any null vector $k^\\mu$ (the tangent vector to a photon's path), $T_{\\mu\\nu} k^\\mu k^\\nu < 0$. Physically, this implies the matter must have a negative energy density as measured by observers traversing the wormhole at high speeds, providing a repulsive gravitational effect to hold the throat open."
        }
    ];

    return { group, parts, description: "God Tier Closed Timelike Curve Generator - Spacetime Folding Super-Structure", quizQuestions, animate };
}
