import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import * as THREE from 'three';

/**
 * =====================================================================================================================
 * ULTRA GOD TIER ALCUBIERRE WARP BUBBLE GENERATOR
 * =====================================================================================================================
 * 
 * THEORETICAL FOUNDATION:
 * The Alcubierre metric defines a spacetime that allows superluminal travel within the framework of General Relativity.
 * The metric is given by:
 * ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2
 * where v_s is the velocity of the spacecraft, and f(r_s) is the shaping function that determines the geometry of the warp bubble.
 * 
 * Arnowitt-Deser-Misner (ADM) Formalism:
 * The 3+1 decomposition of the spacetime reveals that the Eulerian observers (moving orthogonally to the spacelike hypersurfaces)
 * measure an energy density that violates the Weak Energy Condition (WEC). Specifically, the energy density is given by:
 * T^{00} = - (v_s^2 / (8 * pi * G)) * (df/dr_s)^2 * (y^2 + z^2) / r_s^2
 * This requires a massive amount of negative energy (exotic matter).
 * 
 * York Time and Expansion:
 * The trace of the extrinsic curvature (York Time) is proportional to the expansion scalar theta.
 * theta = v_s * (x / r_s) * (df/dr_s)
 * This shows that spacetime expands behind the ship (theta > 0) and contracts in front of it (theta < 0).
 * 
 * This simulation generates a hyper-detailed, God-Tier visualization of the machine required to produce and survive 
 * these spacetime geometries, complete with exotic matter containment rings, Casimir effect capacitors, and relativistic shielding.
 * =====================================================================================================================
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const activeNodes = [];
    const spinningRings = [];
    const pulsingMaterials = [];
    const powerLines = [];
    
    // ------------------------------------------------------------------------------------------------
    // CUSTOM EXOTIC MATERIALS (God Tier Visuals)
    // ------------------------------------------------------------------------------------------------
    
    const exoticMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x6600ff,
        emissive: 0x4400cc,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.85,
        transmission: 0.9,
        roughness: 0.05,
        metalness: 1.0,
        wireframe: true,
        side: THREE.DoubleSide
    });
    pulsingMaterials.push(exoticMatterMat);

    const containmentFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.4,
        transmission: 1.0,
        ior: 1.3,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    pulsingMaterials.push(containmentFieldMat);

    const warpBoundaryMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x2288ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.15,
        transmission: 1.0,
        ior: 1.1,
        roughness: 0.0,
        metalness: 0.2,
        wireframe: true,
        side: THREE.BackSide
    });

    const superheatedPlasmaMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    pulsingMaterials.push(superheatedPlasmaMat);

    const ultraDarkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.4,
        emissive: 0x000000
    });

    const glowingCircuitMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff44,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // ------------------------------------------------------------------------------------------------
    // HELPER FUNCTIONS FOR MASSIVE PROCEDURAL GENERATION
    // ------------------------------------------------------------------------------------------------
    
    function createComplexPart(name, description, material, func, order, conns, fail, cascade, origPos, explPos, buildFn) {
        const meshGroup = new THREE.Group();
        buildFn(meshGroup);
        
        meshGroup.name = name;
        meshGroup.description = description;
        meshGroup.material = material;
        meshGroup.function = func;
        meshGroup.assemblyOrder = order;
        meshGroup.connections = conns;
        meshGroup.failureEffect = fail;
        meshGroup.cascadeFailures = cascade;
        meshGroup.originalPosition = origPos;
        meshGroup.explodedPosition = explPos;
        
        parts.push(meshGroup);
        group.add(meshGroup);
        
        meshGroup.position.set(origPos.x, origPos.y, origPos.z);
        
        return meshGroup;
    }

    function createPowerConduit(parent, p1, p2, c1, c2, radius, mat) {
        const curve = new THREE.CubicBezierCurve3(p1, c1, c2, p2);
        const tubeGeom = new THREE.TubeGeometry(curve, 64, radius, 12, false);
        const tube = new THREE.Mesh(tubeGeom, mat);
        parent.add(tube);
        return tube;
    }

    function createHydraulicActuator(parent, startPoint, endPoint, radius) {
        const distance = startPoint.distanceTo(endPoint);
        const dir = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
        
        const outerGeom = new THREE.CylinderGeometry(radius, radius, distance * 0.6, 16);
        const innerGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, distance * 0.5, 16);
        
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        const inner = new THREE.Mesh(innerGeom, chrome);
        
        outer.position.copy(startPoint).add(dir.clone().multiplyScalar(distance * 0.3));
        inner.position.copy(endPoint).sub(dir.clone().multiplyScalar(distance * 0.25));
        
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        outer.quaternion.copy(quaternion);
        inner.quaternion.copy(quaternion);
        
        parent.add(outer);
        parent.add(inner);
    }

    // ------------------------------------------------------------------------------------------------
    // PART DEFINITIONS (1-30) - EXTREMELY DETAILED
    // ------------------------------------------------------------------------------------------------
    
    // 1. Central Core Hull
    createComplexPart(
        "Central_Quantum_Reactor_Core",
        "The primary hull housing the zero-point energy tap and ADM-formalism metric calculators.",
        "ultraDarkMetalMat / steel",
        "Generates the immense power required to sustain the exotic matter rings.",
        1,
        ["Cockpit_Module", "Primary_Struts", "Exhaust_Manifold"],
        "Immediate localized vacuum decay.",
        ["Collapse of the warp bubble", "Spaghettification of crew", "Supernova-scale energy release"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0},
        (g) => {
            const hullPoints = [];
            hullPoints.push(new THREE.Vector2(0, 150));
            hullPoints.push(new THREE.Vector2(2, 145));
            for (let i = 0; i <= 40; i++) {
                const t = i / 40;
                hullPoints.push(new THREE.Vector2(5 + Math.sin(t * Math.PI) * 15, 140 - t * 100));
            }
            for (let i = 0; i <= 60; i++) {
                const t = i / 60;
                hullPoints.push(new THREE.Vector2(20 + Math.cos(t * Math.PI) * 10, 40 - t * 120));
            }
            hullPoints.push(new THREE.Vector2(10, -80));
            hullPoints.push(new THREE.Vector2(0, -80));
            
            const hullGeom = new THREE.LatheGeometry(hullPoints, 128);
            const hull = new THREE.Mesh(hullGeom, ultraDarkMetalMat);
            g.add(hull);

            for (let j = 0; j < 8; j++) {
                const circuit = new THREE.Mesh(hullGeom.clone(), glowingCircuitMat);
                circuit.scale.set(1.01, 1.01, 1.01);
                circuit.rotation.y = j * Math.PI / 4;
                g.add(circuit);
            }
        }
    );

    // 2. Forward Command Sphere (Cockpit)
    createComplexPart(
        "Forward_Command_Sphere",
        "Reinforced bridge module encased in hyper-dense tinted transparent aluminum.",
        "tinted / chrome",
        "Houses the crew and navigational computers outside the primary radiation flux.",
        2,
        ["Central_Quantum_Reactor_Core", "Sensor_Phased_Array"],
        "Crew exposed to blueshifted cosmic rays.",
        ["Instant biological vaporization", "Loss of ship control"],
        {x: 0, y: 155, z: 0},
        {x: 0, y: 300, z: 0},
        (g) => {
            const sphereGeom = new THREE.SphereGeometry(12, 64, 64);
            const sphere = new THREE.Mesh(sphereGeom, tinted);
            g.add(sphere);

            const floorGeom = new THREE.CylinderGeometry(11, 11, 1, 32);
            const floor = new THREE.Mesh(floorGeom, darkSteel);
            floor.position.y = -5;
            g.add(floor);

            for (let i = 0; i < 3; i++) {
                const seatGeom = new THREE.BoxGeometry(2, 4, 2);
                const seat = new THREE.Mesh(seatGeom, rubber);
                seat.position.set((i-1)*4, -3, -3);
                g.add(seat);
            }
        }
    );

    // 3. Exotic Matter Primary Ring
    const ring1 = createComplexPart(
        "Exotic_Matter_Primary_Ring",
        "Massive toroidal structure filled with circulating negative energy to induce spacetime contraction.",
        "exoticMatterMat",
        "Violates the weak energy condition locally to create the forward warp gradient.",
        3,
        ["Radial_Support_Struts_Primary", "Magnetic_Confinement_Coils_Alpha"],
        "Loss of forward contraction.",
        ["Ship impacts spacetime barrier", "Catastrophic deceleration blast"],
        {x: 0, y: 50, z: 0},
        {x: 200, y: 150, z: 200},
        (g) => {
            const geom = new THREE.TorusGeometry(120, 15, 128, 256);
            const mesh = new THREE.Mesh(geom, exoticMatterMat);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );
    spinningRings.push({ mesh: ring1, speed: 0.5, axis: 'y' });

    // 4. Exotic Matter Secondary Ring
    const ring2 = createComplexPart(
        "Exotic_Matter_Secondary_Ring",
        "Mid-level toroidal structure stabilizing the York time zero-point differential.",
        "exoticMatterMat",
        "Maintains the zero-expansion scalar interior region.",
        4,
        ["Radial_Support_Struts_Secondary", "Magnetic_Confinement_Coils_Beta"],
        "Interior bubble collapse.",
        ["Extreme tidal forces rip ship apart"],
        {x: 0, y: -20, z: 0},
        {x: -200, y: 0, z: 200},
        (g) => {
            const geom = new THREE.TorusGeometry(160, 20, 128, 256);
            const mesh = new THREE.Mesh(geom, exoticMatterMat);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );
    spinningRings.push({ mesh: ring2, speed: -0.7, axis: 'y' });

    // 5. Exotic Matter Tertiary Ring
    const ring3 = createComplexPart(
        "Exotic_Matter_Tertiary_Ring",
        "Aft toroidal structure handling the violent spacetime expansion wake.",
        "exoticMatterMat",
        "Pushes spacetime outward behind the ship.",
        5,
        ["Radial_Support_Struts_Tertiary", "Magnetic_Confinement_Coils_Gamma"],
        "Aft drag coefficient approaches infinity.",
        ["Warp field snaps backward", "Ship is stretched into a singularity"],
        {x: 0, y: -90, z: 0},
        {x: 0, y: -250, z: -200},
        (g) => {
            const geom = new THREE.TorusGeometry(120, 15, 128, 256);
            const mesh = new THREE.Mesh(geom, exoticMatterMat);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );
    spinningRings.push({ mesh: ring3, speed: 0.9, axis: 'y' });

    // 6. Magnetic Confinement Coils Alpha
    createComplexPart(
        "Magnetic_Confinement_Coils_Alpha",
        "Superconducting TorusKnots preventing the exotic matter from annihilating with the hull.",
        "copper",
        "Containment of negative energy.",
        6,
        ["Exotic_Matter_Primary_Ring"],
        "Exotic matter breach.",
        ["Hull disintegration"],
        {x: 0, y: 50, z: 0},
        {x: 250, y: 200, z: 250},
        (g) => {
            const geom = new THREE.TorusKnotGeometry(120, 5, 256, 32, 15, 3);
            const mesh = new THREE.Mesh(geom, copper);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );

    // 7. Magnetic Confinement Coils Beta
    createComplexPart(
        "Magnetic_Confinement_Coils_Beta",
        "Superconducting TorusKnots for the secondary ring.",
        "copper",
        "Containment of negative energy.",
        7,
        ["Exotic_Matter_Secondary_Ring"],
        "Exotic matter breach.",
        ["Hull disintegration"],
        {x: 0, y: -20, z: 0},
        {x: -250, y: 0, z: 250},
        (g) => {
            const geom = new THREE.TorusKnotGeometry(160, 6, 256, 32, 21, 4);
            const mesh = new THREE.Mesh(geom, copper);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );

    // 8. Magnetic Confinement Coils Gamma
    createComplexPart(
        "Magnetic_Confinement_Coils_Gamma",
        "Superconducting TorusKnots for the tertiary ring.",
        "copper",
        "Containment of negative energy.",
        8,
        ["Exotic_Matter_Tertiary_Ring"],
        "Exotic matter breach.",
        ["Hull disintegration"],
        {x: 0, y: -90, z: 0},
        {x: 0, y: -300, z: -250},
        (g) => {
            const geom = new THREE.TorusKnotGeometry(120, 5, 256, 32, 15, 3);
            const mesh = new THREE.Mesh(geom, copper);
            mesh.rotation.x = Math.PI / 2;
            g.add(mesh);
        }
    );

    // 9, 10, 11: Radial Support Struts
    const strutData = [
        { name: "Radial_Support_Struts_Primary", y: 50, r: 120, count: 12, expl: {x: 100, y: 100, z: 100} },
        { name: "Radial_Support_Struts_Secondary", y: -20, r: 160, count: 16, expl: {x: -100, y: -50, z: 100} },
        { name: "Radial_Support_Struts_Tertiary", y: -90, r: 120, count: 12, expl: {x: 0, y: -150, z: -100} },
    ];

    strutData.forEach((sd, index) => {
        createComplexPart(
            sd.name,
            `Heavy structural pylons transferring kinetic sheer stress from the ${sd.name.split('_').pop()} ring to the hull.`,
            "steel",
            "Structural integrity against infinite sheer.",
            9 + index,
            ["Central_Quantum_Reactor_Core", `Exotic_Matter_${sd.name.split('_').pop()}_Ring`],
            "Ring detachment.",
            ["Warp bubble asymmetry", "Ship sheared in half"],
            {x: 0, y: sd.y, z: 0},
            sd.expl,
            (g) => {
                for (let i = 0; i < sd.count; i++) {
                    const theta = (i / sd.count) * Math.PI * 2;
                    const strutGeom = new THREE.BoxGeometry(sd.r - 20, 4, 10);
                    const strut = new THREE.Mesh(strutGeom, steel);
                    strut.position.set(Math.cos(theta) * (sd.r/2 + 10), 0, Math.sin(theta) * (sd.r/2 + 10));
                    strut.rotation.y = -theta;
                    g.add(strut);
                    
                    const p1 = new THREE.Vector3(Math.cos(theta)*20, 5, Math.sin(theta)*20);
                    const p2 = new THREE.Vector3(Math.cos(theta)*sd.r, 5, Math.sin(theta)*sd.r);
                    const c1 = new THREE.Vector3(Math.cos(theta)*40, 20, Math.sin(theta)*40);
                    const c2 = new THREE.Vector3(Math.cos(theta)*(sd.r-20), 20, Math.sin(theta)*(sd.r-20));
                    createPowerConduit(g, p1, p2, c1, c2, 1.5, rubber);
                }
            }
        );
    });

    // 12. Spacetime Metric Contractor Array
    createComplexPart(
        "Spacetime_Metric_Contractor_Array",
        "Forward facing parabolic dish projecting the Alcubierre shaping function.",
        "chrome",
        "Focuses the negative energy density ahead of the ship.",
        12,
        ["Forward_Command_Sphere"],
        "Loss of forward focus.",
        ["Warp barrier collapse"],
        {x: 0, y: 130, z: 0},
        {x: 0, y: 400, z: 0},
        (g) => {
            const dishGeom = new THREE.SphereGeometry(30, 64, 16, 0, Math.PI * 2, 0, Math.PI / 3);
            const dish = new THREE.Mesh(dishGeom, chrome);
            dish.rotation.x = Math.PI;
            g.add(dish);
            
            const antenna = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.1, 40, 16), copper);
            antenna.position.y = 20;
            g.add(antenna);
        }
    );

    // 13. Spacetime Metric Expander Array
    createComplexPart(
        "Spacetime_Metric_Expander_Array",
        "Aft facing parabolic dish reversing the shaping function.",
        "chrome",
        "Expands spacetime behind the ship.",
        13,
        ["Central_Quantum_Reactor_Core"],
        "Loss of aft expansion.",
        ["Infinite deceleration", "Ship crushed by returning spacetime"],
        {x: 0, y: -100, z: 0},
        {x: 0, y: -400, z: 0},
        (g) => {
            const dishGeom = new THREE.SphereGeometry(40, 64, 16, 0, Math.PI * 2, 0, Math.PI / 3);
            const dish = new THREE.Mesh(dishGeom, chrome);
            g.add(dish);
        }
    );

    // 14. Zero Point Energy Capacitors
    createComplexPart(
        "Zero_Point_Energy_Capacitors",
        "Banks of massive cylindrical capacitors storing vacuum energy.",
        "darkSteel",
        "Power buffering for the warp coils.",
        14,
        ["Central_Quantum_Reactor_Core"],
        "Power starvation.",
        ["Warp field stutters", "Spaghettification"],
        {x: 0, y: 10, z: 0},
        {x: 200, y: 0, z: -200},
        (g) => {
            for(let i=0; i<8; i++) {
                const theta = (i / 8) * Math.PI * 2;
                const capGeom = new THREE.CylinderGeometry(5, 5, 40, 32);
                const cap = new THREE.Mesh(capGeom, darkSteel);
                cap.position.set(Math.cos(theta)*25, 0, Math.sin(theta)*25);
                g.add(cap);
                
                const capTop = new THREE.Mesh(new THREE.TorusGeometry(5, 1, 16, 32), copper);
                capTop.position.copy(cap.position);
                capTop.position.y += 20;
                capTop.rotation.x = Math.PI/2;
                g.add(capTop);
            }
        }
    );

    // 15. Casimir Effect Cavity Plates
    createComplexPart(
        "Casimir_Effect_Cavity_Plates",
        "Micro-spaced parallel conductive plates generating negative energy via quantum vacuum exclusion.",
        "aluminum",
        "Generates the exotic matter.",
        15,
        ["Zero_Point_Energy_Capacitors"],
        "Positive energy spike.",
        ["Explosive annihilation of the warp bubble"],
        {x: 0, y: -50, z: 0},
        {x: -200, y: -50, z: -200},
        (g) => {
            for(let i=0; i<16; i++) {
                const theta = (i / 16) * Math.PI * 2;
                const plateGroup = new THREE.Group();
                for(let j=0; j<10; j++) {
                    const plate = new THREE.Mesh(new THREE.BoxGeometry(10, 30, 0.5), aluminum);
                    plate.position.z = j * 1;
                    plateGroup.add(plate);
                }
                plateGroup.position.set(Math.cos(theta)*30, 0, Math.sin(theta)*30);
                plateGroup.rotation.y = -theta;
                g.add(plateGroup);
            }
        }
    );

    // 16. Superconducting Cooling Fins
    createComplexPart(
        "Superconducting_Cooling_Fins",
        "Massive radiator arrays dissipating the intense heat of the zero-point tap.",
        "steel",
        "Thermal management.",
        16,
        ["Central_Quantum_Reactor_Core"],
        "Core meltdown.",
        ["Ship vaporized"],
        {x: 0, y: 80, z: 0},
        {x: 0, y: 100, z: 300},
        (g) => {
            for(let i=0; i<32; i++) {
                const theta = (i / 32) * Math.PI * 2;
                const finGeom = new THREE.BoxGeometry(20, 60, 1);
                const fin = new THREE.Mesh(finGeom, steel);
                fin.position.set(Math.cos(theta)*25, 0, Math.sin(theta)*25);
                fin.rotation.y = -theta;
                g.add(fin);
            }
        }
    );

    // 17. Tachyon Sensor Suite
    createComplexPart(
        "Tachyon_Sensor_Suite",
        "Faster-than-light sensory arrays for navigating outside the causality cone.",
        "glass / copper",
        "Provides telemetry from outside the forward warp wall.",
        17,
        ["Forward_Command_Sphere"],
        "Blind navigation.",
        ["Collision with a star at 1000c"],
        {x: 0, y: 165, z: 0},
        {x: 0, y: 500, z: 0},
        (g) => {
            const mastGeom = new THREE.CylinderGeometry(0.5, 2, 30, 16);
            const mast = new THREE.Mesh(mastGeom, darkSteel);
            mast.position.y = 15;
            g.add(mast);

            for(let i=0; i<4; i++) {
                const dishGeom = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI, 0, Math.PI);
                const dish = new THREE.Mesh(dishGeom, glass);
                dish.position.y = 25;
                dish.rotation.x = Math.PI/2;
                dish.rotation.y = (i/4) * Math.PI * 2;
                dish.position.x = Math.cos(dish.rotation.y) * 4;
                dish.position.z = Math.sin(dish.rotation.y) * 4;
                g.add(dish);
            }
        }
    );

    // 18. Warp Bubble Interferometer
    createComplexPart(
        "Warp_Bubble_Interferometer",
        "Laser-based monitoring system measuring the precise topology of the spacetime bubble.",
        "chrome",
        "Prevents asymmetrical bubble collapse.",
        18,
        ["Central_Quantum_Reactor_Core"],
        "Topology distortion undetected.",
        ["Shearing of the port or starboard hull"],
        {x: 0, y: -70, z: 0},
        {x: 0, y: -200, z: 300},
        (g) => {
            const ringGeom = new THREE.TorusGeometry(35, 1, 32, 64);
            const ring = new THREE.Mesh(ringGeom, chrome);
            ring.rotation.x = Math.PI/2;
            g.add(ring);
            
            for(let i=0; i<6; i++) {
                const node = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), glowingCircuitMat);
                const theta = (i/6)*Math.PI*2;
                node.position.set(Math.cos(theta)*35, 0, Math.sin(theta)*35);
                g.add(node);
            }
        }
    );

    // 19. Forward Blueshift Radiation Shield
    createComplexPart(
        "Forward_Blueshift_Radiation_Shield",
        "Extremely dense plasma shielding designed to absorb Hawking-like radiation from the forward wall.",
        "superheatedPlasmaMat",
        "Prevents crew incineration by blueshifted CMB photons.",
        19,
        ["Forward_Command_Sphere"],
        "Lethal gamma ray dosage.",
        ["Immediate crew death"],
        {x: 0, y: 150, z: 0},
        {x: 0, y: 450, z: 100},
        (g) => {
            const shieldGeom = new THREE.SphereGeometry(25, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
            const shield = new THREE.Mesh(shieldGeom, superheatedPlasmaMat);
            g.add(shield);
        }
    );

    // 20. Aft Redshift Thermal Radiators
    createComplexPart(
        "Aft_Redshift_Thermal_Radiators",
        "Massive glowing panels venting exotic heat into the expanding spacetime wake.",
        "superheatedPlasmaMat",
        "Prevents aft fusion from thermal backup.",
        20,
        ["Spacetime_Metric_Expander_Array"],
        "Aft meltdown.",
        ["Loss of aft expansion scalar"],
        {x: 0, y: -110, z: 0},
        {x: 0, y: -500, z: -100},
        (g) => {
            for(let i=0; i<6; i++) {
                const theta = (i/6)*Math.PI*2;
                const panelGeom = new THREE.BoxGeometry(20, 2, 40);
                const panel = new THREE.Mesh(panelGeom, superheatedPlasmaMat);
                panel.position.set(Math.cos(theta)*30, 0, Math.sin(theta)*30);
                panel.lookAt(new THREE.Vector3(0,0,0));
                g.add(panel);
            }
        }
    );

    // 21. Navigation Gyros and Inertial Dampeners
    createComplexPart(
        "Navigation_Gyros_and_Inertial_Dampeners",
        "Enormous mechanical gyroscopes countering the torques induced by asymmetrical metric variations.",
        "steel / copper",
        "Keeps the ship pointing straight inside the bubble.",
        21,
        ["Central_Quantum_Reactor_Core"],
        "Uncontrollable spin.",
        ["Nausea", "Ship thrown into the bubble wall"],
        {x: 0, y: -30, z: 0},
        {x: 300, y: -100, z: 0},
        (g) => {
            const frame = new THREE.Mesh(new THREE.TorusGeometry(15, 2, 32, 64), steel);
            const gyro1 = new THREE.Mesh(new THREE.TorusGeometry(12, 1.5, 32, 64), copper);
            const gyro2 = new THREE.Mesh(new THREE.TorusGeometry(9, 1, 32, 64), darkSteel);
            gyro1.rotation.x = Math.PI/2;
            gyro2.rotation.y = Math.PI/2;
            g.add(frame);
            g.add(gyro1);
            g.add(gyro2);
            spinningRings.push({ mesh: gyro1, speed: 5.0, axis: 'x' });
            spinningRings.push({ mesh: gyro2, speed: 7.0, axis: 'y' });
            spinningRings.push({ mesh: frame, speed: 1.0, axis: 'z' });
        }
    );

    // 22. Relativistic Particle Deflectors
    createComplexPart(
        "Relativistic_Particle_Deflectors",
        "Electromagnetic field emitters for sweeping interstellar dust out of the ship's path before engaging warp.",
        "chrome",
        "Reduces the intensity of the deceleration blast.",
        22,
        ["Forward_Command_Sphere"],
        "Massive dust buildup on the forward wall.",
        ["Destination planet incinerated by plasma blast on arrival"],
        {x: 0, y: 140, z: 0},
        {x: -150, y: 350, z: -150},
        (g) => {
            for(let i=0; i<4; i++) {
                const theta = (i/4)*Math.PI*2;
                const defl = new THREE.Mesh(new THREE.CylinderGeometry(2, 5, 20, 16), chrome);
                defl.position.set(Math.cos(theta)*15, 0, Math.sin(theta)*15);
                defl.rotation.x = Math.PI/2;
                defl.lookAt(new THREE.Vector3(0, 50, 0));
                g.add(defl);
            }
        }
    );

    // 23. Emergency Warp Decoupler
    createComplexPart(
        "Emergency_Warp_Decoupler",
        "Explosive bolts and field disrupters to instantly collapse the bubble and jettison the reactor.",
        "darkSteel / plastic",
        "Last resort survival mechanism.",
        23,
        ["Central_Quantum_Reactor_Core"],
        "Decoupler failure.",
        ["Total loss of crew and ship"],
        {x: 0, y: 100, z: 0},
        {x: 200, y: 200, z: -200},
        (g) => {
            const collar = new THREE.Mesh(new THREE.TorusGeometry(18, 3, 32, 64), darkSteel);
            collar.rotation.x = Math.PI/2;
            g.add(collar);
            for(let i=0; i<12; i++) {
                const bolt = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), plastic);
                const theta = (i/12)*Math.PI*2;
                bolt.position.set(Math.cos(theta)*18, 0, Math.sin(theta)*18);
                g.add(bolt);
            }
        }
    );

    // 24. Bubble Boundary Field Projector
    createComplexPart(
        "Bubble_Boundary_Field_Projector",
        "The absolute exterior shell. A visual representation of the Alcubierre metric boundary where spacetime is flat outside, but fiercely curved at the threshold.",
        "warpBoundaryMat",
        "Defines the volume of causally disconnected spacetime.",
        24,
        ["All Systems"],
        "Bubble collapse.",
        ["Ship reverts to normal space instantly"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}, 
        (g) => {
            const boundaryGeom = new THREE.IcosahedronGeometry(250, 4);
            const boundary = new THREE.Mesh(boundaryGeom, warpBoundaryMat);
            g.add(boundary);
            spinningRings.push({ mesh: boundary, speed: 0.1, axis: 'y' });
        }
    );

    // ------------------------------------------------------------------------------------------------
    // PROCEDURAL PIPING AND HYDRAULICS BINDING IT ALL TOGETHER
    // ------------------------------------------------------------------------------------------------
    
    const pipingGroup = new THREE.Group();
    group.add(pipingGroup);
    
    for(let i=0; i<24; i++) {
        const theta = (i/24)*Math.PI*2;
        
        createPowerConduit(
            pipingGroup,
            new THREE.Vector3(Math.cos(theta)*10, 50, Math.sin(theta)*10),
            new THREE.Vector3(Math.cos(theta)*120, 50, Math.sin(theta)*120),
            new THREE.Vector3(Math.cos(theta)*40, 100, Math.sin(theta)*40),
            new THREE.Vector3(Math.cos(theta)*90, 80, Math.sin(theta)*90),
            0.8,
            rubber
        );

        createPowerConduit(
            pipingGroup,
            new THREE.Vector3(Math.cos(theta)*15, -20, Math.sin(theta)*15),
            new THREE.Vector3(Math.cos(theta)*160, -20, Math.sin(theta)*160),
            new THREE.Vector3(Math.cos(theta)*50, -50, Math.sin(theta)*50),
            new THREE.Vector3(Math.cos(theta)*120, -50, Math.sin(theta)*120),
            1.2,
            chrome
        );

        createPowerConduit(
            pipingGroup,
            new THREE.Vector3(Math.cos(theta)*10, -90, Math.sin(theta)*10),
            new THREE.Vector3(Math.cos(theta)*120, -90, Math.sin(theta)*120),
            new THREE.Vector3(Math.cos(theta)*40, -120, Math.sin(theta)*40),
            new THREE.Vector3(Math.cos(theta)*90, -110, Math.sin(theta)*90),
            0.8,
            rubber
        );
    }

    for(let i=0; i<8; i++) {
        const theta = (i/8)*Math.PI*2;
        createHydraulicActuator(
            pipingGroup,
            new THREE.Vector3(Math.cos(theta)*15, 120, Math.sin(theta)*15),
            new THREE.Vector3(Math.cos(theta)*25, 130, Math.sin(theta)*25),
            2
        );
    }

    // ------------------------------------------------------------------------------------------------
    // SPACETIME DISTORTION LATTICE (The visual representation of the metric)
    // ------------------------------------------------------------------------------------------------
    
    const latticeGroup = new THREE.Group();
    group.add(latticeGroup);
    
    const latticeMaterial = new THREE.LineBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const grids = [];
    const numGrids = 7;
    for(let i=0; i<numGrids; i++) {
        const yPos = -150 + i * 50;
        const gridHelper = new THREE.GridHelper(600, 60, 0x0055ff, 0x002288);
        gridHelper.material = latticeMaterial;
        gridHelper.position.y = yPos;
        
        const posAttr = gridHelper.geometry.attributes.position;
        gridHelper.userData.originalPositions = new Float32Array(posAttr.array);
        gridHelper.userData.baseY = yPos;
        
        latticeGroup.add(gridHelper);
        grids.push(gridHelper);
    }

    // ------------------------------------------------------------------------------------------------
    // PHD-LEVEL QUIZ QUESTIONS
    // ------------------------------------------------------------------------------------------------
    
    const quizQuestions = [
        {
            question: "In the framework of the Alcubierre warp drive metric, the energy-momentum tensor evaluated for an Eulerian observer requires negative energy density. What specific quantum mechanical phenomenon is universally cited as the only known physical mechanism capable of producing such localized negative energy densities, and how does it achieve this?",
            options: [
                "The Casimir Effect: restricting the allowed modes of vacuum fluctuations between two uncharged, parallel conductive plates, resulting in a region where the vacuum energy density is lower than the zero-point energy of the surrounding free space.",
                "Hawking Radiation: emitting virtual particle pairs at the event horizon of a micro-black hole, draining its mass-energy.",
                "Cherenkov Radiation: accelerating particles beyond the local phase velocity of light in a dielectric medium.",
                "The Meissner Effect: expulsion of a magnetic field from a superconductor during its transition to the superconducting state."
            ],
            correctAnswer: 0,
            explanation: "The Casimir effect demonstrates that the quantum vacuum is not empty but filled with fluctuating fields. By placing plates very close together, certain long-wavelength modes are excluded, making the energy density between the plates less than that of the standard vacuum, resulting in negative energy density relative to the zero-point baseline. This satisfies the strict requirements for the Alcubierre metric's weak energy condition violation."
        },
        {
            question: "The Alcubierre metric, ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2, relies on a shaping function f(r_s) that transitions from 1 inside the bubble to 0 outside. What is the physical significance of the derivative of this function, df/dr_s, approaching infinity at the bubble wall, and what catastrophic hazard does this pose?",
            options: [
                "It indicates infinite time dilation, meaning the crew will freeze in time.",
                "An infinite or near-infinite gradient creates immense tidal forces (infinite shear) at the boundary. Any ordinary matter crossing this boundary would be subjected to spaghettification and vaporized.",
                "It causes the negative energy to convert into positive energy, instantly detonating the ship.",
                "It implies the ship's mass becomes infinite, requiring infinite energy to sustain the warp bubble."
            ],
            correctAnswer: 1,
            explanation: "The gradient of the shaping function df/dr_s determines the 'steepness' of the warp bubble's walls. If this transition is too sharp (approaching infinity), the tidal forces experienced by any object spanning that boundary will be infinite, ripping it apart at the subatomic level due to infinite sheer stress."
        },
        {
            question: "Natario (2002) proposed a modified warp drive spacetime where the expansion scalar theta is identically zero everywhere. If spacetime is neither contracting nor expanding in this model, what replaces the Alcubierre mechanism to propel the bubble?",
            options: [
                "A quantum tunneling probability matrix that teleports the ship segment by segment.",
                "A high-frequency gravitational wave emission that 'surfs' the ship forward.",
                "The metric functions like an incompressible fluid flow around an obstacle. The spacetime 'slides' around the bubble, producing infinite shear at the boundary walls but zero volumetric expansion.",
                "The ship rapidly creates and destroys micro-wormholes directly in front of the hull."
            ],
            correctAnswer: 2,
            explanation: "Natario's zero-expansion metric resolves the issue of having massive volumetric expansion/contraction. Instead, it mathematically resembles fluid dynamics, where space flows around the bubble akin to water flowing around an incompressible sphere. This still requires negative energy and results in extreme shear."
        },
        {
            question: "A superluminal Alcubierre drive suffers from a severe causal disconnection problem. The signal velocity inside the bubble is limited to c, but the bubble itself moves at v_s > c. Why does this render the ship unable to steer or deactivate the drive?",
            options: [
                "The negative energy fields disrupt all electromagnetic communications.",
                "Because the ship is moving faster than light relative to the exterior, no signal generated from within the bubble can reach the forward boundary wall to alter the exotic matter distribution. The front of the bubble is outside the forward light cone of the ship.",
                "The ship's computers overheat due to the blueshifted cosmic microwave background radiation.",
                "Time inside the bubble runs backward, causing commands to execute before they are given."
            ],
            correctAnswer: 1,
            explanation: "Because the bubble moves at v_s > c, the leading edge of the warp bubble is moving away from the ship faster than a light-speed signal from the ship can catch up to it. Therefore, an observer inside the bubble cannot send signals to the front to control, steer, or shut off the warp machinery."
        },
        {
            question: "When an Alcubierre drive decelerates at its destination, it is predicted to unleash a devastating burst of radiation. What is the precise physical origin of this 'forward blast' phenomenon?",
            options: [
                "The sudden annihilation of the negative energy with the positive energy of the destination planet.",
                "During transit, the forward wall of the warp bubble sweeps up and traps interstellar dust, gas, and cosmic microwave background photons. These particles become highly blueshifted and are violently discharged in the forward direction upon deceleration.",
                "The kinetic energy of the ship is instantaneously converted into gamma rays.",
                "The warp coils rapidly venting superheated plasma to prevent a core meltdown."
            ],
            correctAnswer: 1,
            explanation: "As the warp bubble traverses interstellar space at superluminal speeds, any particles it encounters are caught in the forward boundary wall. Because of the extreme relativistic speeds, these particles are infinitely blueshifted. When the bubble stops, all this trapped, ultra-high-energy matter is released forward in a cone of lethal radiation, capable of sterilizing a star system."
        }
    ];

    // ------------------------------------------------------------------------------------------------
    // EXTREME ANIMATION LOGIC (God Tier Realism)
    // ------------------------------------------------------------------------------------------------
    
    const description = "The Ultra God Tier Alcubierre Warp Bubble Generator. Employs massive negative energy toroidal rings, Casimir effect capacitors, and ADM-formalism metric contractors to violently curve spacetime. It features extremely realistic relativistic effects, visual spacetime lattice deformation (contraction ahead, expansion behind), and mathematically accurate causal boundary shielding. WARNING: Deceleration may result in planetary sterilization due to blueshifted forward radiation blast.";

    function animate(time, speed, meshes) {
        spinningRings.forEach(item => {
            item.mesh.rotation[item.axis] += speed * item.speed * 0.05;
        });

        const pulse = (Math.sin(time * 3) + 1) * 0.5;
        pulsingMaterials.forEach(mat => {
            if (mat === exoticMatterMat) {
                mat.emissiveIntensity = 4.0 + pulse * 4.0;
            } else if (mat === containmentFieldMat) {
                mat.opacity = 0.3 + pulse * 0.2;
            } else if (mat === superheatedPlasmaMat) {
                mat.emissiveIntensity = 5.0 + Math.random() * 5.0; 
            }
        });

        // =====================================================================
        // SPACETIME METRIC DEFORMATION (The Alcubierre Effect)
        // =====================================================================
        
        const shipRadius = 150; 
        const wallThickness = 50;
        
        grids.forEach(grid => {
            const posAttr = grid.geometry.attributes.position;
            const orig = grid.userData.originalPositions;
            const count = posAttr.count;
            
            for(let i=0; i<count; i++) {
                let x = orig[i*3];
                let y = orig[i*3+1];
                let z = orig[i*3+2];
                
                let trueY = grid.userData.baseY + y;
                let rs = Math.sqrt(x*x + trueY*trueY + z*z);
                
                let warpEffect = 0;
                if (rs > shipRadius - wallThickness && rs < shipRadius + wallThickness) {
                    warpEffect = Math.sin(rs * 0.2 - time * 10) * 15;
                }
                
                let yShift = 0;
                if (rs > shipRadius) {
                    if (trueY > 0) {
                        yShift = -20 * speed * (Math.sin(time*2 + rs*0.01) * 0.5 + 0.5);
                    } else if (trueY < 0) {
                        yShift = -30 * speed * (Math.sin(time*2 + rs*0.01) * 0.5 + 0.5);
                    }
                }
                
                posAttr.setY(i, y + warpEffect + yShift);
            }
            posAttr.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
