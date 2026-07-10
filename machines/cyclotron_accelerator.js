import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {}; 
    
    // Custom High-Tech Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff2200,
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff22,
        emissive: 0x00ff22,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.9
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.7
    });

    // 1. Core Electromagnet Base & Top (Yoke)
    // Using LatheGeometry for a complex, non-trivial shape
    const yokePoints = [];
    for ( let i = 0; i < 30; i ++ ) {
        yokePoints.push( new THREE.Vector2( Math.sin( i * 0.15 ) * 3 + 12, ( i - 15 ) * 0.4 ) );
    }
    const yokeGeo = new THREE.LatheGeometry( yokePoints, 128 );
    const yokeBase = new THREE.Mesh( yokeGeo, darkSteel );
    yokeBase.position.set(0, 0, 0);
    group.add(yokeBase);
    
    const yokeTop = new THREE.Mesh( yokeGeo, darkSteel );
    yokeTop.rotation.x = Math.PI;
    yokeTop.position.set(0, 12, 0);
    group.add(yokeTop);
    
    parts.push({
        name: "Main Magnetic Yoke",
        description: "The massive precision-machined iron structure providing the return path for the intense magnetic flux.",
        material: "darkSteel",
        function: "Contains and focuses the tremendous 2.5 Tesla magnetic field required for particle acceleration confinement.",
        assemblyOrder: 1,
        connections: ["Superconducting Coils", "Vacuum Chamber", "Hydraulic Lifts"],
        failureEffect: "Loss of magnetic confinement, severe beam dispersion, catastrophic radiation leak.",
        cascadeFailures: ["Coil Quench", "Beam Tube Rupture", "Yoke Fracture"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    // 2. Superconducting Coils (Toroidal Arrays)
    const coilGroup = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(9.5, 1.8, 64, 128);
    
    const coilBottom = new THREE.Mesh(coilGeo, copper);
    coilBottom.rotation.x = Math.PI / 2;
    coilBottom.position.set(0, 2.5, 0);
    coilGroup.add(coilBottom);

    const coilTop = new THREE.Mesh(coilGeo, copper);
    coilTop.rotation.x = Math.PI / 2;
    coilTop.position.set(0, 9.5, 0);
    coilGroup.add(coilTop);
    
    group.add(coilGroup);
    meshes.coilBottom = coilBottom;
    meshes.coilTop = coilTop;

    parts.push({
        name: "NbTi Superconducting Coils",
        description: "Massive copper-clad niobium-titanium electromagnets immersed in a liquid helium bath.",
        material: "copper",
        function: "Generates the main static magnetic field that forces charged particles into circular orbital paths.",
        assemblyOrder: 2,
        connections: ["Main Yoke", "Cryogenic Cooling System"],
        failureEffect: "Thermal quench, explosive boiling of liquid helium, sudden violent loss of magnetic field.",
        cascadeFailures: ["Cryo System Rupture", "Vacuum Chamber Implosion", "Structure Warping"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 6, z: -25}
    });

    // 3. RF Cavities (Dees) - Complex Extruded Geometry
    const deeShape = new THREE.Shape();
    deeShape.absarc(0, 0, 8.5, 0.15, Math.PI - 0.15, false);
    deeShape.lineTo(-8.5, 0.8);
    deeShape.lineTo(8.5, 0.8);
    
    const deeExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 8, steps: 4, bevelSize: 0.15, bevelThickness: 0.2 };
    const deeGeo = new THREE.ExtrudeGeometry(deeShape, deeExtrudeSettings);
    
    const dee1 = new THREE.Mesh(deeGeo, chrome);
    dee1.rotation.x = Math.PI / 2;
    dee1.position.set(0, 6, -0.6);
    group.add(dee1);

    const dee2 = new THREE.Mesh(deeGeo, chrome);
    dee2.rotation.x = Math.PI / 2;
    dee2.rotation.z = Math.PI;
    dee2.position.set(0, 6, 0.6);
    group.add(dee2);

    meshes.dee1 = dee1;
    meshes.dee2 = dee2;

    parts.push({
        name: "Radio-Frequency Cavities (Dees)",
        description: "D-shaped hollow electrodes manufactured from ultra-highly polished chromium and oxygen-free copper.",
        material: "chrome",
        function: "Applies a rapidly alternating multi-megavolt electric field across the gap to accelerate particles twice per orbit.",
        assemblyOrder: 3,
        connections: ["Vacuum Chamber", "Klystron RF Generator"],
        failureEffect: "Electrical arcing in vacuum, immediate particle deceleration, beam collapse.",
        cascadeFailures: ["RF Generator Overload", "Dielectric Breakdown"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 25, y: 6, z: 0}
    });

    // 4. Ultra-High Vacuum Chamber
    const vacuumGeo = new THREE.CylinderGeometry(10, 10, 3.5, 128, 1, false);
    const vacuumChamber = new THREE.Mesh(vacuumGeo, tinted); // Using tinted glass
    vacuumChamber.position.set(0, 6, 0);
    group.add(vacuumChamber);

    // Structural ribbing for vacuum chamber
    const ribGeo = new THREE.TorusGeometry(10.1, 0.2, 16, 128);
    for(let i=0; i<3; i++) {
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.rotation.x = Math.PI/2;
        rib.position.set(0, 4.5 + i*1.5, 0);
        group.add(rib);
    }

    parts.push({
        name: "Main Vacuum Containment Vessel",
        description: "Reinforced titanium-alloy and quartz containment vessel pumped down to 10^-9 Torr.",
        material: "tinted/steel",
        function: "Provides an absolutely collision-free environment for the relativistic particle beam.",
        assemblyOrder: 4,
        connections: ["Turbo-molecular Pumps", "Beamline Extraction Tube"],
        failureEffect: "Atmospheric ingress, immediate severe scattering of the particle beam, massive internal ionization.",
        cascadeFailures: ["Pump Disintegration", "Detector Blinding", "Arcing"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 6, z: 25}
    });

    // 5. Central Ion Source & Plasma
    const ionSourceGeo = new THREE.CylinderGeometry(0.8, 0.8, 5, 32);
    const ionSource = new THREE.Mesh(ionSourceGeo, steel);
    ionSource.position.set(0, 6, 0);
    group.add(ionSource);

    const ionPlasmaGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const ionPlasma = new THREE.Mesh(ionPlasmaGeo, neonPurple);
    ionPlasma.position.set(0, 6, 0);
    group.add(ionPlasma);
    meshes.ionPlasma = ionPlasma;

    parts.push({
        name: "Penning Ion Gauge (PIG) Source",
        description: "Filament-based continuous plasma source for generating raw protons or heavy atomic ions.",
        material: "steel/neon",
        function: "Injects raw ionized particles into the geometric center of the cyclotron to initiate the acceleration spiral.",
        assemblyOrder: 5,
        connections: ["Gas Injection Manifold", "Dees", "Plasma Confinement Field"],
        failureEffect: "Loss of particle supply, beam current instantaneously drops to zero.",
        cascadeFailures: ["Experiment Abortion", "Filament Burnout"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });

    // 6. Extraction Electrostatic Deflector
    const deflectorShape = new THREE.Shape();
    deflectorShape.moveTo(0, 0);
    deflectorShape.lineTo(4, 1);
    deflectorShape.lineTo(4, -1);
    deflectorShape.lineTo(0, 0);
    const defGeo = new THREE.ExtrudeGeometry(deflectorShape, {depth: 0.5, bevelEnabled: true, bevelSize: 0.05});
    const deflector = new THREE.Mesh(defGeo, copper);
    deflector.position.set(8.5, 5.75, -2);
    deflector.rotation.x = Math.PI / 2;
    deflector.rotation.z = Math.PI / 3;
    group.add(deflector);

    parts.push({
        name: "Electrostatic Septum Deflector",
        description: "Ultra-high-voltage charged titanium septum plate and grounded outer wall.",
        material: "copper",
        function: "Violently peels the outermost particle orbit out of the main magnetic field and directs it into the beamline.",
        assemblyOrder: 6,
        connections: ["Vacuum Chamber", "Beamline Tube", "High Voltage DC Supply"],
        failureEffect: "Beam strikes the outer wall instead of extracting, causing extreme localized radiation and thermal melting.",
        cascadeFailures: ["Chamber Breach", "Superconductor Quench"],
        originalPosition: {x: 8.5, y: 6, z: -2},
        explodedPosition: {x: 15, y: 15, z: -5}
    });

    // 7. Elaborate Beamline Transport Tube
    const beamLineGroup = new THREE.Group();
    beamLineGroup.position.set(9.5, 6, -3);
    beamLineGroup.rotation.y = -Math.PI / 5;
    group.add(beamLineGroup);

    const tubeGeo = new THREE.CylinderGeometry(1.2, 1.2, 35, 64);
    tubeGeo.rotateZ(Math.PI / 2);
    const beamTube = new THREE.Mesh(tubeGeo, aluminum);
    beamTube.position.set(17.5, 0, 0);
    beamLineGroup.add(beamTube);
    
    // Add flanges to the beamline
    const flangeGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 32);
    flangeGeo.rotateZ(Math.PI / 2);
    for (let i = 0; i < 7; i++) {
        const flange = new THREE.Mesh(flangeGeo, darkSteel);
        flange.position.set(2.5 + i * 5, 0, 0);
        beamLineGroup.add(flange);
    }

    parts.push({
        name: "High-Vacuum Transport Beamline",
        description: "Sectioned aluminum-alloy high-vacuum transport tube secured with conflat flanges.",
        material: "aluminum/darkSteel",
        function: "Provides a straight, magnetically shielded path for the extracted relativistic particle beam to reach the target.",
        assemblyOrder: 7,
        connections: ["Extraction Deflector", "Quadrupole Magnets", "Target Chamber"],
        failureEffect: "Beam scattering, immense radiation leak into the accelerator tunnel hall.",
        cascadeFailures: ["Vacuum Pump Destruction", "Sensor Burnout"],
        originalPosition: {x: 22, y: 6, z: -12},
        explodedPosition: {x: 35, y: 25, z: -20}
    });

    // 8. Quadrupole Focusing Magnet Arrays
    const quadMagnets = new THREE.Group();
    beamLineGroup.add(quadMagnets);
    meshes.quadMagnets = [];

    for (let i = 0; i < 5; i++) {
        const xPos = 5 + i * 6;
        const qGroup = new THREE.Group();
        qGroup.position.set(xPos, 0, 0);
        
        // Complex Quadrupole Assembly
        const yokeShellGeo = new THREE.CylinderGeometry(3.5, 3.5, 2.5, 8);
        yokeShellGeo.rotateZ(Math.PI/2);
        const yokeShell = new THREE.Mesh(yokeShellGeo, darkSteel);
        qGroup.add(yokeShell);

        // 4 internal poles
        const poleGeo = new THREE.BoxGeometry(1.5, 2.2, 2.4);
        for(let p=0; p<4; p++) {
            const pole = new THREE.Mesh(poleGeo, steel);
            pole.rotation.x = p * (Math.PI/2);
            pole.position.y = Math.sin(p * Math.PI/2) * 1.8;
            pole.position.z = Math.cos(p * Math.PI/2) * 1.8;
            qGroup.add(pole);
        }

        // Glowing excitation coils
        const wrapGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 32);
        const wrap = new THREE.Mesh(wrapGeo, neonGreen);
        wrap.rotation.y = Math.PI / 2;
        qGroup.add(wrap);
        meshes.quadMagnets.push(wrap);

        quadMagnets.add(qGroup);
    }

    parts.push({
        name: "Multipole Focusing Lenses",
        description: "Alternating gradient quadrupole and sextupole magnetic lenses.",
        material: "darkSteel/neonGreen",
        function: "Actively squeezes and focuses the diverging particle beam, preventing it from striking the beam pipe walls.",
        assemblyOrder: 8,
        connections: ["Beamline Tube", "Power Conditioning Unit", "Coolant Manifold"],
        failureEffect: "Beam severely defocuses, causing massive localized thermal heating on the beam pipe walls and a radiation spike.",
        cascadeFailures: ["Beam Pipe Melt", "Total Loss of Vacuum"],
        originalPosition: {x: 25, y: 6, z: -15},
        explodedPosition: {x: 25, y: -10, z: -25}
    });

    // 9. Turbo-molecular Vacuum Pumps
    const pumpGeo = new THREE.CylinderGeometry(1.2, 1.8, 4, 32);
    const pumpMesh1 = new THREE.Mesh(pumpGeo, darkSteel);
    pumpMesh1.position.set(8, -2.5, 0);
    beamLineGroup.add(pumpMesh1);
    
    const pumpMesh2 = new THREE.Mesh(pumpGeo, darkSteel);
    pumpMesh2.position.set(20, -2.5, 0);
    beamLineGroup.add(pumpMesh2);

    // Pump details
    const blades = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 4.1, 16, 10, true), chrome);
    pumpMesh1.add(blades.clone());
    pumpMesh2.add(blades.clone());

    meshes.pump1 = pumpMesh1;
    meshes.pump2 = pumpMesh2;

    parts.push({
        name: "Turbo-molecular High-Vacuum Pumps",
        description: "Multi-stage axial turbine pumps with magnetically levitated bearings spinning at 90,000 RPM.",
        material: "darkSteel/chrome",
        function: "Maintains the 10^-9 Torr vacuum in the beamline by physically swatting gas molecules out of the chamber.",
        assemblyOrder: 9,
        connections: ["Beamline Tube", "Roughing Pump Line", "Control Bus"],
        failureEffect: "Catastrophic high-speed rotor crash, shrapnel generation, sudden massive loss of vacuum.",
        cascadeFailures: ["Beam Scattering", "Gate Valve Isolation Trigger", "Plasma Fire"],
        originalPosition: {x: 22, y: 3.5, z: -12},
        explodedPosition: {x: 22, y: -15, z: -12}
    });

    // 10. Target Scattering Chamber (Highly Complex Polyhedron)
    const targetGroup = new THREE.Group();
    targetGroup.position.set(38, 0, 0);
    beamLineGroup.add(targetGroup);

    const targetBaseGeo = new THREE.IcosahedronGeometry(4.5, 2);
    const targetBase = new THREE.Mesh(targetBaseGeo, aluminum);
    targetGroup.add(targetBase);

    // Add complex diagnostic viewports and detector housings
    for (let i = 0; i < 12; i++) {
        const phi = Math.acos( -1 + ( 2 * i ) / 12 );
        const theta = Math.sqrt( 12 * Math.PI ) * phi;
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1, 32), steel);
        const glassPane = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 32), glass);
        housing.add(glassPane);
        
        const r = 4.2;
        housing.position.setFromSphericalCoords(r, phi, theta);
        housing.lookAt(0,0,0);
        housing.rotateX(Math.PI / 2);
        targetGroup.add(housing);
    }

    parts.push({
        name: "Spherical Target Scattering Chamber",
        description: "Complex multi-port geodesic vacuum chamber surrounded by highly sensitive particle detectors.",
        material: "aluminum/glass",
        function: "Houses the collision target material and captures the spray of subatomic particles resulting from the impact.",
        assemblyOrder: 10,
        connections: ["Beamline Tube", "Radiation Detectors", "Target Manipulator"],
        failureEffect: "Isotope contamination of the chamber, destruction of multi-million dollar detectors.",
        cascadeFailures: ["Detector Array Blindness"],
        originalPosition: {x: 48, y: 6, z: -25},
        explodedPosition: {x: 65, y: 6, z: -35}
    });

    // 11. Rotating Target Manipulator & Isotope Foil
    const manipulatorGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 32);
    const manipulator = new THREE.Mesh(manipulatorGeo, chrome);
    manipulator.position.set(0, 3.5, 0);
    targetGroup.add(manipulator);

    const targetHolder = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 32), steel);
    targetHolder.position.set(0, -2.5, 0);
    targetHolder.rotation.x = Math.PI/2;
    manipulator.add(targetHolder);

    const targetFoil = new THREE.Mesh(new THREE.CircleGeometry(0.75, 32), copper);
    targetFoil.material.color.setHex(0xffaa00); // Gold foil
    targetHolder.add(targetFoil);
    meshes.manipulator = manipulator;

    parts.push({
        name: "Precision Target Manipulator & Gold Foil",
        description: "High-precision motorized shaft holding an ultra-thin gold or beryllium target foil.",
        material: "chrome/gold",
        function: "Positions the target exactly at the beam focus point; rotates rapidly to prevent catastrophic localized melting from beam energy.",
        assemblyOrder: 11,
        connections: ["Target Chamber", "Stepper Motor Driver"],
        failureEffect: "Target vaporizes instantly under intense multi-kilowatt beam heating.",
        cascadeFailures: ["Chamber Isotope Contamination", "Sudden Vacuum Spike"],
        originalPosition: {x: 48, y: 9.5, z: -25},
        explodedPosition: {x: 48, y: 25, z: -25}
    });

    // 12. Cryogenic Cooling Manifold (Complex Procedural Tubing)
    class CustomHelixCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const radius = 10.5;
            const tx = Math.cos(t * Math.PI * 16) * radius;
            const ty = (t * 14) - 1; // spiral upwards
            const tz = Math.sin(t * Math.PI * 16) * radius;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new CustomHelixCurve(1);
    const cryoGeo = new THREE.TubeGeometry(path, 500, 0.5, 16, false);
    const cryoLines = new THREE.Mesh(cryoGeo, chrome);
    group.add(cryoLines);

    parts.push({
        name: "Cryogenic Liquid Helium Manifold",
        description: "Extensive network of vacuum-jacketed stainless steel pipes circulating liquid helium at 4.2 Kelvin.",
        material: "chrome",
        function: "Removes immense heat and maintains the niobium-titanium coils strictly below their critical superconducting temperature.",
        assemblyOrder: 12,
        connections: ["Superconducting Coils", "External Cryoplant Facility"],
        failureEffect: "Helium leak into vacuum, rapid warming of the coil structure.",
        cascadeFailures: ["Violent Magnetic Quench", "Overpressure Blowout Valves Trigger"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: -25, y: -5, z: 25}
    });

    // 13. Hydraulic Lift Pistons
    const hydraulics = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2 + Math.PI/4;
        const hGroup = new THREE.Group();
        hGroup.position.set(Math.cos(angle)*15, 0, Math.sin(angle)*15);
        
        const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 12, 32), darkSteel);
        outerCyl.position.y = 6;
        hGroup.add(outerCyl);

        const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12, 32), chrome);
        innerCyl.position.y = 12;
        hGroup.add(innerCyl);

        hydraulics.add(hGroup);
    }
    group.add(hydraulics);
    meshes.hydraulics = hydraulics;

    parts.push({
        name: "Heavy-Duty Hydraulic Lift System",
        description: "Four massive high-pressure industrial hydraulic rams positioned around the yoke.",
        material: "darkSteel/chrome",
        function: "Lifts the upper 250-ton magnetic yoke assembly to allow maintenance access to the internal vacuum chamber and dees.",
        assemblyOrder: 13,
        connections: ["Yoke Top", "Yoke Base", "Hydraulic Pumping Station"],
        failureEffect: "Uneven lifting causing severe structural binding or catastrophic crushing of the internal vacuum chamber.",
        cascadeFailures: ["Vacuum Chamber Destruction", "Yoke Misalignment", "Seal Rupture"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 6, z: 35}
    });

    // 14. Telemetry & Sensor Data Bus
    const wirePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3( 12, 2, 0 ),
        new THREE.Vector3( 14, -2, -6 ),
        new THREE.Vector3( 22, -1, -12 ),
        new THREE.Vector3( 32, 2, -18 ),
        new THREE.Vector3( 42, -3, -25 )
    ]);
    const wireGeo = new THREE.TubeGeometry(wirePath, 128, 0.3, 16, false);
    const dataBus = new THREE.Mesh(wireGeo, plastic);
    dataBus.material = dataBus.material.clone();
    dataBus.material.color.setHex(0xffcc00); // Yellow warning cabling
    group.add(dataBus);

    parts.push({
        name: "High-Bandwidth Telemetry Data Bus",
        description: "Thick bundles of heavily shielded fiber-optic and coaxial cables.",
        material: "plastic",
        function: "Transmits terabytes of diagnostic data and detector hits per second from the target room back to the main control center.",
        assemblyOrder: 14,
        connections: ["Target Chamber", "Quadrupole Magnets", "Control Room"],
        failureEffect: "Total loss of diagnostic feedback, rendering physicists blind to the accelerator's status.",
        cascadeFailures: ["Improper Beam Tuning", "Unnoticed Beam Loss"],
        originalPosition: {x: 20, y: 0, z: -10},
        explodedPosition: {x: 20, y: -15, z: -5}
    });

    // 15. The Relativistic Particle Beam (Animated Visual Effect)
    const straightBeamPath = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(38,0,0));
    const straightBeamGeo = new THREE.TubeGeometry(straightBeamPath, 128, 0.15, 16, false);
    const particleBeam = new THREE.Mesh(straightBeamGeo, neonRed);
    particleBeam.position.set(0,0,0);
    beamLineGroup.add(particleBeam);
    meshes.particleBeam = particleBeam;

    parts.push({
        name: "Relativistic Particle Beam",
        description: "A tightly focused, intensely glowing beam of protons or heavy ions.",
        material: "neon",
        function: "The primary output of the cyclotron, traveling at up to 80% the speed of light, carrying immense kinetic energy.",
        assemblyOrder: 15,
        connections: ["Ion Source", "Extraction Deflector", "Target Foil"],
        failureEffect: "Beam violently dumps into the beam pipe walls, melting the metal and causing intense secondary neutron radiation.",
        cascadeFailures: ["Component Radioactive Activation", "Catastrophic Melt"],
        originalPosition: {x: 25, y: 6, z: -15},
        explodedPosition: {x: 25, y: 35, z: -15}
    });

    // 16. Structural Support Truss & Flooring Grating
    const trussGroup = new THREE.Group();
    group.add(trussGroup);
    
    const floorGeo = new THREE.CylinderGeometry(25, 25, 0.8, 64);
    const floorMesh = new THREE.Mesh(floorGeo, darkSteel);
    floorMesh.position.set(0, -0.4, 0);
    trussGroup.add(floorMesh);

    const pillarShape = new THREE.Shape();
    pillarShape.moveTo(-1.5, -1.5);
    pillarShape.lineTo(1.5, -1.5);
    pillarShape.lineTo(1.5, 1.5);
    pillarShape.lineTo(-1.5, 1.5);
    pillarShape.lineTo(-1.5, -1.5);
    const pillarHole = new THREE.Path();
    pillarHole.moveTo(-0.8, -0.8);
    pillarHole.lineTo(0.8, -0.8);
    pillarHole.lineTo(0.8, 0.8);
    pillarHole.lineTo(-0.8, 0.8);
    pillarHole.lineTo(-0.8, -0.8);
    pillarShape.holes.push(pillarHole);

    const pillarExtrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const pillarGeo = new THREE.ExtrudeGeometry(pillarShape, pillarExtrudeSettings);
    
    for (let i=0; i<8; i++) {
        const angle = (i * Math.PI) / 4;
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.rotation.x = -Math.PI / 2;
        pillar.position.set(Math.cos(angle)*20, -20, Math.sin(angle)*20);
        trussGroup.add(pillar);
    }

    parts.push({
        name: "Reinforced Concrete & Steel Truss Base",
        description: "Massive foundation anchored directly into bedrock to prevent micro-seismic vibrations.",
        material: "steel/darkSteel",
        function: "Maintains absolute sub-millimeter optical alignment of the cyclotron and the 40-meter beamline over decades of operation.",
        assemblyOrder: 16,
        connections: ["Bedrock", "Yoke Base", "Beamline Supports"],
        failureEffect: "Vibration causes beam misalignment.",
        cascadeFailures: ["Target Miss", "Beam Pipe Collision"],
        originalPosition: {x: 0, y: -10, z: 0},
        explodedPosition: {x: 0, y: -35, z: 0}
    });

    // 17. High-Density Radiation Shielding Blocks
    const shieldingGroup = new THREE.Group();
    group.add(shieldingGroup);
    const blockGeo = new THREE.BoxGeometry(6, 12, 6);
    for(let i=0; i<16; i++) {
        const angle = i * Math.PI / 8;
        if (i >= 1 && i <= 3) continue; // Gap for the beamline
        
        const block = new THREE.Mesh(blockGeo, darkSteel);
        block.position.set(Math.cos(angle)*20, 6, Math.sin(angle)*20);
        block.lookAt(0,6,0);
        shieldingGroup.add(block);
    }

    parts.push({
        name: "Borated Polyethylene & Lead Shielding",
        description: "Modular, interlocking blocks weighing 10 tons each.",
        material: "darkSteel",
        function: "Absorbs deadly stray neutrons and gamma radiation produced during the acceleration and collision process.",
        assemblyOrder: 17,
        connections: ["Facility Floor"],
        failureEffect: "Lethal radiation doses escaping into the facility control rooms.",
        cascadeFailures: ["Facility Evacuation", "Automated Scram"],
        originalPosition: {x: -20, y: 6, z: 20},
        explodedPosition: {x: -40, y: 6, z: 40}
    });

    // 18. RF Power Conditioning Unit (PCU)
    const pcuGeo = new THREE.BoxGeometry(6, 8, 10);
    const pcu = new THREE.Mesh(pcuGeo, aluminum);
    pcu.position.set(-15, 4, -20);
    group.add(pcu);
    
    for (let i=0; i<6; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 9.8), chrome);
        fin.position.set(-3 + i*1.2, 4, -20);
        group.add(fin);
    }

    parts.push({
        name: "Klystron RF Power Conditioning Unit",
        description: "Multi-megawatt klystron amplifier, thyratron switches, and massive capacitor banks.",
        material: "aluminum/chrome",
        function: "Converts raw grid AC power into precise, ultra-high-frequency RF waves fed directly into the Dees.",
        assemblyOrder: 18,
        connections: ["Facility Electrical Grid", "RF Cavities", "Water Cooling Loop"],
        failureEffect: "Massive electrical arc, immediate loss of acceleration power, explosions in the capacitor bank.",
        cascadeFailures: ["Capacitor Fire", "Grid Brownout"],
        originalPosition: {x: -15, y: 4, z: -20},
        explodedPosition: {x: -30, y: 4, z: -35}
    });

    // 19. Operator Control Console
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(-20, 0, 22);
    consoleGroup.rotation.y = Math.PI / 5;
    group.add(consoleGroup);

    const deskGeo = new THREE.BoxGeometry(8, 3.5, 4);
    const desk = new THREE.Mesh(deskGeo, darkSteel);
    desk.position.y = 1.75;
    consoleGroup.add(desk);

    const screenGeo = new THREE.BoxGeometry(2.5, 1.8, 0.2);
    const screenMat = neonBlue.clone();
    
    for(let i=0; i<4; i++) {
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set((i-1.5)*2.8, 4.2, -1.2);
        screen.rotation.x = -Math.PI / 8;
        if(i<1.5) screen.rotation.y = Math.PI / 8;
        if(i>1.5) screen.rotation.y = -Math.PI / 8;
        consoleGroup.add(screen);
        meshes['screen'+i] = screen;
    }

    parts.push({
        name: "Main Diagnostic & Control Console",
        description: "Multi-screen hardened operator interface with real-time beam profile monitors and SCADA integration.",
        material: "darkSteel/glass",
        function: "Allows physicists to tune the RF frequency, magnetic field strength, and monitor vault radiation levels safely.",
        assemblyOrder: 19,
        connections: ["Telemetry Data Bus", "Safety Interlock System"],
        failureEffect: "Operator blindness, inability to shut down or tune the machine safely during an anomaly.",
        cascadeFailures: ["Automated Scram System Trigger", "Loss of Experiment Data"],
        originalPosition: {x: -20, y: 1.75, z: 22},
        explodedPosition: {x: -40, y: 1.75, z: 45}
    });

    const description = "The Cyclotron Accelerator is a massive, hyper-complex machine designed to accelerate charged particles outwards from the center along a spiral path. It utilizes a 2.5 Tesla static magnetic field generated by liquid-helium cooled superconducting coils, and a rapidly varying multi-megavolt high-frequency electric field within the RF Dees. This highly detailed model features a realistic iron yoke structure, internal RF cavities, an intricate high-vacuum beam extraction line with quadrupole focusing magnets, turbo-molecular pumps spinning at 90,000 RPM, and a complex multi-port target scattering chamber.";

    const quizQuestions = [
        {
            question: "What is the primary function of the RF Cavities (Dees) in a cyclotron?",
            options: [
                "To bend the particles in a circular path using magnetism.",
                "To apply a rapidly oscillating electric field to accelerate the particles across a gap.",
                "To physically pump air out of the chamber.",
                "To cool down the superconducting coils to 4 Kelvin."
            ],
            correctAnswer: 1,
            explanation: "The Dees provide the alternating high-voltage electric field that kicks and accelerates the particles every time they cross the gap between them, increasing their kinetic energy."
        },
        {
            question: "Why is an ultra-high vacuum (10^-9 Torr) absolutely necessary in the main chamber and beamline?",
            options: [
                "To prevent the magnetic field from escaping into the room.",
                "To keep the superconducting coils cold.",
                "To prevent the relativistic particles from colliding with air molecules, which causes scattering and radiation.",
                "To increase the relativistic mass of the particles artificially."
            ],
            correctAnswer: 2,
            explanation: "If the particles hit air molecules, they scatter, lose their kinetic energy, and produce unwanted secondary radiation, destroying the beam's precise integrity."
        },
        {
            question: "What role do the Quadrupole Focusing Magnets play along the beamline?",
            options: [
                "They generate the main 2.5 Tesla static field for the cyclotron.",
                "They spin at 90,000 RPM to create a vacuum.",
                "They act as alternating gradient lenses to actively squeeze and keep the particle beam tightly focused.",
                "They rotate the target foil to prevent it from melting."
            ],
            correctAnswer: 2,
            explanation: "Quadrupole magnets focus the beam in one plane while defocusing in the perpendicular plane; alternating them produces a net strong focusing effect, keeping the beam strictly confined within the pipe."
        },
        {
            question: "What is the catastrophic consequence of a 'thermal quench' in the Superconducting Coils?",
            options: [
                "The beam suddenly accelerates to light speed.",
                "The liquid helium boils explosively, and the immense magnetic field is suddenly and violently lost.",
                "The turbo-molecular pumps speed up excessively.",
                "The RF generator produces infinitely more power."
            ],
            correctAnswer: 1,
            explanation: "A quench occurs when a microscopic part of the superconducting coil warms up and becomes resistive. The massive stored magnetic energy converts to heat instantly, violently boiling the coolant and dropping the magnetic field."
        },
        {
            question: "Why does the Target Manipulator constantly rotate the gold target foil?",
            options: [
                "To generate electricity to power the diagnostic console.",
                "To align the atomic lattice with the Earth's magnetic field.",
                "To distribute the intense multi-kilowatt heat of the particle beam over a larger area, preventing immediate localized melting.",
                "To create a tighter vacuum seal around the chamber."
            ],
            correctAnswer: 2,
            explanation: "The particle beam deposits a massive amount of energy into a very small, sub-millimeter spot. Rapidly rotating the target spreads this extreme heat load, preventing the thin foil from vaporizing instantly."
        }
    ];

    let timeAcc = 0;

    function animate(time, speed, activeMeshes) {
        timeAcc += speed * 0.03;
        
        // 1. Pulsing the central ion plasma (High frequency)
        if (activeMeshes.ionPlasma) {
            activeMeshes.ionPlasma.scale.setScalar(1 + Math.sin(timeAcc * 15) * 0.15);
            activeMeshes.ionPlasma.rotation.x += speed * 0.1;
            activeMeshes.ionPlasma.rotation.y += speed * 0.15;
        }

        // 2. Rotating turbo-molecular pumps at extreme speed
        if (activeMeshes.pump1) activeMeshes.pump1.children[0].rotation.y += speed * 0.8;
        if (activeMeshes.pump2) activeMeshes.pump2.children[0].rotation.y += speed * 0.8;

        // 3. Rotating target manipulator
        if (activeMeshes.manipulator) {
            activeMeshes.manipulator.rotation.y += speed * 0.08;
        }

        // 4. Oscillating RF Dees (subtle visual vibration to indicate high power RF)
        if (activeMeshes.dee1 && activeMeshes.dee2) {
            activeMeshes.dee1.position.z = -0.6 + Math.sin(timeAcc * 30) * 0.03;
            activeMeshes.dee2.position.z = 0.6 - Math.sin(timeAcc * 30) * 0.03;
        }

        // 5. Sequential Pulsing Quadrupole magnet coils (Traveling wave effect)
        if (activeMeshes.quadMagnets) {
            activeMeshes.quadMagnets.forEach((q, index) => {
                const staggeredGlow = 1.5 + Math.sin(timeAcc * 8 - index * 1.5) * 1.2;
                q.material.emissiveIntensity = staggeredGlow;
                q.scale.setScalar(1 + Math.sin(timeAcc * 12 - index) * 0.06);
            });
        }

        // 6. Particle Beam ultra-fast flow effect (opacity / scale pulsation)
        if (activeMeshes.particleBeam) {
            activeMeshes.particleBeam.material.emissiveIntensity = 2.5 + Math.random() * 2.5;
            activeMeshes.particleBeam.scale.y = 1 + Math.sin(timeAcc * 80) * 0.4;
            activeMeshes.particleBeam.scale.z = 1 + Math.cos(timeAcc * 80) * 0.4;
        }

        // 7. Screen flickering and data scrolling on the operator console
        for(let i=0; i<4; i++) {
            if (activeMeshes['screen'+i]) {
                activeMeshes['screen'+i].material.emissiveIntensity = 1.2 + Math.random() * 0.8;
            }
        }

        // 8. Hydraulic lift pressure breathing (simulating intense load maintaining yoke position)
        if (activeMeshes.hydraulics) {
            activeMeshes.hydraulics.children.forEach((hGroup, idx) => {
                const inner = hGroup.children[1];
                inner.position.y = 12 + Math.sin(timeAcc * 0.8 + idx) * 0.15;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createCyclotronAccelerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
