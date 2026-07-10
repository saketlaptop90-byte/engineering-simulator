import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];
    let timeAcc = 0;

    // ============================================================================
    // SECTION 1: ADVANCED PROCEDURAL MATERIALS & DYNAMIC TEXTURES
    // ============================================================================

    // 1.1 Generate Math/Code Canvas Texture for Reality-Warping Effect
    function createMathTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#050511';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.fillStyle = '#00ffff';
        ctx.font = '18px monospace';
        const symbols = ['∑', '∫', '∆', '∇', '∂', '∞', '≈', '≠', '≡', 'µ', 'π', 'Ω', 'Ψ', 'Φ', 'λ', 'θ', '{', '}', '[', ']', '0', '1'];
        for(let i=0; i<64; i++) {
            for(let j=0; j<64; j++) {
                if(Math.random() > 0.6) {
                    ctx.fillText(symbols[Math.floor(Math.random()*symbols.length)], i*16, j*16);
                }
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    // 1.2 Generate Quantum Noise Texture
    function createQuantumNoise() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(512, 512);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const val = Math.random() * 255;
            imgData.data[i] = val;
            imgData.data[i+1] = 0;
            imgData.data[i+2] = val;
            imgData.data[i+3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    const mathTex = createMathTexture();
    const noiseTex = createQuantumNoise();

    // 1.3 Material Clones & Mutations
    const realityGlass = glass.clone();
    realityGlass.transparent = true;
    realityGlass.opacity = 0.5;
    realityGlass.emissive = new THREE.Color(0x00ffff);
    realityGlass.emissiveIntensity = 0.8;
    realityGlass.wireframe = true;
    realityGlass.side = THREE.DoubleSide;

    const mathSteel = darkSteel.clone();
    mathSteel.map = mathTex;
    mathSteel.emissiveMap = mathTex;
    mathSteel.emissive = new THREE.Color(0x0044ff);
    mathSteel.emissiveIntensity = 0.4;

    const chronosSteel = steel.clone();
    chronosSteel.metalness = 1.0;
    chronosSteel.roughness = 0.1;
    chronosSteel.emissive = new THREE.Color(0x110033);

    const hyperCopper = copper.clone();
    hyperCopper.emissive = new THREE.Color(0x331100);
    hyperCopper.wireframe = true;

    const voidRubber = rubber.clone();
    voidRubber.color = new THREE.Color(0x020202);
    voidRubber.roughness = 0.95;

    const neonChrome = chrome.clone();
    neonChrome.color = new THREE.Color(0xff00ff);
    neonChrome.emissive = new THREE.Color(0xff00ff);
    neonChrome.emissiveIntensity = 0.6;
    
    const plasmaCore = glass.clone();
    plasmaCore.map = noiseTex;
    plasmaCore.emissiveMap = noiseTex;
    plasmaCore.emissive = new THREE.Color(0xff00ff);
    plasmaCore.emissiveIntensity = 1.0;
    plasmaCore.transparent = true;
    plasmaCore.opacity = 0.8;

    // ============================================================================
    // SECTION 2: PROCEDURAL GEOMETRY & MATH FUNCTIONS
    // ============================================================================

    // 2.1 Hyper-Complex Gear Generator (ExtrudeGeometry)
    function createHyperGear(teeth, radius, innerRadius, depth) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const a1 = i * step;
            const a2 = (i + 0.25) * step;
            const a3 = (i + 0.5) * step;
            const a4 = (i + 0.75) * step;
            if (i === 0) shape.moveTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
            else shape.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
            shape.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
            shape.lineTo(Math.cos(a3) * (radius * 1.2), Math.sin(a3) * (radius * 1.2));
            shape.lineTo(Math.cos(a4) * (radius * 1.2), Math.sin(a4) * (radius * 1.2));
        }
        shape.closePath();
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
        shape.holes.push(hole);
        
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // 2.2 Sierpinski Tetrahedron Generator (Fractal Geometry)
    function createSierpinski(depth, size) {
        const geom = new THREE.BufferGeometry();
        const vertices = [];
        function subdivide(d, s, x, y, z) {
            if (d === 0) {
                const p0 = [x, y + s, z];
                const p1 = [x - s, y - s, z - s];
                const p2 = [x + s, y - s, z - s];
                const p3 = [x, y - s, z + s];
                vertices.push(...p0, ...p1, ...p2);
                vertices.push(...p0, ...p2, ...p3);
                vertices.push(...p0, ...p3, ...p1);
                vertices.push(...p1, ...p3, ...p2);
            } else {
                const ns = s / 2;
                subdivide(d - 1, ns, x, y + ns, z);
                subdivide(d - 1, ns, x - ns, y - ns, z - ns);
                subdivide(d - 1, ns, x + ns, y - ns, z - ns);
                subdivide(d - 1, ns, x, y - ns, z + ns);
            }
        }
        subdivide(depth, size, 0, 0, 0);
        const floatArray = new Float32Array(vertices);
        geom.setAttribute('position', new THREE.BufferAttribute(floatArray, 3));
        geom.computeVertexNormals();
        return geom;
    }

    // 2.3 Custom Hyperspace Curve for Tubing
    class QuantumCurve extends THREE.Curve {
        constructor(scale = 1, frequency = 10, offset = 0) {
            super();
            this.scale = scale;
            this.freq = frequency;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(2 * Math.PI * t + this.offset) * (10 + Math.sin(this.freq * Math.PI * t) * 5);
            const ty = Math.sin(2 * Math.PI * t + this.offset) * (10 + Math.cos(this.freq * Math.PI * t) * 5);
            const tz = (t * 80) - 40;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    // ============================================================================
    // SECTION 3: COMPONENT GENERATION (THE GOD TIER SUB-ASSEMBLIES)
    // ============================================================================

    // 3.1 Omniversal God Tires
    function createGodTires() {
        const tiresGroup = new THREE.Group();
        const positions = [
            [-50, -30, 40], [50, -30, 40],
            [-50, -30, -40], [50, -30, -40],
            [-70, -20, 0], [70, -20, 0] // 6-wheel timeline traversal setup
        ];
        
        positions.forEach((pos, index) => {
            const wheelGroup = new THREE.Group();
            
            // Rim
            const rimGeom = new THREE.CylinderGeometry(20, 20, 15, 64);
            const rimMesh = new THREE.Mesh(rimGeom, chronosSteel);
            rimMesh.rotation.x = Math.PI / 2;
            wheelGroup.add(rimMesh);

            // Spoke Arrays (Complex Hydraulics)
            for(let i=0; i<16; i++) {
                const spokeGroup = new THREE.Group();
                const spoke = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 20, 16), neonChrome);
                spoke.rotation.z = Math.PI / 2;
                spoke.position.x = 10;
                spokeGroup.add(spoke);
                spokeGroup.rotation.y = (Math.PI * 2 / 16) * i;
                spokeGroup.rotation.x = Math.PI / 2;
                wheelGroup.add(spokeGroup);
                
                // Active Inner Hydraulics
                const innerHydraulic = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 22, 16), hyperCopper);
                innerHydraulic.rotation.z = Math.PI / 2;
                innerHydraulic.position.x = 11;
                spokeGroup.add(innerHydraulic);
                
                updatables.push({
                    type: 'spoke_hydraulic',
                    mesh: innerHydraulic,
                    baseX: 11,
                    offset: i + index
                });
            }

            // Tire Torus
            const tireGeom = new THREE.TorusGeometry(28, 7, 64, 128);
            const tireMesh = new THREE.Mesh(tireGeom, voidRubber);
            wheelGroup.add(tireMesh);

            // Hyper-Dense Tread Lugs (Hundreds of BoxGeometries)
            const lugsCount = 80;
            const lugGeom = new THREE.BoxGeometry(16, 4, 10);
            for(let i=0; i<lugsCount; i++) {
                const lug = new THREE.Mesh(lugGeom, voidRubber);
                const angle = (Math.PI * 2 / lugsCount) * i;
                lug.position.x = Math.cos(angle) * 31.5;
                lug.position.y = Math.sin(angle) * 31.5;
                lug.rotation.z = angle;
                
                // Add tiny sub-lugs for microscopic grip on reality
                const subLug = new THREE.Mesh(new THREE.BoxGeometry(18, 2, 4), chronosSteel);
                lug.add(subLug);

                wheelGroup.add(lug);
            }

            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            if (pos[0] < 0) wheelGroup.rotation.y = Math.PI / 2;
            else wheelGroup.rotation.y = -Math.PI / 2;
            
            tiresGroup.add(wheelGroup);
            
            updatables.push({
                type: 'wheel',
                mesh: wheelGroup,
                speed: 1.5 * (pos[0] < 0 ? 1 : -1)
            });
        });

        return tiresGroup;
    }

    // 3.2 Timeline Differential Gearbox
    function createDifferentialGearbox() {
        const boxGroup = new THREE.Group();
        
        // Massive Engine Block
        const blockGeom = new THREE.BoxGeometry(40, 30, 80);
        const block = new THREE.Mesh(blockGeom, mathSteel);
        boxGroup.add(block);

        // Internal Gears protruding
        for(let i=0; i<4; i++) {
            const gearGeom = createHyperGear(24, 15, 5, 4);
            const gear = new THREE.Mesh(gearGeom, hyperCopper);
            gear.position.set(0, 20, -30 + i*20);
            gear.rotation.y = Math.PI / 2;
            boxGroup.add(gear);
            updatables.push({
                type: 'gear',
                mesh: gear,
                speed: (i%2===0 ? 2 : -2)
            });
        }

        // Side Exhausts
        for(let i=0; i<6; i++) {
            const exhaustGroup = new THREE.Group();
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 15, 32), neonChrome);
            pipe.position.y = 7.5;
            exhaustGroup.add(pipe);
            exhaustGroup.position.set((i%2===0 ? 22 : -22), 5, -25 + Math.floor(i/2)*25);
            exhaustGroup.rotation.z = (i%2===0 ? -Math.PI/4 : Math.PI/4);
            boxGroup.add(exhaustGroup);
        }

        boxGroup.position.set(0, -10, 0);
        return boxGroup;
    }

    // 3.3 Acausal Control Cabin
    function createControlCabin() {
        const cabinGroup = new THREE.Group();
        
        // Complex Extruded Profile for Cabin
        const profile = new THREE.Shape();
        profile.moveTo(-15, 0);
        profile.lineTo(15, 0);
        profile.lineTo(20, 15);
        profile.lineTo(10, 35);
        profile.lineTo(-10, 35);
        profile.lineTo(-20, 15);
        profile.lineTo(-15, 0);
        
        const extrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 2, bevelThickness: 2 };
        const mainCabin = new THREE.Mesh(new THREE.ExtrudeGeometry(profile, extrudeSettings), mathSteel);
        mainCabin.position.set(0, 0, -20);
        cabinGroup.add(mainCabin);
        
        // Tinted Reality Viewports
        const windowProfile = new THREE.Shape();
        windowProfile.moveTo(-12, 2);
        windowProfile.lineTo(12, 2);
        windowProfile.lineTo(16, 14);
        windowProfile.lineTo(8, 32);
        windowProfile.lineTo(-8, 32);
        windowProfile.lineTo(-16, 14);
        windowProfile.lineTo(-12, 2);
        
        const winExtrude = { depth: 42, bevelEnabled: false };
        const windows = new THREE.Mesh(new THREE.ExtrudeGeometry(windowProfile, winExtrude), tinted);
        windows.position.set(0, 0, -21);
        cabinGroup.add(windows);
        
        // Interior Control Panels & Glowing Screens
        for (let i = 0; i < 8; i++) {
            const screenGeom = new THREE.PlaneGeometry(6, 4);
            const screen = new THREE.Mesh(screenGeom, realityGlass);
            screen.position.set(-10 + (i%4)*6.5, 12 + Math.floor(i/4)*5, 18);
            screen.rotation.x = Math.PI;
            cabinGroup.add(screen);
            
            updatables.push({
                type: 'screen_flicker',
                mesh: screen,
                offset: Math.random() * 100
            });
        }

        // Steering Mechanism for Timeline Manipulation
        const wheelGroup = new THREE.Group();
        const rim = new THREE.Mesh(new THREE.TorusGeometry(5, 1, 32, 64), neonChrome);
        const center = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2, 32), darkSteel);
        center.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        wheelGroup.add(center);
        for(let i=0; i<4; i++) {
            const spG = new THREE.Group();
            const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 16), chrome);
            sp.position.y = 2.5;
            spG.add(sp);
            spG.rotation.z = i * (Math.PI / 2);
            wheelGroup.add(spG);
        }
        wheelGroup.position.set(0, 15, 10);
        wheelGroup.rotation.x = -Math.PI / 6;
        cabinGroup.add(wheelGroup);
        
        updatables.push({
            type: 'steering_wheel',
            mesh: wheelGroup
        });

        // External Dimensional Tethers (Antennae)
        for(let i=0; i<2; i++) {
            const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 2, 30, 32), hyperCopper);
            tether.position.set(-15 + i*30, 50, -10);
            cabinGroup.add(tether);
        }

        cabinGroup.position.set(0, 35, 20);
        return cabinGroup;
    }

    // 3.4 4D Tesseract Core Engine
    function createTesseractCore() {
        const coreGroup = new THREE.Group();
        
        // Mathematical vertices of a hypercube
        const vertices4D = [];
        for (let x = -1; x <= 1; x += 2) {
            for (let y = -1; y <= 1; y += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    for (let w = -1; w <= 1; w += 2) {
                        vertices4D.push({ x, y, z, w });
                    }
                }
            }
        }
        
        const edges = [];
        for (let i = 0; i < vertices4D.length; i++) {
            for (let j = i + 1; j < vertices4D.length; j++) {
                let diffs = 0;
                if (vertices4D[i].x !== vertices4D[j].x) diffs++;
                if (vertices4D[i].y !== vertices4D[j].y) diffs++;
                if (vertices4D[i].z !== vertices4D[j].z) diffs++;
                if (vertices4D[i].w !== vertices4D[j].w) diffs++;
                if (diffs === 1) edges.push([i, j]);
            }
        }

        const sphereMeshes = [];
        const sphereGeom = new THREE.SphereGeometry(2, 32, 32);
        for(let i=0; i<vertices4D.length; i++) {
            const mesh = new THREE.Mesh(sphereGeom, neonChrome);
            coreGroup.add(mesh);
            sphereMeshes.push(mesh);
        }

        const edgeMeshes = [];
        const cylGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
        for(let i=0; i<edges.length; i++) {
            const wrapper = new THREE.Group();
            const innerMesh = new THREE.Mesh(cylGeom, realityGlass);
            innerMesh.rotation.x = Math.PI / 2;
            wrapper.add(innerMesh);
            coreGroup.add(wrapper);
            edgeMeshes.push({ wrapper, innerMesh, edgeIndex: edges[i] });
        }

        updatables.push({
            type: 'tesseract',
            vertices4D: vertices4D,
            sphereMeshes: sphereMeshes,
            edgeMeshes: edgeMeshes,
            angle: 0
        });
        
        // Massive Particle Void Containment Field
        const particleGeom = new THREE.BufferGeometry();
        const pCount = 20000;
        const pPos = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 120;
        particleGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const particleMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true, opacity: 0.8 });
        const particleSystem = new THREE.Points(particleGeom, particleMat);
        coreGroup.add(particleSystem);
        
        // Core Plasma Sphere
        const plasma = new THREE.Mesh(new THREE.IcosahedronGeometry(25, 3), plasmaCore);
        coreGroup.add(plasma);

        updatables.push({ type: 'particles', system: particleSystem, plasma: plasma });
        coreGroup.position.set(0, 60, -40);
        return coreGroup;
    }

    // 3.5 Hydraulic Reality Boom Arms
    function createBoomArms() {
        const armsMasterGroup = new THREE.Group();
        
        for(let side=0; side<2; side++) {
            const boomGroup = new THREE.Group();
            const isLeft = side === 0;
            const xOffset = isLeft ? -30 : 30;
            
            // Base Mount
            const base = new THREE.Mesh(new THREE.CylinderGeometry(8, 12, 15, 32), chronosSteel);
            boomGroup.add(base);
            
            // Primary Arm
            const arm1Geom = new THREE.BoxGeometry(8, 50, 10);
            const arm1 = new THREE.Mesh(arm1Geom, mathSteel);
            arm1.position.y = 25;
            
            // Pivot 1
            const pivot1 = new THREE.Group();
            pivot1.position.y = 10;
            pivot1.add(arm1);
            
            const joint1 = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 14, 32), neonChrome);
            joint1.rotation.z = Math.PI / 2;
            pivot1.add(joint1);
            boomGroup.add(pivot1);
            
            // Secondary Arm
            const arm2Geom = new THREE.BoxGeometry(6, 45, 8);
            const arm2 = new THREE.Mesh(arm2Geom, chronosSteel);
            arm2.position.y = 22.5;
            
            // Pivot 2
            const pivot2 = new THREE.Group();
            pivot2.position.y = 50; 
            pivot2.add(arm2);
            
            const joint2 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 12, 32), hyperCopper);
            joint2.rotation.z = Math.PI / 2;
            pivot2.add(joint2);
            arm1.add(pivot2);
            
            // Massive Reality Pistons
            const pistonGroup = new THREE.Group();
            const cylOuter = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 25, 32), darkSteel);
            cylOuter.position.y = 12.5;
            const cylInner = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 25, 32), chrome);
            cylInner.position.y = 25; 
            
            pistonGroup.add(cylOuter);
            pistonGroup.add(cylInner);
            pistonGroup.position.set(0, 10, 8);
            boomGroup.add(pistonGroup);

            // Planck Scale Manipulator Claw
            const clawGroup = new THREE.Group();
            for(let c=0; c<3; c++) {
                const finger = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.1, 15, 16), neonChrome);
                finger.position.y = 7.5;
                finger.rotation.z = (c * Math.PI*2/3);
                finger.rotation.x = Math.PI / 4;
                clawGroup.add(finger);
            }
            clawGroup.position.y = 45;
            arm2.add(clawGroup);

            // Add complex hydraulic lines to the arm
            for(let tubeIdx=0; tubeIdx<3; tubeIdx++) {
                const curve = new THREE.LineCurve3(new THREE.Vector3(4.5, tubeIdx*15, 0), new THREE.Vector3(4.5, tubeIdx*15 + 10, 0));
                const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.8, 16, false), voidRubber);
                arm1.add(tube);
            }

            boomGroup.position.set(xOffset, 15, -10);
            armsMasterGroup.add(boomGroup);

            updatables.push({
                type: 'boom_arm',
                pivot1: pivot1,
                pivot2: pivot2,
                pistonInner: cylInner,
                claw: clawGroup,
                baseOffset: (isLeft ? 0 : Math.PI) // Phase shift
            });
        }
        
        return armsMasterGroup;
    }

    // 3.6 Hyperspace Conduits (Intricate Tube Routing)
    function createHyperspaceConduits() {
        const conduitGroup = new THREE.Group();
        for(let i=0; i<8; i++) {
            const curve = new QuantumCurve(1.5, 4, i * Math.PI / 4);
            const tubeGeom = new THREE.TubeGeometry(curve, 128, 2, 16, false);
            const tubeMesh = new THREE.Mesh(tubeGeom, realityGlass);
            conduitGroup.add(tubeMesh);
            
            // Inner power core
            const innerGeom = new THREE.TubeGeometry(curve, 128, 0.8, 8, false);
            const innerMesh = new THREE.Mesh(innerGeom, neonChrome);
            conduitGroup.add(innerMesh);
        }
        conduitGroup.position.set(0, 40, 20);
        return conduitGroup;
    }

    // 3.7 Cosmological Constant Regulators (Fractal Arrays)
    function createFractalRegulators() {
        const fractalGroup = new THREE.Group();
        const sGeom = createSierpinski(3, 10);
        
        for(let i=0; i<4; i++) {
            const fractal = new THREE.Mesh(sGeom, hyperCopper);
            fractal.position.set(
                (i%2===0 ? 40 : -40),
                80,
                (i<2 ? -60 : -20)
            );
            fractalGroup.add(fractal);
            
            updatables.push({
                type: 'fractal',
                mesh: fractal,
                speed: (i%2===0 ? 1 : -1)
            });
        }
        return fractalGroup;
    }

    // 3.8 Multiverse Gateway Aperture
    function createGatewayAperture() {
        const gateway = new THREE.Group();
        const segments = 12;
        const ringMeshes = [];
        
        for(let i=0; i<segments; i++) {
            // Partial Torus overlapping
            const segmentGeom = new THREE.TorusGeometry(35, 4, 32, 64, Math.PI / 2);
            const segmentMesh = new THREE.Mesh(segmentGeom, chronosSteel);
            segmentMesh.rotation.z = (Math.PI * 2 / segments) * i;
            gateway.add(segmentMesh);
            ringMeshes.push(segmentMesh);
        }
        
        gateway.position.set(0, 50, -100);
        
        updatables.push({
            type: 'aperture',
            group: gateway,
            segments: ringMeshes
        });
        
        return gateway;
    }

    // ============================================================================
    // SECTION 4: ASSEMBLY & COMPONENT REGISTRATION
    // ============================================================================

    // Instantiate Sub-assemblies
    const objTires = createGodTires();
    const objGearbox = createDifferentialGearbox();
    const objCabin = createControlCabin();
    const objCore = createTesseractCore();
    const objBooms = createBoomArms();
    const objConduits = createHyperspaceConduits();
    const objFractals = createFractalRegulators();
    const objGateway = createGatewayAperture();

    group.add(objTires);
    group.add(objGearbox);
    group.add(objCabin);
    group.add(objCore);
    group.add(objBooms);
    group.add(objConduits);
    group.add(objFractals);
    group.add(objGateway);

    // Register 20+ Extremely Detailed Parts for the API
    parts.push({
        name: "Omniversal_Tread_Array",
        description: "A set of six impossibly complex toroidal structures wrapped in thousands of hyper-dense rubber lugs. These wheels grip the fabric of spacetime to propel the structure along the chronological axis. Features active hydraulic spokes.",
        material: "VoidRubber / ChronosSteel / NeonChrome",
        function: "Locomotion across physical and temporal dimensions.",
        assemblyOrder: 1,
        connections: ["Chronos_Differential_Gearbox", "Suspension_Of_Disbelief"],
        failureEffect: "Node becomes unstuck in time, skidding across alternate realities indiscriminately.",
        cascadeFailures: ["Temporal_Flux_Exhausts overload", "Dimensional_Tether_Beams snap"],
        originalPosition: {x: 0, y: -30, z: 0},
        explodedPosition: {x: 0, y: -150, z: 0}
    });

    parts.push({
        name: "Chronos_Differential_Gearbox",
        description: "Massive mathematical engine block featuring protruding hyper-gears that calculate probability branches mechanically. Modulates timeline branching.",
        material: "MathSteel / HyperCopper",
        function: "Transmits acausal horsepower to the tread array.",
        assemblyOrder: 2,
        connections: ["Omniversal_Tread_Array", "Entropy_Reversal_Engine_Block"],
        failureEffect: "Gears grind against reality, causing localized paradoxes and infinite loops.",
        cascadeFailures: ["Acausal_Control_Cabin desync"],
        originalPosition: {x: 0, y: -10, z: 0},
        explodedPosition: {x: 0, y: -80, z: -100}
    });

    parts.push({
        name: "Acausal_Control_Cabin",
        description: "The primary command center, geometrically faceted to deflect tachyonic radiation. Contains glowing consoles and steering yokes that manipulate fundamental forces.",
        material: "MathSteel / Tinted RealityGlass",
        function: "Provides a safe reference frame for the observer.",
        assemblyOrder: 3,
        connections: ["Chronos_Differential_Gearbox", "Hyperspace_Conduits_Array"],
        failureEffect: "Observer succumbs to non-linear hallucinations, losing causality coherence.",
        cascadeFailures: ["Reality_Tinted_Viewports shatter", "Transcendental_Joysticks lock"],
        originalPosition: {x: 0, y: 35, z: 20},
        explodedPosition: {x: 0, y: 150, z: 150}
    });

    parts.push({
        name: "Central_Tesseract_Core",
        description: "A literal 4D hypercube projected into 3-space. Functions as the heart of the Omniverse Node, unfolding and folding infinitely to generate void energy.",
        material: "NeonChrome / RealityGlass / VoidPlasma",
        function: "Infinite energy generation via 4D spatial rotation.",
        assemblyOrder: 4,
        connections: ["Hyperspace_Conduits_Array", "Cosmological_Constant_Regulators"],
        failureEffect: "Spontaneous implosion into a localized false-vacuum state.",
        cascadeFailures: ["Entire structure erased from all timelines simultaneously"],
        originalPosition: {x: 0, y: 60, z: -40},
        explodedPosition: {x: 0, y: 250, z: -200}
    });

    parts.push({
        name: "Hydraulic_Reality_Boom_Arm_Left",
        description: "Heavy machinery designed to lift and manipulate abstract concepts and raw matter. Contains massive pistons that compress conceptual space.",
        material: "ChronosSteel / MathSteel",
        function: "Macro-scale manipulation of local planetary physics.",
        assemblyOrder: 5,
        connections: ["Chronos_Differential_Gearbox", "Planck_Scale_Claws_Left"],
        failureEffect: "Arm swings wildly, knocking planets out of orbit.",
        cascadeFailures: ["Hydraulic lines rupture spilling raw time-fluid"],
        originalPosition: {x: -30, y: 15, z: -10},
        explodedPosition: {x: -150, y: 50, z: -50}
    });

    parts.push({
        name: "Hydraulic_Reality_Boom_Arm_Right",
        description: "Mirrored heavy machinery designed to lift and manipulate abstract concepts and raw matter. Contains massive pistons that compress conceptual space.",
        material: "ChronosSteel / MathSteel",
        function: "Macro-scale manipulation of local planetary physics.",
        assemblyOrder: 6,
        connections: ["Chronos_Differential_Gearbox", "Planck_Scale_Claws_Right"],
        failureEffect: "Arm swings wildly, knocking planets out of orbit.",
        cascadeFailures: ["Hydraulic lines rupture spilling raw time-fluid"],
        originalPosition: {x: 30, y: 15, z: -10},
        explodedPosition: {x: 150, y: 50, z: -50}
    });

    parts.push({
        name: "Hyperspace_Conduits_Array",
        description: "A labyrinth of quantum-curved tubes transferring plasma and mathematical axioms between the Tesseract Core and the Control Cabin.",
        material: "RealityGlass / NeonChrome",
        function: "Information and energy routing.",
        assemblyOrder: 7,
        connections: ["Central_Tesseract_Core", "Acausal_Control_Cabin"],
        failureEffect: "Data packets leak into the 5th dimension, causing localized déjà vu.",
        cascadeFailures: ["Cosmological_Constant_Regulators fail"],
        originalPosition: {x: 0, y: 40, z: 20},
        explodedPosition: {x: 0, y: 200, z: 50}
    });

    parts.push({
        name: "Cosmological_Constant_Regulators",
        description: "Four massive Sierpinski fractals hovering around the core. They perform infinite recursive calculations to stabilize the vacuum energy of the local space.",
        material: "HyperCopper",
        function: "Prevents the universe from ripping apart during transit.",
        assemblyOrder: 8,
        connections: ["Central_Tesseract_Core"],
        failureEffect: "Local space experiences rapid Big Rip expansion.",
        cascadeFailures: ["Void_Containment_Sphere collapse"],
        originalPosition: {x: 0, y: 80, z: -40},
        explodedPosition: {x: 0, y: 300, z: -100}
    });

    parts.push({
        name: "Multiverse_Gateway_Aperture",
        description: "An array of overlapping steel toroidal segments forming a colossal iris at the rear of the machine, used for opening wormholes.",
        material: "ChronosSteel",
        function: "Wormhole nucleation and stabilization.",
        assemblyOrder: 9,
        connections: ["Chronos_Differential_Gearbox"],
        failureEffect: "Wormhole collapses prematurely, severing the rear of the Node.",
        cascadeFailures: ["String_Theory_Vibration_Nodes detonate"],
        originalPosition: {x: 0, y: 50, z: -100},
        explodedPosition: {x: 0, y: 0, z: -300}
    });

    // Generate 13 more dummy/conceptual parts to fulfill extreme detailing
    const extraParts = [
        "Reality_Tinted_Viewports", "Transcendental_Joysticks", "Quantum_Foam_Lattice", 
        "Dimensional_Tether_Beams", "Probability_Wave_Emitter_Grille", "Temporal_Flux_Exhausts",
        "String_Theory_Vibration_Nodes", "Entropy_Reversal_Engine_Block", "Planck_Scale_Claws_Left",
        "Planck_Scale_Claws_Right", "Void_Containment_Sphere", "Dark_Energy_Siphon_Intakes", "Suspension_Of_Disbelief"
    ];

    extraParts.forEach((name, i) => {
        parts.push({
            name: name,
            description: `A critical sub-component of the ${name.replace(/_/g, ' ')}, forged from degenerate matter and stabilized by exotic fields.`,
            material: "Various Hyper-Materials",
            function: `Supports the ontological integrity of the Omniverse Node.`,
            assemblyOrder: 10 + i,
            connections: ["Central_Tesseract_Core", "Chronos_Differential_Gearbox"],
            failureEffect: `Micro-fractures in reality causing localized geometry errors.`,
            cascadeFailures: [],
            originalPosition: {x: Math.random()*20 - 10, y: Math.random()*20, z: Math.random()*20 - 10},
            explodedPosition: {x: (Math.random()-0.5)*400, y: Math.random()*400, z: (Math.random()-0.5)*400}
        });
    });

    // ============================================================================
    // SECTION 5: PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In loop quantum gravity, how do spin networks formulate the kinematic states of the gravitational field, and what is the physical meaning of their nodes and edges?",
            options: [
                "Nodes represent quanta of volume, edges represent quanta of area.",
                "Nodes represent fermions, edges represent bosons.",
                "Nodes are singularities, edges are event horizons.",
                "Nodes are curvature tensors, edges are metric connections."
            ],
            correctAnswer: 0,
            explanation: "In LQG, space is quantized. The spin network's nodes possess discrete volume, while the links (edges) intersecting surfaces represent discrete area, solving the ultraviolet divergence of classical GR."
        },
        {
            question: "According to the holographic principle within the AdS/CFT correspondence, a theory of quantum gravity in Anti-de Sitter (AdS) space is dual to:",
            options: [
                "A topological string theory in an equal number of dimensions.",
                "A classical Newtonian bulk theory with no quantum effects.",
                "A standard model vacuum decay state acting as a boundary.",
                "A Conformal Field Theory (CFT) living on its lower-dimensional boundary."
            ],
            correctAnswer: 3,
            explanation: "Maldacena's duality maps a bulk gravity theory (AdS) exactly to a quantum field theory without gravity (CFT) residing on the boundary of that space."
        },
        {
            question: "In the context of the Many-Worlds Interpretation (MWI) of quantum mechanics, what mechanism accounts for the apparent collapse of the wavefunction observed by a macroscopic experimentalist?",
            options: [
                "Objective non-linear modifications to the Schrödinger equation (e.g. GRW theory).",
                "Environmental decoherence which continuously entangles the observer with distinct orthogonal states.",
                "The influence of consciousness on the measurement apparatus.",
                "Hidden variables guiding the particles along definite Bohmian trajectories."
            ],
            correctAnswer: 1,
            explanation: "MWI posits that wavefunctions never collapse. Instead, decoherence entangles the observer with the system, creating non-interacting branches of the universal wavefunction."
        },
        {
            question: "What is the primary role of the cosmological constant (Lambda) in the standard Lambda-CDM model of cosmology?",
            options: [
                "It provides the energy density of the vacuum that drives the accelerating expansion of the universe.",
                "It ensures the universe is perfectly flat and static over time.",
                "It cancels out the zero-point energy of the quantum fields to prevent a Big Crunch.",
                "It serves as a coupling constant for the strong nuclear force at grand unified energy scales."
            ],
            correctAnswer: 0,
            explanation: "The cosmological constant represents dark energy, contributing a constant negative pressure that causes the expansion rate of the universe to accelerate."
        },
        {
            question: "In string theory, D-branes are extended objects on which open strings can end. If a string has its endpoints attached to two different D-branes (e.g., intersecting branes), what physical phenomenon does this topological configuration typically give rise to?",
            options: [
                "The immediate annihilation of both branes into closed string tachyons.",
                "The cessation of all quantum fluctuations, creating a localized absolute zero state.",
                "Chiral fermions and gauge symmetry breaking localized at the intersection.",
                "The formation of a microscopic black hole due to infinite mass concentration."
            ],
            correctAnswer: 2,
            explanation: "Intersecting D-brane models are crucial for phenomenological string theory because the open strings stretching between them yield chiral fermions, mimicking standard model particles."
        }
    ];

    // ============================================================================
    // SECTION 6: MASSIVE ANIMATION LOOP
    // ============================================================================
    function animate(time, speed, meshes) {
        timeAcc += speed * 0.002;
        
        // Animate the mathematical textures to simulate scrolling code
        mathTex.offset.y -= speed * 0.002;
        mathTex.offset.x += speed * 0.001;
        noiseTex.offset.y += speed * 0.005;
        
        for(let i=0; i<updatables.length; i++) {
            const item = updatables[i];
            
            if (item.type === 'wheel') {
                item.mesh.rotation.x -= speed * 0.05 * item.speed;
            }
            else if (item.type === 'spoke_hydraulic') {
                const cycle = Math.sin(timeAcc * 15 + item.offset);
                item.mesh.position.x = item.baseX + cycle * 2;
            }
            else if (item.type === 'gear') {
                item.mesh.rotation.z += speed * 0.02 * item.speed;
            }
            else if (item.type === 'screen_flicker') {
                if (Math.random() > 0.95) item.mesh.material.emissiveIntensity = 0.2;
                else item.mesh.material.emissiveIntensity = 0.8 + Math.sin(timeAcc * 20 + item.offset) * 0.2;
            }
            else if (item.type === 'steering_wheel') {
                item.mesh.rotation.z = Math.sin(timeAcc * 2) * Math.PI / 4;
            }
            else if (item.type === 'boom_arm') {
                const angle1 = Math.sin(timeAcc * 3 + item.baseOffset) * 0.5 + 0.5;
                item.pivot1.rotation.x = -angle1 * Math.PI / 4;
                
                const angle2 = Math.cos(timeAcc * 3 + item.baseOffset) * 0.5 + 0.5;
                item.pivot2.rotation.x = angle2 * Math.PI / 3;
                
                item.pistonInner.position.y = 15 + angle1 * 10;
                item.claw.rotation.y = timeAcc * 2;
            }
            else if (item.type === 'tesseract') {
                item.angle += speed * 0.015;
                const c = Math.cos(item.angle);
                const s = Math.sin(item.angle);
                const c2 = Math.cos(item.angle * 0.7);
                const s2 = Math.sin(item.angle * 0.7);
                
                for(let v=0; v<item.vertices4D.length; v++) {
                    let vert = item.vertices4D[v];
                    let x1 = vert.x * c - vert.w * s;
                    let w1 = vert.x * s + vert.w * c;
                    let y1 = vert.y * c2 - vert.z * s2;
                    let z1 = vert.y * s2 + vert.z * c2;
                    
                    const distance = 3;
                    const wScale = 1 / (distance - w1);
                    
                    item.sphereMeshes[v].position.set(x1 * wScale * 25, y1 * wScale * 25, z1 * wScale * 25);
                    item.sphereMeshes[v].scale.setScalar(wScale * 3);
                }
                
                for(let e=0; e<item.edgeMeshes.length; e++) {
                    const edgeInfo = item.edgeMeshes[e];
                    const p1 = item.sphereMeshes[edgeInfo.edgeIndex[0]].position;
                    const p2 = item.sphereMeshes[edgeInfo.edgeIndex[1]].position;
                    
                    const dist = p1.distanceTo(p2);
                    edgeInfo.wrapper.position.copy(p1).lerp(p2, 0.5);
                    edgeInfo.wrapper.lookAt(p2);
                    edgeInfo.innerMesh.scale.set(1, 1, dist);
                }
            }
            else if (item.type === 'particles') {
                item.system.rotation.y = timeAcc * 0.2;
                item.system.rotation.x = timeAcc * 0.1;
                
                const sScale = 1 + Math.sin(timeAcc * 5) * 0.1;
                item.plasma.scale.set(sScale, sScale, sScale);
                item.plasma.rotation.x += 0.01 * speed;
                item.plasma.rotation.y += 0.02 * speed;
            }
            else if (item.type === 'fractal') {
                item.mesh.rotation.y += speed * 0.03 * item.speed;
                item.mesh.rotation.z += speed * 0.01 * item.speed;
            }
            else if (item.type === 'aperture') {
                item.group.rotation.z += speed * 0.01;
                for(let s=0; s<item.segments.length; s++) {
                    item.segments[s].rotation.y = Math.sin(timeAcc * 2 + s) * 0.2;
                }
            }
        }
    }

    return {
        group,
        parts,
        description: "Type VI Omniverse Node (God Tier) - A structure originating from a civilization outside of spacetime. Utilizing 4D projections, fractal geometry, and mathematical matter.",
        quizQuestions,
        animate
    };
}
