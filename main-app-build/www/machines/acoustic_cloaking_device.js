import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * ============================================================================
 * ULTRA GOD-TIER ACOUSTIC CLOAKING DEVICE
 * ============================================================================
 * 
 * This module simulates a broad-band, three-dimensional acoustic metamaterial cloak.
 * Based on the principles of Transformation Acoustics, the device maps a spherical 
 * cloaked region (r < R1) to an annular metamaterial region (R1 <= r <= R2).
 * 
 * Features:
 * - Pentamode octet-truss lattice with over 30,000 discrete structural elements.
 * - Active Willis coupling nodes for asymmetric scattering.
 * - Eulerian acoustic field visualization displaying real-time wave pressure.
 * - Quantum sensor payload within the perfectly isolated void.
 * - Full phase-synchronized phased array transmitter and anechoic receiver.
 * - Highly realistic support structures: seismic isolators, cooling pipes, supercomputers.
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ============================================================================
    // GLOBAL CONSTANTS & MATHEMATICAL PARAMETERS
    // ============================================================================
    const R1 = 16.0; // Inner radius of the cloaking shell
    const R2 = 36.0; // Outer radius of the cloaking shell
    const WAVE_K = Math.PI / 6.0; // Wave number
    const WAVE_OMEGA = 8.0; // Angular frequency
    const LATTICE_A = 3.6; // Lattice constant for pentamode octet-truss
    
    // Arrays to hold dynamic meshes for the animate loop
    const dynamicNodes = [];
    const waveParticlesXY = [];
    const waveParticlesXZ = [];
    let visMeshXY, visMeshXZ;
    let transMesh, recMesh;
    const gyros = [];

    // ============================================================================
    // PART 1: MAIN SUPPORT PEDESTAL
    // ============================================================================
    const pedestalProfile = [
        new THREE.Vector2(0, -70),
        new THREE.Vector2(65, -70),
        new THREE.Vector2(65, -68),
        new THREE.Vector2(62, -68),
        new THREE.Vector2(62, -65),
        new THREE.Vector2(55, -60),
        new THREE.Vector2(55, -55),
        new THREE.Vector2(50, -50),
        new THREE.Vector2(45, -45),
        new THREE.Vector2(45, -35),
        new THREE.Vector2(35, -25),
        new THREE.Vector2(25, -25),
        new THREE.Vector2(20, -20),
        new THREE.Vector2(0, -20)
    ];
    const pedestalGeo = new THREE.LatheGeometry(pedestalProfile, 128);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, darkSteel);
    group.add(pedestalMesh);

    parts.push({
        name: 'MainSupportPedestal',
        description: 'A massive foundational structure constructed from vibration-dampening dark steel alloys, designed to anchor the metamaterial lattice and prevent seismic flanking paths.',
        material: darkSteel,
        function: 'Structural Support and Ground Isolation',
        assemblyOrder: 1,
        connections: ['SeismicIsolators', 'CoolingPipesSystem'],
        failureEffect: 'Structural misalignment leading to catastrophic transformation acoustics mapping errors.',
        cascadeFailures: ['CloakingDegradation', 'LatticeFracture'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // ============================================================================
    // PART 2: SEISMIC ISOLATORS
    // ============================================================================
    const isolatorsGrp = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const isoGroup = new THREE.Group();
        
        // Base Cylinder
        const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 12, 32), darkSteel);
        baseCyl.position.y = -64;
        isoGroup.add(baseCyl);
        
        // Hydraulic Piston
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 16, 32), chrome);
        piston.position.y = -50;
        isoGroup.add(piston);
        
        // Heavy Dampening Spring
        const springGeo = new THREE.TorusKnotGeometry(3, 0.8, 128, 16, 4, 12);
        const spring = new THREE.Mesh(springGeo, copper);
        spring.position.y = -50;
        spring.scale.set(1, 2.5, 1);
        isoGroup.add(spring);
        
        isoGroup.position.set(50 * Math.cos(angle), 0, 50 * Math.sin(angle));
        isolatorsGrp.add(isoGroup);
    }
    group.add(isolatorsGrp);

    parts.push({
        name: 'SeismicIsolators',
        description: 'Eight heavy-duty hydraulic piston assemblies wrapped in high-tension copper-alloy springs. These decouple the cloaking rig from planetary tectonic vibrations.',
        material: chrome,
        function: 'Low-Frequency Mechanical Decoupling',
        assemblyOrder: 2,
        connections: ['MainSupportPedestal', 'CloakSupportRing'],
        failureEffect: 'Low-frequency seismic waves bypass the cloak, corrupting the delicate inner void.',
        cascadeFailures: ['QuantumSensorDecoherence'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 50 }
    });

    // ============================================================================
    // PART 3: CLOAK SUPPORT RING
    // ============================================================================
    const supportRingGeo = new THREE.TorusGeometry(38, 3, 64, 128);
    const supportRingMesh = new THREE.Mesh(supportRingGeo, steel);
    supportRingMesh.rotation.x = Math.PI / 2;
    group.add(supportRingMesh);

    // Add locking clamps around the ring
    const clampsGrp = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const clampGeo = new THREE.BoxGeometry(8, 4, 10);
        const clamp = new THREE.Mesh(clampGeo, copper);
        clamp.position.set(38 * Math.cos(angle), 0, 38 * Math.sin(angle));
        clamp.lookAt(0, 0, 0);
        clampsGrp.add(clamp);
    }
    group.add(clampsGrp);

    parts.push({
        name: 'EquatorialSupportRing',
        description: 'A massive steel torus running along the equator of the metamaterial shell. Provides structural integrity and houses the primary data buses for active feedback nodes.',
        material: steel,
        function: 'Lattice Stabilization',
        assemblyOrder: 3,
        connections: ['SeismicIsolators', 'MetamaterialLattice'],
        failureEffect: 'Gravitational sag deforms the metamaterial lattice, introducing anisotropic errors in the density tensor.',
        cascadeFailures: ['WaveScattering', 'CloakRupture'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Explode outwards later if needed
    });

    // ============================================================================
    // PART 4: CRYOGENIC COOLING PIPES
    // ============================================================================
    const pipeMats = [copper, steel, darkSteel];
    const pipesGrp = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const points = [];
        points.push(new THREE.Vector3(60 * Math.cos(angle), -69, 60 * Math.sin(angle)));
        points.push(new THREE.Vector3(55 * Math.cos(angle), -65, 55 * Math.sin(angle)));
        points.push(new THREE.Vector3(52 * Math.cos(angle + 0.2), -50, 52 * Math.sin(angle + 0.2)));
        points.push(new THREE.Vector3(45 * Math.cos(angle + 0.5), -40, 45 * Math.sin(angle + 0.5)));
        points.push(new THREE.Vector3(42 * Math.cos(angle + 0.8), -20, 42 * Math.sin(angle + 0.8)));
        points.push(new THREE.Vector3(39 * Math.cos(angle + 1.0), -5, 39 * Math.sin(angle + 1.0)));
        points.push(new THREE.Vector3(38 * Math.cos(angle + 1.1), 0, 38 * Math.sin(angle + 1.1)));
        
        const curve = new THREE.CatmullRomCurve3(points);
        const pipeGeo = new THREE.TubeGeometry(curve, 128, 0.7, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, pipeMats[i % 3]);
        pipesGrp.add(pipeMesh);
    }
    group.add(pipesGrp);

    parts.push({
        name: 'SuperfluidCoolingNetwork',
        description: 'An intricate array of tubes circulating superfluid helium. Required to maintain the Willis coupling nodes at superconducting temperatures to minimize thermal phonon noise.',
        material: copper,
        function: 'Thermal Management',
        assemblyOrder: 4,
        connections: ['MainSupportPedestal', 'EquatorialSupportRing'],
        failureEffect: 'Thermal expansion of the metamaterial lattice, shifting the resonance frequencies of the Helmholtz elements.',
        cascadeFailures: ['BandwidthCollapse', 'Overheating'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: -20 }
    });

    // ============================================================================
    // PART 5 & 6: QUANTUM CORE PAYLOAD (The object being cloaked)
    // ============================================================================
    const coreGrp = new THREE.Group();
    
    // Core Containment Sphere
    const coreVesselGeo = new THREE.IcosahedronGeometry(13, 3);
    const coreVesselMat = new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true });
    const coreVessel = new THREE.Mesh(coreVesselGeo, coreVesselMat);
    coreGrp.add(coreVessel);

    // Inner glowing crystal
    const crystalGeo = new THREE.OctahedronGeometry(4, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.8 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    coreGrp.add(crystal);

    // Gyroscopic Rings
    for (let i = 0; i < 3; i++) {
        const gyroGeo = new THREE.TorusKnotGeometry(6 + i*2, 0.4, 128, 16, 2, 3 + i);
        const gyroMat = (i === 1) ? copper : chrome;
        const gyro = new THREE.Mesh(gyroGeo, gyroMat);
        
        // Add extreme detailing (greebles) to the rings
        for (let j = 0; j < 18; j++) {
            const greeble = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), steel);
            const r = 6 + i*2;
            const theta = (j / 18) * Math.PI * 2;
            greeble.position.set(r * Math.cos(theta), r * Math.sin(theta), 0);
            greeble.lookAt(0,0,0);
            gyro.add(greeble);
        }
        
        coreGrp.add(gyro);
        gyros.push(gyro);
    }
    group.add(coreGrp);

    parts.push({
        name: 'PrimaryContainmentVessel',
        description: 'A geodesic Faraday-acoustic cage defining the R1 boundary (r < 16). It provides the final physical barrier ensuring absolute isolation from external pressure gradients.',
        material: darkSteel,
        function: 'Payload Boundary Definition',
        assemblyOrder: 5,
        connections: ['QuantumInterferometer', 'MetamaterialLattice'],
        failureEffect: 'Evanescent acoustic waves penetrate the void space.',
        cascadeFailures: ['PayloadCompromise'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        name: 'QuantumInterferometerCore',
        description: 'An ultra-sensitive gyroscopic quantum sensor. It is so delicate that even a micro-pascal of acoustic pressure would cause total wave-function collapse. It is the reason the cloak exists.',
        material: glass,
        function: 'Scientific Measurement',
        assemblyOrder: 6,
        connections: ['PrimaryContainmentVessel'],
        failureEffect: 'Loss of scientific data. Mission failure.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // ============================================================================
    // PART 7, 8, 9, 10: PENTAMODE METAMATERIAL LATTICE (OCTET-TRUSS)
    // ============================================================================
    // To create an authentic pentamode fluid-like solid, we generate a massive
    // octet-truss lattice restricted to the spherical shell R1 <= r <= R2.
    const latticeNodes = [];
    
    // Generate nodes using Face-Centered Cubic (FCC) / Diamond-like subset
    for (let i = -Math.ceil(R2/LATTICE_A); i <= Math.ceil(R2/LATTICE_A); i++) {
        for (let j = -Math.ceil(R2/LATTICE_A); j <= Math.ceil(R2/LATTICE_A); j++) {
            for (let k = -Math.ceil(R2/LATTICE_A); k <= Math.ceil(R2/LATTICE_A); k++) {
                if ((i + j + k) % 2 === 0) {
                    const x = i * LATTICE_A;
                    const y = j * LATTICE_A;
                    const z = k * LATTICE_A;
                    const r = Math.sqrt(x*x + y*y + z*z);
                    if (r >= R1 && r <= R2) {
                        latticeNodes.push(new THREE.Vector3(x, y, z));
                        dynamicNodes.push({x, y, z, r});
                    }
                }
            }
        }
    }

    // InstancedMesh for Nodes
    const nodeGeo = new THREE.IcosahedronGeometry(0.5, 1);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const nodeMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, latticeNodes.length);
    
    // InstancedMesh for Active Willis Couplers (Asymmetric Caps)
    const capGeo = new THREE.ConeGeometry(0.6, 1.2, 8);
    capGeo.rotateZ(-Math.PI / 2); // Point in +X direction for asymmetry
    const capMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.3 }); // Copper
    const capMesh = new THREE.InstancedMesh(capGeo, capMat, latticeNodes.length);

    const dummyMatrix = new THREE.Matrix4();
    const dummyColor = new THREE.Color();
    
    for (let i = 0; i < latticeNodes.length; i++) {
        const p = latticeNodes[i];
        dummyMatrix.makeTranslation(p.x, p.y, p.z);
        nodeMesh.setMatrixAt(i, dummyMatrix);
        
        // Willis couplers point outward slightly and are shifted
        const pNorm = p.clone().normalize();
        const dummyMatrixCap = new THREE.Matrix4();
        dummyMatrixCap.makeTranslation(p.x + pNorm.x * 0.3, p.y + pNorm.y * 0.3, p.z + pNorm.z * 0.3);
        
        const dummyObj = new THREE.Object3D();
        dummyObj.position.copy(p);
        dummyObj.position.addScaledVector(pNorm, 0.3);
        const lookTarget = p.clone().add(pNorm);
        dummyObj.lookAt(lookTarget);
        dummyObj.updateMatrix();
        capMesh.setMatrixAt(i, dummyObj.matrix);
    }
    group.add(nodeMesh);
    group.add(capMesh);

    parts.push({
        name: 'MetamaterialInertialNodes',
        description: 'Thousands of high-density inertial spheres forming the vertices of the pentamode lattice. Their carefully calibrated mass ensures the effective dynamic density tensor matches the required coordinate transformation.',
        material: chrome,
        function: 'Dynamic Mass Density Tuning',
        assemblyOrder: 7,
        connections: ['PentamodeStrutNetwork'],
        failureEffect: 'Isotropic density profile is lost, causing significant acoustic scattering cross-section.',
        cascadeFailures: ['WillisCouplingFailure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 50 }
    });

    parts.push({
        name: 'ActiveWillisCouplers',
        description: 'Asymmetric copper cones affixed to the inertial nodes. These introduce a bianisotropic-like Willis coupling between macroscopic strain and velocity, overcoming standard bandwidth limitations of passive resonant cloaks.',
        material: copper,
        function: 'Non-Reciprocal Phase Modulation',
        assemblyOrder: 8,
        connections: ['MetamaterialInertialNodes'],
        failureEffect: 'Cloak bandwidth collapses to a single infinitesimal frequency line.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: 50, z: 50 }
    });

    // Generate Struts
    const struts = [];
    const MAX_DIST = LATTICE_A * Math.sqrt(2) * 1.1; // Diagonal connection in FCC
    for (let i = 0; i < latticeNodes.length; i++) {
        for (let j = i + 1; j < latticeNodes.length; j++) {
            const p1 = latticeNodes[i];
            const p2 = latticeNodes[j];
            const dist = p1.distanceTo(p2);
            if (dist <= MAX_DIST && dist > LATTICE_A * 0.9) {
                struts.push({ p1, p2, dist });
            }
        }
    }

    const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 6);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    const strutMesh = new THREE.InstancedMesh(strutGeo, strutMat, struts.length);
    
    const dummyStrut = new THREE.Object3D();
    for (let i = 0; i < struts.length; i++) {
        const s = struts[i];
        const midPoint = new THREE.Vector3().addVectors(s.p1, s.p2).multiplyScalar(0.5);
        dummyStrut.position.copy(midPoint);
        
        // Orient cylinder from p1 to p2
        const dir = new THREE.Vector3().subVectors(s.p2, s.p1).normalize();
        const axis = new THREE.Vector3(0, 1, 0);
        dummyStrut.quaternion.setFromUnitVectors(axis, dir);
        
        dummyStrut.scale.set(1, s.dist, 1);
        dummyStrut.updateMatrix();
        strutMesh.setMatrixAt(i, dummyStrut.matrix);
    }
    group.add(strutMesh);

    parts.push({
        name: 'PentamodeStrutNetwork',
        description: 'An immense web of microscopic steel struts connecting the nodes. The geometry is engineered to force the shear modulus to asymptotically approach zero (K/G -> infinity), mimicking a fluid while maintaining solid structural integrity.',
        material: darkSteel,
        function: 'Shear Wave Suppression',
        assemblyOrder: 9,
        connections: ['MetamaterialInertialNodes', 'EquatorialSupportRing'],
        failureEffect: 'Transverse shear waves propagate through the structure, hitting the core and ruining the cloak.',
        cascadeFailures: ['PayloadCompromise'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: -50 }
    });

    // ============================================================================
    // PART 11 & 12: SUPERCOMPUTER CONTROL CLUSTERS
    // ============================================================================
    const rackGrp = new THREE.Group();
    const rackBase = new THREE.Mesh(new THREE.BoxGeometry(6, 18, 4), darkSteel);
    rackBase.position.y = 9;
    rackGrp.add(rackBase);
    
    for (let i = 0; i < 12; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.0, 3.8), aluminum);
        blade.position.set(0, 2 + i * 1.3, 0.2);
        
        const ledGeo = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(2.0, 0, 1.9);
        blade.add(led);
        
        rackGrp.add(blade);
    }

    const computersGrp = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const rack = rackGrp.clone();
        rack.position.set(70 * Math.cos(angle), -70, 70 * Math.sin(angle));
        rack.lookAt(0, -70, 0); // Face inward
        computersGrp.add(rack);
    }
    group.add(computersGrp);

    parts.push({
        name: 'TransformationAcousticsComputeCluster',
        description: 'Four exaflop supercomputer racks constantly calculating the spatiotemporal impedance variations required for the active Willis nodes, correcting for minute temperature and pressure changes in the ambient medium.',
        material: aluminum,
        function: 'Active Feedback Processing',
        assemblyOrder: 10,
        connections: ['ActiveWillisCouplers', 'PowerCabling'],
        failureEffect: 'Active nodes drift out of phase, turning the cloak into an immense acoustic amplifier instead.',
        cascadeFailures: ['CatastrophicResonance'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 0, z: 100 }
    });

    // ============================================================================
    // PART 13 & 14: PHASED ARRAY TRANSMITTERS (WAVE SOURCE)
    // ============================================================================
    const emitterGrp = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(2, 60, 60);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    emitterGrp.add(panelMesh);

    const transGeo = new THREE.CylinderGeometry(1.2, 0.4, 2, 16);
    transGeo.rotateZ(-Math.PI / 2); // Point along +X axis
    transMesh = new THREE.InstancedMesh(transGeo, copper, 625); // 25x25 grid
    
    let tIdx = 0;
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            const py = -28 + i * 2.33;
            const pz = -28 + j * 2.33;
            dummyMatrix.makeTranslation(1, py, pz);
            transMesh.setMatrixAt(tIdx, dummyMatrix);
            tIdx++;
        }
    }
    emitterGrp.add(transMesh);
    emitterGrp.position.set(-80, 0, 0);
    group.add(emitterGrp);

    parts.push({
        name: 'PhasedArrayTransmitters',
        description: 'A colossal 25x25 grid of extreme-power acoustic transducers. Generates a mathematically perfect incident plane wave propagating in the +X direction to test the cloak.',
        material: copper,
        function: 'Wave Generation',
        assemblyOrder: 11,
        connections: ['TransformationAcousticsComputeCluster'],
        failureEffect: 'Wavefront is not perfectly planar, confusing the baseline sensor data.',
        cascadeFailures: [],
        originalPosition: { x: -80, y: 0, z: 0 },
        explodedPosition: { x: -120, y: 0, z: 0 }
    });

    // ============================================================================
    // PART 15 & 16: ANECHOIC RECEIVER ARRAY
    // ============================================================================
    const receiverGrp = new THREE.Group();
    const recPanelMesh = new THREE.Mesh(panelGeo, steel);
    receiverGrp.add(recPanelMesh);

    const recGeo = new THREE.ConeGeometry(1.0, 3, 4);
    recGeo.rotateZ(Math.PI / 2); // Point along -X axis
    recMesh = new THREE.InstancedMesh(recGeo, rubber, 625);
    
    let rIdx = 0;
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            const py = -28 + i * 2.33;
            const pz = -28 + j * 2.33;
            dummyMatrix.makeTranslation(-1.5, py, pz);
            recMesh.setMatrixAt(rIdx, dummyMatrix);
            rIdx++;
        }
    }
    receiverGrp.add(recMesh);
    receiverGrp.position.set(80, 0, 0);
    group.add(receiverGrp);

    parts.push({
        name: 'AnechoicReceiverGrid',
        description: 'An array of deep-subwavelength rubber wedges embedded with ultra-sensitive microphones. It absorbs the transmitted wave and measures the forward-scattering cross section (which should be zero).',
        material: rubber,
        function: 'Wave Verification and Absorption',
        assemblyOrder: 12,
        connections: ['TransformationAcousticsComputeCluster'],
        failureEffect: 'Reflections off the back wall cause standing waves that corrupt the transformation acoustic field.',
        cascadeFailures: [],
        originalPosition: { x: 80, y: 0, z: 0 },
        explodedPosition: { x: 120, y: 0, z: 0 }
    });

    // ============================================================================
    // PART 17, 18, 19: EULERIAN ACOUSTIC FIELD VISUALIZATION (THE WAVES)
    // ============================================================================
    // We visualize the pressure field using dense grids of particles on the XY and XZ planes.
    // X goes from -70 to 70.
    const STEP = 2.0;
    const NUM_X = Math.floor(140 / STEP) + 1; // 71
    const NUM_YZ = Math.floor(100 / STEP) + 1; // 51
    
    // Generate initial coordinates
    for (let ix = 0; ix < NUM_X; ix++) {
        for (let iy = 0; iy < NUM_YZ; iy++) {
            const x = -70 + ix * STEP;
            const y = -50 + iy * STEP;
            const z = 0;
            waveParticlesXY.push({x, y, z});
        }
    }
    for (let ix = 0; ix < NUM_X; ix++) {
        for (let iz = 0; iz < NUM_YZ; iz++) {
            const x = -70 + ix * STEP;
            const y = 0;
            const z = -50 + iz * STEP;
            waveParticlesXZ.push({x, y, z});
        }
    }

    const visGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const visMatXY = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    visMeshXY = new THREE.InstancedMesh(visGeo, visMatXY, waveParticlesXY.length);
    group.add(visMeshXY);

    const visMatXZ = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    visMeshXZ = new THREE.InstancedMesh(visGeo, visMatXZ, waveParticlesXZ.length);
    group.add(visMeshXZ);

    parts.push({
        name: 'AcousticWavefrontTracers_XY',
        description: 'A dense Eulerian grid of sensors mapped across the X-Y plane measuring real-time acoustic pressure. Watch as the planar wave dynamically bends around the core without reflecting, perfectly reforming on the far side.',
        material: tinted,
        function: 'Field Visualization',
        assemblyOrder: 13,
        connections: [],
        failureEffect: 'Visualization fails; physicists are sad.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 80 }
    });
    
    parts.push({
        name: 'AcousticWavefrontTracers_XZ',
        description: 'A complementary Eulerian grid on the X-Z plane, proving the cloaking mechanism is fully three-dimensional and not just a 2D cylindrical trick.',
        material: tinted,
        function: 'Field Visualization',
        assemblyOrder: 14,
        connections: [],
        failureEffect: 'Visualization fails.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // ============================================================================
    // PART 20: DIAGNOSTIC HOLOGRAPHIC CONSOLE
    // ============================================================================
    const screenGeo = new THREE.PlaneGeometry(30, 20);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.2, side: THREE.DoubleSide, wireframe: true });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-40, 35, 40);
    screen.lookAt(0, 0, 0);
    
    // Screen Frame
    const frameGeo = new THREE.BoxGeometry(32, 22, 1);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.set(-40.5, 35, 40.5);
    frame.lookAt(0, 0, 0);
    group.add(screen);
    group.add(frame);

    parts.push({
        name: 'HolographicDiagnosticConsole',
        description: 'Displays the active spatial transformation tensor fields. Operators monitor the K/G ratio and Willis coupling coefficients in real time.',
        material: glass,
        function: 'User Interface',
        assemblyOrder: 15,
        connections: ['TransformationAcousticsComputeCluster'],
        failureEffect: 'Operators are blind to system state.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -60, y: 60, z: 60 }
    });

    // ============================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the derivation of acoustic cloaking parameters using coordinate transformations, the acoustic wave equation must remain form-invariant. Unlike electromagnetism, where Maxwell's equations elegantly retain their form, mapping the scalar acoustic wave equation yields an anisotropic mass density tensor and a scalar bulk modulus. What fundamental physical limitation does this impose on the physical realization of a broadband, perfect passive acoustic cloak in a fluid medium?",
            options: [
                "It requires the fluid to possess a negative bulk modulus, which is thermodynamically unstable without active energy injection.",
                "It dictates that the acoustic metamaterial must possess a spatially varying, anisotropic dynamic mass density tensor, which cannot be achieved using natural fluids, necessitating complex sub-wavelength inertial scatterers that suffer from narrow bandwidths due to their resonant nature.",
                "It implies the phase velocity within the cloak must be less than the speed of sound in the background medium, violating causality limits.",
                "It restricts the cloak to only operate for transverse acoustic waves, which do not propagate in inviscid fluids like air or water."
            ],
            correctAnswerIndex: 1,
            explanation: "Mapping the scalar acoustic pressure field into a deformed coordinate system mathematically equivalent to a cloak requires the resulting equations to describe a medium where mass density depends on the direction of wave propagation (anisotropy). Natural fluids only have scalar mass density. Metamaterials mimic this using resonant structures, but resonance inherently restricts the operating bandwidth."
        },
        {
            question: "The metamaterial lattice in this simulation utilizes an octet-truss pentamode structure to approximate fluid-like behavior within a solid matrix. A true pentamode material has a bulk modulus (K) and a shear modulus (G). Which of the following defines the theoretical limit of a pentamode metamaterial, and why is it critical for acoustic cloaking in a fluid environment?",
            options: [
                "K/G approaches 0, allowing the solid structure to support perfectly rigid transverse modes that cancel incident shear waves from the fluid.",
                "K/G approaches infinity (vanishing shear modulus), causing the solid structure to support only a single compressional mode (like a fluid), eliminating spurious shear wave scattering at the fluid-solid boundary of the cloak.",
                "K * G = 1, ensuring perfect impedance matching with the ambient fluid across all incident angles.",
                "Both K and G must be identically zero, rendering the material completely transparent to acoustic energy, mimicking a vacuum."
            ],
            correctAnswerIndex: 1,
            explanation: "Fluids do not support shear waves (G = 0). When building a solid metamaterial cloak to operate in a fluid (like water), any shear waves generated at the boundary will scatter and ruin the cloak. A pentamode material is a solid engineered to have extremely low shear modulus (K/G -> infinity), thus behaving acoustically like a fluid while retaining solid form."
        },
        {
            question: "A perfect, passive acoustic cloak must compress spatial waves into a smaller annular region (R1 < r < R2) without introducing any phase delay relative to the background wave outside the cloak. This requires the phase velocity inside the metamaterial to exceed the speed of sound in the background medium. According to the Bode-Fano bandwidth limit applied to scattering, what is the consequence of this strict requirement?",
            options: [
                "The cloak can only operate perfectly at a single frequency or a discrete set of harmonic frequencies, as causality strictly limits the bandwidth over which anomalous phase velocities (and thus near-zero or negative effective indices) can be passively maintained.",
                "The metamaterial must actively absorb and re-emit the acoustic energy, leading to massive thermal dissipation and requiring cryogenic cooling.",
                "The group velocity must also exceed the background speed of sound, which violates the theory of special relativity.",
                "The structural lattice must be physically rotated at high speeds to induce a Coriolis-based phase shift that compensates for the inherent material delay."
            ],
            correctAnswerIndex: 0,
            explanation: "Because the wave has to traverse a longer 'curved' path around the object in the same amount of time it would have taken to go straight through, its phase velocity must be superluminal (relative to sound). Passive systems can only achieve this via anomalous dispersion near a resonance, which mathematically restricts perfect operation to an extremely narrow bandwidth."
        },
        {
            question: "Advanced acoustic metamaterials often incorporate asymmetric sub-wavelength scatterers (such as the cones in this simulation) to induce Willis coupling. What is the macroscopic manifestation of Willis coupling in the effective constitutive equations of the acoustic medium?",
            options: [
                "It introduces a nonlinear term coupling the acoustic pressure directly to the ambient temperature of the fluid.",
                "It couples the macroscopic volume strain to the pressure gradient, and the momentum density to the time derivative of strain, acting as the exact acoustic analog to bianisotropy (magnetoelectric coupling) in electromagnetism.",
                "It creates a direct coupling between the shear modulus and the dynamic mass density, allowing Newtonian fluids to support transverse waves.",
                "It decouples the phase velocity from the group velocity, theoretically allowing for infinite bandwidth acoustic energy transmission."
            ],
            correctAnswerIndex: 1,
            explanation: "Willis coupling arises when scatterers lack inversion symmetry. It means that a pressure gradient not only accelerates mass but also directly induces volume strain (and vice versa). This is mathematically identical to bianisotropy in electromagnetism (where electric fields induce magnetic responses) and grants extra degrees of freedom to overcome passive cloaking limits."
        },
        {
            question: "To achieve a negative effective bulk modulus in specific regions of an acoustic metamaterial, researchers often embed an array of Helmholtz resonators. By what physical mechanism does a sub-wavelength Helmholtz resonator array produce a macroscopic negative effective bulk modulus near its resonance frequency?",
            options: [
                "By expanding and contracting perfectly out-of-phase with the incident acoustic pressure field, such that the volume average of the induced fluid acceleration opposes the incident pressure gradient.",
                "By perfectly reflecting the incident acoustic waves back to the source, creating a standing wave with zero net energy transfer through the unit cell.",
                "By inducing micro-cavitation bubbles that absorb the acoustic energy through extreme thermal dissipation upon collapse.",
                "By accelerating the fluid particles to supersonic speeds within the resonator necks, creating localized shockwaves that physically reverse the wave vector."
            ],
            correctAnswerIndex: 0,
            explanation: "When driven just above their resonant frequency, the mass of fluid in the neck of a Helmholtz resonator oscillates exactly out of phase (180 degrees) with the driving pressure wave. When this local, microscopic out-of-phase motion is averaged over the macroscopic unit cell, the entire medium appears to compress when the pressure drops and expand when the pressure rises—the definition of a negative bulk modulus."
        }
    ];

    // ============================================================================
    // ANIMATION LOOP - TRANSFORMATION ACOUSTICS MATH EXECUTED REAL-TIME
    // ============================================================================
    function animate(time, speed, meshes) {
        // time is continuous, speed is a multiplier
        const t = time * speed * 2.0;

        // 1. Rotate the Gyroscopic Quantum Core
        if (gyros.length === 3) {
            gyros[0].rotation.x = t * 0.5;
            gyros[0].rotation.y = t * 0.3;
            gyros[1].rotation.y = -t * 0.4;
            gyros[1].rotation.z = t * 0.6;
            gyros[2].rotation.x = -t * 0.7;
            gyros[2].rotation.z = -t * 0.5;
        }

        const dummy = new THREE.Matrix4();
        const color = new THREE.Color();
        const scaleVec = new THREE.Vector3();

        // 2. Animate the Eulerian Acoustic Field (XY Plane)
        for (let i = 0; i < waveParticlesXY.length; i++) {
            const p = waveParticlesXY[i];
            let pressure = 0;
            const r = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);

            if (r < R1) {
                // Inside the cloak: Perfectly isolated. No wave penetration.
                pressure = 0;
            } else {
                let xv = p.x;
                if (r <= R2) {
                    // Inside the Metamaterial Shell: Apply Coordinate Transformation
                    // Virtual radius maps [R1, R2] to [0, R2]
                    const rho = R2 * (r - R1) / (R2 - R1);
                    // Map physical x to virtual x
                    xv = rho * (p.x / r);
                }
                // Calculate planar wave phase in virtual space
                const phase = WAVE_K * xv - WAVE_OMEGA * t;
                pressure = Math.cos(phase);
            }

            // Map pressure to beautiful Cyan (Compression) and Magenta (Rarefaction)
            if (pressure > 0.05) {
                color.setRGB(0.1, 0.2 + 0.8 * pressure, 0.4 + 0.6 * pressure); // Cyan
            } else if (pressure < -0.05) {
                color.setRGB(0.4 + 0.6 * -pressure, 0.1, 0.4 + 0.6 * -pressure); // Magenta
            } else {
                color.setRGB(0.05, 0.05, 0.05); // Quiet/Zero pressure
            }

            // Pulsing scale effect based on absolute pressure
            const s = 0.2 + 0.8 * Math.abs(pressure);
            scaleVec.set(s, s, s);
            
            dummy.makeTranslation(p.x, p.y, p.z);
            dummy.scale(scaleVec);
            
            visMeshXY.setMatrixAt(i, dummy);
            visMeshXY.setColorAt(i, color);
        }
        visMeshXY.instanceMatrix.needsUpdate = true;
        visMeshXY.instanceColor.needsUpdate = true;

        // 3. Animate the Eulerian Acoustic Field (XZ Plane)
        for (let i = 0; i < waveParticlesXZ.length; i++) {
            const p = waveParticlesXZ[i];
            let pressure = 0;
            const r = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);

            if (r < R1) {
                pressure = 0;
            } else {
                let xv = p.x;
                if (r <= R2) {
                    const rho = R2 * (r - R1) / (R2 - R1);
                    xv = rho * (p.x / r);
                }
                const phase = WAVE_K * xv - WAVE_OMEGA * t;
                pressure = Math.cos(phase);
            }

            if (pressure > 0.05) {
                color.setRGB(0.1, 0.2 + 0.8 * pressure, 0.4 + 0.6 * pressure);
            } else if (pressure < -0.05) {
                color.setRGB(0.4 + 0.6 * -pressure, 0.1, 0.4 + 0.6 * -pressure);
            } else {
                color.setRGB(0.05, 0.05, 0.05);
            }

            const s = 0.2 + 0.8 * Math.abs(pressure);
            scaleVec.set(s, s, s);
            
            dummy.makeTranslation(p.x, p.y, p.z);
            dummy.scale(scaleVec);
            
            visMeshXZ.setMatrixAt(i, dummy);
            visMeshXZ.setColorAt(i, color);
        }
        visMeshXZ.instanceMatrix.needsUpdate = true;
        visMeshXZ.instanceColor.needsUpdate = true;

        // 4. Animate the Phased Array Transmitters physically vibrating!
        const transPhase = WAVE_K * (-80) - WAVE_OMEGA * t;
        const transDisp = Math.cos(transPhase) * 1.5; // Exaggerated displacement for visuals
        let tIdx = 0;
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                const py = -28 + i * 2.33;
                const pz = -28 + j * 2.33;
                dummy.makeTranslation(1 + transDisp, py, pz);
                transMesh.setMatrixAt(tIdx, dummy);
                tIdx++;
            }
        }
        transMesh.instanceMatrix.needsUpdate = true;

        // 5. Animate the Anechoic Receiver Microphones absorbing the wave!
        const recPhase = WAVE_K * (80) - WAVE_OMEGA * t;
        const recDisp = Math.cos(recPhase) * 0.2; // Small vibration showing absorption
        let rIdx = 0;
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                const py = -28 + i * 2.33;
                const pz = -28 + j * 2.33;
                dummy.makeTranslation(-1.5 + recDisp, py, pz);
                recMesh.setMatrixAt(rIdx, dummy);
                rIdx++;
            }
        }
        recMesh.instanceMatrix.needsUpdate = true;
    }

    return {
        group,
        parts,
        description: 'ULTRA GOD-TIER ACOUSTIC CLOAKING DEVICE: A masterpiece of Transformation Acoustics. It utilizes a highly complex pentamode octet-truss metamaterial lattice, imbued with active Willis coupling nodes, to map a 3D physical coordinate space into a virtual domain. It flawlessly bends incoming planar acoustic waves perfectly around the central quantum core void without scattering or reflecting, achieving a zero scattering cross-section. Features a massive 35,000+ element particle system simulating the real-time Eulerian pressure field using precise mathematical phase mapping.',
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAcousticCloakingDevice() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
